import { useEffect, useState } from 'react'
import { FIN_LIT, allNodes, type PathNode } from '../curriculum/course'

export type Progress = {
  done: string[]                       // completed node ids, in order
  parts: Record<string, number>        // lesson id → parts completed (0–3)
  xp: number
  streak: number
  lastDay: string | null               // yyyy-mm-dd of the last day with learning
  todayXp: number
  dailyGoal: number
  badges: string[]
  choices: Record<string, number>      // scenario step key (lesson.part.step) → choice index
  letters: string[]                    // future letters already read: 'intro', unit ids
  locks: Record<string, PartLock>      // lesson id → part failed on a first attempt, closed until `until`
}

/** A failed part waits out a cool-down before another try. */
export type PartLock = { part: number; until: number }

export const PARTS_PER_LESSON = 3
export const PART_XP = 10
export const PERFECT_BONUS = 2
export const CHALLENGE_XP = 5
/** A part counts as passed with at least this share of questions right on the first try (guesses don't count). */
export const PASS_RATE = 0.7
/** How long a failed part stays closed. */
export const LOCK_MS = 6 * 60 * 60 * 1000
export const BADGES = ['first', 'streak7', 'unit1', 'perfect'] as const

const FRESH: Progress = { done: [], parts: {}, xp: 0, streak: 0, lastDay: null, todayXp: 0, dailyGoal: 10, badges: [], choices: {}, letters: [], locks: {} }

const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const yesterdayKey = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d) }

/** `?preview=mid` shows a learner halfway through unit 2 — handy to see every node state. */
export function isPreview() { return new URLSearchParams(window.location.search).get('preview') === 'mid' }
function previewProgress(): Progress {
  const nodes = allNodes(FIN_LIT).slice(0, 15)
  return { ...FRESH, done: nodes.map((n) => n.id), xp: nodes.reduce((s, n) => s + n.xp, 0), streak: 6, lastDay: dayKey(), todayXp: 10, dailyGoal: 20, badges: ['first', 'unit1'], letters: ['intro'], choices: { 'u1-l1.0.1': 0, 'u1-l2.0.6': 0, 'u1-l2.1.7': 2 } }
}

const key = (uid: string) => `kfitza.progress.${uid}`

export function loadProgress(uid: string): Progress {
  if (isPreview()) return previewProgress()
  let p: Progress
  try { const raw = localStorage.getItem(key(uid)); p = raw ? { ...FRESH, ...JSON.parse(raw) } : FRESH } catch { p = FRESH }
  // A new day: today's XP starts over; a missed day resets the streak.
  if (p.lastDay !== dayKey()) p = { ...p, todayXp: 0, streak: p.lastDay === yesterdayKey() ? p.streak : 0 }
  return p
}

function saveProgress(uid: string, p: Progress) {
  if (isPreview()) return
  try { localStorage.setItem(key(uid), JSON.stringify(p)) } catch { /* private mode */ }
}

export function useProgress(uid: string | undefined) {
  const [p, setP] = useState<Progress>(FRESH)
  useEffect(() => { if (uid) setP(loadProgress(uid)) }, [uid])
  return p
}

/** A scenario choice is part of the learner's future. Replaying a lesson and choosing again rewrites it. */
export function recordChoice(uid: string, key: string, choice: number) {
  const p = loadProgress(uid)
  saveProgress(uid, { ...p, choices: { ...p.choices, [key]: choice } })
}

export function markLetter(uid: string, id: string) {
  const p = loadProgress(uid)
  if (!p.letters.includes(id)) saveProgress(uid, { ...p, letters: [...p.letters, id] })
}

export type PartResult = {
  xpGained: number
  bonus: number
  challengeBonus: number
  lessonDone: boolean
  streakBefore: number
  streakAfter: number
  newBadges: string[]
  progress: Progress
}

/** The active lock on a lesson, if its cool-down hasn't run out yet. */
export function lockOf(p: Progress, lessonId: string, now = Date.now()): PartLock | null {
  const l = p.locks?.[lessonId]
  return l && l.until > now ? l : null
}

/** Records a failed first attempt at a part: no XP, and the part closes for LOCK_MS.
 *  Replaying a part that was already passed never locks anything. Returns the lock, or null. */
