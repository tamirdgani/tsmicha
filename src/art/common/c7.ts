/* Common drawings, batch 7: one per emoji the lessons use (viewBox 0 0 100 100). */

const S = '#2b2b3a'
const N = 'stroke="none"'
const R = '#e5383b', B = '#1d70d8', Y = '#ffc83d', G = '#2e9a48', O = '#f77f00'
const K = '#ff8fab', BR = '#8d5524', BK = '#2f2f3a', GR = '#9aa0a6'
const r1 = (n: number) => Math.round(n * 10) / 10
/** Wraps a drawing in the shared outline style (children inherit the stroke). */
const wrap = (s: string) =>
  `<g stroke="${S}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round">${s}</g>`
const line = (d: string, w = 2.5, c = S) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Thick outlined tube. */
const tube = (d: string, c: string, w = 7) =>
  `<path d="${d}" fill="none" stroke-width="${w + 5.6}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
const eye = (x: number, y: number, r = 4) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r1(r * 1.15)}" fill="${S}" ${N}/>` +
  `<circle cx="${r1(x + r * 0.35)}" cy="${r1(y - r * 0.45)}" r="${r1(r * 0.4)}" fill="#fff" ${N}/>`
const hl = (cx: number, cy: number, rx: number, ry: number, rot = -30) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".45" ${N} transform="rotate(${rot} ${cx} ${cy})"/>`
const cheeks = (cx: number, y: number, dx: number) =>
  `<ellipse cx="${cx - dx}" cy="${y}" rx="4.5" ry="2.8" fill="#ff6b8b" opacity=".45" ${N}/>` +
  `<ellipse cx="${cx + dx}" cy="${y}" rx="4.5" ry="2.8" fill="#ff6b8b" opacity=".45" ${N}/>`
/** Rounded tile (keycaps, symbols). */
const tile = (c: string, inner: string) => wrap(`<rect x="9" y="9" width="82" height="82" rx="17" fill="${c}"/>` + inner)
/** n-point star / burst. */
const star = (cx: number, cy: number, n: number, Ro: number, Ri: number, rot = -90) => {
  let d = ''
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180
    const rr = i % 2 ? Ri : Ro
    d += `${i ? 'L' : 'M'}${r1(cx + rr * Math.cos(a))} ${r1(cy + rr * Math.sin(a))}`
  }
  return d + 'Z'
}
/** Four-point sparkle. */
const sparkle = (cx: number, cy: number, r: number, c = Y) => {
  const k = r1(r * 0.2)
  return `<path d="M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}Q${cx + k} ${cy + k} ${cx} ${cy + r}Q${cx - k} ${cy + k} ${cx - r} ${cy}Q${cx - k} ${cy - k} ${cx} ${cy - r}Z" fill="${c}"/>`
}

// ---- faces ---------------------------------------------------------------
const face = (inner: string, c = Y) => wrap(`<circle cx="50" cy="52" r="40" fill="${c}"/>` + hl(30, 30, 9, 5) + inner)
/** Happy closed "^" eye. */
const happyEye = (x: number, y: number) => line(`M${x - 7} ${y + 3}Q${x} ${y - 8} ${x + 7} ${y + 3}`, 4)
const happyEyes = (y = 44) => happyEye(36, y) + happyEye(64, y)
const dotEyes = (y = 44, r = 4.5) => eye(36, y, r) + eye(64, y, r)
/** Wide white scared eyes with small pupils. */
const wideEyes = (y = 46) =>
  `<ellipse cx="36" cy="${y}" rx="8" ry="10" fill="#fff"/><ellipse cx="64" cy="${y}" rx="8" ry="10" fill="#fff"/>` +
  `<circle cx="36" cy="${y + 1}" r="3.2" fill="${S}" ${N}/><circle cx="64" cy="${y + 1}" r="3.2" fill="${S}" ${N}/>`
/** Blue "drained" forehead used by fear faces. */
const paleTop = `<path d="M13.6 36A40 40 0 0 1 86.4 36Q50 46 13.6 36Z" fill="#7cc0f5" opacity=".9" ${N}/>`

const grin = () =>
  face(
    happyEyes() +
      `<path d="M22 56Q50 64 78 56Q74 86 50 86Q26 86 22 56Z" fill="#fff"/>` +
      line('M24 67Q50 73 76 67', 2.2) + line('M38 61V84M50 62V86M62 61V84', 2.2) +
      cheeks(50, 56, 30),
  )
const yum = () =>
  face(
    happyEyes() +
      `<ellipse cx="62" cy="72" rx="8" ry="10" fill="#ff6b8b" transform="rotate(-20 62 72)"/>` +
      line('M62 66V76', 1.8, '#d94a6a') +
      `<path d="M28 60Q50 76 72 60" fill="${Y}" stroke="none"/>` +
      line('M28 60Q50 76 72 60', 3.2) +
      cheeks(50, 56, 30),
  )
const smileOpen = () =>
  face(
    happyEyes(42) +
      `<path d="M26 56H74Q72 88 50 88Q28 88 26 56Z" fill="#7a1f2b"/>` +
      `<path d="M30 58H70Q70 63 68 64H32Q30 63 30 58Z" fill="#fff" ${N}/>` +
      `<path d="M36 82Q50 70 64 82Q58 87 50 87Q42 87 36 82Z" fill="#ff6b8b" ${N}/>` +
      cheeks(50, 54, 31),
  )
const pouting = () =>
  face(
    line('M22 30L44 42M78 30L56 42', 5.5) + dotEyes(48, 5) +
      `<rect x="32" y="64" width="36" height="14" rx="6" fill="#fff"/>` + line('M33 71H67M44 65V77M56 65V77', 2) +
      line('M14 18l6 4M20 12l4 6M86 18l-6 4M80 12l-4 6', 3, '#7a1f2b'),
    R,
  )
const angry = () => face(line('M24 32L44 41M76 32L56 41', 5) + dotEyes(48, 4.8) + line('M34 74Q50 62 66 74', 4))
const scream = () =>
  face(
    paleTop + line('M26 26Q34 20 42 26M58 26Q66 20 74 26', 3.5) + wideEyes(44) +
      `<ellipse cx="50" cy="74" rx="9" ry="14" fill="#7a1f2b"/>` +
      `<g transform="rotate(-18 16 70)"><rect x="6" y="52" width="18" height="34" rx="9" fill="${Y}"/>${line('M15 56V66', 1.8)}</g>` +
      `<g transform="rotate(18 84 70)"><rect x="76" y="52" width="18" height="34" rx="9" fill="${Y}"/>${line('M85 56V66', 1.8)}</g>`,
  )
const surprised = () =>
  face(line('M26 30Q36 22 44 30M56 30Q64 22 74 30', 3.5) + dotEyes(44, 5.5) + `<ellipse cx="50" cy="72" rx="8" ry="10" fill="#7a1f2b"/>`)
const fearful = () =>
  face(
    paleTop + line('M26 34Q36 32 44 24M56 24Q64 32 74 34', 3.5) + wideEyes(46) +
      `<path d="M32 80Q50 58 68 80Q50 76 32 80Z" fill="#7a1f2b"/>` +
      `<path d="M84 34Q90 44 86 48Q80 48 84 34Z" fill="#7cc0f5" stroke-width="2"/>`,
  )
const party = () =>
  face(
    happyEyes(48) + cheeks(50, 60, 30) + line('M34 66Q42 74 50 70', 3) +
      `<path d="M14 14L46 22L22 44Z" fill="#8b5cf6"/>` + line('M28 18L20 30M38 20L24 40', 3, Y) +
      `<circle cx="13" cy="13" r="5" fill="${Y}"/>` +
      `<path d="M50 70L74 62L76 70Z" fill="${K}"/>` + `<path d="M74 66Q90 60 90 72Q90 80 82 78Q78 74 82 72" fill="none" stroke-width="5.6"/><path d="M74 66Q90 60 90 72Q90 80 82 78Q78 74 82 72" fill="none" stroke="${B}" stroke-width="3"/>` +
      `<rect x="64" y="10" width="5" height="9" fill="${G}" transform="rotate(30 66 14)" stroke-width="1.5"/>` +
      `<rect x="82" y="30" width="5" height="9" fill="${R}" transform="rotate(-25 84 34)" stroke-width="1.5"/>` +
      `<rect x="8" y="58" width="5" height="9" fill="${B}" transform="rotate(20 10 62)" stroke-width="1.5"/>`,
  )

// ---- people --------------------------------------------------------------
const baby = () =>
  wrap(
    `<circle cx="16" cy="54" r="7" fill="#f6d2b5"/><circle cx="84" cy="54" r="7" fill="#f6d2b5"/>` +
      `<circle cx="50" cy="54" r="36" fill="#f6d2b5"/>` + hl(32, 36, 8, 5) +
      line('M48 20Q44 10 52 10Q60 12 54 20', 3.2) +
      eye(38, 52, 5) + eye(62, 52, 5) + cheeks(50, 64, 22) +
      `<circle cx="50" cy="74" r="7" fill="${K}"/><ellipse cx="50" cy="72" rx="12" ry="4" fill="#7cc0f5"/>`,
  )
const adult = () =>
  wrap(
    `<path d="M14 94Q14 72 50 70Q86 72 86 94Z" fill="#2ab0a0"/>` + line('M42 72L50 80L58 72', 2.5) +
      `<circle cx="26" cy="46" r="6" fill="#b97a56"/><circle cx="74" cy="46" r="6" fill="#b97a56"/>` +
      `<circle cx="50" cy="44" r="25" fill="#b97a56"/>` +
      `<path d="M24 44Q20 14 50 14Q80 14 76 44Q70 28 56 28Q44 32 30 30Q26 36 24 44Z" fill="#3a2a20"/>` +
      eye(41, 46, 3.6) + eye(59, 46, 3.6) + cheeks(50, 54, 15) + line('M42 56Q50 63 58 56', 2.8),
  )
const girl = () =>
  wrap(
    `<path d="M16 94Q16 72 50 70Q84 72 84 94Z" fill="${K}"/>` +
      `<ellipse cx="18" cy="56" rx="9" ry="16" fill="${BR}" transform="rotate(15 18 56)"/><ellipse cx="82" cy="56" rx="9" ry="16" fill="${BR}" transform="rotate(-15 82 56)"/>` +
      `<circle cx="50" cy="44" r="27" fill="${BR}"/>` +
      `<circle cx="50" cy="48" r="22" fill="#e0ac80"/>` +
      `<path d="M28 44Q28 22 50 22Q72 22 72 44Q64 32 50 34Q36 32 28 44Z" fill="${BR}"/>` +
      `<path d="M14 36L24 40L14 46ZM34 40L24 40L34 34Z" fill="#e5386b"/><path d="M86 36L76 40L86 46ZM66 40L76 40L66 34Z" fill="#e5386b"/>` +
      eye(42, 50, 3.6) + eye(58, 50, 3.6) + cheeks(50, 58, 13) + line('M44 60Q50 65 56 60', 2.6),
  )
const sleeper = () =>
  wrap(
    `<rect x="7" y="34" width="11" height="54" rx="4" fill="${BR}"/>` +
      `<rect x="14" y="72" width="76" height="9" fill="#a86a35"/>` +
      `<rect x="14" y="60" width="76" height="14" rx="3" fill="#fff"/>` +
      `<ellipse cx="28" cy="55" rx="12" ry="7" fill="#fff"/>` +
      `<circle cx="32" cy="46" r="10" fill="#e0ac80"/><path d="M22 46Q22 34 34 36Q42 38 41 44Q32 40 22 46Z" fill="#3a2a20"/>` +
      line('M28 48Q31 51 34 48', 2) +
      `<path d="M38 56Q46 44 62 48Q80 52 88 56V72H38Z" fill="${B}"/>` + line('M46 60Q62 56 84 62', 2, '#7cc0f5') +
      `<rect x="85" y="50" width="9" height="38" rx="3" fill="${BR}"/>`,
  )
const writingHand = () =>
  wrap(
    `<rect x="6" y="74" width="88" height="18" rx="4" fill="#fff"/>` +
      line('M12 85Q16 79 20 85T28 85T34 83', 2.5, B) +
      `<path d="M28 80L32 72L36 75Z" fill="${BK}"/>` +
      `<path d="M31 74L66 22L73 27L37 78Z" fill="${B}"/>` +
      `<rect x="72" y="14" width="22" height="30" rx="6" fill="#7cc0f5" transform="rotate(-40 83 29)"/>` +
      `<path d="M50 42Q60 28 76 32Q92 40 88 56Q84 70 66 70Q54 70 48 60Z" fill="#f6d2b5"/>` +
      `<rect x="36" y="56" width="24" height="10" rx="5" fill="#f6d2b5" transform="rotate(-54 48 61)"/>` +
      `<ellipse cx="53" cy="46" rx="9" ry="5.5" fill="#f6d2b5" transform="rotate(-50 53 46)"/>` +
      line('M66 52Q72 56 80 52M64 60Q70 64 78 60', 2),
  )

// ---- symbols -------------------------------------------------------------
const W = (d: string, w = 10) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="${w}"/>`
const key = (d: string) => tile(B, hl(26, 24, 9, 4, -20) + W(d))
const DIGITS = [
  'M41 37L53 28V72',
  'M37 38Q38 27 50 27Q63 27 63 39Q63 48 52 57L37 72H64',
  'M37 32Q44 27 51 27Q63 27 63 38Q63 48 50 49Q64 49 64 61Q64 73 50 73Q42 73 36 68',
  'M57 72V28L35 60H67',
  'M62 28H41L39 47Q44 43 50 43Q64 43 64 57Q64 72 50 72Q42 72 36 67',
]
const check = () => tile(G, W('M28 52L44 68L74 32', 12))
const cross = () => wrap(`<path d="M22 22L78 78M78 22L22 78" stroke-width="22"/><path d="M22 22L78 78M78 22L22 78" stroke="${R}" stroke-width="16"/>`)
const minus = () => wrap(`<rect x="12" y="40" width="76" height="20" rx="5" fill="${BK}" stroke-width="2"/>`)
/** Hebrew letters alef + bet as thick white strokes. */
const letters = () =>
  tile(B, hl(26, 24, 9, 4, -20) + W('M58 34L80 66M80 34Q81 46 70 49M64 44Q57 52 57 66', 8) + W('M20 34H38Q44 34 44 40V64M18 65H48', 8))
