# DSH Kisekae

English | [中文](README.zh.md)

Anime-inspired Web themes and delightful UI extensions for DeepSeek Harness.

## Status

This repository currently contains the installable foundation only. It registers one reversible, empty token-override layer, so installing it should not visibly recolor the application yet. The first real skin begins after the visual direction and token map are approved.

The project is developed against DeepSeek Harness commit `47f943859bef60e4160492346772ded9b24f765a` (`0.1.0-rc.5`). DeepSeek Harness is still in developer preview, so compatibility is pinned and reviewed explicitly rather than assumed.

See the [roadmap](ROADMAP.md) for product scope, delivery stages, decision gates, and release criteria.

## Design

- Light, Dark, and System remain official DeepSeek Harness preferences.
- Kisekae is a separate, removable skin layer implemented with `theme.overrideTokens()`.
- The package uses public Cordis services and slots; it does not target generated CSS classes or mutate official component DOM.
- Visual state never changes prompts, model-visible messages, tools, credentials, or Session history.
- Original and AI-assisted art is tracked independently from source-code licensing.

One npm package currently carries both roles required for installation: `dsh.bundle` contributes the profile patch, while `dsh.client` contributes the browser plugin. The package can split only when independently released theme packs create a real ownership or versioning need.

## Local development

Requirements: pnpm 11.7.0 and Node.js `^22.19.0 || >=24.0.0`.

```sh
pnpm install
pnpm run check
```

Install the linked checkout into a source-built DeepSeek Harness Web profile:

```sh
cd ../deepseek-harness
pnpm dsh plugin --profile web add ../dsh-kisekae
pnpm dsh --profile web --dump-config
pnpm dsh --profile web
```

Remove it cleanly:

```sh
pnpm dsh plugin --profile web remove @yehu77/dsh-kisekae
```

## Install from GitHub

```sh
dsh plugin --profile web add github:yehu77/dsh-kisekae
```

Git dependencies arrive as source, so pnpm must be allowed to run this package's `prepare` build. Pin a commit for a reproducible installation. npm and tarball releases will carry built artifacts and will not need install-time build permission.

After pnpm reports the blocked build, add the exact package key to the Web profile's `pnpm-workspace.yaml`, then repeat the install:

```yaml
allowBuilds:
  '@yehu77/dsh-kisekae': true
```

## Repository layout

```text
src/index.ts          Host entry that enrolls the Client Plugin
src/client/index.ts   Browser entry and reversible theme layer
cordis.patch.yml      Installable Web profile layer
assets/               Art provenance and license records
tests/                Built-artifact loading and lifecycle checks
```

## Licensing

Source code and documentation are available under the [MIT License](LICENSE). Art and other non-code assets are governed individually by [ASSETS_LICENSE.md](ASSETS_LICENSE.md) and `assets/manifest.yaml`.

## Model Experience

None. Kisekae is a browser presentation plugin; nothing here enters a model request or changes the Session log.
