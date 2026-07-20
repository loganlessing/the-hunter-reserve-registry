# Claude Code Prompt — theHunter: Call of the Wild Reserve Reference Site

## 🎭 Role
You're building a personal reference website for *theHunter: Call of the Wild* — a companion site the user will use while actually playing the game, to look up trophy data, activity windows, and hot spots per reserve.

## 📌 Context
- Attached is `yukon-valley-chart.html` — a **single self-contained HTML/CSS/JS file** that is the *exact visual and structural reference* for how the Yukon Valley reserve page should look and behave. Every design decision in it (fonts, colors, card layout, the level ladder, the medal score row, the activity clock, hot spots, warnings) was iterated on directly with the user and is final — treat it as ground truth, not a rough draft.
- The user owns Silver Ridge Peaks and is considering other reserves next. This site is meant to grow: **Yukon Valley is the first reserve; more will be added by the user over time** (Silver Ridge Peaks next, others later).
- The visual language is a "wilderness reserve field register" aesthetic: parchment/paper background, pine green + blaze orange accents, a masthead with a crest, IBM Plex Mono for labels/data-tags, Zilla Slab for species names and numeric values, Alfa Slab One for the big headline, Public Sans for body text.
- Per-animal data in the reference file includes: class, trophy type, weight range (min–max kg), a 1–10 level ladder (color-coded: green = normal spawn range, silver/gold = the two levels below max, blue = Diamond level, orange = Level 10 Fabled for Great One species), Bronze/Silver/Gold/Diamond score thresholds, a 24-hour activity clock (feed/drink/rest, color-coded), hot spots (in-game locations), recommended gear/ammo class, coat/fur variants, and hazard warnings for aggressive animals.
- **Accuracy is non-negotiable.** All data in the reference file was verified against theHunter COTW Wiki, community stat sheets, and cross-referenced player reports — no guesswork. When you (Claude Code) add future reserves, hold them to the same standard: verified data only, and flag anything that's a community estimate rather than a hard number (this file already does that in its footer for Great One spawn odds, for example).

