<script setup>
/**
 * P2PGenerator.vue — Self-contained P2P AIOStreams setup generator.
 *
 * Drop this into a VitePress site's `.vitepress/theme/components/` directory,
 * register it in `theme/index.ts`, and use `<P2PGenerator />` in any markdown
 * page. No backend required — the TAMS template is fetched from GitHub and
 * resolved entirely client-side.
 *
 * Modes:
 *   - Simple: recommended defaults pre-applied, 3 inputs (instance URL,
 *     addon name, language), one-click "Create manifest".
 *   - Advanced: full control panel (presets, languages, filtering, scrapers,
 *     API keys, timeout, install).
 *
 * Based on the TAMS (Tam-Taro Complete SEL) template and the Nuvio-Quickstart
 * conditional engine, ported to run in the browser.
 */
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'

// ---------------------------------------------------------------------------
// TAMS template resolution engine (browser port of template.ts)
// ---------------------------------------------------------------------------

const TEMPLATE_URL =
  'https://raw.githubusercontent.com/Tam-Taro/SEL-Filtering-and-Sorting/main/AIOStreams%20Templates/Tamtaro-complete-setup-template.json'
const TEMPLATE_CACHE_KEY = 'nuvio:tams-template:v1'
const TEMPLATE_CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours
const DEFAULT_INSTANCE_URL = 'https://aiostreamsfortheweebsstable.midnightignite.me'

const REMOVE = Symbol('remove')

function getNestedValue(values, key) {
  return key.split('.').reduce((value, part) => {
    if (value && typeof value === 'object') return value[part]
    return undefined
  }, values)
}

function evaluateCondition(condition, inputValues, services) {
  const expression = condition.trim()
  const orParts = expression.split(/ or (?=!?(?:inputs|services)\b)/)
  if (orParts.length > 1)
    return orParts.some((p) => evaluateCondition(p, inputValues, services))
  const xorParts = expression.split(/ xor (?=!?(?:inputs|services)\b)/)
  if (xorParts.length > 1)
    return xorParts.filter((p) => evaluateCondition(p, inputValues, services)).length % 2 === 1
  const andParts = expression.split(/ and (?=!?(?:inputs|services)\b)/)
  if (andParts.length > 1)
    return andParts.every((p) => evaluateCondition(p, inputValues, services))
  const negated = expression.startsWith('!')
  const valueExpression = negated ? expression.slice(1).trim() : expression
  const numericMatch = valueExpression.match(/^(\w+)\.(.+?)\s+(>=|<=|>|<)\s+(-?\d+(?:\.\d+)?)$/)
  if (numericMatch) {
    const [, namespace, key, operator, rawRight] = numericMatch
    const left = getNestedValue(inputValues, key)
    const leftNumber = typeof left === 'number' ? left : parseFloat(String(left ?? ''))
    const rightNumber = parseFloat(rawRight)
    let result = false
    if (namespace === 'inputs' && !isNaN(leftNumber)) {
      if (operator === '>=') result = leftNumber >= rightNumber
      if (operator === '<=') result = leftNumber <= rightNumber
      if (operator === '>') result = leftNumber > rightNumber
      if (operator === '<') result = leftNumber < rightNumber
    }
    return negated ? !result : result
  }
  const operatorMatch = valueExpression.match(/^(\w+)\.(.+?)\s+(==|!=|includes)\s+(.+)$/)
  if (operatorMatch) {
    const [, namespace, key, operator, rawRight] = operatorMatch
    const left = getNestedValue(inputValues, key)
    const right = rawRight.trim()
    let result = false
    if (namespace === 'inputs') {
      if (operator === '==') result = String(left ?? '') === right
      if (operator === '!=') result = String(left ?? '') !== right
      if (operator === 'includes')
        result = Array.isArray(left) ? left.includes(right) : typeof left === 'string' && left.includes(right)
    }
    return negated ? !result : result
  }
  if (valueExpression === 'services') {
    const result = services.length > 0
    return negated ? !result : result
  }
  const dotIndex = valueExpression.indexOf('.')
  if (dotIndex === -1) return negated
  const namespace = valueExpression.slice(0, dotIndex)
  const key = valueExpression.slice(dotIndex + 1)
  let result = false
  if (namespace === 'services') result = services.includes(key)
  else if (namespace === 'inputs') {
    const value = getNestedValue(inputValues, key)
    result = value !== undefined && value !== null && value !== '' && value !== false && !(Array.isArray(value) && value.length === 0)
  }
  return negated ? !result : result
}

function resolveReference(reference, inputValues, services) {
  const trimmed = reference.trim()
  if (trimmed === 'services') return [...services]
  if (trimmed.startsWith('inputs.')) return getNestedValue(inputValues, trimmed.slice(7))
  if (trimmed.startsWith('services.')) return services.includes(trimmed.slice(9))
  return undefined
}

