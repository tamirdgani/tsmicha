/* School math: adding, taking away, times, sharing, big numbers, skip counting and word problems.
   Written with digits only (no piles to count), so the child has to calculate. Every answer explains how to
   get there, the same way the lesson's "how do we add?" page taught it (gen.ts howTo):
   counting on, making 10 first, tens with tens and ones with ones, or taking away the tens first.
   The range comes from the lesson's spec: `max` (10, 20, 100, 1000), `hard` (crossing 10 / carrying). */

import type { Spec } from '../course'
import type { Show, Tile } from '../lessonTypes'
import { hero, stuff, v, type Hero } from './ctx'
import { choices, he, int, match, mix, one, order, pick, some, style, tapall, YES, NO, type R, type Style } from './util'

const M = '−' // a real minus sign
const num = (n: number): Tile => ({ g: String(n) })
const expr = (text: string): Show => ({ kind: 'expr', text })
const top = (sp: Spec) => sp.max ?? 10

/** Wrong answers a child would really give: one off, ten off, digits swapped, the other operation. */
export function wrongs(r: R, ans: number, n: number, extra: number[] = [], hi = Infinity): number[] {
  const swap = ans >= 10 && ans % 10 ? Number(String(ans).split('').reverse().join('')) : -1
  const pool = [...extra, ans + 1, ans - 1, ans + 10, ans - 10, swap, ans + 2, ans - 2, ans + 100, ans - 100]
    .filter((x) => Number.isInteger(x) && x >= 0 && x <= hi && x !== ans && (ans < 30 ? Math.abs(x - ans) <= 10 : true))
  const out = [...new Set(pool)]
  const first = out.filter((x) => extra.includes(x))
  return [...new Set([...first, ...mix(r, out.slice(0, 7))])].slice(0, n)
}

/* ───────── how to add / take away, step by step (shown in every answer) ───────── */
const seqUp = (from: number, k: number) => Array.from({ length: k }, (_, i) => from + i + 1).join(', ')
const seqDown = (from: number, k: number) => Array.from({ length: k }, (_, i) => from - i - 1).join(', ')
export function howPlus(a: number, b: number): string {
  const s = a + b, big = Math.max(a, b), small = Math.min(a, b)
  if (s <= 10) return small <= 5 ? `מתחילים מ־${big} וסופרים עוד ${small} קדימה: ${seqUp(big, small)}. יוצא ${s}.` : `${a} + ${b} = ${s}.`
  if (big < 10) { const need = 10 - big; return `משלימים ל־10: ${big} + ${need} = 10. מ־${small} נשארו עוד ${small - need}: 10 + ${small - need} = ${s}.` }
  if (s < 100 || (a < 100 && b < 100)) {
    const ta = a - (a % 10), tb = b - (b % 10), oa = a % 10, ob = b % 10
    if (!tb) return `מוסיפים את האחדות: ${oa} + ${ob} = ${oa + ob}. ${ta} + ${oa + ob} = ${s}.`
    return `עשרות עם עשרות: ${ta} + ${tb} = ${ta + tb}. אחדות עם אחדות: ${oa} + ${ob} = ${oa + ob}. ביחד: ${ta + tb} + ${oa + ob} = ${s}.`
  }
  const h = (x: number) => x - (x % 100), t = (x: number) => (x % 100) - (x % 10), o = (x: number) => x % 10
  return `מאות: ${h(a)} + ${h(b)} = ${h(a) + h(b)}. עשרות: ${t(a)} + ${t(b)} = ${t(a) + t(b)}. אחדות: ${o(a)} + ${o(b)} = ${o(a) + o(b)}. ביחד: ${s}.`
}
export function howMinus(a: number, b: number): string {
  const d = a - b
  if (a <= 10) return b <= 5 ? `מתחילים מ־${a} וסופרים ${b} אחורה: ${seqDown(a, b)}. נשארו ${d}. בודקים: ${d} + ${b} = ${a}.` : `${a} ${M} ${b} = ${d}, כי ${d} + ${b} = ${a}.`
  if (a <= 20 && b < 10) {
    const toTen = a - 10
    if (b > toTen && toTen > 0) return `יורדים קודם ל־10: ${a} ${M} ${toTen} = 10. נשאר להוריד עוד ${b - toTen}: 10 ${M} ${b - toTen} = ${d}.`
    return `מורידים מהאחדות: ${a % 10} ${M} ${b} = ${(a % 10) - b}, והעשר נשאר: ${d}.`
  }
  if (b < 100) {
    const tb = b - (b % 10), ob = b % 10
    if (!tb) return `${a} ${M} ${ob} = ${d}. בודקים: ${d} + ${ob} = ${a}.`
    return `מורידים קודם את העשרות: ${a} ${M} ${tb} = ${a - tb}. אחר כך את האחדות: ${a - tb} ${M} ${ob} = ${d}.`
  }
  const hb = b - (b % 100), rest = b - hb
  return `מורידים קודם את המאות: ${a} ${M} ${hb} = ${a - hb}. אחר כך עוד ${rest}: ${a - hb} ${M} ${rest} = ${d}.`
}

/** Two numbers to add inside the lesson's range. `hard`: crossing 10 or carrying. */
export function addPair(sp: Spec, r: R): [number, number] {
  const max = top(sp), hard = !!sp.hard
  for (let i = 0; i < 60; i++) {
    let a: number, b: number
    if (max <= 10) { a = int(r, 1, max - 1); b = int(r, 1, max - a); if (hard && a + b < 6) continue }
    else if (max <= 20) {
      if (hard || r() < 0.5) { a = int(r, 3, 9); b = int(r, 11 - a, 9) } // crossing ten: 8 + 5
      else { a = int(r, 10, max - 2); b = int(r, 1, Math.min(9, max - a)) } // 13 + 4
    } else if (max <= 100) {
      a = int(r, 11, max - 12); b = int(r, 5, max - a)
      const carry = (a % 10) + (b % 10) >= 10
      if (hard !== carry) continue
    } else {
      if (hard) { a = int(r, 101, 799); b = int(r, 101, max - a) } else { a = int(r, 11, 79) * 10; b = int(r, 10, Math.floor((max - a) / 10)) * 10 }
      if (b <= 0) continue
    }
    if (a + b <= max && a > 0 && b > 0) return [a, b]
  }
  return [Math.floor(max / 2) - 1, 1]
}
/** a − b with the same difficulty as adding (borrowing when hard). */
export function subPair(sp: Spec, r: R): [number, number] { const [x, y] = addPair(sp, r); return [x + y, r() < 0.5 ? y : x] }

