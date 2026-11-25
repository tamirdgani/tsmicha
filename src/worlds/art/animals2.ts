/* Animals world, set 2: original illustrations (viewBox 0 0 100 100). Same style as animals.ts. */

const S = '#2b2b3a'
const N = 'stroke="none"'
/** Wraps a drawing in the shared outline style (children inherit the stroke). */
const wrap = (s: string) =>
  `<g stroke="${S}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round">${s}</g>`

const r1 = (n: number) => Math.round(n * 10) / 10

/** Shiny cartoon eye. */
const eye = (x: number, y: number, r = 4) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r1(r * 1.15)}" fill="${S}" ${N}/>` +
  `<circle cx="${r1(x + r * 0.35)}" cy="${r1(y - r * 0.45)}" r="${r1(r * 0.4)}" fill="#fff" ${N}/>`
const eyes = (cx: number, y: number, dx: number, r = 4) => eye(cx - dx, y, r) + eye(cx + dx, y, r)
const cheek = (x: number, y: number, c = '#ff6b8b') =>
  `<ellipse cx="${x}" cy="${y}" rx="3.8" ry="2.4" fill="${c}" opacity=".45" ${N}/>`
const cheeks = (cx: number, y: number, dx: number, c = '#ff6b8b') => cheek(cx - dx, y, c) + cheek(cx + dx, y, c)
const line = (d: string, w = 2.5, c = S) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Thick outlined tube (tails, necks, snake bodies). */
const tube = (d: string, c: string, w = 7) =>
  `<path d="${d}" fill="none" stroke-width="${w + 5.6}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Scalloped ring (wool). */
const scallop = (cx: number, cy: number, R: number, n: number, c: string, ry = R) => {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    return [r1(cx + R * Math.cos(a)), r1(cy + ry * Math.sin(a))]
  })
  const ar = r1(R * Math.sin(Math.PI / n) * 1.15)
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i <= n; i++) {
    const p = pts[i % n]
    d += `A${ar} ${ar} 0 0 1 ${p[0]} ${p[1]}`
  }
  return `<path d="${d}Z" fill="${c}"/>`
}
/** Draws shapes so their union gets one shared outline (outlines first, fills on top). */
const unite = (...els: string[]) =>
  els.map((e) => e.replace('/>', ' stroke-width="5.6"/>')).join('') + els.map((e) => e.replace('/>', ` ${N}/>`)).join('')
/** Hoofed leg (side-view quadrupeds). */
const hoofLeg = (x: number, y: number, h: number, c: string, hoof = '#5a4a44', w = 8) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3.5" fill="${c}"/>` +
  `<rect x="${x}" y="${y + h - 6}" width="${w}" height="6" rx="2.5" fill="${hoof}"/>`
const shade = (hex: string, k = 0.82) => {
  const n = parseInt(hex.slice(1), 16)
  const f = (v: number) => Math.round(v * k).toString(16).padStart(2, '0')
  return `#${f(n >> 16)}${f((n >> 8) & 255)}${f(n & 255)}`
}

const giraffe = () => {
  const G = '#f2c98f', P = '#c06a2c', L = '#fbe6c6'
  const spot = (x: number, y: number, rx: number, ry: number, a = 0) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${P}" ${N} transform="rotate(${a} ${x} ${y})"/>`
  return wrap(
    tube('M83 52Q90 58 89 70', G, 3) + `<ellipse cx="89" cy="73" rx="3.2" ry="5" fill="${P}"/>` +
    hoofLeg(52, 60, 31, shade(G)) + hoofLeg(80, 60, 31, shade(G)) +
    `<path d="M24 11L23 4M32 11L33 4" stroke-width="3"/>` +
    `<circle cx="23" cy="4" r="2.8" fill="${P}"/><circle cx="33" cy="4" r="2.8" fill="${P}"/>` +
    `<ellipse cx="40" cy="13" rx="6" ry="2.8" fill="${G}" transform="rotate(-20 40 13)"/>` +
    unite(
      `<ellipse cx="64" cy="55" rx="24" ry="13" fill="${G}"/>`,
      `<path d="M42 58L22 20L36 12L58 48Z" fill="${G}"/>`,
      `<ellipse cx="25" cy="18" rx="15" ry="11" fill="${G}"/>`,
    ) +
    line('M37 13L57 46', 4, P) +
    spot(38, 34, 4, 3, 30) + spot(46, 46, 4.5, 3.5, 20) + spot(31, 26, 2.6, 2) +
    spot(56, 51, 5, 3.5) + spot(68, 49, 4.5, 3.5) + spot(80, 55, 4, 3.5) + spot(64, 60, 4, 3) + spot(50, 60, 3, 2.4) +
    `<ellipse cx="13" cy="22" rx="8" ry="7" fill="${L}"/>` +
    `<circle cx="9" cy="20" r="1.3" fill="${S}" ${N}/>` +
    hoofLeg(46, 62, 29, G) + hoofLeg(74, 62, 29, G) +
    eye(27, 15, 3.8) + cheek(26, 24) + line('M9 25Q13 28 17 25', 2.2)
  )
}

