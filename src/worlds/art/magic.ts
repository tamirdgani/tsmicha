/* Magic world: original illustrations of kid wizards & witches (viewBox 0 0 100 100). */

const O = '#2b2b3a'
const S = `stroke="${O}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`
/** outline attrs; a stroke-width given in `extra` replaces the default one */
const st = (extra: string) => (extra.includes('stroke-width') ? S.replace(/ stroke-width="[^"]*"/, '') : S)
const p = (d: string, fill: string, extra = '') => `<path d="${d}" fill="${fill}" ${st(extra)} ${extra}/>`
const c = (x: number, y: number, r: number, fill: string, extra = '') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${st(extra)} ${extra}/>`
const E = 'stroke="#2b2b3a" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"'

/** 5-point star polygon path. */
const starD = (cx: number, cy: number, R: number, r: number) => {
  let d = ''
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rr = i % 2 ? r : R
    d += `${i ? 'L' : 'M'}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)} `
  }
  return d + 'Z'
}
/** 4-point twinkle sparkle path. */
const sparkD = (x: number, y: number, R: number) =>
  `M${x} ${y - R} Q${x} ${y} ${x + R} ${y} Q${x} ${y} ${x} ${y + R} Q${x} ${y} ${x - R} ${y} Q${x} ${y} ${x} ${y - R} Z`

type Wiz = {
  robe: string // main colour (robe + hat)
  dark: string // shade for hat band / robe trim
  star: string // little stars on hat & robe
  hair: string
  skin: string
  girl?: boolean
}

const wizard = (w: Wiz) => {
  const backHair = w.girl ? p('M35 38 C29 52 30 66 37 70 L63 70 C70 66 71 52 65 38 Z', w.hair) : ''
  const fringe = w.girl
    ? 'M36 36 C35 44 39 47 44 43.5 Q50 47 56 43.5 C61 47 65 44 64 36 Z'
    : 'M35.5 36 C35 42 36 47 38 50 L40 44.5 L43 47 L45 42.5 L48 45.5 L50 41.5 L52 45.5 L55 42.5 L57 47 L60 44.5 L62 50 C64 47 65 42 64.5 36 Z'
  const arm = (d: string, col: string, w1: number, w2: number) =>
    `<path d="${d}" fill="none" stroke="${O}" stroke-width="${w1}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w2}" stroke-linecap="round"/>`
  return `<g>
