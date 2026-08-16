/** Sea-glass artwork behind the official composer card content. */

import type { CSSProperties, ReactElement } from 'react'

const ROOT_STYLE: CSSProperties = {
  position: 'relative',
  display: 'block',
  width: '100%',
  height: '100%',
  color: 'var(--dsw-alias-brand-primary)',
}

const HERO_STYLE: CSSProperties = {
  background: 'radial-gradient(80% 120% at 10% -16%, color-mix(in srgb, var(--dsw-alias-bg-overlay) 44%, transparent) 0%, transparent 50%), linear-gradient(135deg, color-mix(in srgb, var(--dsw-alias-state-business-tertiary) 32%, transparent) 0%, transparent 58%, color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent) 100%)',
  boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 38%, var(--dsw-alias-border-l2)), inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-bg-overlay) 76%, transparent), inset 0 -1px 0 color-mix(in srgb, var(--dsw-alias-brand-primary) 18%, transparent)',
}

const COMPOSER_STYLE: CSSProperties = {
  background: 'radial-gradient(72% 110% at 10% -18%, color-mix(in srgb, var(--dsw-alias-bg-overlay) 20%, transparent) 0%, transparent 48%), linear-gradient(135deg, color-mix(in srgb, var(--dsw-alias-state-business-tertiary) 14%, transparent) 0%, transparent 62%, color-mix(in srgb, var(--dsw-alias-brand-primary) 7%, transparent) 100%)',
  boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 24%, var(--dsw-alias-border-l2)), inset 0 1px 0 color-mix(in srgb, var(--dsw-alias-bg-overlay) 58%, transparent), inset 0 -1px 0 color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, transparent)',
}

const TIDE_STYLE: CSSProperties = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  width: '100%',
  height: 18,
}

const CORNER_STYLE: CSSProperties = {
  position: 'absolute',
  top: 3,
  right: 5,
  width: 34,
  height: 20,
}

/** Props owned by the official composer-card decoration slot. */
export interface BlueWhaleComposerDecorationProps {
  /** Hero = centered empty-state card; composer = resident bottom card. */
  readonly variant: 'hero' | 'composer'
}

/**
 * Draw semantic sea glass, border light, tide lines, and a quiet whale-tail corner.
 * @param props - Official composer placement variant.
 * @returns non-interactive composer-card artwork.
 */
export function BlueWhaleComposerDecoration({
  variant,
}: BlueWhaleComposerDecorationProps): ReactElement {
  const hero = variant === 'hero'

  return (
    <span
      data-kisekae-composer-decoration={variant}
      style={{ ...ROOT_STYLE, ...(hero ? HERO_STYLE : COMPOSER_STYLE) }}
    >
      <svg
        data-kisekae-composer-tide="true"
        fill="none"
        preserveAspectRatio="none"
        style={{ ...TIDE_STYLE, opacity: hero ? 0.28 : 0.12 }}
        viewBox="0 0 100 18"
      >
        <path
          d="M-5 9C3 3 11 3 19 9S35 15 43 9 59 3 67 9 83 15 91 9 107 3 115 9"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M-8 14C0 10 8 10 16 14S32 18 40 14 56 10 64 14 80 18 88 14 104 10 112 14"
          opacity="0.48"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        data-kisekae-composer-corner="whale-tail"
        fill="none"
        style={{ ...CORNER_STYLE, opacity: hero ? 0.22 : 0.08 }}
        viewBox="0 0 36 20"
      >
        <path
          d="M3 12c4-.4 7-2 9-5 2 2 4 3 6 3s4-1 6-3c2 3 5 4.6 9 5-3.5 3.6-8.5 5.4-15 5.4S6.5 15.6 3 12Z"
          fill="currentColor"
          opacity="0.46"
        />
        <circle cx="29" cy="5" fill="currentColor" r="1.2" />
        <circle cx="33" cy="2.5" fill="currentColor" opacity="0.6" r="0.8" />
      </svg>
    </span>
  )
}
