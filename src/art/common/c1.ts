/* Common drawings, batch 1: one per emoji the lessons use (viewBox 0 0 100 100). */

const S = '#2b2b3a'
const N = 'stroke="none"'
const RED = '#e5383b', BLUE = '#1d70d8', YEL = '#ffc83d', GRN = '#2e9a48', ORG = '#f77f00'
const PUR = '#8b5cf6', PNK = '#ff8fab', BRN = '#8d5524', BLK = '#2f2f3a', GRY = '#9aa0a6'

/** Shared outline style (children inherit the stroke). */
const wrap = (s: string) =>
  `<g stroke="${S}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round">${s}</g>`
const r1 = (n: number) => Math.round(n * 10) / 10
const rad = (deg: number) => (deg * Math.PI) / 180

const eye = (x: number, y: number, r = 4) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r1(r * 1.15)}" fill="${S}" ${N}/>` +
  `<circle cx="${r1(x + r * 0.35)}" cy="${r1(y - r * 0.45)}" r="${r1(r * 0.4)}" fill="#fff" ${N}/>`
const eyes = (cx: number, y: number, dx: number, r = 4) => eye(cx - dx, y, r) + eye(cx + dx, y, r)
const cheeks = (cx: number, y: number, dx: number, c = '#ff6b8b') =>
  `<ellipse cx="${cx - dx}" cy="${y}" rx="4.2" ry="2.6" fill="${c}" opacity=".45" ${N}/>` +
  `<ellipse cx="${cx + dx}" cy="${y}" rx="4.2" ry="2.6" fill="${c}" opacity=".45" ${N}/>`
const smile = (cx: number, y: number, w: number) =>
  `<path d="M${cx - w} ${y}Q${cx} ${r1(y + w * 0.9)} ${cx + w} ${y}" fill="none" stroke-width="2.5"/>`
const shine = (cx: number, cy: number, rx: number, ry: number, rot = 0) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".4" transform="rotate(${rot} ${cx} ${cy})" ${N}/>`
/** Thick outlined tube (legs, tails, frames). */
const tube = (d: string, c: string, w = 7) =>
  `<path d="${d}" fill="none" stroke-width="${w + 5.6}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Shapes that share one outline (outlines first, fills on top). */
const unite = (...els: string[]) =>
  els.map((e) => e.replace('/>', ' stroke-width="5.6"/>')).join('') + els.map((e) => e.replace('/>', ` ${N}/>`)).join('')
/** Scalloped ring (mane, wool, cloud). */
const scallop = (cx: number, cy: number, R: number, n: number, c: string, ry = R) => {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    return [r1(cx + R * Math.cos(a)), r1(cy + ry * Math.sin(a))]
  })
  const ar = r1(Math.max(R, ry) * Math.sin(Math.PI / n) * 1.15)
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i <= n; i++) d += `A${ar} ${ar} 0 0 1 ${pts[i % n][0]} ${pts[i % n][1]}`
  return `<path d="${d}Z" fill="${c}"/>`
}

/* ---------- long-faced heads: zebra, horse, donkey ---------- */
const longHead = (o: { c: string; muzzle: string; ear: string; earLen: number; top: string; marks: string }) => {
  const e = o.earLen
  return wrap(
    `<ellipse cx="35" cy="${24 - e / 3}" rx="7" ry="${e}" fill="${o.c}" transform="rotate(-22 35 ${24 - e / 3})"/>` +
    `<ellipse cx="65" cy="${24 - e / 3}" rx="7" ry="${e}" fill="${o.c}" transform="rotate(22 65 ${24 - e / 3})"/>` +
    `<ellipse cx="35" cy="${26 - e / 3}" rx="3" ry="${e * 0.6}" fill="${o.ear}" transform="rotate(-22 35 ${24 - e / 3})" ${N}/>` +
    `<ellipse cx="65" cy="${26 - e / 3}" rx="3" ry="${e * 0.6}" fill="${o.ear}" transform="rotate(22 65 ${24 - e / 3})" ${N}/>` +
    unite(`<ellipse cx="50" cy="46" rx="21" ry="28" fill="${o.c}"/>`, `<ellipse cx="50" cy="75" rx="18" ry="15" fill="${o.c}"/>`) +
    o.marks +
    `<ellipse cx="50" cy="76" rx="17" ry="13.5" fill="${o.muzzle}"/>` +
    `<ellipse cx="43" cy="77" rx="2.6" ry="3.6" fill="${S}" ${N}/><ellipse cx="57" cy="77" rx="2.6" ry="3.6" fill="${S}" ${N}/>` +
    `<path d="M44 85Q50 89 56 85" fill="none" stroke-width="2.3"/>` +
    o.top + eyes(50, 46, 11, 4)
  )
}

const zebra = () => {
  const K = BLK
  const st = (d: string) => `<path d="${d}" fill="none" stroke="${K}" stroke-width="4.2"/>`
  return longHead({
    c: '#fff', muzzle: '#4a4a5a', ear: '#4a4a5a', earLen: 11,
    marks: st('M42 25Q50 30 58 25') + st('M38 33Q50 40 62 33') + st('M31 38Q36 40 37 36') + st('M69 38Q64 40 63 36') +
      st('M30 51Q37 53 40 56') + st('M70 51Q63 53 60 56') + st('M31 61Q38 61 41 65') + st('M69 61Q62 61 59 65'),
    top: `<path d="M41 24L42 10L46 17L50 6L54 17L58 10L59 24Q50 20 41 24Z" fill="${K}"/>`,
  })
}
const horse = () =>
  longHead({
    c: BRN, muzzle: '#c08552', ear: '#5a3418', earLen: 11,
    marks: `<path d="M47 28Q50 24 53 28L52.5 62Q50 65 47.5 62Z" fill="#fff" ${N}/>`,
    top: `<path d="M38 26Q42 8 52 12Q62 10 62 24Q56 22 54 32Q50 24 46 32Q44 24 38 26Z" fill="#3d2414"/>`,
  })
const donkey = () =>
  longHead({
    c: GRY, muzzle: '#e3e5e8', ear: PNK, earLen: 19,
    marks: `<ellipse cx="50" cy="40" rx="9" ry="11" fill="#b4b9be" ${N}/>`,
    top: `<path d="M44 22L46 14L50 19L54 14L56 22Q50 25 44 22Z" fill="#4a4a5a"/>`,
  })

/* ---------- single drawings ---------- */
const elephant = () =>
  wrap(
    `<path d="M88 50Q94 56 92 64" fill="none"/>` +
    `<rect x="36" y="60" width="12" height="28" rx="5" fill="#8a9097"/><rect x="66" y="60" width="12" height="28" rx="5" fill="#8a9097"/>` +
    `<rect x="46" y="62" width="12" height="28" rx="5" fill="${GRY}"/><rect x="76" y="62" width="12" height="28" rx="5" fill="${GRY}"/>` +
    `<ellipse cx="60" cy="52" rx="30" ry="22" fill="${GRY}"/>` +
    tube('M18 50Q8 66 14 80Q18 86 22 82', GRY, 9) +
    `<circle cx="28" cy="40" r="18" fill="${GRY}"/>` +
    `<path d="M24 52Q22 62 30 64Q28 58 30 52Z" fill="#fff" stroke-width="2.2"/>` +
    `<ellipse cx="42" cy="42" rx="12" ry="16" fill="#b9bec4"/><ellipse cx="42" cy="43" rx="6.5" ry="10" fill="#f4b4c6" ${N}/>` +
    shine(66, 40, 10, 4, -10) + eye(23, 36, 3.6) + cheeks(28, 46, 0)
  )

const banana = () =>
  wrap(
    `<path d="M24 22C18 62 46 88 86 82L88 74C58 72 38 54 36 22Z" fill="${YEL}"/>` +
    `<path d="M30 32C30 58 50 76 78 78" fill="none" stroke="#e0a400" stroke-width="2.4"/>` +
    `<path d="M24 22L25 10L34 10L36 22Z" fill="${BRN}"/>` +
    `<path d="M86 82L92 78L88 74Z" fill="#5a3418"/>` +
    shine(26, 44, 2.5, 9, -8)
  )

