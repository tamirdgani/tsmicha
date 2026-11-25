/* Cars world, set 2: original illustrations (viewBox 0 0 100 100). Same style as cars.ts. */

const K = '#2b2b3a'
const O = `stroke="${K}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"`
const T = `stroke="${K}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`
const GLASS = '#bfe6ff'
const SHADOW = (rx = 44) => `<ellipse cx="50" cy="91" rx="${rx}" ry="3" fill="${K}" opacity=".15"/>`
const r1 = (n: number) => Math.round(n * 10) / 10

function wheel(cx: number, cy: number, r: number, hub = '#c9ced6'): string {
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#3a3a48" ${O}/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r1(r * 0.45)}" fill="${hub}" ${T}/>`
  )
}

/** Plain sedan (no face), facing right. `extra` is drawn on the body before the wheels. */
function sedan(c: string, extra = '', roof = ''): string {
  return (
    SHADOW(42) +
    roof +
    `<path d="M22 50L31 30Q33 26 39 26H60Q66 26 69 31L77 50Z" fill="${c}" ${O}/>` +
    `<path d="M29 47L35 32H48V47ZM52 47V32H61Q64 32 66 35L71 47Z" fill="${GLASS}" ${T}/>` +
    `<path d="M33 44L38 35" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>` +
    `<path d="M12 68Q10 52 20 50L66 47Q88 46 93 54Q96 62 95 71Q94 80 86 80H18Q12 80 12 68Z" fill="${c}" ${O}/>` +
    extra +
    `<path d="M50 49V78" ${T} fill="none"/><path d="M38 56H44M56 56H62" stroke="${K}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<ellipse cx="89" cy="58" rx="4" ry="3.5" fill="#fff6c2" ${T}/>` +
    `<rect x="10.5" y="56" width="4" height="6" rx="1.5" fill="#e5383b" ${T}/>` +
    `<path d="M80 76H95" stroke="${K}" stroke-width="2.4" stroke-linecap="round" opacity=".5"/>` +
    wheel(29, 80, 10.5) + wheel(72, 80, 10.5)
  )
}

const taxi = () => {
  let ch = ''
  for (let i = 0; i < 18; i++) {
    const x = 15 + i * 4.2
    ch += `M${r1(x)} ${i % 2 ? 60 : 64}h4.2v4h-4.2Z`
  }
  return sedan(
    '#ffc83d',
    `<rect x="15" y="60" width="75.6" height="8" fill="#fff"/><path d="${ch}" fill="${K}"/>` + `<rect x="15" y="60" width="75.6" height="8" fill="none" ${T}/>`,
    `<rect x="40" y="16" width="20" height="10" rx="3" fill="#fff7d6" ${O}/>`,
  )
}

const policecar = () =>
  sedan(
    '#1d70d8',
    `<path d="M24 52H76V70H24Z" fill="#f4f5fb" ${T}/>` +
    `<path d="M44 56L46 61L51 61.5L47 64.5L48.5 69L44 66.3L39.5 69L41 64.5L37 61.5L42 61Z" fill="#ffc83d" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/>`,
    `<path d="M32 18L28 12M68 18L72 12M50 14V8" stroke="${K}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<rect x="36" y="18" width="14" height="9" rx="3" fill="#e5383b" ${O}/><rect x="50" y="18" width="14" height="9" rx="3" fill="#4ea8ff" ${O}/>` +
    `<path d="M39 21H45M53 21H59" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`,
  )

