import type { ThemeTokenOverrides } from '../theme-types'
import type { TextStyleOverrides } from '../text-style-store'

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
    '--dsw-specific-conversation-user-message-prose-text-shadow': {
      light: 'none',
      dark: 'none',
    },
    '--dsw-specific-conversation-assistant-message-prose-color': {
      light: '#F8FDFF',
      dark: '#F4FCFF',
    },
    '--dsw-specific-conversation-assistant-message-prose-text-shadow': {
      light: '-1px 0 0 #1683B5, 1px 0 0 #1683B5, 0 -1px 0 #1683B5, 0 1px 0 #1683B5, 0 2px 0 #075E8E',
      dark: '-1px 0 0 #279AC8, 1px 0 0 #279AC8, 0 -1px 0 #279AC8, 0 1px 0 #279AC8, 0 2px 0 #074B70',
    },
    '--dsw-specific-conversation-message-prose-font-weight': {
      light: '500',
      dark: '500',
    },
    '--dsw-specific-conversation-composer-dock-background': {
      light: 'linear-gradient(180deg, rgba(4, 27, 45, 0) 0px, rgba(4, 27, 45, 0.10) 36px, rgba(4, 27, 45, 0.24) 100%)',
      dark: 'linear-gradient(180deg, rgba(2, 11, 20, 0) 0px, rgba(2, 11, 20, 0.18) 36px, rgba(2, 11, 20, 0.36) 100%)',
    },
    '--dsw-specific-conversation-composer-glass-fill': {
      light: 'linear-gradient(180deg, rgba(205, 242, 255, 0.96) 0%, rgba(172, 225, 246, 0.96) 48%, rgba(144, 209, 236, 0.97) 100%)',
      dark: 'linear-gradient(180deg, rgba(35, 111, 157, 0.94) 0%, rgba(15, 78, 131, 0.96) 48%, rgba(8, 47, 98, 0.98) 100%)',
    },
    '--dsw-specific-conversation-composer-glass-rim': {
      light: 'rgba(218, 250, 255, 0.96)',
      dark: 'rgba(137, 229, 255, 0.94)',
    },
    '--dsw-specific-conversation-composer-glass-ornament': {
      light: '#F8FEFF',
      dark: '#C9F6FF',
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

/** Optional text presentations layered over the Blue Whale-chan default. */
export const DEEPSEEK_BLUE_WHALE_CHAN_TEXT_STYLE_OVERRIDES = {
  'official-clear': {
    '--dsw-font-family': {
      light: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      dark: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
    '--dsw-specific-conversation-user-message-prose-color': {
      light: '#0F1115',
      dark: '#F9FAFB',
    },
    '--dsw-specific-conversation-user-message-prose-text-shadow': {
      light: 'none',
      dark: 'none',
    },
    '--dsw-specific-conversation-assistant-message-prose-color': {
      light: '#0F1115',
      dark: '#F9FAFB',
    },
    '--dsw-specific-conversation-assistant-message-prose-text-shadow': {
      light: 'none',
      dark: 'none',
    },
    '--dsw-specific-conversation-message-prose-font-weight': {
      light: '400',
      dark: '400',
    },
  },
  'effects-off': {
    '--dsw-specific-conversation-user-message-prose-color': {
      light: '#6A1B8C',
      dark: '#E8C4FF',
    },
    '--dsw-specific-conversation-user-message-prose-text-shadow': {
      light: 'none',
      dark: 'none',
    },
    '--dsw-specific-conversation-assistant-message-prose-color': {
      light: '#075C78',
      dark: '#BDEEFF',
    },
    '--dsw-specific-conversation-assistant-message-prose-text-shadow': {
      light: 'none',
      dark: 'none',
    },
    '--dsw-specific-conversation-message-prose-font-weight': {
      light: '500',
      dark: '500',
    },
  },
} as const satisfies TextStyleOverrides
