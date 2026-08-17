import assert from 'node:assert/strict'
import test from 'node:test'
import { parseLoopbackUrl, resolveDesktopOptions } from '../lib/options.js'

test('accepts only loopback HTTP renderer URLs', () => {
  assert.equal(parseLoopbackUrl('http://127.0.0.1:3080/').origin, 'http://127.0.0.1:3080')
  assert.equal(parseLoopbackUrl('http://localhost:3080/').hostname, 'localhost')
  assert.throws(() => parseLoopbackUrl('https://example.com/'), /only loads a loopback HTTP Harness URL/)
})

test('defaults to a managed stable 3080 origin', () => {
  const options = resolveDesktopOptions([], {}, '/projects/deepseek-harness')
  assert.equal(options.targetUrl.href, 'http://127.0.0.1:3080/')
  assert.equal(options.attachOnly, false)
  assert.equal(options.harnessRoot, '/projects/deepseek-harness')
})

test('an explicit URL uses attach-only mode', () => {
  const options = resolveDesktopOptions(
    ['--url', 'http://localhost:4090/', '--harness-root', '../harness'],
    {},
    '/unused',
  )
  assert.equal(options.targetUrl.href, 'http://localhost:4090/')
  assert.equal(options.attachOnly, true)
  assert.ok(options.harnessRoot.endsWith('/harness'))
})
