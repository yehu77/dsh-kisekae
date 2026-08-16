import type { ThemeTokenOverrides } from '../theme-types'

/** The first original community skin shipped by DSH Kisekae. */
export const DEEPSEEK_BLUE_WHALE_CHAN = {
  id: 'deepseek-blue-whale-chan',
  displayName: {
    en: 'DeepSeek Blue Whale-chan',
    zh: 'DeepSeek蓝鲸娘',
  },
  relationship: 'unofficial-community-theme',
  officialAffiliation: 'none',
  tokens: {
    '--dsw-alias-bg-base': { light: '#F6FBFE', dark: '#091824' },
    '--dsw-alias-bg-layer-1': { light: '#FFFFFF', dark: '#102638' },
    '--dsw-alias-bg-layer-2': { light: '#EDF6FA', dark: '#173147' },
    '--dsw-alias-bg-layer-3': { light: '#E5F1F7', dark: '#1D3B52' },
    '--dsw-alias-bg-overlay': { light: '#DDECF4', dark: '#24475F' },
    '--dsw-alias-border-l1': {
      light: 'rgba(24, 82, 110, 0.10)',
      dark: 'rgba(154, 216, 239, 0.12)',
    },
    '--dsw-alias-border-l2': {
      light: 'rgba(24, 82, 110, 0.18)',
      dark: 'rgba(154, 216, 239, 0.22)',
    },
    '--dsw-alias-brand-primary': { light: '#155F7A', dark: '#69D2F0' },
    '--dsw-alias-button-primary-hover': { light: '#104B61', dark: '#8ADFF5' },
    '--dsw-alias-state-business-primary': { light: '#12627F', dark: '#6CD5F2' },
    '--dsw-alias-state-business-tertiary': { light: '#D8EEF7', dark: '#153E52' },
    '--dsw-alias-label-caption': { light: '#83A9B9', dark: '#5D91A6' },
    '--dsw-alias-label-dimmed': { light: '#BDD5DE', dark: '#365D72' },
    '--dsw-alias-label-primary': { light: '#0E5872', dark: '#C9F4FF' },
    '--dsw-alias-label-primary-dimmed': { light: '#1B607C', dark: '#B2E2F1' },
    '--dsw-alias-label-secondary': { light: '#386A80', dark: '#96CBDD' },
    '--dsw-alias-label-tertiary': { light: '#5E8799', dark: '#78B2C5' },
    '--dsw-specific-input-major': {
      light: 'rgba(250, 254, 255, 0.94)',
      dark: 'rgba(10, 32, 47, 0.94)',
    },
    '--dsw-specific-conversation-user-message-prose-color': {
      light: '#6A1B8C',
      dark: '#E8C4FF',
    },
    '--dsw-specific-conversation-assistant-message-prose-color': {
      light: '#075C78',
      dark: '#BDEEFF',
    },
    '--dsw-specific-conversation-message-prose-font-weight': {
      light: '500',
      dark: '500',
    },
    '--dsw-specific-sidebar-fill': { light: '#EAF5FA', dark: '#0D2131' },
    '--dsw-specific-sidebar-nav-item-hover': {
      light: 'rgba(255, 255, 255, 0.52)',
      dark: 'rgba(22, 58, 79, 0.62)',
    },
    '--dsw-specific-sidebar-nav-item-active': {
      light: 'rgba(255, 255, 255, 0.74)',
      dark: 'rgba(28, 72, 94, 0.78)',
    },
  } as const satisfies ThemeTokenOverrides,
} as const
