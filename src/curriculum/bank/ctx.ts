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
/** World things a story can't have a pile of, or give away (rivers, caves, planets, teeth…). */
const NOT_COUNTABLE = new Set(['ברק', 'מגדל', 'גשר', 'טירה', 'דרקון', 'כוכב לכת', 'ירח', 'שמש', 'שביט', 'גלקסיה', 'אסטרואיד', 'מכתש', 'לוויין', 'חללית', 'מוסך',
  'הר געש', 'נהר', 'מערה', 'הר', 'עקבה', 'מטאור', 'ממותה', 'דקל', 'עץ', 'את', 'סלע', 'קן', 'שן', 'מנוף', 'דחפור', 'רמזור', 'זרקור', 'אסטרונאוט', 'צלחת מעופפת', 'פיה', 'חד־קרן'])
/** Many of something: hundreds of these are believable in a shop or a library. */
const BIG_STUFF: Stuff[] = [
  { w: 'ספר', pl: 'ספרים', e: '📖' }, { w: 'בלון', pl: 'בלונים', e: '🎈' }, { w: 'סוכרייה', pl: 'סוכריות', e: '🍬' }, { w: 'מדבקה', pl: 'מדבקות', e: '⭐' },
  { w: 'עיפרון', pl: 'עפרונות', e: '✏️' }, { w: 'פרח', pl: 'פרחים', e: '🌸' }, { w: 'תות', pl: 'תותים', e: '🍓' },
]
/** Something to count in a story. `big`: the numbers go past 100, so only things you really find by the hundred. */
export function stuff(r: R, big = false): Stuff {
  if (big) return one(r, BIG_STUFF)
  if (KIT && r() < 0.6) { const t = one(r, KIT.things.filter((x) => !x.w.includes(' ') && !NOT_COUNTABLE.has(x.w))); return { w: t.w, pl: t.pl, e: art(KIT.id, t.k) } }
  return one(r, COMMON_STUFF)
}
/** A verb in the hero's gender: v(h, 'קיבל', 'קיבלה'). */
export const v = (h: Hero, m: string, f: string) => (h.f ? f : m)
