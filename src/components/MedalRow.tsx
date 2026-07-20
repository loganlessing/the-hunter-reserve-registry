import type { Species } from '../data/types'

export default function MedalRow({ species: s }: { species: Species }) {
  return (
    <div className="medals">
      <div className="mc br">
        <div className="l">Bronze</div>
        <div className="v">&lt;{s.medals.bronze}</div>
      </div>
      <div className="mc sv">
        <div className="l">Silver</div>
        <div className="v">{s.medals.silver}</div>
      </div>
      <div className="mc gd">
        <div className="l">Gold</div>
        <div className="v">{s.medals.gold}</div>
      </div>
      <div className="mc dm">
        <div className="l">Diamond</div>
        <div className="v">{s.medals.diamond}</div>
      </div>
    </div>
  )
}
