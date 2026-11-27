/* Builds every lesson from its skills. A lesson is 3 parts:
   part 1 opens with Piko explaining (the parent reads it aloud), then easy practice;
   part 2 is regular practice; part 3 is harder and ends with a challenge question.

   The questions come from the style bank (bank/): well over a hundred kinds of questions, games and riddles.
   The whole year is built in one go, in path order, so it can promise two things:
   · no question is ever asked twice, anywhere in the year (each one has a key, and a key is used once);
   · styles rotate — a lesson never repeats a style if it can help it, and across the year
     the style that waited longest goes first, so the same kind of question doesn't keep coming back. */

import type { PathNode, Skill, Spec } from './course'
import type { ArcadeStep, ExplainStep, FactStep, Lesson, MemoryStep, Part, Pic, Tile, PuzzleStep, Step, TraceStep } from './lessonTypes'
import { isQuestion } from './lessonTypes'
import { alike, ANALOGIES, COLORS, FACTS, FEELINGS, LETTER_NAME, LETTERS, RHYMES, SEASONS, SHAPES, WORDS_BY_LETTER, type Fact } from './kdata'
import { STYLES, type Style, type Topic } from './bank'
import { he, int, mix, one, picTile, range, rng, signature, some, type R } from './bank/util'
import { kitMemory, kitStyles } from './bank/stylesKit'
import { art, KITS, type Kit, type WorldId } from '../worlds/kits'
import { setKitCtx } from './bank/ctx'
import { MORE_FACTS } from './facts2'
import { WORLD_FACTS } from '../worlds/facts'
import type { Stage } from './stage'

/* ───────── choosing questions ───────── */

/** Which style levels suit each question level: 0 easy · 1 regular · 2 hard · 3 thinking question. */
const LEVELS_PRE: Style['lv'][][] = [['e'], ['e', 'h'], ['h'], ['t']]
/** From kindergarten on, even the first question of a lesson makes the child think. */
const LEVELS_SCHOOL: Style['lv'][][] = [['e', 'h'], ['h'], ['h', 't'], ['t']]
let LEVELS = LEVELS_PRE
const byTopic = new Map<Topic, Style[]>()
for (const st of STYLES) for (const t of st.skills) byTopic.set(t, [...(byTopic.get(t) ?? []), st])

type Year = { used: Set<string>; last: Map<string, number>; facts: Map<string, number>; lesson: number; relaxed: number; kit?: Kit; kitByTopic: Map<Topic, Style[]>; stage: Stage; how: Set<string>; unit: string; unitFacts: Set<string>; taught: Set<Topic>; letters: Set<string>; uses: Map<string, number> }
let YEAR: Year = { used: new Set(), last: new Map(), facts: new Map(), lesson: 0, relaxed: 0, kitByTopic: new Map(), stage: 'k', how: new Set(), unit: '', unitFacts: new Set(), taught: new Set(), letters: new Set(), uses: new Map() }

/** Topics a question can't lean on before they're taught: a story about change waits for the coins lesson. */
const GATED: Topic[] = ['clock', 'money', 'times', 'divide', 'fraction']
/** Styles that use a gated topic without being tagged with it. */
const NEEDS: Record<string, Topic[]> = { 'wp-money': ['money'], 'wp-time': ['clock'], 'wp-legs': ['times'], 'wp-mix': ['times'] }
/** What earlier years already taught. */
const TAUGHT_BEFORE: Record<Stage, Topic[]> = { pre: [], k: [], g1: [], g2: ['clock', 'money', 'fraction', 'times'] }

/** What was chosen where (for scripts/check-lessons.ts). */
export const GEN_LOG: { node: string; style: string; topic: Topic; pass: number }[] = []
let NODE = ''

type Slot = { topic: Topic; level: number; spec: Spec }
type Ctx = { r: R; specs: Spec[]; inLesson: Map<string, number>; inPart: Set<string>; filler: number; test: boolean }
/** Picture riddles that don't teach the lesson's topic. */
const FILLER = new Set(['k-shadow', 'k-peek', 'k-upside', 'k-shadow-match', 'k-color-tf', 'k-color-shadow', 'rd-shadow', 'rd-shadows', 'rd-peek', 'rd-spot', 'rd-upside'])

const HEB = /^[\u05d0-\u05ea]$/
/** The biggest number a card may show: pre-K counts to 10, first grade works to 100. */
const CAP: Partial<Record<Stage, number>> = { pre: 10, g1: 100 }
/** Nothing on the cards the child hasn't learned yet: a letter before its lesson, or (in pre-K) a number past 10. */
function known(step: Step): boolean {
  for (const [, g] of JSON.stringify(step).matchAll(/"g":"([^"]*)"/g)) {
    if (HEB.test(g) && !YEAR.letters.has(g)) return false
    if (/^\d+$/.test(g) && Number(g) > (CAP[YEAR.stage] ?? Infinity)) return false
  }
  return true
}

/** Tries a style a few times for a question nobody has seen yet. */
function attempt(st: Style, sp: Spec, r: R, allowSeen = false): Step | null {
  for (let i = 0; i < 40; i++) {
    const made = st.make(sp, r)
    if (!made) return null
    const [key, step] = made
    const sig = signature(step)
    if ((allowSeen || (!YEAR.used.has(key) && !YEAR.used.has(sig))) && (known(step) || (allowSeen && i === 39))) { YEAR.used.add(key); YEAR.used.add(sig); return step }
  }
  return null
}

/** Neighbouring skills: when a lesson has used up its own styles, it borrows from these (same letters, same number range). */
const FAMILY: Partial<Record<Skill, Skill[]>> = {
  letters: ['lettersound'], lettersound: ['letters', 'firstsound'], build: ['read', 'lettersound'], read: ['build', 'lettersound'],
  count: ['numrec', 'moreless', 'numorder'], numrec: ['count', 'numorder', 'moreless'], moreless: ['count', 'numrec'], numorder: ['numrec', 'count'],
  add: ['count', 'moreless'], sub: ['add', 'count'], syll: ['rhyme', 'firstsound'], rhyme: ['syll', 'firstsound'], firstsound: ['rhyme', 'syll'],
  colors: ['pattern', 'sortcat'], shapes: ['size', 'pattern'], size: ['logic', 'position'], position: ['logic', 'size'], odd: ['sortcat', 'logic'],
  sortcat: ['odd', 'logic'], pattern: ['logic', 'odd'], logic: ['odd', 'sortcat'], story: ['days', 'logic'], days: ['story', 'seasons'],
  seasons: ['days', 'story'], feelings: ['social'], social: ['feelings', 'schoolbag'], schoolbag: ['social', 'days'],
  plus: ['minus', 'wordprob'], minus: ['plus', 'wordprob'], times: ['divide', 'skip'], divide: ['times', 'wordprob'], bignum: ['skip', 'plus'],
  skip: ['bignum', 'times'], wordprob: ['plus', 'minus'], nikud: ['words', 'lettersound'], finals: ['words', 'build'], words: ['read', 'finals'],
  sentence: ['words', 'grammar'], grammar: ['sentence', 'words'], reading: ['sentence', 'grammar'],
  clock: ['wordprob', 'money'], money: ['wordprob', 'clock'], fraction: ['divide', 'geometry'], measure: ['size', 'geometry'], geometry: ['shapes', 'measure'],
  graph: ['moreless', 'minus'], quick: ['count', 'add'], phon: ['firstsound', 'syll'],
}
/** Skills whose `set` isn't a set of letters (vowels, grammar kinds, skip steps): never hand it to a letter style. */
const OWN_SET: Skill[] = ['nikud', 'grammar', 'skip', 'clock', 'measure', 'fraction']
const SCHOOL: Skill[] = ['plus', 'minus', 'times', 'divide', 'bignum', 'skip', 'wordprob', 'nikud', 'finals', 'words', 'sentence', 'grammar', 'reading', 'clock', 'money', 'fraction', 'measure', 'geometry', 'graph', 'quick', 'phon']
const LETTER_SET: Skill[] = ['letters', 'lettersound', 'trace']

