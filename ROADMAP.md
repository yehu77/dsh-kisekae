# DSH Kisekae roadmap

Status: proposed

English | [中文](ROADMAP.zh.md)

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

- Implement one original, token-only skin with complete light and dark pairs.
- Validate definition ids, token values, replacement, mode switching, and disposal.
- Use no private selectors and request no upstream changes.

Exit when Light, Dark, and System all work, hot disposal restores the official appearance, and the skin remains readable across the main Web surfaces.

### 2. Theme-pack MVP

- Register a Host settings namespace owned by Kisekae.
- Extend the standalone Client bundler with the current Harness platform externals, dependency-purity checks, environment substitutions, and effect-owned CSS Modules before adding React UI code.
- Add a settings selector with local preview, Preview, Cancel, Use this theme, and Official appearance.
- Add two more original skins to prove that definitions are data-driven.
- Fall back visibly to Official appearance when a stored skin is unavailable.

Exit when selection survives loopback refresh and server restart, remote-browser limitations are explicit, keyboard-only use works, and package removal leaves an ordinary Web profile.

### 3. Optional richness and guidance

- Add one opt-in mascot or ambient decoration through `shell.overlay`.
- Respect reduced motion, keep the overlay click-through by default, and keep it outside task content.
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
- The current Client Plugin route serves only `client.js` and its source map. Inline small MVP previews; before shipping larger art, add a reviewed same-origin Host asset route instead of relying on emitted sibling files or a remote CDN.
- Before adding wallpapers, prove whether `shell.overlay` is sufficient. A new behind-content slot requires a second non-theme consumer.
- Keep definitions internal until independent release or ownership makes package separation useful.
- Any upstream API change needs its own DeepSeek Harness design record, current-state documentation, reversible effects, and an assembled Web test.

## Release criteria

- Install and removal require no edits to the DeepSeek Harness checkout.
- Exactly one committed skin layer is active, and preview or disposal restores prior token state.
- Themes use semantic tokens and locally packaged, licensed assets with no remote loading or telemetry.
- Keyboard operation, visible focus, readable content, reduced motion, zoom, and narrow layouts work for every skin.
- Tests cover definition validation, persistence, fallback, replacement, and disposal; a real Web profile proves assembled behavior.
- Code and asset licenses remain separate, and every released non-code file has provenance metadata.
