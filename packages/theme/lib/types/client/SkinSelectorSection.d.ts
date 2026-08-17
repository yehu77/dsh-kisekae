/** Settings page for previewing and applying one Kisekae skin. */
import type { ReactElement } from 'react';
import type { KisekaeLocaleKey } from './locales';
import type { MainBackgroundStore } from './main-background-store';
import type { SidebarBackdropStore } from './sidebar-backdrop-store';
import type { SkinSelectionController } from './skin-controller';
import type { TextStyleStore } from './text-style-store';
/** Props composed by the settings section slot. */
export interface SkinSelectorSectionProps {
    readonly controller: SkinSelectionController;
    readonly mainBackgroundStore: MainBackgroundStore;
    readonly backdropStore: SidebarBackdropStore;
    readonly textStyleStore: TextStyleStore;
    readonly t: (key: KisekaeLocaleKey) => string;
}
/**
 * Render the responsive two-card skin picker.
 * @param props - Slot-injected controller and localized copy.
 * @returns the settings section element tree.
 */
export declare function SkinSelectorSection({ controller, mainBackgroundStore, backdropStore, textStyleStore, t, }: SkinSelectorSectionProps): ReactElement;
//# sourceMappingURL=SkinSelectorSection.d.ts.map