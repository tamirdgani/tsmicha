/* The topics the curriculum asked for that the year didn't teach yet:
   · clock — reading an analog clock (whole hours → half hours → quarters), and "an hour later"
   · money — shekel coins: how much, paying exactly, change, who has more
   · fraction — halves, quarters and thirds of a pizza or a bar, and half of a group
   · measure — longer/shorter, centimetres on a ruler, cm or metres
   · geometry — sides and corners of flat shapes, their names, and solids
   · graph — reading a bar graph
   · quick — seeing small amounts without counting (dice, ten-frame), pairs that make 10, doubles
   · phon — hearing sounds: blending them into a word, and what's left when one is taken away
   Spec `set` picks the level: clock 'h' hours · 'hh' + halves · 'q' + quarters; measure 'c' compare only · 'cm'. */

import type { Spec } from '../course'
import type { Tile } from '../lessonTypes'
import { SHORT2, SHORT3 } from '../kdata'
import { hero, v } from './ctx'
import { agree, gOf } from './gender'
import { wrongs } from './stylesArith'
import { int, match, one, order, pick, some, style, tapall, type R, type Style } from './util'

const num = (n: number): Tile => ({ g: String(n) })
const tile = (t: Tile): { kind: 'tile'; tile: Tile } => ({ kind: 'tile', tile: t })

/* ───────── clock ───────── */
const HOURS = ['שתים עשרה', 'אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע', 'עשר', 'אחת עשרה', 'שתים עשרה']
const hr = (h: number) => HOURS[((h - 1) % 12) + 1]
/** How a child says a time: "שלוש", "שלוש וחצי", "שלוש ורבע", "רבע לארבע". */
export const say = (h: number, m: number) => (m === 0 ? hr(h) : m === 30 ? `${hr(h)} וחצי` : m === 15 ? `${hr(h)} ורבע` : `רבע ל${hr(h + 1)}`)
const minutesOf = (sp: Spec) => (sp.set === 'q' ? [0, 15, 30, 45] : sp.set === 'hh' ? [0, 30] : [0])
const time = (sp: Spec, r: R): [number, number] => [int(r, 1, 12), one(r, minutesOf(sp))]
const ck = (h: number, m: number): Tile => ({ clock: [h, m] })
const nextT = (h: number, m: number, add: number): [number, number] => { const t = h * 60 + m + add; return [((Math.floor(t / 60) - 1) % 12) + 1, t % 60] }
function clockWhy(h: number, m: number) {
  const hand = m === 0 ? `המחוג הארוך על 12, והקצר על ${h}` : m === 30 ? `המחוג הארוך על 6: חצי שעה. הקצר בין ${h} ל־${(h % 12) + 1}` : m === 15 ? `המחוג הארוך על 3: רבע שעה אחרי ${h}` : `המחוג הארוך על 9: עוד רבע שעה ו${hr(h + 1)}`
  return `${hand}. השעה ${say(h, m)}.`
}
export const CLOCK_STYLES: Style[] = [
  style('ck-read', 'מה השעה?', ['clock'], 'e', (sp, r) => {
    const [h, m] = time(sp, r)
    const o = [...new Set([say(h % 12 + 1, m), m === 0 ? say(h === 6 ? 12 : 12 - h, 0) : say(h, m === 30 ? 0 : 30), say(h === 1 ? 12 : h - 1, m)])].filter((x) => x !== say(h, m)).slice(0, 2)
    return [`ckr|${h}:${m}`, pick(r, 'מה השעה?', { t: say(h, m) }, o.map((t) => ({ t })), clockWhy(h, m), tile(ck(h, m)))]
  }),
  style('ck-pick', 'איזה שעון?', ['clock'], 'h', (sp, r) => {
    const [h, m] = time(sp, r)
    // the classic mix-up: the hands swapped, or one hour off
    const swapped: [number, number] = m === 0 && h !== 12 ? [12, h * 5 % 60] : [h % 12 + 1, m]
    const o = [swapped, [h === 1 ? 2 : h - 1, m] as [number, number]].filter(([a, b]) => !(a === h && b === m))
    return [`ckp|${h}:${m}`, pick(r, `איזה שעון מראה ${say(h, m)}?`, ck(h, m), o.map(([a, b]) => ck(a, b)), clockWhy(h, m))]
  }),
  style('ck-later', 'בעוד שעה', ['clock', 'wordprob'], 't', (sp, r) => {
    const [h, m] = time(sp, r), add = sp.set === 'h' || !sp.set ? 60 * int(r, 1, 3) : one(r, [30, 60, 90])
    const [h2, m2] = nextT(h, m, add), label = add === 30 ? 'חצי שעה' : add === 60 ? 'שעה' : add === 90 ? 'שעה וחצי' : add === 120 ? 'שעתיים' : `${add / 60} שעות`
    const o = [nextT(h, m, add + 60), nextT(h, m, Math.max(30, add - 60))].map(([a, b]) => say(a, b)).filter((x) => x !== say(h2, m2))
    return [`ckl|${h}:${m}+${add}`, pick(r, `עכשיו השעה ${say(h, m)}. מה תהיה השעה בעוד ${label}?`, { t: say(h2, m2) }, [...new Set(o)].map((t) => ({ t })), `${say(h, m)}, ועוד ${label}: ${say(h2, m2)}.`, tile(ck(h, m)))]
  }),
  style('ck-match', 'שעון ושעה', ['clock'], 'h', (sp, r) => {
    const ts: [number, number][] = []
    for (let i = 0; i < 30 && ts.length < 3; i++) { const t = time(sp, r); if (!ts.some(([a, b]) => a === t[0] && b === t[1])) ts.push(t) }
    if (ts.length < 3) return null
    return [`ckm|${ts.map((t) => t.join(':')).sort().join()}`, match('מחברים כל שעון לשעה שלו', ts.map(([h, m]) => [ck(h, m), { t: say(h, m) }]), 'מסתכלים קודם על המחוג הקצר: הוא אומר את השעה.')]
  }),
  style('ck-day', 'מתי עושים את זה?', ['clock'], 'e', (_sp, r) => {
    const acts: [string, number][] = [['אוכלים ארוחת בוקר', 7], ['הולכים לישון', 8], ['אוכלים ארוחת צהריים', 1], ['מתעוררים בבוקר', 7]]
    const [a, h] = one(r, acts)
    const night = a.includes('לישון')
    return [`ckd|${a}`, pick(r, `${a} בערך בשעה ${hr(h)}. איזה שעון מתאים?`, ck(h, 0), [ck(h === 7 ? 10 : 4, 0), ck(h === 1 ? 6 : 12, 0)], `השעה ${hr(h)}${night ? ' בערב' : ''}: המחוג הקצר על ${h}.`)]
  }),
]

