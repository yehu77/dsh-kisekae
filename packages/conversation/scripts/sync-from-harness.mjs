import { execFileSync } from 'node:child_process'
import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const forkRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const harnessRoot = resolve(
  process.argv[2] ?? join(forkRoot, '..', '..', '..', 'deepseek-harness'),
)
const packageRoot = join(
  harnessRoot,
  'packages',
  'client',
  'ui-conversation',
)
const upstreamManifest = JSON.parse(
  await readFile(join(packageRoot, 'package.json'), 'utf8'),
)

if (upstreamManifest.name !== '@deepseek-ai/dsh-client-ui-conversation') {
  throw new Error(`Not a DeepSeek Harness checkout: ${harnessRoot}`)
}

function runPnpm(args) {
  execFileSync('pnpm', args, {
    cwd: harnessRoot,
    stdio: 'inherit',
  })
}

async function replaceDirectory(source, destination) {
  await rm(destination, { recursive: true, force: true })
  await cp(source, destination, { recursive: true })
}

async function copyDeclarations(source, destination) {
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const sourcePath = join(source, entry.name)
    const destinationPath = join(destination, entry.name)

    if (entry.isDirectory()) {
      await mkdir(destinationPath, { recursive: true })
      await copyDeclarations(sourcePath, destinationPath)
      continue
    }

    if (entry.name.endsWith('.d.ts')) {
      const declaration = await readFile(sourcePath, 'utf8')
      await writeFile(destinationPath, declaration.replace(/[ \t]+$/gm, ''))
    }
  }
}

runPnpm([
  'exec',
  'tsc',
  '-b',
  'packages/client/ui-conversation/tsconfig.json',
])
runPnpm([
  '--filter',
  '@deepseek-ai/dsh-client-ui-conversation',
  'bundle',
])

await replaceDirectory(join(packageRoot, 'src'), join(forkRoot, 'src'))
await replaceDirectory(join(packageRoot, 'tests'), join(forkRoot, 'tests'))
await cp(join(packageRoot, 'tsconfig.json'), join(forkRoot, 'tsconfig.json'))
await cp(
  join(packageRoot, 'tsdown.config.ts'),
  join(forkRoot, 'tsdown.config.ts'),
)

const upstreamLib = join(packageRoot, 'lib')
const forkLib = join(forkRoot, 'lib')
await rm(forkLib, { recursive: true, force: true })
await mkdir(join(forkLib, 'types'), { recursive: true })
await cp(join(upstreamLib, 'index.js'), join(forkLib, 'index.js'))
await cp(join(upstreamLib, 'invariant.js'), join(forkLib, 'invariant.js'))
await cp(join(upstreamLib, 'client.js.map'), join(forkLib, 'client.js.map'))
await copyDeclarations(join(upstreamLib, 'types'), join(forkLib, 'types'))

const clientBundle = await readFile(join(upstreamLib, 'client.js'), 'utf8')
await writeFile(
  join(forkLib, 'client.js'),
  `${clientBundle.trimEnd()}\n\n/* dsh-kisekae-conversation community fork */\n`,
)

const commit = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: harnessRoot,
  encoding: 'utf8',
}).trim()
const upstream = {
  repository: 'https://github.com/deepseek-ai/deepseek-harness.git',
  packagePath: 'packages/client/ui-conversation',
  commit,
  version: upstreamManifest.version,
  syncedAt: new Date().toISOString().slice(0, 10),
}
await writeFile(
  join(forkRoot, 'UPSTREAM.json'),
  `${JSON.stringify(upstream, null, 2)}\n`,
)

console.log(`Synced ui-conversation ${upstream.version} from ${commit}.`)
