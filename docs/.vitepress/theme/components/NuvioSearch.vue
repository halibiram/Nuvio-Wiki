<script setup lang="ts">
/**
 * NuvioSearch — Nuvio-style command palette / search modal.
 *
 * Uses the VitePress local-search virtual module (`@localSearchIndex`) and
 * MiniSearch for indexing, exactly the same way the built-in
 * `VPLocalSearchBox` does it.
 *
 * Visual design mirrors Nuvio's docs site:
 *   – dark backdrop with blur
 *   – centred rounded shell
 *   – search bar with icon + input + ESC badge
 *   – result cards with breadcrumb trail, # title, excerpts
 *   – keyboard footer
 */
import localSearchIndex from '@localSearchIndex'
import {
  computedAsync,
  debouncedWatch,
  onKeyStroke,
  useEventListener,
  useScrollLock,
  useSessionStorage
} from '@vueuse/core'
import Mark from 'mark.js'
import MiniSearch, { type SearchResult } from 'minisearch'
import { dataSymbol, inBrowser, useRouter } from 'vitepress'
import {
  computed,
  createApp,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type Ref
} from 'vue'
import { useData } from 'vitepress'

/* ── Inline Helpers (copied from VitePress to avoid internal imports) ── */

class LRUCache<K, V> {
  max: number
  cache: Map<K, V>
  constructor(max = 10) {
    this.max = max
    this.cache = new Map()
  }
  get(key: K) {
    let item = this.cache.get(key)
    if (item !== undefined) {
      this.cache.delete(key)
      this.cache.set(key, item)
    }
    return item
  }
  set(key: K, val: V) {
    if (this.cache.has(key)) this.cache.delete(key)
    else if (this.cache.size === this.max) this.cache.delete(this.first()!)
    this.cache.set(key, val)
  }
  first() {
    return this.cache.keys().next().value
  }
  clear() {
    this.cache.clear()
  }
}

const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g
const DRIVE_LETTER_REGEX = /^[a-z]:/i
function sanitizeFileName(name: string) {
  const match = DRIVE_LETTER_REGEX.exec(name)
  const driveLetter = match ? match[0] : ''
  return (
    driveLetter +
    name
      .slice(driveLetter.length)
      .replace(INVALID_CHAR_REGEX, '_')
      .replace(/(^|\/)_+(?=[^/]*$)/, '$1')
  )
}

function escapeRegExp(str: string) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
}

declare const __VP_HASH_MAP__: Record<string, string>
declare const __ASSETS_DIR__: string

