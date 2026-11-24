import { useCallback, useEffect, useState } from 'react'

/** The child's stage this year. */
export type AgeRange = 'pre' | 'k' | 'g1' | 'g2'
/** What the child loves — used to cheer them on in their own world. */
export type Goal = 'space' | 'heroes' | 'cars' | 'animals' | 'dinos'
/** What the child can already do. */
export type Situation = 'count' | 'letters' | 'name' | 'colors' | 'none'
export type Minutes = 5 | 10 | 15 | 20

export type Profile = {
  name: string
  age: AgeRange
  goal: Goal
  situation: Situation[]
  minutes: Minutes
  createdAt: string
}

/** Daily XP goal from the time chosen: one lesson part (about 3–4 minutes) = 10 XP. */
export const goalXp = (m: Minutes) => Math.max(10, Math.round(m / 3.5) * 10)

/** Chapters worth extra attention: the things the child can't do yet get a "for you" tag. */
export function focusUnits(p: Profile): string[] {
  const knows = new Set(p.situation)
  const out: string[] = []
  if (!knows.has('colors')) out.push('u1')
  if (!knows.has('count')) out.push('u2', 'u5')
  if (!knows.has('letters')) out.push('u4')
  if (!knows.has('name')) out.push('u11')
  return out
}

const key = (uid: string) => `kfitza.profile.${uid}`

export function useProfile(uid: string | undefined) {
  // Remember which user the loaded profile belongs to, so a returning learner never flashes onboarding.
  const [state, setState] = useState<{ uid?: string; profile: Profile | null }>({ profile: null })
  useEffect(() => {
    let profile: Profile | null = null
    if (uid) try { const raw = localStorage.getItem(key(uid)); profile = raw ? JSON.parse(raw) : null } catch { /* ignore */ }
    setState({ uid, profile })
  }, [uid])
  const save = useCallback((p: Profile) => {
    if (!uid) return
    try { localStorage.setItem(key(uid), JSON.stringify(p)) } catch { /* private mode */ }
    setState({ uid, profile: p })
  }, [uid])
  return { profile: state.profile, loaded: state.uid === uid, save }
}