/* ───────── adding ───────── */
const story = (r: R, kind: '+' | '-', a: number, b: number) => {
  const h = hero(r), s = stuff(r), h2 = hero(r, h.n)
  if (kind === '+') return one(r, [
    `ל${h.n} היו ${a} ${s.pl}. ${h2.n} ${v(h2, 'נתן', 'נתנה')} ${v(h, 'לו', 'לה')} עוד ${b}. כמה ${s.pl} יש ל${h.n} עכשיו?`,
    `${h.n} ${v(h, 'מצא', 'מצאה')} ${a} ${s.pl} בבוקר ועוד ${b} בצהריים. כמה ${s.pl} ${v(h, 'מצא', 'מצאה')} בסך הכל?`,
    `בקופסה אחת יש ${a} ${s.pl} ובקופסה השנייה ${b}. כמה ${s.pl} יש בשתי הקופסאות?`,
  ])
  return one(r, [
    `ל${h.n} היו ${a} ${s.pl}. ${v(h, 'הוא נתן', 'היא נתנה')} ${b} ל${h2.n}. כמה ${s.pl} נשארו ל${h.n}?`,
    `על המדף היו ${a} ${s.pl}. ${h.n} ${v(h, 'לקח', 'לקחה')} ${b}. כמה נשארו על המדף?`,
    `${h.n} ${v(h, 'צריך', 'צריכה')} לאסוף ${a} ${s.pl}. ${v(h, 'הוא אסף', 'היא אספה')} כבר ${b}. כמה עוד ${v(h, 'חסרים לו', 'חסרים לה')}?`,
  ])
}

export const PLUS_STYLES: Style[] = [
  style('pl-expr', 'כמה זה?', ['plus'], 'e', (sp, r) => {
    const [a, b] = addPair(sp, r), s = a + b
    return [`pl|${a}+${b}`, pick(r, 'כמה זה?', num(s), wrongs(r, s, 3, [Math.abs(a - b)]).map(num), howPlus(a, b), expr(`${a} + ${b} = ?`))]
  }),
  style('pl-hard', 'חיבור בראש', ['plus'], 'h', (sp, r) => {
    const [a, b] = addPair({ ...sp, hard: top(sp) > 10 ? true : sp.hard }, r), s = a + b
    return [`pl|${a}+${b}`, pick(r, 'פותרים בראש. כמה זה?', num(s), wrongs(r, s, 3, [s - 10, s + 10]).map(num), howPlus(a, b), expr(`${a} + ${b} = ?`))]
  }),
  style('pl-missing', 'מה חסר בתרגיל?', ['plus'], 't', (sp, r) => {
    const [a, b] = addPair(sp, r), s = a + b, left = r() < 0.5
    return [`plm|${a}+${b}|${left}`, pick(r, 'איזה מספר חסר?', num(left ? a : b), wrongs(r, left ? a : b, 3, [s]).map(num),
      `${s} ${M} ${left ? b : a} = ${left ? a : b}. בודקים: ${a} + ${b} = ${s}.`, expr(left ? `? + ${b} = ${s}` : `${a} + ? = ${s}`))]
  }),
  style('pl-story', 'סיפור חיבור', ['plus', 'wordprob'], 'h', (sp, r) => {
    const [a, b] = addPair(sp, r), s = a + b
    return [`pls|${a}+${b}`, pick(r, story(r, '+', a, b), num(s), wrongs(r, s, 3, [Math.abs(a - b)]).map(num), `קיבלו עוד, אז מחברים: ${a} + ${b}. ${howPlus(a, b)}`)]
  }),
  style('pl-which', 'איזה תרגיל שווה?', ['plus'], 't', (sp, r) => {
    const [a, b] = addPair(sp, r), s = a + b
    const bad = [[a + 1, b], [a, b - 1], [Math.max(1, a - 1), b]].filter(([x, y]) => x + y !== s && y > 0).slice(0, 2)
    const { options, correct } = choices(r, { t: `${a} + ${b}` }, bad.map(([x, y]) => ({ t: `${x} + ${y}` })))
    return [`plw|${s}|${a}`, { kind: 'pick', q: he(`איזה תרגיל יוצא בדיוק ${s}?`), show: { kind: 'tile', tile: num(s) }, options, correct, why: he(howPlus(a, b)) }]
  }),
  style('pl-true', 'נכון או לא?', ['plus'], 'h', (sp, r) => {
    const [a, b] = addPair(sp, r), s = a + b, right = r() < 0.45, shown = right ? s : one(r, wrongs(r, s, 2))
    return [`plt|${a}+${b}`, pick(r, 'בודקים: התרגיל נכון?', right ? YES : NO, [right ? NO : YES], right ? `נכון! ${howPlus(a, b)}` : `לא נכון. ${a} + ${b} = ${s}, לא ${shown}. ${howPlus(a, b)}`, expr(`${a} + ${b} = ${shown}`))]
  }),
  style('pl-tap', 'מסמנים תרגילים שווים', ['plus'], 't', (sp, r) => {
    const [a, b] = addPair(sp, r), s = a + b
    if (s < 4) return null
    const rights: [number, number][] = [[a, b]]
    for (let i = 0; i < 20 && rights.length < 2; i++) { const x = int(r, 1, s - 1); if (!rights.some(([p]) => p === x)) rights.push([x, s - x]) }
    if (rights.length < 2) return null
    const wr = ([[a, b + 1], [a + 1, b], [Math.max(1, b - 1), a + 2]] as [number, number][]).filter(([x, y]) => x + y !== s)
    return [`plp|${s}|${a}`, tapall(r, `מסמנים את כל התרגילים שיוצאים ${s}`, rights.map(([x, y]) => ({ t: `${x} + ${y}` })), wr.map(([x, y]) => ({ t: `${x} + ${y}` })), `${rights.map(([x, y]) => `${x} + ${y} = ${s}`).join(' · ')}`)]
  }),
  style('pl-match', 'מחברים תרגיל לתשובה', ['plus'], 'h', (sp, r) => {
    const ps: [number, number][] = []
    for (let i = 0; i < 30 && ps.length < 3; i++) { const p = addPair(sp, r); if (!ps.some((q) => q[0] + q[1] === p[0] + p[1])) ps.push(p) }
    if (ps.length < 3) return null
    return [`plx|${ps.map((p) => p.join('+')).sort().join()}`, match('מחברים כל תרגיל לתשובה שלו', ps.map(([a, b]) => [{ t: `${a} + ${b}` }, num(a + b)]), ps.map(([a, b]) => `${a} + ${b} = ${a + b}`).join(' · '))]
  }),
  style('pl-compare', 'איפה יוצא יותר?', ['plus'], 't', (sp, r) => {
    const p = addPair(sp, r), q = addPair(sp, r)
    if (p[0] + p[1] === q[0] + q[1]) return null
    const [hi, lo] = p[0] + p[1] > q[0] + q[1] ? [p, q] : [q, p]
    return [`plc|${hi.join('+')}|${lo.join('+')}`, pick(r, 'באיזה תרגיל התשובה גדולה יותר?', { t: `${hi[0]} + ${hi[1]}` }, [{ t: `${lo[0]} + ${lo[1]}` }], `${hi[0]} + ${hi[1]} = ${hi[0] + hi[1]}, ו־${lo[0]} + ${lo[1]} = ${lo[0] + lo[1]}.`)]
  }),
  style('pl-ten', 'משלימים לעשר', ['plus'], 'h', (sp, r) => {
    const max = top(sp)
    if (max <= 20) { const a = int(r, 1, 9); return [`plten|${a}`, pick(r, `כמה צריך להוסיף ל־${a} כדי להגיע ל־10?`, num(10 - a), wrongs(r, 10 - a, 3, [a], 10).map(num), `${a} + ${10 - a} = 10.`, expr(`${a} + ? = 10`))] }
    const a = int(r, 11, Math.min(98, max - 2)), up = Math.ceil(a / 10) * 10 === a ? a + 10 : Math.ceil(a / 10) * 10
    return [`plten|${a}`, pick(r, `כמה צריך להוסיף ל־${a} כדי להגיע ל־${up}?`, num(up - a), wrongs(r, up - a, 3, [10 - (up - a)].filter((x) => x > 0), 10).map(num), `${a} + ${up - a} = ${up}. מסתכלים רק על האחדות: ${a % 10} + ${up - a} = 10.`, expr(`${a} + ? = ${up}`))]
  }),
  style('pl-three', 'שלושה מספרים', ['plus'], 't', (sp, r) => {
    const max = top(sp)
    if (max < 15) return null
    const lim = max <= 20 ? 9 : max <= 100 ? 30 : 300
    const a = int(r, 2, lim), b = int(r, 2, lim), c = 10 - (a % 10) || int(r, 2, 9)
    const s = a + b + c
    if (s > max) return null
    return [`pl3|${a}+${b}+${c}`, pick(r, 'כמה זה? טיפ: מחפשים שני מספרים שעושים עשר', num(s), wrongs(r, s, 3).map(num), `${a} + ${c} = ${a + c}, ועוד ${b}: ${s}.`, expr(`${a} + ${b} + ${c} = ?`))]
  }),
  style('pl-hop', 'קפיצה קדימה', ['plus', 'bignum'], 'h', (sp, r) => {
    const [a, b] = addPair(sp, r), h = hero(r)
    return [`plh|${a}+${b}`, pick(r, `${h.n} ${v(h, 'עומד', 'עומדת')} על המספר ${a} ${v(h, 'וקופץ', 'וקופצת')} ${b} צעדים קדימה. לאיזה מספר ${v(h, 'הוא מגיע', 'היא מגיעה')}?`, num(a + b), wrongs(r, a + b, 3).map(num), howPlus(a, b), h.e ? { kind: 'tile', tile: { e: h.e } } : undefined)]
  }),
]

