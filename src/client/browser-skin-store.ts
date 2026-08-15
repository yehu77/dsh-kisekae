/** Browser-local, cross-tab preference store for the selected Kisekae skin. */

import {
  KISEKAE_SKIN_FIELD, KISEKAE_SKIN_STORAGE_KEY,
  type KisekaeSettings,
} from '../settings-contract'
import type { KisekaePreferenceStore } from './skin-controller'

type Disposer = () => void

interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

interface StorageEventLike {
  readonly key: string | null
  readonly newValue: string | null
  readonly storageArea?: StorageLike | null
}

interface BrowserWindowLike {
  readonly localStorage: StorageLike
  addEventListener(type: 'storage', listener: (event: StorageEventLike) => void): void
  removeEventListener(type: 'storage', listener: (event: StorageEventLike) => void): void
}

type StoreSnapshot = ReturnType<KisekaePreferenceStore['getSnapshot']>

/** Immediate localStorage mirror with explicit unavailable fallback. */
export class BrowserSkinStore implements KisekaePreferenceStore {
  private readonly listeners = new Set<() => void>()
  private storage: StorageLike | undefined
  private snapshot: StoreSnapshot
  private mounted = false

  /**
   * @param browser - Current browser window and its origin-local storage.
   */
  constructor(private readonly browser: BrowserWindowLike) {
    try {
      this.storage = browser.localStorage
      this.snapshot = this.readySnapshot(this.storage.getItem(KISEKAE_SKIN_STORAGE_KEY))
    } catch (_browserStorageUnavailable) {
      this.snapshot = this.unavailableSnapshot()
    }
  }

  /** @returns the stable browser preference snapshot. */
  readonly getSnapshot = (): StoreSnapshot => this.snapshot

  /**
   * Observe preference replacements.
   * @param listener - Controller subscriber.
   * @returns disposer removing the subscriber.
   */
  readonly subscribe = (listener: () => void): Disposer => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /**
   * Listen for preference changes from another tab.
   * @returns cleanup removing the browser listener.
   */
  mount(): Disposer {
    if (this.mounted) throw new Error('Kisekae browser skin store is already mounted')
    this.mounted = true
    this.browser.addEventListener('storage', this.onStorage)
    return () => {
      if (!this.mounted) return
      this.mounted = false
      this.browser.removeEventListener('storage', this.onStorage)
    }
  }

  /** Persist the selected skin for this browser origin. */
  async set(field: string, value: unknown): Promise<void> {
    if (field !== KISEKAE_SKIN_FIELD || typeof value !== 'string' || this.storage === undefined) return
    try {
      this.storage.setItem(KISEKAE_SKIN_STORAGE_KEY, value)
    } catch (error: unknown) {
      throw error
    }
    this.replace(this.readySnapshot(value))
  }

  private readonly onStorage = (event: StorageEventLike): void => {
    if (event.storageArea != null && event.storageArea !== this.storage) return
    if (event.key !== null && event.key !== KISEKAE_SKIN_STORAGE_KEY) return
    this.replace(this.readySnapshot(event.newValue))
  }

  private readySnapshot(value: string | null): StoreSnapshot {
    return {
      status: 'ready',
      value: value === null ? undefined : { skin: value } satisfies KisekaeSettings,
      writable: true,
      mode: 'browser',
    }
  }

  private unavailableSnapshot(): StoreSnapshot {
    return {
      status: 'unavailable',
      value: undefined,
      writable: false,
      mode: 'memory',
    }
  }

  private replace(snapshot: StoreSnapshot): void {
    this.snapshot = snapshot
    for (const listener of [...this.listeners]) listener()
  }
}
