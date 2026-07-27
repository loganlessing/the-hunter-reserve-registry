import { Navigate, useParams } from 'react-router-dom'
import { getReserve, reserves } from '../data/reserves'
import { themeVars } from '../theme'
import ReserveNav from './ReserveNav'
import Masthead from './Masthead'
import SpeciesCard from './SpeciesCard'

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
          {reserve.species.map((s, i) => (
            <SpeciesCard key={s.name} species={s} index={i} />
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
