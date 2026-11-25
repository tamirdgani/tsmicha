/* Common drawings, batch 8: one per emoji the lessons use (viewBox 0 0 100 100). */

const S = '#2b2b3a'
const N = 'stroke="none"'
const Y = '#ffc83d'
const wrap = (s: string) =>
  `<g stroke="${S}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round">${s}</g>`
const flip = (s: string) => `<g transform="matrix(-1 0 0 1 100 0)">${s}</g>`
const r1 = (n: number) => Math.round(n * 10) / 10

const eye = (x: number, y: number, r = 4) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r1(r * 1.15)}" fill="${S}" ${N}/>` +
  `<circle cx="${r1(x + r * 0.35)}" cy="${r1(y - r * 0.45)}" r="${r1(r * 0.4)}" fill="#fff" ${N}/>`
const eyes = (cx: number, y: number, dx: number, r = 4) => eye(cx - dx, y, r) + eye(cx + dx, y, r)
const cheeks = (cx: number, y: number, dx: number, c = '#ff6b8b') =>
  `<ellipse cx="${cx - dx}" cy="${y}" rx="4.6" ry="2.8" fill="${c}" opacity=".45" ${N}/>` +
  `<ellipse cx="${cx + dx}" cy="${y}" rx="4.6" ry="2.8" fill="${c}" opacity=".45" ${N}/>`
/** Thick outlined tube (arms, necks, tails). */
const tube = (d: string, c: string, w = 7) =>
  `<path d="${d}" fill="none" stroke-width="${r1(w + 5.6)}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Union of shapes with one shared outline. */
const unite = (...els: string[]) =>
  els.map((e) => e.replace('/>', ' stroke-width="5.6"/>')).join('') + els.map((e) => e.replace('/>', ` ${N}/>`)).join('')
/** Round yellow emoji face. */
const face = (inner: string) =>
  wrap(
    `<circle cx="50" cy="50" r="42" fill="${Y}"/>` +
      `<ellipse cx="34" cy="24" rx="12" ry="6" fill="#fff" opacity=".35" transform="rotate(-25 34 24)" ${N}/>` +
      inner,
  )
/** Blue rounded tile (keycaps, arrow signs). */
const tile = (inner: string) =>
  wrap(
    `<rect x="8" y="8" width="84" height="84" rx="18" fill="#1d70d8"/>` +
      `<rect x="14" y="13" width="72" height="34" rx="12" fill="#fff" opacity=".14" ${N}/>` +
      inner,
  )
/** Thick white stroke glyph with a dark outline. */
const glyph = (d: string, w = 11) =>
  `<path d="${d}" fill="none" stroke-width="${w + 5}"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${w}"/>`
const drop = (x: number, y: number, c = '#5aa9f0') =>
  `<path d="M${x} ${y - 6}Q${x + 5} ${y + 1} ${x} ${y + 4}Q${x - 5} ${y + 1} ${x} ${y - 6}Z" fill="${c}" stroke-width="2"/>`

/* ---------- faces ---------- */
const squintEyes =
  `<path d="M26 34L40 41L26 48M74 34L60 41L74 48" fill="none" stroke-width="4.5"/>`

const astonished = face(
  `<path d="M24 22Q33 13 42 21M58 21Q67 13 76 22" fill="none" stroke-width="4"/>` +
    `<ellipse cx="35" cy="38" rx="8" ry="10" fill="#fff" stroke-width="2.4"/><ellipse cx="65" cy="38" rx="8" ry="10" fill="#fff" stroke-width="2.4"/>` +
    `<circle cx="35" cy="39" r="3.6" fill="${S}" ${N}/><circle cx="65" cy="39" r="3.6" fill="${S}" ${N}/>` +
    `<ellipse cx="50" cy="71" rx="9" ry="12" fill="#6b2a2a"/><ellipse cx="50" cy="76" rx="5" ry="4" fill="#ff8fab" ${N}/>`,
)

const tongueOut = face(
  squintEyes +
    `<path d="M24 56Q50 64 76 56Q74 84 50 85Q26 84 24 56Z" fill="#6b2a2a"/>` +
    `<path d="M27 58Q50 64 73 58L72 63Q50 67 28 63Z" fill="#fff" ${N}/>` +
    `<path d="M39 70Q39 95 51 95Q63 95 62 70Z" fill="#ff8fab"/><path d="M51 74V88" stroke="#e5677f" stroke-width="2"/>` +
    cheeks(50, 54, 30),
)

