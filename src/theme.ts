import type { CSSProperties } from 'react'
import type { ReserveTheme } from './data/types'

/**
 * Maps a reserve's palette onto the CSS custom properties `index.css` reads.
 * Every page that renders `.app` needs these set, so this lives outside the
 * reserve page — the tally tab uses it too.
 */
export function themeVars(t: ReserveTheme): CSSProperties {
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
