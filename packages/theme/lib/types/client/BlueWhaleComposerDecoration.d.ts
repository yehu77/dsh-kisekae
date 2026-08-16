/** Sea-glass artwork behind the official composer card content. */
import type { ReactElement } from 'react';
/** Props owned by the official composer-card decoration slot. */
export interface BlueWhaleComposerDecorationProps {
    /** Hero = centered empty-state card; composer = resident bottom card. */
    readonly variant: 'hero' | 'composer';
}
/**
 * Draw semantic sea glass, border light, tide lines, and a quiet whale-tail corner.
 * @param props - Official composer placement variant.
 * @returns non-interactive composer-card artwork.
 */
export declare function BlueWhaleComposerDecoration({ variant, }: BlueWhaleComposerDecorationProps): ReactElement;
//# sourceMappingURL=BlueWhaleComposerDecoration.d.ts.map