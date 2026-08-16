/** Browser-local preference store for the sidebar backdrop. */
import { type ArtworkId } from '../artworks';
/** Versioned browser preference key for the sidebar backdrop. */
export declare const KISEKAE_SIDEBAR_BACKDROP_STORAGE_KEY = "@yehu77/dsh-kisekae:sidebar-backdrop:v1";
/** Rain scene selected for a new browser origin. */
export declare const DEFAULT_SIDEBAR_BACKDROP_ARTWORK_ID: ArtworkId;
/** Available sidebar atmosphere levels. */
export type SidebarBackdropMode = 'clear' | 'immersive' | 'off';
/** Current sidebar backdrop preference. */
export interface SidebarBackdropSnapshot {
    readonly mode: SidebarBackdropMode;
    readonly artworkId: ArtworkId;
}
interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
/** Immediate localStorage-backed store shared by settings and the sidebar slot. */
export declare class SidebarBackdropStore {
    private readonly listeners;
    private readonly storage;
    private snapshot;
    /**
     * @param storage - Browser storage; omitted callers use the current window.
     */
    constructor(storage?: StorageLike);
    /** @returns the current sidebar backdrop preference. */
    readonly getSnapshot: () => SidebarBackdropSnapshot;
    /**
     * Observe backdrop preference changes.
     * @param listener - Subscriber notified after a local change.
     * @returns disposer removing the subscriber.
     */
    readonly subscribe: (listener: () => void) => (() => void);
    /**
     * Change the sidebar atmosphere level.
     * @param mode - Clear, immersive, or disabled.
     */
    setMode(mode: SidebarBackdropMode): void;
    /**
     * Fix one released illustration as the sidebar background.
     * @param artworkId - Artwork chosen from the shared catalog.
     */
    setArtwork(artworkId: string): void;
    private read;
    private replace;
    private isMode;
}
export {};
//# sourceMappingURL=sidebar-backdrop-store.d.ts.map