function applyConditionals(value, inputValues, services) {
  if (Array.isArray(value)) {
    const output = []
    for (const item of value) {
      const obj = item
      if (obj && typeof obj === 'object' && !Array.isArray(obj) && '__if' in obj && !evaluateCondition(obj.__if, inputValues, services)) continue
      let candidate = item
      if (obj && typeof obj === 'object' && !Array.isArray(obj) && '__if' in obj) {
        const { __if: _ignored, ...rest } = obj
        candidate = '__value' in rest ? rest.__value : rest
      } else if (obj && typeof obj === 'object' && !Array.isArray(obj) && '__value' in obj) {
        candidate = obj.__value
      }
      const resolved = applyConditionals(candidate, inputValues, services)
      if (resolved === REMOVE) continue
      if (Array.isArray(resolved)) output.push(...resolved)
      else output.push(resolved)
    }
    return output
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    if ('__switch' in value) {
      const resolved = resolveReference(value.__switch, inputValues, services)
      const key = resolved == null ? null : String(resolved)
      const cases = value.cases ?? {}
      const selected = key !== null && Object.prototype.hasOwnProperty.call(cases, key) ? cases[key] : (value.default ?? null)
      return applyConditionals(selected, inputValues, services)
    }
    if ('__if' in value && '__value' in value)
      return evaluateCondition(value.__if, inputValues, services) ? applyConditionals(value.__value, inputValues, services) : REMOVE
    if (value.__remove === true) return REMOVE
    const output = {}
    for (const [key, entry] of Object.entries(value)) {
      const resolved = applyConditionals(entry, inputValues, services)
      if (resolved !== REMOVE) output[key] = resolved
    }
    return output
  }
  if (typeof value !== 'string') return value
  if (value === '{{services}}') return [...services]
  const singleToken = value.match(/^\{\{(inputs|services)\.([^}]+)\}\}$/)
  if (singleToken) {
    const [, namespace, key] = singleToken
    if (namespace === 'inputs') return getNestedValue(inputValues, key) ?? ''
    if (key.includes('.')) return `{{services.${key}}}`
    return services.includes(key)
  }
  return value
    .replace(/\{\{services\}\}/g, services.join(','))
    .replace(/\{\{(inputs|services)\.([^}]+)\}\}/g, (_match, ns, key) => {
      if (ns === 'inputs') return String(getNestedValue(inputValues, key) ?? '')
      if (key.includes('.')) return `{{services.${key}}}`
      return String(services.includes(key))
    })
}

function deepClone(value) {
  // JSON round-trip is safer than structuredClone for template data that may
  // contain non-cloneable structures.
  return JSON.parse(JSON.stringify(value))
}

function collectDefaults(options) {
  const values = {}
  for (const option of options ?? []) {
    if (option.default !== undefined) values[option.id] = deepClone(option.default)
    else if (option.type === 'boolean') values[option.id] = false
    if (Array.isArray(option.subOptions))
      values[option.id] = { ...collectDefaults(option.subOptions), ...(values[option.id] ? values[option.id] : {}) }
  }
  return values
}

function containsPlaceholder(value) {
  if (typeof value === 'string') return /<.*template_placeholder>/i.test(value)
  if (Array.isArray(value)) return value.some(containsPlaceholder)
  if (value && typeof value === 'object') return Object.values(value).some(containsPlaceholder)
  return false
}

function disableMetadataDependentFeatures(config) {
  if (config.titleMatching && typeof config.titleMatching === 'object') config.titleMatching.enabled = false
  if (config.yearMatching && typeof config.yearMatching === 'object') config.yearMatching.enabled = false
  if (config.digitalReleaseFilter && typeof config.digitalReleaseFilter === 'object') config.digitalReleaseFilter.enabled = false
  if (config.bitrate && typeof config.bitrate === 'object') config.bitrate.useMetadataRuntime = false
}

/** Fetch the TAMS template (with localStorage cache). */
async function loadTemplate() {
  // Check cache first.
  try {
    const cached = localStorage.getItem(TEMPLATE_CACHE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (parsed.fetchedAt && Date.now() - parsed.fetchedAt < TEMPLATE_CACHE_TTL)
        return parsed.template
    }
  } catch {}
  const res = await fetch(TEMPLATE_URL)
  if (!res.ok) throw new Error(`Failed to fetch TAMS template (${res.status})`)
  const template = await res.json()
  if (template.metadata?.id !== 'tamtaro.complete')
    throw new Error('TAMS template is missing or invalid.')
  try {
    localStorage.setItem(TEMPLATE_CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), template }))
  } catch {}
  return template
}

/** Extract the P2P scraper addon choices from the template. */
function getAddonChoices(template) {
  const presets = template.config.presets
  if (!presets || !presets.__value || !presets.__value.cases) return []
  const p2pRaw = presets.__value.cases[''] ?? []
  return p2pRaw
    .map((p) => ({
      type: p.type,
      name: p.options?.name ?? p.type,
      category: p.category ?? 'P2P',
      enabledByDefault: p.enabled !== false,
    }))
    .filter((p) => p.type !== 'opensubtitles-v3-plus')
}

/** Build a fully-resolved P2P config from the TAMS template + user options. */
function buildP2PConfig(template, options = {}) {
  const services = [] // P2P mode = no debrid services.
  const inputValues = collectDefaults(template.metadata.inputs)
  if (options.languages) inputValues.languages = [...options.languages]
  if (options.subtitles) inputValues.subtitles = [...options.subtitles]
  if (options.addonPreset) inputValues.addonPreset = options.addonPreset
  if (options.formatterChoice) inputValues.formatterChoice = options.formatterChoice
  if (options.coreFilter) inputValues.coreFilter = options.coreFilter
  const miscDefaults = inputValues.misc ?? {}
  const addonName = options.addonName?.trim() || 'AIOStreams'
  inputValues.misc = {
    ...miscDefaults,
    addonName,
    ...(options.showStats !== undefined ? { showStats: options.showStats ? 'true' : 'false' } : {}),
  }
  if (options.timeout !== undefined)
    inputValues.includeAddon = { ...(inputValues.includeAddon ?? {}), timeout: options.timeout }
  let config = applyConditionals(template.config, inputValues, services)
  if (config === REMOVE || config === null) throw new Error('Failed to resolve TAMS template.')
  // P2P overrides.
  const strictness = options.p2pStrictness ?? 'preferred'
  if (strictness === 'required') {
    config.preferredStreamTypes = []
    config.requiredStreamTypes = ['p2p']
  } else {
    config.preferredStreamTypes = ['p2p']
    config.requiredStreamTypes = []
  }
  config.excludedStreamTypes = ['debrid']
  config.excludeUncached = true
  config.excludeCachedFromStreamTypes = ['debrid']
  config.serviceWrap = { enabled: false, reconfigureService: false }
  config.cacheAndPlay = { enabled: false, streamTypes: [] }
  config.services = []
  // Curate scrapers.
  if (Array.isArray(config.presets) && options.enabledAddons) {
    const wanted = new Set(options.enabledAddons)
    config.presets = config.presets.filter((p) => wanted.has(p.type)).map((p) => ({ ...p, enabled: true }))
  }
  // API keys.
  if (options.tmdbApiKey) config.tmdbApiKey = options.tmdbApiKey
  else {
    delete config.tmdbApiKey
    delete config.tmdbAccessToken
    disableMetadataDependentFeatures(config)
  }
  if (options.tvdbApiKey) config.tvdbApiKey = options.tvdbApiKey
  else delete config.tvdbApiKey
  // Provenance.
  config.appliedTemplates = [
    { id: template.metadata.id, version: template.metadata.version, url: TEMPLATE_URL },
  ]
  if (containsPlaceholder(config)) throw new Error('The TAMS template contains an unresolved required value.')
  return config
}

