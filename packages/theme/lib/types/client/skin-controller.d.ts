/** Reversible preview and persistence controller for the Kisekae skin layer. */
import { type KisekaeSettings, type KisekaeSkinId } from '../settings-contract';
import type { ThemeTokenOverrides } from './theme-types';
type Disposer = () => void;
/** Browser-local preference store for the selected Kisekae skin. */
export interface KisekaePreferenceStore {
    /** @returns the current preference snapshot. */
    getSnapshot(): {
        readonly status: 'loading' | 'ready' | 'unavailable';
        readonly value: KisekaeSettings | undefined;
        readonly writable: boolean;
        readonly mode: 'browser' | 'memory';
    };
    /** Observe settings snapshot replacements. */
    subscribe(listener: () => void): Disposer;
    /** Persist one scalar field. */
    set(field: string, value: unknown): Promise<void>;
}
/** Token overlay service supplied by the official Harness theme plugin. */
export interface KisekaeThemeService {
    /** Install or replace one reversible token layer. */
    overrideTokens(source: string, tokens: ThemeTokenOverrides): Disposer;
}
/** Stable snapshot consumed by the settings section. */
export interface SkinSelectionSnapshot {
    readonly status: 'loading' | 'ready' | 'unavailable';
    readonly committed: KisekaeSkinId;
    readonly draft: KisekaeSkinId;
    readonly dirty: boolean;
    readonly writable: boolean;
    readonly mode: 'browser' | 'memory';
    readonly saving: boolean;
    readonly error: 'save-failed' | null;
    /** Unknown stored id currently falling back to Official appearance. */
    readonly unavailableSkin: string | null;
}
/**
 * Own the currently presented token layer, one staged choice, and the last
 * browser-saved choice.
 */
export declare class SkinSelectionController {
    private readonly theme;
    private readonly store;
    private snapshot;
    private readonly listeners;
    private storeDisposer;
    private tokenDisposer;
    private presented;
    private generation;
    private activeGeneration;
    /**
     * @param theme - Official token override service.
     * @param store - Browser-local preference store.
     */
    constructor(theme: KisekaeThemeService, store: KisekaePreferenceStore);
    /** @returns the current stable selection snapshot. */
    readonly getSnapshot: () => SkinSelectionSnapshot;
    /**
     * Observe selection snapshot replacements.
     * @param listener - React or test subscriber.
     * @returns the disposer removing the subscriber.
     */
    readonly subscribe: (listener: () => void) => Disposer;
    /**
     * Start preference synchronization and present the saved/default skin.
     * @returns cleanup that removes the token layer and subscription.
     */
    mount(): Disposer;
    /** Stage and immediately preview one card without writing browser storage. */
    preview(skin: KisekaeSkinId): void;
    /** Discard the staged choice and restore the latest browser-saved skin. */
    cancelPreview(): void;
    /**
     * Persist the staged choice, confirming success from the accepted snapshot.
     * @returns settlement after the browser-storage write and confirmation read.
     */
    applyPreview(): Promise<void>;
    private syncFromStore;
    private present;
    private replace;
}
export {};
//# sourceMappingURL=skin-controller.d.ts.map