const repeat = () =>
  tile(
    B,
    W('M28 50V42Q28 34 36 34H62', 8) + `<path d="M60 23L76 34L60 45Z" fill="#fff" stroke-width="2"/>` +
      W('M72 50V58Q72 66 64 66H38', 8) + `<path d="M40 55L24 66L40 77Z" fill="#fff" stroke-width="2"/>`,
  )
const collision = () =>
  wrap(`<path d="${star(50, 50, 10, 44, 22, -80)}" fill="${R}"/><path d="${star(50, 50, 8, 30, 15)}" fill="${O}"/><path d="${star(50, 50, 6, 16, 8)}" fill="${Y}"/>`)
const sparkles = () => wrap(sparkle(42, 56, 34) + sparkle(77, 22, 15) + sparkle(80, 78, 11) + hl(38, 50, 4, 8, 0))
const HL = 'M50 26C47 18 40 12 30 12C20 12 8 20 8 34C8 48 20 64 50 86L46 66L55 54L44 41Z'
const HR = 'M50 26C53 18 60 12 70 12C80 12 92 20 92 34C92 48 80 64 50 86L46 66L55 54L44 41Z'
const brokenHeart = () =>
  wrap(`<path d="${HL}" fill="${R}" transform="translate(-5 2) rotate(-8 50 50)"/><path d="${HR}" fill="${R}" transform="translate(5 2) rotate(8 50 50)"/>` + hl(24, 32, 7, 4.5))