function ask(slot: Slot, c: Ctx): Step {
  const fresh = (st: Style) => !c.inLesson.has(st.id)
  const levels = slot.topic === 'riddle' ? (YEAR.stage === 'g1' || YEAR.stage === 'g2' ? ['h', 't'] : ['e', 'h', 't']) : LEVELS[slot.level]
  const lessonTopics = [...new Set(c.specs.map((s) => s.s as Topic))]
  const kin = slot.topic === 'riddle' ? [] : (FAMILY[slot.topic] ?? [])
  // the spec a style gets: the lesson's own spec for its skill, or this slot's spec renamed (same letters, same range)
  const specFor = (st: Style): Spec => {
    if (st.skills.includes(slot.spec.s)) return slot.spec
    const own = c.specs.find((s) => st.skills.includes(s.s))
    if (own) return own
    const k = kin.find((x) => st.skills.includes(x))
    if (!k) return slot.spec
    if (OWN_SET.includes(slot.spec.s) || OWN_SET.includes(k)) return { s: k, max: slot.spec.max, hard: slot.spec.hard, set: LETTER_SET.includes(k) ? LETTERS : undefined }
    return { ...slot.spec, s: k }
  }
  const pool = (topics: Topic[]) => [...new Set(topics.flatMap((t) => byTopic.get(t) ?? []))]
  // the child's own world comes first: its questions are told with the cast they chose
  const kitPool = (topics: Topic[]) => [...new Set(topics.flatMap((t) => YEAR.kitByTopic.get(t) ?? []))].filter(fresh)
  const atLevel = (st: Style) => YEAR.stage === 'pre' || slot.topic === 'riddle' || levels.includes(st.lv)
  // in school, the kindergarten warm-ups ("which one is not a letter?") are too easy: only the school skills keep easy questions
  const grownUp = (st: Style) => !(YEAR.stage === 'g1' || YEAR.stage === 'g2') || st.lv !== 'e' || st.skills.some((t) => SCHOOL.includes(t as Skill))
  // a lesson about one thing ("making ten", "times 6 and 7") names the styles that teach exactly that
  const only = slot.spec.only
  // …and then the lesson's other own-topic styles stay out ("which got the most?" isn't followed by a sum to 19)
  const ownOk = (st: Style) => !only || only.includes(st.id)
  // no kind of question takes over the year: a style borrowed from another topic comes back at most 14 times, any style at most 36
  const fewOk = (st: Style) => !!only?.includes(st.id) || (YEAR.uses.get(st.id) ?? 0) < (st.skills[0] === slot.topic ? 36 : 14)
  // nothing from a topic the child hasn't met yet (the lesson's own topics count as met)
  const taughtOk = (st: Style) => [...st.skills.filter((t) => GATED.includes(t)), ...(NEEDS[st.id] ?? [])].every((t) => t === slot.topic || YEAR.taught.has(t) || c.specs.some((s) => s.s === t))
  // the lesson stays on its own topic: its own styles (even a second time) come before borrowing from neighbours
  const passes: Style[][] = [
    only ? pool([slot.topic]).filter((st) => only.includes(st.id) && (c.inLesson.get(st.id) ?? 0) < 3) : [],
    kitPool([slot.topic]).filter((st) => atLevel(st) && ownOk(st)),
    pool([slot.topic]).filter((st) => fresh(st) && levels.includes(st.lv) && ownOk(st)),
    kitPool([slot.topic]).filter(ownOk),
    pool([slot.topic]).filter((st) => fresh(st) && ownOk(st)),
    pool([slot.topic]).filter((st) => !c.inPart.has(st.id) && (c.inLesson.get(st.id) ?? 0) < 2 && ownOk(st)),
    kitPool(kin).filter(atLevel),
    slot.topic === 'riddle' ? [] : pool(lessonTopics).filter(fresh),
    pool(kin).filter(fresh),
    pool(['riddle']).filter(fresh),
    pool([slot.topic, ...lessonTopics, ...kin]).filter((st) => !c.inPart.has(st.id)),
  ]
  // shadows, peeks and upside-down pictures are a nice surprise, not the lesson: one per lesson (two in pre-K)
  const fillerOk = (st: Style) => !FILLER.has(st.id) || (!c.test && c.filler < (YEAR.stage === 'pre' || YEAR.stage === 'k' ? 1 : 0))
  for (const [pass, all] of passes.entries()) {
    const candidates = (pass < passes.length - 1 ? all.filter((st) => grownUp(st) && fillerOk(st) && fewOk(st)) : all).filter(taughtOk)
    // the style that waited longest goes first; ties are broken at random
    const ranked = mix(c.r, candidates).sort((a, b) => (YEAR.last.get(a.id) ?? -1) - (YEAR.last.get(b.id) ?? -1))
    for (const st of ranked) {
      const step = attempt(st, specFor(st), c.r)
      if (step) { note(st, c); GEN_LOG.push({ node: NODE, style: st.id, topic: slot.topic, pass }); return step }
    }
  }
  // Nothing new left at all (shouldn't happen): repeat the least-recent style rather than leave a hole.
  YEAR.relaxed++
  GEN_LOG.push({ node: NODE, style: 'RELAXED', topic: slot.topic, pass: 9 })
  const st = pool([slot.topic, ...lessonTopics]).sort((a, b) => (YEAR.last.get(a.id) ?? -1) - (YEAR.last.get(b.id) ?? -1))[0]
  note(st, c)
  return attempt(st, specFor(st), c.r, true)!
}
function note(st: Style, c: Ctx) {
  c.inLesson.set(st.id, (c.inLesson.get(st.id) ?? 0) + 1)
  c.inPart.add(st.id)
  if (FILLER.has(st.id)) c.filler++
  YEAR.uses.set(st.id, (YEAR.uses.get(st.id) ?? 0) + 1)
  YEAR.last.set(st.id, YEAR.lesson)
}

