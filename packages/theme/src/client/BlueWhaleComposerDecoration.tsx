/** Luminous ocean-glass artwork behind the official composer card content. */

import type { CSSProperties, ReactElement } from 'react'

const ROOT_STYLE: CSSProperties = {
  position: 'relative',
  display: 'block',
  width: '100%',
  height: '100%',
  color: 'var(--dsw-specific-conversation-composer-glass-ornament)',
  boxShadow: 'inset 0 0 0 2px var(--dsw-specific-conversation-composer-glass-rim), inset 0 2px 0 rgba(255, 255, 255, 0.72), inset 0 -3px 8px color-mix(in srgb, var(--dsw-alias-state-business-primary) 34%, transparent), 0 0 16px color-mix(in srgb, var(--dsw-specific-conversation-composer-glass-rim) 62%, transparent)',
}

const HERO_STYLE: CSSProperties = {
  background: 'radial-gradient(86% 145% at 12% -34%, rgba(255, 255, 255, 0.58) 0%, transparent 54%), var(--dsw-specific-conversation-composer-glass-fill)',
}

const COMPOSER_STYLE: CSSProperties = {
  background: 'radial-gradient(72% 125% at 12% -32%, rgba(255, 255, 255, 0.42) 0%, transparent 52%), var(--dsw-specific-conversation-composer-glass-fill)',
}

const TOP_SHINE_STYLE: CSSProperties = {
  position: 'absolute',
  top: 2,
  right: 24,
  left: 24,
  height: 2,
  borderRadius: 999,
  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.84) 18%, rgba(255, 255, 255, 0.42) 82%, transparent)',
}

const TIDE_STYLE: CSSProperties = {
  position: 'absolute',
  right: 0,
  bottom: -1,
  left: 0,
  width: '100%',
  height: 42,
}

const CORNER_STYLE: CSSProperties = {
  position: 'absolute',
  width: 48,
  height: 54,
}

const LEFT_CORNER_STYLE: CSSProperties = {
  ...CORNER_STYLE,
  top: -3,
  left: -2,
}

const RIGHT_CORNER_STYLE: CSSProperties = {
  ...CORNER_STYLE,
  right: -2,
  bottom: -5,
  transform: 'scale(-1, -1)',
}

const CONTROL_HALO_STYLE: CSSProperties = {
  position: 'absolute',
  bottom: 4,
  width: 42,
  height: 42,
  border: '1px solid color-mix(in srgb, var(--dsw-specific-conversation-composer-glass-rim) 88%, white)',
  borderRadius: '50%',
  background: 'radial-gradient(circle at 34% 28%, rgba(255, 255, 255, 0.92) 0%, color-mix(in srgb, var(--dsw-specific-conversation-composer-glass-rim) 76%, transparent) 28%, color-mix(in srgb, var(--dsw-alias-state-business-primary) 68%, transparent) 58%, transparent 72%)',
  boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.82), 0 0 0 2px color-mix(in srgb, var(--dsw-specific-conversation-composer-glass-rim) 30%, transparent), 0 0 13px color-mix(in srgb, var(--dsw-specific-conversation-composer-glass-rim) 70%, transparent)',
}

const STAR_STYLE: CSSProperties = {
  position: 'absolute',
  bottom: 3,
  left: 58,
  width: 18,
  height: 18,
}

const SHELL_STYLE: CSSProperties = {
  position: 'absolute',
  right: 58,
  bottom: 2,
  width: 24,
  height: 20,
}

const PEARLS: readonly CSSProperties[] = [
  { left: '34%', bottom: 5, width: 10, height: 10 },
  { left: '61%', bottom: 3, width: 12, height: 12 },
  { left: '82%', bottom: 8, width: 7, height: 7 },
]

/** Props owned by the official composer-card decoration slot. */
export interface BlueWhaleComposerDecorationProps {
  /** Hero = centered empty-state card; composer = resident bottom card. */
  readonly variant: 'hero' | 'composer'
}

/**
 * Draw a scalable ocean-glass frame without changing the official composer controls.
 * @param props - Official composer placement variant.
 * @returns non-interactive composer-card artwork.
 */