const notes = () =>
  wrap(
    `<path d="M33 66V24L67 14V58" fill="none" stroke-width="5.5"/><path d="M33 24L67 14V25L33 35Z" fill="${BK}"/>` +
      `<ellipse cx="25" cy="68" rx="10" ry="7.5" fill="${BK}" transform="rotate(-20 25 68)"/><ellipse cx="59" cy="60" rx="10" ry="7.5" fill="${BK}" transform="rotate(-20 59 60)"/>` +
      `<path d="M88 82V46Q96 54 94 64" fill="none" stroke-width="5"/>` +
      `<ellipse cx="81" cy="84" rx="8.5" ry="6.5" fill="${BK}" transform="rotate(-20 81 84)"/>`,
  )

// ---- things --------------------------------------------------------------
const laptop = () =>
  wrap(
    `<rect x="18" y="16" width="64" height="46" rx="5" fill="${GR}"/><rect x="23" y="21" width="54" height="36" rx="2" fill="#5ab0f0"/>` +
      `<path d="M23 48L48 21H60L31 57H23Z" fill="#fff" opacity=".3" ${N}/>` +
      `<path d="M14 62H86L94 76Q94 82 88 82H12Q6 82 6 76Z" fill="#c4c8cc"/>` +
      line('M20 68H80M22 73H78', 2, '#8a9096') + `<rect x="40" y="76" width="20" height="4" rx="1.5" fill="${GR}" stroke-width="1.5"/>`,
  )
