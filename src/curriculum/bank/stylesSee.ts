/* Question styles for looking and thinking: colors, shapes, sizes, places, odd one out, patterns, sorting, logic. */

import type { Shape, Tile } from '../lessonTypes'
import { ANALOGIES, CATS, COLORS, CORNERS, CRITTERS, KIDS, ODD_PROPS, PLACES, PROP_SORTS, SHAPES, SORT_PAIRS, SORT_PAIRS_HARD, type Pic } from '../kdata'
import { GOES, HABITAT, JOBS, OPPOSITES, POCKET, PRODUCTS, REAL_SIZE, ROOMS, VEHICLE_WAY, WEIGHT } from './data'
import { he, int, match, mix, nice, one, order, pick, picTile, some, sort, style, tapall, type Style } from './util'

const FEM = new Set(['ג׳ירפה', 'פרה', 'אבן', 'לבנה', 'דלעת', 'נוצה', 'ציפור', 'נמלה', 'לטאה', 'ביצה', 'רכבת', 'מכונית'])
const big = (w: string) => (FEM.has(w) ? 'גדולה' : 'גדול')

const PL: Record<string, string> = { אדום: 'אדומים', כחול: 'כחולים', צהוב: 'צהובים', ירוק: 'ירוקים', כתום: 'כתומים', סגול: 'סגולים', ורוד: 'ורודים', חום: 'חומים' }
/** More things of each color, for "tap all the red things". */
const COLOR_THINGS: Record<string, string[]> = {
  אדום: ['🍎', '🍓', '🚒', '🍒', '🌹', '🍅', '🐞'], כחול: ['🫐', '🐳', '💙', '🧢', '🦋', '🚙'], צהוב: ['🍌', '🌻', '⭐', '🍋', '🐥', '🧀'],
  ירוק: ['🥒', '🐸', '🍀', '🥦', '🐢', '🍏'], כתום: ['🥕', '🍊', '🏀', '🦊', '🎃', '🦁'], סגול: ['🍇', '🍆', '💜', '☂️', '🔮'],
  ורוד: ['🐷', '🌸', '🎀', '🦩', '🩰', '🍬'], חום: ['🐻', '🌰', '🪵', '🍫', '🐴', '🥔'],
}
const col = (n: string) => COLORS.find((c) => c.n === n)!
const dot = (c: string, t?: string): Tile => ({ shape: 'circle', color: c, t })
/** Things everybody knows the color of — shown as a black shadow, so the child has to remember. */
const KNOWN_COLOR: [string, string, string][] = [
  ['🌿', 'דשא', 'ירוק'], ['🥕', 'גזר', 'כתום'], ['🍓', 'תות', 'אדום'], ['🍇', 'ענבים', 'סגול'], ['🐷', 'חזיר', 'ורוד'], ['🐻', 'דוב', 'חום'],
  ['🐸', 'צפרדע', 'ירוק'], ['🍋', 'לימון', 'צהוב'], ['🚒', 'כבאית', 'אדום'], ['🍫', 'שוקולד', 'חום'], ['🦩', 'פלמינגו', 'ורוד'],
  ['🍆', 'חציל', 'סגול'], ['🍊', 'תפוז', 'כתום'], ['🐳', 'לווייתן', 'כחול'], ['🍌', 'בננה', 'צהוב'], ['🥒', 'מלפפון', 'ירוק'],
]
const MIX: [string, string, string, string, string, string][] = [ // a, colorA, b, colorB, result, colorResult
  ['צהוב', '#ffc83d', 'כחול', '#1d70d8', 'ירוק', '#2e9a48'], ['אדום', '#e5383b', 'צהוב', '#ffc83d', 'כתום', '#f77f00'],
  ['אדום', '#e5383b', 'כחול', '#1d70d8', 'סגול', '#8b5cf6'], ['אדום', '#e5383b', 'לבן', '#ffffff', 'ורוד', '#ff8fab'],
  ['שחור', '#222222', 'לבן', '#ffffff', 'אפור', '#9a9a9a'],
]
const RAINBOW = ['אדום', 'כתום', 'צהוב', 'ירוק', 'כחול', 'סגול']

