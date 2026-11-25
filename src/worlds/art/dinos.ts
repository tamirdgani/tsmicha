/* Dinosaurs world: original illustrations (viewBox 0 0 100 100). */

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
/** Stubby leg (quadrupeds), with toenails. */
const leg = (x: number, y: number, c: string, h = 18) =>
  `<rect x="${x}" y="${y}" width="11" height="${h}" rx="5" fill="${c}"/>` +
  `<path d="M${x + 3} ${y + h - 1.5}v-2.5M${x + 8} ${y + h - 1.5}v-2.5" stroke="#fff" stroke-width="2" opacity=".7"/>`
/** Darker shade for the far-side legs. */
const far = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  const f = (v: number) => Math.round(v * 0.8).toString(16).padStart(2, '0')
  return `#${f(n >> 16)}${f((n >> 8) & 255)}${f(n & 255)}`
}

const trex = () => {
  const G = '#2e9a48', L = '#a6e39a', D = '#237a39'
  return wrap(
    `<ellipse cx="58" cy="83" rx="8" ry="9" fill="${D}"/><ellipse cx="60" cy="91" rx="10" ry="4.5" fill="${D}"/>` +
    unite(
      `<path d="M30 58Q14 70 6 86Q24 82 40 76Z" fill="${G}"/>`,
      `<ellipse cx="44" cy="62" rx="20" ry="21" fill="${G}"/>`,
      `<ellipse cx="62" cy="32" rx="27" ry="20" fill="${G}"/>`,
    ) +
    `<ellipse cx="53" cy="66" rx="9" ry="13" fill="${L}" ${N}/>` +
    `<circle cx="34" cy="50" r="3.5" fill="${D}" ${N}/><circle cx="28" cy="60" r="2.5" fill="${D}" ${N}/><circle cx="50" cy="16" r="3" fill="${D}" ${N}/><circle cx="42" cy="22" r="2.2" fill="${D}" ${N}/>` +
    `<ellipse cx="42" cy="78" rx="10" ry="10" fill="${G}"/><ellipse cx="44" cy="90" rx="11" ry="4.5" fill="${G}"/>` +
    `<path d="M40 93v-2.5M46 93v-2.5" stroke="#fff" stroke-width="2" opacity=".7"/>` +
    `<ellipse cx="64" cy="60" rx="7.5" ry="4" fill="${G}" transform="rotate(30 64 60)"/>` + line('M69 64.5l1.5 2.5M66 66l.5 3', 2) +
    eye(68, 26, 4.8) + `<circle cx="85" cy="25" r="1.4" fill="${S}" ${N}/>` +
    line('M62 41Q75 49 87 39') + `<path d="M70 44.6l1.5 3 1.8-2.6M78 45.2l1.4 2.8 1.8-2.9" fill="#fff" stroke-width="1.4"/>` +
    cheek(76, 36)
  )
}

const longneck = () => {
  const B = '#1d70d8', L = '#9cc8ff', F = far(B)
  return wrap(
    leg(26, 68, F, 20) + leg(52, 68, F, 20) +
    unite(
      `<path d="M22 58Q2 58 4 74Q12 66 26 72Z" fill="${B}"/>`,
      `<ellipse cx="42" cy="64" rx="26" ry="16" fill="${B}"/>`,
      `<path d="M52 54Q64 40 66 18L82 18Q80 50 64 68Z" fill="${B}"/>`,
      `<ellipse cx="79" cy="18" rx="14" ry="10" fill="${B}"/>`,
    ) +
    `<ellipse cx="42" cy="72" rx="18" ry="6" fill="${L}" ${N}/>` +
    leg(18, 70, B, 20) + leg(44, 70, B, 20) +
    `<circle cx="34" cy="56" r="3.5" fill="${L}" ${N}/><circle cx="44" cy="53" r="2.5" fill="${L}" ${N}/><circle cx="26" cy="62" r="2.3" fill="${L}" ${N}/><circle cx="72" cy="38" r="2.2" fill="${L}" ${N}/>` +
    eye(81, 15, 3.8) + line('M83 23Q88 25 92 21', 2.3) + cheek(76, 22)
  )
}