const persevering = face(
  `<path d="M22 28L38 32M78 28L62 32" fill="none" stroke-width="4"/>` +
    squintEyes.replace(/41/g, '44').replace(/34L/g, '37L').replace(/48"/, '51"').replace('L74 48', 'L74 51') +
    `<path d="M30 74Q35 66 40 72Q45 78 50 70Q55 64 60 72Q65 78 70 70" fill="none" stroke-width="4"/>` +
    drop(84, 30),
)

const zipper = face(
  eyes(50, 38, 15, 4.6) +
    `<path d="M24 26Q31 22 38 26M62 26Q69 22 76 26" fill="none" stroke-width="3"/>` +
    `<rect x="24" y="62" width="50" height="10" rx="5" fill="#9aa0a6"/>` +
    `<path d="M30 62V72M36 62V72M42 62V72M48 62V72M54 62V72M60 62V72M66 62V72" stroke-width="2"/>` +
    `<rect x="72" y="58" width="10" height="18" rx="3" fill="#c9ccd1"/><circle cx="77" cy="71" r="2" fill="${S}" ${N}/>`,
)

const hugging = face(
  `<path d="M26 40Q33 30 40 40M60 40Q67 30 74 40" fill="none" stroke-width="4"/>` +
    `<path d="M32 54Q50 74 68 54Z" fill="#6b2a2a"/>` +
    cheeks(50, 50, 26) +
    unite(
      `<ellipse cx="22" cy="78" rx="15" ry="11" fill="#ffb627" transform="rotate(-25 22 78)"/>`,
      `<rect x="9" y="60" width="9" height="18" rx="4.5" fill="#ffb627" transform="rotate(-30 13 69)"/>`,
    ) +
    unite(
      `<ellipse cx="78" cy="78" rx="15" ry="11" fill="#ffb627" transform="rotate(25 78 78)"/>`,
      `<rect x="82" y="60" width="9" height="18" rx="4.5" fill="#ffb627" transform="rotate(30 87 69)"/>`,
    ) +
    `<path d="M20 74L30 80M24 70L33 76M80 74L70 80M76 70L67 76" stroke="#d68a00" stroke-width="2"/>`,
)

const clown = wrap(
  `<circle cx="16" cy="40" r="12" fill="#f77f00"/><circle cx="14" cy="60" r="11" fill="#f77f00"/>` +
    `<circle cx="84" cy="40" r="12" fill="#f77f00"/><circle cx="86" cy="60" r="11" fill="#f77f00"/>` +
    `<circle cx="50" cy="52" r="38" fill="#fff6ee"/>` +
    `<path d="M40 16L50 2L60 16Z" fill="#2e9a48"/><circle cx="50" cy="3" r="4" fill="${Y}"/>` +
    `<path d="M34 28L41 41L34 54L27 41Z M66 28L73 41L66 54L59 41Z" fill="#1d70d8"/>` +
    eyes(50, 41, 16, 3.8) +
    `<path d="M28 64Q50 70 72 64Q66 88 50 88Q34 88 28 64Z" fill="#e5383b"/>` +
    `<path d="M36 70Q50 73 64 70Q58 80 50 80Q42 80 36 70Z" fill="#fff" ${N}/>` +
    `<circle cx="50" cy="56" r="9" fill="#e5383b"/><circle cx="47" cy="53" r="3" fill="#fff" opacity=".6" ${N}/>`,
)

/* ---------- hands ---------- */
const HAND = '#ffc83d'
const fist = wrap(
  unite(
    `<rect x="34" y="72" width="32" height="24" rx="4" fill="${HAND}"/>`,
    `<rect x="26" y="32" width="50" height="48" rx="16" fill="${HAND}"/>`,
  ) +
    `<rect x="26" y="18" width="14" height="30" rx="7" fill="${HAND}"/>` +
    `<rect x="38" y="13" width="14" height="33" rx="7" fill="${HAND}"/>` +
    `<rect x="50" y="13" width="14" height="33" rx="7" fill="${HAND}"/>` +
    `<rect x="62" y="17" width="14" height="31" rx="7" fill="${HAND}"/>` +
    `<rect x="21" y="44" width="42" height="15" rx="7.5" fill="#ffd45e" transform="rotate(-6 42 51)"/>` +
    `<path d="M40 88H60" stroke="#d68a00" stroke-width="2"/>`,
)

const punch = wrap(
  `<path d="M6 30L16 34M4 52H15M6 74L16 70M94 30L84 34M96 52H85M94 74L84 70" stroke="#f77f00" stroke-width="4"/>` +
    `<rect x="20" y="20" width="60" height="64" rx="22" fill="${HAND}"/>` +
    `<rect x="30" y="34" width="50" height="13" rx="6.5" fill="${HAND}"/>` +
    `<rect x="30" y="47" width="50" height="13" rx="6.5" fill="${HAND}"/>` +
    `<rect x="30" y="60" width="50" height="13" rx="6.5" fill="${HAND}"/>` +
    `<rect x="32" y="73" width="44" height="12" rx="6" fill="${HAND}"/>` +
    `<path d="M22 30Q30 18 52 22Q62 24 62 30Q60 36 50 34Q36 32 30 40Z" fill="#ffd45e"/>`,
)

const backHand = wrap(
  unite(
    `<rect x="35" y="78" width="32" height="18" rx="4" fill="${HAND}"/>`,
    `<rect x="28" y="42" width="47" height="46" rx="17" fill="${HAND}"/>`,
    `<rect x="29" y="16" width="11" height="40" rx="5.5" fill="${HAND}"/>`,
    `<rect x="41" y="8" width="11" height="44" rx="5.5" fill="${HAND}"/>`,
    `<rect x="53" y="10" width="11" height="42" rx="5.5" fill="${HAND}"/>`,
    `<rect x="64.5" y="20" width="10" height="34" rx="5" fill="${HAND}"/>`,
    `<rect x="16" y="42" width="11" height="32" rx="5.5" fill="${HAND}" transform="rotate(-38 22 58)"/>`,
  ) +
    `<path d="M40.5 22V54M52.5 14V52M64.2 22V54" stroke="#d68a00" stroke-width="2"/>` +
    [
      [31.5, 18],
      [43.5, 10],
      [55.5, 12],
      [66.8, 22],
    ]
      .map(([x, y]) => `<rect x="${x}" y="${y}" width="6" height="8" rx="3" fill="#ffe7a3" stroke-width="1.6"/>`)
      .join('') +
    `<path d="M40 70Q51 74 62 70" fill="none" stroke="#d68a00" stroke-width="2"/>`,
)

/* ---------- people ---------- */
const kidHead = (x: number, y: number, skin: string, hair: string) =>
  `<circle cx="${x}" cy="${y}" r="16" fill="${skin}"/>` +
  `<path d="M${x - 16} ${y - 1}Q${x - 16} ${y - 18} ${x} ${y - 18}Q${x + 16} ${y - 18} ${x + 16} ${y - 1}Q${x + 6} ${y - 9} ${x - 4} ${y - 8}Q${x - 10} ${y - 4} ${x - 16} ${y - 1}Z" fill="${hair}"/>`

const raiseHand = (() => {
  const skin = '#e0ac80'
  return wrap(
    tube('M66 66L74 40L76 18', skin, 8) +
      `<circle cx="76" cy="13" r="7" fill="${skin}"/>` +
      `<path d="M24 96Q24 60 48 60Q72 60 72 96Z" fill="#8b5cf6"/>` +
      `<path d="M62 64L70 44" fill="none" stroke="#8b5cf6" stroke-width="9"/>` +
      kidHead(46, 40, skin, '#7a4b2f') +
      `<path d="M30 38Q26 52 32 58" fill="none" stroke="#7a4b2f" stroke-width="5"/>` +
      eyes(46, 42, 6, 2.6) +
      cheeks(46, 48, 10) +
      `<path d="M40 49Q46 56 52 49Z" fill="#6b2a2a" stroke-width="2"/>`,
  )
})()

const shrug = (() => {
  const skin = '#b97a56'
  const arm = tube('M32 68L16 76L10 60', skin, 8) + `<ellipse cx="9" cy="56" rx="7" ry="4" fill="${skin}"/>`
  return wrap(
    arm +
      flip(arm) +
      `<path d="M26 96Q26 66 36 62Q50 58 64 62Q74 66 74 96Z" fill="#2e9a48"/>` +
      `<circle cx="50" cy="36" r="17" fill="${skin}"/>` +
      `<path d="M33 34Q32 16 50 16Q68 16 67 34Q60 24 50 26Q40 24 33 34Z" fill="#2f2f3a"/>` +
      `<path d="M38 30Q42 26 46 30M54 30Q58 26 62 30" fill="none" stroke-width="2.4"/>` +
      eyes(50, 37, 7, 2.6) +
      `<path d="M43 46Q47 44 50 46Q53 48 57 46" fill="none" stroke-width="2.4"/>`,
  )
})()

const hug = (() => {
  const a = '#f6d2b5',
    b = '#7a4b2f'
  return wrap(
    `<path d="M48 96Q48 56 66 54Q90 56 90 96Z" fill="#1d70d8"/>` +
      `<path d="M10 96Q10 56 34 54Q52 56 54 96Z" fill="#f77f00"/>` +
      tube('M30 66Q50 60 66 64Q76 68 76 78', '#f77f00', 9) +
      `<circle cx="77" cy="80" r="5.5" fill="${a}"/>` +
      kidHead(34, 34, a, '#c9772b') +
      kidHead(66, 34, b, '#2f2f3a') +
      `<path d="M28 36Q31 33 34 36M38 37Q41 34 44 37M56 37Q59 34 62 37M66 36Q69 33 72 36" fill="none" stroke-width="2.4"/>` +
      `<path d="M33 43Q37 47 41 43M59 43Q63 47 67 43" fill="none" stroke-width="2.2"/>` +
      cheeks(36, 41, 8),
  )
})()

const speakingHead = wrap(
  `<path d="M30 94Q32 80 26 72Q16 60 20 40Q24 16 50 14Q70 14 74 32Q75 40 80 46Q84 52 77 54Q79 58 74 60Q72 62 78 64Q76 68 73 70Q74 78 62 78Q58 80 58 94Z" fill="#5a5f6b"/>` +
    `<path d="M73 60L66 61L73 64Z" fill="${S}" stroke-width="1.6"/>` +
    `<path d="M84 36Q90 44 84 52M88 28Q98 44 88 60M84 60Q90 66 86 74" fill="none" stroke="#e5383b" stroke-width="3.5"/>`,
)

/* ---------- animals ---------- */
const monkeyFace = (cx: number, cy: number, r: number, eyesOn = true) => {
  const B = '#8d5524',
    F = '#f1c79b'
  const k = r / 20
  const p = (n: number) => r1(n * k)
  return (
    `<circle cx="${cx - p(21)}" cy="${cy}" r="${p(8)}" fill="${B}"/><circle cx="${cx + p(21)}" cy="${cy}" r="${p(8)}" fill="${B}"/>` +
    `<circle cx="${cx - p(21)}" cy="${cy}" r="${p(4.5)}" fill="${F}" ${N}/><circle cx="${cx + p(21)}" cy="${cy}" r="${p(4.5)}" fill="${F}" ${N}/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${B}"/>` +
    `<path d="M${cx} ${r1(cy - p(4))}Q${cx - p(4)} ${r1(cy - p(14))} ${cx - p(10)} ${r1(cy - p(12))}Q${cx - p(17)} ${r1(cy - p(8))} ${cx - p(14)} ${r1(cy + p(2))}Q${cx - p(17)} ${r1(cy + p(16))} ${cx} ${r1(cy + p(17))}Q${cx + p(17)} ${r1(cy + p(16))} ${cx + p(14)} ${r1(cy + p(2))}Q${cx + p(17)} ${r1(cy - p(8))} ${cx + p(10)} ${r1(cy - p(12))}Q${cx + p(4)} ${r1(cy - p(14))} ${cx} ${r1(cy - p(4))}Z" fill="${F}" stroke-width="2"/>` +
    (eyesOn ? eyes(cx, r1(cy - p(4)), p(6.5), p(2.6)) : '') +
    `<circle cx="${r1(cx - p(2))}" cy="${r1(cy + p(5))}" r="${p(1)}" fill="${S}" ${N}/><circle cx="${r1(cx + p(2))}" cy="${r1(cy + p(5))}" r="${p(1)}" fill="${S}" ${N}/>` +
    `<path d="M${cx - p(6)} ${r1(cy + p(9))}Q${cx} ${r1(cy + p(14))} ${cx + p(6)} ${r1(cy + p(9))}" fill="none" stroke-width="2.2"/>`
  )
}

const seeNoEvil = (() => {
  const B = '#8d5524',
    F = '#f1c79b'
  const hand = (x: number, rot: number) =>
    `<ellipse cx="${x}" cy="44" rx="14" ry="11" fill="${F}" transform="rotate(${rot} ${x} 44)"/>` +
    `<path d="M${x - 8} 40H${x + 8}M${x - 8} 46H${x + 8}" stroke="#c9945e" stroke-width="2" transform="rotate(${rot} ${x} 44)"/>`
  return wrap(
    monkeyFace(50, 50, 32, false) +
      tube('M14 92Q14 70 26 52', B, 9) +
      tube('M86 92Q86 70 74 52', B, 9) +
      hand(34, 15) +
      hand(66, -15),
  )
})()

const monkey = (() => {
  const B = '#8d5524',
    F = '#f1c79b'
  return wrap(
    tube('M64 84Q86 86 88 66Q90 50 78 50Q70 52 74 60', B, 6) +
      `<ellipse cx="40" cy="90" rx="9" ry="5" fill="${B}"/><ellipse cx="60" cy="90" rx="9" ry="5" fill="${B}"/>` +
      `<ellipse cx="50" cy="72" rx="18" ry="17" fill="${B}"/><ellipse cx="50" cy="75" rx="10" ry="11" fill="${F}" ${N}/>` +
      tube('M36 66Q26 74 30 84', B, 7) +
      tube('M64 66Q74 74 70 84', B, 7) +
      monkeyFace(50, 36, 20),
  )
})()

const camel = (() => {
  const C = '#d39a5a',
    D = '#b97a3f'
  return wrap(
    `<path d="M20 64L24 92M30 66L32 92M62 66L60 92M72 64L74 92" stroke-width="11"/>` +
      `<path d="M20 64L24 92M30 66L32 92M62 66L60 92M72 64L74 92" stroke="${D}" stroke-width="6"/>` +
      tube('M74 56Q84 48 84 30', C, 10) +
      `<path d="M16 62Q12 48 24 46Q28 24 38 26Q46 28 48 44Q52 46 56 44Q58 24 68 26Q78 28 76 46Q82 52 80 62Q72 70 48 70Q22 70 16 62Z" fill="${C}"/>` +
      `<path d="M14 54Q6 58 8 70" fill="none" stroke-width="3"/>` +
      `<ellipse cx="88" cy="28" rx="11" ry="7.5" fill="${C}"/><ellipse cx="80" cy="20" rx="2.5" ry="4" fill="${C}"/>` +
      eye(86, 25, 2.4) +
      `<path d="M96 30L93 30" stroke-width="2"/><path d="M84 34Q88 36 92 34" fill="none" stroke-width="2"/>`,
  )
})()

const polarBear = wrap(
  `<circle cx="24" cy="26" r="12" fill="#f4f6fb"/><circle cx="76" cy="26" r="12" fill="#f4f6fb"/>` +
    `<circle cx="24" cy="26" r="6" fill="#d9c9cf" ${N}/><circle cx="76" cy="26" r="6" fill="#d9c9cf" ${N}/>` +
    `<ellipse cx="50" cy="54" rx="40" ry="36" fill="#f4f6fb"/>` +
    `<path d="M16 66Q30 88 50 90Q70 88 84 66Q70 82 50 84Q30 82 16 66Z" fill="#c9d8ea" opacity=".7" ${N}/>` +
    `<ellipse cx="50" cy="66" rx="17" ry="13" fill="#fff"/>` +
    eyes(50, 46, 15, 4) +
    `<ellipse cx="50" cy="60" rx="7" ry="4.5" fill="${S}" ${N}/>` +
    `<path d="M50 64V68M44 70Q47 74 50 68Q53 74 56 70" fill="none" stroke-width="2.4"/>` +
    cheeks(50, 58, 26),
)

const bat = (() => {
  const W = '#4a4a5a'
  const wing =
    `<path d="M44 46Q30 26 4 34Q12 42 10 54Q19 50 24 60Q31 53 37 62Q41 55 46 58Z" fill="${W}"/>` +
    `<path d="M40 46L14 40M38 50L22 54M42 52L34 58" stroke="#6e6e80" stroke-width="2" fill="none"/>`
  return wrap(
    wing +
      flip(wing) +
      `<ellipse cx="50" cy="56" rx="11" ry="15" fill="#5b4a5e"/>` +
      `<path d="M41 34L38 18L47 28ZM59 34L62 18L53 28Z" fill="#5b4a5e"/>` +
      `<circle cx="50" cy="38" r="11" fill="#5b4a5e"/>` +
      `<circle cx="45" cy="37" r="3.6" fill="#fff" stroke-width="1.6"/><circle cx="55" cy="37" r="3.6" fill="#fff" stroke-width="1.6"/>` +
      `<circle cx="45.5" cy="37.5" r="1.7" fill="${S}" ${N}/><circle cx="54.5" cy="37.5" r="1.7" fill="${S}" ${N}/>` +
      `<path d="M46 44L47.5 47.5L49 44M51 44L52.5 47.5L54 44" fill="#fff" stroke-width="1.4"/>` +
      `<path d="M45 71L44 76M55 71L56 76" stroke-width="2.4"/>`,
  )
})()

const blackBird = wrap(
  `<path d="M28 58L6 70L10 60L4 50L26 50Z" fill="#2f2f3a"/>` +
    `<path d="M48 72L46 90M58 72L58 90M40 90H52M52 90H64" stroke="#4a4a5a" stroke-width="3.2" fill="none"/>` +
    unite(
      `<ellipse cx="48" cy="56" rx="28" ry="19" fill="#2f2f3a" transform="rotate(-12 48 56)"/>`,
      `<circle cx="72" cy="34" r="15" fill="#2f2f3a"/>`,
    ) +
    `<path d="M84 29L98 35L84 41Z" fill="#4a4a5a"/>` +
    `<path d="M30 52Q44 40 62 50Q56 66 36 66Q26 62 30 52Z" fill="#4a4a5a"/>` +
    `<path d="M38 56Q46 52 54 56" fill="none" stroke="#6e6e80" stroke-width="2"/>` +
    `<circle cx="75" cy="31" r="5" fill="#fff" stroke-width="1.8"/><circle cx="76.5" cy="31" r="2.6" fill="${S}" ${N}/>`,
)

/* ---------- objects ---------- */
const die = wrap(
  `<path d="M50 10L88 28L50 46L12 28Z" fill="#fff"/>` +
    `<path d="M12 28L50 46V92L12 72Z" fill="#e6e9f0"/>` +
    `<path d="M50 46L88 28V72L50 92Z" fill="#d2d7e1"/>` +
    `<ellipse cx="50" cy="28" rx="7" ry="4" fill="#e5383b" ${N}/>` +
    `<ellipse cx="22" cy="45" rx="3.6" ry="4.6" fill="${S}" ${N}/><ellipse cx="40" cy="72" rx="3.6" ry="4.6" fill="${S}" ${N}/>` +
    `<ellipse cx="59" cy="73" rx="3.6" ry="4.6" fill="${S}" ${N}/><ellipse cx="69" cy="60" rx="3.6" ry="4.6" fill="${S}" ${N}/><ellipse cx="79" cy="47" rx="3.6" ry="4.6" fill="${S}" ${N}/>`,
)

const yoyo = wrap(
  `<path d="M50 14V56" stroke-width="2.5"/><circle cx="50" cy="9" r="5" fill="none" stroke-width="2.5"/>` +
    `<circle cx="50" cy="60" r="34" fill="#e5383b"/>` +
    `<circle cx="50" cy="60" r="22" fill="#ff6b6e" stroke-width="2.2"/>` +
    `<circle cx="50" cy="60" r="7" fill="#fff"/>` +
    `<path d="M26 46Q32 34 44 31" fill="none" stroke="#fff" stroke-width="3.5" opacity=".7"/>`,
)

const volcano = wrap(
  `<circle cx="36" cy="16" r="9" fill="#b8bcc2"/><circle cx="64" cy="15" r="9" fill="#b8bcc2"/><circle cx="50" cy="11" r="11" fill="#b8bcc2"/>` +
    `<path d="M6 92L36 32Q50 26 64 32L94 92Z" fill="#8d5524"/>` +
    `<path d="M64 32L94 92H70Q66 60 64 32Z" fill="#6e3f17" opacity=".6" ${N}/>` +
    `<path d="M36 32Q50 26 64 32L60 44Q57 38 55 54Q52 62 49 50Q47 40 44 46Q42 54 40 46Q38 38 36 32Z" fill="#f77f00"/>` +
    `<path d="M40 31Q50 27 60 31Q50 35 40 31Z" fill="#e5383b" ${N}/>` +
    `<circle cx="42" cy="22" r="3.5" fill="#f77f00" stroke-width="2"/><circle cx="58" cy="23" r="3" fill="#e5383b" stroke-width="2"/>`,
)

const moon = (fill: string, crater: string) =>
  wrap(
    `<circle cx="50" cy="50" r="42" fill="${fill}"/>` +
      `<circle cx="36" cy="36" r="9" fill="${crater}" ${N}/><circle cx="64" cy="58" r="12" fill="${crater}" ${N}/>` +
      `<circle cx="38" cy="70" r="6" fill="${crater}" ${N}/><circle cx="66" cy="28" r="4.5" fill="${crater}" ${N}/>` +
      `<circle cx="22" cy="54" r="4" fill="${crater}" ${N}/>`,
  )

const framePic = wrap(
  `<rect x="8" y="14" width="84" height="72" rx="4" fill="#c8862a"/>` +
    `<path d="M8 14L20 26M92 14L80 26M8 86L20 74M92 86L80 74" stroke-width="2"/>` +
    `<rect x="20" y="26" width="60" height="48" fill="#9bd7ff"/>` +
    `<circle cx="66" cy="39" r="6" fill="${Y}" stroke-width="2"/>` +
    `<path d="M20 64L34 46L48 64Z" fill="#9aa0a6" stroke-width="2"/>` +
    `<path d="M20 74V66Q36 54 52 64Q66 56 80 64V74Z" fill="#2e9a48" stroke-width="2"/>`,
)

const tent = wrap(
  `<path d="M2 88H98" stroke-width="3"/><path d="M50 16V6" stroke-width="3.5"/>` +
    `<path d="M50 6L62 10L50 13Z" fill="#e5383b" stroke-width="2"/>` +
    `<path d="M50 16L6 86H94Z" fill="#1d70d8"/>` +
    `<path d="M50 34L36 86H64Z" fill="#2f2f3a"/>` +
    `<path d="M50 34Q44 64 28 86H40Q46 60 50 34Z" fill="#5aa0f0"/><path d="M50 34Q56 64 72 86H60Q54 60 50 34Z" fill="#5aa0f0"/>` +
    `<path d="M50 16L6 86H18Z" fill="#fff" opacity=".2" ${N}/>`,
)

const triangle = wrap(
  `<path d="M50 12L90 84H10Z" fill="#e5383b" stroke-width="3.5"/>` +
    `<path d="M50 26L28 66" stroke="#fff" stroke-width="4" opacity=".4"/>`,
)

const greenHeart = wrap(
  `<path d="M50 88C20 68 8 50 12 32C16 15 38 11 50 30C62 11 84 15 88 32C92 50 80 68 50 88Z" fill="#2e9a48" stroke-width="3.2"/>` +
    `<ellipse cx="29" cy="32" rx="7" ry="4.5" fill="#fff" opacity=".45" transform="rotate(-35 29 32)" ${N}/>`,
)

const cart = wrap(
  `<path d="M4 16H14L26 70H80" fill="none" stroke-width="9"/><path d="M4 16H14L26 70H80" fill="none" stroke="#9aa0a6" stroke-width="4.5"/>` +
    `<path d="M4 16H10" stroke="#e5383b" stroke-width="6"/>` +
    `<path d="M16 26H90L80 62H24Z" fill="#dfe3e8"/>` +
    `<path d="M33 26L36 62M50 26V62M67 26L64 62M18 38H87M21 50H84" fill="none" stroke="#7b8189" stroke-width="2"/>` +
    `<circle cx="34" cy="84" r="7" fill="#4a4a5a"/><circle cx="72" cy="84" r="7" fill="#4a4a5a"/>` +
    `<path d="M34 77L32 70M72 77L74 70" stroke-width="3"/>`,
)

const stormCloud = wrap(
  unite(
    `<circle cx="30" cy="42" r="16" fill="#8c939b"/>`,
    `<circle cx="52" cy="30" r="20" fill="#8c939b"/>`,
    `<circle cx="72" cy="42" r="15" fill="#8c939b"/>`,
    `<rect x="16" y="40" width="70" height="20" rx="10" fill="#8c939b"/>`,
  ) +
    `<ellipse cx="44" cy="24" rx="9" ry="4" fill="#fff" opacity=".35" ${N}/>` +
    `<path d="M54 50L40 72H50L44 94L68 64H57L64 50Z" fill="${Y}"/>` +
    drop(24, 74) +
    drop(32, 88) +
    drop(78, 72) +
    drop(84, 87),
)

const tornado = (() => {
  const bands: [number, number, number, number][] = [
    [47, 89, 5, 3.5],
    [45, 80, 8, 4],
    [48, 70, 12, 5],
    [52, 59, 17, 6],
    [54, 46, 24, 7],
    [52, 32, 32, 8],
    [50, 18, 40, 9],
  ]
  return wrap(
    bands
      .map(
        ([x, y, rx, ry], i) =>
          `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${i % 2 ? '#9aa0a6' : '#b8bcc2'}"/>`,
      )
      .join('') +
      `<path d="M26 18Q50 24 74 16M34 32Q52 36 70 30" fill="none" stroke="#7b8189" stroke-width="2"/>` +
      `<circle cx="20" cy="62" r="2.5" fill="#8d5524" stroke-width="1.6"/><circle cx="80" cy="74" r="2.5" fill="#8d5524" stroke-width="1.6"/>`,
  )
})()

const bin = wrap(
  `<path d="M16 20L26 90Q50 96 74 90L84 20Z" fill="#9aa0a6"/>` +
    `<path d="M32 30L36 88M44 31L45 91M56 31L55 91M68 30L64 88" stroke="#c9ccd1" stroke-width="3"/>` +
    `<ellipse cx="50" cy="20" rx="34" ry="8" fill="#c9ccd1"/><ellipse cx="50" cy="21" rx="27" ry="4.5" fill="#5f656e" ${N}/>`,
)

const megaphone = wrap(
  `<path d="M40 60L46 82H56L52 58Z" fill="#4a4a5a"/>` +
    `<rect x="12" y="38" width="20" height="24" rx="5" fill="#9aa0a6"/>` +
    `<path d="M30 40L74 16V84L30 60Z" fill="#e5383b"/>` +
    `<ellipse cx="74" cy="50" rx="8" ry="34" fill="#f4f6fb"/><ellipse cx="75" cy="50" rx="4" ry="22" fill="#c9ccd1" ${N}/>` +
    `<path d="M36 44L68 28" stroke="#fff" stroke-width="3" opacity=".5"/>` +
    `<path d="M88 36Q93 50 88 64M94 28Q101 50 94 72" fill="none" stroke-width="3"/>`,
)

const controller = wrap(
  `<path d="M22 32H78Q94 32 95 56Q96 80 83 80Q74 80 68 66H32Q26 80 17 80Q4 80 5 56Q6 32 22 32Z" fill="#5c6270"/>` +
    `<path d="M22 47H30V39H36V47H44V53H36V61H30V53H22Z" fill="#e6e9f0" stroke-width="2"/>` +
    `<circle cx="72" cy="42" r="4.5" fill="${Y}" stroke-width="2"/><circle cx="72" cy="60" r="4.5" fill="#2e9a48" stroke-width="2"/>` +
    `<circle cx="63" cy="51" r="4.5" fill="#1d70d8" stroke-width="2"/><circle cx="81" cy="51" r="4.5" fill="#e5383b" stroke-width="2"/>` +
    `<rect x="44" y="40" width="5" height="3.5" rx="1.5" fill="#9aa0a6" ${N}/><rect x="52" y="40" width="5" height="3.5" rx="1.5" fill="#9aa0a6" ${N}/>`,
)

const clock3 = wrap(
  `<circle cx="50" cy="50" r="42" fill="#9aa0a6"/><circle cx="50" cy="50" r="34" fill="#fff"/>` +
    `<path d="M50 20V26M80 50H74M50 80V74M20 50H26" stroke-width="3.5"/>` +
    `<path d="M50 50V24" stroke-width="4.5"/><path d="M50 50H70" stroke-width="6"/>` +
    `<circle cx="50" cy="50" r="4" fill="#e5383b" stroke-width="2"/>`,
)

const buoy = wrap(
  `<circle cx="50" cy="50" r="32" fill="none" stroke-width="28"/>` +
    `<circle cx="50" cy="50" r="32" fill="none" stroke="#e5383b" stroke-width="22.4"/>` +
    `<circle cx="50" cy="50" r="32" fill="none" stroke="#fff" stroke-width="22.4" stroke-dasharray="20 30.27" stroke-dashoffset="10" stroke-linecap="butt"/>` +
    `<circle cx="50" cy="50" r="32" fill="none" stroke="#8d5524" stroke-width="2" stroke-dasharray="6 4"/>`,
)

const cityscape = (() => {
  const b = (x: number, y: number, w: number, c: string) => {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${90 - y}" fill="${c}"/>`
    for (let yy = y + 6; yy < 84; yy += 12)
      for (let xx = x + 4; xx + 4 <= x + w - 3; xx += 7)
        s += `<rect x="${xx}" y="${yy}" width="4" height="5" fill="#dff1ff" ${N}/>`
    return s
  }
  return wrap(
    `<path d="M71 16V6" stroke-width="2.5"/>` +
      b(26, 22, 22, '#5b8fd8') +
      b(64, 16, 16, '#6c7fa8') +
      b(6, 42, 22, '#8fb4e0') +
      b(44, 34, 22, '#9aa0a6') +
      b(78, 48, 16, '#b0b8c4') +
      `<path d="M4 90H96" stroke-width="3"/>`,
  )
})()

const nightCity = (() => {
  const b = (x: number, y: number, w: number) => {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${92 - y}" fill="#363b63" stroke-width="2"/>`
    for (let yy = y + 5; yy < 86; yy += 9)
      for (let xx = x + 3; xx + 4 <= x + w - 2; xx += 7)
        if ((xx * 7 + yy * 3) % 5 < 3) s += `<rect x="${xx}" y="${yy}" width="3.5" height="4" fill="${Y}" ${N}/>`
    return s
  }
  const star = (x: number, y: number, r: number) =>
    `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="#ffe08a" ${N}/>`
  return wrap(
    `<rect x="6" y="6" width="88" height="88" rx="14" fill="#1f2a5c"/>` +
      `<path d="M72 14A12 12 0 1 0 82 32A10 10 0 1 1 72 14Z" fill="${Y}" stroke-width="2"/>` +
      star(22, 20, 5) +
      star(44, 14, 3.5) +
      star(56, 28, 4) +
      star(30, 36, 3) +
      `<g stroke-width="2">` +
      b(10, 54, 18) +
      b(27, 40, 18) +
      b(44, 60, 16) +
      b(59, 46, 18) +
      b(76, 62, 16) +
      `</g>` +
      `<rect x="6" y="6" width="88" height="88" rx="14" fill="none"/>`,
  )
})()

const stopSign = wrap(
  `<path d="M88.8 66.1L66.1 88.8H33.9L11.2 66.1V33.9L33.9 11.2H66.1L88.8 33.9Z" fill="#e5383b" stroke-width="3"/>` +
    `<path d="M83.3 63.8L63.8 83.3H36.2L16.7 63.8V36.2L36.2 16.7H63.8L83.3 36.2Z" fill="none" stroke="#fff" stroke-width="3.5"/>` +
    `<rect x="25" y="43" width="50" height="14" rx="6" fill="#fff" stroke-width="2"/>`,
)

const note = wrap(
  `<path d="M50 72V16Q58 30 74 34Q86 42 78 60Q80 46 66 44Q56 42 50 38" fill="#2f2f3a"/>` +
    `<ellipse cx="38" cy="74" rx="15" ry="11" fill="#2f2f3a" transform="rotate(-22 38 74)"/>` +
    `<path d="M50 72V18" stroke="#2f2f3a" stroke-width="3.2"/>` +
    `<ellipse cx="33" cy="70" rx="5" ry="3" fill="#fff" opacity=".3" transform="rotate(-22 33 70)" ${N}/>`,
)

const keycap = (d: string, w = 11) => tile(glyph(d, w))

const flagCheck = (() => {
  let cells = ''
  const cw = 16.5,
    ch = 15.33
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 4; c++)
      if ((r + c) % 2 === 0)
        cells += `<rect x="${r1(24 + c * cw)}" y="${r1(12 + r * ch)}" width="${cw}" height="${ch}" fill="#2f2f3a" ${N}/>`
  return wrap(
    `<path d="M20 8V94" stroke-width="8"/><path d="M20 8V94" stroke="#9aa0a6" stroke-width="3.5"/>` +
      `<rect x="24" y="12" width="66" height="46" fill="#fff"/>` +
      cells +
      `<rect x="24" y="12" width="66" height="46" fill="none"/>` +
      `<circle cx="20" cy="7" r="4" fill="${Y}" stroke-width="2"/>`,
  )
})()

