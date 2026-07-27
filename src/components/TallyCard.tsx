import { useEffect, useState, type CSSProperties } from 'react'
import type { Species } from '../data/types'
import useReveal from '../hooks/useReveal'
import { BUCKETS, BUCKET_LABEL, type Bucket, type Counts, total } from '../hooks/useTally'

interface Props {
  species: Species
  counts: Counts
  onBump: (bucket: Bucket, delta: number) => void
  onClear: () => void
  index: number
}

export default function TallyCard({ species: s, counts, onBump, onClear, index }: Props) {
  const ref = useReveal<HTMLElement>()
  const [armed, setArmed] = useState(false)
  const kills = total(counts)

  /* Reset is two-stage — one stray tap mid-hunt shouldn't wipe a long grind. */
  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 4000)
    return () => clearTimeout(t)
  }, [armed])

  return (
    <article
      ref={ref}
      className="card tallycard reveal"
      style={{ '--i': index } as CSSProperties}
    >
      <div className="bar">
        <div className="sp">
          {s.name}
          <small>{s.latin}</small>
        </div>
        <div className="clsbadge">
          kills<b>{kills}</b>
        </div>
      </div>

      <div className="body">
        <div className="tallygrid">
          {BUCKETS.map((b) => (
            <div key={b} className={'tb tb-' + b}>
              <div className="l">{BUCKET_LABEL[b]}</div>
              <div className="v">{counts[b]}</div>
              <div className="tbtns">
                <button
                  type="button"
                  className="tbtn"
                  onClick={() => onBump(b, -1)}
                  disabled={counts[b] === 0}
                  aria-label={`Remove one ${BUCKET_LABEL[b]} ${s.name}`}
                >
                  –
                </button>
                <button
                  type="button"
                  className="tbtn plus"
                  onClick={() => onBump(b, 1)}
                  aria-label={`Add one ${BUCKET_LABEL[b]} ${s.name}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="tallyfoot">
          <span>
            Fabled Lv 10 · max Lv {s.maxLevel} · class {s.cls}
          </span>
          {kills > 0 && (
            <button
              type="button"
              className={'resetbtn' + (armed ? ' armed' : '')}
              onClick={() => {
                if (armed) {
                  onClear()
                  setArmed(false)
                } else {
                  setArmed(true)
                }
              }}
            >
              {armed ? 'Tap again to clear' : 'Reset'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
