# react-education

A "Need for Drive" car-sharing SPA built with React 19 + Vite 8 + TypeScript 6.0.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Vite dev server (HMR uses polling — Windows quirk in `vite.config.ts`) |
| `npm run build` | `tsc -b && vite build` — **type-check first, then build** |
| `npm run lint` | ESLint 9 flat config |
| `npm run preview` | Vite preview of built `dist/` |
| `npm run deploy` | `gh-pages -d dist` — publishes to GitHub Pages |

No test framework is installed.

## Architecture

- **Entry**: `src/main.tsx` renders `<App/>` under `StrictMode`.
- **Routing**: `react-router-dom` v7, `BrowserRouter basename="react-education/"`. Three routes: `/` (landing), `/order` (redirects to `/order/location`), `/order/:step` (multi-step wizard).
- **State**: Single Zustand v5 store (`src/store/orderStore.ts`) with step validation and cascading resets.
- **API**: Thin `fetch` wrapper in `src/services/Api.ts` — base URL from `VITE_CARAPI_BASE_URL` env var. Only `getAllCars()` is called (via `src/hooks/useCars.tsx`).
- **Yandex Maps**: Custom integration (the listed `@pbe/react-yandex-maps` is unused). A `useYandexMaps` hook loads the API 2.1 script dynamically; `YandexMap` component uses imperative `ymaps.Map`/`Placemark`. API key from `VITE_YANDEX_MAPS_API_KEY`.
- **SVGs**: Import as React components with `?react` suffix (`import Foo from './foo.svg?react'`). Without the suffix, they resolve as image URLs.
- **Styling**: CSS Modules (`*.module.css`). Global CSS in `index.css` sets `font-family: Roboto`.
- **UI components**: `Button` (5 color variants: primary/green/cian/orange/purple), `Input`, `Radiobutton` — all in `src/components/ui/`.

## Key quirks

- **Vite base is `/react-education/`** — matches the Router basename. Necessary because of GitHub Pages sub-path hosting. New routes/assets must stay under this prefix.
- **No tests** exist anywhere in the repo.
- **Step 3 & 4** (`ExtraBlock`, `SummaryBlock`) are empty shells.
- **Car filter** (All/Economy/Premium radio buttons in `ModelBlock`) is rendered but never applied to the data.
- Batch-rename or refactor with care — no automated guards beyond `tsc -b` and `eslint`.
