/* Question styles for language: syllables, rhymes, first sounds, letters, building and reading words. */

import type { Spec } from '../course'
import type { Tile } from '../lessonTypes'
import { alike, CLEAR_SOUNDS, LETTER_NAME, LETTERS, LOOKALIKE, SHORT2, SHORT3, SYLL, WORDS_BY_LETTER, type Pic } from '../kdata'
import { he, int, match, mix, nice, one, order, pick, picTile, some, style, tapall, YES, NO, type R, type Style } from './util'

const P = (list: string): Pic[] => list.trim().split(/\s*,\s*/).map((x) => { const [w, e] = x.split(' '); return { w, e } })
/** Three-letter words with no final letters, beyond the first-reading list. */
const MORE3 = P('אגס 🍐, דבש 🍯, כוס 🥤, פרה 🐄, סיר 🍲, גשר 🌉, קיר 🧱, דלי 🪣, שער 🥅, נעל 👟, בצל 🧅, שלג ❄️, עלה 🍃, שור 🐂, חול 🏖️, רגל 🦵, סבא 👴, אבא 👨, דלת 🚪, ספה 🛋️')
const words = (sp: Spec) => ((sp.max ?? 2) <= 2 ? SHORT2 : [...SHORT3, ...MORE3])
const allWords = [...SHORT2, ...SHORT3, ...MORE3]

/** Groups that really rhyme: the same last vowel and sound (סוס–אוטובוס, not סוס–כוס). */
const RHYME_GROUPS: Pic[][] = [
  P('ירח 🌙, פרח 🌸, קרח 🧊'), P('כלב 🐶, לב ❤️'), P('פיל 🐘, טיל 🚀'), P('בית 🏠, זית 🫒'), P('נחש 🐍, דבש 🍯'),
  P('שעון ⏰, בלון 🎈, חלון 🪟, מלפפון 🥒, סבון 🧼'), P('סוס 🐴, אוטובוס 🚌'), P('כוס 🥤, מטוס ✈️'), P('שמש ☀️, חמש 🖐️'), P('קוף 🐵, חוף 🏖️, תוף 🥁'),
  P('קן 🪺, שן 🦷'), P('אף 👃, כף 🥄, דף 📄'), P('שמלה 👗, נמלה 🐜'), P('סל 🧺, גל 🌊'), P('ספר 📖, גזר 🥕'),
  P('מים 💧, מכנסיים 👖, אופניים 🚲'), P('דבורה 🐝, מנורה 🕎'),
]
const rhymeOf = (r: R, not: Pic[]) => one(r, RHYME_GROUPS.filter((g) => !g.some((x) => not.includes(x)))).map((x) => x)

/** A first name for every letter — including Lenny's own ל. */
const NAMES: Record<string, string[]> = {
  א: ['אורי', 'אלה'], ב: ['בן', 'בר'], ג: ['גיל', 'גאיה'], ד: ['דני', 'דנה'], ה: ['הדר', 'הילה'], ו: ['ורד', 'ויקי'], ז: ['זיו', 'זוהר'],
  ח: ['חן', 'חיים'], ט: ['טל', 'טליה'], י: ['יואב', 'יעל'], כ: ['כרמל', 'כנרת'], ל: ['לני', 'ליאור'], מ: ['מיכל', 'מאיה'], נ: ['נועה', 'נדב'],
  ס: ['סהר', 'סתיו'], ע: ['עידו', 'ענבל'], פ: ['פלג', 'פזית'], צ: ['צור', 'צליל'], ק: ['קרן', 'קורל'], ר: ['רון', 'רוני'], ש: ['שירה', 'שקד'], ת: ['תמר', 'תום'],
}
const MIRRORABLE = 'בגדהזכלנפצקרת'