/** Tracing isn't a question: the child practises the same letters on purpose, one at a time. */
function trace(sp: Spec, r: R, done: Set<string>): TraceStep {
  const set = [...(sp.set ?? '123')]
  const g = one(r, set.filter((x) => !done.has(x)).length ? set.filter((x) => !done.has(x)) : set)
  done.add(g)
  const isNum = /\d/.test(g)
  return { kind: 'trace', q: he(isNum ? `כותבים את המספר ${g} עם האצבע` : `כותבים את האות ${g} (${LETTER_NAME[g]}) עם האצבע`), g }
}

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
  rhyme: { body: ['מילים מתחרזות נשמעות אותו דבר בסוף.', 'ירח ופרח, שעון ובלון. מצחיק, נכון?'], scene: '🌙🌸' },
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
  schoolbag: { body: ['בבית הספר לכל ילד יש ילקוט משלו!', 'מה שמים בו, ומה משאירים בבית?'], scene: '🎒✏️📚' },
  plus: { body: ['היום מחשבים בראש: חיבור!', 'אין כאן תמונות לספור. חושבים, ואז בוחרים.'], scene: '➕🧠' },
  minus: { body: ['היום מחשבים בראש: חיסור!', 'חיסור זה להוריד. בוא נראה איך עושים את זה.'], scene: '➖🧠' },
  times: { body: ['כפל זה דרך מהירה לחבר את אותו מספר כמה פעמים.', 'שלוש קבוצות של 4? זה 3 × 4!'], scene: '✖️🍎' },
  divide: { body: ['חילוק זה לחלק שווה בשווה, שלכל אחד יהיה אותו דבר.', 'ובודקים בכפל!'], scene: '🍪➗' },
  bignum: { body: ['במספר גדול לכל ספרה יש מקום: אחדות, עשרות ומאות.', 'במספר 47 יש 4 עשרות ו־7 אחדות.'], scene: '🔢' },
  skip: { body: ['אפשר לספור בקפיצות: 2, 4, 6, 8...', 'או בקפיצות של 5 ושל 10. מה החוק?'], scene: '🐸🔢' },
  wordprob: { body: ['בשאלה סיפורית קוראים לאט ומוצאים את המספרים.', 'קיבלו עוד? מחברים. נתנו, אכלו או עפו? מחסרים.'], scene: '📖➕➖' },
  nikud: { body: ['הניקוד הוא נקודות וקווים קטנים ליד האות.', 'הם אומרים לנו איך לקרוא אותה: בָּ, בִּי, בּוֹ, בּוּ, בֶּ.'], scene: '📖✨' },
  finals: { body: ['חמש אותיות מחליפות צורה בסוף מילה:', 'כ ← ך, מ ← ם, נ ← ן, פ ← ף, צ ← ץ.'], scene: '🔤✨' },
  words: { body: ['עכשיו קוראים מילים ארוכות!', 'קוראים אות אחרי אות, מימין לשמאל, עד הסוף.'], scene: '📖🌟' },
  sentence: { body: ['כמה מילים ביחד עושות משפט.', 'קוראים את כל המשפט, ואז עונים.'], scene: '📖✏️' },
  grammar: { body: ['למילים יש חוקים: אחד והרבה, הוא והיא, אתמול ומחר.', 'בוא נגלה אותם!'], scene: '🔤🧠' },
  clock: { body: ['לשעון יש שני מחוגים: הקצר אומר את השעה, והארוך את הדקות.', 'כשהמחוג הארוך על 12, השעה עגולה. כשהוא על 6, זה וחצי.'], scene: '⏰' },
  money: { body: ['בישראל משלמים בשקלים. יש מטבעות של 1, 2, 5 ו־10 שקלים.', 'סופרים כסף מהמטבע הגדול לקטן.'], scene: '🪙' },
  fraction: { body: ['כשמחלקים משהו לחלקים שווים, לכל חלק יש שם.', 'שני חלקים שווים: כל אחד חצי. ארבעה חלקים: כל אחד רבע.'], scene: '🍕' },
  measure: { body: ['מודדים אורך עם סרגל, ומתחילים תמיד מ־0.', 'דברים קטנים מודדים בסנטימטרים, ודברים גדולים במטרים.'], scene: '✏️' },
  geometry: { body: ['לכל צורה יש צלעות (קווים) וקודקודים (פינות).', 'משולש: 3 צלעות. ריבוע: 4. ויש גם גופים: קובייה, כדור וגליל.'], scene: '🔺' },
  graph: { body: ['גרף עמודות מראה כמה בחרו בכל דבר.', 'העמודה הכי גבוהה קיבלה הכי הרבה.'], scene: '🍎🍌🍓' },
  quick: { body: ['אפשר לראות כמה יש בלי לספור אחד־אחד!', 'כמו בקובייה: רואים חמש נקודות ויודעים שזה חמש.'], scene: '🎲' },
  phon: { body: ['כל מילה בנויה מצלילים קטנים.', 'ד... ג... ביחד: דג! מקשיבים טוב לכל צליל.'], scene: '👂🐟' },
  reading: { body: ['היום קוראים סיפור קצר.', 'קוראים לאט, ואז עונים על שאלה. אפשר לחזור ולקרוא שוב!'], scene: '📖🔍' },
}

