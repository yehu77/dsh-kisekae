/** Browser half: durable skin selection over the official color mode. */
import type { ThemeTokenOverrides } from './theme-types';
export { DEEPSEEK_BLUE_WHALE_CHAN } from './themes/deepseek-blue-whale-chan';
export type { ThemeTokenModes, ThemeTokenOverrides } from './theme-types';
type Disposer = () => void;
interface ThemeService {
    overrideTokens(source: string, tokens: ThemeTokenOverrides): Disposer;
}
interface LocaleService {
    register(namespace: string, dictionaries: {
        readonly zh: object;
        readonly en: object;
    }): Disposer;
    bind(namespace: string): (key: string) => string;
}
interface OrderedSlotOptions {
    readonly name: 'settings.section';
    readonly id: string;
    readonly order: number;
    readonly label?: () => string;
    readonly locale?: string;
    readonly inject?: () => object;
}
interface SkinVisualSlotOptions {
    readonly name: 'conversation.backdrop' | 'conversation.composer.bar.decoration' | 'settings.trigger.decoration' | 'sidebar.backdrop' | 'sidebar.newSession.decoration' | 'sidebar.newSession.icon';
    readonly inject?: () => object;
}
type SlotOptions = OrderedSlotOptions | SkinVisualSlotOptions;
interface SlotsService {
    inject(name: SlotOptions['name'], install: () => Disposer): Disposer;
    register<Props>(options: SlotOptions, component: (props: Props) => unknown): Disposer;
}
/** Client services used by the release browser entry. */
export interface KisekaeClientContext {
    readonly locale: LocaleService;
    readonly slots: SlotsService;
    readonly theme: ThemeService;
    effect(register: () => void | Disposer, label?: string): void;
}
/** Cordis services required by the browser entry. */
export declare const inject: string[];
/**
 * Mount the durable skin controller and its settings page.
 * @param ctx - Client context with theme, locale, and slot services.
 */
export declare function apply(ctx: KisekaeClientContext): void;
//# sourceMappingURL=index.d.ts.map