const setOf = (sp: Spec) => [...(sp.set ?? 'אב')]
/** Wrong letters: from the lesson's set when it has enough, never two that sound alike. */
function otherLetters(r: R, l: string, sp: Spec, n: number, lookalike = false) {
  const set = setOf(sp).filter((x) => x !== l)
  let out = lookalike && LOOKALIKE[l] ? [...LOOKALIKE[l]] : []
  out = [...new Set([...out, ...some(r, set.length >= n ? set : [...LETTERS].filter((x) => x !== l), n)])].filter((x) => x !== l).slice(0, n)
  while (out.length < n) { const x = one(r, [...LETTERS].filter((y) => y !== l && !out.includes(y))); out.push(x) }
  return out
}
const g = (l: string): Tile => ({ g: l })
const ln = (l: string) => LETTER_NAME[l]

export const LETTER_STYLES: Style[] = [
  style('lt-find', 'איפה האות?', ['letters'], 'e', (sp, r) => {
    const l = one(r, setOf(sp)), o = otherLetters(r, l, sp, 2)
    return [`lt-find|${l}|${[...o].sort().join('')}`, pick(r, `איפה האות ${ln(l)}?`, g(l), o.map(g), `הנה ${l}, ${ln(l)}!`)]
  }),
  style('lt-name', 'איך קוראים לאות?', ['letters'], 'e', (sp, r) => {
    const l = one(r, setOf(sp)), o = otherLetters(r, l, sp, 2)
    return [`lt-name|${l}|${[...o].sort().join('')}`, pick(r, 'איך קוראים לאות הזאת?', { t: ln(l) }, o.map((x) => ({ t: ln(x) })), `זאת האות ${ln(l)}.`, { kind: 'tile', tile: g(l) })]
  }),
  style('lt-look', 'אותיות דומות', ['letters'], 'h', (sp, r) => {
    const pool = setOf(sp).filter((x) => LOOKALIKE[x])
    if (!pool.length) return null
    const l = one(r, pool), o = otherLetters(r, l, sp, 3, true)
    return [`lt-look|${l}`, pick(r, `איפה ה${ln(l)}? יש כאן אותיות דומות!`, g(l), o.map(g), `${l} היא ${ln(l)}. מסתכלים על הפרטים הקטנים.`)]
  }),
  style('lt-mirror', 'איזו אות כתובה נכון?', ['letters', 'trace'], 'h', (sp, r) => {
    const pool = setOf(sp).filter((x) => MIRRORABLE.includes(x))
    if (!pool.length) return null
    const l = one(r, pool)
    return [`lt-mirror|${l}`, pick(r, `איזו ${ln(l)} כתובה נכון? שתיים הפוכות!`, g(l), [{ g: l, fx: 'flip' }, { g: l, fx: 'tilt' }], `ככה כותבים ${ln(l)}. בעברית האותיות פונות שמאלה.`)]
  }),
  style('lt-tap', 'מסמנים את כל האות', ['letters'], 'h', (sp, r) => {
    const l = one(r, setOf(sp)), o = otherLetters(r, l, sp, 3, true), k = int(r, 2, 3)
    return [`lt-tap|${l}`, tapall(r, `מסמנים כל אות ${ln(l)} (${l})`, Array(k).fill(0).map(() => g(l)), o.map(g), `יש כאן ${k} פעמים ${l}.`)]
  }),
  style('lt-match', 'אות ושם', ['letters'], 'h', (sp, r) => {
    const set = setOf(sp)
    const ls = some(r, set.length >= 3 ? set : [...set, ...some(r, [...LETTERS].filter((x) => !set.includes(x)), 3 - set.length)], 3)
    return [`lt-match|${[...ls].sort().join('')}`, match('מחברים כל אות לשם שלה', ls.map((l) => [g(l), { t: ln(l) }]), 'כל אות והשם שלה.')]
  }),
  style('lt-next', 'מה באה אחרי?', ['letters'], 't', (sp, r) => {
    const l = one(r, setOf(sp).filter((x) => x !== 'ת')), i = LETTERS.indexOf(l)
    if (i < 0) return null
    const nx = LETTERS[i + 1]
    return [`lt-next|${l}`, pick(r, `איזו אות באה אחרי ${ln(l)} באלף־בית?`, g(nx), otherLetters(r, nx, { s: 'letters', set: LETTERS }, 2).filter((x) => x !== l).concat(LETTERS[Math.max(0, i - 1)]).filter((x, k, a) => x !== nx && a.indexOf(x) === k).slice(0, 2).map(g), `${l}, ואחריה ${nx}.`, { kind: 'tile', tile: g(l) })]
  }),
  style('lt-gap', 'איזו אות חסרה?', ['letters'], 't', (sp, r) => {
    const set = setOf(sp), l = one(r, set), i = Math.min(Math.max(LETTERS.indexOf(l), 1), LETTERS.length - 3)
    const seq = [...LETTERS.slice(i - 1, i + 3)], hole = 1
    return [`lt-gap|${seq.join('')}`, pick(r, 'איזו אות חסרה באלף־בית?', g(seq[hole]), otherLetters(r, seq[hole], sp, 2).filter((x) => !seq.includes(x)).concat(LETTERS[(i + 5) % 22]).slice(0, 2).map(g), `${seq.join(', ')}.`, { kind: 'row', items: seq.map((x, k) => (k === hole ? { t: '?' } : g(x))) })]
  }),
  style('lt-abc', 'לפי סדר האלף־בית', ['letters'], 't', (sp, r) => {
    const set = setOf(sp), l = one(r, set), i = Math.min(LETTERS.indexOf(l), LETTERS.length - 3)
    const seq = [...LETTERS.slice(Math.max(0, i), Math.max(0, i) + 3)]
    return [`lt-abc|${seq.join('')}`, order('מסדרים לפי סדר האלף־בית', seq.map(g), `${seq.join(', ')}: ככה הן באות באלף־בית.`)]
  }),
  style('lt-notletter', 'מה זה לא אות?', ['letters'], 'e', (sp, r) => {
    const ls = some(r, setOf(sp).length >= 3 ? setOf(sp) : [...LETTERS], 3), d = String(int(r, 2, 9))
    return [`lt-notletter|${d}|${[...ls].sort().join('')}`, pick(r, 'מה כאן הוא לא אות?', { g: d }, ls.map(g), `${d} הוא מספר, לא אות!`)]
  }),
]