const van = () => {
  const C = '#2bb3a6'
  return (
    SHADOW() +
    `<path d="M6 28Q6 20 14 20H64Q72 20 78 28L90 46Q95 50 95 58V74Q95 80 89 80H11Q6 80 6 74Z" fill="${C}" ${O}/>` +
    `<path d="M68 26H64V46H86L78 32Q75 26 68 26Z" fill="${GLASS}" ${T}/>` +
    `<rect x="12" y="27" width="20" height="17" rx="3" fill="${GLASS}" ${T}/><rect x="36" y="27" width="22" height="17" rx="3" fill="${GLASS}" ${T}/>` +
    `<path d="M16 40L22 31M40 40L46 31M70 42L74 32" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>` +
    `<path d="M6 58H95" stroke="#fff" stroke-width="5"/><path d="M6 64H95" stroke="#1d8a80" stroke-width="2.4"/>` +
    `<path d="M34 24V78M60 24V78" fill="none" ${T}/><path d="M28 52H32M62 52H66" stroke="${K}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<ellipse cx="91" cy="56" rx="3" ry="3.5" fill="#fff6c2" ${T}/>` +
    wheel(24, 80, 10) + wheel(76, 80, 10)
  )
}

const scooter = () =>
  SHADOW(40) +
  `<path d="M70 82L62 22" stroke="${K}" stroke-width="8" stroke-linecap="round"/><path d="M70 82L62 22" stroke="#9aa0a6" stroke-width="3.6" stroke-linecap="round"/>` +
  `<path d="M48 18H76" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M48 18H76" stroke="#9aa0a6" stroke-width="2.6" stroke-linecap="round"/>` +
  `<rect x="44" y="14" width="9" height="8" rx="3.5" fill="#3a3a48" ${T}/><rect x="71" y="14" width="9" height="8" rx="3.5" fill="#3a3a48" ${T}/>` +
  `<rect x="60" y="34" width="10" height="7" rx="2" fill="#e5383b" ${T} transform="rotate(-8 65 37)"/>` +
  `<path d="M14 74Q18 70 24 72H72L76 80H18Q12 80 14 74Z" fill="#e5383b" ${O}/>` +
  `<path d="M24 75H66" stroke="#3a3a48" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M10 82Q12 72 24 74" fill="none" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>` +
  wheel(20, 83, 8) + wheel(76, 83, 8)

const boat = () =>
  `<path d="M56 30V12" ${O}/><path d="M57 12L70 16L57 21Z" fill="#ffc83d" ${T}/>` +
  `<path d="M36 46L46 30H62L70 46Z" fill="#f4f5fb" ${O}/>` +
  `<path d="M44 44L49 34H58V44Z" fill="${GLASS}" ${T}/>` +
  `<rect x="6" y="44" width="11" height="16" rx="3" fill="#3a3a48" ${O}/><path d="M11 60V72" ${O}/><path d="M7 72H15" ${O}/>` +
  `<path d="M14 46H94Q90 64 78 72H26Q16 66 14 46Z" fill="#f4f5fb" ${O}/>` +
  `<path d="M16 54H92" stroke="#e5383b" stroke-width="5"/><path d="M17 50H92" stroke="${K}" stroke-width="2.2" opacity=".3"/>` +
  `<circle cx="34" cy="62" r="3" fill="${GLASS}" ${T}/><circle cx="48" cy="63" r="3" fill="${GLASS}" ${T}/><circle cx="62" cy="63" r="3" fill="${GLASS}" ${T}/>` +
  `<path d="M90 48Q98 50 96 60" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` +
  `<path d="M4 76Q12 70 20 76Q28 82 36 76Q44 70 52 76Q60 82 68 76Q76 70 84 76Q90 80 96 76V92H4Z" fill="#5fb7ea" ${O}/>` +
  `<path d="M14 84Q18 82 22 84M54 86Q58 84 62 86M80 84Q84 82 88 84" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`

