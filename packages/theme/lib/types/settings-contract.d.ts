/** Shared browser-preference identity for Kisekae skin selection. */
/** Versioned local browser key owned by this plugin. */
export declare const KISEKAE_SKIN_STORAGE_KEY = "@yehu77/dsh-kisekae:skin:v1";
/** Scalar browser record field that stores the applied skin. */
export declare const KISEKAE_SKIN_FIELD = "skin";
/** Stable skin ids accepted by the current plugin version. */
export declare const KISEKAE_SKIN_IDS: readonly ["official", "deepseek-blue-whale-chan"];
/** Skin presented for a new browser origin before the user makes a choice. */
export declare const DEFAULT_KISEKAE_SKIN: KisekaeSkinId;
/** One selectable Kisekae skin or the unmodified official appearance. */
export type KisekaeSkinId = typeof KISEKAE_SKIN_IDS[number];
/** Stored browser preference owned by Kisekae. */
export interface KisekaeSettings {
    /** Stored skin id; the Client falls back when an older id is unavailable. */
    skin: string;
}
/**
 * Narrow an unknown settings value to a skin shipped by this version.
 * @param value - Value read from browser storage.
 * @returns Whether the value is a known skin id.
 */
export declare function isKisekaeSkinId(value: unknown): value is KisekaeSkinId;
//# sourceMappingURL=settings-contract.d.ts.map