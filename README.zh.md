# DSH Kisekae

[English](README.md) | 中文

DSH Kisekae 是一个面向 DeepSeek Harness 的社区主题工作区。仓库里包含两个真正的 Cordis Client Plugin 包和一个可选桌面外壳，它们在同一个仓库中开发和测试。

## 包结构

| 工作区单元 | 路径 | 职责 |
| --- | --- | --- |
| `@yehu77/dsh-kisekae` | [`packages/theme`](packages/theme) | 主题、美术、设置、配色、字体与装饰 slot 贡献 |
| `@deepseek-ai/dsh-client-ui-conversation` | [`packages/conversation`](packages/conversation) | 完整替换官方对话插件，在保留官方行为的同时提供可换肤的对话呈现接口 |
| `@yehu77/dsh-kisekae-desktop` | [`apps/desktop`](apps/desktop) | 运行或接入同一个本地 Harness Web profile 的 Electron 外壳；它是应用，不是第三个主题插件 |

字体属于主题包。“DeepSeek 蓝鲸娘”现在提供紫色用户正文和冰晶边缘的助手正文；后续主题可以选择完全不同的颜色、字重、阴影，以及在加入许可合规的字体文件后选择不同字族。对话底座只负责把当前主题值分发到正确的用户或助手文字上，不包含蓝鲸娘配色或美术。

对话底座继续使用官方包身份，是因为 Harness 里的其他插件都连接这个身份。放在同一个仓库不等于混在一个插件里：两个目录各有自己的 `package.json`、构建产物、版本和安装目标。

## 从 GitHub 安装

先安装对话底座，再安装主题。pnpm 的 Git `path:` 选择器会从同一个仓库分别安装两个包。

```sh
dsh plugin --profile web add 'github:yehu77/dsh-kisekae#path:/packages/conversation'
dsh plugin --profile web add 'github:yehu77/dsh-kisekae#path:/packages/theme'
```

安装后重启 Web profile。两个包都已经提交构建产物，因此 Git 安装不会执行构建脚本，也不需要配置 `allowBuilds`。

需要可复现安装时，可以在 `path:` 前加入共同的发布 tag 或 commit，例如 `#v0.1.0&path:/packages/theme`。

## 本地开发

要求 pnpm 11.7.0，以及 Node.js `^22.19.0 || >=24.0.0`。

```sh
pnpm install
pnpm run check
```

启动开发版桌面外壳。它固定复用 3080，只有该端口尚未运行 Harness 时才会启动相邻的 Harness 源码仓库：

```sh
pnpm desktop
```

把两个包链接到从源码运行的 Harness profile：

```sh
cd ../deepseek-harness
pnpm dsh plugin --profile web add ../dsh-kisekae/packages/conversation
pnpm dsh plugin --profile web add ../dsh-kisekae/packages/theme
pnpm dsh --profile web --dump-config
pnpm dsh --profile web
```

移除命令：

```sh
pnpm dsh plugin --profile web remove @yehu77/dsh-kisekae
pnpm dsh plugin --profile web remove @deepseek-ai/dsh-client-ui-conversation
```

当前视觉与使用方法见[主题包](packages/theme/README.zh.md)，替换机制与兼容性见[对话包](packages/conversation/README.zh.md)，桌面开发与打包阶段见[桌面应用](apps/desktop/README.zh.md)，后续主题和界面计划见[路线图](ROADMAP.zh.md)。

## 许可证

源代码与文档使用 [MIT License](LICENSE)。发布美术由[主题素材许可](packages/theme/ASSETS_LICENSE.md)和[素材清单](packages/theme/assets/manifest.yaml)独立记录。

DSH Kisekae 是独立社区项目，与 DeepSeek 或 DeepSeek Harness 维护者不存在隶属、赞助或官方认可关系。
