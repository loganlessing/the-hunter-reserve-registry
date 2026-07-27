import { reserves } from '../data/reserves'
import type { Species } from '../data/types'
import { themeVars } from '../theme'
import useTally, { emptyCounts, tallyKey, total, type Counts } from '../hooks/useTally'
import ReserveNav from './ReserveNav'
import TallyCard from './TallyCard'

interface Grind {
  species: Species
  /** Every reserve this animal appears on — one shared tally covers them all. */
  reserves: string[]
}

/**
 * One entry per Great One animal, not per reserve: a Red Fox is a Red Fox
 * whether it dropped on Yukon or Hirschfelden. Class order matches the species
 * register's low → high convention.
 */
const grinds: Grind[] = (() => {
  const byName = new Map<string, Grind>()
  for (const r of reserves) {
    for (const s of r.species) {
      if (!s.greatOne) continue
      const found = byName.get(s.name)
      if (found) found.reserves.push(r.name)
      else byName.set(s.name, { species: s, reserves: [r.name] })
    }
  }
  return [...byName.values()].sort(
    (a, b) => a.species.cls - b.species.cls || a.species.name.localeCompare(b.species.name),
  )
})()

export default function TallyPage() {
  const { counts, bump, clear, ready } = useTally()

  const grand = grinds.reduce<Counts>((acc, g) => {
    const c = counts(tallyKey(g.species.name))
    acc.diamond += c.diamond
    acc.gold += c.gold
    acc.lesser += c.lesser
    return acc
  }, emptyCounts())

  return (
    /* Spans every reserve, so it wears the first reserve's palette — the
       pine/blaze template the register is built on. */
    <div className="app" style={themeVars(reserves[0].theme)}>
      <div className="board">
        <ReserveNav />

        <div className="mast">
          <div className="crest" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
              <path
                d="M32 8 L32 20 M32 20 L22 14 M32 20 L42 14 M20 30 h24 M18 40 h28 M24 52 h16"
                strokeLinecap="round"
              />
              <circle cx="32" cy="32" r="24" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="mtxt">
            <div className="dept">Reserve Field Register · Trophy Room</div>
            <h1>Great One Tally</h1>
            <div className="subline">
              Kill counter — log every animal taken toward a Great One
            </div>
            <div className="factrow">
              <span>
                Animals tracked <b>{grinds.length}</b>
              </span>
              <span>
                Total kills <b>{total(grand)}</b>
              </span>
              <span className="go">
                Diamonds <b>{grand.diamond}</b>
              </span>
            </div>
          </div>
          <div className="permit">
            Tally
            <b>{total(grand)}</b>
          </div>
        </div>

        <div className="sectlabel">
          Running Totals <span>all animals</span>
        </div>
        <div className="grandrow">
          <div className="gr gr-dm">
            <div className="l">Diamond</div>
            <div className="v">{grand.diamond}</div>
          </div>
          <div className="gr gr-gd">
            <div className="l">Gold</div>
            <div className="v">{grand.gold}</div>
          </div>
          <div className="gr gr-sv">
            <div className="l">Silver or less</div>
            <div className="v">{grand.lesser}</div>
          </div>
          <div className="gr gr-tt">
            <div className="l">Total kills</div>
            <div className="v">{total(grand)}</div>
          </div>
        </div>

        <div className="sectlabel">
          Great One Species <span>class order · low → high</span>
        </div>
        <main className="grid tallylist">
          {grinds.map((g, i) => {
            const key = tallyKey(g.species.name)
            return (
              <TallyCard
                key={key}
                species={g.species}
                reserves={g.reserves}
                index={i}
                counts={counts(key)}
                onBump={(bucket, delta) => bump(key, bucket, delta)}
                onClear={() => clear(key)}
              />
            )
          })}
        </main>

        <footer>
          One tally per animal, pooled across every reserve it appears on — a Red
          Fox counts the same whether it dropped on Yukon Valley or Hirschfelden.
          <br />
          Buckets follow the medal the animal scored: Diamond, Gold, and everything
          below Gold pooled as Silver or less. Use – to undo a misclick.
          <br />
          Counts are saved in this browser only (localStorage) — they are not synced
          between devices, and clearing site data clears the tally. If storage is
          blocked, the counter still works for the current session.
          {!ready && <> <br />Loading saved tally…</>}
        </footer>
      </div>
    </div>
  )
}
