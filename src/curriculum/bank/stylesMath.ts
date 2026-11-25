/* Question styles for numbers: counting, digits, more and less, order, adding and taking away.
   Every style keeps inside the lesson's range (`max`, `min`), so a "count to 3" lesson never shows 8. */

import type { Spec } from '../course'
import type { Tile } from '../lessonTypes'
import { KIDS } from '../kdata'
import { LEGS } from './data'
import { choices, he, int, match, mix, near, one, order, pick, range, some, style, tapall, type Style } from './util'

const EMO = ['🍎', '⭐', '🐶', '🎈', '🐟', '🚗', '🍪', '🐥', '🌸', '⚽', '🍓', '🐞', '🦋', '🧁', '🍌', '🐸']
const top = (sp: Spec, d = 5) => sp.max ?? d
const num = (n: number): Tile => ({ g: String(n) })
const nums = (a: number[]) => a.map(num)
const grp = (e: string, n: number): Tile => ({ many: { e, n } })

/** Everyday numbers: how many wheels, eyes, legs on a chair… */
const LIFE: [string, string, number][] = [
  ['🚲', 'כמה גלגלים יש לאופניים?', 2], ['🚗', 'כמה גלגלים יש למכונית?', 4], ['👀', 'כמה עיניים יש לנו?', 2], ['👃', 'כמה אף יש לנו?', 1],
  ['✋', 'כמה אצבעות יש ביד אחת?', 5], ['🪑', 'כמה רגליים יש לכיסא?', 4], ['🚦', 'כמה אורות יש ברמזור?', 3], ['📅', 'כמה ימים יש בשבוע?', 7],
  ['🐦', 'כמה כנפיים יש לציפור?', 2], ['🌈', 'כמה צבעים יש בקשת?', 7], ['☀️', 'כמה שמשות יש בשמיים?', 1], ['🍀', 'כמה עלים יש לתלתן הזה?', 4],
]

