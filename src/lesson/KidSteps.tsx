import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { BuildStep, MatchStep, OrderStep, PickStep, Shape, Show, Tile, TraceStep } from '../curriculum/lessonTypes'
import { Icon } from '../ds/Icon'
import { useI18n } from '../i18n/I18n'
import type { Report, Status } from './Steps'
import { sfx } from '../lib/sfx'

/* Kid steps: the same cards, borders and feedback colors as the rest of the app,
   only bigger — pictures carry the meaning, the words are for the parent to read. */

const rise = (d = 0) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } })
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'

/* ─────────────────────────── Drawing a tile ─────────────────────────── */

export function ShapeSvg({ shape, color = '#4da3ff', size = 64 }: { shape: Shape; color?: string; size?: number }) {
  const stroke = 'rgb(0 0 0 / .18)'
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      {shape === 'circle' && <circle cx="32" cy="32" r="27" fill={color} stroke={stroke} strokeWidth="2" />}
      {shape === 'square' && <rect x="7" y="7" width="50" height="50" rx="5" fill={color} stroke={stroke} strokeWidth="2" />}
      {shape === 'rect' && <rect x="3" y="16" width="58" height="32" rx="4" fill={color} stroke={stroke} strokeWidth="2" />}
      {shape === 'triangle' && <path d="M32 6 L59 56 H5 Z" fill={color} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />}
      {shape === 'star' && <path d="M32 4 L40 23 L60 24 L44 37 L50 58 L32 46 L14 58 L20 37 L4 24 L24 23 Z" fill={color} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />}
      {shape === 'heart' && <path d="M32 56 C10 40 4 28 10 18 C16 8 28 10 32 20 C36 10 48 8 54 18 C60 28 54 40 32 56 Z" fill={color} stroke={stroke} strokeWidth="2" />}
    </svg>
  )
}

function Pile({ e, n, size = 34 }: { e: string; n: number; size?: number }) {
  return (
    <span className="flex flex-wrap justify-center content-center gap-1 max-w-[180px]" style={{ fontFamily: EMOJI_FONT, fontSize: n > 6 ? size * 0.75 : size, lineHeight: 1.1 }}>
      {Array.from({ length: n }, (_, i) => <span key={i}>{e}</span>)}
    </span>
  )
}

/** The content of a card. `big` is for the picture at the top of a question. */
export function TileView({ tile, big }: { tile: Tile; big?: boolean }) {
  const k = big ? 1.6 : 1
  return (
    <span className="flex flex-col items-center justify-center gap-1 pointer-events-none">
      {tile.shape && <ShapeSvg shape={tile.shape} color={tile.color} size={64 * k} />}
      {tile.many && <Pile e={tile.many.e} n={tile.many.n} size={big ? 44 : 30} />}
      {tile.e && <span style={{ fontFamily: EMOJI_FONT, fontSize: 54 * k * (tile.scale ?? 1), lineHeight: 1.1 }}>{tile.e}</span>}
      {tile.g && <span className="font-extrabold t-num" style={{ fontSize: 60 * k, lineHeight: 1, color: 'var(--ink)' }}>{tile.g}</span>}
      {tile.t && <span className="font-semibold text-center" style={{ fontSize: big ? 22 : tile.e || tile.g ? 16 : 22, lineHeight: 1.25 }}>{tile.t}</span>}
    </span>
  )
}

