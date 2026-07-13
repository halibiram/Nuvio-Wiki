import type MarkdownIt from 'markdown-it'
import type StateInline from 'markdown-it/lib/rules_inline/state_inline.mjs'

interface PlatformBadge {
  className: string
  label: string
  color?: string
}

const badges: Record<string, PlatformBadge> = {
  'android tv only': { className: 'android-tv', label: 'Android TV only' },
  'tv only': { className: 'android-tv', label: 'Android TV only' },
  'android mobile only': { className: 'android-mobile', label: 'Android Mobile only' },
  'mobile only': { className: 'mobile', label: 'Mobile only' },
  'ios only': { className: 'ios', label: 'iOS only' },
  'webos only': { className: 'webos', label: 'WebOS only' },
  'web os only': { className: 'webos', label: 'WebOS only' },
  'tizen only': { className: 'tizen', label: 'Tizen only' },
  'windows only': { className: 'windows', label: 'Windows only' },
  'tv optimized': { className: 'android-tv', label: 'TV optimized' },
  'required for mobile': { className: 'mobile', label: 'Required for mobile' },
  'required for mobile only': { className: 'mobile', label: 'Required for mobile' }
}

const platformAliases = [
  { alias: 'android mobile', label: 'Android Mobile', color: '#16a36a' },
  { alias: 'android tv', label: 'Android TV', color: '#3b82f6' },
  { alias: 'web os', label: 'WebOS', color: '#e14377' },
  { alias: 'windows', label: 'Windows', color: '#0078d4' },
  { alias: 'mobile', label: 'Mobile', color: '#16a36a' },
  { alias: 'webos', label: 'WebOS', color: '#e14377' },
  { alias: 'tizen', label: 'Tizen', color: '#00a6a6' },
  { alias: 'ios', label: 'iOS', color: '#8b5cf6' },
  { alias: 'tv', label: 'Android TV', color: '#3b82f6' }
]

function formatPlatformList(labels: string[]) {
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`
  return `${labels.slice(0, -1).join(', ')}, and ${labels.at(-1)}`
}

function mixPlatformColors(colors: string[]) {
  const totals = colors.reduce(
    (sum, color) => {
      sum.red += Number.parseInt(color.slice(1, 3), 16)
      sum.green += Number.parseInt(color.slice(3, 5), 16)
      sum.blue += Number.parseInt(color.slice(5, 7), 16)
      return sum
    },
    { red: 0, green: 0, blue: 0 }
  )
  const hex = (value: number) => Math.round(value / colors.length).toString(16).padStart(2, '0')
  return `#${hex(totals.red)}${hex(totals.green)}${hex(totals.blue)}`
}

function parsePlatformCombination(value: string): PlatformBadge | undefined {
  let remaining = value
    .trim()
    .toLowerCase()
    .replace(/\bonly$/, '')
    .replace(/\s+/g, ' ')
    .trim()
  const labels: string[] = []
  const colors: string[] = []

  while (remaining) {
    const platform = platformAliases.find(({ alias }) => remaining === alias || remaining.startsWith(`${alias} `))
    if (!platform || labels.includes(platform.label)) return undefined

    labels.push(platform.label)
    colors.push(platform.color)
    remaining = remaining.slice(platform.alias.length).trim()
  }

  if (labels.length < 2) return undefined
  return {
    className: 'multi',
    label: `${formatPlatformList(labels)} only`,
    color: mixPlatformColors(colors)
  }
}

export function platformBadges(md: MarkdownIt) {
  md.inline.ruler.after('link', 'platform-badge', (state: StateInline, silent: boolean) => {
    const match = state.src.slice(state.pos).match(/^\[([^\]\r\n]+)\]/)
    if (!match) return false

    const normalizedLabel = match[1].trim().toLowerCase()
    const badge = badges[normalizedLabel] ?? parsePlatformCombination(normalizedLabel)
    if (!badge) return false

    if (!silent) {
      const token = state.push('html_inline', '', 0)
      const style = badge.color ? ` style="--platform-color: ${badge.color}"` : ''
      token.content = `<span class="platform-badge platform-badge--${badge.className}"${style}>${badge.label}</span>`
    }

    state.pos += match[0].length
    return true
  })
}