/* ───────── money ───────── */
const COINS = [1, 2, 5, 10]
function purse(r: R, total: number): number[] {
  const out: number[] = []
  let left = total
  while (left > 0) { const c = one(r, COINS.filter((x) => x <= left)); out.push(c); left -= c }
  return out.sort((a, b) => b - a)
}
const coinsWhy = (cs: number[]) => `${cs.join(' + ')} = ${cs.reduce((a, b) => a + b, 0)} שקלים.`
export const MONEY_STYLES: Style[] = [
  style('mo-sum', 'כמה כסף?', ['money'], 'e', (sp, r) => {
    const total = int(r, 4, Math.min(sp.max ?? 20, 30)), cs = purse(r, total)
    if (cs.length > 6) return null
    return [`mos|${cs.join()}`, pick(r, 'כמה שקלים יש כאן?', num(total), wrongs(r, total, 3, [cs.length]).map(num), `סופרים מהמטבע הגדול: ${coinsWhy(cs)}`, tile({ coins: cs }))]
  }),
  style('mo-pay', 'משלמים בדיוק', ['money'], 'h', (sp, r) => {
    const price = int(r, 4, Math.min(sp.max ?? 20, 25)), right = purse(r, price)
    const w1 = purse(r, price + one(r, [1, 2])), w2 = purse(r, price - one(r, [1, 2]))
    if (right.length > 5 || w1.length > 5 || w2.length > 5) return null
    const item = one(r, ['גלידה', 'ספר', 'כדור', 'עפיפון', 'מחברת'])
    return [`mop|${price}|${right.join()}`, pick(r, `${item} עולה ${price} שקלים. באיזה ארנק יש בדיוק ${price}?`, { coins: right }, [{ coins: w1 }, { coins: w2 }], coinsWhy(right))]
  }),
  style('mo-change', 'עודף', ['money', 'wordprob'], 't', (sp, r) => {
    const paid = one(r, (sp.max ?? 20) >= 50 ? [10, 20, 50] : [5, 10]), price = int(r, 2, paid - 1), h = hero(r)
    return [`moc|${paid}-${price}`, pick(r, `${h.n} ${v(h, 'קנה', 'קנתה')} ממתק ב־${price} שקלים, ${v(h, 'ושילם', 'ושילמה')} ${paid} שקלים. כמה עודף ${v(h, 'יקבל', 'תקבל')}?`, num(paid - price), wrongs(r, paid - price, 3, [paid + price]).map(num), `עודף זה מה שמחזירים: ${paid} − ${price} = ${paid - price}.`, paid <= 10 ? tile({ coins: [paid] }) : undefined)]
  }),
  style('mo-more', 'למי יותר כסף?', ['money'], 't', (sp, r) => {
    const [a, b] = some(r, Array.from({ length: Math.min(sp.max ?? 20, 25) - 3 }, (_, i) => i + 4), 2)
    // a trap: the poorer purse has more coins
    const many = purse(r, Math.min(a, b)).flatMap((c) => (c === 10 ? [5, 5] : c === 5 ? [2, 2, 1] : [c])), few = purse(r, Math.max(a, b))
    if (many.length > 7 || few.length > 5 || a === b) return null
    const h1 = hero(r), h2 = hero(r, h1.n)
    return [`mom|${a}|${b}`, pick(r, `ל${h1.n} יש את הארנק הראשון, ול${h2.n} את השני. למי יש יותר שקלים?`, { coins: few, t: h2.n }, [{ coins: many, t: h1.n }], `לא סופרים מטבעות, סופרים שקלים: ${coinsWhy(few)} זה יותר מ־${Math.min(a, b)}.`)]
  }),
  style('mo-fewest', 'הכי מעט מטבעות', ['money'], 't', (sp, r) => {
    const total = int(r, 6, Math.min(sp.max ?? 20, 28))
    let left = total, n = 0
    for (const c of [10, 5, 2, 1]) while (left >= c) { left -= c; n++ }
    return [`mof|${total}`, pick(r, `מה הכי מעט מטבעות שצריך כדי לשלם ${total} שקלים?`, num(n), wrongs(r, n, 3, [n + 1]).filter((x) => x > 0).map(num), 'מתחילים מהמטבע הכי גדול שאפשר: 10, אחר כך 5, 2 ו־1.')]
  }),
]

