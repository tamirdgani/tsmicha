import { useEffect, useState } from 'react'

/** A few patches of graph-paper (מחברת משבצות) behind every screen, barely visible.
 *  Each patch fades in somewhere, stays a while, fades out, and comes back somewhere else,
 *  so the page never has a full grid — just a hint of a school notebook drifting around. */

type Patch = { id: number; x: number; y: number; size: number; delay: number }

const CELL = 22         // one notebook square, in px
const LIFE = 11         // seconds a patch lives: fade in, stay, fade out
const COUNT = 4

let nextId = 0
const place = (i: number, first: boolean): Patch => ({
  id: nextId++,
  // spread the patches across the screen, one roughly per quadrant, so they don't pile up
  x: (i % 2) * 50 + Math.random() * 40,
  y: Math.floor(i / 2) * 50 + Math.random() * 40,
  size: 220 + Math.random() * 220,
  delay: first ? i * (LIFE / COUNT) : Math.random() * 2,
})

export function PaperGrid() {
  const [patches, setPatches] = useState<Patch[]>(() => Array.from({ length: COUNT }, (_, i) => place(i, true)))
  const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(() => { if (still) setPatches((p) => p.map((x) => ({ ...x, delay: 0 }))) }, [still])

  const respawn = (i: number) => setPatches((p) => p.map((x, k) => (k === i ? place(i, false) : x)))

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      {patches.map((p, i) => (
        <div key={p.id}
          onAnimationEnd={() => respawn(i)}
          style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
            transform: 'translate(-50%, -50%)',
            backgroundImage: 'linear-gradient(var(--paper-line) 1px, transparent 1px), linear-gradient(90deg, var(--paper-line) 1px, transparent 1px)',
            backgroundSize: `${CELL}px ${CELL}px`,
            // soft round edges: the patch melts into the page instead of ending in a box
            maskImage: 'radial-gradient(closest-side, #000 35%, transparent)',
            WebkitMaskImage: 'radial-gradient(closest-side, #000 35%, transparent)',
            opacity: still ? 0.7 : 0,
            animation: still ? undefined : `paper-patch ${LIFE}s ease-in-out ${p.delay}s 1 both`,
          }} />
      ))}
    </div>
  )
}
