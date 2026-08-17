# DSH Kisekae Desktop

[中文](README.zh.md)

This app is the desktop shell for the existing DeepSeek Harness Web profile and the two Kisekae Cordis Client Plugin packages. It does not copy the Web UI or turn the theme into a separate desktop implementation.

The development baseline uses Electron with an isolated, sandboxed renderer. It keeps the stable `http://127.0.0.1:3080` origin so browser-owned Kisekae settings survive restarts. If that origin already serves an assembled Harness profile, the desktop shell attaches to it. Otherwise it starts the sibling `deepseek-harness` checkout and owns that process until the app quits. Another service on port 3080 is rejected instead of silently moving to 3081.

## Run the development shell

Keep `dsh-kisekae` and `deepseek-harness` next to each other under the same parent directory, install this workspace, then run:

```sh
pnpm install
pnpm desktop
```

Use an already running local profile without allowing the desktop app to launch one:

```sh
pnpm desktop:attach
```

`DSH_DESKTOP_HARNESS_ROOT` points to a different Harness checkout. `DSH_DESKTOP_NODE` can point to the Node executable used for a source launch when `pnpm` is not available to the child process.

## Delivery stages

1. The current development shell owns one window, one stable loopback origin, and at most one local Harness process.
2. The next stage bundles a reviewed Node 24 runtime, the supported Harness distribution, and the two Kisekae packages so end users do not need Node, pnpm, or a source checkout.
3. Packaging adds app icons, macOS signing and notarization, Windows signing, installers, crash-safe process cleanup, and release updates.
4. Desktop-only abilities such as native directory picking, tray behavior, and notifications remain narrow host capabilities. The renderer never receives Node.js or unrestricted Electron APIs.

Electron build output is local development residue and is not committed. The theme and conversation packages remain independently installable for people who prefer a normal browser.