const horse = () => {
  const C = '#c97a41', M = '#5a3b2c', L = '#e6a774'
  return wrap(
    `<path d="M83 50Q99 52 95 78Q90 70 86 74Q86 62 81 56Z" fill="${M}"/>` +
    hoofLeg(44, 60, 31, shade(C)) + hoofLeg(74, 60, 31, shade(C)) +
    `<path d="M33 14L36 3L42 14Z" fill="${C}"/>` +
    unite(
      `<ellipse cx="60" cy="55" rx="26" ry="14" fill="${C}"/>`,
      `<path d="M30 40L34 18L48 24L50 52Z" fill="${C}"/>`,
      `<ellipse cx="25" cy="31" rx="18" ry="10" fill="${C}" transform="rotate(-38 25 31)"/>`,
    ) +
    `<ellipse cx="13" cy="41" rx="8" ry="6.5" fill="${L}" transform="rotate(-38 13 41)"/>` +
    `<ellipse cx="11" cy="40" rx="1.6" ry="1.2" fill="${S}" ${N}/>` +
    `<path d="M38 14Q30 12 30 20Q34 18 36 20Q34 26 38 28Q42 26 42 30Q42 38 46 38Q46 46 52 48Q54 34 48 24Q46 16 38 14Z" fill="${M}"/>` +
    `<path d="M40 52Q50 46 66 46" fill="none" stroke="#fff" stroke-width="3" opacity=".3"/>` +
    hoofLeg(36, 62, 29, C) + hoofLeg(66, 62, 29, C) +
    eye(26, 25, 3.4) + cheek(24, 33) + line('M12 47Q16 49 20 46', 2.2)
  )
}

const cow = () => {
  const W = '#fbfbf7', K = '#3a3a48', P = '#ffb3c6', H = '#fff3d6'
  return wrap(
    tube('M88 46Q96 56 92 70', W, 3) + `<ellipse cx="92" cy="73" rx="3.5" ry="5" fill="${K}"/>` +
    hoofLeg(46, 62, 28, '#e4e4ea', K, 9) + hoofLeg(80, 62, 28, '#e4e4ea', K, 9) +
    `<rect x="30" y="38" width="62" height="32" rx="15" fill="${W}"/>` +
    `<path d="M50 39Q56 50 66 44Q70 40 68 39Z" fill="${K}" ${N}/><path d="M74 52Q82 46 90 52Q90 64 82 66Q74 62 74 52Z" fill="${K}" ${N}/><ellipse cx="56" cy="60" rx="5" ry="4" fill="${K}" ${N}/>` +
    `<path d="M62 70Q62 78 68 78Q74 78 74 70Z" fill="${P}"/>` +
    hoofLeg(38, 64, 26, W, K, 9) + hoofLeg(72, 64, 26, W, K, 9) +
    `<path d="M15 22Q8 16 10 8Q16 14 21 17ZM33 22Q40 16 38 8Q32 14 27 17Z" fill="${H}"/>` +
    `<ellipse cx="9" cy="30" rx="8" ry="4" fill="${W}" transform="rotate(20 9 30)"/><ellipse cx="39" cy="30" rx="8" ry="4" fill="${W}" transform="rotate(-20 39 30)"/>` +
    `<ellipse cx="24" cy="36" rx="14" ry="16" fill="${W}"/>` +
    `<path d="M28 21Q36 22 37 32Q32 34 28 28Z" fill="${K}" ${N}/>` +
    `<ellipse cx="24" cy="49" rx="13" ry="8.5" fill="${P}"/>` +
    `<ellipse cx="19.5" cy="49" rx="2" ry="2.6" fill="#e0607f" ${N}/><ellipse cx="28.5" cy="49" rx="2" ry="2.6" fill="#e0607f" ${N}/>` +
    eyes(24, 35, 6, 3.4) + `<circle cx="24" cy="60" r="4" fill="#ffc83d" stroke-width="2.2"/>`
  )
}

