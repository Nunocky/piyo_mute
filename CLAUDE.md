# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**ぴよ日記フィルタ** is a Chrome extension (Manifest V3) for [piyo.hatelabo.jp](https://piyo.hatelabo.jp) that hides posts from specified users or with specified tags. Settings are persisted via `chrome.storage.sync`.

## Commands

```bash
# Build once
npm run build

# Build in watch mode (for development)
npm run dev

# Type-check only (no emit)
npx tsc --noEmit
```

After building, load the `dist/` directory as an unpacked extension in Chrome (`chrome://extensions` → "Load unpacked").

## Architecture

The extension has three entry points, each compiled to a separate JS file in `dist/`:

- **[src/content.ts](src/content.ts)** — Content script injected into `piyo.hatelabo.jp`. Reads settings, hides matching posts on page load, and re-applies filters on DOM mutations via `MutationObserver`.
- **[src/popup.ts](src/popup.ts)** — Logic for the browser action popup UI. Loads current settings into textareas and saves changes.
- **[src/background.ts](src/background.ts)** — Service worker (currently a stub).

Shared logic lives in **[src/settings.ts](src/settings.ts)**, which defines the `Settings` interface (`mutedUsers: string[]`, `mutedTags: string[]`) and `loadSettings`/`saveSettings` wrappers around `chrome.storage.sync`.

The popup UI is a static HTML file ([src/popup.html](src/popup.html)) copied to `dist/` by the build script — it is not processed by Vite.

## Key Implementation Notes

- DOM selectors in `content.ts` (`".entry, .diary-entry"` for posts, `".username, .author"` for usernames, `".tag"` for tags) are placeholders marked with a `TODO` — they need to be verified against the actual piyo.hatelabo.jp DOM structure.
- Vite is configured with `publicDir: false` and explicit `rollupOptions` to produce flat output files (`[name].js`) without hashing, which is required for the extension manifest to reference them by fixed names.
- TypeScript is strict (`strict: true`, `noUnusedLocals`, `noUnusedParameters`).
