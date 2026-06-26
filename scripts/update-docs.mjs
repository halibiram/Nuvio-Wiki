import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = join(projectRoot, 'docs')

const corrections = [
  [/\brecommened\b/gi, 'recommended'],
  [/\bcontineu\b/gi, 'continue'],
  [/\bseperate\b/gi, 'separate'],
  [/\bintegraion\b/gi, 'integration'],
  [/\bequuates\b/gi, 'equates'],
  [/\brecentley\b/gi, 'recently'],
  [/\bmilage\b/gi, 'mileage'],
  [/\bOffical\b/g, 'Official'],
  [/\bappeear\b/gi, 'appear'],
  [/\bcreateing\b/gi, 'creating'],
  [/\blandsance\b/gi, 'landscape'],
  [/\bportrai\b/gi, 'portrait'],
  [/\bcomee\b/gi, 'come'],
  [/\baccross\b/gi, 'across'],
  [/\bteir\b/gi, 'tier'],
  [/\beverytime\b/gi, 'every time'],
  [/\bwebsit\b/gi, 'website'],
  [/\byouur\b/gi, 'your']
]

async function collectMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = join(directory, entry.name)

    // Skip hidden directories, node_modules, and .vitepress internals
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue

    if (entry.isDirectory()) {
      // Skip the .vitepress directory itself but not docs subdirectories
      if (entry.name === '.vitepress') continue
      files.push(...await collectMarkdownFiles(fullPath))
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

function applyCorrections(content) {
  let result = content

  // Spelling corrections
  for (const [pattern, replacement] of corrections) {
    result = result.replace(pattern, replacement)
  }

  // Capitalise standalone "nuvio" (not inside URLs like nuvio.tv or github.com/nuvio)
  result = result.replace(/(?<![./])\bnuvio\b/g, 'Nuvio')
  result = result.replace(/(?<![./])\bnuvio's\b/g, "Nuvio's")
  result = result.replace(/\bNuvios\b/g, "Nuvio's")

  return result
}

const files = await collectMarkdownFiles(docsDir)
let totalChanges = 0

for (const filePath of files) {
  const original = await readFile(filePath, 'utf8')
  const corrected = applyCorrections(original)

  if (corrected !== original) {
    await writeFile(filePath, corrected, 'utf8')
    totalChanges++
    console.log(`  ✓ ${relative(projectRoot, filePath)}`)
  }
}

if (totalChanges === 0) {
  console.log('✓ No spelling corrections needed')
} else {
  console.log(`\n✓ Corrected ${totalChanges} file(s)`)
}
