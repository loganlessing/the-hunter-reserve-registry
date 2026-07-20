import type { Species } from '../data/types'

function levelClass(i: number, s: Species): string {
  if (i === 10 && s.greatOne) return 'lv fab'
  if (i === s.diamondLevel) return 'lv dia'
  if (i === s.maxLevel - 1) return 'lv gold'
  if (i === s.maxLevel - 2) return 'lv silver'
  if (i <= s.maxLevel) return 'lv on'
  return 'lv'
}

export default function LevelLadder({ species: s }: { species: Species }) {
  const levels = Array.from({ length: 10 }, (_, n) => n + 1)
  return (
    <div>
      <div className="block-h">
        Level ladder <span className="hint">1 – 10</span>
      </div>
      <div className="ladder">
        {levels.map((i) => (
          <div key={i} className={levelClass(i, s)}>
            {i}
          </div>
        ))}
      </div>
      <div className="lvlcap">
        <span>Spawns Lv 1–{s.maxLevel}</span>
        <span className="dtxt">
          ◆ Diamond: Lv {s.diamondLevel}
          {s.diamondLevel > 1 ? ` (rarely ${s.diamondLevel - 1})` : ''}
        </span>
        {s.greatOne && <span className="ftxt">★ Lv 10</span>}
      </div>
    </div>
  )
}