/* ───────── fractions ───────── */
const FR_NAME: Record<string, string> = { '1/2': 'חצי', '1/4': 'רבע', '1/3': 'שליש', '3/4': 'שלושה רבעים', '2/3': 'שני שלישים', '2/4': 'חצי' }
const FRACS: [number, number][] = [[1, 2], [1, 4], [1, 3], [3, 4], [2, 3]]
/** Which parts the lesson teaches: `set` '24' (first grade: halves and quarters) or '234' (second grade adds thirds). */
const dens = (sp: Spec) => [...(sp.set ?? '24')].map(Number)
const frName = (d: number) => (d === 2 ? 'חצי' : d === 4 ? 'רבע' : 'שליש')
export const FRACTION_STYLES: Style[] = [
  style('fr-name', 'איזה חלק?', ['fraction'], 'e', (sp, r) => {
    const ok = FRACS.filter(([, d]) => dens(sp).includes(d))
    const [n, d] = one(r, ok), kind = one(r, ['pie', 'bar'] as const), name = FR_NAME[`${n}/${d}`]
    const o = some(r, [...new Set(ok.map(([a, b]) => FR_NAME[`${a}/${b}`]))].filter((x) => x !== name), 2)
    return [`frn|${n}/${d}|${kind}`, pick(r, 'איזה חלק צבוע?', { t: name }, o.map((t) => ({ t })), `חילקו ל־${d} חלקים שווים, וצבעו ${n === 1 ? 'אחד' : n}: ${name}.`, tile({ frac: [n, d, kind] }))]
  }),
  style('fr-equal', 'חלקים שווים', ['fraction'], 'h', (sp, r) => {
    const d = one(r, dens(sp)), name = frName(d), kind = one(r, ['pie', 'bar'] as const)
    return [`fre|${d}|${kind}`, pick(r, `באיזו תמונה צבוע ${name} באמת?`, { frac: [1, d, kind] }, [{ frac: [1, d, kind, true] }, { frac: [1, d === 2 ? one(r, dens(sp).filter((x) => x !== 2)) : 2, kind] }], `${name} זה רק כשכל החלקים שווים בגודל.`)]
  }),
  style('fr-of', 'חצי מ...', ['fraction'], 't', (sp, r) => {
    const d = one(r, [2, ...dens(sp)]), k = int(r, 2, 4), total = d * k, name = frName(d)
    const e = one(r, ['🍪', '🍓', '🎈', '⭐'])
    return [`fro|${d}|${total}`, pick(r, `כמה זה ${name} מ־${total}?`, num(k), wrongs(r, k, 3, [total - k, d]).filter((x) => x > 0).map(num), `מחלקים ${total} ל־${d} קבוצות שוות: בכל קבוצה ${k}.`, { kind: 'pile', e, n: total })]
  }),
  style('fr-bigger', 'מה יותר?', ['fraction'], 't', (sp, r) => {
    const [a, b] = one(r, ([[[1, 2], [1, 4]], [[1, 2], [1, 3]], [[1, 3], [1, 4]], [[3, 4], [1, 2]]] as [number, number][][]).filter((pr) => pr.every(([, d]) => dens(sp).includes(d))))
    const flip = r() < 0.5
    return [`frb|${a.join('/')}|${b.join('/')}|${flip}`, pick(r, `מה יותר פיצה: ${FR_NAME[a.join('/')]} או ${FR_NAME[b.join('/')]}?`, { frac: [a[0], a[1], 'pie'], t: FR_NAME[a.join('/')] }, [{ frac: [b[0], b[1], 'pie'], t: FR_NAME[b.join('/')] }], a[0] === 1 && b[0] === 1 ? 'כשמחלקים לפחות חלקים, כל חלק גדול יותר!' : `${FR_NAME[a.join('/')]} זה יותר מחצי פיצה.`)]
  }),
]

