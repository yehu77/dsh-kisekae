/** Browser-local preference store for the corner mascot. */

import {
  DEFAULT_MASCOT_ARTWORK_ID,
  KISEKAE_ARTWORK_IDS,
  KISEKAE_MASCOT_ARTWORKS,
  type ArtworkId,
} from '../artworks'

/** Versioned browser preference key for mascot controls. */
export const KISEKAE_MASCOT_STORAGE_KEY = '@yehu77/dsh-kisekae:mascot:v1'

/** Available mascot display modes. */
export type MascotMode = 'fixed' | 'random' | 'off'

/** Current mascot controls and resolved artwork. */
export interface MascotSnapshot {
  readonly mode: MascotMode
  readonly fixedArtworkId: ArtworkId
  readonly shownArtworkId: ArtworkId | null
}

interface StoredMascotPreference {
  mode: MascotMode
  fixedArtworkId: ArtworkId
}

interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const ARTWORK_IDS = new Set<string>(KISEKAE_ARTWORK_IDS)

/** Small localStorage-backed store used by the settings page and mascot overlay. */
export class MascotStore {
  private readonly listeners = new Set<() => void>()
  private readonly storage: StorageLike | undefined
  private snapshot: MascotSnapshot

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

  /** @returns the current mascot snapshot. */
  readonly getSnapshot = (): MascotSnapshot => this.snapshot

  /**
   * Observe mascot preference changes.
   * @param listener - Subscriber notified after a local change.
   * @returns disposer removing the subscriber.
   */
  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /**
   * Change how the corner mascot is selected.
   * @param mode - Fixed, random, or hidden mode.
   */
  setMode(mode: MascotMode): void {
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

  private read(): StoredMascotPreference {
    const fallback: StoredMascotPreference = {
      mode: 'random',
      fixedArtworkId: DEFAULT_MASCOT_ARTWORK_ID,
    }
    if (this.storage === undefined) return fallback

    try {
      const raw = this.storage.getItem(KISEKAE_MASCOT_STORAGE_KEY)
      if (raw === null) return fallback
      const value = JSON.parse(raw) as Partial<StoredMascotPreference>
      if (!this.isMode(value.mode) || !ARTWORK_IDS.has(value.fixedArtworkId ?? '')) return fallback
      return value as StoredMascotPreference
    } catch (_storedPreferenceUnavailable) {
      return fallback
    }
  }

  private resolve(mode: MascotMode, fixedArtworkId: ArtworkId): MascotSnapshot {
    if (mode === 'off') return { mode, fixedArtworkId, shownArtworkId: null }
    if (mode === 'fixed') return { mode, fixedArtworkId, shownArtworkId: fixedArtworkId }

    const index = Math.floor(Math.random() * KISEKAE_MASCOT_ARTWORKS.length)
    return { mode, fixedArtworkId, shownArtworkId: KISEKAE_MASCOT_ARTWORKS[index]!.id as ArtworkId }
  }

  private replace(snapshot: MascotSnapshot): void {
    this.snapshot = snapshot
    try {
      this.storage?.setItem(KISEKAE_MASCOT_STORAGE_KEY, JSON.stringify({
        mode: snapshot.mode,
        fixedArtworkId: snapshot.fixedArtworkId,
      } satisfies StoredMascotPreference))
    } catch (_browserStorageUnavailable) {
      // The current in-memory choice remains active.
    }
    for (const listener of [...this.listeners]) listener()
  }

  private isMode(value: unknown): value is MascotMode {
    return value === 'fixed' || value === 'random' || value === 'off'
  }
}