const office = (() => {
  let w = ''
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 4; c++)
      w += `<rect x="${29 + c * 11}" y="${20 + r * 10}" width="7" height="6" fill="#8fd3ff" stroke-width="1.5"/>`
  return wrap(
    `<rect x="22" y="12" width="56" height="80" fill="#c9ccd1"/>` +
      `<rect x="18" y="8" width="64" height="6" rx="2" fill="#9aa0a6"/>` +
      w +
      `<rect x="42" y="78" width="16" height="14" fill="#4a4a5a" stroke-width="2"/>` +
      `<path d="M8 92H92" stroke-width="3"/>`,
  )
})()

const abacus = (() => {
  const rows: [number, string][] = [
    [28, '#e5383b'],
    [44, '#ffc83d'],
    [60, '#1d70d8'],
    [76, '#2e9a48'],
  ]
  let s = ''
  rows.forEach(([y, c], i) => {
    s += `<path d="M18 ${y}H82" stroke="#7b8189" stroke-width="2.4"/>`
    const left = 2 + (i % 3)
    for (let k = 0; k < 5; k++) {
      const x = k < left ? 24 + k * 9 : 76 - (4 - k) * 9
      s += `<ellipse cx="${x}" cy="${y}" rx="4.6" ry="6" fill="${c}" stroke-width="2"/>`
    }
  })
  return wrap(
    `<rect x="8" y="10" width="10" height="82" rx="3" fill="#8d5524"/><rect x="82" y="10" width="10" height="82" rx="3" fill="#8d5524"/>` +
      s +
      `<rect x="8" y="10" width="84" height="9" rx="3" fill="#a8692f"/><rect x="8" y="84" width="84" height="9" rx="3" fill="#a8692f"/>`,
  )
})()

