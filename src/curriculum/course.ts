/* The years of the path, one per stage (pre-K, kindergarten, first and second grade).
   This file holds the pre-K year; seeds.ts holds the others.
   12 chapters × (8 lessons + midpoint check + review + chapter test).
   Lessons are short (about 10 minutes, three parts) and built from exercise generators,
   so every node on the path is playable. Unit 2 (first grade) follows the same shape. */

export type L = { he: string; en: string }
export type NodeKind = 'lesson' | 'checkpoint' | 'review' | 'test'

/** What a lesson practises. Each skill has its own exercise generator (see gen.ts). */
export type Skill =
  | 'colors' | 'shapes' | 'size' | 'position' | 'odd' | 'pattern' | 'sortcat'
  | 'count' | 'numrec' | 'moreless' | 'numorder' | 'add' | 'sub' | 'trace'
  | 'syll' | 'rhyme' | 'firstsound' | 'letters' | 'lettersound' | 'build' | 'read'
  | 'story' | 'days' | 'seasons' | 'feelings' | 'social' | 'schoolbag' | 'logic'
  // school math: digits only, the child calculates
  | 'plus' | 'minus' | 'times' | 'divide' | 'bignum' | 'skip' | 'wordprob'
  // school reading
  | 'nikud' | 'finals' | 'words' | 'sentence' | 'grammar' | 'reading'

/** `max`/`min`: number range · `set`: letters or digits to work on · `hard`: harder variant. */
export type Spec = { s: Skill; max?: number; min?: number; set?: string; hard?: boolean }

export type PathNode = {
  id: string
  kind: NodeKind
  title: L
  minutes: number
  xp: number
  specs: Spec[]
}

export type Unit = {
  id: string
  n: number
  title: L
  goal: L
  nodes: PathNode[]
}

export type Course = {
  id: string
  title: L
  tagline: L
  units: Unit[]
  locked?: boolean
}

import { currentStage, type Stage } from './stage'
import { SEEDS_G1, SEEDS_G2, SEEDS_K } from './seeds'

export type LessonSeed = [string, string, Spec[]]
export type UnitSeed = { title: L; goal: L; lessons: LessonSeed[] }

const ALEF_ZAYIN = 'אבגדהוז'
const HET_LAMED = 'חטיכל'
const MEM_AYIN = 'מנסע'
const PE_TAV = 'פצקרשת'

