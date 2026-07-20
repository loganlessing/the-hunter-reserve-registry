import { NavLink } from 'react-router-dom'
import { reserves } from '../data/reserves'

export default function ReserveNav() {
  return (
    <nav className="rnav" aria-label="Reserves">
      <span className="rnav-label">Reserves</span>
      {reserves.map((r) => (
        <NavLink
          key={r.id}
          to={`/reserves/${r.id}`}
          className={({ isActive }) => 'rnav-link' + (isActive ? ' active' : '')}
        >
          {r.name}
        </NavLink>
      ))}
    </nav>
  )
}
