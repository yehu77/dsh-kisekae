import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'

const PACKAGE_NAME = '@yehu77/dsh-kisekae'
const ARTWORK_ROUTE = '/plugins/@yehu77/dsh-kisekae/assets'
const BACKDROP_STORAGE_KEY = '@yehu77/dsh-kisekae:sidebar-backdrop:v1'
const DEFAULT_BACKDROP_ARTWORK_ID = '7fd9fafc-aa19-449d-a92d-338a9bce7db5'
const MASCOT_STORAGE_KEY = '@yehu77/dsh-kisekae:mascot:v1'
const SKIN_STORAGE_KEY = '@yehu77/dsh-kisekae:skin:v1'
const RELEASE_ARTWORK_DIRECTORY = new URL('../assets/release/deepseek-blue-whale-chan/', import.meta.url)
const EXPECTED_THEME_TOKENS = [
  '--dsw-alias-bg-base',
  '--dsw-alias-bg-layer-1',
  '--dsw-alias-bg-layer-2',
  '--dsw-alias-bg-layer-3',
  '--dsw-alias-bg-overlay',
  '--dsw-alias-border-l1',
  '--dsw-alias-border-l2',
  '--dsw-alias-brand-primary',
  '--dsw-alias-button-primary-hover',
  '--dsw-alias-label-primary',
  '--dsw-alias-label-secondary',
  '--dsw-alias-state-business-primary',
  '--dsw-alias-state-business-tertiary',
  '--dsw-specific-sidebar-fill',
  '--dsw-specific-sidebar-nav-item-active',
  '--dsw-specific-sidebar-nav-item-hover',
]

function relativeLuminance(value) {
  assert.match(value, /^#[0-9A-F]{6}$/i)
  const encoded = Number.parseInt(value.slice(1), 16)
  const channels = [(encoded >> 16) & 255, (encoded >> 8) & 255, encoded & 255]
  return channels
    .map(channel => channel / 255)
    .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0)
}

function contrastRatio(foreground, background) {
  const luminances = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a)
  return (luminances[0] + 0.05) / (luminances[1] + 0.05)
}

function collectElements(value, result = []) {
  if (Array.isArray(value)) {
    for (const child of value) collectElements(child, result)
    return result
  }
  if (value === null || typeof value !== 'object') return result
  if ('type' in value && 'props' in value) result.push(value)
  collectElements(value.props?.children, result)
  return result
}

async function readReleaseArtworkIds() {
  return (await readdir(RELEASE_ARTWORK_DIRECTORY))
    .filter(file => file.endsWith('.jpg'))
    .map(file => file.slice(0, -4))
    .sort()
}

test('declares matching bundle and Client Plugin manifests', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8')

  assert.equal(manifest.name, PACKAGE_NAME)
  assert.equal(manifest.dsh?.bundle?.patch, './cordis.patch.yml')
  assert.equal(manifest.dsh?.client?.platform, 'web')
  assert.deepEqual(manifest.dsh?.client?.inject, [
    '@deepseek-ai/dsh-client-ui-theme',
    '@deepseek-ai/dsh-client-runtime',
    '@deepseek-ai/dsh-client-locale',
    '@deepseek-ai/dsh-client-ui-settings',
    '@deepseek-ai/dsh-client-ui-layout',
    '@deepseek-ai/dsh-client-ui-sidebar',
  ])
  assert.match(patch, /id: kisekae/)
  assert.match(patch, /name: '@yehu77\/dsh-kisekae'/)
  for (const file of ['assets/manifest.yaml', 'assets/release', 'README.zh.md', 'ROADMAP.md', 'ROADMAP.zh.md']) {
    assert.ok(manifest.files.includes(file), `package files must include ${file}`)
  }
})

