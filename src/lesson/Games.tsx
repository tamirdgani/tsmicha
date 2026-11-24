import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { MemoryStep, PuzzleStep } from '../curriculum/lessonTypes'
import { Icon } from '../ds/Icon'
import { Sprout } from '../ds/Sprout'
import { useI18n } from '../i18n/I18n'
import { sfx } from '../lib/sfx'
import { TileView } from './KidSteps'
import type { Report } from './Steps'

/* Games inside the lessons, in the spirit of the floor puzzle Lenny loved:
   a real challenge, light to play, practising the lesson's own letters and numbers, and a big win at the end.
   Neither is graded — finishing is the reward. A parent can skip one (a small link) so a lesson never gets stuck. */

const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'
const PASTELS: [string, string][] = [['#ddebff', '#c9f2dc'], ['#fff1c9', '#ffe4d6'], ['#ebe3ff', '#ddebff'], ['#c9f2dc', '#fff1c9']]
const INKS = ['#c0392b', '#1f6fb2', '#6a4fcf', '#1f7a52', '#b5471c']

function Win({ text }: { text: string }) {
  const bits = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2
    return { x: Math.cos(a) * (110 + (i % 3) * 30), y: Math.sin(a) * (80 + (i % 2) * 24), c: ['#ffd25e', '#6fd3a5', '#8cc4ff', '#ffa77a', '#b8a3f7'][i % 5] }
  })
  return (
    <motion.div className="flex items-center justify-center gap-3 mt-4 relative" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} role="status">
      <Sprout size={72} stage={2} mood="cheer" />
      <span className="t-h1" style={{ color: 'var(--brand-ink)' }}>{text}</span>
      <span className="absolute left-1/2 top-1/2 pointer-events-none" aria-hidden="true">
        {bits.map((b, i) => (
          <motion.span key={i} className="absolute w-3 h-3" style={{ background: b.c, borderRadius: i % 2 ? 999 : 3 }}
            initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: b.x, y: b.y, opacity: 0, rotate: i * 40 }} transition={{ duration: 1.1, ease: 'easeOut' }} />
        ))}
      </span>
    </motion.div>
  )
}

function SkipLink({ onSkip }: { onSkip: () => void }) {
  const { t } = useI18n()
  return <button className="t-small ink-2 underline underline-offset-4 bg-transparent border-0 cursor-pointer mt-3" style={{ font: 'inherit' }} onClick={onSkip}>{t('game.skip')}</button>
}

/* ─────────────────────────── Jigsaw puzzle ─────────────────────────── */

const CELL = 120, PAD = 38, S0 = CELL + 2 * PAD, RES = 2

// one jigsaw edge from (x0,y0) to (x1,y1); s = +1 knob to the left of travel, -1 right, 0 flat
function edge(p: Path2D, x0: number, y0: number, x1: number, y1: number, s: number) {
  if (!s) { p.lineTo(x1, y1); return }
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = (-dy / L) * s, ny = (dx / L) * s
  const P = (a: number, b: number): [number, number] => [x0 + dx * a + nx * L * b, y0 + dy * a + ny * L * b]
  p.lineTo(...P(0.36, 0))
  p.bezierCurveTo(...P(0.42, 0.02), ...P(0.26, 0.25), ...P(0.5, 0.25))
  p.bezierCurveTo(...P(0.74, 0.25), ...P(0.58, 0.02), ...P(0.64, 0))
  p.lineTo(x1, y1)
}
function piecePath(r: number, c: number, h: number[][], v: number[][], rows: number, cols: number) {
  const p = new Path2D(), a = PAD, b = PAD + CELL
  p.moveTo(a, a)
  edge(p, a, a, b, a, r > 0 ? h[r - 1][c] : 0)
  edge(p, b, a, b, b, c < cols - 1 ? -v[r][c] : 0)
  edge(p, b, b, a, b, r < rows - 1 ? -h[r][c] : 0)
  edge(p, a, b, a, a, c > 0 ? v[r][c - 1] : 0)
  p.closePath()
  return p
}