/* ───────── measuring ───────── */
const UNITS: [string, 'cm' | 'm'][] = [['עיפרון', 'cm'], ['מחק', 'cm'], ['ספר', 'cm'], ['כף', 'cm'], ['נעל', 'cm'], ['דלת', 'm'], ['אוטובוס', 'm'], ['בריכה', 'm'], ['עץ', 'm'], ['מגרש כדורגל', 'm']]
const BAR_COLORS = ['#ffc83d', '#6db7ff', '#9ad98a', '#ff8fab']
export const MEASURE_STYLES: Style[] = [
  style('ms-longer', 'מה יותר ארוך?', ['measure', 'size'], 'e', (_sp, r) => {
    const [a, b] = some(r, [4, 6, 8, 10, 12, 14], 2), long = r() < 0.5
    const [ca, cb] = some(r, BAR_COLORS, 2)
    const right = long ? Math.max(a, b) : Math.min(a, b), wrong = long ? Math.min(a, b) : Math.max(a, b)
    return [`msl|${a}|${b}|${long}`, pick(r, long ? 'איזה פס יותר ארוך?' : 'איזה פס יותר קצר?', { bar: { len: right, color: ca } }, [{ bar: { len: wrong, color: cb } }], 'מסתכלים איפה כל פס נגמר: שניהם מתחילים באותו מקום.')]
  }),
  style('ms-order', 'מהקצר לארוך', ['measure', 'size'], 'h', (_sp, r) => {
    const ls = some(r, [3, 5, 7, 9, 11, 13], 3).sort((a, b) => a - b)
    return [`mso|${ls.join()}`, order('מסדרים את הפסים מהקצר לארוך', ls.map((len, i) => ({ bar: { len, color: BAR_COLORS[i] } })), 'הקצר ביותר ראשון, הארוך ביותר אחרון.')]
  }),
  style('ms-cm', 'כמה סנטימטרים?', ['measure'], 'h', (sp, r) => {
    if (sp.set === 'c') return null
    const len = int(r, 3, 14)
    return [`msc|${len}`, pick(r, 'כמה סנטימטרים ארוך הפס? מתחילים מ־0!', num(len), wrongs(r, len, 3, [len + 1]).filter((x) => x > 0).map(num), `הפס מתחיל ב־0 ונגמר ב־${len}: ${len} סנטימטרים.`, tile({ bar: { len, ruler: true, color: one(r, BAR_COLORS) } }))]
  }),
  style('ms-diff', 'בכמה יותר ארוך?', ['measure'], 't', (sp, r) => {
    if (sp.set === 'c') return null
    const [a, b] = some(r, [4, 6, 7, 9, 11, 13], 2).sort((x, y) => y - x)
    return [`msd|${a}|${b}`, pick(r, `פס אחד ארוך ${a} סנטימטרים, והשני ${b}. בכמה הראשון ארוך יותר?`, num(a - b), wrongs(r, a - b, 3, [a + b]).map(num), `${a} − ${b} = ${a - b === 1 ? 'סנטימטר אחד' : `${a - b} סנטימטרים`}.`)]
  }),
  style('ms-unit', 'סנטימטרים או מטרים?', ['measure'], 't', (sp, r) => {
    if (sp.set === 'c') return null
    const [w, u] = one(r, UNITS), f = gOf(w) === 'f'
    return [`msu|${w}`, pick(r, `במה כדאי למדוד ${w}?`, { t: u === 'cm' ? 'בסנטימטרים' : 'במטרים' }, [{ t: u === 'cm' ? 'במטרים' : 'בסנטימטרים' }], u === 'cm' ? `${w} ${f ? 'קטנה' : 'קטן'}: מודדים בסנטימטרים, כמו על הסרגל.` : `${w} ${f ? 'גדולה' : 'גדול'} מאוד: מודדים במטרים. מטר אחד זה 100 סנטימטרים.`)]
  }),
]

