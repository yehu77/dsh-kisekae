/** Localized copy for the Kisekae settings section. */
/** Locale namespace registered by the browser plugin. */
export declare const KISEKAE_LOCALE_NAMESPACE = "settings.kisekae";
/** Chinese settings copy. */
export declare const zh: {
    readonly nav: "外观与皮肤";
    readonly title: "外观与皮肤";
    readonly description: "皮肤会覆盖界面配色，但不会改变浅色、深色或跟随系统模式。";
    readonly official: "官方外观";
    readonly officialDescription: "使用 DeepSeek Harness 原本的颜色与界面风格。";
    readonly blueWhale: "DeepSeek蓝鲸娘";
    readonly blueWhaleDescription: "清爽海洋与深海夜色的非官方社区皮肤。";
    readonly applied: "当前使用";
    readonly selected: "已选择";
    readonly previewing: "正在预览，应用后才会保存。";
    readonly loading: "正在读取已保存的皮肤…";
    readonly saving: "正在保存…";
    readonly saved: "已保存到当前浏览器。";
    readonly storageUnavailable: "当前浏览器无法保存皮肤，但仍可继续预览。";
    readonly saveFailed: "没有保存成功。你可以重试，或取消预览。";
    readonly unavailableSkin: "已保存的皮肤在当前版本中不可用，现正使用官方外观。点击应用可修复此设置。";
    readonly fallback: "暂时使用";
    readonly restoreOfficial: "恢复官方";
    readonly cancel: "取消";
    readonly apply: "应用";
    readonly textStyleTitle: "文字风格";
    readonly textStyleDescription: "选择会立即保存在当前浏览器。主题默认会跟随当前动画主题；以后每套主题都能提供自己的字体与文字效果。";
    readonly textStyleBlueWhaleIce: "蓝鲸冰晶";
    readonly textStyleBlueWhaleIceDescription: "近白冰芯、蓝色硬边和短促深海投影。";
    readonly textStyleOfficialClear: "官方清晰";
    readonly textStyleOfficialClearDescription: "恢复官方深浅文字、常规字重并关闭描边。";
    readonly textStyleEffectsOff: "关闭文字特效";
    readonly textStyleEffectsOffDescription: "保留蓝鲸娘配色与字重，但移除描边和投影。";
    readonly backdropTitle: "蓝鲸玻璃侧栏·雨幕";
    readonly backdropDescription: "图片从侧栏底部向上渐隐；折叠为窄栏时自动使用安静的纯渐变。";
    readonly backdropClear: "清爽";
    readonly backdropImmersive: "沉浸";
    readonly backdropOff: "关闭";
    readonly backdropArtwork: "固定背景";
    readonly backdropArtworkOption: "背景";
    readonly backdropPreview: "蓝鲸玻璃侧栏效果预览";
    readonly mainBackgroundTitle: "主对话背景";
    readonly mainBackgroundDescription: "随机模式会在每次加载 Web 页面时更换图片；点击图鉴可固定一张。4K 横向壁纸会铺满主聊天区，普通插画则保持完整构图。";
    readonly mainBackgroundRandom: "随机";
    readonly mainBackgroundFixed: "固定";
    readonly mainBackgroundOff: "关闭";
    readonly galleryTitle: "蓝鲸娘图鉴";
    readonly galleryDescription: "共 42 张。点击任意图片，即可固定为主对话背景。";
    readonly artworkFixed: "主背景";
    readonly artworkShown: "本次背景";
    readonly chooseArtwork: "设为主对话背景";
};
/** English settings copy. */
export declare const en: Record<keyof typeof zh, string>;
/** One translation key accepted by this section. */
export type KisekaeLocaleKey = keyof typeof zh;
//# sourceMappingURL=locales.d.ts.map