test('serves released artwork from a reversible Host route', async () => {
  const host = await import('../lib/index.js')
  assert.equal(typeof host.apply, 'function')
  assert.deepEqual([...host.inject], ['webServer'])

  let route
  let disposeEffect
  let routeDisposeCalls = 0
  host.apply({
    effect(register, label) {
      assert.equal(label, 'dsh-kisekae: artwork route')
      disposeEffect = register()
    },
    webServer: {
      register(value) {
        route = value
        return () => { routeDisposeCalls += 1 }
      },
    },
  })

  assert.equal(route.kind, 'prefix')
  assert.equal(route.path, ARTWORK_ROUTE)
  assert.equal(typeof route.handler, 'function')

  async function request(method, path) {
    const response = { body: undefined, ended: false, headers: {}, status: undefined }
    await route.handler({ method, url: path }, {
      writeHead(status, headers = {}) {
        response.status = status
        response.headers = headers
      },
      end(body) {
        response.body = body
        response.ended = true
      },
    })
    assert.equal(response.ended, true)
    return response
  }

  const [knownId] = await readReleaseArtworkIds()
  const expectedContent = await readFile(new URL(`${knownId}.jpg`, RELEASE_ARTWORK_DIRECTORY))
  const get = await request('GET', `${ARTWORK_ROUTE}/${knownId}.jpg`)
  assert.equal(get.status, 200)
  assert.equal(get.headers['content-type'], 'image/jpeg')
  assert.equal(get.headers['content-length'], expectedContent.byteLength)
  assert.deepEqual(get.body, expectedContent)

  const head = await request('HEAD', `${ARTWORK_ROUTE}/${knownId}.jpg`)
  assert.equal(head.status, 200)
  assert.equal(head.headers['content-type'], 'image/jpeg')
  assert.equal(head.body, undefined)

  const unknown = await request('GET', `${ARTWORK_ROUTE}/unknown.jpg`)
  assert.equal(unknown.status, 404)
  const methodNotAllowed = await request('POST', `${ARTWORK_ROUTE}/${knownId}.jpg`)
  assert.equal(methodNotAllowed.status, 405)
  assert.equal(methodNotAllowed.headers.allow, 'GET, HEAD')

  assert.equal(typeof disposeEffect, 'function')
  disposeEffect()
  assert.equal(routeDisposeCalls, 1)
})