export const COUNT_STYLES: Style[] = [
  style('cnt-pile', 'כמה יש?', ['count'], 'e', (sp, r) => {
    const max = top(sp), n = int(r, 1, max), e = one(r, EMO)
    return [`cnt-pile|${e}|${n}`, pick(r, `כמה ${e} יש?`, num(n), nums(near(r, n, 2, Math.max(max, 3), 1)), `סופרים: ${range(1, n).join(', ')}. יש ${n}!`, { kind: 'pile', e, n })]
  }),
  style('cnt-match', 'מחברים קבוצה למספר', ['count', 'numrec'], 'h', (sp, r) => {
    const ns = some(r, range(1, top(sp)), 3), e = one(r, EMO)
    return [`cnt-match|${e}|${[...ns].sort().join()}`, match('מחברים כל קבוצה למספר שלה', ns.map((k) => [grp(e, k), num(k)]), 'סופרים לאט, אחד־אחד.')]
  }),
  style('cnt-only', 'סופרים רק אותם', ['count'], 't', (sp, r) => {
    const [a, b] = some(r, EMO, 2), max = Math.max(4, top(sp))
    const na = int(r, 2, Math.min(max, 6)), nb = int(r, 2, 4)
    const wrong = [na + nb, ...near(r, na, 2, na + nb + 1, 1).filter((k) => k !== na + nb)].slice(0, 2)
    return [`cnt-only|${a}|${na}`, pick(r, `כמה ${a} יש? סופרים רק אותם!`, num(na), nums(wrong), `יש ${na} ${a}. את ה${b} לא סופרים.`, { kind: 'row', items: mix(r, [...Array(na).fill(a), ...Array(nb).fill(b)]).map((e) => ({ e })) })]
  }),
  style('cnt-groups', 'קבוצות שוות', ['count', 'add'], 't', (sp, r) => {
    if (top(sp) < 6) return null
    const g = int(r, 2, 3), each = int(r, 2, 3), e = one(r, ['🎈', '🍪', '⭐', '🍓', '🐟'])
    return [`cnt-groups|${g}x${each}`, pick(r, `יש ${g === 2 ? 'שני' : 'שלושה'} ילדים, ולכל אחד ${each} ${e}. כמה ${e} יש ביחד?`, num(g * each), nums(near(r, g * each, 2, 10, 1)), `${Array(g).fill(each).join(' ועוד ')} זה ${g * each}.`, { kind: 'row', items: Array.from({ length: g }, () => grp(e, each)) })]
  }),
  style('cnt-which', 'באיזו קבוצה יש בדיוק?', ['count', 'moreless'], 'h', (sp, r) => {
    const max = top(sp), n = int(r, 2, max), e = one(r, EMO)
    return [`cnt-which|${n}|${e}`, pick(r, `באיזו קבוצה יש בדיוק ${n}?`, grp(e, n), near(r, n, 2, max + 1, 1).map((k) => grp(e, k)), `סופרים כל קבוצה. כאן יש ${n}.`)]
  }),
  style('cnt-tap', 'מסמנים קבוצות של מספר', ['count'], 'h', (sp, r) => {
    const max = top(sp), n = int(r, 2, max)
    const es = some(r, EMO, 5)
    const others = near(r, n, 3, max + 1, 1)
    if (others.length < 2) return null
    return [`cnt-tap|${n}`, tapall(r, `מסמנים את כל הקבוצות שיש בהן ${n}`, [grp(es[0], n), grp(es[1], n)], others.map((k, i) => grp(es[2 + i], k)), `שתי קבוצות עם ${n}, כל אחת בתמונה אחרת.`)]
  }),
  style('cnt-legs', 'כמה רגליים?', ['count', 'riddle'], 't', (sp, r) => {
    const pool = LEGS.filter((x) => x.n <= Math.max(top(sp), 4))
    const a = one(r, pool)
    return [`cnt-legs|${a.w}`, pick(r, `כמה רגליים יש ל${a.w}?`, num(a.n), nums(some(r, [0, 2, 4, 6, 8].filter((k) => k !== a.n && k <= Math.max(top(sp), 4)), 2)), a.n ? `ל${a.w} יש ${a.n} רגליים.` : `ל${a.w} אין רגליים בכלל!`, { kind: 'tile', tile: { e: a.e } })]
  }),
  style('cnt-fingers', 'כמה אצבעות?', ['count'], 'e', (sp, r) => {
    const hands = [['☝️', 1], ['✌️', 2], ['🖐️', 5]].filter(([, n]) => (n as number) <= top(sp)) as [string, number][]
    if (!hands.length) return null
    const [e, n] = one(r, hands)
    return [`cnt-fingers|${n}`, pick(r, 'כמה אצבעות מורמות? מרימים גם אנחנו!', num(n), nums(near(r, n, 2, 6, 1)), `${n} אצבעות. עכשיו נסו אתם!`, { kind: 'tile', tile: { e } })]
  }),
  style('cnt-ten', 'כמה חסר עד 10?', ['count', 'add'], 't', (sp, r) => {
    if (top(sp) < 10) return null
    const n = int(r, 5, 9)
    return [`cnt-ten|${n}`, pick(r, `יש ${n} ⭐. כמה עוד צריך כדי שיהיו 10?`, num(10 - n), nums(near(r, 10 - n, 2, 6, 1)), `${n} ועוד ${10 - n} זה 10.`, { kind: 'pile', e: '⭐', n })]
  }),
  style('cnt-life', 'מספרים מסביבנו', ['count', 'numrec', 'riddle'], 't', (sp, r) => {
    const pool = LIFE.filter(([, , n]) => n <= Math.max(top(sp), 5))
    const [e, q, n] = one(r, pool)
    return [`cnt-life|${q}`, pick(r, q, num(n), nums(near(r, n, 2, 8, 1)), `התשובה: ${n}.`, { kind: 'tile', tile: { e } })]
  }),
]

