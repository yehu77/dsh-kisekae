/** Browser-local preference store for the main conversation background. */

import {
  DEFAULT_MAIN_BACKGROUND_ARTWORK_ID,
  KISEKAE_ARTWORK_IDS,
  KISEKAE_ARTWORKS,
  type ArtworkId,
} from '../artworks'

/** Versioned browser preference key for main-background controls. */
export const KISEKAE_MAIN_BACKGROUND_STORAGE_KEY = '@yehu77/dsh-kisekae:main-background:v1'

/** Available main-background display modes. */
export type MainBackgroundMode = 'fixed' | 'random' | 'off'

/** Current main-background controls and resolved artwork. */
export interface MainBackgroundSnapshot {
  readonly mode: MainBackgroundMode
  readonly fixedArtworkId: ArtworkId
  readonly shownArtworkId: ArtworkId | null
}

interface StoredMainBackgroundPreference {
  mode: MainBackgroundMode
  fixedArtworkId: ArtworkId
}

interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const ARTWORK_IDS = new Set<string>(KISEKAE_ARTWORK_IDS)

/** Small localStorage-backed store shared by settings and the conversation backdrop. */
export class MainBackgroundStore {
  private readonly listeners = new Set<() => void>()
  private readonly storage: StorageLike | undefined
  private snapshot: MainBackgroundSnapshot

  /**
   * @param storage - Browser storage; omitted callers use the current window.
   */
  constructor(storage?: StorageLike) {
    let browserStorage = storage
    if (browserStorage === undefined) {
      try {
        browserStorage = window.localStorage
      } catch (_browserStorageUnavailable) {
        browserStorage = undefined
      }
    }
    this.storage = browserStorage

    const preference = this.read()
    this.snapshot = this.resolve(preference.mode, preference.fixedArtworkId)
  }

  /** @returns the current main-background snapshot. */
  readonly getSnapshot = (): MainBackgroundSnapshot => this.snapshot

  /**
   * Observe main-background preference changes.
   * @param listener - Subscriber notified after a local change.
   * @returns disposer removing the subscriber.
   */
  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /**
   * Change how the main background is selected.
   * @param mode - Fixed, random, or hidden mode.
   */
  setMode(mode: MainBackgroundMode): void {
    this.replace(this.resolve(mode, this.snapshot.fixedArtworkId))
  }

  /**
   * Show and remember one catalog artwork in fixed mode.
   * @param artworkId - Any released gallery artwork.
   */
  fix(artworkId: string): void {
    if (!ARTWORK_IDS.has(artworkId)) return
    this.replace(this.resolve('fixed', artworkId as ArtworkId))
  }

  private read(): StoredMainBackgroundPreference {
    const fallback: StoredMainBackgroundPreference = {
      mode: 'random',
      fixedArtworkId: DEFAULT_MAIN_BACKGROUND_ARTWORK_ID,
    }
    if (this.storage === undefined) return fallback

    try {
      const raw = this.storage.getItem(KISEKAE_MAIN_BACKGROUND_STORAGE_KEY)
      if (raw === null) return fallback
      const value = JSON.parse(raw) as Partial<StoredMainBackgroundPreference>
      if (!this.isMode(value.mode) || !ARTWORK_IDS.has(value.fixedArtworkId ?? '')) return fallback
      return value as StoredMainBackgroundPreference
    } catch (_storedPreferenceUnavailable) {
      return fallback
    }
  }

  private resolve(mode: MainBackgroundMode, fixedArtworkId: ArtworkId): MainBackgroundSnapshot {
    if (mode === 'off') return { mode, fixedArtworkId, shownArtworkId: null }
    if (mode === 'fixed') return { mode, fixedArtworkId, shownArtworkId: fixedArtworkId }

    const index = Math.floor(Math.random() * KISEKAE_ARTWORKS.length)
    return { mode, fixedArtworkId, shownArtworkId: KISEKAE_ARTWORKS[index]!.id as ArtworkId }
  }

  private replace(snapshot: MainBackgroundSnapshot): void {
    this.snapshot = snapshot
    try {
      this.storage?.setItem(KISEKAE_MAIN_BACKGROUND_STORAGE_KEY, JSON.stringify({
        mode: snapshot.mode,
        fixedArtworkId: snapshot.fixedArtworkId,
      } satisfies StoredMainBackgroundPreference))
    } catch (_browserStorageUnavailable) {
      // The current in-memory choice remains active.
    }
    for (const listener of [...this.listeners]) listener()
  }

  private isMode(value: unknown): value is MainBackgroundMode {
    return value === 'fixed' || value === 'random' || value === 'off'
  }
}