/* ───────── shapes and solids ───────── */
const POLY: { p: Tile['poly']; name: string; sides: number }[] = [
  { p: 'tri', name: 'משולש', sides: 3 }, { p: 'sq', name: 'ריבוע', sides: 4 }, { p: 'rect', name: 'מלבן', sides: 4 }, { p: 'pent', name: 'מחומש', sides: 5 }, { p: 'hex', name: 'משושה', sides: 6 },
]
const SOLIDS: { k: Tile['solid']; name: string; like: string }[] = [
  { k: 'cube', name: 'קובייה', like: 'קוביית משחק' }, { k: 'sphere', name: 'כדור', like: 'תפוז' }, { k: 'cylinder', name: 'גליל', like: 'פחית שתייה' },
  { k: 'cone', name: 'חרוט', like: 'גביע גלידה' }, { k: 'pyramid', name: 'פירמידה', like: 'הפירמידות במצרים' },
]
export const GEOMETRY_STYLES: Style[] = [
  style('ge-sides', 'כמה צלעות?', ['geometry', 'shapes'], 'e', (_sp, r) => {
    const x = one(r, POLY), corners = r() < 0.5
    return [`ges|${x.p}|${corners}`, pick(r, corners ? 'כמה קודקודים (פינות) יש לצורה?' : 'כמה צלעות יש לצורה?', num(x.sides), wrongs(r, x.sides, 3).filter((k) => k >= 2).map(num), `ל${x.name} יש ${x.sides} צלעות ו־${x.sides} קודקודים.`, tile({ poly: x.p }))]
  }),
  style('ge-name', 'איך קוראים לצורה?', ['geometry', 'shapes'], 'h', (_sp, r) => {
    const x = one(r, POLY), o = some(r, POLY.filter((y) => y.name !== x.name && !(x.sides === 4 && y.sides === 4)), 2)
    return [`gen|${x.p}`, pick(r, 'איך קוראים לצורה הזאת?', { t: x.name }, o.map((y) => ({ t: y.name })), `יש לה ${x.sides} צלעות: ${x.name}.${x.p === 'rect' ? ' במלבן הצלעות שמול זו לזו שוות.' : ''}`, tile({ poly: x.p }))]
  }),
  style('ge-tap', 'מסמנים לפי צלעות', ['geometry', 'shapes'], 't', (_sp, r) => {
    const k = one(r, [3, 4]), rights = POLY.filter((x) => x.sides === k), wr = POLY.filter((x) => x.sides !== k)
    return [`get|${k}`, tapall(r, `מסמנים את כל הצורות שיש להן ${k} צלעות`, rights.map((x) => ({ poly: x.p })), [...wr.map((x) => ({ poly: x.p })), { poly: 'circle' as const }], `${rights.map((x) => x.name).join(' ו')}: ${k} צלעות. לעיגול אין צלעות בכלל.`)]
  }),
  style('ge-solid', 'איזה גוף?', ['geometry'], 'h', (_sp, r) => {
    const x = one(r, SOLIDS), o = some(r, SOLIDS.filter((y) => y !== x), 2)
    return [`geo|${x.k}`, pick(r, 'איך קוראים לגוף הזה?', { t: x.name }, o.map((y) => ({ t: y.name })), `${agree(x.name, 'זה', 'זאת')} ${x.name}, כמו ${x.like}.`, tile({ solid: x.k }))]
  }),
  style('ge-like', 'למה זה דומה?', ['geometry'], 't', (_sp, r) => {
    const x = one(r, SOLIDS), o = some(r, SOLIDS.filter((y) => y !== x), 2)
    return [`gel|${x.k}`, pick(r, `לאיזה גוף ${agree(x.like, 'דומה', 'דומה', 'דומות')} ${x.like}?`, { solid: x.k }, o.map((y) => ({ solid: y.k })), `${x.like} ${agree(x.like, 'נראה', 'נראית', 'נראות')} כמו ${x.name}.`)]
  }),
]