export const COLOR_STYLES: Style[] = [
  style('col-find', 'איפה הצבע?', ['colors'], 'e', (_sp, r) => {
    const set = some(r, COLORS, 3)
    return [`col-find|${set.map((c) => c.n).join()}`, pick(r, `איפה הצבע ה${set[0].n}?`, dot(set[0].c), set.slice(1).map((c) => dot(c.c)), `זה ${set[0].n}!`)]
  }),
  style('col-thing', 'מה בצבע הזה?', ['colors'], 'e', (_sp, r) => {
    const [a, ...rest] = some(r, COLORS, 3)
    const thing = one(r, COLOR_THINGS[a.n])
    return [`col-thing|${a.n}|${thing}`, pick(r, `מה בצבע ${a.n}?`, { e: thing }, rest.map((c) => ({ e: one(r, COLOR_THINGS[c.n]) })), `נכון, זה ${a.n}.`, { kind: 'tile', tile: dot(a.c) })]
  }),
  style('col-not', 'מה לא בצבע הזה?', ['colors'], 'h', (_sp, r) => {
    const [a, b] = some(r, COLORS, 2)
    const ins = some(r, COLOR_THINGS[a.n], 3), out = one(r, COLOR_THINGS[b.n])
    return [`col-not|${a.n}`, pick(r, `מה לא ${a.n}?`, { e: out }, ins.map((e) => ({ e })), `כל השאר ${PL[a.n]}, וזה ${b.n}.`)]
  }),
  style('col-tap', 'מסמנים את כל הצבע', ['colors'], 'h', (_sp, r) => {
    const [a, b, c] = some(r, COLORS, 3)
    const k = int(r, 2, 3)
    return [`col-tap|${a.n}`, tapall(r, `מסמנים את כל הדברים ה${PL[a.n]}`, some(r, COLOR_THINGS[a.n], k).map((e) => ({ e })), [...some(r, COLOR_THINGS[b.n], 2), one(r, COLOR_THINGS[c.n])].map((e) => ({ e })), `יש כאן ${k} דברים ${PL[a.n]}.`)]
  }),
  style('col-match', 'מחברים צבע לדבר', ['colors'], 'h', (_sp, r) => {
    const set = some(r, COLORS, 3)
    return [`col-match|${set.map((c) => c.n).sort().join()}`, match('מחברים כל צבע לדבר באותו צבע', set.map((c) => [dot(c.c), { e: one(r, COLOR_THINGS[c.n]) }]), 'כל צבע מצא את החבר שלו!')]
  }),
  style('col-shadow', 'באיזה צבע הוא באמת?', ['colors'], 't', (_sp, r) => {
    const [e, w, n] = one(r, KNOWN_COLOR)
    const others = some(r, COLORS.filter((c) => c.n !== n), 2)
    return [`col-shadow|${w}`, pick(r, `זה הצל של ה${w}. באיזה צבע ה${w} באמת?`, dot(col(n).c, n), others.map((c) => dot(c.c, c.n)), `ה${w}: ${n}!`, { kind: 'tile', tile: { e, fx: 'sil' } })]
  }),
  style('col-mix', 'מערבבים צבעים', ['colors'], 't', (_sp, r) => {
    const [a, ca, b, cb, c, cc] = one(r, MIX)
    const other = one(r, COLORS.filter((x) => ![a, b, c].includes(x.n)))
    return [`col-mix|${c}`, pick(r, `מערבבים ${a} עם ${b}. איזה צבע יוצא?`, dot(cc, c), [dot(ca === '#ffffff' ? cb : ca, ca === '#ffffff' ? b : a), dot(other.c, other.n)], `${a} ו${b} ביחד עושים ${c}!`, { kind: 'row', items: [dot(ca), { e: '➕' }, dot(cb)], ask: true })]
  }),
  style('col-rainbow', 'צבעי הקשת לפי הסדר', ['colors'], 't', (_sp, r) => {
    const start = int(r, 0, 2)
    const cs = RAINBOW.slice(start, start + 4)
    return [`col-rainbow|${start}`, order('מסדרים את צבעי הקשת, כמו בשמיים 🌈', cs.map((n) => dot(col(n).c, n)), `בקשת: ${RAINBOW.join(', ')}.`)]
  }),
  style('col-count', 'כמה עיגולים בצבע?', ['colors'], 't', (_sp, r) => {
    const [a, b, c] = some(r, COLORS, 3)
    const na = int(r, 2, 4)
    const row = mix(r, [...Array(na).fill(a.c), ...Array(int(r, 2, 3)).fill(b.c), ...Array(int(r, 1, 2)).fill(c.c)]).map((x) => dot(x))
    return [`col-count|${a.n}|${na}`, pick(r, `כמה עיגולים ${PL[a.n]} יש? סופרים רק אותם!`, { g: String(na) }, [{ g: String(row.length) }, { g: String(na === 2 ? 3 : na - 1) }], `יש ${na} עיגולים ${PL[a.n]}.`, { kind: 'row', items: row })]
  }),
  style('col-light', 'הרמזור', ['colors', 'social'], 'h', (_sp, r) => {
    const q = one(r, [['באיזה אור ברמזור מותר לחצות את הכביש?', 'ירוק', 'בירוק חוצים, ותמיד מסתכלים לצדדים.'], ['באיזה אור ברמזור עומדים ומחכים?', 'אדום', 'באדום עוצרים ומחכים.']] as const)
    const right = col(q[1])
    const others = [col(q[1] === 'ירוק' ? 'אדום' : 'ירוק'), col('צהוב')]
    return [`col-light|${q[1]}`, pick(r, q[0], dot(right.c, right.n), others.map((c) => dot(c.c, c.n)), q[2], { kind: 'tile', tile: { e: '🚦' } })]
  }),
]

const SHAPE_PL: Record<string, string> = { circle: 'העיגולים', square: 'הריבועים', triangle: 'המשולשים', rect: 'המלבנים', star: 'הכוכבים', heart: 'הלבבות' }
const SHAPE_RIDDLE: Record<string, string> = {
  triangle: 'יש לי שלוש צלעות ושלוש פינות.', square: 'יש לי ארבע צלעות, וכולן באותו אורך.', circle: 'אין לי אף פינה, ואני מתגלגל.',
  rect: 'יש לי ארבע צלעות: שתיים ארוכות ושתיים קצרות.', star: 'יש לי חמישה חודים, ואני מנצנץ בלילה.', heart: 'אני הצורה של אהבה.',
}
const blue = '#4da3ff'
const shp = (s: string, color = blue): Tile => ({ shape: s as Shape, color })