const scroll = wrap(
  `<rect x="22" y="18" width="56" height="64" fill="#f6e2b3"/>` +
    `<path d="M30 32H70M30 42H66M30 52H70M30 62H60M30 72H68" stroke="#b08a4a" stroke-width="3"/>` +
    `<rect x="14" y="8" width="72" height="14" rx="7" fill="#e8c37a"/><ellipse cx="86" cy="15" rx="4" ry="7" fill="#c99a4c"/>` +
    `<rect x="14" y="78" width="72" height="14" rx="7" fill="#e8c37a"/><ellipse cx="14" cy="85" rx="4" ry="7" fill="#c99a4c"/>`,
)

const earth = wrap(
  `<circle cx="50" cy="50" r="42" fill="#1d70d8"/>` +
    `<g fill="#2e9a48" stroke-width="2">` +
    `<path d="M36 12Q48 9 60 14Q68 18 63 26Q57 24 53 30Q47 26 41 30Q34 24 36 12Z"/>` +
    `<path d="M34 36Q50 32 64 36Q72 44 68 56Q62 64 60 76Q56 86 50 89Q46 78 44 66Q36 60 31 50Q29 42 34 36Z"/>` +
    `<path d="M68 30Q80 28 86 38Q80 46 72 40Z"/><ellipse cx="73" cy="70" rx="3" ry="6"/>` +
    `</g>` +
    `<ellipse cx="28" cy="28" rx="9" ry="5" fill="#fff" opacity=".3" transform="rotate(-40 28 28)" ${N}/>` +
    `<circle cx="50" cy="50" r="42" fill="none"/>`,
)

