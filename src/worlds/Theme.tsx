/* The world around every screen: its doodles in the background, the world picker, and its cheers. */

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { ARTS, Emo } from './Art'
import { currentWorld, setCurrentWorld } from './current'
import { currentStage, setCurrentStage, STAGES, type Stage } from '../curriculum/stage'
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

/** A drawing as a thin line doodle: every fill dropped, every outline black. */
const lineArt = (m: string) => m.replace(/fill="(?!none)[^"]*"/g, 'fill="none"').replace(/stroke="[^"]*"/g, 'stroke="#000"').replace(/opacity="[^"]*"/g, '')

/** The world's own drawings doodled behind every screen, as thin lines in the world's tint.
    Laid out over the whole screen at once (not a repeating tile): a jittered, staggered grid of small cells,
    each with a different drawing at its own size and angle, and never the same drawing as its neighbours,
    so the eye never finds a repeat. Every cell is filled and the jitter is small, so there are no bare patches. */
function doodleSheet(w: WorldId, W: number, H: number): string {
  const r = seeded(`${w}:${Math.round(W / 200)}:${Math.round(H / 200)}`)
  const kit = KITS[w]
  const keys = [...kit.things.map((t) => t.k), ...kit.chars.map((c) => c.k), 'badge'].filter((k) => ARTS[w][k])
  const defs = keys.map((k, i) => `<symbol id="d${i}" viewBox="0 0 100 100"><g fill="none" stroke="#000" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${lineArt(ARTS[w][k])}</g></symbol>`).join('')
  const cell = 68
  const cols = Math.ceil(W / cell) + 1, rows = Math.ceil(H / cell) + 1
  const grid: number[][] = []
  let bag: number[] = []
  const draw = () => { if (!bag.length) bag = keys.map((_, i) => i).sort(() => r() - 0.5); return bag.pop()! }
  const uses: string[] = []
  for (let row = 0; row < rows; row++) {
    grid[row] = []
    for (let col = 0; col < cols; col++) {
      // never the same drawing as the cell to the left, above, or diagonally above
      const near = [grid[row][col - 1], grid[row - 1]?.[col], grid[row - 1]?.[col - 1], grid[row - 1]?.[col + 1]]
      let k = draw(), guard = 0
      while (near.includes(k) && guard++ < 6) { bag.unshift(k); k = draw() }
      grid[row][col] = k
      const size = 30 + r() * 20
      const x = (col + (row % 2 ? 0.5 : 0) + 0.32 + r() * 0.36) * cell - cell / 2
      const y = (row + 0.32 + r() * 0.36) * cell - cell / 2
      const rot = Math.round((r() - 0.5) * 70)
      const flip = r() < 0.5 ? -1 : 1
      uses.push(`<use href="#d${k}" width="${size.toFixed(0)}" height="${size.toFixed(0)}" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot}) scale(${flip} 1) translate(${(-size / 2).toFixed(0)} ${(-size / 2).toFixed(0)})"/>`)
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${uses.join('')}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function useScreen() {
  const get = () => (typeof window === 'undefined' ? { W: 1280, H: 800 } : { W: Math.ceil(window.innerWidth / 200) * 200, H: Math.ceil(window.innerHeight / 200) * 200 })
  const [s, set] = useState(get)
  useEffect(() => {
    let t = 0
    const on = () => { window.clearTimeout(t); t = window.setTimeout(() => set((o) => { const n = get(); return n.W === o.W && n.H === o.H ? o : n }), 250) }
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('resize', on); window.clearTimeout(t) }
  }, [])
  return s
}

export function WorldBackdrop({ world: w }: { world?: WorldId }) {
  const { W, H } = useScreen()
  const url = useMemo(() => (w ? doodleSheet(w, W, H) : null), [w, W, H])
  if (!url) return null
  return <div aria-hidden="true" className="world-doodles" style={{ WebkitMaskImage: `url("${url}")`, maskImage: `url("${url}")`, WebkitMaskSize: `${W}px ${H}px`, maskSize: `${W}px ${H}px` }} />
}

export const worldKit = () => { const w = currentWorld(); return w ? KITS[w] : undefined }

/** A cheer from the child's world for a right answer (or null when no world is chosen). */
export function worldCheer(seed: number): { text: string; e: string } | null {
  const k = worldKit()
  if (!k) return null
  return { text: k.cheer[seed % k.cheer.length], e: art(k.id, k.chars[(seed * 3) % k.chars.length].k) }
}

const STAGE_NAME: Record<Stage, string> = { pre: 'גן טרום חובה', k: 'גן חובה', g1: 'כיתה א׳', g2: 'כיתה ב׳' }

/** The world badge in the top bar: tap it to move to another world or another grade. */
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
  const stage = currentStage()
  const chooseStage = (s: Stage) => {
    sfx.pick()
    setCurrentStage(s)
    save({ ...profile, age: s })
    setOpen(false)
  }
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label={`העולם שלי: ${w ? KITS[w].title : 'בחירת עולם'}`} title="העולם שלי"
        className="hud-round" style={{ background: 'var(--brand-soft)' }}>
        {w ? <Emo e={art(w, 'badge')} size={22} /> : <Emo e="🌍" size={22} />}
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
          <h3 className="t-h3 mt-5 mb-0">באיזו כיתה?</h3>
          <p className="t-small ink-2 mt-1 mb-0">כל שלב הוא שנה שלמה, וכל שלב קשה יותר מהקודם.</p>
          <div role="radiogroup" className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            {STAGES.map((s) => (
              <button key={s} role="radio" aria-checked={stage === s} onClick={() => chooseStage(s)} className="p-3 rounded-xl cursor-pointer font-semibold"
                style={{ font: 'inherit', fontWeight: 600, color: 'var(--ink)', background: stage === s ? 'var(--brand-soft)' : 'var(--surface)', border: `2px solid ${stage === s ? 'var(--brand)' : 'var(--line)'}` }}>
                {STAGE_NAME[s]}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
