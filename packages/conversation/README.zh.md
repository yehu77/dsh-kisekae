# DSH Kisekae Conversation

[English](README.md) | 中文

这是一个由社区维护、可直接替换 DeepSeek Harness Web 对话插件的 Cordis Client 插件。它保留完整的官方对话界面，并继续使用精确包名 `@deepseek-ai/dsh-client-ui-conversation`，因此现有 Harness 插件仍会连接到相同的 Cordis 服务与 slot。

这个包与[主题包](../theme)放在同一个工作区，让 DSH Kisekae 可以发布对话呈现能力，而不必等待同一批扩展点进入某个官方 Harness 版本。它不是针对生成类名写的样式补丁，而是真正替换官方对话模块的插件。

## 这个 fork 增加了什么

当前版本基于 DeepSeek Harness `0.1.0-rc.5` 的提交 `18c22363d7c8655603a065909c05c5222736d5d1`。在保留完整官方对话行为的基础上，它额外提供：

- `conversation.backdrop`：按显示阶段切换的对话画布；
- `conversation.composer.bar.decoration`：输入框下方的非交互装饰层；
- 分开的用户与助手正文颜色 token；
- 分开的用户与助手正文文字阴影 token；
- 一个共享的消息正文字重 token；
- 一个输入区底座背景 token，其默认值保留官方遮罩。

本仓库不内置具体主题。DSH Kisekae 会占用这些扩展点，并提供“DeepSeek 蓝鲸娘”的图片与文字效果。

## 安装

请使用兼容的 DeepSeek Harness `0.1.0-rc.5`。先安装替换底座，再安装主题：

```sh
dsh plugin --profile web add 'github:yehu77/dsh-kisekae#path:/packages/conversation'
dsh plugin --profile web add 'github:yehu77/dsh-kisekae#path:/packages/theme'
```

安装后重启 Web profile。CLI 可能提示这个包没有声明 `dsh.bundle`，这是正常现象：Web profile 原本就有 `ui-conversation` 配置项，直接依赖会替换该配置项解析到的包。

仓库已经提交浏览器端和 Host 端构建产物，所以从 Git 安装时不会现场构建，也不需要配置 `allowBuilds`。

## 为什么继续使用官方包名

Harness 里的其他插件通过 `@deepseek-ai/dsh-client-ui-conversation` 这个包身份依赖对话模块。保留该身份，profile 顶层安装的 fork 就能优先于 Harness 内置的后备包，同时所有依赖关系仍然成立。如果改成 `@yehu77` 包名，注入官方模块 id 的插件会与它断开。

这里复用包名只是兼容机制，不代表本 fork 是 DeepSeek 官方包。包路径、许可说明、版本后缀和文档都会明确标注它是社区 fork。

## 确认当前使用的是 fork

发布的浏览器 bundle 中带有 fork 标记：

```sh
grep -F "dsh-kisekae-conversation" \
  ~/.dsh/profiles/web/node_modules/@deepseek-ai/dsh-client-ui-conversation/lib/client.js
```

命令输出标记时，Web profile 解析到的就是本 fork。应用配置仍显示官方包 id，这是刻意保留的兼容行为。

## 卸载

```sh
dsh plugin --profile web remove @deepseek-ai/dsh-client-ui-conversation
```

重启 profile 后，Harness 内置的官方对话包会通过原有模块后备路径重新生效。卸载 fork 不会删除会话，也不会删除 Kisekae 的图片偏好。

## 兼容性与更新

本包替换的是较大的内部 UI 插件，因此每个版本都会写明经过验证的 Harness 基线。版本后缀 `kisekae.1` 表示它是在上游 `0.1.0-rc.5` 基础上的第 1 个社区版本；仓库 tag 会同时给对话包和主题包定版。

Harness 更新后，我们会同步 fork、在对应 Harness checkout 中重新构建、用完整 Web profile 验证，再发布新的 tag。用户可以继续停留在已经可用的 tag，直到两个包都完成适配。

机器可读的上游基线记录在 [UPSTREAM.json](UPSTREAM.json)。维护者把 Harness 放在工作区同级目录后，可以从仓库根目录运行：

```sh
pnpm --filter @deepseek-ai/dsh-client-ui-conversation sync:upstream
pnpm --filter @deepseek-ai/dsh-client-ui-conversation test
```

同步命令会在该 Harness checkout 中构建官方包，刷新本仓库的源码、上游测试和已提交的运行产物，并更新 `UPSTREAM.json`。随后像普通 fork 更新一样审查并提交差异。

`tests/` 中的 TypeScript 测试来自上游，需要在匹配的 DeepSeek Harness monorepo 中运行；`fork-tests/` 无需安装依赖，用于检查独立 Git 分发是否完整。

## 许可

上游源码按 [MIT License](LICENSE) 分发；来源与修改归属见 [NOTICE.md](NOTICE.md)。这个包不包含 Kisekae 图片库，所有美术素材位于同仓库的主题包中，并遵循其素材许可。

这是一个独立社区项目，与 DeepSeek 或 DeepSeek Harness 维护者不存在从属、赞助或认可关系。
