/** Browser half: one reversible skin layer over the official color mode. */

type Disposer = () => void

interface ThemeTokenModes {
  readonly light: string
  readonly dark: string
}

type ThemeTokenOverrides = Readonly<Record<string, ThemeTokenModes>>

interface ThemeService {
  overrideTokens(source: string, tokens: ThemeTokenOverrides): Disposer
}

interface KisekaeClientContext {
  readonly theme: ThemeService
  effect(register: () => void | Disposer, label?: string): void
}

/** Cordis services required by the browser entry. */
export const inject = ['theme']

const SOURCE = '@yehu77/dsh-kisekae'
const EMPTY_SKIN: ThemeTokenOverrides = Object.freeze({})

/**
 * Mount the Kisekae token layer.
 * @param ctx - Client context with the official theme service.
 */
export function apply(ctx: KisekaeClientContext): void {
  ctx.effect(
    () => ctx.theme.overrideTokens(SOURCE, EMPTY_SKIN),
    'dsh-kisekae: theme token layer',
  )
}
