export type Activity = 'feed' | 'drink' | 'rest'

/** [startHour, endHour, activity] — hours 0–24, end exclusive. */
export type ActivityZone = [number, number, Activity]

export interface Species {
  name: string
  latin: string
  /** Weapon class (1–9). */
  cls: number
  /** e.g. 'Skull', 'Weight', 'Antlers · TruRACS' — text after ' · ' is dropped in the stat strip. */
  trophy: string
  /** Highest normal spawn level. */
  maxLevel: number
  /** Level that yields Diamond. */
  diamondLevel: number
  weight: string
  greatOne: boolean
  medals: { bronze: string; silver: string; gold: string; diamond: string }
  zones: ActivityZone[]
  hotSpots: string
  bring: string
  coats: { common: string; rare?: string }
  /** Hazard note — renders the hazard-stripe warning box. */
  warning?: string
}

export interface ReserveTheme {
  paper: string
  paper2: string
  card: string
  /** Inset panel background (stat strips, unlit ladder cells). */
  well: string
  primary: string
  primary2: string
  ink: string
  soft: string
  faint: string
  line: string
  accent: string
  feed: string
  drink: string
  rest: string
  bronze: string
  silver: string
  gold: string
  diamond: string
}

export interface ReserveFact {
  label: string
  value: string
  /** Renders the value in the accent color (used for the Great Ones fact). */
  highlight?: boolean
}

export interface Reserve {
  /** URL slug, e.g. 'yukon-valley'. */
  id: string
  name: string
  /** Masthead department line, e.g. 'Reserve Field Register · Yukon River Basin, Alaska'. */
  dept: string
  subline: string
  permit: { lines: string[]; code: string }
  facts: ReserveFact[]
  /** Right-hand note on the section label, e.g. 'class order · low → high'. */
  sectionNote: string
  species: Species[]
  footerNotes: string[]
  theme: ReserveTheme
}