export const SHAPE_STYLES: Style[] = [
  style('sh-name', 'איזו צורה זאת?', ['shapes'], 'e', (_sp, r) => {
    const set = some(r, SHAPES, 3)
    return [`sh-name|${set.map((x) => x.s).join()}`, pick(r, 'איזו צורה זאת?', { t: set[0].n }, set.slice(1).map((x) => ({ t: x.n })), `זה ${set[0].n}.`, { kind: 'tile', tile: shp(set[0].s, one(r, COLORS).c) })]
  }),
  style('sh-find', 'איפה הצורה?', ['shapes'], 'e', (_sp, r) => {
    const set = some(r, SHAPES, 4), c = one(r, COLORS).c
    return [`sh-find|${set.map((x) => x.s).join()}`, pick(r, `איפה ה${set[0].n}?`, shp(set[0].s, c), set.slice(1).map((x) => shp(x.s, c)), `הנה ה${set[0].n}!`)]
  }),
  style('sh-like', 'מה דומה לצורה?', ['shapes'], 'h', (_sp, r) => {
    const set = some(r, SHAPES, 4)
    const e = one(r, set[0].e)
    return [`sh-like|${set[0].s}|${e}`, pick(r, `מה דומה ל${set[0].n}?`, { e }, set.slice(1).map((x) => ({ e: one(r, x.e) })), `נכון, זה בצורת ${set[0].n}.`, { kind: 'tile', tile: shp(set[0].s) })]
  }),
  style('sh-corners', 'כמה פינות?', ['shapes'], 't', (_sp, r) => {
    const s = one(r, CORNERS)
    return [`sh-corners|${s.s}`, pick(r, `כמה פינות יש ל${s.n}? סופרים עם האצבע`, { g: String(s.k) }, some(r, [0, 2, 3, 4, 5].filter((k) => k !== s.k), 2).map((k) => ({ g: String(k) })), s.k ? `ל${s.n} יש ${s.k} פינות.` : 'לעיגול אין פינות בכלל!', { kind: 'tile', tile: shp(s.s) })]
  }),
  style('sh-tap', 'מסמנים את כל הצורות', ['shapes'], 'h', (_sp, r) => {
    const [a, ...rest] = some(r, SHAPES, 3)
    const k = int(r, 2, 3)
    const cs = some(r, COLORS, 6)
    return [`sh-tap|${a.s}`, tapall(r, `מסמנים את כל ${SHAPE_PL[a.s]}, בכל הצבעים`, Array.from({ length: k }, (_, i) => shp(a.s, cs[i].c)), [shp(rest[0].s, cs[3].c), shp(rest[1].s, cs[4].c), shp(rest[0].s, cs[5].c)], `יש ${k}. הצבע לא משנה, רק הצורה!`)]
  }),
  style('sh-count', 'כמה צורות בשורה?', ['shapes'], 't', (_sp, r) => {
    const [a, b, c] = some(r, SHAPES.filter((x) => x.s !== 'rect'), 3)
    const na = int(r, 2, 4)
    const row = mix(r, [...Array(na).fill(a.s), ...Array(2).fill(b.s), c.s]).map((s) => shp(s, one(r, COLORS).c))
    return [`sh-count|${a.s}|${na}`, pick(r, `כמה ${SHAPE_PL[a.s].slice(1)} יש בשורה?`, { g: String(na) }, [{ g: String(na + 1) }, { g: String(row.length) }], `יש ${na} ${SHAPE_PL[a.s].slice(1)}.`, { kind: 'row', items: row })]
  }),
  style('sh-match', 'מחברים צורה לדבר', ['shapes'], 'h', (_sp, r) => {
    const set = some(r, SHAPES, 3)
    return [`sh-match|${set.map((x) => x.s).sort().join()}`, match('לאיזו צורה כל דבר דומה?', set.map((s) => [shp(s.s), { e: one(r, s.e) }]), 'יש צורות בכל מקום מסביבנו!')]
  }),
  style('sh-riddle', 'חידת צורה', ['shapes'], 't', (_sp, r) => {
    const set = some(r, SHAPES, 3)
    return [`sh-riddle|${set[0].s}`, pick(r, `${SHAPE_RIDDLE[set[0].s]} איזו צורה אני?`, shp(set[0].s, '#f4a261'), set.slice(1).map((x) => shp(x.s, '#f4a261')), `זה ה${set[0].n}!`)]
  }),
  style('sh-odd', 'איזו צורה שונה?', ['shapes', 'odd'], 'e', (_sp, r) => {
    const [a, b] = some(r, SHAPES, 2)
    const cs = some(r, COLORS, 4)
    return [`sh-odd|${a.s}|${b.s}`, pick(r, 'איזו צורה שונה מכל האחרות?', shp(b.s, cs[3].c), [0, 1, 2].map((i) => shp(a.s, cs[i].c)), `כולם ${a.n}, רק אחד ${b.n}.`)]
  }),
  style('sh-roll', 'מה מתגלגל?', ['shapes'], 'h', (_sp, r) => {
    const round = some(r, ['⚽', '🍊', '🏀', '🛞', '🍩'], 1)[0]
    return [`sh-roll|${round}`, pick(r, 'מה יתגלגל הכי טוב במורד?', { e: round }, some(r, ['🎁', '📦', '🧊', '📕', '🧱'], 2).map((e) => ({ e })), 'דברים עגולים מתגלגלים. לדברים עם פינות קשה להתגלגל!')]
  }),
]

const THINGS = ['🐘', '🐶', '🍎', '🚗', '🎈', '⭐', '🐟', '🌳', '🐢', '🏠', '🌸', '🧸', '🚀', '🍩']
export const SIZE_STYLES: Style[] = [
  style('sz-pick', 'מי הכי גדול?', ['size'], 'e', (_sp, r) => {
    const thing = one(r, THINGS), isBig = r() < 0.5, sc = [0.45, 0.75, 1.15]
    const opts = mix(r, sc)
    return [`sz-pick|${thing}|${isBig}`, { kind: 'pick', q: he(isBig ? 'מי הכי גדול?' : 'מי הכי קטן?'), options: opts.map((s) => ({ e: thing, scale: s })), correct: opts.indexOf(isBig ? 1.15 : 0.45), why: he(isBig ? 'זה הכי גדול!' : 'זה הכי קטן!') }]
  }),
  style('sz-mid', 'מי בגודל האמצעי?', ['size'], 'h', (_sp, r) => {
    const thing = one(r, THINGS), sc = [0.45, 0.8, 1.2]
    const opts = mix(r, sc)
    return [`sz-mid|${thing}`, { kind: 'pick', q: he('מי לא הכי גדול וגם לא הכי קטן?'), options: opts.map((s) => ({ e: thing, scale: s })), correct: opts.indexOf(0.8), why: he('הוא באמצע: גדול מאחד וקטן מהשני.') }]
  }),
  style('sz-up', 'מהקטן לגדול', ['size'], 'h', (_sp, r) => {
    const thing = one(r, THINGS)
    return [`sz-up|${thing}`, order('מסדרים מהקטן ביותר לגדול ביותר', [0.4, 0.62, 0.84, 1.1].map((s) => ({ e: thing, scale: s })), 'מהקטן אל הגדול, צעד אחרי צעד.')]
  }),
  style('sz-down', 'מהגדול לקטן', ['size'], 'h', (_sp, r) => {
    const thing = one(r, THINGS)
    return [`sz-down|${thing}`, order('הפעם הפוך: מהגדול ביותר לקטן ביותר', [1.1, 0.8, 0.55].map((s) => ({ e: thing, scale: s })), 'מתחילים מהגדול, וכל פעם קטן יותר.')]
  }),
  style('sz-real', 'מי גדול באמת?', ['size'], 't', (_sp, r) => {
    const [a, b] = one(r, REAL_SIZE), up = r() < 0.5
    return [`sz-real|${a.w}|${up}`, pick(r, up ? 'בתמונה הם באותו גודל. מי גדול יותר באמת?' : 'בתמונה הם באותו גודל. מי קטן יותר באמת?', picTile(up ? a : b), [picTile(up ? b : a)], `בעולם האמיתי, ${a.w} ${big(a.w)} הרבה יותר מ${b.w}.`)]
  }),
  style('sz-heavy', 'מה כבד יותר?', ['size'], 'h', (_sp, r) => {
    const [a, b] = one(r, WEIGHT), heavy = r() < 0.6
    return [`sz-heavy|${a.w}`, pick(r, heavy ? 'מה יותר כבד?' : 'מה יותר קל?', picTile(heavy ? a : b), [picTile(heavy ? b : a)], `קשה להרים ${a.w}, וקל מאוד להרים ${b.w}.`, { kind: 'tile', tile: { e: '⚖️' } })]
  }),
  style('sz-pocket', 'מה נכנס לכיס?', ['size'], 'h', (_sp, r) => {
    const s = one(r, POCKET.small)
    return [`sz-pocket|${s.w}`, pick(r, 'מה אפשר להכניס לכיס?', picTile(s), some(r, POCKET.big, 2).map(picTile), `אפשר לשים ${s.w} בכיס. כל השאר גדולים מדי!`, { kind: 'tile', tile: { e: '👖' } })]
  }),
  style('sz-tall', 'מי הכי גבוה?', ['size', 'logic'], 't', (_sp, r) => {
    const [a, b, c] = some(r, KIDS, 3)
    const tall = (k: typeof a) => (k.f ? 'גבוהה' : 'גבוה')
    const top = r() < 0.5
    return [`sz-tall|${a.n}${b.n}${c.n}|${top}`, pick(r, `${a.n} ${tall(a)} מ${b.n}. ${b.n} ${tall(b)} מ${c.n}. מי ${top ? 'הכי גבוה' : 'הכי נמוך'}?`, { t: top ? a.n : c.n }, [{ t: b.n }, { t: top ? c.n : a.n }], `${a.n} הכי ${a.f ? 'גבוהה' : 'גבוה'}, ו${c.n} הכי ${c.f ? 'נמוכה' : 'נמוך'}.`, { kind: 'row', items: [{ e: '🧍' }, { e: '❓' }, { e: '🧍' }] })]
  }),
]

