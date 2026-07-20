import type { Activity, ActivityZone } from '../data/types'

function hourType(zones: ActivityZone[], h: number): Activity {
  for (const z of zones) {
    if (h >= z[0] && h < z[1]) return z[2]
  }
  return 'rest'
}

function windows(zones: ActivityZone[], type: Activity): string {
  return zones
    .filter((z) => z[2] === type)
    .map(
      (z) =>
        `${String(z[0]).padStart(2, '0')}:00–${String(z[1] === 24 ? 0 : z[1]).padStart(2, '0')}:00`,
    )
    .join(', ')
}

export default function ActivityClock({ zones }: { zones: ActivityZone[] }) {
  const feed = windows(zones, 'feed')
  const drink = windows(zones, 'drink')
  const rest = windows(zones, 'rest')
  return (
    <div>
      <div className="block-h">Activity · 24h</div>
      <div className="clock">
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} className={`hr ${hourType(zones, h)}`} />
        ))}
      </div>
      <div className="ruler">
        <span>0</span>
        <span>6</span>
        <span>12</span>
        <span>18</span>
        <span>24</span>
      </div>
      <div className="wins">
        <div className="wf">
          <b>Feed</b>
          {feed || '—'}
        </div>
        {drink && (
          <div className="wd">
            <b>Drink</b>
            {drink}
          </div>
        )}
        <div className="wr">
          <b>Rest</b>
          {rest || '—'}
        </div>
      </div>
    </div>
  )
}
