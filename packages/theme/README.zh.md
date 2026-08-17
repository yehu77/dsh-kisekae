# DSH Kisekae

[English](README.md) | 中文

为 DeepSeek Harness 提供二次元风格的 Web 主题与愉快的 UI 扩展。

## 当前状态

首个可用皮肤是“DeepSeek蓝鲸娘”：一套以清冷海面和深海夜色为方向的非官方社区主题。安装后会立即叠加 23 个语义颜色令牌、4 个输入框表面令牌、2 个按消息角色区分的会话文字阴影令牌和 1 个共享会话字重令牌，同时保留 Harness 官方的浅色、深色和跟随系统偏好。设置页还包含 42 张图片的图鉴、随会话阶段变化的主对话背景、“蓝鲸玻璃侧栏·雨幕”，以及主题化输入框、“新会话”和“设置”入口。

用户消息正文在浅色模式使用深紫色、深色模式使用淡丁香紫，并保持无阴影。assistant 正文使用近白色冰芯、零模糊蓝色硬边和一道短促的零模糊深蓝投影。两者都保留清晰的系统字体，字重为 500；插件也没有内置第三方字体。从主标签到淡化标签的全局调色板同样转为冰蓝色，因此已经使用这些别名的中性代码和工具文案也会跟随变化；caption 与 dimmed 仍是有意保留的较弱信息层级。前景、反相、错误、警告和成功颜色继续由 Harness 各自独立的语义负责。

设置中现在会显示独立的**外观与皮肤**页面，其中有**官方外观**和 **DeepSeek蓝鲸娘**两张卡片。点击卡片会立即预览，但不会自动保存；点击**取消**会恢复上次已应用的选择，点击**应用**会把选择写入当前浏览器、当前 Harness origin 下的版本化存储键 `@yehu77/dsh-kisekae:skin:v1`。同源标签页会自动同步，不同浏览器或 origin 各自保存。该实现不修改 Harness 的设置 namespace allowlist。

同一页面还提供即时生效的**文字风格**偏好。**蓝鲸冰晶**跟随当前主题自己的默认字体与文字效果；**官方清晰**恢复中性的官方正文颜色和常规字重；**关闭文字特效**保留主题消息配色与字重，但移除描边和投影。选择会按当前浏览器保存到 `@yehu77/dsh-kisekae:text-style:v1`。以后每套主题都可以提供自己的默认字体与效果，同时继续提供后两项通用覆盖。

主背景选项会立即保存到 `@yehu77/dsh-kisekae:main-background:v1`。“随机”在每次加载页面时选择一张图片，“固定”使用图鉴中点选的图片，“关闭”则移除背景。原生 3840×2160 深海夜景壁纸使用完全不透明的 `cover` 铺满主聊天画布，不再叠加重复的环境副本；其他插画仍用 `contain` 完整展示未裁切构图，并在空余区域垫一层未模糊的低透明度 `cover` 副本。文字可读性由独立内容表层负责，而不是整幅洗白背景。主背景只在蓝鲸娘可见时出现；预览官方外观期间，其偏好仍会保留。112 MiB 原始素材保持不变；插件使用约 25 MiB 的原始像素尺寸 JPEG 发布副本，并在图鉴中懒加载。

侧栏背景会立即保存到 `@yehu77/dsh-kisekae:sidebar-backdrop:v1`。“清爽”和“沉浸”使用一张固定的图鉴图片，默认是雨景 `7fd9fafc…`，并提供向上渐隐与基于语义颜色的玻璃遮罩；“关闭”会移除背景。56 px 窄栏只显示安静的纯渐变。设置页用同一个组件提供实时侧栏预览，主题则通过半透明的语义 hover／active 颜色适配会话行，不直接修改会话行样式。“新会话”按钮保留官方元素、文字、操作、焦点行为和提示：蓝鲸娘在宽栏使用右侧低透明图片与语义玻璃，窄栏使用紧凑玻璃，并配有响应式 `currentColor` 海浪对话图标。

“设置”入口同样保留官方按钮、齿轮、文字和对话框行为。宽栏会在右侧安静显示航海房间图片 `d5dd1b2f…`，并用语义遮罩保证文字可读；窄栏则使用无图片玻璃与两道轻微涟漪。

输入框保留官方 textarea、按钮、焦点、文件拖放和高度变化行为。蓝鲸娘只绘制卡片的无交互背景：随浅色／深色模式变化的海洋玻璃、双层发光边与顶部高光、三道潮汐线、左右鲸尾、按钮光圈、珍珠、海星和贝壳。Hero 使用最完整的表现，常驻对话输入框保留同一视觉身份并稍微降低装饰强度；常驻卡片后方使用半透明深海底座遮罩代替不透明底色，让壁纸自然延伸到视口底边。全部装饰均为可缩放的 CSS 或内联 SVG，不使用位图或模糊。

主对话背景、输入框装饰、侧栏背景、“新会话”装饰、海浪对话图标和“设置”入口装饰组成一组由设置页当前 draft 驱动的可逆视觉贡献。预览官方外观会立即移除六者；如果已保存的是蓝鲸娘，点击“取消”会全部恢复。隐藏期间，美术偏好保持不变。