const plane = () =>
  `<path d="M22 44L10 16H22L38 44Z" fill="#ffc83d" ${O}/>` +
  `<path d="M46 50L58 28H68L62 50Z" fill="#c42a2d" ${O}/>` +
  `<path d="M12 50Q10 40 22 40H68Q84 40 90 50Q84 62 68 62H26Q12 62 12 50Z" fill="#e5383b" ${O}/>` +
  `<path d="M14 52H86" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>` +
  `<path d="M66 41Q74 30 82 46H66Z" fill="${GLASS}" ${T}/><path d="M70 40L73 36" stroke="#fff" stroke-width="2" stroke-linecap="round"/>` +
  `<circle cx="34" cy="46" r="2.8" fill="${GLASS}" ${T}/><circle cx="44" cy="46" r="2.8" fill="${GLASS}" ${T}/><circle cx="54" cy="46" r="2.8" fill="${GLASS}" ${T}/>` +
  `<path d="M8 48L26 48L22 56H10Z" fill="#ffc83d" ${O}/>` +
  `<path d="M40 56L60 56L50 82H38Z" fill="#c42a2d" ${O}/>` +
  `<path d="M40 62V72M66 60V72" ${O}/>` +
  wheel(40, 76, 5.5) + wheel(66, 76, 5.5) +
  `<ellipse cx="94" cy="51" rx="3.5" ry="17" fill="#9aa0a6" ${O}/>` +
  `<circle cx="91" cy="51" r="4.5" fill="#ffc83d" ${O}/>`

const crane = () => {
  const Y = '#ffc83d'
  let lat = ''
  for (let i = 0; i < 7; i++) {
    const t0 = 0.08 + i * 0.125, t1 = t0 + 0.0625
    const p = (t: number, s: number) => [r1(40 + (14 - 40) * t + s * 2.4), r1(52 + (12 - 52) * t + s * 1.6)]
    const [ax, ay] = p(t0, -1), [bx, by] = p(t1, 1)
    lat += `M${ax} ${ay}L${bx} ${by}`
  }
  return (
    SHADOW() +
    `<path d="M14 12V36" stroke="${K}" stroke-width="2.4"/>` +
    `<path d="M14 36Q8 36 8 41Q8 46 13 46" fill="none" stroke="${K}" stroke-width="3.4" stroke-linecap="round"/>` +
    `<rect x="10" y="33" width="8" height="5" rx="1.5" fill="#9aa0a6" ${T}/>` +
    `<path d="M40 52L14 12" stroke="${K}" stroke-width="11" stroke-linecap="round"/><path d="M40 52L14 12" stroke="${Y}" stroke-width="6" stroke-linecap="round"/>` +
    `<path d="${lat}" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/>` +
    `<path d="M30 46H58V60H26Z" fill="${Y}" ${O}/>` +
    `<circle cx="40" cy="52" r="3.4" fill="#9aa0a6" ${T}/>` +
    `<path d="M64 40H80Q86 40 89 48L94 58V70H64Z" fill="${Y}" ${O}/>` +
    `<path d="M68 45H79Q82 45 84 49L87 56H68Z" fill="${GLASS}" ${T}/>` +
    `<rect x="4" y="60" width="91" height="12" rx="3" fill="#f77f00" ${O}/>` +
    `<path d="M10 66H56" stroke="#fff" stroke-width="2.6" stroke-dasharray="5 4" opacity=".8"/>` +
    `<path d="M14 72V86M48 72V82" ${O}/><rect x="8" y="85" width="12" height="4" rx="1.5" fill="#9aa0a6" ${T}/>` +
    wheel(28, 80, 8.5) + wheel(66, 80, 8.5) + wheel(84, 80, 8.5)
  )
}

const bulldozer = () => {
  const C = '#f77f00'
  return (
    SHADOW() +
    `<rect x="54" y="18" width="6" height="22" rx="2" fill="#9aa0a6" ${O}/>` +
    `<path d="M18 44V22Q18 18 22 18H44Q48 18 48 22V44Z" fill="${C}" ${O}/>` +
    `<rect x="23" y="23" width="20" height="18" rx="2" fill="${GLASS}" ${T}/><path d="M27 37L34 27" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M12 46Q12 42 16 42H66Q70 42 70 46V66H12Z" fill="${C}" ${O}/>` +
    `<path d="M52 48H66M52 54H66" stroke="#c45f00" stroke-width="2.6" stroke-linecap="round"/>` +
    `<path d="M66 60L80 58M66 52L80 54" stroke="${K}" stroke-width="5" stroke-linecap="round"/><path d="M66 60L80 58M66 52L80 54" stroke="#9aa0a6" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M78 40Q90 44 90 64Q90 82 80 90H96V40Z" fill="#ffc83d" ${O}/>` +
    `<path d="M84 48V82" stroke="#e5a114" stroke-width="2.4" stroke-linecap="round"/>` +
    `<rect x="6" y="64" width="68" height="26" rx="13" fill="#3a3a48" ${O}/>` +
    `<circle cx="19" cy="77" r="7.5" fill="#9aa0a6" ${T}/><circle cx="40" cy="79" r="5" fill="#9aa0a6" ${T}/><circle cx="61" cy="77" r="7.5" fill="#9aa0a6" ${T}/>` +
    `<path d="M12 67H68" stroke="#5a5a6c" stroke-width="2.4" stroke-dasharray="3 3"/>`
  )
}