/** Pre-K (גן טרום חובה): colors, shapes and first numbers, with letters along the way. */
const SEEDS_PRE: UnitSeed[] = [
  {
    title: { he: 'שלום, פיקו!', en: 'Hello, Piko!' },
    goal: { he: 'צבעים, צורות, גדלים ומקומות', en: 'Colors, shapes, sizes and places' },
    lessons: [
      ['הקשת של פיקו', 'Piko’s rainbow', [{ s: 'colors' }]],
      ['עיגול, ריבוע, משולש', 'Circle, square, triangle', [{ s: 'shapes' }]],
      ['גדול, קטן, הכי גדול', 'Big, small, biggest', [{ s: 'size' }]],
      ['מעל, מתחת, בפנים', 'Above, below, inside', [{ s: 'position' }]],
      ['מה לא שייך?', 'Which one doesn’t belong?', [{ s: 'odd' }, { s: 'logic' }]],
      ['מסדרים לקבוצות', 'Sorting into groups', [{ s: 'sortcat' }]],
      ['דפוסים: מה בא עכשיו?', 'Patterns: what comes next?', [{ s: 'pattern' }]],
      ['החידון הצבעוני', 'The colorful quiz', [{ s: 'colors' }, { s: 'shapes' }, { s: 'size' }, { s: 'pattern' }, { s: 'logic' }]],
    ],
  },
  {
    title: { he: 'מספרים 1–5', en: 'Numbers 1–5' },
    goal: { he: 'לספור, לזהות ולכתוב את 1 עד 5', en: 'Count, recognize and write 1 to 5' },
    lessons: [
      ['סופרים עד 3', 'Counting to 3', [{ s: 'count', max: 3 }]],
      ['סופרים עד 5', 'Counting to 5', [{ s: 'count', max: 5 }]],
      ['הספרות 1 עד 5', 'The digits 1 to 5', [{ s: 'numrec', max: 5 }]],
      ['כותבים 1, 2, 3', 'Writing 1, 2, 3', [{ s: 'trace', set: '123' }, { s: 'numrec', max: 3 }]],
      ['איפה יש יותר?', 'Where are there more?', [{ s: 'moreless', max: 5 }]],
      ['מסדרים בתור', 'Standing in line', [{ s: 'numorder', max: 5 }]],
      ['כותבים 4 ו־5', 'Writing 4 and 5', [{ s: 'trace', set: '45' }, { s: 'count', max: 5 }]],
      ['עוד אחד!', 'One more!', [{ s: 'add', max: 5 }, { s: 'count', max: 5 }]],
    ],
  },
  {
    title: { he: 'צלילים ומילים', en: 'Sounds and words' },
    goal: { he: 'לשמוע הברות, חרוזים וצליל ראשון', en: 'Hear syllables, rhymes and first sounds' },
    lessons: [
      ['מוחאים כפיים להברות', 'Clapping syllables', [{ s: 'syll' }]],
      ['מילים מתחרזות', 'Rhyming words', [{ s: 'rhyme' }]],
      ['הצליל הראשון', 'The first sound', [{ s: 'firstsound' }]],
      ['סיפור לפי הסדר', 'A story in order', [{ s: 'story' }]],
      ['עוד הברות', 'More syllables', [{ s: 'syll', hard: true }, { s: 'rhyme' }]],
      ['חרוזים מצחיקים', 'Funny rhymes', [{ s: 'rhyme' }, { s: 'firstsound' }]],
      ['צליל ראשון, תמונה ראשונה', 'First sound, first picture', [{ s: 'firstsound' }, { s: 'syll' }]],
      ['מסיבת צלילים', 'Sound party', [{ s: 'syll' }, { s: 'rhyme' }, { s: 'firstsound' }, { s: 'story' }]],
    ],
  },
  {
    title: { he: 'אותיות א–ז', en: 'Letters Alef–Zayin' },
    goal: { he: 'להכיר, לשמוע ולכתוב את א עד ז', en: 'Know, hear and write Alef to Zayin' },
    lessons: [
      ['א ו־ב', 'Alef and Bet', [{ s: 'letters', set: 'אב' }, { s: 'lettersound', set: 'אב' }]],
      ['ג ו־ד', 'Gimel and Dalet', [{ s: 'letters', set: 'אבגד' }, { s: 'lettersound', set: 'גד' }]],
      ['ה, ו, ז', 'He, Vav, Zayin', [{ s: 'letters', set: ALEF_ZAYIN }, { s: 'lettersound', set: 'הוז' }]],
      ['כותבים א, ב, ג', 'Writing Alef, Bet, Gimel', [{ s: 'trace', set: 'אבג' }, { s: 'letters', set: 'אבג' }]],
      ['כותבים ד, ה, ו, ז', 'Writing Dalet to Zayin', [{ s: 'trace', set: 'דהוז' }, { s: 'letters', set: 'דהוז' }]],
      ['מי מתחיל ב...?', 'Who starts with…?', [{ s: 'lettersound', set: ALEF_ZAYIN }]],
      ['אותיות ותמונות', 'Letters and pictures', [{ s: 'letters', set: ALEF_ZAYIN }, { s: 'lettersound', set: ALEF_ZAYIN }]],
      ['חגיגת א עד ז', 'Alef-to-Zayin party', [{ s: 'letters', set: ALEF_ZAYIN }, { s: 'lettersound', set: ALEF_ZAYIN }, { s: 'trace', set: ALEF_ZAYIN }]],
    ],
  },
  {
    title: { he: 'מספרים עד 10', en: 'Numbers to 10' },
    goal: { he: 'לספור, להשוות ולכתוב עד 10', en: 'Count, compare and write up to 10' },
    lessons: [
      ['סופרים עד 7', 'Counting to 7', [{ s: 'count', max: 7 }]],
      ['סופרים עד 10', 'Counting to 10', [{ s: 'count', max: 10 }]],
      ['הספרות 6 עד 10', 'The digits 6 to 10', [{ s: 'numrec', min: 6, max: 10 }]],
      ['כותבים 6, 7, 8', 'Writing 6, 7, 8', [{ s: 'trace', set: '678' }, { s: 'numrec', min: 6, max: 8 }]],
      ['כותבים 9 ו־0', 'Writing 9 and 0', [{ s: 'trace', set: '90' }, { s: 'count', max: 10 }]],
      ['יותר ופחות עד 10', 'More and less to 10', [{ s: 'moreless', max: 10 }]],
      ['מסדרים עד 10', 'Ordering to 10', [{ s: 'numorder', max: 10 }]],
      ['לפני ואחרי', 'Before and after', [{ s: 'numorder', max: 10, hard: true }, { s: 'count', max: 10 }]],
    ],
  },
  {
    title: { he: 'אותיות ח–ל', en: 'Letters Het–Lamed' },
    goal: { he: 'להכיר, לשמוע ולכתוב את ח עד ל', en: 'Know, hear and write Het to Lamed' },
    lessons: [
      ['ח ו־ט', 'Het and Tet', [{ s: 'letters', set: 'חט' }, { s: 'lettersound', set: 'חט' }]],
      ['י, כ, ל', 'Yod, Kaf, Lamed', [{ s: 'letters', set: HET_LAMED }, { s: 'lettersound', set: 'יכל' }]],
      ['כותבים ח, ט, י', 'Writing Het, Tet, Yod', [{ s: 'trace', set: 'חטי' }, { s: 'letters', set: 'חטי' }]],
      ['כותבים כ ו־ל', 'Writing Kaf and Lamed', [{ s: 'trace', set: 'כל' }, { s: 'letters', set: 'כל' }]],
      ['מי מתחיל ב...?', 'Who starts with…?', [{ s: 'lettersound', set: HET_LAMED }]],
      ['כל האותיות שלמדנו', 'All the letters so far', [{ s: 'letters', set: ALEF_ZAYIN + HET_LAMED }]],
      ['תמונות ואותיות', 'Pictures and letters', [{ s: 'lettersound', set: ALEF_ZAYIN + HET_LAMED }]],
      ['חגיגת ח עד ל', 'Het-to-Lamed party', [{ s: 'letters', set: HET_LAMED }, { s: 'lettersound', set: HET_LAMED }, { s: 'trace', set: HET_LAMED }]],
    ],
  },
  {
    title: { he: 'חשיבה וחידות', en: 'Thinking and puzzles' },
    goal: { he: 'דפוסים, מיון, סדר והיגיון', en: 'Patterns, sorting, order and logic' },
    lessons: [
      ['דפוסים קשים', 'Tricky patterns', [{ s: 'pattern', hard: true }]],
      ['מה לא שייך? חלק 2', 'Odd one out, part 2', [{ s: 'odd', hard: true }, { s: 'logic' }]],
      ['מהקטן לגדול', 'Smallest to biggest', [{ s: 'size', hard: true }, { s: 'logic' }]],
      ['מה קרה קודם?', 'What happened first?', [{ s: 'story' }]],
      ['מיון חכם', 'Smart sorting', [{ s: 'sortcat', hard: true }, { s: 'logic' }]],
      ['איפה הוא מסתתר?', 'Where is it hiding?', [{ s: 'position', hard: true }]],
      ['צורות מסביבנו', 'Shapes around us', [{ s: 'shapes', hard: true }]],
      ['אלופי החשיבה', 'Thinking champions', [{ s: 'pattern', hard: true }, { s: 'odd', hard: true }, { s: 'story' }, { s: 'sortcat' }, { s: 'logic' }]],
    ],
  },
  {
    title: { he: 'אותיות מ–ע', en: 'Letters Mem–Ayin' },
    goal: { he: 'להכיר, לשמוע ולכתוב את מ, נ, ס, ע', en: 'Know, hear and write Mem, Nun, Samekh, Ayin' },
    lessons: [
      ['מ ו־נ', 'Mem and Nun', [{ s: 'letters', set: 'מנ' }, { s: 'lettersound', set: 'מנ' }]],
      ['ס ו־ע', 'Samekh and Ayin', [{ s: 'letters', set: MEM_AYIN }, { s: 'lettersound', set: 'סע' }]],
      ['כותבים מ ו־נ', 'Writing Mem and Nun', [{ s: 'trace', set: 'מנ' }, { s: 'letters', set: 'מנ' }]],
      ['כותבים ס ו־ע', 'Writing Samekh and Ayin', [{ s: 'trace', set: 'סע' }, { s: 'letters', set: 'סע' }]],
      ['מי מתחיל ב...?', 'Who starts with…?', [{ s: 'lettersound', set: MEM_AYIN }]],
      ['16 אותיות!', '16 letters!', [{ s: 'letters', set: ALEF_ZAYIN + HET_LAMED + MEM_AYIN }]],
      ['צליל ראשון', 'First sound', [{ s: 'firstsound' }, { s: 'lettersound', set: HET_LAMED + MEM_AYIN }]],
      ['חגיגת מ עד ע', 'Mem-to-Ayin party', [{ s: 'letters', set: MEM_AYIN }, { s: 'lettersound', set: MEM_AYIN }, { s: 'trace', set: MEM_AYIN }]],
    ],
  },
  {
    title: { he: 'חיבור וחיסור', en: 'Adding and taking away' },
    goal: { he: 'לחבר ולהוריד עם חפצים עד 10', en: 'Add and take away with objects up to 10' },
    lessons: [
      ['מחברים עד 5', 'Adding to 5', [{ s: 'add', max: 5 }]],
      ['מורידים עד 5', 'Taking away to 5', [{ s: 'sub', max: 5 }]],
      ['מחברים עד 10', 'Adding to 10', [{ s: 'add', max: 10 }]],
      ['מורידים עד 10', 'Taking away to 10', [{ s: 'sub', max: 10 }]],
      ['סיפורי חשבון', 'Number stories', [{ s: 'add', max: 10, hard: true }, { s: 'sub', max: 10, hard: true }, { s: 'logic' }]],
      ['יותר, פחות, שווה', 'More, less, equal', [{ s: 'moreless', max: 10 }, { s: 'add', max: 6 }]],
      ['מספר לפני ומספר אחרי', 'Number before and after', [{ s: 'numorder', max: 10, hard: true }]],
      ['אלופי החשבון', 'Math champions', [{ s: 'add', max: 10 }, { s: 'sub', max: 10 }, { s: 'count', max: 10 }]],
    ],
  },
  {
    title: { he: 'אותיות פ–ת', en: 'Letters Pe–Tav' },
    goal: { he: 'להשלים את כל האלף־בית', en: 'Finish the whole alef-bet' },
    lessons: [
      ['פ ו־צ', 'Pe and Tsadi', [{ s: 'letters', set: 'פצ' }, { s: 'lettersound', set: 'פצ' }]],
      ['ק ו־ר', 'Qof and Resh', [{ s: 'letters', set: 'פצקר' }, { s: 'lettersound', set: 'קר' }]],
      ['ש ו־ת', 'Shin and Tav', [{ s: 'letters', set: PE_TAV }, { s: 'lettersound', set: 'שת' }]],
      ['כותבים פ, צ, ק', 'Writing Pe, Tsadi, Qof', [{ s: 'trace', set: 'פצק' }, { s: 'letters', set: 'פצק' }]],
      ['כותבים ר, ש, ת', 'Writing Resh, Shin, Tav', [{ s: 'trace', set: 'רשת' }, { s: 'letters', set: 'רשת' }]],
      ['מי מתחיל ב...?', 'Who starts with…?', [{ s: 'lettersound', set: PE_TAV }]],
      ['כל האלף־בית!', 'The whole alef-bet!', [{ s: 'letters', set: ALEF_ZAYIN + HET_LAMED + MEM_AYIN + PE_TAV }]],
      ['חגיגת האלף־בית', 'Alef-bet party', [{ s: 'letters', set: PE_TAV }, { s: 'lettersound', set: ALEF_ZAYIN + HET_LAMED + MEM_AYIN + PE_TAV }, { s: 'trace', set: PE_TAV }]],
    ],
  },
  {
    title: { he: 'מילים ראשונות', en: 'First words' },
    goal: { he: 'לחבר אותיות למילים קטנות', en: 'Put letters together into small words' },
    lessons: [
      ['באיזו אות זה מתחיל?', 'Which letter does it start with?', [{ s: 'lettersound', set: ALEF_ZAYIN + HET_LAMED + MEM_AYIN + PE_TAV }]],
      ['בונים מילה קטנה', 'Building a small word', [{ s: 'build', max: 2 }]],
      ['עוד מילים קטנות', 'More small words', [{ s: 'build', max: 2 }, { s: 'lettersound', set: ALEF_ZAYIN + HET_LAMED }]],
      ['בונים מילה של 3', 'Building a 3-letter word', [{ s: 'build', max: 3 }]],
      ['קוראים מילה ראשונה', 'Reading a first word', [{ s: 'read', max: 2 }]],
      ['מילה ותמונה', 'Word and picture', [{ s: 'read', max: 3 }]],
      ['בונים וקוראים', 'Build and read', [{ s: 'build', max: 3 }, { s: 'read', max: 3 }]],
      ['קורא צעיר', 'Young reader', [{ s: 'build', max: 3 }, { s: 'read', max: 3 }, { s: 'syll' }]],
    ],
  },
  {
    title: { he: 'עולים לגן חובה!', en: 'On to kindergarten!' },
    goal: { he: 'רגשות, חברים, זמן וכללים', en: 'Feelings, friends, time and rules' },
    lessons: [
      ['מה אני מרגיש?', 'How do I feel?', [{ s: 'feelings' }]],
      ['חבר טוב', 'A good friend', [{ s: 'social' }]],
      ['מה שמים בילקוט?', 'What goes in the school bag?', [{ s: 'schoolbag' }]],
      ['ימי השבוע', 'Days of the week', [{ s: 'days' }]],
      ['עונות השנה', 'The seasons', [{ s: 'seasons' }]],
      ['הבוקר שלי', 'My morning', [{ s: 'story' }, { s: 'days' }]],
      ['כללים בכיתה', 'Classroom rules', [{ s: 'social', hard: true }, { s: 'feelings' }]],
      ['מוכנים לגן חובה!', 'Ready for kindergarten!', [{ s: 'count', max: 10 }, { s: 'lettersound', set: ALEF_ZAYIN + HET_LAMED + MEM_AYIN + PE_TAV }, { s: 'add', max: 10 }, { s: 'social' }, { s: 'logic' }]],
    ],
  },
]