const LINE = ['🐶', '🐱', '🐰', '🐻', '🐸', '🐵', '🐷', '🦊', '🐯', '🐼']
const ORD = ['ראשון', 'שני', 'שלישי', 'רביעי']
export const POSITION_STYLES: Style[] = [
  style('pos-where', 'איפה הוא?', ['position'], 'e', (sp, r) => {
    const a = one(r, CRITTERS), b = sp.hard ? one(r, PLACES) : PLACES[0]
    const rels = ['above', 'below', 'inside', 'next'] as const
    const rel = one(r, rels)
    return [`pos-where|${a.w}|${b.e}|${rel}`, pick(r, `איפה ה${a.w}?`, { t: b[rel] }, some(r, rels.filter((x) => x !== rel), 2).map((x) => ({ t: b[x] })), `ה${a.w} ${b[rel]}.`, { kind: 'scene', a: a.e, b: b.e, rel })]
  }),
  style('pos-flip', 'מה מתחת ומה מעל?', ['position'], 't', (_sp, r) => {
    const a = one(r, CRITTERS), b = one(r, PLACES)
    const rel = one(r, ['above', 'below'] as const)
    const name = b[rel].split(' ').at(-1)!.replace(/^ל/, 'ה')
    return [`pos-flip|${a.w}|${b.e}|${rel}`, pick(r, `ה${a.w} ${b[rel]}. מה נמצא ${rel === 'above' ? 'מתחת ל' : 'מעל ה'}${a.w}?`, { e: b.e }, [{ e: a.e }, { e: one(r, ['🌳', '⚽', '🪑']) }], `ה${a.w} ${rel === 'above' ? 'למעלה' : 'למטה'}, אז ${name} ${rel === 'above' ? 'מתחתיו' : 'מעליו'}.`, { kind: 'scene', a: a.e, b: b.e, rel })]
  }),
  style('pos-first', 'מי ראשון בתור?', ['position', 'numorder'], 'e', (_sp, r) => {
    const row = some(r, LINE, 4), last = r() < 0.5
    return [`pos-first|${row.join('')}|${last}`, pick(r, last ? 'התור מתחיל מימין. מי עומד אחרון?' : 'התור מתחיל מימין. מי עומד ראשון?', { e: last ? row[3] : row[0] }, [{ e: last ? row[0] : row[3] }, { e: row[1] }], last ? 'האחרון עומד בסוף התור, הכי שמאלה.' : 'הראשון עומד בהתחלה, הכי ימינה.', { kind: 'row', items: row.map((e) => ({ e })) })]
  }),
  style('pos-nth', 'מי עומד שלישי?', ['position', 'numorder'], 'h', (_sp, r) => {
    const row = some(r, LINE, 4), i = int(r, 1, 3)
    return [`pos-nth|${row.join('')}|${i}`, pick(r, `התור מתחיל מימין. מי עומד ${ORD[i]}?`, { e: row[i] }, row.filter((_, k) => k !== i).slice(0, 2).map((e) => ({ e })), `סופרים מימין: ${ORD.slice(0, i + 1).join(', ')}.`, { kind: 'row', items: row.map((e) => ({ e })) })]
  }),
  style('pos-between', 'מי באמצע?', ['position'], 't', (_sp, r) => {
    const row = some(r, LINE, 5), i = int(r, 1, 3)
    return [`pos-between|${row.join('')}|${i}`, pick(r, `מי עומד בין ${row[i - 1]} ל־${row[i + 1]}?`, { e: row[i] }, [{ e: row[i - 1] }, { e: row[i + 1] }], 'הוא עומד בדיוק באמצע, בין השניים.', { kind: 'row', items: row.map((e) => ({ e })) })]
  }),
  style('pos-sky', 'מה נמצא בשמיים?', ['position', 'sortcat'], 'h', (_sp, r) => {
    const up = some(r, [...VEHICLE_WAY.sky, ...HABITAT.sky], 3), down = some(r, [...VEHICLE_WAY.land, ...HABITAT.land], 3)
    return [`pos-sky|${up.map((x) => x.w).sort().join()}`, tapall(r, 'מסמנים את כל מי שנמצא למעלה בשמיים', up.map(picTile), down.map(picTile), 'הם עפים או טסים, למעלה בשמיים.')]
  }),
]