const motorway = () =>
  wrap(
    `<rect x="6" y="12" width="88" height="76" rx="12" fill="#8fd17a"/>` +
      `<path d="M6 38V24Q6 12 18 12H82Q94 12 94 24V38Z" fill="#bfe3ff"/>` +
      `<path d="M45 38H55L86 88H14Z" fill="#6b6f78"/>` +
      line('M47 40L19 86M53 40L81 86', 2.5, Y) +
      line('M50 42V47', 2, '#fff') + line('M50 54V62', 3, '#fff') + line('M50 70V84', 4, '#fff') +
      `<ellipse cx="70" cy="24" rx="9" ry="5" fill="#fff"/>`,
  )
const eyeball = () =>
  wrap(
    `<path d="M6 50Q50 6 94 50Q50 94 6 50Z" fill="#fff"/>` +
      `<circle cx="50" cy="50" r="19" fill="${B}"/><circle cx="50" cy="50" r="9" fill="${S}"/>` +
      `<circle cx="56" cy="43" r="5" fill="#fff" ${N}/>` + line('M24 30L18 22M38 22L36 13M50 20V10M62 22L64 13M76 30L82 22', 3),
  )
const glasses = () =>
  wrap(
    line('M14 44L5 38M86 44L95 38', 5, BK) +
      `<circle cx="30" cy="52" r="17" fill="#d7efff" stroke="${BK}" stroke-width="6"/><circle cx="70" cy="52" r="17" fill="#d7efff" stroke="${BK}" stroke-width="6"/>` +
      line('M45 48Q50 42 55 48', 5, BK) + line('M22 48L30 40M62 48L70 40', 3, '#fff'),
  )
const snowman = () =>
  wrap(
    line('M30 62L12 48M70 62L88 48M16 51L12 44M84 51L88 44', 3.5, BR) +
      `<circle cx="50" cy="70" r="22" fill="#f4f8ff"/><circle cx="50" cy="38" r="15" fill="#f4f8ff"/>` +
      `<rect x="33" y="22" width="34" height="5" rx="2" fill="${BK}"/><rect x="38" y="6" width="24" height="17" rx="2" fill="${BK}"/>` +
      `<rect x="38" y="17" width="24" height="4" fill="${R}" ${N}/>` +
      eye(44, 36, 2.6) + eye(56, 36, 2.6) + `<path d="M50 40L64 43L50 45Z" fill="${O}" stroke-width="2"/>` +
      `<circle cx="50" cy="62" r="2.6" fill="${BK}"/><circle cx="50" cy="72" r="2.6" fill="${BK}"/><circle cx="50" cy="82" r="2.6" fill="${BK}"/>`,
  )
const chart = () =>
  wrap(
    `<rect x="10" y="10" width="80" height="80" rx="8" fill="#fff"/>` +
      line('M30 12V88M50 12V88M70 12V88M12 30H88M12 50H88M12 70H88', 1.5, '#d8dde3') +
      tube('M20 76L38 56L52 64L74 32', G, 6) + `<path d="M64 30L80 24L78 41Z" fill="${G}"/>`,
  )
const pouring = () =>
  wrap(
    tube('M54 66Q60 76 58 84', '#5ab0f0', 6) +
      `<ellipse cx="58" cy="87" rx="22" ry="6" fill="#5ab0f0"/>` +
      `<g transform="translate(6 -4) rotate(120 40 42)"><path d="M28 18H56L52 64H32Z" fill="#e6f4ff"/>` +
      `<path d="M43 19.5H55L54 32H43Z" fill="#5ab0f0" ${N}/>${line('M34 24L36 56', 2.5, '#fff')}</g>`,
  )