export const NUMREC_STYLES: Style[] = [
  style('nr-find', 'איפה המספר?', ['numrec'], 'e', (sp, r) => {
    const lo = sp.min ?? 1, hi = top(sp), n = int(r, lo, hi)
    const others = near(r, n, 2, Math.max(hi, 3), Math.max(0, lo - 2))
    return [`nr-find|${n}|${others.sort().join()}`, pick(r, `איפה המספר ${n}?`, num(n), nums(others), `זה ${n}!`)]
  }),
  style('nr-amount', 'כמות לפי מספר', ['numrec'], 'e', (sp, r) => {
    const lo = sp.min ?? 1, hi = top(sp), n = int(r, lo, hi), e = one(r, ['🔵', '🟢', '🍓', '⭐', '🐞'])
    return [`nr-amount|${n}`, pick(r, 'איפה יש בדיוק כמו המספר?', grp(e, n), near(r, n, 2, hi + 1, 1).map((k) => grp(e, k)), `המספר ${n}: ${n} ${e}.`, { kind: 'tile', tile: num(n) })]
  }),
  style('nr-match', 'מספר וכמות', ['numrec'], 'h', (sp, r) => {
    const lo = sp.min ?? 1, hi = top(sp), e = one(r, ['🔵', '🟢', '🍓', '⭐', '🐞'])
    const ns = some(r, range(lo, hi), 3)
    if (ns.length < 3) return null
    return [`nr-match|${[...ns].sort().join()}`, match('מחברים מספר לכמות', ns.map((k) => [num(k), grp(e, k)]), 'כל מספר והכמות שלו.')]
  }),
  style('nr-between', 'מה בין שני מספרים?', ['numrec', 'numorder'], 't', (sp, r) => {
    const hi = Math.max(6, top(sp)), n = int(r, 2, hi - 1)
    return [`nr-between|${n}`, pick(r, `איזה מספר נמצא בין ${n - 1} ל־${n + 1}?`, num(n), nums([n - 1, n + 1]), `${n - 1}, ${n}, ${n + 1}.`, { kind: 'row', items: [num(n - 1), { t: '?' }, num(n + 1)] })]
  }),
  style('nr-max', 'המספר הכי גדול', ['numrec', 'moreless'], 't', (sp, r) => {
    const ns = some(r, range(1, Math.max(6, top(sp))), 3), m = Math.max(...ns)
    return [`nr-max|${[...ns].sort().join()}`, pick(r, 'איזה מספר הכי גדול?', num(m), nums(ns.filter((k) => k !== m)), `${m} הכי גדול.`)]
  }),
  style('nr-min', 'המספר הכי קטן', ['numrec', 'moreless'], 'h', (sp, r) => {
    const ns = some(r, range(1, Math.max(5, top(sp))), 3), m = Math.min(...ns)
    return [`nr-min|${[...ns].sort().join()}`, pick(r, 'איזה מספר הכי קטן?', num(m), nums(ns.filter((k) => k !== m)), `${m} הכי קטן.`)]
  }),
  style('nr-tap', 'מסמנים את כל המספר', ['numrec'], 'h', (sp, r) => {
    const LOOK: Record<number, number[]> = { 1: [7, 4], 2: [5, 7], 3: [8, 5], 4: [1, 9], 5: [2, 6], 6: [9, 8], 7: [1, 2], 8: [3, 0], 9: [6, 4], 10: [1, 0], 0: [8, 6] }
    const lo = sp.min ?? 1, hi = top(sp), n = int(r, lo, Math.min(hi, 9))
    const look = LOOK[n] ?? [n + 1, n + 2]
    return [`nr-tap|${n}`, tapall(r, `מסמנים את כל ה־${n}. יש כאן מספרים דומים!`, [num(n), num(n), num(n)], nums([...look, look[0]]), `שלושה ${n}. ה־${look[0]} רק דומה.`)]
  }),
  style('nr-mirror', 'איזה מספר כתוב נכון?', ['numrec', 'trace'], 'h', (sp, r) => {
    const pool = [2, 3, 4, 5, 7].filter((k) => k >= (sp.min ?? 1) && k <= Math.max(5, top(sp)))
    const n = one(r, pool)
    return [`nr-mirror|${n}`, pick(r, `איזה ${n} כתוב נכון? שניים הפוכים!`, num(n), [{ g: String(n), fx: 'flip' }, { g: String(n), fx: 'tilt' }], `ככה כותבים ${n}. כשכותבים, שמים לב לאיזה צד הוא פונה.`)]
  }),
]

