/* The child's stage this year (from onboarding): pre-K, kindergarten, first or second grade.
   Each stage has its own year of lessons, harder and harder (course.ts). Remembered on the device like the
   world, so a lesson opened from a link is built at the right level before the profile loads. `?stage=` overrides it. */

export type Stage = 'pre' | 'k' | 'g1' | 'g2'
export const STAGES: Stage[] = ['pre', 'k', 'g1', 'g2']
const KEY = 'kfitza.stage'
const valid = (s: unknown): s is Stage => STAGES.includes(s as Stage)
const fromUrl = (): Stage | undefined => {
  try {
    const s = new URLSearchParams(location.search).get('stage') ?? new URLSearchParams(location.hash.split('?')[1] ?? '').get('stage')
    return valid(s) ? s : undefined
  } catch { return undefined }
}
let CURRENT: Stage | undefined = (() => { try { const s = localStorage.getItem(KEY); return valid(s) ? s : undefined } catch { return undefined } })()
const listeners = new Set<() => void>()

/** Kindergarten until the profile says otherwise. */
export const currentStage = (): Stage => fromUrl() ?? CURRENT ?? 'k'

/** `undefined` keeps the remembered stage; `null` forgets it (a new learner). */
export function setCurrentStage(s: Stage | undefined | null) {
  if (s === undefined || s === CURRENT) return
  CURRENT = s ?? undefined
  try { if (s) localStorage.setItem(KEY, s); else localStorage.removeItem(KEY) } catch { /* private mode */ }
  listeners.forEach((f) => f())
}
export const onStageChange = (f: () => void) => { listeners.add(f); return () => { listeners.delete(f) } }
