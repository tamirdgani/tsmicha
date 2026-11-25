/* Common drawings, batch 2: one per emoji the lessons use (viewBox 0 0 100 100). */

const S = '#2b2b3a'
const N = 'stroke="none"'
/** Wraps a drawing in the shared outline style (children inherit the stroke). */
const wrap = (s: string) =>
  `<g stroke="${S}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round">${s}</g>`
const r1 = (n: number) => Math.round(n * 10) / 10

const RED = '#e5383b', BLUE = '#1d70d8', YEL = '#ffc83d', GRN = '#2e9a48', ORG = '#f77f00'
const PUR = '#8b5cf6', PINK = '#ff8fab', BRN = '#8d5524', GRAY = '#9aa0a6', SKY = '#bfe3ff'

/** Shiny cartoon eye. */
const eye = (x: number, y: number, r = 4) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r1(r * 1.15)}" fill="${S}" ${N}/>` +
  `<circle cx="${r1(x + r * 0.35)}" cy="${r1(y - r * 0.45)}" r="${r1(r * 0.4)}" fill="#fff" ${N}/>`
const eyes = (cx: number, y: number, dx: number, r = 4) => eye(cx - dx, y, r) + eye(cx + dx, y, r)
const cheeks = (cx: number, y: number, dx: number, c = '#ff6b8b') =>
  `<ellipse cx="${cx - dx}" cy="${y}" rx="4.2" ry="2.6" fill="${c}" opacity=".45" ${N}/>` +
  `<ellipse cx="${cx + dx}" cy="${y}" rx="4.2" ry="2.6" fill="${c}" opacity=".45" ${N}/>`
/** Little "w" mouth hanging under a nose. */
const wMouth = (cx: number, y: number) =>
  `<path d="M${cx} ${y - 2.5}V${y}M${cx - 5} ${y}Q${cx - 2.5} ${y + 3.5} ${cx} ${y}Q${cx + 2.5} ${y + 3.5} ${cx + 5} ${y}" fill="none" stroke-width="2.3"/>`
/** Thick outlined tube (tails, necks, sticks). */
const tube = (d: string, c: string, w = 7) =>
  `<path d="${d}" fill="none" stroke-width="${r1(w + 5.6)}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Draws shapes so their union gets one shared outline (outlines first, fills on top). */
const unite = (...els: string[]) =>
  els.map((e) => e.replace('/>', ' stroke-width="5.6"/>')).join('') + els.map((e) => e.replace('/>', ` ${N}/>`)).join('')
const hi = (x: number, y: number, rx: number, ry: number, rot = 0) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".4" ${N}${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}/>`
/** Pointed leaf from (x,y), length L, at angle a (degrees, 0 = up). */
const leaf = (x: number, y: number, L: number, a: number, c = GRN, w = 0.38) =>
  `<path d="M0 0Q${r1(L * w)} ${r1(-L / 2)} 0 ${-L}Q${r1(-L * w)} ${r1(-L / 2)} 0 0Z" fill="${c}" transform="translate(${x} ${y}) rotate(${a})"/>`
const mirror = (s: string) => `<g transform="translate(100 0) scale(-1 1)">${s}</g>`
const wheel = (x: number, y: number, r = 9, hub = '#c9ccd1') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#3a3a48"/><circle cx="${x}" cy="${y}" r="${r1(r * 0.42)}" fill="${hub}" stroke-width="2"/>`
const water = (y: number) =>
  `<path d="M6 ${y}Q14 ${y - 5} 22 ${y}T38 ${y}T54 ${y}T70 ${y}T86 ${y}Q90 ${y - 2.5} 94 ${y}V${y + 8}Q94 ${y + 12} 90 ${y + 12}H10Q6 ${y + 12} 6 ${y + 8}Z" fill="#5aa9f0"/>`
/** Point on a quadratic Bezier. */
const qp = (a: number[], b: number[], c: number[], t: number) => {
  const u = 1 - t
  return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]
}

// ---------- nature ----------
const wave = () => wrap(
  `<path d="M8 90C8 58 22 28 50 20C72 14 92 26 90 46C89 58 76 62 68 55C62 49 67 41 74 44C71 34 56 34 52 47C48 62 60 76 80 78C86 79 91 77 93 74V90Z" fill="${BLUE}"/>` +
  `<path d="M20 52C26 34 40 24 58 22" fill="none" stroke="#fff" stroke-width="4" opacity=".75"/>` +
  `<path d="M16 76C18 66 22 58 28 52M30 86C30 78 34 70 38 66" fill="none" stroke="#5aa9f0" stroke-width="3.5"/>` +
  `<path d="M54 22Q70 16 84 26Q90 32 88 42Q82 32 72 30Q62 28 54 22Z" fill="#fff" stroke-width="2.2"/>` +
  `<circle cx="84" cy="62" r="3" fill="#fff" stroke-width="2"/><circle cx="91" cy="56" r="2" fill="#fff" stroke-width="1.8"/>`
)

const mountain = () => wrap(
  `<path d="M44 90L71 36L97 90Z" fill="#b7c0cf"/>` +
  `<path d="M71 36L63 52L68 50L72 55L77 50L80 53Z" fill="#fff"/>` +
  `<path d="M4 90L40 14L80 90Z" fill="#7f8ba0"/>` +
  `<path d="M40 14L29 37L35 33L40 40L46 33L53 38Z" fill="#fff"/>` +
  `<path d="M40 44L30 70M52 52L60 72" fill="none" stroke="#66728a" stroke-width="2.4"/>` +
  `<path d="M4 90H97" fill="none"/>`
)

const tree = () => wrap(
  `<path d="M43 92L46 58L38 50M46 62L54 52M57 92L54 58" fill="${BRN}" stroke-width="2.6"/>` +
  `<path d="M42 92L45 56H55L58 92Z" fill="${BRN}"/>` +
  unite(
    `<circle cx="50" cy="30" r="21" fill="${GRN}"/>`, `<circle cx="28" cy="45" r="17" fill="${GRN}"/>`,
    `<circle cx="72" cy="45" r="17" fill="${GRN}"/>`, `<circle cx="50" cy="52" r="18" fill="${GRN}"/>`
  ) +
  `<circle cx="42" cy="24" r="7" fill="#7fd08a" opacity=".6" ${N}/><circle cx="24" cy="40" r="5" fill="#7fd08a" opacity=".6" ${N}/>` +
  `<path d="M30 92H70" fill="none"/>`
)

const desert = () => wrap(
  `<circle cx="74" cy="22" r="11" fill="${YEL}"/>` +
  `<path d="M4 66Q28 48 54 62Q76 52 96 60V90H4Z" fill="#f0c070"/>` +
  tube('M34 82V36', GRN, 10) + tube('M34 64H24V50', GRN, 7) + tube('M34 56H44V44', GRN, 7) +
  `<path d="M31 42V78M37 42V78" fill="none" stroke="#1f7a3a" stroke-width="1.6"/>` +
  `<path d="M4 80Q46 62 96 78V90H4Z" fill="#f7d58c"/>` +
  `<path d="M4 90H96" fill="none"/><path d="M60 82Q70 80 78 82" fill="none" stroke="#d9a24a" stroke-width="2.2"/>`
)

const iceCube = () => wrap(
  `<path d="M50 14L86 30L50 46L14 30Z" fill="#e4f6ff"/>` +
  `<path d="M14 30L50 46V88L14 72Z" fill="#a9dcf7"/>` +
  `<path d="M50 46L86 30V72L50 88Z" fill="#7cc4ee"/>` +
  `<path d="M21 40V58M27 30L46 22" fill="none" stroke="#fff" stroke-width="3.5"/>` +
  `<path d="M58 50L78 41" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>`
)