export function BlueWhaleComposerDecoration({
  variant,
}: BlueWhaleComposerDecorationProps): ReactElement {
  const hero = variant === 'hero'
  const ornamentOpacity = hero ? 0.92 : 0.78

  return (
    <span
      data-kisekae-composer-decoration={variant}
      style={{ ...ROOT_STYLE, ...(hero ? HERO_STYLE : COMPOSER_STYLE) }}
    >
      <span data-kisekae-composer-shine="true" style={TOP_SHINE_STYLE} />
      <span
        data-kisekae-composer-control-halo="add"
        style={{ ...CONTROL_HALO_STYLE, left: 5, opacity: hero ? 0.9 : 0.76 }}
      />
      <span
        data-kisekae-composer-control-halo="send"
        style={{ ...CONTROL_HALO_STYLE, right: 4, opacity: hero ? 0.94 : 0.82 }}
      />
      <svg
        data-kisekae-composer-tide="true"
        fill="none"
        preserveAspectRatio="none"
        style={{ ...TIDE_STYLE, opacity: hero ? 0.9 : 0.76 }}
        viewBox="0 0 120 42"
      >
        <path
          d="M-8 28C2 16 12 16 22 28S42 40 52 28 72 16 82 28 102 40 112 28 132 16 142 28"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M-8 33C2 23 12 23 22 33S42 43 52 33 72 23 82 33 102 43 112 33 132 23 142 33"
          opacity="0.62"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M-8 37C4 30 16 30 28 37S52 44 64 37 88 30 100 37 124 44 136 37"
          opacity="0.3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg
        data-kisekae-composer-corner="whale-tail"
        fill="none"
        style={{ ...LEFT_CORNER_STYLE, opacity: ornamentOpacity }}
        viewBox="0 0 48 54"
      >
        <path d="M4 6c8 1 13 5 16 12 3-7 8-11 16-12-1 9-6 15-16 18C10 21 5 15 4 6Z" fill="currentColor" />
        <path d="M20 21c-7 8-9 17-5 28M20 28c8 0 14 4 18 12" opacity="0.58" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        <circle cx="38" cy="42" fill="currentColor" opacity="0.7" r="2" />
      </svg>
      <svg
        data-kisekae-composer-corner="whale-tail-right"
        fill="none"
        style={{ ...RIGHT_CORNER_STYLE, opacity: ornamentOpacity }}
        viewBox="0 0 48 54"
      >
        <path d="M4 6c8 1 13 5 16 12 3-7 8-11 16-12-1 9-6 15-16 18C10 21 5 15 4 6Z" fill="currentColor" />
        <path d="M20 21c-7 8-9 17-5 28M20 28c8 0 14 4 18 12" opacity="0.58" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
      <svg data-kisekae-composer-ornament="star" style={{ ...STAR_STYLE, opacity: ornamentOpacity }} viewBox="0 0 24 24">
        <path d="m12 1.8 2.8 6.6 7.1.6-5.4 4.7 1.7 7-6.2-3.8-6.2 3.8 1.7-7L2.1 9l7.1-.6L12 1.8Z" fill="currentColor" />
      </svg>
      <svg data-kisekae-composer-ornament="shell" fill="none" style={{ ...SHELL_STYLE, opacity: ornamentOpacity }} viewBox="0 0 30 24">
        <path d="M3 20C4 10 8 4 15 3c7 1 11 7 12 17H3Z" fill="currentColor" opacity="0.82" />
        <path d="M15 4v15M10 6l2 13M20 6l-2 13M6 11l4 8M24 11l-4 8" stroke="white" strokeLinecap="round" strokeWidth="1.2" />
      </svg>
      {PEARLS.map((style, index) => (
        <span
          key={String(index)}
          data-kisekae-composer-ornament="pearl"
          style={{
            position: 'absolute',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 32% 28%, white 0%, color-mix(in srgb, var(--dsw-specific-conversation-composer-glass-rim) 72%, white) 38%, color-mix(in srgb, var(--dsw-alias-state-business-primary) 58%, transparent) 100%)',
            boxShadow: '0 1px 4px color-mix(in srgb, var(--dsw-alias-state-business-primary) 48%, transparent)',
            opacity: ornamentOpacity,
            ...style,
          }}
        />
      ))}
    </span>
  )
}