const trike = () => {
  const O = '#f77f00', L = '#ffb04d', H = '#fff3d6', F = far(O)
  return wrap(
    leg(22, 70, F, 18) + leg(48, 70, F, 18) +
    `<path d="M20 60Q4 60 4 72Q14 68 24 72Z" fill="${O}"/>` +
    `<ellipse cx="40" cy="64" rx="25" ry="17" fill="${O}"/>` +
    `<ellipse cx="40" cy="73" rx="17" ry="6" fill="${L}" ${N}/>` +
    leg(14, 72, O, 18) + leg(40, 72, O, 18) +
    `<ellipse cx="62" cy="40" rx="18" ry="22" fill="${L}"/>` +
    `<circle cx="56" cy="26" r="2.4" fill="${O}" ${N}/><circle cx="50" cy="38" r="2.4" fill="${O}" ${N}/><circle cx="52" cy="52" r="2.4" fill="${O}" ${N}/>` +
    `<path d="M64 42L74 18L76 44Z" fill="${H}"/><path d="M75 44L88 22L86 46Z" fill="${H}"/>` +
    `<path d="M86 52L96 42L92 56Z" fill="${H}"/>` +
    `<ellipse cx="76" cy="56" rx="17" ry="13" fill="${O}"/>` +
    eye(76, 51, 4) + line('M79 62Q86 66 92 60', 2.4) + cheek(72, 60) +
    `<circle cx="90" cy="53" r="1.2" fill="${S}" ${N}/>`
  )
}

const stego = () => {
  const P = '#8b5cf6', L = '#c9b6ff', F = far(P)
  const plate = (x: number, y: number, h: number) =>
    `<path d="M${x - 6.5} ${y + 4}Q${x - 7} ${y - h * 0.55} ${x} ${y - h}Q${x + 7} ${y - h * 0.55} ${x + 6.5} ${y + 4}Z" fill="${L}"/>`
  return wrap(
    plate(22, 54, 14) + plate(33, 47, 18) + plate(45, 45, 19) + plate(57, 48, 16) + plate(67, 54, 11) +
    `<path d="M7 50L0 37L14 52ZM15 56L14 40L23 58Z" fill="${L}"/>` +
    leg(26, 68, F, 20) + leg(54, 68, F, 20) +
    unite(
      `<path d="M22 58Q10 56 5 44Q12 60 28 72Z" fill="${P}"/>`,
      `<ellipse cx="44" cy="63" rx="27" ry="16" fill="${P}"/>`,
      `<ellipse cx="80" cy="64" rx="13" ry="11" fill="${P}"/>`,
    ) +
    `<ellipse cx="44" cy="71" rx="19" ry="6" fill="#b49bff" ${N}/>` +
    leg(18, 70, P, 20) + leg(46, 70, P, 20) +
    eye(82, 60, 3.8) + line('M83 69Q88 71 92 67', 2.3) + cheek(77, 67)
  )
}

const ptero = () => {
  const R = '#e5383b', L = '#ff8a8c'
  const wing = (m: number) => {
    const x = (v: number) => (m > 0 ? v : 100 - v)
    return (
      `<path d="M${x(44)} 46Q${x(26)} 26 ${x(4)} 30Q${x(10)} 42 ${x(8)} 56Q${x(18)} 50 ${x(24)} 60Q${x(32)} 52 ${x(44)} 62Z" fill="${R}"/>` +
      `<path d="M${x(40)} 50Q${x(26)} 36 ${x(12)} 36Q${x(16)} 44 ${x(14)} 50Q${x(22)} 48 ${x(26)} 54Q${x(32)} 50 ${x(40)} 56Z" fill="${L}" ${N}/>`
    )
  }
  return wrap(
    wing(1) + wing(-1) +
    `<path d="M44 76v6M40 83h8M56 76v6M52 83h8" stroke-width="2.6"/>` +
    `<path d="M45 22L28 9L52 18Z" fill="${R}"/>` +
    unite(
      `<ellipse cx="50" cy="60" rx="11" ry="17" fill="${R}"/>`,
      `<circle cx="51" cy="30" r="14" fill="${R}"/>`,
      `<path d="M60 26L88 34L60 40Z" fill="${R}"/>`,
    ) +
    `<ellipse cx="50" cy="63" rx="6" ry="10" fill="${L}" ${N}/>` +
    `<path d="M62 37Q75 37 86 34" fill="none" stroke-width="2.2"/>` +
    eye(52, 28, 4) + cheek(46, 36)
  )
}

