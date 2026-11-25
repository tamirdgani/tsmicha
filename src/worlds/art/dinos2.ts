/* Dinosaurs world, set 2: original illustrations (viewBox 0 0 100 100). Same style as dinos.ts. */

const S = '#2b2b3a'
const N = 'stroke="none"'
/** Wraps a drawing in the shared outline style (children inherit the stroke). */
const wrap = (s: string) =>
  `<g stroke="${S}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round">${s}</g>`
const r1 = (n: number) => Math.round(n * 10) / 10

/** Shiny cartoon eye. */
const eye = (x: number, y: number, r = 4.2) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r1(r * 1.15)}" fill="${S}" ${N}/>` +
  `<circle cx="${r1(x + r * 0.35)}" cy="${r1(y - r * 0.45)}" r="${r1(r * 0.4)}" fill="#fff" ${N}/>`
const cheek = (x: number, y: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.5" fill="#ff5c7a" opacity=".45" ${N}/>`
const line = (d: string, w = 2.5, c = S) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Draws shapes so their union gets one shared outline (outlines first, fills on top). */
const unite = (...els: string[]) =>
  els.map((e) => e.replace('/>', ' stroke-width="5.6"/>')).join('') + els.map((e) => e.replace('/>', ` ${N}/>`)).join('')
/** Thick outlined tube. */
const tube = (d: string, c: string, w = 7) =>
  `<path d="${d}" fill="none" stroke-width="${w + 5.6}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
const hi = (d: string, w = 3, o = 0.55) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="${w}" opacity="${o}"/>`

const tree = () => {
  const G = '#3fae5a', D = '#2e8a46', T = '#9a6538'
  return wrap(
    `<path d="M42 92Q46 76 44 58H58Q56 76 60 92Z" fill="${T}"/>` +
    `<path d="M30 92Q38 88 44 84M70 92Q62 88 57 84" fill="none" stroke-width="3"/>` +
    line('M48 62Q50 72 49 84M53 70L56 64', 2.2, '#7a4b2f') +
    unite(
      `<circle cx="50" cy="28" r="20"/>`.replace('/>', ` fill="${G}"/>`),
      `<circle cx="28" cy="42" r="17" fill="${G}"/>`,
      `<circle cx="72" cy="42" r="17" fill="${G}"/>`,
      `<circle cx="38" cy="56" r="14" fill="${G}"/>`,
      `<circle cx="62" cy="56" r="14" fill="${G}"/>`,
      `<circle cx="50" cy="48" r="16" fill="${G}"/>`,
    ) +
    `<circle cx="64" cy="34" r="6" fill="${D}" ${N}/><circle cx="36" cy="52" r="5" fill="${D}" ${N}/><circle cx="58" cy="56" r="4" fill="${D}" ${N}/><circle cx="24" cy="40" r="3.5" fill="${D}" ${N}/>` +
    `<circle cx="74" cy="46" r="3.5" fill="#e5383b" ${N}/><circle cx="44" cy="36" r="3.5" fill="#e5383b" ${N}/><circle cx="30" cy="56" r="3" fill="#e5383b" ${N}/>` +
    hi('M36 22Q42 12 52 10', 3.5)
  )
}

const cave = () => {
  const R = '#9a8f86', D = '#6f655e', G = '#5cb85c'
  return wrap(
    `<path d="M4 90Q4 54 22 36Q36 18 56 20Q78 22 88 44Q96 62 96 90Z" fill="${R}"/>` +
    `<path d="M24 90V66Q24 44 46 42Q70 42 72 64V90Z" fill="#2f2f3a"/>` +
    `<path d="M32 50L36 58L40 49M52 44L55 53L58 44M62 50L64 56L67 52" fill="#d8d0c6" stroke-width="2"/>` +
    `<path d="M24 32Q36 14 56 16Q78 18 86 34Q74 26 64 30Q54 22 44 28Q34 24 24 32Z" fill="${G}"/>` +
    line('M10 62L16 58M82 56L88 62M86 76H92M8 78H14', 2.4, D) +
    hi('M16 52Q20 42 28 36', 3.2, 0.4) +
    `<path d="M2 90H98" stroke-width="3"/>`
  )
}

const shovel = () => {
  const W = '#c58a4e', M = '#b8c0ca'
  return wrap(
    `<g transform="rotate(35 50 50)">` +
    `<path d="M38 6Q38 2 42 2H58Q62 2 62 6V12Q62 16 58 16H42Q38 16 38 12Z" fill="#e5383b"/>` +
    `<path d="M44 7H56" stroke-width="3.6"/>` +
    `<rect x="46" y="14" width="8" height="46" rx="3" fill="${W}"/>` +
    line('M50 20V54', 2, '#e8b47c') +
    `<path d="M36 60Q36 56 40 56H60Q64 56 64 60V78Q64 90 50 98Q36 90 36 78Z" fill="${M}"/>` +
    `<path d="M45 52H55V60H45Z" fill="#8a929c"/>` +
    hi('M41 64V80', 3.2, 0.7) +
    `</g>`
  )
}

const brush = () => {
  const W = '#e5383b', M = '#c9ced6', B = '#f0d9a6'
  return wrap(
    `<g transform="rotate(-35 50 50)">` +
    `<path d="M44 6Q44 2 50 2Q56 2 56 6L58 52H42Z" fill="${W}"/>` +
    `<circle cx="50" cy="10" r="2.6" fill="#fff" stroke-width="2"/>` +
    hi('M47.5 16V46', 2.6, 0.5) +
    `<path d="M38 52H62V64H38Z" fill="${M}"/>` +
    line('M38 58H62', 2.2) +
    `<path d="M38 64H62L68 94Q50 98 32 94Z" fill="${B}"/>` +
    line('M44 70L42 92M50 70V94M56 70L58 92', 2, '#c9a866') +
    `</g>`
  )
}

const river = () => {
  const B = '#4ea8ff', L = '#bfe6ff', G = '#9aa0a6', GR = '#6cc070'
  const stone = (x: number, y: number, rx: number, ry: number, c = G) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/>` +
    `<ellipse cx="${r1(x - rx * 0.3)}" cy="${r1(y - ry * 0.35)}" rx="${r1(rx * 0.35)}" ry="${r1(ry * 0.25)}" fill="#fff" opacity=".45" ${N}/>`
  return wrap(
    `<path d="M40 6H58Q50 18 60 30Q74 46 62 60Q50 72 72 94H20Q22 76 34 64Q46 52 36 36Q28 20 40 6Z" fill="${B}"/>` +
    line('M48 14Q46 22 50 28M50 40Q56 46 52 52M42 68Q38 76 40 84M58 76Q62 82 60 88', 2.6, L) +
    stone(18, 40, 10, 7) + stone(80, 28, 9, 6.5, '#b8bdc2') + stone(84, 62, 11, 8) + stone(14, 74, 9, 7, '#b8bdc2') +
    stone(52, 58, 6, 4.5, '#b8bdc2') +
    `<path d="M24 22l-2-6M28 22l1-7M74 46l-2-6M78 46l1-6M90 82l-1-6M94 82l2-6" stroke="${GR}" stroke-width="3"/>`
  )
}

const mammoth = () => {
  const B = '#b0643a', D = '#8a4a28', L = '#cf8558', T = '#fff6e0'
  let fringe = 'M22 70'
  for (let x = 22; x < 76; x += 6) fringe += `L${x + 3} 76L${x + 6} 70`
  return wrap(
    `<rect x="26" y="66" width="12" height="24" rx="5" fill="${D}"/><rect x="58" y="66" width="12" height="24" rx="5" fill="${D}"/>` +
    `<path d="M14 56Q6 58 6 68" fill="none" stroke-width="3"/><path d="M4 66L6 74L10 68Z" fill="${D}"/>` +
    unite(
      `<path d="M14 66Q10 36 34 30Q46 26 54 32Q64 18 78 24Q94 30 92 50Q90 66 76 70H22Q14 70 14 66Z" fill="${B}"/>`,
      `<path d="${fringe}V64H22Z" fill="${B}"/>`,
    ) +
    `<path d="M24 40Q30 34 38 34M44 46q4-4 8 0M30 54q4-4 8 0M58 30Q66 24 74 28" fill="none" stroke="${D}" stroke-width="2.4"/>` +
    `<rect x="18" y="68" width="12" height="22" rx="5" fill="${B}"/><rect x="50" y="68" width="12" height="22" rx="5" fill="${B}"/>` +
    tube('M86 56Q90 74 84 82Q80 86 77 82', B, 8) +
    `<path d="M82 60Q90 78 70 76Q64 75 62 70Q72 72 76 64Z" fill="${T}"/>` +
    `<ellipse cx="68" cy="40" rx="6" ry="8" fill="${L}"/>` +
    eye(80, 42, 3.8) + cheek(84, 50) +
    `<path d="M20 87h8M52 87h8" stroke="#fff" stroke-width="2" opacity=".6"/>`
  )
}

const sun = () => {
  const Y = '#ffc83d', O = '#f7a400'
  const n = 10
  let rays = ''
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2, w = Math.PI / n * 0.55
    const P = (ang: number, R: number) => `${r1(50 + R * Math.cos(ang))} ${r1(50 + R * Math.sin(ang))}`
    rays += `M${P(a - w, 30)}L${P(a, 46)}L${P(a + w, 30)}Z`
  }
  return wrap(
    `<path d="${rays}" fill="${O}"/>` +
    `<circle cx="50" cy="50" r="29" fill="${Y}"/>` +
    `<circle cx="50" cy="50" r="21" fill="#ffe08a" ${N}/>` +
    hi('M32 40Q36 30 46 27', 4, 0.7)
  )
}

const flower = () => {
  const P = '#ff8fab', C = '#ffc83d', G = '#3fae5a'
  const petal = (a: number) =>
    `<ellipse cx="50" cy="20" rx="9" ry="14" fill="${P}" transform="rotate(${a} 50 36)"/>`
  return wrap(
    tube('M50 46Q46 70 50 92', G, 5) +
    `<path d="M49 76Q30 70 22 56Q40 56 49 70Z" fill="${G}"/>` +
    `<path d="M50 84Q68 78 78 64Q60 64 50 78Z" fill="${G}"/>` +
    line('M48 72Q36 64 28 59M51 80Q62 74 72 67', 2, '#237a39') +
    [0, 60, 120, 180, 240, 300].map(petal).join('') +
    `<circle cx="50" cy="36" r="10" fill="${C}"/>` +
    `<circle cx="47" cy="33" r="2" fill="#fff" opacity=".7" ${N}/><circle cx="53" cy="39" r="1.5" fill="#e5a114" ${N}/><circle cx="46" cy="39" r="1.5" fill="#e5a114" ${N}/>`
  )
}

const mountain = () => {
  const M = '#7d8bb0', D = '#64709a', W = '#fbfbff'
  return wrap(
    `<path d="M48 90L72 26L96 90Z" fill="${D}"/>` +
    `<path d="M72 26L62 52L68 48L72 54L77 47L82 52Z" fill="${W}"/>` +
    `<path d="M4 90L38 12L74 90Z" fill="${M}"/>` +
    `<path d="M38 12L25 42L32 37L38 44L44 36L52 42Z" fill="${W}"/>` +
    `<path d="M38 44L30 90" fill="none" stroke="${D}" stroke-width="2.6"/>` +
    `<path d="M2 90H98" stroke-width="3"/>`
  )
}

const tooth = () => {
  const C = '#fff6e0', D = '#e8d4ae'
  return wrap(
    `<path d="M24 26Q20 10 32 8Q40 6 46 12Q52 4 62 8Q76 10 74 26Z" fill="#f3b6b6"/>` +
    `<path d="M26 22Q28 60 56 94Q66 70 70 50Q74 34 72 22Q50 28 26 22Z" fill="${C}"/>` +
    line('M71 34l-3 .5M70.5 44l-3 .5M69 54l-3 .5M66.5 64l-3 .5M63 74l-3 .5', 2) +
    `<path d="M58 34Q58 58 56 80" fill="none" stroke="${D}" stroke-width="4"/>` +
    hi('M34 32Q36 50 46 68', 3.2, 0.9)
  )
}

const claw = () => {
  const C = '#4a4a5a', B = '#e8d3a6'
  return wrap(
    `<path d="M14 82Q10 50 34 28Q58 8 94 12Q66 22 54 40Q44 56 48 82Z" fill="${C}"/>` +
    hi('M24 66Q26 46 42 30Q56 18 74 14', 3.2, 0.45) +
    `<path d="M8 84Q8 74 18 74H44Q54 74 54 84Q54 94 44 94H18Q8 94 8 84Z" fill="${B}"/>` +
    line('M16 84H46', 2.4, '#c9a866')
  )
}

const hat = () => {
  const K = '#d8c08a', D = '#b89d62', B = '#7a4b2f'
  return wrap(
    `<ellipse cx="50" cy="68" rx="45" ry="15" fill="${D}"/>` +
    `<path d="M20 66Q18 24 50 22Q82 24 80 66Q50 76 20 66Z" fill="${K}"/>` +
    `<path d="M21 56Q50 66 79 56L80 64Q50 74 20 64Z" fill="${B}"/>` +
    `<circle cx="50" cy="22" r="4" fill="${K}"/>` +
    line('M50 26Q42 40 40 56M50 26Q58 40 60 57', 2, '#b89d62') +
    hi('M28 48Q30 34 40 28', 3.2, 0.6)
  )
}

const map = () => {
  const P = '#f6e3b4', D = '#e3c98c'
  const xs = [8, 30, 52, 74, 94]
  const ys = [16, 10, 16, 10, 16]
  const top = xs.map((x, i) => `${x} ${ys[i]}`).join('L')
  const bot = xs.map((x, i) => `${x} ${ys[i] + 72}`).reverse().join('L')
  return wrap(
    `<path d="M${top}L${bot}Z" fill="${P}"/>` +
    `<path d="M30 10V82L52 88V16ZM74 10V82L94 88V16Z" fill="${D}" stroke-width="2.4"/>` +
    `<path d="M14 72Q20 60 32 62Q44 66 40 52Q36 40 52 38Q66 36 68 26" fill="none" stroke="#e5383b" stroke-width="3" stroke-dasharray="4 5"/>` +
    `<path d="M62 30L74 18M62 18L74 30" stroke="#e5383b" stroke-width="4.5"/>` +
    `<path d="M14 42L20 30L26 42Z" fill="#9aa0a6" stroke-width="2"/><path d="M20 46L25 36L31 46Z" fill="#9aa0a6" stroke-width="2"/>` +
    `<circle cx="78" cy="58" r="6" fill="#3fae5a" stroke-width="2"/><path d="M78 64V70" stroke-width="2.4"/>` +
    `<path d="M52 66Q58 62 64 66Q70 70 76 66" fill="none" stroke="#4ea8ff" stroke-width="3"/>` +
    `<circle cx="14" cy="72" r="3" fill="#e5383b" stroke-width="2"/>`
  )
}

const pinecone = () => {
  const C = '#a86a3a', L = '#c98a52', D = '#7a4b2f'
  let out = ''
  const n = 22
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    const x = r1(50 + 27 * Math.cos(a)), y = r1(54 + 38 * Math.sin(a))
    out += i === 0 ? `M${x} ${y}` : `A6.5 6.5 0 0 1 ${x} ${y}`
  }
  let sc = ''
  const rows: [number, number, number][] = [[32, 30, 2], [42, 40, 3], [53, 44, 3], [64, 40, 3], [75, 30, 2], [85, 16, 1]]
  for (const [y, w, k] of rows)
    for (let i = 0; i < k; i++) {
      const cx = r1(k === 1 ? 50 : 50 - w / 2 + 7 + ((w - 14) / (k - 1)) * i)
      sc += `<path d="M${r1(cx - 8)} ${y - 4}Q${cx} ${y + 8} ${r1(cx + 8)} ${y - 4}" fill="${L}" stroke-width="2.2"/>`
    }
  return wrap(
    `<path d="M50 16Q48 8 52 4Q58 4 60 8" fill="none" stroke="${D}" stroke-width="4.5"/>` +
    `<path d="${out}Z" fill="${C}"/>` +
    sc +
    hi('M32 36Q34 26 42 22', 3, 0.4)
  )
}

export const ART: Record<string, string> = {
  tree: tree(),
  cave: cave(),
  shovel: shovel(),
  brush: brush(),
  river: river(),
  mammoth: mammoth(),
  sun: sun(),
  flower: flower(),
  mountain: mountain(),
  tooth: tooth(),
  claw: claw(),
  hat: hat(),
  map: map(),
  pinecone: pinecone(),
}
