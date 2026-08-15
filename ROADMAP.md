# DSH Kisekae roadmap

Status: in progress

English | [中文](ROADMAP.zh.md)

Current milestone: Stage 2 — browser-persistent selection for Official appearance and “DeepSeek Blue Whale-chan.” The rest of Stage 2 remains open until two more original skins prove the catalog is data-driven.

The first gallery, optional corner decoration, and “Blue Whale glass sidebar · Rain veil” are implemented. All 42 released illustrations appear in the gallery; Fixed, Random, and Off control one framed `shell.overlay`, while Clear, Immersive, and Off control a fixed-image `sidebar.backdrop`. A wave-chat glyph also occupies `sidebar.newSession.icon`. These contributions remain independent of the selected skin.

## Goal

Build a maintainable, open-source collection of anime-inspired Web skins for DeepSeek Harness without forking the official UI. Installation, selection, preview, and removal must be reversible, and richer art must never become necessary to use the agent.

## Boundaries

- Official Light, Dark, and System preferences remain unchanged.
- A Kisekae skin is one `theme.overrideTokens()` layer with light and dark values for every override.
- The first release uses original or appropriately licensed art; recognizable franchise assets are excluded.
- The first release has no remote marketplace, arbitrary user CSS, browser-downloaded code, model persona, desktop surface, or replacement conversation layout.
- Settings selection, decorative overlays, and onboarding are separate features even when they share one art direction.

## Delivery stages

### 0. Foundation and baseline

- Keep one self-contained npm package carrying `dsh.bundle`, its Host entry, and `dsh.client`.
- Pin the supported DeepSeek Harness commit and capture the unmodified Web baseline.
- Inventory semantic tokens across settings, conversation, Markdown, code, tools, terminal, overlays, and focus states.
- Approve one responsive selector wireframe, an original visual direction, and the asset policy.

Exit when the linked package installs, loads, disposes, and leaves the official appearance unchanged.

### 1. One reversible skin

- Implement the original “DeepSeek Blue Whale-chan” token-only skin with complete light and dark pairs.
- Validate definition ids, token values, replacement, mode switching, and disposal.
- Use no private selectors and request no upstream changes.

Exit when Light, Dark, and System all work, hot disposal restores the official appearance, and the skin remains readable across the main Web surfaces.

### 2. Theme-pack MVP

- Persist the applied skin in versioned browser storage scoped to the current origin, and synchronize same-origin tabs through `storage` events.
- Keep the standalone Client bundler aligned with the current Harness platform externals, dependency-purity checks, and environment substitutions. Add effect-owned CSS Modules before component-local styles require them.
- Add a responsive settings selector with immediate local preview, Cancel, Apply, and Official appearance.
- Add two more original skins to prove that definitions are data-driven.
- Fall back visibly to Official appearance when a stored skin is unavailable.

Exit when selection survives reload and server restart in the same browser and origin, same-origin tabs converge after Apply, browser/origin isolation is documented, keyboard-only use works, and package removal leaves an ordinary Web profile.

### 3. Optional richness and guidance

- Keep the shipped framed `shell.overlay` decoration optional through Fixed, Random, and Off controls.
- Keep the shipped glass sidebar optional through Clear, Immersive, and Off controls. Wide mode uses one fixed catalog image with an upward fade; the narrow rail uses only a quiet semantic gradient.
- Keep the shipped wave-chat New Session glyph responsive through the host-provided wide state, without replacing the official button or action.
- Keep the static overlay click-through and outside task content; any future motion must respect reduced-motion preferences.
- Extend the theme later to conversation backgrounds and composer styling as separately optional surfaces. Sidebar styling already uses the public backdrop slot and semantic row tokens; reuse the artwork catalog through role-specific browser copies instead of stretching every illustration into every surface.
- Build any first-run guidance as a separate `settings.onboarding` contribution.

Exit when decoration and guidance can each be disabled without changing the selected skin or blocking conversation, tools, credentials, or settings.

### 4. Public distribution

- Publish from the maintainer-controlled npm scope and keep GitHub installation available with a pinned commit.
- Document install, upgrade, removal, compatibility, asset attribution, authoring rules, and troubleshooting.
- Include real-server screenshots and a browser interaction recording for visible release flows.

Exit when a clean Web profile can install, run, upgrade, and remove Kisekae using only documented commands.

### 5. Community authoring kit

- Wait for a second independently maintained pack before extracting a public definition library.
- Add a schema validator, preview fixture, token-coverage report, and author template.
- Publish contribution, compatibility, licensing, and package-trust guidance.

Exit when a new pack can be built without importing Kisekae runtime internals. A hosted marketplace remains a separate proposal.

## Decision gates

- If tokens cannot express a credible first skin, list missing semantic roles and propose only generic aliases justified by two consumers; do not use private CSS as an escape hatch.
- If skin activation causes a measurable first-paint flash, propose a generic installed-token bootstrap hook; do not patch generated HTML.
- Released gallery art is served by Kisekae's same-origin Host route from packaged browser copies; do not rely on emitted Client siblings, inbox originals, or a remote CDN.
- The official `shell.overlay` slot is sufficient for the framed corner decoration, while the product-neutral `sidebar.backdrop` and `sidebar.newSession.icon` slots carry sidebar artwork and the themed New Session glyph. Any other visual surface still needs its own generic seam rather than private selectors.
- Conversation backgrounds, composer styling, and sidebar styling remain separately optional. Busy artwork must not sit directly beneath messages or editable text; each surface needs a quiet fallback that preserves readability.
- Keep definitions internal until independent release or ownership makes package separation useful.
- While Harness exposes only an allowlisted set of settings namespaces, keep the choice in Kisekae-owned versioned browser storage. Do not patch the upstream allowlist; reconsider Host persistence only after a generic out-of-tree extension point exists.
- Any upstream API change needs its own DeepSeek Harness design record, current-state documentation, reversible effects, and an assembled Web test.

## Release criteria

- Install and removal require no edits to the DeepSeek Harness checkout.
- Exactly one committed skin layer is active, and preview or disposal restores prior token state.
- Themes use semantic tokens and locally packaged, licensed assets with no remote loading or telemetry.
- Keyboard operation, visible focus, readable content, reduced motion, zoom, and narrow layouts work for every skin.
- Tests cover definition validation, persistence, fallback, replacement, and disposal; a real Web profile proves assembled behavior.
- Code and asset licenses remain separate, and every released non-code file has provenance metadata.