/* ───────── bar graphs ───────── */
const VOTES: { title: string; items: { e: string; w: string }[] }[] = [
  { title: 'איזה פרי הכי אוהבים?', items: [{ e: '🍎', w: 'תפוח' }, { e: '🍌', w: 'בננה' }, { e: '🍓', w: 'תות' }, { e: '🍇', w: 'ענבים' }] },
  { title: 'איזו חיה הכי אוהבים?', items: [{ e: '🐶', w: 'כלב' }, { e: '🐱', w: 'חתול' }, { e: '🐰', w: 'ארנב' }, { e: '🐟', w: 'דג' }] },
  { title: 'איך הכי כיף לנסוע לטיול?', items: [{ e: '🚌', w: 'אוטובוס' }, { e: '🚗', w: 'מכונית' }, { e: '🚲', w: 'אופניים' }, { e: '🚂', w: 'רכבת' }] },
]
function poll(r: R) {
  const v0 = one(r, VOTES), items = some(r, v0.items, 3), ns = some(r, [2, 3, 4, 5, 6, 7, 8, 9], 3)
  return { v0, items: items.map((x, i) => ({ ...x, n: ns[i] })) }
}
export const GRAPH_STYLES: Style[] = [
  style('gp-most', 'מה הכי הרבה?', ['graph'], 'e', (_sp, r) => {
    const { v0, items } = poll(r), most = r() < 0.6, top = [...items].sort((a, b) => (most ? b.n - a.n : a.n - b.n))[0]
    return [`gpm|${items.map((x) => x.w + x.n).join()}|${most}`, pick(r, `שאלו ילדים: ${v0.title} מה קיבל ${most ? 'הכי הרבה' : 'הכי מעט'} קולות?`, { e: top.e }, items.filter((x) => x !== top).map((x) => ({ e: x.e })), `העמודה של ה${top.w} ${most ? 'הכי גבוהה' : 'הכי נמוכה'}: ${top.n}.`, { kind: 'bars', items })]
  }),
  style('gp-how', 'כמה בחרו?', ['graph'], 'h', (_sp, r) => {
    const { v0, items } = poll(r), x = one(r, items)
    return [`gph|${items.map((y) => y.w + y.n).join()}|${x.w}`, pick(r, `${v0.title} כמה ילדים בחרו ב${x.w}?`, num(x.n), wrongs(r, x.n, 3).filter((k) => k > 0).map(num), `מסתכלים על ראש העמודה של ה${x.w}, ומשם ימינה למספר: ${x.n}.`, { kind: 'bars', items })]
  }),
  style('gp-diff', 'בכמה יותר?', ['graph'], 't', (_sp, r) => {
    const { v0, items } = poll(r), [a, b] = [...items].sort((p, q) => q.n - p.n)
    return [`gpd|${items.map((y) => y.w + y.n).join()}`, pick(r, `${v0.title} בכמה יותר ילדים בחרו ב${a.w} מאשר ב${b.w}?`, num(a.n - b.n), wrongs(r, a.n - b.n, 3, [a.n + b.n]).filter((k) => k >= 0).map(num), `${a.n} − ${b.n} = ${a.n - b.n}.`, { kind: 'bars', items })]
  }),
  style('gp-total', 'כמה ילדים בסך הכל?', ['graph'], 't', (_sp, r) => {
    const { v0, items } = poll(r), sum = items.reduce((s, x) => s + x.n, 0)
    return [`gpt|${items.map((y) => y.w + y.n).join()}`, pick(r, `${v0.title} כמה ילדים ענו בסך הכל?`, num(sum), wrongs(r, sum, 3).map(num), `${items.map((x) => x.n).join(' + ')} = ${sum}.`, { kind: 'bars', items })]
  }),
]

