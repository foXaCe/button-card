# Contributing

Thanks for your interest in improving button-card!

## Pull requests

- Open PRs against the `main` branch. The `dev` branch, when present, publishes `@beta` prereleases.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit and PR titles
  (`feat:`, `fix:`, `docs:`, `chore:` …). The changelog and version bumps are generated
  automatically by [semantic-release](https://semantic-release.gitbook.io/).
- Keep the bundle building before pushing: `yarn install --frozen-lockfile && yarn build`.

## Local setup

The fastest path is the provided dev container (`.devcontainer/`), which boots a Home Assistant
instance with the card hot-reloaded.

Manual setup:

```bash
yarn install --frozen-lockfile
yarn lint    # eslint (type-aware, prettier-checked)
yarn build   # lint + rollup bundle to dist/
yarn watch   # rebuild on change + dev server
```

## Releases

Releases are automated. Conventional Commits merged into `main` and run through the **Release**
workflow publish a stable release (the `button-card.js` bundle is attached to the GitHub release);
the `dev` branch publishes `@beta` prereleases.
