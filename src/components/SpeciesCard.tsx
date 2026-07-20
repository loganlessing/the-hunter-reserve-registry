import type { Species } from '../data/types'
import LevelLadder from './LevelLadder'
import MedalRow from './MedalRow'
import ActivityClock from './ActivityClock'

export default function SpeciesCard({ species: s }: { species: Species }) {
  return (
    <article className={'card' + (s.greatOne ? ' great' : '')}>
      <div className="bar">
        <div className="sp">
          {s.name}
          <small>{s.latin}</small>
        </div>
        <div className="clsbadge">
          class<b>{s.cls}</b>
        </div>
      </div>
      <div className="body">
        {s.greatOne && <div className="gobanner">★ Great One species — Fabled Lv 10</div>}
        <div className="stats">
          <div className="st">
            <div className="l">Trophy</div>
            <div className="v">{s.trophy.split(' · ')[0]}</div>
          </div>
          <div className="st">
            <div className="l">Weight</div>
            <div className="v">{s.weight}</div>
          </div>
          <div className="st">
            <div className="l">Max level</div>
            <div className="v">
              {s.maxLevel}
              {s.greatOne ? ' (+10)' : ''}
            </div>
          </div>
        </div>
        <LevelLadder species={s} />
        <MedalRow species={s} />
        <ActivityClock zones={s.zones} />
        <div className="rows">
          <div className="row">
            <div className="k">Hot spots</div>
            <div className="v">{s.hotSpots}</div>
          </div>
          <div className="row">
            <div className="k">Bring</div>
            <div className="v">{s.bring}</div>
          </div>
          <div className="row">
            <div className="k">Coats</div>
            <div className="v">
              {s.coats.common}
              {s.coats.rare && (
                <>
                  {' · '}
                  <span className="rare">{s.coats.rare}</span>
                </>
              )}
            </div>
          </div>
        </div>
        {s.warning && <div className="warn">{s.warning}</div>}
      </div>
    </article>
  )
}