const tire = () => {
  let d = ''
  const n = 16
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 0.55) / n) * Math.PI * 2, a2 = ((i + 1) / n) * Math.PI * 2
    const P = (a: number, R: number) => `${r1(50 + R * Math.cos(a))} ${r1(50 + R * Math.sin(a))}`
    d += (i === 0 ? `M${P(a0, 43)}` : `L${P(a0, 43)}`) + `A43 43 0 0 1 ${P(a1, 43)}L${P(a1, 38.5)}A38.5 38.5 0 0 1 ${P(a2, 38.5)}`
  }
  const bolts = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2
    return `<circle cx="${r1(50 + 11 * Math.cos(a))}" cy="${r1(50 + 11 * Math.sin(a))}" r="2.3" fill="#7a7f88"/>`
  })
  return (
    `<path d="${d}Z" fill="#3a3a48" ${O}/>` +
    `<circle cx="50" cy="50" r="28" fill="none" stroke="#5a5a6c" stroke-width="2.6"/>` +
    `<circle cx="50" cy="50" r="20" fill="#c9ced6" ${O}/>` +
    bolts.join('') +
    `<circle cx="50" cy="50" r="5" fill="#9aa0a6" ${T}/>` +
    `<path d="M24 34Q30 22 42 18" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/>` +
    `<path d="M38 42Q42 36 48 35" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`
  )
}

const cone = () => {
  const C = '#f77f00'
  // side edges: x = 50 ± (6 + (y-12)*0.36) between y=12 and y=80
  const hw = (y: number) => r1(6 + (y - 12) * 0.37)
  const band = (y0: number, y1: number) =>
    `<path d="M${r1(50 - hw(y0))} ${y0}H${r1(50 + hw(y0))}L${r1(50 + hw(y1))} ${y1}H${r1(50 - hw(y1))}Z" fill="#fff" ${T}/>`
  return (
    SHADOW(40) +
    `<path d="M44 12Q50 7 56 12L75 80H25Z" fill="${C}" ${O}/>` +
    band(30, 40) + band(54, 64) +
    `<path d="M45 18L38 72" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/>` +
    `<path d="M12 80Q12 78 15 78H85Q88 78 88 80V88Q88 90 85 90H15Q12 90 12 88Z" fill="#d96a00" ${O}/>`
  )
}

const key = () =>
  `<g transform="rotate(38 50 50)">` +
  `<path d="M44 44V9Q44 5 48 5H53L59 11L54 15L59 19L54 23L59 27L54 31V44Z" fill="#c9ced6" ${O}/>` +
  `<path d="M48.5 12V40" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>` +
  `<circle cx="50" cy="92" r="7" fill="none" stroke="${K}" stroke-width="7"/><circle cx="50" cy="92" r="7" fill="none" stroke="#9aa0a6" stroke-width="3"/>` +
  `<rect x="29" y="40" width="42" height="48" rx="17" fill="#3a3a48" ${O}/>` +
  `<circle cx="50" cy="55" r="7" fill="#e5383b" ${T}/><circle cx="41" cy="72" r="5.5" fill="#9aa0a6" ${T}/><circle cx="59" cy="72" r="5.5" fill="#9aa0a6" ${T}/>` +
  `<path d="M38 48Q38 44 42 44" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".4"/>` +
  `</g>`

