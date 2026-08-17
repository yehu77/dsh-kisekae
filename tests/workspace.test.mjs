import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

async function json(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'))
}

test('keeps two plugin packages and one private desktop app', async () => {
  const [root, theme, conversation, desktop] = await Promise.all([
    json('../package.json'),
    json('../packages/theme/package.json'),
    json('../packages/conversation/package.json'),
    json('../apps/desktop/package.json'),
  ])

  assert.equal(root.private, true)
  assert.equal(theme.name, '@yehu77/dsh-kisekae')
  assert.equal(conversation.name, '@deepseek-ai/dsh-client-ui-conversation')
  assert.equal(desktop.name, '@yehu77/dsh-kisekae-desktop')
  assert.equal(desktop.private, true)
  assert.equal(desktop.dsh, undefined)
  assert.ok(theme.dsh.client.inject.includes(conversation.name))
  assert.equal(theme.scripts.prepare, undefined)
  assert.equal(conversation.scripts.prepare, undefined)
})

test('keeps theme typography values out of the replacement package', async () => {
  const [themeSource, conversationManifest] = await Promise.all([
    readFile(
      new URL(
        '../packages/theme/src/client/themes/deepseek-blue-whale-chan.ts',
        import.meta.url,
      ),
      'utf8',
    ),
    json('../packages/conversation/package.json'),
  ])

  assert.match(
    themeSource,
    /--dsw-specific-conversation-assistant-message-prose-text-shadow/,
  )
  assert.match(
    themeSource,
    /--dsw-specific-conversation-user-message-prose-color/,
  )
  assert.equal(JSON.stringify(conversationManifest).includes('@yehu77/dsh-kisekae'), false)
})
