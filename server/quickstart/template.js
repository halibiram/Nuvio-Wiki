import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(
  __dirname,
  'data',
  'Tamtaro-All-Templates-for-AIOStreams.json'
);

const REMOVE = Symbol('remove');
let cachedTemplate;

function loadCompleteTemplate() {
  if (!cachedTemplate) {
    const templates = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    cachedTemplate = templates.find(
      (template) => template.metadata?.id === 'tamtaro.complete'
    );
    if (!cachedTemplate) {
      throw new Error('Tam-Taro Complete SEL template is missing.');
    }
  }
  return structuredClone(cachedTemplate);
}

function getNestedValue(values, key) {
  return key.split('.').reduce((value, part) => value?.[part], values);
}

export function evaluateCondition(condition, inputValues, services) {
  const expression = condition.trim();

  const orParts = expression.split(/ or (?=!?(?:inputs|services)\b)/);
  if (orParts.length > 1) {
    return orParts.some((part) =>
      evaluateCondition(part, inputValues, services)
    );
  }

  const xorParts = expression.split(/ xor (?=!?(?:inputs|services)\b)/);
  if (xorParts.length > 1) {
    return (
      xorParts.filter((part) =>
        evaluateCondition(part, inputValues, services)
      ).length %
        2 ===
      1
    );
  }

  const andParts = expression.split(/ and (?=!?(?:inputs|services)\b)/);
  if (andParts.length > 1) {
    return andParts.every((part) =>
      evaluateCondition(part, inputValues, services)
    );
  }

  const negated = expression.startsWith('!');
  const valueExpression = negated ? expression.slice(1).trim() : expression;

  const numericMatch = valueExpression.match(
    /^(\w+)\.(.+?)\s+(>=|<=|>|<)\s+(-?\d+(?:\.\d+)?)$/
  );
  if (numericMatch) {
    const [, namespace, key, operator, rawRight] = numericMatch;
    const left = getNestedValue(inputValues, key);
    const leftNumber =
      typeof left === 'number' ? left : Number.parseFloat(String(left ?? ''));
    const rightNumber = Number.parseFloat(rawRight);
    let result = false;

    if (namespace === 'inputs' && !Number.isNaN(leftNumber)) {
      if (operator === '>=') result = leftNumber >= rightNumber;
      if (operator === '<=') result = leftNumber <= rightNumber;
      if (operator === '>') result = leftNumber > rightNumber;
      if (operator === '<') result = leftNumber < rightNumber;
    }
    return negated ? !result : result;
  }

  const operatorMatch = valueExpression.match(
    /^(\w+)\.(.+?)\s+(==|!=|includes)\s+(.+)$/
  );
  if (operatorMatch) {
    const [, namespace, key, operator, rawRight] = operatorMatch;
    const left = getNestedValue(inputValues, key);
    const right = rawRight.trim();
    let result = false;

    if (namespace === 'inputs') {
      if (operator === '==') result = String(left ?? '') === right;
      if (operator === '!=') result = String(left ?? '') !== right;
      if (operator === 'includes') {
        result = Array.isArray(left)
          ? left.includes(right)
          : typeof left === 'string' && left.includes(right);
      }
    }
    return negated ? !result : result;
  }

  if (valueExpression === 'services') {
    const result = services.length > 0;
    return negated ? !result : result;
  }

  const dotIndex = valueExpression.indexOf('.');
  if (dotIndex === -1) return negated;

  const namespace = valueExpression.slice(0, dotIndex);
  const key = valueExpression.slice(dotIndex + 1);
  let result = false;

  if (namespace === 'services') {
    result = services.includes(key);
  } else if (namespace === 'inputs') {
    const value = getNestedValue(inputValues, key);
    result =
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== false &&
      !(Array.isArray(value) && value.length === 0);
  }

  return negated ? !result : result;
}

function resolveReference(reference, inputValues, services) {
  const trimmed = reference.trim();
  if (trimmed === 'services') return [...services];
  if (trimmed.startsWith('inputs.')) {
    return getNestedValue(inputValues, trimmed.slice('inputs.'.length));
  }
  if (trimmed.startsWith('services.')) {
    return services.includes(trimmed.slice('services.'.length));
  }
  return undefined;
}

