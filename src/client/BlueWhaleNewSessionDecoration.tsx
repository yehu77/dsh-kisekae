/** Glass-and-art treatment behind the official New Session button content. */

import type { CSSProperties, ReactElement } from 'react'
import { artworkUrl } from '../artworks'
import type { ArtworkId } from '../artworks'

const NEW_SESSION_ARTWORK_ID: ArtworkId = '7a9c4fae-6fca-4c5e-b232-5c802f788dae'

const ROOT_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  boxSizing: 'border-box',
  border: '1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 22%, var(--dsw-alias-border-l2))',
  borderRadius: 'inherit',
  color: 'var(--dsw-alias-brand-primary)',
  pointerEvents: 'none',
}

const WIDE_ROOT_STYLE: CSSProperties = {
  ...ROOT_STYLE,
  background: 'linear-gradient(105deg, color-mix(in srgb, var(--dsw-alias-button-elevated-fill) 96%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-button-elevated-fill) 88%, transparent) 58%, color-mix(in srgb, var(--dsw-alias-brand-primary) 20%, var(--dsw-alias-button-elevated-fill)) 100%)',
  boxShadow: 'inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-bg-overlay) 58%, transparent)',
  backdropFilter: 'blur(2px) saturate(1.08)',
  WebkitBackdropFilter: 'blur(2px) saturate(1.08)',
}

const IMAGE_STYLE: CSSProperties = {
  position: 'absolute',
  inset: '0 0 0 auto',
  width: '52%',
  backgroundPosition: 'center 44%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  maskImage: 'linear-gradient(to right, transparent 0%, black 48%)',
  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 48%)',
  opacity: 0.26,
}

const READABILITY_SCRIM_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(90deg, color-mix(in srgb, var(--dsw-alias-button-elevated-fill) 84%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-button-elevated-fill) 62%, transparent) 56%, transparent 100%)',
}

const RAIL_ROOT_STYLE: CSSProperties = {
  ...ROOT_STYLE,
  background: 'linear-gradient(145deg, color-mix(in srgb, var(--dsw-alias-bg-overlay) 72%, transparent), color-mix(in srgb, var(--dsw-alias-brand-primary) 24%, var(--dsw-alias-button-elevated-fill)))',
  boxShadow: 'inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-bg-overlay) 66%, transparent)',
}

/** Props owned by the official New Session decoration slot. */
export interface BlueWhaleNewSessionDecorationProps {
  /** Whether the sidebar is rendering its full-width content. */
  readonly wide: boolean
}

/**
 * Render quiet artwork behind the wide button and compact glass in the rail.
 * @param props - Official sidebar display state.
 * @returns non-interactive button decoration.
 */
export function BlueWhaleNewSessionDecoration({
  wide,
}: BlueWhaleNewSessionDecorationProps): ReactElement {
  return (
    <span
      aria-hidden="true"
      data-kisekae-new-session-decoration={wide ? 'wide' : 'rail'}
      style={wide ? WIDE_ROOT_STYLE : RAIL_ROOT_STYLE}
    >
      {wide
        ? (
            <>
              <span
                data-kisekae-new-session-artwork={NEW_SESSION_ARTWORK_ID}
                style={{
                  ...IMAGE_STYLE,
                  backgroundImage: `url(${artworkUrl(NEW_SESSION_ARTWORK_ID)})`,
                }}
              />
              <span style={READABILITY_SCRIM_STYLE} />
            </>
          )
        : (
            <svg
              aria-hidden="true"
              data-kisekae-new-session-rail-wave="true"
              fill="none"
              height="100%"
              viewBox="0 0 36 36"
              width="100%"
            >
              <path
                d="M3 26c5-5 10-5 15 0s10 5 15 0"
                opacity="0.28"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
          )}
    </span>
  )
}
