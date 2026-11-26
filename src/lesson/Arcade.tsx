import { RichText } from '../worlds/Art'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { ArcadeStep } from '../curriculum/lessonTypes'
import { Sprout } from '../ds/Sprout'
import { useI18n } from '../i18n/I18n'
import { sfx } from '../lib/sfx'
import type { Report } from './Steps'
import { artImage } from '../worlds/Art'

/* A real break between exercises: about a minute and a half of play (the clock runs only while the game is on
   screen), as many shots as fit, and a score. Shoot hoops, kick past the keeper, knock down ten pins, or throw
   darts. They are honest games, not give-aways: there's no magnet pulling the ball in. The hoop has a rim the ball
   bounces off and moves after every basket, the keeper reads the kick, the pins don't all fall from one touch,
   and the dartboard sways while every dart wobbles a little. Not graded; the lesson goes on when time is up. */

const W = 600, H = 420, BR = 26
type Game = ArcadeStep['game']
type Ball = { x: number; y: number; vx: number; vy: number; live: boolean; t: number; s: number }
type Pin = { x: number; y: number; down: boolean; vx: number; vy: number; rot: number }
type Dart = { x: number; y: number; pts: number }
type State = {
  S: number; ball: Ball; drag: null | { pts: [number, number, number][] }
  keeper: { x: number; t: number; target: number }; pins: Pin[]; rolls: number; frameDown: number
  net: number; flash: number; scored: boolean; rim: { x: number; y: number }; score: number
  board: { x: number; y: number; t: number }; darts: Dart[]; flight: null | { x0: number; y0: number; vx: number; vy: number; t: number; wob: [number, number] }
  elapsed: number; over: boolean
}

/** Dart rings, from the middle out: [radius, points]. The bullseye is tiny on purpose. */
const RINGS: [number, number][] = [[8, 50], [24, 10], [48, 8], [72, 6], [96, 4], [118, 2]]
const DART_T = 0.5, DART_G = 1400

