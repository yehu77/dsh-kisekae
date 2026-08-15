/** Browser-local preference store for the sidebar backdrop. */

import {
  KISEKAE_ARTWORK_IDS,
  type ArtworkId,
} from '../artworks'

/** Versioned browser preference key for the sidebar backdrop. */
export const KISEKAE_SIDEBAR_BACKDROP_STORAGE_KEY = '@yehu77/dsh-kisekae:sidebar-backdrop:v1'

/** Rain scene selected for a new browser origin. */
export const DEFAULT_SIDEBAR_BACKDROP_ARTWORK_ID: ArtworkId = '7fd9fafc-aa19-449d-a92d-338a9bce7db5'

/** Available sidebar atmosphere levels. */
export type SidebarBackdropMode = 'clear' | 'immersive' | 'off'

/** Current sidebar backdrop preference. */
export interface SidebarBackdropSnapshot {
  readonly mode: SidebarBackdropMode
  readonly artworkId: ArtworkId
}

interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const ARTWORK_IDS = new Set<string>(KISEKAE_ARTWORK_IDS)

/** Immediate localStorage-backed store shared by settings and the sidebar slot. */
export class SidebarBackdropStore {
  private readonly listeners = new Set<() => void>()
  private readonly storage: StorageLike | undefined
  private snapshot: SidebarBackdropSnapshot

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
    this.snapshot = this.read()
  }

  /** @returns the current sidebar backdrop preference. */
  readonly getSnapshot = (): SidebarBackdropSnapshot => this.snapshot

  /**
   * Observe backdrop preference changes.
   * @param listener - Subscriber notified after a local change.
   * @returns disposer removing the subscriber.
   */
  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /**
   * Change the sidebar atmosphere level.
   * @param mode - Clear, immersive, or disabled.
   */
  setMode(mode: SidebarBackdropMode): void {
    this.replace({ ...this.snapshot, mode })
  }

  /**
   * Fix one released illustration as the sidebar background.
   * @param artworkId - Artwork chosen from the shared catalog.
   */
  setArtwork(artworkId: string): void {
    if (!ARTWORK_IDS.has(artworkId)) return
    this.replace({ ...this.snapshot, artworkId: artworkId as ArtworkId })
  }

  private read(): SidebarBackdropSnapshot {
    const fallback: SidebarBackdropSnapshot = {
      mode: 'clear',
      artworkId: DEFAULT_SIDEBAR_BACKDROP_ARTWORK_ID,
    }
    if (this.storage === undefined) return fallback

    try {
      const raw = this.storage.getItem(KISEKAE_SIDEBAR_BACKDROP_STORAGE_KEY)
      if (raw === null) return fallback
      const value = JSON.parse(raw) as Partial<SidebarBackdropSnapshot>
      if (!this.isMode(value.mode) || !ARTWORK_IDS.has(value.artworkId ?? '')) return fallback
      return value as SidebarBackdropSnapshot
    } catch (_storedPreferenceUnavailable) {
      return fallback
    }
  }

  private replace(snapshot: SidebarBackdropSnapshot): void {
    this.snapshot = snapshot
    try {
      this.storage?.setItem(KISEKAE_SIDEBAR_BACKDROP_STORAGE_KEY, JSON.stringify(snapshot))
    } catch (_browserStorageUnavailable) {
      // The current in-memory choice remains active.
    }
    for (const listener of [...this.listeners]) listener()
  }

  private isMode(value: unknown): value is SidebarBackdropMode {
    return value === 'clear' || value === 'immersive' || value === 'off'
  }
}