const web = () => {
  const n = 8, cx = 50, cy = 50
  const ang = (i: number) => (i / n) * Math.PI * 2 - Math.PI / 2 + 0.2
  let d = ''
  for (let i = 0; i < n; i++) d += `M${cx} ${cy}L${r1(cx + 45 * Math.cos(ang(i)))} ${r1(cy + 45 * Math.sin(ang(i)))}`
  for (const R of [10, 20, 30, 40]) {
    for (let i = 0; i < n; i++) {
      const a = ang(i), b = ang(i + 1), m = (a + b) / 2
      const p = [r1(cx + R * Math.cos(a)), r1(cy + R * Math.sin(a))]
      const q = [r1(cx + R * Math.cos(b)), r1(cy + R * Math.sin(b))]
      const c = [r1(cx + R * 0.82 * Math.cos(m)), r1(cy + R * 0.82 * Math.sin(m))]
      d += `M${p[0]} ${p[1]}Q${c[0]} ${c[1]} ${q[0]} ${q[1]}`
    }
  }
  return `<path d="${d}" fill="none" stroke="#5a5f6e" stroke-width="2.6" stroke-linecap="round"/>`
}

const lotus = () => {
  const P = (a: number, L: number, c: string) =>
    `<path d="M0 0Q${r1(L * 0.5)} ${r1(-L * 0.45)} 0 ${-L}Q${r1(-L * 0.5)} ${r1(-L * 0.45)} 0 0Z" fill="${c}" transform="translate(50 74) rotate(${a})"/>`
  return wrap(
    `<ellipse cx="50" cy="80" rx="40" ry="11" fill="${GRN}"/><path d="M50 80L58 70" fill="none" stroke="#1f7a3a" stroke-width="2.4"/>` +
    P(-72, 36, PINK) + P(72, 36, PINK) + P(-40, 48, PINK) + P(40, 48, PINK) +
    P(-18, 56, '#ffb3c6') + P(18, 56, '#ffb3c6') + P(0, 62, PINK) +
    `<path d="M50 70V30" fill="none" stroke="#ffd1dc" stroke-width="3" opacity=".8"/>`
  )
}

const honey = () => wrap(
  tube('M60 36L80 8', '#c8843a', 5) + `<rect x="74" y="4" width="10" height="12" rx="3" fill="#e0a25a" transform="rotate(35 79 10)"/>` +
  `<path d="M24 40Q12 62 22 82Q30 92 50 92Q70 92 78 82Q88 62 76 40Z" fill="#c8661a"/>` +
  `<rect x="18" y="30" width="64" height="12" rx="6" fill="#a8521a"/>` +
  `<path d="M20 36Q20 28 30 28H70Q80 28 80 36V40Q76 46 72 40Q68 54 62 40Q57 45 52 40Q46 52 41 40Q36 46 31 40Q27 50 21 40Z" fill="${YEL}"/>` +
  `<rect x="34" y="58" width="32" height="20" rx="6" fill="#fff1c2"/>` +
  `<path d="M50 61L56 64.5V71.5L50 75L44 71.5V64.5Z" fill="${YEL}" stroke-width="2"/>` +
  hi(30, 64, 3, 10)
)

const shell = () => {
  let d = 'M50 50'
  for (let t = 0.3; t <= 4 * Math.PI; t += 0.3) {
    const r = 2.6 * t
    d += `L${r1(50 + r * Math.cos(t))} ${r1(50 + r * Math.sin(t))}`
  }
  return wrap(
    `<circle cx="51" cy="49" r="38" fill="#f7c59f"/>` +
    `<path d="M82 70Q92 82 94 92Q80 88 70 80Z" fill="#f7c59f"/>` +
    `<path d="${d}" fill="none" stroke="#c8661a" stroke-width="3"/>` +
    hi(32, 30, 8, 4, -35)
  )
}

const wheat = () => {
  const stalk = (a: number[], b: number[], c: number[]) => {
    let g = ''
    for (let i = 0; i < 4; i++) {
      const t = 0.5 + i * 0.13, p = qp(a, b, c, t), p2 = qp(a, b, c, t + 0.02)
      const ang = (Math.atan2(p2[1] - p[1], p2[0] - p[0]) * 180) / Math.PI + 90
      const tr = `translate(${Math.round(p[0])} ${Math.round(p[1])}) rotate(`
      g += `<ellipse cy="-5" rx="3.4" ry="6.5" transform="${tr}${Math.round(ang - 38)})"/><ellipse cy="-5" rx="3.4" ry="6.5" transform="${tr}${Math.round(ang + 38)})"/>`
    }
    const e = c
    return tube(`M${a[0]} ${a[1]}Q${b[0]} ${b[1]} ${c[0]} ${c[1]}`, '#c9a227', 3) +
      `<g fill="${YEL}" stroke-width="2">${g}<ellipse cx="${e[0]}" cy="${e[1]}" rx="3.4" ry="6"/></g>`
  }
  return wrap(
    stalk([50, 94], [50, 50], [50, 12]) + stalk([46, 94], [30, 60], [20, 28]) + stalk([54, 94], [70, 60], [80, 28]) +
    leaf(48, 86, 26, -40, '#9cc04a') + leaf(52, 88, 24, 42, '#9cc04a')
  )
}

const bread = () => wrap(
  `<path d="M10 58Q10 26 50 24Q90 26 90 58V78Q90 86 82 86H18Q10 86 10 78Z" fill="#d9923f"/>` +
  `<path d="M10 62Q50 70 90 62V78Q90 86 82 86H18Q10 86 10 78Z" fill="#b8742b"/>` +
  `<path d="M28 42L36 32M44 42L52 30M60 42L68 32" fill="none" stroke="#f7d9a0" stroke-width="4"/>` +
  hi(24, 40, 4, 8, 30)
)

const wood = () => wrap(
  `<path d="M26 32H80A12 22 0 0 1 80 76H26Z" fill="${BRN}"/>` +
  `<path d="M40 44H66M46 64H74M58 54H82" fill="none" stroke="#5e3614" stroke-width="2.4"/>` +
  `<path d="M60 32L66 20L72 22L68 32" fill="${BRN}"/>` +
  `<ellipse cx="26" cy="54" rx="16" ry="22" fill="#e8c08a"/>` +
  `<ellipse cx="26" cy="54" rx="10" ry="14" fill="none" stroke="#b07a3e" stroke-width="2.2"/>` +
  `<ellipse cx="26" cy="54" rx="4.5" ry="6.5" fill="none" stroke="#b07a3e" stroke-width="2.2"/>`
)

const tangerine = () => wrap(
  `<circle cx="50" cy="56" r="34" fill="${ORG}"/>` +
  `<path d="M50 24Q50 18 53 15" fill="none" stroke-width="3"/>` +
  leaf(52, 22, 22, 60) +
  hi(36, 42, 7, 4.5, -40) +
  `<g fill="#c85f00" ${N}><circle cx="60" cy="64" r="1.4"/><circle cx="66" cy="54" r="1.4"/><circle cx="54" cy="74" r="1.4"/><circle cx="40" cy="70" r="1.4"/><circle cx="70" cy="70" r="1.4"/></g>`
)