const startsWith = (l: string) => WORDS_BY_LETTER[l] ?? []
export const SOUND_STYLES: Style[] = [
  style('ls-first', 'באיזו אות מתחילה?', ['lettersound'], 'e', (sp, r) => {
    const l = one(r, setOf(sp)), w = one(r, startsWith(l))
    const o = otherLetters(r, l, sp, 5).filter((x) => !alike(x, l)).slice(0, 2)
    return [`ls-first|${w.w}`, pick(r, `באיזו אות מתחילה המילה "${w.w}"?`, g(l), o.map(g), `המילה "${w.w}" מתחילה ב${ln(l)}.`, { kind: 'tile', tile: picTile(w) })]
  }),
  style('ls-pic', 'מה מתחיל באות?', ['lettersound'], 'h', (sp, r) => {
    const l = one(r, setOf(sp)), w = one(r, startsWith(l))
    const o = some(r, [...LETTERS].filter((x) => !alike(x, l)), 3).map((x) => one(r, startsWith(x)))
    return [`ls-pic|${l}|${w.w}`, pick(r, `מה מתחיל באות ${l} (${ln(l)})?`, picTile(w), o.map(picTile), `המילה "${w.w}" מתחילה ב${ln(l)}.`, { kind: 'tile', tile: g(l) })]
  }),
  style('ls-match', 'אות ותמונה', ['lettersound'], 'h', (sp, r) => {
    const pool = [...new Set([...setOf(sp), ...some(r, [...LETTERS], 6)])]
    const ls: string[] = []
    for (const l of mix(r, pool)) { if (ls.length < 3 && !ls.some((x) => alike(x, l))) ls.push(l) }
    if (!setOf(sp).some((x) => ls.includes(x))) ls[0] = setOf(sp)[0]
    if (new Set(ls).size < 3 || ls.some((a, i) => ls.some((b, j) => i !== j && alike(a, b)))) return null
    return [`ls-match|${[...ls].sort().join('')}`, match('מחברים כל אות לתמונה שמתחילה בה', ls.map((l) => [g(l), picTile(one(r, startsWith(l)))]), 'כל תמונה מצאה את האות הראשונה שלה!')]
  }),
  style('ls-odd', 'מי לא מתחיל באות?', ['lettersound'], 't', (sp, r) => {
    const l = one(r, setOf(sp).filter((x) => startsWith(x).length >= 2))
    if (!l) return null
    const ins = some(r, startsWith(l), 2), other = one(r, [...LETTERS].filter((x) => !alike(x, l))), out = one(r, startsWith(other))
    return [`ls-odd|${l}|${out.w}`, pick(r, `שתיים מתחילות ב${ln(l)}, ואחת לא. איזו לא?`, picTile(out), ins.map(picTile), `המילה "${out.w}" מתחילה ב${ln(other)}.`, { kind: 'tile', tile: g(l) })]
  }),
  style('ls-tap', 'מסמנים מה מתחיל באות', ['lettersound'], 'h', (sp, r) => {
    const l = one(r, setOf(sp).filter((x) => startsWith(x).length >= 3))
    if (!l) return null
    const k = int(r, 2, 3), outs = some(r, [...LETTERS].filter((x) => !alike(x, l)), 6 - k).map((x) => one(r, startsWith(x)))
    return [`ls-tap|${l}`, tapall(r, `מסמנים את כל מה שמתחיל ב${ln(l)}`, some(r, startsWith(l), k).map(picTile), outs.map(picTile), `${k} מילים מתחילות ב${l}.`, { kind: 'tile', tile: g(l) })]
  }),
  style('ls-name', 'איזה שם מתחיל באות?', ['lettersound'], 't', (sp, r) => {
    const l = one(r, setOf(sp)), name = one(r, NAMES[l])
    const o = some(r, Object.keys(NAMES).filter((x) => !alike(x, l)), 2).map((x) => one(r, NAMES[x]))
    return [`ls-name|${l}`, pick(r, `איזה שם מתחיל ב${ln(l)}?`, { t: name }, o.map((t) => ({ t })), `${name} מתחיל ב${l}.`, { kind: 'tile', tile: g(l) })]
  }),
]