const WHY_GROUPS: { ins: number; why: string }[] = [
  { ins: 0, why: 'כולם עפים' }, { ins: 1, why: 'לכולם ארבע רגליים' }, { ins: 2, why: 'כולם נוסעים על גלגלים' }, { ins: 3, why: 'כולם חמים' },
  { ins: 4, why: 'כולם עגולים' }, { ins: 5, why: 'כולם חיים בים' }, { ins: 6, why: 'כולם אדומים' },
]
export const ODD_STYLES: Style[] = [
  style('odd-cat', 'מה לא שייך?', ['odd'], 'e', (sp, r) => {
    const keys = Object.keys(CATS).filter((k) => !['hot', 'cold'].includes(k))
    const [ka, kb] = some(r, sp.hard ? ['fruit', 'veg', 'sea', 'sky', 'animals', 'toys'] : keys, 2)
    const ins = some(r, CATS[ka].items, 3), out = one(r, CATS[kb].items)
    return [`odd-cat|${ka}|${out.w}`, pick(r, 'מה לא שייך?', { e: out.e }, ins.map((p) => ({ e: p.e })), `ה${nice(out.w)} לא שייך. כל השאר הם ${CATS[ka].name}.`)]
  }),
  style('odd-trap', 'מה לא שייך? (מלכודת)', ['odd', 'logic'], 't', (_sp, r) => {
    const i = int(r, 0, ODD_PROPS.length - 1), g = ODD_PROPS[i]
    return [`odd-trap|${i}`, pick(r, 'מה לא שייך? חושבים טוב, זה מבלבל!', { e: g.out.e }, some(r, g.ins, 3).map((p) => ({ e: p.e })), g.why)]
  }),
  style('odd-same', 'מה משותף לכולם?', ['odd', 'logic'], 't', (_sp, r) => {
    const g = one(r, WHY_GROUPS)
    const wrong = some(r, WHY_GROUPS.filter((x) => x !== g), 2)
    return [`odd-same|${g.ins}`, pick(r, 'מה משותף לכל הדברים בשורה?', { t: g.why }, wrong.map((x) => ({ t: x.why })), `נכון: ${g.why}.`, { kind: 'row', items: some(r, ODD_PROPS[g.ins].ins, 4).map((p) => ({ e: p.e })) })]
  }),
  style('odd-home', 'מי לא גר כאן?', ['odd'], 'h', (_sp, r) => {
    const where = one(r, ['sea', 'sky'] as const)
    const ins = some(r, HABITAT[where], 3), out = one(r, HABITAT.land)
    return [`odd-home|${where}|${out.w}`, pick(r, where === 'sea' ? 'מי לא חי בים?' : 'מי לא עף בשמיים?', picTile(out), ins.map(picTile), `ה${out.w} חי על היבשה.`)]
  }),
]

export const PATTERN_STYLES: Style[] = [
  style('pat-ab', 'מה בא עכשיו?', ['pattern'], 'e', (_sp, r) => {
    const kind = one(r, ['AB', 'AB', 'AAB'])
    const pool = some(r, ['🍎', '🍌', '🐶', '🐱', '⭐', '🌙', '🚗', '🎈', '🐸', '🌸', '🍓', '🚀'], 2).map((e) => ({ e }))
    const unit = [...kind].map((ch) => pool['AB'.indexOf(ch)])
    const len = unit.length * 3
    const seq = Array.from({ length: len + 1 }, (_, i) => unit[i % unit.length])
    return [`pat-ab|${kind}|${pool.map((t) => t.e).join('')}`, pick(r, 'מה בא עכשיו?', seq[len], [pool.find((t) => t !== seq[len])!, { e: '🍪' }], 'הדפוס חוזר על עצמו שוב ושוב.', { kind: 'row', items: seq.slice(0, len), ask: true })]
  }),
  style('pat-abc', 'דפוס של שלושה', ['pattern'], 'h', (_sp, r) => {
    const kind = one(r, ['ABC', 'ABB', 'AAB', 'ABBC'])
    const shapes = r() < 0.5
    const pool: Tile[] = shapes ? some(r, COLORS, 3).map((c, i) => shp((['circle', 'square', 'triangle'] as const)[i], c.c)) : some(r, ['🍎', '🍌', '🐶', '🐱', '⭐', '🌙', '🚗', '🎈', '🐸'], 3).map((e) => ({ e }))
    const unit = [...kind].map((ch) => pool['ABC'.indexOf(ch)])
    const len = unit.length * 2
    const seq = Array.from({ length: len + 1 }, (_, i) => unit[i % unit.length])
    return [`pat-abc|${kind}|${JSON.stringify(pool)}`, pick(r, 'מה בא עכשיו? מסתכלים טוב', seq[len], pool.filter((t) => t !== seq[len]), 'מוצאים את החלק שחוזר, וממשיכים אותו.', { kind: 'row', items: seq.slice(0, len), ask: true })]
  }),
  style('pat-mid', 'מה חסר באמצע?', ['pattern'], 'h', (_sp, r) => {
    const pool = some(r, ['🍎', '🍌', '🐶', '🐱', '⭐', '🌙', '🚗', '🎈', '🐸', '🌸'], 2).map((e) => ({ e }))
    const seq = Array.from({ length: 7 }, (_, i) => pool[i % 2])
    const hole = int(r, 2, 4)
    return [`pat-mid|${pool.map((t) => t.e).join('')}|${hole}`, pick(r, 'מה חסר בדפוס?', seq[hole], [seq[hole + 1], { e: '🍪' }], 'הדפוס הולך אחד־אחד, אז זה מה שחסר.', { kind: 'row', items: seq.map((t, i) => (i === hole ? { t: '?' } : t)) })]
  }),
  style('pat-grow', 'כל פעם עוד אחד', ['pattern', 'count'], 't', (_sp, r) => {
    const e = one(r, ['⭐', '🍎', '🐟', '🌸', '🎈', '🐞'])
    const st = int(r, 1, 2)
    return [`pat-grow|${e}|${st}`, pick(r, 'בכל פעם מוסיפים עוד אחד. מה בא עכשיו?', { many: { e, n: st + 3 } }, [{ many: { e, n: st + 2 } }, { many: { e, n: st + 5 } }], `${[0, 1, 2, 3].map((i) => st + i).join(', ')}!`, { kind: 'row', items: [0, 1, 2].map((i) => ({ many: { e, n: st + i } })), ask: true })]
  }),
  style('pat-jump', 'קפיצות של מספרים', ['pattern', 'numorder'], 't', (_sp, r) => {
    const kind = one(r, ['two', 'back', 'ten'] as const)
    const seq = kind === 'two' ? [2, 4, 6] : kind === 'back' ? [9, 8, 7] : [1, 3, 5]
    const ans = kind === 'two' ? 8 : kind === 'back' ? 6 : 7
    const why = kind === 'two' ? '2, 4, 6, 8: כל פעם קופצים שניים.' : kind === 'back' ? '9, 8, 7, 6: כל פעם יורדים אחד.' : '1, 3, 5, 7: קופצים שניים, ומדלגים על מספר.'
    return [`pat-jump|${kind}`, pick(r, kind === 'back' ? 'סופרים אחורה. מה בא עכשיו?' : 'כל פעם קופצים. מה בא עכשיו?', { g: String(ans) }, [{ g: String(ans + 1) }, { g: String(ans - (kind === 'back' ? -2 : 1)) }], why, { kind: 'row', items: seq.map((n) => ({ g: String(n) })), ask: true })]
  }),
  style('pat-unit', 'מה חוזר שוב ושוב?', ['pattern'], 'h', (_sp, r) => {
    const [a, b, c] = some(r, ['🍎', '🍌', '🐶', '🐱', '⭐', '🌙', '🚗', '🎈'], 3)
    const unit = r() < 0.5 ? [a, b] : [a, a, b]
    const seq = Array.from({ length: unit.length * 3 }, (_, i) => unit[i % unit.length])
    return [`pat-unit|${unit.join('')}`, pick(r, 'איזה חלק חוזר שוב ושוב בדפוס?', { t: unit.join(' ') }, [{ t: (unit.length === 2 ? [a, a, b] : [a, b]).join(' ') }, { t: [a, c].join(' ') }], `החלק "${unit.join(' ')}" חוזר שלוש פעמים.`, { kind: 'row', items: seq.map((e) => ({ e })) })]
  }),
  style('pat-body', 'דפוס של תנועות', ['pattern'], 'e', (_sp, r) => {
    const moves = [{ e: '👏', t: 'מוחאים' }, { e: '🦶', t: 'רוקעים' }, { e: '🙌', t: 'ידיים למעלה' }, { e: '🤸', t: 'קופצים' }]
    const [a, b, c] = some(r, moves, 3)
    const seq = [a, b, a, b, a]
    return [`pat-body|${a.e}${b.e}`, pick(r, 'עושים את הדפוס עם הגוף! מה עושים עכשיו?', b, [a, c], `${a.t}, ${b.t}, ${a.t}, ${b.t}...`, { kind: 'row', items: seq.map((m) => ({ e: m.e })), ask: true })]
  }),
  style('pat-color', 'דפוס של צבעים', ['pattern', 'colors'], 'h', (_sp, r) => {
    const s = one(r, ['circle', 'square', 'star', 'heart'])
    const cs = some(r, COLORS, 3)
    const unit = r() < 0.5 ? [cs[0], cs[1], cs[2]] : [cs[0], cs[0], cs[1]]
    const seq = Array.from({ length: unit.length * 2 + 1 }, (_, i) => unit[i % unit.length])
    const ans = seq.pop()!
    return [`pat-color|${unit.map((c) => c.n).join()}`, pick(r, 'הצורה אותה צורה, רק הצבע משתנה. איזה צבע בא עכשיו?', shp(s, ans.c), cs.filter((c) => c !== ans).map((c) => shp(s, c.c)), 'מסתכלים רק על הצבעים, והם חוזרים.', { kind: 'row', items: seq.map((c) => shp(s, c.c)), ask: true })]
  }),
  style('pat-arrow', 'החץ מסתובב', ['pattern', 'position'], 't', (_sp, r) => {
    const turn = ['⬆️', '⬅️', '⬇️', '➡️']
    const st = int(r, 0, 3)
    const seq = [0, 1, 2, 3].map((i) => turn[(st + i) % 4])
    const ans = turn[(st + 4) % 4]
    return [`pat-arrow|${st}`, pick(r, 'החץ מסתובב כל פעם קצת. לאן הוא יצביע עכשיו?', { e: ans }, some(r, turn.filter((x) => x !== ans), 2).map((e) => ({ e })), 'אחרי סיבוב שלם, החץ חוזר להתחלה!', { kind: 'row', items: seq.map((e) => ({ e })), ask: true })]
  }),
]

