/* Builds every lesson from its skills. A lesson is 3 parts:
   part 1 opens with Piko explaining (the parent reads it aloud), then easy practice;
   part 2 is regular practice; part 3 is harder and ends with a challenge question.
   Generation is seeded by the lesson id, so a lesson is the same every time it's opened. */

import type { L, PathNode, Skill, Spec } from './course'
import type { ExplainStep, FactStep, Lesson, MemoryStep, Part, PuzzleStep, Shape, Step, Tile } from './lessonTypes'
import {
  alike, CATS, CLEAR_SOUNDS, COLORS, CRITTERS, DAYS, FEELINGS, LETTER_NAME, LETTERS, PLACES, RHYMES, ROUTINE, SCHOOLBAG,
  SEASONS, SHAPES, SHORT2, SHORT3, SOCIAL, SORT_PAIRS, SORT_PAIRS_HARD, STORIES, SYLL, WORDS_BY_LETTER, type Pic,
  ANALOGIES, CORNERS, FEEL_THINK, KIDS, LOOKALIKE, MIXES, ODD_PROPS, PROP_SORTS, FACTS, type Fact,
} from './kdata'

/* ───────── seeded randomness ───────── */
type R = () => number
function rng(seed: string): R {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19) }
  let a = h >>> 0
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
const int = (r: R, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))
const one = <T,>(r: R, a: readonly T[]) => a[Math.floor(r() * a.length)]
const mix = <T,>(r: R, a: readonly T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
const some = <T,>(r: R, a: readonly T[], n: number) => mix(r, a).slice(0, n)

const he = (s: string): L => ({ he: s, en: s })
const nice = (w: string) => w.replaceAll('־', ' ')
const picTile = (p: Pic): Tile => ({ e: p.e, t: nice(p.w) })

/** Shuffles the right answer in among the others and remembers where it landed. */
function choices(r: R, right: Tile, others: Tile[]) {
  const all = mix(r, [right, ...others])
  return { options: all, correct: all.indexOf(right) }
}
/** Numbers near n (never n itself), inside 0…hi. */
function near(r: R, n: number, count: number, hi: number, lo = 0) {
  const pool = [n - 2, n - 1, n + 1, n + 2, n + 3, n - 3].filter((x) => x >= lo && x <= hi && x !== n)
  return some(r, [...new Set(pool)], count)
}

/* ───────── one exercise per call: (spec, difficulty 0–2, random) → step ───────── */
type Gen = (sp: Spec, d: number, r: R) => Step

const G: Record<Skill, Gen> = {
  colors(_sp, d, r) {
    const n = d === 0 ? 3 : 4
    const set = some(r, COLORS, n)
    const target = set[0]
    if (d < 2 && r() < 0.5) {
      const { options, correct } = choices(r, { shape: 'circle', color: target.c }, set.slice(1).map((c) => ({ shape: 'circle' as Shape, color: c.c })))
      return { kind: 'pick', q: he(`איפה הצבע ה${target.n}?`), options, correct, why: he(`זה ${target.n}!`) }
    }
    if (d === 2 && r() < 0.5) {
      const pairs = set.slice(0, 3).map((c) => [{ shape: 'circle', color: c.c }, { e: one(r, c.e) }] as [Tile, Tile])
      return { kind: 'match', q: he('מחברים כל צבע לתמונה באותו צבע'), pairs, why: he('כל צבע מצא את החבר שלו!') }
    }
    const { options, correct } = choices(r, { e: one(r, target.e) }, set.slice(1).map((c) => ({ e: one(r, c.e) })))
    return { kind: 'pick', q: he(`מה בצבע ${target.n}?`), show: { kind: 'tile', tile: { shape: 'circle', color: target.c } }, options, correct, why: he(`נכון, זה ${target.n}.`), challenge: d === 2 }
  },

  shapes(sp, d, r) {
    const set = some(r, SHAPES, d === 0 ? 3 : 4)
    const target = set[0]
    if (sp.hard || d === 2) {
      if (r() < 0.5) {
        const pairs = set.slice(0, 3).map((s) => [{ shape: s.s, color: '#4da3ff' }, { e: one(r, s.e) }] as [Tile, Tile])
        return { kind: 'match', q: he('לאיזו צורה כל דבר דומה?'), pairs, why: he('יש צורות בכל מקום מסביבנו!') }
      }
      const { options, correct } = choices(r, { e: one(r, target.e) }, set.slice(1).map((s) => ({ e: one(r, s.e) })))
      return { kind: 'pick', q: he(`מה דומה ל${target.n}?`), show: { kind: 'tile', tile: { shape: target.s, color: '#4da3ff' } }, options, correct, why: he(`נכון, זה בצורת ${target.n}.`), challenge: d === 2 }
    }
    if (r() < 0.5) {
      const { options, correct } = choices(r, { t: target.n }, set.slice(1).map((s) => ({ t: s.n })))
      return { kind: 'pick', q: he('איזו צורה זאת?'), show: { kind: 'tile', tile: { shape: target.s, color: one(r, COLORS).c } }, options, correct, why: he(`זה ${target.n}.`) }
    }
    const color = one(r, COLORS).c
    const { options, correct } = choices(r, { shape: target.s, color }, set.slice(1).map((s) => ({ shape: s.s as Shape, color })))
    return { kind: 'pick', q: he(`איפה ה${target.n}?`), options, correct, why: he(`הנה ה${target.n}!`) }
  },

  size(sp, d, r) {
    const thing = one(r, ['🐘', '🐶', '🍎', '🚗', '🎈', '⭐', '🐟', '🌳'])
    const scales = d === 0 ? [0.45, 0.75, 1.15] : [0.4, 0.62, 0.84, 1.1]
    if (sp.hard || d === 2) {
      return { kind: 'order', q: he('מסדרים מהקטן ביותר לגדול ביותר'), items: scales.map((s) => ({ e: thing, scale: s })), why: he('מהקטן אל הגדול, צעד אחרי צעד.'), challenge: d === 2 }
    }
    const big = r() < 0.5
    const right = big ? scales.length - 1 : 0
    const opts = mix(r, scales.map((s, i) => ({ i, s })))
    return { kind: 'pick', q: he(big ? 'מי הכי גדול?' : 'מי הכי קטן?'), options: opts.map((o) => ({ e: thing, scale: o.s })), correct: opts.findIndex((o) => o.i === right), why: he(big ? 'זה הכי גדול!' : 'זה הכי קטן!') }
  },

  position(sp, d, r) {
    const a = one(r, CRITTERS), b = sp.hard ? one(r, PLACES) : PLACES[0]
    const rels = (['above', 'below', 'inside', 'next'] as const)
    const rel = one(r, rels)
    const others = some(r, rels.filter((x) => x !== rel), d === 0 ? 2 : 3)
    const { options, correct } = choices(r, { t: b[rel] }, others.map((x) => ({ t: b[x] })))
    return { kind: 'pick', q: he(`איפה ה${a.w}?`), show: { kind: 'scene', a: a.e, b: b.e, rel }, options, correct, why: he(`ה${a.w} ${b[rel]}.`), challenge: d === 2 }
  },

  odd(sp, d, r) {
    const keys = Object.keys(CATS).filter((k) => !['hot', 'cold'].includes(k))
    const [ka, kb] = some(r, sp.hard ? ['fruit', 'veg', 'sea', 'sky', 'animals', 'toys'] : keys, 2)
    const ins = some(r, CATS[ka].items, d === 0 ? 2 : 3), out = one(r, CATS[kb].items)
    const { options, correct } = choices(r, { e: out.e }, ins.map((p) => ({ e: p.e })))
    return { kind: 'pick', q: he('מה לא שייך?'), options, correct, why: he(`ה${nice(out.w)} לא שייך. כל השאר הם ${CATS[ka].name}.`), challenge: d === 2 }
  },

  pattern(sp, d, r) {
    const hard = sp.hard || d === 2
    const kinds = hard ? ['AAB', 'ABC', 'ABB'] : ['AB', 'AB', 'AAB']
    const kind = one(r, kinds)
    const useShapes = r() < 0.5
    const pool: Tile[] = useShapes
      ? some(r, COLORS, 3).map((c, i) => ({ shape: (['circle', 'square', 'triangle', 'star'] as Shape[])[i % 4], color: c.c }))
      : some(r, ['🍎', '🍌', '🐶', '🐱', '⭐', '🌙', '🚗', '🎈', '🐸', '🌸'], 3).map((e) => ({ e }))
    const unit = kind.split('').map((ch) => pool['ABC'.indexOf(ch)])
    const len = unit.length * (hard ? 2 : 3)
    const seq = Array.from({ length: len + 1 }, (_, i) => unit[i % unit.length])
    const answer = seq[len]
    const others = pool.filter((t) => t !== answer).slice(0, 2)
    const { options, correct } = choices(r, answer, others)
    return { kind: 'pick', q: he('מה בא עכשיו?'), show: { kind: 'row', items: seq.slice(0, len), ask: true }, options, correct, why: he('הדפוס חוזר על עצמו שוב ושוב.'), challenge: d === 2 }
  },

  sortcat(sp, d, r) {
    const [ka, kb] = one(r, sp.hard || d === 2 ? SORT_PAIRS_HARD : SORT_PAIRS)
    const n = d === 0 ? 2 : 3
    const items = [...some(r, CATS[ka].items, n).map((p) => ({ text: he(`${p.e} ${nice(p.w)}`), bucket: 0 })), ...some(r, CATS[kb].items, n).map((p) => ({ text: he(`${p.e} ${nice(p.w)}`), bucket: 1 }))]
    return { kind: 'sort', prompt: he('מסדרים כל דבר בקבוצה שלו'), buckets: [he(CATS[ka].name), he(CATS[kb].name)], items, why: he(`${CATS[ka].name} לחוד, ${CATS[kb].name} לחוד.`), challenge: d === 2 }
  },

  count(sp, d, r) {
    const max = sp.max ?? 5
    const lo = Math.max(1, Math.min(max - 2, d === 0 ? 1 : Math.ceil(max / 2)))
    const n = int(r, lo, max)
    const e = one(r, ['🍎', '⭐', '🐶', '🎈', '🐟', '🚗', '🍪', '🐥', '🌸', '⚽'])
    if (d === 2 && r() < 0.4) {
      const ns = some(r, Array.from({ length: max }, (_, i) => i + 1), 3)
      const pairs = ns.map((k) => [{ many: { e, n: k } }, { g: String(k) }] as [Tile, Tile])
      return { kind: 'match', q: he('מחברים כל קבוצה למספר שלה'), pairs, why: he('סופרים לאט, אחד־אחד.') }
    }
    const { options, correct } = choices(r, { g: String(n) }, near(r, n, d === 0 ? 2 : 3, Math.max(max, 3), 1).map((k) => ({ g: String(k) })))
    return { kind: 'pick', q: he(`כמה ${e} יש?`), show: { kind: 'pile', e, n }, options, correct, why: he(`סופרים: ${Array.from({ length: n }, (_, i) => i + 1).join(', ')}. יש ${n}!`), challenge: d === 2 }
  },

  numrec(sp, d, r) {
    const lo = sp.min ?? 1, hi = sp.max ?? 5
    const n = int(r, lo, hi)
    const e = one(r, ['🔵', '🟢', '🍓', '⭐', '🐞'])
    if (d === 0 || r() < 0.4) {
      const { options, correct } = choices(r, { g: String(n) }, near(r, n, d === 0 ? 2 : 3, Math.max(hi, 3), Math.max(0, lo - 2)).map((k) => ({ g: String(k) })))
      return { kind: 'pick', q: he(`איפה המספר ${n}?`), options, correct, why: he(`זה ${n}!`) }
    }
    if (d === 2 && r() < 0.5) {
      const ns = some(r, Array.from({ length: hi - lo + 1 }, (_, i) => lo + i), 3)
      return { kind: 'match', q: he('מחברים מספר לכמות'), pairs: ns.map((k) => [{ g: String(k) }, { many: { e, n: k } }] as [Tile, Tile]), why: he('כל מספר והכמות שלו.') }
    }
    const { options, correct } = choices(r, { many: { e, n } }, near(r, n, 2, hi + 1, 1).map((k) => ({ many: { e, n: k } })))
    return { kind: 'pick', q: he('איפה יש בדיוק כמו המספר?'), show: { kind: 'tile', tile: { g: String(n) } }, options, correct, why: he(`המספר ${n}: ${n} עיגולים.`), challenge: d === 2 }
  },

  moreless(sp, d, r) {
    const max = sp.max ?? 5
    const e = one(r, ['🍪', '🎈', '🐟', '⭐', '🍓'])
    const a = int(r, 1, max)
    let b = int(r, 1, max); while (b === a || (d === 2 && Math.abs(a - b) > 2 && max > 4)) b = int(r, 1, max)
    const more = r() < 0.6
    const right = more ? Math.max(a, b) : Math.min(a, b)
    const opts = mix(r, [a, b])
    return { kind: 'pick', q: he(more ? 'איפה יש יותר?' : 'איפה יש פחות?'), options: opts.map((n) => ({ many: { e, n } })), correct: opts.indexOf(right), why: he(`${Math.max(a, b)} זה יותר מ־${Math.min(a, b)}.`), challenge: d === 2 }
  },

  numorder(sp, d, r) {
    const max = sp.max ?? 5
    if (sp.hard || (d > 0 && r() < 0.5)) {
      const n = int(r, 1, max - 1)
      const after = r() < 0.5
      const ans = after ? n + 1 : n - 1
      if (ans < 0) return G.numorder({ ...sp, hard: false }, d, r)
      const { options, correct } = choices(r, { g: String(ans) }, near(r, ans, 2, max, 0).filter((k) => k !== n).map((k) => ({ g: String(k) })))
      return { kind: 'pick', q: he(after ? `איזה מספר בא אחרי ${n}?` : `איזה מספר בא לפני ${n}?`), options, correct, why: he(after ? `אחרי ${n} בא ${ans}.` : `לפני ${n} בא ${ans}.`), challenge: d === 2 }
    }
    const len = d === 0 ? 3 : Math.min(5, max)
    const start = int(r, 1, Math.max(1, max - len + 1))
    return { kind: 'order', q: he('מסדרים את המספרים מהקטן לגדול'), items: Array.from({ length: len }, (_, i) => ({ g: String(start + i) })), why: he('המספרים עולים: כל אחד גדול באחד.') }
  },

  add(sp, d, r) {
    const max = sp.max ?? 5
    const a = int(r, 1, Math.max(1, max - 1)), b = sp.max === 5 && d === 0 ? 1 : int(r, 1, Math.max(1, max - a))
    const e = one(r, ['🍎', '🎈', '🐥', '⚽', '🍪', '🚗'])
    const sum = a + b
    const story = sp.hard || d === 2
    const q = story ? `לפיקו היו ${a} ${e} וקיבל עוד ${b}. כמה יש לו עכשיו?` : `כמה ${e} יש ביחד?`
    const { options, correct } = choices(r, { g: String(sum) }, near(r, sum, 3, max + 2, 1).map((k) => ({ g: String(k) })))
    return { kind: 'pick', q: he(q), show: { kind: 'sum', e, a, b, op: '+' }, options, correct, why: he(`${a} ועוד ${b} זה ${sum}.`), challenge: d === 2 }
  },

  sub(sp, d, r) {
    const max = sp.max ?? 5
    const a = int(r, 2, max), b = int(r, 1, a - 1)
    const e = one(r, ['🎈', '🍪', '🐟', '🍎', '🧁'])
    const left = a - b
    const story = sp.hard || d === 2
    const q = story ? `היו ${a} ${e}. ${b} ${e === '🎈' ? 'עפו' : 'נאכלו'}. כמה נשארו?` : `היו ${a}, הורדנו ${b}. כמה נשארו?`
    const { options, correct } = choices(r, { g: String(left) }, near(r, left, 3, max, 0).map((k) => ({ g: String(k) })))
    return { kind: 'pick', q: he(q), show: { kind: 'sum', e, a, b, op: '-' }, options, correct, why: he(`${a} פחות ${b} זה ${left}.`), challenge: d === 2 }
  },

  trace(sp, _d, r) {
    const g = one(r, [...(sp.set ?? '123')])
    const isNum = /\d/.test(g)
    return { kind: 'trace', q: he(isNum ? `כותבים את המספר ${g} עם האצבע` : `כותבים את האות ${g} (${LETTER_NAME[g]}) עם האצבע`), g }
  },

  syll(sp, d, r) {
    const pool = SYLL.filter((x) => (sp.hard || d === 2 ? true : x.n <= 3))
    const w = one(r, pool)
    const opts = [1, 2, 3, 4].filter((k) => k !== w.n)
    const { options, correct } = choices(r, { g: String(w.n), t: '👏'.repeat(w.n) }, some(r, opts, d === 0 ? 2 : 3).map((k) => ({ g: String(k), t: '👏'.repeat(k) })))
    return { kind: 'pick', q: he(`כמה מחיאות כפיים במילה "${w.w}"? מוחאים יחד!`), show: { kind: 'tile', tile: picTile(w) }, options, correct, why: he(`${w.w}: ${w.n} מחיאות כפיים.`), challenge: d === 2 }
  },

  rhyme(_sp, d, r) {
    const pair = one(r, RHYMES)
    const [a, b] = r() < 0.5 ? pair : [pair[1], pair[0]]
    const others = some(r, RHYMES.filter((p) => p !== pair).flat(), d === 0 ? 2 : 3)
    const { options, correct } = choices(r, picTile(b), others.map(picTile))
    return { kind: 'pick', q: he(`מה מתחרז עם "${a.w}"?`), show: { kind: 'tile', tile: picTile(a) }, options, correct, why: he(`${a.w} ו${b.w}: נשמע אותו דבר בסוף!`), challenge: d === 2 }
  },

  firstsound(_sp, d, r) {
    const [la, ...rest] = some(r, [...CLEAR_SOUNDS], d === 0 ? 3 : 4)
    const [a, b] = some(r, WORDS_BY_LETTER[la], 2)
    const others = rest.map((l) => one(r, WORDS_BY_LETTER[l]))
    const { options, correct } = choices(r, picTile(b), others.map(picTile))
    return { kind: 'pick', q: he(`מה מתחיל באותו צליל כמו "${a.w}"?`), show: { kind: 'tile', tile: picTile(a) }, options, correct, why: he(`${a.w} ו${b.w} מתחילים באותו צליל.`), challenge: d === 2 }
  },

  letters(sp, d, r) {
    const set = [...(sp.set ?? 'אב')]
    const l = one(r, set)
    const pool = [...new Set([...set, ...LETTERS])].filter((x) => x !== l)
    let others = some(r, set.length > 3 ? set.filter((x) => x !== l) : pool, d === 0 ? 2 : 3)
    while (others.length < (d === 0 ? 2 : 3)) others.push(one(r, pool.filter((x) => !others.includes(x))))
    // harder: the wrong answers look like the right one (ב/כ/פ, ד/ר, ה/ח/ת…), so the child has to really look
    if (d >= 2 && LOOKALIKE[l]) others = [...new Set([...LOOKALIKE[l]].filter((x) => x !== l).concat(others))].slice(0, 3)
    if (d === 1 && r() < 0.5) {
      const { options, correct } = choices(r, { t: LETTER_NAME[l] }, others.map((x) => ({ t: LETTER_NAME[x] })))
      return { kind: 'pick', q: he('איך קוראים לאות הזאת?'), show: { kind: 'tile', tile: { g: l } }, options, correct, why: he(`זאת האות ${LETTER_NAME[l]}.`) }
    }
    const { options, correct } = choices(r, { g: l }, others.map((x) => ({ g: x })))
    return { kind: 'pick', q: he(`איפה האות ${LETTER_NAME[l]}?`), options, correct, why: he(`הנה ${l}, ${LETTER_NAME[l]}!`), challenge: d === 2 }
  },

  lettersound(sp, d, r) {
    const set = [...(sp.set ?? 'אב')]
    const l = one(r, set)
    const w = one(r, WORDS_BY_LETTER[l])
    const pool = [...LETTERS].filter((x) => !alike(x, l))
    const near = set.filter((x) => !alike(x, l))
    const others = some(r, near.length >= 3 ? near : pool, d === 0 ? 2 : 3)
    while (others.length < (d === 0 ? 2 : 3)) others.push(one(r, pool.filter((x) => !others.includes(x))))
    if (d > 0 && r() < 0.5) {
      const ow = others.map((x) => one(r, WORDS_BY_LETTER[x]))
      const { options, correct } = choices(r, picTile(w), ow.map(picTile))
      return { kind: 'pick', q: he(`מה מתחיל באות ${l} (${LETTER_NAME[l]})?`), show: { kind: 'tile', tile: { g: l } }, options, correct, why: he(`${w.w} מתחיל ב${LETTER_NAME[l]}.`), challenge: d === 2 }
    }
    if (d === 2 && set.length >= 3) {
      const ls = some(r, set, 3)
      if (ls.every((a, i) => ls.every((b, j) => i === j || !alike(a, b)))) {
        return { kind: 'match', q: he('מחברים כל אות לתמונה שמתחילה בה'), pairs: ls.map((x) => [{ g: x }, picTile(one(r, WORDS_BY_LETTER[x]))] as [Tile, Tile]), why: he('כל תמונה מצאה את האות הראשונה שלה!') }
      }
    }
    const { options, correct } = choices(r, { g: l }, others.map((x) => ({ g: x })))
    return { kind: 'pick', q: he(`באיזו אות מתחילה המילה "${w.w}"?`), show: { kind: 'tile', tile: picTile(w) }, options, correct, why: he(`${w.w} מתחילה ב${LETTER_NAME[l]}.`) }
  },

  build(sp, d, r) {
    const w = one(r, (sp.max ?? 2) <= 2 ? SHORT2 : SHORT3)
    // harder: extra letters that look like the word's own letters
    const tricky = d >= 2 ? [...w.w].flatMap((ch) => [...(LOOKALIKE[ch] ?? '')]).filter((x) => !w.w.includes(x)) : []
    const extra = [...new Set([...some(r, tricky, 2), ...some(r, [...LETTERS].filter((x) => !w.w.includes(x)), 2)])].slice(0, d === 0 ? 1 : d === 1 ? 2 : 3)
    return { kind: 'build', q: he(`בונים את המילה "${w.w}"`), e: w.e, w: w.w, extra, why: he(`${[...w.w].map((x) => LETTER_NAME[x]).join(' + ')} = ${w.w}`), challenge: d === 2 }
  },

  read(sp, d, r) {
    const bank = (sp.max ?? 2) <= 2 ? SHORT2 : [...SHORT2, ...SHORT3]
    const w = one(r, bank)
    const others = some(r, bank.filter((x) => x !== w), d === 0 ? 2 : 3)
    if (d > 0 && r() < 0.5) {
      const { options, correct } = choices(r, { t: w.w }, others.map((x) => ({ t: x.w })))
      return { kind: 'pick', q: he('איזו מילה מתאימה לתמונה?'), show: { kind: 'tile', tile: { e: w.e } }, options, correct, why: he(`כתוב: ${w.w}.`), challenge: d === 2 }
    }
    const { options, correct } = choices(r, { e: w.e }, others.map((x) => ({ e: x.e })))
    return { kind: 'pick', q: he('קוראים את המילה ובוחרים תמונה'), show: { kind: 'word', w: w.w }, options, correct, why: he(`${[...w.w].map((x) => LETTER_NAME[x]).join(', ')}: ${w.w}!`) }
  },

  story(_sp, d, r) {
    const s = one(r, STORIES)
    const items = (d === 0 ? s.slice(0, 3) : s).map(picTile)
    return { kind: 'order', q: he('מה קרה קודם? מסדרים לפי הסדר'), items, why: he(items.map((t) => t.t).join(', ')), challenge: d === 2 }
  },

  days(_sp, d, r) {
    if (d === 0 || r() < 0.5) {
      const start = int(r, 0, 3)
      return { kind: 'order', q: he('מסדרים את ימי השבוע'), items: DAYS.slice(start, start + (d === 0 ? 3 : 4)).map((t) => ({ t })), why: he(DAYS.join(', ')) }
    }
    if (r() < 0.4) {
      const { options, correct } = choices(r, { t: 'שבת', e: '🕯️' }, some(r, DAYS.slice(0, 5), 2).map((t) => ({ t })))
      return { kind: 'pick', q: he('באיזה יום אין גן ובית ספר?'), options, correct, why: he('בשבת נחים בבית.') }
    }
    const i = int(r, 0, 5)
    const { options, correct } = choices(r, { t: DAYS[i + 1] }, some(r, DAYS.filter((_, k) => k !== i + 1 && k !== i), 2).map((t) => ({ t })))
    return { kind: 'pick', q: he(`איזה יום בא אחרי יום ${DAYS[i]}?`), options, correct, why: he(`אחרי ${DAYS[i]} בא ${DAYS[i + 1]}.`), challenge: d === 2 }
  },

  seasons(_sp, d, r) {
    const s = one(r, SEASONS)
    const clue = one(r, s.clues)
    if (d === 2 && r() < 0.5) {
      const pairs = some(r, SEASONS, 3).map((x) => [{ e: x.e, t: x.n }, { t: one(r, x.clues) }] as [Tile, Tile])
      return { kind: 'match', q: he('מחברים כל עונה למה שקורה בה'), pairs, why: he('חורף, אביב, קיץ, סתיו.') }
    }
    const { options, correct } = choices(r, { e: s.e, t: s.n }, some(r, SEASONS.filter((x) => x !== s), d === 0 ? 2 : 3).map((x) => ({ e: x.e, t: x.n })))
    return { kind: 'pick', q: he(`${clue}. באיזו עונה?`), options, correct, why: he(`זה קורה ב${s.n}.`), challenge: d === 2 }
  },

  feelings(_sp, d, r) {
    const f = one(r, FEELINGS)
    const others = some(r, FEELINGS.filter((x) => x !== f), d === 0 ? 2 : 3)
    if (d > 0 && r() < 0.6) {
      const { options, correct } = choices(r, { e: f.e, t: f.n }, others.map((x) => ({ e: x.e, t: x.n })))
      return { kind: 'pick', q: he(`${one(r, f.when)}. איך מרגישים?`), options, correct, why: he(`מרגישים ${f.n}. כל הרגשות בסדר!`), challenge: d === 2 }
    }
    const { options, correct } = choices(r, { t: f.n }, others.map((x) => ({ t: x.n })))
    return { kind: 'pick', q: he('איך הוא מרגיש?'), show: { kind: 'tile', tile: { e: f.e } }, options, correct, why: he(`הוא ${f.n}.`) }
  },

  social(sp, d, r) {
    const pool = SOCIAL.filter((x) => (sp.hard ? true : !x.hard))
    const s = one(r, pool)
    const [right, ...rest] = s.opts.map(([e, t]) => ({ e, t }))
    const { options, correct } = choices(r, right, rest)
    return { kind: 'pick', q: he(s.q), options, correct, why: he(`${right.t}. ככה עושים חברים טובים!`), challenge: d === 2 }
  },

  logic(sp, d, r) { return THINK.logic!(sp, d, r) },

  schoolbag(_sp, d, r) {
    const n = d === 0 ? 2 : 3
    const items = [...some(r, SCHOOLBAG.take, n).map((p) => ({ text: he(`${p.e} ${p.w}`), bucket: 0 })), ...some(r, SCHOOLBAG.stay, n).map((p) => ({ text: he(`${p.e} ${p.w}`), bucket: 1 }))]
    return { kind: 'sort', prompt: he('מה לוקחים לבית הספר?'), buckets: [he('🎒 לוקחים'), he('🏠 נשאר בבית')], items, why: he('בילקוט רק מה שצריך ללמידה, ואוכל.'), challenge: d === 2 }
  },
}

/* The routine story goes into the morning lesson; it's richer than the general stories. */
STORIES.push(ROUTINE)

/* ───────── Piko's intros (the parent reads these aloud) ───────── */
const INTRO: Partial<Record<Skill, { body: string[]; scene: string }>> = {
  colors: { body: ['בעולם יש המון צבעים: אדום כמו תפוח, צהוב כמו בננה, ירוק כמו צפרדע.', 'בוא נמצא צבעים ביחד!'], scene: '🍎🍌🐸🫐🍇' },
  shapes: { body: ['לכל דבר יש צורה. כדור הוא עיגול, מתנה היא ריבוע, ופיצה היא משולש.', 'נחפש צורות ביחד?'], scene: '⚽🎁🍕⭐❤️' },
  size: { body: ['יש דברים גדולים ויש דברים קטנים.', 'פיל גדול, נמלה קטנה. מי הכי גדול?'], scene: '🐘🐕🐜' },
  position: { body: ['מעל, מתחת, בתוך וליד: ככה אומרים איפה דברים נמצאים.', 'החתול של פיקו אוהב להתחבא. נמצא אותו?'], scene: '🐱📦' },
  odd: { body: ['לפעמים בקבוצה יש מישהו שלא שייך.', 'שלוש חיות ומכונית אחת? המכונית לא שייכת!'], scene: '🐶🐱🐰🚗' },
  pattern: { body: ['דפוס זה משהו שחוזר שוב ושוב: תפוח, בננה, תפוח, בננה...', 'מה יבוא אחר כך?'], scene: '🍎🍌🍎🍌❓' },
  sortcat: { body: ['מסדרים דברים לקבוצות: חיות עם חיות, צעצועים עם צעצועים.', 'פיקו צריך עזרה לסדר את החדר!'], scene: '🧸🐶🚗🍎' },
  count: { body: ['סופרים לאט, נוגעים בכל דבר פעם אחת.', 'אחד, שתיים, שלוש... מוכנים?'], scene: '1️⃣2️⃣3️⃣🍎🍎🍎' },
  numrec: { body: ['לכל מספר יש סימן משלו. ככה כותבים אותו.', 'בוא נכיר את המספרים!'], scene: '1️⃣2️⃣3️⃣4️⃣5️⃣' },
  moreless: { body: ['איפה יש יותר עוגיות? ואיפה פחות?', 'אפשר לספור, ואפשר גם להסתכל טוב.'], scene: '🍪🍪🍪 🍪' },
  numorder: { body: ['למספרים יש תור: 1, 2, 3, 4, 5.', 'כל מספר גדול באחד מזה שלפניו.'], scene: '1️⃣➡️2️⃣➡️3️⃣' },
  add: { body: ['לחבר זה לשים ביחד ולספור הכל.', 'שני תפוחים ועוד תפוח אחד, כמה יש?'], scene: '🍎🍎➕🍎' },
  sub: { body: ['להוריד זה לקחת חלק ולספור מה נשאר.', 'היו שלושה בלונים, אחד עף. כמה נשארו?'], scene: '🎈🎈🎈➖🎈' },
  trace: { body: ['היום כותבים עם האצבע!', 'עוברים לאט על הקו האפור, מלמעלה למטה.'], scene: '✍️✨' },
  syll: { body: ['כל מילה מתחלקת לחלקים קטנים. כל חלק מקבל מחיאת כף.', 'בַּ־נָ־נָה: שלוש מחיאות! 👏👏👏'], scene: '👏🍌' },
  rhyme: { body: ['מילים מתחרזות נשמעות אותו דבר בסוף.', 'ירח ופרח, כלב וחלב. מצחיק, נכון?'], scene: '🌙🌸' },
  firstsound: { body: ['כל מילה מתחילה בצליל. דג מתחיל ב־ד, דוב מתחיל ב־ד.', 'מקשיבים לצליל הראשון!'], scene: '🐟🐻' },
  letters: { body: ['לכל צליל יש אות. היום נכיר אותיות חדשות!', 'מסתכלים טוב על הצורה של כל אות.'], scene: '🔤✨' },
  lettersound: { body: ['כל מילה מתחילה באות. אריה מתחיל ב־א.', 'נמצא איזו אות פותחת כל מילה?'], scene: '🦁 א' },
  build: { body: ['אותיות ביחד עושות מילה!', 'ד ו־ג ביחד: דג 🐟'], scene: '🧩🐟' },
  read: { body: ['עכשיו אתה קורא! מחברים אות לאות ושומעים מילה.', 'כל מילה מסתתרת מאחורי תמונה.'], scene: '📖🌟' },
  story: { body: ['לכל סיפור יש התחלה, אמצע וסוף.', 'קודם ביצה, אחר כך אפרוח, ובסוף תרנגולת!'], scene: '🥚🐣🐥🐔' },
  days: { body: ['בשבוע יש שבעה ימים: ראשון, שני, שלישי, רביעי, חמישי, שישי ושבת.', 'נסדר אותם ביחד?'], scene: '📅' },
  seasons: { body: ['בשנה יש ארבע עונות: חורף, אביב, קיץ וסתיו.', 'בכל עונה קורים דברים אחרים.'], scene: '❄️🌸☀️🍂' },
  feelings: { body: ['לפעמים שמחים, לפעמים עצובים, לפעמים כועסים.', 'כל הרגשות בסדר. בוא נכיר אותם.'], scene: '😀😢😠😨' },
  social: { body: ['בגן ובבית הספר יש הרבה חברים.', 'מה עושה חבר טוב? בוא נחשוב ביחד.'], scene: '🧒🤝👧' },
  schoolbag: { body: ['בכיתה א׳ יש לך ילקוט משלך!', 'מה שמים בו, ומה משאירים בבית?'], scene: '🎒✏️📚' },
}

/* ───────── thinking questions (level 3) ─────────
   Not harder for the sake of it: each one asks the child to compare, infer, find the rule or look closely.
   Wrong answers are chosen to be tempting (look-alike letters, near numbers, "almost" categories). */
const THINK: Partial<Record<Skill, Gen>> = {
  colors(_sp, _d, r) {
    const [a, b, c] = one(r, MIXES)
    const col = (n: string) => COLORS.find((x) => x.n === n)!
    const others = some(r, COLORS.filter((x) => ![a, b, c].includes(x.n)), 2).map((x) => ({ shape: 'circle' as Shape, color: x.c, t: x.n }))
    const { options, correct } = choices(r, { shape: 'circle', color: col(c).c, t: c }, [{ shape: 'circle' as Shape, color: col(a).c, t: a }, ...others].slice(0, 3))
    return { kind: 'pick', q: he(`מערבבים ${a} עם ${b}. איזה צבע יוצא?`), show: { kind: 'row', items: [{ shape: 'circle', color: col(a).c }, { e: '➕' }, { shape: 'circle', color: col(b).c }], ask: true }, options, correct, why: he(`${a} ו${b} ביחד עושים ${c}!`) }
  },
  shapes(_sp, _d, r) {
    if (r() < 0.6) {
      const s = one(r, CORNERS)
      const { options, correct } = choices(r, { g: String(s.k) }, some(r, [0, 2, 3, 4, 5, 6].filter((k) => k !== s.k), 3).map((k) => ({ g: String(k) })))
      return { kind: 'pick', q: he(`כמה פינות יש ל${s.n}? סופרים עם האצבע`), show: { kind: 'tile', tile: { shape: s.s, color: '#4da3ff' } }, options, correct, why: he(s.k ? `ל${s.n} יש ${s.k} פינות.` : 'לעיגול אין פינות בכלל, הוא עגול כולו!') }
    }
    const { options, correct } = choices(r, { shape: 'circle', color: '#f4a261' }, (['triangle', 'square', 'star'] as Shape[]).map((x) => ({ shape: x, color: '#f4a261' })))
    return { kind: 'pick', q: he('לאיזו צורה אין אף פינה?'), options, correct, why: he('לעיגול אין פינות. אפשר לגלגל אותו!') }
  },
  size(_sp, _d, r) {
    const [a, b, c] = some(r, KIDS, 3)
    const tall = (k: typeof a) => (k.f ? 'גבוהה' : 'גבוה')
    const tallest = r() < 0.5
    const { options, correct } = choices(r, { t: tallest ? a.n : c.n }, [{ t: b.n }, { t: tallest ? c.n : a.n }])
    return { kind: 'pick', q: he(`${a.n} ${tall(a)} מ${b.n}. ${b.n} ${tall(b)} מ${c.n}. מי ${tallest ? 'הכי גבוה' : 'הכי נמוך'}?`), show: { kind: 'row', items: [{ e: '🧍' }, { e: '❓' }, { e: '🧍' }] }, options, correct, why: he(`${a.n} הכי ${a.f ? 'גבוהה' : 'גבוה'}, ו${c.n} הכי ${c.f ? 'נמוכה' : 'נמוך'}.`) }
  },
  position(_sp, _d, r) {
    const a = one(r, CRITTERS), b = PLACES[0]
    const rel = one(r, ['above', 'below'] as const)
    const ask = rel === 'above' ? 'מתחת ל' : 'מעל ה'
    const { options, correct } = choices(r, { e: b.e }, [{ e: a.e }, { e: one(r, ['🌳', '⚽', '🪑']) }])
    return { kind: 'pick', q: he(`ה${a.w} ${b[rel]}. מה נמצא ${ask}${a.w}?`), show: { kind: 'scene', a: a.e, b: b.e, rel }, options, correct, why: he(rel === 'above' ? `ה${a.w} למעלה, אז הקופסה מתחתיו.` : `ה${a.w} למטה, אז הקופסה מעליו.`) }
  },
  odd(_sp, _d, r) {
    const g = one(r, ODD_PROPS)
    const { options, correct } = choices(r, { e: g.out.e }, some(r, g.ins, 3).map((p) => ({ e: p.e })))
    return { kind: 'pick', q: he('מה לא שייך? חושבים טוב, זה מבלבל!'), options, correct, why: he(g.why) }
  },
  pattern(_sp, _d, r) {
    const kind = one(r, ['grow', 'count2', 'back'])
    if (kind === 'grow') {
      const e = one(r, ['⭐', '🍎', '🐟', '🌸'])
      const { options, correct } = choices(r, { many: { e, n: 4 } }, [{ many: { e, n: 3 } }, { many: { e, n: 6 } }])
      return { kind: 'pick', q: he('בכל פעם מוסיפים עוד אחד. מה בא עכשיו?'), show: { kind: 'row', items: [1, 2, 3].map((n) => ({ many: { e, n } })), ask: true }, options, correct, why: he('1, 2, 3... ואז 4!') }
    }
    const seq = kind === 'count2' ? [2, 4, 6] : [5, 4, 3]
    const ans = kind === 'count2' ? 8 : 2
    const { options, correct } = choices(r, { g: String(ans) }, (kind === 'count2' ? [7, 10] : [1, 4]).map((k) => ({ g: String(k) })))
    return { kind: 'pick', q: he(kind === 'count2' ? 'קופצים בקפיצות של 2. מה בא עכשיו?' : 'סופרים אחורה. מה בא עכשיו?'), show: { kind: 'row', items: seq.map((n) => ({ g: String(n) })), ask: true }, options, correct, why: he(kind === 'count2' ? '2, 4, 6, 8: כל פעם קופצים שניים.' : '5, 4, 3, 2: כל פעם יורדים אחד.') }
  },
  sortcat(_sp, _d, r) {
    const p = one(r, PROP_SORTS)
    const items = [...some(r, p.ia, 3).map((x) => ({ text: he(`${x.e} ${nice(x.w)}`), bucket: 0 })), ...some(r, p.ib, 3).map((x) => ({ text: he(`${x.e} ${nice(x.w)}`), bucket: 1 }))]
    return { kind: 'sort', prompt: he('חושבים: לאיזו קבוצה כל אחד שייך?'), buckets: [he(p.a), he(p.b)], items, why: he('יש כאן כמה מלכודות. למשל רובוט זז, אבל הוא לא חי, ועץ לא זז, אבל הוא חי!') }
  },
  count(sp, _d, r) {
    const max = Math.max(4, sp.max ?? 5)
    if (r() < 0.5) {
      // count only one kind among a mix
      const [a, b] = some(r, ['🍎', '🍐', '🐶', '🐱', '⭐', '🌙', '🚗', '🚌'], 2)
      const na = int(r, 2, Math.min(max, 6)), nb = int(r, 2, 4)
      const { options, correct } = choices(r, { g: String(na) }, [{ g: String(na + nb) }, ...near(r, na, 2, na + nb + 1, 1).filter((k) => k !== na + nb).slice(0, 1).map((k) => ({ g: String(k) }))])
      return { kind: 'pick', q: he(`כמה ${a} יש? סופרים רק אותם!`), show: { kind: 'row', items: mix(r, [...Array(na).fill(a), ...Array(nb).fill(b)]).map((e) => ({ e })) }, options, correct, why: he(`יש ${na} ${a}. את ה${b} לא סופרים.`) }
    }
    // equal groups
    const g = int(r, 2, 3), each = int(r, 2, 3), e = one(r, ['🎈', '🍪', '⭐'])
    const { options, correct } = choices(r, { g: String(g * each) }, near(r, g * each, 2, 10, 1).map((k) => ({ g: String(k) })))
    return { kind: 'pick', q: he(`יש ${g === 2 ? 'שני' : 'שלושה'} ילדים, ולכל אחד ${each} ${e}. כמה ${e} יש ביחד?`), show: { kind: 'row', items: Array.from({ length: g }, () => ({ many: { e, n: each } })) }, options, correct, why: he(`${Array(g).fill(each).join(' ועוד ')} זה ${g * each}.`) }
  },
  numrec(sp, _d, r) {
    const hi = Math.max(6, sp.max ?? 10)
    if (r() < 0.5) {
      const n = int(r, 2, hi - 1)
      const { options, correct } = choices(r, { g: String(n) }, [{ g: String(n - 1) }, { g: String(n + 1) }])
      return { kind: 'pick', q: he(`איזה מספר נמצא בין ${n - 1} ל־${n + 1}?`), show: { kind: 'row', items: [{ g: String(n - 1) }, { t: '?' }, { g: String(n + 1) }] }, options, correct, why: he(`${n - 1}, ${n}, ${n + 1}.`) }
    }
    const ns = some(r, Array.from({ length: hi }, (_, i) => i + 1), 3)
    const big = Math.max(...ns)
    const { options, correct } = choices(r, { g: String(big) }, ns.filter((k) => k !== big).map((k) => ({ g: String(k) })))
    return { kind: 'pick', q: he('איזה מספר הכי גדול?'), options, correct, why: he(`${big} הכי גדול.`) }
  },
  moreless(sp, _d, r) {
    const max = sp.max ?? 6
    const a = int(r, 2, Math.max(3, max - 1)), b = a + int(r, 1, 3)
    const e = one(r, ['🍪', '🎈', '🐟'])
    const diff = b - a
    const { options, correct } = choices(r, { g: String(diff) }, near(r, diff, 2, 5, 1).map((k) => ({ g: String(k) })))
    return { kind: 'pick', q: he(`לדני יש ${a} ${e}, ולנועה יש ${b}. כמה צריך לתת לדני כדי שיהיה להם אותו דבר?`), show: { kind: 'row', items: [{ many: { e, n: a } }, { e: '⚖️' }, { many: { e, n: b } }] }, options, correct, why: he(`${a} ועוד ${diff} זה ${b}. עכשיו שווה!`) }
  },
  numorder(sp, _d, r) {
    const max = Math.max(6, sp.max ?? 10)
    const start = int(r, 1, max - 4), gap = int(r, 1, 2)
    const seq = [start, start + 1, start + 2, start + 3]
    const ans = seq[gap]
    const { options, correct } = choices(r, { g: String(ans) }, [{ g: String(ans + 2) }, { g: String(ans - 2 > 0 ? ans - 2 : ans + 3) }])
    return { kind: 'pick', q: he('איזה מספר חסר בתור?'), show: { kind: 'row', items: seq.map((n, i) => (i === gap ? { t: '?' } : { g: String(n) })) }, options, correct, why: he(seq.join(', ')) }
  },
  add(sp, _d, r) {
    const max = Math.max(5, sp.max ?? 10)
    const kind = one(r, ['missing', 'share', 'hands'])
    if (kind === 'missing') {
      const total = int(r, 4, max), a = int(r, 1, total - 1), b = total - a
      const { options, correct } = choices(r, { g: String(b) }, near(r, b, 2, max, 0).map((k) => ({ g: String(k) })))
      return { kind: 'pick', q: he(`יש ${a} 🍎. כמה עוד צריך כדי שיהיו ${total}?`), show: { kind: 'row', items: [{ many: { e: '🍎', n: a } }, { e: '➕' }, { t: '?' }, { e: '🟰' }, { g: String(total) }] }, options, correct, why: he(`${a} ועוד ${b} זה ${total}.`) }
    }
    if (kind === 'share') {
      const kids = int(r, 2, 3), each = int(r, 1, 3), total = kids * each
      const { options, correct } = choices(r, { g: String(each) }, near(r, each, 2, 6, 1).map((k) => ({ g: String(k) })))
      return { kind: 'pick', q: he(`יש ${total} עוגיות ל־${kids} ילדים. כל אחד מקבל אותו דבר. כמה לכל ילד?`), show: { kind: 'pile', e: '🍪', n: total }, options, correct, why: he(`מחלקים: כל ילד מקבל ${each}.`) }
    }
    const { options, correct } = choices(r, { g: '10' }, [{ g: '5' }, { g: '8' }, { g: '12' }])
    return { kind: 'pick', q: he('בכל יד יש 5 אצבעות. כמה אצבעות יש בשתי ידיים?'), show: { kind: 'row', items: [{ e: '🖐️' }, { e: '➕' }, { e: '🖐️' }] }, options, correct, why: he('5 ועוד 5 זה 10.') }
  },
  sub(sp, _d, r) {
    const max = Math.max(5, sp.max ?? 10)
    const [{ n: a }, { n: b }] = some(r, KIDS, 2)
    const na = int(r, 3, max), nb = int(r, 1, na - 1), diff = na - nb
    // tempting wrong answers: adding instead of comparing, and a near number
    const wrong = [...new Set([na + nb <= 12 ? na + nb : diff + 2, ...near(r, diff, 3, max, 0)])].filter((k) => k !== diff).slice(0, 2)
    const { options, correct } = choices(r, { g: String(diff) }, wrong.map((k) => ({ g: String(k) })))
    return { kind: 'pick', q: he(`ל${a} יש ${na} מדבקות ול${b} יש ${nb}. בכמה יש ל${a} יותר?`), show: { kind: 'row', items: [{ many: { e: '⭐', n: na } }, { many: { e: '⭐', n: nb } }] }, options, correct, why: he(`${na} פחות ${nb} זה ${na - nb}.`) }
  },
  syll(_sp, _d, r) {
    const ws = some(r, SYLL, 3)
    while (new Set(ws.map((w) => w.n)).size < 3) ws.splice(0, ws.length, ...some(r, SYLL, 3))
    const long = ws.reduce((a, b) => (b.n > a.n ? b : a))
    const { options, correct } = choices(r, picTile(long), ws.filter((w) => w !== long).map(picTile))
    return { kind: 'pick', q: he('איזו מילה הכי ארוכה? מוחאים כפיים לכל אחת'), options, correct, why: he(ws.map((w) => `${w.w}: ${w.n}`).join(', ')) }
  },
  rhyme(_sp, _d, r) {
    const pair = one(r, RHYMES)
    const odd = one(r, RHYMES.filter((p) => p !== pair).flat())
    const { options, correct } = choices(r, picTile(odd), pair.map(picTile))
    return { kind: 'pick', q: he('שתיים מתחרזות ואחת לא. איזו לא מתחרזת?'), options, correct, why: he(`${pair[0].w} ו${pair[1].w} מתחרזות. ${odd.w} לא.`) }
  },
  firstsound(_sp, _d, r) {
    const w = one(r, [...SHORT2, ...SHORT3].filter((x) => !alike(x.w.at(-1)!, 'כ')))
    const last = w.w.at(-1)!
    const others = some(r, [...CLEAR_SOUNDS, 'ש', 'ב'].filter((x) => !alike(x, last) && x !== last && x !== w.w[0]), 2)
    const wrong = [...new Set([w.w[0] === last ? others[0] : w.w[0], ...others])].slice(0, 2)
    const { options, correct } = choices(r, { g: last }, wrong.map((x) => ({ g: x })))
    return { kind: 'pick', q: he(`באיזו אות נגמרת המילה "${w.w}"? מקשיבים לסוף!`), show: { kind: 'tile', tile: picTile(w) }, options, correct, why: he(`${w.w} נגמרת ב${LETTER_NAME[last]}.`) }
  },
  letters(sp, _d, r) { return G.letters(sp, 2, r) },
  lettersound(sp, _d, r) {
    const set = [...(sp.set ?? 'אב')]
    const l = one(r, set.filter((x) => WORDS_BY_LETTER[x].length >= 2))
    const ins = some(r, WORDS_BY_LETTER[l], 2)
    const other = one(r, [...LETTERS].filter((x) => !alike(x, l)))
    const out = one(r, WORDS_BY_LETTER[other])
    const { options, correct } = choices(r, picTile(out), ins.map(picTile))
    return { kind: 'pick', q: he(`שתיים מתחילות ב${LETTER_NAME[l]}, ואחת לא. איזו לא?`), show: { kind: 'tile', tile: { g: l } }, options, correct, why: he(`${out.w} מתחילה ב${LETTER_NAME[other]}.`) }
  },
  build(sp, _d, r) {
    const w = one(r, (sp.max ?? 2) <= 2 ? SHORT2 : SHORT3)
    const i = int(r, 0, w.w.length - 1)
    const l = w.w[i]
    const others = [...new Set([...(LOOKALIKE[l] ?? '')].concat(some(r, [...LETTERS], 3)))].filter((x) => x !== l).slice(0, 2)
    const { options, correct } = choices(r, { g: l }, others.map((x) => ({ g: x })))
    return { kind: 'pick', q: he(`איזו אות חסרה במילה "${w.w}"?`), show: { kind: 'word', e: w.e, w: w.w, hide: i }, options, correct, why: he(`${w.w}: חסרה ה${LETTER_NAME[l]}.`) }
  },
  read(_sp, _d, r) {
    const bank = [...SHORT2, ...SHORT3]
    const w = one(r, bank)
    // words that share letters with the right one: you have to read them all the way through
    const close = bank.filter((x) => x !== w && [...x.w].some((ch) => w.w.includes(ch)))
    const others = some(r, close.length >= 2 ? close : bank.filter((x) => x !== w), 2)
    const { options, correct } = choices(r, { t: w.w }, others.map((x) => ({ t: x.w })))
    return { kind: 'pick', q: he('איזו מילה מתאימה לתמונה? קוראים עד הסוף!'), show: { kind: 'tile', tile: { e: w.e } }, options, correct, why: he(`כתוב: ${w.w}.`) }
  },
  story(_sp, _d, r) {
    const s = one(r, STORIES)
    const k = int(r, 1, s.length - 1)
    const { options, correct } = choices(r, picTile(s[k - 1]), s.filter((_, i) => i !== k - 1 && i !== k).slice(0, 2).map(picTile))
    return { kind: 'pick', q: he('מה קרה ממש לפני זה?'), show: { kind: 'tile', tile: picTile(s[k]) }, options, correct, why: he(`קודם ${nice(s[k - 1].w)}, ואחר כך ${nice(s[k].w)}.`) }
  },
  days(_sp, _d, r) {
    const i = int(r, 1, 5)
    const { options, correct } = choices(r, { t: DAYS[i - 1] }, [{ t: DAYS[i + 1] }, { t: DAYS[(i + 3) % 7] }])
    return { kind: 'pick', q: he(`היום יום ${DAYS[i]}. איזה יום היה אתמול?`), options, correct, why: he(`לפני ${DAYS[i]} בא ${DAYS[i - 1]}.`) }
  },
  seasons(_sp, _d, r) {
    const i = int(r, 0, 3)
    const nxt = SEASONS[(i + 1) % 4]
    const { options, correct } = choices(r, { e: nxt.e, t: nxt.n }, SEASONS.filter((_, k) => k !== (i + 1) % 4 && k !== i).map((x) => ({ e: x.e, t: x.n })))
    return { kind: 'pick', q: he(`איזו עונה באה אחרי ה${SEASONS[i].n}?`), options, correct, why: he('חורף, אביב, קיץ, סתיו, ושוב חורף.') }
  },
  feelings(_sp, _d, r) {
    const f = one(r, FEEL_THINK)
    const [right, ...rest] = f.opts.map(([e, t]) => ({ e, t }))
    const { options, correct } = choices(r, right, rest)
    return { kind: 'pick', q: he(f.q), options, correct, why: he(`${right.t}. ככה עוזרים ומבינים אחרים.`) }
  },
  social(sp, d, r) { return G.social({ ...sp, hard: true }, d, r) },
  logic(_sp, _d, r) {
    if (r() < 0.65) {
      const [a1, a2, b1, b2] = one(r, ANALOGIES)
      const others = some(r, ANALOGIES.map((x) => x[3]).filter((x) => x !== b2), 2)
      const { options, correct } = choices(r, picTile(b2), others.map(picTile))
      return { kind: 'pick', q: he(`${a1.w} ו${a2.w} הולכים ביחד. מה הולך ביחד עם ${b1.w}?`), show: { kind: 'analogy', a: [a1.e, a2.e], b: b1.e }, options, correct, why: he(`${a1.w} ו${a2.w}, ${b1.w} ו${b2.w}: אותו קשר!`) }
    }
    const [a, b, c] = some(r, KIDS, 3)
    const run = (k: typeof a) => (k.f ? 'רצה' : 'רץ')
    const fast = r() < 0.5
    const { options, correct } = choices(r, { t: fast ? a.n : c.n }, [{ t: b.n }, { t: fast ? c.n : a.n }])
    return { kind: 'pick', q: he(`${a.n} ${run(a)} מהר יותר מ${b.n}. ${b.n} ${run(b)} מהר יותר מ${c.n}. מי הכי ${fast ? 'מהיר' : 'איטי'}?`), show: { kind: 'row', items: [{ e: '🏃' }, { e: '🏃' }, { e: '🏃' }] }, options, correct, why: he(`${a.n} הכי ${a.f ? 'מהירה' : 'מהיר'}, ו${c.n} הכי ${c.f ? 'איטית' : 'איטי'}.`) }
  },
}

/* ───────── games inside the lessons ─────────
   Every lesson's middle part ends with a game built from that lesson's own material: a jigsaw puzzle of a
   letter (or number) picture, or a memory game. They grow with the year: 6 → 9 → 12 pieces, 3 → 4 → 5 pairs. */
const LETTER_SKILLS: Skill[] = ['letters', 'lettersound', 'build', 'read', 'firstsound']
const NUMBER_SKILLS: Skill[] = ['count', 'numrec', 'moreless', 'numorder', 'add', 'sub']

function family(specs: Spec[]): { kind: 'letters'; set: string } | { kind: 'numbers'; max: number } | { kind: 'other'; spec: Spec } {
  const lettersSet = specs.filter((x) => LETTER_SKILLS.includes(x.s) || (x.s === 'trace' && !/\d/.test(x.set ?? ''))).map((x) => x.set ?? LETTERS).join('')
  if (lettersSet) return { kind: 'letters', set: [...new Set(lettersSet)].join('') }
  const nums = specs.filter((x) => NUMBER_SKILLS.includes(x.s) || (x.s === 'trace' && /\d/.test(x.set ?? '')))
  if (nums.length) return { kind: 'numbers', max: Math.max(5, ...nums.map((x) => x.max ?? 5)) }
  return { kind: 'other', spec: specs[0] }
}

function puzzleGame(unit: number, specs: Spec[], r: R): PuzzleStep {
  const [cols, rows] = unit <= 3 ? [3, 2] : unit <= 8 ? [3, 3] : [4, 3]
  const f = family(specs)
  if (f.kind === 'numbers') {
    const n = int(r, 2, Math.min(9, f.max)), e = one(r, ['🍎', '⭐', '🐟', '🎈', '🐞', '🍓'])
    return { kind: 'puzzle', title: he(`פאזל: המספר ${n}`), g: String(n), e, n, cols, rows }
  }
  const pool = f.kind === 'letters' ? [...f.set].filter((l) => WORDS_BY_LETTER[l]) : [...LETTERS]
  const l = one(r, pool), w = one(r, WORDS_BY_LETTER[l])
  return { kind: 'puzzle', title: he(`פאזל: האות ${l}`), g: l, word: w.w, e: w.e, cols, rows }
}

function memoryGame(unit: number, specs: Spec[], r: R): MemoryStep {
  const n = unit <= 3 ? 3 : unit <= 8 ? 4 : 5
  const f = family(specs)
  if (f.kind === 'numbers') {
    const e = one(r, ['🍎', '⭐', '🐟', '🎈', '🐞'])
    const ns = some(r, Array.from({ length: Math.min(10, f.max) }, (_, i) => i + 1), n)
    return { kind: 'memory', title: he('זיכרון: מספר וכמות'), pairs: ns.map((k) => [{ g: String(k) }, { many: { e, n: k } }]) }
  }
  if (f.kind === 'letters') {
    const ls: string[] = []
    for (const l of mix(r, [...f.set, ...LETTERS])) { if (ls.length >= n) break; if (WORDS_BY_LETTER[l] && !ls.some((x) => alike(x, l))) ls.push(l) }
    return { kind: 'memory', title: he('זיכרון: אות ותמונה'), pairs: ls.map((l) => [{ g: l }, picTile(one(r, WORDS_BY_LETTER[l]))]) }
  }
  const s = f.spec.s
  if (s === 'colors') return { kind: 'memory', title: he('זיכרון: צבע ותמונה'), pairs: some(r, COLORS, n).map((c) => [{ shape: 'circle', color: c.c }, { e: one(r, c.e) }]) }
  if (s === 'shapes') return { kind: 'memory', title: he('זיכרון: צורה ודבר'), pairs: some(r, SHAPES, Math.min(n, SHAPES.length)).map((x) => [{ shape: x.s, color: '#7fb8f5' }, { e: one(r, x.e) }]) }
  if (s === 'rhyme' || s === 'syll') return { kind: 'memory', title: he('זיכרון: מילים מתחרזות'), pairs: some(r, RHYMES, n).map(([a, b]) => [picTile(a), picTile(b)]) }
  if (s === 'seasons') return { kind: 'memory', title: he('זיכרון: עונה ומה קורה בה'), pairs: SEASONS.map((x) => [{ e: x.e, t: x.n }, { t: one(r, x.clues) }]) }
  if (s === 'feelings' || s === 'social') return { kind: 'memory', title: he('זיכרון: פרצוף ורגש'), pairs: some(r, FEELINGS, n).map((x) => [{ e: x.e }, { t: x.n }]) }
  if (s === 'logic' || s === 'odd') return { kind: 'memory', title: he('זיכרון: מה הולך ביחד?'), pairs: some(r, ANALOGIES, n).map(([a, b]) => [picTile(a), picTile(b)]) }
  // everything else practises letters on the way, like the floor puzzle did
  const ls: string[] = []
  for (const l of mix(r, [...LETTERS])) { if (ls.length >= n) break; if (!ls.some((x) => alike(x, l))) ls.push(l) }
  return { kind: 'memory', title: he('זיכרון: אות ותמונה'), pairs: ls.map((l) => [{ g: l }, picTile(one(r, WORDS_BY_LETTER[l]))]) }
}

/* ───────── assembling a lesson ───────── */
const PART_TITLES = ['מתחילים', 'מתאמנים', 'אתגר!']
const PART_STEPS = [4, 5, 5]
/** The level of each question in each part: 0 easy · 1 regular · 2 hard (tempting wrong answers) · 3 thinking question. */
const CURVE = [[0, 1, 2, 3], [1, 3, 2, 3, 2], [2, 3, 2, 3, 3]]

export function buildLesson(node: PathNode): Lesson {
  const r = rng(node.id)
  const specs = node.specs.length ? node.specs : [{ s: 'count' as Skill }]
  const isMix = node.kind !== 'lesson'
  let turn = int(r, 0, specs.length - 1)
  const used = new Set<string>()
  const nextSpec = () => specs[turn++ % specs.length]

  const parts: Part[] = PART_STEPS.map((count, d) => {
    const steps: Step[] = []
    if (d === 0) steps.push(intro(node, specs[0], isMix))
    // parts 2 and 3 open with a "did you know?" — a breather, and something to wonder about
    else steps.push(factFor(specs, used, r))
    const seen = new Set<string>()
    for (let i = 0; i < count; i++) {
      let step: Step | null = null
      // Avoid the same exercise twice in a row: try a few times for a fresh one.
      for (let tries = 0; tries < 6 && !step; tries++) {
        const sp = nextSpec()
        const level = CURVE[d][i] ?? 2
        const s = level === 3 && THINK[sp.s] ? THINK[sp.s]!(sp, 2, r) : G[sp.s](sp, Math.min(level, 2), r)
        const key = JSON.stringify(s)
        if (!seen.has(key)) { seen.add(key); step = s }
      }
      if (step) steps.push(step)
    }
    // The middle part of every lesson (and the chapter challenge) ends with a game.
    if (d === 1 && (node.kind === 'lesson' || node.kind === 'test')) {
      const unit = Number(node.id.match(/^u(\d+)/)?.[1] ?? 1)
      const k = Number(node.id.match(/-l(\d+)$/)?.[1] ?? 0)
      steps.push(node.kind === 'test' || k % 2 === 1 ? puzzleGame(unit, specs, r) : memoryGame(unit, specs, r))
    }
    // The challenge is the last question of part 3; earlier questions aren't flagged.
    steps.forEach((s, i) => { if ('challenge' in s) (s as { challenge?: boolean }).challenge = d === 2 && i === steps.length - 1 })
    return { title: he(PART_TITLES[d]), steps, teaser: d < 2 ? he(d === 0 ? 'עוד תרגול, ופיקו כבר מתלהב!' : 'שאלת אתגר מחכה בסוף!') : undefined }
  })
  return { id: node.id, parts }
}

/** A fact from this lesson's topics (never the same one twice in a lesson), or a general one. */
function factFor(specs: Spec[], used: Set<string>, r: R): FactStep {
  const pool: Fact[] = specs.flatMap((s) => FACTS[s.s] ?? []).filter((f) => !used.has(f.t))
  const f = pool.length ? one(r, pool) : one(r, FACTS.general.filter((x) => !used.has(x.t)))
  used.add(f.t)
  return { kind: 'fact', e: f.e, text: he(f.t) }
}

function intro(node: PathNode, sp: Spec, isMix: boolean): ExplainStep {
  if (isMix) {
    const what = node.kind === 'test' ? 'אתגר סוף הפרק! כל מה שלמדנו, בבת אחת.' : node.kind === 'checkpoint' ? 'מבדק קטן: נראה כמה כבר יודעים.' : 'חזרה: מתרגלים שוב את מה שלמדנו.'
    return { kind: 'explain', title: node.title, body: [he(what), he('לא ממהרים. חושבים, ואז בוחרים.')], scene: node.kind === 'test' ? '🏆⭐🚀' : '🔁✨' }
  }
  const it = INTRO[sp.s] ?? { body: ['בוא נלמד משהו חדש!'], scene: '✨' }
  return { kind: 'explain', title: node.title, body: it.body.map(he), scene: it.scene }
}
