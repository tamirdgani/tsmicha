/* Common drawings, batch 6: one per emoji the lessons use (viewBox 0 0 100 100). */

const S = '#2b2b3a'
const N = 'stroke="none"'
const R = '#e5383b', B = '#1d70d8', Y = '#ffc83d', G = '#2e9a48', O = '#f77f00', P = '#8b5cf6'
const K = '#ff8fab', BR = '#8d5524', BK = '#2f2f3a', GR = '#9aa0a6'
/** Wraps a drawing in the shared outline style (children inherit the stroke). */
const wrap = (s: string) =>
  `<g stroke="${S}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round">${s}</g>`
const line = (d: string, w = 2.5, c = S) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Thick outlined tube (ropes, stems, necks). */
const tube = (d: string, c: string, w = 7) =>
  `<path d="${d}" fill="none" stroke-width="${w + 5.6}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Draws shapes so their union gets one shared outline (outlines first, fills on top). */
const unite = (...els: string[]) =>
  els.map((e) => e.replace('/>', ' stroke-width="5.6"/>')).join('') + els.map((e) => e.replace('/>', ` ${N}/>`)).join('')
const eye = (x: number, y: number, r = 4) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.15}" fill="${S}" ${N}/>` +
  `<circle cx="${x + r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.4}" fill="#fff" ${N}/>`
