/** Phase-aware Blue Whale edge artwork behind the official conversation surface. */

import { useSyncExternalStore } from 'react'
import type { CSSProperties, ReactElement } from 'react'
import { artworkUrl } from '../artworks'
import type { MainBackgroundStore } from './main-background-store'

/** Conversation display phase supplied by the official backdrop slot. */
export type ConversationBackdropPhase = 'settling' | 'hero' | 'active'

const ROOT_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  userSelect: 'none',
}

const LAYER_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
}

const PHASE_TRANSITION_CSS = `
[data-kisekae-conversation-backdrop] > [data-kisekae-conversation-artwork] {
  transition: opacity 180ms ease;
}
@media (prefers-reduced-motion: reduce) {
  [data-kisekae-conversation-backdrop] > [data-kisekae-conversation-artwork] {
    transition: none !important;
  }
}
`

const ARTWORK_STYLE: CSSProperties = {
  ...LAYER_STYLE,
  backgroundPosition: 'right bottom',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'auto min(92%, 760px)',
  maskImage: 'radial-gradient(ellipse at 100% 100%, #000 0%, rgba(0, 0, 0, 0.94) 46%, transparent 76%)',
  WebkitMaskImage: 'radial-gradient(ellipse at 100% 100%, #000 0%, rgba(0, 0, 0, 0.94) 46%, transparent 76%)',
}

interface PhaseVisuals {
  readonly artworkOpacity: number
  readonly background: string
  readonly readingLane: string
  readonly seaFog: string
}

const PHASE_VISUALS: Record<ConversationBackdropPhase, PhaseVisuals> = {
  hero: {
    artworkOpacity: 0.66,
    background: 'linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-bg-base) 76%, var(--dsw-alias-bg-overlay)) 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 70%, var(--dsw-alias-brand-primary)) 100%)',
    readingLane: 'linear-gradient(90deg, color-mix(in srgb, var(--dsw-alias-bg-base) 82%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 90%, transparent) 54%, transparent 84%)',
    seaFog: 'linear-gradient(0deg, color-mix(in srgb, var(--dsw-alias-bg-overlay) 94%, var(--dsw-alias-brand-primary)) 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 78%, transparent) 58%, transparent 100%)',
  },
  active: {
    artworkOpacity: 0.14,
    background: 'linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-bg-base) 96%, var(--dsw-alias-brand-primary)) 0%, var(--dsw-alias-bg-base) 100%)',
    readingLane: 'linear-gradient(90deg, color-mix(in srgb, var(--dsw-alias-bg-base) 86%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 96%, transparent) 20%, color-mix(in srgb, var(--dsw-alias-bg-base) 96%, transparent) 76%, transparent 100%)',
    seaFog: 'linear-gradient(0deg, color-mix(in srgb, var(--dsw-alias-bg-base) 96%, var(--dsw-alias-bg-overlay)) 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 76%, transparent) 52%, transparent 100%)',
  },
  settling: {
    artworkOpacity: 0.28,
    background: 'linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-bg-base) 92%, var(--dsw-alias-bg-overlay)) 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 88%, var(--dsw-alias-brand-primary)) 100%)',
    readingLane: 'linear-gradient(90deg, color-mix(in srgb, var(--dsw-alias-bg-base) 88%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 94%, transparent) 66%, transparent 88%)',
    seaFog: 'linear-gradient(0deg, color-mix(in srgb, var(--dsw-alias-bg-base) 94%, var(--dsw-alias-bg-overlay)) 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 78%, transparent) 54%, transparent 100%)',
  },
}

/** Props composed by the official conversation backdrop slot. */
export interface BlueWhaleConversationBackdropProps {
  /** Current stable conversation layout phase. */
  readonly phase: ConversationBackdropPhase
  /** Shared main-background preference store. */
  readonly mainBackgroundStore: MainBackgroundStore
}

/**
 * Render phase-aware edge artwork with a protected transcript and composer lane.
 * @param props - Official conversation phase plus Kisekae background preferences.
 * @returns decorative conversation layer, or nothing in off mode.
 */
export function BlueWhaleConversationBackdrop({
  phase,
  mainBackgroundStore,
}: BlueWhaleConversationBackdropProps): ReactElement | null {
  const snapshot = useSyncExternalStore(
    mainBackgroundStore.subscribe,
    mainBackgroundStore.getSnapshot,
    mainBackgroundStore.getSnapshot,
  )
  if (snapshot.shownArtworkId === null) return null
  const visuals = PHASE_VISUALS[phase]

  return (
    <div
      aria-hidden="true"
      data-kisekae-conversation-backdrop={phase}
      data-kisekae-main-background={snapshot.shownArtworkId}
      style={{ ...ROOT_STYLE, background: visuals.background }}
    >
      <style>{PHASE_TRANSITION_CSS}</style>
      <span
        data-kisekae-conversation-artwork={snapshot.shownArtworkId}
        style={{
          ...ARTWORK_STYLE,
          backgroundImage: `url(${artworkUrl(snapshot.shownArtworkId)})`,
          opacity: visuals.artworkOpacity,
        }}
      />
      <span
        data-kisekae-conversation-reading-lane="true"
        style={{ ...LAYER_STYLE, background: visuals.readingLane }}
      />
      <span
        data-kisekae-conversation-sea-fog="true"
        style={{ ...LAYER_STYLE, top: '62%', background: visuals.seaFog }}
      />
    </div>
  )
}
