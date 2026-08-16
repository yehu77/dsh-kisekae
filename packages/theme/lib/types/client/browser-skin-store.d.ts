/** Browser-local, cross-tab preference store for the selected Kisekae skin. */
import type { KisekaePreferenceStore } from './skin-controller';
type Disposer = () => void;
interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
interface StorageEventLike {
    readonly key: string | null;
    readonly newValue: string | null;
    readonly storageArea?: StorageLike | null;
}
interface BrowserWindowLike {
    readonly localStorage: StorageLike;
    addEventListener(type: 'storage', listener: (event: StorageEventLike) => void): void;
    removeEventListener(type: 'storage', listener: (event: StorageEventLike) => void): void;
}
type StoreSnapshot = ReturnType<KisekaePreferenceStore['getSnapshot']>;
/** Immediate localStorage mirror with explicit unavailable fallback. */
export declare class BrowserSkinStore implements KisekaePreferenceStore {
    private readonly browser;
    private readonly listeners;
    private storage;
    private snapshot;
    private mounted;
    /**
     * @param browser - Current browser window and its origin-local storage.
     */
    constructor(browser: BrowserWindowLike);
    /** @returns the stable browser preference snapshot. */
    readonly getSnapshot: () => StoreSnapshot;
    /**
     * Observe preference replacements.
     * @param listener - Controller subscriber.
     * @returns disposer removing the subscriber.
     */
    readonly subscribe: (listener: () => void) => Disposer;
    /**
     * Listen for preference changes from another tab.
     * @returns cleanup removing the browser listener.
     */
    mount(): Disposer;
    /** Persist the selected skin for this browser origin. */
    set(field: string, value: unknown): Promise<void>;
    private readonly onStorage;
    private readySnapshot;
    private unavailableSnapshot;
    private replace;
}
export {};
//# sourceMappingURL=browser-skin-store.d.ts.map