const giraffe = () => {
  const Y = YEL, B = '#c8661a'
  return wrap(
    `<path d="M40 64L36 98H64L60 64Z" fill="${Y}"/>` +
    `<ellipse cx="44" cy="80" rx="4" ry="5" fill="${B}" ${N}/><ellipse cx="56" cy="90" rx="4" ry="4" fill="${B}" ${N}/>` +
    `<path d="M42 26V12M58 26V12" fill="none" stroke-width="5"/><path d="M42 26V12M58 26V12" fill="none" stroke="${Y}" stroke-width="2"/>` +
    `<circle cx="42" cy="11" r="4.5" fill="${B}"/><circle cx="58" cy="11" r="4.5" fill="${B}"/>` +
    `<ellipse cx="24" cy="34" rx="10" ry="5" fill="${Y}" transform="rotate(20 24 34)"/>` +
    `<ellipse cx="76" cy="34" rx="10" ry="5" fill="${Y}" transform="rotate(-20 76 34)"/>` +
    `<ellipse cx="50" cy="44" rx="21" ry="24" fill="${Y}"/>` +
    `<ellipse cx="36" cy="32" rx="4" ry="3" fill="${B}" ${N}/><ellipse cx="64" cy="30" rx="3.5" ry="3" fill="${B}" ${N}/><ellipse cx="50" cy="27" rx="3" ry="2.5" fill="${B}" ${N}/>` +
    `<ellipse cx="50" cy="58" rx="15" ry="11" fill="#ffe3a0"/>` +
    `<ellipse cx="45" cy="57" rx="1.8" ry="2.6" fill="${S}" ${N}/><ellipse cx="55" cy="57" rx="1.8" ry="2.6" fill="${S}" ${N}/>` +
    smile(50, 62, 5) + eyes(50, 42, 10, 3.8) + cheeks(50, 50, 16)
  )
}

const turtle = () => {
  const L = '#8fd18a'
  return wrap(
    `<path d="M10 64L4 66L10 68Z" fill="${L}"/>` +
    `<ellipse cx="24" cy="76" rx="8" ry="10" fill="${L}"/><ellipse cx="62" cy="76" rx="8" ry="10" fill="${L}"/>` +
    `<path d="M68 52Q76 40 84 40" fill="none" stroke-width="16"/><path d="M68 52Q76 40 84 40" fill="none" stroke="${L}" stroke-width="10.4"/>` +
    `<circle cx="85" cy="40" r="11" fill="${L}"/>` + eye(88, 37, 3.2) + `<path d="M86 45Q91 47 94 43" fill="none" stroke-width="2.2"/>` +
    `<path d="M10 66Q10 24 44 24Q76 24 78 66Z" fill="${GRN}"/>` +
    `<path d="M34 34L46 30L56 36L54 50L40 52L32 44Z" fill="#5cba5c" stroke-width="2.2"/>` +
    `<path d="M18 52L26 44M64 44L72 54M28 62L32 52M54 52L58 62" fill="none" stroke-width="2.2"/>` +
    `<rect x="6" y="62" width="76" height="9" rx="4.5" fill="#217a38"/>` +
    shine(30, 32, 7, 3, -25)
  )
}

const moon = () =>
  wrap(
    `<path d="M58 8A42 42 0 1 0 92 70A34 34 0 1 1 58 8Z" fill="${YEL}"/>` +
    `<circle cx="30" cy="52" r="5" fill="#f0b020" ${N}/><circle cx="42" cy="76" r="3.5" fill="#f0b020" ${N}/><circle cx="36" cy="30" r="3" fill="#f0b020" ${N}/>` +
    shine(22, 40, 3, 9, 15)
  )

const kangaroo = () => {
  const K = '#c27c3e', L = '#ecc596'
  return wrap(
    tube('M36 74Q20 88 6 92', K, 9) +
    `<ellipse cx="56" cy="90" rx="17" ry="4.5" fill="${K}"/>` +
    `<ellipse cx="48" cy="60" rx="19" ry="25" fill="${K}" transform="rotate(-18 48 60)"/>` +
    `<path d="M52 60Q62 58 62 72Q56 80 46 74" fill="${L}"/>` +
    `<path d="M58 44Q68 48 70 54M56 50Q64 56 64 60" fill="none" stroke-width="5"/><path d="M58 44Q68 48 70 54M56 50Q64 56 64 60" fill="none" stroke="${K}" stroke-width="2.4"/>` +
    `<ellipse cx="58" cy="10" rx="4.5" ry="10" fill="${K}" transform="rotate(-18 58 10)"/>` +
    `<ellipse cx="66" cy="11" rx="4.5" ry="10" fill="${K}" transform="rotate(10 66 11)"/>` +
    `<path d="M50 26Q52 14 64 16Q78 18 84 26Q86 32 78 33Q66 36 58 38Q50 36 50 26Z" fill="${K}"/>` +
    `<circle cx="83" cy="27" r="2.4" fill="${S}" ${N}/>` + eye(66, 24, 3)
  )
}

const alarmClock = () =>
  wrap(
    `<path d="M26 82L20 92M74 82L80 92" fill="none" stroke-width="6"/>` +
    `<path d="M14 30A14 14 0 0 1 36 14Z" fill="${RED}"/><path d="M86 30A14 14 0 0 0 64 14Z" fill="${RED}"/>` +
    `<path d="M50 20V12M44 11H56" fill="none" stroke-width="4"/>` +
    `<circle cx="50" cy="54" r="34" fill="${RED}"/><circle cx="50" cy="54" r="26" fill="#fff"/>` +
    `<path d="M50 32V37M50 71V76M28 54H33M67 54H72" fill="none" stroke-width="3"/>` +
    `<path d="M50 54V39M50 54L62 60" fill="none" stroke-width="4"/><circle cx="50" cy="54" r="3" fill="${S}"/>` +
    shine(30, 34, 6, 3, -40)
  )

const locomotive = () => {
  const D = '#4a4a5a'
  return wrap(
    `<circle cx="30" cy="9" r="6" fill="#e6e8ea"/><circle cx="20" cy="13" r="4.5" fill="#e6e8ea"/>` +
    `<path d="M20 40L18 20H32L30 40Z" fill="${D}"/><rect x="16" y="17" width="18" height="5" rx="2" fill="${RED}"/>` +
    `<rect x="10" y="38" width="54" height="30" rx="6" fill="${D}"/>` +
    `<path d="M10 46H64M10 58H64" fill="none" stroke="${RED}" stroke-width="3"/>` +
    `<circle cx="44" cy="36" r="5" fill="${YEL}"/>` +
    `<rect x="60" y="26" width="30" height="44" rx="3" fill="${RED}"/><rect x="56" y="20" width="38" height="8" rx="3" fill="${D}"/>` +
    `<rect x="67" y="33" width="16" height="14" rx="2" fill="#bfe3ff"/>` +
    `<path d="M10 62L3 82H18Z" fill="${RED}"/>` +
    `<rect x="6" y="66" width="86" height="8" rx="3" fill="${D}"/>` +
    `<circle cx="26" cy="80" r="9" fill="${RED}"/><circle cx="46" cy="80" r="9" fill="${RED}"/><circle cx="74" cy="76" r="14" fill="${RED}"/>` +
    `<circle cx="26" cy="80" r="3" fill="${S}"/><circle cx="46" cy="80" r="3" fill="${S}"/><circle cx="74" cy="76" r="4" fill="${S}"/>` +
    `<path d="M26 80H74" fill="none" stroke-width="3.5"/>`
  )
}

const snowflake = () => {
  let d = ''
  for (let i = 0; i < 6; i++) {
    const a = rad(i * 60 - 90)
    d += `M50 50L${r1(50 + 42 * Math.cos(a))} ${r1(50 + 42 * Math.sin(a))}`
    for (const [at, len] of [[24, 12], [36, 7]]) {
      const bx = r1(50 + at * Math.cos(a)), by = r1(50 + at * Math.sin(a))
      for (const s of [-1, 1]) {
        const b = a + s * rad(45)
        d += `M${bx} ${by}L${r1(bx + len * Math.cos(b))} ${r1(by + len * Math.sin(b))}`
      }
    }
  }
  return wrap(tube(d, '#8fd3f4', 5) + `<circle cx="50" cy="50" r="8" fill="#d6f0fc"/>`)
}

