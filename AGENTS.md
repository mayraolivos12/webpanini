# Repository Guidelines

## Project Structure & Module Organization

This repository is currently empty except for contributor guidance. As code is added, keep the layout predictable and shallow:

- `src/` for application source code and reusable modules.
- `tests/` for automated tests that mirror `src/` paths.
- `assets/` or `public/` for static files such as images, icons, and sample data.
- `docs/` for design notes, setup details, and user-facing documentation.

Prefer small, focused modules. Name directories by feature or domain rather than by implementation detail.

## Build, Test, and Development Commands

No build system is configured yet. When one is introduced, document the exact commands here and keep them runnable from the repository root. Common examples:

- `npm install` installs JavaScript dependencies.
- `npm run dev` starts a local development server.
- `npm test` runs the test suite.
- `npm run build` creates a production build.

Avoid adding scripts that require global tools unless the README explains how to install them.

## Coding Style & Naming Conventions

Use consistent formatting and let project tooling enforce it once configured. Until then:

- Use 2-space indentation for JavaScript, TypeScript, JSON, HTML, and CSS.
- Use descriptive file names such as `user-profile.ts` or `checkout-form.tsx`.
- Use `PascalCase` for components/classes, `camelCase` for functions and variables, and `UPPER_SNAKE_CASE` for constants.
- Keep configuration files at the repository root when they affect the whole project.

## Testing Guidelines

Add tests with new behavior, especially for parsing, state changes, API boundaries, and user-visible workflows. Mirror source paths where practical, for example `src/cart/total.ts` and `tests/cart/total.test.ts`.

Use clear test names that describe expected behavior. Keep tests deterministic and avoid network calls unless they are explicitly mocked.

## Commit & Pull Request Guidelines

Git history is not available in this environment, so no existing commit convention could be inferred. Use concise, imperative commit subjects, for example `Add checkout validation` or `Fix asset path handling`.

Pull requests should include:

- A short summary of the change.
- Any setup, migration, or configuration notes.
- Test results or a clear note when tests were not run.
- Screenshots or recordings for UI changes.

## Agent-Specific Instructions

Do not overwrite user work. Before broad edits, inspect the current tree and existing conventions. Keep changes scoped to the requested task, and update this file when project commands, structure, or contribution rules change.
