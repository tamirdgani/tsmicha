/* Drawn pictures for the school topics: an analog clock, shekel coins, a pizza or a bar cut into parts,
   an object against a ruler, flat shapes and solids, a dice face, a ten-frame and a bar graph.
   They are plain SVG, sized by `s` (the card size), in the app's flat outlined style. */

import type { Tile } from '../curriculum/lessonTypes'
import { artMarkup } from '../worlds/Art'

const INK = '#2b2b3a'

export function ClockFace({ h, m, s = 84 }: { h: number; m: number; s?: number }) {
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6
  const hand = (deg: number, len: number, w: number, c: string) => {
    const a = ((deg - 90) * Math.PI) / 180
    return <line x1="50" y1="50" x2={50 + len * Math.cos(a)} y2={50 + len * Math.sin(a)} stroke={c} strokeWidth={w} strokeLinecap="round" />
  }
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#fff" stroke={INK} strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180
        return <text key={i} x={50 + 33 * Math.cos(a)} y={50 + 33 * Math.sin(a) + 4.5} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily="system-ui, sans-serif">{i || 12}</text>
      })}
      {hand(ha, 22, 6, INK)}
      {hand(ma, 34, 3.5, '#e5383b')}
      <circle cx="50" cy="50" r="4" fill={INK} />
    </svg>
  )
}

const COIN: Record<number, { fill: string; ring: string; r: number }> = {
  1: { fill: '#d9dde3', ring: '#9aa0a6', r: 15 }, 2: { fill: '#d9dde3', ring: '#9aa0a6', r: 17 },
  5: { fill: '#e3e6ea', ring: '#8a9099', r: 19 }, 10: { fill: '#f2d27a', ring: '#c9a13b', r: 21 },
}
export function Coins({ values, s = 84 }: { values: number[]; s?: number }) {
  const k = s / 64
  return (
    <span className="inline-flex flex-wrap items-center justify-center" style={{ gap: 4 * k, maxWidth: s * 1.9 }}>
      {values.map((v, i) => {
        const c = COIN[v] ?? COIN[1], d = c.r * 2 * k
        return (
          <svg key={i} width={d} height={d} viewBox="0 0 44 44" aria-label={`${v} שקלים`}>
            <circle cx="22" cy="22" r="20" fill={c.fill} stroke={c.ring} strokeWidth="3" />
            <circle cx="22" cy="22" r="15" fill="none" stroke={c.ring} strokeWidth="1.2" opacity=".6" />
            <text x="22" y="27" textAnchor="middle" fontSize={v >= 10 ? 15 : 17} fontWeight="800" fill={INK} fontFamily="system-ui, sans-serif">{v}₪</text>
          </svg>
        )
      })}
    </span>
  )
}

/** A pizza (`pie`) or a chocolate bar (`bar`) cut into `d` parts, `n` of them coloured; `uneven` cuts it into unequal parts. */
export function Fraction({ n, d, kind = 'pie', uneven, s = 84 }: { n: number; d: number; kind?: 'pie' | 'bar'; uneven?: boolean; s?: number }) {
  if (kind === 'bar') {
    const widths = uneven ? Array.from({ length: d }, (_, i) => (i === 0 ? 1.8 : 1)) : Array(d).fill(1)
    const total = widths.reduce((a, b) => a + b, 0)
    let x = 4
    return (
      <svg width={s * 1.3} height={s * 0.6} viewBox="0 0 130 60" aria-hidden="true">
        {widths.map((w, i) => { const ww = (122 * w) / total, el = <rect key={i} x={x} y="8" width={ww} height="44" fill={i < n ? '#8b5cf6' : '#fff'} stroke={INK} strokeWidth="2.5" />; x += ww; return el })}
      </svg>
    )
  }
  const parts = uneven ? [0.62, ...Array(d - 1).fill(0.38 / (d - 1))] : Array(d).fill(1 / d)
  let a0 = -Math.PI / 2
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="#f7d58b" stroke={INK} strokeWidth="3" />
      {parts.map((p, i) => {
        const a1 = a0 + p * 2 * Math.PI, large = p > 0.5 ? 1 : 0
        const path = d === 1 ? 'M50 6A44 44 0 1 1 49.9 6Z' : `M50 50L${50 + 44 * Math.cos(a0)} ${50 + 44 * Math.sin(a0)}A44 44 0 ${large} 1 ${50 + 44 * Math.cos(a1)} ${50 + 44 * Math.sin(a1)}Z`
        a0 = a1
        return <path key={i} d={path} fill={i < n ? '#e5383b' : '#f7d58b'} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      })}
    </svg>
  )
}

