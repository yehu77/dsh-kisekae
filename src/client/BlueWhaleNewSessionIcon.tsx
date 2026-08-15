/** DeepSeek Blue Whale-chan replacement for the sidebar's New Session glyph. */

import type { ReactElement } from 'react'

/** Props owned by the official New Session icon slot. */
export interface BlueWhaleNewSessionIconProps {
  /** Whether the sidebar is rendering its full-width content. */
  readonly wide: boolean
}

/**
 * Render a chat bubble and plus sign with a small ocean-wave accent.
 * @param props - Official sidebar display state.
 * @returns decorative New Session icon.
 */
export function BlueWhaleNewSessionIcon({ wide }: BlueWhaleNewSessionIconProps): ReactElement {
  const size = wide ? 16 : 18

  return (
    <svg
      aria-hidden="true"
      data-kisekae-new-session-icon="blue-whale-wave-chat"
      fill="none"
      focusable="false"
      height={size}
      style={{ color: 'var(--dsw-alias-brand-primary)' }}
      viewBox="0 0 20 20"
      width={size}
    >
      <path
        d="M3.25 7.25A3.5 3.5 0 0 1 6.75 3.75h6.5a3.5 3.5 0 0 1 3.5 3.5v3.5a3.5 3.5 0 0 1-3.5 3.5H8.1l-3.85 2v-3.18a3.48 3.48 0 0 1-1-2.32v-3.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.25 5.75v4M5.25 7.75h4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M9.75 11.4c.82-.78 1.64-.78 2.46 0s1.64.78 2.46 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}