export const FIRST_STYLES: Style[] = [
  style('fs-same', 'אותו צליל ראשון', ['firstsound'], 'e', (_sp, r) => {
    const [la, ...rest] = some(r, [...CLEAR_SOUNDS], 3)
    const [a, b] = some(r, startsWith(la), 2)
    return [`fs-same|${a.w}|${b.w}`, pick(r, `מה מתחיל באותו צליל כמו "${a.w}"?`, picTile(b), rest.map((l) => picTile(one(r, startsWith(l)))), `המילים "${a.w}" ו"${b.w}" מתחילות באותו צליל.`, { kind: 'tile', tile: picTile(a) })]
  }),
  style('fs-last', 'הצליל האחרון', ['firstsound', 'build'], 't', (_sp, r) => {
    const w = one(r, allWords.filter((x) => !alike(x.w.at(-1)!, 'כ') && !'הא'.includes(x.w.at(-1)!))) // a silent ה or א at the end isn't heard
    const last = w.w.at(-1)!
    const o = [...new Set([w.w[0], ...some(r, [...CLEAR_SOUNDS, 'ש', 'ב'], 4)])].filter((x) => !alike(x, last)).slice(0, 2)
    return [`fs-last|${w.w}`, pick(r, `באיזו אות נגמרת המילה "${w.w}"? מקשיבים לסוף!`, g(last), o.map(g), `המילה "${w.w}" נגמרת ב${ln(last)}.`, { kind: 'tile', tile: picTile(w) })]
  }),
  style('fs-not', 'מי לא מתחיל כמו...?', ['firstsound'], 'h', (_sp, r) => {
    const [la, lb] = some(r, [...CLEAR_SOUNDS], 2)
    const [a, b, c] = some(r, startsWith(la), 3)
    if (!c) return null
    const out = one(r, startsWith(lb))
    return [`fs-not|${a.w}|${out.w}`, pick(r, `מי לא מתחיל כמו "${a.w}"?`, picTile(out), [b, c].map(picTile), `המילה "${out.w}" מתחילה בצליל אחר.`, { kind: 'tile', tile: picTile(a) })]
  }),
  style('fs-tap', 'מסמנים אותו צליל', ['firstsound'], 'h', (_sp, r) => {
    const [la, ...rest] = some(r, [...CLEAR_SOUNDS].filter((x) => startsWith(x).length >= 4), 4)
    if (!rest.length) return null
    const [shown, ...ins] = some(r, startsWith(la), 3)
    return [`fs-tap|${la}`, tapall(r, `מסמנים את כל מה שמתחיל כמו "${shown.w}"`, ins.map(picTile), rest.map((l) => picTile(one(r, startsWith(l)))), `${ins.map((x) => x.w).join(' ו')} מתחילים כמו ${shown.w}.`, { kind: 'tile', tile: picTile(shown) })]
  }),
  style('fs-match', 'זוגות של צליל ראשון', ['firstsound'], 'h', (_sp, r) => {
    const ls = some(r, [...CLEAR_SOUNDS], 3)
    return [`fs-match|${[...ls].sort().join('')}`, match('מחברים תמונות שמתחילות באותו צליל', ls.map((l) => { const [a, b] = some(r, startsWith(l), 2); return [picTile(a), picTile(b)] }), 'כל זוג פותח באותו צליל.')]
  }),
]