const sheep = () => {
  const W = '#fbfaf5', F = '#f3d9c0', D = '#4a4a5a'
  return wrap(
    `<rect x="40" y="66" width="7" height="25" rx="3" fill="${D}"/><rect x="70" y="66" width="7" height="25" rx="3" fill="${D}"/>` +
    scallop(58, 54, 32, 14, W, 22) +
    `<path d="M40 44Q46 36 56 36" fill="none" stroke="#e4e1d6" stroke-width="3"/><path d="M66 60Q74 62 80 56" fill="none" stroke="#e4e1d6" stroke-width="3"/>` +
    `<rect x="48" y="68" width="7" height="24" rx="3" fill="${D}"/><rect x="78" y="68" width="7" height="24" rx="3" fill="${D}"/>` +
    `<ellipse cx="34" cy="38" rx="9" ry="4.5" fill="${F}" transform="rotate(30 34 38)"/>` +
    `<ellipse cx="21" cy="42" rx="12" ry="14" fill="${F}"/>` +
    scallop(23, 27, 10, 7, W) +
    eye(16, 40, 3.2) + eye(26, 40, 3.2) + cheeks(21, 48, 7) +
    `<path d="M18 50Q21 53 24 50" fill="none" stroke-width="2.2"/>`
  )
}

const duck = () => {
  const W = '#fffdf5', O = '#ff9f1c', B = '#5fb7ea'
  return wrap(
    unite(
      `<path d="M30 70Q24 50 46 48Q70 48 82 38Q90 34 92 44Q94 62 82 74Q70 84 50 84Q32 82 30 70Z" fill="${W}"/>`,
      `<path d="M28 44L30 64L48 58L42 40Z" fill="${W}"/>`,
      `<circle cx="34" cy="31" r="15" fill="${W}"/>`,
    ) +
    `<path d="M34 16Q36 10 42 12Q38 13 38 17" fill="${W}" stroke-width="2.4"/>` +
    `<path d="M21 32Q8 30 6 36Q10 42 22 40Z" fill="${O}" stroke-width="2.4"/>` + line('M8 37.5Q14 38 21 36.5', 1.8) +
    `<path d="M52 60Q62 52 76 56Q80 64 70 70Q58 72 52 60Z" fill="#eee8d8"/>` +
    eye(33, 27, 3.6) + cheek(32, 36) +
    `<path d="M6 82Q14 76 22 82Q30 88 38 82Q46 76 54 82Q62 88 70 82Q78 76 86 82Q90 85 94 83V92H6Z" fill="${B}"/>` +
    `<path d="M14 87Q18 85 22 87M60 88Q64 86 68 88" fill="none" stroke="#fff" stroke-width="2.2" opacity=".8"/>`
  )
}