const bell = wrap(
  `<circle cx="50" cy="15" r="6" fill="none" stroke-width="4"/>` +
    `<circle cx="50" cy="84" r="8" fill="#c98a1a"/>` +
    `<path d="M22 74Q26 62 27 46Q28 22 50 20Q72 22 73 46Q74 62 78 74Z" fill="${Y}"/>` +
    `<rect x="14" y="70" width="72" height="11" rx="5.5" fill="#f2b21b"/>` +
    `<path d="M36 34Q38 28 44 26M35 42V60" fill="none" stroke="#fff" stroke-width="3.5" opacity=".6"/>` +
    `<path d="M8 40Q6 50 10 58M92 40Q94 50 90 58" fill="none" stroke-width="3"/>`,
)

const oldKey = wrap(
  `<g transform="rotate(-35 50 50)">` +
    `<path d="M36 46H90V54H36Z" fill="#d9a520"/>` +
    `<path d="M76 54V68H82V62H88V54" fill="#d9a520"/>` +
    `<circle cx="24" cy="50" r="13" fill="none" stroke-width="14"/><circle cx="24" cy="50" r="13" fill="none" stroke="#d9a520" stroke-width="8.4"/>` +
    `<circle cx="24" cy="31" r="5" fill="#d9a520"/><circle cx="24" cy="69" r="5" fill="#d9a520"/><circle cx="6" cy="50" r="5" fill="#d9a520"/>` +
    `<rect x="38" y="43" width="6" height="14" rx="2" fill="#b8860b"/>` +
    `<path d="M48 48.5H84" stroke="#fff3b0" stroke-width="2" opacity=".7"/>` +
    `</g>`,
)