const MORE_SORTS: { a: string; b: string; ia: Pic[]; ib: Pic[]; why: string }[] = [
  ...PROP_SORTS.map((p) => ({ ...p, why: 'יש כאן מלכודות! חושבים על כל אחד לבד.' })),
  { a: '🍽️ אוכלים את זה', b: '🚫 לא אוכלים', ia: [{ w: 'לחם', e: '🍞' }, { w: 'גבינה', e: '🧀' }, { w: 'מלפפון', e: '🥒' }, { w: 'אורז', e: '🍚' }], ib: [{ w: 'כפית', e: '🥄' }, { w: 'אבן', e: '🪨' }, { w: 'נייר', e: '📄' }, { w: 'צלחת', e: '🍽️' }], why: 'הכפית והצלחת עוזרות לאכול, אבל אותן לא אוכלים!' },
  { a: '🔊 עושה רעש', b: '🤫 שקט', ia: [{ w: 'תוף', e: '🥁' }, { w: 'אמבולנס', e: '🚑' }, { w: 'כלב נובח', e: '🐕' }, { w: 'שעון מעורר', e: '⏰' }], ib: [{ w: 'ספר', e: '📖' }, { w: 'פרח', e: '🌸' }, { w: 'כרית', e: '🛏️' }, { w: 'ענן', e: '☁️' }], why: 'יש דברים שעושים רעש, ויש דברים שקטים לגמרי.' },
  { a: '💡 צריך חשמל', b: '🔋 לא צריך', ia: [{ w: 'טלוויזיה', e: '📺' }, { w: 'מנורה', e: '💡' }, { w: 'מקרר', e: '🧊' }, { w: 'מחשב', e: '💻' }], ib: [{ w: 'ספר', e: '📖' }, { w: 'כדור', e: '⚽' }, { w: 'אופניים', e: '🚲' }, { w: 'עיפרון', e: '✏️' }], why: 'אופניים נוסעים בלי חשמל, רק עם הרגליים!' },
]
export const SORT_STYLES: Style[] = [
  style('srt-two', 'מסדרים לשתי קבוצות', ['sortcat'], 'e', (sp, r) => {
    const [ka, kb] = one(r, sp.hard ? SORT_PAIRS_HARD : SORT_PAIRS)
    const a = some(r, CATS[ka].items, 3), b = some(r, CATS[kb].items, 3)
    return [`srt-two|${ka}${kb}|${[...a, ...b].map((x) => x.w).sort().join()}`, sort('מסדרים כל דבר בקבוצה שלו', [CATS[ka].name, CATS[kb].name], [...a.map((x) => ({ ...x, b: 0 })), ...b.map((x) => ({ ...x, b: 1 }))], `${CATS[ka].name} לחוד, ${CATS[kb].name} לחוד.`)]
  }),
  style('srt-hard', 'פירות או ירקות?', ['sortcat'], 'h', (_sp, r) => {
    const [ka, kb] = one(r, SORT_PAIRS_HARD)
    const a = some(r, CATS[ka].items, 3), b = some(r, CATS[kb].items, 3)
    return [`srt-hard|${ka}${kb}|${[...a, ...b].map((x) => x.w).sort().join()}`, sort('חושבים טוב: לאיזו קבוצה זה שייך?', [CATS[ka].name, CATS[kb].name], [...a.map((x) => ({ ...x, b: 0 })), ...b.map((x) => ({ ...x, b: 1 }))], 'צריך לחשוב על כל אחד, לא רק להסתכל.')]
  }),
  style('srt-prop', 'מיון לפי תכונה', ['sortcat', 'logic'], 't', (_sp, r) => {
    const i = int(r, 0, MORE_SORTS.length - 1), p = MORE_SORTS[i]
    return [`srt-prop|${i}`, sort('חושבים: לאיזו קבוצה כל אחד שייך?', [p.a, p.b], [...some(r, p.ia, 3).map((x) => ({ ...x, b: 0 })), ...some(r, p.ib, 3).map((x) => ({ ...x, b: 1 }))], p.why)]
  }),
  style('srt-habitat', 'יבשה, ים או שמיים', ['sortcat'], 'h', (_sp, r) => {
    const groups = [HABITAT.land, HABITAT.sea, HABITAT.sky].map((g) => some(r, g, 2))
    return [`srt-habitat|${groups.flat().map((x) => x.w).sort().join()}`, sort('איפה כל חיה גרה?', ['🌳 ביבשה', '🌊 בים', '☁️ בשמיים'], groups.flatMap((g, b) => g.map((x) => ({ ...x, b }))), 'כל חיה והבית שלה.')]
  }),
  style('srt-ways', 'איך נוסעים?', ['sortcat', 'logic'], 'h', (_sp, r) => {
    const groups = [VEHICLE_WAY.land, VEHICLE_WAY.sea, VEHICLE_WAY.sky].map((g) => some(r, g, 2))
    return [`srt-ways|${groups.flat().map((x) => x.w).sort().join()}`, sort('איפה כל אחד נוסע?', ['🛣️ על הכביש', '🌊 על המים', '☁️ באוויר'], groups.flatMap((g, b) => g.map((x) => ({ ...x, b }))), 'יש כלים שנוסעים, שטים וטסים.')]
  }),
  style('srt-tap', 'מסמנים את כל הקבוצה', ['sortcat', 'odd'], 'e', (_sp, r) => {
    const [ka, kb] = some(r, ['animals', 'fruit', 'veg', 'vehicles', 'clothes', 'toys'], 2)
    const k = int(r, 2, 3)
    return [`srt-tap|${ka}`, tapall(r, `מסמנים את כל ה${CATS[ka].name}`, some(r, CATS[ka].items, k).map(picTile), some(r, CATS[kb].items, 6 - k).map(picTile), `יש כאן ${k} ${CATS[ka].name}.`)]
  }),
  style('srt-room', 'לאיזה חדר זה שייך?', ['sortcat'], 'h', (_sp, r) => {
    const room = one(r, ROOMS), item = one(r, room.items)
    const label: Record<string, string> = { מטבח: '🍳', 'חדר אמבטיה': '🛁', 'חדר שינה': '🛏️' }
    return [`srt-room|${item.w}`, pick(r, `לאיזה חדר בבית שייך ה${item.w}?`, { e: label[room.w], t: room.w }, ROOMS.filter((x) => x !== room).map((x) => ({ e: label[x.w], t: x.w })), `${item.w} נמצא ב${room.w}.`, { kind: 'tile', tile: picTile(item) })]
  }),
]

