/** Conversation shell backdrop layout contract. */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(
  fileURLToPath(new URL('../src/client/skeleton/ConversationRoot.module.css', import.meta.url)),
  'utf8',
)

/**
 * Declarations of one exact selector, keyed by property.
 * @param selector - exact selector text.
 * @returns the normalized declarations, or undefined when absent.
 */
function declarations(selector: string): Map<string, string> | undefined {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, ' ')
  for (const [, selectorList = '', body = ''] of withoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!selectorList.split(',').map(value => value.trim()).includes(selector)) continue
    const found = new Map<string, string>()
    for (const part of body.split(';')) {
      const colon = part.indexOf(':')
      if (colon === -1) continue
      found.set(part.slice(0, colon).trim(), part.slice(colon + 1).trim().replace(/\s+/g, ' '))
    }
    return found
  }
  return undefined
}

describe('ConversationRoot.module.css', () => {
  it('clips a non-interactive backdrop below the resident content', () => {
    const root = declarations('.root')
    expect(root?.get('position')).toBe('relative')
    expect(root?.get('background')).toBe('var(--dsw-alias-bg-base)')
    const backdrop = declarations('.backdropArea')
    expect(backdrop?.get('position')).toBe('absolute')
    expect(backdrop?.get('inset')).toBe('0')
    expect(backdrop?.get('overflow')).toBe('hidden')
    expect(backdrop?.get('pointer-events')).toBe('none')
    expect(backdrop?.get('z-index')).toBe('0')
    const content = declarations('.contentLayer')
    expect(content?.get('position')).toBe('relative')
    expect(content?.has('z-index')).toBe(false)
  })

  it('lets a theme replace the composer dock mask without changing its geometry', () => {
    const composer = declarations(".root[data-phase='active'] .composerSeat")
    expect(composer?.get('position')).toBe('sticky')
    expect(composer?.get('bottom')).toBe('0')
    expect(composer?.get('background')).toContain(
      '--dsw-specific-conversation-composer-dock-background',
    )
    expect(composer?.get('background')).toContain('var(--dsw-alias-bg-base) 36px')
  })
})