const DROP = 'M0 -20Q14 -2 14 6A14 14 0 0 1 -14 6Q-14 -2 0 -20Z'
const drop = (x: number, y: number, s: number, rot: number) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="${DROP}" fill="#4aa8ff" stroke-width="${r1(2.8 / s)}"/>` +
  `<ellipse cx="-5" cy="4" rx="3" ry="5" fill="#fff" opacity=".5" ${N}/></g>`
const splash = () => wrap(drop(36, 60, 1.6, -30) + drop(72, 34, 1.1, 30) + drop(74, 76, 0.9, 50))
const sunset = () =>
  wrap(
    `<rect x="6" y="6" width="88" height="88" rx="14" fill="#f9a03f"/>` +
      `<path d="M20 6H80Q94 6 94 20V34H6V20Q6 6 20 6Z" fill="#f26b5b" ${N}/>` +
      `<circle cx="50" cy="56" r="18" fill="${Y}"/>` +
      `<path d="M6 50H22V94H20Q6 94 6 80Z" fill="#4b3f72"/>` +
      `<rect x="22" y="38" width="16" height="56" fill="#5c4d8a"/><rect x="38" y="60" width="14" height="34" fill="#4b3f72"/>` +
      `<rect x="52" y="44" width="16" height="50" fill="#5c4d8a"/><path d="M68 58H94V80Q94 94 80 94H68Z" fill="#4b3f72"/>` +
      `<g fill="${Y}" ${N}><rect x="26" y="44" width="4" height="5"/><rect x="31" y="54" width="4" height="5"/><rect x="26" y="64" width="4" height="5"/>` +
      `<rect x="56" y="50" width="4" height="5"/><rect x="61" y="62" width="4" height="5"/><rect x="74" y="64" width="4" height="5"/><rect x="82" y="72" width="4" height="5"/><rect x="11" y="58" width="4" height="5"/></g>`,
  )
const tshirt = () =>
  wrap(
    `<path d="M36 12Q50 22 64 12L90 26L80 44L70 38V88H30V38L20 44L10 26Z" fill="${B}"/>` +
      `<path d="M38 13Q50 26 62 13" fill="none" stroke="#7cc0f5" stroke-width="4"/>` + hl(42, 50, 5, 12, 0),
  )
const TICKET = 'M0 0H60V12A5 5 0 0 0 60 22V34H0V22A5 5 0 0 0 0 12Z'
const ticket = (tf: string, c: string) =>
  `<g transform="${tf}"><path d="${TICKET}" fill="${c}"/>${line('M44 4V30', 2.2, '#fff').replace('/>', ' stroke-dasharray="3 4"/>')}` +
  `<path d="${star(22, 17, 5, 9, 4)}" fill="#fff" stroke-width="1.6"/></g>`
const tickets = () => wrap(ticket('translate(30 12) rotate(20)', O) + ticket('translate(10 50) rotate(-12)', R))
const station = () =>
  wrap(
    `<rect x="12" y="30" width="7" height="58" fill="${GR}"/><rect x="81" y="30" width="7" height="58" fill="${GR}"/>` +
      `<path d="M6 28L50 10L94 28V34H6Z" fill="${G}"/>` +
      `<rect x="28" y="38" width="44" height="46" rx="10" fill="${B}"/>` +
      `<rect x="34" y="44" width="32" height="16" rx="4" fill="#bfe3ff"/>` +
      `<rect x="28" y="64" width="44" height="5" fill="#fff" ${N}/>` +
      `<circle cx="37" cy="75" r="4" fill="${Y}"/><circle cx="63" cy="75" r="4" fill="${Y}"/>` +
      `<rect x="6" y="84" width="88" height="8" rx="2" fill="#c4c8cc"/>`,
  )
const spool = () =>
  wrap(
    tube('M72 60Q92 70 84 92', R, 4) +
      `<rect x="26" y="20" width="48" height="60" fill="${R}"/>` +
      line('M28 30L72 26M28 40L72 36M28 50L72 46M28 60L72 56M28 70L72 66', 2, '#a8222a') +
      `<rect x="18" y="10" width="64" height="12" rx="4" fill="#d9a066"/><rect x="18" y="78" width="64" height="12" rx="4" fill="#d9a066"/>` +
      hl(36, 46, 3, 12, 0),
  )
const mushroom = () =>
  wrap(
    `<path d="M36 54Q32 82 38 90H62Q68 82 64 54Z" fill="#f6e7d0"/>` +
      `<path d="M8 56Q8 12 50 12Q92 12 92 56Q50 66 8 56Z" fill="${R}"/>` +
      `<g fill="#fff" stroke-width="2"><ellipse cx="50" cy="26" rx="9" ry="7"/><ellipse cx="26" cy="40" rx="7" ry="6"/><ellipse cx="74" cy="40" rx="7" ry="6"/><ellipse cx="48" cy="48" rx="5" ry="4"/></g>`,
  )
const pizza = () =>
  wrap(
    `<path d="M14 26Q50 14 86 26L50 92Z" fill="${Y}"/>` +
      `<path d="M30 52Q30 62 34 62Q38 62 36 54" fill="${Y}" stroke-width="2.2"/>` +
      `<path d="M10 20Q50 4 90 20L87 32Q50 18 13 32Z" fill="#e8a25a"/>` +
      `<g fill="${R}" stroke-width="2.2"><circle cx="38" cy="38" r="7"/><circle cx="62" cy="40" r="7"/><circle cx="50" cy="60" r="6"/></g>` +
      `<path d="M44 44l4 3M58 54l4-2" fill="none" stroke="${G}" stroke-width="3"/>`,
  )
const puzzle = () =>
  wrap(
    `<path d="M18 30H38A9 9 0 1 1 52 30H72V50A9 9 0 1 1 72 64V84H52A9 9 0 1 0 38 84H18V64A9 9 0 1 0 18 50Z" fill="${G}" transform="translate(3 -2)"/>` +
      hl(32, 42, 4, 7, 0),
  )
const hatching = () =>
  wrap(
    `<circle cx="50" cy="44" r="24" fill="${Y}"/>` +
      `<path d="M32 30Q34 10 50 10Q66 10 68 30L62 25L56 31L50 25L44 31L38 25Z" fill="#fffaf0"/>` +
      eye(42, 42, 3.5) + eye(58, 42, 3.5) + `<path d="M45 50L55 50L50 57Z" fill="${O}" stroke-width="2"/>` + cheeks(50, 50, 15) +
      `<path d="M18 62L26 54L34 62L42 54L50 62L58 54L66 62L74 54L82 62Q84 92 50 92Q16 92 18 62Z" fill="#fffaf0"/>`,
  )
const trophy = () =>
  wrap(
    tube('M30 22H16Q14 42 32 48M70 22H84Q86 42 68 48', Y, 5) +
      `<path d="M26 12H74V36Q74 62 50 64Q26 62 26 36Z" fill="${Y}"/>` +
      `<rect x="44" y="62" width="12" height="12" fill="${Y}"/><path d="M36 74H64L66 80H34Z" fill="${Y}"/>` +
      `<rect x="28" y="80" width="44" height="12" rx="3" fill="${BR}"/>` +
      `<path d="${star(50, 34, 5, 11, 5)}" fill="#fff3b0" stroke-width="2"/>` + hl(34, 26, 3, 9, 0),
  )
/** Clip a line through an ellipse (for crosshatch). */
const hatch = (cx: number, cy: number, rx: number, ry: number) => {
  let d = ''
  for (const sgn of [1, -1])
    for (let o = -48; o <= 48; o += 12) {
      // line: x = cx + o + t*sgn, y = cy + t
      const a = 1 / (rx * rx) + 1 / (ry * ry), b = (2 * o * sgn) / (rx * rx), c = (o * o) / (rx * rx) - 0.85
      const disc = b * b - 4 * a * c
      if (disc <= 0) continue
      const t1 = (-b - Math.sqrt(disc)) / (2 * a), t2 = (-b + Math.sqrt(disc)) / (2 * a)
      d += `M${r1(cx + o + t1 * sgn)} ${r1(cy + t1)}L${r1(cx + o + t2 * sgn)} ${r1(cy + t2)}`
    }
  return d
}
const pineapple = () =>
  wrap(
    `<path d="M30 42Q28 30 18 24Q32 24 40 32Q36 18 40 6Q48 20 50 30Q52 16 60 6Q64 20 60 32Q68 24 82 24Q72 30 70 42Z" fill="${G}"/>` +
      `<ellipse cx="50" cy="66" rx="25" ry="27" fill="#f5b82e"/>` +
      line(hatch(50, 66, 25, 27), 2, '#b8741a') + hl(38, 56, 4, 9, 20),
  )
const hippo = () =>
  wrap(
    `<g fill="#8f84a8"><rect x="38" y="70" width="11" height="18" rx="4"/><rect x="72" y="70" width="11" height="18" rx="4"/></g>` +
      `<ellipse cx="60" cy="58" rx="32" ry="22" fill="#9a8fb0"/>` +
      `<path d="M91 54Q97 52 96 46" fill="none" stroke-width="3"/>` +
      `<g fill="#9a8fb0"><rect x="46" y="70" width="12" height="20" rx="4"/><rect x="80" y="68" width="10" height="20" rx="4"/></g>` +
      `<ellipse cx="62" cy="66" rx="20" ry="8" fill="#b8afcb" ${N}/>` +
      `<ellipse cx="30" cy="34" rx="5" ry="6" fill="#9a8fb0"/>` +
      `<path d="M40 36Q28 30 18 38Q4 42 6 58Q8 72 22 72Q38 72 44 62Z" fill="#9a8fb0"/>` +
      line('M10 62Q22 66 34 62', 2.5) + `<ellipse cx="12" cy="48" rx="2" ry="3" fill="${S}" ${N}/><ellipse cx="20" cy="46" rx="2" ry="3" fill="${S}" ${N}/>` +
      eye(32, 42, 3.4) + `<ellipse cx="24" cy="56" rx="4" ry="2.6" fill="#ff6b8b" opacity=".5" ${N}/>`,
  )
const burger = () =>
  wrap(
    `<path d="M14 72H86Q86 86 72 86H28Q14 86 14 72Z" fill="#e8a25a"/>` +
      `<rect x="12" y="58" width="76" height="14" rx="7" fill="${BR}"/>` +
      `<path d="M14 58H86L76 66L66 58L56 68L46 58L34 66Z" fill="${Y}"/>` +
      `<path d="M10 52Q16 60 24 54Q32 60 40 54Q48 60 56 54Q64 60 72 54Q80 60 90 52V50H10Z" fill="#6cc04a"/>` +
      `<path d="M12 50Q12 14 50 14Q88 14 88 50Z" fill="#f0a94b"/>` +
      `<g fill="#fff6dc" stroke-width="1.5"><ellipse cx="36" cy="28" rx="2.5" ry="1.6"/><ellipse cx="52" cy="24" rx="2.5" ry="1.6"/><ellipse cx="66" cy="32" rx="2.5" ry="1.6"/><ellipse cx="44" cy="38" rx="2.5" ry="1.6"/><ellipse cx="28" cy="40" rx="2.5" ry="1.6"/></g>` +
      hl(30, 26, 3, 6, 40),
  )
const waffle = () => {
  let pits = ''
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) pits += `<rect x="${20 + i * 16}" y="${20 + j * 16}" width="11" height="11" rx="2"/>`
  return wrap(
    `<rect x="10" y="10" width="80" height="80" rx="16" fill="#e8a443"/>` +
      `<g fill="#c47a20" stroke-width="1.6">${pits}</g>` +
      `<rect x="40" y="38" width="22" height="18" rx="4" fill="#fff1a0" transform="rotate(-10 51 47)"/>`,
  )
}
const wolf = () =>
  wrap(
    `<path d="M14 8L38 28Q50 24 62 28L86 8L84 44Q86 62 70 74L50 90L30 74Q14 62 16 44Z" fill="${GR}"/>` +
      `<path d="M20 18L32 30L22 38Z" fill="#6f747a" stroke-width="2"/><path d="M80 18L68 30L78 38Z" fill="#6f747a" stroke-width="2"/>` +
      `<path d="M16 50L26 54L18 60L28 62L22 70" fill="#e6e8ea" stroke-width="2"/><path d="M84 50L74 54L82 60L72 62L78 70" fill="#e6e8ea" stroke-width="2"/>` +
      `<path d="M36 56Q50 46 64 56L58 76L50 88L42 76Z" fill="#eef0f2"/>` +
      line('M30 40L42 44M70 40L58 44', 3.2) + eye(38, 48, 3.5) + eye(62, 48, 3.5) +
      `<ellipse cx="50" cy="66" rx="6" ry="4.5" fill="${S}"/>` + line('M50 70V76M44 78Q50 82 56 78', 2.2),
  )
const ufo = () =>
  wrap(
    `<path d="M38 62L24 94H76L62 62Z" fill="#fff6a0" opacity=".6" ${N}/>` +
      `<path d="M30 48A20 20 0 0 1 70 48Z" fill="#a8dcff"/>` + hl(42, 36, 3, 6, 30) +
      `<ellipse cx="50" cy="54" rx="44" ry="13" fill="${GR}"/><ellipse cx="50" cy="50" rx="30" ry="5" fill="#c4c8cc" ${N}/>` +
      `<g fill="${Y}" stroke-width="2"><circle cx="20" cy="56" r="3.5"/><circle cx="35" cy="60" r="3.5"/><circle cx="50" cy="61" r="3.5"/><circle cx="65" cy="60" r="3.5"/><circle cx="80" cy="56" r="3.5"/></g>`,
  )
const peacock = () => {
  let spots = ''
  for (let i = 0; i < 9; i++) {
    const a = ((-180 + 22.5 * i) * Math.PI) / 180
    const x = r1(50 + 42 * Math.cos(a)), y = r1(54 + 35 * Math.sin(a))
    spots += `<ellipse cx="${x}" cy="${y}" rx="7" ry="8" fill="#9be15d" stroke-width="2.4"/><circle cx="${x}" cy="${y}" r="3.6" fill="${B}" ${N}/>`
  }
  return wrap(
    `<ellipse cx="50" cy="56" rx="42" ry="36" fill="${G}"/>` + spots +
      line('M44 86V94M56 86V94', 3, O) +
      `<path d="M50 88Q34 84 38 62Q42 46 46 36Q44 26 50 22Q58 22 56 34Q60 50 62 62Q66 86 50 88Z" fill="${B}"/>` +
      line('M48 20L44 10M51 19V8M54 20L58 10', 2) + `<g fill="${B}" stroke-width="1.6"><circle cx="44" cy="9" r="2.5"/><circle cx="51" cy="7" r="2.5"/><circle cx="58" cy="9" r="2.5"/></g>` +
      `<path d="M46 26L38 29L46 31Z" fill="${Y}" stroke-width="2"/>` + eye(51, 27, 2.6) +
      `<ellipse cx="52" cy="62" rx="6" ry="14" fill="#3a8be6" ${N}/>`,
  )
}
const tiger = () =>
  wrap(
    tube('M84 52Q96 40 90 26', O, 6) +
      `<g fill="${O}"><rect x="34" y="62" width="10" height="26" rx="4"/><rect x="70" y="62" width="10" height="26" rx="4"/></g>` +
      `<ellipse cx="58" cy="54" rx="30" ry="16" fill="${O}"/>` +
      `<g fill="#f99a32"><rect x="42" y="62" width="10" height="26" rx="4"/><rect x="78" y="60" width="10" height="28" rx="4"/></g>` +
      `<ellipse cx="60" cy="64" rx="20" ry="5" fill="#fff3e0" ${N}/>` +
      line('M50 40Q46 48 52 54M62 39Q58 46 64 52M74 40Q70 48 76 52M84 46Q80 50 84 56', 3.5, BK) +
      `<path d="M14 32L18 20L28 28ZM34 28L42 20L42 34Z" fill="${O}"/>` +
      `<circle cx="28" cy="42" r="17" fill="${O}"/>` +
      `<ellipse cx="25" cy="52" rx="10" ry="6.5" fill="#fff3e0"/>` +
      line('M24 27V32M30 26V32M36 28L35 33M12 42H17M12 48L17 47', 2.5, BK) +
      eye(22, 40, 2.8) + eye(34, 40, 2.8) + `<path d="M24 47H30L27 51Z" fill="${S}"/>` + line('M27 51Q25 55 21 54M27 51Q29 55 33 54', 2),
  )
const dove = () =>
  wrap(
    `<path d="M70 60L90 50L95 58L92 68L74 68Z" fill="#e8ecf2"/>` + line('M76 62L91 58', 1.8, '#c4ccd6') +
      `<ellipse cx="52" cy="60" rx="26" ry="13" fill="#fff" transform="rotate(-10 52 60)"/>` +
      `<circle cx="30" cy="48" r="11" fill="#fff"/>` +
      `<path d="M20 46L10 50L20 52Z" fill="#c9a26b" stroke-width="2"/>` +
      line('M14 51Q10 62 4 70', 2.5, '#5b8a3a') +
      `<g fill="${G}" stroke-width="1.8"><ellipse cx="9" cy="60" rx="5" ry="2.6" transform="rotate(-40 9 60)"/><ellipse cx="13" cy="64" rx="5" ry="2.6" transform="rotate(30 13 64)"/><ellipse cx="5" cy="70" rx="4.5" ry="2.4" transform="rotate(-60 5 70)"/></g>` +
      eye(29, 45, 2.6) +
      `<path d="M40 54Q30 28 50 8Q54 20 62 18Q62 28 72 28Q70 38 78 40Q68 54 56 58Z" fill="#f2f4f8"/>` + line('M48 44Q46 30 52 18M54 48Q56 36 62 28M60 52Q64 44 70 38', 1.8, '#c4ccd6'),
  )
const robot = () =>
  wrap(
    line('M50 28V14', 3) + `<circle cx="50" cy="11" r="5" fill="${R}"/>` +
      `<rect x="8" y="46" width="10" height="18" rx="3" fill="#7b8188"/><rect x="82" y="46" width="10" height="18" rx="3" fill="#7b8188"/>` +
      `<rect x="16" y="26" width="68" height="62" rx="14" fill="${GR}"/>` +
      `<rect x="24" y="34" width="52" height="46" rx="10" fill="#d5dae0"/>` +
      `<circle cx="38" cy="50" r="8" fill="#6cd0ff"/><circle cx="62" cy="50" r="8" fill="#6cd0ff"/>` +
      `<circle cx="38" cy="50" r="3.5" fill="${S}" ${N}/><circle cx="62" cy="50" r="3.5" fill="${S}" ${N}/>` +
      `<rect x="36" y="64" width="28" height="9" rx="3" fill="#fff"/>` + line('M43 64V73M50 64V73M57 64V73', 1.8),
  )
const corn = () => {
  let k = ''
  for (let row = 0; row < 7; row++)
    for (const dx of [-8, 0, 8]) {
      const y = 22 + row * 8, x = 50 + dx + (row % 2 ? 2 : -2)
      const half = 13 * Math.sqrt(Math.max(0, 1 - ((y - 46) / 34) ** 2))
      if (Math.abs(x - 50) < half - 2) k += `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="3"/>`
    }
  return wrap(
    `<g transform="rotate(20 50 54)">` +
      `<ellipse cx="50" cy="44" rx="16" ry="34" fill="${Y}"/>` +
      `<g fill="#ffe27a" stroke="#d9a21b" stroke-width="1.2">${k}</g>` +
      `<path d="M50 94Q24 84 26 46Q38 64 50 72Z" fill="${G}"/><path d="M50 94Q76 84 74 46Q62 64 50 72Z" fill="#3fb85a"/>` +
      `<rect x="46" y="92" width="8" height="6" rx="2" fill="#a8743f"/></g>`,
  )
}
const scooter = () =>
  wrap(
    `<circle cx="24" cy="76" r="12" fill="${BK}"/><circle cx="24" cy="76" r="4.5" fill="#c4c8cc"/>` +
      `<circle cx="78" cy="76" r="12" fill="${BK}"/><circle cx="78" cy="76" r="4.5" fill="#c4c8cc"/>` +
      `<rect x="40" y="62" width="30" height="7" rx="2" fill="#4a4a5a"/>` +
      `<path d="M8 68Q6 48 28 46H52Q58 58 50 68Z" fill="${R}"/>` +
      `<rect x="18" y="38" width="32" height="9" rx="4.5" fill="#4a4a5a"/>` +
      `<path d="M62 68L68 28H76L74 66Z" fill="${R}"/>` +
      `<path d="M62 68Q78 52 92 68Z" fill="${R}"/>` +
      line('M70 28V20M62 20H82', 4) + `<circle cx="81" cy="32" r="4.5" fill="${Y}"/>` + hl(24, 54, 3, 8, 60),
  )

export const ART: Record<string, string> = {
  '💻': laptop(),
  '🛣': motorway(),
  '👁': eyeball(),
  '👓': glasses(),
  '⛄': snowman(),
  '💥': collision(),
  '📈': chart(),
  '🫗': pouring(),
  '💦': splash(),
  '✨': sparkles(),
  '💔': brokenHeart(),
  '🎶': notes(),
  '🛌': sleeper(),
  '🌇': sunset(),
  '👶': baby(),
  '🧑': adult(),
  '😁': grin(),
  '😋': yum(),
  '👕': tshirt(),
  '🎟': tickets(),
  '🚉': station(),
  '🧵': spool(),
  '🥳': party(),
  '😄': smileOpen(),
  '😡': pouting(),
  '😱': scream(),
  '😮': surprised(),
  '🍄': mushroom(),
  '✅': check(),
  '❌': cross(),
  '🍕': pizza(),
  '1⃣': key(DIGITS[0]),
  '2⃣': key(DIGITS[1]),
  '3⃣': key(DIGITS[2]),
  '4⃣': key(DIGITS[3]),
  '5⃣': key(DIGITS[4]),
  '➖': minus(),
  '✍': writingHand(),
  '🔤': letters(),
  '🧩': puzzle(),
  '🐣': hatching(),
  '😠': angry(),
  '😨': fearful(),
  '👧': girl(),
  '🏆': trophy(),
  '🔁': repeat(),
  '🍍': pineapple(),
  '🦛': hippo(),
  '🍔': burger(),
  '🧇': waffle(),
  '🐺': wolf(),
  '🛸': ufo(),
  '🦚': peacock(),
  '🐅': tiger(),
  '🕊': dove(),
  '🤖': robot(),
  '🌽': corn(),
  '🛵': scooter(),
}