export function applyConditionals(value, inputValues, services) {
  if (Array.isArray(value)) {
    const output = [];

    for (const item of value) {
      if (
        item &&
        typeof item === 'object' &&
        '__if' in item &&
        !evaluateCondition(item.__if, inputValues, services)
      ) {
        continue;
      }

      let candidate = item;
      if (item && typeof item === 'object' && '__if' in item) {
        const { __if: ignored, ...rest } = item;
        candidate = '__value' in rest ? rest.__value : rest;
      } else if (item && typeof item === 'object' && '__value' in item) {
        candidate = item.__value;
      }

      const resolved = applyConditionals(candidate, inputValues, services);
      if (resolved === REMOVE) continue;
      if (Array.isArray(resolved)) output.push(...resolved);
      else output.push(resolved);
    }
    return output;
  }

  if (value && typeof value === 'object') {
    if ('__switch' in value) {
      const resolved = resolveReference(value.__switch, inputValues, services);
      const key = resolved == null ? null : String(resolved);
      const selected =
        key !== null && Object.hasOwn(value.cases ?? {}, key)
          ? value.cases[key]
          : (value.default ?? null);
      return applyConditionals(selected, inputValues, services);
    }

    if ('__if' in value && '__value' in value) {
      return evaluateCondition(value.__if, inputValues, services)
        ? applyConditionals(value.__value, inputValues, services)
        : REMOVE;
    }

    if (value.__remove === true) return REMOVE;

    const output = {};
    for (const [key, entry] of Object.entries(value)) {
      const resolved = applyConditionals(entry, inputValues, services);
      if (resolved !== REMOVE) output[key] = resolved;
    }
    return output;
  }

  if (typeof value !== 'string') return value;
  if (value === '{{services}}') return [...services];

  const singleToken = value.match(/^\{\{(inputs|services)\.([^}]+)\}\}$/);
  if (singleToken) {
    const [, namespace, key] = singleToken;
    if (namespace === 'inputs') {
      return getNestedValue(inputValues, key) ?? '';
    }
    if (key.includes('.')) return `{{services.${key}}}`;
    return services.includes(key);
  }

  return value
    .replace(/\{\{services\}\}/g, services.join(','))
    .replace(/\{\{(inputs|services)\.([^}]+)\}\}/g, (_match, ns, key) => {
      if (ns === 'inputs') return String(getNestedValue(inputValues, key) ?? '');
      if (key.includes('.')) return `{{services.${key}}}`;
      return String(services.includes(key));
    });
}

function resolveCredentialReferences(value, credentials) {
  if (typeof value === 'string') {
    return value.replace(
      /\{\{services\.(\w[\w-]*)\.(\w[\w-]*)\}\}/g,
      (_match, serviceId, credentialId) =>
        credentials[`${serviceId}.${credentialId}`] ?? ''
    );
  }
  if (Array.isArray(value)) {
    return value.map((entry) =>
      resolveCredentialReferences(entry, credentials)
    );
  }
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      value[key] = resolveCredentialReferences(value[key], credentials);
    }
  }
  return value;
}

function collectDefaults(options) {
  const values = {};
  for (const option of options ?? []) {
    if (option.default !== undefined) {
      values[option.id] = structuredClone(option.default);
    } else if (option.type === 'boolean') {
      values[option.id] = false;
    }

    if (Array.isArray(option.subOptions)) {
      values[option.id] = {
        ...collectDefaults(option.subOptions),
        ...(values[option.id] ?? {}),
      };
    }
  }
  return values;
}

function containsPlaceholder(value) {
  if (typeof value === 'string') {
    return /<.*template_placeholder>/i.test(value);
  }
  if (Array.isArray(value)) return value.some(containsPlaceholder);
  if (value && typeof value === 'object') {
    return Object.values(value).some(containsPlaceholder);
  }
  return false;
}

function disableMetadataDependentFeatures(config) {
  if (config.titleMatching) config.titleMatching.enabled = false;
  if (config.yearMatching) config.yearMatching.enabled = false;
  if (config.digitalReleaseFilter) config.digitalReleaseFilter.enabled = false;
  if (config.bitrate) config.bitrate.useMetadataRuntime = false;
}

export function buildTamConfig({
  torboxApiKey,
  torboxPlan,
  tmdbApiKey,
  tvdbApiKey,
  availablePresetIds,
}) {
  const template = loadCompleteTemplate();
  const services = ['torbox'];
  const inputValues = collectDefaults(template.metadata.inputs);

  inputValues.torboxTier = torboxPlan === 2 ? 'pro' : 'nonPro';

  let config = applyConditionals(template.config, inputValues, services);
  config = resolveCredentialReferences(config, {
    'torbox.apiKey': torboxApiKey,
  });

  config.services = [
    {
      id: 'torbox',
      enabled: true,
      credentials: { apiKey: torboxApiKey },
    },
  ];

  if (tmdbApiKey) {
    config.tmdbApiKey = tmdbApiKey;
  } else {
    delete config.tmdbApiKey;
    delete config.tmdbAccessToken;
    disableMetadataDependentFeatures(config);
  }

  if (tvdbApiKey) config.tvdbApiKey = tvdbApiKey;
  else delete config.tvdbApiKey;

  if (availablePresetIds?.size && Array.isArray(config.presets)) {
    config.presets = config.presets.filter((preset) =>
      availablePresetIds.has(preset.type)
    );
  }

  config.appliedTemplates = [
    {
      id: template.metadata.id,
      version: template.metadata.version,
      url: 'https://raw.githubusercontent.com/Tam-Taro/SEL-Filtering-and-Sorting/main/Tamtaro-All-Templates-for-AIOStreams.json',
    },
  ];

  if (containsPlaceholder(config)) {
    throw new Error(
      'The Tam-Taro template contains an unresolved required value.'
    );
  }

  return {
    config,
    templateVersion: template.metadata.version,
    metadataMatchingEnabled: Boolean(tmdbApiKey),
  };
}
