/** One token value for each official Harness color mode. */
export interface ThemeTokenModes {
  readonly light: string
  readonly dark: string
}

/** Semantic Harness CSS variables supplied by one reversible skin layer. */
export type ThemeTokenOverrides = Readonly<Record<string, ThemeTokenModes>>
