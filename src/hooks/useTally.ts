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

/** Keyed `<reserveId>::<species name>` — the same species on two reserves is
 *  two separate grinds, so they tally independently. */
export type TallyState = Record<string, Counts>

const KEY = 'cotw-great-one-tally-v1'

export function tallyKey(reserveId: string, species: string) {
  return `${reserveId}::${species}`
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
function load(): TallyState {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}

    const out: TallyState = {}
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (!v || typeof v !== 'object') continue
      const c = v as Record<string, unknown>
      out[k] = { diamond: num(c.diamond), gold: num(c.gold), lesser: num(c.lesser) }
    }
    return out
  } catch {
    return {}
  }
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
