/* Builds every lesson from its skills. A lesson is 3 parts:
   part 1 opens with Piko explaining (the parent reads it aloud), then easy practice;
   part 2 is regular practice; part 3 is harder and ends with a challenge question.
   Generation is seeded by the lesson id, so a lesson is the same every time it's opened. */

import type { L, PathNode, Skill, Spec } from './course'
import type { ExplainStep, Lesson, Part, Shape, Step, Tile } from './lessonTypes'
import {
  alike, CATS, CLEAR_SOUNDS, COLORS, CRITTERS, DAYS, FEELINGS, LETTER_NAME, LETTERS, PLACES, RHYMES, ROUTINE, SCHOOLBAG,
  SEASONS, SHAPES, SHORT2, SHORT3, SOCIAL, SORT_PAIRS, SORT_PAIRS_HARD, STORIES, SYLL, WORDS_BY_LETTER, type Pic,
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
    const others = some(r, set.length > 3 ? set.filter((x) => x !== l) : pool, d === 0 ? 2 : 3)
    while (others.length < (d === 0 ? 2 : 3)) others.push(one(r, pool.filter((x) => !others.includes(x))))
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
    const extra = some(r, [...LETTERS].filter((x) => !w.w.includes(x)), d === 0 ? 1 : 2)
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

/* ───────── assembling a lesson ───────── */
const PART_TITLES = ['מתחילים', 'מתאמנים', 'אתגר!']
const PART_STEPS = [4, 5, 5]

export function buildLesson(node: PathNode): Lesson {
  const r = rng(node.id)
  const specs = node.specs.length ? node.specs : [{ s: 'count' as Skill }]
  const isMix = node.kind !== 'lesson'
  let turn = int(r, 0, specs.length - 1)
  const nextSpec = () => specs[turn++ % specs.length]

  const parts: Part[] = PART_STEPS.map((count, d) => {
    const steps: Step[] = []
    if (d === 0) steps.push(intro(node, specs[0], isMix))
    const seen = new Set<string>()
    for (let i = 0; i < count; i++) {
      let step: Step | null = null
      // Avoid the same exercise twice in a row: try a few times for a fresh one.
      for (let tries = 0; tries < 6 && !step; tries++) {
        const sp = nextSpec()
        const s = G[sp.s](sp, d, r)
        const key = JSON.stringify(s)
        if (!seen.has(key)) { seen.add(key); step = s }
      }
      if (step) steps.push(step)
    }
    // The challenge is the last question of part 3; earlier questions aren't flagged.
    steps.forEach((s, i) => { if ('challenge' in s) (s as { challenge?: boolean }).challenge = d === 2 && i === steps.length - 1 })
    return { title: he(PART_TITLES[d]), steps, teaser: d < 2 ? he(d === 0 ? 'עוד תרגול, ופיקו כבר מתלהב!' : 'שאלת אתגר מחכה בסוף!') : undefined }
  })
  return { id: node.id, parts }
}

function intro(node: PathNode, sp: Spec, isMix: boolean): ExplainStep {
  if (isMix) {
    const what = node.kind === 'test' ? 'אתגר סוף הפרק! כל מה שלמדנו, בבת אחת.' : node.kind === 'checkpoint' ? 'מבדק קטן: נראה כמה כבר יודעים.' : 'חזרה: מתרגלים שוב את מה שלמדנו.'
    return { kind: 'explain', title: node.title, body: [he(what), he('לא ממהרים. חושבים, ואז בוחרים.')], scene: node.kind === 'test' ? '🏆⭐🚀' : '🔁✨' }
  }
  const it = INTRO[sp.s] ?? { body: ['בוא נלמד משהו חדש!'], scene: '✨' }
  return { kind: 'explain', title: node.title, body: it.body.map(he), scene: it.scene }
}