const ankylo = () => {
  const Y = '#ffc83d', D = '#e5a114', H = '#fff3d6', F = far(Y)
  const spike = (x: number, y: number, a: number) => {
    const r = (a * Math.PI) / 180
    const tx = r1(x + 9 * Math.cos(r)), ty = r1(y + 9 * Math.sin(r))
    const px = r1(4 * Math.sin(r)), py = r1(-4 * Math.cos(r))
    return `<path d="M${r1(x - px)} ${r1(y - py)}L${tx} ${ty}L${r1(x + px)} ${r1(y + py)}Z" fill="${H}"/>`
  }
  return wrap(
    leg(26, 66, F, 18) + leg(56, 66, F, 18) +
    spike(18, 62, 200) + spike(22, 50, 225) + spike(32, 42, 250) + spike(46, 39, 275) + spike(60, 41, 300) + spike(70, 50, 320) +
    tube('M22 66Q14 66 10 62', Y, 7) +
    `<path d="M2 60Q2 50 9 50Q16 50 16 58Q16 68 9 68Q2 68 2 60Z" fill="${D}"/>` +
        `<ellipse cx="82" cy="62" rx="12" ry="10" fill="${Y}"/>` +
    `<path d="M14 70Q14 42 46 42Q76 42 76 70Q46 76 14 70Z" fill="${Y}"/>` +
    `<circle cx="34" cy="53" r="4.2" fill="${D}" ${N}/><circle cx="46" cy="50" r="4.2" fill="${D}" ${N}/><circle cx="58" cy="53" r="4.2" fill="${D}" ${N}/>` +
    `<circle cx="26" cy="63" r="3.6" fill="${D}" ${N}/><circle cx="40" cy="62" r="3.6" fill="${D}" ${N}/><circle cx="53" cy="62" r="3.6" fill="${D}" ${N}/><circle cx="66" cy="63" r="3.6" fill="${D}" ${N}/>` +
    `<path d="M26 49Q32 44 40 44" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>` +
    leg(20, 68, Y, 18) + leg(50, 68, Y, 18) +
    eye(84, 58, 3.8) + line('M85 67Q89 69 93 65', 2.3) + cheek(79, 65)
  )
}

const raptor = () => {
  const P = '#ff8fab', D = '#e0607f', L = '#ffc2d1'
  return wrap(
    tube('M38 64Q32 76 28 84', D, 6) + `<ellipse cx="25" cy="87" rx="8" ry="3.8" fill="${D}"/>` +
    `<ellipse cx="38" cy="62" rx="8" ry="9" fill="${D}"/>` +
    unite(
      `<path d="M30 46Q14 42 4 30Q8 54 34 62Z" fill="${P}"/>`,
      `<ellipse cx="44" cy="54" rx="17" ry="13" fill="${P}" transform="rotate(-20 44 54)"/>`,
      `<path d="M48 48Q56 40 58 28L76 30Q72 48 60 60Z" fill="${P}"/>`,
      `<ellipse cx="68" cy="27" rx="16" ry="13" fill="${P}"/>`,
      `<ellipse cx="83" cy="31" rx="10" ry="7" fill="${P}"/>`,
    ) +
    `<path d="M58 15L53 7M63 14L61 5M68 14L70 6" stroke-width="2.6"/>` +
    `<path d="M26 44l3 5M33 41l3 5M40 39l3 5" stroke="${D}" stroke-width="3.2"/>` +
    `<ellipse cx="50" cy="58" rx="8" ry="6" fill="${L}" ${N} transform="rotate(-20 50 58)"/>` +
    tube('M50 68Q58 78 54 86', P, 6.5) + `<ellipse cx="58" cy="89" rx="8.5" ry="3.8" fill="${P}"/>` +
    `<ellipse cx="48" cy="64" rx="9" ry="10" fill="${P}"/>` +
    `<ellipse cx="64" cy="52" rx="7" ry="3.8" fill="${P}" transform="rotate(25 64 52)"/>` + line('M69 56l1.5 2.5M66.5 57.5l.5 3', 2) +
    eye(70, 24, 4.4) + line('M74 35Q83 38 91 33', 2.3) + cheek(68, 34) + `<circle cx="90" cy="28" r="1.2" fill="${S}" ${N}/>`
  )
}

