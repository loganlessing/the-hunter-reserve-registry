# theHunter: Call of the Wild — Reserve Field Register

**Project handoff / working context.** This file replaces the original
`claude-code-handoff.md` (the one-off build prompt). That prompt has been
executed; this document describes what actually exists, the rules that still
govern it, and how to extend it.

---

## What this is

A personal reference website for *theHunter: Call of the Wild* — a companion
site used **while playing**, to look up trophy data, activity windows, and hot
spots per reserve. It is a reference sheet, not a dashboard.

Live: **https://loganlessing.github.io/the-hunter-reserve-registry/**

### Visual identity (ground truth — do not drift)

A "wilderness reserve field register": parchment paper background, pine green +
blaze orange accents, a masthead with a crest, specimen-card layout. It should
feel like a printed field guide or reserve placard, **not** a generic modern
dashboard.

| Role | Font |
|---|---|
| Big headline | Alfa Slab One |
| Species names, numeric values | Zilla Slab |
| Labels, data tags | IBM Plex Mono |
| Body text | Public Sans |

`src/index.css` is the **visual ground truth**. It is a direct port of
`yukon-valley-chart.html` — the original self-contained HTML/CSS/JS reference
that every design decision was iterated on directly with the owner. That file
was deleted in commit `5af5604` once the port was complete; if the original
styling ever needs to be consulted, recover it with:

```sh
git show 5af5604^:docs/yukon-valley-chart.html
```

### Non-negotiable interaction details

Carried over from the original spec — these were tuned deliberately:

- Level ladder color tiers: green (normal spawn) → silver and gold (the two
  levels below max) → diamond-blue (Diamond level) → orange (Level 10 Fabled,
  Great One species only).
- The Bronze `<` prefix on the medal score row (open lower bound).
- Hazard-stripe warning boxes on aggressive animals.
- The Great One banner on Great One species' cards.
- The page scrolls normally. **No fixed-position / non-scrolling app shell.**
- Never add nav entries for reserves that don't exist yet.

---

## Data policy (non-negotiable)

**Accuracy is the entire point of this project.** All reserve data is verified
against the theHunter COTW Wiki, the thehuntercotw structured stat sheets, and
cross-referenced community reports.

1. **Never invent game data.** If a stat can't be verified, flag it — don't
   guess. Plausible-looking wrong numbers are worse than a visible gap, because
   the site is used mid-hunt to decide whether to take a shot.
2. **The owner supplies verified data.** Don't research or recall reserve stats
   from memory. The workflow is: owner writes a roster doc in `docs/` → that
   gets transcribed into a typed data file.
3. **Flag community estimates as such** in `footerNotes` rather than presenting
   them as hard numbers (e.g. Great One spawn odds are unofficial, roughly
   0.05–0.6% per eligible animal).
4. Weights represent the upper, trophy-relevant portion of the distribution —
   not newborn/runt minimums. Where no verified minimum is published, write
   "up to X" rather than invent a range.

---

## Stack & architecture

React 19 + Vite + TypeScript, `react-router-dom` with **hash routing** (so
GitHub Pages needs no 404 rewrite tricks). No UI framework.

```
CLAUDE.md                      Auto-loaded session entry point — points here
.github/workflows/deploy.yml   CI: build + publish to GitHub Pages
docs/                          Reference material & verified rosters
  project-handoff.md           ← this file
  yukon-valley-roster.md       Verified roster, Yukon Valley
  silver-ridge-peaks-roster.md Verified roster, Silver Ridge Peaks
  hirschfelden-roster.md       Verified roster, Hirschfelden
  layton-lake-roster.md        Verified roster, Layton Lake District
src/
  App.tsx  main.tsx  index.css  vite-env.d.ts
  components/                  One shared set, renders ANY reserve
    Masthead.tsx  ReserveNav.tsx  ReservePage.tsx
    SpeciesCard.tsx  LevelLadder.tsx  MedalRow.tsx  ActivityClock.tsx
  hooks/
    useReveal.ts               Scroll-reveal IntersectionObserver (fails open)
  data/
    types.ts                   Reserve / Species / ReserveTheme
    reserves/
      index.ts                 The registry — nav & routes derive from this
      yukon-valley.ts
      silver-ridge-peaks.ts
      hirschfelden.ts
      layton-lake-district.ts
```