/* ───────── seeing amounts quickly; pairs that make ten ───────── */
export const QUICK_STYLES: Style[] = [
  style('qk-dice', 'כמה נקודות?', ['quick', 'count'], 'e', (_sp, r) => {
    const n = int(r, 2, 6)
    return [`qkd|${n}`, pick(r, 'כמה נקודות? מנסים לראות בלי לספור!', num(n), [...new Set([...wrongs(r, n, 2), n - 1, n + 1, n - 2])].filter((k) => k > 0 && k <= 6 && k !== n).slice(0, 2).map(num), `זאת הצורה של ${n} בקובייה.`, tile({ dice: [n] }))]
  }),
  style('qk-dice2', 'שתי קוביות', ['quick', 'add'], 'h', (_sp, r) => {
    const a = int(r, 1, 6), b = int(r, 1, 6)
    return [`qk2|${Math.min(a, b)}|${Math.max(a, b)}`, pick(r, 'כמה נקודות בשתי הקוביות ביחד?', num(a + b), wrongs(r, a + b, 3).map(num), a === b ? `${a} ועוד ${a} זה ${a + b}: כפולים!` : `רואים ${Math.max(a, b)} בלי לספור, וממשיכים: ${Math.max(a, b)} ועוד ${Math.min(a, b)} זה ${a + b}.`, tile({ dice: [a, b] }))]
  }),
  style('qk-frame', 'מסגרת עשר', ['quick', 'count'], 'h', (_sp, r) => {
    const n = int(r, 3, 9), missing = r() < 0.5
    return [`qkf|${n}|${missing}`, pick(r, missing ? 'כמה ריבועים ריקים? כמה חסר עד 10?' : 'כמה עיגולים יש במסגרת?', num(missing ? 10 - n : n), wrongs(r, missing ? 10 - n : n, 3).filter((k) => k >= 0 && k <= 10).map(num), n >= 5 ? `שורה מלאה זה 5, ועוד ${n - 5}: ${n}. חסרים ${10 - n} עד 10.` : `יש ${n}, וחסרים ${10 - n} עד 10.`, tile({ frame: n }))]
  }),
  style('qk-bonds', 'זוגות של 10', ['quick', 'add'], 't', (_sp, r) => {
    const as = some(r, [1, 2, 3, 4, 6, 7, 8, 9], 3)
    return [`qkb|${[...as].sort().join()}`, match('מחברים כל מספר לחבר שלו, שביחד עושים 10', as.map((a) => [{ frame: a }, num(10 - a)]), as.map((a) => `${a} + ${10 - a} = 10`).join(' · '))]
  }),
]