/* ───────── taking away ───────── */
export const MINUS_STYLES: Style[] = [
  style('mi-expr', 'כמה נשאר?', ['minus'], 'e', (sp, r) => {
    const [a, b] = subPair(sp, r), d = a - b
    return [`mi|${a}-${b}`, pick(r, 'כמה זה?', num(d), wrongs(r, d, 3, [a + b > 1000 ? d + 1 : a + b].slice(0, 1)).map(num), howMinus(a, b), expr(`${a} ${M} ${b} = ?`))]
  }),
  style('mi-hard', 'חיסור בראש', ['minus'], 'h', (sp, r) => {
    const [a, b] = subPair({ ...sp, hard: top(sp) > 10 ? true : sp.hard }, r), d = a - b
    return [`mi|${a}-${b}`, pick(r, 'פותרים בראש. כמה זה?', num(d), wrongs(r, d, 3, [d + 10, d - 10]).map(num), howMinus(a, b), expr(`${a} ${M} ${b} = ?`))]
  }),
  style('mi-missing', 'מה חסר בתרגיל?', ['minus'], 't', (sp, r) => {
    const [a, b] = subPair(sp, r), d = a - b, first = r() < 0.5
    return [`mim|${a}-${b}|${first}`, pick(r, 'איזה מספר חסר?', num(first ? a : b), wrongs(r, first ? a : b, 3, [d]).map(num),
      first ? `${d} + ${b} = ${a}, אז ${a} ${M} ${b} = ${d}.` : `${a} ${M} ${d} = ${b}. בודקים: ${a} ${M} ${b} = ${d}.`, expr(first ? `? ${M} ${b} = ${d}` : `${a} ${M} ? = ${d}`))]
  }),
  style('mi-story', 'סיפור חיסור', ['minus', 'wordprob'], 'h', (sp, r) => {
    const [a, b] = subPair(sp, r), d = a - b
    return [`mis|${a}-${b}`, pick(r, story(r, '-', a, b), num(d), wrongs(r, d, 3, [a + b]).map(num), `נשארו פחות, אז מחסרים: ${a} ${M} ${b}. ${howMinus(a, b)}`)]
  }),
  style('mi-true', 'נכון או לא?', ['minus'], 'h', (sp, r) => {
    const [a, b] = subPair(sp, r), d = a - b, right = r() < 0.45, shown = right ? d : one(r, wrongs(r, d, 2))
    return [`mit|${a}-${b}`, pick(r, 'בודקים: התרגיל נכון?', right ? YES : NO, [right ? NO : YES], right ? `נכון! ${howMinus(a, b)}` : `לא נכון. ${a} ${M} ${b} = ${d}. ${howMinus(a, b)}`, expr(`${a} ${M} ${b} = ${shown}`))]
  }),
  style('mi-check', 'בודקים בחיבור', ['minus', 'plus'], 't', (sp, r) => {
    const [a, b] = subPair(sp, r), d = a - b
    if (!d) return null
    const { options, correct } = choices(r, { t: `${d} + ${b} = ${a}` }, [{ t: `${a} + ${b} = ${a + b}` }, { t: `${d} + ${a} = ${d + a}` }])
    return [`mic|${a}-${b}`, { kind: 'pick', q: he(`${a} ${M} ${b} = ${d}. איזה תרגיל חיבור בודק שזה נכון?`), show: expr(`${a} ${M} ${b} = ${d}`), options, correct, why: he(`מה שנשאר ועוד מה שהורדנו חוזר להתחלה: ${d} + ${b} = ${a}.`) }]
  }),
  style('mi-diff', 'בכמה יותר?', ['minus', 'wordprob'], 't', (sp, r) => {
    const [a, b] = subPair(sp, r), d = a - b, h1 = hero(r), h2 = hero(r, h1.n), s = stuff(r)
    if (!d) return null
    return [`mid|${a}-${b}`, pick(r, `ל${h1.n} יש ${a} ${s.pl} ול${h2.n} יש ${b}. בכמה ${s.pl} יש ל${h1.n} יותר?`, num(d), wrongs(r, d, 3, [a + b]).map(num), `משווים: ${a} ${M} ${b} = ${d}. ${howMinus(a, b)}`)]
  }),
  style('mi-match', 'מחברים תרגיל לתשובה', ['minus'], 'h', (sp, r) => {
    const ps: [number, number][] = []
    for (let i = 0; i < 30 && ps.length < 3; i++) { const p = subPair(sp, r); if (!ps.some((q) => q[0] - q[1] === p[0] - p[1])) ps.push(p) }
    if (ps.length < 3) return null
    return [`mix|${ps.map((p) => p.join('-')).sort().join()}`, match('מחברים כל תרגיל לתשובה שלו', ps.map(([a, b]) => [{ t: `${a} ${M} ${b}` }, num(a - b)]), ps.map(([a, b]) => `${a} ${M} ${b} = ${a - b}`).join(' · '))]
  }),
  style('mi-hop', 'קפיצה אחורה', ['minus', 'bignum'], 'h', (sp, r) => {
    const [a, b] = subPair(sp, r), h = hero(r)
    return [`mih|${a}-${b}`, pick(r, `${h.n} ${v(h, 'עומד', 'עומדת')} על המספר ${a} ${v(h, 'וקופץ', 'וקופצת')} ${b} צעדים אחורה. לאיזה מספר ${v(h, 'הוא מגיע', 'היא מגיעה')}?`, num(a - b), wrongs(r, a - b, 3, [a + b]).map(num), howMinus(a, b), h.e ? { kind: 'tile', tile: { e: h.e } } : undefined)]
  }),
  style('mi-sign', 'פלוס או מינוס?', ['minus', 'plus'], 't', (sp, r) => {
    const [a, b] = subPair(sp, r), plus = r() < 0.5, res = plus ? a + b : a - b
    if (!b || res > Math.max(20, top(sp))) return null
    return [`mig|${a}|${b}|${plus}`, pick(r, 'איזה סימן חסר?', { g: plus ? '+' : M }, [{ g: plus ? M : '+' }], plus ? `${a} + ${b} = ${res}: יצא יותר, אז חיברנו.` : `${a} ${M} ${b} = ${res}: יצא פחות, אז חיסרנו.`, expr(`${a} ? ${b} = ${res}`))]
  }),
]

