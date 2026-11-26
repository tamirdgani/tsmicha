/* Builds every lesson from its skills. A lesson is 3 parts:
   part 1 opens with Piko explaining (the parent reads it aloud), then easy practice;
   part 2 is regular practice; part 3 is harder and ends with a challenge question.

   The questions come from the style bank (bank/): well over a hundred kinds of questions, games and riddles.
   The whole year is built in one go, in path order, so it can promise two things:
   · no question is ever asked twice, anywhere in the year (each one has a key, and a key is used once);
   · styles rotate — a lesson never repeats a style if it can help it, and across the year
     the style that waited longest goes first, so the same kind of question doesn't keep coming back. */

import type { PathNode, Skill, Spec } from './course'
import type { ArcadeStep, ExplainStep, FactStep, Lesson, MemoryStep, Part, PuzzleStep, Step, TraceStep } from './lessonTypes'
import { isQuestion } from './lessonTypes'
import { alike, ANALOGIES, COLORS, FACTS, FEELINGS, LETTER_NAME, LETTERS, RHYMES, SEASONS, SHAPES, WORDS_BY_LETTER, type Fact } from './kdata'
import { STYLES, type Style, type Topic } from './bank'
import { he, int, mix, one, picTile, rng, signature, some, type R } from './bank/util'
import { kitMemory, kitStyles } from './bank/stylesKit'
import { art, KITS, type Kit, type WorldId } from '../worlds/kits'
import { setKitCtx } from './bank/ctx'
import type { Stage } from './stage'

/* ───────── choosing questions ───────── */

/** Which style levels suit each question level: 0 easy · 1 regular · 2 hard · 3 thinking question. */
const LEVELS_PRE: Style['lv'][][] = [['e'], ['e', 'h'], ['h'], ['t']]
/** From kindergarten on, even the first question of a lesson makes the child think. */
const LEVELS_SCHOOL: Style['lv'][][] = [['e', 'h'], ['h'], ['h', 't'], ['t']]
let LEVELS = LEVELS_PRE
const byTopic = new Map<Topic, Style[]>()
for (const st of STYLES) for (const t of st.skills) byTopic.set(t, [...(byTopic.get(t) ?? []), st])

type Year = { used: Set<string>; last: Map<string, number>; facts: Map<string, number>; lesson: number; relaxed: number; kit?: Kit; kitByTopic: Map<Topic, Style[]>; stage: Stage }
let YEAR: Year = { used: new Set(), last: new Map(), facts: new Map(), lesson: 0, relaxed: 0, kitByTopic: new Map(), stage: 'k' }

/** What was chosen where (for scripts/check-lessons.ts). */
export const GEN_LOG: { node: string; style: string; topic: Topic; pass: number }[] = []
let NODE = ''

type Slot = { topic: Topic; level: number; spec: Spec }
type Ctx = { r: R; specs: Spec[]; inLesson: Map<string, number>; inPart: Set<string> }

