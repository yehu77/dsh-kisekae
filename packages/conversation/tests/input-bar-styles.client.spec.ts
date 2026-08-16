/** Composer card decoration layout contract. */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(
  fileURLToPath(new URL('../src/client/skeleton/InputBar.module.css', import.meta.url)),
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

describe('InputBar.module.css', () => {
  it('clips a non-interactive decoration below the official card content', () => {
    const card = declarations('.card')
    expect(card?.get('position')).toBe('relative')
    expect(card?.get('background')).toBe('var(--dsw-specific-input-major)')
    expect(card?.get('border-radius')).toBe('22px')
    const decoration = declarations('.cardDecoration')
    expect(decoration?.get('position')).toBe('absolute')
    expect(decoration?.get('inset')).toBe('0')
    expect(decoration?.get('overflow')).toBe('hidden')
    expect(decoration?.get('border-radius')).toBe('inherit')
    expect(decoration?.get('pointer-events')).toBe('none')
    expect(decoration?.get('z-index')).toBe('0')
    const content = declarations('.cardContent')
    expect(content?.get('position')).toBe('relative')
    expect(content?.has('z-index')).toBe(false)
  })
})
