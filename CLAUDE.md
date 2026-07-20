# CLAUDE.md

theHunter: Call of the Wild reserve reference site — React 19 + Vite + TS,
hash routing, GitHub Pages. Used mid-hunt to look up trophy data, so accuracy
and legibility outrank everything else.

**Read `docs/project-handoff.md` before making changes.** It is the living
project doc: visual ground rules, data model, the reserve-transcription
template, theming, deployment, and open items. Keep it updated when the
project's state changes — it exists so any fresh session can pick this up.

## Iron rules

1. **Never invent game data.** Stats come only from the owner's verified
   roster docs in `docs/*-roster.md`. If a value isn't in a roster, flag it —
   don't guess. Community estimates get labelled as such in `footerNotes`.
2. **Adding a reserve = adding a data file** (`src/data/reserves/<id>.ts`) and
   registering it in `src/data/reserves/index.ts`. Never new components. Full
   recipe with the roster→TypeScript field mapping: project-handoff §"Adding a
   new reserve".
3. **Keep the field-register identity** — printed placard, not a dashboard.
   Layout, fonts, ladder tiers, Bronze `<` prefix, hazard stripes are all
   deliberate; don't restyle without being asked.

## Commands

```sh
npm install
npm run dev      # local dev server
npm run build    # tsc -b type-check + production build
```

Push to `main` = deploy (CI builds and publishes to GitHub Pages). If npm is
unavailable in your environment, CI is the verification path — validate data
files by script first (zones tile 0–24, ascending classes, 18 theme tokens,
medals as strings with bronze === silver).

Live: https://loganlessing.github.io/the-hunter-reserve-registry/
