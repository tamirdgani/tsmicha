/* The child's world for this session: questions, pictures and the whole look follow it.
   Set from the profile by <ChosenBuddy> (main.tsx) and remembered on the device, so a lesson opened
   straight from a link is already built in the right world before the profile has loaded.
   `?world=` in the address overrides it, for previews. */

import { WORLD_IDS, type WorldId } from './kits'

const KEY = 'kfitza.world'
const valid = (w: unknown): w is WorldId => WORLD_IDS.includes(w as WorldId)
const fromUrl = (): WorldId | undefined => {
  try {
    const w = new URLSearchParams(location.search).get('world') ?? new URLSearchParams(location.hash.split('?')[1] ?? '').get('world')
    return valid(w) ? w : undefined
  } catch { return undefined }
}
let CURRENT: WorldId | undefined = (() => { try { const w = localStorage.getItem(KEY); return valid(w) ? w : undefined } catch { return undefined } })()

export const currentWorld = () => fromUrl() ?? CURRENT

function paint() {
  if (typeof document === 'undefined') return
  const shown = currentWorld()
  if (shown) document.documentElement.dataset.world = shown
  else delete document.documentElement.dataset.world
}
paint()

/** `undefined` (no profile loaded yet) keeps the remembered world; `null` forgets it (a new learner). */
export function setCurrentWorld(w: WorldId | undefined | null) {
  if (w === undefined || w === CURRENT) return
  CURRENT = w ?? undefined
  try { if (w) localStorage.setItem(KEY, w); else localStorage.removeItem(KEY) } catch { /* private mode */ }
  paint()
}