const juice = () => wrap(
  tube('M56 26V10L66 5', '#fff', 4) +
  `<path d="M22 30L36 22H80L66 30Z" fill="#ffb15e"/>` +
  `<path d="M66 30L80 22V82L66 90Z" fill="#c85f00"/>` +
  `<rect x="22" y="30" width="44" height="60" fill="${ORG}"/>` +
  `<rect x="29" y="46" width="30" height="30" rx="8" fill="#fff"/>` +
  `<circle cx="44" cy="62" r="9" fill="${ORG}" stroke-width="2.2"/>` + leaf(46, 53, 9, 40) +
  `<path d="M26 36V84" fill="none" stroke="#fff" stroke-width="3" opacity=".45"/>`
)

const beans = () => {
  const bean = (x: number, y: number, a: number) =>
    `<g transform="translate(${x} ${y}) rotate(${a}) scale(1.35)"><path d="M-18 -4C-18 -16 6 -18 16 -10C24 -4 22 8 12 10C6 11 4 6 -2 8C-10 11 -18 8 -18 -4Z" fill="#a0432a" stroke-width="2.1"/>` +
    `<ellipse cx="-6" cy="-9" rx="7" ry="2.2" fill="#fff" opacity=".35" ${N}/></g>`
  return wrap(bean(38, 40, -20) + bean(60, 66, 15))
}

const chocolate = () => {
  let squares = ''
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++)
    squares += `<rect x="${29 + c * 17}" y="${14 + r * 14}" width="13" height="10" rx="2" fill="#a86a3a" stroke-width="2"/>`
  return wrap(
    `<g transform="rotate(-14 50 50)">` +
    `<rect x="24" y="8" width="44" height="84" rx="4" fill="${BRN}"/>` + squares +
    `<path d="M20 56L26 52L32 57L38 52L44 57L50 52L56 57L62 52L68 57L72 54V60H20Z" fill="#d9dde3"/>` +
    `<rect x="20" y="58" width="52" height="36" rx="3" fill="${RED}"/>` +
    `<path d="M20 70H72" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>` +
    `</g>`
  )
}

const bone = () => wrap(
  `<g transform="rotate(-35 50 50)">` +
  unite(
    `<rect x="24" y="43" width="52" height="14" fill="#f4ecd8"/>`,
    `<circle cx="22" cy="42" r="9.5" fill="#f4ecd8"/>`, `<circle cx="22" cy="58" r="9.5" fill="#f4ecd8"/>`,
    `<circle cx="78" cy="42" r="9.5" fill="#f4ecd8"/>`, `<circle cx="78" cy="58" r="9.5" fill="#f4ecd8"/>`
  ) +
  `<path d="M30 46H70" fill="none" stroke="#fff" stroke-width="3"/></g>`
)

const cheese = () => wrap(
  `<path d="M10 52L56 20L90 38L44 70Z" fill="#ffe08a"/>` +
  `<path d="M10 52L44 70V88L10 72Z" fill="${YEL}"/>` +
  `<path d="M44 70L90 38V58L44 88Z" fill="#f2b21f"/>` +
  `<g fill="#d99611" stroke-width="2"><ellipse cx="24" cy="64" rx="4" ry="5"/><ellipse cx="34" cy="76" rx="3" ry="3.5"/>` +
  `<ellipse cx="62" cy="66" rx="5" ry="4"/><ellipse cx="78" cy="54" rx="3" ry="3"/><ellipse cx="54" cy="38" rx="5" ry="3"/></g>`
)

const tanabata = () => {
  const strip = (x: number, y: number, c: string, a: number) =>
    `<path d="M${x} ${y - 6}V${y}" fill="none" stroke-width="1.6"/><rect x="${x - 3.5}" y="${y}" width="7" height="16" rx="1" fill="${c}" stroke-width="2" transform="rotate(${a} ${x} ${y})"/>`
  return wrap(
    tube('M38 94Q44 50 60 8', GRN, 8) +
    `<path d="M39 82H46M43 58H50M50 34H57" fill="none" stroke="#1f7a3a" stroke-width="2.4"/>` +
    tube('M44 60Q30 50 14 52', '#3fae5a', 3) + tube('M50 40Q66 32 84 36', '#3fae5a', 3) + tube('M42 76Q58 70 76 74', '#3fae5a', 3) +
    leaf(18, 50, 16, -110, '#3fae5a') + leaf(28, 52, 14, -40, '#3fae5a') +
    leaf(80, 34, 16, 100, '#3fae5a') + leaf(68, 33, 14, 30, '#3fae5a') + leaf(72, 72, 14, 120, '#3fae5a') +
    strip(22, 58, RED, 5) + strip(36, 58, YEL, -4) + strip(62, 42, BLUE, 4) + strip(78, 42, PINK, -6) + strip(56, 78, PUR, 3)
  )
}

const herb = () => {
  const a = [34, 94], b = [34, 46], c = [68, 10]
  let g = tube(`M${a[0]} ${a[1]}Q${b[0]} ${b[1]} ${c[0]} ${c[1]}`, '#3a8f3e', 4)
  const ts = [0.32, 0.5, 0.66, 0.8]
  ts.forEach((t, i) => {
    const p = qp(a, b, c, t)
    g += leaf(r1(p[0]), r1(p[1]), 26 - i * 3, -70 + i * 8, i % 2 ? '#5cc06a' : GRN, 0.42)
    g += leaf(r1(p[0]), r1(p[1]), 26 - i * 3, 50 + i * 4, i % 2 ? GRN : '#5cc06a', 0.42)
  })
  return wrap(g + leaf(68, 12, 14, 30, '#5cc06a', 0.42))
}

const chestnut = () => wrap(
  `<path d="M50 10Q54 14 58 22Q86 34 86 62Q86 70 80 74H20Q14 70 14 62Q14 34 42 22Q46 14 50 10Z" fill="${BRN}"/>` +
  `<path d="M18 72Q50 64 82 72Q78 90 50 90Q22 90 18 72Z" fill="#e3b985"/>` +
  `<g fill="#b98a55" ${N}><circle cx="34" cy="80" r="1.4"/><circle cx="46" cy="83" r="1.4"/><circle cx="58" cy="80" r="1.4"/><circle cx="68" cy="84" r="1.4"/></g>` +
  hi(34, 42, 5, 11, 35)
)

const worm = () => {
  const a = [12, 70], b = [32, 26], c = [52, 60], d2 = [72, 94], e = [90, 46]
  const d = `M${a[0]} ${a[1]}Q${b[0]} ${b[1]} ${c[0]} ${c[1]}Q${d2[0]} ${d2[1]} ${e[0]} ${e[1]}`
  let rings = ''
  for (const [p0, p1, p2] of [[a, b, c], [c, d2, e]]) {
    for (const t of [0.25, 0.45, 0.65, 0.85]) {
      const p = qp(p0, p1, p2, t), q = qp(p0, p1, p2, t + 0.01)
      const nx = -(q[1] - p[1]), ny = q[0] - p[0], L = Math.hypot(nx, ny), k = 6 / L
      rings += `M${r1(p[0] + nx * k)} ${r1(p[1] + ny * k)}L${r1(p[0] - nx * k)} ${r1(p[1] - ny * k)}`
    }
  }
  return wrap(
    tube(d, PINK, 13) + `<circle cx="90" cy="46" r="6.5" fill="${PINK}" ${N}/>` +
    `<path d="${rings}" fill="none" stroke="#e0607f" stroke-width="2"/>` +
    eye(88, 44, 2.4) + `<path d="M24 46Q30 36 38 40" fill="none" stroke="#fff" stroke-width="2.5" opacity=".6"/>`
  )
}