/* ───────── "how do we calculate?" — taught before the first exercise of every lesson that calculates ───────── */
const CALC: Skill[] = ['plus', 'minus', 'add', 'sub', 'times', 'divide', 'wordprob']
const HOW: Skill[] = [...CALC, 'clock', 'money']
function howMain(sp: Spec, short: boolean, r: R): ExplainStep | null {
  // every page works a fresh example, so the same "63 − 27" never comes back
  const max = sp.max ?? 10, hard = !!sp.hard, s = sp.s
  const page = (title: string, body: string[], math: string[], pic?: Pic): ExplainStep => ({ kind: 'explain', title: he(title), body: (short ? body.slice(0, 1) : body).map(he), math: math.length ? math : undefined, pic: short ? undefined : pic })
  const seq = (from: number, k: number, dir: 1 | -1) => Array.from({ length: k }, (_, i) => from + dir * (i + 1)).join(', ')
  if (s === 'plus' || s === 'add') {
    if (max <= 10) {
      const a = int(r, 3, Math.max(3, max - 3)), b = int(r, 2, Math.max(2, Math.min(4, max - a)))
      return page('איך מחברים?', ['מתחילים מהמספר הגדול, ושומרים אותו בראש.', `קופצים קדימה ${b} קפיצות, וסופרים אותן על האצבעות: ${seq(0, b, 1)}.`, `אחרי ${b} קפיצות עוצרים! ${a} + ${b}: מ־${a} קופצים ל־${seq(a, b, 1)}. יצא ${a + b}.`], [`${a} + ${b} = ?`, `${a} … ${seq(a, b, 1)}`, `${a} + ${b} = ${a + b}`],
        { kind: 'line', lo: 0, hi: 10, start: a, hops: Array.from({ length: b }, (_, i) => a + i + 1) })
    }
    if (max <= 20) {
      const a = int(r, 6, 9), b = int(r, 11 - a, 9), need = 10 - a, rest = b - need
      return page('איך מחברים עד 20?', [`משלימים קודם ל־10: ל־${a} חסרים ${need} כדי להגיע ל־10.`, `את ה־${need} לוקחים מה־${b}, ונשארו ממנו ${rest}.`, `10 ועוד ${rest} זה ${a + b}. קל לחבר ל־10!`], [`${a} + ${b} = ?`, `${a} + ${need} = 10`, `10 + ${rest} = ${a + b}`, `${a} + ${b} = ${a + b}`],
        { kind: 'frames', a, b })
    }
    if (max <= 100) {
      let a = 0, b = 0
      for (let i = 0; i < 50; i++) { a = int(r, 21, 68); b = int(r, 12, 99 - a); if (b % 10 && a % 10 && ((a % 10) + (b % 10) >= 10) === hard) break }
      const ta = a - (a % 10), tb = b - (b % 10), oa = a % 10, ob = b % 10, t = ta + tb, o = oa + ob
      return page(hard ? 'איך מחברים עם המרה?' : 'איך מחברים מספרים גדולים?', [`מחברים עשרות עם עשרות: ${ta} + ${tb} = ${t}.`, `מחברים אחדות עם אחדות: ${oa} + ${ob} = ${o}.`, o >= 10 ? `${o} אחדות הן עוד עשר ו־${o - 10}. ביחד: ${t} + ${o} = ${a + b}.` : `ביחד: ${t} + ${o} = ${a + b}.`], [`${a} + ${b} = ?`, `${ta} + ${tb} = ${t}`, `${oa} + ${ob} = ${o}`, `${t} + ${o} = ${a + b}`])
    }
    const a = int(r, 2, 5) * 100 + int(r, 1, 8) * 10 + int(r, 1, 9), b = int(r, 1, 3) * 100 + int(r, 1, 8) * 10 + int(r, 1, 9)
    const h = (x: number) => x - (x % 100), te = (x: number) => (x % 100) - (x % 10), o = (x: number) => x % 10
    return page('איך מחברים מאות?', [`מאות עם מאות: ${h(a)} + ${h(b)} = ${h(a) + h(b)}.`, `עשרות עם עשרות: ${te(a)} + ${te(b)} = ${te(a) + te(b)}. אחדות עם אחדות: ${o(a)} + ${o(b)} = ${o(a) + o(b)}.`, `ביחד: ${h(a) + h(b)} + ${te(a) + te(b)} + ${o(a) + o(b)} = ${a + b}.`],
      [`${a} + ${b} = ?`, `${h(a)} + ${h(b)} = ${h(a) + h(b)}`, `${te(a)} + ${te(b)} = ${te(a) + te(b)}`, `${o(a)} + ${o(b)} = ${o(a) + o(b)}`, `${h(a) + h(b)} + ${te(a) + te(b)} + ${o(a) + o(b)} = ${a + b}`])
  }
  if (s === 'minus' || s === 'sub') {
    if (max <= 10) {
      const a = int(r, 6, Math.max(6, max)), b = int(r, 2, 4), d = a - b
      return page('איך מחסרים?', ['מתחילים מהמספר הראשון, ושומרים אותו בראש.', `קופצים אחורה ${b} קפיצות, וסופרים אותן על האצבעות.`, `אחרי ${b} קפיצות עוצרים! ${a} − ${b}: מ־${a} קופצים ל־${seq(a, b, -1)}. נשארו ${d}.`, `בודקים: ${d} + ${b} = ${a}. צדקנו!`], [`${a} − ${b} = ?`, `${a} … ${seq(a, b, -1)}`, `${a} − ${b} = ${d}`],
        { kind: 'line', lo: 0, hi: 10, start: a, hops: Array.from({ length: b }, (_, i) => a - i - 1) })
    }
    if (max <= 20) {
      const a = int(r, 11, 17), b = int(r, a - 9, 9), toTen = a - 10, rest = b - toTen, d = a - b
      return page('איך מחסרים עד 20?', [`יורדים קודם ל־10: מ־${a} מורידים ${toTen} ומגיעים ל־10.`, `היינו צריכים להוריד ${b}. הורדנו ${toTen}, נשאר להוריד עוד ${rest}.`, `10 פחות ${rest} זה ${d}!`], [`${a} − ${b} = ?`, `${a} − ${toTen} = 10`, `10 − ${rest} = ${d}`, `${a} − ${b} = ${d}`],
        { kind: 'line', lo: Math.max(0, d - 1), hi: a + 1, start: a, hops: [10, d] })
    }
    if (max <= 100) {
      let a = 0, b = 0
      for (let i = 0; i < 50; i++) { a = int(r, 41, 98); b = int(r, 12, a - 11); if (b % 10 && b >= 10 && ((a % 10) < (b % 10)) === hard) break }
      const tb = b - (b % 10), ob = b % 10, x = a - tb, d = a - b
      return page('איך מחסרים מספרים גדולים?', [`מורידים קודם את העשרות: ${a} − ${tb} = ${x}.`, `אחר כך מורידים את האחדות: ${x} − ${ob} = ${d}.`, `בודקים בחיבור: ${d} + ${b} = ${a}.`], [`${a} − ${b} = ?`, `${a} − ${tb} = ${x}`, `${x} − ${ob} = ${d}`, `${a} − ${b} = ${d}`])
    }
    const a = int(r, 5, 9) * 100 + int(r, 1, 9) * 10 + int(r, 1, 9), b = int(r, 1, 4) * 100 + int(r, 1, 9) * 10 + int(r, 1, 9)
    const hb = b - (b % 100), tb = (b % 100) - (b % 10), ob = b % 10, x = a - hb, y = x - tb, d = a - b
    return page('איך מחסרים מאות?', [`מורידים קודם את המאות: ${a} − ${hb} = ${x}.`, `אחר כך את העשרות ואת האחדות: ${x} − ${tb} = ${y}, ${y} − ${ob} = ${d}.`, `בודקים בחיבור: ${d} + ${b} = ${a}.`], [`${a} − ${b} = ?`, `${a} − ${hb} = ${x}`, `${x} − ${tb} = ${y}`, `${y} − ${ob} = ${d}`])
  }
  if (s === 'times') {
    // two different numbers, so swapping them shows something ("3 × 3 = 3 × 3" teaches nothing)
    const a = int(r, 2, 4), b = one(r, range(3, Math.min(10, Math.max(5, max))).filter((x) => x !== a))
    return page('איך כופלים?', [`${a} × ${b} זה ${a} קבוצות, ובכל קבוצה ${b}.`, `סופרים בקפיצות של ${b}: ${Array.from({ length: a }, (_, i) => b * (i + 1)).join(', ')}.`, `אפשר גם להחליף: ${b} × ${a} = ${a} × ${b} = ${a * b}.`], [`${a} × ${b} = ?`, Array(a).fill(b).join(' + '), Array.from({ length: a }, (_, i) => b * (i + 1)).join(', '), `${a} × ${b} = ${a * b}`])
  }
  if (s === 'divide') {
    const a = int(r, 2, 5), b = int(r, 2, Math.min(10, Math.max(3, max)))
    return page('איך מחלקים?', [`${a * b} : ${a} שואל: אם מחלקים ${a * b} ל־${a} שווה בשווה, כמה כל אחד מקבל?`, `חושבים בכפל: ${a} כפול כמה זה ${a * b}?`, `${a} × ${b} = ${a * b}, אז ${a * b} : ${a} = ${b}.`], [`${a * b} : ${a} = ?`, `${a} × ? = ${a * b}`, `${a} × ${b} = ${a * b}`, `${a * b} : ${a} = ${b}`])
  }
  if (s === 'clock') {
    const h = int(r, 2, 10), lv = sp.set ?? 'h'
    const items: Tile[] = [{ clock: [h, 0] }], caps = [`${h}:00`]
    if (lv === 'h') { const h2 = h + int(r, 1, 2); items.push({ clock: [h2, 0] }); caps.push(`${h2}:00`) }
    else { items.push({ clock: [h, 30] }); caps.push(`${h} וחצי`) }
    if (lv === 'q') { items.push({ clock: [h, 15] }); caps.push(`${h} ורבע`) }
    return page('איך קוראים שעון?', ['קודם מסתכלים על המחוג הקצר: הוא אומר את השעה.', 'אחר כך על המחוג הארוך (האדום). כשהוא על 12, השעה עגולה.', ...(lv !== 'h' ? ['כשהארוך על 6, עבר חצי שעה: זה "וחצי".'] : []), ...(lv === 'q' ? ['כשהארוך על 3, עבר רבע שעה: זה "ורבע".'] : [])], [], { kind: 'tiles', items, caps })
  }
  if (s === 'money') {
    const cs = some(r, [10, 5, 2, 1], 3).sort((x, y) => y - x), run = cs.map((_, i) => cs.slice(0, i + 1).reduce((x, y) => x + y, 0)), t = run.at(-1)!
    return page('איך סופרים כסף?', ['מסתכלים מה כתוב על כל מטבע: 1, 2, 5 או 10 שקלים.', `מתחילים מהמטבע הגדול ומוסיפים: ${run.join(', ')}.`, `ביחד ${t} שקלים!`], [cs.join(' + ') + ` = ${t} ₪`], { kind: 'tiles', items: [{ coins: cs }] })
  }
  if (s === 'wordprob') return page('איך פותרים שאלה סיפורית?', ['קוראים לאט ומוצאים את המספרים.', 'קיבלו עוד? מחברים. נתנו, אכלו או הלכו? מחסרים.'], ['+ עוד', '− נשאר'])
  return null
}

