/** Host half: serves the released artwork used by the browser plugin. */
import type { Context } from '@deepseek-ai/cordis';
/** Required Host service for the same-origin artwork route. */
export declare const inject: string[];
/**
 * Serve catalogued artwork from the installed package.
 * @param ctx - Host context carrying the Web route registry.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map