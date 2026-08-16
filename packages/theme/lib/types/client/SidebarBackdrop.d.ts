/** Blue Whale glass sidebar artwork for the official backdrop slot. */
import type { ReactElement } from 'react';
import type { SidebarBackdropStore } from './sidebar-backdrop-store';
/** Props composed by the official sidebar backdrop slot. */
export interface SidebarBackdropProps {
    /** Whether the sidebar is rendering its full-width content. */
    readonly wide: boolean;
    /** Shared preference store injected by Kisekae. */
    readonly backdropStore: SidebarBackdropStore;
}
/**
 * Render the fixed rain artwork, or a quiet gradient for the narrow rail.
 * @param props - Official sidebar owner state plus Kisekae preferences.
 * @returns decorative sidebar layer.
 */
export declare function SidebarBackdrop({ wide, backdropStore }: SidebarBackdropProps): ReactElement;
//# sourceMappingURL=SidebarBackdrop.d.ts.map