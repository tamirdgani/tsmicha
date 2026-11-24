/** One shared pointer tracker for every Sprout on the page: a single listener, not one per character.
 *  Mouse moves, pen and finger touches all count, so on phones Sprout follows the last touch. */
export type PointerSample = { x: number; y: number; vx: number }
type Listener = (p: PointerSample) => void

const listeners = new Set<Listener>()
let last: PointerSample | null = null
let prev = { x: 0, t: 0 }
let raf = 0
let pending: PointerSample | null = null

function onMove(e: PointerEvent) {
  const now = performance.now()
  const dt = Math.max(16, now - prev.t)
  // horizontal speed in px/ms, used to swing the leaves
  const vx = prev.t ? (e.clientX - prev.x) / dt : 0
  prev = { x: e.clientX, t: now }
  pending = { x: e.clientX, y: e.clientY, vx }
  if (!raf) raf = requestAnimationFrame(flush)
}

function flush() {
  raf = 0
  if (!pending) return
  last = pending
  pending = null
  listeners.forEach((l) => l(last!))
  // let the swing settle back to rest once the pointer stops
  if (last.vx !== 0) setTimeout(() => { if (last && !pending) { last = { ...last, vx: 0 }; listeners.forEach((l) => l(last!)) } }, 120)
}

export const pointer = {
  get last() { return last },
  subscribe(l: Listener) {
    if (!listeners.size && typeof window !== 'undefined') {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerdown', onMove, { passive: true })
    }
    listeners.add(l)
    return () => {
      listeners.delete(l)
      if (!listeners.size) {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerdown', onMove)
      }
    }
  },
}
