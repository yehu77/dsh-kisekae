import { resolve } from 'node:path'

const LOOPBACK_HOSTS = new Set(['127.0.0.1', '::1', 'localhost'])

export interface DesktopOptions {
  readonly harnessRoot: string
  readonly targetUrl: URL
  readonly attachOnly: boolean
}

function readOption(argv: readonly string[], name: string): string | undefined {
  const index = argv.indexOf(name)
  if (index === -1) return undefined
  const value = argv[index + 1]
  if (value === undefined || value.startsWith('--')) {
    throw new Error(`${name} requires a value`)
  }
  return value
}

/** Parse and restrict a renderer URL to the local Harness server. */
export function parseLoopbackUrl(value: string): URL {
  const url = new URL(value)
  if (url.protocol !== 'http:' || !LOOPBACK_HOSTS.has(url.hostname)) {
    throw new Error('The desktop shell only loads a loopback HTTP Harness URL.')
  }
  return url
}

/** Resolve desktop launch options from CLI arguments and the process environment. */
export function resolveDesktopOptions(
  argv: readonly string[],
  environment: NodeJS.ProcessEnv,
  defaultHarnessRoot: string,
): DesktopOptions {
  const explicitUrl = readOption(argv, '--url') ?? environment.DSH_DESKTOP_URL
  const harnessRoot = resolve(
    readOption(argv, '--harness-root')
      ?? environment.DSH_DESKTOP_HARNESS_ROOT
      ?? defaultHarnessRoot,
  )
  return {
    harnessRoot,
    targetUrl: parseLoopbackUrl(explicitUrl ?? 'http://127.0.0.1:3080/'),
    attachOnly: explicitUrl !== undefined,
  }
}
