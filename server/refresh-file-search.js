#!/usr/bin/env node

/**
 * Nuvio Wiki — Gemini File Search refresh script.
 *
 * File Search storage and query-time embeddings are free. This script checks
 * the wiki every 48 hours and only rebuilds the remote store when the content
 * hash changes. A replacement store is fully indexed before it becomes active.
 *
 * Usage:
 *   node refresh-file-search.js
 *   node refresh-file-search.js --force
 */

import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import {
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  writeFileSync
} from 'fs';
import { createHash } from 'crypto';
import { dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const DOCS_DIR = join(__dirname, '..', 'docs');
export const FILE_SEARCH_DATA_FILE = join(__dirname, 'file-search.json');
export const EMBEDDING_MODEL = 'models/gemini-embedding-001';
export const DEFAULT_CHECK_INTERVAL_SECONDS = 48 * 3600;

const EXCLUDE_DIRS = new Set(['.vitepress', 'public', 'nl', 'node_modules']);
const UPLOAD_CONCURRENCY = 4;
const OPERATION_POLL_MS = 2_000;
const OPERATION_TIMEOUT_MS = 10 * 60_000;

function collectMarkdownFiles(dir, basePath = '') {
  const files = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const relativePath = basePath ? `${basePath}/${entry}` : entry;
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry)) continue;
      files.push(...collectMarkdownFiles(fullPath, relativePath));
    } else if (extname(entry) === '.md') {
      files.push({ fullPath, relativePath });
    }
  }

  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

function wikiUrlFromRelativePath(relativePath) {
  let urlPath = '/' + relativePath
    .replace(/\\/g, '/')
    .replace(/\/index\.md$/, '')
    .replace(/\.md$/, '');

  if (urlPath === '/index') return '/';
  return urlPath;
}

function collectWikiDocuments() {
  return collectMarkdownFiles(DOCS_DIR).map(({ fullPath, relativePath }) => {
    const urlPath = wikiUrlFromRelativePath(relativePath);
    const source = readFileSync(fullPath, 'utf-8');

    // The route is deliberately repeated in the document body and display
    // name so retrieved chunks give the model enough information to link back.
    const content = [
      'NUVIO WIKI DOCUMENT',
      `WIKI PAGE: ${urlPath}`,
      `SOURCE FILE: ${relativePath}`,
      '',
      source
    ].join('\n');

    return { relativePath, urlPath, content };
  });
}

function calculateContentHash(documents) {
  const hash = createHash('sha256');
  for (const document of documents) {
    hash.update(document.relativePath);
    hash.update('\0');
    hash.update(document.content);
    hash.update('\0');
  }
  return hash.digest('hex');
}

function writeDataFile(data) {
  const tempFile = `${FILE_SEARCH_DATA_FILE}.tmp`;
  writeFileSync(tempFile, JSON.stringify(data, null, 2));
  renameSync(tempFile, FILE_SEARCH_DATA_FILE);
}