export const SYLL_STYLES: Style[] = [
  style('sy-clap', 'כמה מחיאות כפיים?', ['syll'], 'e', (sp, r) => {
    const w = one(r, SYLL.filter((x) => (sp.hard ? true : x.n <= 3)))
    return [`sy-clap|${w.w}`, pick(r, `כמה מחיאות כפיים במילה "${w.w}"? מוחאים יחד!`, { g: String(w.n), t: '👏'.repeat(w.n) }, some(r, [1, 2, 3, 4].filter((k) => k !== w.n), 2).map((k) => ({ g: String(k), t: '👏'.repeat(k) })), `${w.w}: ${w.n === 1 ? 'מחיאת כף אחת' : `${w.n} מחיאות כפיים`}.`, { kind: 'tile', tile: picTile(w) })]
  }),
  style('sy-long', 'המילה הכי ארוכה', ['syll'], 't', (_sp, r) => {
    let ws = some(r, SYLL, 3); while (new Set(ws.map((w) => w.n)).size < 3) ws = some(r, SYLL, 3)
    const long = ws.reduce((a, b) => (b.n > a.n ? b : a))
    return [`sy-long|${ws.map((w) => w.w).sort().join()}`, pick(r, 'איזו מילה הכי ארוכה? מוחאים כפיים לכל אחת', picTile(long), ws.filter((w) => w !== long).map(picTile), ws.map((w) => `${w.w}: ${w.n}`).join(', '))]
  }),
  style('sy-short', 'המילה הכי קצרה', ['syll'], 'h', (_sp, r) => {
    let ws = some(r, SYLL, 3); while (new Set(ws.map((w) => w.n)).size < 3) ws = some(r, SYLL, 3)
    const s = ws.reduce((a, b) => (b.n < a.n ? b : a))
    return [`sy-short|${ws.map((w) => w.w).sort().join()}`, pick(r, 'איזו מילה הכי קצרה? הכי מעט מחיאות', picTile(s), ws.filter((w) => w !== s).map(picTile), ws.map((w) => `${w.w}: ${w.n}`).join(', '))]
  }),
  style('sy-which', 'מילה עם מספר מחיאות', ['syll'], 'h', (_sp, r) => {
    const n = int(r, 1, 3), w = one(r, SYLL.filter((x) => x.n === n))
    const o = some(r, SYLL.filter((x) => x.n !== n), 2)
    return [`sy-which|${w.w}`, pick(r, `איזו מילה עם ${n === 1 ? 'מחיאה אחת' : `${n} מחיאות`} בדיוק?`, picTile(w), o.map(picTile), `${w.w}: ${n} ${n === 1 ? 'מחיאה' : 'מחיאות'}.`, { kind: 'tile', tile: { t: '👏'.repeat(n) } })]
  }),
  style('sy-order', 'מהקצרה לארוכה', ['syll'], 't', (_sp, r) => {
    const ws = [1, 2, 3].map((n) => one(r, SYLL.filter((x) => x.n === n)))
    return [`sy-order|${ws.map((w) => w.w).join()}`, order('מסדרים מהמילה הקצרה לארוכה. מוחאים לכל אחת!', ws.map(picTile), ws.map((w) => `${w.w}: ${w.n}`).join(', '))]
  }),
  style('sy-match', 'מילה ומחיאות', ['syll'], 'h', (_sp, r) => {
    const ws = [1, 2, 3].map((n) => one(r, SYLL.filter((x) => x.n === n)))
    return [`sy-match|${ws.map((w) => w.w).sort().join()}`, match('מחברים כל מילה למספר המחיאות שלה', ws.map((w) => [picTile(w), { t: '👏'.repeat(w.n) }]), 'מוחאים לאט, הברה אחרי הברה.')]
  }),
  style('sy-tap', 'מסמנים מילים עם 2 מחיאות', ['syll'], 'h', (_sp, r) => {
    const n = int(r, 2, 3)
    return [`sy-tap|${n}`, tapall(r, `מסמנים את כל המילים עם ${n} מחיאות`, some(r, SYLL.filter((x) => x.n === n), 2).map(picTile), some(r, SYLL.filter((x) => x.n !== n), 3).map(picTile), `שתי מילים עם ${n} מחיאות.`)]
  }),
]