${backHair}
<ellipse cx="42" cy="92" rx="6" ry="3.2" fill="#5a3a2e" ${S}/><ellipse cx="58" cy="92" rx="6" ry="3.2" fill="#5a3a2e" ${S}/>
${p('M39 59 Q50 63 61 59 C66 69 70 79 73 89 Q50 94 27 89 C30 79 34 69 39 59 Z', w.robe)}
<path d="M28.6 84.5 Q50 89.5 71.4 84.5" fill="none" stroke="${w.dark}" stroke-width="4"/>
<path d="${starD(50, 75, 4.6, 2)}" fill="${w.star}" ${E}/>
${arm('M41 64 L33 75', w.robe, 11, 6.5)}
${c(32, 76.5, 4, w.skin)}
<path d="M71 66 L85 39" stroke="${O}" stroke-width="5.5" stroke-linecap="round"/><path d="M71 66 L85 39" stroke="#6b4426" stroke-width="2.6" stroke-linecap="round"/><path d="M83.3 42.3 L85 39" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
<path d="${sparkD(87, 34, 8)}" fill="#ffe066" ${st('stroke-width')} stroke-width="1.8"/>
<path d="${sparkD(76, 30, 3)}" fill="#ffe066"/>
${arm('M59 64 L69 61', w.robe, 11, 6.5)}
${c(72, 60.5, 4, w.skin)}
${c(50, 48, 14.5, w.skin)}
${p(fringe, w.hair)}
<ellipse cx="44" cy="49.5" rx="2.6" ry="3.2" fill="${O}"/><ellipse cx="56" cy="49.5" rx="2.6" ry="3.2" fill="${O}"/>
<circle cx="45" cy="48.3" r="1" fill="#fff"/><circle cx="57" cy="48.3" r="1" fill="#fff"/>
<circle cx="39.5" cy="54.5" r="2.5" fill="#ff6b8a" opacity=".35"/><circle cx="60.5" cy="54.5" r="2.5" fill="#ff6b8a" opacity=".35"/>
<path d="M46 55 Q50 58.5 54 55" fill="none" stroke="${O}" stroke-width="2" stroke-linecap="round"/>
${p('M33 37 C37 27 41 17 47 10 Q53 3 62 6 Q55 9 53 15 C56 23 62 30 67 37 Z', w.robe)}
${p('M34.5 33 Q50 37 65.5 33 L67 37 Q50 41 33 37 Z', w.dark)}
<ellipse cx="50" cy="37.5" rx="29" ry="5.5" fill="${w.robe}" ${S}/>
<path d="${starD(45, 24, 3.8, 1.6)}" fill="${w.star}"/><path d="${starD(53.5, 17, 2.6, 1.1)}" fill="${w.star}"/>
</g>`
}

const GOLD = '#ffd84a'

export const ART: Record<string, string> = {
  'wiz-blue': wizard({ robe: '#1d70d8', dark: '#0e3f85', star: GOLD, hair: '#5a3825', skin: '#f6d2b5' }),
  'wiz-purple': wizard({ robe: '#8b5cf6', dark: '#5126b0', star: GOLD, hair: '#6b4226', skin: '#e0ac80', girl: true }),
  'wiz-green': wizard({ robe: '#2e9a48', dark: '#185c2a', star: GOLD, hair: '#2b2420', skin: '#b97a56' }),
  'wiz-pink': wizard({ robe: '#ff8fab', dark: '#d6336c', star: '#fff', hair: '#b5562b', skin: '#f6d2b5', girl: true }),
  'wiz-yellow': wizard({ robe: '#ffc83d', dark: '#d98a00', star: '#fff', hair: '#8a3b1e', skin: '#e0ac80' }),
  'wiz-red': wizard({ robe: '#e5383b', dark: '#9e1b22', star: GOLD, hair: '#e2a93b', skin: '#f6d2b5' }),
  'wiz-orange': wizard({ robe: '#f77f00', dark: '#a84a00', star: '#fff', hair: '#3a2a20', skin: '#7a4b2f', girl: true }),
  'wiz-black': wizard({ robe: '#2f2f3a', dark: '#4a4a5a', star: GOLD, hair: '#1f1712', skin: '#b97a56' }),

  wand: `<g>
<path d="M16 86 L62 40" stroke="${O}" stroke-width="10" stroke-linecap="round"/>
<path d="M16 86 L62 40" stroke="#6b4426" stroke-width="5" stroke-linecap="round"/>
<path d="M56 46 L62 40" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
<path d="M22 74 L28 80 M26 70 L32 76" stroke="${GOLD}" stroke-width="2.6" stroke-linecap="round"/>
<path d="${sparkD(72, 28, 20)}" fill="${GOLD}" ${st('stroke-width')} stroke-width="3"/>
<path d="${sparkD(90, 50, 6)}" fill="${GOLD}" ${st('stroke-width')} stroke-width="2"/>
<path d="${sparkD(50, 14, 5)}" fill="${GOLD}" ${st('stroke-width')} stroke-width="2"/>
<circle cx="86" cy="12" r="2" fill="${GOLD}"/>
</g>`,

  hat: `<g>
${p('M25 80 C33 62 39 42 45 26 C48 15 54 8 63 6 Q72 5 79 12 Q69 12 63 19 C62 40 68 62 75 80 Z', '#6a4bc4', 'stroke-width="3"')}
${p('M28 72 Q50 78 72 72 L75 80 Q50 87 25 80 Z', GOLD)}
<ellipse cx="50" cy="82" rx="42" ry="9" fill="#6a4bc4" ${st('stroke-width')} stroke-width="3"/>
<path d="M30 82 Q50 86 70 82" fill="none" stroke="#4b2f99" stroke-width="2.5" stroke-linecap="round"/>
<path d="${starD(48, 50, 6, 2.6)}" fill="${GOLD}"/><path d="${starD(58, 30, 4, 1.8)}" fill="${GOLD}"/><path d="${starD(60, 62, 3.4, 1.5)}" fill="${GOLD}"/>
<path d="M40 60 Q43 44 49 32" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/>
</g>`,

  potion: `<g>
