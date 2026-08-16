/** Host half: serves the released artwork used by the browser plugin. */

import { readFile } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Context } from '@deepseek-ai/cordis'
import { KISEKAE_ARTWORK_ROUTE, KISEKAE_ARTWORKS } from './artworks'

interface WebServerService {
  register(route: {
    readonly kind: 'prefix'
    readonly path: string
    readonly handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>
  }): () => void
}

type HostContext = Context & { readonly webServer: WebServerService }

const ARTWORK_DIRECTORY = new URL('../assets/release/deepseek-blue-whale-chan/', import.meta.url)
const ARTWORK_FILES = new Map(KISEKAE_ARTWORKS.map(artwork => [artwork.id, artwork.file]))

/** Required Host service for the same-origin artwork route. */
export const inject = ['webServer']

/**
 * Serve catalogued artwork from the installed package.
 * @param ctx - Host context carrying the Web route registry.
 */
export function apply(ctx: Context): void {
  const host = ctx as HostContext
  ctx.effect(
    () => host.webServer.register({
      kind: 'prefix',
      path: KISEKAE_ARTWORK_ROUTE,
      handler: async (req, res) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.writeHead(405, { allow: 'GET, HEAD' })
          res.end()
          return
        }

        const segment = new URL(req.url ?? '/', 'http://localhost').pathname.split('/').at(-1)
        const id = segment?.endsWith('.jpg') === true ? segment.slice(0, -4) : undefined
        const file = id === undefined ? undefined : ARTWORK_FILES.get(id)
        if (file === undefined) {
          res.writeHead(404)
          res.end()
          return
        }

        const content = await readFile(new URL(file, ARTWORK_DIRECTORY)).catch(() => undefined)
        if (content === undefined) {
          res.writeHead(404)
          res.end()
          return
        }
        res.writeHead(200, {
          'cache-control': 'public, max-age=86400',
          'content-length': content.byteLength,
          'content-type': 'image/jpeg',
        })
        res.end(req.method === 'HEAD' ? undefined : content)
      },
    }),
    'dsh-kisekae: artwork route',
  )
}