const blossom = () => {
  let p = ''
  for (let i = 0; i < 5; i++)
    p += `<path d="M50 52C33 40 35 13 46 13L50 18L54 13C65 13 67 40 50 52Z" fill="${PINK}" transform="rotate(${i * 72} 50 52)"/>`
  let st = ''
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.6
    st += `<path d="M50 52L${r1(50 + 12 * Math.cos(a))} ${r1(52 + 12 * Math.sin(a))}" fill="none" stroke="#c2185b" stroke-width="1.8"/><circle cx="${r1(50 + 12 * Math.cos(a))}" cy="${r1(52 + 12 * Math.sin(a))}" r="2" fill="${YEL}" stroke-width="1.4"/>`
  }
  return wrap(p + `<circle cx="50" cy="52" r="9" fill="#ffd1dc" ${N}/>` + st)
}

// ---------- animal faces ----------
const bearFace = () => wrap(
  `<circle cx="24" cy="26" r="12" fill="${BRN}"/><circle cx="76" cy="26" r="12" fill="${BRN}"/>` +
  `<circle cx="24" cy="26" r="6" fill="#c47a45" ${N}/><circle cx="76" cy="26" r="6" fill="#c47a45" ${N}/>` +
  `<ellipse cx="50" cy="55" rx="38" ry="34" fill="${BRN}"/>` +
  `<ellipse cx="50" cy="68" rx="16" ry="12" fill="#e3b985"/>` +
  `<ellipse cx="50" cy="61" rx="6.5" ry="4.5" fill="${S}"/>` + wMouth(50, 69) +
  eyes(50, 47, 14, 4.3) + cheeks(50, 60, 24)
)

const monkeyFace = () => wrap(
  `<circle cx="15" cy="52" r="11" fill="${BRN}"/><circle cx="85" cy="52" r="11" fill="${BRN}"/>` +
  `<circle cx="15" cy="52" r="6" fill="#f0c8a0" ${N}/><circle cx="85" cy="52" r="6" fill="#f0c8a0" ${N}/>` +
  `<circle cx="50" cy="50" r="34" fill="${BRN}"/>` +
  `<path d="M44 18Q47 10 51 17Q54 9 58 17" fill="none" stroke-width="2.4"/>` +
  `<path d="M50 38C44 28 24 30 26 48C27 56 30 60 31 64C33 82 67 82 69 64C70 60 73 56 74 48C76 30 56 28 50 38Z" fill="#f0c8a0" stroke-width="2.2"/>` +
  eyes(50, 47, 9, 4) + `<circle cx="46.5" cy="60" r="1.6" fill="${S}" ${N}/><circle cx="53.5" cy="60" r="1.6" fill="${S}" ${N}/>` +
  `<path d="M39 66Q50 76 61 66" fill="none" stroke-width="2.5"/>` + cheeks(50, 60, 17)
)

const rabbitFace = () => wrap(
  `<ellipse cx="36" cy="27" rx="9.5" ry="23" fill="#fbfaf8" transform="rotate(-10 36 27)"/>` +
  `<ellipse cx="64" cy="27" rx="9.5" ry="23" fill="#fbfaf8" transform="rotate(10 64 27)"/>` +
  `<ellipse cx="36" cy="29" rx="4.5" ry="16" fill="#ffb3c6" ${N} transform="rotate(-10 36 29)"/>` +
  `<ellipse cx="64" cy="29" rx="4.5" ry="16" fill="#ffb3c6" ${N} transform="rotate(10 64 29)"/>` +
  `<ellipse cx="50" cy="66" rx="32" ry="26" fill="#fbfaf8"/>` +
  eyes(50, 60, 12, 4) + cheeks(50, 72, 20) +
  `<path d="M46 69H54L50 73Z" fill="#ff6b8b" stroke-width="2"/>` +
  `<path d="M50 73V77M44 78Q47 81 50 77Q53 81 56 78" fill="none" stroke-width="2.2"/>` +
  `<path d="M28 70H14M28 75L16 79M72 70H86M72 75L84 79" fill="none" stroke-width="1.6"/>`
)

const mouseFace = () => wrap(
  `<circle cx="22" cy="32" r="17" fill="${GRAY}"/><circle cx="78" cy="32" r="17" fill="${GRAY}"/>` +
  `<circle cx="22" cy="32" r="10" fill="#ffb3c6" ${N}/><circle cx="78" cy="32" r="10" fill="#ffb3c6" ${N}/>` +
  `<path d="M50 88Q22 86 22 62Q22 40 50 40Q78 40 78 62Q78 86 50 88Z" fill="${GRAY}"/>` +
  `<ellipse cx="50" cy="72" rx="13" ry="10" fill="#d9dce0" ${N}/>` +
  eyes(50, 58, 11, 4) + cheeks(50, 70, 19) +
  `<ellipse cx="50" cy="70" rx="4.5" ry="3.5" fill="#ff6b8b" stroke-width="2"/>` + wMouth(50, 77) +
  `<path d="M34 70H12M34 75L14 80M66 70H88M66 75L86 80" fill="none" stroke-width="1.6"/>`
)

const pandaFace = () => wrap(
  `<circle cx="22" cy="28" r="12" fill="#2f2f3a"/><circle cx="78" cy="28" r="12" fill="#2f2f3a"/>` +
  `<ellipse cx="50" cy="56" rx="36" ry="32" fill="#fff"/>` +
  `<ellipse cx="36" cy="52" rx="8.5" ry="11.5" fill="#2f2f3a" transform="rotate(35 36 52)"/>` +
  `<ellipse cx="64" cy="52" rx="8.5" ry="11.5" fill="#2f2f3a" transform="rotate(-35 64 52)"/>` +
  `<circle cx="37" cy="51" r="3.6" fill="#fff" ${N}/><circle cx="63" cy="51" r="3.6" fill="#fff" ${N}/>` +
  `<circle cx="37.5" cy="51.5" r="2" fill="${S}" ${N}/><circle cx="63.5" cy="51.5" r="2" fill="${S}" ${N}/>` +
  `<ellipse cx="50" cy="65" rx="5.5" ry="3.8" fill="#2f2f3a"/>` + wMouth(50, 72) + cheeks(50, 66, 21)
)

// ---------- animals ----------
const chicken = () => wrap(
  `<path d="M60 80V92M52 92H66M48 80V92M40 92H54" fill="none" stroke="${ORG}" stroke-width="3.2"/>` +
  `<path d="M24 25Q21 16 28 18Q30 10 35 17Q41 12 41 22Z" fill="${RED}"/>` +
  `<path d="M20 36L8 41L20 46Z" fill="${YEL}"/>` +
  `<ellipse cx="22" cy="51" rx="3.6" ry="5.5" fill="${RED}"/>` +
  unite(
    `<path d="M64 56L80 22Q92 28 88 42Q96 46 88 62Z" fill="#fbfaf8"/>`,
    `<ellipse cx="52" cy="64" rx="30" ry="19" fill="#fbfaf8"/>`,
    `<circle cx="31" cy="38" r="13" fill="#fbfaf8"/>`,
    `<path d="M22 44L40 72L46 50Z" fill="#fbfaf8"/>`
  ) +
  `<path d="M44 62Q58 54 68 64Q60 76 46 70Z" fill="#e9e6e0" stroke-width="2.4"/>` +
  eye(28, 35, 3.2) + `<ellipse cx="34" cy="44" rx="3.4" ry="2.2" fill="#ff6b8b" opacity=".45" ${N}/>`
)