/** What the child looks at above the answers. */
export function ShowView({ show }: { show: Show }) {
  const box = 'card mt-4 sm:mt-5 mx-auto flex items-center justify-center p-4 sm:p-5'
  const boxStyle: CSSProperties = { boxShadow: 'none', background: 'var(--surface-2)', minHeight: 150, maxWidth: 520 }
  if (show.kind === 'pile') {
    return (
      <motion.div {...rise(0.08)} className={box} style={boxStyle}>
        <span className="flex flex-wrap justify-center gap-2 max-w-[360px]" style={{ fontFamily: EMOJI_FONT, fontSize: show.n > 7 ? 42 : 52, lineHeight: 1.1 }}>
          {Array.from({ length: show.n }, (_, i) => (
            <motion.span key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15 + i * 0.06, type: 'spring', stiffness: 500, damping: 18 }}>{show.e}</motion.span>
          ))}
        </span>
      </motion.div>
    )
  }
  if (show.kind === 'row') {
    return (
      <motion.div {...rise(0.08)} className={box} style={boxStyle}>
        <span className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
          {show.items.map((t, i) => t.t === '?' ? (
            // a missing piece in the middle of a row
            <motion.span key={i} className="grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl t-h1" style={{ border: '2.5px dashed var(--sky-strong)', color: 'var(--sky-strong)' }}
              animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>?</motion.span>
          ) : (
            <motion.span key={i} className={`grid place-items-center ${t.many ? 'min-w-16 px-1 py-1 rounded-xl' : 'w-14 h-14 sm:w-16 sm:h-16'}`} style={t.many ? { background: 'var(--surface)', border: '1.5px solid var(--line)' } : undefined}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
              {t.shape ? <ShapeSvg shape={t.shape} color={t.color} size={46} />
                : t.many ? <Pile e={t.many.e} n={t.many.n} size={24} />
                : t.g ? <span className="font-extrabold t-num" style={{ fontSize: 40, lineHeight: 1 }}>{t.g}</span>
                : <span style={{ fontFamily: EMOJI_FONT, fontSize: 40 }}>{t.e}</span>}
            </motion.span>
          ))}
          {show.ask && (
            <motion.span className="grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl t-h1" style={{ border: '2.5px dashed var(--sky-strong)', color: 'var(--sky-strong)' }}
              animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>?</motion.span>
          )}
        </span>
      </motion.div>
    )
  }
  if (show.kind === 'analogy') {
    const pair = (l: string, r: string | null, delay: number) => (
      <motion.span className="flex items-center gap-3 sm:gap-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
        <span style={{ fontFamily: EMOJI_FONT, fontSize: 52, lineHeight: 1 }}>{l}</span>
        <Icon name="chevron" size={28} className="ink-2" style={{ transform: 'scaleX(-1)' }} />
        {r ? <span style={{ fontFamily: EMOJI_FONT, fontSize: 52, lineHeight: 1 }}>{r}</span>
          : <motion.span className="grid place-items-center w-16 h-16 rounded-xl t-h1" style={{ border: '2.5px dashed var(--sky-strong)', color: 'var(--sky-strong)' }}
              animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>?</motion.span>}
      </motion.span>
    )
    return (
      <motion.div {...rise(0.08)} className={box} style={boxStyle}>
        <span className="flex flex-col items-center gap-3">
          {pair(show.a[0], show.a[1], 0.1)}
          <span className="w-24 border-t-2 border-dashed" style={{ borderColor: 'var(--line-strong)' }} aria-hidden="true" />
          {pair(show.b, null, 0.35)}
        </span>
      </motion.div>
    )
  }
  if (show.kind === 'tile') {
    return <motion.div {...rise(0.08)} className={box} style={boxStyle}><TileView tile={show.tile} big /></motion.div>
  }
  if (show.kind === 'scene') {
    const pos: Record<typeof show.rel, CSSProperties> = {
      above: { top: -8, left: '50%', transform: 'translateX(-50%)' },
      below: { bottom: -6, left: '50%', transform: 'translateX(-50%)' },
      inside: { top: '46%', left: '50%', transform: 'translate(-50%,-50%) scale(.8)' },
      next: { top: '50%', left: 'calc(50% + 70px)', transform: 'translateY(-50%)' },
    }
    return (
      <motion.div {...rise(0.08)} className={box} style={boxStyle}>
        <span className="relative block" style={{ width: 240, height: 230, fontFamily: EMOJI_FONT }}>
          <span className="absolute" style={{ fontSize: 100, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: show.rel === 'inside' ? 1 : 2, lineHeight: 1 }}>{show.b}</span>
          <motion.span className="absolute" style={{ fontSize: 54, lineHeight: 1, zIndex: show.rel === 'inside' ? 2 : 3, ...pos[show.rel] }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{show.a}</motion.span>
        </span>
      </motion.div>
    )
  }
  if (show.kind === 'sum') {
    const minus = show.op === '-'
    return (
      <motion.div {...rise(0.08)} className={box} style={boxStyle}>
        <span className="flex flex-wrap items-center justify-center gap-3 sm:gap-4" style={{ fontFamily: EMOJI_FONT }}>
          <span className="flex flex-wrap justify-center gap-1 max-w-[220px]" style={{ fontSize: 40 }}>
            {Array.from({ length: show.a }, (_, i) => {
              const gone = minus && i >= show.a - show.b
              return <span key={i} className="relative" style={{ opacity: gone ? 0.35 : 1 }}>{show.e}{gone && <span className="absolute inset-0 grid place-items-center" style={{ fontSize: 30 }}>✖️</span>}</span>
            })}
          </span>
          {!minus && <>
            <span className="grid place-items-center w-11 h-11 rounded-full t-h2" style={{ background: 'var(--brand)', color: 'var(--on-brand)', fontFamily: 'inherit' }}>+</span>
            <span className="flex flex-wrap justify-center gap-1 max-w-[220px]" style={{ fontSize: 40 }}>{Array.from({ length: show.b }, (_, i) => <span key={i}>{show.e}</span>)}</span>
          </>}
        </span>
      </motion.div>
    )
  }
  // word
  return (
    <motion.div {...rise(0.08)} className={box} style={boxStyle}>
      <span className="flex items-center gap-4">
        {show.e && <span style={{ fontFamily: EMOJI_FONT, fontSize: 64 }}>{show.e}</span>}
        <span className="font-extrabold tracking-wide" style={{ fontSize: 'clamp(56px, 12vw, 84px)', lineHeight: 1 }}>
          {show.hide === undefined ? show.w : [...show.w].map((ch, i) => i === show.hide
            ? <span key={i} className="inline-block text-center" style={{ minWidth: '0.8em', color: 'var(--sky-strong)', borderBottom: '5px dashed var(--sky-strong)' }}>?</span>
            : <span key={i}>{ch}</span>)}
        </span>
      </span>
    </motion.div>
  )
}