const cap = () =>
  wrap(
    `<path d="M40 66Q14 64 6 76Q24 82 52 74Z" fill="#165cb3"/>` +
    `<path d="M28 68Q24 26 58 24Q88 24 90 68Z" fill="${BLUE}"/>` +
    `<path d="M58 25Q48 44 50 68M58 25Q74 44 76 68" fill="none" stroke="#5c9ae8" stroke-width="2.4"/>` +
    `<path d="M27 62Q58 58 91 64L90 70Q58 66 28 70Z" fill="#165cb3"/>` +
    `<circle cx="58" cy="23" r="4.5" fill="${BLUE}"/>` + shine(40, 38, 4, 8, 30)
  )

const pencil = () =>
  wrap(
    `<g transform="rotate(-45 50 50)">` +
    `<path d="M4 50L24 39V61Z" fill="#f2c99a"/><path d="M4 50L11 46V54Z" fill="${BLK}"/>` +
    `<rect x="24" y="39" width="54" height="22" fill="${YEL}"/>` +
    `<path d="M24 46.3H78M24 53.7H78" fill="none" stroke="#e0a400" stroke-width="2"/>` +
    `<rect x="78" y="38" width="8" height="24" fill="${GRY}"/>` +
    `<path d="M86 38H92Q97 38 97 43V57Q97 62 92 62H86Z" fill="${PNK}"/></g>`
  )

const soccer = () => {
  const pent = (cx: number, cy: number, r: number, rot: number) =>
    'M' + [0, 1, 2, 3, 4].map((i) => { const a = rad(rot + i * 72); return `${r1(cx + r * Math.cos(a))} ${r1(cy + r * Math.sin(a))}` }).join('L') + 'Z'
  let lines = '', outer = ''
  for (let i = 0; i < 5; i++) {
    const a = rad(-90 + i * 72)
    lines += `M${r1(50 + 12 * Math.cos(a))} ${r1(50 + 12 * Math.sin(a))}L${r1(50 + 24 * Math.cos(a))} ${r1(50 + 24 * Math.sin(a))}`
    outer += pent(r1(50 + 33 * Math.cos(a)), r1(50 + 33 * Math.sin(a)), 8, -90 + i * 72 + 180)
  }
  return wrap(
    `<circle cx="50" cy="50" r="42" fill="#fff"/>` +
    `<path d="${lines}" fill="none" stroke-width="2.4"/>` +
    `<path d="${pent(50, 50, 13, -90)}${outer}" fill="${BLK}" stroke-width="2"/>` +
    `<circle cx="50" cy="50" r="42" fill="none"/>`
  )
}

const key = () =>
  wrap(
    `<g transform="rotate(45 50 50)">` +
    `<path d="M70 55V67H78V55M82 55V71H90V55" fill="${YEL}"/>` +
    `<rect x="34" y="44" width="58" height="12" rx="3" fill="${YEL}"/>` +
    `<circle cx="22" cy="50" r="17" fill="${YEL}"/><circle cx="18" cy="50" r="6" fill="#fff8e0"/>` +
    `<path d="M14 40Q22 36 30 40" fill="none" stroke="#fff" stroke-width="2.4" opacity=".6"/></g>`
  )

const spider = () => {
  let legs = ''
  for (const s of [-1, 1])
    for (const [y, kx, ky, ex, ey] of [[38, 24, 18, 8, 26], [44, 22, 34, 4, 44], [50, 24, 54, 6, 66], [56, 28, 70, 14, 86]])
      legs += `M${50 + s * 6} ${y}L${50 + s * (50 - kx)} ${ky}L${50 + s * (50 - ex)} ${ey}`
  return wrap(
    `<path d="${legs}" fill="none" stroke-width="5"/>` +
    `<ellipse cx="50" cy="64" rx="19" ry="21" fill="${BLK}"/>` +
    `<path d="M50 52L44 60L50 68L56 60Z" fill="${RED}" ${N}/>` +
    `<circle cx="50" cy="38" r="13" fill="#4a4a5a"/>` +
    `<circle cx="45" cy="36" r="4.5" fill="#fff" ${N}/><circle cx="55" cy="36" r="4.5" fill="#fff" ${N}/>` +
    eyes(50, 37, 5, 2.4)
  )
}

const frog = () => {
  const L = '#a6e39a'
  return wrap(
    `<circle cx="29" cy="30" r="15" fill="${GRN}"/><circle cx="71" cy="30" r="15" fill="${GRN}"/>` +
    `<ellipse cx="50" cy="60" rx="42" ry="30" fill="${GRN}"/>` +
    `<path d="M16 42Q50 32 84 42" fill="none" stroke="${GRN}" stroke-width="10"/>` +
    `<ellipse cx="50" cy="74" rx="26" ry="13" fill="${L}" ${N}/>` +
    `<circle cx="29" cy="29" r="9.5" fill="#fff" stroke-width="2.2"/><circle cx="71" cy="29" r="9.5" fill="#fff" stroke-width="2.2"/>` +
    eyes(50, 30, 21, 5) +
    `<circle cx="45" cy="50" r="1.6" fill="${S}" ${N}/><circle cx="55" cy="50" r="1.6" fill="${S}" ${N}/>` +
    `<path d="M24 58Q50 78 76 58" fill="none" stroke-width="3"/>` + cheeks(50, 60, 31)
  )
}

const butterfly = () => {
  const L = '#7fb4f0', D = '#0f4fa0'
  return wrap(
    `<ellipse cx="30" cy="34" rx="20" ry="24" fill="${BLUE}" transform="rotate(-30 30 34)"/>` +
    `<ellipse cx="70" cy="34" rx="20" ry="24" fill="${BLUE}" transform="rotate(30 70 34)"/>` +
    `<ellipse cx="33" cy="70" rx="14" ry="17" fill="${D}" transform="rotate(30 33 70)"/>` +
    `<ellipse cx="67" cy="70" rx="14" ry="17" fill="${D}" transform="rotate(-30 67 70)"/>` +
    `<circle cx="27" cy="30" r="7" fill="${L}" ${N}/><circle cx="73" cy="30" r="7" fill="${L}" ${N}/>` +
    `<circle cx="33" cy="70" r="5" fill="${L}" ${N}/><circle cx="67" cy="70" r="5" fill="${L}" ${N}/>` +
    `<path d="M48 26Q42 12 34 10M52 26Q58 12 66 10" fill="none" stroke-width="2.4"/>` +
    `<circle cx="34" cy="10" r="2.8" fill="${S}"/><circle cx="66" cy="10" r="2.8" fill="${S}"/>` +
    `<ellipse cx="50" cy="54" rx="6" ry="28" fill="${BLK}"/>`
  )
}

const milk = () =>
  wrap(
    `<path d="M24 10H76L70 92H30Z" fill="#e6f3fb"/>` +
    `<path d="M26.5 28H73.5L70 92H30Z" fill="#fff"/>` +
    `<path d="M26.5 28Q38 34 50 28Q62 22 73.5 28" fill="none" stroke-width="2.2"/>` +
    `<path d="M24 10H76L70 92H30Z" fill="none"/>` +
    `<path d="M32 36L35 84" fill="none" stroke="#d4e6f2" stroke-width="4"/>` +
    `<ellipse cx="50" cy="10" rx="26" ry="3" fill="#e6f3fb"/>`
  )

const candle = () =>
  wrap(
    `<ellipse cx="50" cy="90" rx="30" ry="6" fill="${ORG}"/>` +
    `<path d="M34 36H66V86Q50 92 34 86Z" fill="#fbf3dc"/>` +
    `<path d="M34 36H66V44Q62 50 58 44Q56 54 52 46Q48 52 44 44Q40 56 36 44L34 44Z" fill="#fff" ${N}/>` +
    `<ellipse cx="50" cy="36" rx="16" ry="4" fill="#fffaf0"/>` +
    `<path d="M50 36V26" fill="none" stroke-width="2.4"/>` +
    `<path d="M50 4Q62 18 58 25Q54 31 50 31Q44 30 42 24Q40 16 50 4Z" fill="${ORG}"/>` +
    `<path d="M50 14Q55 21 53 25Q50 28 47 25Q46 20 50 14Z" fill="${YEL}" ${N}/>` +
    `<path d="M40 56V74" fill="none" stroke="#e8dcbc" stroke-width="3"/>`
  )