const snail = () => {
  const B = '#9fd3e6', D = '#6aaec6', SH = '#e7a35f', SD = '#a8642e'
  let sp = 'M58 52'
  for (let t = 0.6; t <= 2.6 * Math.PI * 2; t += 0.35) {
    const rr = 1.2 + t * 1.45
    sp += `L${r1(58 + rr * Math.cos(t + 2))} ${r1(52 + rr * Math.sin(t + 2))}`
  }
  return wrap(
    `<path d="M16 50L11 32M24 50L27 32" stroke-width="2.8"/>` +
    `<circle cx="11" cy="31" r="5.5" fill="#fff"/><circle cx="27" cy="31" r="5.5" fill="#fff"/>` +
    eye(12, 31.5, 2.6) + eye(28, 31.5, 2.6) +
    `<path d="M8 84Q8 50 22 48Q32 48 34 66L70 70Q90 72 94 86Q94 90 88 90H14Q8 90 8 84Z" fill="${B}"/>` +
    `<path d="M14 64Q14 56 20 54" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/>` +
    cheek(24, 66) + line('M15 70Q19 73 23 70', 2.2) +
    `<path d="M30 84H90" stroke="${D}" stroke-width="2.4"/>` +
    `<circle cx="58" cy="52" r="28" fill="${SH}"/>` +
    line(sp, 3.2, SD) +
    `<path d="M38 36Q44 28 54 26" fill="none" stroke="#fff" stroke-width="3.2" opacity=".55"/>`
  )
}

const bee = () => {
  const Y = '#ffd447', K = '#3a3a48', Wg = '#dff3ff'
  return wrap(
    `<ellipse cx="52" cy="28" rx="11" ry="17" fill="${Wg}" transform="rotate(-25 52 28)"/>` +
    `<ellipse cx="68" cy="28" rx="10" ry="15" fill="${Wg}" transform="rotate(20 68 28)"/>` +
    `<path d="M50 20Q52 30 54 36M66 20Q66 28 64 34" fill="none" stroke="#a9cfe6" stroke-width="2"/>` +
    `<path d="M88 58L96 60L88 63Z" fill="${K}" stroke-width="2.2"/>` +
    `<path d="M48 76l-3 7M60 77v7M72 75l3 7" stroke-width="2.6"/>` +
    `<ellipse cx="60" cy="58" rx="28" ry="20" fill="${Y}"/>` +
    `<path d="M58 38V78M72 39.5V76.5" stroke="${K}" stroke-width="7.5" stroke-linecap="butt"/>` +
    `<path d="M84 46V70" stroke="${K}" stroke-width="5" stroke-linecap="butt"/>` +
    `<ellipse cx="60" cy="58" rx="28" ry="20" fill="none"/>` +
    `<path d="M22 32Q16 20 10 18M30 30Q32 18 28 12" fill="none" stroke-width="2.4"/>` +
    `<circle cx="10" cy="18" r="2.8" fill="${K}"/><circle cx="28" cy="12" r="2.8" fill="${K}"/>` +
    `<circle cx="28" cy="50" r="17" fill="${Y}"/>` +
    `<ellipse cx="22" cy="40" rx="5" ry="2.6" fill="#fff" opacity=".45" ${N}/>` +
    eye(23, 48, 3.6) + eye(35, 48, 3.6) + cheeks(29, 56, 10) +
    `<path d="M24 57Q29 62 34 57" fill="none" stroke-width="2.4"/>`
  )
}

const snake = () => {
  const C = '#3aa8c1', D = '#23798f', L = '#c4eef6'
  const d = 'M90 86Q72 94 52 86Q30 78 44 68Q60 60 64 50Q68 38 52 34Q44 32 40 36'
  return wrap(
    tube(d, C, 15) +
    `<path d="${d}" fill="none" stroke="${D}" stroke-width="4.5" stroke-dasharray=".5 11"/>` +
    `<path d="M14 40L6 42M6 42L2 39M6 42L3 46" fill="none" stroke="#e5383b" stroke-width="2.4"/>` +
    `<ellipse cx="30" cy="34" rx="18" ry="14" fill="${C}"/>` +
    `<ellipse cx="26" cy="41" rx="10" ry="4.5" fill="${L}" ${N}/>` +
    `<ellipse cx="24" cy="25" rx="5" ry="2.6" fill="#fff" opacity=".4" ${N}/>` +
    eye(25, 31, 3.6) + eye(37, 31, 3.6) + cheeks(31, 39, 10) +
    `<path d="M16 41Q24 46 32 42" fill="none" stroke-width="2.4"/>`
  )
}