// ---------------------------------------------------------------------------
// Component state
// ---------------------------------------------------------------------------

const template = ref(null)
const templateError = ref(null)
const addons = ref([])
const languages = ref([])
const subtitles = ref([])
const templateVersion = ref('')

const mode = ref('simple') // 'simple' | 'advanced'

// Form state (shared between Simple + Advanced).
const form = reactive({
  instanceUrl: DEFAULT_INSTANCE_URL,
  addonName: '',
  languages: ['English'],
  subtitles: ['English'],
  addonPreset: 'default',
  formatterChoice: 'default',
  coreFilter: 'standard',
  p2pStrictness: 'required',
  enabledAddons: [],
  tmdbApiKey: '',
  tvdbApiKey: '',
  showStats: false,
  timeout: 15000,
})

const ICONS = {
  sparkles: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6Z"/></svg>`,
  shieldCheck: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  zapOff: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.43 6.9 15 2h-4l-5 6h4.37M6 14l-2 8 8-8h-3l2.84-3.41"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`,
  globeOff: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`,
  globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  package: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  target: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  feather: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`,
  tv: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>`,
  flower: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V12m4.5 0a4.5 4.5 0 1 1-4.5 4.5M16.5 12H12m-4.5 0A4.5 4.5 0 1 0 12 16.5M7.5 12H12m0 4.5V12"/></svg>`,
  messageSquare: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  server: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
  sliders: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="2" y1="14" x2="6" y2="14"/><line x1="10" y1="8" x2="14" y2="8"/><line x1="18" y1="16" x2="22" y2="16"/></svg>`,
  key: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 1.5 1.5M15.5 7.5 14 6"/></svg>`,
  fileText: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  rocket: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  loader: `<svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
  sync: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,
  copy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
}

function getIconHtml(name, size = 16) {
  const raw = ICONS[name]
  if (!raw) return ''
  return raw.replace(/<svg /, `<svg width="${size}" height="${size}" `)
}

function highlightJson(jsonStr) {
  if (!jsonStr) return ''
  let html = jsonStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  return html.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'json-number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key'
          return `<span class="${cls}">${match.replace(/:$/, '')}</span>:`
        } else {
          cls = 'json-string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean'
      } else if (/null/.test(match)) {
        cls = 'json-null'
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
}

const config = ref(null)
const configJson = ref('')
const generating = ref(false)
const genError = ref(null)
const installPassword = ref('')
const installing = ref(false)
const installResult = ref(null)
const installError = ref(null)
const advancedOpen = ref(false)
const scraperQuery = ref('')

// Recent instances (localStorage).
const recentInstances = ref([])
const RECENT_KEY = 'nuvio:recent-instances'
function loadRecent() {
  try {
    recentInstances.value = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').slice(0, 5)
  } catch { recentInstances.value = [] }
}
function recordRecent(url) {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').filter((u) => u !== url)
    list.unshift(url)
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 10)))
    loadRecent()
  } catch {}
}

function createInstallPassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(18))
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
  return [...bytes].map((value) => alphabet[value % alphabet.length]).join('')
}

// Derived.
const instanceValid = computed(() => {
  try {
    const u = new URL(form.instanceUrl.trim())
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch { return false }
})

const p2pAddons = computed(() => addons.value.filter((a) => a.category === 'P2P'))
const httpAddons = computed(() => addons.value.filter((a) => a.category === 'HTTP'))
const scraperQueryLower = computed(() => scraperQuery.value.trim().toLowerCase())
const filteredAddons = computed(() =>
  scraperQueryLower.value
    ? addons.value.filter((a) => a.name.toLowerCase().includes(scraperQueryLower.value) || a.type.toLowerCase().includes(scraperQueryLower.value))
    : addons.value
)
const filteredP2p = computed(() => filteredAddons.value.filter((a) => a.category === 'P2P'))
const filteredHttp = computed(() => filteredAddons.value.filter((a) => a.category === 'HTTP'))
const enabledCount = computed(() => form.enabledAddons.length)

const canInstall = computed(() => instanceValid.value && !!config.value && !installing.value)

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

function toggleAddon(type) {
  const idx = form.enabledAddons.indexOf(type)
  if (idx >= 0) form.enabledAddons.splice(idx, 1)
  else form.enabledAddons.push(type)
}

function defaultAddonTypes() {
  return addons.value
    .filter((addon) => addon.enabledByDefault && addon.category === 'P2P')
    .map((addon) => addon.type)
}

function resetAddonsToDefault() {
  form.enabledAddons = defaultAddonTypes()
}

function enableAllVisible() {
  const visible = filteredAddons.value.map((a) => a.type)
  form.enabledAddons = [...new Set([...form.enabledAddons, ...visible])]
}
function disableAllVisible() {
  const visibleTypes = new Set(filteredAddons.value.map((a) => a.type))
  form.enabledAddons = form.enabledAddons.filter((t) => !visibleTypes.has(t))
}

// Live config generation (debounced).
let genTimer = null
async function regenerate() {
  if (!template.value) return
  generating.value = true
  try {
    const cfg = buildP2PConfig(template.value, { ...form })
    config.value = cfg
    configJson.value = JSON.stringify(cfg, null, 2)
    genError.value = null
  } catch (e) {
    config.value = null
    configJson.value = ''
    genError.value = e.message
    console.error('[P2PGenerator] regenerate failed:', e)
  } finally {
    generating.value = false
  }
}
watch(form, () => {
  clearTimeout(genTimer)
  genTimer = setTimeout(regenerate, 200)
}, { deep: true })

async function handleInstall() {
  if (!canInstall.value) return
  installing.value = true
  installError.value = null
  installResult.value = null
  const instanceUrl = form.instanceUrl.replace(/\/$/, '')
  const useSameOriginProxy = instanceUrl === DEFAULT_INSTANCE_URL
  try {
    const endpoint = useSameOriginProxy ? '/api/aiostreams/user' : `${instanceUrl}/api/v1/user`
    const password = installPassword.value || createInstallPassword()
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        config: config.value,
        password,
      }),
    })
    const body = await res.json().catch(() => null)
    if (!res.ok) {
      throw new Error(body?.detail || body?.error?.message || body?.message || body?.error || `Install failed (${res.status})`)
    }
    const data = body?.data ?? body
    if (!data?.uuid || !data?.encryptedPassword) {
      throw new Error('AIOStreams did not return a manifest identifier.')
    }
    const stremioBase = `${instanceUrl}/stremio/${encodeURIComponent(data.uuid)}/${encodeURIComponent(data.encryptedPassword)}`
    const manifestUrl = `${stremioBase}/manifest.json`
    const configureUrl = `${stremioBase}/configure`
    installResult.value = {
      manifestUrl,
      configureUrl,
      password,
    }
    recordRecent(form.instanceUrl)
  } catch (e) {
    const networkHint = e instanceof TypeError
      ? useSameOriginProxy
        ? ' The same-origin AIOStreams proxy is unavailable.'
        : ' Direct browser requests may be blocked by this instance CORS policy.'
      : ''
    installError.value = `${e.message || 'Manifest creation failed.'}${networkHint} You can still download the config JSON and import it manually.`
  } finally {
    installing.value = false
  }
}

function copyToClipboard(text, label = 'Copied') {
  navigator.clipboard.writeText(text).then(() => {
    // Simple feedback — VitePress doesn't bundle a toast lib.
    console.log(label)
  })
}

function downloadConfig() {
  const blob = new Blob([configJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'aiostreams-p2p-config.json'
  a.click()
  URL.revokeObjectURL(url)
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

onMounted(async () => {
  loadRecent()
  try {
    const tpl = await loadTemplate()
    template.value = tpl
    templateVersion.value = tpl.metadata.version
    addons.value = getAddonChoices(tpl)
    // Extract language + subtitle options from the template inputs.
    const langInput = tpl.metadata.inputs.find((i) => i.id === 'languages')
    const subInput = tpl.metadata.inputs.find((i) => i.id === 'subtitles')
    languages.value = (langInput?.options || []).map((o) => ({ value: o.value, label: o.label || o.value }))
    subtitles.value = (subInput?.options || []).map((o) => ({ value: o.value, label: o.label || o.value }))
    // Apply recommended defaults.
    form.enabledAddons = defaultAddonTypes()
    await regenerate()
  } catch (e) {
    templateError.value = e.message
  }
})
</script>

<template>
  <div class="p2p-gen">
    <!-- Mode toggle -->
    <div class="mode-toggle" role="tablist" aria-label="Generator mode">
      <button
        role="tab"
        :aria-selected="mode === 'simple'"
        :class="['mode-btn', { active: mode === 'simple' }]"
        @click="mode = 'simple'"
      >
        <span v-html="getIconHtml('sparkles', 16)"></span>
        Simple
      </button>
      <button
        role="tab"
        :aria-selected="mode === 'advanced'"
        :class="['mode-btn', { active: mode === 'advanced' }]"
        @click="mode = 'advanced'"
      >
        <span v-html="getIconHtml('settings', 16)"></span>
        Advanced
      </button>
    </div>

    <div v-if="templateError" class="callout callout-warn">
      <strong>Couldn't load the TAMS template:</strong> {{ templateError }}
    </div>

    <!-- ===================== SIMPLE MODE ===================== -->
    <div v-if="mode === 'simple' && template" class="simple-mode">
      <div class="simple-header">
        <h3>Quick setup — recommended defaults applied</h3>
        <p>
          Just enter your AIOStreams instance URL and click
          <strong>Create manifest</strong>. We'll build a P2P-safe config and
          push it to your instance in one step.
        </p>
        <div class="default-badges">
          <span class="badge badge-p2p"><span v-html="getIconHtml('shieldCheck', 14)"></span> P2P Required</span>
          <span class="badge"><span v-html="getIconHtml('zapOff', 14)"></span> No debrid keys</span>
          <span class="badge"><span v-html="getIconHtml('globeOff', 14)"></span> HTTP off</span>
          <span class="badge"><span v-html="getIconHtml('package', 14)"></span> {{ enabledCount }} scrapers</span>
          <span class="badge">Standard SEL</span>
          <span class="badge">15s timeout</span>
          <span class="badge"><span v-html="getIconHtml('messageSquare', 14)"></span> English subs</span>
        </div>
      </div>

      <div class="simple-form">
        <div class="step">
          <label><span class="step-num">1</span> Your AIOStreams instance URL <span class="req">required</span></label>
          <input
            v-model="form.instanceUrl"
            type="url"
            placeholder="https://your-aiostreams-instance.example.com"
            class="input"
            list="recent-instances"
          />
          <datalist id="recent-instances">
            <option v-for="url in recentInstances" :key="url" :value="url" />
          </datalist>
          <p v-if="form.instanceUrl && !instanceValid" class="error-text">
            Enter a full URL including https://
          </p>
          <p class="hint">
            Self-hosted or a public instance that allows P2P. The official
            ElfHosted instance blocks P2P — it won't work here.
          </p>
        </div>

        <div class="step">
          <label><span class="step-num">2</span> Addon name <span class="opt">optional</span></label>
          <input
            v-model="form.addonName"
            type="text"
            placeholder="AIOStreams (default)"
            class="input"
          />
          <p class="hint">How it shows up in Nuvio's addon list.</p>
        </div>

        <div class="step">
          <label><span class="step-num">3</span> Preferred audio language <span class="opt">optional</span></label>
          <select v-model="form.languages[0]" class="input">
            <option v-for="l in languages" :key="l.value" :value="l.value">{{ l.label }}</option>
          </select>
          <p class="hint">Original / Dual / Multi / Dubbed / Unknown are appended automatically.</p>
        </div>

        <button
          class="btn btn-primary btn-large"
          :disabled="!canInstall"
          @click="handleInstall"
        >
          <span v-if="installing" class="btn-content"><span v-html="getIconHtml('loader', 18)"></span> Pushing to your instance…</span>
          <span v-else class="btn-content"><span v-html="getIconHtml('rocket', 18)"></span> Create protected manifest →</span>
        </button>
        <p v-if="!instanceValid" class="hint center">
          Enter your instance URL above to enable this.
        </p>

        <details class="collapsible">
          <summary>Manifest password (optional)</summary>
          <input
            v-model="installPassword"
            type="text"
            placeholder="Auto-generated if blank"
            class="input"
          />
        </details>
      </div>

      <!-- Install result -->
      <div v-if="installResult" class="install-success">
        <p><span v-html="getIconHtml('checkCircle', 18)" class="success-icon"></span> <strong>Your manifest is ready!</strong> Copy the URL below and paste it into <strong>Nuvio → Content & Discovery → Addons → Add addon</strong>.</p>
        <div class="copy-field">
          <label>Manifest URL → paste into Nuvio</label>
          <div class="copy-row">
            <input :value="installResult.manifestUrl" readonly class="input mono" />
            <button class="btn btn-sm copy-btn" @click="copyToClipboard(installResult.manifestUrl, 'Manifest URL copied')">
              <span v-html="getIconHtml('copy', 12)"></span> Copy
            </button>
          </div>
        </div>
        <div class="copy-field">
          <label>Configure URL → edit later</label>
          <div class="copy-row">
            <input :value="installResult.configureUrl" readonly class="input mono" />
            <button class="btn btn-sm copy-btn" @click="copyToClipboard(installResult.configureUrl, 'Configure URL copied')">
              <span v-html="getIconHtml('copy', 12)"></span> Copy
            </button>
          </div>
        </div>
        <div v-if="installResult.password" class="copy-field">
          <label>Manifest password (keep safe)</label>
          <div class="copy-row">
            <input :value="installResult.password" readonly class="input mono" />
            <button class="btn btn-sm copy-btn" @click="copyToClipboard(installResult.password, 'Password copied')">
              <span v-html="getIconHtml('copy', 12)"></span> Copy
            </button>
          </div>
        </div>
      </div>

      <div v-if="installError" class="callout callout-warn">
        <strong>Manifest creation failed:</strong> {{ installError }}
      </div>

      <div class="simple-footer">
        <button class="link-btn" @click="mode = 'advanced'">
          <span v-html="getIconHtml('settings', 14)"></span> Switch to Advanced mode →
        </button>
        <details>
          <summary class="link-btn-sm">Show generated config JSON</summary>
          <pre class="config-preview" v-html="highlightJson(configJson)"></pre>
        </details>
      </div>
    </div>

    <!-- ===================== ADVANCED MODE ===================== -->
    <div v-if="mode === 'advanced' && template" class="advanced-mode">
      <div class="adv-grid">
        <!-- Form column -->
        <div class="adv-form">
          <!-- Quick presets -->
          <div class="adv-card">
            <h3><span v-html="getIconHtml('sliders', 18)"></span> Quick start presets</h3>
            <p class="muted">One-click setups for common use cases.</p>
            <div class="preset-grid">
              <button
                v-for="p in [
                  { id: 'balanced', name: 'Balanced', icon: 'target', blurb: 'Recommended mix of P2P scrapers.' },
                  { id: 'lightweight', name: 'Lightweight', icon: 'feather', blurb: 'Fewer scrapers for fast lists.' },
                  { id: '4k-max', name: '4K / Max quality', icon: 'tv', blurb: 'Extended SEL + more scrapers.' },
                  { id: 'anime', name: 'Anime', icon: 'flower', blurb: 'Japanese audio + English subs.' },
                  { id: 'multilingual', name: 'Multilingual', icon: 'globe', blurb: 'Broad language set.' },
                  { id: 'subs-first', name: 'Subtitles-first', icon: 'messageSquare', blurb: 'Multi-subtitle setup.' },
                ]"
                :key="p.id"
                class="preset-card"
                @click="
                  form.p2pStrictness = 'required';
                  form.coreFilter = p.id === '4k-max' || p.id === 'anime' ? 'extended' : 'standard';
                  form.languages = p.id === 'anime' ? ['Japanese', 'English'] : p.id === 'multilingual' ? ['English', 'Spanish', 'French', 'German'] : ['English'];
                  form.subtitles = p.id === 'subs-first' ? ['English', 'Spanish', 'French'] : ['English'];
                  form.enabledAddons = p.id === 'lightweight' ? ['meteor', 'torrentio'] : p.id === '4k-max' ? ['meteor', 'comet', 'torrentio', 'torrents-db', 'peerflix', 'stremthruTorz'] : p.id === 'anime' ? ['mediafusion', 'meteor', 'comet', 'torrentio'] : ['meteor', 'comet', 'torrentio', 'torrents-db', 'peerflix'];
                "
              >
                <span class="preset-icon" v-html="getIconHtml(p.icon, 20)"></span>
                <span class="preset-name">{{ p.name }}</span>
                <span class="preset-blurb">{{ p.blurb }}</span>
              </button>
            </div>
          </div>

          <!-- Instance -->
          <div class="adv-card">
            <h3><span v-html="getIconHtml('server', 18)"></span> AIOStreams instance</h3>
            <label>Instance URL</label>
            <input v-model="form.instanceUrl" type="url" placeholder="https://…" class="input" list="recent-instances" />
            <datalist id="recent-instances-adv">
              <option v-for="url in recentInstances" :key="url" :value="url" />
            </datalist>
            <p v-if="form.instanceUrl && !instanceValid" class="error-text">Enter a full URL including https://</p>
            <label style="margin-top: 12px">Addon name (optional)</label>
            <input v-model="form.addonName" type="text" placeholder="AIOStreams (default)" class="input" />
          </div>

          <!-- Languages -->
          <div class="adv-card">
            <h3><span v-html="getIconHtml('globe', 18)"></span> Language preferences</h3>
            <label>Preferred audio languages</label>
            <div class="lang-chips">
              <button
                v-for="l in languages"
                :key="l.value"
                :class="['chip', { active: form.languages.includes(l.value) }]"
                @click="form.languages.includes(l.value) ? form.languages = form.languages.filter((x) => x !== l.value) : form.languages.push(l.value)"
              >{{ l.label }}</button>
            </div>
            <label style="margin-top: 12px">Preferred subtitles</label>
            <div class="lang-chips">
              <button
                v-for="s in subtitles"
                :key="s.value"
                :class="['chip', { active: form.subtitles.includes(s.value) }]"
                @click="form.subtitles.includes(s.value) ? form.subtitles = form.subtitles.filter((x) => x !== s.value) : form.subtitles.push(s.value)"
              >{{ s.label }}</button>
            </div>
          </div>

          <!-- Filtering -->
          <div class="adv-card">
            <h3><span v-html="getIconHtml('sliders', 18)"></span> Filtering & formatting</h3>
            <label>Core filter (SEL density)</label>
            <select v-model="form.coreFilter" class="input">
              <option value="standard">Standard SEL (~20 results/title)</option>
              <option value="extended">Extended SEL (~40 results/title)</option>
            </select>
            <label style="margin-top: 12px">Formatter</label>
            <select v-model="form.formatterChoice" class="input">
              <option value="default">Default (recommended)</option>
              <option value="min">Minimal</option>
              <option value="tamtaro">Tamtaro</option>
              <option value="viren">Viren</option>
              <option value="none">None</option>
            </select>
            <div style="margin-top: 16px">
              <label>P2P stream-type enforcement</label>
              <div class="strict-grid">
                <button
                  :class="['strict-card', { active: form.p2pStrictness === 'preferred' }]"
                  @click="form.p2pStrictness = 'preferred'"
                >
                  <strong>Preferred</strong>
                  <p>P2P prioritised; other types allowed as fallback.</p>
                </button>
                <button
                  :class="['strict-card', { active: form.p2pStrictness === 'required' }]"
                  @click="form.p2pStrictness = 'required'"
                >
                  <strong>Required</strong>
                  <p>Only raw P2P (magnet) streams pass — safest for Nuvio.</p>
                </button>
              </div>
            </div>
          </div>

          <!-- Scrapers -->
          <div class="adv-card">
            <div class="card-header-row">
              <h3><span v-html="getIconHtml('package', 18)"></span> P2P scraper addons</h3>
              <button class="btn btn-sm" @click="resetAddonsToDefault">Reset to defaults</button>
            </div>
            <div class="scraper-search-row">
              <input v-model="scraperQuery" type="search" placeholder="Search scrapers…" class="input" />
              <button class="btn btn-sm" @click="enableAllVisible">Enable all</button>
              <button class="btn btn-sm" @click="disableAllVisible">Disable all</button>
            </div>
            <p class="muted small">P2P scrapers ({{ filteredP2p.filter((a) => form.enabledAddons.includes(a.type)).length }}/{{ p2pAddons.length }})</p>
            <div class="addon-grid">
              <button
                v-for="a in filteredP2p"
                :key="a.type"
                :class="['addon-card', { on: form.enabledAddons.includes(a.type) }]"
                @click="toggleAddon(a.type)"
              >
                <span class="addon-name">{{ a.name }}</span>
                <span class="addon-type">{{ a.type }}</span>
                <span :class="['addon-cat', a.category.toLowerCase()]">{{ a.category }}</span>
              </button>
            </div>
            <p v-if="httpAddons.length > 0" class="muted small" style="margin-top: 16px">HTTP scrapers ({{ filteredHttp.filter((a) => form.enabledAddons.includes(a.type)).length }}/{{ httpAddons.length }})</p>
            <div class="addon-grid" v-if="httpAddons.length > 0">
              <button
                v-for="a in filteredHttp"
                :key="a.type"
                :class="['addon-card', { on: form.enabledAddons.includes(a.type) }]"
                @click="toggleAddon(a.type)"
              >
                <span class="addon-name">{{ a.name }}</span>
                <span class="addon-type">{{ a.type }}</span>
                <span :class="['addon-cat', a.category.toLowerCase()]">{{ a.category }}</span>
              </button>
            </div>
            <p class="muted small">{{ enabledCount }} of {{ addons.length }} scrapers enabled.</p>
          </div>

          <!-- Advanced (collapsible) -->
          <details class="adv-card collapsible-card">
            <summary class="card-header-row">
              <h3><span v-html="getIconHtml('key', 18)"></span> Advanced — API keys, statistics, timeout</h3>
            </summary>
            <div style="padding-top: 12px">
              <label>TMDB API key (optional)</label>
              <input v-model="form.tmdbApiKey" type="password" placeholder="Enables metadata-based matching" class="input" />
              <label style="margin-top: 12px">TVDB API key (optional)</label>
              <input v-model="form.tvdbApiKey" type="password" placeholder="For TV show metadata" class="input" />
              <label style="margin-top: 12px">Per-addon scrape timeout: {{ (form.timeout / 1000).toFixed(1) }}s</label>
              <input v-model.number="form.timeout" type="range" min="5000" max="60000" step="1000" class="slider" />
              <label class="checkbox-row">
                <input v-model="form.showStats" type="checkbox" /> Show statistics footer
              </label>
            </div>
          </details>
        </div>

        <!-- Preview column -->
        <div class="adv-preview">
          <div class="status-bar">
            <span class="badge badge-p2p"><span v-html="getIconHtml('shield', 14)"></span> P2P mode</span>
            <span class="badge">{{ form.p2pStrictness }}</span>
            <span class="badge"><span v-html="getIconHtml('package', 14)"></span> {{ enabledCount }} scrapers</span>
            <span v-if="templateVersion" class="badge">TAMS v{{ templateVersion }}</span>
            <span class="auto-sync">
              <span v-if="generating" class="sync-status"><span v-html="getIconHtml('loader', 14)"></span> Generating…</span>
              <span v-else class="sync-status active"><span v-html="getIconHtml('checkCircle', 14)"></span> Auto-syncing</span>
            </span>
          </div>

          <!-- Config + actions -->
          <div class="adv-card config-card">
            <div class="card-header-row">
              <h3><span v-html="getIconHtml('fileText', 18)"></span> Config JSON</h3>
              <div class="header-actions">
                <button class="btn btn-sm copy-btn" @click="copyToClipboard(configJson, 'Config copied')">
                  <span v-html="getIconHtml('copy', 12)"></span> Copy
                </button>
                <button class="btn btn-sm copy-btn" @click="downloadConfig">
                  <span v-html="getIconHtml('download', 12)"></span> Download
                </button>
              </div>
            </div>
            <pre v-if="configJson" class="config-block" v-html="highlightJson(configJson)"></pre>
            <div v-else class="loading-skeleton" />
          </div>

          <!-- Install -->
          <div class="adv-card">
            <h3><span v-html="getIconHtml('rocket', 18)"></span> Create protected manifest</h3>
            <p class="muted">Push this config to your instance and get a ready-to-paste manifest URL.</p>
            <label>Manifest password (optional)</label>
            <input v-model="installPassword" type="text" placeholder="Auto-generated if blank" class="input" />
            <button class="btn btn-primary" :disabled="!canInstall" @click="handleInstall" style="margin-top: 12px; width: 100%">
              <span v-if="installing" class="btn-content"><span v-html="getIconHtml('loader', 16)"></span> Creating…</span>
              <span v-else class="btn-content"><span v-html="getIconHtml('rocket', 16)"></span> Create protected manifest</span>
            </button>
            <p v-if="!instanceValid" class="muted small">Enter a valid instance URL to enable this.</p>
          </div>

          <!-- Install result -->
          <div v-if="installResult" class="install-success">
            <p><span v-html="getIconHtml('checkCircle', 16)" class="success-icon"></span> <strong>Manifest created!</strong></p>
            <div class="copy-field">
              <label>Manifest URL</label>
              <div class="copy-row">
                <input :value="installResult.manifestUrl" readonly class="input mono" />
                <button class="btn btn-sm copy-btn" @click="copyToClipboard(installResult.manifestUrl, 'Copied')">
                  <span v-html="getIconHtml('copy', 12)"></span> Copy
                </button>
              </div>
            </div>
            <div class="copy-field">
              <label>Configure URL</label>
              <div class="copy-row">
                <input :value="installResult.configureUrl" readonly class="input mono" />
                <button class="btn btn-sm copy-btn" @click="copyToClipboard(installResult.configureUrl, 'Copied')">
                  <span v-html="getIconHtml('copy', 12)"></span> Copy
                </button>
              </div>
            </div>
            <div class="copy-field">
              <label>Manifest password (keep safe)</label>
              <div class="copy-row">
                <input :value="installResult.password" readonly class="input mono" />
                <button class="btn btn-sm copy-btn" @click="copyToClipboard(installResult.password, 'Copied')">
                  <span v-html="getIconHtml('copy', 12)"></span> Copy
                </button>
              </div>
            </div>
          </div>

          <div v-if="installError" class="callout callout-warn">
            <strong>Install failed:</strong> {{ installError }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="!template && !templateError" class="loading">
      <p><span v-html="getIconHtml('loader', 24)" class="loading-spinner"></span> Loading the TAMS template…</p>
    </div>
  </div>
</template>

<style scoped>
.p2p-gen {
  margin: 24px 0;
  font-family: inherit;
}

/* Mode toggle tabs */
.mode-toggle {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: transparent;
  padding: 0 0 8px 0;
  margin-bottom: 24px;
}
.mode-btn {
  padding: 8px 0;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 15px;
  font-weight: 600;
  border-radius: 0;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
}
.mode-btn.active {
  color: var(--vp-c-brand);
  background: transparent;
  box-shadow: none;
}
.mode-btn.active::after {
  content: '';
  position: absolute;
  bottom: -9px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--vp-c-brand);
}
.mode-btn:not(.active):hover {
  color: var(--vp-c-text-1);
  background: transparent;
}

/* Simple mode */
.simple-header {
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 20px 24px;
  background: var(--vp-c-bg-soft);
  margin-bottom: 20px;
}
.simple-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.simple-header p {
  margin: 0 0 12px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
}
.default-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}
.badge svg {
  color: var(--vp-c-text-3);
  opacity: 0.85;
}
.badge-p2p {
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.1);
  color: rgb(16, 185, 129);
}
.badge-p2p svg {
  color: rgb(16, 185, 129);
}

.simple-form {
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 24px;
  background: var(--vp-c-bg);
}
.step {
  margin-bottom: 20px;
}
.step label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  color: var(--vp-c-white);
  font-size: 12px;
  font-weight: 700;
}
.req { color: var(--vp-c-danger); font-size: 10px; text-transform: uppercase; }
.opt { color: var(--vp-c-text-3); font-size: 10px; text-transform: uppercase; }

.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input:focus {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand) 15%, transparent);
  outline: none;
}
.input.mono { font-family: var(--vp-font-family-mono); font-size: 12px; }
.hint { font-size: 12px; color: var(--vp-c-text-3); margin: 4px 0 0 0; }
.hint.center { text-align: center; }
.error-text { font-size: 12px; color: var(--vp-c-danger); margin: 4px 0 0 0; }

.btn {
  padding: 8px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.btn:hover { border-color: var(--vp-c-brand); }
.btn-sm { padding: 4px 10px; font-size: 12px; }
.btn-primary {
  background: var(--vp-c-brand);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand);
}
.btn-primary:hover { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-large {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
}
.btn-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.collapsible {
  margin-top: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
}
.collapsible summary {
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

/* Install success */
.install-success {
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 12px;
  padding: 16px 20px;
  background: rgba(16, 185, 129, 0.05);
  margin: 16px 0;
}
.install-success p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}
.success-icon {
  color: rgb(16, 185, 129);
}
.copy-field { margin-top: 12px; }
.copy-field label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--vp-c-text-2);
}
.copy-row { display: flex; gap: 8px; }
.copy-row .input { flex: 1; }

.simple-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
  padding: 12px 16px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
}
.link-btn {
  background: none;
  border: none;
  color: var(--vp-c-brand);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.link-btn:hover { text-decoration: underline; }
.link-btn-sm {
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  font-size: 12px;
  cursor: pointer;
}
.link-btn-sm:hover { color: var(--vp-c-text-1); }

.config-preview {
  max-height: 300px;
  overflow: auto;
  font-size: 11px;
  font-family: var(--vp-font-family-mono);
  background: #0d0e12 !important;
  color: #abb2bf;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #1e1e24 !important;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Advanced mode */
.advanced-mode { }
.adv-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
@media (min-width: 960px) {
  .adv-grid {
    grid-template-columns: 1.2fr 0.8fr;
  }
}
.adv-form { display: flex; flex-direction: column; gap: 16px; }
.adv-preview { display: flex; flex-direction: column; gap: 16px; }

.adv-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 20px;
  background: var(--vp-c-bg);
}
.adv-card h3 {
  margin: 0 0 8px 0;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.adv-card h3 svg {
  color: var(--vp-c-brand);
}
.adv-card label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--vp-c-text-2);
}
.muted { color: var(--vp-c-text-2); font-size: 13px; }
.small { font-size: 11px; }

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.header-actions { display: flex; gap: 6px; }

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 12px;
}
.preset-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  text-align: left;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.preset-card:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-alt);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.preset-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--vp-c-brand) 10%, transparent);
  color: var(--vp-c-brand);
  margin-bottom: 8px;
}
.preset-name { font-weight: 600; font-size: 13px; }
.preset-blurb { font-size: 11px; color: var(--vp-c-text-3); }

.lang-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.chip.active {
  background: var(--vp-c-brand);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand);
}

.strict-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}
.strict-card {
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}
.strict-card.active {
  border-color: rgb(16, 185, 129);
  background: rgba(16, 185, 129, 0.05);
}
.strict-card strong { font-size: 13px; display: block; }
.strict-card p { font-size: 11px; color: var(--vp-c-text-3); margin: 4px 0 0 0; }

.scraper-search-row {
  display: flex;
  gap: 6px;
  margin: 12px 0;
}
.scraper-search-row .input { flex: 1; }

.addon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 6px;
  margin-top: 8px;
}
.addon-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  opacity: 0.85;
}
.addon-card:hover { opacity: 1; border-color: var(--vp-c-brand); }
.addon-card.on {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(16, 185, 129, 0.05);
  opacity: 1;
}
.addon-name { font-size: 13px; font-weight: 500; }
.addon-type { font-size: 10px; color: var(--vp-c-text-3); }
.addon-cat {
  display: inline-block;
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 999px;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 4px;
  align-self: flex-start;
}
.addon-cat.p2p { background: rgba(16, 185, 129, 0.1); color: rgb(16, 185, 129); }
.addon-cat.http { background: rgba(245, 158, 11, 0.1); color: rgb(245, 158, 11); }
.addon-cat.subs { background: rgba(59, 130, 246, 0.1); color: rgb(59, 130, 246); }

.collapsible-card { cursor: pointer; }
.collapsible-card summary { list-style: none; }
.collapsible-card summary::-webkit-details-marker { display: none; }

.checkbox-row {
  display: flex !important;
  align-items: center;
  gap: 8px;
  margin-top: 12px !important;
  cursor: pointer;
}

.slider { width: 100%; margin-top: 8px; }

.status-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
}
.auto-sync {
  margin-left: auto;
  font-size: 12px;
  color: var(--vp-c-text-3);
}
.sync-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}
.sync-status.active {
  color: rgb(16, 185, 129);
}
.sync-status svg {
  color: currentColor;
}

.config-card {
  padding: 0;
}
.config-card .card-header-row {
  padding: 16px 20px 0 20px;
}
.config-block {
  max-height: 400px;
  overflow: auto;
  font-size: 11px;
  font-family: var(--vp-font-family-mono);
  background: #0d0e12 !important;
  color: #abb2bf;
  padding: 16px;
  border-radius: 12px;
  border: none;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 12px 16px 16px 16px;
}
.config-block :deep(.json-key), .config-preview :deep(.json-key) {
  color: #e06c75;
  font-weight: 600;
}
.config-block :deep(.json-string), .config-preview :deep(.json-string) {
  color: #98c379;
}
.config-block :deep(.json-number), .config-preview :deep(.json-number) {
  color: #d19a66;
}
.config-block :deep(.json-boolean), .config-preview :deep(.json-boolean) {
  color: #56b6c2;
}
.config-block :deep(.json-null), .config-preview :deep(.json-null) {
  color: #abb2bf;
}

.loading-skeleton {
  height: 200px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  animation: pulse 2s infinite;
  margin: 12px 16px 16px 16px;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.callout {
  padding: 12px 16px;
  border-radius: 8px;
  margin: 12px 0;
  font-size: 14px;
}
.callout-warn {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: rgb(245, 158, 11);
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-2);
}
.loading-spinner {
  color: var(--vp-c-brand);
  margin-right: 8px;
}

/* Spinner animation */
.spin-icon {
  animation: spin 1s linear infinite;
  transform-origin: center;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
</style>
