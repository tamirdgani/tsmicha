/* Common drawings, batch 5: one per emoji the lessons use (viewBox 0 0 100 100). */

const S = '#2b2b3a'
const N = 'stroke="none"'
const Y = '#ffc83d'
const R = '#e5383b'
const B = '#1d70d8'
const G = '#2e9a48'
const O = '#f77f00'
const P = '#8b5cf6'
const BR = '#8d5524'
const GR = '#9aa0a6'
const SK = ['#f6d2b5', '#e0ac80', '#b97a56', '#7a4b2f']

const wrap = (s: string, w = 2.8) =>
  `<g stroke="${S}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round">${s}</g>`
/** Thick outlined tube (arms, legs, handles). */
const tube = (d: string, c: string, w = 7) =>
  `<path d="${d}" fill="none" stroke-width="${w + 5.6}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Union of shapes under one outline. */
const unite = (...els: string[]) =>
  els.map((e) => e.replace('/>', ' stroke-width="5.6"/>')).join('') + els.map((e) => e.replace('/>', ` ${N}/>`)).join('')
const eye = (x: number, y: number, r = 4) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.2}" fill="${S}" ${N}/><circle cx="${x + r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.4}" fill="#fff" ${N}/>`
const line = (d: string, w = 3.2, c = S) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Water drop with its tip at (x,y), height 2s. */
const drop = (x: number, y: number, s: number, c = '#5fb4ff') =>
  `<path d="M${x} ${y}C${x + s} ${y + s * 1.1} ${x + s * 0.95} ${y + s * 2} ${x} ${y + s * 2}C${x - s * 0.95} ${y + s * 2} ${x - s} ${y + s * 1.1} ${x} ${y}Z" fill="${c}"/>`
const cheeks = (y = 62, dx = 25) =>
  `<ellipse cx="${50 - dx}" cy="${y}" rx="6" ry="3.5" fill="#ff6b8b" opacity=".4" ${N}/><ellipse cx="${50 + dx}" cy="${y}" rx="6" ry="3.5" fill="#ff6b8b" opacity=".4" ${N}/>`
/** Round yellow face. */
const face = (inner: string) => wrap(`<circle cx="50" cy="52" r="40" fill="${Y}"/>` + inner)
/** Open hand, palm facing out, fingers up (skin colour c). */
const hand = (c: string) =>
  unite(
    `<rect x="28" y="50" width="44" height="42" rx="15" fill="${c}"/>`,
    `<rect x="29" y="22" width="10" height="40" rx="5" fill="${c}"/>`,
    `<rect x="40" y="14" width="10" height="46" rx="5" fill="${c}"/>`,
    `<rect x="51" y="17" width="10" height="44" rx="5" fill="${c}"/>`,
    `<rect x="62" y="27" width="10" height="36" rx="5" fill="${c}"/>`,
    `<rect x="14" y="50" width="11" height="30" rx="5.5" fill="${c}" transform="rotate(-35 20 66)"/>`,
  ) +
  line('M39.5 30V54M50.5 22V54M61.5 32V56', 2) +
  `<path d="M38 74q12 6 24 0" fill="none" stroke-width="2" opacity=".35"/>`
/** Front-facing simple kid-book head. */
const head = (x: number, y: number, r: number, skin: string, hair: string) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${skin}"/>` +
  `<path d="M${x - r} ${y - 1}Q${x - r} ${y - r - 3} ${x} ${y - r - 2}Q${x + r} ${y - r - 3} ${x + r} ${y - 1}Q${x + 2} ${y - r * 0.7} ${x - r} ${y - 1}Z" fill="${hair}"/>`

/* ---------- objects ---------- */

const menorah = () => {
  const xs = [10, 20, 30, 40, 50, 60, 70, 80, 90]
  let d = ''
  for (let i = 1; i <= 4; i++) {
    const r = i * 10
    d += `M${50 - r} 42V44A${r} ${r * 0.9} 0 0 0 ${50 + r} 44V42`
  }
  let arms = `<path d="${d}M50 36V86" fill="none" stroke-width="7"/><path d="${d}M50 36V86" fill="none" stroke="${Y}" stroke-width="3.6"/>`
  let cand = ''
  for (const x of xs) {
    const t = x === 50 ? 36 : 42
    cand +=
      `<rect x="${x - 4}" y="${t - 2}" width="8" height="4" rx="1.5" fill="${Y}" stroke-width="2"/>` +
      `<rect x="${x - 2.5}" y="${t - 12}" width="5" height="10" rx="1" fill="#eaf3ff" stroke-width="2"/>` +
      `<path d="M${x} ${t - 24}Q${x + 5} ${t - 16} ${x} ${t - 13}Q${x - 5} ${t - 16} ${x} ${t - 24}Z" fill="${O}" stroke-width="2"/>`
  }
  return wrap(arms + `<path d="M34 94h32l-6-10H40z" fill="${Y}"/>` + cand)
}

const masks = () => {
  const shape = 'M-20 -22Q0 -30 20 -22Q25 4 0 26Q-25 4 -20 -22Z'
  const sad =
    `<g transform="translate(64 56) rotate(14)"><path d="${shape}" fill="${P}"/>` +
    line('M-14 -4q5 -5 10 -1M4 -5q5 -4 10 1', 3.5) +
    line('M-10 15Q0 4 10 15', 3.5) +
    '</g>'
  const happy =
    `<g transform="translate(36 44) rotate(-14)"><path d="${shape}" fill="${Y}"/>` +
    line('M-14 -6q5 -6 10 0M4 -6q5 -6 10 0', 3.5) +
    `<path d="M-11 5Q0 22 11 5Z" fill="${S}"/>` +
    '</g>'
  return wrap(sad + happy)
}