/* ───────── times and sharing ───────── */
/** Times-table factors: never past 10 × 10, even when a word-problem lesson allows bigger numbers. */
const tPair = (sp: Spec, r: R): [number, number] => { const m = Math.min(10, Math.max(3, top(sp))); return [int(r, 2, m), int(r, 2, m)] }
export const howTimes = (a: number, b: number) => `${a} × ${b} זה ${a} פעמים ${b}: ${Array.from({ length: a }, (_, i) => b * (i + 1)).join(', ')}. יוצא ${a * b}.`
export const TIMES_STYLES: Style[] = [
  style('tm-groups', 'קבוצות שוות', ['times'], 'e', (sp, r) => {
    const a = int(r, 2, 4), b = int(r, 2, Math.min(5, top(sp))), s = stuff(r)
    return [`tm|${a}x${b}`, pick(r, `${a} קבוצות, ובכל קבוצה ${b}. כמה יש בסך הכל?`, num(a * b), wrongs(r, a * b, 3, [a + b]).map(num), howTimes(a, b), { kind: 'row', items: Array.from({ length: a }, () => ({ many: { e: s.e, n: b } })) })]
  }),
  style('tm-expr', 'כמה זה?', ['times'], 'e', (sp, r) => {
    const [a, b] = tPair(sp, r)
    return [`tm|${a}x${b}`, pick(r, 'כמה זה?', num(a * b), wrongs(r, a * b, 3, [a + b, a * b + a, a * b - b]).map(num), howTimes(a, b), expr(`${a} × ${b} = ?`))]
  }),
  style('tm-add', 'כפל כחיבור', ['times'], 'h', (sp, r) => {
    const a = int(r, 3, 5), b = int(r, 2, top(sp))
    const { options, correct } = choices(r, { t: `${a} × ${b}` }, [{ t: `${b} × ${b}` }, { t: `${a} + ${b}` }].filter((x) => x.t !== `${a} × ${b}`))
    return [`tma|${a}x${b}`, { kind: 'pick', q: he('איזה תרגיל כפל זה?'), show: expr(Array(a).fill(b).join(' + ')), options, correct, why: he(`חיברנו ${a} פעמים ${b}: זה ${a} × ${b} = ${a * b}.`) }]
  }),
  style('tm-missing', 'מה חסר?', ['times'], 't', (sp, r) => {
    const [a, b] = tPair(sp, r)
    return [`tmm|${a}x${b}`, pick(r, 'איזה מספר חסר?', num(b), wrongs(r, b, 3, [a * b - a]).map(num), `${a} × ${b} = ${a * b}. סופרים בקפיצות של ${a}: ${Array.from({ length: b }, (_, i) => a * (i + 1)).join(', ')}.`, expr(`${a} × ? = ${a * b}`))]
  }),
  style('tm-story', 'סיפור כפל', ['times', 'wordprob'], 'h', (sp, r) => {
    const [a, b] = tPair(sp, r), s = stuff(r), h = hero(r)
    return [`tms|${a}x${b}`, pick(r, `${h.n} ${v(h, 'סידר', 'סידרה')} ${a} שורות של ${s.pl}, ובכל שורה ${b}. כמה ${s.pl} יש?`, num(a * b), wrongs(r, a * b, 3, [a + b]).map(num), howTimes(a, b))]
  }),
  style('tm-swap', 'מחליפים סדר', ['times'], 't', (sp, r) => {
    const [a, b] = tPair(sp, r)
    if (a === b) return null
    return [`tmw|${a}x${b}`, pick(r, `${a} × ${b} = ${a * b}. כמה זה ${b} × ${a}?`, num(a * b), wrongs(r, a * b, 3, [b * b, a * a].filter((x) => x !== a * b)).map(num), `בכפל אפשר להחליף את הסדר: ${b} × ${a} = ${a} × ${b} = ${a * b}.`, expr(`${b} × ${a} = ?`))]
  }),
  style('tm-true', 'נכון או לא?', ['times'], 'h', (sp, r) => {
    const [a, b] = tPair(sp, r), right = r() < 0.45, shown = right ? a * b : one(r, wrongs(r, a * b, 2, [a * b + a, a + b]))
    return [`tmt|${a}x${b}`, pick(r, 'בודקים: התרגיל נכון?', right ? YES : NO, [right ? NO : YES], right ? `נכון! ${howTimes(a, b)}` : `לא נכון. ${howTimes(a, b)}`, expr(`${a} × ${b} = ${shown}`))]
  }),
  style('tm-match', 'מחברים תרגיל לתשובה', ['times'], 'h', (sp, r) => {
    const ps: [number, number][] = []
    for (let i = 0; i < 30 && ps.length < 3; i++) { const p = tPair(sp, r); if (!ps.some((q) => q[0] * q[1] === p[0] * p[1])) ps.push(p) }
    if (ps.length < 3) return null
    return [`tmx|${ps.map((p) => p.join('x')).sort().join()}`, match('מחברים כל תרגיל לתשובה שלו', ps.map(([a, b]) => [{ t: `${a} × ${b}` }, num(a * b)]), ps.map(([a, b]) => `${a} × ${b} = ${a * b}`).join(' · '))]
  }),
]
export const DIVIDE_STYLES: Style[] = [
  style('dv-share', 'מחלקים שווה בשווה', ['divide'], 'e', (sp, r) => {
    const k = int(r, 2, 4), each = int(r, 2, Math.min(5, top(sp))), s = stuff(r)
    return [`dv|${k * each}:${k}`, pick(r, `יש ${k * each} ${s.pl} ו־${k} ילדים. כל ילד מקבל אותו מספר. כמה כל אחד מקבל?`, num(each), wrongs(r, each, 3, [k]).map(num), `${k * each} : ${k} = ${each}, כי ${k} × ${each} = ${k * each}.`, { kind: 'pile', e: s.e, n: k * each })]
  }),
  style('dv-expr', 'כמה זה?', ['divide'], 'h', (sp, r) => {
    const [a, b] = tPair(sp, r)
    return [`dv|${a * b}:${a}`, pick(r, 'כמה זה?', num(b), wrongs(r, b, 3, [a]).map(num), `חושבים: ${a} כפול כמה זה ${a * b}? ${a} × ${b} = ${a * b}, אז ${a * b} : ${a} = ${b}.`, expr(`${a * b} : ${a} = ?`))]
  }),
  style('dv-missing', 'מה חסר?', ['divide'], 't', (sp, r) => {
    const [a, b] = tPair(sp, r)
    return [`dvm|${a * b}:${a}`, pick(r, 'איזה מספר חסר?', num(a), wrongs(r, a, 3, [a * b]).map(num), `${a * b} : ${a} = ${b}, כי ${a} × ${b} = ${a * b}.`, expr(`${a * b} : ? = ${b}`))]
  }),
  style('dv-story', 'סיפור חילוק', ['divide', 'wordprob'], 'h', (sp, r) => {
    const [a, b] = tPair(sp, r), s = stuff(r)
    return [`dvs|${a * b}:${a}`, pick(r, `יש ${a * b} ${s.pl}. שמים אותם בקופסאות, ${a} בכל קופסה. כמה קופסאות צריך?`, num(b), wrongs(r, b, 3, [a]).map(num), `${a * b} : ${a} = ${b}, כי ${b} קופסאות של ${a} זה ${a * b}.`)]
  }),
  style('dv-check', 'בודקים בכפל', ['divide', 'times'], 't', (sp, r) => {
    const [a, b] = tPair(sp, r)
    if (a === b) return null
    const { options, correct } = choices(r, { t: `${a} × ${b} = ${a * b}` }, [{ t: `${a * b} + ${a} = ${a * b + a}` }, { t: `${b} + ${a} = ${a + b}` }])
    return [`dvc|${a * b}:${a}`, { kind: 'pick', q: he(`${a * b} : ${a} = ${b}. איזה תרגיל בודק שזה נכון?`), show: expr(`${a * b} : ${a} = ${b}`), options, correct, why: he(`חילוק בודקים בכפל: ${a} × ${b} = ${a * b}.`) }]
  }),
  style('dv-true', 'נכון או לא?', ['divide'], 'h', (sp, r) => {
    const [a, b] = tPair(sp, r), right = r() < 0.45, shown = right ? b : one(r, wrongs(r, b, 2, [a]))
    return [`dvt|${a * b}:${a}`, pick(r, 'בודקים: התרגיל נכון?', right ? YES : NO, [right ? NO : YES], `${a * b} : ${a} = ${b}, כי ${a} × ${b} = ${a * b}.`, expr(`${a * b} : ${a} = ${shown}`))]
  }),
]

