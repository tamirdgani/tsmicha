/* Questions told in the child's own world.
   Written once, asked with the cast of whichever world the child chose in onboarding:
   "Who has the red suit?" with superheroes, "Who has the red robe?" with little wizards, "How many rockets?" in space…
   Every style keeps to the lesson's numbers (`max`) and letters (`set`), like the rest of the bank. */

import type { Spec } from '../course'
import type { Tile } from '../lessonTypes'
import { alike, LETTER_NAME, LETTERS } from '../kdata'
import { art, COLOR_F, COLOR_HEX, type Char, type Kit, type Thing } from '../../worlds/kits'
import { int, match, mix, near, one, order, pick, range, some, style, tapall, NO, YES, type R, type Style } from './util'

const top = (sp: Spec, d = 5) => sp.max ?? d
const num = (n: number): Tile => ({ g: String(n) })
const nums = (a: number[]) => a.map(num)
const ORD = ['ראשון', 'שני', 'שלישי', 'רביעי']
/** Things from outside every world, for "what doesn't belong here?". */
const OUTSIDERS = ['🍌', '🧦', '🥕', '☂️', '🎸', '🧁', '🪥', '🍉', '🧸', '🛁']

export function kitStyles(K: Kit): Style[] {
  const A = (k: string) => art(K.id, k)
  const ct = (c: Char, name = true): Tile => ({ e: A(c.k), t: name ? c.name : undefined })
  const tt = (t: Thing, cap = false): Tile => ({ e: A(t.k), t: cap ? t.w : undefined })
  const pile = (t: Thing, n: number): Tile => ({ many: { e: A(t.k), n } })
  const which = (t: Thing) => (t.f ? 'איזו' : 'איזה')
  const most = (t: Thing, big: boolean) => (big ? (t.f ? 'הכי גדולה' : 'הכי גדול') : (t.f ? 'הכי קטנה' : 'הכי קטן'))
  const he3 = (c: Char) => (c.f ? { s: 'היא', got: 'קיבלה', gave: 'נתנה', to: 'לה' } : { s: 'הוא', got: 'קיבל', gave: 'נתן', to: 'לו' })
  const colorWord = (c: Char) => (K.colorF ? COLOR_F[c.c] : c.c)
  const dot = (c: string): Tile => ({ shape: 'circle', color: COLOR_HEX[c], t: c })
  const things = K.things
  const chars = K.chars
  /** Everything with a name, for letters and syllables. */
  const named = [...chars.map((c) => ({ k: c.k, w: c.name, syl: c.syl, tile: ct(c), isName: true })), ...things.map((t) => ({ k: t.k, w: t.w, syl: t.syl, tile: tt(t, true), isName: false }))]
  const theWord = (x: { w: string; isName: boolean }) => (x.isName ? `השם ${x.w}` : `המילה "${x.w}"`)
  const byKey = (k: string): Tile => { const c = chars.find((x) => x.k === k); if (c) return ct(c); return tt(things.find((x) => x.k === k)!, true) }
  /** Things that can sit above or below another (one-word names read well in "מעל ה…"). */
  const placeable = things.filter((t) => !t.w.includes(' '))
  const castIsDifferent = K.id !== 'animals' // in the animal world the "things" are animals too

  const S = (id: string, name: string, skills: Style['skills'], lv: Style['lv'], make: Style['make']) => style(`k-${id}`, name, skills, lv, make)

  return [
    /* ───── counting ───── */
    S('count', 'כמה יש?', ['count'], 'e', (sp, r) => {
      const t = one(r, things), max = top(sp), n = int(r, Math.max(1, sp.min ?? 1), max)
      return [`k-count|${t.k}|${n}`, pick(r, `כמה ${t.pl} יש?`, num(n), nums(near(r, n, 2, Math.max(max, 3), 1)), `סופרים: ${range(1, n).join(', ')}. יש ${n} ${t.pl}!`, { kind: 'pile', e: A(t.k), n })]
    }),
    S('count-crew', 'כמה מהם באו?', ['count'], 'e', (sp, r) => {
      const n = int(r, 2, Math.min(top(sp), chars.length))
      return [`k-crew|${n}`, pick(r, `כמה ${K.crew} באו לשחק?`, num(n), nums(near(r, n, 2, Math.max(top(sp), 3), 1)), `סופרים אחד־אחד: יש ${n}.`, { kind: 'row', items: some(r, chars, n).map((c) => ct(c, false)) })]
    }),
    S('count-only', 'סופרים רק אותם', ['count'], 't', (sp, r) => {
      const [a, b] = some(r, things, 2), max = Math.max(4, top(sp))
      const na = int(r, 2, Math.min(max, 6)), nb = int(r, 1, 3)
      const wrong = [na + nb, ...near(r, na, 2, na + nb + 1, 1).filter((k) => k !== na + nb)].slice(0, 2)
      return [`k-only|${a.k}|${b.k}|${na}`, pick(r, `כמה ${a.pl} יש? סופרים רק אותם!`, num(na), nums(wrong), `יש ${na} ${a.pl}. את ה${b.pl} לא סופרים.`, { kind: 'row', items: mix(r, [...Array(na).fill(a), ...Array(nb).fill(b)]).map((t) => tt(t)) })]
    }),
    S('eyes', 'כמה עיניים?', ['count'], 'h', (_sp, r) => {
      const c = one(r, chars.filter((x) => /עין|עיניים/.test(x.clue)))
      if (!c) return null
      const n = c.clue.includes('אחת') ? 1 : c.clue.includes('שתי') ? 2 : 3
      return [`k-eyes|${c.k}`, pick(r, `כמה עיניים יש ל${c.name}?`, num(n), nums([1, 2, 3].filter((x) => x !== n)), `ל${c.name} יש ${n === 1 ? 'עין אחת' : `${n} עיניים`}.`, { kind: 'tile', tile: ct(c) })]
    }),

    /* ───── numbers ───── */
    S('numrec', 'איפה המספר?', ['numrec'], 'e', (sp, r) => {
      const t = one(r, things), max = top(sp), n = int(r, 1, max)
      return [`k-numrec|${t.k}|${n}`, pick(r, `איפה יש ${n} ${t.pl}?`, pile(t, n), near(r, n, 2, Math.max(max, 3), 1).map((k) => pile(t, k)), `סופרים: ${range(1, n).join(', ')}.`, { kind: 'tile', tile: num(n) })]
    }),
    S('nummatch', 'מחברים קבוצה למספר', ['numrec', 'count'], 'h', (sp, r) => {
      const t = one(r, things), ns = some(r, range(1, top(sp)), 3)
      return [`k-nummatch|${t.k}|${[...ns].sort().join()}`, match(`מחברים כל קבוצת ${t.pl} למספר שלה`, ns.map((k) => [pile(t, k), num(k)]), 'סופרים לאט, אחד־אחד.')]
    }),
    S('more', 'איפה יותר?', ['moreless'], 'e', (sp, r) => {
      const t = one(r, things), max = Math.max(3, top(sp))
      const [a, b] = some(r, range(1, max), 2).sort((x, y) => y - x)
      return [`k-more|${t.k}|${a}|${b}`, pick(r, `איפה יש יותר ${t.pl}?`, pile(t, a), [pile(t, b)], `${a} זה יותר מ־${b}.`)]
    }),
    S('less', 'איפה פחות?', ['moreless'], 'h', (sp, r) => {
      const t = one(r, things), max = Math.max(4, top(sp))
      const [a, b, c] = some(r, range(1, max), 3).sort((x, y) => x - y)
      return [`k-less|${t.k}|${a}|${b}|${c}`, pick(r, `איפה יש הכי מעט ${t.pl}?`, pile(t, a), [pile(t, b), pile(t, c)], `${a} זה הכי מעט.`)]
    }),
    S('same', 'אותו מספר', ['moreless', 'count'], 't', (sp, r) => {
      const [t, u] = some(r, things, 2), max = Math.max(4, top(sp)), n = int(r, 2, max)
      return [`k-same|${t.k}|${u.k}|${n}`, pick(r, `איפה יש אותו מספר ${u.pl} כמו ה${t.pl} כאן?`, pile(u, n), near(r, n, 2, max + 1, 1).map((k) => pile(u, k)), `גם כאן וגם שם יש ${n}.`, { kind: 'pile', e: A(t.k), n })]
    }),
    S('numorder', 'מהמעט להרבה', ['numorder'], 'h', (sp, r) => {
      const t = one(r, things), ns = some(r, range(1, Math.max(4, top(sp))), 3).sort((a, b) => a - b)
      return [`k-numorder|${t.k}|${ns.join()}`, order(`מסדרים את ה${t.pl}: מהכי מעט להכי הרבה`, ns.map((k) => pile(t, k)), `${ns.join(', ')}: כל פעם יותר.`)]
    }),
    S('next', 'מה בא אחרי?', ['numorder', 'count'], 'e', (sp, r) => {
      const t = one(r, things), max = Math.max(4, top(sp)), n = int(r, 1, max - 2)
      return [`k-next|${t.k}|${n}`, pick(r, `${n}, ${n + 1}… כמה ${t.pl} יהיו בקבוצה הבאה?`, num(n + 2), nums(near(r, n + 2, 2, max + 1, 1)), `כל קבוצה גדלה באחד: ${n}, ${n + 1}, ${n + 2}.`, { kind: 'row', items: [pile(t, n), pile(t, n + 1)], ask: true })]
    }),

    /* ───── adding and taking away ───── */
    S('add', 'כמה ביחד?', ['add'], 'e', (sp, r) => {
      const t = one(r, things), max = Math.max(3, top(sp)), s = int(r, 2, max), a = int(r, 1, s - 1)
      return [`k-add|${t.k}|${a}|${s - a}`, pick(r, `כמה ${t.pl} יש ביחד?`, num(s), nums(near(r, s, 2, max + 1, 1)), `${a} ועוד ${s - a} זה ${s}.`, { kind: 'sum', e: A(t.k), a, b: s - a, op: '+' })]
    }),
    S('add-story', 'סיפור חיבור', ['add'], 'h', (sp, r) => {
      const c = one(r, chars), t = one(r, things), max = Math.max(3, top(sp)), s = int(r, 2, max), a = int(r, 1, s - 1), p = he3(c)
      return [`k-addst|${c.k}|${t.k}|${a}|${s - a}`, pick(r, `ל${c.name} יש ${a} ${t.pl}. ${p.s} ${p.got} עוד ${s - a}. כמה יש ${p.to} עכשיו?`, num(s), nums(near(r, s, 2, max + 1, 1)), `${a} ועוד ${s - a} זה ${s}.`, { kind: 'sum', e: A(t.k), a, b: s - a, op: '+' })]
    }),
    S('sub', 'כמה נשארו?', ['sub'], 'e', (sp, r) => {
      const t = one(r, things), max = Math.max(3, top(sp)), a = int(r, 2, max), b = int(r, 1, a - 1)
      return [`k-sub|${t.k}|${a}|${b}`, pick(r, `היו ${a} ${t.pl}, ו־${b} ${t.f ? 'מהן' : 'מהם'} ${K.gone[t.f ? 1 : 0]}. כמה נשארו?`, num(a - b), nums(near(r, a - b, 2, max, 0)), `${a} פחות ${b} זה ${a - b}.`, { kind: 'sum', e: A(t.k), a, b, op: '-' })]
    }),
    S('sub-story', 'סיפור חיסור', ['sub'], 'h', (sp, r) => {
      const c = one(r, chars), t = one(r, things), max = Math.max(3, top(sp)), a = int(r, 2, max), b = int(r, 1, a - 1), p = he3(c)
      return [`k-subst|${c.k}|${t.k}|${a}|${b}`, pick(r, `ל${c.name} היו ${a} ${t.pl}. ${p.s} ${p.gave} ${b} לחבר. כמה נשארו ${p.to}?`, num(a - b), nums(near(r, a - b, 2, max, 0)), `${a} פחות ${b} זה ${a - b}. וגם החבר שמח!`, { kind: 'sum', e: A(t.k), a, b, op: '-' })]
    }),

    /* ───── colors ───── */
    S('color-who', 'למי יש את הצבע?', ['colors'], 'e', (_sp, r) => {
      const [c, ...rest] = some(r, chars, 3)
      return [`k-cwho|${c.k}`, pick(r, K.colorQ.replace('{c}', colorWord(c)), ct(c), rest.map((x) => ct(x)), `${c.name}: ${c.c}!`)]
    }),
    S('color-of', 'באיזה צבע?', ['colors'], 'e', (_sp, r) => {
      const c = one(r, chars), others = some(r, [...new Set(chars.map((y) => y.c))].filter((x) => x !== c.c), 2)
      return [`k-cof|${c.k}`, pick(r, K.colorOf.replace('{n}', c.name), dot(c.c), others.map(dot), `${c.name}: ${c.c}!`, { kind: 'tile', tile: ct(c) })]
    }),
    S('color-match', 'מחברים לצבע', ['colors'], 'h', (_sp, r) => {
      const set = some(r, chars, 3)
      return [`k-cmatch|${set.map((c) => c.k).sort().join()}`, match('מחברים כל אחד לצבע שלו', set.map((c) => [ct(c, false), dot(c.c)]), 'כל אחד מצא את הצבע שלו!')]
    }),
    S('color-tf', 'נכון או לא?', ['colors', 'riddle'], 'e', (_sp, r) => {
      const c = one(r, chars), truth = r() < 0.5, claim = truth ? c.c : one(r, chars.filter((x) => x.c !== c.c)).c
      return [`k-ctf|${c.k}|${claim}`, pick(r, `נכון או לא נכון: ${c.name} בצבע ${claim}.`, truth ? YES : NO, [truth ? NO : YES], truth ? `נכון! ${c.name} ${c.c}.` : `לא נכון. ${c.name} ${c.c}, לא ${claim}.`, { kind: 'tile', tile: ct(c) })]
    }),
    S('color-shadow', 'מי מסתתר בצל?', ['colors', 'riddle'], 't', (_sp, r) => {
      const [c, ...rest] = some(r, chars, 3)
      return [`k-csh|${c.k}`, pick(r, `${c.name} הסתתר בצל. באיזה צבע ${c.name}?`.replace('הסתתר', c.f ? 'הסתתרה' : 'הסתתר'), dot(c.c), rest.map((x) => dot(x.c)), `${c.name} ${c.c}!`, { kind: 'tile', tile: { e: A(c.k), fx: 'sil' } })]
    }),

    /* ───── sizes ───── */
    S('big', 'מי הכי גדול?', ['size'], 'e', (_sp, r) => {
      const t = one(r, things), big = r() < 0.5
      const sc = [0.5, 0.78, 1.12]
      return [`k-big|${t.k}|${big}`, pick(r, `${which(t)} ${t.w} ${most(t, big)}?`, { e: A(t.k), scale: big ? sc[2] : sc[0] }, [{ e: A(t.k), scale: sc[1] }, { e: A(t.k), scale: big ? sc[0] : sc[2] }], big ? 'זה שתופס הכי הרבה מקום.' : 'זה שתופס הכי מעט מקום.')]
    }),
    S('big-char', 'מי גדל?', ['size'], 'e', (_sp, r) => {
      const c = one(r, chars), big = r() < 0.5
      return [`k-bigc|${c.k}|${big}`, pick(r, big ? `איפה ${c.name} הכי ${c.f ? 'גדולה' : 'גדול'}?` : `איפה ${c.name} הכי ${c.f ? 'קטנה' : 'קטן'}?`, { e: A(c.k), scale: big ? 1.12 : 0.5 }, [{ e: A(c.k), scale: 0.78 }, { e: A(c.k), scale: big ? 0.5 : 1.12 }], 'מסתכלים על כולם, ומשווים.')]
    }),
    S('size-order', 'מסדרים לפי גודל', ['size'], 'h', (_sp, r) => {
      const c = one(r, chars)
      return [`k-sizeord|${c.k}`, order(`מסדרים את ${c.name}: מהקטן לגדול`, [0.45, 0.7, 0.95, 1.18].map((s) => ({ e: A(c.k), scale: s })), 'קטן, בינוני, גדול, ענק!')]
    }),
    S('size-mid', 'מי באמצע?', ['size'], 't', (_sp, r) => {
      const t = one(r, things)
      return [`k-sizemid|${t.k}`, pick(r, `${which(t)} ${t.w} לא ${t.f ? 'הכי גדולה' : 'הכי גדול'} וגם לא ${t.f ? 'הכי קטנה' : 'הכי קטן'}?`, { e: A(t.k), scale: 0.78 }, [{ e: A(t.k), scale: 0.48 }, { e: A(t.k), scale: 1.12 }], 'זה שבאמצע: גדול מאחד וקטן מהשני.')]
    }),

    /* ───── where is it? ───── */
    S('where', 'איפה הוא?', ['position'], 'e', (_sp, r) => {
      const c = one(r, chars), t = one(r, placeable)
      const rels = ['above', 'below', 'next'] as const
      const say = { above: `מעל ה${t.w}`, below: `מתחת ל${t.w}`, next: `ליד ה${t.w}` }
      const rel = one(r, rels)
      return [`k-where|${c.k}|${t.k}|${rel}`, pick(r, `איפה ${c.name}?`, { t: say[rel] }, rels.filter((x) => x !== rel).map((x) => ({ t: say[x] })), `${c.name} ${say[rel]}.`, { kind: 'scene', a: A(c.k), b: A(t.k), rel })]
    }),
    S('line', 'מי עומד בתור?', ['position', 'numorder'], 'h', (_sp, r) => {
      const row = some(r, chars, 4), i = int(r, 0, 3)
      return [`k-line|${row.map((c) => c.k).join()}|${i}`, pick(r, `התור מתחיל מימין. מי עומד ${ORD[i]}?`, ct(row[i]), row.filter((_, k) => k !== i).slice(0, 2).map((c) => ct(c)), `סופרים מימין: ${ORD.slice(0, i + 1).join(', ')}.`, { kind: 'row', items: row.map((c) => ct(c, false)) })]
    }),

    /* ───── odd one out, patterns, sorting ───── */
    S('odd', 'מה לא שייך?', ['odd'], 'e', (_sp, r) => {
      const [a, b] = some(r, things, 2)
      return [`k-odd|${a.k}|${b.k}`, pick(r, 'מה לא שייך?', tt(b), [tt(a), tt(a), tt(a)], `כולם ${a.pl}, חוץ מ${b.f ? 'אחת' : 'אחד'}.`)]
    }),
    S('odd-world', 'מי הגיע מעולם אחר?', ['odd', 'sortcat', 'logic'], 't', (_sp, r) => {
      const set = some(r, [...things.map((t) => t.k), ...chars.map((c) => c.k)], 3), out = one(r, OUTSIDERS)
      return [`k-oddw|${out}|${[...set].sort().join()}`, pick(r, `מי לא שייך לעולם של ${K.crew}?`, { e: out }, set.map((k) => ({ e: A(k) })), `כל השאר מהעולם של ${K.crew}!`)]
    }),
    S('odd-cast', 'מי לא מהחבורה?', ['odd', 'sortcat'], 'h', (_sp, r) => {
      if (!castIsDifferent) return null
      const set = some(r, chars, 3), t = one(r, things)
      return [`k-oddc|${t.k}|${set.map((c) => c.k).sort().join()}`, pick(r, `מי לא ${K.one}?`, tt(t), set.map((c) => ct(c, false)), `כולם ${K.crew}, ו${t.f ? 'זאת' : 'זה'} ${t.w}.`)]
    }),
    S('tap-cast', 'מסמנים את כל החבורה', ['sortcat', 'odd'], 'h', (_sp, r) => {
      if (!castIsDifferent) return null
      const k = int(r, 2, 3), cs = some(r, chars, k), ts = some(r, things, 5 - k)
      return [`k-tapc|${cs.map((c) => c.k).sort().join()}`, tapall(r, `מסמנים את כל ${K.crew}`, cs.map((c) => ct(c, false)), ts.map((t) => tt(t)), `יש כאן ${k} ${K.crew.replace(/^ה/, '')}.`)]
    }),
    S('pattern', 'מי הבא בתור?', ['pattern'], 'e', (_sp, r) => {
      const [a, b, c] = some(r, chars, 3)
      return [`k-pat|${a.k}|${b.k}`, pick(r, 'מי בא אחר כך?', ct(b), [ct(a), ct(c)], `${a.name}, ${b.name}, ${a.name}, ${b.name}… עכשיו ${b.name}!`, { kind: 'row', items: [a, b, a, b, a].map((x) => ct(x, false)), ask: true })]
    }),
    S('pattern-things', 'דפוס של דברים', ['pattern'], 'h', (_sp, r) => {
      const [a, b, c] = some(r, things, 3)
      const kind = one(r, ['aab', 'abc', 'abb'] as const)
      const unit = kind === 'aab' ? [a, a, b] : kind === 'abc' ? [a, b, c] : [a, b, b]
      const row = [...unit, ...unit, unit[0]]
      const ans = unit[1]
      return [`k-patt|${kind}|${a.k}|${b.k}|${c.k}`, pick(r, 'מה בא אחר כך?', tt(ans, true), [...new Set([a, b, c].filter((x) => x !== ans))].slice(0, 2).map((x) => tt(x, true)), 'מוצאים מה חוזר, וממשיכים.', { kind: 'row', items: row.map((x) => tt(x)), ask: true })]
    }),

    /* ───── riddles ───── */
    S('shadow', 'של מי הצל?', ['riddle', 'odd'], 't', (_sp, r) => {
      const [t, ...rest] = some(r, things, 3)
      return [`k-shadow|${t.k}`, pick(r, 'של מי הצל הזה?', tt(t, true), rest.map((x) => tt(x, true)), `זה הצל של ה${t.w}!`, { kind: 'tile', tile: { e: A(t.k), fx: 'sil' } })]
    }),
    S('peek', 'מי מציץ?', ['riddle'], 'h', (_sp, r) => {
      const [t, ...rest] = some(r, things, 3)
      return [`k-peek|${t.k}`, pick(r, 'רואים רק חצי! מי מציץ?', tt(t, true), rest.map((x) => tt(x, true)), `זה ${t.w}!`, { kind: 'tile', tile: { e: A(t.k), fx: 'peek' } })]
    }),
    S('upside', 'מה התהפך?', ['riddle', 'odd'], 'h', (_sp, r) => {
      const [t, ...rest] = some(r, things, 4)
      return [`k-upside|${t.k}|${rest.map((x) => x.k).sort().join()}`, pick(r, `מי עומד הפוך?`, { e: A(t.k), fx: 'tilt' }, rest.map((x) => tt(x)), `ה${t.w} עומד${t.f ? 'ת' : ''} על הראש!`)]
    }),
    S('shadow-match', 'מחברים לצל', ['riddle', 'logic'], 'h', (_sp, r) => {
      const set = some(r, things, 3)
      return [`k-shm|${set.map((t) => t.k).sort().join()}`, match('מחברים כל אחד לצל שלו', set.map((t) => [tt(t), { e: A(t.k), fx: 'sil' }]), 'הצורה של הצל היא כמו הצורה של הדבר.')]
    }),
    S('who-am-i', 'מי אני?', ['riddle', 'logic'], 't', (_sp, r) => {
      const [c, ...rest] = some(r, chars, 3)
      if (rest.some((x) => x.clue === c.clue)) return null
      return [`k-who|${c.k}`, pick(r, `${c.clue}, ואני ${c.f ? COLOR_F[c.c] : c.c}. מי אני?`, ct(c), rest.map((x) => ct(x)), `אני ${c.name}!`)]
    }),
    S('pairs', 'מה הולך ביחד?', ['logic'], 'h', (_sp, r) => {
      const [a, b, why] = one(r, K.pairs)
      const others = some(r, things.filter((t) => t.k !== a && t.k !== b && !K.pairs.some((p) => (p[0] === a && p[1] === t.k) || (p[1] === a && p[0] === t.k))), 2)
      return [`k-pairs|${a}|${b}`, pick(r, 'מה הולך הכי טוב עם זה?', byKey(b), others.map((t) => tt(t, true)), why, { kind: 'tile', tile: byKey(a) })]
    }),

    /* ───── letters and sounds ───── */
    S('first', 'באיזו אות מתחיל?', ['lettersound'], 'e', (sp, r) => {
      const set = [...(sp.set ?? LETTERS)]
      const pool = named.filter((x) => set.includes(x.w[0]))
      if (!pool.length) return null
      const x = one(r, pool), l = x.w[0]
      const wrong = some(r, (set.length >= 3 ? set : [...LETTERS]).filter((y) => !alike(y, l)), 2)
      return [`k-first|${x.k}`, pick(r, `באיזו אות ${x.isName ? 'מתחיל' : 'מתחילה'} ${theWord(x)}?`, { g: l }, wrong.map((g) => ({ g })), `${x.w} מתחיל ב־${l} (${LETTER_NAME[l]}).`, { kind: 'tile', tile: x.tile })]
    }),
    S('letter-who', 'מה מתחיל באות?', ['lettersound', 'letters'], 'h', (sp, r) => {
      const set = [...(sp.set ?? LETTERS)]
      const pool = named.filter((x) => set.includes(x.w[0]))
      if (!pool.length) return null
      const x = one(r, pool), l = x.w[0]
      const others = some(r, named.filter((y) => !alike(y.w[0], l)), 2)
      return [`k-lwho|${x.k}`, pick(r, `מה מתחיל באות ${l} (${LETTER_NAME[l]})?`, x.tile, others.map((y) => y.tile), `${x.w} מתחיל ב־${l}.`, { kind: 'tile', tile: { g: l } })]
    }),
    S('same-sound', 'אותו צליל ראשון', ['firstsound', 'lettersound'], 'h', (sp, r) => {
      const set = sp.set ? [...sp.set] : [...LETTERS]
      const groups = set.map((l) => named.filter((y) => y.w[0] === l)).filter((g) => g.length >= 2)
      if (!groups.length) return null
      const [x, y] = some(r, one(r, groups), 2), l = x.w[0]
      const others = some(r, named.filter((z) => !alike(z.w[0], l)), 2)
      return [`k-same|${[x.k, y.k].sort().join()}`, pick(r, `מה מתחיל באותו צליל כמו ${x.w}?`, y.tile, others.map((z) => z.tile), `${x.w} ו${y.w}: שניהם מתחילים ב־${l}.`, { kind: 'tile', tile: x.tile })]
    }),
    S('find-letter', 'עוזרים למצוא אות', ['letters', 'lettersound'], 'e', (sp, r) => {
      const set = [...(sp.set ?? 'אב')], c = one(r, chars), l = one(r, set), p = he3(c)
      const wrong = some(r, (set.length >= 3 ? set : [...LETTERS]).filter((y) => !alike(y, l)), 2)
      return [`k-findl|${c.k}|${l}`, pick(r, `${c.name} ${c.f ? 'מחפשת' : 'מחפש'} את האות ${l} (${LETTER_NAME[l]}). איפה ${p.s}?`.replace(`איפה ${p.s}`, 'איפה היא'), { g: l }, wrong.map((g) => ({ g })), `זאת האות ${LETTER_NAME[l]}!`, { kind: 'tile', tile: ct(c) })]
    }),
    S('find-num', 'עוזרים למצוא מספר', ['numrec', 'numorder'], 'e', (sp, r) => {
      const c = one(r, chars), max = top(sp), n = int(r, 1, max)
      return [`k-findn|${c.k}|${n}`, pick(r, `${c.name} ${c.f ? 'מחפשת' : 'מחפש'} את המספר ${n}. איפה הוא?`, num(n), nums(near(r, n, 2, Math.max(max, 3), 1)), `זה המספר ${n}!`, { kind: 'tile', tile: ct(c) })]
    }),
    S('build', 'בונים את השם', ['build', 'read'], 'e', (sp, r) => {
      const len = Math.max(2, Math.min(3, sp.max ?? 3))
      const pool = named.filter((x) => x.w.length <= len && x.w.length >= 2 && !/[ךםןףץ ]/.test(x.w))
      if (!pool.length) return null
      const x = one(r, pool), extra = some(r, [...LETTERS].filter((y) => !x.w.includes(y)), 2)
      return [`k-build|${x.k}`, { kind: 'build', q: { he: `בונים את ${theWord(x)}`, en: '' }, e: A(x.k), w: x.w, extra, why: { he: `${[...x.w].join(' + ')} = ${x.w}`, en: '' } }]
    }),
    S('read', 'מה כתוב?', ['read'], 'h', (sp, r) => {
      const len = Math.max(2, Math.min(4, (sp.max ?? 3) + 1))
      const pool = named.filter((x) => x.w.length <= len && !x.w.includes(' '))
      if (pool.length < 3) return null
      const [x, ...rest] = some(r, pool, 3)
      return [`k-read|${x.k}`, pick(r, 'קוראים את המילה. איזו תמונה מתאימה?', { e: A(x.k) }, rest.map((y) => ({ e: A(y.k) })), `כתוב ${x.w}.`, { kind: 'word', w: x.w })]
    }),
    S('syll', 'כמה מחיאות?', ['syll'], 'e', (_sp, r) => {
      const x = one(r, named.filter((y) => y.syl > 0 && y.syl <= 4))
      return [`k-syll|${x.k}`, pick(r, `כמה מחיאות כף יש ב"${x.w}"?`, num(x.syl), nums(some(r, [1, 2, 3, 4].filter((n) => n !== x.syl), 2)), `${x.w}: ${'👏'.repeat(x.syl)} ${x.syl === 1 ? 'מחיאה אחת' : `${x.syl} מחיאות`}.`, { kind: 'tile', tile: x.tile })]
    }),
    S('syll-sort', 'קצר או ארוך?', ['syll'], 'h', (_sp, r) => {
      const pool = named.filter((y) => y.syl > 0 && y.syl <= 4)
      const short = one(r, pool.filter((y) => y.syl <= 2)), long = one(r, pool.filter((y) => y.syl >= 3))
      if (!short || !long) return null
      return [`k-syls|${short.k}|${long.k}`, pick(r, 'במילה של מי יש יותר מחיאות כף?', long.tile, [short.tile], `${long.w}: ${long.syl} מחיאות. ${short.w}: ${short.syl}.`)]
    }),
  ]
}

/** Memory pairs for a world game: a thing and its shadow, or a character and its color. */
export function kitMemory(K: Kit, r: R, n: number): [Tile, Tile][] {
  const A = (k: string) => art(K.id, k)
  if (r() < 0.5) return some(r, K.things, n).map((t) => [{ e: A(t.k) }, { e: A(t.k), fx: 'sil' }])
  return some(r, K.chars, n).map((c) => [{ e: A(c.k) }, { shape: 'circle', color: COLOR_HEX[c.c], t: c.c }])
}