const crab = () => {
  const R = '#e5383b', D = '#b8262a', L = '#ff8a8c'
  const claw = (m: number) => {
    const x = (v: number) => r1(m > 0 ? v : 100 - v)
    return (
      tube(`M${x(30)} 58Q${x(16)} 56 ${x(17)} 40`, R, 6) +
      `<path d="M${x(17)} 44Q${x(4)} 40 ${x(6)} 26Q${x(8)} 14 ${x(16)} 12L${x(17)} 24L${x(26)} 18Q${x(30)} 30 ${x(26)} 38Q${x(22)} 45 ${x(17)} 44Z" fill="${R}"/>` +
      `<path d="M${x(9)} 30Q${x(9)} 22 ${x(13)} 18" fill="none" stroke="#fff" stroke-width="2.6" opacity=".5"/>`
    )
  }
  const legs = (m: number) => {
    const x = (v: number) => r1(m > 0 ? v : 100 - v)
    return `<path d="M${x(28)} 66L${x(12)} 70L${x(8)} 80M${x(30)} 72L${x(16)} 80L${x(14)} 90M${x(36)} 76L${x(26)} 86L${x(26)} 94" fill="none" stroke-width="3.2"/>`
  }
  return wrap(
    legs(1) + legs(-1) + claw(1) + claw(-1) +
    `<path d="M42 50L40 34M58 50L60 34" stroke-width="3"/>` +
    `<circle cx="40" cy="31" r="7" fill="#fff"/><circle cx="60" cy="31" r="7" fill="#fff"/>` +
    eye(40, 32, 3.4) + eye(60, 32, 3.4) +
    `<ellipse cx="50" cy="64" rx="28" ry="18" fill="${R}"/>` +
    `<path d="M30 58Q36 50 46 48" fill="none" stroke="${L}" stroke-width="3.2"/>` +
    `<circle cx="62" cy="54" r="2" fill="${D}" ${N}/><circle cx="68" cy="60" r="1.6" fill="${D}" ${N}/>` +
    cheeks(50, 66, 14, '#ffb3c6') + `<path d="M43 67Q50 74 57 67" fill="none" stroke-width="2.5"/>`
  )
}

const parrot = () => {
  const R = '#e5383b', B = '#1d70d8', Y = '#ffc83d', T = '#8d5524'
  return wrap(
    `<path d="M56 64L62 96L70 94L64 62Z" fill="${B}"/><path d="M50 64L50 94L58 95L58 62Z" fill="${R}"/>` +
    `<path d="M8 74Q50 68 92 72" stroke-width="9"/><path d="M8 74Q50 68 92 72" stroke="${T}" stroke-width="4"/>` +
    unite(
      `<ellipse cx="54" cy="50" rx="17" ry="22" fill="${R}" transform="rotate(18 54 50)"/>`,
      `<circle cx="42" cy="26" r="15" fill="${R}"/>`,
    ) +
    `<path d="M50 42Q72 40 76 58Q74 72 64 74Q56 60 50 42Z" fill="${B}"/>` +
    `<path d="M62 66Q68 70 72 64M66 56Q70 58 74 54" fill="none" stroke="${Y}" stroke-width="3"/>` +
    `<path d="M54 44Q62 46 66 52" fill="none" stroke="${Y}" stroke-width="3.5"/>` +
    `<path d="M33 22Q24 26 30 34Q38 36 40 28Q40 22 33 22Z" fill="#fff" ${N}/>` +
    `<path d="M30 20Q20 16 15 24Q12 32 18 38Q20 30 26 31Q30 30 30 20Z" fill="#f3e6cc"/>` +
    `<path d="M19 33Q24 36 29 32" fill="none" stroke-width="2.2"/>` +
    eye(36, 25, 3.6) +
    `<ellipse cx="40" cy="12" rx="4" ry="2" fill="#fff" opacity=".4" ${N}/>` +
    `<path d="M46 70v4M52 70v4" stroke="#7a7a88" stroke-width="3.5"/>`
  )
}