function pathToFile(path: string) {
  let pagePath = path.replace(/\.html$/, '')
  pagePath = decodeURIComponent(pagePath)
  pagePath = pagePath.replace(/\/$/, '/index') // /foo/ -> /foo/index
  if (import.meta.env.DEV) {
    pagePath += `.md?t=${Date.now()}`
  } else {
    if (inBrowser) {
      const base = import.meta.env.BASE_URL
      pagePath =
        sanitizeFileName(
          pagePath.slice(base.length).replace(/\//g, '_') || 'index'
        ) + '.md'
      let pageHash = typeof __VP_HASH_MAP__ !== 'undefined' ? __VP_HASH_MAP__[pagePath.toLowerCase()] : ''
      if (!pageHash) {
        pagePath = pagePath.endsWith('_index.md')
          ? pagePath.slice(0, -9) + '.md'
          : pagePath.slice(0, -3) + '_index.md'
        pageHash = typeof __VP_HASH_MAP__ !== 'undefined' ? __VP_HASH_MAP__[pagePath.toLowerCase()] : ''
      }
      if (!pageHash) return null
      const assetsDir = typeof __ASSETS_DIR__ !== 'undefined' ? __ASSETS_DIR__ : 'assets'
      pagePath = `${base}${assetsDir}/${pagePath}.${pageHash}.js`
    } else {
      pagePath = `./${sanitizeFileName(pagePath.slice(1).replace(/\//g, '_'))}.md.js`
    }
  }
  return pagePath
}

/* ── Props / Emits ──────────────────────────────────────────────────────── */
defineProps<{ isDutch?: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

/* ── Refs ────────────────────────────────────────────────────────────────── */
const el = shallowRef<HTMLElement>()
const resultsEl = shallowRef<HTMLElement>()
const searchInput = ref<HTMLInputElement>()

/* ── Search index (same approach as VitePress) ──────────────────────────── */
interface Result { title: string; titles: string[]; text?: string }

const searchIndexData = shallowRef(localSearchIndex)

if (import.meta.hot) {
  import.meta.hot.accept('@localSearchIndex', (m) => {
    if (m) searchIndexData.value = m.default
  })
}

const vitePressData = useData()
const { localeIndex, theme } = vitePressData

const searchIndex = computedAsync(async () =>
  markRaw(
    MiniSearch.loadJSON<Result>(
      (await searchIndexData.value[localeIndex.value]?.())?.default,
      {
        fields: ['title', 'titles', 'text'],
        storeFields: ['title', 'titles'],
        searchOptions: {
          fuzzy: 0.2,
          prefix: true,
          boost: { title: 4, text: 2, titles: 1 },
          ...(theme.value.search?.provider === 'local' &&
            theme.value.search.options?.miniSearch?.searchOptions)
        },
        ...(theme.value.search?.provider === 'local' &&
          theme.value.search.options?.miniSearch?.options)
      }
    )
  )
)

/* ── Filter text ────────────────────────────────────────────────────────── */
const filterText = useSessionStorage('vitepress:local-search-filter', '')

/* ── Results ────────────────────────────────────────────────────────────── */
const results: Ref<(SearchResult & Result)[]> = shallowRef([])
const enableNoResults = ref(false)

watch(filterText, () => { enableNoResults.value = false })

const mark = computedAsync(async () => {
  if (!resultsEl.value) return
  return markRaw(new Mark(resultsEl.value))
}, null)

const cache = new LRUCache<string, Map<string, string>>(16)

debouncedWatch(
  () => [searchIndex.value, filterText.value] as const,
  async ([index, filterTextValue], old, onCleanup) => {
    if (old?.[0] !== index) cache.clear()

    let canceled = false
    onCleanup(() => { canceled = true })
    if (!index) return

    results.value = index
      .search(filterTextValue)
      .slice(0, 16) as (SearchResult & Result)[]
    enableNoResults.value = true

    // Fetch excerpts
    const mods = await Promise.all(results.value.map((r) => fetchExcerpt(r.id)))
    if (canceled) return

    for (const { id, mod } of mods) {
      const mapId = id.slice(0, id.indexOf('#'))
      let map = cache.get(mapId)
      if (map) continue
      map = new Map()
      cache.set(mapId, map)
      const comp = mod.default ?? mod
      if (comp?.render || comp?.setup) {
        const app = createApp(comp)
        app.config.warnHandler = () => {}
        app.provide(dataSymbol, vitePressData)
        Object.defineProperties(app.config.globalProperties, {
          $frontmatter: { get() { return vitePressData.frontmatter.value } },
          $params: { get() { return vitePressData.page.value.params } }
        })
        const div = document.createElement('div')
        app.mount(div)
        const headings = div.querySelectorAll('h1, h2, h3, h4, h5, h6')
        headings.forEach((el) => {
          const href = el.querySelector('a')?.getAttribute('href')
          const anchor = href?.startsWith('#') && href.slice(1)
          if (!anchor) return
          let html = ''
          while ((el = el.nextElementSibling!) && !/^h[1-6]$/i.test(el.tagName))
            html += el.outerHTML
          map!.set(anchor, html)
        })
        app.unmount()
      }
      if (canceled) return
    }

    const terms = new Set<string>()
    results.value = results.value.map((r) => {
      const [id, anchor] = r.id.split('#')
      const map = cache.get(id)
      const text = map?.get(anchor) ?? ''
      for (const term in r.match) terms.add(term)
      return { ...r, text }
    })

    await nextTick()
    if (canceled) return

    await new Promise((r) => {
      mark.value?.unmark({
        done: () => {
          mark.value?.markRegExp(formMarkRegex(terms), { done: r })
        }
      })
    })

    const excerpts = el.value?.querySelectorAll('.nuvio-search-result .nuvio-search-excerpt') ?? []
    for (const excerpt of excerpts) {
      excerpt.querySelector('mark[data-markjs="true"]')?.scrollIntoView({ block: 'center' })
    }
    resultsEl.value?.firstElementChild?.scrollIntoView({ block: 'start' })
  },
  { debounce: 200, immediate: true }
)

async function fetchExcerpt(id: string) {
  const file = pathToFile(id.slice(0, id.indexOf('#')))
  try {
    if (!file) throw new Error(`Cannot find file for id: ${id}`)
    return { id, mod: await import(/*@vite-ignore*/ file) }
  } catch (e) {
    console.error(e)
    return { id, mod: {} }
  }
}

function formMarkRegex(terms: Set<string>) {
  return new RegExp(
    [...terms]
      .sort((a, b) => b.length - a.length)
      .map((term) => `(${escapeRegExp(term)})`)
      .join('|'),
    'gi'
  )
}

/* ── Focus ──────────────────────────────────────────────────────────────── */
function focusSearchInput(select = true) {
  searchInput.value?.focus()
  select && searchInput.value?.select()
}

onMounted(() => { focusSearchInput() })

/* ── Keyboard selection ─────────────────────────────────────────────────── */
const selectedIndex = ref(-1)
const disableMouseOver = ref(true)

watch(results, (r) => {
  selectedIndex.value = r.length ? 0 : -1
  scrollToSelectedResult()
})

function scrollToSelectedResult() {
  nextTick(() => {
    const sel = document.querySelector('.nuvio-search-result.is-selected')
    sel?.scrollIntoView({ block: 'nearest' })
  })
}

onKeyStroke('ArrowUp', (event) => {
  event.preventDefault()
  selectedIndex.value--
  if (selectedIndex.value < 0) selectedIndex.value = results.value.length - 1
  disableMouseOver.value = true
  scrollToSelectedResult()
})

onKeyStroke('ArrowDown', (event) => {
  event.preventDefault()
  selectedIndex.value++
  if (selectedIndex.value >= results.value.length) selectedIndex.value = 0
  disableMouseOver.value = true
  scrollToSelectedResult()
})

const router = useRouter()

const visible = ref(true)
function close() {
  visible.value = false
}

onKeyStroke('Enter', (e) => {
  if (e.isComposing) return
  if (e.target instanceof HTMLButtonElement && e.target.type !== 'submit') return
  const selectedPackage = results.value[selectedIndex.value]
  if (e.target instanceof HTMLInputElement && !selectedPackage) {
    e.preventDefault()
    return
  }
  if (selectedPackage) {
    router.go(selectedPackage.id)
    close()
  }
})

onKeyStroke('Escape', close)

/* ── History / scroll lock ──────────────────────────────────────────────── */
onMounted(() => { window.history.pushState(null, '', null) })
useEventListener('popstate', (event) => { event.preventDefault(); close() })

const isLocked = useScrollLock(inBrowser ? document.body : null)
onMounted(() => { nextTick(() => { isLocked.value = true }) })
onBeforeUnmount(() => { isLocked.value = false })

/* ── Mouse ──────────────────────────────────────────────────────────────── */
function onMouseMove(e: MouseEvent) {
  if (!disableMouseOver.value) return
  const target = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('.nuvio-search-result')
  const index = Number.parseInt(target?.dataset.index!)
  if (index >= 0 && index !== selectedIndex.value) selectedIndex.value = index
  disableMouseOver.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="nuvio-search" appear :duration="{ enter: 200, leave: 150 }" @after-leave="$emit('close')">
      <div v-if="visible" ref="el" class="nuvio-search-overlay" role="dialog" aria-modal="true" aria-label="Search">
        <!-- Backdrop -->
        <div class="nuvio-search-backdrop" @click="close" />

        <!-- Shell -->
        <div class="nuvio-search-shell">
          <!-- Search bar -->
          <div class="nuvio-search-bar">
            <svg class="nuvio-search-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            <input
              ref="searchInput"
              v-model="filterText"
              class="nuvio-search-input"
              :placeholder="isDutch ? 'Zoek in de wiki...' : 'Search the wiki...'"
              type="search"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              maxlength="64"
              enterkeyhint="go"
            />
            <kbd class="nuvio-search-esc" @click="close">ESC</kbd>
          </div>

          <!-- Results -->
          <ul
            ref="resultsEl"
            class="nuvio-search-results"
            @mousemove="onMouseMove"
          >
            <li v-for="(p, index) in results" :key="p.id">
              <a
                :href="p.id"
                class="nuvio-search-result"
                :class="{ 'is-selected': selectedIndex === index }"
                :aria-label="[...p.titles, p.title].join(' > ')"
                :data-index="index"
                @mouseenter="!disableMouseOver && (selectedIndex = index)"
                @focusin="selectedIndex = index"
                @click="close"
              >
                <div class="nuvio-search-result-inner">
                  <!-- Breadcrumb titles -->
                  <div class="nuvio-search-titles">
                    <span
                      v-for="(t, tIdx) in p.titles"
                      :key="tIdx"
                      class="nuvio-search-breadcrumb"
                    >
                      <span v-html="t" />
                      <svg class="nuvio-search-chevron" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m9 6 6 6-6 6" />
                      </svg>
                    </span>
                    <span class="nuvio-search-title-main">
                      <span v-html="p.title" />
                    </span>
                  </div>

                  <!-- Excerpt -->
                  <div v-if="p.text" class="nuvio-search-excerpt-wrap">
                    <div class="nuvio-search-excerpt vp-doc" inert v-html="p.text" />
                  </div>
                </div>
              </a>
            </li>

            <!-- No results -->
            <li v-if="filterText && !results.length && enableNoResults" class="nuvio-search-no-results">
              {{ isDutch ? 'Geen resultaten voor' : 'No results for' }}
              "<strong>{{ filterText }}</strong>"
            </li>
          </ul>

          <!-- Keyboard hints footer -->
          <div class="nuvio-search-footer">
            <span class="nuvio-search-hint">
              <kbd><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg></kbd>
              <kbd><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></kbd>
              {{ isDutch ? 'navigeren' : 'to navigate' }}
            </span>
            <span class="nuvio-search-hint">
              <kbd><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg></kbd>
              {{ isDutch ? 'selecteren' : 'to select' }}
            </span>
            <span class="nuvio-search-hint">
              <kbd>esc</kbd>
              {{ isDutch ? 'sluiten' : 'to close' }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Overlay ──────────────────────────────────────────────────────────── */
.nuvio-search-overlay {
  position: fixed;
  z-index: 200;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

/* ── Backdrop ─────────────────────────────────────────────────────────── */
.nuvio-search-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.dark .nuvio-search-backdrop {
  background: rgba(3, 7, 18, 0.45);
}

/* ── Shell ─────────────────────────────────────────────────────────────── */
.nuvio-search-shell {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(100vw - 40px, 680px);
  max-height: min(100vh - 160px, 600px);
  margin-top: 120px;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}



/* ── Search bar ───────────────────────────────────────────────────────── */
.nuvio-search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.nuvio-search-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.8;
}

.nuvio-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  font-size: 18px;
  color: var(--vp-c-text-1);
  padding: 0;
  margin: 0;
}

.nuvio-search-input::placeholder {
  color: var(--vp-c-text-3);
  opacity: 0.6;
}

.nuvio-search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  display: none;
}

.nuvio-search-esc {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 11px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  padding: 4px 8px;
  background: var(--vp-c-bg-soft);
  text-transform: uppercase;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.15s ease;
}

.nuvio-search-esc:hover {
  opacity: 1;
}

/* ── Results ──────────────────────────────────────────────────────────── */
.nuvio-search-results {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 8px 0;
  margin: 0;
  list-style: none;
  max-height: 420px;
  scrollbar-width: thin;
  scrollbar-color: var(--vp-c-border) transparent;
}

.nuvio-search-results::-webkit-scrollbar {
  width: 6px;
}

.nuvio-search-results::-webkit-scrollbar-track {
  background: transparent;
}

.nuvio-search-results::-webkit-scrollbar-thumb {
  background: var(--vp-c-border);
  border-radius: 3px;
}

.nuvio-search-results::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

.nuvio-search-results li {
  margin: 4px 12px;
  padding: 0;
  list-style-type: none;
}

/* ── Result card ──────────────────────────────────────────────────────── */
.nuvio-search-result {
  display: block;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s ease, border-color 0.15s ease;
  outline: none;
}

.nuvio-search-result:hover,
.nuvio-search-result.is-selected {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  text-decoration: none;
}

.nuvio-search-result-inner {
  width: 100%;
  overflow: hidden;
}

/* ── Breadcrumb titles ────────────────────────────────────────────────── */
.nuvio-search-titles {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  margin-bottom: 4px;
  line-height: 1.4;
}

.nuvio-search-breadcrumb {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nuvio-search-chevron {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  margin: 0 2px;
  opacity: 0.5;
}

.nuvio-search-title-main {
  display: block;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-top: 2px;
}

.nuvio-search-title-main::before {
  content: "# ";
  color: var(--vp-c-text-3);
  font-weight: bold;
  margin-right: 4px;
  opacity: 0.6;
}

.nuvio-search-result.is-selected .nuvio-search-title-main,
.nuvio-search-result:hover .nuvio-search-title-main {
  color: var(--vp-c-brand-1);
}

.nuvio-search-result.is-selected .nuvio-search-title-main::before,
.nuvio-search-result:hover .nuvio-search-title-main::before {
  color: var(--vp-c-brand-1);
  opacity: 1;
}

/* ── Excerpt ──────────────────────────────────────────────────────────── */
.nuvio-search-excerpt-wrap {
  margin-top: 6px;
  position: relative;
}

.nuvio-search-excerpt {
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  overflow: hidden;
  max-height: 80px;
  pointer-events: none;
  opacity: 0.65;
}

.nuvio-search-result.is-selected .nuvio-search-excerpt {
  opacity: 1;
}

.nuvio-search-excerpt :deep(*) {
  font-size: 13px !important;
  line-height: 1.5 !important;
}

.nuvio-search-excerpt :deep(p) {
  margin: 4px 0 !important;
}

/* ── Marks (highlights) ───────────────────────────────────────────────── */
.nuvio-search-titles :deep(mark),
.nuvio-search-excerpt :deep(mark) {
  background: transparent;
  color: var(--vp-c-brand-1);
  font-weight: 700;
  padding: 0;
}

.nuvio-search-result.is-selected :deep(mark),
.nuvio-search-result:hover :deep(mark) {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* ── No results ───────────────────────────────────────────────────────── */
.nuvio-search-no-results {
  padding: 32px 16px;
  text-align: center;
  font-size: 14px;
  color: var(--vp-c-text-3);
}

/* ── Footer keyboard hints ────────────────────────────────────────────── */
.nuvio-search-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 10px 16px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 12px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.nuvio-search-hint {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nuvio-search-footer kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 2px 5px;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 10px;
  line-height: 1;
  text-align: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
}

.nuvio-search-footer kbd svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ── Mobile ───────────────────────────────────────────────────────────── */
@media (max-width: 767px) {
  .nuvio-search-shell {
    width: calc(100vw - 16px);
    height: auto;
    max-height: calc(100dvh - 32px);
    margin-top: 16px;
    border-radius: 12px;
    border: 1px solid var(--vp-c-border);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  .nuvio-search-results {
    max-height: calc(100dvh - 120px);
  }

  .nuvio-search-footer {
    display: none;
  }
}

/* ── Reduced motion ───────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
}
</style>

<style>
/* Global styles for search transitions to support Teleport */
.nuvio-search-enter-active {
  /* Parent container transitions instantly to display the backdrop & content animation */
}

.nuvio-search-leave-active {
  /* Parent container transitions instantly to display the backdrop & content animation */
}

.nuvio-search-enter-active .nuvio-search-backdrop {
  animation: nuvio-search-backdrop-in 200ms ease-out forwards;
}

.nuvio-search-leave-active .nuvio-search-backdrop {
  animation: nuvio-search-backdrop-out 150ms ease-in forwards;
}

.nuvio-search-enter-active .nuvio-search-shell {
  animation: nuvio-search-content-in 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.nuvio-search-leave-active .nuvio-search-shell {
  animation: nuvio-search-content-out 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes nuvio-search-backdrop-in {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
}

@keyframes nuvio-search-backdrop-out {
  from {
    opacity: 1;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  to {
    opacity: 0;
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
  }
}

@keyframes nuvio-search-content-in {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes nuvio-search-content-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
}
</style>