**The core architectural rule:** adding a reserve is *adding a data file*, never
writing new components. One shared component set renders every reserve.

### Motion layer

Deliberately restrained — a placard lifting off a board, not dashboard flair:

- **Hover lift:** cards rise 5px with a deepening shadow (`.card:hover` in
  `index.css`); the corner rivets catch more light as they lift.
- **Scroll reveal:** cards fade/rise into place on first viewport entry,
  staggered ~45ms across a row (capped at 5 steps via `--i`). Driven by
  `useReveal`, which **fails open**: elements already in or above the viewport,
  browsers without IntersectionObserver, and reduced-motion users are revealed
  immediately. The sheet is read mid-hunt — motion must never hide data.
- The reveal animation uses `backwards` fill (holds the from-state through the
  stagger delay — without it delayed cards flash) and deliberately omits
  `forwards` (a held end-state would override the `:hover` transform).
- Everything is disabled under `prefers-reduced-motion: reduce`.

### Data model (`src/data/types.ts`)

```ts
Reserve  { id, name, dept, subline, permit{lines,code}, facts[], sectionNote,
           species[], footerNotes[], theme }
Species  { name, latin, cls, trophy, maxLevel, diamondLevel, weight, greatOne,
           medals{bronze,silver,gold,diamond}, zones[], hotSpots, bring,
           coats{common, rare?}, warning? }
ActivityZone = [startHour, endHour, 'feed' | 'drink' | 'rest']   // end exclusive
```