export const RHYME_STYLES: Style[] = [
  style('rh-what', 'מה מתחרז?', ['rhyme'], 'e', (_sp, r) => {
    const grp = one(r, RHYME_GROUPS), [a, b] = some(r, grp, 2)
    const o = some(r, RHYME_GROUPS.filter((x) => x !== grp), 2).map((x) => one(r, x))
    return [`rh-what|${a.w}|${b.w}`, pick(r, `מה מתחרז עם "${a.w}"?`, picTile(b), o.map(picTile), `${a.w} ו${b.w}: נשמע אותו דבר בסוף!`, { kind: 'tile', tile: picTile(a) })]
  }),
  style('rh-odd', 'מי לא מתחרז?', ['rhyme'], 't', (_sp, r) => {
    const grp = one(r, RHYME_GROUPS), pair = some(r, grp, 2), odd = one(r, rhymeOf(r, grp))
    return [`rh-odd|${pair.map((x) => x.w).sort().join()}`, pick(r, 'שתיים מתחרזות ואחת לא. איזו לא מתחרזת?', picTile(odd), pair.map(picTile), `${pair[0].w} ו${pair[1].w} מתחרזות. ${odd.w} לא.`)]
  }),
  style('rh-match', 'זוגות מתחרזים', ['rhyme'], 'h', (_sp, r) => {
    const gs = some(r, RHYME_GROUPS, 3)
    return [`rh-match|${gs.map((x) => x[0].w).sort().join()}`, match('מחברים מילים מתחרזות', gs.map((x) => { const [a, b] = some(r, x, 2); return [picTile(a), picTile(b)] }), 'כל זוג נשמע אותו דבר בסוף.')]
  }),
  style('rh-tap', 'מסמנים מה מתחרז', ['rhyme'], 'h', (_sp, r) => {
    const grp = one(r, RHYME_GROUPS.filter((x) => x.length >= 3))
    const [a, ...ins] = mix(r, grp)
    const outs = some(r, RHYME_GROUPS.filter((x) => x !== grp), 3).map((x) => one(r, x))
    return [`rh-tap|${a.w}`, tapall(r, `מסמנים את כל מה שמתחרז עם "${a.w}"`, ins.slice(0, 3).map(picTile), outs.map(picTile), `${ins.slice(0, 3).map((x) => x.w).join(', ')}: כולם מתחרזים עם ${a.w}.`, { kind: 'tile', tile: picTile(a) })]
  }),
  style('rh-silly', 'חרוז מצחיק', ['rhyme'], 't', (_sp, r) => {
    const grp = one(r, RHYME_GROUPS), [a, b] = some(r, grp, 2)
    const o = some(r, RHYME_GROUPS.filter((x) => x !== grp), 2).map((x) => one(r, x))
    return [`rh-silly|${a.w}`, pick(r, `משלימים את החרוז: "ראיתי ${a.w}, וגם ראיתי..."`, picTile(b), o.map(picTile), `${a.w} ו${b.w}! חרוז מצחיק. אפשר להמציא עוד?`, { kind: 'tile', tile: picTile(a) })]
  }),
]

