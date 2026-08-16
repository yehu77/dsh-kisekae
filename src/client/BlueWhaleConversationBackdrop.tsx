/** Phase-aware Blue Whale artwork behind the official conversation surface. */

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
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
}

const READING_LANE_STYLE: CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
}

interface PhaseVisuals {
  readonly artworkOpacity: number
  readonly background: string
  readonly chromeVeil: string | null
  readonly readingLane: string
  readonly readingLaneWidth: string
  readonly seaFog: string | null
}

const PHASE_VISUALS: Record<ConversationBackdropPhase, PhaseVisuals> = {
  hero: {
    artworkOpacity: 0.82,
    background: 'linear-gradient(180deg, var(--dsw-alias-bg-base) 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 84%, var(--dsw-alias-bg-overlay)) 100%)',
    chromeVeil: null,
    readingLane: 'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--dsw-specific-input-major) 24%, transparent) 18%, color-mix(in srgb, var(--dsw-specific-input-major) 48%, transparent) 36%, color-mix(in srgb, var(--dsw-specific-input-major) 48%, transparent) 64%, color-mix(in srgb, var(--dsw-specific-input-major) 24%, transparent) 82%, transparent 100%)',
    readingLaneWidth: 'min(100%, 920px)',
    seaFog: 'linear-gradient(0deg, color-mix(in srgb, var(--dsw-specific-input-major) 64%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 28%, transparent) 58%, transparent 100%)',
  },
  active: {
    artworkOpacity: 0.88,
    background: 'var(--dsw-alias-bg-base)',
    chromeVeil: 'linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-bg-base) 92%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 92%, transparent) 66%, transparent 100%)',
    readingLane: 'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 74%, transparent) 4%, color-mix(in srgb, var(--dsw-alias-bg-base) 92%, transparent) 9%, color-mix(in srgb, var(--dsw-alias-bg-base) 92%, transparent) 91%, color-mix(in srgb, var(--dsw-alias-bg-base) 74%, transparent) 96%, transparent 100%)',
    readingLaneWidth: 'min(100%, 900px)',
    seaFog: null,
  },
  settling: {
    artworkOpacity: 0.64,
    background: 'linear-gradient(180deg, var(--dsw-alias-bg-base) 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 90%, var(--dsw-alias-bg-overlay)) 100%)',
    chromeVeil: 'linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-bg-base) 88%, transparent) 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 88%, transparent) 66%, transparent 100%)',
    readingLane: 'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--dsw-alias-bg-base) 68%, transparent) 5%, color-mix(in srgb, var(--dsw-alias-bg-base) 88%, transparent) 10%, color-mix(in srgb, var(--dsw-alias-bg-base) 88%, transparent) 90%, color-mix(in srgb, var(--dsw-alias-bg-base) 68%, transparent) 95%, transparent 100%)',
    readingLaneWidth: 'min(100%, 900px)',
    seaFog: null,
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
 * Render phase-aware full-bleed artwork with a protected transcript lane.
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
        style={{
          ...READING_LANE_STYLE,
          width: visuals.readingLaneWidth,
          background: visuals.readingLane,
        }}
      />
      {visuals.chromeVeil !== null && (
        <span
          data-kisekae-conversation-chrome-veil="true"
          style={{ ...LAYER_STYLE, bottom: 'auto', height: 120, background: visuals.chromeVeil }}
        />
      )}
      {visuals.seaFog !== null && (
        <span
          data-kisekae-conversation-sea-fog="true"
          style={{ ...LAYER_STYLE, top: '62%', background: visuals.seaFog }}
        />
      )}
    </div>
  )
}