/** The picture: a big letter (or digit) in color, its picture (or a pile of things to count) and its word. */
function drawPicture(step: PuzzleStep, W: number, H: number) {
  const cv = document.createElement('canvas'); cv.width = W * RES; cv.height = H * RES
  const x = cv.getContext('2d')!; x.scale(RES, RES)
  const [a, b] = PASTELS[step.g.charCodeAt(0) % PASTELS.length]
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, a); g.addColorStop(1, b)
  x.fillStyle = g; x.fillRect(0, 0, W, H)
  for (let i = 0; i < 26; i++) { x.globalAlpha = 0.45; x.fillStyle = ['#fff', '#ffd25e', '#8cc4ff', '#6fd3a5'][i % 4]; x.beginPath(); x.arc(((i * 97) % W), ((i * 61) % H), 4 + (i % 4) * 3, 0, 7); x.fill() }
  x.globalAlpha = 1
  const ink = INKS[step.g.charCodeAt(0) % INKS.length]
  const ls = Math.min(W * 0.42, H * 0.62)
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round'
  x.font = `800 ${ls}px Rubik, system-ui, sans-serif`
  x.lineWidth = ls * 0.1; x.strokeStyle = '#fff'; x.strokeText(step.g, W * 0.72, H * 0.42)
  x.fillStyle = ink; x.fillText(step.g, W * 0.72, H * 0.42)
  if (step.n) {
    const k = step.n, per = Math.ceil(Math.sqrt(k)), sz = Math.min(W * 0.38 / per, H * 0.6 / per) * 0.9
    x.font = `${sz}px ${EMOJI_FONT}`
    for (let i = 0; i < k; i++) x.fillText(step.e, W * 0.08 + (i % per + 0.5) * (W * 0.38 / per), H * 0.12 + (Math.floor(i / per) + 0.5) * (H * 0.6 / per))
  } else {
    x.font = `${ls * 0.78}px ${EMOJI_FONT}`; x.fillText(step.e, W * 0.27, H * 0.44)
  }
  if (step.word) {
    const ws = H * 0.13; x.font = `800 ${ws}px Rubik, system-ui, sans-serif`
    const tw = x.measureText(step.word).width, cy = H * 0.85, pw = tw + ws * 1.2, ph = ws * 1.45
    x.fillStyle = 'rgba(255,255,255,.92)'; x.beginPath(); x.roundRect(W / 2 - pw / 2, cy - ph / 2, pw, ph, ph / 2); x.fill()
    const right = W / 2 + tw / 2; x.textAlign = 'right'
    x.fillStyle = ink; x.fillText(step.word[0], right, cy + ws * 0.05)
    x.fillStyle = '#1f2a44'; x.fillText(step.word.slice(1), right - x.measureText(step.word[0]).width, cy + ws * 0.05)
  }
  return cv
}

type Piece = { r: number; c: number; path: Path2D; img: string; x: number; y: number; tx: number; ty: number; rot: number; done: boolean; z: number }

