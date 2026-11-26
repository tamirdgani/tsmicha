/* Common drawings, batch 9: the people and things the school lessons added (viewBox 0 0 100 100). */

const S = '#2b2b3a'
const N = 'stroke="none"'
const R = '#e5383b', B = '#1d70d8', Y = '#ffc83d', G = '#2e9a48', K = '#ff8fab', BR = '#8d5524', BK = '#2f2f3a', GR = '#9aa0a6'
const wrap = (s: string) => `<g stroke="${S}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round">${s}</g>`
const line = (d: string, w = 2.5, c = S) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
const eye = (x: number, y: number, r = 3.6) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${Math.round(r * 11.5) / 10}" fill="${S}" ${N}/><circle cx="${x + r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.4}" fill="#fff" ${N}/>`
const cheeks = (cx: number, y: number, dx: number) =>
  `<ellipse cx="${cx - dx}" cy="${y}" rx="4.5" ry="2.8" fill="#ff6b8b" opacity=".45" ${N}/><ellipse cx="${cx + dx}" cy="${y}" rx="4.5" ry="2.8" fill="#ff6b8b" opacity=".45" ${N}/>`
const hl = (cx: number, cy: number, rx: number, ry: number, rot = -30) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".45" ${N} transform="rotate(${rot} ${cx} ${cy})"/>`
const smile = (y = 58) => line(`M43 ${y}Q50 ${y + 6} 57 ${y}`, 2.6)

export const ART: Record<string, string> = {
  // boy: short hair, blue shirt
  '👦': wrap(
    `<path d="M16 94Q16 72 50 70Q84 72 84 94Z" fill="${B}"/>` + line('M42 72L50 79L58 72', 2.4, '#fff') +
      `<circle cx="27" cy="48" r="6" fill="#e0ac80"/><circle cx="73" cy="48" r="6" fill="#e0ac80"/>` +
      `<circle cx="50" cy="46" r="24" fill="#e0ac80"/>` +
      `<path d="M25 44Q22 18 50 18Q78 18 75 44Q72 32 62 30Q60 36 52 32Q44 36 40 30Q30 32 25 44Z" fill="${BR}"/>` +
      eye(42, 48) + eye(58, 48) + cheeks(50, 56, 14) + smile(58),
  ),
  // woman (mom): long dark hair, green top, earrings
  '👩': wrap(
    `<path d="M24 50Q18 82 30 92H70Q82 82 76 50Q76 18 50 18Q24 18 24 50Z" fill="#3a2a20"/>` +
      `<path d="M18 94Q18 74 50 72Q82 74 82 94Z" fill="${G}"/>` + line('M40 74Q50 84 60 74', 2.4) +
      `<circle cx="50" cy="48" r="22" fill="#c68a62"/>` +
      `<path d="M28 46Q28 24 50 24Q72 24 72 46Q66 30 50 32Q36 34 28 46Z" fill="#3a2a20"/>` +
      `<circle cx="28" cy="58" r="3" fill="${Y}"/><circle cx="72" cy="58" r="3" fill="${Y}"/>` +
      eye(42, 50) + eye(58, 50) + cheeks(50, 58, 13) + `<path d="M43 60Q50 67 57 60Z" fill="${R}"/>`,
  ),
  // grandma: grey bun, round glasses, purple cardigan
  '👵': wrap(
    `<circle cx="50" cy="16" r="10" fill="#d9dbe0"/>` +
      `<path d="M16 94Q16 72 50 70Q84 72 84 94Z" fill="#8b5cf6"/>` + `<circle cx="50" cy="82" r="2.5" fill="#fff"/><circle cx="50" cy="90" r="2.5" fill="#fff"/>` +
      `<circle cx="50" cy="46" r="25" fill="#d9dbe0"/>` + `<circle cx="50" cy="50" r="20" fill="#f1c9a5"/>` +
      `<path d="M30 46Q32 28 50 28Q68 28 70 46Q62 36 50 37Q38 36 30 46Z" fill="#d9dbe0"/>` +
      `<circle cx="42" cy="50" r="6.5" fill="#fff" fill-opacity=".5"/><circle cx="58" cy="50" r="6.5" fill="#fff" fill-opacity=".5"/>` + line('M48.5 50H51.5', 2.4) +
      `<circle cx="42" cy="50" r="2.4" fill="${S}" ${N}/><circle cx="58" cy="50" r="2.4" fill="${S}" ${N}/>` +
      cheeks(50, 60, 14) + smile(61),
  ),
  // king: gold crown, red robe with white trim
  '🤴': wrap(
    `<path d="M14 94Q14 70 50 68Q86 70 86 94Z" fill="${R}"/>` + `<path d="M36 70Q50 78 64 70L62 94H38Z" fill="#fff"/>` +
      `<circle cx="45" cy="80" r="1.6" fill="${S}" ${N}/><circle cx="55" cy="86" r="1.6" fill="${S}" ${N}/>` +
      `<circle cx="50" cy="48" r="21" fill="#e0ac80"/>` +
      `<path d="M30 52Q30 74 50 74Q70 74 70 52Q62 62 50 60Q38 62 30 52Z" fill="${BR}"/>` +
      `<path d="M28 32L28 12L39 22L50 8L61 22L72 12L72 32Z" fill="${Y}"/>` + `<circle cx="50" cy="24" r="3.5" fill="${R}"/><circle cx="36" cy="27" r="2.5" fill="${B}"/><circle cx="64" cy="27" r="2.5" fill="${B}"/>` +
      eye(42, 46) + eye(58, 46) + line('M44 60Q50 64 56 60', 2.4),
  ),
  // gorilla: big dark body, grey face, long arms
  '🦍': wrap(
    `<path d="M14 92Q8 54 30 40Q50 30 70 40Q92 54 86 92Z" fill="${BK}"/>` +
      `<path d="M14 92Q10 70 22 62L30 92Z" fill="#45454f"/><path d="M86 92Q90 70 78 62L70 92Z" fill="#45454f"/>` +
      `<circle cx="50" cy="38" r="24" fill="${BK}"/>` +
      `<path d="M34 38Q34 28 50 28Q66 28 66 38Q70 56 50 58Q30 56 34 38Z" fill="${GR}"/>` +
      line('M36 34Q43 30 48 34M52 34Q57 30 64 34', 3) + eye(43, 39, 3.2) + eye(57, 39, 3.2) +
      `<ellipse cx="46" cy="48" rx="2" ry="1.6" fill="${S}" ${N}/><ellipse cx="54" cy="48" rx="2" ry="1.6" fill="${S}" ${N}/>` + line('M43 53Q50 56 57 53', 2.4) +
      `<path d="M38 66Q50 74 62 66Q60 84 50 84Q40 84 38 66Z" fill="#5c5c66"/>`,
  ),
  // garlic: white bulb with cloves and roots
  '🧄': wrap(
    line('M40 90L36 96M50 91V97M60 90L64 96', 2.4) +
      `<path d="M50 14Q46 30 30 44Q14 60 24 78Q34 92 50 92Q66 92 76 78Q86 60 70 44Q54 30 50 14Z" fill="#f4f0e8"/>` +
      line('M50 22Q40 44 42 90M50 22Q60 44 58 90M48 30Q26 52 32 86M52 30Q74 52 68 86', 2.2, '#c9c0ae') +
      `<path d="M46 16Q50 4 54 16Z" fill="#cdd9a0"/>` + hl(36, 58, 5, 10, 20),
  ),
  // ladder: orange wooden rails and rungs
  '🪜': wrap(
    `<path d="M30 8L22 94H30L37 8Z" fill="${'#f39c3d'}"/><path d="M63 8L70 94H78L70 8Z" fill="${'#f39c3d'}"/>` +
      [20, 38, 56, 74].map((y) => `<rect x="${30 - y * 0.06}" y="${y}" width="${40 + y * 0.12}" height="7" rx="2" fill="#ffc27a"/>`).join(''),
  ),
  // bow and arrow
  '🏹': wrap(
    `<path d="M24 12Q74 18 82 76" fill="none" stroke-width="11"/><path d="M24 12Q74 18 82 76" fill="none" stroke="${BR}" stroke-width="6"/>` +
      line('M24 12L82 76', 1.8) +
      line('M16 88L76 24', 4) + `<path d="M76 24L66 26L74 34Z" fill="${GR}"/>` +
      `<path d="M16 88L12 80L22 78ZM16 88L8 84L20 92Z" fill="${R}"/>` + `<rect x="44" y="40" width="10" height="7" rx="2" fill="${Y}" transform="rotate(-45 49 43)"/>`,
  ),
  // doll: yellow pigtails, pink dress
  '🪆': wrap(
    `<path d="M30 52L20 92H80L70 52Z" fill="${K}"/>` + line('M24 78H76', 2.4, '#fff') + `<circle cx="50" cy="64" r="3" fill="#fff"/>` +
      `<rect x="34" y="90" width="9" height="6" rx="2" fill="${BK}"/><rect x="57" y="90" width="9" height="6" rx="2" fill="${BK}"/>` +
      `<circle cx="22" cy="34" r="8" fill="${Y}"/><circle cx="78" cy="34" r="8" fill="${Y}"/>` +
      `<circle cx="50" cy="32" r="20" fill="#f6d2b5"/>` +
      `<path d="M30 30Q30 10 50 10Q70 10 70 30Q60 18 50 22Q40 18 30 30Z" fill="${Y}"/>` +
      eye(43, 33, 3.2) + eye(57, 33, 3.2) + cheeks(50, 40, 12) + line('M45 42Q50 46 55 42', 2.2),
  ),
  // division sign
  '➗': wrap(
    `<rect x="12" y="41" width="76" height="18" rx="5" fill="${BK}" stroke-width="2"/>` +
      `<circle cx="50" cy="22" r="10" fill="${BK}" stroke-width="2"/><circle cx="50" cy="78" r="10" fill="${BK}" stroke-width="2"/>`,
  ),
  // magnifying glass
  '🔍': wrap(
    `<path d="M60 62L86 88" fill="none" stroke-width="17"/><path d="M60 62L86 88" fill="none" stroke="${BR}" stroke-width="11"/>` +
      `<circle cx="42" cy="42" r="30" fill="${GR}"/><circle cx="42" cy="42" r="22" fill="#bfe6ff"/>` + hl(34, 32, 8, 5),
  ),
}