export function readFileSearchData() {
  if (!existsSync(FILE_SEARCH_DATA_FILE)) return null;
  try {
    return JSON.parse(readFileSync(FILE_SEARCH_DATA_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

export function isFileSearchDataFresh(data) {
  if (!data?.storeName || !data?.nextCheckAt) return false;
  return new Date(data.nextCheckAt) > new Date();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForOperation(ai, initialOperation, label) {
  let operation = initialOperation;
  const deadline = Date.now() + OPERATION_TIMEOUT_MS;

  while (!operation.done) {
    if (Date.now() >= deadline) {
      throw new Error(`Timed out indexing ${label}`);
    }
    await sleep(OPERATION_POLL_MS);
    operation = await ai.operations.get({ operation });
  }

  if (operation.error) {
    throw new Error(`Failed to index ${label}: ${JSON.stringify(operation.error)}`);
  }

  return operation.response;
}

async function uploadDocument(ai, storeName, document) {
  console.log(`   • ${document.relativePath}`);

  const operation = await ai.fileSearchStores.uploadToFileSearchStore({
    fileSearchStoreName: storeName,
    file: new Blob([document.content], { type: 'text/plain' }),
    config: {
      mimeType: 'text/plain',
      displayName: `Nuvio Wiki ${document.urlPath}`,
      customMetadata: [
        { key: 'wiki_route', stringValue: document.urlPath },
        { key: 'source_file', stringValue: document.relativePath }
      ],
      chunkingConfig: {
        whiteSpaceConfig: {
          maxTokensPerChunk: 500,
          maxOverlapTokens: 80
        }
      }
    }
  });

  const response = await waitForOperation(ai, operation, document.relativePath);
  return {
    relativePath: document.relativePath,
    urlPath: document.urlPath,
    documentName: response?.documentName || null
  };
}

async function uploadDocuments(ai, storeName, documents) {
  const uploaded = [];

  for (let i = 0; i < documents.length; i += UPLOAD_CONCURRENCY) {
    const batch = documents.slice(i, i + UPLOAD_CONCURRENCY);
    uploaded.push(...await Promise.all(
      batch.map((document) => uploadDocument(ai, storeName, document))
    ));
  }

  return uploaded;
}

async function deleteStoreQuietly(ai, storeName, reason) {
  if (!storeName) return;
  try {
    await ai.fileSearchStores.delete({
      name: storeName,
      config: { force: true }
    });
    console.log(`🧹  Deleted ${reason} store: ${storeName}`);
  } catch (err) {
    console.warn(`⚠️   Could not delete ${reason} store ${storeName}: ${err.message}`);
  }
}

/**
 * Check the wiki and create an atomically-swapped File Search store if needed.
 *
 * @param {{force?: boolean, checkIntervalSeconds?: number}} options
 * @returns {Promise<string>} Active File Search store resource name.
 */
export async function buildAndSaveFileSearchStore({
  force = false,
  checkIntervalSeconds = DEFAULT_CHECK_INTERVAL_SECONDS
} = {}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set.');
  }

  console.log('📚  Collecting English wiki markdown files...');
  const documents = collectWikiDocuments();
  const contentHash = calculateContentHash(documents);
  const contentChars = documents.reduce((sum, document) => sum + document.content.length, 0);
  const oldData = readFileSearchData();
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const now = new Date();
  const nextCheckAt = new Date(now.getTime() + checkIntervalSeconds * 1000).toISOString();

  console.log(`   Found ${documents.length} files (${contentChars.toLocaleString()} chars)`);

  if (!force && oldData?.storeName && oldData.contentHash === contentHash) {
    try {
      await ai.fileSearchStores.get({ name: oldData.storeName });
      writeDataFile({
        ...oldData,
        checkedAt: now.toISOString(),
        nextCheckAt
      });
      console.log('✅  Wiki content is unchanged; keeping the existing File Search store.');
      return oldData.storeName;
    } catch (err) {
      console.warn(`⚠️   Existing File Search store is unavailable: ${err.message}`);
    }
  }

  console.log('🔄  Creating replacement File Search store...');
  let newStore = null;

  try {
    newStore = await ai.fileSearchStores.create({
      config: {
        displayName: `nuvio-wiki-${now.toISOString().replace(/[:.]/g, '-')}`,
        embeddingModel: EMBEDDING_MODEL
      }
    });

    if (!newStore.name) throw new Error('Gemini did not return a File Search store name.');

    const uploadedDocuments = await uploadDocuments(ai, newStore.name, documents);
    const store = await ai.fileSearchStores.get({ name: newStore.name });
    const data = {
      storeName: newStore.name,
      displayName: store.displayName || newStore.displayName || 'nuvio-wiki',
      embeddingModel: store.embeddingModel || EMBEDDING_MODEL,
      createdAt: store.createTime || now.toISOString(),
      checkedAt: now.toISOString(),
      nextCheckAt,
      contentHash,
      fileCount: documents.length,
      contentChars,
      activeDocumentsCount: Number(store.activeDocumentsCount || documents.length),
      documents: uploadedDocuments
    };

    // Switch locally only after every document has finished indexing.
    writeDataFile(data);
    console.log(`✅  File Search store ready: ${newStore.name}`);

    if (oldData?.storeName && oldData.storeName !== newStore.name) {
      await deleteStoreQuietly(ai, oldData.storeName, 'replaced');
    }

    return newStore.name;
  } catch (err) {
    if (newStore?.name) {
      await deleteStoreQuietly(ai, newStore.name, 'incomplete');
    }
    throw err;
  }
}

async function main() {
  try {
    const force = process.argv.includes('--force');
    await buildAndSaveFileSearchStore({ force });
  } catch (err) {
    console.error(`❌  Failed to refresh File Search: ${err.message}`);
    process.exit(1);
  }
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  main();
}
