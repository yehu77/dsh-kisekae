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

const ARTWORK_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
}

/** Props composed by the official conversation backdrop slot. */
export interface BlueWhaleConversationBackdropProps {
  /** Current stable conversation layout phase. */
  readonly phase: ConversationBackdropPhase
  /** Shared main-background preference store. */
  readonly mainBackgroundStore: MainBackgroundStore
}

/**
 * Render unobscured full-bleed artwork behind the conversation surface.
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

  return (
    <div
      aria-hidden="true"
      data-kisekae-conversation-backdrop={phase}
      data-kisekae-main-background={snapshot.shownArtworkId}
      style={ROOT_STYLE}
    >
      <span
        data-kisekae-conversation-artwork={snapshot.shownArtworkId}
        style={{
          ...ARTWORK_STYLE,
          backgroundImage: `url(${artworkUrl(snapshot.shownArtworkId)})`,
        }}
      />
    </div>
  )
}
