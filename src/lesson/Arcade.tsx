import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { ArcadeStep } from '../curriculum/lessonTypes'
import { Sprout } from '../ds/Sprout'
import { useI18n } from '../i18n/I18n'
import { sfx } from '../lib/sfx'
import type { Report } from './Steps'

/* Little ball games for a breather between exercises: shoot hoops, kick past the keeper, knock down pins.
   Flick the ball with a finger. Like the earlier games, a gentle assist pulls good-enough throws in,
   and it grows after every miss, so every child gets the win. Not graded; finishing is the reward. */

const W = 600, H = 420, BR = 26
type Ball = { x: number; y: number; vx: number; vy: number; live: boolean; t: number; s: number }
type Pin = { x: number; y: number; down: boolean; vx: number; vy: number; rot: number }

const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'

export function Arcade({ step, report }: { step: ArcadeStep; report: Report }) {
  const { t, pick } = useI18n()
  const wrap = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [won, setWon] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const st = useRef({
    S: 1, ball: home(step.game), misses: 0, drag: null as null | { pts: [number, number, number][] },
    keeper: { x: W / 2, t: 0, dive: 0 }, pins: rack(), rolls: 0, net: 0, flash: 0, scored: false, wonAt: 0,
    rim: { x: 150, y: 150 }, score: 0, done: false,
  })
  const target = step.target

  useEffect(() => { report(false, true) }, [report])

  // fit the court to the width we get
  useEffect(() => {
    const el = wrap.current, c = cv.current; if (!el || !c) return
    const fit = () => {
      const S = Math.min(1.25, el.clientWidth / W), dpr = Math.min(2, devicePixelRatio || 1)
      st.current.S = S
      c.style.width = `${W * S}px`; c.style.height = `${H * S}px`
      c.width = Math.round(W * S * dpr); c.height = Math.round(H * S * dpr)
      c.getContext('2d')!.setTransform(S * dpr, 0, 0, S * dpr, 0, 0)
    }
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect()
  }, [])

  const say = (m: string) => { setMsg(m); window.setTimeout(() => setMsg((cur) => (cur === m ? null : cur)), 1400) }
  const point = (label?: 'strike' | 'spare' | 'great') => {
    const s = st.current
    s.score += 1; s.misses = 0; setScore(s.score); sfx.combo(s.score + 2); s.flash = 1
    say(step.game === 'goal' ? pick({ he: 'גּוֹל!', en: 'Goal!' }) : step.game === 'hoop' ? pick({ he: 'סַל!', en: 'Score!' }) : t(`arcade.bowl.${label ?? 'great'}`))
    if (s.score >= target && !s.done) { s.done = true; window.setTimeout(() => { setWon(true); sfx.partDone(); report(true, true) }, 700) }
  }
  const miss = (m: string) => { st.current.misses += 1; sfx.unplace(); say(m) }

  // the game loop
  useEffect(() => {
    let raf = 0, last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000); last = now
      const s = st.current
      if (step.game === 'hoop') stepHoop(s, dt, point, () => miss(t('arcade.almost')))
      else if (step.game === 'goal') stepGoal(s, dt, point, (saved) => miss(saved ? t('arcade.saved') : t('arcade.almost')))
      else stepBowl(s, dt, point, (left) => { sfx.place(6 - left); say(t('arcade.pins', { n: 6 - left })) }, () => miss(t('arcade.bowl.again')))
      s.net = Math.max(0, s.net - dt * 1.6); s.flash = Math.max(0, s.flash - dt * 2)
      const c = cv.current?.getContext('2d'); if (c) draw(c, s, step.game, now)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.game])

  // flick: drag the ball and let go — speed and direction come from the last moments of the drag
  const world = (e: React.PointerEvent) => { const r = cv.current!.getBoundingClientRect(); const S = st.current.S; return [(e.clientX - r.left) / S, (e.clientY - r.top) / S] as [number, number] }
  const down = (e: React.PointerEvent) => {
    const s = st.current; if (s.ball.live || s.done) return
    const [x, y] = world(e)
    if (Math.hypot(x - s.ball.x, y - s.ball.y) > BR * 2.4) return
    try { (e.currentTarget as Element).setPointerCapture(e.pointerId) } catch { /* ignore */ }
    s.drag = { pts: [[x, y, performance.now()]] }; sfx.pick()
  }
  const move = (e: React.PointerEvent) => {
    const s = st.current; if (!s.drag) return
    const [x, y] = world(e), now = performance.now()
    s.drag.pts.push([x, y, now]); while (s.drag.pts.length > 2 && now - s.drag.pts[0][2] > 110) s.drag.pts.shift()
    const h = home(step.game)
    s.ball.x = Math.max(BR, Math.min(W - BR, x)); s.ball.y = Math.max(h.y - 90, Math.min(H - BR, y))
  }
  const up = () => {
    const s = st.current, d = s.drag; if (!d) return
    s.drag = null
    const now = performance.now(), p0 = d.pts.find((p) => now - p[2] <= 110) ?? d.pts[0], p1 = d.pts[d.pts.length - 1]
    const dt = Math.max(0.016, (p1[2] - p0[2]) / 1000)
    let vx = (p1[0] - p0[0]) / dt, vy = (p1[1] - p0[1]) / dt
    if (Math.hypot(vx, vy) < 250 || vy > -120) { s.ball = home(step.game); return }
    ;[vx, vy] = assist(step.game, s, vx, vy)
    Object.assign(s.ball, { vx, vy, live: true, t: 0 }); s.scored = false; sfx.pop()
  }

  return (
    <div>
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="t-h1 m-0 text-center">{pick(step.title)}</motion.h2>
      <p className="t-small ink-2 text-center mt-1 mb-0">{t(`arcade.hint.${step.game}`, { n: target })}</p>
      <div ref={wrap} className="mt-3 w-full flex justify-center relative">
        <canvas ref={cv} role="img" aria-label={t('arcade.aria', { s: score, n: target })} className="rounded-2xl touch-none"
          style={{ background: 'var(--surface-2)', border: '1.5px solid var(--line)' }}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
        <AnimatePresence>
          {msg && !won && (
            <motion.span key={msg} className="absolute top-[52%] left-1/2 -translate-x-1/2 chip chip-sun pointer-events-none" style={{ height: 38, fontSize: 20, fontWeight: 800 }}
              initial={{ y: -10, opacity: 0, scale: 0.6 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ opacity: 0 }} role="status">{msg}</motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="text-center">
        <div className="flex justify-center gap-1.5 mt-3" aria-hidden="true">
          {Array.from({ length: target }, (_, i) => (
            <motion.span key={i} className="text-2xl" animate={{ scale: i < score ? [1, 1.4, 1] : 1, filter: i < score ? 'none' : 'grayscale(1) opacity(.35)' }}>⭐</motion.span>
          ))}
        </div>
        <AnimatePresence>
          {won && (
            <motion.div className="flex items-center justify-center gap-3 mt-3" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} role="status">
              <Sprout size={64} stage={2} mood="cheer" />
              <span className="t-h1" style={{ color: 'var(--brand-ink)' }}>{t(`arcade.won.${step.game}`)}</span>
            </motion.div>
          )}
        </AnimatePresence>
        {!won && <button className="t-small ink-2 underline underline-offset-4 bg-transparent border-0 cursor-pointer mt-3" style={{ font: 'inherit' }} onClick={() => report(true, true)}>{t('game.skip')}</button>}
      </div>
    </div>
  )
}