const balloon = () =>
  wrap(
    `<path d="M50 74Q42 82 50 88Q58 94 50 99" fill="none" stroke-width="2.2"/>` +
    `<path d="M50 70L44 78H56Z" fill="${RED}"/>` +
    `<ellipse cx="50" cy="40" rx="29" ry="33" fill="${RED}"/>` + shine(37, 26, 5, 10, 25)
  )

const cactus = () => {
  const G = GRN
  return wrap(
    `<ellipse cx="50" cy="92" rx="32" ry="5" fill="#e8c98a"/>` +
    `<path d="M38 62H24Q14 62 14 50V34Q14 28 20 28Q26 28 26 34V48H38Z" fill="${G}"/>` +
    `<path d="M62 52H76Q86 52 86 40V26Q86 20 80 20Q74 20 74 26V40H62Z" fill="${G}"/>` +
    `<path d="M36 92V24Q36 10 50 10Q64 10 64 24V92Z" fill="${G}"/>` +
    `<path d="M44 22V84M56 22V84" fill="none" stroke="#217a38" stroke-width="2.4"/>` +
    `<path d="M38 34l-4-2M38 54l-4-2M62 30l4-2M62 66l4-2M50 40v0M20 40l-4 0M80 32l4 0M40 74l-4 2" fill="none" stroke-width="2"/>` +
    `<circle cx="50" cy="10" r="5" fill="${PNK}"/>`
  )
}

const owl = () => {
  const B = BRN, L = '#d9a066'
  return wrap(
    `<path d="M26 26L20 8L38 20ZM74 26L80 8L62 20Z" fill="${B}"/>` +
    `<ellipse cx="50" cy="56" rx="32" ry="36" fill="${B}"/>` +
    `<ellipse cx="20" cy="62" rx="7" ry="20" fill="#6b3f1a" transform="rotate(10 20 62)"/>` +
    `<ellipse cx="80" cy="62" rx="7" ry="20" fill="#6b3f1a" transform="rotate(-10 80 62)"/>` +
    `<ellipse cx="50" cy="70" rx="18" ry="20" fill="${L}" ${N}/>` +
    `<path d="M42 64l4 3 4-3 4 3 4-3M40 74l4 3 4-3 4 3 4-3 4 3M44 84l3 3 3-3 3 3 3-3" fill="none" stroke="${B}" stroke-width="2"/>` +
    `<circle cx="36" cy="40" r="14" fill="#f3dcb8"/><circle cx="64" cy="40" r="14" fill="#f3dcb8"/>` +
    `<circle cx="36" cy="40" r="8" fill="#fff" stroke-width="2"/><circle cx="64" cy="40" r="8" fill="#fff" stroke-width="2"/>` +
    eyes(50, 40, 14, 4.5) +
    `<path d="M45 48L55 48L50 57Z" fill="${ORG}"/>` +
    `<path d="M38 92v-4M44 92v-4M56 92v-4M62 92v-4" fill="none" stroke="${ORG}" stroke-width="3.5"/>`
  )
}

const lion = () => {
  const F = '#fcb045'
  return wrap(
    scallop(50, 50, 40, 14, ORG) +
    `<circle cx="29" cy="28" r="8" fill="${F}"/><circle cx="71" cy="28" r="8" fill="${F}"/>` +
    `<circle cx="29" cy="28" r="3.5" fill="#c8661a" ${N}/><circle cx="71" cy="28" r="3.5" fill="#c8661a" ${N}/>` +
    `<circle cx="50" cy="52" r="27" fill="${F}"/>` +
    `<ellipse cx="44" cy="64" rx="8" ry="6" fill="#fff1d0" ${N}/><ellipse cx="56" cy="64" rx="8" ry="6" fill="#fff1d0" ${N}/>` +
    eyes(50, 47, 11, 4) + cheeks(50, 58, 18) +
    `<path d="M44 57H56L50 63Z" fill="#7a4b2f" stroke-width="2"/>` +
    `<path d="M50 63V67M43 67Q46.5 71 50 67Q53.5 71 57 67" fill="none" stroke-width="2.3"/>`
  )
}

const rainCloud = () => {
  const drop = (x: number, y: number) => `<path d="M${x} ${y}Q${x + 6} ${y + 9} ${x} ${y + 12}Q${x - 6} ${y + 9} ${x} ${y}Z" fill="${BLUE}"/>`
  return wrap(
    drop(28, 68) + drop(50, 76) + drop(72, 68) + drop(38, 84) + drop(62, 84) +
    unite(
      `<circle cx="30" cy="42" r="16"/>`, `<circle cx="52" cy="32" r="21"/>`, `<circle cx="72" cy="44" r="15"/>`,
      `<rect x="14" y="40" width="74" height="22" rx="11"/>`
    ).replace(/<(circle|rect)/g, `<$1 fill="#b8bfc6"`) +
    shine(46, 26, 8, 4, -10)
  )
}

const bicycle = () => {
  const wheel = (x: number) =>
    `<circle cx="${x}" cy="66" r="19" fill="none" stroke-width="8.5"/><circle cx="${x}" cy="66" r="19" fill="none" stroke="${GRY}" stroke-width="3"/>` +
    `<path d="M${x - 13} 66H${x + 13}M${x} 53V79" fill="none" stroke-width="1.5"/><circle cx="${x}" cy="66" r="3.5" fill="${GRY}"/>`
  return wrap(
    wheel(22) + wheel(78) +
    tube('M22 66L48 66L42 38L22 66M42 38H70L48 66M70 38L78 66M70 38L67 28', BLUE, 4.5) +
    `<path d="M60 26H74" fill="none" stroke-width="5"/>` +
    `<path d="M33 34Q42 30 50 34Q42 37 33 34Z" fill="${BLK}"/>` +
    `<circle cx="48" cy="66" r="5" fill="${GRY}"/>`
  )
}

const bee = () => {
  const cx = 56, cy = 58, rx = 28, ry = 21
  const yAt = (x: number) => ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2))
  const band = (x1: number, x2: number) =>
    `<path d="M${x1} ${r1(cy - yAt(x1))}L${x2} ${r1(cy - yAt(x2))}L${x2} ${r1(cy + yAt(x2))}L${x1} ${r1(cy + yAt(x1))}Z" fill="${BLK}" ${N}/>`
  return wrap(
    `<path d="M84 58L94 58L86 62Z" fill="${BLK}"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${YEL}"/>` +
    band(46, 54) + band(62, 70) + band(76, 81) +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none"/>` +
    `<ellipse cx="50" cy="30" rx="10" ry="15" fill="#d6f0fc" opacity=".9" transform="rotate(-20 50 30)"/>` +
    `<ellipse cx="66" cy="32" rx="9" ry="13" fill="#d6f0fc" opacity=".9" transform="rotate(20 66 32)"/>` +
    `<path d="M22 44Q18 30 12 28M28 44Q30 30 36 26" fill="none" stroke-width="2.4"/>` +
    `<circle cx="12" cy="28" r="2.8" fill="${S}"/><circle cx="36" cy="26" r="2.8" fill="${S}"/>` +
    `<circle cx="26" cy="58" r="15" fill="${BLK}"/>` +
    `<circle cx="21" cy="55" r="4.6" fill="#fff" ${N}/><circle cx="31" cy="55" r="4.6" fill="#fff" ${N}/>` +
    eyes(26, 56, 5, 2.4) + `<path d="M21 64Q26 68 31 64" fill="none" stroke="#fff" stroke-width="2.2"/>`
  )
}

const egg = () =>
  wrap(
    `<path d="M50 8C72 8 84 46 84 62C84 82 70 94 50 94C30 94 16 82 16 62C16 46 28 8 50 8Z" fill="#fbf1de"/>` +
    `<path d="M70 50Q76 66 70 80" fill="none" stroke="#eadbbd" stroke-width="5"/>` + shine(36, 32, 6, 11, 25)
  )