const flatbread = () =>
  wrap(
    `<ellipse cx="50" cy="55" rx="44" ry="30" fill="#e8b86a"/>` +
      `<ellipse cx="50" cy="53" rx="35" ry="22" fill="#f6d89a" ${N}/>` +
      [
        [34, 46, 5, 3],
        [58, 42, 6, 3.5],
        [46, 60, 4, 2.5],
        [68, 58, 5, 3],
        [30, 62, 3.5, 2],
        [52, 50, 3, 2],
      ]
        .map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="#b5762f" opacity=".75" ${N}/>`)
        .join(''),
  )

const hut = () =>
  wrap(
    `<rect x="20" y="54" width="60" height="38" rx="4" fill="${BR}"/>` +
      `<path d="M42 92V74a8 8 0 0 1 16 0v18z" fill="#4a2a10"/>` +
      `<path d="M6 62L50 10L94 62Q50 70 6 62Z" fill="#e8b440"/>` +
      line('M50 12L30 63M50 12L50 66M50 12L70 63M22 50L16 62M78 50L84 62', 2, '#b5822a') +
      `<path d="M44 14L50 4L56 14" fill="#e8b440"/>`,
  )

const basket = () =>
  wrap(
    tube('M22 48Q50 0 78 48', '#c98a4b', 6) +
      `<path d="M14 52h72l-8 38H22z" fill="#c98a4b"/>` +
      line('M18 64H82M20 77H80M32 54L34 88M50 54V88M68 54L66 88', 2.4, '#8d5524') +
      `<rect x="8" y="44" width="84" height="12" rx="6" fill="#b5762f"/>`,
  )

const flag = () => {
  const up = 'M50 36L62.1 57H37.9Z'
  const dn = 'M50 64L62.1 43H37.9Z'
  return wrap(
    `<rect x="6" y="20" width="88" height="60" rx="4" fill="#fff"/>` +
      `<rect x="7.5" y="27" width="85" height="8" fill="${B}" ${N}/><rect x="7.5" y="65" width="85" height="8" fill="${B}" ${N}/>` +
      `<path d="${up}${dn}" fill="none" stroke="${B}" stroke-width="3.4" stroke-linejoin="miter"/>` +
      `<rect x="6" y="20" width="88" height="60" rx="4" fill="none"/>`,
  )
}

const seedling = () =>
  wrap(
    tube('M50 82Q48 64 50 48', G, 5) +
      `<path d="M50 52Q22 56 12 30Q40 22 50 52Z" fill="${G}"/>` +
      `<path d="M50 48Q58 16 90 16Q88 48 50 48Z" fill="#45b862"/>` +
      line('M46 48Q32 40 20 32M54 44Q66 30 82 22', 2, '#1f6e33') +
      `<path d="M14 90Q50 64 86 90Z" fill="${BR}"/>`,
  )

const backpack = () =>
  wrap(
    tube('M40 22Q40 8 50 8Q60 8 60 22', '#c92a2d', 4) +
      `<rect x="20" y="20" width="60" height="72" rx="18" fill="${R}"/>` +
      `<path d="M20 44Q50 56 80 44" fill="none"/>` +
      `<rect x="30" y="58" width="40" height="28" rx="8" fill="#c92a2d"/>` +
      line('M36 66H64', 2.4) +
      `<rect x="45" y="44" width="10" height="10" rx="2" fill="${Y}"/>`,
  )

const sunrise = () => {
  let rays = ''
  for (let i = 0; i < 7; i++) {
    const a = Math.PI + (i + 0.5) * (Math.PI / 7)
    const x1 = 50 + 27 * Math.cos(a), y1 = 64 + 27 * Math.sin(a)
    const x2 = 50 + 37 * Math.cos(a), y2 = 64 + 37 * Math.sin(a)
    rays += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`
  }
  return wrap(
    `<rect x="6" y="6" width="88" height="88" rx="14" fill="#ffb26b" ${N}/>` +
      line(rays, 4, '#fff1b8') +
      `<circle cx="50" cy="64" r="22" fill="${Y}"/>` +
      `<path d="M6 64H94V80a14 14 0 0 1-14 14H20A14 14 0 0 1 6 80Z" fill="${B}"/>` +
      line('M36 72H64M42 80H58M46 87H54', 3, '#ffe08a') +
      `<rect x="6" y="6" width="88" height="88" rx="14" fill="none"/>`,
  )
}

const bathtub = () =>
  wrap(
    tube('M18 46V24Q18 14 28 14h8V20', GR, 5) +
      `<circle cx="22" cy="40" r="7" fill="#cfe8ff"/><circle cx="34" cy="36" r="9" fill="#cfe8ff"/><circle cx="50" cy="38" r="8" fill="#cfe8ff"/><circle cx="64" cy="35" r="10" fill="#cfe8ff"/><circle cx="78" cy="39" r="7" fill="#cfe8ff"/>` +
      `<rect x="26" y="82" width="8" height="10" rx="3" fill="${GR}"/><rect x="66" y="82" width="8" height="10" rx="3" fill="${GR}"/>` +
      `<path d="M12 50h76v8q0 28-26 28H38Q12 86 12 58z" fill="#fff"/>` +
      `<rect x="6" y="44" width="88" height="10" rx="5" fill="#e3ebf5"/>`,
  )