/* ───────── big numbers: place value, comparing, order ───────── */
const bnum = (sp: Spec, r: R) => { const m = top(sp); return m <= 20 ? int(r, 11, m) : m <= 100 ? int(r, 21, m - 1) : int(r, 101, m - 1) }
const parts = (n: number) => n >= 100 ? `${Math.floor(n / 100)} מאות, ${Math.floor((n % 100) / 10)} עשרות ו־${n % 10} אחדות` : `${Math.floor(n / 10)} עשרות ו־${n % 10} אחדות`
export const BIG_STYLES: Style[] = [
  style('bn-after', 'מה בא אחרי?', ['bignum'], 'e', (sp, r) => {
    const n = bnum(sp, r) - 1
    return [`bna|${n}`, pick(r, `איזה מספר בא מיד אחרי ${n}?`, num(n + 1), wrongs(r, n + 1, 3, [n - 1, n + 10]).map(num), `${n} ועוד 1 זה ${n + 1}.`, expr(`${n}, ?`))]
  }),
  style('bn-before', 'מה בא לפני?', ['bignum'], 'h', (sp, r) => {
    const n = bnum(sp, r)
    return [`bnb|${n}`, pick(r, `איזה מספר בא מיד לפני ${n}?`, num(n - 1), wrongs(r, n - 1, 3, [n + 1, n - 10]).map(num), `${n} פחות 1 זה ${n - 1}.`, expr(`?, ${n}`))]
  }),
  style('bn-compare', 'גדול, קטן או שווה', ['bignum'], 'h', (sp, r) => {
    const a = bnum(sp, r), b = r() < 0.15 ? a : r() < 0.5 && a >= 10 ? Number(String(a).split('').reverse().join('')) || a + 1 : bnum(sp, r)
    const sign = a > b ? '>' : a < b ? '<' : '='
    return [`bnc|${a}|${b}`, pick(r, 'איזה סימן מתאים?', { g: sign }, ['>', '<', '='].filter((x) => x !== sign).map((g) => ({ g })), sign === '=' ? `${a} ו־${b} שווים.` : `${Math.max(a, b)} גדול מ־${Math.min(a, b)}. הפה של התנין פתוח אל המספר הגדול.`, expr(`${a} ? ${b}`))]
  }),
  style('bn-tens', 'עשרות ואחדות', ['bignum'], 'h', (sp, r) => {
    const n = bnum(sp, r), t = Math.floor((n % 100) / 10)
    const opts = [...new Set([n % 10, Math.floor(n / 100), t + 1, t * 10].filter((x) => x !== t && x >= 0))].slice(0, 2)
    return [`bnt|${n}`, pick(r, `כמה עשרות יש במספר ${n}?`, num(t), opts.map(num), `ב־${n} יש ${parts(n)}.`, expr(`${n}`))]
  }),
  style('bn-build', 'בונים מספר', ['bignum'], 'h', (sp, r) => {
    const n = bnum(sp, r)
    if (n % 10 === 0) return null
    const swapped = Number(String(n).split('').reverse().join(''))
    return [`bnd|${n}`, pick(r, `${parts(n)}. איזה מספר זה?`, num(n), [...new Set([swapped, n + 10, n - 1])].filter((x) => x !== n).slice(0, 2).map(num), `${parts(n)} = ${n}.`)]
  }),
  style('bn-order', 'מהקטן לגדול', ['bignum'], 't', (sp, r) => {
    const set = new Set<number>()
    for (let i = 0; i < 30 && set.size < 4; i++) set.add(bnum(sp, r))
    if (set.size < 4) return null
    const ns = [...set].sort((a, b) => a - b)
    return [`bno|${ns.join()}`, order('מסדרים את המספרים מהקטן לגדול', ns.map(num), ns.join(' < '))]
  }),
  style('bn-max', 'המספר הכי גדול', ['bignum'], 't', (sp, r) => {
    const n = bnum(sp, r)
    if (n < 12 || n % 10 === Math.floor(n / 10) % 10) return null
    const sw = Number(String(n).split('').reverse().join(''))
    const all = [...new Set([n, sw, n - 9, sw + 1].filter((x) => x > 0 && x <= top(sp)))]
    if (all.length < 3) return null
    const mx = Math.max(...all)
    return [`bnm|${all.sort().join()}`, pick(r, 'איזה מספר הכי גדול? מסתכלים קודם על העשרות!', num(mx), all.filter((x) => x !== mx).map(num), `${mx} הכי גדול: ${parts(mx)}.`)]
  }),
  style('bn-tap', 'מסמנים גדולים מ...', ['bignum'], 't', (sp, r) => {
    const n = bnum(sp, r), set = new Set<number>()
    for (let i = 0; i < 40 && set.size < 6; i++) { const x = bnum(sp, r); if (x !== n) set.add(x) }
    const all = [...set], big = all.filter((x) => x > n), small = all.filter((x) => x < n)
    if (!big.length || !small.length) return null
    return [`bnp|${n}|${all.sort().join()}`, tapall(r, `מסמנים את כל המספרים שגדולים מ־${n}`, big.map(num), small.map(num), `גדולים מ־${n}: ${big.sort((a, b) => a - b).join(', ')}.`, expr(`> ${n}`))]
  }),
  style('bn-gap', 'מה חסר בשורה?', ['bignum', 'skip'], 't', (sp, r) => {
    const n = bnum(sp, r), step = top(sp) > 100 && r() < 0.5 ? 10 : 1, k = int(r, 1, 2)
    const row = [0, 1, 2, 3].map((i) => n - 3 * step + i * step)
    if (row[0] < 0) return null
    return [`bng|${row.join()}`, pick(r, 'איזה מספר חסר?', num(row[k]), wrongs(r, row[k], 3).map(num), `כל פעם עולים ב־${step}: ${row.join(', ')}.`, expr(row.map((x, i) => (i === k ? '?' : x)).join(' , ')))]
  }),
  style('bn-ten-more', 'עוד עשר', ['bignum'], 'h', (sp, r) => {
    const n = bnum(sp, r), up = r() < 0.6 || n < 20, ans = up ? n + 10 : n - 10
    if (ans > top(sp) + 10) return null
    return [`bn10|${n}|${up}`, pick(r, up ? `מה גדול ב־10 מ־${n}?` : `מה קטן ב־10 מ־${n}?`, num(ans), wrongs(r, ans, 3, [up ? n + 1 : n - 1]).map(num), `${up ? 'עוד' : 'פחות'} עשר: רק ספרת העשרות משתנה. ${n} ${up ? '+' : M} 10 = ${ans}.`)]
  }),
  style('bn-even', 'זוגי ואי־זוגי', ['bignum', 'skip'], 'h', (sp, r) => {
    const set = new Set<number>()
    for (let i = 0; i < 40 && set.size < 6; i++) set.add(bnum(sp, r))
    const all = [...set], ev = all.filter((x) => x % 2 === 0), od = all.filter((x) => x % 2)
    if (!ev.length || !od.length) return null
    const want = r() < 0.5
    return [`bne|${want}|${all.sort().join()}`, tapall(r, want ? 'מסמנים את כל המספרים הזוגיים' : 'מסמנים את כל המספרים האי־זוגיים', (want ? ev : od).map(num), (want ? od : ev).map(num), 'מסתכלים רק על ספרת האחדות: 0, 2, 4, 6, 8 זה זוגי. 1, 3, 5, 7, 9 אי־זוגי.')]
  }),
  style('bn-digits', 'בונים מהספרות', ['bignum'], 't', (sp, r) => {
    if (top(sp) < 100) return null
    const ds = some(r, [1, 2, 3, 4, 5, 6, 7, 8, 9], 3), big = r() < 0.5
    const sorted = [...ds].sort((a, b) => (big ? b - a : a - b)), ans = Number(sorted.join(''))
    const others = [Number(ds.join('')), Number([...sorted].reverse().join('')), Number([sorted[0], sorted[2], sorted[1]].join(''))].filter((x) => x !== ans)
    return [`bnx|${[...ds].sort().join()}|${big}`, pick(r, `מה המספר ה${big ? 'גדול' : 'קטן'} ביותר שאפשר לבנות מהספרות ${ds.join(', ')}?`, num(ans), [...new Set(others)].slice(0, 2).map(num), big ? 'שמים את הספרה הגדולה במקום המאות, אחריה את הבאה בגודל.' : 'שמים את הספרה הקטנה במקום המאות, אחריה את הבאה בגודל.')]
  }),
]

