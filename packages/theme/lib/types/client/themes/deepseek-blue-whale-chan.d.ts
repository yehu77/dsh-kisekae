/** The first original community skin shipped by DSH Kisekae. */
export declare const DEEPSEEK_BLUE_WHALE_CHAN: {
    readonly id: "deepseek-blue-whale-chan";
    readonly displayName: {
        readonly en: "DeepSeek Blue Whale-chan";
        readonly zh: "DeepSeek蓝鲸娘";
    };
    readonly relationship: "unofficial-community-theme";
    readonly officialAffiliation: "none";
    readonly tokens: {
        readonly '--dsw-alias-bg-base': {
            readonly light: "#F6FBFE";
            readonly dark: "#091824";
        };
        readonly '--dsw-alias-bg-layer-1': {
            readonly light: "#FFFFFF";
            readonly dark: "#102638";
        };
        readonly '--dsw-alias-bg-layer-2': {
            readonly light: "#EDF6FA";
            readonly dark: "#173147";
        };
        readonly '--dsw-alias-bg-layer-3': {
            readonly light: "#E5F1F7";
            readonly dark: "#1D3B52";
        };
        readonly '--dsw-alias-bg-overlay': {
            readonly light: "#DDECF4";
            readonly dark: "#24475F";
        };
        readonly '--dsw-alias-border-l1': {
            readonly light: "rgba(24, 82, 110, 0.10)";
            readonly dark: "rgba(154, 216, 239, 0.12)";
        };
        readonly '--dsw-alias-border-l2': {
            readonly light: "rgba(24, 82, 110, 0.18)";
            readonly dark: "rgba(154, 216, 239, 0.22)";
        };
        readonly '--dsw-alias-brand-primary': {
            readonly light: "#155F7A";
            readonly dark: "#69D2F0";
        };
        readonly '--dsw-alias-button-primary-hover': {
            readonly light: "#104B61";
            readonly dark: "#8ADFF5";
        };
        readonly '--dsw-alias-state-business-primary': {
            readonly light: "#12627F";
            readonly dark: "#6CD5F2";
        };
        readonly '--dsw-alias-state-business-tertiary': {
            readonly light: "#D8EEF7";
            readonly dark: "#153E52";
        };
        readonly '--dsw-alias-label-caption': {
            readonly light: "#83A9B9";
            readonly dark: "#5D91A6";
        };
        readonly '--dsw-alias-label-dimmed': {
            readonly light: "#BDD5DE";
            readonly dark: "#365D72";
        };
        readonly '--dsw-alias-label-primary': {
            readonly light: "#0E5872";
            readonly dark: "#C9F4FF";
        };
        readonly '--dsw-alias-label-primary-dimmed': {
            readonly light: "#1B607C";
            readonly dark: "#B2E2F1";
        };
        readonly '--dsw-alias-label-secondary': {
            readonly light: "#386A80";
            readonly dark: "#96CBDD";
        };
        readonly '--dsw-alias-label-tertiary': {
            readonly light: "#5E8799";
            readonly dark: "#78B2C5";
        };
        readonly '--dsw-specific-input-major': {
            readonly light: "rgba(250, 254, 255, 0.94)";
            readonly dark: "rgba(10, 32, 47, 0.94)";
        };
        readonly '--dsw-specific-conversation-user-message-prose-color': {
            readonly light: "#6A1B8C";
            readonly dark: "#E8C4FF";
        };
        readonly '--dsw-specific-conversation-user-message-prose-text-shadow': {
            readonly light: "none";
            readonly dark: "none";
        };
        readonly '--dsw-specific-conversation-assistant-message-prose-color': {
            readonly light: "#F8FDFF";
            readonly dark: "#F4FCFF";
        };
        readonly '--dsw-specific-conversation-assistant-message-prose-text-shadow': {
            readonly light: "-1px 0 0 #1683B5, 1px 0 0 #1683B5, 0 -1px 0 #1683B5, 0 1px 0 #1683B5, 0 2px 0 #075E8E";
            readonly dark: "-1px 0 0 #279AC8, 1px 0 0 #279AC8, 0 -1px 0 #279AC8, 0 1px 0 #279AC8, 0 2px 0 #074B70";
        };
        readonly '--dsw-specific-conversation-message-prose-font-weight': {
            readonly light: "500";
            readonly dark: "500";
        };
        readonly '--dsw-specific-conversation-composer-dock-background': {
            readonly light: "linear-gradient(180deg, rgba(4, 27, 45, 0) 0px, rgba(4, 27, 45, 0.10) 36px, rgba(4, 27, 45, 0.24) 100%)";
            readonly dark: "linear-gradient(180deg, rgba(2, 11, 20, 0) 0px, rgba(2, 11, 20, 0.18) 36px, rgba(2, 11, 20, 0.36) 100%)";
        };
        readonly '--dsw-specific-conversation-composer-glass-fill': {
            readonly light: "linear-gradient(180deg, rgba(205, 242, 255, 0.96) 0%, rgba(172, 225, 246, 0.96) 48%, rgba(144, 209, 236, 0.97) 100%)";
            readonly dark: "linear-gradient(180deg, rgba(35, 111, 157, 0.94) 0%, rgba(15, 78, 131, 0.96) 48%, rgba(8, 47, 98, 0.98) 100%)";
        };
        readonly '--dsw-specific-conversation-composer-glass-rim': {
            readonly light: "rgba(218, 250, 255, 0.96)";
            readonly dark: "rgba(137, 229, 255, 0.94)";
        };
        readonly '--dsw-specific-conversation-composer-glass-ornament': {
            readonly light: "#F8FEFF";
            readonly dark: "#C9F6FF";
        };
        readonly '--dsw-specific-sidebar-fill': {
            readonly light: "#EAF5FA";
            readonly dark: "#0D2131";
        };
        readonly '--dsw-specific-sidebar-nav-item-hover': {
            readonly light: "rgba(255, 255, 255, 0.52)";
            readonly dark: "rgba(22, 58, 79, 0.62)";
        };
        readonly '--dsw-specific-sidebar-nav-item-active': {
            readonly light: "rgba(255, 255, 255, 0.74)";
            readonly dark: "rgba(28, 72, 94, 0.78)";
        };
    };
};
/** Optional text presentations layered over the Blue Whale-chan default. */
export declare const DEEPSEEK_BLUE_WHALE_CHAN_TEXT_STYLE_OVERRIDES: {
    readonly 'official-clear': {
        readonly '--dsw-font-family': {
            readonly light: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif";
            readonly dark: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif";
        };
        readonly '--dsw-specific-conversation-user-message-prose-color': {
            readonly light: "#0F1115";
            readonly dark: "#F9FAFB";
        };
        readonly '--dsw-specific-conversation-user-message-prose-text-shadow': {
            readonly light: "none";
            readonly dark: "none";
        };
        readonly '--dsw-specific-conversation-assistant-message-prose-color': {
            readonly light: "#0F1115";
            readonly dark: "#F9FAFB";
        };
        readonly '--dsw-specific-conversation-assistant-message-prose-text-shadow': {
            readonly light: "none";
            readonly dark: "none";
        };
        readonly '--dsw-specific-conversation-message-prose-font-weight': {
            readonly light: "400";
            readonly dark: "400";
        };
    };
    readonly 'effects-off': {
        readonly '--dsw-specific-conversation-user-message-prose-color': {
            readonly light: "#6A1B8C";
            readonly dark: "#E8C4FF";
        };
        readonly '--dsw-specific-conversation-user-message-prose-text-shadow': {
            readonly light: "none";
            readonly dark: "none";
        };
        readonly '--dsw-specific-conversation-assistant-message-prose-color': {
            readonly light: "#075C78";
            readonly dark: "#BDEEFF";
        };
        readonly '--dsw-specific-conversation-assistant-message-prose-text-shadow': {
            readonly light: "none";
            readonly dark: "none";
        };
        readonly '--dsw-specific-conversation-message-prose-font-weight': {
            readonly light: "500";
            readonly dark: "500";
        };
    };
};
//# sourceMappingURL=deepseek-blue-whale-chan.d.ts.map