const mouse = () => {
  const C = '#cdb9a6', L = '#f1e6da', P = '#ffb3c6'
  return wrap(
    `<path d="M66 82Q90 88 90 70Q90 58 80 62" fill="none" stroke="${P}" stroke-width="3.2"/>` +
    `<ellipse cx="41" cy="90" rx="8" ry="4.5" fill="${P}"/><ellipse cx="59" cy="90" rx="8" ry="4.5" fill="${P}"/>` +
    `<ellipse cx="50" cy="75" rx="17" ry="14" fill="${C}"/><ellipse cx="50" cy="78" rx="10" ry="8.5" fill="${L}" ${N}/>` +
    `<ellipse cx="34" cy="73" rx="4.5" ry="7" fill="${C}" transform="rotate(25 34 73)"/><ellipse cx="66" cy="73" rx="4.5" ry="7" fill="${C}" transform="rotate(-25 66 73)"/>` +
    `<circle cx="25" cy="26" r="16" fill="${C}"/><circle cx="75" cy="26" r="16" fill="${C}"/>` +
    `<circle cx="25" cy="27" r="10" fill="${P}" ${N}/><circle cx="75" cy="27" r="10" fill="${P}" ${N}/>` +
    `<ellipse cx="50" cy="46" rx="21" ry="18" fill="${C}"/>` +
    `<ellipse cx="42" cy="33" rx="6" ry="3" fill="#fff" opacity=".35" ${N}/>` +
    eyes(50, 43, 8, 3.6) + cheeks(50, 52, 13) +
    `<ellipse cx="50" cy="51" rx="3.4" ry="2.6" fill="#ff7a95" stroke-width="1.8"/>` +
    `<path d="M47 56Q50 59 53 56" fill="none" stroke-width="2.2"/>` +
    `<path d="M20 47L36 50M21 55L36 53M80 47L64 50M79 55L64 53" stroke-width="1.6"/>`
  )
}

const hedgehog = () => {
  const SP = '#7a6152', SL = '#a3897a', F = '#f3dcc0'
  let d = ''
  const n = 19
  for (let i = 0; i <= n; i++) {
    const a = Math.PI + (i / n) * Math.PI
    const R = i % 2 === 0 ? 40 : 32
    const x = r1(55 + R * Math.cos(a)), y = r1(74 + R * Math.sin(a))
    d += (i === 0 ? 'M' : 'L') + `${x} ${y}`
  }
  return wrap(
    `<ellipse cx="44" cy="88" rx="6" ry="4" fill="${shade(F)}"/><ellipse cx="74" cy="88" rx="6" ry="4" fill="${shade(F)}"/>` +
    `<path d="${d}Q96 86 56 86Q18 86 15 74Z" fill="${SP}"/>` +
    `<path d="M44 50L48 58M56 44L57 54M70 48L68 57M82 58L77 64M60 64L60 70" stroke="${SL}" stroke-width="2.6"/>` +
    `<path d="M38 60Q30 52 18 62Q8 68 6 74Q8 80 16 80Q30 86 46 82Q48 70 38 60Z" fill="${F}"/>` +
    `<circle cx="6.5" cy="73.5" r="3.6" fill="${S}"/>` +
    eye(24, 66, 3.4) + cheek(26, 75) + line('M12 79Q16 82 20 79', 2.2) +
    `<ellipse cx="34" cy="62" rx="4" ry="5" fill="${F}"/>` +
    `<ellipse cx="34" cy="63" rx="2" ry="2.8" fill="#ffb3c6" ${N}/>` +
    `<ellipse cx="38" cy="88" rx="6" ry="4" fill="${F}"/><ellipse cx="66" cy="88" rx="6" ry="4" fill="${F}"/>`
  )
}