const STORY_ADD = [
  (a: number, b: number, e: string) => `לפיקו היו ${a} ${e}, וקיבל עוד ${b}. כמה יש לו עכשיו?`,
  (a: number, b: number) => `על העץ ישבו ${a} 🐦. הגיעו עוד ${b}. כמה ציפורים יש עכשיו?`,
  (a: number, b: number) => `בסל היו ${a} 🍎. אבא הוסיף עוד ${b}. כמה תפוחים בסל?`,
  (a: number, b: number) => `בבריכה שחו ${a} 🦆, ועוד ${b} קפצו פנימה. כמה ברווזים בבריכה?`,
]
const STORY_SUB = [
  (a: number, b: number) => `היו ${a} 🎈. ${b} עפו לשמיים. כמה בלונים נשארו?`,
  (a: number, b: number) => `בצלחת היו ${a} 🍪. אכלנו ${b}. כמה עוגיות נשארו?`,
  (a: number, b: number) => `על הגדר ישבו ${a} 🐦. ${b} עפו משם. כמה נשארו?`,
  (a: number, b: number) => `באוטובוס נסעו ${a} ילדים. ${b} ירדו בתחנה. כמה נשארו באוטובוס?`,
]
export const ADD_STYLES: Style[] = [
  style('ad-pile', 'כמה ביחד?', ['add'], 'e', (sp, r) => {
    const max = top(sp), a = int(r, 1, Math.max(1, max - 1)), b = int(r, 1, Math.max(1, max - a)), e = one(r, EMO)
    return [`ad-pile|${a}+${b}`, pick(r, `כמה ${e} יש ביחד?`, num(a + b), nums(near(r, a + b, 3, max + 2, 1)), `${a} ועוד ${b} זה ${a + b}.`, { kind: 'sum', e, a, b, op: '+' })]
  }),
  style('ad-story', 'סיפור חיבור', ['add'], 'h', (sp, r) => {
    const max = top(sp), a = int(r, 1, Math.max(1, max - 1)), b = int(r, 1, Math.max(1, max - a)), e = one(r, EMO)
    const tell = one(r, STORY_ADD)
    return [`ad-story|${a}+${b}`, pick(r, tell(a, b, e), num(a + b), nums(near(r, a + b, 3, max + 2, 1)), `${a} ועוד ${b} זה ${a + b}.`)]
  }),
  style('ad-missing', 'כמה עוד צריך?', ['add'], 't', (sp, r) => {
    const max = Math.max(5, top(sp)), total = int(r, 4, max), a = int(r, 1, total - 1), b = total - a
    return [`ad-missing|${a}+?=${total}`, pick(r, `יש ${a} 🍎. כמה עוד צריך כדי שיהיו ${total}?`, num(b), nums(near(r, b, 2, max, 0)), `${a} ועוד ${b} זה ${total}.`, { kind: 'row', items: [grp('🍎', a), { e: '➕' }, { t: '?' }, { e: '🟰' }, num(total)] })]
  }),
  style('ad-share', 'מחלקים שווה בשווה', ['add', 'logic'], 't', (sp, r) => {
    if (top(sp) < 6) return null
    const kids = int(r, 2, 3), each = int(r, 2, 3), total = kids * each
    return [`ad-share|${total}/${kids}`, pick(r, `יש ${total} עוגיות ל־${kids} ילדים. כל אחד מקבל אותו דבר. כמה לכל ילד?`, num(each), nums(near(r, each, 2, 6, 1)), `מחלקים אחת־אחת: כל ילד מקבל ${each}.`, { kind: 'pile', e: '🍪', n: total })]
  }),
  style('ad-expr', 'איזה תרגיל?', ['add'], 't', (sp, r) => {
    const max = Math.max(4, top(sp)), s = int(r, 3, max), a = int(r, 2, s - 1)
    const wrong = [`${a} + ${s - a + 1}`, `${Math.max(1, a - 1)} + ${s - a}`]
    const { options, correct } = choices(r, { t: `${a} + ${s - a}` }, wrong.map((t) => ({ t })))
    return [`ad-expr|${s}`, { kind: 'pick', q: he(`איזה תרגיל יוצא בדיוק ${s}?`), show: { kind: 'tile', tile: num(s) }, options, correct, why: he(`${a} ועוד ${s - a} זה ${s}.`) }]
  }),
  style('ad-match', 'מחברים תרגיל לתשובה', ['add'], 'h', (sp, r) => {
    const max = Math.max(5, top(sp)), sums = some(r, range(2, max), 3)
    return [`ad-match|${[...sums].sort().join()}`, match('מחברים כל תרגיל לתשובה שלו', sums.map((s) => { const a = int(r, 1, s - 1); return [{ t: `${a} + ${s - a}` }, num(s)] }), 'סופרים על האצבעות, ומוצאים את התשובה.')]
  }),
  style('ad-double', 'כפולים', ['add'], 'h', (sp, r) => {
    const n = int(r, 1, Math.floor(Math.max(4, top(sp)) / 2)), e = one(r, ['🖐️', '🍪', '🐞', '⭐'])
    return [`ad-double|${n}`, pick(r, `${n} ועוד ${n}. כמה זה?`, num(2 * n), nums(near(r, 2 * n, 2, 10, 1)), `${n} ועוד ${n} זה ${2 * n}. כפולים!`, { kind: 'row', items: [grp(e, n), { e: '➕' }, grp(e, n)] })]
  }),
  style('ad-hands', 'שתי ידיים', ['add', 'count'], 't', (sp, r) => {
    if (top(sp) < 10) return null
    return ['ad-hands|10', pick(r, 'בכל יד יש 5 אצבעות. כמה אצבעות יש בשתי ידיים?', num(10), nums([5, 8, 12]), '5 ועוד 5 זה 10.', { kind: 'row', items: [{ e: '🖐️' }, { e: '➕' }, { e: '🖐️' }] })]
  }),
]

