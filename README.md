# DSH Kisekae

English | [中文](README.zh.md)

Anime-inspired Web themes and delightful UI extensions for DeepSeek Harness.

## Status

The first working skin is “DeepSeek Blue Whale-chan,” an unofficial community theme built around cool ocean daylight and a deep-sea night palette. Installing the package immediately overlays 16 semantic color tokens while preserving the official Harness Light, Dark, and System preferences. The settings page also includes a 42-image gallery, a framed lower-right decoration, and the “Blue Whale glass sidebar · Rain veil.”

Settings now includes an **Appearance & Skins** section with **Official appearance** and **DeepSeek Blue Whale-chan** cards. Choosing a card previews it immediately without saving; **Cancel** restores the last applied choice, and **Apply** saves it under the versioned browser-storage key `@yehu77/dsh-kisekae:skin:v1` for the current Harness origin. Tabs on the same origin synchronize automatically, while different browsers and origins keep independent choices. This implementation does not modify Harness's settings-namespace allowlist.

Artwork controls save immediately under `@yehu77/dsh-kisekae:mascot:v1`. Random chooses one suitable illustration per page load, Fixed uses the image selected in the gallery, and Off removes the decoration. The 104 MiB source library remains untouched; the plugin ships 5.2 MiB of browser-ready JPEG copies and lazy-loads gallery images.

The sidebar backdrop saves immediately under `@yehu77/dsh-kisekae:sidebar-backdrop:v1`. Clear and Immersive use one fixed gallery image—the rainy `7fd9fafc…` scene by default—with an upward fade and a semantic-color glass scrim; Off removes it. The 56 px rail renders only a quiet gradient. Settings uses the same component for its live sidebar preview, and the theme supplies translucent semantic hover and active colors instead of styling session rows directly.

The project is developed against DeepSeek Harness commit `47f943859bef60e4160492346772ded9b24f765a` (`0.1.0-rc.5`). The glass sidebar additionally needs a Harness build exposing the public `sidebar.backdrop` slot. DeepSeek Harness is still in developer preview, so compatibility is pinned and reviewed explicitly rather than assumed.

See the [roadmap](ROADMAP.md) for product scope, delivery stages, decision gates, and release criteria.

DSH Kisekae is an independent community project and is not affiliated with, sponsored by, or endorsed by DeepSeek or the DeepSeek Harness maintainers. “DeepSeek Blue Whale-chan” is an original community theme created for this project, not an official character or mascot. Relevant names and marks remain the property of their respective owners.

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
src/index.ts          Host entry and same-origin artwork route
src/artworks.ts       Shared 42-image catalog
src/settings-contract.ts  Skin ids and versioned browser-storage identity
src/client/index.ts   Release browser entry and settings contribution
src/client/browser-skin-store.ts  Per-origin persistence and cross-tab synchronization
src/client/SkinSelectorSection.tsx  Responsive two-card selector
src/client/skin-controller.ts  Preview, cancel, persistence, and token lifecycle
src/client/mascot-store.ts  Fixed, random, and off artwork preference
src/client/KisekaeMascotOverlay.tsx  Framed lower-right artwork
src/client/sidebar-backdrop-store.ts  Clear, immersive, off, and fixed-background preference
src/client/SidebarBackdrop.tsx  Rain artwork for the official sidebar backdrop slot
src/client/themes/    Data-defined theme palettes
cordis.patch.yml      Installable Web profile layer
assets/release/       Browser-ready gallery copies
assets/inbox/         User-managed read-only source library
tests/                Built-artifact loading and lifecycle checks
```

## Licensing

Source code and documentation are available under the [MIT License](LICENSE). Art and other non-code assets are governed individually by [ASSETS_LICENSE.md](ASSETS_LICENSE.md) and `assets/manifest.yaml`.

## Model Experience

None. Kisekae is a browser presentation plugin; nothing here enters a model request or changes the Session log.
