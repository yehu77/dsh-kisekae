/** Browser-local preference store for the main conversation background. */
import { type ArtworkId } from '../artworks';
/** Versioned browser preference key for main-background controls. */
export declare const KISEKAE_MAIN_BACKGROUND_STORAGE_KEY = "@yehu77/dsh-kisekae:main-background:v1";
/** Available main-background display modes. */
export type MainBackgroundMode = 'fixed' | 'random' | 'off';
/** Current main-background controls and resolved artwork. */
export interface MainBackgroundSnapshot {
    readonly mode: MainBackgroundMode;
    readonly fixedArtworkId: ArtworkId;
    readonly shownArtworkId: ArtworkId | null;
}
interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
/** Small localStorage-backed store shared by settings and the conversation backdrop. */
export declare class MainBackgroundStore {
    private readonly listeners;
    private readonly storage;
    private snapshot;
    /**
     * @param storage - Browser storage; omitted callers use the current window.
     */
    constructor(storage?: StorageLike);
    /** @returns the current main-background snapshot. */
    readonly getSnapshot: () => MainBackgroundSnapshot;
    /**
     * Observe main-background preference changes.
     * @param listener - Subscriber notified after a local change.
     * @returns disposer removing the subscriber.
     */
    readonly subscribe: (listener: () => void) => (() => void);
    /**
     * Change how the main background is selected.
     * @param mode - Fixed, random, or hidden mode.
     */
    setMode(mode: MainBackgroundMode): void;
    /**
     * Show and remember one catalog artwork in fixed mode.
     * @param artworkId - Any released gallery artwork.
     */
    fix(artworkId: string): void;
    private read;
    private resolve;
    private replace;
    private isMode;
}
export {};
//# sourceMappingURL=main-background-store.d.ts.map