Notes on fields that are easy to get wrong:
- `medals` values are **strings**, not numbers.
- `greatOne: true` is what renders the Fabled Lv 10 ladder cell and the banner.
  A species can reach Level 9 and still have no Great One (Yukon's Grizzly,
  Silver Ridge's Mountain Lion).
- `coats.rare` and `warning` are optional — omit them, don't pass empty strings.
- Text after ` · ` in `trophy` is dropped in the compact stat strip.

### Theming

Per-reserve, data-driven, 18 tokens on `theme`. Derived shades are computed with
`color-mix`, so only base colors are needed:

`paper` `paper2` `card` `well` · `primary` `primary2` · `ink` `soft` `faint`
`line` · `accent` · `feed` `drink` `rest` · `bronze` `silver` `gold` `diamond`

Each reserve gets a palette suited to its biome while keeping identical
structure, fonts, and component behavior. Activity and medal colors are kept
consistent across reserves; the paper/primary/accent family is what varies.

| Reserve | Paper | Primary | Accent |
|---|---|---|---|
| Yukon Valley | parchment `#f1ead9` | pine green `#1d3a2d` | blaze orange `#d95f18` |
| Silver Ridge Peaks | pale stone `#ece6d8` | granite slate `#37444e` | rust `#b1462b` |
| Hirschfelden | warm parchment `#ece4d2` | beech brown `#3d3527` | harvest gold `#c1802a` |
| Layton Lake District | cool mist `#e9e7dd` | spruce teal `#204a45` | larch amber `#cf7d2e` |

---

## Adding a new reserve

The whole job is **transcription**, not authoring. The roster doc is the source
of truth; the data file is a faithful retyping of it into the `Reserve` shape.
Never add a stat that isn't in the roster.

### Step 1 — The roster doc (owner writes this)

`docs/<reserve>-roster.md`, following `silver-ridge-peaks-roster.md`. It needs:

- **Reserve meta** — name, setting, area, warden, species count, Great Ones,
  reserve weapon.
- **Species register**, class order low → high. Per species: class, trophy type,
  max level, Diamond level, weight, the four medal scores, 24 h activity
  windows, hot spots, bring (ammo class + callers), coats (common + rare), and a
  ⚠ hazard line for aggressive animals.
- **Great Ones** — which species, plus Fabled coats / grind notes if known.
- **Accuracy notes** — sources, and anything that's a community estimate.

### Step 2 — Transcribe into `src/data/reserves/<reserve>.ts`

Copy `silver-ridge-peaks.ts` as the skeleton. The roster's shorthand does **not**
match the TypeScript field names — this mapping is where mistakes happen:

| Roster writes | Data file field | Watch for |
|---|---|---|
| `Class 5` | `cls: 5` | |
| `Trophy: Horns (TruRACS)` | `trophy: 'Horns · TruRACS'` | Use ` · `, not parens. Text after ` · ` is dropped in the compact stat strip. |
| `Max level 5` | `maxLevel: 5` | |
| `(Diamond at Lv 5)` | `diamondLevel: 5` | Usually equals `maxLevel`, but not always — read it, don't assume. |
| `Weight: up to 65 kg` | `weight: 'up to 65 kg'` | Verbatim string. Keep "up to" if the roster has no verified minimum. |
| `★ GREAT ONE` | `greatOne: true` | Drives the Fabled Lv 10 cell **and** the card banner. |
| `Bronze <46.09 · Silver 46.09 · Gold 75.77 · Diamond 98.02` | `medals: { bronze: '46.09', silver: '46.09', gold: '75.77', diamond: '98.02' }` | **Strings, not numbers.** `bronze` repeats `silver`'s value — the `<` is rendered by the UI, never stored. |
| `Activity: Rest 00–04 · Feed 04–11 …` | `zones: [[0,4,'rest'],[4,11,'feed'], …]` | See conversion rules below. |
| `Hot spots: …` | `hotSpots: '…'` | |
| `Bring: …` | `bring: '…'` | |
| `Coats: A, B · rare: C, D` | `coats: { common: 'A, B', rare: 'C, D (rare)' }` | **Omit `rare` entirely** if the roster lists none (e.g. Black Bear). Don't pass `''`. |
| `⚠ Hazard: …` | `warning: '…'` | Omit entirely when there's no hazard line. |

**Converting activity windows.** Each `[start, end, activity]` uses 24 h clock
numbers with an **exclusive end**. The blocks must tile `0 → 24` with no gaps and
no overlaps, and the last block ends at `24` — never `0`:

```
Rest 00–04 · Feed 04–11 · Rest 11–14 · Feed 14–20 · Rest 20–00
→ [[0,4,'rest'], [4,11,'feed'], [11,14,'rest'], [14,20,'feed'], [20,24,'rest']]
```

Activity is only `'feed' | 'drink' | 'rest'`. Keep species in class order.

**Reserve-level fields:**

```ts
id: 'silver-ridge-peaks',            // URL slug, kebab-case; becomes #/reserves/<id>
name: 'Silver Ridge Peaks',
dept: 'Reserve Field Register · Southern Rocky Mountains, Colorado',
subline: 'Species register — level ladder, medal scores, activity clocks & the Great One grind',
permit: { lines: ['Field', 'Register'], code: 'SRP-26' },   // code = initials + year
sectionNote: 'class order · low → high',
facts: [ Area, Warden, Species count, Great Ones, reserve weapon ],
```

In `facts`, the Great Ones entry takes `highlight: true` so it renders in the
accent color. Label the weapon for what it is — Yukon has a `Reserve rifle`,
Silver Ridge a `Reserve bow`.

`footerNotes` carries four things: the standard medal-tier explanation (copy it
verbatim between reserves), the weight/Great-One-odds caveat, any
reserve-specific honest flags, and the sources line. This is where community
estimates get labelled — see the Data policy above.

### Step 3 — Theme

Fill all 18 tokens. Vary the `paper` / `primary` / `accent` family to suit the
biome; keep `feed` `drink` `rest` and the four medal colors identical across
reserves so the clocks and score rows stay readable as one system. Derive the
supporting shades (`paper2` `card` `well` `primary2` `ink` `soft` `faint`
`line`) from the base colors rather than picking them independently.

### Step 4 — Register it

```ts
// src/data/reserves/index.ts
import newReserve from './new-reserve'
export const reserves: Reserve[] = [yukonValley, silverRidgePeaks, newReserve]
```

Nav entry, route, and theming all follow automatically. Nothing else to wire.

### Step 5 — Verify

```sh
npm run build      # tsc -b catches every type/shape error above
npm run dev        # then click through the new reserve
```

Check by eye: ladder colors land on the right levels, Great One cards show the
Fabled cell and banner, hazard species show the striped warning box, and the
activity clock has no unfilled wedge (the giveaway for zones that don't tile).

### Pre-commit checklist

- [ ] Every number traceable to the roster — nothing invented
- [ ] Species in class order, low → high
- [ ] `medals` are strings; `bronze` mirrors `silver`
- [ ] `zones` tile 0 → 24, last block ends at `24`
- [ ] `greatOne` set only where the roster says so
- [ ] `rare` / `warning` omitted where absent, not empty
- [ ] All 18 theme tokens present
- [ ] Community estimates flagged in `footerNotes`
- [ ] `npm run build` clean

---

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs
`npm ci && npm run build` and publishes `dist/` to GitHub Pages. The workflow
auto-enables Pages via `configure-pages` and derives the base path from the repo
name, so no config changes are needed.

**Pages Source must be set to "GitHub Actions"** (Settings → Pages), *not*
"Deploy from a branch." This was an early failure: branch mode serves the repo's
files as-is, so it served the raw `index.html` pointing at `/src/main.tsx`,
which a browser can't execute — the site rendered blank. Branch mode would
require committing built `dist/` output into the repo. Actions mode keeps `main`
source-only.

---

## Current state

**Four reserves in the registry**, 35 species total:

| Reserve | Species | Great Ones |
|---|---|---|
| Yukon Valley | 8 | 3 — Moose, Gray Wolf, Red Fox |
| Silver Ridge Peaks | 9 | 2 — Mule Deer, Black Bear |
| Hirschfelden | 9 | 6 — Pheasant, Red Fox, Roe, Boar, Fallow, Red Deer |
| Layton Lake District | 9 | 3 — Whitetail, Black Bear, Moose |

All four are deployed, type-checked by CI, and verified live (owner reviewed
the four-reserve site plus the motion layer and approved the look, Jul 2026).

**Repo hygiene done:** `.gitignore` added and `node_modules/`, `dist/`, and
`*.tsbuildinfo` untracked (~2,770 files had been committed). Reference docs
consolidated into `docs/` — the original handoff had been sitting inside
`node_modules/`, where any reinstall would have silently deleted it.

### Open items

- **Yukon's Great One data is incomplete.** Per–Great One Fabled coat lists and
  herd-management grind notes were never captured in `yukon-valley.ts`. The
  other three rosters carry this data; Yukon's does not. Flagged as
  to-be-added-from-verified-sources rather than filled in from memory.
- **Layton Lake — Whitetail Deer max level 3.** The source sheet lists it as 3
  where the other deer sit at 5, so Diamonds come off level 3. Transcribed as
  given and flagged in `footerNotes`; worth one in-game confirm.
- **Hirschfelden — Red Deer Fabled furs.** Historically Spotted only; a Dec 2025
  remodel may have expanded the set. Flagged rather than guessed.
- **Environment note:** some authoring environments (e.g. the sandboxed
  desktop-app session this was built in) have no Node/npm on PATH, so
  `npm run build` and `npm run dev` fail there. In that case, validate data
  files by script (zone tiling, class order, theme tokens, medal shape) and
  treat the CI build on push as the type-check. On a normal machine:
  `npm install && npm run dev`.

---

## Working agreements

- Don't change code unless asked.
- Verified data only; flag rather than guess (see Data policy above).
- Keep the field-register visual identity and the tuned interaction details.
- Commit/push only when asked.