/** The explanations a chapter gives, one per lesson in this order: how to calculate, then (for small numbers)
    how to find a missing number, then how much is missing up to ten. */
function howTo(sp: Spec, short: boolean, r: R): ExplainStep[] {
  const main = howMain(sp, short, r)
  if (!main) return []
  const out = [main], max = sp.max ?? 10, s = sp.s
  const page = (title: string, body: string[], math: string[], pic: Pic): ExplainStep => ({ kind: 'explain', title: he(title), body: (short ? body.slice(0, 1) : body).map(he), math: math.length ? math : undefined, pic: short ? undefined : pic })
  if (max <= 20 && s === 'plus') {
    const b = int(r, 2, 6), k = int(r, 2, 4), t = b + k
    out.push(page('מה חסר בתרגיל?', ['כשחסר מספר, מתחילים מהמספר שיש לנו.', `קופצים עד התוצאה, וסופרים כמה קפיצות: ${Array.from({ length: k }, (_, i) => i + 1).join(', ')}.`, `${b} + ? = ${t}: מ־${b} עד ${t} יש ${k} קפיצות. חסר ${k}!`], [`${b} + ? = ${t}`, `${b} … ${Array.from({ length: k }, (_, i) => b + i + 1).join(', ')}`, `${b} + ${k} = ${t}`],
      { kind: 'line', lo: Math.max(0, b - 1), hi: t + 1, start: b, hops: Array.from({ length: k }, (_, i) => b + i + 1) }))
    const a = int(r, 3, 8)
    out.push(page('כמה חסר עד 10?', ['במסגרת יש 10 משבצות.', `${a} משבצות מלאות. סופרים את הריקות: חסרים ${10 - a}.`, `${a} ו־${10 - a} הם חברים של 10.`], [`${a} + ? = 10`, `${a} + ${10 - a} = 10`], { kind: 'frames', a, b: 0 }))
  }
  if (max <= 20 && s === 'minus') {
    const d = int(r, 2, 6), k = int(r, 2, 4), a = d + k
    out.push(page('מה חסר בתרגיל?', ['כשחסר כמה הורדנו, מתחילים מהמספר הגדול.', 'קופצים אחורה עד מה שנשאר, וסופרים כמה קפיצות.', `${a} − ? = ${d}: מ־${a} עד ${d} יש ${k} קפיצות. הורדנו ${k}!`], [`${a} − ? = ${d}`, `${a} … ${Array.from({ length: k }, (_, i) => a - i - 1).join(', ')}`, `${a} − ${k} = ${d}`],
      { kind: 'line', lo: Math.max(0, d - 1), hi: a + 1, start: a, hops: Array.from({ length: k }, (_, i) => a - i - 1) }))
  }
  return out
}

/* ───────── games inside the lessons ─────────
   Every lesson's middle part ends with a game built from that lesson's own material: a jigsaw puzzle of a
   letter (or number) picture, or a memory game. They grow with the year: 6 → 9 → 12 pieces, 3 → 4 → 5 pairs. */
const LETTER_SKILLS: Skill[] = ['letters', 'lettersound', 'build', 'read', 'firstsound', 'nikud', 'finals', 'words', 'sentence', 'grammar', 'reading']
const NUMBER_SKILLS: Skill[] = ['count', 'numrec', 'moreless', 'numorder', 'add', 'sub', 'plus', 'minus', 'times', 'divide', 'bignum', 'skip', 'wordprob', 'quick', 'money', 'clock']

function family(specs: Spec[]): { kind: 'letters'; set: string } | { kind: 'numbers'; max: number } | { kind: 'other'; spec: Spec } {
  const lettersSet = specs.filter((x) => LETTER_SKILLS.includes(x.s) || (x.s === 'trace' && !/\d/.test(x.set ?? ''))).map((x) => (x.s === 'letters' || x.s === 'lettersound' || x.s === 'trace' ? x.set ?? LETTERS : LETTERS)).join('')
    // a sounds lesson isn't about letters: it lends only the ones the child already knows
    .split('').filter((g) => YEAR.letters.has(g)).join('')
  if (lettersSet) return { kind: 'letters', set: [...new Set(lettersSet)].join('') }
  const nums = specs.filter((x) => NUMBER_SKILLS.includes(x.s) || (x.s === 'trace' && /\d/.test(x.set ?? '')))
  if (nums.length) return { kind: 'numbers', max: Math.max(5, ...nums.map((x) => x.max ?? 5)) }
  return { kind: 'other', spec: specs[0] }
}