export const SUB_STYLES: Style[] = [
  style('sb-pile', 'כמה נשארו?', ['sub'], 'e', (sp, r) => {
    const max = top(sp), a = int(r, 2, max), b = int(r, 1, a - 1), e = one(r, ['🎈', '🍪', '🐟', '🍎', '🧁'])
    return [`sb-pile|${a}-${b}`, pick(r, `היו ${a}, הורדנו ${b}. כמה נשארו?`, num(a - b), nums(near(r, a - b, 3, max, 0)), `${a} פחות ${b} זה ${a - b}.`, { kind: 'sum', e, a, b, op: '-' })]
  }),
  style('sb-story', 'סיפור חיסור', ['sub'], 'h', (sp, r) => {
    const max = top(sp), a = int(r, 2, max), b = int(r, 1, a - 1)
    return [`sb-story|${a}-${b}`, pick(r, one(r, STORY_SUB)(a, b), num(a - b), nums(near(r, a - b, 3, max, 0)), `${a} פחות ${b} זה ${a - b}.`)]
  }),
  style('sb-compare', 'בכמה יותר?', ['sub', 'moreless'], 't', (sp, r) => {
    const max = Math.max(5, top(sp)), [x, y] = some(r, KIDS, 2)
    const na = int(r, 3, max), nb = int(r, 1, na - 1), d = na - nb
    const wrong = [...new Set([na + nb <= 12 ? na + nb : d + 2, ...near(r, d, 3, max, 0)])].filter((k) => k !== d).slice(0, 2)
    return [`sb-compare|${na}-${nb}`, pick(r, `ל${x.n} יש ${na} מדבקות ול${y.n} יש ${nb}. בכמה יש ל${x.n} יותר?`, num(d), nums(wrong), `${na} פחות ${nb} זה ${d}.`, { kind: 'row', items: [grp('⭐', na), grp('⭐', nb)] })]
  }),
  style('sb-eaten', 'כמה אכלו?', ['sub'], 't', (sp, r) => {
    const max = Math.max(4, top(sp)), a = int(r, 3, max), c = int(r, 1, a - 1)
    return [`sb-eaten|${a}>${c}`, pick(r, `בקערה היו ${a} 🍓. עכשיו נשארו רק אלה. כמה תותים אכלו?`, num(a - c), nums(near(r, a - c, 2, max, 1).concat(c).filter((k, i, s) => k !== a - c && s.indexOf(k) === i).slice(0, 2)), `היו ${a}, נשארו ${c}. אכלו ${a - c}.`, { kind: 'pile', e: '🍓', n: c })]
  }),
  style('sb-expr', 'איזה תרגיל חיסור?', ['sub'], 't', (sp, r) => {
    const max = Math.max(5, top(sp)), d = int(r, 1, max - 2), a = int(r, d + 1, max)
    const { options, correct } = choices(r, { t: `${a} − ${a - d}` }, [{ t: `${a} − ${Math.max(0, a - d - 1)}` }, { t: `${a} + ${a - d}` }])
    return [`sb-expr|${d}`, { kind: 'pick', q: he(`איזה תרגיל יוצא בדיוק ${d}?`), show: { kind: 'tile', tile: num(d) }, options, correct, why: he(`${a} פחות ${a - d} זה ${d}.`) }]
  }),
  style('sb-hide', 'כמה מתחבאים?', ['sub', 'add'], 't', (sp, r) => {
    const max = Math.max(4, top(sp)), a = int(r, 3, max), v = int(r, 1, a - 1)
    return [`sb-hide|${a}|${v}`, pick(r, `יש ${a} ⚽ בסך הכול. חלק מתחבאים בקופסה. כמה בתוך הקופסה?`, num(a - v), nums(near(r, a - v, 2, max, 0).filter((k) => k !== v).concat(v).slice(0, 2)), `רואים ${v}, ובסך הכול ${a}. אז בקופסה ${a - v}.`, { kind: 'row', items: [grp('⚽', v), { e: '➕' }, { e: '📦' }] })]
  }),
  style('sb-zero', 'לא נשאר כלום', ['sub'], 'h', (sp, r) => {
    const n = int(r, 2, Math.max(3, top(sp)))
    return [`sb-zero|${n}`, pick(r, `היו ${n} 🍓, ואכלנו את כולם! כמה נשארו?`, num(0), nums([1, n]), `${n} פחות ${n} זה 0. לא נשאר כלום!`, { kind: 'sum', e: '🍓', a: n, b: n, op: '-' })]
  }),
]