const spino = () => {
  const B = '#8d5524', L = '#d9a46e', SL = '#c87f45'
  return wrap(
    `<path d="M22 54Q26 10 48 12Q66 14 66 50Z" fill="${SL}"/>` +
    line('M32 46L32 22M42 46L44 16M52 46L55 18M60 46L62 28', 2.2, '#8d5524') +
    `<ellipse cx="56" cy="84" rx="8" ry="8" fill="${far(B)}"/><ellipse cx="58" cy="91" rx="9" ry="4" fill="${far(B)}"/>` +
    unite(
      `<path d="M26 56Q8 62 4 80Q20 74 32 72Z" fill="${B}"/>`,
      `<ellipse cx="44" cy="61" rx="23" ry="17" fill="${B}"/>`,
      `<ellipse cx="72" cy="46" rx="14" ry="12" fill="${B}"/>`,
      `<path d="M60 52L66 38L80 40Z" fill="${B}"/>`,
      `<ellipse cx="85" cy="51" rx="11" ry="6.5" fill="${B}"/>`,
    ) +
    `<ellipse cx="48" cy="66" rx="12" ry="9" fill="${L}" ${N}/>` +
    `<ellipse cx="40" cy="78" rx="9" ry="9" fill="${B}"/><ellipse cx="42" cy="90" rx="10" ry="4.5" fill="${B}"/>` +
    `<ellipse cx="62" cy="65" rx="7.5" ry="4" fill="${B}" transform="rotate(30 62 65)"/>` + line('M67 69.5l1.5 2.5M64 71l.5 3', 2) +
    eye(73, 42, 4.2) + line('M72 54Q82 59 94 53', 2.3) + cheek(70, 51) + `<circle cx="92" cy="48" r="1.2" fill="${S}" ${N}/>`
  )
}

const egg = () =>
  wrap(
    `<path d="M50 10C70 10 82 40 82 60C82 80 68 92 50 92C32 92 18 80 18 60C18 40 30 10 50 10Z" fill="#fff4d6"/>` +
    `<circle cx="40" cy="36" r="6" fill="#7fd36e" ${N}/><circle cx="62" cy="30" r="4" fill="#7fd36e" ${N}/><circle cx="66" cy="58" r="7" fill="#7fd36e" ${N}/>` +
    `<circle cx="34" cy="66" r="5" fill="#7fd36e" ${N}/><circle cx="52" cy="78" r="4.5" fill="#7fd36e" ${N}/><circle cx="50" cy="52" r="3" fill="#7fd36e" ${N}/>` +
    `<path d="M30 30Q34 20 42 16" fill="none" stroke="#fff" stroke-width="3.5"/>` +
    line('M22 50L30 46L36 52L44 45L50 51L57 44L63 50L71 45L79 49', 2.4)
  )

