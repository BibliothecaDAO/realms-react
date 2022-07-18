# The Realms Landing Page Repo

<p align="left">
  <a aria-label="Build" href="https://github.com/BibliothecaForAdventurers/realms-react/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/workflow/status/BibliothecaForAdventurers/realms-react/CI-atlas-app/main?label=CI&logo=github&style=flat-quare&labelColor=000000" />
  </a>
</p>

> Part of the [Bibliotheca DAO](https://github.com/BibliothecaForAdventurers)

## Develop

```bash
$ cd apps/realms-landing
$ yarn dev
# Alternatively: yarn workspace webapp run dev -p 3000
```

### Features

> Some common features that have been enabled to widen monorepo testing scenarios.

- [x] Styling: [Emotion v11](https://emotion.sh/) support with critical path extraction enabled.
- [x] Styling: [Tailwind v3](https://tailwindcss.com/) with JIT mode enabled and common plugins.
- [x] Tests: [jest](https://jestjs.io/) + [ts-jest](https://github.com/kulshekhar/ts-jest) + [@testing-library/react](https://testing-library.com/)
- [x] E2E: [Playwright](https://playwright.dev/)
