# DSH Kisekae 桌面端

[English](README.md)

这个应用是现有 DeepSeek Harness Web profile 和两个 Kisekae Cordis Client Plugin 包的桌面外壳。它不会复制 Web UI，也不会把主题重新实现成另一套桌面页面。

开发基线使用 Electron，并让页面运行在隔离、沙箱化的 renderer 中。应用固定使用 `http://127.0.0.1:3080`，因此由浏览器保存的 Kisekae 设置可以跨重启保留。如果这个地址已经运行完整 Harness profile，桌面外壳会直接接入；否则它会启动相邻的 `deepseek-harness` 源码仓库，并在应用退出时停止自己启动的进程。3080 被其他服务占用时会明确报错，不会静默另开 3081。

## 运行开发版桌面外壳

把 `dsh-kisekae` 和 `deepseek-harness` 放在同一父目录下，安装本工作区后运行：

```sh
pnpm install
pnpm desktop
```

如果只想连接已经运行的本地 profile，不允许桌面应用自行启动服务：

```sh
pnpm desktop:attach
```

`DSH_DESKTOP_HARNESS_ROOT` 可以指定其他 Harness 源码目录；子进程找不到 `pnpm` 时，`DSH_DESKTOP_NODE` 可以指定用于源码启动的 Node 可执行文件。

## 交付阶段

1. 当前开发外壳只拥有一个窗口、一个稳定的回环地址，并且最多启动一个本地 Harness 进程。
2. 下一阶段会打包经过审核的 Node 24 运行时、受支持的 Harness 发行内容和两个 Kisekae 包，让普通用户不必安装 Node、pnpm 或源码仓库。
3. 发布打包再加入应用图标、macOS 签名与公证、Windows 签名、安装包、异常退出后的进程清理和版本更新。
4. 原生目录选择、托盘和通知等桌面能力继续作为狭窄的 Host capability 提供；页面永远拿不到 Node.js 或不受限制的 Electron API。

Electron 构建产物只是本地开发残留，不提交到 Git。主题包和对话包继续保持可独立安装，偏好普通浏览器的用户仍可只用 Web 版。
