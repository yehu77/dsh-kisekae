/** Phase-aware Blue Whale artwork behind the official conversation surface. */
import type { ReactElement } from 'react';
import type { MainBackgroundStore } from './main-background-store';
/** Conversation display phase supplied by the official backdrop slot. */
export type ConversationBackdropPhase = 'settling' | 'hero' | 'active';
/** Props composed by the official conversation backdrop slot. */
export interface BlueWhaleConversationBackdropProps {
    /** Current stable conversation layout phase. */
    readonly phase: ConversationBackdropPhase;
    /** Shared main-background preference store. */
    readonly mainBackgroundStore: MainBackgroundStore;
}
/**
 * Render the complete artwork over a quiet full-canvas copy of the same scene.
 * @param props - Official conversation phase plus Kisekae background preferences.
 * @returns decorative conversation layer, or nothing in off mode.
 */
export declare function BlueWhaleConversationBackdrop({ phase, mainBackgroundStore, }: BlueWhaleConversationBackdropProps): ReactElement | null;
//# sourceMappingURL=BlueWhaleConversationBackdrop.d.ts.map