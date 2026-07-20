import type { Reserve } from '../types'
import yukonValley from './yukon-valley'

/**
 * Reserve registry. To add a reserve: create its data file next to this one
 * (copy yukon-valley.ts as a template) and add it to this array. Nav entries,
 * routes, and theming all derive from this list.
 */
export const reserves: Reserve[] = [yukonValley]

export function getReserve(id: string | undefined): Reserve | undefined {
  return reserves.find((r) => r.id === id)
}