/* ───────── hearing sounds ───────── */
const BLEND = [...SHORT2, ...SHORT3]
/** Take the first sound away and another word is left. */
const DROP: [string, string, string, string][] = [['כלב', '🐶', 'לב', '❤️'], ['חלב', '🥛', 'לב', '❤️'], ['דגל', '🇮🇱', 'גל', '🌊'], ['ספר', '📖', 'פר', '🐂']]
export const PHON_STYLES: Style[] = [
  style('ph-blend', 'מחברים צלילים', ['phon', 'firstsound'], 'e', (_sp, r) => {
    const w = one(r, BLEND), o = some(r, BLEND.filter((x) => x !== w && x.w.length === w.w.length), 2)
    return [`phb|${w.w}`, pick(r, `ההורה אומר לאט: ${[...w.w].join('... ')}. מה יוצא?`, { e: w.e }, o.map((x) => ({ e: x.e })), `${[...w.w].join(' + ')}: ${w.w}!`, { kind: 'tile', tile: { g: [...w.w].join(' · ') } })]
  }),
  style('ph-drop', 'מורידים צליל', ['phon', 'firstsound'], 't', (_sp, r) => {
    const [w, e, rest, e2] = one(r, DROP), o = some(r, DROP.filter((x) => x[2] !== rest), 2)
    return [`phd|${w}`, pick(r, `אומרים "${w}" בלי הצליל הראשון. מה נשאר?`, { e: e2, t: rest }, o.map((x) => ({ e: x[3], t: x[2] })), `${w} בלי ${w[0]}: ${rest}!`, tile({ e, t: w }))]
  }),
  style('ph-first-last', 'צליל ראשון או אחרון', ['phon'], 'h', (_sp, r) => {
    const w = one(r, BLEND), last = r() < 0.5, l = last ? w.w.at(-1)! : w.w[0]
    const o = some(r, [...'אבגדהזלמנסרשת'].filter((x) => !w.w.includes(x)), 2)
    return [`phf|${w.w}|${last}`, pick(r, `מה הצליל ה${last ? 'אחרון' : 'ראשון'} במילה "${w.w}"?`, { g: l }, o.map((g) => ({ g })), `"${w.w}" ${last ? 'נגמרת' : 'מתחילה'} ב־${l}.`, tile({ e: w.e }))]
  }),
]

/* ───────── mixed operations (second grade) ───────── */
export const MIXED_STYLES: Style[] = [
  style('wp-mix', 'כפל וחיבור', ['wordprob', 'times'], 't', (sp, r) => {
    if ((sp.max ?? 10) <= 100 && sp.s !== 'times') return null
    const packs = int(r, 2, 5), per = int(r, 3, 8), h = hero(r), total = packs * per
    // [containers, things, what happened to some, what was added]
    const thing = one(r, [
      ['חבילות', 'ביצים', 'נשברו', 'קנו עוד'], ['קופסאות', 'עוגיות', 'נאכלו', 'אפו עוד'], ['שקיות', 'תפוחים', 'נפלו', 'קטפו עוד'],
      ['מגירות', 'גרביים', 'נעלמו', 'קיבלו עוד'], ['צנצנות', 'סוכריות', 'חולקו', 'הוסיפו עוד'], ['שורות', 'כיסאות', 'נשברו', 'הביאו עוד'],
      ['ענפים', 'פרחים', 'נבלו', 'צמחו עוד'], ['מדפים', 'ספרים', 'הושאלו', 'הגיעו עוד'], ['ארגזים', 'כדורים', 'התפוצצו', 'קנו עוד'],
    ])
    if (r() < 0.5) {
      const gone = int(r, 2, per), ans = total - gone
      return [`wpx|${packs}x${per}-${gone}`, pick(r, `${h.n} ${v(h, 'קנה', 'קנתה')} ${packs} ${thing[0]}, ובכל אחת ${per} ${thing[1]}. ${gone} ${thing[1]} ${thing[2]}. כמה ${thing[1]} נשארו?`, num(ans), wrongs(r, ans, 3, [total, packs + per - gone]).map(num), `קודם כפל: ${packs} × ${per} = ${total}. אחר כך חיסור: ${total} − ${gone} = ${ans}.`)]
    }
    const more = int(r, 2, 9), ans = total + more
    return [`wpx|${packs}x${per}+${more}`, pick(r, `היו ${packs} ${thing[0]}, ובכל אחת ${per} ${thing[1]}. אחר כך ${thing[3]} ${more} ${thing[1]}. כמה ${thing[1]} יש עכשיו?`, num(ans), wrongs(r, ans, 3, [total, packs + per + more]).map(num), `קודם כפל: ${packs} × ${per} = ${total}. אחר כך חיבור: ${total} + ${more} = ${ans}.`)]
  }),
]

export const TOPIC_STYLES: Style[] = [...CLOCK_STYLES, ...MONEY_STYLES, ...FRACTION_STYLES, ...MEASURE_STYLES, ...GEOMETRY_STYLES, ...GRAPH_STYLES, ...QUICK_STYLES, ...PHON_STYLES, ...MIXED_STYLES]
