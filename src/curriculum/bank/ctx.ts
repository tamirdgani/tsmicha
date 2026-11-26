/* The world the year is being built in, for question styles that tell their stories with the child's cast. */
import { art, type Kit } from '../../worlds/kits'
import { KIDS } from '../kdata'
import { one, type R } from './util'

let KIT: Kit | undefined
export const setKitCtx = (k: Kit | undefined) => { KIT = k }
export const kitCtx = () => KIT

/** Someone to star in a story: one of the world's characters, or a child. `e` is their picture, if any. */
export type Hero = { n: string; f: boolean; e?: string }
export function hero(r: R, not?: string): Hero {
  if (KIT && r() < 0.75) { const c = one(r, KIT.chars.filter((x) => x.name !== not)); return { n: c.name, f: !!c.f, e: art(KIT.id, c.k) } }
  const k = one(r, KIDS.filter((x) => x.n !== not)); return { n: k.n, f: k.f }
}
/** Something to count in a story: `w` one, `pl` many, `e` its picture. */
export type Stuff = { w: string; pl: string; e: string }
const COMMON_STUFF: Stuff[] = [
  { w: 'תפוח', pl: 'תפוחים', e: '🍎' }, { w: 'כדור', pl: 'כדורים', e: '⚽' }, { w: 'בלון', pl: 'בלונים', e: '🎈' }, { w: 'עוגייה', pl: 'עוגיות', e: '🍪' },
  { w: 'ספר', pl: 'ספרים', e: '📖' }, { w: 'פרח', pl: 'פרחים', e: '🌸' }, { w: 'כוכב', pl: 'כוכבים', e: '⭐' }, { w: 'דג', pl: 'דגים', e: '🐟' },
  { w: 'תות', pl: 'תותים', e: '🍓' }, { w: 'סוכרייה', pl: 'סוכריות', e: '🍬' }, { w: 'מכונית', pl: 'מכוניות', e: '🚗' }, { w: 'עיפרון', pl: 'עפרונות', e: '✏️' },
]
export function stuff(r: R): Stuff {
  if (KIT && r() < 0.6) { const t = one(r, KIT.things.filter((x) => !x.w.includes(' '))); return { w: t.w, pl: t.pl, e: art(KIT.id, t.k) } }
  return one(r, COMMON_STUFF)
}
/** A verb in the hero's gender: v(h, 'קיבל', 'קיבלה'). */
export const v = (h: Hero, m: string, f: string) => (h.f ? f : m)