const bowling = wrap(
  `<path d="M34 8Q26 8 26 22Q26 32 30 37Q20 50 22 70Q24 88 34 93Q44 88 46 70Q48 50 38 37Q42 32 42 22Q42 8 34 8Z" fill="#fff"/>` +
    `<path d="M28.5 28Q34 31 39.5 28M29 34Q34 37 39 34" fill="none" stroke="#e5383b" stroke-width="3.4"/>` +
    `<circle cx="66" cy="70" r="25" fill="#2b4fa8"/>` +
    `<circle cx="60" cy="58" r="3.4" fill="${S}" ${N}/><circle cx="70" cy="56" r="3.4" fill="${S}" ${N}/><circle cx="66" cy="66" r="3.4" fill="${S}" ${N}/>` +
    `<path d="M50 76Q52 86 60 90" fill="none" stroke="#fff" stroke-width="3" opacity=".4"/>`,
)

const heavyX = wrap(
  unite(
    `<rect x="12" y="40" width="76" height="20" rx="9" fill="#2f2f3a" transform="rotate(45 50 50)"/>`,
    `<rect x="12" y="40" width="76" height="20" rx="9" fill="#2f2f3a" transform="rotate(-45 50 50)"/>`,
  ) + `<path d="M25 27L33 35" stroke="#6e6e80" stroke-width="3"/>`,
)