${c(50, 64, 28, '#e3f4ff', 'stroke-width="3"')}
<path d="M24.6 58 Q37 51 50 58 T75.4 58 A26 26 0 1 1 24.6 58 Z" fill="#e64980"/>
<path d="M33 46 A21 21 0 0 1 42 40" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="40" cy="72" r="3" fill="#fff" opacity=".7"/><circle cx="56" cy="80" r="2.2" fill="#fff" opacity=".7"/><circle cx="60" cy="66" r="1.6" fill="#fff" opacity=".7"/>
${c(50, 64, 28, 'none', 'stroke-width="3"')}
${p('M42 38 V26 H58 V38', '#e3f4ff', 'stroke-width="3"')}
<rect x="39" y="21" width="22" height="6" rx="3" fill="#b0d8f0" ${S}/>
${c(44, 13, 4, '#ff9cc2', 'stroke-width="2"')}${c(56, 8, 3, '#ff9cc2', 'stroke-width="2"')}${c(62, 17, 2.2, '#ff9cc2', 'stroke-width="1.8"')}
</g>`,

  book: `<g>
${p('M22 16 H84 Q88 16 88 20 V86 Q88 90 84 90 H22 Z', '#fff4d6')}
<path d="M84 22 V84 M80 22 V86" stroke="#d9c79a" stroke-width="2"/>
${p('M14 14 Q14 10 18 10 H78 Q82 10 82 14 V82 Q82 86 78 86 H18 Q14 86 14 82 Z', '#2b6cb0', 'stroke-width="3"')}
<path d="M23 11 V85" stroke="#1d4f86" stroke-width="4"/>
${p('M68 40 H90 Q92 40 92 42 V54 Q92 56 90 56 H68 Z', GOLD)}
${c(76, 48, 3, '#e5383b', 'stroke-width="1.8"')}
${c(46, 48, 15, '#1d4f86', 'stroke-width="2"')}
<path d="M48 37 A11 11 0 1 0 57 52 A8.5 8.5 0 1 1 48 37 Z" fill="${GOLD}" ${E}/>
<path d="${starD(40, 45, 3.4, 1.5)}" fill="${GOLD}"/>
<path d="M26 12 L34 12 L26 20 Z M26 84 L34 84 L26 76 Z" fill="${GOLD}"/>
<path d="M30 70 H62" stroke="#9fc6ef" stroke-width="2.5" stroke-linecap="round"/>
</g>`,

  owl: `<g>
<path d="M10 90 H90" stroke="${O}" stroke-width="8" stroke-linecap="round"/><path d="M10 90 H90" stroke="#8d5524" stroke-width="3.5" stroke-linecap="round"/>
${p('M22 54 C22 40 24 32 26 27 L22 9 L38 19 Q50 15 62 19 L78 9 L74 27 C76 32 78 40 78 54 C78 75 66 88 50 88 C34 88 22 75 22 54 Z', '#9a6b4a', 'stroke-width="3"')}
${p('M36 62 C36 54 42 52 50 52 C58 52 64 54 64 62 C64 76 58 84 50 84 C42 84 36 76 36 62 Z', '#f2dfbf')}
<path d="M43 64 q2 2 4 0 M53 64 q2 2 4 0 M48 71 q2 2 4 0 M43 77 q2 2 4 0 M53 77 q2 2 4 0" fill="none" stroke="#c9a77c" stroke-width="1.8" stroke-linecap="round"/>
${p('M23 50 C17 60 18 74 26 80 C30 72 32 62 30 52 Z M77 50 C83 60 82 74 74 80 C70 72 68 62 70 52 Z', '#7a5236')}
${c(38.5, 38, 11, '#fff', 'stroke-width="2.5"')}${c(61.5, 38, 11, '#fff', 'stroke-width="2.5"')}
<circle cx="39.5" cy="39" r="5.5" fill="${O}"/><circle cx="60.5" cy="39" r="5.5" fill="${O}"/>
<circle cx="41.5" cy="37" r="1.8" fill="#fff"/><circle cx="62.5" cy="37" r="1.8" fill="#fff"/>
${p('M45.5 48 H54.5 L50 55 Z', '#f7a21b', 'stroke-width="2"')}
<path d="M42 88 v3 M46 88 v3 M54 88 v3 M58 88 v3" stroke="#f7a21b" stroke-width="2.5" stroke-linecap="round"/>
</g>`,

  broom: `<g>
