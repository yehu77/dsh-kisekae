/** Keep shell-level Kisekae visuals aligned with the currently previewed skin. */

import type { KisekaeSkinId } from '../settings-contract'

type Disposer = () => void

/** Selection state required to toggle the visual contribution group. */
export interface SkinVisualSelection {
  /** @returns the skin currently presented by preview or saved selection. */
  getSnapshot(): { readonly draft: KisekaeSkinId }
  /** Observe draft replacements. */
  subscribe(listener: () => void): Disposer
}

/**
 * Mount all Blue Whale shell visuals while its card is the visible draft.
 * @param selection - Current preview selection.
 * @param installVisuals - Installs the complete reversible visual group.
 * @returns cleanup for the subscription and any mounted visual group.
 */
export function mountSkinVisuals(
  selection: SkinVisualSelection,
  installVisuals: () => Disposer,
): Disposer {
  let disposeVisuals: Disposer | undefined
  const sync = (): void => {
    const enabled = selection.getSnapshot().draft === 'deepseek-blue-whale-chan'
    if (enabled && disposeVisuals === undefined) {
      disposeVisuals = installVisuals()
    } else if (!enabled && disposeVisuals !== undefined) {
      const dispose = disposeVisuals
      disposeVisuals = undefined
      dispose()
    }
  }
  const unsubscribe = selection.subscribe(sync)
  sync()
  return () => {
    unsubscribe()
    disposeVisuals?.()
    disposeVisuals = undefined
  }
}