export function Puzzle({ step, report }: { step: PuzzleStep; report: Report }) {
  const { t, pick } = useI18n()
  const wrap = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(600)
  useEffect(() => {
    const el = wrap.current; if (!el) return
    const fit = () => setW(el.clientWidth)
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect()
  }, [])

  const { cols, rows } = step
  const BW = cols * CELL, BH = rows * CELL
  const side = w >= 520 // wide screens: board beside the pieces; phones: pieces under the board
  const M = 24, GAP = 36, SLOT = CELL * 1.12
  const trayCols = side ? Math.ceil(cols * rows / Math.max(rows, 2)) : cols
  const trayRows = Math.ceil((cols * rows) / trayCols)
  const TW = trayCols * SLOT, TH = trayRows * SLOT
  const WW = side ? M * 2 + BW + GAP + TW : M * 2 + Math.max(BW, TW)
  const WH = side ? M * 2 + Math.max(BH, TH) : M * 2 + BH + GAP + TH
  const bx = side ? WW - M - BW : (WW - BW) / 2, by = side ? (WH - BH) / 2 : M
  const tx0 = side ? M : (WW - TW) / 2, ty0 = side ? (WH - TH) / 2 : M + BH + GAP
  const S = Math.min(1.2, w / WW)

  const pic = useMemo(() => drawPicture(step, BW, BH), [step, BW, BH])
  const ghost = useMemo(() => pic.toDataURL(), [pic])
  const [pieces, setPieces] = useState<Piece[]>([])
  const [held, setHeld] = useState<number | null>(null)
  const [won, setWon] = useState(false)
  const drag = useRef<{ i: number; dx: number; dy: number; moved: boolean } | null>(null)
  const hit = useMemo(() => document.createElement('canvas').getContext('2d')!, [])

  // cut the picture into interlocking pieces and scatter them in the tray
  useEffect(() => {
    const h = Array.from({ length: rows - 1 }, () => Array.from({ length: cols }, () => (Math.random() < 0.5 ? 1 : -1)))
    const v = Array.from({ length: rows }, () => Array.from({ length: cols - 1 }, () => (Math.random() < 0.5 ? 1 : -1)))
    const slots = shuffle(Array.from({ length: cols * rows }, (_, i) => i))
    const list: Piece[] = []
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const path = piecePath(r, c, h, v, rows, cols)
      const cv = document.createElement('canvas'); cv.width = cv.height = S0 * RES
      const x = cv.getContext('2d')!; x.scale(RES, RES)
      x.save(); x.clip(path); x.drawImage(pic, -(c * CELL - PAD), -(r * CELL - PAD), BW, BH); x.restore()
      x.lineWidth = 3; x.strokeStyle = 'rgba(255,255,255,.95)'; x.stroke(path)
      x.lineWidth = 1.2; x.strokeStyle = 'rgba(31,42,68,.35)'; x.stroke(path)
      const sl = slots[list.length]
      list.push({ r, c, path, img: cv.toDataURL(), done: false, z: list.length,
        tx: bx + c * CELL - PAD, ty: by + r * CELL - PAD, rot: Math.random() * 16 - 8,
        x: tx0 + (sl % trayCols) * SLOT + SLOT / 2 - S0 / 2, y: ty0 + Math.floor(sl / trayCols) * SLOT + SLOT / 2 - S0 / 2 })
    }
    setPieces(list); setWon(false); report(false, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pic, side, w > 0])

  const done = pieces.filter((p) => p.done).length
  useEffect(() => {
    if (pieces.length && done === pieces.length && !won) { setWon(true); sfx.partDone(); report(true, true) }
  }, [done, pieces.length, won, report])

  const toWorld = (e: React.PointerEvent) => { const r = wrap.current!.querySelector('[data-world]')!.getBoundingClientRect(); return [(e.clientX - r.left) / S, (e.clientY - r.top) / S] }
  const pieceAt = (x: number, y: number) => {
    const order = pieces.map((p, i) => ({ p, i })).filter(({ p }) => !p.done).sort((a, b) => b.p.z - a.p.z)
    hit.lineWidth = 26
    for (const { p, i } of order) { const lx = x - p.x, ly = y - p.y; if (lx < 0 || ly < 0 || lx > S0 || ly > S0) continue; if (hit.isPointInPath(p.path, lx, ly) || hit.isPointInStroke(p.path, lx, ly)) return i }
    return null
  }
  const tol = CELL * 0.38
  const trySnap = (i: number, list: Piece[]) => {
    const p = list[i]
    if (Math.hypot(p.x - p.tx, p.y - p.ty) < tol) {
      list[i] = { ...p, x: p.tx, y: p.ty, rot: 0, done: true }
      sfx.place(list.filter((q) => q.done).length)
      return true
    }
    return false
  }

  const down = (e: React.PointerEvent) => {
    if (won) return
    const [x, y] = toWorld(e)
    const i = pieceAt(x, y)
    if (i === null) {
      // tap on the board with a piece held: put it there if that's its spot (an alternative to dragging)
      if (held !== null) {
        const p = pieces[held]
        const list = [...pieces]; list[held] = { ...p, x: x - S0 / 2, y: y - S0 / 2 }
        if (trySnap(held, list)) { setPieces(list); setHeld(null) } else { sfx.wrong(); setHeld(null) }
      }
      return
    }
    e.preventDefault()
    try { (e.currentTarget as Element).setPointerCapture(e.pointerId) } catch { /* ignore */ }
    const p = pieces[i]
    drag.current = { i, dx: x - p.x, dy: y - p.y, moved: false }
    setPieces((ps) => ps.map((q, k) => (k === i ? { ...q, z: Math.max(...ps.map((s) => s.z)) + 1, rot: 0 } : q)))
    sfx.pick()
  }
  const move = (e: React.PointerEvent) => {
    const d = drag.current; if (!d) return
    const [x, y] = toWorld(e)
    d.moved = true
    setPieces((ps) => ps.map((q, k) => (k === d.i ? { ...q, x: x - d.dx, y: y - d.dy } : q)))
  }
  const up = () => {
    const d = drag.current; if (!d) return
    drag.current = null
    if (!d.moved) { setHeld(held === d.i ? null : d.i); return }
    setPieces((ps) => {
      const list = [...ps]
      if (!trySnap(d.i, list)) {
        const p = list[d.i]
        const onBoard = p.x + S0 / 2 > bx && p.x + S0 / 2 < bx + BW && p.y + S0 / 2 > by && p.y + S0 / 2 < by + BH
        if (onBoard) sfx.wrong()
      }
      return list
    })
    setHeld(null)
  }

  return (
    <div>
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="t-h1 m-0 text-center">{pick(step.title)}</motion.h2>
      <p className="t-small ink-2 text-center mt-1 mb-0">{t('game.puzzle.hint', { n: cols * rows })}</p>
      <div ref={wrap} className="mt-3 w-full">
        <div data-world className="relative mx-auto touch-none select-none" style={{ width: WW * S, height: WH * S }}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
          role="application" aria-label={t('game.puzzle.aria', { n: cols * rows, d: done })}>
          {/* the board: the picture, very faint, with the piece outlines dashed on top */}
          <div className="absolute rounded-md" style={{ left: bx * S, top: by * S, width: BW * S, height: BH * S, background: `url(${ghost}) center/cover`, opacity: 1, boxShadow: '0 0 0 6px var(--surface), 0 0 0 7px var(--line-strong)' }}>
            <div className="absolute inset-0 rounded-md" style={{ background: 'color-mix(in oklab, var(--surface) 78%, transparent)' }} />
          </div>
          {pieces.map((p, i) => (
            <img key={i} src={p.img} alt="" draggable={false} className="absolute pointer-events-none"
              style={{ left: p.x * S, top: p.y * S, width: S0 * S, height: S0 * S, zIndex: p.done ? 1 : 2 + p.z,
                transform: `rotate(${p.rot}deg) scale(${drag.current?.i === i ? 1.06 : 1})`,
                filter: p.done ? 'none' : held === i ? 'drop-shadow(0 0 6px #ffd25e) drop-shadow(0 6px 6px rgb(0 0 0 / .25))' : 'drop-shadow(0 4px 4px rgb(0 0 0 / .22))',
                transition: drag.current?.i === i ? 'none' : 'left .2s, top .2s, transform .2s' }} />
          ))}
        </div>
      </div>
      <div className="text-center">
        <AnimatePresence>{won && <Win text={t('game.won')} />}</AnimatePresence>
        {!won && <p className="t-small ink-2 m-0 mt-2"><span className="t-num">{done}</span> / <span className="t-num">{cols * rows}</span></p>}
        {!won && <SkipLink onSkip={() => report(true, true)} />}
      </div>
    </div>
  )
}

