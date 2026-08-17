/** Browser-local text-style preference and reversible theme layer. */
import type { ThemeTokenOverrides } from './theme-types';
/** Versioned browser preference key for the text-style selector. */
export declare const KISEKAE_TEXT_STYLE_STORAGE_KEY = "@yehu77/dsh-kisekae:text-style:v1";
/** Generic choices shared by every Kisekae theme. */
export type TextStyleMode = 'theme-default' | 'official-clear' | 'effects-off';
/** Current text-style choice. */
export interface TextStyleSnapshot {
    readonly mode: TextStyleMode;
}
/** Overrides supplied by one theme for the two optional text styles. */
export type TextStyleOverrides = Readonly<Record<Exclude<TextStyleMode, 'theme-default'>, ThemeTokenOverrides>>;
interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
interface ThemeService {
    overrideTokens(source: string, tokens: ThemeTokenOverrides): () => void;
}
/** Immediate localStorage-backed text-style preference. */
export declare class TextStyleStore {
    private readonly listeners;
    private readonly storage;
    private snapshot;
    /**
     * @param storage - Browser storage; omitted callers use the current window.
     */
    constructor(storage?: StorageLike);
    /** @returns the current text-style preference. */
    readonly getSnapshot: () => TextStyleSnapshot;
    /**
     * Observe text-style changes.
     * @param listener - Subscriber notified after a local change.
     * @returns disposer removing the subscriber.
     */
    readonly subscribe: (listener: () => void) => (() => void);
    /**
     * Select and persist one text style.
     * @param mode - Theme default, official clear, or effects-off presentation.
     */
    setMode(mode: TextStyleMode): void;
    private read;
}
/**
 * Apply the selected optional text layer while its parent skin is visible.
 * @param theme - Official reversible token service.
 * @param store - Current browser-local text-style preference.
 * @param overrides - Theme-owned values for optional modes.
 * @returns cleanup for the subscription and active token layer.
 */
export declare function mountTextStyle(theme: ThemeService, store: TextStyleStore, overrides: TextStyleOverrides): () => void;
export {};
//# sourceMappingURL=text-style-store.d.ts.map