/* ───────── shared bits ───────── */

function home(game: ArcadeStep['game']): Ball {
  return game === 'hoop' ? { x: 470, y: 350, vx: 0, vy: 0, live: false, t: 0, s: 1 } : { x: W / 2, y: 360, vx: 0, vy: 0, live: false, t: 0, s: 1 }
}
function rack(): Pin[] {
  // classic triangle from the front: 1 · 2 · 3 rows, the head pin nearest the player
  const out: Pin[] = []
  const rows = [[300], [278, 322], [256, 300, 344]]
  rows.forEach((xs, r) => xs.forEach((x) => out.push({ x, y: 118 - r * 26, down: false, vx: 0, vy: 0, rot: 0 })))
  return out
}

/** Keeps the child's direction but pulls the strength (and for goal and bowling, the aim) part-way toward a good shot. */
function assist(game: ArcadeStep['game'], s: { misses: number; rim: { x: number; y: number }; ball: Ball; pins: Pin[] }, vx: number, vy: number): [number, number] {
  const k = Math.min(0.75, 0.4 + 0.1 * s.misses) // how much to help: more after each miss
  if (game === 'hoop') {
    const sp = Math.min(1500, Math.hypot(vx, vy)), ang = Math.atan2(-vy, -vx)
    const dx = s.ball.x - s.rim.x, up = s.ball.y - (s.rim.y - 6), g = 1100
    const den = 2 * Math.cos(ang) ** 2 * (dx * Math.tan(ang) - up)
    if (dx > 0 && ang > 0.05 && ang < 1.5 && den > 0) {
      const ideal = Math.sqrt((g * dx * dx) / den)
      // a break game should feel good: soft or wild flicks both land near the right strength
      const v = Math.max(0.85 * ideal, Math.min(1.2 * ideal, ideal * Math.pow(sp / ideal, 1 - k)))
      return [-Math.cos(ang) * v, -Math.sin(ang) * v]
    }
    return [vx, vy]
  }
  // goal & bowling: bend the aim toward the target (for bowling, the standing pin nearest the throw)
  const t = (s.ball.y - (game === 'goal' ? 120 : 110)) / -vy
  const landX = s.ball.x + vx * t
  const standing = s.pins.filter((p) => !p.down)
  const tx = game === 'bowl' && standing.length && standing.length < 6 ? standing.reduce((a, p) => (Math.abs(p.x - landX) < Math.abs(a.x - landX) ? p : a)).x : W / 2
  const fixed = landX + (tx - landX) * k * (game === 'goal' ? 0.5 : 0.8)
  return [(fixed - s.ball.x) / t, vy]
}

