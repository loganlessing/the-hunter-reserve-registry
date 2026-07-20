# theHunter: Call of the Wild — Reserve Field Register

Personal reference site for looking up trophy data, activity windows, and hot
spots per reserve while playing. Built as a "wilderness reserve field register":
parchment paper, specimen cards, per-reserve biome palettes.

**Live:** https://loganlessing.github.io/the-hunter-reserve-registry/

Four reserves: Yukon Valley, Silver Ridge Peaks, Hirschfelden, and Layton Lake
District — 35 species, each with level ladder, medal scores, 24 h activity
clock, hot spots, gear, coats, and hazard warnings.

## Stack

React 19 + Vite + TypeScript, `react-router-dom` (hash routing, so GitHub Pages
needs no 404 tricks). No UI framework — [src/index.css](src/index.css) is the
visual ground truth, a direct port of the original hand-tuned
`yukon-valley-chart.html` reference (deleted once ported; recover with
`git show 5af5604^:docs/yukon-valley-chart.html`).

## Commands

```sh
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
```

## Documentation

- **[docs/project-handoff.md](docs/project-handoff.md)** — the living project
  doc: visual ground rules, data model, theming, deployment, open items, and
  the full step-by-step reserve-transcription template. Start here.
- **[docs/*-roster.md](docs/)** — the verified data rosters, one per reserve.
  These are the source of truth the data files are transcribed from.

## Adding a new reserve

No component work needed — one roster doc, one data file:

1. Write a verified roster into `docs/<reserve>-roster.md` (follow any existing
   roster's format).
2. Transcribe it into `src/data/reserves/<reserve>.ts` — copy an existing file
   as the skeleton; the `Reserve` type in
   [src/data/types.ts](src/data/types.ts) documents every field, and the
   handoff doc's transcription template maps every roster field to its
   TypeScript counterpart (including the gotchas).
3. Give it its own 18-token `theme` palette suited to the biome (derived shades
   are computed with `color-mix`, so only base colors are needed).
4. Register it in [src/data/reserves/index.ts](src/data/reserves/index.ts) by
   adding it to the `reserves` array.

Nav entry, route (`#/reserves/<id>`), and theming all follow from the registry
automatically.

**Data policy:** verified data only (COTW Wiki, community stat sheets,
cross-referenced player reports). Never invent stats; flag community estimates
as such in `footerNotes` rather than presenting them as hard numbers.

## Deployment

Pushing to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml),
which builds and publishes to GitHub Pages (the workflow auto-enables Pages via
`configure-pages` and derives the correct base path from the repo name, so no
config changes are needed regardless of what the repo is called). Pages Source
must stay set to "GitHub Actions".
