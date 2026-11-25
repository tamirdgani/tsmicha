/* Animals world: original illustrations (viewBox 0 0 100 100). */

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
const cheeks = (cx: number, y: number, dx: number, c = '#ff6b8b') =>
  `<ellipse cx="${cx - dx}" cy="${y}" rx="4.2" ry="2.6" fill="${c}" opacity=".45" ${N}/>` +
  `<ellipse cx="${cx + dx}" cy="${y}" rx="4.2" ry="2.6" fill="${c}" opacity=".45" ${N}/>`
const smile = (cx: number, y: number, w: number) =>
  `<path d="M${cx - w} ${y}Q${cx} ${r1(y + w * 0.9)} ${cx + w} ${y}" fill="none" stroke-width="2.5"/>`
/** Little "w" cat/bear mouth hanging under a nose. */
const wMouth = (cx: number, y: number) =>
  `<path d="M${cx} ${y - 2.5}V${y}M${cx - 5} ${y}Q${cx - 2.5} ${y + 3.5} ${cx} ${y}Q${cx + 2.5} ${y + 3.5} ${cx + 5} ${y}" fill="none" stroke-width="2.3"/>`
/** Thick outlined tube (tails, tentacles, trunks). */
const tube = (d: string, c: string, w = 7) =>
  `<path d="${d}" fill="none" stroke-width="${w + 5.6}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Scalloped ring (lion mane). */
const scallop = (cx: number, cy: number, R: number, n: number, c: string) => {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    return [r1(cx + R * Math.cos(a)), r1(cy + R * Math.sin(a))]
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
/** Standard chubby little body with feet and arms. */
const body = (c: string, belly: string, feet = c, y = 74) =>
  `<ellipse cx="40" cy="${y + 15}" rx="8.5" ry="5" fill="${feet}"/><ellipse cx="60" cy="${y + 15}" rx="8.5" ry="5" fill="${feet}"/>` +
  `<ellipse cx="50" cy="${y}" rx="19" ry="15" fill="${c}"/>` +
  `<ellipse cx="50" cy="${y + 3}" rx="11" ry="9" fill="${belly}" ${N}/>` +
  `<ellipse cx="32" cy="${y - 1}" rx="5" ry="8" fill="${c}" transform="rotate(25 32 ${y - 1})"/>` +
  `<ellipse cx="68" cy="${y - 1}" rx="5" ry="8" fill="${c}" transform="rotate(-25 68 ${y - 1})"/>`

const lion = () => {
  const Y = '#ffc83d', M = '#c8661a'
  return wrap(
    tube('M66 80Q82 82 82 66', Y, 4) + `<circle cx="82" cy="63" r="5" fill="${M}"/>` +
    body(Y, '#ffe9a8') +
    scallop(50, 39, 27, 13, M) +
    `<circle cx="35" cy="24" r="6.5" fill="${Y}"/><circle cx="65" cy="24" r="6.5" fill="${Y}"/>` +
    `<circle cx="35" cy="24" r="3" fill="#f59e5b" ${N}/><circle cx="65" cy="24" r="3" fill="#f59e5b" ${N}/>` +
    `<circle cx="50" cy="41" r="19" fill="${Y}"/>` +
    `<ellipse cx="45" cy="50" rx="6" ry="4.5" fill="#fff1c2" ${N}/><ellipse cx="55" cy="50" rx="6" ry="4.5" fill="#fff1c2" ${N}/>` +
    eyes(50, 38, 8, 3.6) + cheeks(50, 47, 13) +
    `<path d="M46 45.5H54L50 49.5Z" fill="#7a4b2f" stroke-width="2"/>` + wMouth(50, 52)
  )
}

const elephant = () => {
  const G = '#9aa0a6'
  return wrap(
    `<ellipse cx="25" cy="42" rx="16" ry="19" fill="${G}"/><ellipse cx="75" cy="42" rx="16" ry="19" fill="${G}"/>` +
    `<ellipse cx="26" cy="43" rx="9.5" ry="12.5" fill="#f4b4c6" ${N}/><ellipse cx="74" cy="43" rx="9.5" ry="12.5" fill="#f4b4c6" ${N}/>` +
    `<rect x="35" y="74" width="12" height="18" rx="5" fill="${G}"/><rect x="53" y="74" width="12" height="18" rx="5" fill="${G}"/>` +
    `<path d="M37 89H45M55 89H63" stroke="#e8eaec" stroke-width="2.4"/>` +
    `<ellipse cx="50" cy="72" rx="20" ry="13" fill="${G}"/>` +
    `<circle cx="50" cy="40" r="21" fill="${G}"/>` +
    `<path d="M45 21Q47 15 46 12M50 20V12M55 21Q53 15 54 12" fill="none" stroke-width="2.2"/>` +
    tube('M50 47Q50 64 57 70Q62 72 63 66', G, 8) +
    `<circle cx="50" cy="47" r="5.5" fill="${G}" ${N}/>` +
    `<ellipse cx="44" cy="30" rx="6" ry="3" fill="#fff" opacity=".35" ${N}/>` +
    eyes(50, 39, 9, 3.8) + cheeks(50, 48, 13)
  )
}

const frog = () => {
  const G = '#2e9a48', L = '#a6e39a'
  return wrap(
    `<ellipse cx="27" cy="85" rx="12" ry="7" fill="${G}"/><ellipse cx="73" cy="85" rx="12" ry="7" fill="${G}"/>` +
    `<ellipse cx="50" cy="76" rx="20" ry="15" fill="${G}"/><ellipse cx="50" cy="79" rx="12" ry="9" fill="${L}" ${N}/>` +
    `<path d="M36 90l-3 3M40 90v4M64 90v4M68 90l3 3" stroke-width="2.4"/>` +
    `<ellipse cx="38" cy="90" rx="6" ry="3.5" fill="${G}"/><ellipse cx="62" cy="90" rx="6" ry="3.5" fill="${G}"/>` +
    `<circle cx="33" cy="30" r="12" fill="${G}"/><circle cx="67" cy="30" r="12" fill="${G}"/>` +
    `<ellipse cx="50" cy="51" rx="31" ry="19" fill="${G}"/>` +
    `<path d="M24 37Q50 30 76 37" fill="none" stroke="${G}" stroke-width="8"/>` +
    `<circle cx="33" cy="29" r="7.5" fill="#fff" stroke-width="2"/><circle cx="67" cy="29" r="7.5" fill="#fff" stroke-width="2"/>` +
    eyes(50, 30, 16, 4) +
    `<ellipse cx="38" cy="43" rx="7" ry="3" fill="#fff" opacity=".3" ${N}/>` +
    `<circle cx="46" cy="45" r="1.3" fill="${S}" ${N}/><circle cx="54" cy="45" r="1.3" fill="${S}" ${N}/>` +
    `<path d="M33 53Q50 66 67 53" fill="none" stroke-width="2.6"/>` + cheeks(50, 54, 23)
  )
}

const pig = () => {
  const P = '#ff8fab', D = '#e0607f'
  return wrap(
    `<path d="M69 76q7-1 7-6q-1-4-4-2q-2 3 2 5q5 2 7-3" fill="none" stroke-width="2.5"/>` +
    body(P, '#ffc2d1', P) +
    `<path d="M36 92h8M56 92h8" stroke="${D}" stroke-width="2.5"/>` +
    `<path d="M30 32Q24 12 30 11Q38 12 47 22Z" fill="${P}"/><path d="M70 32Q76 12 70 11Q62 12 53 22Z" fill="${P}"/>` +
    `<path d="M32 25L30 16L39 21Z" fill="${D}" ${N}/><path d="M68 25L70 16L61 21Z" fill="${D}" ${N}/>` +
    `<circle cx="50" cy="42" r="24" fill="${P}"/>` +
    `<ellipse cx="41" cy="27" rx="7" ry="3.5" fill="#fff" opacity=".35" ${N}/>` +
    eyes(50, 38, 10, 3.8) + cheeks(50, 49, 16, '#e83e6c') +
    `<ellipse cx="50" cy="50" rx="10.5" ry="7.5" fill="#ffc2d1"/>` +
    `<ellipse cx="46.3" cy="50" rx="1.9" ry="3" fill="${D}" ${N}/><ellipse cx="53.7" cy="50" rx="1.9" ry="3" fill="${D}" ${N}/>` +
    smile(50, 60, 4)
  )
}

const bear = () => {
  const B = '#8d5524', L = '#d9a46e'
  return wrap(
    body(B, L) +
    `<ellipse cx="40" cy="90" rx="4" ry="2.4" fill="${L}" ${N}/><ellipse cx="60" cy="90" rx="4" ry="2.4" fill="${L}" ${N}/>` +
    `<circle cx="30" cy="22" r="9" fill="${B}"/><circle cx="70" cy="22" r="9" fill="${B}"/>` +
    `<circle cx="30" cy="22" r="4.5" fill="${L}" ${N}/><circle cx="70" cy="22" r="4.5" fill="${L}" ${N}/>` +
    `<circle cx="50" cy="42" r="24" fill="${B}"/>` +
    `<ellipse cx="41" cy="27" rx="7" ry="3.5" fill="#fff" opacity=".2" ${N}/>` +
    `<ellipse cx="50" cy="51" rx="12" ry="9" fill="${L}"/>` +
    eyes(50, 39, 10, 3.8) + cheeks(50, 48, 16) +
    `<ellipse cx="50" cy="47" rx="4.8" ry="3.4" fill="${S}" ${N}/>` + wMouth(50, 53.5)
  )
}

const penguin = () => {
  const K = '#2f2f3a', O = '#ff9f1c'
  return wrap(
    `<ellipse cx="40" cy="90" rx="9" ry="4.5" fill="${O}"/><ellipse cx="60" cy="90" rx="9" ry="4.5" fill="${O}"/>` +
    `<ellipse cx="22" cy="60" rx="6" ry="16" fill="#4a4a5a" transform="rotate(22 22 60)"/>` +
    `<ellipse cx="78" cy="60" rx="6" ry="16" fill="#4a4a5a" transform="rotate(-22 78 60)"/>` +
    `<ellipse cx="50" cy="52" rx="28" ry="37" fill="${K}"/>` +
    `<path d="M50 31C39 22 27 30 31 45C25 60 29 84 50 86C71 84 75 60 69 45C73 30 61 22 50 31Z" fill="#f7f7fb" ${N}/>` +
    `<path d="M30 25Q37 17 46 16" fill="none" stroke="#5a5a6e" stroke-width="3"/>` +
    eyes(50, 41, 9, 3.8) + cheeks(50, 50, 15) +
    `<path d="M43.5 48Q50 44 56.5 48Q50 56 43.5 48Z" fill="${O}" stroke-width="2.2"/>`
  )
}

const fish = () => {
  const F = '#f77f00', L = '#ffb04d'
  return wrap(
    `<path d="M70 50L91 33Q86 50 91 67Z" fill="${F}"/>` +
    `<path d="M32 32Q46 14 62 32Z" fill="${L}"/><path d="M46 69Q54 82 62 67Z" fill="${L}"/>` +
    `<ellipse cx="44" cy="50" rx="31" ry="21" fill="${F}"/>` +
    `<path d="M26 36Q40 30 54 33" fill="none" stroke="#ffd29a" stroke-width="3.5" opacity=".8"/>` +
    `<path d="M60 38Q65 50 60 62M67 41Q71 50 67 59" fill="none" stroke="#c45f00" stroke-width="2.3"/>` +
    `<ellipse cx="47" cy="57" rx="7.5" ry="4" fill="${L}" transform="rotate(-25 47 57)"/>` +
    `<circle cx="28" cy="45" r="7.5" fill="#fff" stroke-width="2.2"/>` + eye(27, 46, 4.2) +
    `<path d="M15 55Q20 60 26 56" fill="none" stroke-width="2.5"/>` +
    `<ellipse cx="33" cy="56" rx="3.5" ry="2.2" fill="#e5383b" opacity=".4" ${N}/>` +
    `<circle cx="11" cy="28" r="3.5" fill="#d7f0ff" stroke-width="1.8"/><circle cx="17" cy="17" r="2.3" fill="#d7f0ff" stroke-width="1.6"/>`
  )
}

const octopus = () => {
  const P = '#8b5cf6'
  const legs = [
    'M32 54Q16 64 20 78Q23 86 15 86',
    'M40 58Q31 72 35 84Q37 91 30 92',
    'M47 60Q45 76 47 91',
    'M53 60Q55 76 53 91',
    'M60 58Q69 72 65 84Q63 91 70 92',
    'M68 54Q84 64 80 78Q77 86 85 86',
  ]
  return wrap(
    legs.map((d) => `<path d="${d}" fill="none" stroke-width="12.5"/>`).join('') +
    legs.map((d) => `<path d="${d}" fill="none" stroke="${P}" stroke-width="7"/>`).join('') +
    `<ellipse cx="50" cy="38" rx="27" ry="27" fill="${P}"/>` +
    `<circle cx="38" cy="20" r="3.5" fill="#b9a0ff" ${N}/><circle cx="60" cy="17" r="2.5" fill="#b9a0ff" ${N}/><circle cx="67" cy="26" r="3" fill="#b9a0ff" ${N}/>` +
    eyes(50, 40, 10, 4.4) + cheeks(50, 49, 17) + smile(50, 50, 6)
  )
}

const rabbit = () => {
  const W = '#f6f3fa', P = '#ffb3c6'
  return wrap(
    `<circle cx="70" cy="82" r="6" fill="${W}"/>` +
    `<ellipse cx="41" cy="91" rx="8" ry="4.5" fill="${W}"/><ellipse cx="59" cy="91" rx="8" ry="4.5" fill="${W}"/>` +
    `<ellipse cx="50" cy="78" rx="17" ry="13" fill="${W}"/>` +
    `<ellipse cx="34" cy="76" rx="4.5" ry="7" fill="${W}" transform="rotate(25 34 76)"/><ellipse cx="66" cy="76" rx="4.5" ry="7" fill="${W}" transform="rotate(-25 66 76)"/>` +
    `<ellipse cx="39" cy="23" rx="7.5" ry="17" fill="${W}" transform="rotate(-12 39 23)"/><ellipse cx="61" cy="23" rx="7.5" ry="17" fill="${W}" transform="rotate(12 61 23)"/>` +
    `<ellipse cx="39" cy="24" rx="3.5" ry="12" fill="${P}" ${N} transform="rotate(-12 39 24)"/><ellipse cx="61" cy="24" rx="3.5" ry="12" fill="${P}" ${N} transform="rotate(12 61 24)"/>` +
    `<circle cx="50" cy="50" r="20" fill="${W}"/>` +
    eyes(50, 47, 8, 3.6) + cheeks(50, 55, 13) +
    `<path d="M47.5 53H52.5L50 56Z" fill="#ff7a95" stroke-width="1.8"/>` +
    `<rect x="47.5" y="59" width="5" height="4.5" rx="1" fill="#fff" stroke-width="1.8"/>` + wMouth(50, 59)
  )
}

const turtle = () => {
  const K = '#b5e48c', T = '#2a9d8f', L = '#7fd1c3'
  return wrap(
    `<path d="M16 66L8 70L17 72Z" fill="${K}"/>` +
    `<ellipse cx="28" cy="76" rx="7" ry="9" fill="${K}"/><ellipse cx="62" cy="76" rx="7" ry="9" fill="${K}"/>` +
    `<ellipse cx="72" cy="62" rx="10" ry="7" fill="${K}"/>` +
    `<circle cx="81" cy="50" r="12" fill="${K}"/>` +
    eye(83, 47, 3.4) + `<path d="M80 56Q86 59 91 54" fill="none" stroke-width="2.3"/>` +
    `<ellipse cx="78" cy="54" rx="3" ry="2" fill="#ff6b8b" opacity=".45" ${N}/>` +
    `<path d="M12 68Q12 28 44 26Q74 28 74 68Z" fill="${T}"/>` +
    `<path d="M35 40L45 35L55 40L55 52L45 57L35 52Z" fill="${L}" ${N}/>` +
    `<path d="M23 50L30 46L30 57L22 60ZM63 50L57 46L57 57L65 60Z" fill="${L}" ${N}/>` +
    `<path d="M25 37Q32 30 40 30" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/>` +
    `<rect x="9" y="63" width="68" height="9" rx="4.5" fill="#86cfc3"/>`
  )
}

const cat = () => {
  const C = '#f4a259', D = '#d9782b'
  return wrap(
    tube('M66 84Q88 86 86 66Q85 57 78 57', C, 6.5) +
    `<path d="M82 60L86 66" stroke="${D}" stroke-width="2.5"/>` +
    `<ellipse cx="50" cy="74" rx="19" ry="17" fill="${C}"/><ellipse cx="50" cy="78" rx="11" ry="11" fill="#fde4c8" ${N}/>` +
    `<ellipse cx="42" cy="90" rx="7.5" ry="4.5" fill="${C}"/><ellipse cx="58" cy="90" rx="7.5" ry="4.5" fill="${C}"/>` +
    `<path d="M28 34L29 11L47 23Z" fill="${C}"/><path d="M72 34L71 11L53 23Z" fill="${C}"/>` +
    `<path d="M32 26L32.5 17L40 22Z" fill="#ffb3c6" ${N}/><path d="M68 26L67.5 17L60 22Z" fill="#ffb3c6" ${N}/>` +
    `<ellipse cx="50" cy="40" rx="25" ry="21" fill="${C}"/>` +
    `<path d="M45 20V26M50 19.5V27M55 20V26" stroke="${D}" stroke-width="2.4"/>` +
    eyes(50, 39, 10, 3.8) + cheeks(50, 47, 16) +
    `<path d="M47.5 44.5H52.5L50 47.5Z" fill="#ff7a95" stroke-width="1.8"/>` + wMouth(50, 50) +
    `<path d="M21 43L33 45.5M21 50L33 49M79 43L67 45.5M79 50L67 49" stroke-width="1.6"/>`
  )
}

const dog = () => {
  const C = '#e8bf8a', E = '#a0673a'
  return wrap(
    tube('M66 82Q82 80 81 64', C, 6.5) +
    body(C, '#fff3e0', C) +
    `<path d="M33 60Q50 66 67 60" fill="none" stroke-width="7.5"/><path d="M33 60Q50 66 67 60" fill="none" stroke="#e5383b" stroke-width="3.5"/>` +
    `<circle cx="50" cy="66" r="3.5" fill="#ffc83d" stroke-width="2"/>` +
    `<ellipse cx="50" cy="40" rx="23" ry="21" fill="${C}"/>` +
    `<ellipse cx="60" cy="36" rx="8" ry="7.5" fill="${E}" opacity=".8" ${N}/>` +
    `<path d="M33 23Q19 22 18 42Q18 58 27 57Q35 56 36 38Z" fill="${E}"/>` +
    `<path d="M67 23Q81 22 82 42Q82 58 73 57Q65 56 64 38Z" fill="${E}"/>` +
    `<ellipse cx="50" cy="50" rx="11" ry="8" fill="#fff3e0"/>` +
    eyes(50, 37, 9, 3.6) + cheeks(50, 46, 14) +
    `<path d="M47 54Q47 61 50 61Q53 61 53 54Z" fill="#ff7a95" stroke-width="2"/>` +
    `<ellipse cx="50" cy="46.5" rx="4.8" ry="3.4" fill="${S}" ${N}/>` + wMouth(50, 52.5)
  )
}

const owl = () => {
  const B = '#c8955c', D = '#9a6a3a', L = '#f3dfc0'
  return wrap(
    `<path d="M8 90H92" stroke-width="9"/><path d="M8 90H92" stroke="#8d5524" stroke-width="4"/>` +
    `<path d="M24 40L21 13L40 25Q50 22 60 25L79 13L76 40Q83 62 72 79Q62 89 50 89Q38 89 28 79Q17 62 24 40Z" fill="${B}"/>` +
    `<path d="M26 50Q16 66 30 80Q30 64 26 50ZM74 50Q84 66 70 80Q70 64 74 50Z" fill="${D}"/>` +
    `<ellipse cx="50" cy="72" rx="15" ry="13" fill="${L}" ${N}/>` +
    `<path d="M43 68l2 2 2-2M53 68l2 2 2-2M48 76l2 2 2-2" fill="none" stroke="${D}" stroke-width="1.8"/>` +
    `<circle cx="38.5" cy="44" r="11" fill="#fff"/><circle cx="61.5" cy="44" r="11" fill="#fff"/>` +
    eyes(50, 45, 11.5, 5) +
    `<path d="M46 52H54L50 59Z" fill="#ff9f1c" stroke-width="2.2"/>` +
    `<path d="M41 90v-3M45 90v-3M55 90v-3M59 90v-3" stroke="#ff9f1c" stroke-width="3"/>`
  )
}

const butterfly = () => {
  const A = '#48cae4', B = '#f15bb5'
  return wrap(
    `<path d="M47 24Q41 10 32 11M53 24Q59 10 68 11" fill="none" stroke-width="2.4"/>` +
    `<circle cx="32" cy="11" r="2.8" fill="${S}"/><circle cx="68" cy="11" r="2.8" fill="${S}"/>` +
    `<ellipse cx="34" cy="68" rx="14" ry="12" fill="${B}" transform="rotate(30 34 68)"/><ellipse cx="66" cy="68" rx="14" ry="12" fill="${B}" transform="rotate(-30 66 68)"/>` +
    `<ellipse cx="30" cy="38" rx="20" ry="16" fill="${A}" transform="rotate(-30 30 38)"/><ellipse cx="70" cy="38" rx="20" ry="16" fill="${A}" transform="rotate(30 70 38)"/>` +
    `<circle cx="26" cy="36" r="6" fill="#ffd166" ${N}/><circle cx="74" cy="36" r="6" fill="#ffd166" ${N}/>` +
    `<circle cx="36" cy="27" r="3" fill="#fff" ${N}/><circle cx="64" cy="27" r="3" fill="#fff" ${N}/>` +
    `<circle cx="32" cy="70" r="4" fill="#fff" opacity=".7" ${N}/><circle cx="68" cy="70" r="4" fill="#fff" opacity=".7" ${N}/>` +
    `<ellipse cx="50" cy="56" rx="5.5" ry="22" fill="#4a4a5a"/>` +
    `<circle cx="50" cy="30" r="8" fill="#4a4a5a"/>` +
    `<circle cx="47" cy="29" r="1.6" fill="#fff" ${N}/><circle cx="53" cy="29" r="1.6" fill="#fff" ${N}/>` +
    `<path d="M47 33Q50 35.5 53 33" fill="none" stroke="#fff" stroke-width="1.6"/>`
  )
}

const ant = () => {
  const R = '#c0503a'
  return wrap(
    `<path d="M44 60L36 72L30 84M50 62L50 74L46 86M56 60L64 72L68 84" fill="none" stroke-width="3"/>` +
    `<path d="M72 34Q73 19 83 16M79 37Q88 26 94 29" fill="none" stroke-width="2.4"/>` +
    `<circle cx="83" cy="16" r="2.6" fill="${S}"/><circle cx="94" cy="29" r="2.6" fill="${S}"/>` +
    `<ellipse cx="25" cy="58" rx="18" ry="14" fill="${R}"/>` +
    `<ellipse cx="50" cy="56" rx="10" ry="7.5" fill="${R}"/>` +
    `<circle cx="71" cy="45" r="14" fill="${R}"/>` +
    `<ellipse cx="20" cy="52" rx="6" ry="3" fill="#fff" opacity=".3" ${N}/><ellipse cx="66" cy="38" rx="4.5" ry="2.5" fill="#fff" opacity=".3" ${N}/>` +
    eye(74, 43, 3.8) + `<path d="M71 52Q76 55 81 51" fill="none" stroke-width="2.3"/>` +
    `<ellipse cx="67" cy="51" rx="3" ry="2" fill="#ff9fb0" opacity=".6" ${N}/>`
  )
}

const hen = () => {
  const W = '#fffdf5', R = '#e5383b', O = '#ff9f1c'
  return wrap(
    `<path d="M48 82V91M44 92H52M62 82V91M58 92H66" fill="none" stroke="${O}" stroke-width="3"/>` +
    `<path d="M70 52Q72 22 85 28Q94 34 88 46Q97 50 90 60Q84 68 76 66Z" fill="${W}"/>` +
    `<path d="M24 26Q22 16 29 18Q31 10 37 15Q43 10 44 21Z" fill="${R}"/>` +
    unite(
      `<ellipse cx="55" cy="64" rx="28" ry="20" fill="${W}"/>`,
      `<circle cx="34" cy="37" r="15" fill="${W}"/>`,
      `<path d="M26 46Q34 62 48 58L44 40Z" fill="${W}"/>`,
    ) +
    `<path d="M48 60Q58 53 68 60Q66 73 56 73Q49 71 48 60Z" fill="#efe4cc"/>` +
    `<path d="M21 35L10 39.5L21 44Z" fill="${O}" stroke-width="2.2"/>` +
    `<path d="M22 45Q19 54 25 53Q29 49 24 45Z" fill="${R}" stroke-width="2"/>` +
    eye(31, 34, 3.6) + `<ellipse cx="35" cy="42" rx="3.5" ry="2.2" fill="#ff6b8b" opacity=".45" ${N}/>`
  )
}

const monkey = () => {
  const B = '#a8643a', F = '#f2c9a0'
  return wrap(
    `<path d="M66 80Q86 80 86 62Q86 52 78 52Q72 53 74 59" fill="none" stroke-width="8.6"/>` +
    `<path d="M66 80Q86 80 86 62Q86 52 78 52Q72 53 74 59" fill="none" stroke="${B}" stroke-width="3.8"/>` +
    body(B, F) +
    `<circle cx="25" cy="42" r="9" fill="${B}"/><circle cx="75" cy="42" r="9" fill="${B}"/>` +
    `<circle cx="25" cy="42" r="4.8" fill="${F}" ${N}/><circle cx="75" cy="42" r="4.8" fill="${F}" ${N}/>` +
    `<circle cx="50" cy="40" r="22" fill="${B}"/>` +
    `<path d="M47 19Q50 11 56 14Q52 15 52 19" fill="${B}"/>` +
    `<path d="M50 33Q44 26 38 30Q30 35 34 46Q28 58 50 60Q72 58 66 46Q70 35 62 30Q56 26 50 33Z" fill="${F}" ${N}/>` +
    eyes(50, 39, 7, 3.6) + cheeks(50, 48, 12) +
    `<circle cx="48" cy="46" r="1.2" fill="${S}" ${N}/><circle cx="52" cy="46" r="1.2" fill="${S}" ${N}/>` +
    `<path d="M42 50Q50 57 58 50" fill="none" stroke-width="2.4"/>`
  )
}

const zebra = () => {
  const W = '#fbfbfb', K = S, I = '#e4e4ea'
  const leg = (x: number, c: string) =>
    `<rect x="${x}" y="60" width="10" height="30" rx="4.5" fill="${c}"/>` +
    `<path d="M${x + 1.5} 75h7" stroke="${K}" stroke-width="3"/>` +
    `<path d="M${x + 1} 87h8" stroke="${K}" stroke-width="3.5"/>`
  return wrap(
    `<path d="M80 52Q91 58 88 72" fill="none" stroke-width="2.6"/><ellipse cx="88" cy="74" rx="3.5" ry="6" fill="${K}"/>` +
    leg(42, I) + leg(72, I) + leg(32, W) + leg(62, W) +
    `<path d="M33 16L39 15L39 21L45 21L44 27L50 29L46 34L51 38L46 42Z" fill="${K}"/>` +
    `<ellipse cx="26" cy="14" rx="4" ry="8" fill="${I}" transform="rotate(-10 26 14)"/>` +
    `<ellipse cx="34" cy="13" rx="4" ry="8" fill="${W}" transform="rotate(25 34 13)"/><ellipse cx="34" cy="14" rx="1.6" ry="4.5" fill="#ffb3c6" ${N} transform="rotate(25 34 14)"/>` +
    unite(
      `<ellipse cx="57" cy="57" rx="26" ry="15" fill="${W}"/>`,
      `<path d="M27 50L27 30L42 25L48 52Z" fill="${W}"/>`,
      `<ellipse cx="26" cy="31" rx="16" ry="14" fill="${W}"/>`,
    ) +
    `<path d="M47 46Q45 57 48 69M56 43Q54 57 57 72M65 43Q63 57 66 72M74 46Q72 56 75 68M30 41l12-4M31 48l13-4" fill="none" stroke="${K}" stroke-width="3.6"/>` +
    `<path d="M23 19q5 2 10 0M27 23.5q5 1.5 10-1" fill="none" stroke="${K}" stroke-width="3"/>` +
    `<ellipse cx="16" cy="38" rx="9" ry="8" fill="#5b5b6b"/>` +
    `<circle cx="12" cy="34.5" r="1.6" fill="${S}" ${N}/>` +
    eye(29, 29, 3.6) + `<path d="M13 41Q17 44 22 41" fill="none" stroke="#fff" stroke-width="2"/>` +
    `<ellipse cx="34" cy="36" rx="3.5" ry="2.2" fill="#ff6b8b" opacity=".45" ${N}/>`
  )
}

const paw = (x: number, y: number, s: number, c: string, st = '') =>
  `<g transform="translate(${x} ${y}) scale(${s})" ${st}>` +
  `<path d="M-9 6Q-9-2 0-2Q9-2 9 6Q9 11 0 10Q-9 11-9 6Z" fill="${c}"/>` +
  `<ellipse cx="-10.5" cy="-6" rx="3.2" ry="4.2" fill="${c}" transform="rotate(-25 -10.5 -6)"/><ellipse cx="-4" cy="-12" rx="3.2" ry="4.4" fill="${c}"/>` +
  `<ellipse cx="4" cy="-12" rx="3.2" ry="4.4" fill="${c}"/><ellipse cx="10.5" cy="-6" rx="3.2" ry="4.2" fill="${c}" transform="rotate(25 10.5 -6)"/></g>`

const badge = () =>
  wrap(
    `<circle cx="50" cy="50" r="42" fill="#2e9a48"/>` +
    `<circle cx="50" cy="50" r="33" fill="#ffe8a3" stroke-width="2.4"/>` +
    `<path d="M14 36Q8 26 14 18Q22 24 18 34ZM86 36Q92 26 86 18Q78 24 82 34Z" fill="#7fd36e" stroke-width="2.2"/>` +
    paw(50, 53, 1.9, '#8d5524', 'stroke-width="1.4"') +
    `<path d="M27 32Q34 22 46 20" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>`
  )

const pattern = () =>
  `<g fill="#000" stroke="#000" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">` +
  paw(18, 20, 0.7, '#000', 'stroke="none"') +
  paw(78, 72, 0.6, '#000', 'stroke="none"') +
  `<path d="M58 22Q66 14 76 22Q66 30 58 22ZM58 22L52 17V27Z" fill="none"/><circle cx="71" cy="21" r="1" stroke="none"/>` +
  `<path d="M16 78Q18 64 32 62Q32 76 16 78ZM16 78L28 66" fill="none"/>` +
  `<path d="M47 50q3-4 6 0q3-4 6 0q0 5-6 9q-6-4-6-9Z" fill="none"/>` +
  `<circle cx="88" cy="40" r="1.4" stroke="none"/><circle cx="40" cy="90" r="1.4" stroke="none"/><circle cx="8" cy="48" r="1.4" stroke="none"/>` +
  `</g>`

export const ART: Record<string, string> = {
  lion: lion(),
  elephant: elephant(),
  frog: frog(),
  pig: pig(),
  bear: bear(),
  penguin: penguin(),
  fish: fish(),
  octopus: octopus(),
  rabbit: rabbit(),
  turtle: turtle(),
  cat: cat(),
  dog: dog(),
  owl: owl(),
  butterfly: butterfly(),
  ant: ant(),
  hen: hen(),
  monkey: monkey(),
  zebra: zebra(),
  badge: badge(),
  pattern: pattern(),
}