const KIND_MIN: Record<NodeKind, number> = { lesson: 10, checkpoint: 8, review: 8, test: 10 }
const KIND_XP: Record<NodeKind, number> = { lesson: 30, checkpoint: 40, review: 25, test: 60 }

const uniq = (specs: Spec[]) => [...new Map(specs.map((s) => [JSON.stringify(s), s])).values()]

function buildUnit(seed: UnitSeed, i: number, all: UnitSeed[]): Unit {
  const n = i + 1
  const u = `u${n}`
  const lesson = (k: number): PathNode => ({
    id: `${u}-l${k + 1}`,
    kind: 'lesson',
    title: { he: seed.lessons[k][0], en: seed.lessons[k][1] },
    minutes: KIND_MIN.lesson,
    xp: KIND_XP.lesson,
    specs: seed.lessons[k][2],
  })
  const specsOf = (from: number, to: number) => uniq(seed.lessons.slice(from, to).flatMap((l) => l[2]))
  const prev = i > 0 ? all[i - 1].lessons.slice(-1)[0][2] : []
  const node = (kind: NodeKind, title: L, specs: Spec[]): PathNode => ({ id: `${u}-${kind}`, kind, title, minutes: KIND_MIN[kind], xp: KIND_XP[kind], specs })
  return {
    id: u,
    n,
    title: seed.title,
    goal: seed.goal,
    nodes: [
      lesson(0), lesson(1), lesson(2), lesson(3),
      node('checkpoint', { he: 'מבדק קטן', en: 'Quick check' }, specsOf(0, 4)),
      lesson(4), lesson(5), lesson(6), lesson(7),
      node('review', n === 1 ? { he: 'חזרה על הפרק', en: 'Chapter review' } : { he: 'חזרה משולבת', en: 'Mixed review' }, uniq([...specsOf(0, 8), ...prev])),
      node('test', { he: 'אתגר סוף פרק', en: 'Chapter challenge' }, specsOf(0, 8)),
    ],
  }
}

