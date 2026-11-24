import { useEffect, useState } from 'react'

/* Little synthesized sounds (WebAudio, no files), the same family as the letters and fridge games:
   soft pops on taps, rising notes when things click into place, a chime for a right answer,
   a gentle "boop" for a wrong one, and a fanfare when a part is done. On/off is remembered. */

const KEY = 'kfitza.sound'
let on = (() => { try { return localStorage.getItem(KEY) !== 'off' } catch { return true } })()
const listeners = new Set<(v: boolean) => void>()

export const soundOn = () => on
export function setSound(v: boolean) {
  on = v
  try { localStorage.setItem(KEY, v ? 'on' : 'off') } catch { /* private mode */ }
  listeners.forEach((l) => l(v))
  if (v) sfx.pop()
}
export function useSound() {
  const [v, setV] = useState(on)
  useEffect(() => { listeners.add(setV); return () => { listeners.delete(setV) } }, [])
  return [v, setSound] as const
}

let ctx: AudioContext | null = null
function ac() {
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!C) return null
    ctx = new C()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(f: number, dur: number, type: OscillatorType = 'triangle', when = 0, vol = 0.14) {
  if (!on) return
  try {
    const a = ac(); if (!a) return
    const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + when
    o.type = type; o.frequency.value = f
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02)
  } catch { /* audio unavailable */ }
}
function sweep(f1: number, f2: number, dur: number, type: OscillatorType = 'sine', vol = 0.1, when = 0) {
  if (!on) return
  try {
    const a = ac(); if (!a) return
    const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + when
    o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur)
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02)
  } catch { /* audio unavailable */ }
}

// a happy pentatonic ladder: each step up sounds a little more exciting
const NOTES = [523, 587, 659, 784, 880, 1047, 1175, 1319, 1568, 1760, 2093]
const note = (i: number) => NOTES[Math.max(0, i) % NOTES.length]

export const sfx = {
  /** Any button. Quiet, so it never competes with the real feedback. */
  tap() { sweep(500, 820, 0.06, 'sine', 0.05) },
  pop() { sweep(420, 900, 0.09, 'sine', 0.09) },
  /** Choosing an answer card. */
  pick() { tone(880, 0.08, 'sine', 0, 0.09) },
  /** Something placed in order (the i-th one climbs a note higher). */
  place(i: number) { const f = note(i); tone(f, 0.22, 'triangle', 0, 0.13); tone(f * 2, 0.16, 'sine', 0.03, 0.04) },
  unplace() { sweep(600, 380, 0.09, 'sine', 0.07) },
  correct() { [659, 784, 1047].forEach((f, i) => tone(f, 0.26, 'triangle', i * 0.08, 0.13)) },
  /** Right answers in a row: the chime climbs with the streak. */
  combo(n: number) { [0, 2, 4].forEach((k, i) => tone(note(n + k), 0.24, 'triangle', i * 0.07, 0.12)); tone(note(n + 6), 0.4, 'sine', 0.22, 0.06) },
  wrong() { sweep(330, 190, 0.22, 'sine', 0.12); tone(196, 0.18, 'triangle', 0.12, 0.05) },
  sparkle() { [1568, 2093, 2637].forEach((f, i) => tone(f, 0.14, 'sine', i * 0.06, 0.05)) },
  partDone() {
    [523, 659, 784].forEach((f) => tone(f, 0.9, 'triangle', 0, 0.07))
    ;[784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.3, 'square', 0.2 + i * 0.09, 0.035))
    ;[1568, 2093, 2637, 3136].forEach((f, i) => tone(f, 0.22, 'sine', 0.66 + i * 0.06, 0.05))
  },
  lessonDone() { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, 0.32, 'triangle', i * 0.12, 0.12)) },
  /** A part rests for a while: soft and calm, not a punishment. */
  rest() { [523, 440, 392].forEach((f, i) => tone(f, 0.35, 'sine', i * 0.16, 0.08)) },
  /** Piko bounces when tapped. */
  boing() { sweep(300, 760, 0.12, 'triangle', 0.08); sweep(760, 520, 0.12, 'sine', 0.05, 0.1) },
  /** A friend chosen. */
  chosen() { sweep(400, 1200, 0.18, 'triangle', 0.07); [784, 1047, 1319].forEach((f, i) => tone(f, 0.2, 'sine', 0.12 + i * 0.07, 0.08)) },
  /** Piko wakes up. */
  wake() { sweep(180, 900, 0.5, 'sine', 0.1); [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.4, 'triangle', 0.4 + i * 0.1, 0.1)) },
}

/** Every button gets a soft tap sound, like in the games. Installed once at startup. */
export function installTapSound() {
  document.addEventListener('pointerdown', (e) => {
    const b = (e.target as Element | null)?.closest?.('button, [role="button"], a')
    if (b && !(b as HTMLButtonElement).disabled) sfx.tap()
  }, { capture: true, passive: true })
}