/** Tries a style a few times for a question nobody has seen yet. */
function attempt(st: Style, sp: Spec, r: R, allowSeen = false): Step | null {
  for (let i = 0; i < 40; i++) {
    const made = st.make(sp, r)
    if (!made) return null
    const [key, step] = made
    const sig = signature(step)
    if (allowSeen || (!YEAR.used.has(key) && !YEAR.used.has(sig))) { YEAR.used.add(key); YEAR.used.add(sig); return step }
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
}
/** Skills whose `set` isn't a set of letters (vowels, grammar kinds, skip steps): never hand it to a letter style. */
const OWN_SET: Skill[] = ['nikud', 'grammar', 'skip']
const SCHOOL: Skill[] = ['plus', 'minus', 'times', 'divide', 'bignum', 'skip', 'wordprob', 'nikud', 'finals', 'words', 'sentence', 'grammar', 'reading']
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
  const passes: Style[][] = [
    kitPool([slot.topic]).filter(atLevel),
    kitPool(kin).filter(atLevel),
    pool([slot.topic]).filter((st) => fresh(st) && levels.includes(st.lv)),
    kitPool([slot.topic]),
    pool([slot.topic]).filter((st) => fresh(st) && levels.includes(st.lv)),
    pool([slot.topic]).filter(fresh),
    slot.topic === 'riddle' ? [] : pool(lessonTopics).filter(fresh),
    pool(kin).filter(fresh),
    pool(['riddle']).filter(fresh),
    pool([slot.topic]).filter((st) => !c.inPart.has(st.id) && (c.inLesson.get(st.id) ?? 0) < 2),
    pool([slot.topic, ...lessonTopics, ...kin]).filter((st) => !c.inPart.has(st.id)),
  ]
  for (const [pass, all] of passes.entries()) {
    const candidates = pass < passes.length - 1 ? all.filter(grownUp) : all
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
  reading: { body: ['היום קוראים סיפור קצר.', 'קוראים לאט, ואז עונים על שאלה. אפשר לחזור ולקרוא שוב!'], scene: '📖🔍' },
}

/* ───────── "how do we calculate?" — taught before the first exercise of every lesson that calculates ───────── */
const CALC: Skill[] = ['plus', 'minus', 'add', 'sub', 'times', 'divide', 'wordprob']
function howTo(sp: Spec, short: boolean): ExplainStep | null {
  const max = sp.max ?? 10, hard = !!sp.hard
  const s = sp.s
  const page = (title: string, body: string[], math: string[]): ExplainStep => ({ kind: 'explain', title: he(title), body: (short ? body.slice(0, 1) : body).map(he), math })
  if (s === 'plus' || s === 'add' || (s === 'wordprob' && !short)) {
    if (max <= 10) return page('איך מחברים?', ['מתחילים מהמספר הגדול, ושומרים אותו בראש.', 'סופרים קדימה את המספר הקטן על האצבעות.', '5 + 3: אומרים "5", וסופרים 6, 7, 8. יצא 8!'], ['5 + 3 = ?', '5 … 6, 7, 8', '5 + 3 = 8'])
    if (max <= 20) return page('איך מחברים עד 20?', ['משלימים קודם ל־10. ל־8 חסרים 2 כדי להגיע ל־10.', 'את ה־2 לוקחים מה־5, ונשארו ממנו 3.', '10 ועוד 3 זה 13. קל לחבר ל־10!'], ['8 + 5 = ?', '8 + 2 = 10', '10 + 3 = 13', '8 + 5 = 13'])
    if (max <= 100) return hard
      ? page('איך מחברים עם המרה?', ['מחברים עשרות עם עשרות: 40 + 30 = 70.', 'מחברים אחדות עם אחדות: 7 + 6 = 13.', '13 אחדות הן עוד עשר ו־3. ביחד: 70 + 13 = 83.'], ['47 + 36 = ?', '40 + 30 = 70', '7 + 6 = 13', '70 + 13 = 83'])
      : page('איך מחברים מספרים גדולים?', ['מחברים עשרות עם עשרות: 30 + 20 = 50.', 'מחברים אחדות עם אחדות: 4 + 5 = 9.', 'ביחד: 50 + 9 = 59.'], ['34 + 25 = ?', '30 + 20 = 50', '4 + 5 = 9', '50 + 9 = 59'])
    return page('איך מחברים מאות?', ['מאות עם מאות: 300 + 200 = 500.', 'עשרות עם עשרות: 40 + 50 = 90. אחדות עם אחדות: 6 + 7 = 13.', 'ביחד: 500 + 90 + 13 = 603.'], ['346 + 257 = ?', '300 + 200 = 500', '40 + 50 = 90', '6 + 7 = 13', '500 + 90 + 13 = 603'])
  }
  if (s === 'minus' || s === 'sub') {
    if (max <= 10) return page('איך מחסרים?', ['מתחילים מהמספר הראשון, ושומרים אותו בראש.', 'סופרים אחורה כמה שמורידים.', '7 − 3: אומרים "7", וסופרים אחורה 6, 5, 4. נשארו 4!', 'בודקים: 4 + 3 = 7. צדקנו!'], ['7 − 3 = ?', '7 … 6, 5, 4', '7 − 3 = 4'])
    if (max <= 20) return page('איך מחסרים עד 20?', ['יורדים קודם ל־10: מ־13 מורידים 3, ומגיעים ל־10.', 'היינו צריכים להוריד 5. הורדנו 3, נשאר להוריד עוד 2.', '10 פחות 2 זה 8!'], ['13 − 5 = ?', '13 − 3 = 10', '10 − 2 = 8', '13 − 5 = 8'])
    if (max <= 100) return page('איך מחסרים מספרים גדולים?', ['מורידים קודם את העשרות: 63 − 20 = 43.', 'אחר כך מורידים את האחדות: 43 − 7 = 36.', 'בודקים בחיבור: 36 + 27 = 63.'], ['63 − 27 = ?', '63 − 20 = 43', '43 − 7 = 36', '63 − 27 = 36'])
    return page('איך מחסרים מאות?', ['מורידים קודם את המאות: 582 − 200 = 382.', 'אחר כך את העשרות ואת האחדות: 382 − 46 = 336.', 'בודקים בחיבור: 336 + 246 = 582.'], ['582 − 246 = ?', '582 − 200 = 382', '382 − 40 = 342', '342 − 6 = 336'])
  }
  if (s === 'times') return page('איך כופלים?', ['3 × 4 זה שלוש קבוצות, ובכל קבוצה 4.', 'סופרים בקפיצות של 4: 4, 8, 12.', 'אפשר גם להחליף: 4 × 3 = 3 × 4 = 12.'], ['3 × 4 = ?', '4 + 4 + 4', '4, 8, 12', '3 × 4 = 12'])
  if (s === 'divide') return page('איך מחלקים?', ['12 : 3 שואל: אם מחלקים 12 לשלושה, כמה כל אחד מקבל?', 'חושבים בכפל: 3 כפול כמה זה 12?', '3 × 4 = 12, אז 12 : 3 = 4.'], ['12 : 3 = ?', '3 × ? = 12', '3 × 4 = 12', '12 : 3 = 4'])
  if (s === 'wordprob') return page('איך פותרים שאלה סיפורית?', ['קיבלו עוד? מחברים. נתנו, אכלו או הלכו? מחסרים.'], ['+ עוד', '− נשאר'])
  return null
}

/* ───────── games inside the lessons ─────────
   Every lesson's middle part ends with a game built from that lesson's own material: a jigsaw puzzle of a
   letter (or number) picture, or a memory game. They grow with the year: 6 → 9 → 12 pieces, 3 → 4 → 5 pairs. */
const LETTER_SKILLS: Skill[] = ['letters', 'lettersound', 'build', 'read', 'firstsound', 'nikud', 'finals', 'words', 'sentence', 'grammar', 'reading']
const NUMBER_SKILLS: Skill[] = ['count', 'numrec', 'moreless', 'numorder', 'add', 'sub', 'plus', 'minus', 'times', 'divide', 'bignum', 'skip', 'wordprob']

function family(specs: Spec[]): { kind: 'letters'; set: string } | { kind: 'numbers'; max: number } | { kind: 'other'; spec: Spec } {
  const lettersSet = specs.filter((x) => LETTER_SKILLS.includes(x.s) || (x.s === 'trace' && !/\d/.test(x.set ?? ''))).map((x) => (x.s === 'letters' || x.s === 'lettersound' || x.s === 'trace' ? x.set ?? LETTERS : LETTERS)).join('')
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
  const pool = f.kind === 'letters' ? [...f.set].filter((l) => WORDS_BY_LETTER[l]) : [...LETTERS]
  const l = one(r, pool), w = one(r, WORDS_BY_LETTER[l])
  return { kind: 'puzzle', title: he(`פאזל: האות ${l}`), g: l, word: w.w, e: w.e, cols, rows }
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
  YEAR = { used: new Set(), last: new Map(), facts: new Map(), lesson: 0, relaxed: 0, kit, kitByTopic, stage }
  const out: Record<string, Lesson> = {}
  GEN_LOG.length = 0
  for (const n of nodes) { NODE = n.id; out[n.id] = buildLesson(n); YEAR.lesson++ }
  if (YEAR.relaxed && import.meta.env?.DEV) console.warn(`[gen] ${YEAR.relaxed} questions had to repeat`)
  return out
}

function buildLesson(node: PathNode): Lesson {
  const r = rng(node.id)
  const specs = node.specs.length ? node.specs : [{ s: 'count' as Skill }]
  const isMix = node.kind !== 'lesson'
  let turn = int(r, 0, specs.length - 1)
  const usedFacts = new Set<string>()
  const traced = new Set<string>()
  const ctx: Ctx = { r, specs, inLesson: new Map(), inPart: new Set() }

  const parts: Part[] = PART_STEPS.map((count, d) => {
    const steps: Step[] = []
    if (d === 0) {
      steps.push(intro(node, specs[0], isMix))
      // before any calculating: how to do it (a full page in a lesson, a one-line reminder in a check or review)
      const seen = new Set<string>()
      for (const sp of specs) {
        if (!CALC.includes(sp.s)) continue
        const how = howTo(sp, isMix)
        if (how && !seen.has(how.title.he)) { seen.add(how.title.he); if (how.title.he === node.title.he) how.title = he('ככה מחשבים'); steps.push(how) }
      }
    }
    // parts 2 and 3 open with a "did you know?" — a breather, and something to wonder about
    else steps.push(d === 1 && YEAR.kit ? kitFact(YEAR.kit, r) : factFor(specs, usedFacts, r))
    ctx.inPart = new Set()
    for (let i = 0; i < count; i++) {
      const sp = specs[turn++ % specs.length]
      const riddle = RIDDLE_AT.some(([pd, pi]) => pd === d && pi === i)
      if (sp.s === 'trace' && !riddle) { steps.push(trace(sp, r, traced)); continue }
      steps.push(ask({ topic: riddle ? 'riddle' : sp.s, level: CURVE[d][i] ?? 2, spec: sp }, ctx))
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
  const topical = specs.flatMap((s) => FACTS[s.s] ?? []).filter((f) => !used.has(f.t))
  const general = FACTS.general.filter((x) => !used.has(x.t))
  const pool = topical.length && Math.min(...topical.map(seen)) <= Math.min(...general.map(seen)) ? topical : general
  const f = one(r, freshest(pool))
  used.add(f.t)
  YEAR.facts.set(f.t, seen(f) + 1)
  return { kind: 'fact', e: f.e, text: he(f.t) }
}

function intro(node: PathNode, sp: Spec, isMix: boolean): ExplainStep {
  if (isMix) {
    const what = node.kind === 'test' ? 'אתגר סוף הפרק! כל מה שלמדנו, בבת אחת.' : node.kind === 'checkpoint' ? 'מבדק קטן: נראה כמה כבר יודעים.' : 'חזרה: מתרגלים שוב את מה שלמדנו.'
    return { kind: 'explain', title: node.title, body: [he(what), he('לא ממהרים. חושבים, ואז בוחרים.')], scene: node.kind === 'test' ? '🏆⭐🚀' : '🔁✨' }
  }
  const it = INTRO[sp.s] ?? { body: ['בוא נלמד משהו חדש!'], scene: '✨' }
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
  const m = Math.min(...kit.facts.map((f) => seen(f.t)))
  const f = one(r, kit.facts.filter((x) => seen(x.t) === m))
  YEAR.facts.set(f.t, seen(f.t) + 1)
  return { kind: 'fact', e: f.e, text: he(f.t) }
}

