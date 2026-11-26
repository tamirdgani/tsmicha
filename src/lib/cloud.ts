/* Saves the child's profile and progress to the cloud (Supabase, table `learners`, one row per Google account),
   so the same path, stars and streak show up on every device the parent signs in on.
   The browser keeps a local copy and stays the fast path: every save writes locally first, then syncs a moment
   later. Signing in pulls the cloud copy and merges it with what's on the device, so nothing learned is lost
   when two devices were used (finished lessons are joined, XP takes the higher, the newer day wins for streaks). */

import type { Progress } from './progress'
import { supabase } from './supabase'

const PROFILE = (uid: string) => `kfitza.profile.${uid}`
const PROGRESS = (uid: string) => `kfitza.progress.${uid}`
/** Progress brought from the demo (on this device, or by a "move my progress" link), waiting for the first sign-in. */
const CARRIED = 'kfitza.carried'

const read = <T,>(k: string): T | null => { try { const r = localStorage.getItem(k); return r ? (JSON.parse(r) as T) : null } catch { return null } }
const write = (k: string, v: unknown) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)) } catch { /* private mode */ } }

const union = (a: string[] = [], b: string[] = []) => [...a, ...b.filter((x) => !a.includes(x))]
/** Two copies of the same child's progress (two devices) joined so nothing is lost. */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const parts = { ...(a.parts ?? {}) }
  for (const [k, n] of Object.entries(b.parts ?? {})) parts[k] = Math.max(parts[k] ?? 0, n)
  const later = (a.lastDay ?? '') >= (b.lastDay ?? '') ? a : b
  return {
    ...later,
    done: union(a.done, b.done),
    parts,
    xp: Math.max(a.xp ?? 0, b.xp ?? 0),
    badges: union(a.badges, b.badges),
    letters: union(a.letters, b.letters),
    choices: { ...(a.choices ?? {}), ...(b.choices ?? {}) },
    locks: { ...(a.locks ?? {}), ...(b.locks ?? {}) },
  }
}

type Row = { profile: unknown; progress: Progress | null }
type Carried = { profile: unknown; progress: Progress | null }

/** Keeps progress made in the demo (no sign-in) so the first real sign-in can take it along. */
export function carryDemo() {
  const profile = read(PROFILE('demo')), progress = read<Progress>(PROGRESS('demo'))
  if (profile || progress) write(CARRIED, { profile, progress })
}
/** True while progress from the demo waits for the first sign-in. */
export const hasCarried = () => read(CARRIED) != null
/** A "move my progress" link from the demo: `#/move/<data>`. */
export function carryFromLink(data: string): boolean {
  try {
    const json = decodeURIComponent(escape(atob(data.replace(/-/g, '+').replace(/_/g, '/'))))
    const c = JSON.parse(json) as Carried
    if (!c || typeof c !== 'object') return false
    write(CARRIED, c)
    return true
  } catch { return false }
}
/** The link the demo offers, carrying this device's progress to the real app. */
export function moveLink(uid: string): string | null {
  const profile = read(PROFILE(uid)), progress = read<Progress>(PROGRESS(uid))
  if (!profile && !progress) return null
  const b64 = btoa(unescape(encodeURIComponent(JSON.stringify({ profile, progress })))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `#/move/${b64}`
}

async function fetchRow(uid: string): Promise<Row | null | 'error'> {
  if (!supabase) return 'error'
  const { data, error } = await supabase.from('learners').select('profile, progress').eq('user_id', uid).maybeSingle()
  if (error) { console.warn('[cloud] read failed', error.message); return 'error' }
  return (data as Row | null) ?? null
}
async function upsert(uid: string, profile: unknown, progress: Progress | null) {
  if (!supabase) return
  const { error } = await supabase.from('learners').upsert({ user_id: uid, profile, progress, updated_at: new Date().toISOString() })
  if (error) console.warn('[cloud] save failed', error.message)
}

/** On sign-in: cloud + this device (+ anything carried from the demo) → one copy, here and in the cloud. */
export async function pullCloud(uid: string): Promise<void> {
  if (!supabase) return
  const row = await fetchRow(uid)
  if (row === 'error') return // offline: keep working from the device, the next save syncs
  let profile = read(PROFILE(uid))
  let progress = read<Progress>(PROGRESS(uid))
  const carried = read<Carried>(CARRIED)
  if (carried) {
    profile ??= carried.profile
    progress = progress && carried.progress ? mergeProgress(progress, carried.progress) : progress ?? carried.progress
  }
  const cloudProfile = row?.profile ?? null, cloudProgress = row?.progress ?? null
  const finalProfile = cloudProfile ?? profile
  const finalProgress = cloudProgress && progress ? mergeProgress(cloudProgress, progress) : cloudProgress ?? progress
  write(PROFILE(uid), finalProfile)
  write(PROGRESS(uid), finalProgress)
  write(CARRIED, null)
  if (JSON.stringify(finalProfile) !== JSON.stringify(cloudProfile) || JSON.stringify(finalProgress) !== JSON.stringify(cloudProgress)) await upsert(uid, finalProfile, finalProgress)
}

/* Saves are batched: a lesson writes progress several times in a row, the cloud gets it once. */
let timer: ReturnType<typeof setTimeout> | undefined
let pending: string | undefined
async function flush() {
  const uid = pending
  pending = undefined
  if (timer) { clearTimeout(timer); timer = undefined }
  if (!uid) return
  const local = read<Progress>(PROGRESS(uid))
  // another device may have saved meanwhile: join with the cloud copy before writing over it
  const row = await fetchRow(uid)
  const cloud = row && row !== 'error' ? row.progress : null
  const progress = local && cloud ? mergeProgress(cloud, local) : local ?? cloud
  if (local && progress && JSON.stringify(progress) !== JSON.stringify(local)) write(PROGRESS(uid), progress)
  await upsert(uid, read(PROFILE(uid)), progress)
}
/** Call after saving locally. */
export function scheduleSync(uid: string) {
  if (!supabase || uid === 'demo') return
  pending = uid
  if (timer) clearTimeout(timer)
  timer = setTimeout(flush, 1500)
}
/** "Start over": the cloud copy is cleared right away, so another device doesn't bring the old path back. */
export async function clearCloud(uid: string) {
  if (!supabase || uid === 'demo') return
  pending = undefined
  await upsert(uid, null, null)
}
if (typeof window !== 'undefined') {
  // leaving the page or putting the tablet away: send what's waiting now
  window.addEventListener('pagehide', () => { void flush() })
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') void flush() })
}