## 🎯 Task
1. Set up a **React + Vite** project in the user's existing GitHub repo (they'll provide repo details/access separately — don't invent a repo name).
2. Build a **single-page site with client-side routing**: a persistent header/masthead with a nav bar listing reserves by name. Clicking a reserve name loads that reserve's reference sheet below/in place. The page should scroll normally (not a fixed-height app shell) — this is a reference sheet, not a dashboard.
3. **First and only reserve for this pass: Yukon Valley.** Reproduce `yukon-valley-chart.html` as closely as possible — same layout, same data fields, same fonts, same color-coded level ladder and medal scores, same activity clocks, same card structure — but rebuilt as proper React components (not a copy-pasted HTML blob) so it can serve as the reusable template for future reserves.
4. Architect the data layer so adding a new reserve later is just **adding a new data file** (e.g. `src/data/reserves/yukon-valley.json` or `.ts`), not writing new components. One shared set of components (species card, level ladder, medal row, activity clock, masthead) should render any reserve's data.
5. Build in a **per-reserve theme layer** from the start: each reserve gets its own color palette suited to its biome/setting (Yukon's cool pine-green/frost-blue/blaze-orange is the template; a desert or tropical reserve would get warm sand/terracotta tones, etc.) while keeping the same structural layout, fonts, and component behavior. Theme should be data-driven (e.g. a `theme` object per reserve: primary, accent, paper, ink colors) so it's trivial to add a new palette per reserve.
6. Set up **GitHub Pages deployment** (GitHub Actions workflow is fine) for whatever repo the user points you to.

## ⚠️ Constraints
- Don't add reserve tabs/nav entries for reserves that don't exist yet — only "Yukon Valley" should appear in the nav for now.
- Don't invent game data. If you need a stat that isn't in the reference file and can't verify it, flag it rather than guess.
- Keep the field-register/specimen-card visual identity — this is not a generic modern dashboard; it should feel like a printed field guide/reserve placard.
- No fixed-position/non-scrolling app shell — the page should scroll like a normal website.
- Preserve the specific interaction details already tuned in the reference file: the level ladder's color tiers (green/silver/gold/diamond-blue/fabled-orange), the Bronze `<` prefix on the score row, the hazard-stripe warning boxes on aggressive animals, the Great One banner on the three Great One species' cards.

## 📄 Output Format
This is a coding task — work directly in the repo. Set up the project, build the Yukon Valley page as the working first reserve, wire up GitHub Pages deployment, and confirm it builds and deploys successfully. Summarize what you built and how to add the next reserve (Silver Ridge Peaks) once you're done, but don't build Silver Ridge Peaks yet — the user will provide that data when ready.

---

## Clean Copy-Paste Version

```
I'm building a personal reference website for theHunter: Call of the Wild — a companion site I'll use while playing, to look up trophy data, activity windows, and hot spots per reserve.

Attached is yukon-valley-chart.html — a self-contained HTML/CSS/JS file that is the EXACT visual and structural reference for how the Yukon Valley reserve page should look and behave. Every design decision in it (fonts, colors, card layout, the level ladder, the medal score row, the activity clock, hot spots, warnings) was finalized through direct iteration and is final — treat it as ground truth.

I own Silver Ridge Peaks and will add more reserves over time. Yukon Valley is the first; I'll expand the site with more reserves myself later.

The visual language is a "wilderness reserve field register" aesthetic: parchment background, pine green + blaze orange accents, a masthead with a crest, IBM Plex Mono for labels/data tags, Zilla Slab for species names and numeric values, Alfa Slab One for the headline, Public Sans for body text.

Per-animal data includes: class, trophy type, weight range (min–max kg), a 1–10 level ladder (color-coded: green = normal spawn range, silver/gold = the two levels below max, blue = Diamond level, orange = Level 10 Fabled for Great One species), Bronze/Silver/Gold/Diamond score thresholds, a 24-hour activity clock (feed/drink/rest, color-coded), hot spots, recommended gear/ammo class, coat/fur variants, and hazard warnings for aggressive animals.

Accuracy is non-negotiable. All data in the reference file was verified — no guesswork. Hold any future data you add to the same standard, and flag community estimates as such (the file already does this for Great One spawn odds).

Please:
1. Set up a React + Vite project in my existing GitHub repo (I'll give you the repo details).
2. Build a single-page site with client-side routing: a persistent header/masthead with a nav bar listing reserves by name — clicking a reserve loads its reference sheet. The page should scroll normally, not be a fixed-height app shell.
3. For this pass, build ONLY Yukon Valley — reproduce yukon-valley-chart.html as closely as possible, but as proper reusable React components (not a copy-pasted HTML blob), since this becomes the template for future reserves.
4. Architect the data layer so adding a new reserve later means adding a new data file, not new components — one shared set of components (species card, level ladder, medal row, activity clock, masthead) renders any reserve's data.
5. Build in a per-reserve theme layer from the start: each reserve gets its own color palette suited to its biome (Yukon's cool pine-green/frost-blue/blaze-orange is the template), same structural layout and fonts. Theme should be data-driven so adding a palette per reserve is trivial.
6. Set up GitHub Pages deployment (GitHub Actions is fine).

Constraints:
- Don't add nav entries for reserves that don't exist yet — only Yukon Valley for now.
- Don't invent game data — flag anything you can't verify instead of guessing.
- Keep the field-register/specimen-card visual identity, not a generic dashboard.
- No fixed-position app shell — normal scrolling page.
- Preserve the tuned interaction details: level ladder color tiers, the Bronze "<" prefix on the score row, hazard-stripe warning boxes on aggressive animals, the Great One banner on Great One species' cards.

Work directly in the repo, confirm the build and deploy succeed, and summarize what you built plus how I'd add the next reserve (Silver Ridge Peaks) when I'm ready to give you that data.
```

---

## Usage Notes

- **Recommended model:** Claude Code with Sonnet 4.6 (or newer) — this is a scoped, well-specified build task rather than deep architectural reasoning, so it doesn't need Opus, but keep extended thinking on for the data-layer/theming architecture decisions.
- **Recommended tools:** Give Claude Code repo/filesystem access and let it use its own judgment on file structure; attach `yukon-valley-chart.html` directly in the same message as this prompt.
- **Tip:** When you're ready to add Silver Ridge Peaks, a good follow-up prompt is: *"Here's the verified data for Silver Ridge Peaks — add it as a new reserve using the existing template and give it its own theme palette."* Keep supplying verified data yourself rather than asking Claude Code to research reserve stats — that's how the accuracy bar gets held.