const goat = () => {
  const W = '#f7f4ee'
  const leg = (x: number) => `<rect x="${x}" y="62" width="7" height="26" rx="2" fill="${W}"/><rect x="${x}" y="84" width="7" height="5" rx="1.5" fill="#4a4a5a" stroke-width="2"/>`
  return wrap(
    `<path d="M82 50Q90 44 89 36" fill="none" stroke-width="5"/>` +
    leg(40) + leg(50) + leg(68) + leg(77) +
    tube('M31 30Q30 12 46 14', '#a08a6a', 5) +
    unite(`<ellipse cx="62" cy="56" rx="25" ry="15" fill="${W}"/>`, `<path d="M42 54L30 30L42 28L52 46Z" fill="${W}"/>`,
      `<ellipse cx="27" cy="38" rx="9.5" ry="15" fill="${W}" transform="rotate(50 27 38)"/>`) +
    `<ellipse cx="42" cy="32" rx="8" ry="3.6" fill="#e6dfd2" transform="rotate(25 42 32)"/>` +
    `<path d="M15 47L16 60L22 50Z" fill="#e6dfd2"/>` +
    eye(28, 34, 2.8) + `<circle cx="14" cy="44" r="1.4" fill="${S}" ${N}/>`
  )
}

const chipmunk = () => wrap(
  `<path d="M58 84Q92 86 90 54Q88 26 70 20Q62 20 64 30Q78 42 70 64Z" fill="#c07a3a"/>` +
  `<path d="M72 30Q84 44 80 66" fill="none" stroke="#7a4a20" stroke-width="2.4"/>` +
  `<ellipse cx="48" cy="64" rx="19" ry="23" fill="#b5652a"/>` +
  `<ellipse cx="44" cy="68" rx="10" ry="15" fill="#f3d6b0" ${N}/>` +
  `<path d="M60 50Q66 62 62 78" fill="none" stroke="#5e3614" stroke-width="3"/>` +
  `<ellipse cx="38" cy="88" rx="9" ry="4.5" fill="#b5652a"/><ellipse cx="56" cy="89" rx="8" ry="4" fill="#b5652a"/>` +
  `<circle cx="44" cy="26" r="7" fill="#b5652a"/><circle cx="44" cy="26" r="3.2" fill="#f3b4a0" ${N}/>` +
  `<ellipse cx="38" cy="38" rx="17" ry="15" fill="#b5652a"/>` +
  `<path d="M34 24Q42 30 52 30" fill="none" stroke="#5e3614" stroke-width="2.4"/>` +
  `<ellipse cx="30" cy="44" rx="8" ry="6" fill="#f3d6b0" ${N}/>` +
  eye(36, 35, 3.2) + `<circle cx="22" cy="41" r="2.3" fill="${S}" ${N}/>` +
  `<ellipse cx="34" cy="62" rx="5" ry="4" fill="#b5652a"/>`
)

const whale = () => wrap(
  `<path d="M40 32V20M40 20Q30 8 22 14M40 20Q50 8 58 14M40 20V8" fill="none" stroke="${S}" stroke-width="6.6"/>` +
  `<path d="M40 32V20M40 20Q30 8 22 14M40 20Q50 8 58 14M40 20V8" fill="none" stroke="#8fd0ff" stroke-width="3.6"/>` +
  `<path d="M8 60Q8 32 44 32Q70 32 78 54Q82 46 85 38Q92 32 95 42Q90 52 85 58Q94 60 96 68Q88 72 80 64Q72 82 44 82Q8 82 8 60Z" fill="${BLUE}"/>` +
  `<path d="M12 66Q28 80 56 77Q40 73 30 66Q20 66 12 66Z" fill="#cfe6ff"/>` +
  `<path d="M14 68H50M18 73H46" fill="none" stroke="#9cc4ef" stroke-width="1.8"/>` +
  eye(26, 54, 3.6) + `<path d="M12 60Q18 64 24 62" fill="none" stroke-width="2.3"/>` +
  `<path d="M48 60Q56 70 64 64Q58 60 48 60Z" fill="#1659b0" stroke-width="2.2"/>` + hi(40, 40, 10, 3.5, -8)
)

const crab = () => {
  const half =
    tube('M36 62Q22 62 20 46', RED, 5) +
    `<path d="M28 46Q8 48 8 32Q8 18 20 14L19 26L31 22Q34 38 28 46Z" fill="${RED}"/>` +
    `<path d="M30 70L14 72M30 76L16 82M34 80L22 90" fill="none" stroke-width="7.6"/>` +
    `<path d="M30 70L14 72M30 76L16 82M34 80L22 90" fill="none" stroke="${RED}" stroke-width="3"/>` +
    `<path d="M42 54V40" fill="none" stroke-width="3"/><circle cx="42" cy="38" r="6" fill="#fff"/><circle cx="43" cy="39" r="3" fill="${S}" ${N}/>`
  return wrap(half + mirror(half) +
    `<ellipse cx="50" cy="66" rx="26" ry="17" fill="${RED}"/>` +
    `<path d="M40 70Q50 78 60 70" fill="none" stroke-width="2.4"/>` + cheeks(50, 66, 15, '#fff') + hi(42, 58, 9, 3, -10))
}

const dolphin = () => {
  const B = '#4a8ee6'
  return wrap(
    `<path d="M50 33Q50 20 61 16Q58 25 61 34Z" fill="${B}"/>` +
    `<path d="M26 66Q18 70 12 66L4 72Q4 62 11 58L6 50Q16 52 20 60Z" fill="${B}"/>` +
    `<path d="M14 64Q26 34 58 32Q78 32 86 44L96 46Q93 53 84 53Q74 57 62 57Q44 58 28 68Z" fill="${B}"/>` +
    `<path d="M60 57Q74 56 84 53Q74 48 60 51Z" fill="#cfe6ff" stroke-width="2"/>` +
    `<path d="M54 57Q52 67 44 71Q46 61 46 57Z" fill="#3a74c4"/>` +
    eye(74, 42, 3) + hi(48, 38, 10, 2.6, -10)
  )
}

const jelly = () => {
  let t = ''
  for (let i = 0; i < 5; i++) {
    const x = 26 + i * 12
    t += `M${x} 54Q${x - 6} 64 ${x} 72Q${x + 6} 80 ${x} ${88 - (i % 2) * 6}`
  }
  return wrap(
    `<path d="${t}" fill="none" stroke-width="7"/><path d="${t}" fill="none" stroke="#c9b4fb" stroke-width="3"/>` +
    `<path d="M14 52Q14 14 50 14Q86 14 86 52Q80 58 74 52Q68 58 62 52Q56 58 50 52Q44 58 38 52Q32 58 26 52Q20 58 14 52Z" fill="${PUR}"/>` +
    `<path d="M24 46Q26 26 44 22" fill="none" stroke="#fff" stroke-width="4" opacity=".5"/>` +
    eyes(50, 38, 10, 3.6) + `<path d="M45 45Q50 49 55 45" fill="none" stroke-width="2.2"/>` + cheeks(50, 44, 17)
  )
}