const shark = () => {
  const G = '#6f8fa8'
  return wrap(
    `<path d="M44 38L56 10L66 40Z" fill="${G}"/>` +
    `<path d="M80 50L96 24L90 54L96 82L78 60Z" fill="${G}"/>` +
    `<path d="M4 54Q16 34 48 34Q72 34 84 50Q72 70 40 70Q14 70 4 54Z" fill="${G}"/>` +
    `<path d="M10 60Q26 70 44 70Q66 70 78 60Q60 58 40 60Q22 62 10 60Z" fill="#fff" ${N}/>` +
    `<path d="M4 54Q16 34 48 34Q72 34 84 50Q72 70 40 70Q14 70 4 54Z" fill="none"/>` +
    `<path d="M42 66L34 86L56 68Z" fill="${G}"/>` +
    `<path d="M36 48V56M41 47V57M46 48V56" fill="none" stroke-width="2"/>` +
    `<path d="M10 58Q16 62 24 60" fill="none" stroke-width="2.4"/>` + eye(20, 47, 3.4)
  )
}

const camel = () => {
  const C = '#c98b4a'
  return wrap(
    `<path d="M84 50Q90 58 88 66" fill="none"/>` +
    `<rect x="38" y="56" width="7" height="36" rx="3" fill="#a96d34"/><rect x="66" y="56" width="7" height="36" rx="3" fill="#a96d34"/>` +
    `<rect x="46" y="58" width="7" height="34" rx="3" fill="${C}"/><rect x="74" y="58" width="7" height="34" rx="3" fill="${C}"/>` +
    tube('M40 52Q24 48 22 26', C, 10) +
    unite(`<ellipse cx="60" cy="54" rx="26" ry="14" fill="${C}"/>`, `<path d="M38 52Q52 14 76 50Z" fill="${C}"/>`) +
    `<ellipse cx="17" cy="25" rx="12" ry="8" fill="${C}"/>` +
    `<ellipse cx="25" cy="17" rx="3" ry="4.5" fill="${C}"/>` +
    eye(17, 22, 2.8) + `<path d="M6 28Q9 30 12 29" fill="none" stroke-width="2"/>` + shine(54, 34, 6, 3, -40)
  )
}

const socks = () => {
  const sock = (x: number, y: number, c: string, d: string) =>
    `<g transform="translate(${x} ${y})">` +
    `<path d="M4 0H28V48Q28 54 34 57L46 63Q54 68 50 76Q46 84 36 80L10 68Q2 64 4 56Z" fill="${c}"/>` +
    `<path d="M38 60L46 63Q54 68 50 76Q46 84 36 80L32 78Q41 70 38 60Z" fill="${d}" ${N}/>` +
    `<rect x="4" y="0" width="24" height="10" fill="#fff"/>` +
    `<rect x="4" y="20" width="24" height="6" fill="#fff" ${N}/><rect x="4" y="34" width="24" height="6" fill="#fff" ${N}/>` +
    `<path d="M4 0H28V48Q28 54 34 57L46 63Q54 68 50 76Q46 84 36 80L10 68Q2 64 4 56Z" fill="none"/></g>`
  return wrap(sock(40, 4, '#c42b30', '#8f1d22') + sock(12, 12, RED, '#b3242a'))
}

const bed = () =>
  wrap(
    `<rect x="12" y="80" width="6" height="10" fill="#6b3f1a"/><rect x="84" y="80" width="6" height="10" fill="#6b3f1a"/>` +
    `<path d="M6 86V30Q6 20 15 20Q24 20 24 30V86Z" fill="${BRN}"/>` +
    `<path d="M82 86V52Q82 46 88 46Q94 46 94 52V86Z" fill="${BRN}"/>` +
    `<rect x="22" y="64" width="62" height="18" rx="2" fill="#c08552"/>` +
    `<rect x="22" y="56" width="62" height="10" rx="3" fill="#fff"/>` +
    `<ellipse cx="36" cy="49" rx="13" ry="8" fill="#fff"/>` +
    `<path d="M46 50Q60 44 82 48V70H46Q42 60 46 50Z" fill="${BLUE}"/>` +
    `<path d="M46 50Q52 58 50 70" fill="none" stroke="#5c9ae8" stroke-width="2.4"/>` +
    shine(13, 34, 2, 7)
  )

const umbrella = () => {
  let sc = '', d = 'M8 52Q10 14 50 12Q90 14 92 52'
  for (let i = 0; i < 5; i++) {
    const x0 = 92 - i * 16.8, x1 = r1(x0 - 16.8)
    d += `Q${r1(x0 - 8.4)} 44 ${x1} 52`
    sc += `M50 13Q${r1(50 + (x1 - 50) * 0.55)} 30 ${x1} 52`
  }
  return wrap(
    `<path d="M50 50V84Q50 94 41 94Q34 94 34 86" fill="none" stroke-width="8"/>` +
    `<path d="M50 50V84Q50 94 41 94Q34 94 34 86" fill="none" stroke="${BLK}" stroke-width="3"/>` +
    `<path d="${d}Z" fill="${PUR}"/>` +
    `<path d="${sc.split('M').slice(2, 5).map((s) => 'M' + s).join('')}" fill="none" stroke="#5b34c9" stroke-width="2.2"/>` +
    `<circle cx="50" cy="9" r="3.5" fill="${PUR}"/>` + shine(28, 28, 4, 9, 45)
  )
}

const octopus = () => {
  const P = PNK, D = '#e0607f'
  const arms = ['M30 56Q18 72 8 70', 'M36 60Q30 80 22 88', 'M46 62Q44 82 40 94', 'M54 62Q56 82 60 94', 'M64 60Q70 80 78 88', 'M70 56Q82 72 92 70']
  return wrap(
    arms.map((a) => tube(a, P, 8)).join('') +
    `<ellipse cx="50" cy="38" rx="29" ry="28" fill="${P}"/>` +
    `<path d="M24 50Q50 66 76 50L74 58Q50 68 26 58Z" fill="${P}" ${N}/>` +
    `<circle cx="40" cy="18" r="4" fill="#ffc2d1" ${N}/><circle cx="62" cy="22" r="3" fill="#ffc2d1" ${N}/>` +
    eyes(50, 38, 10, 4.5) + cheeks(50, 47, 17, D) + smile(50, 48, 5)
  )
}

const carrot = () =>
  wrap(
    `<g transform="rotate(-45 50 50)">` +
    `<path d="M80 50Q88 38 94 36M80 50Q90 48 96 50M80 50Q88 62 94 64" fill="none" stroke-width="10"/>` +
    `<path d="M80 50Q88 38 94 36M80 50Q90 48 96 50M80 50Q88 62 94 64" fill="none" stroke="${GRN}" stroke-width="5"/>` +
    `<path d="M4 50Q40 34 78 36Q86 42 86 50Q86 58 78 64Q40 66 4 50Z" fill="${ORG}"/>` +
    `<path d="M30 44l6 2M48 58l7-2M60 42l6 2M40 54l5-1M68 56l6-2" fill="none" stroke="#b85a00" stroke-width="2.2"/></g>`
  )

const airplane = () => {
  const B = '#dfe3e7'
  return wrap(
    `<g transform="rotate(45 50 50)">` +
    `<path d="M46 42L6 62V70L46 58ZM54 42L94 62V70L54 58Z" fill="${GRY}"/>` +
    `<path d="M47 80L32 90V95L48 89ZM53 80L68 90V95L52 89Z" fill="${GRY}"/>` +
    `<path d="M44 16Q44 4 50 4Q56 4 56 16V86Q56 96 50 96Q44 96 44 86Z" fill="${B}"/>` +
    `<path d="M46.5 14Q50 8 53.5 14Z" fill="#2c6fb7" ${N}/>` +
    `<path d="M48 26V74" fill="none" stroke="#fff" stroke-width="2.4"/></g>`
  )
}