function puzzleGame(unit: number, specs: Spec[], r: R): PuzzleStep {
  const [cols, rows] = unit <= 3 ? [3, 2] : unit <= 8 ? [3, 3] : [4, 3]
  const f = family(specs)
  const kit = YEAR.kit
  if (kit && f.kind === 'letters') {
    const cast = [...kit.chars.map((c) => ({ w: c.name, k: c.k })), ...kit.things.filter((t) => !t.w.includes(' ')).map((t) => ({ w: t.w, k: t.k }))].filter((x) => f.set.includes(x.w[0]))
    if (cast.length) { const x = one(r, cast); return { kind: 'puzzle', title: he(`פאזל: ${x.w}`), g: x.w[0], word: x.w, e: art(kit.id, x.k), cols, rows } }
  }
  if (f.kind === 'numbers') {
    const n = int(r, 2, Math.min(9, f.max)), e = kit ? art(kit.id, one(r, kit.things).k) : one(r, ['🍎', '⭐', '🐟', '🎈', '🐞', '🍓'])
    return { kind: 'puzzle', title: he(`פאזל: המספר ${n}`), g: String(n), e, n, cols, rows }
  }
  if (f.kind === 'letters') {
    const l = one(r, [...f.set].filter((x) => WORDS_BY_LETTER[x])), w = one(r, WORDS_BY_LETTER[l])
    return { kind: 'puzzle', title: he(`פאזל: האות ${l}`), g: l, word: w.w, e: w.e, cols, rows }
  }
  // a lesson without letters doesn't sneak them in: a number puzzle of the child's world instead
  const n = int(r, 2, 9), e = kit ? art(kit.id, one(r, kit.things).k) : one(r, ['🍎', '⭐', '🐟', '🎈', '🐞', '🍓'])
  return { kind: 'puzzle', title: he(`פאזל: המספר ${n}`), g: String(n), e, n, cols, rows }
}

function memoryGame(unit: number, specs: Spec[], r: R): MemoryStep {
  const n = unit <= 3 ? 3 : unit <= 8 ? 4 : 5
  const f = family(specs)
  const kit = YEAR.kit
  if (kit && f.kind !== 'letters' && r() < 0.6) return { kind: 'memory', title: he(`זיכרון: ${kit.title}`), pairs: kitMemory(kit, r, n) }
  if (f.kind === 'numbers') {
    const e = kit ? art(kit.id, one(r, kit.things).k) : one(r, ['🍎', '⭐', '🐟', '🎈', '🐞'])
    const ns = some(r, Array.from({ length: Math.min(10, f.max) }, (_, i) => i + 1), n)
    return { kind: 'memory', title: he('זיכרון: מספר וכמות'), pairs: ns.map((k) => [{ g: String(k) }, { many: { e, n: k } }]) }
  }
  if (f.kind === 'letters') {
    const ls: string[] = []
    // only letters the child has met (the first lessons know two or three: that's too few for a game)
    for (const l of mix(r, [...f.set, ...mix(r, [...YEAR.letters])])) { if (ls.length >= n) break; if (WORDS_BY_LETTER[l] && !ls.includes(l) && !ls.some((x) => alike(x, l))) ls.push(l) }
    if (ls.length >= 3) return { kind: 'memory', title: he('זיכרון: אות ותמונה'), pairs: ls.map((l) => [{ g: l }, picTile(one(r, WORDS_BY_LETTER[l]))]) }
    if (kit) return { kind: 'memory', title: he(`זיכרון: ${kit.title}`), pairs: kitMemory(kit, r, n) }
    return { kind: 'memory', title: he('זיכרון: מה הולך ביחד?'), pairs: some(r, ANALOGIES, n).map(([a, b]) => [picTile(a), picTile(b)]) }
  }
  const s = f.spec.s
  if (s === 'colors') return { kind: 'memory', title: he('זיכרון: צבע ותמונה'), pairs: some(r, COLORS, n).map((c) => [{ shape: 'circle', color: c.c }, { e: one(r, c.e) }]) }
  if (s === 'shapes') return { kind: 'memory', title: he('זיכרון: צורה ודבר'), pairs: some(r, SHAPES, Math.min(n, SHAPES.length)).map((x) => [{ shape: x.s, color: '#7fb8f5' }, { e: one(r, x.e) }]) }
  if (s === 'rhyme' || s === 'syll') return { kind: 'memory', title: he('זיכרון: מילים מתחרזות'), pairs: some(r, RHYMES, n).map(([a, b]) => [picTile(a), picTile(b)]) }
  if (s === 'seasons') return { kind: 'memory', title: he('זיכרון: עונה ומה קורה בה'), pairs: SEASONS.map((x) => [{ e: x.e, t: x.n }, { t: one(r, x.clues) }]) }
  if (s === 'feelings' || s === 'social') return { kind: 'memory', title: he('זיכרון: פרצוף ורגש'), pairs: some(r, FEELINGS, n).map((x) => [{ e: x.e }, { t: x.n }]) }
  if (s === 'logic' || s === 'odd') return { kind: 'memory', title: he('זיכרון: מה הולך ביחד?'), pairs: some(r, ANALOGIES, n).map(([a, b]) => [picTile(a), picTile(b)]) }
  // everything else: pairs from the child's world, or things that go together (no letters before they're taught)
  if (kit) return { kind: 'memory', title: he(`זיכרון: ${kit.title}`), pairs: kitMemory(kit, r, n) }
  return { kind: 'memory', title: he('זיכרון: מה הולך ביחד?'), pairs: some(r, ANALOGIES, n).map(([a, b]) => [picTile(a), picTile(b)]) }
}

const ARCADE: ArcadeStep[] = [
  { kind: 'arcade', game: 'hoop', title: he('הפסקה: קליעה לסל!'), seconds: 90 },
  { kind: 'arcade', game: 'goal', title: he('הפסקה: בעיטה לשער!'), seconds: 90 },
  { kind: 'arcade', game: 'bowl', title: he('הפסקה: באולינג!'), seconds: 90 },
  { kind: 'arcade', game: 'dart', title: he('הפסקה: חיצים למטרה!'), seconds: 90 },
]
const arcadeGame = (i: number): ArcadeStep => ({ ...ARCADE[i] })

/* ───────── assembling a lesson ───────── */
const PART_TITLES = ['מתחילים', 'מתאמנים', 'אתגר!']
const PART_STEPS = [4, 5, 5]
/** The level of each question in each part: 0 easy · 1 regular · 2 hard (tempting wrong answers) · 3 thinking question. */
const CURVE_PRE = [[0, 1, 2, 3], [1, 3, 2, 3, 2], [2, 3, 2, 3, 3]]
/** From kindergarten on the lesson opens with a real question and climbs fast. */
const CURVE_SCHOOL = [[0, 2, 1, 3], [2, 3, 2, 3, 3], [3, 2, 3, 3, 3]]
let CURVE = CURVE_PRE
/** A surprise riddle — a shadow, a "who am I?", true or false… — in these places of every lesson: [part, question]. */
const RIDDLE_AT = [[1, 3], [2, 1]]

