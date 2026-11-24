import type { L } from './course'
import type { FutureFx } from '../lib/future'

export type Visual = 'barter' | 'commodity' | 'jobs' | 'shekel' | 'trust' | 'sources' | 'work' | 'stand' | 'needwant' | 'sale' | 'clockcoin' | 'fork' | 'week'

/** `scene`: a big row of emoji that sets the scene for a pre-reader (the parent reads the text aloud). */
export type ExplainStep = { kind: 'explain'; title: L; body: L[]; visual?: Visual; scene?: string }
/** `challenge`: the harder question that closes a part, worth bonus XP when right on the first try. */
export type McqStep = { kind: 'mcq'; q: L; options: L[]; correct: number; why: L; challenge?: boolean }
/** Guess before the explanation. Never graded or retried: it's there to make you commit to an idea first. */
export type PredictStep = { kind: 'predict'; q: L; options: L[]; correct: number; why: L }
export type SortStep = { kind: 'sort'; prompt: L; buckets: L[]; items: { text: L; bucket: number }[]; why: L; challenge?: boolean }
export type CalcStep = { kind: 'calc'; calc: 'save-weeks' | 'earn-hours'; title: L; body: L; takeaway: L }
export type ScenarioStep = { kind: 'scenario'; story: L; choices: { text: L; outcome: L; best?: boolean; future?: FutureFx }[] }

/** Fill a basket within a budget. Not graded: picking reveals each item's tag, and Sprout comments on the mix. */
export type BasketStep = { kind: 'basket'; title: L; body: L; budget: number; items: { text: L; price: number; kind: 'need' | 'want' | 'save' }[] }

/** Split the 168 hours of a week. Not graded: the note reacts to sleep, free time and what work earns at `rate`. */
export type WeekStep = { kind: 'week'; title: L; body: L; rate: number; rows: { key: string; label: L; hours: number; color: string }[] }

/* ───────── Kid steps: big pictures, few words, tap or drag ───────── */

export type Shape = 'circle' | 'square' | 'triangle' | 'rect' | 'star' | 'heart'
/** One answer card. Any mix of: an emoji, a big glyph (letter or digit), a drawn shape, a pile of emoji, a caption. */
export type Tile = { e?: string; g?: string; shape?: Shape; color?: string; scale?: number; many?: { e: string; n: number }; t?: string }
/** What the child looks at above the answers. */
export type Show =
  | { kind: 'pile'; e: string; n: number }
  | { kind: 'row'; items: Tile[]; ask?: boolean }
  | { kind: 'tile'; tile: Tile }
  | { kind: 'scene'; a: string; b: string; rel: 'above' | 'below' | 'inside' | 'next' }
  | { kind: 'sum'; e: string; a: number; b: number; op: '+' | '-' }
  | { kind: 'word'; e?: string; w: string; hide?: number }

export type PickStep = { kind: 'pick'; q: L; show?: Show; options: Tile[]; correct: number; why: L; challenge?: boolean }
export type OrderStep = { kind: 'order'; q: L; items: Tile[]; why: L; challenge?: boolean }
export type MatchStep = { kind: 'match'; q: L; pairs: [Tile, Tile][]; why: L; challenge?: boolean }
/** Trace a letter or digit with a finger. Never graded: covering the shape is enough. */
export type TraceStep = { kind: 'trace'; q: L; g: string }
export type BuildStep = { kind: 'build'; q: L; e: string; w: string; extra: string[]; why: L; challenge?: boolean }

export type Step = ExplainStep | McqStep | PredictStep | SortStep | CalcStep | ScenarioStep | BasketStep | WeekStep
  | PickStep | OrderStep | MatchStep | TraceStep | BuildStep
/** `teaser`: a question from the next part, shown when this part ends. */
export type Part = { title: L; steps: Step[]; teaser?: L }
/** `teaser`: a question from the next lesson, shown when the last part ends. */
export type Lesson = { id: string; parts: Part[]; teaser?: L }

/** Steps the learner can get wrong — these come back at the end of the part. */
export type Question = McqStep | SortStep | PickStep | OrderStep | MatchStep | BuildStep
export const isQuestion = (s: Step): s is Question => ['mcq', 'sort', 'pick', 'order', 'match', 'build'].includes(s.kind)
/** Steps with a Check button: graded questions plus guesses. */
export const needsCheck = (s: Step) => isQuestion(s) || s.kind === 'predict'
export const isChallenge = (s: Step) => isQuestion(s) && !!s.challenge