const hl = (cx: number, cy: number, rx: number, ry: number, rot = -30) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".45" ${N} transform="rotate(${rot} ${cx} ${cy})"/>`
const HEART = 'M50 86C20 66 8 50 10 34C12 18 32 12 42 22C46 26 48 29 50 32C52 29 54 26 58 22C68 12 88 18 90 34C92 50 80 66 50 86Z'
const heart = (c: string) => wrap(`<path d="${HEART}" fill="${c}"/>` + hl(28, 34, 7, 4.5))
const disc = (c: string) => wrap(`<circle cx="50" cy="50" r="40" fill="${c}"/>` + hl(34, 34, 10, 6))
/** Rounded tile (arrows, scenes). */
const tile = (c: string, inner: string) => wrap(`<rect x="9" y="9" width="82" height="82" rx="17" fill="${c}"/>` + inner)

// ---- hands -------------------------------------------------------------
const SK = '#ffc83d', SKD = '#e0a21a'
/** Open hand, palm towards us, fingers up, centred around (0,0). */
const openHand = (tf: string, c = SK) =>
  `<g transform="${tf}">` +
  unite(
    `<rect x="-15" y="-6" width="30" height="32" rx="13" fill="${c}"/>`,
    `<rect x="-15" y="-27" width="7.6" height="30" rx="3.8" fill="${c}"/>`,
    `<rect x="-7.4" y="-33" width="7.6" height="34" rx="3.8" fill="${c}"/>`,
    `<rect x="0.2" y="-31" width="7.6" height="32" rx="3.8" fill="${c}"/>`,
    `<rect x="7.6" y="-24" width="7.4" height="28" rx="3.7" fill="${c}"/>`,
    `<ellipse cx="-17" cy="6" rx="5" ry="12" fill="${c}" transform="rotate(-38 -17 6)"/>`,
  ) +
  line('M-7.4 -14V-4M0.2 -14V-4M7.6 -10V-2', 2) +
  `</g>`
/** Fist with raised fingers given as [x, top, angle] triples. */
const fistHand = (fingers: [number, number, number][], c = SK) =>
  unite(
    `<rect x="31" y="48" width="38" height="42" rx="14" fill="${c}"/>`,
    ...fingers.map(([x, t, a]) => `<rect x="${x - 5}" y="${t}" width="10" height="${62 - t}" rx="5" fill="${c}" transform="rotate(${a} ${x} 60)"/>`),
  ) +
  `<path d="M34 64Q44 58 56 62Q50 70 40 70" fill="${SKD}" stroke-width="2.2"/>` +
  line('M44 76H66M45 84H64', 2.2)

// ---- people ------------------------------------------------------------
const bust = (skin: string, shirt: string, top: string, face: string) =>
  wrap(
    `<path d="M14 96Q14 70 34 66H66Q86 70 86 96Z" fill="${shirt}"/>` +
    `<rect x="43" y="56" width="14" height="14" fill="${skin}"/>` +
    `<circle cx="26" cy="42" r="6" fill="${skin}"/><circle cx="74" cy="42" r="6" fill="${skin}"/>` +
    `<circle cx="50" cy="38" r="23" fill="${skin}"/>` + top +
    eye(41, 40, 3.2) + eye(59, 40, 3.2) +
    `<ellipse cx="34" cy="48" rx="4" ry="2.4" fill="#ff6b8b" opacity=".4" ${N}/><ellipse cx="66" cy="48" rx="4" ry="2.4" fill="#ff6b8b" opacity=".4" ${N}/>` +
    face,
  )

// ---- drawings ------------------------------------------------------------
const knot = () => {
  const C = '#d9a066'
  const rope = (d: string) => tube(d, C, 10) + `<path d="${d}" fill="none" stroke="#b07a3a" stroke-width="10" stroke-dasharray="2.5 6" stroke-linecap="butt"/>`
  return wrap(
    rope('M50 52C62 36 72 20 56 14C40 10 32 28 44 44') +
    rope('M8 74C30 74 40 64 50 52') +
    rope('M44 44C52 58 66 70 92 70') +
    line('M8 69v10M92 65v10', 2),
  )
}
const coffee = () =>
  wrap(
    `<ellipse cx="50" cy="84" rx="36" ry="8" fill="#e8e3da"/>` +
    `<path d="M74 52C90 50 90 72 72 72" fill="none" stroke-width="12"/><path d="M74 52C90 50 90 72 72 72" fill="none" stroke="#fff" stroke-width="6.4"/>` +
    `<path d="M22 44H78V64Q78 84 50 84Q22 84 22 64Z" fill="#fff"/>` +
    `<ellipse cx="50" cy="44" rx="28" ry="7" fill="#7a4b2f"/>` +
    `<path d="M24 60H76" stroke="#3ab0c4" stroke-width="5"/>` +
    line('M38 34Q32 26 38 20Q44 14 38 8M54 34Q48 26 54 20Q60 14 54 8', 3, GR),
  )
const shower = () =>
  wrap(
    tube('M14 10V22Q14 30 24 30H42', GR, 6) +
    `<path d="M40 22L62 30L56 46L34 38Z" fill="#c9ced4"/>` +
    `<path d="M32 36Q30 50 46 56Q60 60 66 48L58 28Z" fill="${GR}"/>` +
    [[36, 66], [50, 70], [64, 64], [30, 80], [46, 86], [62, 82], [76, 76]]
      .map(([x, y]) => `<path d="M${x} ${y - 7}Q${x + 5} ${y} ${x} ${y + 4}Q${x - 5} ${y} ${x} ${y - 7}Z" fill="#5fb4f2" stroke-width="2"/>`)
      .join(''),
  )
const clap = () =>
  wrap(
    openHand('translate(36 56) rotate(-28)') + openHand('translate(64 54) rotate(26) scale(-1 1)') +
    line('M20 18l6 8M50 8v9M80 18l-6 8', 3, O),
  )
const bridgeNight = () =>
  tile(
    '#2b3a73',
    `<circle cx="72" cy="26" r="8" fill="#fff4c2"/>` +
    `<circle cx="24" cy="22" r="1.6" fill="#fff" ${N}/><circle cx="44" cy="16" r="1.4" fill="#fff" ${N}/><circle cx="56" cy="30" r="1.2" fill="#fff" ${N}/>` +
    `<path d="M10 72H90V74Q90 90 74 90H26Q10 90 10 74Z" fill="#1d4f9a"/>` +
    line('M10 56Q22 66 30 36Q50 64 70 36Q78 66 90 56', 2.5, O) +
    `<rect x="27" y="30" width="6" height="42" fill="${O}" stroke-width="2"/><rect x="67" y="30" width="6" height="42" fill="${O}" stroke-width="2"/>` +
    `<rect x="9" y="58" width="82" height="6" fill="${R}" stroke-width="2"/>` +
    line('M16 80h10M40 82h14M66 79h12', 2, '#8ec5ff'),
  )
const bucket = () =>
  wrap(
    `<path d="M20 34Q50 -4 80 34" fill="none" stroke-width="4"/>` +
    `<path d="M18 34H82L74 90H26Z" fill="${B}"/>` +
    `<ellipse cx="50" cy="34" rx="32" ry="8" fill="#5fa0ec"/>` +
    `<ellipse cx="50" cy="35" rx="25" ry="4.5" fill="#164f9c" ${N}/>` +
    `<path d="M22 56H78" stroke-width="2.5"/>` + `<path d="M30 46L34 82" stroke="#fff" stroke-width="4" opacity=".45"/>`,
  )
const onion = () =>
  wrap(
    `<path d="M50 6Q46 16 50 22Q54 16 50 6Z" fill="${G}"/>` +
    `<path d="M50 20C30 34 14 50 18 70C22 88 78 88 82 70C86 50 70 34 50 20Z" fill="#d9944a"/>` +
    line('M50 26C38 42 34 62 40 84M50 26C62 42 66 62 60 84M50 26V86', 2) +
    line('M40 86l-2 6M50 87v6M60 86l2 6', 2.2) + hl(32, 58, 5, 9, 15),
  )
const ox = () => {
  const C = BR
  return wrap(
    `<path d="M80 44Q92 48 90 66" fill="none" stroke-width="3"/><circle cx="90" cy="68" r="3.4" fill="#5a3415"/>` +
    [24, 36, 66, 78].map((x) => `<rect x="${x - 4.5}" y="56" width="9" height="32" rx="3" fill="${C}"/><rect x="${x - 4.5}" y="84" width="9" height="5" fill="${BK}"/>`).join('') +
    `<ellipse cx="54" cy="52" rx="32" ry="18" fill="${C}"/>` +
    `<path d="M12 24Q4 16 10 8Q12 18 22 22M40 24Q48 16 42 8Q40 18 30 22" fill="#f4ead2"/>` +
    `<path d="M14 26Q26 16 38 26L36 48Q26 56 16 48Z" fill="${C}"/>` +
    `<ellipse cx="26" cy="50" rx="11" ry="7" fill="#c98e6a"/>` +
    `<circle cx="22" cy="50" r="1.6" fill="${S}" ${N}/><circle cx="30" cy="50" r="1.6" fill="${S}" ${N}/>` +
    eye(20, 34, 2.6) + eye(32, 34, 2.6) +
    `<path d="M50 40Q60 36 70 42" fill="none" stroke="#6b3d16" stroke-width="3"/>`,
  )
}
const beach = () =>
  tile(
    '#8fd3ff',
    `<circle cx="74" cy="26" r="8" fill="${Y}"/>` +
    `<path d="M10 54H90V62H10Z" fill="${B}" stroke-width="2"/>` +
    `<path d="M10 62H90V74Q90 90 74 90H26Q10 90 10 74Z" fill="#f2d48c"/>` +
    `<path d="M40 30L54 84" stroke-width="3.5"/>` +
    `<path d="M14 42Q30 12 62 18Q58 30 14 42Z" fill="#fff"/>` +
    `<path d="M14 42Q24 22 38 18Q40 32 14 42ZM62 18Q52 14 46 16Q48 28 50 30Z" fill="${R}" stroke-width="2"/>`,
  )
const legPart = () =>
  wrap(
    `<path d="M70 17L38 48L46 78" fill="none" stroke-width="27"/>` +
    `<path d="M40 74H64Q86 76 88 86Q88 94 78 94H42Q34 94 36 84Z" stroke-width="5.6"/>` +
    `<path d="M70 17L38 48L46 78" fill="none" stroke="${SK}" stroke-width="21.4"/>` +
    `<path d="M40 74H64Q86 76 88 86Q88 94 78 94H42Q34 94 36 84Z" fill="${SK}" ${N}/>` +
    line('M32 44Q36 50 42 50', 2.2, SKD) + line('M70 86v4M77 85v5M83 86v4', 1.8, SKD),
  )
const oldMan = () =>
  bust(
    '#f6d2b5', '#7a8fa6',
    `<path d="M28 38Q26 22 34 30Q30 40 30 46ZM72 38Q74 22 66 30Q70 40 70 46Z" fill="#eef0f3"/>` + hl(44, 20, 7, 3, -10),
    `<circle cx="41" cy="40" r="7" fill="none" stroke-width="2.4"/><circle cx="59" cy="40" r="7" fill="none" stroke-width="2.4"/>` +
    line('M48 40H52', 2.4) + line('M32 30l6 -2M68 30l-6 -2', 3, '#eef0f3') +
    `<path d="M38 52Q44 48 50 51Q56 48 62 52Q58 58 50 55Q42 58 38 52Z" fill="#eef0f3" stroke-width="2"/>` +
    line('M44 60Q50 63 56 60', 2) + line('M36 68L50 86L64 68', 2.2),
  )
const man = () =>
  bust(
    '#e0ac80', G,
    `<path d="M27 40Q24 12 50 12Q76 12 73 40Q70 26 60 24Q46 30 30 28Z" fill="#5a3415"/>`,
    `<path d="M42 51Q50 58 58 51" fill="none" stroke-width="2.5"/>` + `<path d="M42 66L50 76L58 66" fill="#fff" stroke-width="2.2"/>`,
  )
const door = () =>
  wrap(
    `<rect x="20" y="6" width="60" height="90" rx="3" fill="#5a3415"/>` +
    `<rect x="26" y="12" width="48" height="84" rx="2" fill="${BR}"/>` +
    `<rect x="33" y="20" width="34" height="26" rx="3" fill="#a66a35" stroke-width="2"/><rect x="33" y="54" width="34" height="34" rx="3" fill="#a66a35" stroke-width="2"/>` +
    `<circle cx="66" cy="52" r="4" fill="${Y}" stroke-width="2"/>`,
  )
const olive = () =>
  wrap(
    tube('M10 26Q50 30 90 14', '#7a5a2a', 3) +
    `<path d="M30 28Q34 8 54 10Q42 22 30 28ZM62 22Q72 4 90 6Q78 18 62 22Z" fill="#6fa86a"/>` +
    `<ellipse cx="34" cy="58" rx="16" ry="21" fill="#6b8e23" transform="rotate(-14 34 58)"/>` +
    `<ellipse cx="66" cy="62" rx="16" ry="21" fill="#4d7a1e" transform="rotate(12 66 62)"/>` +
    line('M36 37Q36 32 34 28M64 41Q64 32 62 24', 2.4) +
    hl(28, 50, 4, 7, -14) + hl(60, 54, 4, 7, 12),
  )
const dress = () =>
  wrap(
    `<path d="M36 6L34 30Q22 40 20 50L14 88Q50 96 86 88L80 50Q78 40 66 30L64 6L56 8Q50 16 44 8Z" fill="${B}"/>` +
    `<path d="M32 40Q50 46 68 40L70 48Q50 54 30 48Z" fill="${Y}" stroke-width="2"/>` +
    line('M34 60L28 86M50 58V90M66 60L72 86', 2, '#164f9c'),
  )
const chair = () =>
  wrap(
    `<rect x="24" y="6" width="9" height="88" rx="3" fill="${BR}"/>` +
    `<rect x="64" y="52" width="9" height="42" rx="3" fill="${BR}"/>` +
    `<rect x="24" y="14" width="9" height="34" fill="#a66a35" stroke-width="2"/>` +
    `<rect x="20" y="48" width="58" height="10" rx="3" fill="#a66a35"/>` +
    line('M28 24h0M28 36h0', 2) + `<rect x="33" y="76" width="31" height="5" fill="${BR}" stroke-width="2"/>`,
  )
const trafficLight = () =>
  wrap(
    `<rect x="46" y="80" width="8" height="16" fill="${GR}"/>` +
    `<path d="M26 14L18 18V26L26 28ZM74 14L82 18V26L74 28ZM26 40L18 44V52L26 54ZM74 40L82 44V52L74 54ZM26 62L18 66V74L26 76ZM74 62L82 66V74L74 76Z" fill="#4a4a5a" stroke-width="2"/>` +
    `<rect x="26" y="4" width="48" height="80" rx="12" fill="${BK}"/>` +
    `<circle cx="50" cy="20" r="10" fill="${R}"/><circle cx="50" cy="44" r="10" fill="${Y}"/><circle cx="50" cy="68" r="10" fill="${G}"/>` +
    hl(46, 16, 3, 2) + hl(46, 40, 3, 2) + hl(46, 64, 3, 2),
  )
const clover = () => {
  const leaf = (a: number) =>
    `<path d="M50 48C40 38 26 34 22 24C18 14 32 8 38 16C38 8 52 6 54 18C56 26 54 38 50 48Z" fill="${G}" transform="rotate(${a} 50 48)"/>`
  return wrap(
    tube('M50 50Q56 74 70 92', '#1f7a36', 4) +
    [-45, 45, 135, 225].map(leaf).join('') + `<circle cx="50" cy="48" r="3" fill="#7fd08f" ${N}/>`,
  )
}
const pointUp = () =>
  wrap(fistHand([[44, 6, 0]]) + `<rect x="39" y="10" width="10" height="6" rx="3" fill="#fff" opacity=".55" ${N}/>`)
const victory = () => wrap(fistHand([[42, 8, -14], [58, 8, 14]]))
const plus = () => wrap(`<path d="M40 12H60V40H88V60H60V88H40V60H12V40H40Z" fill="${BK}" stroke-width="2" rx="4"/>`)
const equals = () =>
  wrap(`<rect x="12" y="26" width="76" height="18" rx="5" fill="${BK}" stroke-width="2"/><rect x="12" y="56" width="76" height="18" rx="5" fill="${BK}" stroke-width="2"/>`)
const box = () =>
  wrap(
    `<path d="M10 32L50 18L90 32L50 46Z" fill="#e2b07a"/>` +
    `<path d="M10 32L50 46V92L10 76Z" fill="#c8915a"/>` +
    `<path d="M90 32L50 46V92L90 76Z" fill="#a8743f"/>` +
    `<path d="M30 25L70 39V52L62 55V42L22 28Z" fill="#f2dcb4" stroke-width="2"/>`,
  )
const scales = () => {
  const pan = (x: number) =>
    line(`M${x} 30L${x - 14} 60M${x} 30L${x + 14} 60`, 2) +
    `<path d="M${x - 18} 60H${x + 18}Q${x + 14} 74 ${x} 74Q${x - 14} 74 ${x - 18} 60Z" fill="${Y}"/>`
  return wrap(
    `<path d="M30 92Q30 82 50 82Q70 82 70 92Z" fill="${GR}"/>` +
    `<rect x="46" y="20" width="8" height="64" fill="#c9ced4"/>` +
    `<rect x="12" y="24" width="76" height="7" rx="3.5" fill="${GR}"/>` +
    `<circle cx="50" cy="18" r="6" fill="${Y}"/>` + pan(20) + pan(80),
  )
}
const rose = () =>
  wrap(
    tube('M50 54Q46 74 52 94', G, 5) +
    `<path d="M50 74Q30 62 22 72Q34 84 50 76ZM51 82Q68 70 78 78Q66 90 51 84Z" fill="${G}"/>` +
    `<path d="M28 22Q24 46 38 56Q50 62 62 56Q76 46 72 22Q62 30 50 18Q38 30 28 22Z" fill="${R}"/>` +
    `<path d="M38 32Q38 46 50 48Q62 46 62 32Q56 38 50 30Q44 38 38 32Z" fill="#b8202b" stroke-width="2.2"/>` +
    `<path d="M44 30Q50 22 56 30" fill="none" stroke-width="2.2"/>`,
  )
const blueberries = () => {
  const berry = (x: number, y: number, r: number) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="#1d70d8"/>` +
    `<path d="M${x - 4} ${y - r + 6}L${x} ${y - r + 2}L${x + 4} ${y - r + 6}L${x} ${y - r + 9}Z" fill="#1f3a8a" stroke-width="1.8"/>` +
    `<circle cx="${x - r * 0.45}" cy="${y + r * 0.1}" r="${r * 0.18}" fill="#fff" opacity=".4" ${N}/>`
  return wrap(berry(30, 40, 20) + berry(70, 42, 20) + berry(50, 70, 21))
}
const sunflower = () => {
  const petals = Array.from({ length: 12 }, (_, i) =>
    `<ellipse cx="50" cy="20" rx="7" ry="14" fill="${Y}" transform="rotate(${i * 30} 50 42)"/>`).join('')
  return wrap(
    tube('M50 60Q52 80 48 96', G, 5) +
    `<path d="M50 84Q34 70 24 80Q36 92 50 86Z" fill="${G}"/>` +
    petals + `<circle cx="50" cy="42" r="15" fill="#7a4b2f"/>` +
    [[45, 37], [55, 37], [50, 45], [44, 47], [56, 47]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#4a2a10" ${N}/>`).join(''),
  )
}
const lemon = () =>
  wrap(
    `<path d="M14 54Q8 50 12 44Q22 22 50 20Q78 22 88 44Q92 50 86 56Q78 80 50 80Q22 80 14 54Z" fill="${Y}"/>` +
    `<path d="M52 20Q60 6 76 10Q70 22 52 20Z" fill="${G}"/>` + hl(34, 40, 9, 5, -20),
  )
const greenApple = () =>
  wrap(
    tube('M50 26Q50 16 56 10', '#7a4b2f', 3.5) +
    `<path d="M50 28Q66 18 80 30Q94 46 84 70Q74 92 60 90Q54 88 50 90Q46 88 40 90Q26 92 16 70Q6 46 20 30Q34 18 50 28Z" fill="${G}"/>` +
    `<path d="M54 22Q66 8 80 14Q72 26 54 22Z" fill="${G}"/>` + hl(30, 46, 6, 10, 20),
  )
const eggplant = () =>
  wrap(
    `<path d="M66 22Q84 26 84 46Q86 74 62 88Q40 98 22 84Q10 72 22 58Q34 48 42 34Q50 20 66 22Z" fill="${P}"/>` +
    `<path d="M48 36Q50 20 64 18Q78 18 86 28Q72 26 70 34Q62 28 56 38Z" fill="${G}"/>` +
    tube('M72 20Q74 10 82 6', G, 4) + hl(32, 70, 4, 10, 40),
  )
const crystalBall = () =>
  wrap(
    `<path d="M24 92L32 74H68L76 92Z" fill="#b5732e"/>` +
    `<circle cx="50" cy="44" r="34" fill="${P}"/>` +
    `<circle cx="50" cy="44" r="22" fill="#a98bf8" ${N} opacity=".6"/>` +
    hl(36, 30, 9, 5, -40) +
    `<path d="M60 52l2 -6l2 6l6 2l-6 2l-2 6l-2 -6l-6 -2Z" fill="#fff" stroke-width="1.5"/>`,
  )
const ribbon = () =>
  wrap(
    `<path d="M44 52L28 92L38 88L44 96L50 58ZM56 52L72 92L62 88L56 96L50 58Z" fill="#f2638a"/>` +
    `<path d="M50 44Q30 18 14 26Q4 36 12 54Q24 66 50 52ZM50 44Q70 18 86 26Q96 36 88 54Q76 66 50 52Z" fill="${K}"/>` +
    line('M20 34Q30 36 38 44M80 34Q70 36 62 44', 2, '#f2638a') +
    `<rect x="42" y="38" width="16" height="18" rx="6" fill="#f2638a"/>`,
  )
const flamingo = () =>
  wrap(
    line('M56 66V94M56 80L44 72L48 62', 3) + `<path d="M56 94H66" stroke-width="3"/>` +
    tube('M42 56Q24 42 32 26Q40 12 28 8', K, 8) +
    `<path d="M36 56Q46 36 70 40Q92 44 94 58Q82 76 58 72Q40 70 36 56Z" fill="${K}"/>` +
    `<path d="M58 50Q74 46 84 56Q72 62 58 50Z" fill="#f2638a" stroke-width="2"/>` +
    `<circle cx="26" cy="12" r="9" fill="${K}"/>` +
    `<path d="M18 12L6 20Q8 28 13 24L20 18Z" fill="#fff"/><path d="M6 20Q8 28 13 24L10 21Z" fill="${BK}" stroke-width="2"/>` +
    eye(27, 10, 2.2),
  )
const balletShoes = () => {
  const shoe = (x: number, a: number) =>
    `<g transform="rotate(${a} ${x} 40)">` +
    `<path d="M${x - 13} 40Q${x - 16} 74 ${x - 6} 90Q${x} 95 ${x + 6} 90Q${x + 16} 74 ${x + 13} 40Z" fill="${K}"/>` +
    `<ellipse cx="${x}" cy="41" rx="13" ry="5.5" fill="#e05a80"/>` +
    `<path d="M${x - 6} 88Q${x} 84 ${x + 6} 88" fill="none" stroke-width="2"/>` +
    `<path d="M${x - 7} 52Q${x - 9} 70 ${x - 4} 80" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/>` +
    `<path d="M${x - 12} 42L${x + 12} 62M${x + 12} 42L${x - 12} 62" fill="none" stroke="#f2638a" stroke-width="3"/></g>`
  return wrap(
    line('M30 40L50 10L70 40', 3, '#f2638a') +
    shoe(32, 12) + shoe(68, -12) +
    `<path d="M50 10Q40 2 38 10Q42 16 50 10ZM50 10Q60 2 62 10Q58 16 50 10Z" fill="#f2638a" stroke-width="2"/>`,
  )
}
const potato = () =>
  wrap(
    `<path d="M18 40Q20 18 46 18Q70 16 84 34Q94 52 82 70Q70 86 44 84Q18 82 12 64Q10 52 18 40Z" fill="#8d5524"/>` +
    [[34, 38], [62, 32], [70, 60], [42, 66], [54, 50]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="2" fill="#6e4520" ${N}/>`).join('') +
    hl(28, 34, 7, 4, -30),
  )
const wheel = () =>
  wrap(
    `<circle cx="50" cy="50" r="42" fill="${BK}"/>` +
    `<circle cx="50" cy="50" r="42" fill="none" stroke="#4a4a5a" stroke-width="3" stroke-dasharray="6 6"/>` +
    `<circle cx="50" cy="50" r="24" fill="#c9ced4"/>` +
    `<circle cx="50" cy="50" r="8" fill="${GR}"/>` +
    [0, 72, 144, 216, 288].map((a) => `<path d="M50 40V30" stroke-width="3.5" transform="rotate(${a} 50 50)"/>`).join(''),
  )
const present = () =>
  wrap(
    `<rect x="16" y="44" width="68" height="48" rx="3" fill="${Y}"/>` +
    `<rect x="10" y="32" width="80" height="16" rx="3" fill="#ffd970"/>` +
    `<rect x="44" y="32" width="12" height="60" fill="${R}" stroke-width="2.2"/>` +
    `<path d="M50 32Q34 8 24 18Q18 30 50 32ZM50 32Q66 8 76 18Q82 30 50 32Z" fill="${R}"/>`,
  )
const book = () =>
  wrap(
    `<path d="M24 8H82V88H24Q16 88 16 80V16Q16 8 24 8Z" fill="${R}"/>` +
    `<path d="M24 80H82V92H24Q16 92 16 86Q16 80 24 80Z" fill="#fff"/>` +
    line('M26 84H78M26 88H78', 1.5, '#c9ced4') +
    `<rect x="36" y="22" width="34" height="14" rx="3" fill="#ff9a9c" stroke-width="2"/>` + line('M26 10V78', 2, '#b8202b'),
  )
const jeans = () =>
  wrap(
    `<path d="M24 8H76L82 92H58L50 40L42 92H18Z" fill="${B}"/>` +
    `<path d="M24 8H76V18H24Z" fill="#3f88e6" stroke-width="2"/>` +
    line('M50 18V40M34 18Q36 30 26 32M66 18Q64 30 74 32', 2, '#a9d0ff') +
    `<circle cx="50" cy="13" r="2" fill="${Y}" stroke-width="1.5"/>`,
  )
const standing = () =>
  wrap(
    `<rect x="38" y="62" width="10" height="32" rx="4" fill="#3f5873"/><rect x="52" y="62" width="10" height="32" rx="4" fill="#3f5873"/>` +
    `<rect x="26" y="32" width="9" height="30" rx="4.5" fill="#e0ac80"/><rect x="65" y="32" width="9" height="30" rx="4.5" fill="#e0ac80"/>` +
    `<path d="M34 30Q50 26 66 30L66 68H34Z" fill="${O}"/>` +
    `<circle cx="50" cy="16" r="12" fill="#e0ac80"/>` +
    `<path d="M38 15Q38 4 50 4Q62 4 62 15Q56 9 46 10Z" fill="#3a2a1a"/>` +
    eye(45, 17, 1.8) + eye(55, 17, 1.8),
  )
const question = () =>
  wrap(
    `<path d="M22 34Q22 8 50 8Q78 8 78 32Q78 46 62 54Q58 56 58 64V68H40V60Q40 48 52 42Q60 38 60 32Q60 26 50 26Q42 26 40 36Z" fill="${R}"/>` +
    `<circle cx="49" cy="84" r="10" fill="${R}"/>`,
  )
const raiseHands = () =>
  wrap(
    openHand('translate(30 58) rotate(-14)') + openHand('translate(70 58) rotate(14) scale(-1 1)') +
    `<rect x="16" y="82" width="26" height="12" rx="3" fill="${B}"/><rect x="58" y="82" width="26" height="12" rx="3" fill="${B}"/>` +
    line('M12 14l6 6M50 6v8M88 14l-6 6', 3, O),
  )
const cartwheel = () =>
  wrap(
    `<g transform="translate(50 52) rotate(18) scale(.8) translate(-50 -50)">` +
    `<path d="M44 40L24 10M56 40L76 10" fill="none" stroke-width="16.6"/><path d="M44 40L24 10M56 40L76 10" fill="none" stroke="#2b6cb0" stroke-width="11"/>` +
    `<path d="M42 62L30 90M58 62L70 90" fill="none" stroke-width="14.6"/><path d="M42 62L30 90M58 62L70 90" fill="none" stroke="#b97a56" stroke-width="9"/>` +
    `<rect x="38" y="34" width="24" height="32" rx="9" fill="${R}"/>` +
    `<circle cx="50" cy="76" r="10" fill="#b97a56"/>` +
    `<path d="M40 78Q40 90 50 87Q60 90 60 78Q54 84 50 82Q46 84 40 78Z" fill="#2b1a10"/>` +
    eye(46, 72, 1.8) + eye(54, 72, 1.8) + `</g>` +
    line('M14 62Q8 40 20 22M86 42Q92 64 80 80', 2.5, GR),
  )
const arrowTile = (flip: boolean) =>
  tile(B, `<path d="M20 50L46 24V40H80V60H46V76Z" fill="#fff" stroke-width="2.5"${flip ? ' transform="rotate(180 50 50)"' : ''}/>`)
const noEntry = () =>
  wrap(
    `<circle cx="50" cy="50" r="41" fill="${R}"/><circle cx="50" cy="50" r="28" fill="#fff"/>` +
    `<rect x="20" y="43" width="60" height="14" fill="${R}" ${N} transform="rotate(45 50 50)"/>` +
    `<circle cx="50" cy="50" r="28" fill="none"/>`,
  )
const rice = () =>
  wrap(
    `<path d="M16 52Q16 22 50 22Q84 22 84 52Z" fill="#fff"/>` +
    [[34, 34], [46, 30], [58, 34], [66, 42], [40, 44], [52, 42], [28, 46]]
      .map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.6" fill="#d9d9e0" ${N} transform="rotate(${i * 40} ${x} ${y})"/>`).join('') +
    `<path d="M10 52H90Q88 82 62 88H38Q12 82 10 52Z" fill="${B}"/>` +
    `<rect x="36" y="86" width="28" height="7" rx="3" fill="#164f9c"/>` +
    line('M22 64Q50 72 78 64', 2.5, '#a9d0ff'),
  )
const speaker = () =>
  wrap(
    `<path d="M10 38H26L46 18V82L26 62H10Z" fill="${GR}"/>` + `<rect x="10" y="38" width="16" height="24" fill="#c9ced4"/>` +
    line('M56 38Q62 50 56 62M66 28Q78 50 66 72M76 18Q94 50 76 82', 5),
  )
const shush = () =>
  wrap(
    `<circle cx="50" cy="48" r="40" fill="${Y}"/>` +
    `<path d="M30 34Q36 30 42 34M58 34Q64 30 70 34" fill="none" stroke-width="3"/>` +
    eye(36, 42, 3.6) + eye(64, 42, 3.6) +
    `<path d="M40 68Q50 62 60 68" fill="none" stroke-width="3"/>` +
    unite(`<rect x="43" y="46" width="12" height="38" rx="6" fill="${SK}"/>`, `<rect x="34" y="78" width="30" height="20" rx="9" fill="${SK}"/>`) +
    line('M45 70H53', 2, SKD) + line('M86 20l4 -4M88 30h6M80 12l2 -6', 2.5, '#5fb4f2'),
  )
const ambulance = () =>
  wrap(
    `<rect x="26" y="14" width="10" height="8" rx="2" fill="${B}"/>` +
    `<path d="M8 22H64V80H8Z" fill="#fff"/>` +
    `<path d="M64 36H78L92 54V80H64Z" fill="#fff"/>` +
    `<path d="M68 40H77L86 54H68Z" fill="#8ec5ff" stroke-width="2.2"/>` +
    `<rect x="8" y="60" width="84" height="7" fill="${R}" stroke-width="2"/>` +
    `<path d="M30 30H42V36H48V48H42V54H30V48H24V36H30Z" fill="${R}" stroke-width="2"/>` +
    `<circle cx="26" cy="82" r="9" fill="${BK}"/><circle cx="26" cy="82" r="3.5" fill="#c9ced4"/>` +
    `<circle cx="76" cy="82" r="9" fill="${BK}"/><circle cx="76" cy="82" r="3.5" fill="#c9ced4"/>`,
  )
const cloud = () =>
  wrap(
    unite(
      `<circle cx="32" cy="58" r="18" fill="#eef4fb"/>`, `<circle cx="54" cy="44" r="22" fill="#eef4fb"/>`,
      `<circle cx="74" cy="60" r="16" fill="#eef4fb"/>`, `<rect x="16" y="56" width="74" height="22" rx="11" fill="#eef4fb"/>`,
    ) + `<path d="M22 70Q50 80 82 70" fill="none" stroke="#c9d8ea" stroke-width="4"/>` + hl(46, 34, 8, 4, -20),
  )
const battery = () =>
  wrap(
    `<rect x="84" y="38" width="8" height="24" rx="3" fill="${GR}"/>` +
    `<rect x="8" y="24" width="78" height="52" rx="9" fill="#fff"/>` +
    `<rect x="14" y="30" width="20" height="40" rx="4" fill="${G}" stroke-width="2"/>` +
    `<rect x="37" y="30" width="20" height="40" rx="4" fill="${G}" stroke-width="2"/>` +
    `<rect x="60" y="30" width="20" height="40" rx="4" fill="${G}" stroke-width="2"/>`,
  )
const tv = () =>
  wrap(
    line('M50 22L32 6M50 22L70 4', 3) + `<circle cx="32" cy="6" r="3" fill="${R}"/><circle cx="70" cy="4" r="3" fill="${R}"/>` +
    `<rect x="22" y="82" width="10" height="12" rx="2" fill="${BK}"/><rect x="68" y="82" width="10" height="12" rx="2" fill="${BK}"/>` +
    `<rect x="8" y="22" width="84" height="62" rx="10" fill="#4a4a5a"/>` +
    `<rect x="15" y="29" width="56" height="48" rx="8" fill="#8ec5ff"/>` + hl(28, 40, 8, 4, -25) +
    `<circle cx="82" cy="40" r="4" fill="${Y}" stroke-width="2"/><circle cx="82" cy="54" r="4" fill="${Y}" stroke-width="2"/>`,
  )

export const ART: Record<string, string> = {
  '🪢': knot(),
  '☕': coffee(),
  '🚿': shower(),
  '👏': clap(),
  '🌉': bridgeNight(),
  '🪣': bucket(),
  '🧅': onion(),
  '🐂': ox(),
  '🏖': beach(),
  '🦵': legPart(),
  '👴': oldMan(),
  '👨': man(),
  '🚪': door(),
  '❤': heart(R),
  '🫒': olive(),
  '👗': dress(),
  '🪑': chair(),
  '🚦': trafficLight(),
  '🍀': clover(),
  '☝': pointUp(),
  '✌': victory(),
  '🔵': disc(B),
  '🟢': disc(G),
  '➕': plus(),
  '🟰': equals(),
  '📦': box(),
  '⚖': scales(),
  '🌹': rose(),
  '🫐': blueberries(),
  '💙': heart(B),
  '🌻': sunflower(),
  '🍋': lemon(),
  '🍏': greenApple(),
  '🍆': eggplant(),
  '💜': heart(P),
  '🔮': crystalBall(),
  '🎀': ribbon(),
  '🦩': flamingo(),
  '🩰': balletShoes(),
  '🥔': potato(),
  '🛞': wheel(),
  '🎁': present(),
  '📕': book(),
  '👖': jeans(),
  '🧍': standing(),
  '❓': question(),
  '🙌': raiseHands(),
  '🤸': cartwheel(),
  '⬅': arrowTile(false),
  '➡': arrowTile(true),
  '🚫': noEntry(),
  '🍚': rice(),
  '🔊': speaker(),
  '🤫': shush(),
  '🚑': ambulance(),
  '☁': cloud(),
  '🔋': battery(),
  '📺': tv(),
}