/* ───────── skip counting: 2, 4, 6… ───────── */
const steps = (sp: Spec) => (sp.set ?? '2,5,10').split(',').map(Number)
export const SKIP_STYLES: Style[] = [
  style('sk-next', 'מה בא אחר כך?', ['skip'], 'e', (sp, r) => {
    const st = one(r, steps(sp)), s0 = st * int(r, 0, 4), row = [0, 1, 2, 3].map((i) => s0 + i * st), ans = s0 + 4 * st
    return [`skn|${st}|${s0}`, pick(r, `סופרים בקפיצות של ${st}. מה בא אחר כך?`, num(ans), wrongs(r, ans, 3, [ans - st + 1, ans + 1]).map(num), `כל פעם מוסיפים ${st}: ${row.join(', ')}, ${ans}.`, expr(`${row.join(' , ')} , ?`))]
  }),
  style('sk-gap', 'מה חסר?', ['skip'], 'h', (sp, r) => {
    const st = one(r, steps(sp)), s0 = st * int(r, 0, 5), row = [0, 1, 2, 3, 4].map((i) => s0 + i * st), k = int(r, 1, 3)
    return [`skg|${st}|${s0}|${k}`, pick(r, 'איזה מספר חסר?', num(row[k]), wrongs(r, row[k], 3, [row[k] + 1]).map(num), `בקפיצות של ${st}: ${row.join(', ')}.`, expr(row.map((x, i) => (i === k ? '?' : x)).join(' , ')))]
  }),
  style('sk-rule', 'מה החוק?', ['skip'], 't', (sp, r) => {
    const st = one(r, [...steps(sp), 3]), s0 = int(r, 1, 9), row = [0, 1, 2, 3].map((i) => s0 + i * st)
    return [`skr|${st}|${s0}`, pick(r, 'מה החוק של השורה?', { t: `עוד ${st}` }, [...new Set([st + 1, st - 1, st * 2])].filter((x) => x > 0 && x !== st).slice(0, 2).map((x) => ({ t: `עוד ${x}` })), `${row[1]} ${M} ${row[0]} = ${st}. כל פעם עולים ב־${st}.`, expr(row.join(' , ')))]
  }),
  style('sk-back', 'סופרים אחורה', ['skip'], 't', (sp, r) => {
    const st = one(r, steps(sp)), s0 = st * int(r, 5, 10), row = [0, 1, 2, 3].map((i) => s0 - i * st), ans = s0 - 4 * st
    return [`skb|${st}|${s0}`, pick(r, 'השורה יורדת. מה בא אחר כך?', num(ans), wrongs(r, ans, 3, [ans + 2 * st]).map(num), `כל פעם מורידים ${st}: ${row.join(', ')}, ${ans}.`, expr(`${row.join(' , ')} , ?`))]
  }),
]

