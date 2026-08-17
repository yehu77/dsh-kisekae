# DSH Kisekae

English | [中文](README.zh.md)

DSH Kisekae is a community theme workspace for DeepSeek Harness. The repository contains two Cordis Client Plugin packages that are developed, versioned, and tested together.

## Packages

| Workspace unit | Path | Responsibility |
| --- | --- | --- |
| `@yehu77/dsh-kisekae` | [`packages/theme`](packages/theme) | Themes, artwork, settings, color, typography, and decorative slot contributions |
| `@deepseek-ai/dsh-client-ui-conversation` | [`packages/conversation`](packages/conversation) | Community drop-in replacement for the official conversation plugin, preserving official behavior while exposing themeable conversation presentation controls |

Typography belongs to the theme package. “DeepSeek Blue Whale-chan” currently supplies violet user prose and ice-edged assistant prose; later themes may choose entirely different colors, weights, shadows, and, when properly licensed font files are added, font families. The conversation replacement only routes the selected theme values to the correct user and assistant text. It contains no Blue Whale-chan palette or artwork.

The replacement keeps the official package identity because the rest of Harness connects to that identity. Keeping both packages in one repository does not merge their runtime responsibilities: each directory has its own `package.json`, build artifacts, version, and install target.

## Install from GitHub

Install the conversation replacement first, then the theme. pnpm's Git `path:` selector installs each package from this monorepo independently.

DSH Kisekae distributes plugins rather than a native application, so it does not require macOS application notarization or Windows executable signing. The same packages run inside the user's existing Harness installation; use Terminal on macOS or PowerShell on Windows.

```sh
dsh plugin --profile web add 'github:yehu77/dsh-kisekae#path:/packages/conversation'
dsh plugin --profile web add 'github:yehu77/dsh-kisekae#path:/packages/theme'
```

Restart the Web profile after installation. Both packages commit their built artifacts, so Git installation does not run build scripts or need an `allowBuilds` entry.

For a reproducible installation, add a common release tag or commit before the `path:` parameter, for example `#v0.1.0&path:/packages/theme`.

## Local development

Requirements: pnpm 11.7.0 and Node.js `^22.19.0 || >=24.0.0`.

```sh
pnpm install
pnpm run check
```

Link both packages into a source-built Harness profile:

```sh
cd ../deepseek-harness
pnpm dsh plugin --profile web add ../dsh-kisekae/packages/conversation
pnpm dsh plugin --profile web add ../dsh-kisekae/packages/theme
pnpm dsh --profile web --dump-config
pnpm dsh --profile web
```

Open the local URL printed by Harness. Kisekae remains part of that Web profile rather than starting a separate application or server.

Remove them with:

```sh
pnpm dsh plugin --profile web remove @yehu77/dsh-kisekae
pnpm dsh plugin --profile web remove @deepseek-ai/dsh-client-ui-conversation
```

See the [theme package](packages/theme/README.md) for current visuals and usage, the [conversation package](packages/conversation/README.md) for replacement and compatibility details, and the [roadmap](ROADMAP.md) for planned themes and surfaces.

## Licensing

Source code and documentation use the [MIT License](LICENSE). Released artwork is documented separately by the [theme asset license](packages/theme/ASSETS_LICENSE.md) and [asset manifest](packages/theme/assets/manifest.yaml).

DSH Kisekae is independent and is not affiliated with, sponsored by, or endorsed by DeepSeek or the DeepSeek Harness maintainers.
