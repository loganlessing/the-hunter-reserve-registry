# theHunter: Call of the Wild — Reserve Field Register

Personal reference site for looking up trophy data, activity windows, and hot
spots per reserve while playing. Built as a "wilderness reserve field register":
parchment paper, pine green + blaze orange, specimen cards.

## Stack

React 19 + Vite + TypeScript, `react-router-dom` (hash routing, so GitHub Pages
needs no 404 tricks). No UI framework — the stylesheet in
[src/index.css](src/index.css) is a direct port of the original
`yukon-valley-chart.html` reference, which remains in the repo root as the
visual ground truth.

## Commands

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
```

## Adding a new reserve (e.g. Silver Ridge Peaks)

No component work needed — one data file:

1. Copy [src/data/reserves/yukon-valley.ts](src/data/reserves/yukon-valley.ts)
   to `src/data/reserves/silver-ridge-peaks.ts` and fill in the reserve's
   verified data (species, zones, medals, hot spots, coats, warnings). The
   `Reserve` type in [src/data/types.ts](src/data/types.ts) documents every field.
2. Give it its own `theme` palette suited to the biome — every color on the
   page derives from those ~18 values (derived shades are computed with
   `color-mix`, so only base colors are needed).
3. Register it in [src/data/reserves/index.ts](src/data/reserves/index.ts):
   `export const reserves = [yukonValley, silverRidgePeaks]`.

Nav entry, route (`#/reserves/silver-ridge-peaks`), and theming all follow from
the registry automatically.

**Data policy:** verified data only (COTW Wiki, community stat sheets,
cross-referenced player reports). Flag community estimates as such in
`footerNotes` rather than presenting them as hard numbers.

## Deployment

Pushing to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml),
which builds and publishes to GitHub Pages (the workflow auto-enables Pages via
`configure-pages` and derives the correct base path from the repo name, so no
config changes are needed regardless of what the repo is called).
