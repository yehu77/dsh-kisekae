/** Blue Whale artwork and glass behind the official Settings trigger content. */

import type { CSSProperties, ReactElement } from 'react'
import { artworkUrl } from '../artworks'
import type { ArtworkId } from '../artworks'

const SETTINGS_ARTWORK_ID: ArtworkId = 'd5dd1b2f-ecdc-4be7-abef-ce9a0cfc6f97'

const ROOT_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  boxSizing: 'border-box',
  border: '1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 30%, var(--dsw-alias-border-l2))',
  borderRadius: 'inherit',
  color: 'var(--dsw-alias-brand-primary)',
  pointerEvents: 'none',
}

const WIDE_ROOT_STYLE: CSSProperties = {
  ...ROOT_STYLE,
  background: 'linear-gradient(100deg, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 82%, var(--dsw-alias-brand-primary)) 0%, color-mix(in srgb, var(--dsw-alias-bg-overlay) 74%, var(--dsw-alias-brand-primary)) 66%, color-mix(in srgb, var(--dsw-alias-brand-primary) 34%, var(--dsw-specific-sidebar-fill)) 100%)',
  boxShadow: 'inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-bg-overlay) 62%, transparent)',
}

const IMAGE_STYLE: CSSProperties = {
  position: 'absolute',
  inset: '0 0 0 auto',
  width: '46%',
  backgroundPosition: 'center 46%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  maskImage: 'linear-gradient(to right, transparent 0%, black 55%)',
  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 55%)',
  opacity: 0.34,
}

const READABILITY_SCRIM_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(90deg, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 78%, transparent) 0%, color-mix(in srgb, var(--dsw-specific-sidebar-fill) 58%, transparent) 62%, transparent 100%)',
}

const RAIL_ROOT_STYLE: CSSProperties = {
  ...ROOT_STYLE,
  background: 'radial-gradient(circle at 68% 24%, color-mix(in srgb, var(--dsw-alias-bg-overlay) 72%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-brand-primary) 22%, var(--dsw-specific-sidebar-fill)) 100%)',
  boxShadow: 'inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-bg-overlay) 66%, transparent)',
}

/** Props owned by the official Settings trigger decoration slot. */
export interface BlueWhaleSettingsTriggerDecorationProps {
  /** Whether the sidebar is rendering its full-width content. */
  readonly wide: boolean
}

/**
 * Render right-side artwork in the wide trigger and quiet ripples in the rail.
 * @param props - Official sidebar display state.
 * @returns non-interactive Settings trigger decoration.
 */
export function BlueWhaleSettingsTriggerDecoration({
  wide,
}: BlueWhaleSettingsTriggerDecorationProps): ReactElement {
  return (
    <span
      aria-hidden="true"
      data-kisekae-settings-trigger-decoration={wide ? 'wide' : 'rail'}
      style={wide ? WIDE_ROOT_STYLE : RAIL_ROOT_STYLE}
    >
      {wide
        ? (
            <>
              <span
                data-kisekae-settings-trigger-artwork={SETTINGS_ARTWORK_ID}
                style={{
                  ...IMAGE_STYLE,
                  backgroundImage: `url(${artworkUrl(SETTINGS_ARTWORK_ID)})`,
                }}
              />
              <span style={READABILITY_SCRIM_STYLE} />
            </>
          )
        : (
            <svg
              aria-hidden="true"
              data-kisekae-settings-trigger-ripples="true"
              fill="none"
              height="100%"
              viewBox="0 0 36 36"
              width="100%"
            >
              <path
                d="M4 25c4.67-3.5 9.33-3.5 14 0s9.33 3.5 14 0"
                opacity="0.22"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
              <path
                d="M7 29c3.67-2.5 7.33-2.5 11 0s7.33 2.5 11 0"
                opacity="0.14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.25"
              />
            </svg>
          )}
    </span>
  )
}