const MORE_ANALOGIES: [Pic, Pic, Pic, Pic][] = [
  ...ANALOGIES,
  [{ w: 'מפתח', e: '🔑' }, { w: 'דלת', e: '🚪' }, { w: 'עיפרון', e: '✏️' }, { w: 'דף', e: '📄' }],
  [{ w: 'ים', e: '🌊' }, { w: 'סירה', e: '⛵' }, { w: 'שמיים', e: '☁️' }, { w: 'מטוס', e: '✈️' }],
  [{ w: 'רכבת', e: '🚂' }, { w: 'מסילה', e: '🛤️' }, { w: 'מכונית', e: '🚗' }, { w: 'כביש', e: '🛣️' }],
  [{ w: 'עין', e: '👁️' }, { w: 'משקפיים', e: '👓' }, { w: 'ראש', e: '🙂' }, { w: 'כובע', e: '🧢' }],
  [{ w: 'ציפור', e: '🐦' }, { w: 'קן', e: '🪺' }, { w: 'דבורה', e: '🐝' }, { w: 'כוורת', e: '🍯' }],
  [{ w: 'קוף', e: '🐵' }, { w: 'בננה', e: '🍌' }, { w: 'עכבר', e: '🐭' }, { w: 'גבינה', e: '🧀' }],
  [{ w: 'ביצה', e: '🥚' }, { w: 'אפרוח', e: '🐥' }, { w: 'זחל', e: '🐛' }, { w: 'פרפר', e: '🦋' }],
  [{ w: 'שלג', e: '❄️' }, { w: 'חורף', e: '⛄' }, { w: 'שמש חזקה', e: '☀️' }, { w: 'קיץ', e: '🏖️' }],
]
const CAUSES: { q: string; e: string; a: Tile; bad: Tile[] }[] = [
  { q: 'משאירים גלידה בשמש החמה. מה יקרה?', e: '🍦', a: { e: '💧', t: 'היא תימס' }, bad: [{ e: '🧊', t: 'היא תתקשה' }, { e: '🎈', t: 'היא תעוף' }] },
  { q: 'דוקרים בלון במחט. מה יקרה?', e: '🎈', a: { e: '💥', t: 'הוא יתפוצץ' }, bad: [{ e: '📈', t: 'הוא יגדל' }, { e: '🌈', t: 'הוא ישנה צבע' }] },
  { q: 'משקים זרע באדמה כל יום. מה יקרה?', e: '🌱', a: { e: '🌻', t: 'יצמח פרח' }, bad: [{ e: '🪨', t: 'תצמח אבן' }, { e: '🍦', t: 'תצמח גלידה' }] },
  { q: 'שמים מים במקפיא ומחכים. מה יקרה?', e: '🫗', a: { e: '🧊', t: 'הם יהפכו לקרח' }, bad: [{ e: '🔥', t: 'הם יתחממו' }, { e: '🥤', t: 'הם יהפכו למיץ' }] },
  { q: 'השמיים מלאים בעננים שחורים. מה כנראה יקרה?', e: '☁️', a: { e: '🌧️', t: 'ירד גשם' }, bad: [{ e: '☀️', t: 'יהיה חם ויבש' }, { e: '🌈', t: 'תצא קשת מיד' }] },
  { q: 'אוכלים הרבה ממתקים ולא מצחצחים שיניים. מה יקרה?', e: '🍭', a: { e: '🦷', t: 'השיניים יכאבו' }, bad: [{ e: '💪', t: 'נהיה חזקים' }, { e: '🌙', t: 'נלך לישון' }] },
  { q: 'קופצים לשלולית עם נעליים. מה יקרה?', e: '👟', a: { e: '💦', t: 'הנעליים יירטבו' }, bad: [{ e: '🔥', t: 'הנעליים יתחממו' }, { e: '✨', t: 'הנעליים יבריקו' }] },
  { q: 'מפילים כוס זכוכית על הרצפה. מה יכול לקרות?', e: '🥛', a: { e: '💔', t: 'היא תישבר' }, bad: [{ e: '🏀', t: 'היא תקפוץ כמו כדור' }, { e: '🎶', t: 'היא תשיר' }] },
  { q: 'נושבת רוח חזקה. מה יקרה לעפיפון?', e: '🪁', a: { e: '⬆️', t: 'הוא יעוף גבוה' }, bad: [{ e: '🛌', t: 'הוא יירדם' }, { e: '💧', t: 'הוא יימס' }] },
  { q: 'השמש שוקעת. מה יהיה עוד מעט?', e: '🌇', a: { e: '🌙', t: 'לילה' }, bad: [{ e: '🌅', t: 'בוקר' }, { e: '☀️', t: 'צהריים' }] },
]
export const LOGIC_STYLES: Style[] = [
  style('lg-analogy', 'זה לזה כמו...', ['logic'], 't', (_sp, r) => {
    const i = int(r, 0, MORE_ANALOGIES.length - 1)
    const [a1, a2, b1, b2] = MORE_ANALOGIES[i]
    return [`lg-analogy|${i}`, pick(r, `${a1.w} ו${a2.w} הולכים ביחד. מה הולך ביחד עם ${b1.w}?`, picTile(b2), some(r, MORE_ANALOGIES.map((x) => x[3]).filter((x) => x.w !== b2.w && x.w !== a2.w), 2).map(picTile), `${a1.w} ו${a2.w}, ${b1.w} ו${b2.w}: אותו קשר!`, { kind: 'analogy', a: [a1.e, a2.e], b: b1.e })]
  }),
  style('lg-race', 'מי הכי מהיר?', ['logic'], 't', (_sp, r) => {
    const [a, b, c] = some(r, KIDS, 3)
    const run = (k: typeof a) => (k.f ? 'רצה' : 'רץ')
    const fast = r() < 0.5
    return [`lg-race|${a.n}${b.n}${c.n}|${fast}`, pick(r, `${a.n} ${run(a)} מהר יותר מ${b.n}. ${b.n} ${run(b)} מהר יותר מ${c.n}. מי הכי ${fast ? 'מהיר' : 'איטי'}?`, { t: fast ? a.n : c.n }, [{ t: b.n }, { t: fast ? c.n : a.n }], `${a.n} הכי ${a.f ? 'מהירה' : 'מהיר'}, ו${c.n} הכי ${c.f ? 'איטית' : 'איטי'}.`, { kind: 'row', items: [{ e: '🏃' }, { e: '🏃' }, { e: '🏃' }] })]
  }),
  style('lg-goes', 'מה הולך עם זה?', ['logic', 'riddle'], 'h', (_sp, r) => {
    const i = int(r, 0, GOES.length - 1), [a, b] = GOES[i]
    return [`lg-goes|${i}`, pick(r, `מה הכי מתאים ל${a.w}?`, picTile(b), some(r, GOES.filter((_, k) => k !== i).map((x) => x[1]), 2).map(picTile), `${a.w} ו${b.w} הולכים ביחד.`, { kind: 'tile', tile: picTile(a) })]
  }),
  style('lg-job', 'מה צריך בעבודה?', ['logic', 'social', 'riddle'], 'h', (_sp, r) => {
    const j = one(r, JOBS)
    return [`lg-job|${j.w}`, pick(r, `מה ה${j.w} ${j.w.endsWith('ה') || j.w.endsWith('ת') ? 'צריכה' : 'צריך'} בעבודה?`, picTile(j.tool), some(r, JOBS.filter((x) => x !== j), 2).map((x) => picTile(x.tool)), `ה${j.w} עובד${j.w.endsWith('ה') || j.w.endsWith('ת') ? 'ת' : ''} עם ${j.tool.w}.`, { kind: 'tile', tile: { e: j.e, t: j.w } })]
  }),
  style('lg-cause', 'מה יקרה אם...?', ['logic'], 't', (_sp, r) => {
    const i = int(r, 0, CAUSES.length - 1), c = CAUSES[i]
    return [`lg-cause|${i}`, pick(r, c.q, c.a, c.bad, `${c.a.t}. ככה זה עובד!`, { kind: 'tile', tile: { e: c.e } })]
  }),
  style('lg-opposite', 'מה ההפך?', ['logic', 'riddle'], 'h', (_sp, r) => {
    const i = int(r, 0, OPPOSITES.length - 1), flip = r() < 0.5
    const [a, b] = flip ? [OPPOSITES[i][1], OPPOSITES[i][0]] : OPPOSITES[i]
    return [`lg-opposite|${i}`, pick(r, `מה ההפך מ${a.w}?`, picTile(b), some(r, OPPOSITES.filter((_, k) => k !== i).flat(), 2).map(picTile), `${a.w} ו${b.w} הם הפכים.`, { kind: 'tile', tile: picTile(a) })]
  }),
  style('lg-made', 'מה מקבלים מזה?', ['logic', 'riddle'], 'h', (_sp, r) => {
    const i = int(r, 0, PRODUCTS.length - 1), [a, b] = PRODUCTS[i]
    return [`lg-made|${i}`, pick(r, `מה מקבלים מה${a.w}?`, picTile(b), some(r, PRODUCTS.filter((_, k) => k !== i).map((x) => x[1]), 2).map(picTile), `מה${a.w} מקבלים ${b.w}.`, { kind: 'tile', tile: picTile(a) })]
  }),
]
export const SEE_STYLES: Style[] = [...COLOR_STYLES, ...SHAPE_STYLES, ...SIZE_STYLES, ...POSITION_STYLES, ...ODD_STYLES, ...PATTERN_STYLES, ...SORT_STYLES, ...LOGIC_STYLES]
