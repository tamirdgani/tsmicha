/* The world around every screen: its doodles in the background, the world picker, and its cheers. */

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ARTS, Emo, svgUrl } from './Art'
import { currentWorld, setCurrentWorld } from './current'
import { art, KITS, WORLD_IDS, type WorldId } from './kits'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '../lib/auth'
import { useProfile } from '../lib/profile'
import { sfx } from '../lib/sfx'

/** Seeded randomness, so a world's backdrop stays put between visits. */
function seeded(seed: string) {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296 }
}

type Doodle = { x: number; y: number; size: number; rot: number; flip: boolean; op: number; url: string }

/** The world's own drawings scattered behind every screen as faint silhouettes, in the world's tint:
    every character and thing appears, at its own size and angle, spread evenly but never in a grid,
    and no two neighbours are the same drawing. */
function scatter(w: WorldId, wide: boolean): Doodle[] {
  const r = seeded(`${w}:${wide}`)
  const kit = KITS[w]
  const keys = [...kit.things.map((t) => t.k), ...kit.chars.map((c) => c.k), 'badge']
  // a fresh shuffle each time the list runs out, so shapes come round as rarely as possible
  let bag: string[] = []
  const next = () => { if (!bag.length) bag = [...keys].sort(() => r() - 0.5); return bag.pop()! }
  const cols = wide ? 7 : 4, rows = wide ? 5 : 7
  const out: Doodle[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (r() < 0.18) continue // a few gaps, so the eye never finds rows
      const cw = 100 / cols, ch = 100 / rows
      // stagger every other row by half a cell, then jitter inside the cell
      const x = (col + (row % 2 ? 0.5 : 0) + 0.15 + r() * 0.7) * cw
      const y = (row + 0.15 + r() * 0.7) * ch
      const big = r() < 0.22
      out.push({ x: x % 100, y, size: big ? 90 + r() * 40 : 40 + r() * 38, rot: (r() - 0.5) * 50, flip: r() < 0.5, op: big ? 0.035 : 0.045 + r() * 0.025, url: svgUrl(ARTS[w][next()]) })
    }
  }
  return out
}

export function WorldBackdrop({ world: w }: { world?: WorldId }) {
  const [wide] = useState(() => typeof window === 'undefined' || window.innerWidth >= window.innerHeight)
  const doodles = useMemo(() => (w ? scatter(w, wide) : []), [w, wide])
  if (!w) return null
  return (
    <div aria-hidden="true" className="world-doodles">
      {doodles.map((d, i) => (
        <i key={i} style={{
          left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, opacity: `calc(${d.op} * var(--doodle-k, 1))`,
          transform: `translate(-50%, -50%) rotate(${d.rot}deg) scaleX(${d.flip ? -1 : 1})`,
          WebkitMaskImage: `url("${d.url}")`, maskImage: `url("${d.url}")`,
        }} />
      ))}
    </div>
  )
}

export const worldKit = () => { const w = currentWorld(); return w ? KITS[w] : undefined }

/** A cheer from the child's world for a right answer (or null when no world is chosen). */
export function worldCheer(seed: number): { text: string; e: string } | null {
  const k = worldKit()
  if (!k) return null
  return { text: k.cheer[seed % k.cheer.length], e: art(k.id, k.chars[(seed * 3) % k.chars.length].k) }
}

/** The world badge in the top bar: tap it to move to another world. */
export function WorldButton() {
  const { user } = useAuth()
  const { profile, save } = useProfile(user?.id)
  const [open, setOpen] = useState(false)
  const w = currentWorld()
  if (!profile) return null
  const choose = (id: WorldId) => {
    sfx.pick()
    setCurrentWorld(id)
    save({ ...profile, goal: id })
    setOpen(false)
  }
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label={`העולם שלי: ${w ? KITS[w].title : 'בחירת עולם'}`} title="העולם שלי"
        className="grid place-items-center w-10 h-10 rounded-full border-0 cursor-pointer p-0" style={{ background: 'var(--brand-soft)' }}>
        {w ? <Emo e={art(w, 'badge')} size={22} /> : <span style={{ fontSize: 22 }}>🌍</span>}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="t-h2">באיזה עולם נלמד?</DialogTitle>
            <DialogDescription>השאלות, הציורים והצבעים של כל המשחק יתלבשו על העולם שבוחרים.</DialogDescription>
          </DialogHeader>
          <div role="radiogroup" className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
            {WORLD_IDS.map((id, i) => (
              <motion.button key={id} role="radio" aria-checked={w === id} onClick={() => choose(id)} whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex flex-col items-center gap-1 p-3 rounded-xl cursor-pointer"
                style={{ font: 'inherit', color: 'var(--ink)', background: w === id ? 'var(--brand-soft)' : 'var(--surface)', border: `2px solid ${w === id ? 'var(--brand)' : 'var(--line)'}` }}>
                <Emo e={art(id, 'badge')} size={42} />
                <span className="font-semibold">{KITS[id].title}</span>
              </motion.button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