const endArrow = wrap(
  `<path d="M86 28H24" stroke-width="8"/><path d="M34 16L18 28L34 40Z" fill="#2f2f3a" stroke-width="3"/>` +
    `<path d="M30 54H14V84H30M14 69H27M40 84V54L58 84V54M68 54V84H73Q90 84 90 69Q90 54 73 54Z" fill="none" stroke-width="7.5"/>`,
)

export const ART: Record<string, string> = {
  '🎲': die,
  '🪀': yoyo,
  '🌋': volcano,
  '🌕': moon(Y, '#e6a92a'),
  '🖼': framePic,
  '⛺': tent,
  '🔺': triangle,
  '💚': greenHeart,
  '🛒': cart,
  '⛈': stormCloud,
  '🌑': moon('#4a4a5a', '#3a3a48'),
  '😲': astonished,
  '🤡': clown,
  '🙋': raiseHand,
  '✊': fist,
  '🙈': seeNoEvil,
  '😝': tongueOut,
  '🌪': tornado,
  '🗑': bin,
  '🫂': hug,
  '🤷': shrug,
  '🗣': speakingHead,
  '👊': punch,
  '🤐': zipper,
  '📢': megaphone,
  '😣': persevering,
  '🎮': controller,
  '🕒': clock3,
  '🐫': camel,
  '🛟': buoy,
  '🏙': cityscape,
  '🌃': nightCity,
  '🐻‍❄': polarBear,
  '🛑': stopSign,
  '🦇': bat,
  '🎵': note,
  '0⃣': keycap('M50 28Q36 28 36 50Q36 72 50 72Q64 72 64 50Q64 28 50 28Z'),
  '7⃣': keycap('M35 29H65L47 72'),
  '🔢': keycap(
    'M20 40L27 33V67M38 40Q46 31 54 38Q58 46 38 67H56M66 36Q76 30 80 40Q81 48 71 50Q82 52 81 60Q78 70 65 64',
    8,
  ),
  '🏁': flagCheck,
  '🏢': office,
  '🧮': abacus,
  '🤚': backHand,
  '↩': tile(
    glyph('M68 72V52Q68 36 52 36H38', 11) +
      `<path d="M40 20L20 36L40 52Z" fill="#fff" stroke-width="2.8"/><path d="M36 36H44" stroke="#fff" stroke-width="11" stroke-linecap="butt"/>`,
  ),
  '🔚': endArrow,
  '📜': scroll,
  '🌍': earth,
  '🔔': bell,
  '🐦‍⬛': blackBird,
  '🐒': monkey,
  '↔': tile(
    glyph('M32 50H68', 11) +
      `<path d="M34 34L14 50L34 66Z" fill="#fff" stroke-width="2.8"/><path d="M66 34L86 50L66 66Z" fill="#fff" stroke-width="2.8"/>` +
      `<path d="M30 50H70" stroke="#fff" stroke-width="11" stroke-linecap="butt"/>`,
  ),
  '🗝': oldKey,
  '🤗': hugging,
  '🎳': bowling,
  '✖': heavyX,
}
