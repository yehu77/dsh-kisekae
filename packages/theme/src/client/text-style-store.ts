/** Browser-local text-style preference and reversible theme layer. */

import type { ThemeTokenOverrides } from './theme-types'

/** Versioned browser preference key for the text-style selector. */
export const KISEKAE_TEXT_STYLE_STORAGE_KEY = '@yehu77/dsh-kisekae:text-style:v1'

/** Generic choices shared by every Kisekae theme. */
export type TextStyleMode = 'theme-default' | 'official-clear' | 'effects-off'

/** Current text-style choice. */
export interface TextStyleSnapshot {
  readonly mode: TextStyleMode
}

/** Overrides supplied by one theme for the two optional text styles. */
export type TextStyleOverrides = Readonly<Record<Exclude<TextStyleMode, 'theme-default'>, ThemeTokenOverrides>>

interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

interface ThemeService {
  overrideTokens(source: string, tokens: ThemeTokenOverrides): () => void
}

const TEXT_STYLE_SOURCE = '@yehu77/dsh-kisekae:text-style'

/** Immediate localStorage-backed text-style preference. */
export class TextStyleStore {
  private readonly listeners = new Set<() => void>()
  private readonly storage: StorageLike | undefined
  private snapshot: TextStyleSnapshot

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
    this.snapshot = { mode: this.read() }
  }

  /** @returns the current text-style preference. */
  readonly getSnapshot = (): TextStyleSnapshot => this.snapshot

  /**
   * Observe text-style changes.
   * @param listener - Subscriber notified after a local change.
   * @returns disposer removing the subscriber.
   */
  readonly subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /**
   * Select and persist one text style.
   * @param mode - Theme default, official clear, or effects-off presentation.
   */
  setMode(mode: TextStyleMode): void {
    if (mode === this.snapshot.mode) return
    this.snapshot = { mode }
    try {
      this.storage?.setItem(KISEKAE_TEXT_STYLE_STORAGE_KEY, mode)
    } catch (_browserStorageUnavailable) {
      // The current in-memory choice remains active.
    }
    for (const listener of [...this.listeners]) listener()
  }

  private read(): TextStyleMode {
    try {
      const value = this.storage?.getItem(KISEKAE_TEXT_STYLE_STORAGE_KEY)
      return value === 'official-clear' || value === 'effects-off' ? value : 'theme-default'
    } catch (_browserStorageUnavailable) {
      return 'theme-default'
    }
  }
}

/**
 * Apply the selected optional text layer while its parent skin is visible.
 * @param theme - Official reversible token service.
 * @param store - Current browser-local text-style preference.
 * @param overrides - Theme-owned values for optional modes.
 * @returns cleanup for the subscription and active token layer.
 */
export function mountTextStyle(
  theme: ThemeService,
  store: TextStyleStore,
  overrides: TextStyleOverrides,
): () => void {
  let disposeLayer: (() => void) | undefined
  const sync = (): void => {
    const previous = disposeLayer
    const mode = store.getSnapshot().mode
    disposeLayer = mode === 'theme-default'
      ? undefined
      : theme.overrideTokens(TEXT_STYLE_SOURCE, overrides[mode])
    previous?.()
  }
  const unsubscribe = store.subscribe(sync)
  sync()
  return () => {
    unsubscribe()
    disposeLayer?.()
    disposeLayer = undefined
  }
}
