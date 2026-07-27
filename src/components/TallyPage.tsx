import { reserves } from '../data/reserves'
import { themeVars } from '../theme'
import useTally, { emptyCounts, tallyKey, total, type Counts } from '../hooks/useTally'
import ReserveNav from './ReserveNav'
import TallyCard from './TallyCard'

/** Every Great One grind in the registry, grouped by reserve. */
const groups = reserves
  .map((r) => ({ reserve: r, species: r.species.filter((s) => s.greatOne) }))
  .filter((g) => g.species.length > 0)

export default function TallyPage() {
  const { counts, bump, clear, ready } = useTally()

  /* The tally spans every reserve, so it uses the first reserve's palette —
     the pine/blaze template the register is built on. */
  const grand = groups.reduce<Counts>((acc, g) => {
    for (const s of g.species) {
      const c = counts(tallyKey(g.reserve.id, s.name))
      acc.diamond += c.diamond
      acc.gold += c.gold
      acc.lesser += c.lesser
    }
    return acc
  }, emptyCounts())

  return (
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
                Grinds tracked <b>{groups.reduce((n, g) => n + g.species.length, 0)}</b>
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
          Running Totals <span>all reserves</span>
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

        {groups.map((g) => (
          <section key={g.reserve.id}>
            <div className="sectlabel">
              {g.reserve.name}{' '}
              <span>
                {g.species.length} great one{g.species.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid">
              {g.species.map((s, i) => {
                const key = tallyKey(g.reserve.id, s.name)
                return (
                  <TallyCard
                    key={key}
                    species={s}
                    index={i}
                    counts={counts(key)}
                    onBump={(bucket, delta) => bump(key, bucket, delta)}
                    onClear={() => clear(key)}
                  />
                )
              })}
            </div>
          </section>
        ))}

        <footer>
          Counts are saved in this browser only (localStorage) — they are not synced
          between devices, and clearing site data clears the tally. If storage is
          blocked, the counter still works for the current session.
          <br />
          Buckets follow the medal the animal scored: Diamond, Gold, and everything
          below Gold pooled as Silver or less. Use – to undo a misclick.
          {!ready && <> <br />Loading saved tally…</>}
        </footer>
      </div>
    </div>
  )
}
