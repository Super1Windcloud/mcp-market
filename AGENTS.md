# Repository Guidelines

## Project Structure & Module Organization
Electron responsibilities split across `src/main.ts` (main process), `src/preload.ts` (bridge), and `renderer.ts` (React entry). UI primitives stay in `src/components`, with routes and layouts under `src/routes` and `src/layouts`; generated files such as `src/routeTree.gen.ts` should be left untouched. Shared logic collects in `src/helpers`, `src/store`, `src/utils`, and `src/types`. Tailwind styles sit in `src/styles`, assets in `src/assets`, and tests under `src/tests/{unit,e2e}`. Packaging assets live in `public/`, and build configs (`vite.*.config.mts`, `forge.config.ts`, `components.json`) remain in the root.

## Build, Test, and Development Commands
- `npm start`: Launch Electron Forge with hot reload for main, preload, and renderer bundles.
- `npm run lint`: Apply the flat ESLint config to TypeScript and React files.
- `npm run format` / `npm run format:write`: Verify or apply Prettier (includes Tailwind class ordering).
- `npm run package` / `npm run make`: Create distributable bundles; installers land in `out/`.
- `npm test`, `npm run test:watch`, `npm run test:e2e`, `npm run test:all`: Run Vitest once, in watch mode, Playwright suites, or both pipelines.

## Coding Style & Naming Conventions
ESLint and Prettier (2-space indentation, semicolons, double quotes) define the baseline. Name components in PascalCase, hooks in camelCase, and keep helpers near their route or component. Favor named exports to aid Vite tree-shaking, and run Tailwind strings through class merge helpers (`src/utils`). Keep preload exposure minimal and share contracts through `src/types`.

## Testing Guidelines
Author Vitest specs with the `*.test.ts[x]` pattern under `src/tests/unit`, using Testing Library queries (`getByRole`, `findByText`) instead of DOM traversal. E2E specs stay in `src/tests/e2e` and rely on the shared Playwright config. Run `npm test` before opening a pull request, and add `npm run test:e2e` when UI or integration paths shift.

## Commit & Pull Request Guidelines
Recent history favors short imperative subjects (for example, `update`). Keep that style but be descriptive—`Add marketplace filter badge` beats `update`. Scope commits narrowly, reference issues, and note config changes. Pull requests need summary, test evidence (commands + results), and screenshots or gifs for visible UI updates. Rebase onto `main`, confirm `npm run lint` and `npm run format` pass, and flag breaking changes early.

## Security & Configuration Tips
Store secrets in a local `.env` loaded via `dotenv`; never commit credentials. Declare new keys in `forge.env.d.ts` or companion type files so renderer code stays typed. When editing Forge or Vite configs, ensure `contextIsolation` stays enabled and review preload exports to avoid leaking privileged APIs.
