/** Reversible preview and persistence controller for the Kisekae skin layer. */

import {
  DEFAULT_KISEKAE_SKIN, isKisekaeSkinId, KISEKAE_SKIN_FIELD,
  type KisekaeSettings, type KisekaeSkinId,
} from '../settings-contract'
import { DEEPSEEK_BLUE_WHALE_CHAN } from './themes/deepseek-blue-whale-chan'
import type { ThemeTokenOverrides } from './theme-types'

type Disposer = () => void

/** Browser-local preference store for the selected Kisekae skin. */
export interface KisekaePreferenceStore {
  /** @returns the current preference snapshot. */
  getSnapshot(): {
    readonly status: 'loading' | 'ready' | 'unavailable'
    readonly value: KisekaeSettings | undefined
    readonly writable: boolean
    readonly mode: 'browser' | 'memory'
  }
  /** Observe settings snapshot replacements. */
  subscribe(listener: () => void): Disposer
  /** Persist one scalar field. */
  set(field: string, value: unknown): Promise<void>
}

/** Token overlay service supplied by the official Harness theme plugin. */
export interface KisekaeThemeService {
  /** Install or replace one reversible token layer. */
  overrideTokens(source: string, tokens: ThemeTokenOverrides): Disposer
}

/** Stable snapshot consumed by the settings section. */
export interface SkinSelectionSnapshot {
  readonly status: 'loading' | 'ready' | 'unavailable'
  readonly committed: KisekaeSkinId
  readonly draft: KisekaeSkinId
  readonly dirty: boolean
  readonly writable: boolean
  readonly mode: 'browser' | 'memory'
  readonly saving: boolean
  readonly error: 'save-failed' | null
  /** Unknown stored id currently falling back to Official appearance. */
  readonly unavailableSkin: string | null
}

const TOKEN_SOURCE = '@yehu77/dsh-kisekae'

function acceptedSkin(store: KisekaePreferenceStore): {
  readonly skin: KisekaeSkinId
  readonly unavailableSkin: string | null
} {
  const value = store.getSnapshot().value?.skin
  if (value === undefined) return { skin: DEFAULT_KISEKAE_SKIN, unavailableSkin: null }
  return isKisekaeSkinId(value)
    ? { skin: value, unavailableSkin: null }
    : { skin: 'official', unavailableSkin: value }
}

/**
 * Own the currently presented token layer, one staged choice, and the last
 * browser-saved choice.
 */
export class SkinSelectionController {
  private snapshot: SkinSelectionSnapshot
  private readonly listeners = new Set<() => void>()
  private storeDisposer: Disposer | undefined
  private tokenDisposer: Disposer | undefined
  private presented: KisekaeSkinId | undefined
  private generation = 0
  private activeGeneration: number | undefined

  /**
   * @param theme - Official token override service.
   * @param store - Browser-local preference store.
   */
  constructor(
    private readonly theme: KisekaeThemeService,
    private readonly store: KisekaePreferenceStore,
  ) {
    const stored = store.getSnapshot()
    this.snapshot = {
      status: stored.status,
      committed: DEFAULT_KISEKAE_SKIN,
      draft: DEFAULT_KISEKAE_SKIN,
      dirty: false,
      writable: stored.writable,
      mode: stored.mode,
      saving: false,
      error: null,
      unavailableSkin: null,
    }
  }

  /** @returns the current stable selection snapshot. */
  readonly getSnapshot = (): SkinSelectionSnapshot => this.snapshot

  /**
   * Observe selection snapshot replacements.
   * @param listener - React or test subscriber.
   * @returns the disposer removing the subscriber.
   */
  readonly subscribe = (listener: () => void): Disposer => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /**
   * Start preference synchronization and present the saved/default skin.
   * @returns cleanup that removes the token layer and subscription.
   */
  mount(): Disposer {
    if (this.activeGeneration !== undefined) {
      throw new Error('Kisekae skin controller is already mounted')
    }
    const generation = ++this.generation
    this.activeGeneration = generation
    this.storeDisposer = this.store.subscribe(() => { this.syncFromStore(generation) })
    this.syncFromStore(generation)
    let disposed = false
    return () => {
      if (disposed) return
      disposed = true
      if (this.activeGeneration !== generation) return
      this.activeGeneration = undefined
      const storeDisposer = this.storeDisposer
      this.storeDisposer = undefined
      storeDisposer?.()
      const tokenDisposer = this.tokenDisposer
      this.tokenDisposer = undefined
      this.presented = undefined
      tokenDisposer?.()
    }
  }