const helmet = () =>
  SHADOW(36) +
  `<path d="M24 30L6 22Q3 34 18 42Z" fill="#3a3a48" ${O}/>` +
  `<path d="M12 64Q10 22 52 16Q88 14 92 50L95 66Q96 78 86 80Q72 82 62 76Q46 70 30 80Q12 82 12 64Z" fill="#e5383b" ${O}/>` +
  `<path d="M14 56Q24 30 56 24" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>` +
  `<path d="M14 56Q24 30 56 24" fill="none" stroke="#1d70d8" stroke-width="2.6" stroke-linecap="round"/>` +
  `<path d="M48 38H86Q92 40 92 50V58H58Q46 58 46 48Q46 38 48 38Z" fill="#35486b" ${O}/>` +
  `<path d="M56 43H80" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/><path d="M84 43H86" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/>` +
  `<path d="M70 66H90M72 72H90" stroke="#3a3a48" stroke-width="2.6" stroke-linecap="round"/>` +
  `<circle cx="44" cy="50" r="3.4" fill="#c9ced6" ${T}/>` +
  `<path d="M24 34Q30 26 40 22" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/>`

const flag = () => {
  const x0 = 20, w = 72, y0 = 12, h = 46, cols = 8, rows = 5
  const P = (u: number, v: number) => [r1(x0 + w * u), r1(y0 + h * v + 5 * Math.sin(u * Math.PI * 2))]
  let cells = ''
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      if ((i + j) % 2) continue
      const u0 = i / cols, u1 = (i + 1) / cols, v0 = j / rows, v1 = (j + 1) / rows, um = (u0 + u1) / 2
      const pts = [P(u0, v0), P(um, v0), P(u1, v0), P(u1, v1), P(um, v1), P(u0, v1)]
      cells += `M${pts.map((p) => p.join(' ')).join('L')}Z`
    }
  const edge = (v: number, rev: boolean) => {
    const pts = Array.from({ length: 17 }, (_, k) => P(k / 16, v))
    return (rev ? pts.reverse() : pts).map((p) => p.join(' ')).join('L')
  }
  const outline = `M${edge(0, false)}L${edge(1, true)}Z`
  return (
    `<rect x="12" y="6" width="7" height="88" rx="3" fill="#9aa0a6" ${O}/>` +
    `<circle cx="15.5" cy="7" r="5" fill="#ffc83d" ${O}/>` +
    `<path d="${outline}" fill="#fff" ${O}/>` +
    `<path d="${cells}" fill="#3a3a48"/>` +
    `<path d="${outline}" fill="none" ${O}/>`
  )
}

const garage = () =>
  `<rect x="4" y="86" width="92" height="6" rx="2" fill="#9aa0a6" ${O}/>` +
  `<path d="M14 40H86V88H14Z" fill="#f4e3c3" ${O}/>` +
  `<path d="M6 44L50 12L94 44Z" fill="#e5383b" ${O}/>` +
  `<path d="M20 40L50 18L80 40" fill="none" stroke="#c42a2d" stroke-width="2.6" stroke-linecap="round" opacity=".6"/>` +
  `<circle cx="50" cy="31" r="5" fill="${GLASS}" ${T}/>` +
  `<path d="M24 88V54Q24 50 28 50H72Q76 50 76 54V88Z" fill="#1d70d8" ${O}/>` +
  `<path d="M24 58H76M24 65H76M24 72H76M24 79H76" stroke="#7fb6f0" stroke-width="2.6"/>` +
  `<rect x="44" y="81" width="12" height="3.5" rx="1.5" fill="#c9ced6" ${T}/>`

export const ART: Record<string, string> = {
  taxi: taxi(),
  van: van(),
  scooter: scooter(),
  boat: boat(),
  plane: plane(),
  crane: crane(),
  bulldozer: bulldozer(),
  policecar: policecar(),
  tire: tire(),
  cone: cone(),
  key: key(),
  helmet: helmet(),
  flag: flag(),
  garage: garage(),
}
