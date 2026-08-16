/** Browser half: durable skin selection over the official color mode. */

import { BrowserSkinStore } from './browser-skin-store'
import { BlueWhaleComposerDecoration } from './BlueWhaleComposerDecoration'
import type { BlueWhaleComposerDecorationProps } from './BlueWhaleComposerDecoration'
import { BlueWhaleConversationBackdrop } from './BlueWhaleConversationBackdrop'
import type { BlueWhaleConversationBackdropProps } from './BlueWhaleConversationBackdrop'
import { BlueWhaleNewSessionDecoration } from './BlueWhaleNewSessionDecoration'
import type { BlueWhaleNewSessionDecorationProps } from './BlueWhaleNewSessionDecoration'
import { BlueWhaleNewSessionIcon } from './BlueWhaleNewSessionIcon'
import type { BlueWhaleNewSessionIconProps } from './BlueWhaleNewSessionIcon'
import { BlueWhaleSettingsTriggerDecoration } from './BlueWhaleSettingsTriggerDecoration'
import type { BlueWhaleSettingsTriggerDecorationProps } from './BlueWhaleSettingsTriggerDecoration'
import { KISEKAE_LOCALE_NAMESPACE, en, zh } from './locales'
import { MainBackgroundStore } from './main-background-store'
import { SidebarBackdrop } from './SidebarBackdrop'
import type { SidebarBackdropProps } from './SidebarBackdrop'
import { SidebarBackdropStore } from './sidebar-backdrop-store'
import { SkinSelectionController } from './skin-controller'
import { SkinSelectorSection } from './SkinSelectorSection'
import type { SkinSelectorSectionProps } from './SkinSelectorSection'
import { mountSkinVisuals } from './skin-visual-orchestrator'
import type { ThemeTokenOverrides } from './theme-types'

export { DEEPSEEK_BLUE_WHALE_CHAN } from './themes/deepseek-blue-whale-chan'
export type { ThemeTokenModes, ThemeTokenOverrides } from './theme-types'

type Disposer = () => void

interface ThemeService {
  overrideTokens(source: string, tokens: ThemeTokenOverrides): Disposer
}

interface LocaleService {
  register(namespace: string, dictionaries: { readonly zh: object; readonly en: object }): Disposer
  bind(namespace: string): (key: string) => string
}

interface OrderedSlotOptions {
  readonly name: 'settings.section'
  readonly id: string
  readonly order: number
  readonly label?: () => string
  readonly locale?: string
  readonly inject?: () => object
}

interface SkinVisualSlotOptions {
  readonly name:
    | 'conversation.backdrop'
    | 'conversation.composer.bar.decoration'
    | 'settings.trigger.decoration'
    | 'sidebar.backdrop'
    | 'sidebar.newSession.decoration'
    | 'sidebar.newSession.icon'
  readonly inject?: () => object
}

type SlotOptions = OrderedSlotOptions | SkinVisualSlotOptions

interface SlotsService {
  inject(name: SlotOptions['name'], install: () => Disposer): Disposer
  register<Props>(options: SlotOptions, component: (props: Props) => unknown): Disposer
}

/** Client services used by the release browser entry. */
export interface KisekaeClientContext {
  readonly locale: LocaleService
  readonly slots: SlotsService
  readonly theme: ThemeService
  effect(register: () => void | Disposer, label?: string): void
}

/** Cordis services required by the browser entry. */
export const inject = ['theme', 'slots', 'locale']

/**
 * Mount the durable skin controller and its settings page.
 * @param ctx - Client context with theme, locale, and slot services.
 */
export function apply(ctx: KisekaeClientContext): void {
  const store = new BrowserSkinStore(window)
  const controller = new SkinSelectionController(ctx.theme, store)
  const mainBackgroundStore = new MainBackgroundStore()
  const backdropStore = new SidebarBackdropStore()
  ctx.effect(() => {
    const disposeStore = store.mount()
    const disposeController = controller.mount()
    return () => {
      disposeController()
      disposeStore()
    }
  }, 'dsh-kisekae: skin selection controller')
  ctx.effect(
    () => ctx.locale.register(KISEKAE_LOCALE_NAMESPACE, { zh, en }),
    'dsh-kisekae: settings dictionaries',
  )
  const t = ctx.locale.bind(KISEKAE_LOCALE_NAMESPACE)
  ctx.slots.inject('settings.section', () => ctx.slots.register<SkinSelectorSectionProps>({
    name: 'settings.section',
    id: 'kisekae-skins',
    order: 15,
    label: () => t('nav'),
    locale: KISEKAE_LOCALE_NAMESPACE,
    inject: () => ({ controller, mainBackgroundStore, backdropStore }),
  }, SkinSelectorSection))
  ctx.effect(() => mountSkinVisuals(controller, () => {
    const disposers = [
      ctx.slots.inject('conversation.composer.bar.decoration', () => ctx.slots.register<BlueWhaleComposerDecorationProps>({
        name: 'conversation.composer.bar.decoration',
      }, BlueWhaleComposerDecoration)),
      ctx.slots.inject('conversation.backdrop', () => ctx.slots.register<BlueWhaleConversationBackdropProps>({
        name: 'conversation.backdrop',
        inject: () => ({ mainBackgroundStore }),
      }, BlueWhaleConversationBackdrop)),
      ctx.slots.inject('sidebar.backdrop', () => ctx.slots.register<SidebarBackdropProps>({
        name: 'sidebar.backdrop',
        inject: () => ({ backdropStore }),
      }, SidebarBackdrop)),
      ctx.slots.inject('sidebar.newSession.decoration', () => ctx.slots.register<BlueWhaleNewSessionDecorationProps>({
        name: 'sidebar.newSession.decoration',
      }, BlueWhaleNewSessionDecoration)),
      ctx.slots.inject('sidebar.newSession.icon', () => ctx.slots.register<BlueWhaleNewSessionIconProps>({
        name: 'sidebar.newSession.icon',
      }, BlueWhaleNewSessionIcon)),
      ctx.slots.inject('settings.trigger.decoration', () => ctx.slots.register<BlueWhaleSettingsTriggerDecorationProps>({
        name: 'settings.trigger.decoration',
      }, BlueWhaleSettingsTriggerDecoration)),
    ]
    return () => {
      for (const dispose of disposers.toReversed()) dispose()
    }
  }), 'dsh-kisekae: skin visual contributions')
}