export function failPart(uid: string, lessonId: string, partIndex: number): PartLock | null {
  const before = loadProgress(uid)
  const firstTime = partIndex >= (before.parts[lessonId] ?? 0) && !before.done.includes(lessonId)
  if (!firstTime) return null
  const lock = { part: partIndex, until: Date.now() + LOCK_MS }
  saveProgress(uid, { ...before, locks: { ...(before.locks ?? {}), [lessonId]: lock } })
  return lock
}

/** Records a finished lesson part. XP is only granted the first time a part is completed. */
export function completePart(uid: string, lessonId: string, partIndex: number, perfect: boolean, challengeWon = false): PartResult {
  const before = loadProgress(uid)
  const doneParts = before.parts[lessonId] ?? 0
  const firstTime = partIndex >= doneParts && !before.done.includes(lessonId)
  const bonus = firstTime && perfect ? PERFECT_BONUS : 0
  const challengeBonus = firstTime && challengeWon ? CHALLENGE_XP : 0
  const xpGained = firstTime ? PART_XP + bonus + challengeBonus : 0

  const today = dayKey()
  const learnedToday = before.lastDay === today
  const streakAfter = learnedToday ? before.streak : before.lastDay === yesterdayKey() ? before.streak + 1 : 1

  const partsNow = firstTime ? Math.max(doneParts, partIndex + 1) : doneParts
  const lessonDone = firstTime && partsNow >= PARTS_PER_LESSON
  const done = lessonDone ? [...before.done, lessonId] : before.done

  const badges = new Set(before.badges)
  const newBadges: string[] = []
  const award = (b: string) => { if (!badges.has(b)) { badges.add(b); newBadges.push(b) } }
  if (lessonDone) award('first')
  if (firstTime && perfect) award('perfect')
  if (streakAfter >= 7) award('streak7')

  const progress: Progress = {
    ...before,
    done,
    parts: { ...before.parts, [lessonId]: partsNow },
    xp: before.xp + xpGained,
    todayXp: (learnedToday ? before.todayXp : 0) + xpGained,
    streak: streakAfter,
    lastDay: today,
    badges: [...badges],
    // passing clears any old lock on this lesson
    locks: Object.fromEntries(Object.entries(before.locks ?? {}).filter(([id]) => id !== lessonId)),
  }
  saveProgress(uid, progress)
  return { xpGained, bonus, challengeBonus, lessonDone, streakBefore: before.streak, streakAfter, newBadges, progress }
}

export type NodeState = 'done' | 'current' | 'locked'

export function nodeStates(p: Progress): Map<string, NodeState> {
  const m = new Map<string, NodeState>()
  const done = new Set(p.done)
  let currentSet = false
  for (const n of allNodes(FIN_LIT)) {
    if (done.has(n.id)) m.set(n.id, 'done')
    else if (!currentSet) { m.set(n.id, 'current'); currentSet = true }
    else m.set(n.id, 'locked')
  }
  return m
}

export function currentNode(p: Progress): { node: PathNode; unitIndex: number; indexInUnit: number } {
  const done = new Set(p.done)
  for (let u = 0; u < FIN_LIT.units.length; u++) {
    const nodes = FIN_LIT.units[u].nodes
    for (let i = 0; i < nodes.length; i++) if (!done.has(nodes[i].id)) return { node: nodes[i], unitIndex: u, indexInUnit: i }
  }
  const last = FIN_LIT.units.at(-1)!
  return { node: last.nodes.at(-1)!, unitIndex: FIN_LIT.units.length - 1, indexInUnit: last.nodes.length - 1 }
}

/** Level curve: each level needs a bit more XP than the last. */
export function levelOf(xp: number) {
  let level = 1, need = 100, acc = 0
  while (xp >= acc + need) { acc += need; level++; need = Math.round(need * 1.15) }
  return { level, into: xp - acc, need }
}

/** Sprout grows one stage roughly every 3 units. */
export function sproutStage(unitsDone: number): 0 | 1 | 2 | 3 | 4 {
  return Math.min(4, Math.floor(unitsDone / 3) + 1) as 0 | 1 | 2 | 3 | 4
}