const META: Record<Stage, { title: L; tagline: L; seeds: UnitSeed[] }> = {
  pre: { title: { he: 'גן טרום חובה', en: 'Pre-K' }, tagline: { he: 'צבעים, צורות, מספרים ואותיות ראשונות', en: 'Colors, shapes, numbers and first letters' }, seeds: SEEDS_PRE },
  k: { title: { he: 'גן חובה', en: 'Kindergarten' }, tagline: { he: 'כל האלף־בית, קריאה ראשונה וחשבון עד 20', en: 'The whole alef-bet, first reading and math to 20' }, seeds: SEEDS_K },
  g1: { title: { he: 'כיתה א׳', en: 'First grade' }, tagline: { he: 'קוראים עם ניקוד, מחשבים עד 100', en: 'Reading with niqqud, math to 100' }, seeds: SEEDS_G1 },
  g2: { title: { he: 'כיתה ב׳', en: 'Second grade' }, tagline: { he: 'כפל, חילוק, עד 1000 והבנת הנקרא', en: 'Times, sharing, to 1000 and reading comprehension' }, seeds: SEEDS_G2 },
}
const built = new Map<Stage, Course>()
/** The year of one stage. Its "units" are shown as chapters (פרקים). */
/** What finishing this year gets you ready for ("ready for first grade"). */
export const NEXT_STAGE_NAME: Record<Stage, L> = { pre: { he: 'גן חובה', en: 'kindergarten' }, k: { he: 'כיתה א׳', en: 'first grade' }, g1: { he: 'כיתה ב׳', en: 'second grade' }, g2: { he: 'כיתה ג׳', en: 'third grade' } }

