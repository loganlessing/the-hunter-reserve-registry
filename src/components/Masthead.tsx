import type { Reserve } from '../data/types'

function Crest() {
  return (
    <div className="crest" aria-hidden="true">
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M32 8 L20 30 H26 L15 48 H49 L38 30 H44 Z" fill="var(--primary)" fillOpacity="0.12" />
        <path d="M12 52 H52" />
        <path d="M22 52 V57 M42 52 V57" />
      </svg>
    </div>
  )
}

export default function Masthead({ reserve }: { reserve: Reserve }) {
  return (
    <header className="mast">
      <Crest />
      <div className="mtxt">
        <div className="dept">{reserve.dept}</div>
        <h1>{reserve.name}</h1>
        <div className="subline">{reserve.subline}</div>
        <div className="factrow">
          {reserve.facts.map((f) => (
            <span key={f.label} className={f.highlight ? 'go' : undefined}>
              {f.label} <b>{f.value}</b>
            </span>
          ))}
        </div>
      </div>
      <div className="permit">
        {reserve.permit.lines.map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
        <b>{reserve.permit.code}</b>
      </div>
    </header>
  )
}
