/* "Me in 10 years" — the learner's future self.
   Every scenario choice in a lesson becomes a habit, and habits shape the future life card:
   savings, debt, home and peace of mind. Only scenario choices count; a wrong quiz answer never
   touches the future. Replaying a lesson and choosing differently rewrites it. */
import { FIN_LIT, allNodes, type L } from '../curriculum/course'
import { LESSONS } from '../curriculum/lessons'
import type { ScenarioStep } from '../curriculum/lessonTypes'
import type { AgeRange } from './profile'
import type { Progress } from './progress'

export type HabitId = 'creative' | 'stubborn' | 'waits' | 'impulse' | 'balance' | 'hoard' | 'shortcut' | 'money-only' | 'compare'

/** What one scenario choice writes into the future. Amounts are ₪ at age +10. */
export type FutureFx = { habit: HabitId; savings?: number; debt?: number; calm?: number }

type Habit = { good: boolean; name: L; line: L }

/* Lines are first person, past tense: in Hebrew that is the same for every gender. */
export const HABITS: Record<HabitId, Habit> = {
  creative: {
    good: true,
    name: { he: 'למצוא דרך', en: 'Finds a way' },
    line: { he: 'למדתי לחפש דרך שלישית כשמשהו נתקע. ככה מצאתי את העבודה הראשונה שלי.', en: 'I learned to look for a third way when things got stuck. That’s how I found my first job.' },
  },
  stubborn: {
    good: false,
    name: { he: 'להתעקש', en: 'Digs in' },
    line: { he: 'נתקעתי לא פעם בוויכוחים על עסקאות שלא היו שוות את זה.', en: 'More than once I got stuck arguing over deals that weren’t worth it.' },
  },
  waits: {
    good: false,
    name: { he: 'לחכות שיסתדר', en: 'Waits it out' },
    line: { he: 'חיכיתי שדברים יסתדרו לבד, ובינתיים הזדמנויות התקלקלו כמו הדגים ההם.', en: 'I waited for things to sort themselves out, and chances spoiled like those fish.' },
  },
  impulse: {
    good: false,
    name: { he: 'לקנות מהר', en: 'Buys fast' },
    line: { he: 'כסף גדול נעלם אצלי מהר. נהניתי בערב, ואחר כך לא נשאר כלום למטרות.', en: 'Big money vanished fast. I enjoyed the night, then had nothing left for goals.' },
  },
  balance: {
    good: true,
    name: { he: 'ליהנות וגם לחסוך', en: 'Enjoys and saves' },
    line: { he: 'מאז שהחלטת לשים חלק בצד, זה נהיה הרגל. ככה נחסכה המקדמה לרכב הראשון.', en: 'Since you decided to set part aside, it became a habit. That’s how the down payment on my first car got saved.' },
  },
  hoard: {
    good: false,
    name: { he: 'לשמור הכול', en: 'Keeps it all' },
    line: { he: 'חסכתי הרבה, אבל בלי מטרה. הכסף ישב, ואני לא הרגשתי שהוא באמת שלי.', en: 'I saved a lot but with no goal. The money sat there, and it never felt like mine.' },
  },
  shortcut: {
    good: false,
    name: { he: 'לבדוק מספר אחד', en: 'Checks one number' },
    line: { he: 'בחרתי עבודות לפי מספר אחד, וגיליתי בסוף החודש שהתמונה המלאה הייתה אחרת.', en: 'I picked jobs by one number, then found at month’s end the full picture was different.' },
  },
  'money-only': {
    good: false,
    name: { he: 'רק הכסף', en: 'Money first' },
    line: { he: 'הרווחתי יפה, אבל עבדתי יותר מדי ולא נשאר לי זמן לחברים.', en: 'I earned well, but worked too much and had no time left for friends.' },
  },
  compare: {
    good: true,
    name: { he: 'להשוות קודם', en: 'Compares first' },
    line: { he: 'התרגלתי להשוות לפני כל החלטה גדולה: כסף, זמן ומה לומדים. ככה הגעתי לעבודה שבאמת מתאימה לי.', en: 'I got used to comparing before every big decision: money, time, what I’d learn. That’s how I found a job that really fits me.' },
  },
}