/* ───────── basketball ───────── */

function stepHoop(s: ReturnType<typeof useRefState>, dt: number, point: () => void, miss: () => void) {
  const b = s.ball; if (!b.live) return
  const sub = 4
  for (let i = 0; i < sub; i++) {
    const h = dt / sub
    b.vy += 1100 * h
    // a soft magnet when the ball comes down near the rim
    if (b.vy > 0 && Math.abs(b.x - s.rim.x) < 90 && b.y < s.rim.y && b.y > s.rim.y - 150) b.vx += ((s.rim.x - b.x) * (7 + 2 * s.misses) - b.vx * 1.4) * h
    const py = b.y
    b.x += b.vx * h; b.y += b.vy * h
    // backboard
    if (b.x - BR < s.rim.x - 62 && b.y > s.rim.y - 110 && b.y < s.rim.y + 15 && b.vx < 0) { b.x = s.rim.x - 62 + BR; b.vx *= -0.5 }
    if (!s.scored && py < s.rim.y && b.y >= s.rim.y && Math.abs(b.x - s.rim.x) < 44 && b.vy > 0) { s.scored = true; s.net = 1; point() }
  }
  b.t += dt
  if (b.y > H + BR || b.x < -BR || b.x > W + BR || b.t > 3) { if (!s.scored) miss(); s.ball = home('hoop') }
}

/* ───────── soccer ───────── */

function stepGoal(s: ReturnType<typeof useRefState>, dt: number, point: () => void, miss: (saved: boolean) => void) {
  const k = s.keeper, b = s.ball
  // the keeper strolls along the line, and dives toward the ball once it's kicked (slower after misses)
  if (!b.live) { k.t += dt; k.x = W / 2 + 85 * Math.sin(k.t * 1.3) }
  else { const sp = Math.max(60, 170 - 25 * s.misses); k.x += Math.sign(b.x - k.x) * Math.min(Math.abs(b.x - k.x), sp * dt) }
  if (!b.live) return
  b.x += b.vx * dt; b.y += b.vy * dt; b.s = Math.max(0.55, 1 - (360 - b.y) / 520); b.t += dt
  if (!s.scored && b.y <= 128) {
    s.scored = true
    const inGoal = Math.abs(b.x - W / 2) < 128, saved = inGoal && Math.abs(b.x - k.x) < 46
    if (inGoal && !saved) { s.net = 1; point() } else miss(saved)
    window.setTimeout(() => { s.ball = home('goal') }, 650)
    b.vx = saved ? (b.x - k.x) * 3 : b.vx; b.vy = saved ? 260 : -60
  }
  if (b.t > 2.4) s.ball = home('goal')
}

/* ───────── bowling ───────── */