const bone = () => {
  const C = '#fff3dc'
  const knob = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="10" fill="${C}"/>`
  return wrap(
    unite(
      `<rect x="20" y="41" width="60" height="18" rx="6" fill="${C}" transform="rotate(-35 50 50)"/>`,
      knob(14, 66).replace('/>', '/>'),
      knob(24, 80),
      knob(76, 20),
      knob(86, 34),
    ) +
    `<path d="M34 58L62 38" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>` +
    `<path d="M40 64L66 46" fill="none" stroke="#e8d4ae" stroke-width="3"/>`
  )
}

const volcano = () =>
  wrap(
    `<circle cx="38" cy="18" r="8" fill="#d6d6de"/><circle cx="50" cy="13" r="9" fill="#e4e4ea"/><circle cx="62" cy="18" r="7.5" fill="#d6d6de"/>` +
    `<path d="M8 90L36 36Q50 30 64 36L92 90Z" fill="#8a6248"/>` +
    `<path d="M36 36Q50 30 64 36L66 40Q60 46 60 56Q56 50 54 56Q52 66 48 52Q46 44 42 50Q40 54 38 46Q36 40 34 40Z" fill="#f77f00"/>` +
    `<path d="M40 38Q50 34 60 38" fill="none" stroke="#ffc83d" stroke-width="3"/>` +
    `<path d="M20 78Q26 74 30 78M66 70Q72 66 76 70M44 82Q50 78 56 82" fill="none" stroke="#6b4a36" stroke-width="2.4"/>` +
    `<circle cx="30" cy="10" r="2.6" fill="#e5383b" ${N}/><circle cx="72" cy="8" r="2.2" fill="#f77f00" ${N}/>`
  )

const palm = () => {
  const T = '#b07a43', G = '#3fae5a'
  const frond = (d: string) => `<path d="${d}" fill="${G}"/>`
  return wrap(
    `<path d="M47 32Q42 60 38 90H54Q54 60 55 32Z" fill="${T}"/>` +
    line('M44 44h10M42 56h11M41 68h12M40 80h13', 2.3) +
    frond('M51 30Q30 14 8 24Q30 22 50 34Z') +
    frond('M51 30Q70 12 93 22Q70 22 52 34Z') +
    frond('M50 32Q24 30 14 52Q32 36 51 36Z') +
    frond('M52 32Q78 30 88 52Q70 36 51 36Z') +
    frond('M51 31Q46 12 54 6Q56 20 53 31Z') +
    `<circle cx="47" cy="38" r="4.5" fill="#7a4b2f"/><circle cx="56" cy="38" r="4.5" fill="#7a4b2f"/>` +
    `<path d="M28 90Q46 84 66 90Z" fill="#c9a26b"/>`
  )
}

const toe = (x: number, y: number, a: number, c: string) =>
  `<ellipse cx="${x}" cy="${y}" rx="8" ry="18" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`
const foot = (c: string) =>
  unite(`<ellipse cx="50" cy="72" rx="18" ry="16" fill="${c}"/>`, toe(50, 40, 0, c), toe(31, 52, -45, c), toe(69, 52, 45, c))
const footprint = () =>
  wrap(
    `<path d="M50 15L46 23H54ZM14 35L16 44L22 38ZM86 35L78 38L84 44Z" fill="#fff3d6" stroke-width="2.2"/>` +
    foot('#a0673a') +
    `<path d="M40 76Q42 68 50 66M47 30V44M30 44l6 6M70 44l-6 6" fill="none" stroke="#fff" stroke-width="3" opacity=".35"/>`
  )

const fossil = () => {
  const C = '#e8d3a6'
  const pts = 18
  let d = ''
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2 - Math.PI / 2
    const x = r1(50 + 38 * Math.cos(a)), y = r1(52 + 38 * Math.sin(a))
    d += i === 0 ? `M${x} ${y}` : `A7.4 7.4 0 0 1 ${x} ${y}`
  }
  let sp = 'M50 52'
  for (let t = 0; t <= 3.1 * Math.PI * 2; t += 0.35) {
    const rr = 1 + t * 1.6
    sp += `L${r1(50 + rr * Math.cos(t))} ${r1(52 + rr * Math.sin(t))}`
  }
  const ribs = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2
    return `M${r1(50 + 22 * Math.cos(a))} ${r1(52 + 22 * Math.sin(a))}L${r1(50 + 33 * Math.cos(a))} ${r1(52 + 33 * Math.sin(a))}`
  }).join('')
  return wrap(
    `<path d="${d}Z" fill="${C}"/>` +
    line(ribs, 2, '#b89664') +
    line(sp, 3) +
    `<path d="M24 34Q30 24 40 20" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`
  )
}

const rock = () =>
  wrap(
    `<path d="M6 86Q4 60 18 46Q26 30 44 28Q64 26 74 42Q86 56 82 86Z" fill="#9aa0a6"/>` +
    `<path d="M72 86Q72 74 82 72Q94 72 94 86Z" fill="#b8bdc2"/>` +
    line('M50 40L46 50L52 58L48 68M46 50L40 54', 2.4) +
    `<path d="M18 52Q24 40 36 35" fill="none" stroke="#fff" stroke-width="3.5" opacity=".5"/>` +
    `<path d="M26 30Q36 22 46 28Q56 22 64 30Q52 33 44 34Q34 34 26 30Z" fill="#6cc070"/>`
  )

const meteor = () =>
  wrap(
    `<path d="M30 54L90 6L58 54L74 50L46 76Z" fill="#e5383b"/>` +
    `<path d="M34 54L80 16L54 52L64 52L44 68Z" fill="#f77f00" ${N}/>` +
    `<path d="M38 56L66 32L52 54L44 62Z" fill="#ffc83d" ${N}/>` +
    `<circle cx="32" cy="68" r="20" fill="#8a6248"/>` +
    `<circle cx="24" cy="64" r="4.5" fill="#6b4a36" ${N}/><circle cx="36" cy="76" r="5" fill="#6b4a36" ${N}/><circle cx="40" cy="60" r="3" fill="#6b4a36" ${N}/>` +
    `<path d="M18 60Q22 52 30 50" fill="none" stroke="#fff" stroke-width="3" opacity=".4"/>`
  )

const nest = () => {
  const T = '#b07a43', D = '#7a4b2f'
  const e = (x: number, y: number, rot: number) =>
    `<ellipse cx="${x}" cy="${y}" rx="11" ry="15" fill="#fff4d6" transform="rotate(${rot} ${x} ${y})"/>` +
    `<circle cx="${x - 3}" cy="${y - 5}" r="2.6" fill="#7fd36e" ${N}/><circle cx="${x + 3}" cy="${y + 3}" r="2" fill="#7fd36e" ${N}/>`
  return wrap(
    e(34, 46, -18) + e(66, 46, 18) + e(50, 40, 0) +
    `<path d="M8 54Q12 52 20 54Q50 62 80 54Q88 52 92 54Q90 86 50 88Q10 86 8 54Z" fill="${T}"/>` +
    line('M14 62Q30 70 48 66M52 70Q70 72 86 62M20 74Q36 80 50 76M54 80Q68 80 78 72M30 58l8 6M62 60l8-4', 2.2, D) +
    `<path d="M6 56l-2-6M92 56l3-6M20 54l-4-6" stroke-width="2.4"/>`
  )
}

const leaf = () => {
  const G = '#3fae5a'
  const pairs = [0, 1, 2, 3, 4, 5]
  const lf = (x: number, y: number, len: number, rot: number) =>
    `<ellipse cx="${x}" cy="${y}" rx="${len}" ry="${r1(len * 0.42)}" fill="${G}" transform="rotate(${rot} ${x} ${y})"/>`
  // Stem from (54,92) curving up to (46,10)
  const P = (t: number) => {
    const u = 1 - t
    return [u * u * 54 + 2 * u * t * 60 + t * t * 44, u * u * 92 + 2 * u * t * 50 + t * t * 10]
  }
  let s = ''
  for (const i of pairs) {
    const t = 0.18 + i * 0.13
    const [x, y] = P(t)
    const len = 15 - i * 1.8
    s += lf(r1(x - len + 2), r1(y + 2), r1(len), 18) + lf(r1(x + len - 2), r1(y + 2), r1(len), -18)
  }
  const [tx, ty] = P(0.97)
  return wrap(
    line('M54 92Q60 50 44 10', 3.2) +
    s +
    lf(r1(tx), r1(ty + 3), 5, -80) +
    line('M54 92Q60 50 44 10', 2.4, '#237a39')
  )
}

const badge = () =>
  wrap(
    `<circle cx="50" cy="50" r="42" fill="#f77f00"/>` +
    `<circle cx="50" cy="50" r="33" fill="#ffe8a3" stroke-width="2.4"/>` +
    `<g transform="translate(50 52) scale(.6) translate(-50 -52)" stroke-width="4">${foot('#2e9a48')}</g>` +
    `<path d="M24 34Q32 22 46 18" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`
  )

const pattern = () =>
  `<g fill="none" stroke="#000" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">` +
  // footprint
  `<g transform="translate(12 12) scale(.2)" fill="#000" stroke="none"><ellipse cx="50" cy="72" rx="18" ry="16"/><ellipse cx="50" cy="40" rx="8" ry="18"/><ellipse cx="31" cy="52" rx="8" ry="18" transform="rotate(-45 31 52)"/><ellipse cx="69" cy="52" rx="8" ry="18" transform="rotate(45 69 52)"/></g>` +
  // bone
  `<path d="M60 22L74 14M58 20a2.6 2.6 0 1 0 -1 4.5a2.6 2.6 0 1 0 4 1M76 16a2.6 2.6 0 1 0 1-4.5a2.6 2.6 0 1 0-4-1"/>` +
  // egg
  `<path d="M24 62Q30 62 32 72Q32 80 24 80Q16 80 16 72Q18 62 24 62Z"/><path d="M18 71l3 2 3-2 3 2 3-2"/>` +
  // volcano
  `<path d="M60 84L68 70H74L82 84Z"/><path d="M69 66q2-3 4 0"/>` +
  // fern
  `<path d="M48 54Q50 46 46 38M47 50l-3-2M48 46l3-2M47 42l-3-2"/>` +
  `<circle cx="88" cy="46" r="1.4" fill="#000" stroke="none"/><circle cx="40" cy="90" r="1.4" fill="#000" stroke="none"/><circle cx="8" cy="44" r="1.4" fill="#000" stroke="none"/>` +
  `</g>`

export const ART: Record<string, string> = {
  'dino-trex': trex(),
  'dino-longneck': longneck(),
  'dino-trike': trike(),
  'dino-stego': stego(),
  'dino-ptero': ptero(),
  'dino-ankylo': ankylo(),
  'dino-raptor': raptor(),
  'dino-spino': spino(),
  egg: egg(),
  bone: bone(),
  volcano: volcano(),
  palm: palm(),
  footprint: footprint(),
  fossil: fossil(),
  rock: rock(),
  meteor: meteor(),
  nest: nest(),
  leaf: leaf(),
  badge: badge(),
  pattern: pattern(),
}