const kangaroo = () => {
  const C = '#d0915c', L = '#f2d1ae', D = shade('#d0915c')
  return wrap(
    tube('M64 74Q80 80 92 92', C, 9) +
    `<ellipse cx="56" cy="88" rx="15" ry="5" fill="${D}"/>` +
    `<ellipse cx="38" cy="16" rx="4.5" ry="11" fill="${D}" transform="rotate(-8 38 16)"/>` +
    unite(
      `<ellipse cx="54" cy="64" rx="18" ry="24" fill="${C}"/>`,
      `<path d="M40 52L36 30L52 30L56 50Z" fill="${C}"/>`,
      `<ellipse cx="38" cy="28" rx="14" ry="11" fill="${C}"/>`,
      `<ellipse cx="25" cy="33" rx="10" ry="7" fill="${C}" transform="rotate(15 25 33)"/>`,
    ) +
    `<ellipse cx="46" cy="16" rx="4.5" ry="11" fill="${C}" transform="rotate(10 46 16)"/>` +
    `<ellipse cx="46" cy="17" rx="2" ry="7" fill="${L}" ${N} transform="rotate(10 46 17)"/>` +
    `<ellipse cx="50" cy="70" rx="12" ry="15" fill="${L}" ${N}/>` +
    `<ellipse cx="62" cy="68" rx="9" ry="13" fill="${D}" opacity=".5" ${N}/>` +
    `<path d="M40 64Q50 72 62 64" fill="none" stroke-width="2.4"/>` +
    `<circle cx="50" cy="60" r="6.5" fill="${C}"/><ellipse cx="45" cy="55" rx="2" ry="4" fill="${C}" stroke-width="2"/><ellipse cx="55" cy="55" rx="2" ry="4" fill="${C}" stroke-width="2"/>` +
    `<circle cx="47.5" cy="60" r="1.3" fill="${S}" ${N}/><circle cx="52.5" cy="60" r="1.3" fill="${S}" ${N}/>` +
    `<path d="M40 64Q50 72 62 64Z" fill="${C}" stroke-width="2.4"/>` +
    `<ellipse cx="38" cy="50" rx="4" ry="7" fill="${C}" transform="rotate(35 38 50)"/>` +
    `<ellipse cx="48" cy="90" rx="15" ry="4.8" fill="${C}"/>` +
    `<ellipse cx="16" cy="34" rx="2" ry="1.6" fill="${S}" ${N}/>` +
    eye(35, 25, 3.4) + cheek(32, 33) + line('M18 38Q22 41 27 38', 2.2)
  )
}

const camel = () => {
  const C = '#d9a865', D = shade('#d9a865'), L = '#f0d3a2'
  return wrap(
    tube('M88 50Q94 56 92 66', C, 3) + `<ellipse cx="92" cy="68" rx="2.6" ry="4.5" fill="#8a6440"/>` +
    hoofLeg(46, 60, 31, D, '#8a6440', 7) + hoofLeg(78, 60, 31, D, '#8a6440', 7) +
    unite(
      `<path d="M30 58Q28 44 40 42Q46 22 56 34Q60 38 62 36Q72 22 82 40Q92 46 90 58Q88 66 76 66H40Q32 66 30 58Z" fill="${C}"/>`,
      `<path d="M38 56Q28 50 24 34L14 34Q16 58 32 64Z" fill="${C}"/>`,
      `<ellipse cx="17" cy="28" rx="11" ry="8" fill="${C}"/>`,
      `<ellipse cx="8" cy="31" rx="6" ry="5" fill="${C}"/>`,
    ) +
    `<ellipse cx="22" cy="20" rx="2.6" ry="4" fill="${C}" transform="rotate(20 22 20)"/>` +
    `<path d="M44 38Q48 30 52 30M66 32Q72 28 76 32" fill="none" stroke="#fff" stroke-width="3" opacity=".45"/>` +
    `<path d="M44 66Q56 70 70 66" fill="none" stroke="${L}" stroke-width="3"/>` +
    hoofLeg(38, 62, 29, C, '#8a6440', 7) + hoofLeg(70, 62, 29, C, '#8a6440', 7) +
    `<ellipse cx="4.5" cy="30" rx="1.6" ry="1.2" fill="${S}" ${N}/>` +
    eye(17, 25, 3.2) + cheek(15, 33) + line('M4 35Q7 37 11 35', 2)
  )
}

export const ART: Record<string, string> = {
  giraffe: giraffe(),
  horse: horse(),
  cow: cow(),
  sheep: sheep(),
  duck: duck(),
  snail: snail(),
  bee: bee(),
  snake: snake(),
  crab: crab(),
  parrot: parrot(),
  mouse: mouse(),
  hedgehog: hedgehog(),
  kangaroo: kangaroo(),
  camel: camel(),
}