export const BUILD_STYLES: Style[] = [
  style('bd-build', 'בונים מילה', ['build'], 'e', (sp, r) => {
    const w = one(r, words(sp))
    const tricky = [...w.w].flatMap((ch) => [...(LOOKALIKE[ch] ?? '')]).filter((x) => !w.w.includes(x))
    const extra = [...new Set([...some(r, tricky, 1), ...some(r, [...LETTERS].filter((x) => !w.w.includes(x)), 2)])].slice(0, 2)
    return [`bd-build|${w.w}`, { kind: 'build', q: he(`בונים את המילה "${w.w}"`), e: w.e, w: w.w, extra, why: he(`${[...w.w].map(ln).join(' + ')} = ${w.w}`) }]
  }),
  style('bd-missing', 'איזו אות חסרה?', ['build', 'read'], 't', (sp, r) => {
    const w = one(r, words(sp)), i = int(r, 0, w.w.length - 1), l = w.w[i]
    const others = [...new Set([...(LOOKALIKE[l] ?? '')].concat(some(r, [...LETTERS], 3)))].filter((x) => x !== l).slice(0, 2)
    return [`bd-missing|${w.w}`, pick(r, `איזו אות חסרה במילה "${w.w}"?`, g(l), others.map(g), `${w.w}: חסרה ה${ln(l)}.`, { kind: 'word', e: w.e, w: w.w, hide: i })]
  }),
  style('bd-spell', 'איך כותבים נכון?', ['build', 'read'], 't', (sp, r) => {
    const w = one(r, words(sp).filter((x) => [...x.w].some((ch) => LOOKALIKE[ch])))
    if (!w) return null
    const i = [...w.w].findIndex((ch) => LOOKALIKE[ch]), wrongs = [...LOOKALIKE[w.w[i]]].slice(0, 2).map((x) => w.w.slice(0, i) + x + w.w.slice(i + 1))
    return [`bd-spell|${w.w}`, pick(r, `איך כותבים "${w.w}"? מסתכלים טוב על כל אות`, { t: w.w }, wrongs.map((t) => ({ t })), `כותבים ${w.w}: ${[...w.w].map(ln).join(', ')}.`, { kind: 'tile', tile: { e: w.e } })]
  }),
  style('bd-count', 'כמה אותיות?', ['build', 'read'], 'h', (sp, r) => {
    const w = one(r, allWords.filter((x) => (sp.max ?? 3) <= 2 ? x.w.length <= 2 : true))
    return [`bd-count|${w.w}`, pick(r, `כמה אותיות יש במילה "${w.w}"?`, { g: String(w.w.length) }, [1, 2, 3, 4].filter((k) => k !== w.w.length).slice(0, 2).map((k) => ({ g: String(k) })), `${[...w.w].join(' · ')}: ${w.w.length} אותיות.`, { kind: 'word', e: w.e, w: w.w })]
  }),
  style('bd-first', 'האות הראשונה', ['build', 'lettersound'], 'e', (sp, r) => {
    const w = one(r, words(sp)), l = w.w[0]
    const o = otherLetters(r, l, { s: 'letters', set: LETTERS }, 2).filter((x) => !alike(x, l))
    return [`bd-first|${w.w}`, pick(r, `מה האות הראשונה במילה "${w.w}"? מימין מתחילים!`, g(l), o.map(g), `${w.w} מתחילה ב${ln(l)}.`, { kind: 'word', e: w.e, w: w.w })]
  }),
]