/* ─────────────────────────── A big answer card ─────────────────────────── */

type CardState = 'idle' | 'selected' | 'right' | 'wrong' | 'dim'
function cardStyle(s: CardState, accent?: string): CSSProperties {
  const border = s === 'right' ? 'var(--brand)' : s === 'wrong' ? 'var(--flame-strong)' : s === 'selected' ? accent ?? 'var(--sky-strong)' : 'var(--line)'
  const bg = s === 'right' ? 'var(--brand-soft)' : s === 'wrong' ? 'var(--flame-soft)' : s === 'selected' ? (accent ? `color-mix(in oklab, ${accent} 14%, var(--surface))` : 'var(--sky-soft)') : 'var(--surface)'
  return {
    font: 'inherit', color: 'var(--ink)', background: bg, border: `2px solid ${border}`,
    boxShadow: s === 'idle' || s === 'dim' ? '0 3px 0 var(--line-strong)' : `0 0 0 3px color-mix(in oklab, ${border} 22%, transparent)`,
    // a dimmed card (not chosen, after checking) steps back with a quieter fill and greyed pictures,
    // but its words keep full contrast (WCAG 1.4.3) — no opacity on text
    ...(s === 'dim' ? { background: 'var(--muted)', boxShadow: 'none', filter: 'grayscale(.7)' } : {}),
    transition: 'background .15s, border-color .15s, box-shadow .15s, filter .2s',
  }
}
function Mark({ s }: { s: CardState }) {
  if (s !== 'right' && s !== 'wrong') return null
  return (
    <span className="absolute top-2 end-2 grid place-items-center w-7 h-7 rounded-full" style={{ background: s === 'right' ? 'var(--brand)' : 'var(--flame-strong)', color: '#fff' }}>
      <Icon name={s === 'right' ? 'check' : 'x'} size={16} />
    </span>
  )
}

function Question({ text }: { text: string }) {
  return <motion.h2 {...rise()} className="t-h1 m-0 text-center" style={{ textWrap: 'balance' }}>{text}</motion.h2>
}

/* ─────────────────────────── Pick the right card ─────────────────────────── */