export const ORDER_STYLES: Style[] = [
  style('no-up', 'מהקטן לגדול', ['numorder'], 'e', (sp, r) => {
    const max = top(sp), len = Math.min(4, max), st = int(r, 1, Math.max(1, max - len + 1))
    return [`no-up|${st}|${len}`, order('מסדרים את המספרים מהקטן לגדול', range(st, st + len - 1).map(num), 'המספרים עולים: כל אחד גדול באחד.')]
  }),
  style('no-down', 'מהגדול לקטן', ['numorder'], 'h', (sp, r) => {
    const max = top(sp), len = Math.min(4, max), st = int(r, len, max)
    return [`no-down|${st}`, order('סופרים אחורה, כמו לפני שיגור טיל 🚀', range(st - len + 1, st).reverse().map(num), 'כל מספר קטן באחד מזה שלפניו.')]
  }),
  style('no-after', 'מה בא אחרי?', ['numorder'], 'e', (sp, r) => {
    const n = int(r, 1, top(sp) - 1)
    return [`no-after|${n}`, pick(r, `איזה מספר בא אחרי ${n}?`, num(n + 1), nums(near(r, n + 1, 3, top(sp), 0).filter((k) => k !== n).slice(0, 2)), `אחרי ${n} בא ${n + 1}.`)]
  }),
  style('no-before', 'מה בא לפני?', ['numorder'], 'h', (sp, r) => {
    const n = int(r, 2, top(sp))
    return [`no-before|${n}`, pick(r, `איזה מספר בא לפני ${n}?`, num(n - 1), nums(near(r, n - 1, 3, top(sp), 0).filter((k) => k !== n).slice(0, 2)), `לפני ${n} בא ${n - 1}.`)]
  }),
  style('no-gap', 'מה חסר בתור?', ['numorder'], 't', (sp, r) => {
    const max = Math.max(6, top(sp)), st = int(r, 1, max - 4), gap = int(r, 1, 2)
    const seq = range(st, st + 3), ans = seq[gap]
    return [`no-gap|${st}|${gap}`, pick(r, 'איזה מספר חסר בתור?', num(ans), nums([ans + 2, ans - 2 > 0 ? ans - 2 : ans + 3]), seq.join(', '), { kind: 'row', items: seq.map((n, i) => (i === gap ? { t: '?' } : num(n))) })]
  }),
  style('no-frog', 'הצפרדע קופצת', ['numorder', 'add'], 't', (sp, r) => {
    const max = Math.max(6, top(sp)), n = int(r, 1, max - 3), k = int(r, 1, 2)
    return [`no-frog|${n}|${k}`, pick(r, `הצפרדע 🐸 עומדת על ${n} וקופצת ${k === 1 ? 'צעד אחד' : 'שני צעדים'} קדימה. על איזה מספר היא נוחתת?`, num(n + k), nums([n + k + 1, n]), `${n}, ואז ${range(n + 1, n + k).join(', ')}. היא על ${n + k}!`, { kind: 'row', items: range(n, Math.min(max, n + 4)).map(num) })]
  }),
  style('no-neighbors', 'השכנים של המספר', ['numorder'], 'h', (sp, r) => {
    const n = int(r, 2, Math.max(3, top(sp) - 1))
    return [`no-neighbors|${n}`, pick(r, `מי השכנים של ${n}? אחד לפניו ואחד אחריו`, { t: `${n - 1} ו־${n + 1}` }, [{ t: `${n} ו־${n + 1}` }, { t: `${Math.max(0, n - 2)} ו־${n + 2}` }], `${n - 1}, ${n}, ${n + 1}.`, { kind: 'tile', tile: num(n) })]
  }),
]

