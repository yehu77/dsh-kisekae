# DSH Kisekae

[English](README.md) | 中文

为 DeepSeek Harness 提供二次元风格的 Web 主题与愉快的 UI 扩展。

## 当前状态

仓库目前只包含可安装的基础骨架。它会注册一个可逆但内容为空的令牌覆盖层，因此安装后暂时不会明显改变页面颜色。等视觉方向与令牌映射通过审阅后，再开始实现第一套真实皮肤。

项目当前针对 DeepSeek Harness commit `47f943859bef60e4160492346772ded9b24f765a`（`0.1.0-rc.5`）开发。DeepSeek Harness 仍处于开发者预览期，因此兼容性要显式固定和审查，不能默认成立。

完整产品范围、交付阶段、决策门和发布标准见[路线图](ROADMAP.zh.md)。

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
src/index.ts          让 Client Plugin 进入组合的 Host 入口
src/client/index.ts   浏览器入口与可逆主题层
cordis.patch.yml      可安装的 Web profile 层
assets/               美术来源与许可证记录
tests/                构建产物加载与生命周期检查
```

## 许可证

源代码与文档使用 [MIT License](LICENSE)。美术及其他非代码素材由 [ASSETS_LICENSE.md](ASSETS_LICENSE.md) 和 `assets/manifest.yaml` 分别管理。

## 模型体验

无。Kisekae 是浏览器表现插件；其中没有内容进入模型请求，也不改变 Session 日志。
