# DSH Kisekae Conversation

English | [中文](README.zh.md)

A community-maintained, drop-in replacement for DeepSeek Harness's Web conversation plugin. It carries the complete official conversation UI and keeps the exact package identity `@deepseek-ai/dsh-client-ui-conversation`, so existing Harness plugins continue to connect to the same Cordis services and slots.

This package lives beside the [theme package](../theme) so DSH Kisekae can ship conversation presentation capabilities without waiting for the same extension points to land in an official Harness release. It is a real Cordis Client plugin, not a stylesheet that targets generated class names.

## What this fork adds

The current release is based on DeepSeek Harness `0.1.0-rc.5` at commit `18c22363d7c8655603a065909c05c5222736d5d1`. In addition to the complete official conversation behavior, it exposes:

- `conversation.backdrop` for a phase-aware conversation canvas;
- `conversation.composer.bar.decoration` for non-interactive composer art;
- separate user and assistant prose color tokens;
- separate user and assistant prose text-shadow tokens;
- one shared message-prose font-weight token.

The fork does not bundle a theme. DSH Kisekae occupies these extension points and supplies the Blue Whale-chan artwork and typography values.

## Install

Use a compatible DeepSeek Harness `0.1.0-rc.5` checkout or release. Install the replacement first, then the theme:

```sh
dsh plugin --profile web add 'github:yehu77/dsh-kisekae#path:/packages/conversation'
dsh plugin --profile web add 'github:yehu77/dsh-kisekae#path:/packages/theme'
```

Restart the Web profile after installation. The CLI may report that this package declares no `dsh.bundle`; that is expected. The Web profile already contains the `ui-conversation` configuration entry, and this direct dependency replaces the package that entry resolves.

The package commits its browser and Host build artifacts, so Git installation does not run an install-time build and needs no `allowBuilds` entry.

## Why the package keeps the official name

Harness plugins refer to the conversation module by the package identity `@deepseek-ai/dsh-client-ui-conversation`. Keeping that identity lets the profile-level dependency take precedence over Harness's bundled fallback while preserving every existing dependency edge. Renaming it to an `@yehu77` package would disconnect plugins that inject the official module id.

This is a technical compatibility identity, not a claim that the fork is an official DeepSeek package. The package path, notices, version suffix, and documentation identify it as a community fork.

## Verify the active package

The shipped browser bundle contains a fork marker:

```sh
grep -F "dsh-kisekae-conversation" \
  ~/.dsh/profiles/web/node_modules/@deepseek-ai/dsh-client-ui-conversation/lib/client.js
```

If the command prints the marker, the Web profile resolves this fork. The application configuration still shows the official package id by design.

## Remove

```sh
dsh plugin --profile web remove @deepseek-ai/dsh-client-ui-conversation
```

Restart the profile. Harness's bundled conversation package becomes visible again through its normal module fallback. Removing the fork does not delete sessions or Kisekae artwork preferences.

## Compatibility and updates

This package replaces a large internal UI plugin, so each release names the exact Harness base it was tested against. The suffix `kisekae.1` is this fork's release number on top of upstream `0.1.0-rc.5`; repository tags version the conversation and theme packages together.

When Harness changes, the fork is resynced, rebuilt in that Harness checkout, tested in the assembled Web profile, and released with a new tag. Users can remain on a working tag until both packages have been updated.

The machine-readable base is recorded in [UPSTREAM.json](UPSTREAM.json). Maintainers with a sibling Harness checkout can run from the workspace root:

```sh
pnpm --filter @deepseek-ai/dsh-client-ui-conversation sync:upstream
pnpm --filter @deepseek-ai/dsh-client-ui-conversation test
```

The sync command builds the official package in that checkout, refreshes this repository's source, upstream tests, and committed runtime artifacts, and updates `UPSTREAM.json`. Review and commit the resulting diff as an ordinary fork update.

The TypeScript tests under `tests/` are the upstream package suite and run inside a matching DeepSeek Harness monorepo. `fork-tests/` verifies the standalone Git distribution without installing dependencies.

## Licensing

The upstream source is distributed under the [MIT License](LICENSE). See [NOTICE.md](NOTICE.md) for origin and modification attribution. This package contains no Kisekae image library; artwork remains in the sibling theme package under its asset license.

This project is independent and is not affiliated with, sponsored by, or endorsed by DeepSeek or the DeepSeek Harness maintainers.
