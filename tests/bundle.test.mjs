import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'

const PACKAGE_NAME = '@yehu77/dsh-kisekae'
const ARTWORK_ROUTE = '/plugins/@yehu77/dsh-kisekae/assets'
const ARTWORK_RELEASE = 'source-q80-v1'
const BACKDROP_STORAGE_KEY = '@yehu77/dsh-kisekae:sidebar-backdrop:v1'
const DEFAULT_BACKDROP_ARTWORK_ID = '7fd9fafc-aa19-449d-a92d-338a9bce7db5'
const NEW_SESSION_ARTWORK_ID = '7a9c4fae-6fca-4c5e-b232-5c802f788dae'
const SETTINGS_TRIGGER_ARTWORK_ID = 'd5dd1b2f-ecdc-4be7-abef-ce9a0cfc6f97'
const MAIN_BACKGROUND_STORAGE_KEY = '@yehu77/dsh-kisekae:main-background:v1'
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

function artworkUrl(id) {
  return `${ARTWORK_ROUTE}/${id}.jpg?v=${ARTWORK_RELEASE}`
}

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
    '@deepseek-ai/dsh-client-ui-conversation',
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
  const get = await request('GET', artworkUrl(knownId))
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
  assert.match(source, /conversation\.backdrop/)
  assert.match(source, /settings\.trigger\.decoration/)
  assert.match(source, /sidebar\.backdrop/)
  assert.match(source, /sidebar\.newSession\.decoration/)
  assert.match(source, /sidebar\.newSession\.icon/)
  assert.doesNotMatch(source, /shell\.overlay/)
  assert.doesNotMatch(source, /blur\(1\.5px\)/)
  const storageListeners = new Set()
  const skinStorageWrites = []
  const mainBackgroundStorageWrites = []
  const backdropStorageWrites = []
  let storedSkin = null
  let storedMainBackground = null
  let storedBackdrop = null
  let rejectStorageWrites = false
  const localStorage = {
    getItem(key) {
      if (key === SKIN_STORAGE_KEY) return storedSkin
      if (key === MAIN_BACKGROUND_STORAGE_KEY) return storedMainBackground
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
      if (key === MAIN_BACKGROUND_STORAGE_KEY) {
        storedMainBackground = value
        mainBackgroundStorageWrites.push({ key, value })
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
  const slotRegisterCalls = new Map()
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
        const registration = { component, options }
        slotRegistrations.set(options.name, registration)
        slotRegisterCalls.set(options.name, (slotRegisterCalls.get(options.name) ?? 0) + 1)
        let disposed = false
        return () => {
          if (disposed) return
          disposed = true
          slotDisposeCalls.set(options.name, (slotDisposeCalls.get(options.name) ?? 0) + 1)
          if (slotRegistrations.get(options.name) === registration) {
            slotRegistrations.delete(options.name)
          }
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
    'dsh-kisekae: skin visual contributions',
  ])
  assert.deepEqual([...slotRegistrations.keys()].sort(), [
    'conversation.backdrop',
    'settings.section',
    'settings.trigger.decoration',
    'sidebar.backdrop',
    'sidebar.newSession.decoration',
    'sidebar.newSession.icon',
  ])
  const conversationBackdropSlot = slotRegistrations.get('conversation.backdrop')
  const settingsSlot = slotRegistrations.get('settings.section')
  const settingsTriggerDecorationSlot = slotRegistrations.get('settings.trigger.decoration')
  const backdropSlot = slotRegistrations.get('sidebar.backdrop')
  const newSessionDecorationSlot = slotRegistrations.get('sidebar.newSession.decoration')
  const newSessionIconSlot = slotRegistrations.get('sidebar.newSession.icon')
  const { component: slotComponent, options: slotOptions } = settingsSlot
  assert.equal(slotOptions.name, 'settings.section')
  assert.equal(slotOptions.id, 'kisekae-skins')
  assert.equal(slotOptions.order, 15)
  assert.equal(slotOptions.locale, 'settings.kisekae')
  assert.equal(slotOptions.label(), '外观与皮肤')
  assert.equal(typeof slotComponent, 'function')
  assert.deepEqual(Object.keys(settingsTriggerDecorationSlot.options), ['name'])
  assert.equal(typeof settingsTriggerDecorationSlot.component, 'function')
  assert.deepEqual(Object.keys(conversationBackdropSlot.options).sort(), ['inject', 'name'])
  assert.equal(typeof conversationBackdropSlot.component, 'function')
  assert.deepEqual(Object.keys(backdropSlot.options).sort(), ['inject', 'name'])
  assert.equal(typeof backdropSlot.component, 'function')
  assert.deepEqual(Object.keys(newSessionDecorationSlot.options), ['name'])
  assert.equal(typeof newSessionDecorationSlot.component, 'function')
  assert.deepEqual(Object.keys(newSessionIconSlot.options), ['name'])
  assert.equal(typeof newSessionIconSlot.component, 'function')

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

  const { controller, mainBackgroundStore, backdropStore } = slotOptions.inject()
  assert.equal(conversationBackdropSlot.options.inject().mainBackgroundStore, mainBackgroundStore)
  assert.equal(backdropSlot.options.inject().backdropStore, backdropStore)
  const t = key => registeredDictionaries.zh[key]
  const tree = slotComponent({ controller, mainBackgroundStore, backdropStore, t })
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
  const mainBackgroundModeButtons = elements.filter(
    element => element.props?.['data-kisekae-main-background-mode'] !== undefined,
  )
  assert.ok(gallery)
  assert.equal(releaseArtworkIds.length, 42)
  assert.equal(galleryCards.length, 42)
  assert.deepEqual(galleryIds, releaseArtworkIds)
  assert.deepEqual(
    mainBackgroundModeButtons.map(button => button.props['data-kisekae-main-background-mode']),
    ['random', 'fixed', 'off'],
  )

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
  assert.equal(wideArtwork.props.style.backgroundImage, `url(${artworkUrl(DEFAULT_BACKDROP_ARTWORK_ID)})`)
  assert.equal(wideArtwork.props.style.opacity, 0.56)
  assert.equal(wideBackdrop.some(element =>
    element.props?.style?.backdropFilter !== undefined
    || element.props?.style?.WebkitBackdropFilter !== undefined), false)
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
  assert.equal(immersiveArtwork.props.style.opacity, 0.95)
  backdropStore.setMode('off')
  assert.equal(backdropSlot.component({ wide: true, backdropStore }).props['data-kisekae-sidebar-backdrop'], 'off')

  const wideNewSessionIcon = newSessionIconSlot.component({ wide: true })
  const narrowNewSessionIcon = newSessionIconSlot.component({ wide: false })
  assert.equal(wideNewSessionIcon.type, 'svg')
  assert.equal(wideNewSessionIcon.props['aria-hidden'], 'true')
  assert.equal(wideNewSessionIcon.props.focusable, 'false')
  assert.equal(wideNewSessionIcon.props['data-kisekae-new-session-icon'], 'blue-whale-wave-chat')
  assert.equal(wideNewSessionIcon.props.width, 16)
  assert.equal(wideNewSessionIcon.props.height, 16)
  assert.equal(wideNewSessionIcon.props.style.color, 'var(--dsw-alias-brand-primary)')
  assert.equal(narrowNewSessionIcon.props.width, 18)
  assert.equal(narrowNewSessionIcon.props.height, 18)
  const iconPaths = collectElements(wideNewSessionIcon).filter(element => element.type === 'path')
  assert.equal(iconPaths.length, 3)
  assert.ok(iconPaths.every(path => path.props.stroke === 'currentColor'))

  const wideNewSessionDecoration = collectElements(newSessionDecorationSlot.component({ wide: true }))
  const wideDecorationRoot = wideNewSessionDecoration.find(
    element => element.props?.['data-kisekae-new-session-decoration'] !== undefined,
  )
  const buttonArtwork = wideNewSessionDecoration.find(
    element => element.props?.['data-kisekae-new-session-artwork'] !== undefined,
  )
  assert.equal(wideDecorationRoot.props['data-kisekae-new-session-decoration'], 'wide')
  assert.equal(wideDecorationRoot.props['aria-hidden'], 'true')
  assert.equal(buttonArtwork.props['data-kisekae-new-session-artwork'], NEW_SESSION_ARTWORK_ID)
  assert.equal(
    buttonArtwork.props.style.backgroundImage,
    `url(${artworkUrl(NEW_SESSION_ARTWORK_ID)})`,
  )
  assert.equal(buttonArtwork.props.style.backgroundPosition, 'center 44%')
  assert.equal(buttonArtwork.props.style.opacity, 0.26)
  const railNewSessionDecoration = collectElements(newSessionDecorationSlot.component({ wide: false }))
  assert.equal(
    railNewSessionDecoration.find(
      element => element.props?.['data-kisekae-new-session-decoration'] !== undefined,
    ).props['data-kisekae-new-session-decoration'],
    'rail',
  )
  assert.equal(
    railNewSessionDecoration.some(
      element => element.props?.['data-kisekae-new-session-artwork'] !== undefined,
    ),
    false,
  )
  const railWave = railNewSessionDecoration.find(
    element => element.props?.['data-kisekae-new-session-rail-wave'] === 'true',
  )
  assert.equal(railWave.type, 'svg')
  assert.equal(collectElements(railWave).find(element => element.type === 'path').props.stroke, 'currentColor')

  const wideSettingsDecoration = collectElements(settingsTriggerDecorationSlot.component({ wide: true }))
  const wideSettingsRoot = wideSettingsDecoration.find(
    element => element.props?.['data-kisekae-settings-trigger-decoration'] !== undefined,
  )
  const settingsArtwork = wideSettingsDecoration.find(
    element => element.props?.['data-kisekae-settings-trigger-artwork'] !== undefined,
  )
  assert.equal(wideSettingsRoot.props['data-kisekae-settings-trigger-decoration'], 'wide')
  assert.equal(wideSettingsRoot.props['aria-hidden'], 'true')
  assert.equal(wideSettingsRoot.props.style.backdropFilter, undefined)
  assert.equal(settingsArtwork.props['data-kisekae-settings-trigger-artwork'], SETTINGS_TRIGGER_ARTWORK_ID)
  assert.equal(
    settingsArtwork.props.style.backgroundImage,
    `url(${artworkUrl(SETTINGS_TRIGGER_ARTWORK_ID)})`,
  )
  assert.equal(settingsArtwork.props.style.backgroundPosition, 'center 46%')
  assert.equal(settingsArtwork.props.style.opacity, 0.34)
  const railSettingsDecoration = collectElements(settingsTriggerDecorationSlot.component({ wide: false }))
  assert.equal(
    railSettingsDecoration.find(
      element => element.props?.['data-kisekae-settings-trigger-decoration'] !== undefined,
    ).props['data-kisekae-settings-trigger-decoration'],
    'rail',
  )
  assert.equal(
    railSettingsDecoration.some(
      element => element.props?.['data-kisekae-settings-trigger-artwork'] !== undefined,
    ),
    false,
  )
  const railRipples = railSettingsDecoration.find(
    element => element.props?.['data-kisekae-settings-trigger-ripples'] === 'true',
  )
  assert.equal(railRipples.type, 'svg')
  assert.equal(
    collectElements(railRipples).filter(element => element.type === 'path').length,
    2,
  )

  const fixedBackdropId = releaseArtworkIds.at(-1)
  backdropStore.setArtwork(fixedBackdropId)
  assert.equal(backdropStore.getSnapshot().artworkId, fixedBackdropId)
  assert.deepEqual(backdropStorageWrites.at(-1), {
    key: BACKDROP_STORAGE_KEY,
    value: JSON.stringify({ mode: 'off', artworkId: fixedBackdropId }),
  })

  assert.equal(mainBackgroundStore.getSnapshot().mode, 'random')
  assert.equal(mainBackgroundStore.getSnapshot().shownArtworkId, releaseArtworkIds[0])
  const heroBackground = collectElements(conversationBackdropSlot.component({
    phase: 'hero',
    mainBackgroundStore,
  }))
  const heroBackgroundRoot = heroBackground.find(
    element => element.props?.['data-kisekae-conversation-backdrop'] !== undefined,
  )
  const heroArtwork = heroBackground.find(
    element => element.props?.['data-kisekae-conversation-artwork'] !== undefined,
  )
  assert.equal(heroBackgroundRoot.props['data-kisekae-conversation-backdrop'], 'hero')
  assert.equal(heroBackgroundRoot.props['aria-hidden'], 'true')
  assert.equal(heroArtwork.props.style.opacity, 0.66)
  assert.equal(heroArtwork.props.style.backgroundSize, 'auto min(92%, 760px)')
  assert.equal(
    heroArtwork.props.style.backgroundImage,
    `url(${artworkUrl(releaseArtworkIds[0])})`,
  )
  assert.ok(heroBackground.some(
    element => element.props?.['data-kisekae-conversation-reading-lane'] === 'true',
  ))
  assert.ok(heroBackground.some(
    element => element.props?.['data-kisekae-conversation-sea-fog'] === 'true',
  ))
  const phaseTransition = heroBackground.find(element => element.type === 'style').props.children
  assert.match(phaseTransition, /opacity 180ms ease/)
  assert.match(phaseTransition, /prefers-reduced-motion/)
  assert.equal(heroBackground.some(element =>
    element.props?.style?.filter !== undefined
    || element.props?.style?.backdropFilter !== undefined
    || element.props?.style?.WebkitBackdropFilter !== undefined), false)

  const activeArtwork = collectElements(conversationBackdropSlot.component({
    phase: 'active',
    mainBackgroundStore,
  })).find(element => element.props?.['data-kisekae-conversation-artwork'] !== undefined)
  assert.equal(activeArtwork.props.style.opacity, 0.14)
  const settlingArtwork = collectElements(conversationBackdropSlot.component({
    phase: 'settling',
    mainBackgroundStore,
  })).find(element => element.props?.['data-kisekae-conversation-artwork'] !== undefined)
  assert.equal(settlingArtwork.props.style.opacity, 0.28)

  mainBackgroundStore.setMode('off')
  assert.equal(mainBackgroundStore.getSnapshot().shownArtworkId, null)
  assert.equal(conversationBackdropSlot.component({ phase: 'active', mainBackgroundStore }), null)

  const fixedArtworkId = releaseArtworkIds.at(-1)
  mainBackgroundStore.fix(fixedArtworkId)
  assert.equal(mainBackgroundStore.getSnapshot().mode, 'fixed')
  assert.equal(mainBackgroundStore.getSnapshot().fixedArtworkId, fixedArtworkId)
  assert.equal(mainBackgroundStore.getSnapshot().shownArtworkId, fixedArtworkId)
  assert.equal(mainBackgroundStorageWrites.length, 2)
  assert.deepEqual(mainBackgroundStorageWrites.at(-1), {
    key: MAIN_BACKGROUND_STORAGE_KEY,
    value: JSON.stringify({ mode: 'fixed', fixedArtworkId }),
  })
  assert.equal(storedMainBackground, mainBackgroundStorageWrites.at(-1).value)
  assert.equal(componentCleanups.length, 1)

  controller.preview('official')
  assert.equal(skinStorageWrites.length, 0)
  assert.equal(controller.getSnapshot().draft, 'official')
  assert.equal(controller.getSnapshot().dirty, true)
  assert.equal(tokenDisposeCalls, 1)
  assert.deepEqual([...slotRegistrations.keys()], ['settings.section'])

  controller.cancelPreview()
  assert.equal(controller.getSnapshot().committed, 'deepseek-blue-whale-chan')
  assert.equal(controller.getSnapshot().draft, 'deepseek-blue-whale-chan')
  assert.equal(controller.getSnapshot().dirty, false)
  assert.equal(overrideHistory.length, 2)
  assert.deepEqual([...slotRegistrations.keys()].sort(), [
    'conversation.backdrop',
    'settings.section',
    'settings.trigger.decoration',
    'sidebar.backdrop',
    'sidebar.newSession.decoration',
    'sidebar.newSession.icon',
  ])

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
  assert.deepEqual([...slotRegistrations.keys()], ['settings.section'])

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
  assert.equal(slotRegistrations.has('sidebar.newSession.decoration'), true)
  assert.equal(slotRegistrations.has('settings.trigger.decoration'), true)

  storedSkin = 'official'
  for (const listener of [...storageListeners]) {
    listener({
      key: SKIN_STORAGE_KEY,
      newValue: storedSkin,
      storageArea: localStorage,
    })
  }
  assert.equal(controller.getSnapshot().committed, 'official')
  assert.deepEqual([...slotRegistrations.keys()], ['settings.section'])
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
  assert.equal(slotRegistrations.has('conversation.backdrop'), true)
  controller.cancelPreview()
  assert.equal(controller.getSnapshot().draft, 'official')
  assert.equal(controller.getSnapshot().error, null)
  assert.deepEqual([...slotRegistrations.keys()], ['settings.section'])
  rejectStorageWrites = false
  controller.preview('deepseek-blue-whale-chan')
  await controller.applyPreview()
  assert.equal(storedSkin, 'deepseek-blue-whale-chan')
  assert.equal(controller.getSnapshot().committed, 'deepseek-blue-whale-chan')
  assert.equal(slotRegistrations.has('sidebar.backdrop'), true)
  componentCleanups[0]()
  assert.equal(controller.getSnapshot().draft, 'deepseek-blue-whale-chan')

  assert.equal(effectDisposers.length, 3)
  effectDisposers[0]()
  effectDisposers[1]()
  effectDisposers[2]()
  assert.deepEqual(
    [...slotInjectionDisposers.keys()].sort(),
    [
      'conversation.backdrop',
      'settings.section',
      'settings.trigger.decoration',
      'sidebar.backdrop',
      'sidebar.newSession.decoration',
      'sidebar.newSession.icon',
    ],
  )
  for (const dispose of slotInjectionDisposers.values()) dispose()
  assert.equal(tokenDisposeCalls, overrideHistory.length)
  assert.equal(localeDisposeCalls, 1)
  assert.equal(slotDisposeCalls.get('settings.section'), 1)
  for (const name of [
    'conversation.backdrop',
    'settings.trigger.decoration',
    'sidebar.backdrop',
    'sidebar.newSession.decoration',
    'sidebar.newSession.icon',
  ]) {
    assert.equal(slotDisposeCalls.get(name), slotRegisterCalls.get(name))
  }
  assert.equal(slotRegistrations.size, 0)
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