/* ─────────────────────────── Memory ─────────────────────────── */

export function Memory({ step, report }: { step: MemoryStep; report: Report }) {
  const { t, pick } = useI18n()
  const cards = useMemo(() => shuffle(step.pairs.flatMap((p, i) => [{ pair: i, side: 0, tile: p[0] }, { pair: i, side: 1, tile: p[1] }])), [step])
  const [open, setOpen] = useState<number[]>([])
  const [found, setFound] = useState<Set<number>>(new Set())
  const [moves, setMoves] = useState(0)
  const busy = open.length === 2
  const won = found.size === step.pairs.length
  useEffect(() => { report(false, true) }, [report])
  useEffect(() => { if (won) { sfx.partDone(); report(true, true) } }, [won, report])

  const flip = (k: number) => {
    if (busy || won || open.includes(k) || found.has(cards[k].pair)) return
    sfx.pick()
    const now = [...open, k]
    setOpen(now)
    if (now.length === 2) {
      setMoves((m) => m + 1)
      const [a, b] = now.map((i) => cards[i])
      if (a.pair === b.pair) {
        window.setTimeout(() => { setFound((f) => new Set(f).add(a.pair)); setOpen([]); sfx.place(found.size + 1) }, 450)
      } else {
        window.setTimeout(() => { setOpen([]); sfx.unplace() }, 1100)
      }
    }
  }
  const colsClass = cards.length <= 6 ? 'grid-cols-3' : cards.length <= 8 ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-5'
  return (
    <div>
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="t-h1 m-0 text-center">{pick(step.title)}</motion.h2>
      <p className="t-small ink-2 text-center mt-1 mb-0">{t('game.memory.hint')}</p>
      <div className={`grid ${colsClass} gap-2 sm:gap-3 mt-4 max-w-xl mx-auto`} style={{ perspective: 800 }}>
        {cards.map((c, k) => {
          const shown = open.includes(k) || found.has(c.pair)
          const isFound = found.has(c.pair)
          return (
            <motion.button key={k} onClick={() => flip(k)} aria-label={shown ? undefined : t('game.memory.card', { n: k + 1 })} aria-pressed={shown}
              className="relative rounded-2xl min-h-24 sm:min-h-28 p-2 grid place-items-center cursor-pointer"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, rotateY: shown ? 0 : 180 }} transition={{ rotateY: { duration: 0.35 }, delay: k * 0.03 }}
              style={{ font: 'inherit', color: 'var(--ink)', transformStyle: 'preserve-3d',
                background: shown ? (isFound ? 'var(--brand-soft)' : 'var(--surface)') : 'var(--sky-soft)',
                border: `2px solid ${isFound ? 'var(--brand-ink)' : shown ? 'var(--sky-strong)' : 'var(--line-strong)'}`, boxShadow: '0 3px 0 var(--line-strong)' }}>
              {shown ? <span style={{ transform: 'scaleX(1)' }}><TileView tile={c.tile} /></span>
                : <span aria-hidden="true" className="grid place-items-center w-10 h-10 rounded-full" style={{ background: 'var(--surface)', color: 'var(--sky-strong)' }}><Icon name="star" size={22} /></span>}
              {isFound && <span className="absolute top-1.5 end-1.5 grid place-items-center w-6 h-6 rounded-full" style={{ background: 'var(--brand-ink)', color: '#fff' }}><Icon name="check" size={14} /></span>}
            </motion.button>
          )
        })}
      </div>
      <div className="text-center">
        <AnimatePresence>{won && <Win text={t('game.won.memory', { n: moves })} />}</AnimatePresence>
        {!won && <p className="t-small ink-2 m-0 mt-3">{t('game.memory.moves', { n: moves })}</p>}
        {!won && <SkipLink onSkip={() => report(true, true)} />}
      </div>
    </div>
  )
}
