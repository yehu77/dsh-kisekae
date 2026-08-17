import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/main.ts', 'src/options.ts', 'src/harness-process.ts'],
  outDir: 'lib',
  format: 'esm',
  platform: 'node',
  target: 'node24',
  deps: { neverBundle: ['electron'] },
  sourcemap: true,
  clean: false,
  outputOptions: { entryFileNames: '[name].js' },
})
