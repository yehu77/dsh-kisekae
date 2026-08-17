import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

async function text(path) {
  return readFile(join(root, path), 'utf8')
}

test('keeps the drop-in module identity without install-time builds', async () => {
  const manifest = JSON.parse(await text('package.json'))

  assert.equal(manifest.name, '@deepseek-ai/dsh-client-ui-conversation')
  assert.equal(manifest.private, true)
  assert.equal(manifest.dsh.client.platform, 'web')
  assert.equal(manifest.scripts.prepare, undefined)
  assert.equal(JSON.stringify(manifest).includes('workspace:'), false)
})

test('ships the Host, browser, and public type artifacts', async () => {
  const [host, invariant, client, clientTypes] = await Promise.all([
    text('lib/index.js'),
    text('lib/invariant.js'),
    text('lib/client.js'),
    text('lib/types/client/index.d.ts'),
  ])

  assert.match(host, /ui-conversation/)
  assert.match(invariant, /@deepseek-ai\/dsh-client-ui-conversation/)
  assert.match(
    client,
    /id: "@deepseek-ai\/dsh-client-ui-conversation"/,
  )
  assert.match(client, /dsh-kisekae-conversation community fork/)
  assert.match(clientTypes, /ConversationController/)
})

test('contains the Kisekae conversation presentation seams', async () => {
  const client = await text('lib/client.js')

  for (const marker of [
    'conversation.backdrop',
    'conversation.composer.bar.decoration',
    '--dsw-specific-conversation-user-message-prose-color',
    '--dsw-specific-conversation-assistant-message-prose-color',
    '--dsw-specific-conversation-user-message-prose-text-shadow',
    '--dsw-specific-conversation-assistant-message-prose-text-shadow',
    '--dsw-specific-conversation-message-prose-font-weight',
    '--dsw-specific-conversation-composer-dock-background',
  ]) {
    assert.ok(client.includes(marker), `missing ${marker}`)
  }
})

test('records the same upstream base in package metadata', async () => {
  const manifest = JSON.parse(await text('package.json'))
  const upstream = JSON.parse(await text('UPSTREAM.json'))

  assert.equal(manifest.dshFork.upstreamCommit, upstream.commit)
  assert.equal(manifest.dshFork.upstreamVersion, upstream.version)
})
