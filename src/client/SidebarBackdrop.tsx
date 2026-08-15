/** Blue Whale glass sidebar artwork for the official backdrop slot. */

import { useSyncExternalStore } from 'react'
import type { CSSProperties, ReactElement } from 'react'
import { artworkUrl } from '../artworks'
import type { SidebarBackdropStore } from './sidebar-backdrop-store'

const ROOT_STYLE: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 86%, var(--dsw-alias-brand-primary)) 0%, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 58%, var(--dsw-alias-brand-primary)) 100%)',
}

const LAYER_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
}

const IMAGE_STYLE: CSSProperties = {
  ...LAYER_STYLE,
  backgroundPosition: 'center bottom',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.68) 24%, #000 54%)',
  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.68) 24%, #000 54%)',
}

const GLASS_STYLE: CSSProperties = {
  ...LAYER_STYLE,
  background: 'linear-gradient(180deg, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 94%, transparent) 0%, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 74%, transparent) 58%, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 58%, transparent) 100%)',
}

/** Props composed by the official sidebar backdrop slot. */
export interface SidebarBackdropProps {
  /** Whether the sidebar is rendering its full-width content. */
  readonly wide: boolean
  /** Shared preference store injected by Kisekae. */
  readonly backdropStore: SidebarBackdropStore
}

/**
 * Render the fixed rain artwork, or a quiet gradient for the narrow rail.
 * @param props - Official sidebar owner state plus Kisekae preferences.
 * @returns decorative sidebar layer.
 */
export function SidebarBackdrop({ wide, backdropStore }: SidebarBackdropProps): ReactElement {
  const snapshot = useSyncExternalStore(
    backdropStore.subscribe,
    backdropStore.getSnapshot,
    backdropStore.getSnapshot,
  )
  const enabled = snapshot.mode !== 'off'
  const immersive = snapshot.mode === 'immersive'

  return (
    <div
      aria-hidden="true"
      data-kisekae-sidebar-backdrop={snapshot.mode}
      data-kisekae-sidebar-wide={wide ? 'true' : 'false'}
      style={{ ...ROOT_STYLE, background: enabled ? ROOT_STYLE.background : 'transparent' }}
    >
      {enabled && wide && (
        <>
          <div
            data-kisekae-sidebar-artwork={snapshot.artworkId}
            style={{
              ...IMAGE_STYLE,
              backgroundImage: `url(${artworkUrl(snapshot.artworkId)})`,
              opacity: immersive ? 0.76 : 0.56,
            }}
          />
          <div style={{ ...GLASS_STYLE, opacity: immersive ? 0.20 : 0.34 }} />
        </>
      )}
    </div>
  )
}