  /** Stage and immediately preview one card without writing browser storage. */
  preview(skin: KisekaeSkinId): void {
    const generation = this.activeGeneration
    if (generation === undefined || this.snapshot.saving || skin === this.snapshot.draft) return
    this.present(skin, generation)
    if (this.activeGeneration !== generation) return
    this.replace({ draft: skin, error: null })
  }

  /** Discard the staged choice and restore the latest browser-saved skin. */
  cancelPreview(): void {
    const generation = this.activeGeneration
    if (generation === undefined) return
    this.present(this.snapshot.committed, generation)
    if (this.activeGeneration !== generation) return
    this.replace({ draft: this.snapshot.committed, error: null })
  }

  /**
   * Persist the staged choice, confirming success from the accepted snapshot.
   * @returns settlement after the browser-storage write and confirmation read.
   */
  async applyPreview(): Promise<void> {
    const generation = this.activeGeneration
    if (
      generation === undefined
      || !this.snapshot.dirty
      || !this.snapshot.writable
      || this.snapshot.saving
    ) return
    const target = this.snapshot.draft
    this.replace({ saving: true, error: null })
    try {
      await this.store.set(KISEKAE_SKIN_FIELD, target)
    } catch (_unexpectedSettingsFailure) {
      if (this.activeGeneration === generation) {
        this.replace({ saving: false, error: 'save-failed' })
      }
      return
    }
    if (this.activeGeneration !== generation) return
    this.syncFromStore(generation)
    const accepted = this.store.getSnapshot().status === 'ready'
      && this.store.getSnapshot().value?.skin === target
    this.replace({ saving: false, error: accepted ? null : 'save-failed' })
  }

  private syncFromStore(generation: number): void {
    if (this.activeGeneration !== generation) return
    const stored = this.store.getSnapshot()
    const accepted = acceptedSkin(this.store)
    const nextCommitted = accepted.skin
    const committedChanged = nextCommitted !== this.snapshot.committed
      || accepted.unavailableSkin !== this.snapshot.unavailableSkin
    const nextDraft = !this.snapshot.dirty || committedChanged
      ? nextCommitted
      : this.snapshot.draft
    this.present(nextDraft, generation)
    this.replace({
      status: stored.status,
      committed: nextCommitted,
      draft: nextDraft,
      writable: stored.writable,
      mode: stored.mode,
      unavailableSkin: accepted.unavailableSkin,
      ...(committedChanged ? { error: null } : {}),
    })
  }

  private present(skin: KisekaeSkinId, generation: number): void {
    if (this.activeGeneration !== generation || skin === this.presented) return
    const previous = this.tokenDisposer
    const next = skin === 'official'
      ? undefined
      : this.theme.overrideTokens(TOKEN_SOURCE, DEEPSEEK_BLUE_WHALE_CHAN.tokens)
    if (this.activeGeneration !== generation) {
      next?.()
      return
    }
    this.tokenDisposer = next
    this.presented = skin
    previous?.()
  }

  private replace(changes: Partial<Omit<SkinSelectionSnapshot, 'dirty'>>): void {
    const next = { ...this.snapshot, ...changes }
    const replacement: SkinSelectionSnapshot = {
      ...next,
      dirty: next.draft !== next.committed
        || (next.unavailableSkin !== null && next.draft === 'official'),
    }
    const changed = Object.keys(replacement).some((key) => {
      const field = key as keyof SkinSelectionSnapshot
      return replacement[field] !== this.snapshot[field]
    })
    if (!changed) return
    this.snapshot = replacement
    for (const listener of [...this.listeners]) listener()
  }
}