/** An object (a coloured bar) lying on a ruler that starts at 0. Without `ruler`, just the bar (to compare lengths). */
export function Ruler({ len, ruler, color = '#ffc83d', s = 84 }: { len: number; ruler?: boolean; color?: string; s?: number }) {
  const max = 15, unit = 140 / max
  return (
    <svg width={s * 1.9} height={ruler ? s * 0.75 : s * 0.4} viewBox={`0 0 160 ${ruler ? 64 : 34}`} aria-hidden="true">
      <rect x="10" y="6" width={len * unit} height="20" rx="5" fill={color} stroke={INK} strokeWidth="2.5" />
      {ruler && (
        <g>
          <rect x="4" y="32" width="152" height="28" rx="3" fill="#fff6d6" stroke={INK} strokeWidth="2" />
          {Array.from({ length: max + 1 }, (_, i) => (
            <g key={i}>
              <line x1={10 + i * unit} y1="32" x2={10 + i * unit} y2={i % 5 === 0 ? 44 : 40} stroke={INK} strokeWidth="1.5" />
              {i % 5 === 0 || i <= 10 ? <text x={10 + i * unit} y="56" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={INK} fontFamily="system-ui, sans-serif">{i}</text> : null}
            </g>
          ))}
        </g>
      )}
    </svg>
  )
}

export type Poly = 'tri' | 'sq' | 'rect' | 'pent' | 'hex' | 'circle'
export function Polygon({ p, s = 84 }: { p: Poly; s?: number }) {
  const reg = (k: number) => Array.from({ length: k }, (_, i) => { const a = ((i * 360) / k - 90) * (Math.PI / 180); return `${50 + 42 * Math.cos(a)},${54 + 42 * Math.sin(a)}` }).join(' ')
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true">
      {p === 'circle' ? <circle cx="50" cy="50" r="42" fill="#7fd6ff" stroke={INK} strokeWidth="3" />
        : p === 'sq' ? <rect x="12" y="12" width="76" height="76" fill="#9ad98a" stroke={INK} strokeWidth="3" />
          : p === 'rect' ? <rect x="4" y="26" width="92" height="48" fill="#ffb066" stroke={INK} strokeWidth="3" />
            : <polygon points={reg(p === 'tri' ? 3 : p === 'pent' ? 5 : 6)} fill={p === 'tri' ? '#ff8fab' : p === 'pent' ? '#c3a8ff' : '#ffd25e'} stroke={INK} strokeWidth="3" strokeLinejoin="round" />}
    </svg>
  )
}

export type Solid = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'pyramid'
export function SolidShape({ k, s = 84 }: { k: Solid; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-hidden="true" strokeLinejoin="round">
      {k === 'cube' && <g stroke={INK} strokeWidth="3"><path d="M20 35L55 35L55 85L20 85Z" fill="#6db7ff" /><path d="M20 35L40 18L75 18L55 35Z" fill="#a9d4ff" /><path d="M55 35L75 18L75 68L55 85Z" fill="#3f9cf5" /></g>}
      {k === 'sphere' && <g stroke={INK} strokeWidth="3"><circle cx="50" cy="52" r="38" fill="#ff8fab" /><ellipse cx="50" cy="52" rx="38" ry="12" fill="none" strokeDasharray="5 4" opacity=".5" /><ellipse cx="38" cy="38" rx="9" ry="6" fill="#fff" opacity=".6" stroke="none" /></g>}
      {k === 'cylinder' && <g stroke={INK} strokeWidth="3"><path d="M24 24V78A26 9 0 0 0 76 78V24" fill="#9ad98a" /><ellipse cx="50" cy="24" rx="26" ry="9" fill="#c7efbd" /></g>}
      {k === 'cone' && <g stroke={INK} strokeWidth="3"><path d="M50 10L76 80A26 9 0 0 1 24 80Z" fill="#ffb066" /><path d="M24 80A26 9 0 0 0 76 80" fill="none" strokeDasharray="5 4" opacity=".6" /></g>}
      {k === 'pyramid' && <g stroke={INK} strokeWidth="3"><path d="M50 12L18 80L60 88Z" fill="#ffd25e" /><path d="M50 12L60 88L84 72Z" fill="#e8b93a" /></g>}
    </svg>
  )
}