项目当前针对 DeepSeek Harness commit `18c22363d7c8655603a065909c05c5222736d5d1`（`0.1.0-rc.5`）开发；该版本提供 `conversation.composer.bar.decoration`、`conversation.backdrop`、`settings.trigger.decoration`、`sidebar.backdrop`、`sidebar.newSession.decoration`、`sidebar.newSession.icon`，以及分别作用于用户和助手正文的颜色与文字阴影令牌和共享字重令牌。同仓库的 [`packages/conversation`](../conversation) 包负责发布包含这些能力的完整替换对话底座。DeepSeek Harness 仍处于开发者预览期，因此两个包会一起固定和审查兼容性，不能默认成立。

完整产品范围、交付阶段、决策门和发布标准见[工作区路线图](../../ROADMAP.zh.md)。

DSH Kisekae 是独立社区项目，与 DeepSeek 及 DeepSeek Harness 维护者不存在隶属、赞助或官方认可关系。“DeepSeek蓝鲸娘”是为本项目创作的原创社区主题，并非官方角色或吉祥物。相关名称与标识的权利归各自权利人所有。

## 设计原则

- 浅色、深色和跟随系统继续由 DeepSeek Harness 官方偏好负责。
- Kisekae 是通过 `theme.overrideTokens()` 实现的独立、可移除皮肤层。
- 只使用公共 Cordis 服务和 slot，不定位生成后的 CSS 类名，也不修改官方组件 DOM。
- 视觉状态绝不改变提示词、模型可见消息、工具、凭据或 Session 历史。
- 原创与 AI 辅助美术独立于源代码许可证记录。

这个包拥有完整的皮肤定义，其中包括字体。后续每个主题都可以提供自己的消息颜色、文字效果、字重和许可合规的字体文件；同仓库的对话底座保持主题中立，只提供这些值实际生效的位置。

## 本地开发

要求 pnpm 11.7.0，以及 Node.js `^22.19.0 || >=24.0.0`。

```sh
pnpm install
pnpm run check
```

把本地 checkout 链接安装到从源码运行的 DeepSeek Harness Web profile：

```sh
cd ../deepseek-harness
pnpm dsh plugin --profile web add ../dsh-kisekae/packages/conversation
pnpm dsh plugin --profile web add ../dsh-kisekae/packages/theme
pnpm dsh --profile web --dump-config
pnpm dsh --profile web
```

干净移除：

```sh
pnpm dsh plugin --profile web remove @yehu77/dsh-kisekae
pnpm dsh plugin --profile web remove @deepseek-ai/dsh-client-ui-conversation
```

## 从 GitHub 安装

```sh
dsh plugin --profile web add 'github:yehu77/dsh-kisekae#path:/packages/conversation'
dsh plugin --profile web add 'github:yehu77/dsh-kisekae#path:/packages/theme'
```

请先安装对话底座；它保留官方包身份，因此 Web profile 会用它替换 Harness 内置的对话插件。两个包都通过 pnpm 的 Git `path:` 选择器来自当前仓库，并且都已经提交构建产物，因此安装不需要构建权限。CLI 提示对话包没有 `dsh.bundle` 属于正常现象，因为现有 `ui-conversation` 配置行已经挂载该包身份。需要可复现安装时，请为两个包固定相同的 tag 或 commit。

## 仓库结构

```text
src/index.ts          Host 入口与同源图片路由
src/artworks.ts       42 张图片的共享目录与逐图画布适配方式
src/settings-contract.ts  皮肤 ID 与版本化浏览器存储标识
src/client/index.ts   正式浏览器入口与设置贡献
src/client/browser-skin-store.ts  按 origin 持久化与跨标签页同步
src/client/SkinSelectorSection.tsx  响应式双卡片选择器
src/client/skin-controller.ts  预览、取消、持久化与令牌生命周期
src/client/text-style-store.ts  即时保存主题默认、官方清晰与关闭特效偏好
src/client/main-background-store.ts  固定、随机与关闭主背景偏好
src/client/BlueWhaleConversationBackdrop.tsx  随会话阶段变化的边绘背景
src/client/BlueWhaleComposerDecoration.tsx  官方输入框内容背后的海玻璃层
src/client/sidebar-backdrop-store.ts  清爽、沉浸、关闭与固定背景偏好
src/client/SidebarBackdrop.tsx  官方侧栏背景 slot 中的雨幕图片
src/client/BlueWhaleNewSessionDecoration.tsx  “新会话”内容背后的玻璃与图片层
src/client/BlueWhaleNewSessionIcon.tsx  官方“新会话”图形 slot 中的海浪对话图标
src/client/BlueWhaleSettingsTriggerDecoration.tsx  “设置”入口内容背后的玻璃与图片层
src/client/skin-visual-orchestrator.ts  随 draft 管理蓝鲸娘外壳视觉生命周期
src/client/themes/    数据化的主题配色定义
cordis.patch.yml      可安装的 Web profile 层
assets/release/       浏览器发布副本
../../assets/inbox/  位于包外的用户管理只读原始素材库
tests/                构建产物加载与生命周期检查
```

## 许可证

源代码与文档使用 [MIT License](LICENSE)。美术及其他非代码素材由 [ASSETS_LICENSE.md](ASSETS_LICENSE.md) 和 `assets/manifest.yaml` 分别管理。

## 模型体验

无。Kisekae 是浏览器表现插件；其中没有内容进入模型请求，也不改变 Session 日志。