<path d="M9 9 L54 54" stroke="${O}" stroke-width="9" stroke-linecap="round"/>
<path d="M9 9 L54 54" stroke="#a0673a" stroke-width="4.5" stroke-linecap="round"/>
${p('M48 60 L60 48 C72 56 85 66 94 76 L88 79 L90 85 L84 86 L85 92 L79 91 L76 95 C66 85 56 72 48 60 Z', '#f2c14e', 'stroke-width="3"')}
<path d="M58 60 L80 86 M64 56 L88 80 M53 64 L70 88" stroke="#c99520" stroke-width="2" stroke-linecap="round"/>
<path d="M46 58 L58 46" stroke="${O}" stroke-width="10" stroke-linecap="round"/><path d="M46 58 L58 46" stroke="#e5383b" stroke-width="5.5" stroke-linecap="round"/>
<path d="${sparkD(24, 62, 6)}" fill="${GOLD}" ${st('stroke-width')} stroke-width="1.8"/><path d="${sparkD(78, 22, 5)}" fill="${GOLD}" ${st('stroke-width')} stroke-width="1.8"/>
</g>`,

  crystal: `<g>
${p('M30 76 Q50 70 70 76 L78 90 Q50 95 22 90 Z', '#d9a441', 'stroke-width="3"')}
${c(50, 42, 32, '#b7a3ff', 'stroke-width="3"')}
<path d="M32 50 C38 58 52 60 62 52 C66 48 64 42 58 44" fill="none" stroke="#e5dcff" stroke-width="3.5" stroke-linecap="round"/>
<path d="M30 32 A22 22 0 0 1 44 20" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity=".8"/>
<path d="${sparkD(56, 34, 8)}" fill="#fff"/><path d="${sparkD(40, 52, 4)}" fill="#fff"/><path d="${sparkD(66, 58, 3)}" fill="#fff"/>
<path d="M32 81 Q50 77 68 81" fill="none" stroke="#a8761f" stroke-width="2.5" stroke-linecap="round"/>
</g>`,

  castle: `<g>
${p('M26 56 V48 H32 V53 H38 V48 H44 V56 Z M56 56 V48 H62 V53 H68 V48 H74 V56 Z', '#b9b0e0')}
${p('M24 56 H76 V92 H24 Z', '#cfc8ef', 'stroke-width="3"')}
${p('M10 44 H28 V92 H10 Z M72 44 H90 V92 H72 Z', '#b9b0e0', 'stroke-width="3"')}
${p('M8 45 L19 22 L30 45 Z M70 45 L81 22 L92 45 Z', '#5b6cf0')}
${p('M38 34 H62 V92 H38 Z', '#cfc8ef', 'stroke-width="3"')}
${p('M35 35 L50 8 L65 35 Z', '#8b5cf6')}
<path d="M50 8 V2" stroke="${O}" stroke-width="2" stroke-linecap="round"/><path d="M50 2 L58 4.5 L50 7 Z" fill="#ff8fab" ${E}/>
${p('M43 92 V78 Q43 70 50 70 Q57 70 57 78 V92 Z', '#5a3a2e')}
<path d="M46 44 h8 v9 h-8 z M15 56 h8 v8 h-8 z M77 56 h8 v8 h-8 z" fill="#ffd84a" ${st('stroke-width')} stroke-width="2"/>
<path d="${starD(19, 32, 2.5, 1.1)}" fill="${GOLD}"/><path d="${starD(81, 32, 2.5, 1.1)}" fill="${GOLD}"/><path d="${starD(50, 24, 3, 1.3)}" fill="${GOLD}"/>
</g>`,

  dragon: `<g>
