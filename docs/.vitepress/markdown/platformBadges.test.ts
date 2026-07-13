import assert from 'node:assert/strict'
import test from 'node:test'
import { platformBadges } from './platformBadges.mts'

function renderBadge(source: string) {
  let rule: (state: any, silent: boolean) => boolean = () => false
  platformBadges({
    inline: {
      ruler: {
        after(_anchor: string, _name: string, callback: typeof rule) {
          rule = callback
        }
      }
    }
  } as any)

  const tokens: Array<{ content?: string }> = []
  const state = {
    src: source,
    pos: 0,
    push() {
      const token = {}
      tokens.push(token)
      return token
    }
  }

  return rule(state, false) ? tokens[0]?.content : undefined
}

test('renders the Windows-only badge', () => {
  assert.equal(
    renderBadge('[windows only]'),
    '<span class="platform-badge platform-badge--windows">Windows only</span>'
  )
})

test('renders any supported two-platform combination', () => {
  assert.equal(
    renderBadge('[android tv windows]'),
    '<span class="platform-badge platform-badge--multi" style="--platform-color: #1e7de5">Android TV and Windows only</span>'
  )
  assert.equal(
    renderBadge('[ios tizen]'),
    '<span class="platform-badge platform-badge--multi" style="--platform-color: #4681ce">iOS and Tizen only</span>'
  )
  assert.equal(
    renderBadge('[webos android mobile]'),
    '<span class="platform-badge platform-badge--multi" style="--platform-color: #7c7371">WebOS and Android Mobile only</span>'
  )
})

test('renders combinations of more than two platforms', () => {
  assert.equal(
    renderBadge('[windows ios android tv]'),
    '<span class="platform-badge platform-badge--multi" style="--platform-color: #4272eb">Windows, iOS, and Android TV only</span>'
  )
})

test('leaves unknown or duplicate combinations unchanged', () => {
  assert.equal(renderBadge('[windows linux]'), undefined)
  assert.equal(renderBadge('[ios ios]'), undefined)
})