const sun = () => {
  let d = ''
  for (let i = 0; i < 8; i++) {
    const a = rad(i * 45 - 90), w = rad(13)
    d += `M${r1(50 + 30 * Math.cos(a - w))} ${r1(50 + 30 * Math.sin(a - w))}L${r1(50 + 46 * Math.cos(a))} ${r1(50 + 46 * Math.sin(a))}L${r1(50 + 30 * Math.cos(a + w))} ${r1(50 + 30 * Math.sin(a + w))}Z`
  }
  return wrap(`<path d="${d}" fill="${ORG}"/><circle cx="50" cy="50" r="27" fill="${YEL}"/>` + shine(40, 38, 7, 4, -40))
}

const crayon = () =>
  wrap(
    `<g transform="rotate(-45 50 50)">` +
    `<path d="M6 46L24 38V62L6 54Z" fill="${RED}"/>` +
    `<rect x="24" y="37" width="70" height="26" rx="3" fill="${RED}"/>` +
    `<rect x="36" y="37" width="46" height="26" fill="#ff8a8c"/>` +
    `<path d="M36 37V63M82 37V63" fill="none" stroke-width="2.2"/>` +
    `<path d="M42 45Q50 41 58 45Q66 49 76 45M42 55Q50 51 58 55Q66 59 76 55" fill="none" stroke="${RED}" stroke-width="2.6"/></g>`
  )

const drum = () =>
  wrap(
    tube('M22 8L50 38', '#c08552', 4) + tube('M78 8L50 38', '#c08552', 4) +
    `<circle cx="22" cy="8" r="5" fill="#fbf3dc"/><circle cx="78" cy="8" r="5" fill="#fbf3dc"/>` +
    `<path d="M14 46V76A36 14 0 0 0 86 76V46Z" fill="${RED}"/>` +
    `<path d="M14 50L26 86L38 54L50 90L62 54L74 86L86 50" fill="none" stroke="#fff" stroke-width="2.6"/>` +
    `<path d="M14 76A36 14 0 0 0 86 76" fill="none" stroke="${YEL}" stroke-width="5"/>` +
    `<path d="M14 76A36 14 0 0 0 86 76V82A36 14 0 0 1 14 82Z" fill="none"/>` +
    `<ellipse cx="50" cy="46" rx="36" ry="14" fill="#fbf3dc" stroke="${YEL}" stroke-width="5"/>` +
    `<ellipse cx="50" cy="46" rx="38.5" ry="16.5" fill="none"/>`
  )

const penguin = () =>
  wrap(
    `<ellipse cx="38" cy="90" rx="10" ry="4.5" fill="${ORG}"/><ellipse cx="62" cy="90" rx="10" ry="4.5" fill="${ORG}"/>` +
    `<ellipse cx="20" cy="58" rx="7" ry="20" fill="#4a4a5a" transform="rotate(24 20 58)"/>` +
    `<ellipse cx="80" cy="58" rx="7" ry="20" fill="#4a4a5a" transform="rotate(-24 80 58)"/>` +
    `<ellipse cx="50" cy="52" rx="30" ry="38" fill="${BLK}"/>` +
    `<path d="M50 30Q30 24 30 44Q26 62 34 76Q42 86 50 86Q58 86 66 76Q74 62 70 44Q70 24 50 30Z" fill="#fff" ${N}/>` +
    eyes(50, 40, 9, 4) + cheeks(50, 49, 15) +
    `<path d="M43 46H57L50 55Z" fill="${ORG}" stroke-width="2.2"/>` + shine(38, 20, 6, 3, -25)
  )

const rainbow = () => {
  const cols = [RED, ORG, YEL, GRN, BLUE, PUR]
  const arc = (r: number) => `M${50 - r} 74A${r} ${r} 0 0 1 ${50 + r} 74`
  const cloud = (x: number) =>
    unite(`<circle cx="${x - 9}" cy="76" r="9"/>`, `<circle cx="${x + 2}" cy="70" r="11"/>`, `<circle cx="${x + 11}" cy="77" r="8"/>`, `<rect x="${x - 16}" y="74" width="34" height="12" rx="6"/>`)
      .replace(/<(circle|rect)/g, '<$1 fill="#fff"')
  return wrap(
    `<path d="${arc(29)}" fill="none" stroke-width="36.5"/>` +
    cols.map((c, i) => `<path d="${arc(44 - i * 6)}" fill="none" stroke="${c}" stroke-width="6.2" stroke-linecap="butt"/>`).join('') +
    cloud(18) + cloud(80)
  )
}

const hedgehog = () => {
  let d = ''
  const n = 20
  for (let i = 0; i <= n; i++) {
    const a = rad(185 + (170 * i) / n), r = i % 2 ? 42 : 32
    d += `${i ? 'L' : 'M'}${r1(56 + r * Math.cos(a))} ${r1(68 + r * Math.sin(a))}`
  }
  return wrap(
    `<ellipse cx="40" cy="86" rx="7" ry="4" fill="#6b3f1a"/><ellipse cx="70" cy="86" rx="7" ry="4" fill="#6b3f1a"/>` +
    `<path d="${d}L88 80Q56 90 24 80Z" fill="${BRN}"/>` +
    `<path d="M40 50l6 6M56 40l2 8M72 46l-3 7M64 62l-3 6M48 66l5 4" fill="none" stroke="#c08552" stroke-width="2.2"/>` +
    `<path d="M4 70Q10 54 30 50Q42 60 38 82Q20 84 4 70Z" fill="#ecc596"/>` +
    `<circle cx="5" cy="69" r="4" fill="${S}"/>` + eye(22, 62, 3.2) + cheeks(26, 72, 0)
  )
}

const snail = () => {
  const B = '#f2d38b', Sh = '#c8661a'
  return wrap(
    `<path d="M70 32L66 14M80 34L84 16" fill="none" stroke-width="2.6"/>` +
    `<circle cx="66" cy="13" r="3.5" fill="${B}"/><circle cx="84" cy="15" r="3.5" fill="${B}"/>` +
    `<path d="M6 84Q20 76 60 74Q66 50 76 36Q90 34 92 50Q92 66 84 82Q60 90 6 84Z" fill="${B}"/>` +
    `<circle cx="40" cy="50" r="30" fill="${Sh}"/>` +
    `<path d="M40 50Q46 46 46 52Q46 60 38 60Q28 60 28 50Q28 36 42 36Q58 36 58 52Q58 70 40 72" fill="none" stroke="#f9b45c" stroke-width="3.5"/>` +
    eye(80, 46, 3) + smile(84, 56, 3) + shine(26, 34, 4, 7, 40)
  )
}