${p('M36 80 C24 88 10 84 9 72 C8 66 12 62 16 63 C15 70 20 76 32 72 Z', '#4cc38a')}
${p('M16 63 L10 56 L20 58 Z', '#f77f00', 'stroke-width="2"')}
${p('M44 50 C36 40 28 32 16 26 C18 34 20 38 25 41 C24 45 27 48 31 49 C30 53 33 57 37 59 Z', '#2f9e6a')}
<path d="M40 52 L24 37 M38 54 L30 48" stroke="#1f7a4f" stroke-width="1.8" stroke-linecap="round"/>
${p('M40 52 L33 49 L37 56 Z M34 59 L26 58 L31 64 Z M31 67 L23 68 L29 73 Z', '#f77f00', 'stroke-width="2"')}
${p('M30 86 C22 72 28 52 44 48 C60 45 72 58 71 74 C70 84 62 89 50 89 H36 Q31 89 30 86 Z', '#4cc38a', 'stroke-width="3"')}
${p('M46 58 C56 57 63 66 61 79 C60 86 48 87 44 81 C40 74 40 63 46 58 Z', '#ffe08a')}
<path d="M44 66 Q51 64 61 67 M43 74 Q51 72 61 75" fill="none" stroke="#e0b84a" stroke-width="1.8" stroke-linecap="round"/>
<ellipse cx="40" cy="88" rx="7" ry="4" fill="#3aa874" ${S}/><ellipse cx="60" cy="88" rx="7" ry="4" fill="#3aa874" ${S}/>
${p('M50 15 L52 7 L57 13 Z M61 13 L66 5 L68 13 Z', '#fff4d6', 'stroke-width="2"')}
${p('M44 32 C44 20 53 13 63 13 C75 13 85 20 87 30 C89 40 81 47 70 47 H57 C49 47 44 41 44 32 Z', '#4cc38a', 'stroke-width="3"')}
<ellipse cx="62" cy="27" rx="4.2" ry="5" fill="${O}"/><circle cx="63.6" cy="25.2" r="1.6" fill="#fff"/>
<circle cx="79" cy="30" r="1.4" fill="${O}"/><circle cx="84" cy="30" r="1.4" fill="${O}"/>
<path d="M66 38 Q74 43 82 38" fill="none" stroke="${O}" stroke-width="2.2" stroke-linecap="round"/>
<circle cx="56" cy="36" r="3" fill="#ff6b8a" opacity=".4"/>
</g>`,

  cauldron: `<g>
<path d="M28 82 L24 92 M72 82 L76 92" stroke="${O}" stroke-width="6" stroke-linecap="round"/>
${p('M16 46 H84 C87 70 75 87 50 87 C25 87 13 70 16 46 Z', '#3d3d50', 'stroke-width="3"')}
<path d="M24 58 C24 68 30 76 40 79" fill="none" stroke="#6c6c86" stroke-width="3.5" stroke-linecap="round"/>
${p('M18 44 Q22 30 32 36 Q38 24 48 33 Q56 22 64 33 Q74 26 82 44 Z', '#7bd65a')}
<rect x="11" y="40" width="78" height="10" rx="5" fill="#55556c" ${st('stroke-width')} stroke-width="3"/>
${c(30, 22, 4.5, '#7bd65a', 'stroke-width="2"')}${c(60, 14, 5.5, '#7bd65a', 'stroke-width="2"')}${c(72, 26, 3, '#7bd65a', 'stroke-width="2"')}${c(44, 10, 2.5, '#7bd65a', 'stroke-width="1.8"')}
<path d="${sparkD(50, 66, 6)}" fill="${GOLD}"/>
</g>`,

  badge: `<g>
${c(50, 50, 42, '#5126b0', 'stroke-width="3"')}
<circle cx="50" cy="50" r="34" fill="none" stroke="${GOLD}" stroke-width="3.5"/>
${p('M34 70 C38 58 42 44 47 32 C50 24 55 19 62 18 Q68 18 72 23 Q65 23 61 28 C61 44 64 58 68 70 Z', '#8b5cf6')}
<ellipse cx="50" cy="71" rx="25" ry="5.5" fill="#8b5cf6" ${S}/>
${p('M36 64 Q51 68 66 64 L68 70 Q51 75 34 70 Z', GOLD, 'stroke-width="2"')}
<path d="${starD(52, 46, 4.5, 2)}" fill="${GOLD}"/>
<path d="${sparkD(26, 38, 5)}" fill="${GOLD}"/><path d="${sparkD(76, 42, 4)}" fill="${GOLD}"/><circle cx="30" cy="58" r="1.6" fill="${GOLD}"/>
</g>`,

  pattern: `<g fill="none" stroke="#000" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
<path d="${starD(18, 18, 6, 2.6)}"/>
<path d="M76 8 A9 9 0 1 0 84 22 A7 7 0 1 1 76 8 Z" fill="#000"/>
<path d="M45 58 C47 52 49 46 51 42 Q54 39 57 41 Q55 42 54 44 C55 49 57 54 59 58 Z M41 58 H63"/>
<path d="${sparkD(20, 76, 6)}" fill="#000"/>
<path d="M74 66 H80 V71 A8 8 0 1 1 74 71 Z"/>
<circle cx="88" cy="46" r="1.2" fill="#000"/><circle cx="8" cy="46" r="1.2" fill="#000"/>
</g>`,
}