export function Pick({ step, status, report }: { step: PickStep; status: Status; report: Report }) {
  const { pick } = useI18n()
  const [sel, setSel] = useState<number | null>(null)
  const locked = status !== 'answering'
  const choose = (i: number) => { if (locked) return; sfx.pick(); setSel(i); report(true, i === step.correct) }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { const n = Number(e.key); if (n >= 1 && n <= step.options.length) choose(n - 1) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  const n = step.options.length
  const textOnly = step.options.every((o) => o.t && !o.e && !o.g && !o.shape && !o.many)
  const cols = textOnly ? 'grid-cols-1 sm:grid-cols-2' : n === 2 ? 'grid-cols-2' : n === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
  return (
    <div>
      <Question text={pick(step.q)} />
      {step.show && <ShowView show={step.show} />}
      <div role="radiogroup" className={`grid ${cols} gap-3 mt-5 sm:mt-6 max-w-2xl mx-auto`}>
        {step.options.map((o, i) => {
          const s: CardState = locked ? (i === step.correct ? 'right' : sel === i ? 'wrong' : 'dim') : sel === i ? 'selected' : 'idle'
          return (
            <motion.button key={i} {...rise(0.1 + i * 0.05)} role="radio" aria-checked={sel === i} onClick={() => choose(i)}
              whileTap={locked ? undefined : { scale: 0.95 }}
              animate={s === 'wrong' ? { x: [0, -8, 8, -5, 5, 0], opacity: 1, y: 0 } : s === 'right' ? { scale: [1, 1.06, 1], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              className={`relative grid place-items-center rounded-2xl p-3 ${textOnly ? 'min-h-20' : 'min-h-32 sm:min-h-36'}`}
              style={{ ...cardStyle(s), cursor: locked ? 'default' : 'pointer' }}>
              <TileView tile={o} />
              <Mark s={s} />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────── Put in order ─────────────────────────── */

export function Order({ step, status, report }: { step: OrderStep; status: Status; report: Report }) {
  const { pick, num, t } = useI18n()
  const pool = useMemo(() => { let p = shuffle(step.items.map((_, i) => i)); while (step.items.length > 1 && p.every((v, i) => v === i)) p = shuffle(p); return p }, [step])
  const [slots, setSlots] = useState<number[]>([])
  const locked = status !== 'answering'
  useEffect(() => { report(slots.length === step.items.length, slots.every((v, i) => v === i)) }, [slots, step, report])
  const add = (i: number) => { if (!locked && !slots.includes(i)) { sfx.place(slots.length); setSlots((s) => [...s, i]) } }
  const remove = (k: number) => { if (!locked) { sfx.unplace(); setSlots((s) => s.filter((_, j) => j !== k)) } }
  const small = step.items.length > 4
  return (
    <div>
      <Question text={pick(step.q)} />
      <p className="t-small ink-3 text-center mt-2 mb-0">{t('kid.order.hint')}</p>
      {/* the answer row: numbered slots, filled in reading order */}
      <div className={`grid gap-2 sm:gap-3 mt-4 sm:mt-6 max-w-2xl mx-auto`} style={{ gridTemplateColumns: `repeat(${step.items.length}, minmax(0, 1fr))` }}>
        {step.items.map((_, k) => {
          const v = slots[k]
          const s: CardState = v === undefined ? 'idle' : locked ? (v === k ? 'right' : 'wrong') : 'selected'
          return (
            <button key={k} onClick={() => v !== undefined && remove(k)} className={`relative grid place-items-center rounded-2xl ${small ? 'min-h-24' : 'min-h-28 sm:min-h-32'} p-2`}
              style={{ ...cardStyle(s, 'var(--brand)'), borderStyle: v === undefined ? 'dashed' : 'solid', cursor: v === undefined || locked ? 'default' : 'pointer' }} aria-label={num(k + 1)}>
              <span className="absolute top-1.5 start-2 t-caption ink-3 t-num">{num(k + 1)}</span>
              <AnimatePresence mode="popLayout">
                {v !== undefined && (
                  <motion.span key={v} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }}>
                    <TileView tile={step.items[v]} />
                  </motion.span>
                )}
              </AnimatePresence>
              <Mark s={s} />
            </button>
          )
        })}
      </div>
      {/* the pool */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-5 max-w-2xl mx-auto">
        {pool.map((i) => {
          const used = slots.includes(i)
          return (
            <motion.button key={i} {...rise(0.1)} whileTap={{ scale: 0.94 }} onClick={() => add(i)} disabled={used || locked}
              className={`relative grid place-items-center rounded-2xl p-2 ${small ? 'min-w-20 min-h-20' : 'min-w-24 min-h-24 sm:min-w-28 sm:min-h-28'}`}
              style={{ ...cardStyle('idle'), opacity: used ? 0.25 : 1, borderStyle: used ? 'dashed' : 'solid', cursor: used || locked ? 'default' : 'pointer' }}>
              <TileView tile={step.items[i]} />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────── Match pairs ─────────────────────────── */

const PAIR_COLORS = ['#4da3ff', '#8b6cf6', '#ff7a45', '#2e9a48', '#ffc83d']

export function Match({ step, status, report }: { step: MatchStep; status: Status; report: Report }) {
  const { pick, t } = useI18n()
  const right = useMemo(() => { let p = shuffle(step.pairs.map((_, i) => i)); while (p.length > 1 && p.every((v, i) => v === i)) p = shuffle(p); return p }, [step])
  const [links, setLinks] = useState<Record<number, number>>({}) // left index → right index
  const [held, setHeld] = useState<number | null>(null)
  const locked = status !== 'answering'
  useEffect(() => {
    const all = Object.keys(links).length === step.pairs.length
    report(all, all && Object.entries(links).every(([l, r]) => Number(l) === r))
  }, [links, step, report])
  const colorOfLeft = (l: number) => PAIR_COLORS[Object.keys(links).map(Number).sort().indexOf(l) % PAIR_COLORS.length]
  const leftOf = (r: number) => { const e = Object.entries(links).find(([, v]) => v === r); return e ? Number(e[0]) : null }

  const tapLeft = (l: number) => {
    if (locked) return
    if (links[l] !== undefined) { sfx.unplace(); setLinks((m) => { const n = { ...m }; delete n[l]; return n }); return }
    sfx.pick(); setHeld(held === l ? null : l)
  }
  const tapRight = (r: number) => {
    if (locked) return
    const owner = leftOf(r)
    if (owner !== null) { sfx.unplace(); setLinks((m) => { const n = { ...m }; delete n[owner]; return n }); return }
    if (held === null) return
    sfx.place(Object.keys(links).length + 1)
    setLinks((m) => ({ ...m, [held]: r }))
    setHeld(null)
  }

  const side = (isLeft: boolean) => (
    <div className="grid gap-3 content-start">
      {(isLeft ? step.pairs.map((_, i) => i) : right).map((i) => {
        const linkedTo = isLeft ? links[i] : leftOf(i)
        const linked = linkedTo !== undefined && linkedTo !== null
        const color = linked ? colorOfLeft(isLeft ? i : (linkedTo as number)) : undefined
        const ok = locked && linked && (isLeft ? links[i] === i : leftOf(i) === i)
        const s: CardState = locked ? (ok ? 'right' : 'wrong') : linked ? 'selected' : isLeft && held === i ? 'selected' : 'idle'
        return (
          <motion.button key={i} {...rise(0.08)} whileTap={{ scale: 0.95 }} onClick={() => (isLeft ? tapLeft(i) : tapRight(i))}
            className="relative grid place-items-center rounded-2xl p-2 min-h-24 sm:min-h-28"
            style={{ ...cardStyle(s, color), cursor: locked ? 'default' : 'pointer', outline: isLeft && held === i ? '3px solid var(--sky-strong)' : undefined, outlineOffset: 2 }}>
            <TileView tile={step.pairs[i][isLeft ? 0 : 1]} />
            {linked && !locked && <span className="absolute top-2 start-2 w-4 h-4 rounded-full" style={{ background: color }} />}
            <Mark s={s} />
          </motion.button>
        )
      })}
    </div>
  )

  return (
    <div>
      <Question text={pick(step.q)} />
      <p className="t-small ink-3 text-center mt-2 mb-0">{t('kid.match.hint')}</p>
      <div className="grid grid-cols-2 gap-6 sm:gap-12 mt-4 sm:mt-6 max-w-xl mx-auto">
        {side(true)}
        {side(false)}
      </div>
    </div>
  )
}

/* ─────────────────────────── Trace with a finger ─────────────────────────── */

export function Trace({ step, report }: { step: TraceStep; report: Report }) {
  const { pick, t } = useI18n()
  const wrap = useRef<HTMLDivElement>(null)
  const ink = useRef<HTMLCanvasElement>(null)
  const guide = useRef<HTMLCanvasElement>(null)
  const [size, setSize] = useState(300)
  const [cover, setCover] = useState(0)
  const [messy, setMessy] = useState(false)
  const done = cover >= 0.62 && !messy
  const targets = useRef<[number, number][]>([])
  const allowed = useRef<Uint8ClampedArray | null>(null)
  const drawing = useRef(false)
  const last = useRef<[number, number] | null>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const fit = () => setSize(Math.max(220, Math.min(340, el.clientWidth, window.innerHeight * 0.42)))
    fit()
    const ro = new ResizeObserver(fit); ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Where the glyph is: sample points on an offscreen copy, used to measure how much is covered.
  const font = useCallback((s: number) => `800 ${s * 0.78}px Rubik, system-ui, sans-serif`, [])
  useEffect(() => {
    const c = document.createElement('canvas'); c.width = c.height = size
    const x = c.getContext('2d')!
    x.font = font(size); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(step.g, size / 2, size * 0.54)
    const data = x.getImageData(0, 0, size, size).data
    const pts: [number, number][] = []
    const stepPx = Math.max(4, Math.round(size / 40))
    for (let y = 0; y < size; y += stepPx) for (let xx = 0; xx < size; xx += stepPx) if (data[(y * size + xx) * 4 + 3] > 128) pts.push([xx, y])
    targets.current = pts
    // Ink is allowed on the shape and a finger's width around it; scribbling elsewhere doesn't count.
    x.lineWidth = size * 0.16; x.lineJoin = 'round'; x.strokeText(step.g, size / 2, size * 0.54)
    allowed.current = x.getImageData(0, 0, size, size).data
    const ic = ink.current!; ic.width = ic.height = size
    // the grey guide is drawn exactly where the shape is measured
    const gc = guide.current!; gc.width = gc.height = size
    const gx = gc.getContext('2d')!
    gx.font = font(size); gx.textAlign = 'center'; gx.textBaseline = 'middle'
    gx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--line-strong').trim() || '#ddd'
    gx.fillText(step.g, size / 2, size * 0.54)
    setCover(0); setMessy(false)
  }, [size, step.g, font])

  useEffect(() => { report(done, true); if (done) sfx.sparkle() }, [done, report])

  const measure = () => {
    const x = ink.current!.getContext('2d')!
    const d = x.getImageData(0, 0, size, size).data
    const pts = targets.current
    if (!pts.length) return
    let hit = 0
    for (const [px, py] of pts) if (d[(py * size + px) * 4 + 3] > 0) hit++
    setCover(hit / pts.length)
    let inked = 0, outside = 0
    const ok = allowed.current!, g = Math.max(4, Math.round(size / 40))
    for (let y = 0; y < size; y += g) for (let xx = 0; xx < size; xx += g) {
      const i = (y * size + xx) * 4 + 3
      if (d[i] > 0) { inked++; if (ok[i] < 64) outside++ }
    }
    setMessy(inked > 0 && outside / inked > 0.45)
  }
  const pos = (e: React.PointerEvent) => { const r = ink.current!.getBoundingClientRect(); return [(e.clientX - r.left) * (size / r.width), (e.clientY - r.top) * (size / r.height)] as [number, number] }
  const stroke = (to: [number, number]) => {
    const x = ink.current!.getContext('2d')!
    x.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#22803b'
    x.lineWidth = size * 0.11; x.lineCap = 'round'; x.lineJoin = 'round'
    x.beginPath(); const from = last.current ?? to; x.moveTo(...from); x.lineTo(...to); x.stroke()
    last.current = to
  }
  const clear = () => { const c = ink.current!; c.getContext('2d')!.clearRect(0, 0, size, size); setCover(0); setMessy(false) }

  return (
    <div>
      <Question text={pick(step.q)} />
      <div ref={wrap} className="mt-4 sm:mt-6 flex flex-col items-center">
        <div className="relative rounded-3xl overflow-hidden" style={{ width: size, height: size, background: 'var(--surface-2)', border: `2px ${done ? 'solid var(--brand)' : 'dashed var(--line-strong)'}` }}>
          {/* the grey guide */}
          <canvas ref={guide} className="absolute inset-0 w-full h-full" aria-hidden="true" />
          <canvas ref={ink} className="absolute inset-0 w-full h-full" style={{ touchAction: 'none', cursor: 'crosshair' }}
            onPointerDown={(e) => { try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* pointer already gone */ } drawing.current = true; last.current = null; stroke(pos(e)) }}
            onPointerMove={(e) => { if (drawing.current) stroke(pos(e)) }}
            onPointerUp={() => { drawing.current = false; last.current = null; measure() }}
            onPointerCancel={() => { drawing.current = false; last.current = null; measure() }} />
          <AnimatePresence>
            {done && (
              <motion.span className="absolute top-3 end-3 grid place-items-center w-10 h-10 rounded-full" style={{ background: 'var(--brand)', color: 'var(--on-brand)' }}
                initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 16 }}>
                <Icon name="check" size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-3 mt-3" style={{ width: size }}>
          <div className="bar flex-1" style={{ height: 10 }}><i style={{ width: `${Math.min(100, Math.round((cover / 0.62) * 100))}%` }} /></div>
          <button className="chip cursor-pointer" onClick={clear} style={{ font: 'inherit' }}><Icon name="refresh" size={14} />{t('kid.trace.clear')}</button>
        </div>
        <p className="t-small mt-2 mb-0" style={{ color: messy ? 'var(--flame-text)' : 'var(--ink-3)' }}>{done ? t('kid.trace.done') : messy ? t('kid.trace.messy') : t('kid.trace.hint')}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────── Build a word ─────────────────────────── */

export function Build({ step, status, report }: { step: BuildStep; status: Status; report: Report }) {
  const { pick, t } = useI18n()
  const letters = useMemo(() => [...step.w], [step])
  const pool = useMemo(() => shuffle([...letters, ...step.extra].map((ch, i) => ({ ch, i }))), [letters, step])
  const [slots, setSlots] = useState<number[]>([]) // indices into pool
  const locked = status !== 'answering'
  useEffect(() => {
    const word = slots.map((k) => pool.find((p) => p.i === k)!.ch).join('')
    report(slots.length === letters.length, word === step.w)
  }, [slots, pool, letters, step, report])
  const add = (k: number) => { if (!locked && slots.length < letters.length && !slots.includes(k)) { sfx.place(slots.length); setSlots((s) => [...s, k]) } }
  const remove = (j: number) => { if (!locked) { sfx.unplace(); setSlots((s) => s.filter((_, x) => x !== j)) } }
  return (
    <div>
      <Question text={pick(step.q)} />
      <motion.div {...rise(0.08)} className="card mt-4 mx-auto grid place-items-center p-4" style={{ boxShadow: 'none', background: 'var(--surface-2)', maxWidth: 420 }}>
        <span style={{ fontFamily: EMOJI_FONT, fontSize: 88, lineHeight: 1.1 }}>{step.e}</span>
      </motion.div>
      <div className="flex justify-center gap-2 sm:gap-3 mt-5">
        {letters.map((ch, j) => {
          const k = slots[j]
          const got = k !== undefined ? pool.find((p) => p.i === k)!.ch : null
          const s: CardState = got === null ? 'idle' : locked ? (got === ch ? 'right' : 'wrong') : 'selected'
          return (
            <button key={j} onClick={() => got !== null && remove(j)} className="relative grid place-items-center w-20 h-24 sm:w-24 sm:h-28 rounded-2xl"
              style={{ ...cardStyle(s, 'var(--brand)'), borderStyle: got === null ? 'dashed' : 'solid' }}>
              <AnimatePresence mode="popLayout">
                {got && <motion.span key={k} className="font-extrabold" style={{ fontSize: 56, lineHeight: 1 }} initial={{ scale: 0.3 }} animate={{ scale: 1 }} exit={{ scale: 0.3, opacity: 0 }}>{got}</motion.span>}
              </AnimatePresence>
            </button>
          )
        })}
      </div>
      <p className="t-small ink-3 text-center mt-3 mb-0">{t('kid.build.hint')}</p>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3">
        {pool.map((p) => {
          const used = slots.includes(p.i)
          return (
            <motion.button key={p.i} whileTap={{ scale: 0.9 }} onClick={() => add(p.i)} disabled={used || locked}
              className="grid place-items-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl font-extrabold"
              style={{ ...cardStyle('idle'), fontSize: 40, opacity: used ? 0.2 : 1, cursor: used || locked ? 'default' : 'pointer' }}>
              {p.ch}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
