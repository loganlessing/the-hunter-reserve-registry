import { useCallback, useEffect, useState } from 'react'

/** Trophy buckets tracked per Great One grind. */
export type Bucket = 'diamond' | 'gold' | 'lesser'

export const BUCKETS: Bucket[] = ['diamond', 'gold', 'lesser']

export const BUCKET_LABEL: Record<Bucket, string> = {
  diamond: 'Diamond',
  gold: 'Gold',
  lesser: 'Silver or less',
}

export type Counts = Record<Bucket, number>

/** Keyed by species name — one tally per animal, pooled across every reserve
 *  it appears on. */
export type TallyState = Record<string, Counts>

const KEY = 'cotw-great-one-tally-v2'
/** v1 keyed `<reserveId>::<species>`; counts are summed per species on read. */
const LEGACY_KEY = 'cotw-great-one-tally-v1'

export function tallyKey(species: string) {
  return species
}

export function emptyCounts(): Counts {
  return { diamond: 0, gold: 0, lesser: 0 }
}

export function total(c: Counts) {
  return c.diamond + c.gold + c.lesser
}

/** Reads a non-negative integer, tolerating anything else in stored JSON. */
function num(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0
}

/**
 * Storage is best-effort by design. This is a tool used mid-hunt: a blocked or
 * full localStorage (private windows, quota, embedded webviews) must degrade to
 * an in-memory tally, never a crash or a blank page.
 */
function read(key: string): TallyState | null {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    const out: TallyState = {}
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (!v || typeof v !== 'object') continue
      const c = v as Record<string, unknown>
      out[k] = { diamond: num(c.diamond), gold: num(c.gold), lesser: num(c.lesser) }
    }
    return out
  } catch {
    return null
  }
}

function load(): TallyState {
  const current = read(KEY)
  if (current) return current

  /* First run since the per-reserve split was dropped: fold the old
     `<reserveId>::<species>` entries into one total per species so an
     in-progress grind isn't lost. v1 is left in place — untouched, it makes
     the change reversible. */
  const legacy = read(LEGACY_KEY)
  if (!legacy) return {}

  const out: TallyState = {}
  for (const [k, c] of Object.entries(legacy)) {
    const name = k.includes('::') ? k.slice(k.indexOf('::') + 2) : k
    const acc = out[name] ?? emptyCounts()
    out[name] = {
      diamond: acc.diamond + c.diamond,
      gold: acc.gold + c.gold,
      lesser: acc.lesser + c.lesser,
    }
  }
  return out
}

/**
 * Great One kill tally, persisted to localStorage.
 *
 * `ready` stays false until the first read completes, so the UI can hold off
 * painting zeros over a real saved tally on the first frame.
 */
export default function useTally() {
  const [state, setState] = useState<TallyState>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setState(load())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* Storage unavailable — the tally still works for this session. */
    }
  }, [state, ready])

  const counts = useCallback(
    (key: string): Counts => state[key] ?? emptyCounts(),
    [state],
  )

  /** `delta` of -1 undoes a misclick; counts never go below zero. */
  const bump = useCallback((key: string, bucket: Bucket, delta: number) => {
    setState((prev) => {
      const cur = prev[key] ?? emptyCounts()
      const next = Math.max(0, cur[bucket] + delta)
      if (next === cur[bucket]) return prev
      return { ...prev, [key]: { ...cur, [bucket]: next } }
    })
  }, [])

  const clear = useCallback((key: string) => {
    setState((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  return { counts, bump, clear, ready }
}