/** Builds the whole year in path order, so no question repeats and styles rotate across lessons. */
export function buildYear(nodes: PathNode[], world?: WorldId, stage: Stage = 'k'): Record<string, Lesson> {
  const kit = world ? KITS[world] : undefined
  setKitCtx(kit)
  LEVELS = stage === 'pre' ? LEVELS_PRE : LEVELS_SCHOOL
  CURVE = stage === 'pre' ? CURVE_PRE : CURVE_SCHOOL
  const kitByTopic = new Map<Topic, Style[]>()
  if (kit) for (const st of kitStyles(kit)) for (const t of st.skills) kitByTopic.set(t, [...(kitByTopic.get(t) ?? []), st])
  YEAR = { used: new Set(), last: new Map(), facts: new Map(), lesson: 0, relaxed: 0, kit, kitByTopic, stage, how: new Set(), unit: '', unitFacts: new Set(), taught: new Set(TAUGHT_BEFORE[stage]), letters: new Set(stage === 'g1' || stage === 'g2' ? LETTERS : ''), uses: new Map() }
  const out: Record<string, Lesson> = {}
  GEN_LOG.length = 0
  for (const n of nodes) {
    NODE = n.id
    // what this lesson teaches counts as known from its first question
    for (const sp of n.specs) { YEAR.taught.add(sp.s as Topic); if (LETTER_SET.includes(sp.s) && sp.set) for (const g of sp.set) YEAR.letters.add(g) }
    out[n.id] = buildLesson(n)
    YEAR.lesson++
  }
  if (YEAR.relaxed && import.meta.env?.DEV) console.warn(`[gen] ${YEAR.relaxed} questions had to repeat`)
  return out
}

function buildLesson(node: PathNode): Lesson {
  const r = rng(node.id)
  // a new chapter: its facts start fresh (no fact is told twice within one chapter)
  const unitId = node.id.match(/^u\d+/)?.[0] ?? ''
  if (unitId !== YEAR.unit) { YEAR.unit = unitId; YEAR.unitFacts = new Set() }
  const base = node.specs.length ? node.specs : [{ s: 'count' as Skill }]
  // the chapter challenge is harder than a lesson: every skill at its hard end, thinking questions throughout
  // …except carrying and borrowing past 20: a chapter that didn't teach them doesn't test them
  const specs = node.kind === 'test' ? base.map((x) => ({ ...x, hard: x.hard || !(CALC.includes(x.s) && (x.max ?? 10) > 20) })) : base
  const isMix = node.kind !== 'lesson'
  const riddles = RIDDLE_AT.slice(0, 1)
  let turn = int(r, 0, specs.length - 1)
  const usedFacts = new Set<string>()
  const traced = new Set<string>()
  const ctx: Ctx = { r, specs, inLesson: new Map(), inPart: new Set(), filler: 0, test: node.kind === 'test' }

  const parts: Part[] = PART_STEPS.map((count, d) => {
    const steps: Step[] = []
    if (d === 0) {
      steps.push(intro(node, specs[0], isMix))
      // before any calculating: how to do it (a full page in a lesson, a one-line reminder in a check or review)
      const seen = new Set<string>()
      const unit = node.id.match(/^u\d+/)?.[0] ?? ''
      for (const sp of specs) {
        if (!HOW.includes(sp.s)) continue
        // once per chapter, each page: the first lesson (or check) that calculates that way explains how, the next
        // ones add the next page (missing numbers, friends of ten), and after that they just practise
        const how = howTo(sp, isMix, r).find((x) => !YEAR.how.has(`${unit}|${x.title.he}`))
        if (!how || seen.has(how.title.he)) continue
        seen.add(how.title.he)
        YEAR.how.add(`${unit}|${how.title.he}`)
        if (how.title.he === node.title.he) how.title = he('ככה מחשבים')
        steps.push(how)
      }
    }
    // parts 2 and 3 open with a "did you know?" — a breather, and something to wonder about
    else steps.push(d === 1 && YEAR.kit ? kitFact(YEAR.kit, r) : factFor(specs, usedFacts, r))
    ctx.inPart = new Set()
    for (let i = 0; i < count; i++) {
      const sp = specs[turn++ % specs.length]
      // the chapter challenge tests the chapter: no riddle in the middle of it
      const riddle = node.kind !== 'test' && riddles.some(([pd, pi]) => pd === d && pi === i)
      if (sp.s === 'trace' && !riddle) { steps.push(trace(sp, r, traced)); continue }
      steps.push(ask({ topic: riddle ? 'riddle' : sp.s, level: node.kind === 'test' ? 3 : CURVE[d][i] ?? 2, spec: sp }, ctx))
    }
    // The middle part of every lesson (and the chapter challenge) ends with a game.
    if (d === 1 && (node.kind === 'lesson' || node.kind === 'test')) {
      const unit = Number(node.id.match(/^u(\d+)/)?.[1] ?? 1)
      const k = Number(node.id.match(/-l(\d+)$/)?.[1] ?? 0)
      steps.push(node.kind === 'test' || k % 2 === 1 ? puzzleGame(unit, specs, r) : memoryGame(unit, specs, r))
    }
    // Now and then (every second lesson) the first part ends with a ball game, just for fun.
    if (d === 0 && node.kind === 'lesson') {
      const unit = Number(node.id.match(/^u(\d+)/)?.[1] ?? 1)
      const k = Number(node.id.match(/-l(\d+)$/)?.[1] ?? 0)
      if (k % 2 === 0) steps.push(arcadeGame((unit + k / 2) % ARCADE.length))
    }
    // The challenge is the last question of part 3; earlier questions aren't flagged.
    const lastQ = d === 2 ? steps.map((s, i) => (isQuestion(s) ? i : -1)).filter((i) => i >= 0).at(-1) : -1
    steps.forEach((s, i) => { if (isQuestion(s)) (s as { challenge?: boolean }).challenge = i === lastQ })
    return { title: he(PART_TITLES[d]), steps, teaser: d < 2 ? he(d === 0 ? 'עוד תרגול, ופיקו כבר מתלהב!' : 'שאלת אתגר מחכה בסוף!') : undefined }
  })
  return { id: node.id, parts }
}

/** A fact from this lesson's topics (never the same one twice in a lesson), or a general one. */
function factFor(specs: Spec[], used: Set<string>, r: R): FactStep {
  // the fact told least often this year goes first, so the same one comes back as rarely as possible
  const seen = (f: Fact) => YEAR.facts.get(f.t) ?? 0
  const freshest = (a: Fact[]) => { const m = Math.min(...a.map(seen)); return a.filter((f) => seen(f) === m) }
  const notYet = (f: Fact) => !used.has(f.t) && !YEAR.unitFacts.has(f.t)
  const topical = specs.flatMap((s) => [...(FACTS[s.s] ?? []), ...(MORE_FACTS[s.s] ?? [])]).filter(notYet)
  const generalAll = [...FACTS.general, ...(MORE_FACTS.general ?? [])]
  const general = generalAll.filter(notYet).length ? generalAll.filter(notYet) : generalAll.filter((x) => !used.has(x.t))
  const pool = topical.length && Math.min(...topical.map(seen)) <= Math.min(...general.map(seen)) ? topical : general
  const f = one(r, freshest(pool))
  used.add(f.t)
  YEAR.unitFacts.add(f.t)
  YEAR.facts.set(f.t, seen(f) + 1)
  return { kind: 'fact', e: f.e, text: he(f.t) }
}

