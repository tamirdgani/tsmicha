/* Small helpers every question style uses: seeded randomness and step builders. */

import type { L, Skill, Spec } from '../course'
import type { MatchStep, OrderStep, PickStep, Show, SortStep, Step, TapAllStep, Tile } from '../lessonTypes'
import type { Pic } from '../kdata'

export type R = () => number
export function rng(seed: string): R {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19) }
  let a = h >>> 0
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
export const int = (r: R, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))
export const one = <T,>(r: R, a: readonly T[]) => a[Math.floor(r() * a.length)]
export const mix = <T,>(r: R, a: readonly T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
export const some = <T,>(r: R, a: readonly T[], n: number) => mix(r, a).slice(0, n)
export const range = (lo: number, hi: number) => Array.from({ length: Math.max(0, hi - lo + 1) }, (_, i) => lo + i)

export const he = (s: string): L => ({ he: s, en: s })
export const nice = (w: string) => w.replaceAll('־', ' ')
export const picTile = (p: Pic): Tile => ({ e: p.e, t: nice(p.w) })
export const tileKey = (t: Tile) => JSON.stringify(t)

/** Shuffles the right answer in among the others and remembers where it landed. */
export function choices(r: R, right: Tile, others: Tile[]) {
  // never two cards that look the same, and never a "wrong" card identical to the right one
  const seen = new Set([tileKey(right)])
  const uniq = others.filter((t) => { const k = tileKey(t); if (seen.has(k)) return false; seen.add(k); return true })
  const all = mix(r, [right, ...uniq])
  return { options: all, correct: all.indexOf(right) }
}
/** Numbers near n (never n itself), inside lo…hi. */
export function near(r: R, n: number, count: number, hi: number, lo = 0) {
  const pool = [n - 2, n - 1, n + 1, n + 2, n + 3, n - 3].filter((x) => x >= lo && x <= hi && x !== n)
  return some(r, [...new Set(pool)], count)
}

/* ───────── step builders ───────── */

export function pick(r: R, q: string, right: Tile, others: Tile[], why: string, show?: Show): PickStep {
  const { options, correct } = choices(r, right, others)
  return { kind: 'pick', q: he(q), show, options, correct, why: he(why) }
}
/** Odd one out: three copies of the same card and one different card (here repeats are the point). */
export function pickOdd(r: R, q: string, odd: Tile, same: Tile, why: string): PickStep {
  const all = mix(r, [odd, same, { ...same }, { ...same }])
  return { kind: 'pick', q: he(q), options: all, correct: all.indexOf(odd), why: he(why) }
}
export function tapall(r: R, q: string, rights: Tile[], wrongs: Tile[], why: string, show?: Show): TapAllStep {
  const rk = new Set(rights.map(tileKey))
  const seenW = new Set<string>()
  const ws = wrongs.filter((t) => { const k = tileKey(t); if (rk.has(k) || seenW.has(k)) return false; seenW.add(k); return true })
  const all = mix(r, [...rights.map((t) => ({ t, ok: true })), ...ws.map((t) => ({ t, ok: false }))])
  return { kind: 'tapall', q: he(q), show, options: all.map((x) => x.t), right: all.flatMap((x, i) => (x.ok ? [i] : [])), why: he(why) }
}
export const order = (q: string, items: Tile[], why: string): OrderStep => ({ kind: 'order', q: he(q), items, why: he(why) })
export const match = (q: string, pairs: [Tile, Tile][], why: string): MatchStep => ({ kind: 'match', q: he(q), pairs, why: he(why) })
export function sort(prompt: string, buckets: string[], items: { e: string; w: string; b: number }[], why: string): SortStep {
  return { kind: 'sort', prompt: he(prompt), buckets: buckets.map(he), items: items.map((x) => ({ text: he(`${x.e} ${nice(x.w)}`), bucket: x.b })), why: he(why) }
}
export const YES: Tile = { e: '✅', t: 'נכון' }
export const NO: Tile = { e: '❌', t: 'לא נכון' }

/* ───────── question styles ─────────
   A style is one kind of question ("which shadow is whose?", "tap all the red things"…).
   `make` returns the question with a key naming what it asks; a key is never asked twice in the whole year. */

/** e: easy · h: harder, with tempting wrong answers · t: a thinking question */
export type Lv = 'e' | 'h' | 't'
export type Topic = Skill | 'riddle'
export type Made = [key: string, step: Step] | null
export type Style = { id: string; name: string; skills: Topic[]; lv: Lv; make: (sp: Spec, r: R) => Made }
export const style = (id: string, name: string, skills: Topic[], lv: Lv, make: Style['make']): Style => ({ id, name, skills, lv, make })

/** What the child experiences as "the same question": the same words, the same picture and the same answer.
    Two questions with this signature never both appear in a year, whatever their wrong answers are. */
export function signature(s: Step): string {
  const q = 'q' in s ? s.q.he : 'prompt' in s ? s.prompt.he : ''
  const body = s.kind === 'pick' ? [s.show, s.options[s.correct]] : s.kind === 'tapall' ? [s.show, s.right.map((i) => s.options[i])]
    : s.kind === 'order' ? s.items : s.kind === 'match' ? s.pairs : s.kind === 'sort' ? s.items : s.kind === 'build' ? s.w : ''
  return q + JSON.stringify(body)
}