test('ships a reversible Harness Client Plugin bundle', async () => {
  const releaseArtworkIds = await readReleaseArtworkIds()
  const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
  const sourceMap = await readFile(new URL('../lib/client.js.map', import.meta.url), 'utf8')
  for (const artifact of [source, sourceMap]) {
    assert.doesNotMatch(artifact, /data:image\/[^;]+;base64/i)
    assert.doesNotMatch(artifact, /assets\/inbox/)
    assert.doesNotMatch(artifact, /LOCAL ART PROTOTYPE/)
  }
  assert.match(source, /settings\.section/)
  assert.match(source, /sidebar\.backdrop/)
  assert.match(source, /shell\.overlay/)
  const storageListeners = new Set()
  const skinStorageWrites = []
  const mascotStorageWrites = []
  const backdropStorageWrites = []
  let storedSkin = null
  let storedMascot = null
  let storedBackdrop = null
  let rejectStorageWrites = false
  const localStorage = {
    getItem(key) {
      if (key === SKIN_STORAGE_KEY) return storedSkin
      if (key === MASCOT_STORAGE_KEY) return storedMascot
      if (key === BACKDROP_STORAGE_KEY) return storedBackdrop
      assert.fail(`unexpected browser storage key: ${key}`)
    },
    setItem(key, value) {
      if (key === SKIN_STORAGE_KEY) {
        if (rejectStorageWrites) throw new Error('browser storage unavailable')
        storedSkin = value
        skinStorageWrites.push({ key, value })
        return
      }
      if (key === MASCOT_STORAGE_KEY) {
        storedMascot = value
        mascotStorageWrites.push({ key, value })
        return
      }
      if (key === BACKDROP_STORAGE_KEY) {
        storedBackdrop = value
        backdropStorageWrites.push({ key, value })
        return
      }
      assert.fail(`unexpected browser storage key: ${key}`)
    },
  }
  let registration
  const browserWindow = {
    localStorage,
    addEventListener(type, listener) {
      assert.equal(type, 'storage')
      storageListeners.add(listener)
    },
    removeEventListener(type, listener) {
      assert.equal(type, 'storage')
      storageListeners.delete(listener)
    },
    __ModuleLoader__: {
      load(value) {
        registration = value
      },
    },
  }
  const deterministicMath = Object.create(Math)
  Object.defineProperty(deterministicMath, 'random', { value: () => 0 })
  vm.runInNewContext(source, {
    Math: deterministicMath,
    window: browserWindow,
  })

  assert.equal(registration?.id, PACKAGE_NAME)
  assert.equal(typeof registration?.factory, 'function')

  const componentCleanups = []
  const externalRequests = []
  let generatedId = 0
  const react = {
    useEffect(effect) {
      const cleanup = effect()
      if (typeof cleanup === 'function') componentCleanups.push(cleanup)
    },
    useId() {
      generatedId += 1
      return `kisekae-heading-${generatedId}`
    },
    useSyncExternalStore(_subscribe, getSnapshot) {
      return getSnapshot()
    },
  }
  const jsxRuntime = {
    Fragment: 'fragment',
    jsx(type, props, key) {
      return { type, props, key }
    },
    jsxs(type, props, key) {
      return { type, props, key }
    },
  }
  const plugin = registration.factory((id) => {
    externalRequests.push(id)
    if (id === 'react') return react
    if (id === 'react/jsx-runtime') return jsxRuntime
    throw new Error(`unexpected external import: ${id}`)
  })
  assert.deepEqual([...new Set(externalRequests)].sort(), ['react', 'react/jsx-runtime'])
  assert.deepEqual([...plugin.inject], ['theme', 'slots', 'locale'])

  const effectDisposers = []
  const effectLabels = []
  const overrideHistory = []
  let tokenDisposeCalls = 0
  let localeDisposeCalls = 0
  const slotDisposeCalls = new Map()
  let registeredLocale
  let registeredDictionaries
  const slotRegistrations = new Map()
  const slotInjectionDisposers = new Map()
  plugin.apply({
    effect(register, label) {
      effectLabels.push(label)
      effectDisposers.push(register())
    },
    locale: {
      register(namespace, dictionaries) {
        registeredLocale = namespace
        registeredDictionaries = dictionaries
        return () => { localeDisposeCalls += 1 }
      },
      bind(namespace) {
        return key => registeredDictionaries?.zh?.[key] ?? `${namespace}:${key}`
      },
    },
    slots: {
      inject(name, install) {
        const dispose = install()
        slotInjectionDisposers.set(name, dispose)
        return dispose
      },
      register(options, component) {
        slotRegistrations.set(options.name, { component, options })
        return () => {
          slotDisposeCalls.set(options.name, (slotDisposeCalls.get(options.name) ?? 0) + 1)
        }
      },
    },
    theme: {
      overrideTokens(sourceId, tokens) {
        overrideHistory.push({ sourceId, tokens })
        return () => {
          tokenDisposeCalls += 1
        }
      },
    },
  })

  assert.equal(registeredLocale, 'settings.kisekae')
  assert.deepEqual(effectLabels, [
    'dsh-kisekae: skin selection controller',
    'dsh-kisekae: settings dictionaries',
  ])
  assert.deepEqual([...slotRegistrations.keys()].sort(), ['settings.section', 'shell.overlay', 'sidebar.backdrop'])
  const settingsSlot = slotRegistrations.get('settings.section')
  const overlaySlot = slotRegistrations.get('shell.overlay')
  const backdropSlot = slotRegistrations.get('sidebar.backdrop')
  const { component: slotComponent, options: slotOptions } = settingsSlot
  assert.equal(slotOptions.name, 'settings.section')
  assert.equal(slotOptions.id, 'kisekae-skins')
  assert.equal(slotOptions.order, 15)
  assert.equal(slotOptions.locale, 'settings.kisekae')
  assert.equal(slotOptions.label(), '外观与皮肤')
  assert.equal(typeof slotComponent, 'function')
  assert.equal(overlaySlot.options.id, 'dsh-kisekae.blue-whale')
  assert.equal(overlaySlot.options.order, 100)
  assert.equal(typeof overlaySlot.component, 'function')
  assert.deepEqual(Object.keys(backdropSlot.options).sort(), ['inject', 'name'])
  assert.equal(typeof backdropSlot.component, 'function')

  assert.equal(plugin.DEEPSEEK_BLUE_WHALE_CHAN.id, 'deepseek-blue-whale-chan')
  assert.equal(plugin.DEEPSEEK_BLUE_WHALE_CHAN.displayName.zh, 'DeepSeek蓝鲸娘')
  assert.equal(plugin.DEEPSEEK_BLUE_WHALE_CHAN.officialAffiliation, 'none')
  assert.equal(skinStorageWrites.length, 0)
  assert.equal(storageListeners.size, 1)
  assert.equal(overrideHistory.length, 1)
  const [{ sourceId: overrideSource, tokens: overrideTokens }] = overrideHistory
  assert.equal(overrideSource, PACKAGE_NAME)
  assert.deepEqual(Object.keys(overrideTokens).sort(), [...EXPECTED_THEME_TOKENS].sort())
  for (const [name, modes] of Object.entries(overrideTokens)) {
    assert.match(name, /^--dsw-(?:alias|specific)-/)
    assert.equal(typeof modes.light, 'string')
    assert.ok(modes.light.length > 0)
    assert.equal(typeof modes.dark, 'string')
    assert.ok(modes.dark.length > 0)
  }
  assert.equal(overrideTokens['--dsw-alias-bg-base'].light, '#F6FBFE')
  assert.equal(overrideTokens['--dsw-alias-bg-base'].dark, '#091824')
  assert.ok(Object.values(overrideTokens).some(modes => modes.light !== modes.dark))

  const contrastPairs = [
    ['--dsw-alias-label-primary', '--dsw-alias-bg-base'],
    ['--dsw-alias-label-secondary', '--dsw-alias-bg-base'],
    ['--dsw-alias-state-business-primary', '--dsw-alias-state-business-tertiary'],
    ['--dsw-alias-label-secondary', '--dsw-alias-bg-overlay'],
  ]
  for (const mode of ['light', 'dark']) {
    for (const [foreground, background] of contrastPairs) {
      const ratio = contrastRatio(overrideTokens[foreground][mode], overrideTokens[background][mode])
      assert.ok(ratio >= 4.5, `${mode} ${foreground} on ${background} has ${ratio.toFixed(2)}:1 contrast`)
    }
  }

  const { controller, mascotStore, backdropStore } = slotOptions.inject()
  assert.equal(overlaySlot.options.inject().mascotStore, mascotStore)
  assert.equal(backdropSlot.options.inject().backdropStore, backdropStore)
  const t = key => registeredDictionaries.zh[key]
  const tree = slotComponent({ controller, mascotStore, backdropStore, t })
  const elements = collectElements(tree)
  const section = elements.find(element => element.props?.['data-kisekae-skin-section'] === 'true')
  const cards = elements.filter(element => element.props?.['data-kisekae-skin'] !== undefined)
  assert.ok(section)
  assert.equal(section.props['aria-labelledby'], 'kisekae-heading-1')
  assert.equal(cards.length, 2)
  assert.equal(cards.find(card => card.props['data-kisekae-skin'] === 'official').props['aria-pressed'], false)
  assert.equal(
    cards.find(card => card.props['data-kisekae-skin'] === 'deepseek-blue-whale-chan').props['aria-pressed'],
    true,
  )
  const gallery = elements.find(element => element.props?.['data-kisekae-gallery'] === 'true')
  const galleryCards = elements.filter(element => element.props?.['data-kisekae-artwork'] !== undefined)
  const galleryIds = galleryCards.map(card => card.props['data-kisekae-artwork']).sort()
  assert.ok(gallery)
  assert.equal(releaseArtworkIds.length, 42)
  assert.equal(galleryCards.length, 42)
  assert.deepEqual(galleryIds, releaseArtworkIds)

  const backdropSettings = elements.find(element => element.props?.['data-kisekae-sidebar-settings'] === 'true')
  const backdropModeButtons = elements.filter(element => element.props?.['data-kisekae-backdrop-mode'] !== undefined)
  const backdropSelect = elements.find(element => element.props?.['data-kisekae-backdrop-artwork-select'] === 'true')
  assert.ok(backdropSettings)
  assert.deepEqual(backdropModeButtons.map(button => button.props['data-kisekae-backdrop-mode']), [
    'clear', 'immersive', 'off',
  ])
  assert.equal(backdropSelect.props.value, DEFAULT_BACKDROP_ARTWORK_ID)
  assert.equal(collectElements(backdropSelect).filter(element => element.type === 'option').length, 42)

  assert.equal(backdropStore.getSnapshot().mode, 'clear')
  assert.equal(backdropStore.getSnapshot().artworkId, DEFAULT_BACKDROP_ARTWORK_ID)
  const wideBackdrop = collectElements(backdropSlot.component({ wide: true, backdropStore }))
  const wideBackdropRoot = wideBackdrop.find(element => element.props?.['data-kisekae-sidebar-backdrop'] !== undefined)
  const wideArtwork = wideBackdrop.find(element => element.props?.['data-kisekae-sidebar-artwork'] !== undefined)
  assert.equal(wideBackdropRoot.props['data-kisekae-sidebar-backdrop'], 'clear')
  assert.equal(wideBackdropRoot.props['data-kisekae-sidebar-wide'], 'true')
  assert.equal(wideArtwork.props['data-kisekae-sidebar-artwork'], DEFAULT_BACKDROP_ARTWORK_ID)
  assert.equal(wideArtwork.props.style.backgroundImage, `url(${ARTWORK_ROUTE}/${DEFAULT_BACKDROP_ARTWORK_ID}.jpg)`)
  assert.equal(wideArtwork.props.style.opacity, 0.30)
  const narrowBackdrop = collectElements(backdropSlot.component({ wide: false, backdropStore }))
  assert.equal(
    narrowBackdrop.find(element => element.props?.['data-kisekae-sidebar-backdrop'] !== undefined)
      .props['data-kisekae-sidebar-wide'],
    'false',
  )
  assert.equal(
    narrowBackdrop.some(element => element.props?.['data-kisekae-sidebar-artwork'] !== undefined),
    false,
  )
  backdropStore.setMode('immersive')
  assert.equal(backdropStore.getSnapshot().mode, 'immersive')
  const immersiveArtwork = collectElements(backdropSlot.component({ wide: true, backdropStore }))
    .find(element => element.props?.['data-kisekae-sidebar-artwork'] !== undefined)
  assert.equal(immersiveArtwork.props.style.opacity, 0.54)
  backdropStore.setMode('off')
  assert.equal(backdropSlot.component({ wide: true, backdropStore }).props['data-kisekae-sidebar-backdrop'], 'off')
  const fixedBackdropId = releaseArtworkIds.at(-1)
  backdropStore.setArtwork(fixedBackdropId)
  assert.equal(backdropStore.getSnapshot().artworkId, fixedBackdropId)
  assert.deepEqual(backdropStorageWrites.at(-1), {
    key: BACKDROP_STORAGE_KEY,
    value: JSON.stringify({ mode: 'off', artworkId: fixedBackdropId }),
  })

  assert.equal(mascotStore.getSnapshot().mode, 'random')
  assert.equal(mascotStore.getSnapshot().shownArtworkId, releaseArtworkIds[0])
  mascotStore.setMode('off')
  assert.equal(mascotStore.getSnapshot().shownArtworkId, null)
  assert.equal(overlaySlot.component({ mascotStore }), null)

  const fixedArtworkId = releaseArtworkIds.at(-1)
  mascotStore.fix(fixedArtworkId)
  assert.equal(mascotStore.getSnapshot().mode, 'fixed')
  assert.equal(mascotStore.getSnapshot().fixedArtworkId, fixedArtworkId)
  assert.equal(mascotStore.getSnapshot().shownArtworkId, fixedArtworkId)
  const overlayElements = collectElements(overlaySlot.component({ mascotStore }))
  const overlayRoot = overlayElements.find(element => element.props?.['data-kisekae-mascot'] !== undefined)
  const overlayImage = overlayElements.find(element => element.type === 'img')
  assert.equal(overlayRoot.props['data-kisekae-mascot'], fixedArtworkId)
  assert.equal(overlayImage.props.src, `${ARTWORK_ROUTE}/${fixedArtworkId}.jpg`)
  assert.equal(mascotStorageWrites.length, 2)
  assert.deepEqual(mascotStorageWrites.at(-1), {
    key: MASCOT_STORAGE_KEY,
    value: JSON.stringify({ mode: 'fixed', fixedArtworkId }),
  })
  assert.equal(storedMascot, mascotStorageWrites.at(-1).value)
  assert.equal(componentCleanups.length, 1)

  controller.preview('official')
  assert.equal(skinStorageWrites.length, 0)
  assert.equal(controller.getSnapshot().draft, 'official')
  assert.equal(controller.getSnapshot().dirty, true)
  assert.equal(tokenDisposeCalls, 1)

  controller.cancelPreview()
  assert.equal(controller.getSnapshot().committed, 'deepseek-blue-whale-chan')
  assert.equal(controller.getSnapshot().draft, 'deepseek-blue-whale-chan')
  assert.equal(controller.getSnapshot().dirty, false)
  assert.equal(overrideHistory.length, 2)

  controller.preview('official')
  await controller.applyPreview()
  assert.deepEqual(skinStorageWrites, [{
    key: SKIN_STORAGE_KEY,
    value: 'official',
  }])
  assert.equal(controller.getSnapshot().committed, 'official')
  assert.equal(controller.getSnapshot().draft, 'official')
  assert.equal(controller.getSnapshot().dirty, false)
  assert.equal(controller.getSnapshot().error, null)

  storedSkin = 'skin-from-a-newer-version'
  for (const listener of [...storageListeners]) {
    listener({
      key: SKIN_STORAGE_KEY,
      newValue: storedSkin,
      storageArea: localStorage,
    })
  }
  assert.equal(controller.getSnapshot().committed, 'official')
  assert.equal(controller.getSnapshot().draft, 'official')
  assert.equal(controller.getSnapshot().unavailableSkin, 'skin-from-a-newer-version')
  assert.equal(controller.getSnapshot().dirty, true)
  await controller.applyPreview()
  assert.equal(storedSkin, 'official')
  assert.equal(controller.getSnapshot().unavailableSkin, null)
  assert.equal(controller.getSnapshot().dirty, false)

  storedSkin = null
  for (const listener of [...storageListeners]) {
    listener({
      key: null,
      newValue: storedSkin,
      storageArea: localStorage,
    })
  }
  assert.equal(controller.getSnapshot().committed, 'deepseek-blue-whale-chan')

  storedSkin = 'official'
  for (const listener of [...storageListeners]) {
    listener({
      key: SKIN_STORAGE_KEY,
      newValue: storedSkin,
      storageArea: localStorage,
    })
  }
  assert.equal(controller.getSnapshot().committed, 'official')
  rejectStorageWrites = true
  controller.preview('deepseek-blue-whale-chan')
  await controller.applyPreview()
  assert.equal(storedSkin, 'official')
  assert.equal(controller.getSnapshot().status, 'ready')
  assert.equal(controller.getSnapshot().writable, true)
  assert.equal(controller.getSnapshot().saving, false)
  assert.equal(controller.getSnapshot().error, 'save-failed')
  assert.equal(controller.getSnapshot().committed, 'official')
  assert.equal(controller.getSnapshot().draft, 'deepseek-blue-whale-chan')
  controller.cancelPreview()
  assert.equal(controller.getSnapshot().draft, 'official')
  assert.equal(controller.getSnapshot().error, null)
  rejectStorageWrites = false
  controller.preview('deepseek-blue-whale-chan')
  await controller.applyPreview()
  assert.equal(storedSkin, 'deepseek-blue-whale-chan')
  assert.equal(controller.getSnapshot().committed, 'deepseek-blue-whale-chan')
  componentCleanups[0]()
  assert.equal(controller.getSnapshot().draft, 'deepseek-blue-whale-chan')

  assert.equal(effectDisposers.length, 2)
  effectDisposers[0]()
  effectDisposers[1]()
  assert.deepEqual(
    [...slotInjectionDisposers.keys()].sort(),
    ['settings.section', 'shell.overlay', 'sidebar.backdrop'],
  )
  for (const dispose of slotInjectionDisposers.values()) dispose()
  assert.equal(tokenDisposeCalls, overrideHistory.length)
  assert.equal(localeDisposeCalls, 1)
  assert.equal(slotDisposeCalls.get('settings.section'), 1)
  assert.equal(slotDisposeCalls.get('shell.overlay'), 1)
  assert.equal(slotDisposeCalls.get('sidebar.backdrop'), 1)
  assert.equal(storageListeners.size, 0)

  let reentrantControllerDispose
  let disposeDuringOverride = false
  let reentrantOverrides = 0
  let reentrantTokenDisposals = 0
  let reentrantSettingsSlotOptions
  rejectStorageWrites = false
  storedSkin = null
  plugin.apply({
    effect(register, label) {
      const dispose = register()
      if (label === 'dsh-kisekae: skin selection controller') reentrantControllerDispose = dispose
    },
    locale: {
      register: () => () => {},
      bind: () => key => key,
    },
    slots: {
      inject(_name, install) {
        return install()
      },
      register(options) {
        if (options.name === 'settings.section') reentrantSettingsSlotOptions = options
        return () => {}
      },
    },
    theme: {
      overrideTokens() {
        reentrantOverrides += 1
        if (disposeDuringOverride) reentrantControllerDispose()
        return () => { reentrantTokenDisposals += 1 }
      },
    },
  })
  const reentrantInjection = reentrantSettingsSlotOptions.inject()
  const reentrantController = reentrantInjection.controller
  assert.equal(reentrantInjection.backdropStore.getSnapshot().mode, 'off')
  assert.equal(reentrantInjection.backdropStore.getSnapshot().artworkId, fixedBackdropId)
  reentrantController.preview('official')
  assert.equal(reentrantTokenDisposals, 1)
  disposeDuringOverride = true
  reentrantController.cancelPreview()
  assert.equal(reentrantOverrides, 2)
  assert.equal(reentrantTokenDisposals, 2)
  assert.equal(storageListeners.size, 0)
  assert.equal(reentrantController.getSnapshot().draft, 'official')
})