const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[26, 26], [50, 50], [74, 74]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]], 6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
}
export function Dice({ n, s = 70 }: { n: number; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" aria-label={`קובייה: ${n}`}>
      <rect x="6" y="6" width="88" height="88" rx="18" fill="#fff" stroke={INK} strokeWidth="4" />
      {(PIPS[n] ?? []).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" fill={INK} />)}
    </svg>
  )
}

/** Ten boxes in two rows of five; the first `n` have a counter. */
export function TenFrame({ n, s = 84 }: { n: number; s?: number }) {
  return (
    <svg width={s * 1.6} height={s * 0.7} viewBox="0 0 160 70" aria-label={`${n} מתוך 10`}>
      {Array.from({ length: 10 }, (_, i) => {
        const x = 5 + (i % 5) * 30, y = 5 + Math.floor(i / 5) * 30
        return (
          <g key={i}>
            <rect x={x} y={y} width="30" height="30" fill="#fff" stroke={INK} strokeWidth="2.5" />
            {i < n && <circle cx={x + 15} cy={y + 15} r="10" fill="#e5383b" stroke={INK} strokeWidth="1.5" />}
          </g>
        )
      })}
    </svg>
  )
}

/** A bar graph: one bar per picture (drawn under its bar), with a scale on the side. */
export function BarGraph({ items }: { items: { e: string; n: number }[] }) {
  const max = Math.max(...items.map((x) => x.n)), top = Math.max(6, Math.ceil(max / 2) * 2), H = 150, bw = 46, gap = 24, lab = 40
  const W = 40 + items.length * (bw + gap)
  return (
    <svg width={Math.min(360, W)} viewBox={`0 0 ${W} ${H + lab + 6}`} aria-hidden="true">
      {Array.from({ length: top / 2 + 1 }, (_, i) => {
        const v = i * 2, y = H - (v / top) * (H - 10)
        return <g key={i}><line x1="30" y1={y} x2={W - 6} y2={y} stroke="#d0d4dc" strokeWidth="1" /><text x="22" y={y + 4} textAnchor="end" fontSize="11" fontWeight="700" fill={INK} fontFamily="system-ui, sans-serif">{v}</text></g>
      })}
      {items.map((x, i) => {
        const h = (x.n / top) * (H - 10), xx = 40 + i * (bw + gap), m = artMarkup(x.e)
        return (
          <g key={i}>
            <rect x={xx} y={H - h} width={bw} height={h} rx="4" fill={['#6db7ff', '#9ad98a', '#ffb066', '#c3a8ff'][i % 4]} stroke={INK} strokeWidth="2" />
            {m && <svg x={xx + (bw - lab) / 2} y={H + 4} width={lab} height={lab} viewBox="0 0 100 100" dangerouslySetInnerHTML={{ __html: m }} />}
          </g>
        )
      })}
    </svg>
  )
}

/** True when a tile carries one of these drawings (so it isn't laid out as a text-only card). */
export const hasPicture = (t: Tile) => !!(t.clock || t.coins || t.frac || t.bar || t.poly || t.solid || t.dice || t.frame)

/** The drawing a tile carries, if any. */
export function TilePicture({ tile, big }: { tile: Tile; big?: boolean }) {
  const s = big ? 120 : 76
  return (
    <>
      {tile.clock && <ClockFace h={tile.clock[0]} m={tile.clock[1]} s={s} />}
      {tile.coins && <Coins values={tile.coins} s={s} />}
      {tile.frac && <Fraction n={tile.frac[0]} d={tile.frac[1]} kind={tile.frac[2]} uneven={tile.frac[3]} s={s} />}
      {tile.bar && <Ruler len={tile.bar.len} ruler={tile.bar.ruler} color={tile.bar.color} s={s} />}
      {tile.poly && <Polygon p={tile.poly} s={s} />}
      {tile.solid && <SolidShape k={tile.solid} s={s} />}
      {tile.dice && <span className="inline-flex gap-2">{tile.dice.map((n, i) => <Dice key={i} n={n} s={big ? 96 : 60} />)}</span>}
      {tile.frame !== undefined && <TenFrame n={tile.frame} s={s} />}
    </>
  )
}