export function Arcade({ step, report }: { step: ArcadeStep; report: Report }) {
  const { t, pick } = useI18n()
  const wrap = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const seconds = step.seconds ?? 90
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(seconds)
  const [over, setOver] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const st = useRef<State>({
    S: 1, ball: home(step.game), drag: null, keeper: { x: W / 2, t: 0, target: W / 2 }, pins: rack(), rolls: 0, frameDown: 0,
    net: 0, flash: 0, scored: false, rim: { x: 150, y: 150 }, score: 0, board: { x: W / 2, y: 160, t: 0 }, darts: [], flight: null,
    elapsed: 0, over: false,
  })

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
  const add = (n: number, m: string) => {
    const s = st.current
    if (s.over) return
    s.score += n; setScore(s.score); s.flash = 1
    if (n > 0) sfx.combo(Math.min(8, 2 + Math.round(n / 3)))
    say(m)
  }
  const miss = (m: string) => { sfx.unplace(); say(m) }

  // the game loop; the clock only runs while it's drawing (a hidden tab doesn't eat the break)
  useEffect(() => {
    let raf = 0, last = performance.now(), shown = seconds
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000); last = now
      const s = st.current
      if (!s.over) {
        s.elapsed += dt
        const l = Math.max(0, Math.ceil(seconds - s.elapsed))
        if (l !== shown) { shown = l; setLeft(l) }
        if (s.elapsed >= seconds) { s.over = true; s.drag = null; setOver(true); sfx.partDone(); report(true, true) }
      }
      if (step.game === 'hoop') stepHoop(s, dt, () => { add(1, pick({ he: 'סַל!', en: 'Score!' })); moveHoop(s) }, () => miss(t('arcade.almost')))
      else if (step.game === 'goal') stepGoal(s, dt, () => add(1, pick({ he: 'גּוֹל!', en: 'Goal!' })), (saved) => miss(saved ? t('arcade.saved') : t('arcade.almost')))
      else if (step.game === 'bowl') stepBowl(s, dt, (n, label) => add(n, label === 'strike' ? t('arcade.bowl.strike') : label === 'spare' ? t('arcade.bowl.spare') : t('arcade.pins', { n })), () => miss(t('arcade.bowl.gutter')))
      else stepDart(s, dt, (p) => (p ? add(p, t('arcade.dart.pts', { n: p })) : miss(t('arcade.dart.miss'))))
      s.net = Math.max(0, s.net - dt * 1.6); s.flash = Math.max(0, s.flash - dt * 2)
      const c = cv.current?.getContext('2d'); if (c) draw(c, s, step.game, now)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.game])

  // flick: drag the ball (or dart) and let go — speed and direction come from the last moments of the drag
  const world = (e: React.PointerEvent) => { const r = cv.current!.getBoundingClientRect(); const S = st.current.S; return [(e.clientX - r.left) / S, (e.clientY - r.top) / S] as [number, number] }
  const down = (e: React.PointerEvent) => {
    const s = st.current; if (s.ball.live || s.flight || s.over) return
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
    if (Math.hypot(vx, vy) < 250 || vy > -120) { s.ball = home(step.game, s); return }
    if (step.game === 'dart') {
      // every dart wobbles a little: even a perfect throw doesn't always find the bullseye
      s.flight = { x0: s.ball.x, y0: s.ball.y, vx, vy, t: 0, wob: [gauss() * 9, gauss() * 9] }
      sfx.pop(); return
    }
    if (step.game === 'hoop') [vx, vy] = steady(s, vx, vy)
    Object.assign(s.ball, { vx, vy, live: true, t: 0 }); s.scored = false; sfx.pop()
  }

  const mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, '0')
  return (
    <div>
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="t-h1 m-0 text-center"><RichText text={pick(step.title)} /></motion.h2>
      <p className="t-small ink-2 text-center mt-1 mb-0">{t(`arcade.hint.${step.game}`)}</p>
      <div className="flex items-center justify-center gap-4 mt-2" aria-live="off">
        <span className="chip chip-sun" style={{ height: 34, fontSize: 18, fontWeight: 800 }}>{t('arcade.score', { n: score })}</span>
        <span className="flex items-center gap-2" aria-label={t('arcade.left', { t: `${mm}:${ss}` })}>
          <span className="t-num font-bold" style={{ fontSize: 18, minWidth: 44 }}>{mm}:{ss}</span>
          <span className="block h-2.5 w-28 rounded-full overflow-hidden" style={{ background: 'var(--line)' }}>
            <span className="block h-full rounded-full" style={{ width: `${(100 * left) / seconds}%`, background: 'var(--brand)', transition: 'width 1s linear' }} />
          </span>
        </span>
      </div>
      <div ref={wrap} className="mt-3 w-full flex justify-center relative">
        <canvas ref={cv} role="img" aria-label={t('arcade.aria', { s: score })} className="rounded-2xl touch-none"
          style={{ background: 'var(--surface-2)', border: '1.5px solid var(--line)' }}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
        <AnimatePresence>
          {msg && !over && (
            <motion.span key={msg} className="absolute top-[52%] left-1/2 -translate-x-1/2 chip chip-sun pointer-events-none" style={{ height: 38, fontSize: 20, fontWeight: 800 }}
              initial={{ y: -10, opacity: 0, scale: 0.6 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ opacity: 0 }} role="status">{msg}</motion.span>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {over && (
          <motion.div className="flex items-center justify-center gap-3 mt-3" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} role="status">
            <Sprout size={64} stage={2} mood="cheer" />
            <span className="t-h2" style={{ color: 'var(--brand-ink)' }}>{t(`arcade.over.${step.game}`, { n: score })}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────── shared bits ───────── */

function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) }

function home(game: Game, s?: State): Ball {
  if (game === 'hoop') return { x: s ? s.rim.x + 320 : 470, y: 350, vx: 0, vy: 0, live: false, t: 0, s: 1 }
  return { x: W / 2, y: 360, vx: 0, vy: 0, live: false, t: 0, s: 1 }
}
function rack(): Pin[] {
  // ten pins: 1 · 2 · 3 · 4 rows, the head pin nearest the player
  const out: Pin[] = []
  for (let r = 0; r < 4; r++) for (let i = 0; i <= r; i++) out.push({ x: W / 2 + (i - r / 2) * 30, y: 150 - r * 26, down: false, vx: 0, vy: 0, rot: 0 })
  return out
}

/** Basketball keeps the child's own aim; it only evens out a wild flick a little, so the strength still has to be right. */
function steady(s: State, vx: number, vy: number): [number, number] {
  const sp = Math.min(1500, Math.hypot(vx, vy)), ang = Math.atan2(-vy, -vx)
  const dx = s.ball.x - s.rim.x, up = s.ball.y - (s.rim.y - 6), g = 1100
  const den = 2 * Math.cos(ang) ** 2 * (dx * Math.tan(ang) - up)
  if (dx > 0 && ang > 0.05 && ang < 1.5 && den > 0) {
    const ideal = Math.sqrt((g * dx * dx) / den), v = ideal * Math.pow(sp / ideal, 0.8)
    return [-Math.cos(ang) * v, -Math.sin(ang) * v]
  }
  return [vx, vy]
}

/* ───────── basketball ───────── */

/** After every basket the hoop moves, so the next shot needs a new strength. */
function moveHoop(s: State) { s.rim = { x: 110 + Math.random() * 110, y: 120 + Math.random() * 70 } }

function stepHoop(s: State, dt: number, point: () => void, miss: () => void) {
  const b = s.ball; if (!b.live) { if (!s.drag) b.x = s.rim.x + 320; return }
  const sub = 4, edges = [s.rim.x - 44, s.rim.x + 44]
  for (let i = 0; i < sub; i++) {
    const h = dt / sub
    b.vy += 1100 * h
    const py = b.y
    b.x += b.vx * h; b.y += b.vy * h
    // backboard
    if (b.x - BR < s.rim.x - 62 && b.y > s.rim.y - 110 && b.y < s.rim.y + 15 && b.vx < 0) { b.x = s.rim.x - 62 + BR; b.vx *= -0.5 }
    // the rim: two hard edges the ball bounces off
    for (const ex of edges) {
      const dx = b.x - ex, dy = b.y - s.rim.y, d = Math.hypot(dx, dy)
      if (d < BR + 3 && d > 0) {
        const nx = dx / d, ny = dy / d, vn = b.vx * nx + b.vy * ny
        if (vn < 0) { b.vx -= 1.6 * vn * nx; b.vy -= 1.6 * vn * ny; b.vx *= 0.85; b.vy *= 0.85; sfx.place(1) }
        b.x = ex + nx * (BR + 3); b.y = s.rim.y + ny * (BR + 3)
      }
    }
    if (!s.scored && py < s.rim.y && b.y >= s.rim.y && Math.abs(b.x - s.rim.x) < 30 && b.vy > 0) { s.scored = true; s.net = 1; point() }
  }
  b.t += dt
  if (b.y > H + BR || b.x < -BR || b.x > W + BR || b.t > 3.2) { if (!s.scored) miss(); s.ball = home('hoop', s) }
}

/* ───────── soccer ───────── */

const POST = 118 // half the goal's width
function stepGoal(s: State, dt: number, point: () => void, miss: (saved: boolean) => void) {
  const k = s.keeper, b = s.ball
  if (!b.live) { k.t += dt; k.x = W / 2 + 90 * Math.sin(k.t * 1.7) }
  else {
    // the keeper reads the kick: he heads for where the ball will cross the line
    const tt = b.vy < 0 ? (b.y - 128) / -b.vy : 0
    k.target = Math.max(W / 2 - POST, Math.min(W / 2 + POST, b.x + b.vx * tt))
    k.x += Math.sign(k.target - k.x) * Math.min(Math.abs(k.target - k.x), 280 * dt)
  }
  if (!b.live) return
  b.x += b.vx * dt; b.y += b.vy * dt; b.s = Math.max(0.55, 1 - (360 - b.y) / 520); b.t += dt
  if (!s.scored && b.y <= 128) {
    s.scored = true
    const inGoal = Math.abs(b.x - W / 2) < POST - 8, saved = inGoal && Math.abs(b.x - k.x) < 46
    if (inGoal && !saved) { s.net = 1; point() } else miss(saved)
    window.setTimeout(() => { s.ball = home('goal') }, 650)
    b.vx = saved ? (b.x - k.x) * 3 : b.vx; b.vy = saved ? 260 : -60
  }
  if (b.t > 2.4) s.ball = home('goal')
}

/* ───────── bowling ───────── */

const LANE = 110
function stepBowl(s: State, dt: number, scored: (n: number, label?: 'strike' | 'spare') => void, gutter: () => void) {
  const b = s.ball
  for (const p of s.pins) if (p.down) { p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vx * dt * 0.05; p.vx *= 0.96; p.vy *= 0.96 }
  if (!b.live) return
  b.x += b.vx * dt; b.y += b.vy * dt; b.t += dt
  const inGutter = Math.abs(b.x - W / 2) > LANE - 8
  if (inGutter) { b.x = W / 2 + Math.sign(b.x - W / 2) * (LANE + 4); b.vx = 0 } // a ball off the lane rolls down the gutter
  else for (const p of s.pins) {
    if (!p.down && Math.hypot(p.x - b.x, p.y - b.y) < BR + 9) {
      p.down = true; p.vx = (p.x - b.x) * 6 + (Math.random() - 0.5) * 80; p.vy = -160 - Math.random() * 80; sfx.place(s.pins.filter((q) => q.down).length)
      b.vx += (b.x - p.x) * 0.8 // the ball is pushed aside a little by every pin
      // a falling pin may knock a neighbour behind it, but not always
      for (const q of s.pins) if (!q.down && q.y < p.y && Math.abs(q.x - p.x) < 34 && Math.random() < 0.6) { q.down = true; q.vx = (q.x - p.x) * 5; q.vy = -140 }
    }
  }
  if (b.y < -BR || b.t > 2.2) {
    s.rolls += 1
    const downNow = s.pins.filter((p) => p.down).length, n = downNow - s.frameDown
    s.frameDown = downNow
    if (n === 0) gutter()
    else scored(n, downNow === 10 ? (s.rolls === 1 ? 'strike' : 'spare') : undefined)
    if (downNow === 10 || s.rolls >= 2) { s.pins = rack(); s.rolls = 0; s.frameDown = 0 }
    s.ball = home('bowl')
  }
}

/* ───────── darts ───────── */

function stepDart(s: State, dt: number, landed: (pts: number) => void) {
  // the board sways from side to side, a little faster as the score grows
  s.board.t += dt * (0.8 + Math.min(0.6, s.score / 150))
  const prevX = s.board.x
  s.board.x = W / 2 + 95 * Math.sin(s.board.t)
  for (const d of s.darts) d.x += s.board.x - prevX
  const f = s.flight
  if (!f) return
  f.t += dt
  if (f.t >= DART_T) {
    const x = f.x0 + f.vx * DART_T + f.wob[0], y = f.y0 + f.vy * DART_T + 0.5 * DART_G * DART_T * DART_T + f.wob[1]
    const r = Math.hypot(x - s.board.x, y - s.board.y), ring = RINGS.find(([rr]) => r <= rr)
    const pts = ring ? ring[1] : 0
    if (ring) { s.darts = [...s.darts.slice(-2), { x, y, pts }]; sfx.place(3) }
    s.flight = null
    s.ball = home('dart')
    landed(pts)
  }
}

/* ───────── drawing ───────── */

function draw(c: CanvasRenderingContext2D, s: State, game: Game, now: number) {
  c.clearRect(0, 0, W, H)
  if (game === 'hoop') {
    c.fillStyle = '#f3e0c7'; c.fillRect(0, H - 40, W, 40)
    c.fillStyle = '#c99a6a'; for (let x = 0; x < W; x += 60) c.fillRect(x, H - 40, 2, 40)
    // pole, board, rim and net
    c.fillStyle = '#9aa5b8'; c.fillRect(s.rim.x - 78, s.rim.y + 10, 10, H - s.rim.y - 50)
    c.fillStyle = '#ffffff'; c.strokeStyle = '#1f2a44'; c.lineWidth = 3
    c.beginPath(); c.roundRect(s.rim.x - 72, s.rim.y - 110, 12, 128, 4); c.fill(); c.stroke()
    const sw = Math.sin(s.net * 9) * s.net * 6
    for (const [col, a] of [['rgba(255,255,255,.95)', 1], ['#1f2a44', 0.25]] as const) {
      c.strokeStyle = col; c.globalAlpha = a; c.lineWidth = 2
      for (let i = 0; i <= 5; i++) { const x0 = s.rim.x - 44 + i * 17.6; c.beginPath(); c.moveTo(x0, s.rim.y); c.lineTo(s.rim.x - 30 + i * 12 + sw, s.rim.y + 46); c.stroke() }
    }
    c.globalAlpha = 1
    ball(c, s.ball, '🏀', now)
    c.strokeStyle = '#e8590c'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(s.rim.x - 60, s.rim.y); c.lineTo(s.rim.x + 44, s.rim.y); c.stroke(); c.lineCap = 'butt'
  } else if (game === 'goal') {
    for (let i = 0; i < 7; i++) { c.fillStyle = i % 2 ? '#c9efc4' : '#b9e7b3'; c.fillRect(0, 100 + i * 46, W, 46) }
    c.strokeStyle = '#ffffff'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 128); c.lineTo(W, 128); c.stroke()
    const gx = W / 2 - POST, gw = POST * 2, sw = Math.sin(s.net * 10) * s.net * 5
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(gx, 40, gw, 88)
    c.strokeStyle = 'rgba(31,42,68,.18)'; c.lineWidth = 1.5
    for (let x = gx; x <= gx + gw; x += 20) { c.beginPath(); c.moveTo(x, 40); c.lineTo(x + sw, 128); c.stroke() }
    for (let y = 40; y <= 128; y += 18) { c.beginPath(); c.moveTo(gx, y + sw / 2); c.lineTo(gx + gw, y + sw / 2); c.stroke() }
    // keeper
    const k = s.keeper.x
    c.fillStyle = '#ffd25e'; c.beginPath(); c.roundRect(k - 22, 70, 44, 50, 12); c.fill()
    c.fillStyle = '#f1c27d'; c.beginPath(); c.arc(k, 58, 15, 0, 7); c.fill()
    c.fillStyle = '#1f2a44'; c.beginPath(); c.arc(k - 5, 57, 2.5, 0, 7); c.arc(k + 5, 57, 2.5, 0, 7); c.fill()
    c.fillStyle = '#2c8f65'; c.beginPath(); c.arc(k - 44, 74, 10, 0, 7); c.arc(k + 44, 74, 10, 0, 7); c.fill()
    c.strokeStyle = '#ffd25e'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(k - 20, 80); c.lineTo(k - 40, 75); c.moveTo(k + 20, 80); c.lineTo(k + 40, 75); c.stroke(); c.lineCap = 'butt'
    c.strokeStyle = '#ffffff'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(gx, 128); c.lineTo(gx, 40); c.lineTo(gx + gw, 40); c.lineTo(gx + gw, 128); c.stroke(); c.lineCap = 'butt'
    ball(c, s.ball, '⚽', now)
  } else if (game === 'bowl') {
    c.fillStyle = '#d3dbec'; c.fillRect(W / 2 - LANE - 16, 0, 16, H); c.fillRect(W / 2 + LANE, 0, 16, H) // gutters
    c.fillStyle = '#f3e0c7'; c.fillRect(W / 2 - LANE, 0, LANE * 2, H)
    c.fillStyle = '#e9d0b0'; for (let x = W / 2 - LANE; x < W / 2 + LANE; x += 22) c.fillRect(x, 0, 1.5, H)
    c.fillStyle = '#b5471c'; for (const y of [250, 270]) for (const dx of [-40, -20, 0, 20, 40]) { c.beginPath(); c.moveTo(W / 2 + dx, y); c.lineTo(W / 2 + dx - 5, y + 9); c.lineTo(W / 2 + dx + 5, y + 9); c.fill() }
    for (const p of [...s.pins].sort((a, b) => a.y - b.y)) {
      c.save(); c.translate(p.x, p.y); c.rotate(p.down ? p.rot + 1.2 : 0); c.globalAlpha = p.down ? 0.55 : 1
      c.fillStyle = '#ffffff'; c.strokeStyle = '#1f2a44'; c.lineWidth = 2
      c.beginPath(); c.ellipse(0, 0, 8, 14, 0, 0, 7); c.fill(); c.stroke()
      c.beginPath(); c.arc(0, -16, 5.5, 0, 7); c.fill(); c.stroke()
      c.fillStyle = '#e03131'; c.fillRect(-7, -8, 14, 3.5)
      c.restore(); c.globalAlpha = 1
    }
    ball(c, s.ball, '🎳', now, '#6a4fcf')
  } else {
    // dartboard on the wall
    c.fillStyle = '#eadfce'; c.fillRect(0, 0, W, H)
    const { x: bx, y: by } = s.board
    c.fillStyle = '#5b3a1e'; c.beginPath(); c.arc(bx, by, RINGS[RINGS.length - 1][0] + 12, 0, 7); c.fill()
    const cols = ['#e5383b', '#2e9a48', '#ffffff', '#2f2f3a', '#ffffff', '#2e9a48']
    for (let i = RINGS.length - 1; i >= 0; i--) {
      c.fillStyle = i === 0 ? '#e5383b' : cols[i]; c.strokeStyle = '#1f2a44'; c.lineWidth = 1.5
      c.beginPath(); c.arc(bx, by, RINGS[i][0], 0, 7); c.fill(); c.stroke()
    }
    c.fillStyle = '#1f2a44'; c.font = 'bold 13px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'
    for (let i = 1; i < RINGS.length; i++) {
      const r = (RINGS[i][0] + RINGS[i - 1][0]) / 2
      c.fillStyle = cols[i] === '#2f2f3a' ? '#ffffff' : '#1f2a44'; c.fillText(String(RINGS[i][1]), bx, by - r)
    }
    for (const d of s.darts) dart(c, d.x, d.y, 0.7, true)
    // a dart in flight shrinks as it goes toward the board
    const f = s.flight
    if (f) {
      const k = f.t / DART_T
      const x = f.x0 + f.vx * f.t + f.wob[0] * k, y = f.y0 + f.vy * f.t + 0.5 * DART_G * f.t * f.t + f.wob[1] * k
      dart(c, x, y, 1 - 0.3 * k, false)
    } else {
      const bob = s.drag ? 0 : Math.sin(now / 300) * 2
      dart(c, s.ball.x, s.ball.y + bob, 1, false)
      if (!s.drag) { c.strokeStyle = 'rgba(31,111,189,.5)'; c.lineWidth = 2; c.setLineDash([5, 5]); c.beginPath(); c.arc(s.ball.x, s.ball.y + bob, BR + 8 + Math.sin(now / 250) * 2, 0, 7); c.stroke(); c.setLineDash([]) }
    }
  }
}

/** A dart pointing up; stuck darts are drawn from the tip. */
function dart(c: CanvasRenderingContext2D, x: number, y: number, k: number, stuck: boolean) {
  c.save(); c.translate(x, y); c.scale(k, k)
  const top = stuck ? 0 : -26
  c.strokeStyle = '#1f2a44'; c.lineWidth = 2
  c.fillStyle = '#9aa0a6'; c.beginPath(); c.moveTo(0, top); c.lineTo(-3, top + 10); c.lineTo(3, top + 10); c.closePath(); c.fill(); c.stroke()
  c.fillStyle = '#ffc83d'; c.beginPath(); c.roundRect(-4, top + 10, 8, 26, 3); c.fill(); c.stroke()
  c.fillStyle = '#1d70d8'; c.beginPath(); c.moveTo(0, top + 34); c.lineTo(-11, top + 50); c.lineTo(0, top + 45); c.lineTo(11, top + 50); c.closePath(); c.fill(); c.stroke()
  c.restore()
}

function ball(c: CanvasRenderingContext2D, b: Ball, e: string, now: number, color?: string) {
  const r = BR * b.s
  c.fillStyle = 'rgba(31,42,68,.18)'; c.beginPath(); c.ellipse(b.x, b.y + r * 0.9, r * 0.8, r * 0.25, 0, 0, 7); c.fill()
  const bob = b.live ? 0 : Math.sin(now / 300) * 2
  if (color) {
    c.fillStyle = color; c.beginPath(); c.arc(b.x, b.y + bob, r, 0, 7); c.fill()
    c.fillStyle = '#1f2a44'; for (const [dx, dy] of [[-6, -6], [4, -9], [6, 2]]) { c.beginPath(); c.arc(b.x + dx * b.s, b.y + bob + dy * b.s, 3.2 * b.s, 0, 7); c.fill() }
  } else {
    // the ball is our own drawing (loaded once; until then a plain ball)
    const img = artImage(e)
    if (img && img.complete) c.drawImage(img, b.x - r * 1.08, b.y + bob - r * 1.08, r * 2.16, r * 2.16)
    else { c.fillStyle = '#f77f00'; c.beginPath(); c.arc(b.x, b.y + bob, r, 0, 7); c.fill() }
  }
  if (!b.live) {
    // a little ring that says "grab me"
    c.strokeStyle = 'rgba(31,111,189,.5)'; c.lineWidth = 2; c.setLineDash([5, 5])
    c.beginPath(); c.arc(b.x, b.y + bob, r + 8 + Math.sin(now / 250) * 2, 0, 7); c.stroke(); c.setLineDash([])
  }
}