function intro(node: PathNode, sp: Spec, isMix: boolean): ExplainStep {
  if (isMix) {
    const what = node.kind === 'test' ? 'אתגר סוף הפרק! כל מה שלמדנו, בבת אחת.' : node.kind === 'checkpoint' ? 'מבדק קטן: נראה כמה כבר יודעים.' : 'חזרה: מתרגלים שוב את מה שלמדנו.'
    return { kind: 'explain', title: node.title, body: [he(what), he('לא ממהרים. חושבים, ואז בוחרים.')], scene: node.kind === 'test' ? '🏆⭐🚀' : '🔁✨' }
  }
  const it = { ...(INTRO[sp.s] ?? { body: ['בוא נלמד משהו חדש!'], scene: '✨' }) }
  // the last lesson of a chapter celebrates what was learned, it doesn't promise new letters
  if (/-l8$/.test(node.id)) it.body = ['היום חוגגים את סוף הפרק!', 'מתרגלים את כל מה שלמדנו, והשאלות קצת יותר קשות.']
  else if (sp.s === 'bignum') it.body = (sp.max ?? 100) <= 20 ? ['מ־11 עד 20 יש עשרת אחת, ועוד כמה אחדות.', 'במספר 14 יש עשרת אחת ו־4 אחדות.'] : (sp.max ?? 100) <= 100 ? ['במספר דו־ספרתי יש עשרות ואחדות.', 'במספר 47 יש 4 עשרות ו־7 אחדות.'] : ['במספר תלת־ספרתי יש מאות, עשרות ואחדות.', 'במספר 365 יש 3 מאות, 6 עשרות ו־5 אחדות.']
  else if (sp.s === 'grammar') {
    // each grammar lesson opens with its own rule (a mixed lesson rotates between them)
    const kinds = [...(sp.set ?? 'pog')], k = kinds[YEAR.lesson % kinds.length]
    it.body = k === 'p' ? ['יחיד ורבים: כלב, כלבים. ילדה, ילדות.', 'ויש מילים מיוחדות שמשנות צורה: בית, בתים. איש, אנשים!']
      : k === 'o' ? ['הפכים הם מילים הפוכות: גדול וקטן, יום ולילה, חם וקר.', 'נמצא עוד הפכים ביחד?']
      : k === 'g' ? ['בעברית מדברים אחרת על בן ועל בת: הילד שמח, הילדה שמחה.', 'מקשיבים לסוף המילה!']
      : k === 't' ? ['אתמול, עכשיו ומחר: אתמול שיחקתי, עכשיו אני משחק, מחר אשחק.', 'המילה משתנה לפי הזמן.']
      : ['יש מילים שאומרות כמעט אותו דבר: גדול וענק, שמח ועליז.', 'נחפש מילים חברות?']
  } else if (sp.s === 'reading' || sp.s === 'sentence' || sp.s === 'words') {
    const v = YEAR.lesson % 3
    it.body = sp.s === 'reading'
      ? [['היום קוראים סיפור קצר.', 'קוראים לאט, ואז עונים. אפשר לחזור ולקרוא שוב!'], ['בכל סיפור מחפשים: מי? איפה? מה קרה?', 'המילה "כי" אומרת לנו למה.'], ['קוראים סיפור, ושואלים: איך הרגישו? ומה קרה אחר כך?', 'סיפור טוב קוראים עד הסוף.']][v]
      : sp.s === 'sentence'
        ? [['כמה מילים ביחד עושות משפט.', 'קוראים את כל המשפט, ואז עונים.'], ['במשפט יש מי, ומה הוא עושה: נועה אוכלת תפוח.', 'מוצאים את המילה שחסרה!'], ['משפט נגמר בנקודה, ושאלה נגמרת בסימן שאלה.', 'קוראים עד הנקודה, ואז עונים.']][v]
        : [['עכשיו קוראים מילים ארוכות!', 'קוראים אות אחרי אות, מימין לשמאל, עד הסוף.'], ['מילה ארוכה מחלקים לחלקים קטנים: בַּ־נָ־נָה.', 'קוראים כל חלק, ואז ביחד.'], ['יש מילים שנראות דומות: כלב וכלבה, ספר וספרים.', 'מסתכלים טוב על כל אות!']][v]
  } else if (sp.s === 'nikud') {
    // the newest vowel, in the order they're taught (a set like 'aeiou' is alphabetical, not in teaching order)
    const v = ['a', 'i', 'o', 'u', 'e'].filter((x) => (sp.set ?? 'a').includes(x)).at(-1)
    it.body = v === 'a' ? ['הניקוד הוא סימנים קטנים ליד האות, שאומרים איך לקרוא אותה.', 'קמץ ( ָ ) ופתח ( ַ ) נשמעים אותו דבר: אַ. בָּ, מַ, דָּ.']
      : v === 'i' ? ['היום מכירים את החיריק: נקודה אחת מתחת לאות.', 'חיריק נשמע אִי: בִּי, מִי, פִּיל.']
      : v === 'u' ? ['היום מכירים את החולם ( וֹ ) ואת השורוק ( וּ ).', 'חולם נשמע אוֹ: דּוֹב. שורוק נשמע אוּ: סוּס. גם הקובוץ ( ֻ ) נשמע אוּ.']
      : v === 'o' ? ['היום מכירים את החולם: נקודה מעל האות, או מעל הוו ( וֹ ).', 'חולם נשמע אוֹ: דֹּב, שׁוֹר.']
      : ['היום מכירים את הצירה ( ֵ ) ואת הסגול ( ֶ ).', 'שניהם נשמעים אֶ: לֵב, כֶּלֶב.']
  }
  const kit = YEAR.kit
  if (kit) {
    // two of the child's characters come along, a different pair each lesson
    const i = YEAR.lesson % kit.chars.length, a = kit.chars[i], b = kit.chars[(i + 3) % kit.chars.length]
    return { kind: 'explain', title: node.title, body: [he(kit.hello.replace('{a}', a.name).replace('{b}', b.name)), ...it.body.map(he)], scene: [art(kit.id, a.k), art(kit.id, b.k)].join(' ') }
  }
  return { kind: 'explain', title: node.title, body: it.body.map(he), scene: it.scene }
}

/** A fact from the child's world: the one told least often this year. */
function kitFact(kit: Kit, r: R): FactStep {
  const seen = (t: string) => YEAR.facts.get(t) ?? 0
  const all = [...kit.facts, ...(WORLD_FACTS[kit.id] ?? [])]
  const fresh = all.filter((x) => !YEAR.unitFacts.has(x.t))
  const pool = fresh.length ? fresh : all
  const m = Math.min(...pool.map((f) => seen(f.t)))
  const f = one(r, pool.filter((x) => seen(x.t) === m))
  YEAR.unitFacts.add(f.t)
  YEAR.facts.set(f.t, seen(f.t) + 1)
  return { kind: 'fact', e: f.e, text: he(f.t) }
}