const watermelon = () =>
  wrap(
    `<g transform="rotate(-12 50 50)">` +
    `<path d="M6 30A44 44 0 0 0 94 30Z" fill="${GRN}"/>` +
    `<path d="M12 30A38 38 0 0 0 88 30Z" fill="#c8e6a0" ${N}/>` +
    `<path d="M15 30A35 35 0 0 0 85 30Z" fill="${RED}" ${N}/>` +
    `<path d="M6 30A44 44 0 0 0 94 30Z" fill="none"/>` +
    [[30, 40], [50, 44], [70, 40], [40, 56], [60, 56], [50, 68]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="4" fill="${S}" ${N}/>`).join('') +
    `</g>`
  )

const toothbrush = () =>
  wrap(
    `<g transform="rotate(-35 50 50)">` +
    `<path d="M4 58Q4 50 12 50H58Q64 50 66 54H96V62H66Q64 66 58 66H12Q4 66 4 58Z" fill="${BLUE}"/>` +
    `<rect x="66" y="38" width="28" height="16" rx="2" fill="#fff"/>` +
    `<path d="M73 38V54M80 38V54M87 38V54" fill="none" stroke="#9ccaf5" stroke-width="2.4"/>` +
    `<rect x="66" y="38" width="28" height="16" rx="2" fill="none"/>` +
    `<path d="M14 54H50" fill="none" stroke="#fff" stroke-width="2.4" opacity=".6"/></g>`
  )

const fireEngine = () =>
  wrap(
    `<rect x="8" y="40" width="86" height="36" rx="4" fill="${RED}"/>` +
    `<path d="M8 76V36Q8 26 18 26H34V76Z" fill="${RED}"/>` +
    `<path d="M13 44V36Q13 31 18 31H29V44Z" fill="#bfe3ff"/>` +
    `<rect x="18" y="20" width="10" height="6" rx="2" fill="${BLUE}"/>` +
    `<path d="M38 30H92M38 37H92" fill="none" stroke-width="5"/>` +
    `<path d="M38 30H92M38 37H92" fill="none" stroke="#dfe3e7" stroke-width="2.4"/>` +
    `<path d="M44 29V38M54 29V38M64 29V38M74 29V38M84 29V38" fill="none" stroke-width="2.2"/>` +
    `<path d="M8 60H94" fill="none" stroke="#fff" stroke-width="3.5"/>` +
    `<rect x="44" y="46" width="14" height="10" rx="2" fill="#bfe3ff" stroke-width="2.2"/><rect x="64" y="46" width="14" height="10" rx="2" fill="#bfe3ff" stroke-width="2.2"/>` +
    `<rect x="4" y="66" width="8" height="8" rx="2" fill="${YEL}"/>` +
    `<circle cx="26" cy="78" r="10" fill="${BLK}"/><circle cx="76" cy="78" r="10" fill="${BLK}"/>` +
    `<circle cx="26" cy="78" r="4" fill="${GRY}"/><circle cx="76" cy="78" r="4" fill="${GRY}"/>`
  )

const dog = () => {
  const F = '#d9955a', E = BRN, M = '#fbead2'
  return wrap(
    `<path d="M28 22Q8 20 8 44Q8 62 20 62Q26 48 34 30Z" fill="${E}"/>` +
    `<path d="M72 22Q92 20 92 44Q92 62 80 62Q74 48 66 30Z" fill="${E}"/>` +
    `<ellipse cx="50" cy="50" rx="30" ry="32" fill="${F}"/>` +
    `<ellipse cx="38" cy="40" rx="8" ry="9" fill="${E}" opacity=".5" ${N}/>` +
    `<ellipse cx="50" cy="66" rx="17" ry="13" fill="${M}"/>` +
    `<path d="M45 72Q45 84 50 84Q55 84 55 72Z" fill="${PNK}" stroke-width="2.2"/>` +
    `<ellipse cx="50" cy="59" rx="6.5" ry="4.5" fill="${S}"/>` +
    `<path d="M50 63V68M41 68Q45.5 73 50 68Q54.5 73 59 68" fill="none" stroke-width="2.3"/>` +
    eyes(50, 44, 11, 4) + cheeks(50, 58, 20)
  )
}

const rooster = () => {
  const W = '#fff'
  return wrap(
    `<path d="M70 52Q84 22 96 30Q88 34 84 56Z" fill="${GRN}"/>` +
    `<path d="M72 58Q94 42 96 58Q88 58 80 66Z" fill="${ORG}"/>` +
    `<path d="M74 62Q92 64 90 80Q84 72 74 72Z" fill="#1f6e36"/>` +
    `<path d="M46 76V90M40 92L46 88L52 92M60 76V90M54 92L60 88L66 92" fill="none" stroke="${ORG}" stroke-width="3.5"/>` +
    unite(`<ellipse cx="56" cy="60" rx="24" ry="19" fill="${W}"/>`, `<circle cx="32" cy="34" r="13" fill="${W}"/>`, `<path d="M24 38L36 34L48 50L36 62Z" fill="${W}"/>`) +
    `<path d="M48 58Q62 52 72 60Q62 72 48 58Z" fill="#e6e8ea"/>` +
    `<path d="M22 26Q20 16 27 19Q28 10 34 16Q38 8 42 18Q46 22 40 26Z" fill="${RED}"/>` +
    `<path d="M20 34L10 38L20 42Z" fill="${YEL}"/>` +
    `<path d="M22 42Q18 52 24 52Q28 50 26 42Z" fill="${RED}"/>` + eye(28, 31, 3)
  )
}

const ant = () => {
  const A = '#5b3a29'
  return wrap(
    `<path d="M40 56L30 74L24 88M46 58L46 76L42 90M52 56L62 74L68 88" fill="none" stroke-width="3.2"/>` +
    `<path d="M16 38Q10 22 18 12M24 36Q26 20 36 14" fill="none" stroke-width="2.6"/>` +
    `<ellipse cx="72" cy="54" rx="20" ry="15" fill="${A}"/>` +
    `<ellipse cx="46" cy="52" rx="10" ry="8" fill="${A}"/>` +
    `<circle cx="22" cy="46" r="13" fill="${A}"/>` +
    `<circle cx="17" cy="42" r="4" fill="#fff" ${N}/>` + eye(17, 43, 2.4) +
    `<path d="M12 52Q16 55 20 53" fill="none" stroke="#fff" stroke-width="2"/>` + shine(68, 46, 7, 3, -15)
  )
}

const snake = () => {
  const G = GRN
  return wrap(
    `<path d="M76 22L90 24L94 20M90 24L94 28" fill="none" stroke="${RED}" stroke-width="2.4"/>` +
    tube('M8 84Q30 70 50 82Q72 94 82 74Q90 54 66 50Q42 48 44 32Q46 22 56 20', G, 13) +
    `<path d="M20 82l3-4M62 86l3 -4M80 64l-4-2M56 50l0-4M46 36l4 0" fill="none" stroke="#a6e39a" stroke-width="3.5"/>` +
    `<ellipse cx="62" cy="21" rx="16" ry="11" fill="${G}"/>` + eye(62, 17, 3.2) +
    `<path d="M68 26Q73 28 77 24" fill="none" stroke-width="2.2"/>`
  )
}

const bird = () =>
  wrap(
    `<path d="M76 52L96 42L92 56L98 66L76 62Z" fill="#165cb3"/>` +
    `<path d="M48 74V86M44 90L48 86L52 90M60 74V86M56 90L60 86L64 90" fill="none" stroke="${ORG}" stroke-width="3"/>` +
    unite(`<ellipse cx="56" cy="56" rx="26" ry="20" fill="${BLUE}"/>`, `<circle cx="34" cy="40" r="16" fill="${BLUE}"/>`) +
    `<path d="M30 54Q40 76 64 72Q50 66 44 52Z" fill="#cfe3fb" ${N}/>` +
    `<path d="M50 50Q66 44 76 56Q66 66 52 60Z" fill="#165cb3"/>` +
    `<path d="M20 38L6 44L20 48Z" fill="${ORG}"/>` + eye(30, 36, 3.4) + cheeks(34, 46, 0)
  )

const cow = () => {
  const K = BLK
  return wrap(
    `<path d="M90 44Q96 56 92 70" fill="none"/><circle cx="92" cy="72" r="3" fill="${K}"/>` +
    `<rect x="36" y="60" width="9" height="30" rx="3" fill="#e6e8ea"/><rect x="72" y="60" width="9" height="30" rx="3" fill="#e6e8ea"/>` +
    `<rect x="46" y="62" width="9" height="28" rx="3" fill="#fff"/><rect x="82" y="62" width="9" height="28" rx="3" fill="#fff"/>` +
    `<path d="M36 86H45M46 86H55M72 86H81M82 86H91" fill="none" stroke-width="4"/>` +
    `<ellipse cx="66" cy="70" rx="8" ry="5" fill="${PNK}"/>` +
    `<rect x="30" y="36" width="62" height="34" rx="14" fill="#fff"/>` +
    `<path d="M44 37Q52 40 50 48Q42 54 38 46Q36 40 44 37ZM70 40Q80 38 82 46Q78 56 70 52Q64 46 70 40ZM56 58Q62 56 64 62Q58 68 54 64Z" fill="${K}" ${N}/>` +
    `<path d="M14 28Q10 20 14 16M30 28Q34 20 30 16" fill="none" stroke="#e8dcbc" stroke-width="5"/>` +
    `<ellipse cx="8" cy="34" rx="7" ry="4" fill="#fff"/><ellipse cx="36" cy="34" rx="7" ry="4" fill="#fff"/>` +
    `<ellipse cx="22" cy="44" rx="13" ry="15" fill="#fff"/>` +
    `<ellipse cx="22" cy="58" rx="12" ry="8" fill="${PNK}"/>` +
    `<ellipse cx="18" cy="58" rx="1.8" ry="2.6" fill="${S}" ${N}/><ellipse cx="26" cy="58" rx="1.8" ry="2.6" fill="${S}" ${N}/>` +
    eyes(22, 42, 6, 3)
  )
}

const duck = () => {
  const Bd = '#c4a07a'
  return wrap(
    `<path d="M80 54Q94 44 90 56Q96 58 86 62Z" fill="${BLK}"/>` +
    `<path d="M48 76V88M42 92L48 88L54 92M64 76V88M58 92L64 88L70 92" fill="none" stroke="${ORG}" stroke-width="3.5"/>` +
    unite(`<ellipse cx="56" cy="62" rx="30" ry="18" fill="${Bd}"/>`, `<path d="M28 34L40 34L44 58L30 62Z" fill="${Bd}"/>`, `<circle cx="34" cy="30" r="14" fill="${Bd}"/>`) +
    `<path d="M28 54Q28 74 52 78Q40 66 40 52Z" fill="${BRN}" ${N}/>` +
    `<circle cx="34" cy="30" r="14" fill="${GRN}" ${N}/><path d="M22 36Q30 48 44 38L44 44Q30 54 22 42Z" fill="${GRN}" ${N}/>` +
    `<path d="M24 46Q34 50 43 44" fill="none" stroke="#fff" stroke-width="3"/>` +
    `<path d="M50 54Q70 48 80 60Q68 72 52 64Z" fill="#8c6b4a"/><path d="M60 58H72" fill="none" stroke="${BLUE}" stroke-width="3.5"/>` +
    `<path d="M22 30Q10 30 6 34Q10 40 22 36Z" fill="${YEL}"/>` + eye(32, 26, 3)
  )
}

const cat = () => {
  const F = YEL
  return wrap(
    `<path d="M22 44L18 10L44 26Z" fill="${F}"/><path d="M78 44L82 10L56 26Z" fill="${F}"/>` +
    `<path d="M24 34L22 18L36 27Z" fill="${PNK}" ${N}/><path d="M76 34L78 18L64 27Z" fill="${PNK}" ${N}/>` +
    `<ellipse cx="50" cy="54" rx="34" ry="30" fill="${F}"/>` +
    `<path d="M44 26L46 36M50 25V36M56 26L54 36" fill="none" stroke="${ORG}" stroke-width="3.5"/>` +
    `<path d="M16 50L24 52M16 62L24 60M84 50L76 52M84 62L76 60" fill="none" stroke="${ORG}" stroke-width="3"/>` +
    `<ellipse cx="50" cy="68" rx="14" ry="9" fill="#fff4cf" ${N}/>` +
    eyes(50, 50, 13, 4.2) + cheeks(50, 62, 21) +
    `<path d="M46 60H54L50 64Z" fill="${PNK}" stroke-width="2"/>` +
    `<path d="M50 64V67M44 67Q47 71 50 67Q53 71 56 67" fill="none" stroke-width="2.3"/>` +
    `<path d="M2 60L30 64M4 72L30 68M98 60L70 64M96 72L70 68" fill="none" stroke-width="1.8"/>`
  )
}

const sheep = () => {
  const F = '#4a4a5a'
  return wrap(
    `<rect x="34" y="70" width="8" height="22" rx="3" fill="${F}"/><rect x="58" y="70" width="8" height="22" rx="3" fill="${F}"/>` +
    scallop(54, 52, 38, 14, '#fff', 30) +
    `<ellipse cx="20" cy="34" rx="9" ry="4.5" fill="${F}" transform="rotate(25 20 34)"/>` +
    `<ellipse cx="44" cy="34" rx="9" ry="4.5" fill="${F}" transform="rotate(-25 44 34)"/>` +
    `<ellipse cx="32" cy="44" rx="13" ry="16" fill="${F}"/>` +
    scallop(32, 28, 10, 7, '#fff', 6) +
    eyes(32, 42, 5, 3) + `<circle cx="27" cy="41" r="1.4" fill="#fff" ${N}/><circle cx="37" cy="41" r="1.4" fill="#fff" ${N}/>` +
    `<path d="M28 52Q32 55 36 52" fill="none" stroke="#fff" stroke-width="2.2"/>` + cheeks(32, 49, 8)
  )
}

const nest = () => {
  const B = BRN, D = '#5a3418'
  return wrap(
    `<ellipse cx="50" cy="56" rx="42" ry="11" fill="${D}"/>` +
    `<ellipse cx="34" cy="48" rx="10" ry="13" fill="#9fd3f0"/><ellipse cx="66" cy="48" rx="10" ry="13" fill="#9fd3f0"/>` +
    `<ellipse cx="50" cy="44" rx="10" ry="13" fill="#9fd3f0"/>` +
    `<circle cx="47" cy="38" r="1.6" fill="#5b8fb0" ${N}/><circle cx="31" cy="44" r="1.4" fill="#5b8fb0" ${N}/><circle cx="68" cy="42" r="1.6" fill="#5b8fb0" ${N}/>` +
    `<path d="M8 56Q10 90 50 90Q90 90 92 56Q70 66 50 66Q30 66 8 56Z" fill="${B}"/>` +
    `<path d="M14 64Q40 76 86 62M18 74Q50 86 80 74M28 84Q50 92 72 84M6 54L16 60M94 54L84 60M40 70L58 78" fill="none" stroke="#c08552" stroke-width="2.4"/>`
  )
}

const fish = () => {
  const L = '#7fb4f0', D = '#165cb3'
  return wrap(
    `<path d="M74 50L96 28L92 50L96 72Z" fill="${D}"/>` +
    `<path d="M32 30Q46 14 62 30Z" fill="${D}"/><path d="M40 70Q48 84 60 72Z" fill="${D}"/>` +
    `<ellipse cx="44" cy="50" rx="36" ry="24" fill="${BLUE}"/>` +
    `<path d="M14 58Q40 76 72 60Q54 68 30 64Z" fill="${L}" ${N}/>` +
    `<path d="M52 38Q58 44 52 50M62 40Q68 46 62 52M52 52Q58 58 52 64" fill="none" stroke="${L}" stroke-width="2.4"/>` +
    `<path d="M38 34Q44 50 38 66" fill="none" stroke-width="2.4"/>` +
    `<circle cx="24" cy="44" r="7" fill="#fff" stroke-width="2"/>` + eye(25, 44, 3.6) +
    `<path d="M10 54Q14 58 18 55" fill="none" stroke-width="2.4"/>`
  )
}

export const ART: Record<string, string> = {
  '🐘': elephant(),
  '🍌': banana(),
  '🦒': giraffe(),
  '🐢': turtle(),
  '🌙': moon(),
  '🦓': zebra(),
  '🦘': kangaroo(),
  '⏰': alarmClock(),
  '🚂': locomotive(),
  '❄': snowflake(),
  '🧢': cap(),
  '✏': pencil(),
  '⚽': soccer(),
  '🔑': key(),
  '🕷': spider(),
  '🐸': frog(),
  '🦋': butterfly(),
  '🥛': milk(),
  '🕯': candle(),
  '🎈': balloon(),
  '🌵': cactus(),
  '🦉': owl(),
  '🦁': lion(),
  '🌧': rainCloud(),
  '🚲': bicycle(),
  '🐝': bee(),
  '🥚': egg(),
  '🦈': shark(),
  '🐪': camel(),
  '🧦': socks(),
  '🛏': bed(),
  '☂': umbrella(),
  '🐙': octopus(),
  '🥕': carrot(),
  '✈': airplane(),
  '☀': sun(),
  '🖍': crayon(),
  '🥁': drum(),
  '🐧': penguin(),
  '🌈': rainbow(),
  '🦔': hedgehog(),
  '🐌': snail(),
  '🍉': watermelon(),
  '🪥': toothbrush(),
  '🚒': fireEngine(),
  '🐶': dog(),
  '🐓': rooster(),
  '🐜': ant(),
  '🐍': snake(),
  '🐦': bird(),
  '🐄': cow(),
  '🦆': duck(),
  '🐴': horse(),
  '🐱': cat(),
  '🫏': donkey(),
  '🐑': sheep(),
  '🪺': nest(),
  '🐟': fish(),
}