const book = () =>
  wrap(
    `<path d="M4 30V88Q30 82 50 92Q70 82 96 88V30z" fill="${B}"/>` +
      `<path d="M50 28Q32 16 10 22V82Q32 76 50 86z" fill="#fff"/>` +
      `<path d="M50 28Q68 16 90 22V82Q68 76 50 86z" fill="#fff"/>` +
      line('M18 34Q30 31 42 36M18 44Q30 41 42 46M18 54Q30 51 42 56M18 64Q30 61 42 66M58 36Q70 31 82 34M58 46Q70 41 82 44M58 56Q70 51 82 54M58 66Q70 61 82 64', 2.2, '#b3bccb'),
  )

const leopard = () => {
  const c = '#f5b63c'
  const spots = [
    [44, 52], [56, 50], [68, 54], [50, 62], [62, 63], [38, 60], [74, 62],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="none" stroke="#6b3d14" stroke-width="2.4"/><circle cx="${x}" cy="${y}" r="1.2" fill="#6b3d14" ${N}/>`)
    .join('')
  return wrap(
    tube('M76 56Q94 54 90 32', c, 6) +
      `<rect x="30" y="60" width="9" height="30" rx="4.5" fill="${c}"/><rect x="66" y="60" width="9" height="30" rx="4.5" fill="${c}"/>` +
      `<rect x="40" y="62" width="9" height="28" rx="4.5" fill="#e0a02e"/><rect x="56" y="62" width="9" height="28" rx="4.5" fill="#e0a02e"/>` +
      `<ellipse cx="54" cy="58" rx="28" ry="15" fill="${c}"/>` +
      `<circle cx="16" cy="28" r="5" fill="${c}"/><circle cx="32" cy="26" r="5" fill="${c}"/>` +
      `<circle cx="24" cy="42" r="15" fill="${c}"/>` +
      `<ellipse cx="17" cy="48" rx="8" ry="6" fill="#fff3d6" ${N}/>` +
      `<path d="M10 44l5 0l-2.5 3z" fill="${S}" stroke-width="1.5"/>` +
      eye(23, 38, 3) +
      `<circle cx="30" cy="34" r="1.6" fill="#6b3d14" ${N}/><circle cx="33" cy="40" r="1.6" fill="#6b3d14" ${N}/><circle cx="29" cy="46" r="1.6" fill="#6b3d14" ${N}/>` +
      spots,
  )
}

const arrow = (rot: number) =>
  wrap(
    `<rect x="8" y="8" width="84" height="84" rx="16" fill="${B}"/>` +
      `<path d="M50 18L80 50H62V82H38V50H20Z" fill="#fff" transform="rotate(${rot} 50 50)"/>`,
  )

const lockOpen = () =>
  wrap(
    tube('M32 48V26Q32 8 50 8Q68 8 68 26V32', GR, 7) +
      `<rect x="20" y="46" width="60" height="46" rx="9" fill="${Y}"/>` +
      `<path d="M50 60a6 6 0 0 1 3.5 10.8L56 80H44l2.5-9.2A6 6 0 0 1 50 60z" fill="${S}" ${N}/>`,
  )

const droplet = () =>
  wrap(
    `<path d="M50 6C64 30 82 46 82 64a32 32 0 0 1-64 0C18 46 36 30 50 6Z" fill="${B}"/>` +
      `<path d="M34 62q0 12 10 18" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>`,
  )

const rock = () =>
  wrap(
    `<path d="M12 78Q8 54 26 42Q36 22 60 26Q84 30 88 56Q94 82 74 88H24Q12 88 12 78Z" fill="${GR}"/>` +
      `<path d="M30 46Q40 32 58 34" fill="none" stroke="#c6cbd1" stroke-width="5" ${''}/>` +
      line('M60 50L54 62L62 70M36 70L44 76', 2.4, '#6b7078'),
  )

const biceps = () => {
  const c = SK[1]
  return wrap(
    unite(
      `<rect x="22" y="60" width="74" height="28" rx="14" fill="${c}"/>`,
      `<ellipse cx="58" cy="60" rx="20" ry="16" fill="${c}"/>`,
      `<rect x="20" y="28" width="24" height="56" rx="12" fill="${c}" transform="rotate(-8 32 56)"/>`,
      `<ellipse cx="32" cy="24" rx="16" ry="14" fill="${c}"/>`,
    ) +
      line('M20 20q5 -3 9 0M20 27q5 -3 9 0M30 14q4 6 0 14', 2.2) +
      `<path d="M80 56h16v34H80z" fill="${B}"/>` +
      line('M48 56q10 -10 22 -2', 2.2) +
      `<path d="M66 50q-4 -4 -10 -3" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`,
  )
}

const lifter = () =>
  wrap(
    tube('M36 90L40 70M64 90L60 70', SK[2], 7) +
      tube('M40 54L28 34L24 18M60 54L72 34L76 18', SK[2], 7) +
      tube('M8 18H92', '#c6cbd1', 3.5) +
      `<rect x="6" y="6" width="9" height="24" rx="2.5" fill="#4a4a5a"/><rect x="85" y="6" width="9" height="24" rx="2.5" fill="#4a4a5a"/>` +
      `<rect x="14" y="9" width="6" height="18" rx="2" fill="#4a4a5a"/><rect x="80" y="9" width="6" height="18" rx="2" fill="#4a4a5a"/>` +
      `<path d="M36 66h28l2 10H34z" fill="${B}"/>` +
      `<rect x="37" y="48" width="26" height="22" rx="6" fill="${R}"/>` +
      head(50, 38, 10, SK[2], '#2f2f3a') +
      `<circle cx="46" cy="39" r="1.6" fill="${S}" ${N}/><circle cx="54" cy="39" r="1.6" fill="${S}" ${N}/>` +
      line('M46 43.5q4 2 8 0', 2) +
      `<rect x="31" y="88" width="10" height="5" rx="2.5" fill="${S}"/><rect x="59" y="88" width="10" height="5" rx="2.5" fill="${S}"/>`,
  )

const feather = () =>
  wrap(
    `<path d="M22 86C14 56 38 18 84 8C88 40 64 76 22 86Z" fill="#8fd3ff"/>` +
      `<path d="M40 52l-10 -2M56 36l-10 -6M70 24l-6 -8M60 52l8 4M44 70l8 6" fill="none" stroke="#fff" stroke-width="3"/>` +
      line('M10 94Q40 60 80 14', 3),
  )

const jar = () =>
  wrap(
    `<rect x="20" y="28" width="60" height="64" rx="14" fill="#d6eef8"/>` +
      `<rect x="28" y="22" width="44" height="10" rx="3" fill="#d6eef8"/>` +
      `<rect x="25" y="8" width="50" height="16" rx="5" fill="${GR}"/>` +
      line('M33 12V20M41 12V20M50 12V20M59 12V20M67 12V20', 1.8, '#6b7078') +
      `<path d="M30 42V78" fill="none" stroke="#fff" stroke-width="6" opacity=".9"/><path d="M40 44V54" fill="none" stroke="#fff" stroke-width="4" opacity=".9"/>`,
  )

const mountain = () =>
  wrap(
    `<path d="M48 88L72 40L96 88Z" fill="#b2b7bf"/>` +
      `<path d="M64 56L72 40L80 56L76 53L72 58L68 53Z" fill="#fff"/>` +
      `<path d="M4 88L38 14L72 88Z" fill="#8a8f99"/>` +
      `<path d="M27 38L38 14L49 38L44 34L38 40L32 34Z" fill="#fff"/>` +
      `<path d="M38 40L44 88" fill="none" stroke="#6f747c" stroke-width="2.2"/>`,
  )

const cherries = () =>
  wrap(
    line('M58 12Q40 30 32 62M58 12Q64 40 68 66', 3.5, '#4a7a2a') +
      `<path d="M58 12Q74 2 88 14Q72 24 58 12Z" fill="${G}"/>` +
      `<circle cx="30" cy="72" r="17" fill="${R}"/><circle cx="68" cy="76" r="17" fill="${R}"/>` +
      `<ellipse cx="24" cy="66" rx="4" ry="6" fill="#fff" opacity=".6" ${N}/><ellipse cx="62" cy="70" rx="4" ry="6" fill="#fff" opacity=".6" ${N}/>`,
  )

const bricks = () => {
  const c = '#c8553d'
  const rows: [number, number][][] = [
    [[8, 40], [52, 40]],
    [[8, 18], [30, 40], [74, 18]],
    [[8, 40], [52, 40]],
    [[8, 18], [30, 40], [74, 18]],
  ]
  let s = `<rect x="6" y="14" width="88" height="76" rx="4" fill="#d9d2c5"/>`
  rows.forEach((row, i) => {
    const y = 16 + i * 18.5
    for (const [x, w] of row)
      s += `<rect x="${x}" y="${y}" width="${w}" height="16" rx="3" fill="${c}" stroke-width="2.2"/><path d="M${x + 4} ${y + 4}h${w - 10}" stroke="#e98a6e" stroke-width="2.4"/>`
  })
  return wrap(s)
}

const leafShape = (x: number, y: number, rot: number, L: number, W: number, c: string, v: string) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M${-L} 0Q0 ${-W} ${L} 0Q0 ${W} ${-L} 0Z" fill="${c}"/>` +
  `<path d="M${-L + 4} 0H${L - 6}" fill="none" stroke="${v}" stroke-width="2"/></g>`

const leaves = () =>
  wrap(
    line('M6 56Q28 46 48 56T90 52M14 76Q34 68 54 76', 3, '#8ab4d8') +
      `<path d="M90 52q8 -6 2 -12q-6 -4 -10 2" fill="none" stroke="#8ab4d8" stroke-width="3"/>` +
      leafShape(34, 32, -30, 24, 15, G, '#1f6e33') +
      leafShape(68, 72, 25, 20, 13, '#45b862', '#1f6e33'),
  )

const pumpkin = () =>
  wrap(
    tube('M50 26Q48 14 56 8', '#5a7a2a', 6) +
      `<ellipse cx="32" cy="58" rx="22" ry="32" fill="${O}"/><ellipse cx="68" cy="58" rx="22" ry="32" fill="${O}"/>` +
      `<ellipse cx="50" cy="58" rx="20" ry="34" fill="#ff8f1a"/>` +
      `<path d="M28 44L38 52H24Z M72 44L76 52H62Z" fill="${S}" stroke-width="2"/>` +
      `<path d="M47 56L50 52L53 56Z" fill="${S}" stroke-width="2"/>` +
      `<path d="M24 64Q50 84 76 64L70 68L64 63L57 70L50 64L43 70L36 63L30 68Z" fill="${S}" stroke-width="2"/>`,
  )

const coin = () =>
  wrap(
    `<circle cx="55" cy="55" r="38" fill="#d99a1e"/>` +
      `<circle cx="48" cy="48" r="38" fill="${Y}"/>` +
      `<circle cx="48" cy="48" r="28" fill="none" stroke="#d99a1e" stroke-width="3"/>` +
      `<path d="M48 32l4.7 9.6 10.6 1.5-7.7 7.5 1.8 10.5L48 56.1l-9.4 5 1.8-10.5-7.7-7.5 10.6-1.5Z" fill="#f5b020" stroke="#d99a1e" stroke-width="2"/>` +
      `<path d="M24 38q6 -14 20 -18" fill="none" stroke="#fff" stroke-width="4" opacity=".7"/>`,
  )

const ring = () =>
  wrap(
    `<circle cx="50" cy="64" r="28" fill="none" stroke-width="13"/><circle cx="50" cy="64" r="28" fill="none" stroke="${Y}" stroke-width="7.5"/>` +
      `<rect x="42" y="34" width="16" height="8" rx="2" fill="${Y}"/>` +
      `<path d="M32 22L40 10H60L68 22L50 42Z" fill="#bfe6ff"/>` +
      line('M32 22H68M40 10L44 22L50 42L56 22L60 10M44 22L50 10L56 22', 1.8, '#5a9fd0') +
      `<path d="M38 16l3 -4" stroke="#fff" stroke-width="2.5"/>`,
  )

const ladybug = () =>
  wrap(
    line('M40 18Q34 8 28 8M60 18Q66 8 72 8', 2.8) +
      line('M18 46L8 40M16 62L6 64M20 78L12 86M82 46L92 40M84 62L94 64M80 78L88 86', 3.4) +
      `<circle cx="50" cy="26" r="14" fill="#2f2f3a"/>` +
      `<circle cx="44" cy="22" r="2.6" fill="#fff" ${N}/><circle cx="56" cy="22" r="2.6" fill="#fff" ${N}/>` +
      `<circle cx="50" cy="60" r="34" fill="${R}"/>` +
      line('M50 27V94', 2.8) +
      [[34, 44, 6], [66, 44, 6], [30, 66, 5.5], [70, 66, 5.5], [42, 82, 4.5], [58, 82, 4.5]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2f2f3a" ${N}/>`)
        .join('') +
      `<path d="M30 36q6 -6 14 -6" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`,
  )

const couch = () => {
  const c = '#c98a4b'
  return wrap(
    line('M88 22V86', 3) +
      `<path d="M80 88h16l-2 -4h-12z" fill="#4a4a5a"/>` +
      `<path d="M78 30h20l-5 -18h-10z" fill="${Y}"/>` +
      `<rect x="14" y="66" width="5" height="12" fill="#5a3414"/><rect x="62" y="66" width="5" height="12" fill="#5a3414"/>` +
      `<rect x="12" y="34" width="58" height="30" rx="9" fill="${c}"/>` +
      `<rect x="10" y="56" width="62" height="18" rx="6" fill="#b5763a"/>` +
      `<rect x="2" y="46" width="14" height="30" rx="6" fill="${c}"/><rect x="66" y="46" width="14" height="30" rx="6" fill="${c}"/>` +
      line('M41 38V56', 2.2, '#8d5524'),
  )
}

const iceCream = () =>
  wrap(
    `<path d="M32 50L50 94L68 50Z" fill="#e8b86a"/>` +
      line('M38 54L57 78M48 52L61 68M56 52L64 60M62 54L43 78M52 52L39 66M44 52L36 58', 2, '#b5762f') +
      `<rect x="24" y="42" width="52" height="15" rx="7.5" fill="#fff8ee"/>` +
      `<rect x="30" y="28" width="40" height="15" rx="7.5" fill="#fff8ee"/>` +
      `<rect x="37" y="15" width="26" height="14" rx="7" fill="#fff8ee"/>` +
      `<path d="M44 16Q50 2 56 16" fill="#fff8ee"/>`,
  )

const calendar = () => {
  let grid = ''
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 4; c++)
      grid += `<rect x="${22 + c * 15}" y="${48 + r * 13}" width="9" height="8" rx="2" fill="${r === 1 && c === 2 ? R : '#c9d0db'}" ${N}/>`
  return wrap(
    `<rect x="12" y="18" width="76" height="74" rx="8" fill="#fff"/>` +
      `<path d="M12 40V26a8 8 0 0 1 8-8h60a8 8 0 0 1 8 8v14z" fill="${R}"/>` +
      `<rect x="27" y="8" width="7" height="18" rx="3.5" fill="${GR}"/><rect x="66" y="8" width="7" height="18" rx="3.5" fill="${GR}"/>` +
      grid,
  )
}

const fallenLeaf = () => {
  const maple =
    'M50 8L58 26L70 20L66 38L84 36L74 50L80 58L58 58L54 72L50 64L46 72L42 58L20 58L26 50L16 36L34 38L30 20L42 26Z'
  return wrap(
    `<g transform="translate(66 64) rotate(30) scale(.55) translate(-50 -40)"><path d="${maple}" fill="#b5622a" stroke-width="4.5"/></g>` +
      `<g transform="rotate(-12 50 50)"><path d="${maple}" fill="${O}"/>` +
      line('M50 64V92', 3.4) +
      line('M50 62V22M50 50L28 40M50 50L72 40', 2, '#c45f00') +
      '</g>',
  )
}

const handshake = () =>
  wrap(
    `<rect x="2" y="42" width="24" height="30" rx="4" fill="${B}"/>` +
      `<rect x="74" y="36" width="24" height="30" rx="4" fill="${O}"/>` +
      `<rect x="22" y="46" width="40" height="22" rx="11" fill="${SK[3]}"/>` +
      `<rect x="40" y="38" width="38" height="24" rx="12" fill="${SK[1]}"/>` +
      `<rect x="34" y="52" width="9" height="22" rx="4.5" fill="${SK[1]}"/>` +
      `<rect x="42" y="54" width="9" height="22" rx="4.5" fill="${SK[1]}"/>` +
      `<rect x="50" y="54" width="9" height="20" rx="4.5" fill="${SK[1]}"/>` +
      `<path d="M30 48Q40 32 58 40" fill="none" stroke-width="12"/><path d="M30 48Q40 32 58 40" fill="none" stroke="${SK[3]}" stroke-width="7"/>`,
  )

const plug = () =>
  wrap(
    `<rect x="36" y="10" width="8" height="26" rx="2" fill="#c6cbd1"/><rect x="56" y="10" width="8" height="26" rx="2" fill="#c6cbd1"/>` +
      tube('M50 74Q50 92 30 88Q14 84 10 96', '#4a4a5a', 7) +
      `<rect x="28" y="32" width="44" height="40" rx="10" fill="#4a4a5a"/>` +
      `<rect x="24" y="30" width="52" height="10" rx="4" fill="#6b6b7d"/>`,
  )

const walker = () =>
  wrap(
    tube('M48 58L40 75L32 90M48 58L58 74L66 88', B, 8) +
      `<path d="M26 92h10M62 90h10" fill="none" stroke-width="7"/>` +
      tube('M50 36L40 48L36 60', SK[0], 6) +
      tube('M50 32L48 58', G, 15) +
      tube('M52 36L62 46L70 50', SK[0], 6) +
      head(54, 18, 11, SK[0], '#8d5524') +
      `<circle cx="58" cy="19" r="1.8" fill="${S}" ${N}/>` +
      line('M57 24q3 1.5 5 0', 2),
  )

const runner = () =>
  wrap(
    line('M6 38H20M4 50H16M8 62H20', 3, '#9aa0a6') +
      tube('M46 56L30 62L22 78M46 56L62 66L56 88', '#4a4a5a', 8) +
      `<path d="M16 76l8 6M52 90h10" fill="none" stroke-width="7"/>` +
      tube('M54 34L40 42L32 32', SK[2], 6) +
      tube('M56 30L46 56', R, 15) +
      tube('M56 36L70 42L80 32', SK[2], 6) +
      head(64, 18, 11, SK[2], '#2f2f3a') +
      `<circle cx="68" cy="19" r="1.8" fill="${S}" ${N}/>` +
      line('M66 24q3 1.5 5 0', 2),
  )

const windowPane = () =>
  wrap(
    `<rect x="14" y="10" width="72" height="76" rx="4" fill="#c98a4b"/>` +
      `<rect x="21" y="17" width="27" height="29" fill="#a8d8ff" stroke-width="2.2"/><rect x="52" y="17" width="27" height="29" fill="#a8d8ff" stroke-width="2.2"/>` +
      `<rect x="21" y="50" width="27" height="29" fill="#a8d8ff" stroke-width="2.2"/><rect x="52" y="50" width="27" height="29" fill="#a8d8ff" stroke-width="2.2"/>` +
      `<path d="M56 34a5 5 0 0 1 8 -5a6 6 0 0 1 11 3a4 4 0 0 1 0 8h-17a3 3 0 0 1 -2 -6z" fill="#fff" stroke-width="1.8"/>` +
      `<path d="M26 26l8 -6M26 60l10 -7" stroke="#fff" stroke-width="3"/>` +
      `<rect x="8" y="84" width="84" height="8" rx="3" fill="#b5763a"/>`,
  )

const pray = () => {
  const c = SK[1]
  return wrap(
    `<path d="M50 8Q40 10 36 28L30 62Q30 76 42 78H50Z" fill="${c}"/>` +
      `<path d="M50 8Q60 10 64 28L70 62Q70 76 58 78H50Z" fill="${c}"/>` +
      line('M50 10V78', 2.4) +
      line('M46 46Q42 58 46 70M54 46Q58 58 54 70', 2.2) +
      line('M33 40h5M31 52h5M64 40h-5M66 52h-5', 2) +
      `<rect x="28" y="76" width="44" height="16" rx="4" fill="${B}"/>` +
      line('M22 20l-6 -4M20 34h-8M78 20l6 -4M80 34h8', 3, Y),
  )
}

const popper = () =>
  wrap(
    line('M36 52Q44 30 34 16M54 64Q74 60 84 72M44 56Q62 40 66 22', 3, P) +
      `<rect x="70" y="10" width="7" height="7" fill="${R}" transform="rotate(20 73 13)"/>` +
      `<rect x="84" y="36" width="7" height="7" fill="${B}" transform="rotate(-15 87 39)"/>` +
      `<rect x="50" y="10" width="6" height="6" fill="${G}" transform="rotate(35 53 13)"/>` +
      `<circle cx="88" cy="22" r="3.5" fill="${Y}"/><circle cx="24" cy="22" r="3.5" fill="#ff8fab"/><circle cx="78" cy="88" r="3.5" fill="${G}"/>` +
      `<rect x="88" y="54" width="6" height="6" fill="#ff8fab" transform="rotate(25 91 57)"/>` +
      `<path d="M8 92L26 44L56 74Z" fill="${Y}"/>` +
      line('M18 64L36 80M14 76L26 86M22 54L46 76', 4, R) +
      `<path d="M8 92L26 44L56 74Z" fill="none"/>` +
      `<ellipse cx="41" cy="59" rx="21" ry="7" fill="#ffe08a" transform="rotate(45 41 59)"/>`,
  )

const plate = () =>
  wrap(
    `<circle cx="50" cy="52" r="30" fill="#fff"/><circle cx="50" cy="52" r="20" fill="#eef2f7" stroke-width="2"/>` +
      `<path d="M8 12v16q0 9 6.5 9t6.5 -9V12" fill="#c6cbd1"/>` +
      line('M12.3 13V26M16.7 13V26', 2) +
      `<rect x="11" y="36" width="7" height="56" rx="3.5" fill="#c6cbd1"/>` +
      `<path d="M83 10q11 10 9 38h-9z" fill="#c6cbd1"/>` +
      `<rect x="83" y="46" width="8" height="46" rx="3.5" fill="#c6cbd1"/>`,
  )

const cutlery = () =>
  wrap(
    `<path d="M22 8v24q0 12 11 12t11 -12V8" fill="#c6cbd1"/>` +
      line('M29.5 9V30M36.5 9V30', 2.6) +
      `<rect x="28" y="42" width="10" height="52" rx="5" fill="#c6cbd1"/>` +
      `<path d="M60 8q22 16 18 54H60z" fill="#c6cbd1"/>` +
      `<rect x="60" y="58" width="12" height="36" rx="5" fill="#c6cbd1"/>` +
      `<path d="M65 18q8 10 8 26" fill="none" stroke="#fff" stroke-width="3"/>`,
  )

const tap = () =>
  wrap(
    `<rect x="6" y="6" width="88" height="88" rx="16" fill="${B}"/>` +
      `<path d="M58 50V60" stroke="#8fd3ff" stroke-width="5"/>` +
      tube('M18 32H50Q60 32 60 42V46', '#fff', 8) +
      `<rect x="28" y="16" width="14" height="6" rx="3" fill="#fff"/>` +
      line('M35 22V27', 4) +
      `<path d="M44 60h28l-4 26H48z" fill="#fff"/>` +
      `<path d="M46 70h24l-2.5 14H48.5z" fill="#8fd3ff" ${N}/>`,
  )

const sandwich = () => {
  const tri = (dy: number, crust: string, inner: string) =>
    `<path d="M10 ${70 + dy}L50 ${12 + dy}L90 ${70 + dy}Q50 ${78 + dy} 10 ${70 + dy}Z" fill="${crust}"/>` +
    (inner ? `<path d="M22 ${66 + dy}L50 ${26 + dy}L78 ${66 + dy}Q50 ${71 + dy} 22 ${66 + dy}Z" fill="${inner}" ${N}/>` : '')
  return wrap(
    tri(20, '#c98a4b', '') +
      `<path d="M10 84L50 28L90 84Q80 90 70 84T50 84T30 84T10 84Z" fill="${G}"/>` +
      `<path d="M14 80L50 24L86 80Z" fill="${R}"/>` +
      `<path d="M12 76L50 20L88 76L70 82L60 76L40 84L30 76Z" fill="${Y}"/>` +
      tri(0, '#c98a4b', '#f6dfa8'),
  )
}

const basketball = () =>
  wrap(
    `<circle cx="50" cy="50" r="41" fill="${O}"/>` +
      line('M50 9V91M9 50H91M22 20Q40 50 22 80M78 20Q60 50 78 80', 2.8) +
      `<path d="M26 32q6 -10 16 -14" fill="none" stroke="#fff" stroke-width="4" opacity=".5"/>`,
  )

const slide = () =>
  wrap(
    line('M70 20V92M88 20V92', 5, B) +
      line('M70 36H88M70 52H88M70 68H88M70 84H88', 3.5, B) +
      line('M70 20V92M88 20V92', 1) +
      `<path d="M60 18H92V26H60Z" fill="${B}"/>` +
      `<path d="M58 22H72Q62 66 24 88H6Q44 66 58 22Z" fill="${Y}"/>` +
      `<path d="M60 26Q52 62 16 84" fill="none" stroke="${R}" stroke-width="4"/>`,
  )

/* ---------- faces & people ---------- */

const zz = (x: number, y: number, s: number) =>
  `<path d="M${x} ${y}h${s}l${-s} ${s * 1.1}h${s}" fill="none" stroke="${B}" stroke-width="${s > 9 ? 4 : 3}"/>`

const faces = {
  sleep: () =>
    face(
      line('M26 50q8 6 16 0M58 50q8 6 16 0', 3.5) +
        `<ellipse cx="50" cy="72" rx="5" ry="6" fill="${S}"/>` +
        cheeks(62) +
        zz(70, 4, 12) +
        zz(88, 22, 8),
    ),
  cry: () =>
    face(
      line('M24 36L40 28M76 36L60 28', 3.5) +
        eye(35, 46, 4.5) +
        eye(65, 46, 4.5) +
        line('M34 76Q50 62 66 76', 4) +
        drop(70, 54, 8),
    ),
  yawn: () =>
    face(
      line('M24 36Q32 30 40 34M60 34Q68 30 76 36', 3.2) +
        line('M26 46q8 4 15 0M59 46q8 4 15 0', 3.5) +
        `<ellipse cx="50" cy="70" rx="12" ry="15" fill="${S}"/>` +
        `<ellipse cx="50" cy="78" rx="7" ry="4.5" fill="#ff6b8b" ${N}/>` +
        drop(22, 50, 4),
    ),
  joy: () =>
    face(
      line('M24 30Q32 24 40 28M60 28Q68 24 76 30', 3.2) +
        line('M26 44L35 36L44 44M56 44L65 36L74 44', 4) +
        `<path d="M24 56H76Q74 86 50 86Q26 86 24 56Z" fill="${S}"/>` +
        `<path d="M27 58H73Q72.5 64 71 66H29Q27.5 64 27 58Z" fill="#fff" ${N}/>` +
        `<path d="M36 80Q50 70 64 80Q58 85 50 85Q42 85 36 80Z" fill="#ff6b8b" ${N}/>` +
        `<g transform="rotate(60 14 46)">${drop(14, 40, 7)}</g>` +
        `<g transform="rotate(-60 86 46)">${drop(86, 40, 7)}</g>`,
    ),
  sob: () =>
    face(
      line('M22 32L40 26M78 32L60 26', 3.5) +
        line('M26 44q8 -5 15 0M59 44q8 -5 15 0', 3.5) +
        `<path d="M27 46H39L42 90Q33 93 24 88Z" fill="#5fb4ff" stroke-width="2.4"/>` +
        `<path d="M61 46H73L76 88Q67 93 58 90Z" fill="#5fb4ff" stroke-width="2.4"/>` +
        `<path d="M40 74Q50 52 60 74Q60 84 50 84Q40 84 40 74Z" fill="${S}"/>`,
    ),
  pensive: () =>
    face(
      line('M24 34L40 30M76 34L60 30', 3.2) +
        line('M27 50q7 4 14 0M59 50q7 4 14 0', 3.5) +
        line('M40 72Q50 66 60 72', 3.5),
    ),
  huff: () =>
    face(
      line('M24 32L42 40M76 32L58 40', 4.5) +
        eye(35, 48, 4) +
        eye(65, 48, 4) +
        `<ellipse cx="50" cy="60" rx="4" ry="2.5" fill="#d99a1e" ${N}/>` +
        line('M38 76Q50 68 62 76', 4) +
        `<circle cx="14" cy="76" r="7" fill="#eef2f7"/><circle cx="6" cy="84" r="5" fill="#eef2f7"/><circle cx="20" cy="86" r="6" fill="#eef2f7"/>` +
        `<circle cx="86" cy="76" r="7" fill="#eef2f7"/><circle cx="94" cy="84" r="5" fill="#eef2f7"/><circle cx="80" cy="86" r="6" fill="#eef2f7"/>`,
    ),
  sneeze: () =>
    face(
      line('M24 28Q32 22 40 28M60 28Q68 22 76 28', 3.2) +
        line('M26 36L38 42L26 48M74 36L62 42L74 48', 4) +
        `<path d="M28 60L66 52L76 84L40 92Z" fill="#fff"/>` +
        line('M46 60L54 88M36 72L70 66', 1.8, '#c9d0db') +
        `<g transform="rotate(-30 84 52)">${drop(84, 46, 5)}</g>`,
    ),
}

const child = () =>
  wrap(
    `<path d="M14 98Q16 74 50 74Q84 74 86 98Z" fill="${G}"/>` +
      `<path d="M40 74Q50 84 60 74" fill="#e0ac80"/>` +
      `<circle cx="22" cy="48" r="6" fill="${SK[1]}"/><circle cx="78" cy="48" r="6" fill="${SK[1]}"/>` +
      `<circle cx="50" cy="46" r="28" fill="${SK[1]}"/>` +
      `<path d="M22 44Q20 14 50 16Q80 14 78 44Q70 30 58 30Q60 24 54 22Q46 32 22 44Z" fill="${BR}"/>` +
      eye(40, 48, 3.6) +
      eye(60, 48, 3.6) +
      cheeks(57, 18) +
      line('M42 60Q50 68 58 60', 3),
  )

const wave = () =>
  wrap(
    `<g transform="rotate(-18 50 60)">${hand(SK[0])}</g>` +
      line('M84 16q8 8 8 18M80 24q5 5 5 12M10 26q-4 8 -2 16', 3.2, '#9aa0a6'),
  )

export const ART: Record<string, string> = {
  '🕎': menorah(),
  '🎭': masks(),
  '🫓': flatbread(),
  '🛖': hut(),
  '🧺': basket(),
  '🇮🇱': flag(),
  '🌱': seedling(),
  '🎒': backpack(),
  '🌅': sunrise(),
  '🛁': bathtub(),
  '📖': book(),
  '😴': faces.sleep(),
  '🐆': leopard(),
  '⬆': arrow(0),
  '⬇': arrow(180),
  '😢': faces.cry(),
  '🔓': lockOpen(),
  '💧': droplet(),
  '🪨': rock(),
  '💪': biceps(),
  '🥱': faces.yawn(),
  '🏋': lifter(),
  '🪶': feather(),
  '😂': faces.joy(),
  '😭': faces.sob(),
  '🫙': jar(),
  '⛰': mountain(),
  '🍒': cherries(),
  '🧱': bricks(),
  '🍃': leaves(),
  '🎃': pumpkin(),
  '🪙': coin(),
  '💍': ring(),
  '🐞': ladybug(),
  '🛋': couch(),
  '🍦': iceCream(),
  '📅': calendar(),
  '✋': wrap(hand(SK[1])),
  '🍂': fallenLeaf(),
  '🤝': handshake(),
  '🔌': plug(),
  '🚶': walker(),
  '🪟': windowPane(),
  '🙏': pray(),
  '😔': faces.pensive(),
  '🎉': popper(),
  '😤': faces.huff(),
  '👋': wave(),
  '🍽': plate(),
  '🤧': faces.sneeze(),
  '🧒': child(),
  '📄': wrap(
    `<path d="M22 6H64L82 24V94H22Z" fill="#fff"/><path d="M64 6V24H82" fill="#e3e7ee"/>` +
      line('M32 36H72M32 48H72M32 60H72M32 72H60', 3, '#b3bccb'),
  ),
  '🍴': cutlery(),
  '🚰': tap(),
  '🥪': sandwich(),
  '🏀': basketball(),
  '🏃': runner(),
  '🛝': slide(),
}