export const MORE_STYLES: Style[] = [
  style('ml-pick', 'איפה יותר?', ['moreless'], 'e', (sp, r) => {
    const max = top(sp), e = one(r, ['🍪', '🎈', '🐟', '⭐', '🍓']), a = int(r, 1, max)
    let b = int(r, 1, max); while (b === a) b = int(r, 1, max)
    const more = r() < 0.6
    const opts = mix(r, [a, b])
    return [`ml-pick|${Math.min(a, b)}|${Math.max(a, b)}|${more}`, { kind: 'pick', q: he(more ? 'איפה יש יותר?' : 'איפה יש פחות?'), options: opts.map((n) => grp(e, n)), correct: opts.indexOf(more ? Math.max(a, b) : Math.min(a, b)), why: he(`${Math.max(a, b)} זה יותר מ־${Math.min(a, b)}.`) }]
  }),
  style('ml-same', 'איפה אותו מספר?', ['moreless', 'count'], 'h', (sp, r) => {
    const max = top(sp), n = int(r, 2, max), [a, b] = some(r, EMO, 2)
    return [`ml-same|${n}`, pick(r, 'איפה יש בדיוק אותו מספר כמו כאן? התמונות שונות!', grp(b, n), near(r, n, 2, max + 1, 1).map((k) => grp(b, k)), `גם כאן וגם שם יש ${n}.`, { kind: 'tile', tile: grp(a, n) })]
  }),
  style('ml-digits', 'איזה מספר גדול יותר?', ['moreless', 'numrec'], 'h', (sp, r) => {
    const [a, b] = some(r, range(1, Math.max(5, top(sp))), 2), more = r() < 0.5
    return [`ml-digits|${Math.min(a, b)}|${Math.max(a, b)}|${more}`, pick(r, more ? 'איזה מספר גדול יותר?' : 'איזה מספר קטן יותר?', num(more ? Math.max(a, b) : Math.min(a, b)), [num(more ? Math.min(a, b) : Math.max(a, b))], `${Math.max(a, b)} גדול מ־${Math.min(a, b)}.`)]
  }),
  style('ml-even', 'כמה לתת כדי שיהיה שווה?', ['moreless'], 't', (sp, r) => {
    const max = Math.max(5, top(sp)), a = int(r, 2, max - 1), b = Math.min(max, a + int(r, 1, 3)), e = one(r, ['🍪', '🎈', '🐟'])
    const [x, y] = some(r, KIDS, 2)
    return [`ml-even|${a}|${b}`, pick(r, `ל${x.n} יש ${a} ${e}, ול${y.n} יש ${b}. כמה צריך לתת ל${x.n} כדי שיהיה להם אותו דבר?`, num(b - a), nums(near(r, b - a, 2, 5, 1)), `${a} ועוד ${b - a} זה ${b}. עכשיו שווה!`, { kind: 'row', items: [grp(e, a), { e: '⚖️' }, grp(e, b)] })]
  }),
  style('ml-who', 'למי יש יותר?', ['moreless'], 't', (sp, r) => {
    const max = top(sp), [x, y] = some(r, KIDS, 2), a = int(r, 1, max)
    let b = int(r, 1, max); while (b === a) b = int(r, 1, max)
    const more = r() < 0.5, win = (more ? a > b : a < b) ? x : y
    return [`ml-who|${a}|${b}|${more}`, pick(r, `ל${x.n} יש ${a} 🎈 ול${y.n} יש ${b} 🎈. למי יש ${more ? 'יותר' : 'פחות'}?`, { t: win.n }, [{ t: win === x ? y.n : x.n }], `${Math.max(a, b)} זה יותר מ־${Math.min(a, b)}.`)]
  }),
  style('ml-tap', 'מסמנים קבוצות גדולות', ['moreless', 'count'], 't', (sp, r) => {
    if (top(sp) < 5) return null
    const max = top(sp), k = int(r, 2, max - 2), e = one(r, EMO)
    const bigs = some(r, range(k + 1, max), 2), smalls = some(r, range(1, k), 3)
    return [`ml-tap|${k}`, tapall(r, `מסמנים את כל הקבוצות שיש בהן יותר מ־${k}`, bigs.map((n) => grp(e, n)), smalls.map((n) => grp(e, n)), `רק בקבוצות האלה יש יותר מ־${k}.`)]
  }),
]

export const MATH_STYLES: Style[] = [...COUNT_STYLES, ...NUMREC_STYLES, ...ADD_STYLES, ...SUB_STYLES, ...ORDER_STYLES, ...MORE_STYLES]
