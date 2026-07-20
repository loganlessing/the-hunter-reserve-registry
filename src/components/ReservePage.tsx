import type { CSSProperties } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { getReserve, reserves } from '../data/reserves'
import type { ReserveTheme } from '../data/types'
import ReserveNav from './ReserveNav'
import Masthead from './Masthead'
import SpeciesCard from './SpeciesCard'

function themeVars(t: ReserveTheme): CSSProperties {
  return {
    '--paper': t.paper,
    '--paper2': t.paper2,
    '--card': t.card,
    '--well': t.well,
    '--primary': t.primary,
    '--primary2': t.primary2,
    '--ink': t.ink,
    '--soft': t.soft,
    '--faint': t.faint,
    '--line': t.line,
    '--accent': t.accent,
    '--feed': t.feed,
    '--drink': t.drink,
    '--rest': t.rest,
    '--bronze': t.bronze,
    '--silver': t.silver,
    '--gold': t.gold,
    '--diamond': t.diamond,
  } as CSSProperties
}

export default function ReservePage() {
  const { reserveId } = useParams()
  const reserve = getReserve(reserveId)
  if (!reserve) return <Navigate to={`/reserves/${reserves[0].id}`} replace />

  return (
    <div className="app" style={themeVars(reserve.theme)}>
      <div className="board">
        <ReserveNav />
        <Masthead reserve={reserve} />
        <div className="sectlabel">
          Species Register <span>{reserve.sectionNote}</span>
        </div>
        <main className="grid">
          {reserve.species.map((s) => (
            <SpeciesCard key={s.name} species={s} />
          ))}
        </main>
        <footer>
          {reserve.footerNotes.map((note, i) => (
            <span key={i}>
              {note}
              <br />
            </span>
          ))}
        </footer>
      </div>
    </div>
  )
}