const eagle = () => {
  const wing = `<path d="M42 50Q24 32 4 30L10 38L3 44L12 48L5 54L15 57L9 63L20 64L16 70Q32 72 44 64Z" fill="#6b3d17"/>`
  return wrap(
    wing + mirror(wing) +
    `<path d="M42 76L34 92H66L58 76Z" fill="#fbfaf8"/><path d="M42 92L44 82M50 92V80M58 92L56 82" fill="none" stroke-width="1.8"/>` +
    `<ellipse cx="50" cy="60" rx="14" ry="20" fill="${BRN}"/>` +
    `<path d="M44 80V86M56 80V86" fill="none" stroke="${YEL}" stroke-width="3.6"/>` +
    `<circle cx="50" cy="32" r="13" fill="#fbfaf8"/>` +
    `<path d="M45 34Q50 30 55 34Q57 42 50 46Q51 40 47 39Z" fill="${YEL}"/>` +
    eyes(50, 29, 6, 2.6) + `<path d="M40 24L47 27M60 24L53 27" fill="none" stroke-width="2.4"/>`
  )
}

const parrot = () => wrap(
  `<path d="M14 90H90" fill="none" stroke-width="9.6"/><path d="M14 90H90" fill="none" stroke="${BRN}" stroke-width="4"/>` +
  `<path d="M54 64L64 96L74 94L64 60Z" fill="${BLUE}"/><path d="M56 64L62 92" fill="none" stroke="${RED}" stroke-width="3"/>` +
  `<ellipse cx="50" cy="52" rx="16" ry="24" fill="${RED}" transform="rotate(14 50 52)"/>` +
  `<path d="M46 86V90M54 86V90" fill="none" stroke="#6b6f78" stroke-width="3.6"/>` +
  `<path d="M50 36Q70 40 68 62L58 74Q48 58 50 36Z" fill="${YEL}"/>` +
  `<path d="M56 52Q66 54 67 60L58 74Q52 64 56 52Z" fill="${GRN}" stroke-width="2.2"/>` +
  `<path d="M58 64Q64 66 66 64L58 74Q56 70 58 64Z" fill="${BLUE}" stroke-width="2.2"/>` +
  `<circle cx="42" cy="24" r="14" fill="${RED}"/>` +
  `<ellipse cx="37" cy="25" rx="7" ry="6" fill="#fff" ${N}/>` +
  `<path d="M30 20Q19 20 19 31Q21 40 27 38Q25 31 31 28Z" fill="#f2ede2"/>` +
  `<path d="M29 32Q28 36 31 37L34 33Z" fill="${S}" stroke-width="1.8"/>` + eye(38, 23, 2.8)
)

const horse = () => {
  const D = '#3a2414'
  const leg = (x: number) => `<rect x="${x}" y="56" width="8" height="30" rx="3" fill="${BRN}"/><rect x="${x}" y="84" width="8" height="5" rx="1.5" fill="${D}" stroke-width="2"/>`
  return wrap(
    tube('M80 44Q92 48 90 76', D, 7) +
    leg(36) + leg(46) + leg(68) + leg(78) +
    `<path d="M28 18L30 8L35 18Z" fill="${BRN}"/>` +
    unite(`<ellipse cx="58" cy="50" rx="27" ry="14" fill="${BRN}"/>`, `<path d="M34 52L24 22Q30 14 38 18L54 42Z" fill="${BRN}"/>`,
      `<ellipse cx="20" cy="32" rx="14" ry="8" fill="${BRN}" transform="rotate(-56 20 32)"/>`) +
    `<path d="M32 14Q42 18 48 34L56 40Q50 22 38 14Z" fill="${D}"/>` +
    `<ellipse cx="13" cy="42" rx="5" ry="4" fill="#6b3d17" ${N}/>` +
    eye(25, 26, 2.6) + `<circle cx="12" cy="41" r="1.4" fill="${S}" ${N}/>` + hi(52, 44, 10, 3)
  )
}

const cat = () => {
  const O = ORG
  return wrap(
    tube('M76 52Q92 50 88 28', O, 7) +
    `<path d="M38 60V84M48 62V86M66 62V86M76 60V84" fill="none" stroke-width="9.6"/>` +
    `<path d="M38 60V84M48 62V86M66 62V86M76 60V84" fill="none" stroke="${O}" stroke-width="4"/>` +
    `<ellipse cx="57" cy="56" rx="24" ry="13" fill="${O}"/>` +
    `<path d="M50 44Q48 52 52 58M60 44Q58 52 62 58M70 46Q68 52 72 58" fill="none" stroke="#b85a00" stroke-width="2.6"/>` +
    `<path d="M16 38L18 20L30 32ZM34 30L44 18L44 36Z" fill="${O}"/>` +
    `<circle cx="30" cy="44" r="14" fill="${O}"/>` +
    `<path d="M26 32L30 38L34 32" fill="none" stroke="#b85a00" stroke-width="2.2"/>` +
    eyes(30, 43, 6, 2.8) + `<path d="M28 49H32L30 51Z" fill="#ff6b8b" stroke-width="1.6"/>` +
    `<path d="M22 50H10M22 53L12 57M38 50H48M38 53L46 57" fill="none" stroke-width="1.4"/>`
  )
}

const rabbit = () => {
  const W = '#f3f0ec'
  return wrap(
    `<ellipse cx="38" cy="18" rx="6.5" ry="16" fill="${W}" transform="rotate(-25 38 18)"/>` +
    `<ellipse cx="48" cy="18" rx="6.5" ry="16" fill="${W}" transform="rotate(10 48 18)"/>` +
    `<ellipse cx="48" cy="19" rx="3" ry="11" fill="#ffb3c6" ${N} transform="rotate(10 48 19)"/>` +
    `<circle cx="84" cy="62" r="7.5" fill="#fff"/>` +
    `<ellipse cx="60" cy="64" rx="26" ry="21" fill="${W}"/>` +
    `<ellipse cx="62" cy="84" rx="14" ry="5" fill="${W}"/><ellipse cx="36" cy="84" rx="7" ry="4" fill="${W}"/>` +
    `<circle cx="36" cy="44" r="15" fill="${W}"/>` +
    eye(32, 42, 3.2) + `<ellipse cx="22" cy="47" rx="2.6" ry="2" fill="#ff6b8b" stroke-width="1.6"/>` +
    `<ellipse cx="34" cy="51" rx="3.5" ry="2.2" fill="#ff6b8b" opacity=".45" ${N}/>`
  )
}

const sauropod = () => {
  const C = '#6f92d8'
  return wrap(
    tube('M82 64Q90 68 92 80', C, 7) +
    `<path d="M48 70V88M58 72V90M72 70V88M80 68V84" fill="none" stroke-width="12.6"/>` +
    `<path d="M48 70V88M58 72V90M72 70V88M80 68V84" fill="none" stroke="${C}" stroke-width="7"/>` +
    tube('M50 60Q34 50 30 20', C, 11) +
    `<ellipse cx="64" cy="62" rx="24" ry="15" fill="${C}"/>` +
    `<ellipse cx="25" cy="18" rx="12" ry="8" fill="${C}"/>` +
    `<g fill="#a9c1f0" ${N}><circle cx="60" cy="56" r="3.5"/><circle cx="72" cy="58" r="2.8"/><circle cx="66" cy="66" r="2.4"/></g>` +
    eye(24, 15, 2.6) + `<path d="M15 21Q20 24 24 22" fill="none" stroke-width="2"/>`
  )
}

// ---------- vehicles ----------
const car = () => wrap(
  `<path d="M8 66Q8 54 20 52L32 50L42 36Q44 32 50 32H68Q74 32 78 38L86 50Q94 52 94 62V68Q94 72 90 72H12Q8 72 8 66Z" fill="${RED}"/>` +
  `<path d="M37 50L45 38H56V50ZM60 38H68Q72 38 74 42L80 50H60Z" fill="${SKY}" stroke-width="2.4"/>` +
  `<path d="M58 54V66" fill="none" stroke-width="2"/><path d="M89 56H94V61H89Z" fill="${YEL}" stroke-width="2"/>` +
  `<path d="M8 58H12V63H8Z" fill="#ff9f9f" stroke-width="2"/>` +
  wheel(28, 72, 10) + wheel(74, 72, 10) + hi(30, 56, 8, 2)
)