/* ───────── word problems: read, decide, calculate ───────── */
const hours = (h: number) => ((h - 1) % 12) + 1
export const WORD_STYLES: Style[] = [
  style('wp-two', 'שני שלבים', ['wordprob'], 't', (sp, r) => {
    const max = Math.max(10, top(sp)), h = hero(r), s = stuff(r)
    const a = int(r, Math.ceil(max / 4), Math.floor(max / 2)), b = int(r, 1, Math.floor(max / 3)), c = int(r, 1, a + b - 1)
    const ans = a + b - c
    return [`wp2|${a}+${b}-${c}`, pick(r, `ל${h.n} היו ${a} ${s.pl}. ${v(h, 'הוא קיבל', 'היא קיבלה')} עוד ${b}, ואחר כך ${v(h, 'נתן', 'נתנה')} ${c} לחברים. כמה ${s.pl} יש ${v(h, 'לו', 'לה')} עכשיו?`, num(ans), wrongs(r, ans, 3, [a + b, a + b + c]).map(num),
      `קודם קיבל: ${a} + ${b} = ${a + b}. אחר כך נתן: ${a + b} ${M} ${c} = ${ans}.`, h.e ? { kind: 'tile', tile: { e: h.e } } : undefined)]
  }),
  style('wp-money', 'כסף', ['wordprob'], 'h', (sp, r) => {
    const max = Math.max(10, Math.min(100, top(sp))), h = hero(r)
    const has = int(r, Math.ceil(max / 2), max), price = int(r, 1, has - 1)
    const item = one(r, ['גלידה', 'ספר', 'כדור', 'מחברת', 'בלון', 'עפיפון'])
    return [`wpm|${has}-${price}`, pick(r, `ל${h.n} יש ${has} שקלים. ${v(h, 'הוא קנה', 'היא קנתה')} ${item} ב־${price} שקלים. כמה שקלים נשארו ${v(h, 'לו', 'לה')}?`, num(has - price), wrongs(r, has - price, 3, [has + price]).map(num), `${howMinus(has, price)}`, { kind: 'tile', tile: { e: '🪙' } })]
  }),
  style('wp-time', 'מה השעה?', ['wordprob'], 't', (sp, r) => {
    const now = int(r, 1, 11), add = int(r, 2, 5), at = hours(now + add)
    return [`wpt|${now}+${add}`, pick(r, `עכשיו השעה ${now}. בעוד ${add} שעות יתחיל המשחק. באיזו שעה יתחיל המשחק?`, num(at), wrongs(r, at, 3, [hours(now + add + 1), hours(now - add + 12)]).map(num), now + add > 12 ? `${now} + ${add} = ${now + add}. בשעון אחרי 12 מתחילים שוב מ־1, אז השעה ${at}.` : `${now} + ${add} = ${at}.`, { kind: 'tile', tile: { e: '⏰' } })]
  }),
  style('wp-more', 'יותר ממנו', ['wordprob'], 't', (sp, r) => {
    const max = Math.max(10, top(sp)), h1 = hero(r), h2 = hero(r, h1.n), s = stuff(r)
    const a = int(r, 2, Math.floor(max / 2)), b = int(r, 2, max - a)
    return [`wpo|${a}+${b}`, pick(r, `ל${h1.n} יש ${a} ${s.pl}. ל${h2.n} יש ${b} ${s.pl} יותר מ${h1.n}. כמה ${s.pl} יש ל${h2.n}?`, num(a + b), wrongs(r, a + b, 3, [b, Math.abs(a - b)]).map(num), `ל${h2.n} יש כמו ל${h1.n}, ועוד ${b}: ${a} + ${b} = ${a + b}.`)]
  }),
  style('wp-age', 'בן כמה?', ['wordprob'], 'h', (sp, r) => {
    const h = hero(r), age = int(r, 5, 9), d = int(r, 2, 6), older = r() < 0.5, sis = older ? age + d : age - d
    if (sis < 1) return null
    return [`wpa|${age}|${d}|${older}`, pick(r, `${h.n} ${v(h, 'בן', 'בת')} ${age}. האחות של ${h.n} ${older ? 'גדולה' : 'קטנה'} ${v(h, 'ממנו', 'ממנה')} ב־${d} שנים. בת כמה האחות?`, num(sis), wrongs(r, sis, 3, [older ? age - d : age + d].filter((x) => x > 0)).map(num), `${older ? 'גדולה' : 'קטנה'} ב־${d}: ${age} ${older ? '+' : M} ${d} = ${sis}.`)]
  }),
  style('wp-legs', 'כמה רגליים?', ['wordprob', 'times'], 't', (sp, r) => {
    if (top(sp) < 20) return null
    const c = int(r, 1, 4), d = int(r, 1, 3), ans = c * 2 + d * 4
    return [`wpl|${c}|${d}`, pick(r, `בחצר יש ${c} תרנגולות ו־${d} כלבים. כמה רגליים יש לכולם ביחד?`, num(ans), wrongs(r, ans, 3, [c + d, (c + d) * 4]).map(num), `לתרנגולת 2 רגליים: ${c} × 2 = ${c * 2}. לכלב 4: ${d} × 4 = ${d * 4}. ביחד ${ans}.`, { kind: 'row', items: [{ many: { e: '🐔', n: c } }, { many: { e: '🐶', n: d } }] })]
  }),
  style('wp-which', 'מחברים או מחסרים?', ['wordprob', 'plus', 'minus'], 't', (sp, r) => {
    const max = Math.max(10, top(sp)), h = hero(r), s = stuff(r), plus = r() < 0.5
    const a = int(r, Math.ceil(max / 3), max - 2), b = int(r, 1, plus ? Math.max(1, max - a) : a - 1)
    const q = plus ? `ל${h.n} היו ${a} ${s.pl}, ${v(h, 'והוא קיבל', 'והיא קיבלה')} עוד ${b}. איזה תרגיל עוזר לדעת כמה יש ${v(h, 'לו', 'לה')}?` : `ל${h.n} היו ${a} ${s.pl}. ${b} הלכו לאיבוד. איזה תרגיל עוזר לדעת כמה נשארו?`
    const { options, correct } = choices(r, { t: plus ? `${a} + ${b}` : `${a} ${M} ${b}` }, [{ t: plus ? `${a} ${M} ${b}` : `${a} + ${b}` }])
    return [`wpw|${a}|${b}|${plus}`, { kind: 'pick', q: he(q), options, correct, why: he(plus ? `קיבלו עוד, אז מחברים: ${a} + ${b} = ${a + b}.` : `הלכו, נשארו פחות, אז מחסרים: ${a} ${M} ${b} = ${a - b}.`) }]
  }),
]

export const ARITH_STYLES: Style[] = [...PLUS_STYLES, ...MINUS_STYLES, ...TIMES_STYLES, ...DIVIDE_STYLES, ...BIG_STYLES, ...SKIP_STYLES, ...WORD_STYLES]
export type { Hero }
