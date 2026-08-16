/** Selective message prose presentation over a decorative backdrop. */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const TOKEN = 'var(--dsw-specific-conversation-transcript-text-shadow)'
const HANDOFF = '--dsl-message-text-shadow'
const ASSISTANT_PROSE_COLOR_TOKEN = 'var(--dsw-specific-conversation-assistant-message-prose-color)'
const ASSISTANT_PROSE_SHADOW_TOKEN = 'var(--dsw-specific-conversation-assistant-message-prose-text-shadow)'
const USER_PROSE_COLOR_TOKEN = 'var(--dsw-specific-conversation-user-message-prose-color)'
const USER_PROSE_SHADOW_TOKEN = 'var(--dsw-specific-conversation-user-message-prose-text-shadow)'
const LEGACY_PROSE_COLOR_TOKEN = '--dsw-specific-conversation-message-prose-color'
const PROSE_COLOR_HANDOFF = '--dsl-message-text-color'
const PROSE_WEIGHT_TOKEN = 'var(--dsw-specific-conversation-message-prose-font-weight)'
const PROSE_WEIGHT_HANDOFF = '--dsl-message-text-font-weight'

function read(name: string): string {
  return readFileSync(fileURLToPath(new URL(`../src/client/chat/${name}`, import.meta.url)), 'utf8')
}

function declarations(css: string, selector: string): Map<string, string> | undefined {
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

function expectShadow(css: string, selectors: readonly string[]): void {
  for (const selector of selectors) expect(declarations(css, selector)?.get('text-shadow')).toBe(TOKEN)
}

describe('conversation transcript text shadow', () => {
  const assistant = read('AssistantMarkdown.module.css')
  const chat = read('ChatView.module.css')
  const command = read('GenericCommandCard.module.css')
  const context = read('ContextInjectionRow.module.css')
  const contextSource = read('ContextInjectionRow.tsx')
  const message = read('MessageItem.module.css')
  const reasoning = read('ReasoningRow.module.css')
  const stats = read('StatsLine.module.css')

  it('opts user and assistant message text into role-specific primitive handoffs', () => {
    expect(declarations(assistant, '.root')?.get(HANDOFF)).toBe(ASSISTANT_PROSE_SHADOW_TOKEN)
    expect(declarations(message, '.bubble')?.get(HANDOFF)).toBe(USER_PROSE_SHADOW_TOKEN)
    expect(declarations(message, '.compactionBody')?.get(HANDOFF)).toBe(TOKEN)
    expectShadow(message, ['.refChip'])
  })

  it('limits prose color and weight to user and assistant message owners', () => {
    expect(declarations(assistant, '.root')?.get(PROSE_COLOR_HANDOFF))
      .toBe(ASSISTANT_PROSE_COLOR_TOKEN)
    expect(declarations(assistant, '.root')?.get(PROSE_WEIGHT_HANDOFF)).toBe(PROSE_WEIGHT_TOKEN)
    expect(declarations(message, '.bubble')?.get(PROSE_COLOR_HANDOFF)).toBe(USER_PROSE_COLOR_TOKEN)
    expect(declarations(message, '.bubble')?.get(PROSE_WEIGHT_HANDOFF)).toBe(PROSE_WEIGHT_TOKEN)

    expect(assistant.split(ASSISTANT_PROSE_COLOR_TOKEN)).toHaveLength(2)
    expect(assistant.split(ASSISTANT_PROSE_SHADOW_TOKEN)).toHaveLength(2)
    expect(assistant.split(PROSE_WEIGHT_TOKEN)).toHaveLength(2)
    expect(message.split(USER_PROSE_COLOR_TOKEN)).toHaveLength(2)
    expect(message.split(USER_PROSE_SHADOW_TOKEN)).toHaveLength(2)
    expect(message.split(PROSE_WEIGHT_TOKEN)).toHaveLength(2)
    expect(assistant).not.toContain(USER_PROSE_COLOR_TOKEN)
    expect(assistant).not.toContain(USER_PROSE_SHADOW_TOKEN)
    expect(message).not.toContain(ASSISTANT_PROSE_COLOR_TOKEN)
    expect(message).not.toContain(ASSISTANT_PROSE_SHADOW_TOKEN)
    expect(assistant).not.toContain(LEGACY_PROSE_COLOR_TOKEN)
    expect(message).not.toContain(LEGACY_PROSE_COLOR_TOKEN)
    for (const selector of ['.compactionBody', '.retryText', '.retryDetails', '.turnErrorCopy']) {
      expect(declarations(message, selector)?.has(PROSE_COLOR_HANDOFF)).toBe(false)
      expect(declarations(message, selector)?.has(PROSE_WEIGHT_HANDOFF)).toBe(false)
    }
    for (const css of [chat, command, context, reasoning, stats]) {
      expect(css).not.toContain(ASSISTANT_PROSE_COLOR_TOKEN)
      expect(css).not.toContain(USER_PROSE_COLOR_TOKEN)
      expect(css).not.toContain(LEGACY_PROSE_COLOR_TOKEN)
      expect(css).not.toContain(PROSE_WEIGHT_TOKEN)
    }
  })

  it('covers unframed context, status, error, reasoning, and command copy', () => {
    expectShadow(chat, ['.turnStatus', '.hint', '.openError'])
    expectShadow(message, [
      '.compactionTitle', '.compactionSummary', '.retryText', '.retryDetails', '.turnErrorCopy',
    ])
    expectShadow(context, ['.title', '.source', '.summary'])
    expect(contextSource).toContain('titleClassName={css.title}')
    expectShadow(reasoning, ['.title', '.summary', '.thinkBody'])
    expectShadow(command, ['.title', '.summary'])
    expectShadow(stats, ['.root'])
  })

  it('does not inherit the shadow from a transcript-wide ancestor or paint it on code and controls', () => {
    for (const selector of ['.column', '.flowItem', '.older', '.toBottom']) {
      expect(declarations(chat, selector)?.has('text-shadow')).toBe(false)
    }
    for (const selector of ['.compactionButton', '.turnErrorCode', '.contextRow']) {
      expect(declarations(message, selector)?.has('text-shadow')).toBe(false)
    }
    expect(declarations(context, '.body')?.has('text-shadow')).toBe(false)
    expect(declarations(assistant, '.stopped')?.has('text-shadow')).toBe(false)
    expect(declarations(command, '.body')?.has('text-shadow')).toBe(false)
  })
})