export function courseFor(stage: Stage): Course {
  let c = built.get(stage)
  if (!c) {
    const m = META[stage]
    c = { id: stage, title: m.title, tagline: m.tagline, units: m.seeds.map((s, i) => buildUnit(s, i, m.seeds)) }
    built.set(stage, c)
  }
  return c
}
/** The year of the child's stage (onboarding: pre-K, kindergarten, first or second grade). */
export const COURSE: Course = {
  get id() { return courseFor(currentStage()).id },
  get title() { return courseFor(currentStage()).title },
  get tagline() { return courseFor(currentStage()).tagline },
  get units() { return courseFor(currentStage()).units },
}
/** Kept for screens that still use the old name. */
export const FIN_LIT = COURSE

const NEXT: Record<Stage, Stage[]> = { pre: ['k', 'g1'], k: ['g1', 'g2'], g1: ['g2'], g2: [] }
/** The years that come after this one (shown locked at the end of the path). */
export const NEXT_COURSES: Course[] = new Proxy([] as Course[], {
  get: (_t, p) => {
    const list = NEXT[currentStage()].map((s) => ({ id: s, title: META[s].title, tagline: { he: 'נפתחת אחרי השנה הזאת', en: 'Opens after this year' }, units: [], locked: true }))
    const v = Reflect.get(list, p)
    return typeof v === 'function' ? v.bind(list) : v
  },
})

export const allNodes = (c: Course) => c.units.flatMap((u) => u.nodes)
export const courseMinutes = (c: Course) => allNodes(c).reduce((s, n) => s + n.minutes, 0)
