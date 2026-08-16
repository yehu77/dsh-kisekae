# AGENTS.md

DSH Kisekae is an out-of-tree DeepSeek Harness plugin workspace. It contains a theme package and a community conversation replacement; DeepSeek Harness remains the host.

## Product invariants

- DeepSeek Harness remains authoritative for Light, Dark, and System. Kisekae selects a separate skin whose token values cover both light and dark modes.
- Theme packages own every visual choice, including artwork, color, font family, font weight, and text effects. The conversation replacement exposes presentation controls but does not hard-code a Kisekae theme.
- Model behavior is out of scope. Do not change prompts, tools, credentials, model-visible messages, or Session events for visual features.
- Use public services and slots only. Never target generated CSS Module names, deep internal selectors, undocumented DOM structure, or copied official components.
- Every registration and token override is effect-owned and has a disposer. Unloading the package must restore the official UI without residue.
- Keep the two packages in this repository independently installable and version their compatibility together.
- A missing Harness facility becomes an upstream proposal only after two product-neutral consumers demonstrate the same need. Do not modify the sibling `deepseek-harness` checkout as part of an ordinary Kisekae change.

## Client Plugin rules

- `packages/theme/package.json` declares both `dsh.bundle` and `dsh.client`; its `cordis.patch.yml` mounts the theme Host entry.
- `packages/conversation` keeps the exact package identity `@deepseek-ai/dsh-client-ui-conversation` so it can replace the official module without disconnecting its dependents. It ships prebuilt artifacts and remains visually theme-neutral.
- The browser artifact is a Harness loader factory registered through `window.__ModuleLoader__.load(...)`, not an ordinary browser ESM bundle.
- Client collaboration with Harness plugins goes through injected `ctx` services. Imports from other Client Plugins are type-only; do not inline or duplicate their runtime values.
- The release entry may use React for settings UI and public decorative slots such as `conversation.backdrop`. Keep the self-contained tsdown config's Harness platform externals, dependency-inlining rule, bundle-purity gate, and environment substitutions aligned with the pinned Harness revision. Before adding CSS Modules, port the official effect-owned style injection and cover cleanup in bundle tests.
- Start with semantic `--dsw-*` token overrides. Add CSS Modules only when tokens cannot express component-local layout, and keep literal colors out of feature CSS.
- Persist the applied skin under the versioned, origin-scoped browser key owned by Kisekae and synchronize same-origin tabs. Do not patch Harness's settings-namespace allowlist for project-specific persistence.
- Settings, optional surface decoration, and onboarding remain independent contributions so users can disable them separately.

## Assets

- `assets/inbox/` is a user-managed, read-only material library. Never create, transform, rename, move, overwrite, or delete anything there without the user's explicit approval for the exact operation and targets.
- Browser-ready copies live under `packages/theme/assets/release/`; they may be regenerated from approved inbox originals without modifying those originals.
- Code and documentation use MIT. Every released asset has an entry in `packages/theme/assets/manifest.yaml` and follows `packages/theme/ASSETS_LICENSE.md`.
- AI-assisted art uses original prompts and authorized references. Do not request or accept franchise characters, logos, living-artist imitation, unlicensed fonts, signatures, or watermarks.
- Keep provider, model, date, prompt, reference rights, human edits, license, and attribution with each released asset.

## Commands

```sh
pnpm install
pnpm run typecheck
pnpm run test
pnpm run check
```

Run the smallest relevant check while iterating and `pnpm run check` before publishing. A visible GUI change also needs manual review in a real linked DeepSeek Harness Web profile, including Light, Dark, System, keyboard focus, reduced motion, zoom, and narrow viewport.

## Documentation

Update the root and affected package README languages when installation, compatibility, behavior, or licensing changes. Keep `ROADMAP.md` and `ROADMAP.zh.md` structurally aligned when a product decision moves. Current-state docs describe shipped behavior; proposed work stays in the roadmap until implemented.
