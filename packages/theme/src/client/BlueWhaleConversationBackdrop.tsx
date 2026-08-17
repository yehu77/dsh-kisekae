/** Phase-aware Blue Whale artwork behind the official conversation surface. */

import { useSyncExternalStore } from 'react'
import type { CSSProperties, ReactElement } from 'react'
import { KISEKAE_ARTWORKS, artworkUrl } from '../artworks'
import type { MainBackgroundStore } from './main-background-store'

/** Conversation display phase supplied by the official backdrop slot. */
export type ConversationBackdropPhase = 'settling' | 'hero' | 'active'

const ROOT_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'var(--dsw-alias-bg-base)',
  overflow: 'hidden',
  pointerEvents: 'none',
  userSelect: 'none',
}

const AMBIENT_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  opacity: 0.46,
}

const ARTWORK_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'block',
  width: '100%',
  height: '100%',
  objectPosition: 'center',
}

/** Props composed by the official conversation backdrop slot. */
export interface BlueWhaleConversationBackdropProps {
  /** Current stable conversation layout phase. */
  readonly phase: ConversationBackdropPhase
  /** Shared main-background preference store. */
  readonly mainBackgroundStore: MainBackgroundStore
}

/**
 * Render the complete artwork over a quiet full-canvas copy of the same scene.
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
  const artwork = KISEKAE_ARTWORKS.find(entry => entry.id === snapshot.shownArtworkId)!

  return (
    <div
      aria-hidden="true"
      data-kisekae-conversation-backdrop={phase}
      data-kisekae-main-background={snapshot.shownArtworkId}
      style={ROOT_STYLE}
    >
      {artwork.fit === 'contain' && (
        <span
          data-kisekae-conversation-ambient={snapshot.shownArtworkId}
          style={{
            ...AMBIENT_STYLE,
            backgroundImage: `url(${artworkUrl(snapshot.shownArtworkId)})`,
          }}
        />
      )}
      <img
        alt=""
        data-kisekae-conversation-artwork={snapshot.shownArtworkId}
        draggable={false}
        src={artworkUrl(snapshot.shownArtworkId)}
        style={{ ...ARTWORK_STYLE, objectFit: artwork.fit }}
      />
    </div>
  )
}
