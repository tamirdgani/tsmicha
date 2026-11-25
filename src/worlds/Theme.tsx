/* The world around every screen: its doodles in the background, the world picker, and its cheers. */

import { useState } from 'react'
import { motion } from 'motion/react'
import { ARTS, Emo, svgUrl } from './Art'
import { currentWorld, setCurrentWorld } from './current'
import { art, KITS, WORLD_IDS, type WorldId } from './kits'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '../lib/auth'
import { useProfile } from '../lib/profile'
import { sfx } from '../lib/sfx'

export function WorldBackdrop({ world: w }: { world?: WorldId }) {
  const pat = w ? ARTS[w].pattern : undefined
  return <div aria-hidden="true" className="world-doodles" style={{ ['--world-pattern' as string]: pat ? `url("${svgUrl(pat)}")` : 'none', display: pat ? undefined : 'none' }} />
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