const bus = () => wrap(
  `<rect x="6" y="24" width="88" height="50" rx="9" fill="${YEL}"/>` +
  `<g fill="${SKY}" stroke-width="2.4"><rect x="12" y="32" width="14" height="16" rx="2"/><rect x="30" y="32" width="14" height="16" rx="2"/><rect x="48" y="32" width="14" height="16" rx="2"/>` +
  `<rect x="72" y="32" width="16" height="30" rx="2"/></g>` +
  `<path d="M80 32V62" fill="none" stroke-width="2"/>` +
  `<path d="M6 56H68" fill="none" stroke="#e0a400" stroke-width="4"/>` +
  `<rect x="88" y="62" width="6" height="5" rx="1" fill="#fff" stroke-width="2"/>` +
  wheel(24, 74, 9) + wheel(72, 74, 9)
)

const truck = () => wrap(
  `<rect x="6" y="20" width="56" height="50" rx="4" fill="#f2f2f4"/>` +
  `<path d="M14 30H54M14 40H54" fill="none" stroke="#d2d5da" stroke-width="2.4"/>` +
  `<path d="M62 34H78Q84 34 86 40L93 54V72H62Z" fill="${RED}"/>` +
  `<path d="M68 40H78Q81 40 82 43L86 52H68Z" fill="${SKY}" stroke-width="2.4"/>` +
  `<rect x="88" y="60" width="5" height="5" fill="${YEL}" stroke-width="2"/>` +
  `<path d="M6 70H93" fill="none"/>` +
  wheel(20, 74, 9) + wheel(42, 74, 9) + wheel(78, 74, 9)
)

const tractor = () => wrap(
  tube('M64 40V20', '#4a4a5a', 4) +
  `<path d="M22 34H50V62H18V40Q18 34 22 34Z" fill="${RED}"/>` +
  `<path d="M26 39H46V54H26Z" fill="${SKY}" stroke-width="2.4"/>` +
  `<path d="M50 44H82Q88 44 88 52V68H50Z" fill="${RED}"/>` +
  `<path d="M56 52H82M56 58H82" fill="none" stroke="#a82326" stroke-width="2"/>` +
  `<circle cx="30" cy="70" r="20" fill="#3a3a48"/><circle cx="30" cy="70" r="9" fill="${YEL}" stroke-width="2.4"/>` +
  `<circle cx="76" cy="78" r="12" fill="#3a3a48"/><circle cx="76" cy="78" r="5.5" fill="${YEL}" stroke-width="2.2"/>`
)

const sailboat = () => wrap(
  `<path d="M50 8V70" fill="none" stroke="#6b3d17" stroke-width="3.4"/>` +
  `<path d="M54 10Q80 34 84 62H54Z" fill="#fbfaf8"/>` +
  `<path d="M46 18V62H20Q36 44 46 18Z" fill="#fbfaf8"/>` +
  `<path d="M60 26Q72 40 76 54" fill="none" stroke="#dfe3e8" stroke-width="2.4"/>` +
  `<path d="M50 8L62 12L50 16Z" fill="${RED}" stroke-width="2"/>` +
  `<path d="M10 68H92L80 84H22Z" fill="${BRN}"/><path d="M14 73H88" fill="none" stroke="#c2875a" stroke-width="2.4"/>` +
  water(86)
)

const ship = () => wrap(
  `<rect x="58" y="18" width="10" height="20" rx="1" fill="${RED}"/><rect x="74" y="18" width="10" height="20" rx="1" fill="${RED}"/>` +
  `<path d="M58 23H68M74 23H84" fill="none" stroke-width="5"/>` +
  `<path d="M24 38H90V54H20Z" fill="#fbfaf8"/><path d="M34 26H54V38H34Z" fill="#fbfaf8"/>` +
  `<g fill="${SKY}" stroke-width="1.8"><circle cx="40" cy="32" r="2.4"/><circle cx="48" cy="32" r="2.4"/>` +
  `<rect x="28" y="43" width="7" height="6" rx="1.5"/><rect x="40" y="43" width="7" height="6" rx="1.5"/><rect x="52" y="43" width="7" height="6" rx="1.5"/><rect x="64" y="43" width="7" height="6" rx="1.5"/><rect x="76" y="43" width="7" height="6" rx="1.5"/></g>` +
  `<path d="M4 54H96L86 80H14Z" fill="#24407a"/><path d="M8 66H92" fill="none" stroke="${RED}" stroke-width="4"/>` +
  `<g fill="#fff" ${N}><circle cx="22" cy="60" r="1.8"/><circle cx="30" cy="60" r="1.8"/><circle cx="38" cy="60" r="1.8"/></g>` +
  water(80)
)

const speedboat = () => wrap(
  `<path d="M6 74Q14 66 22 72Q16 60 26 58" fill="none" stroke="#fff" stroke-width="7"/>` +
  `<path d="M52 56L60 40H68L64 56Z" fill="${SKY}" stroke-width="2.4"/>` +
  `<path d="M10 56H72Q86 56 96 48L88 70Q82 76 70 76H18Q10 76 10 66Z" fill="#fbfaf8"/>` +
  `<path d="M10 64H90" fill="none" stroke="${RED}" stroke-width="4"/>` +
  `<path d="M2 70Q8 60 16 66M4 80Q10 72 18 76" fill="none" stroke="#fff" stroke-width="3"/>` +
  water(78)
)

const canoe = () => wrap(
  tube('M30 90L74 20', '#c8843a', 4) + `<ellipse cx="78" cy="14" rx="5.5" ry="11" fill="#e0a25a" transform="rotate(32 78 14)"/>` +
  `<path d="M4 48Q50 60 96 48Q88 78 50 80Q12 78 4 48Z" fill="${BRN}"/>` +
  `<path d="M8 52Q50 64 92 52" fill="none" stroke="#c2875a" stroke-width="3"/>` +
  `<path d="M30 60V74M50 62V78M70 60V74" fill="none" stroke="#5e3614" stroke-width="2"/>` +
  `<path d="M20 86Q34 82 48 86M54 90Q68 86 82 90" fill="none" stroke="#5aa9f0" stroke-width="3.2"/>`
)

const helicopter = () => wrap(
  tube('M62 52L90 42', YEL, 7) +
  `<path d="M90 32V52M82 42H98" fill="none" stroke="#4a4a5a" stroke-width="3.4"/>` +
  `<path d="M44 36V28" fill="none" stroke-width="3.4"/><rect x="8" y="23" width="74" height="6" rx="3" fill="#4a4a5a"/>` +
  `<path d="M26 74L22 84M58 74L62 84M14 84H72" fill="none" stroke-width="3.4"/>` +
  `<ellipse cx="42" cy="56" rx="27" ry="20" fill="${YEL}"/>` +
  `<path d="M18 54Q20 40 36 38V58H18Z" fill="${SKY}" stroke-width="2.4"/>` +
  `<path d="M42 60H62" fill="none" stroke="#e0a400" stroke-width="3"/>` + hi(52, 44, 8, 3, -10)
)

