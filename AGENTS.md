# Agent Notes for job-app-tracker

## Quick Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Type-check then build for production (`tsc -b && vite build`)
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint (flat config)

## Toolchain Quirks

- **React Compiler** is enabled via `babel-plugin-react-compiler` in `vite.config.ts`. Do not disable it unless explicitly asked.
- **TypeScript project references** are used. The root `tsconfig.json` is a solution file only; edit `tsconfig.app.json` for source changes and `tsconfig.node.json` for Vite config changes.
- `tsconfig.app.json` sets `verbatimModuleSyntax: true` and `noUnusedLocals: true`. Avoid `import * as React from 'react'` style imports; use named imports only.
- **No test runner is configured.** If adding tests, choose and install one (Vitest is the natural fit for Vite projects).

## Project Structure

- Single-package app. Entry point is `src/main.tsx`; root component is `src/App.tsx`.
- `public/` — Static assets served at root. `index.html` references `src/main.tsx`.
- Global styles and CSS variables (including dark mode) live in `src/index.css`.

## Dependencies

- React 19 and React DOM 19. Hooks and APIs follow React 19 conventions.
- ESLint config is flat (`eslint.config.js`). Do not create `.eslintrc` files.
