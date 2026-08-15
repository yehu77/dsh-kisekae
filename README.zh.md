# DSH Kisekae

[English](README.md) | 中文

为 DeepSeek Harness 提供二次元风格的 Web 主题与愉快的 UI 扩展。

## 当前状态

首个可用皮肤是“DeepSeek蓝鲸娘”：一套以清冷海面和深海夜色为方向的非官方社区主题。安装后会立即叠加 16 个语义颜色令牌，同时保留 Harness 官方的浅色、深色和跟随系统偏好。设置页还包含 42 张图片的图鉴、右下角画框装饰，以及“蓝鲸玻璃侧栏·雨幕”。

设置中现在会显示独立的**外观与皮肤**页面，其中有**官方外观**和 **DeepSeek蓝鲸娘**两张卡片。点击卡片会立即预览，但不会自动保存；点击**取消**会恢复上次已应用的选择，点击**应用**会把选择写入当前浏览器、当前 Harness origin 下的版本化存储键 `@yehu77/dsh-kisekae:skin:v1`。同源标签页会自动同步，不同浏览器或 origin 各自保存。该实现不修改 Harness 的设置 namespace allowlist。

图片选项会立即保存到 `@yehu77/dsh-kisekae:mascot:v1`。“随机”在每次加载页面时选择一张合适图片，“固定”使用图鉴中点选的图片，“关闭”则移除装饰。104 MiB 原始素材保持不变；插件使用 5.2 MiB 的浏览器发布副本，并在图鉴中懒加载。

侧栏背景会立即保存到 `@yehu77/dsh-kisekae:sidebar-backdrop:v1`。“清爽”和“沉浸”使用一张固定的图鉴图片，默认是雨景 `7fd9fafc…`，并提供向上渐隐与基于语义颜色的玻璃遮罩；“关闭”会移除背景。56 px 窄栏只显示安静的纯渐变。设置页用同一个组件提供实时侧栏预览，主题则通过半透明的语义 hover／active 颜色适配会话行，不直接修改会话行样式。

项目当前针对 DeepSeek Harness commit `47f943859bef60e4160492346772ded9b24f765a`（`0.1.0-rc.5`）开发。玻璃侧栏还需要 Harness build 提供公开的 `sidebar.backdrop` slot。DeepSeek Harness 仍处于开发者预览期，因此兼容性要显式固定和审查，不能默认成立。

完整产品范围、交付阶段、决策门和发布标准见[路线图](ROADMAP.zh.md)。

DSH Kisekae 是独立社区项目，与 DeepSeek 及 DeepSeek Harness 维护者不存在隶属、赞助或官方认可关系。“DeepSeek蓝鲸娘”是为本项目创作的原创社区主题，并非官方角色或吉祥物。相关名称与标识的权利归各自权利人所有。

## 设计原则

- 浅色、深色和跟随系统继续由 DeepSeek Harness 官方偏好负责。
- Kisekae 是通过 `theme.overrideTokens()` 实现的独立、可移除皮肤层。
- 只使用公共 Cordis 服务和 slot，不定位生成后的 CSS 类名，也不修改官方组件 DOM。
- 视觉状态绝不改变提示词、模型可见消息、工具、凭据或 Session 历史。
- 原创与 AI 辅助美术独立于源代码许可证记录。

当前由一个 npm 包同时承担安装所需的两种角色：`dsh.bundle` 提供 profile patch，`dsh.client` 提供浏览器插件。只有可独立发布的主题包产生真实的所有权或版本需求后才拆包。

## 本地开发

要求 pnpm 11.7.0，以及 Node.js `^22.19.0 || >=24.0.0`。

```sh
pnpm install
pnpm run check
```

把本地 checkout 链接安装到从源码运行的 DeepSeek Harness Web profile：

```sh
cd ../deepseek-harness
pnpm dsh plugin --profile web add ../dsh-kisekae
pnpm dsh --profile web --dump-config
pnpm dsh --profile web
```

干净移除：

```sh
pnpm dsh plugin --profile web remove @yehu77/dsh-kisekae
```

## 从 GitHub 安装

```sh
dsh plugin --profile web add github:yehu77/dsh-kisekae
```

Git 依赖以源码到达，因此 pnpm 必须获准运行本包的 `prepare` 构建。需要可复现安装时应固定 commit。未来的 npm 与 tarball 版本会携带构建产物，不需要安装时构建权限。

pnpm 报告构建被阻止后，把准确的包 key 加入 Web profile 的 `pnpm-workspace.yaml`，再重复安装：

```yaml
allowBuilds:
  '@yehu77/dsh-kisekae': true
```

## 仓库结构

```text
src/index.ts          Host 入口与同源图片路由
src/artworks.ts       42 张图片的共享目录
src/settings-contract.ts  皮肤 ID 与版本化浏览器存储标识
src/client/index.ts   正式浏览器入口与设置贡献
src/client/browser-skin-store.ts  按 origin 持久化与跨标签页同步
src/client/SkinSelectorSection.tsx  响应式双卡片选择器
src/client/skin-controller.ts  预览、取消、持久化与令牌生命周期
src/client/mascot-store.ts  固定、随机与关闭图片偏好
src/client/KisekaeMascotOverlay.tsx  右下角画框装饰
src/client/sidebar-backdrop-store.ts  清爽、沉浸、关闭与固定背景偏好
src/client/SidebarBackdrop.tsx  官方侧栏背景 slot 中的雨幕图片
src/client/themes/    数据化的主题配色定义
cordis.patch.yml      可安装的 Web profile 层
assets/release/       浏览器发布副本
assets/inbox/         用户管理的只读原始素材库
tests/                构建产物加载与生命周期检查
```

## 许可证

源代码与文档使用 [MIT License](LICENSE)。美术及其他非代码素材由 [ASSETS_LICENSE.md](ASSETS_LICENSE.md) 和 `assets/manifest.yaml` 分别管理。

## 模型体验

无。Kisekae 是浏览器表现插件；其中没有内容进入模型请求，也不改变 Session 日志。
