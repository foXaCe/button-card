# Architecture

button-card is a single Lovelace custom card for Home Assistant, written in TypeScript on top of
[Lit](https://lit.dev/) and bundled with Rollup into a single `dist/button-card.js` ES module.

## Build & distribution

- **Source**: `src/` (TypeScript). Entry point: `src/button-card.ts`.
- **Bundler**: Rollup (`rollup.config.js`) → `dist/button-card.js`, terser-minified and Babel-transpiled
  for older browsers (incl. Android ≥ 5).
- **Distribution**: the bundle is attached as a GitHub release asset by semantic-release and served by HACS.

## Source layout

| Path | Responsibility |
| --- | --- |
| `src/button-card.ts` | The `ButtonCard` Lit element: config, render, state, actions. |
| `src/action-handler.ts` | Tap / hold / double-tap gesture handling. |
| `src/styles.ts` | Card CSS (Lit `css` templates). |
| `src/helpers.ts`, `src/deep-equal.ts`, `src/handle-action.ts` | Utilities. |
| `src/common/` | Vendored HA frontend helpers (state display, formatting, color, timers…). |
| `src/types/` | TypeScript type definitions (HA, Lovelace, translations). |

## Runtime flow

1. Home Assistant instantiates `<button-card>` with a `hass` object and a card config.
2. `setConfig()` validates and normalises the YAML config (templates, layout, state rules).
3. On each `hass` update, Lit re-renders only what changed; JS templates are evaluated against the current state.
4. User interaction is routed through `action-handler` → `handle-action` → HA service calls / navigation / custom actions.

## Tooling

- **Lint/format**: ESLint 9 (flat config) + Prettier.
- **Types**: TypeScript 5 strict (with `noImplicitAny: false` — HA frontend types are intentionally loose).
- **CI**: lint, build and `mkdocs build --strict` on every PR.
- **Docs**: MkDocs Material in `docs/`, deployed per-version with `mike` to GitHub Pages.
- **Releases**: semantic-release (Conventional Commits) from `main` (stable) and `dev` (`@beta`).