export const READ_STYLES: Style[] = [
  style('rd-pic', 'קוראים ובוחרים תמונה', ['read'], 'e', (sp, r) => {
    const bank = words(sp), w = one(r, bank)
    return [`rd-pic|${w.w}`, pick(r, 'קוראים את המילה ובוחרים תמונה', { e: w.e }, some(r, bank.filter((x) => x !== w), 2).map((x) => ({ e: x.e })), `${[...w.w].map(ln).join(', ')}: ${w.w}!`, { kind: 'word', w: w.w })]
  }),
  style('rd-word', 'איזו מילה מתאימה?', ['read'], 'h', (sp, r) => {
    const bank = words(sp), w = one(r, bank)
    return [`rd-word|${w.w}`, pick(r, 'איזו מילה מתאימה לתמונה?', { t: w.w }, some(r, bank.filter((x) => x !== w), 2).map((x) => ({ t: x.w })), `כתוב: ${w.w}.`, { kind: 'tile', tile: { e: w.e } })]
  }),
  style('rd-close', 'מילים דומות', ['read'], 't', (_sp, r) => {
    const w = one(r, allWords)
    const close = allWords.filter((x) => x !== w && x.w.length === w.w.length && [...x.w].some((ch) => w.w.includes(ch)))
    const o = some(r, close.length >= 2 ? close : allWords.filter((x) => x !== w), 2)
    return [`rd-close|${w.w}`, pick(r, 'איזו מילה מתאימה לתמונה? קוראים עד הסוף!', { t: w.w }, o.map((x) => ({ t: x.w })), `כתוב: ${w.w}.`, { kind: 'tile', tile: { e: w.e } })]
  }),
  style('rd-match', 'מילה ותמונה', ['read'], 'h', (sp, r) => {
    const ws = some(r, words(sp), 3)
    return [`rd-match|${ws.map((w) => w.w).sort().join()}`, match('מחברים כל מילה לתמונה שלה', ws.map((w) => [{ t: w.w }, { e: w.e }]), 'קראת שלוש מילים!')]
  }),
  style('rd-tap', 'מוצאים את המילה', ['read'], 'h', (sp, r) => {
    const bank = words(sp), w = one(r, bank)
    const o = some(r, bank.filter((x) => x !== w), 3)
    return [`rd-tap|${w.w}`, tapall(r, `מסמנים כל מקום שכתוב בו "${w.w}"`, [{ t: w.w }, { t: w.w }], o.map((x) => ({ t: x.w })), `"${w.w}" כתוב פעמיים.`, { kind: 'tile', tile: { e: w.e } })]
  }),
  style('rd-check', 'נכון או לא?', ['read'], 'h', (sp, r) => {
    const bank = words(sp), w = one(r, bank), right = r() < 0.5, pic = right ? w : one(r, bank.filter((x) => x !== w))
    return [`rd-check|${w.w}|${pic.w}`, pick(r, 'קוראים את המילה. היא מתאימה לתמונה?', right ? YES : NO, [right ? NO : YES], right ? `כן! כתוב ${w.w}.` : `כתוב ${w.w}, והתמונה היא ${nice(pic.w)}.`, { kind: 'word', e: pic.e, w: w.w })]
  }),
]

export const LANG_STYLES: Style[] = [...LETTER_STYLES, ...SOUND_STYLES, ...FIRST_STYLES, ...SYLL_STYLES, ...RHYME_STYLES, ...BUILD_STYLES, ...READ_STYLES]