const rocket = () => wrap(
  `<g transform="rotate(45 50 50)">` +
  `<path d="M40 74Q50 104 60 74Z" fill="${ORG}"/><path d="M45 74Q50 90 55 74Z" fill="${YEL}" ${N}/>` +
  `<path d="M34 54L20 72V82L36 74ZM66 54L80 72V82L64 74Z" fill="${RED}"/>` +
  `<path d="M50 4Q68 20 67 52L65 74H35L33 52Q32 20 50 4Z" fill="#eef0f4"/>` +
  `<path d="M50 4Q60 12 64 24H36Q40 12 50 4Z" fill="${RED}"/>` +
  `<circle cx="50" cy="42" r="9" fill="#9aa0a6"/><circle cx="50" cy="42" r="5.5" fill="${SKY}" stroke-width="2"/>` +
  `<path d="M50 66V78" fill="none" stroke-width="3"/>` +
  `</g>`
)

// ---------- objects ----------
const guitar = () => wrap(
  `<g transform="rotate(38 50 52)">` +
  `<rect x="46" y="4" width="8" height="46" fill="${BRN}"/>` +
  `<path d="M44 2H56V12H44Z" fill="#5e3614"/>` +
  `<path d="M42 4H44M42 9H44M56 4H58M56 9H58" fill="none" stroke-width="2.6"/>` +
  unite(`<circle cx="50" cy="72" r="20" fill="${RED}"/>`, `<circle cx="50" cy="48" r="14" fill="${RED}"/>`) +
  `<circle cx="50" cy="58" r="5.5" fill="#3a2414" stroke-width="2"/>` +
  `<rect x="43" y="76" width="14" height="5" rx="1.5" fill="#5e3614" stroke-width="2"/>` +
  `<path d="M48 12V78M52 12V78" fill="none" stroke="#f2ede2" stroke-width=".9"/>` +
  `</g>`
)

const apple = () => wrap(
  `<path d="M50 30Q38 20 26 26Q10 36 14 58Q18 82 34 88Q42 92 50 88Q58 92 66 88Q82 82 86 58Q90 36 74 26Q62 20 50 30Z" fill="${RED}"/>` +
  `<path d="M50 30Q50 18 56 11" fill="none" stroke="#6b3d17" stroke-width="3.4"/>` +
  `<path d="M53 22Q60 8 77 12Q69 26 53 22Z" fill="${GRN}"/>` + hi(28, 46, 5, 10, 20)
)

const star = () => {
  let d = ''
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2, R = i % 2 ? 19 : 44
    d += `${i ? 'L' : 'M'}${r1(50 + R * Math.cos(a))} ${r1(54 + R * Math.sin(a))}`
  }
  return wrap(`<path d="${d}Z" fill="${YEL}" stroke-width="3.4"/>` +
    `<path d="M50 22L44 40" fill="none" stroke="#fff" stroke-width="4" opacity=".6"/>`)
}

const house = () => wrap(
  `<rect x="64" y="16" width="10" height="20" fill="#a0432a"/>` +
  `<rect x="18" y="44" width="64" height="46" fill="#f2d7a6"/>` +
  `<path d="M8 50L50 14L92 50Z" fill="#b5482a"/>` +
  `<path d="M22 44H78" fill="none" stroke="#8a3520" stroke-width="2"/>` +
  `<path d="M42 90V68Q42 62 50 62Q58 62 58 68V90Z" fill="${BRN}"/><circle cx="54" cy="77" r="1.6" fill="${YEL}" ${N}/>` +
  `<rect x="24" y="56" width="12" height="12" rx="1" fill="${SKY}" stroke-width="2.4"/><rect x="64" y="56" width="12" height="12" rx="1" fill="${SKY}" stroke-width="2.4"/>` +
  `<path d="M30 56V68M24 62H36M70 56V68M64 62H76" fill="none" stroke-width="1.8"/>` +
  `<path d="M10 90H90" fill="none"/>`
)

const evergreen = () => wrap(
  `<rect x="44" y="76" width="12" height="16" fill="${BRN}"/>` +
  `<path d="M50 34L84 80H16Z" fill="${GRN}"/>` +
  `<path d="M50 20L76 56H24Z" fill="${GRN}"/>` +
  `<path d="M50 6L68 34H32Z" fill="${GRN}"/>` +
  `<path d="M44 20L38 30M40 44L32 54M36 62L26 76" fill="none" stroke="#7fd08a" stroke-width="3" opacity=".7"/>`
)

const anchor = () => {
  const C = '#4a5a78'
  return wrap(
    `<circle cx="50" cy="14" r="7" fill="none" stroke-width="10"/><circle cx="50" cy="14" r="7" fill="none" stroke="${C}" stroke-width="4.4"/>` +
    tube('M50 22V86', C, 7) + tube('M32 32H68', C, 6) +
    tube('M16 58Q18 86 50 86Q82 86 84 58', C, 6) +
    `<path d="M16 50L8 64L22 62Z" fill="${C}"/><path d="M84 50L92 64L78 62Z" fill="${C}"/>` +
    `<path d="M48 30V80" fill="none" stroke="#8a9ab8" stroke-width="2"/>`
  )
}

const yarn = () => {
  const C = '#e0457b'
  return wrap(
    `<path d="M70 78Q84 94 96 84" fill="none" stroke-width="7.6"/><path d="M70 78Q84 94 96 84" fill="none" stroke="${C}" stroke-width="3"/>` +
    `<circle cx="46" cy="50" r="36" fill="${C}"/>` +
    `<path d="M14 40Q46 30 78 44M11 54Q46 44 81 58M16 70Q46 62 74 74M34 17Q24 50 38 84M56 15Q68 50 58 85" fill="none" stroke="#a8285a" stroke-width="2.4"/>` +
    `<path d="M24 26Q46 22 66 28" fill="none" stroke="#ff9fc0" stroke-width="2.4"/>` +
    `<path d="M70 78Q74 70 76 66" fill="none" stroke="${C}" stroke-width="3"/>`
  )
}

export const ART: Record<string, string> = {
  '🌊': wave(),
  '🐻': bearFace(),
  '🏔': mountain(),
  '🐵': monkeyFace(),
  '🌳': tree(),
  '🏜': desert(),
  '🧊': iceCube(),
  '🕸': web(),
  '🪷': lotus(),
  '🍯': honey(),
  '🐚': shell(),
  '🐔': chicken(),
  '🐐': goat(),
  '🧶': yarn(),
  '🌾': wheat(),
  '🍞': bread(),
  '🪵': wood(),
  '🍊': tangerine(),
  '🧃': juice(),
  '🫘': beans(),
  '🍫': chocolate(),
  '🐰': rabbitFace(),
  '🦴': bone(),
  '🐭': mouseFace(),
  '🧀': cheese(),
  '🐼': pandaFace(),
  '🎋': tanabata(),
  '🌿': herb(),
  '🐿': chipmunk(),
  '🌰': chestnut(),
  '🪱': worm(),
  '🌸': blossom(),
  '🐳': whale(),
  '🦀': crab(),
  '🐬': dolphin(),
  '🪼': jelly(),
  '🦅': eagle(),
  '🦜': parrot(),
  '🚗': car(),
  '🚌': bus(),
  '🚚': truck(),
  '🚜': tractor(),
  '⛵': sailboat(),
  '🚢': ship(),
  '🚤': speedboat(),
  '🛶': canoe(),
  '🚁': helicopter(),
  '🚀': rocket(),
  '🐇': rabbit(),
  '🎸': guitar(),
  '🍎': apple(),
  '⭐': star(),
  '🏠': house(),
  '🌲': evergreen(),
  '⚓': anchor(),
  '🦕': sauropod(),
  '🐎': horse(),
  '🐈': cat(),
}