function stepBowl(s: ReturnType<typeof useRefState>, dt: number, point: (label?: 'strike' | 'spare' | 'great') => void, rolled: (left: number) => void, frameMiss: () => void) {
  const b = s.ball
  for (const p of s.pins) if (p.down) { p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vx * dt * 0.05; p.vx *= 0.96; p.vy *= 0.96 }
  if (!b.live) return
  b.x += b.vx * dt; b.y += b.vy * dt; b.t += dt
  for (const p of s.pins) {
    if (!p.down && Math.hypot(p.x - b.x, p.y - b.y) < BR + 12) {
      p.down = true; p.vx = (p.x - b.x) * 6 + (Math.random() - 0.5) * 80; p.vy = -160 - Math.random() * 80; sfx.place(s.pins.filter((q) => q.down).length)
      // a falling pin knocks the pins behind it
      for (const q of s.pins) if (!q.down && q.y < p.y && Math.abs(q.x - p.x) < 30 && Math.random() < 0.75) { q.down = true; q.vx = (q.x - p.x) * 5; q.vy = -140 }
    }
  }
  if (b.y < -BR || b.t > 2.2) {
    s.rolls += 1
    const left = s.pins.filter((p) => !p.down).length
    if (left === 0) { point(s.rolls === 1 ? 'strike' : 'spare'); s.pins = rack(); s.rolls = 0 }
    else if (s.rolls >= 2) { if (6 - left >= 5) point('great'); else frameMiss(); s.pins = rack(); s.rolls = 0 }
    else rolled(left)
    s.ball = home('bowl')
  }
}

// typing helper: the shape of the mutable game state
function useRefState() { return { S: 1, ball: home('hoop'), misses: 0, drag: null as null | { pts: [number, number, number][] }, keeper: { x: W / 2, t: 0, dive: 0 }, pins: rack(), rolls: 0, net: 0, flash: 0, scored: false, wonAt: 0, rim: { x: 150, y: 150 }, score: 0, done: false } }

/* ───────── drawing ───────── */

