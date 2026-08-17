import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { app, BrowserWindow, dialog, session, shell } from 'electron'
import { probeHarness, startHarness, type ManagedHarness } from './harness-process.ts'
import { resolveDesktopOptions } from './options.ts'

if (!app.requestSingleInstanceLock()) app.exit(0)
app.enableSandbox()

const packageRoot = fileURLToPath(new URL('..', import.meta.url))
const defaultHarnessRoot = resolve(packageRoot, '../../../deepseek-harness')
const options = resolveDesktopOptions(process.argv.slice(1), process.env, defaultHarnessRoot)

let mainWindow: BrowserWindow | undefined
let managedHarness: ManagedHarness | undefined
let quitAfterStop = false

function openExternal(url: string): void {
  const target = new URL(url)
  if (target.protocol === 'https:') void shell.openExternal(target.href)
}

async function resolveHarnessUrl(): Promise<URL> {
  const probe = await probeHarness(options.targetUrl)
  if (probe === 'harness') return options.targetUrl
  if (probe === 'occupied') {
    throw new Error(`${options.targetUrl.origin} is occupied by a server that is not DeepSeek Harness.`)
  }
  if (options.attachOnly) {
    throw new Error(`DeepSeek Harness is not running at ${options.targetUrl.origin}.`)
  }
  managedHarness = await startHarness(options.harnessRoot, options.targetUrl)
  return managedHarness.url
}

async function createWindow(): Promise<void> {
  const url = await resolveHarnessUrl()
  const allowedOrigin = url.origin
  const window = new BrowserWindow({
    title: 'DSH Kisekae',
    width: 1440,
    height: 900,
    minWidth: 860,
    minHeight: 620,
    show: false,
    backgroundColor: '#091824',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webviewTag: false,
    },
  })
  mainWindow = window

  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const sameOrigin = new URL(webContents.getURL()).origin === allowedOrigin
    callback(sameOrigin && permission === 'clipboard-sanitized-write')
  })
  window.webContents.setWindowOpenHandler(({ url: nextUrl }) => {
    openExternal(nextUrl)
    return { action: 'deny' }
  })
  window.webContents.on('will-navigate', (event, nextUrl) => {
    if (new URL(nextUrl).origin === allowedOrigin) return
    event.preventDefault()
    openExternal(nextUrl)
  })
  window.once('ready-to-show', () => window.show())
  window.once('closed', () => {
    if (mainWindow === window) mainWindow = undefined
  })
  await window.loadURL(url.href)
}

app.on('activate', () => {
  if (mainWindow === undefined) void createWindow()
})

app.on('second-instance', () => {
  if (mainWindow === undefined) return
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.show()
  mainWindow.focus()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', (event) => {
  if (managedHarness === undefined || quitAfterStop) return
  event.preventDefault()
  const processToStop = managedHarness
  managedHarness = undefined
  void processToStop.stop().finally(() => {
    quitAfterStop = true
    app.quit()
  })
})

void app.whenReady()
  .then(createWindow)
  .catch((error: unknown) => {
    dialog.showErrorBox('DSH Kisekae could not start', error instanceof Error ? error.message : String(error))
    app.quit()
  })
