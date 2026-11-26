import type { L } from './course'
import type { FutureFx } from '../lib/future'

export type Visual = 'barter' | 'commodity' | 'jobs' | 'shekel' | 'trust' | 'sources' | 'work' | 'stand' | 'needwant' | 'sale' | 'clockcoin' | 'fork' | 'week'

/** `scene`: a big row of emoji that sets the scene for a pre-reader (the parent reads the text aloud). */
/** `math`: a worked example, one line per step ("8 + 2 = 10", "10 + 3 = 13"), shown big and left-to-right. */
export type ExplainStep = { kind: 'explain'; title: L; body: L[]; visual?: Visual; scene?: string; math?: string[] }
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
export type Tile = { e?: string; g?: string; shape?: Shape; color?: string; scale?: number; many?: { e: string; n: number }; t?: string
  /** How the picture is drawn: `sil` a black shadow · `flip` mirrored · `peek` only the top half shows · `tilt` upside down. */
  fx?: 'sil' | 'flip' | 'peek' | 'tilt' }
/** What the child looks at above the answers. */
export type Show =
  | { kind: 'pile'; e: string; n: number }
  | { kind: 'row'; items: Tile[]; ask?: boolean }
  | { kind: 'tile'; tile: Tile }
  | { kind: 'scene'; a: string; b: string; rel: 'above' | 'below' | 'inside' | 'next' }
  | { kind: 'sum'; e: string; a: number; b: number; op: '+' | '-' }
  | { kind: 'word'; e?: string; w: string; hide?: number }
  /** A is to B as C is to ? — two pairs, one above the other. */
  | { kind: 'analogy'; a: [string, string]; b: string }
  /** An exercise written out: "8 + 5 = ?" (left to right, as math is written in Hebrew too). */
  | { kind: 'expr'; text: string }
  /** Something to read: a sentence or a short story. */
  | { kind: 'text'; text: string }

export type PickStep = { kind: 'pick'; q: L; show?: Show; options: Tile[]; correct: number; why: L; challenge?: boolean }
export type OrderStep = { kind: 'order'; q: L; items: Tile[]; why: L; challenge?: boolean }
export type MatchStep = { kind: 'match'; q: L; pairs: [Tile, Tile][]; why: L; challenge?: boolean }
/** Tap every card that fits (all the red things, every word that rhymes…). Right only when exactly those are chosen. */
export type TapAllStep = { kind: 'tapall'; q: L; show?: Show; options: Tile[]; right: number[]; why: L; challenge?: boolean }
/** Trace a letter or digit with a finger. Never graded: covering the shape is enough. */
export type TraceStep = { kind: 'trace'; q: L; g: string }
export type BuildStep = { kind: 'build'; q: L; e: string; w: string; extra: string[]; why: L; challenge?: boolean }

/** A jigsaw puzzle of a picture that teaches: a big letter (or digit) with its word and picture. Not graded; solving it is the win. */
export type PuzzleStep = { kind: 'puzzle'; title: L; g: string; word?: string; e: string; n?: number; cols: number; rows: number }
/** Memory: flip two cards, find the pairs (letter ↔ picture, digit ↔ amount, rhymes…). Not graded; finishing is the win. */
export type MemoryStep = { kind: 'memory'; title: L; pairs: [Tile, Tile][] }

/** "Did you know?" — a short surprising fact for the parent to read aloud. Not graded. */
export type FactStep = { kind: 'fact'; e: string; text: L }

/** A ball game for a breather: shoot hoops, kick past the keeper, knock down pins. Not graded. */
export type ArcadeStep = { kind: 'arcade'; game: 'hoop' | 'goal' | 'bowl'; title: L; target: number }

export type Step = ExplainStep | McqStep | PredictStep | SortStep | CalcStep | ScenarioStep | BasketStep | WeekStep
  | PickStep | TapAllStep | OrderStep | MatchStep | TraceStep | BuildStep | PuzzleStep | MemoryStep | FactStep | ArcadeStep
/** `teaser`: a question from the next part, shown when this part ends. */
export type Part = { title: L; steps: Step[]; teaser?: L }
/** `teaser`: a question from the next lesson, shown when the last part ends. */
export type Lesson = { id: string; parts: Part[]; teaser?: L }

/** Steps the learner can get wrong — these come back at the end of the part. */
export type Question = McqStep | SortStep | PickStep | TapAllStep | OrderStep | MatchStep | BuildStep
export const isQuestion = (s: Step): s is Question => ['mcq', 'sort', 'pick', 'tapall', 'order', 'match', 'build'].includes(s.kind)
/** Steps with a Check button: graded questions plus guesses. */
export const needsCheck = (s: Step) => isQuestion(s) || s.kind === 'predict'
export const isChallenge = (s: Step) => isQuestion(s) && !!s.challenge