function draw(c: CanvasRenderingContext2D, s: ReturnType<typeof useRefState>, game: ArcadeStep['game'], now: number) {
  c.clearRect(0, 0, W, H)
  if (game === 'hoop') {
    c.fillStyle = '#f3e0c7'; c.fillRect(0, H - 40, W, 40)
    c.fillStyle = '#c99a6a'; for (let x = 0; x < W; x += 60) c.fillRect(x, H - 40, 2, 40)
    // pole, board, rim and net
    c.fillStyle = '#9aa5b8'; c.fillRect(s.rim.x - 78, s.rim.y + 10, 10, H - s.rim.y - 50)
    c.fillStyle = '#ffffff'; c.strokeStyle = '#1f2a44'; c.lineWidth = 3
    c.beginPath(); c.roundRect(s.rim.x - 72, s.rim.y - 110, 12, 128, 4); c.fill(); c.stroke()
    const sw = Math.sin(s.net * 9) * s.net * 6
    c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 2
    for (let i = 0; i <= 5; i++) { const x0 = s.rim.x - 44 + i * 17.6; c.beginPath(); c.moveTo(x0, s.rim.y); c.lineTo(s.rim.x - 30 + i * 12 + sw, s.rim.y + 46); c.stroke() }
    c.strokeStyle = '#1f2a44'; c.globalAlpha = 0.25; for (let i = 0; i <= 5; i++) { const x0 = s.rim.x - 44 + i * 17.6; c.beginPath(); c.moveTo(x0, s.rim.y); c.lineTo(s.rim.x - 30 + i * 12 + sw, s.rim.y + 46); c.stroke() } c.globalAlpha = 1
    ball(c, s.ball, '🏀', now)
    c.strokeStyle = '#e8590c'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(s.rim.x - 60, s.rim.y); c.lineTo(s.rim.x + 46, s.rim.y); c.stroke(); c.lineCap = 'butt'
  } else if (game === 'goal') {
    for (let i = 0; i < 7; i++) { c.fillStyle = i % 2 ? '#c9efc4' : '#b9e7b3'; c.fillRect(0, 100 + i * 46, W, 46) }
    c.strokeStyle = '#ffffff'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 128); c.lineTo(W, 128); c.stroke()
    const gx = W / 2 - 130, sw = Math.sin(s.net * 10) * s.net * 5
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(gx, 40, 260, 88)
    c.strokeStyle = 'rgba(31,42,68,.18)'; c.lineWidth = 1.5
    for (let x = gx; x <= gx + 260; x += 20) { c.beginPath(); c.moveTo(x, 40); c.lineTo(x + sw, 128); c.stroke() }
    for (let y = 40; y <= 128; y += 18) { c.beginPath(); c.moveTo(gx, y + sw / 2); c.lineTo(gx + 260, y + sw / 2); c.stroke() }
    // keeper
    const k = s.keeper.x
    c.fillStyle = '#ffd25e'; c.beginPath(); c.roundRect(k - 22, 70, 44, 50, 12); c.fill()
    c.fillStyle = '#f1c27d'; c.beginPath(); c.arc(k, 58, 15, 0, 7); c.fill()
    c.fillStyle = '#1f2a44'; c.beginPath(); c.arc(k - 5, 57, 2.5, 0, 7); c.arc(k + 5, 57, 2.5, 0, 7); c.fill()
    c.fillStyle = '#2c8f65'; c.beginPath(); c.arc(k - 42, 74, 10, 0, 7); c.arc(k + 42, 74, 10, 0, 7); c.fill()
    c.strokeStyle = '#ffd25e'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(k - 20, 80); c.lineTo(k - 38, 75); c.moveTo(k + 20, 80); c.lineTo(k + 38, 75); c.stroke(); c.lineCap = 'butt'
    c.strokeStyle = '#ffffff'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(gx, 128); c.lineTo(gx, 40); c.lineTo(gx + 260, 40); c.lineTo(gx + 260, 128); c.stroke(); c.lineCap = 'butt'
    ball(c, s.ball, '⚽', now)
  } else {
    // the lane
    c.fillStyle = '#f3e0c7'; c.fillRect(W / 2 - 110, 0, 220, H)
    c.fillStyle = '#e9d0b0'; for (let x = W / 2 - 110; x < W / 2 + 110; x += 22) c.fillRect(x, 0, 1.5, H)
    c.fillStyle = '#d3dbec'; c.fillRect(W / 2 - 126, 0, 16, H); c.fillRect(W / 2 + 110, 0, 16, H)
    c.fillStyle = '#b5471c'; for (const y of [250, 270]) for (const dx of [-40, -20, 0, 20, 40]) { c.beginPath(); c.moveTo(W / 2 + dx, y); c.lineTo(W / 2 + dx - 5, y + 9); c.lineTo(W / 2 + dx + 5, y + 9); c.fill() }
    for (const p of [...s.pins].sort((a, b) => a.y - b.y)) {
      c.save(); c.translate(p.x, p.y); c.rotate(p.down ? p.rot + 1.2 : 0); c.globalAlpha = p.down ? 0.55 : 1
      c.fillStyle = '#ffffff'; c.strokeStyle = '#1f2a44'; c.lineWidth = 2
      c.beginPath(); c.ellipse(0, 0, 9, 16, 0, 0, 7); c.fill(); c.stroke()
      c.beginPath(); c.arc(0, -18, 6, 0, 7); c.fill(); c.stroke()
      c.fillStyle = '#e03131'; c.fillRect(-8, -9, 16, 4)
      c.restore(); c.globalAlpha = 1
    }
    ball(c, s.ball, '🎳', now, '#6a4fcf')
  }
}

function ball(c: CanvasRenderingContext2D, b: Ball, e: string, now: number, color?: string) {
  const r = BR * b.s
  c.fillStyle = 'rgba(31,42,68,.18)'; c.beginPath(); c.ellipse(b.x, b.y + r * 0.9, r * 0.8, r * 0.25, 0, 0, 7); c.fill()
  const bob = b.live ? 0 : Math.sin(now / 300) * 2
  if (color) {
    c.fillStyle = color; c.beginPath(); c.arc(b.x, b.y + bob, r, 0, 7); c.fill()
    c.fillStyle = '#1f2a44'; for (const [dx, dy] of [[-6, -6], [4, -9], [6, 2]]) { c.beginPath(); c.arc(b.x + dx * b.s, b.y + bob + dy * b.s, 3.2 * b.s, 0, 7); c.fill() }
  } else {
    c.font = `${r * 2.1}px ${EMOJI_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'
    c.fillStyle = '#000' // an emoji takes the fill's alpha: keep it fully opaque
    c.fillText(e, b.x, b.y + bob + 2)
  }
  if (!b.live) {
    // a little ring that says "grab me"
    c.strokeStyle = 'rgba(31,111,189,.5)'; c.lineWidth = 2; c.setLineDash([5, 5])
    c.beginPath(); c.arc(b.x, b.y + bob, r + 8 + Math.sin(now / 250) * 2, 0, 7); c.stroke(); c.setLineDash([])
  }
}