export type Home = 'parents' | 'roommates' | 'rent' | 'own'

export type Choice = { key: string; lessonId: string; part: number; fx: FutureFx; best: boolean }

export type FutureSnapshot = {
  age: number
  savings: number
  debt: number
  calm: number        // 0–100
  home: Home
  choices: Choice[]   // in lesson order
  /** The latest choice that wasn't the best one: the letter offers a replay to change it. */
  fixable: Choice | null
}

const AGE_NOW: Record<AgeRange, number> = { pre: 15, k: 16, g1: 17, g2: 18 }
export const futureAge = (a: AgeRange | undefined) => (a ? AGE_NOW[a] : 17) + 10

const BASE_SAVINGS = 12000
const BASE_CALM = 50

/** Key of a scenario step: lesson.part.step */
export const choiceKey = (lessonId: string, part: number, step: number) => `${lessonId}.${part}.${step}`

function scenarioAt(key: string): { lessonId: string; part: number; step: ScenarioStep } | null {
  const [lessonId, p, s] = key.split('.')
  const step = LESSONS[lessonId]?.parts[Number(p)]?.steps[Number(s)]
  return step && step.kind === 'scenario' ? { lessonId, part: Number(p), step } : null
}

export function futureOf(p: Progress, age: AgeRange | undefined): FutureSnapshot {
  const order = new Map(allNodes(FIN_LIT).map((n, i) => [n.id, i]))
  const choices: Choice[] = []
  for (const [key, idx] of Object.entries(p.choices ?? {})) {
    const at = scenarioAt(key)
    const c = at?.step.choices[idx]
    if (!at || !c?.future) continue
    choices.push({ key, lessonId: at.lessonId, part: at.part, fx: c.future, best: !!c.best })
  }
  choices.sort((a, b) => (order.get(a.lessonId)! - order.get(b.lessonId)!) || a.key.localeCompare(b.key, 'en', { numeric: true }))

  const savings = Math.max(0, BASE_SAVINGS + choices.reduce((s, c) => s + (c.fx.savings ?? 0), 0))
  const debt = Math.max(0, choices.reduce((s, c) => s + (c.fx.debt ?? 0), 0))
  const calm = Math.max(5, Math.min(100, BASE_CALM + choices.reduce((s, c) => s + (c.fx.calm ?? 0), 0)))
  const net = savings - debt
  const home: Home = net < 8000 ? 'parents' : net < 20000 ? 'roommates' : net < 40000 ? 'rent' : 'own'
  const fixable = [...choices].reverse().find((c) => !c.best) ?? null
  return { age: futureAge(age), savings, debt, calm, home, choices, fixable }
}

/* ───────── Letters ───────── */

/** Letters arrive once: right after sign-up ("intro"), then at the end of every unit (unit id). */
export function pendingLetter(p: Progress): string | null {
  const seen = new Set(p.letters ?? [])
  if (!seen.has('intro')) return 'intro'
  const done = new Set(p.done)
  for (const u of FIN_LIT.units) if (u.nodes.every((n) => done.has(n.id)) && !seen.has(u.id)) return u.id
  return null
}

/** The letter shown from the map: the latest one the learner has earned. */
export function latestLetter(p: Progress): string {
  const done = new Set(p.done)
  const units = FIN_LIT.units.filter((u) => u.nodes.every((n) => done.has(n.id)))
  return units.at(-1)?.id ?? 'intro'
}

export function lessonTitle(lessonId: string): L | null {
  return allNodes(FIN_LIT).find((n) => n.id === lessonId)?.title ?? null
}
