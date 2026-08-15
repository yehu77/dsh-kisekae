/** Decorative right-bottom artwork card for the current mascot preference. */

import { useSyncExternalStore } from 'react'
import type { CSSProperties, ReactElement } from 'react'
import { KISEKAE_ARTWORKS, artworkUrl } from '../artworks'
import type { MascotStore } from './mascot-store'

const ARTWORK_BY_ID = new Map(KISEKAE_ARTWORKS.map(artwork => [artwork.id, artwork]))

const ROOT_STYLE: CSSProperties = {
  position: 'absolute',
  right: 'max(12px, env(safe-area-inset-right))',
  bottom: 'max(68px, calc(env(safe-area-inset-bottom) + 12px))',
  width: 'clamp(96px, 14vw, 180px)',
  aspectRatio: '3 / 4',
  padding: 4,
  overflow: 'hidden',
  pointerEvents: 'none',
  userSelect: 'none',
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: 16,
  background: 'var(--dsw-alias-bg-layer-1)',
  boxShadow: '0 10px 30px rgba(3, 20, 32, 0.18)',
}

const IMAGE_STYLE: CSSProperties = {
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  objectPosition: 'center',
  borderRadius: 12,
}

/** Props injected into the root overlay slot. */
export interface KisekaeMascotOverlayProps {
  readonly mascotStore: MascotStore
}

/** Render one non-interactive framed illustration, or nothing in off mode. */
export function KisekaeMascotOverlay({ mascotStore }: KisekaeMascotOverlayProps): ReactElement | null {
  const snapshot = useSyncExternalStore(
    mascotStore.subscribe,
    mascotStore.getSnapshot,
    mascotStore.getSnapshot,
  )
  const artwork = snapshot.shownArtworkId === null
    ? undefined
    : ARTWORK_BY_ID.get(snapshot.shownArtworkId)
  if (artwork === undefined) return null

  return (
    <div aria-hidden="true" data-kisekae-mascot={artwork.id} style={ROOT_STYLE}>
      <img alt="" draggable={false} src={artworkUrl(artwork.id)} style={IMAGE_STYLE} />
    </div>
  )
}
