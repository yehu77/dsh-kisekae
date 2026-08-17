import { spawn, type ChildProcessByStdio } from 'node:child_process'
import { access } from 'node:fs/promises'
import { join } from 'node:path'
import { createInterface } from 'node:readline'
import { once } from 'node:events'
import type { Readable } from 'node:stream'

const BOOT_MARKER = 'window.__DSH_BOOT__'

export type HarnessProbe = 'harness' | 'unavailable' | 'occupied'

export interface ManagedHarness {
  readonly url: URL
  stop(): Promise<void>
}

/** Identify whether a loopback origin is an assembled Harness Web profile. */
export async function probeHarness(url: URL): Promise<HarnessProbe> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2_000) })
    const html = await response.text()
    return response.ok && html.includes(BOOT_MARKER) ? 'harness' : 'occupied'
  } catch {
    return 'unavailable'
  }
}

function launchCommand(harnessRoot: string, targetUrl: URL): { command: string, args: string[] } {
  const port = targetUrl.port || '80'
  const node = process.env.DSH_DESKTOP_NODE
  if (node !== undefined && node.length > 0) {
    return {
      command: node,
      args: [
        '--import',
        'tsx/esm',
        join(harnessRoot, 'apps/cli/src/bin.ts'),
        '--profile',
        'web',
        '--host',
        targetUrl.hostname,
        '--port',
        port,
      ],
    }
  }
  return {
    command: 'pnpm',
    args: ['dsh', '--profile', 'web', '--host', targetUrl.hostname, '--port', port],
  }
}

function waitForReady(child: ChildProcessByStdio<null, Readable, Readable>, expected: URL): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false
    const output = createInterface({ input: child.stdout })
    const errors = createInterface({ input: child.stderr })
    let timeout: ReturnType<typeof setTimeout>
    const finish = (callback: () => void): void => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      output.close()
      errors.close()
      callback()
    }
    timeout = setTimeout(
      () => finish(() => reject(new Error('Harness did not become ready within 30 seconds.'))),
      30_000,
    )
    output.on('line', (line) => {
      console.log(`[harness] ${line}`)
      if (line.includes(`dsh web: ${expected.origin}`)) finish(resolve)
    })
    errors.on('line', line => console.error(`[harness] ${line}`))
    child.once('error', error => finish(() => reject(error)))
    child.once('exit', code => finish(() => reject(new Error(`Harness exited before startup (code ${String(code)}).`))))
  })
}

/** Start the sibling Harness checkout and return its owned process handle. */
export async function startHarness(harnessRoot: string, targetUrl: URL): Promise<ManagedHarness> {
  await access(join(harnessRoot, 'apps/cli/src/bin.ts'))
  const launch = launchCommand(harnessRoot, targetUrl)
  const child = spawn(launch.command, launch.args, {
    cwd: harnessRoot,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  await waitForReady(child, targetUrl)
  return {
    url: targetUrl,
    async stop(): Promise<void> {
      if (child.exitCode !== null || child.signalCode !== null) return
      child.kill('SIGTERM')
      await Promise.race([
        once(child, 'exit'),
        new Promise<void>(resolve => setTimeout(resolve, 3_000)),
      ])
      if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL')
    },
  }
}
