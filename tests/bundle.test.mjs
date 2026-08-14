import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'

const PACKAGE_NAME = '@yehu77/dsh-kisekae'

test('declares matching bundle and Client Plugin manifests', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8')

  assert.equal(manifest.name, PACKAGE_NAME)
  assert.equal(manifest.dsh?.bundle?.patch, './cordis.patch.yml')
  assert.equal(manifest.dsh?.client?.platform, 'web')
  assert.deepEqual(manifest.dsh?.client?.inject, ['@deepseek-ai/dsh-client-ui-theme'])
  assert.match(patch, /id: kisekae/)
  assert.match(patch, /name: '@yehu77\/dsh-kisekae'/)
  assert.ok(manifest.files.includes('assets/manifest.yaml'))
})

test('ships a loadable Host entry', async () => {
  const host = await import('../lib/index.js')
  assert.equal(typeof host.apply, 'function')
})

test('ships a reversible Harness Client Plugin bundle', async () => {
  const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
  let registration
  vm.runInNewContext(source, {
    window: {
      __ModuleLoader__: {
        load(value) {
          registration = value
        },
      },
    },
  })

  assert.equal(registration?.id, PACKAGE_NAME)
  assert.equal(typeof registration?.factory, 'function')

  const plugin = registration.factory((id) => {
    throw new Error(`unexpected external import: ${id}`)
  })
  assert.deepEqual([...plugin.inject], ['theme'])

  let disposed = false
  let effectLabel
  let overrideSource
  let overrideTokens
  plugin.apply({
    effect(register, label) {
      effectLabel = label
      const dispose = register()
      assert.equal(typeof dispose, 'function')
      dispose()
    },
    theme: {
      overrideTokens(sourceId, tokens) {
        overrideSource = sourceId
        overrideTokens = tokens
        return () => {
          disposed = true
        }
      },
    },
  })

  assert.equal(effectLabel, 'dsh-kisekae: theme token layer')
  assert.equal(overrideSource, PACKAGE_NAME)
  assert.equal(Object.keys(overrideTokens).length, 0)
  assert.equal(disposed, true)
})
