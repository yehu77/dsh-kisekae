# DSH Kisekae

English | [中文](README.zh.md)

Anime-inspired Web themes and delightful UI extensions for DeepSeek Harness.

## Status

The first working skin is “DeepSeek Blue Whale-chan,” an unofficial community theme built around cool ocean daylight and a deep-sea night palette. Installing the package immediately overlays 18 semantic color tokens and one scoped conversation typography token while preserving the official Harness Light, Dark, and System preferences. The settings page also includes a 42-image gallery, a phase-aware main conversation background, the “Blue Whale glass sidebar · Rain veil,” and themed composer, New Session, and Settings surfaces.

Ordinary conversation prose uses a clear medium-weight purple treatment: deep violet in Light mode and pale lilac in Dark mode. This is an original theme treatment; no third-party typeface is bundled. Code, terminal output, and error or status semantics retain the official Harness presentation.

Settings now includes an **Appearance & Skins** section with **Official appearance** and **DeepSeek Blue Whale-chan** cards. Choosing a card previews it immediately without saving; **Cancel** restores the last applied choice, and **Apply** saves it under the versioned browser-storage key `@yehu77/dsh-kisekae:skin:v1` for the current Harness origin. Tabs on the same origin synchronize automatically, while different browsers and origins keep independent choices. This implementation does not modify Harness's settings-namespace allowlist.

Main-background controls save immediately under `@yehu77/dsh-kisekae:main-background:v1`. Random chooses one illustration per page load, Fixed uses the image selected in the gallery, and Off removes the background. Hero, Active, and Settling all show the selected artwork at full opacity with centered full-bleed cover: no reading lane, top veil, sea fog, mask, blur, or fade obscures it. Text readability belongs to separate content surfaces rather than the backdrop. The background appears only while Blue Whale-chan is visible, while its preference remains available during Official appearance preview. The 104 MiB source library remains untouched; the plugin ships about 22 MiB of source-resolution JPEG copies and lazy-loads gallery images.

The sidebar backdrop saves immediately under `@yehu77/dsh-kisekae:sidebar-backdrop:v1`. Clear and Immersive use one fixed gallery image—the rainy `7fd9fafc…` scene by default—with an upward fade and a semantic-color glass scrim; Off removes it. The 56 px rail renders only a quiet gradient. Settings uses the same component for its live sidebar preview, and the theme supplies translucent semantic hover and active colors instead of styling session rows directly. The New Session button keeps the official element, label, action, focus behavior, and tooltip: Blue Whale-chan adds low-opacity right-side artwork under semantic glass in wide mode, compact glass in the rail, and a responsive `currentColor` wave-chat glyph.

The Settings trigger likewise retains the official button, gear, label, and dialog behavior. Wide mode shows the nautical-room `d5dd1b2f…` artwork quietly at the right under a semantic readability scrim; the rail uses image-free glass and two subtle ripples.

The composer keeps the official textarea, controls, focus, file-drop, and resizing behavior. Blue Whale-chan paints only the card's non-interactive background: an opaque-enough semantic sea-glass fill, an inner highlight and themed border, two tide lines, and a quiet whale-tail corner. Hero uses the stronger treatment; the resident composer reduces the accent. The treatment uses no raster artwork and no blur.

The main conversation background, composer decoration, sidebar backdrop, New Session decoration, wave-chat glyph, and Settings trigger decoration are one reversible visual group driven by the current settings draft. Previewing Official appearance removes all six immediately; Cancel restores them when Blue Whale-chan is the saved skin. Their artwork preferences remain intact while hidden.

The project is developed against DeepSeek Harness commit `22820d35413817b6085ecb003389a8273745cff4` (`0.1.0-rc.5`), which exposes `conversation.composer.bar.decoration`, `conversation.backdrop`, `settings.trigger.decoration`, `sidebar.backdrop`, `sidebar.newSession.decoration`, and `sidebar.newSession.icon`. DeepSeek Harness is still in developer preview, so compatibility is pinned and reviewed explicitly rather than assumed.

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
src/client/main-background-store.ts  Fixed, random, and off main-background preference
src/client/BlueWhaleConversationBackdrop.tsx  Phase-aware conversation edge artwork
src/client/BlueWhaleComposerDecoration.tsx  Sea-glass layer behind the official composer card
src/client/sidebar-backdrop-store.ts  Clear, immersive, off, and fixed-background preference
src/client/SidebarBackdrop.tsx  Rain artwork for the official sidebar backdrop slot
src/client/BlueWhaleNewSessionDecoration.tsx  Glass-and-art layer behind New Session content
src/client/BlueWhaleNewSessionIcon.tsx  Wave-chat replacement for the official New Session glyph
src/client/BlueWhaleSettingsTriggerDecoration.tsx  Glass-and-art layer behind Settings trigger content
src/client/skin-visual-orchestrator.ts  Draft-driven lifecycle for Blue Whale shell visuals
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
