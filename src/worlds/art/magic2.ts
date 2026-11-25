/* Magic world, set 2: original illustrations of magical things (viewBox 0 0 100 100). */

const O = '#2b2b3a'
const S = `stroke="${O}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`
/** outline attrs; a stroke-width given in `extra` replaces the default one */
const st = (extra: string) => (extra.includes('stroke-width') ? S.replace(/ stroke-width="[^"]*"/, '') : S)
const p = (d: string, fill: string, extra = '') => `<path d="${d}" fill="${fill}" ${st(extra)} ${extra}/>`
const c = (x: number, y: number, r: number, fill: string, extra = '') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${st(extra)} ${extra}/>`
const E = 'stroke="#2b2b3a" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"'
/** thick outlined line: dark outline under a coloured core */
const line = (d: string, col: string, w1: number, w2: number) =>
  `<path d="${d}" fill="none" stroke="${O}" stroke-width="${w1}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w2}" stroke-linecap="round" stroke-linejoin="round"/>`
const shine = (d: string, w = 3) =>
  `<path d="${d}" fill="none" stroke="#fff" stroke-width="${w}" stroke-linecap="round" opacity=".5"/>`

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
const spark = (x: number, y: number, R: number, fill = GOLD) =>
  `<path d="${sparkD(x, y, R)}" fill="${fill}" ${st('stroke-width')} stroke-width="1.6"/>`
/** small cute face: eyes at (x±dx, y), smile below */
const face = (x: number, y: number, dx: number, r = 2.6) =>
  `<ellipse cx="${x - dx}" cy="${y}" rx="${r}" ry="${r * 1.2}" fill="${O}"/><ellipse cx="${x + dx}" cy="${y}" rx="${r}" ry="${r * 1.2}" fill="${O}"/>` +
  `<circle cx="${x - dx + r * 0.4}" cy="${y - r * 0.45}" r="${r * 0.38}" fill="#fff"/><circle cx="${x + dx + r * 0.4}" cy="${y - r * 0.45}" r="${r * 0.38}" fill="#fff"/>` +
  `<path d="M${x - r * 1.5} ${y + r * 2} Q${x} ${y + r * 3.4} ${x + r * 1.5} ${y + r * 2}" fill="none" stroke="${O}" stroke-width="2" stroke-linecap="round"/>` +
  `<circle cx="${x - dx - r * 1.4}" cy="${y + r * 2}" r="${r}" fill="#ff6b8a" opacity=".35"/><circle cx="${x + dx + r * 1.4}" cy="${y + r * 2}" r="${r}" fill="#ff6b8a" opacity=".35"/>`

const GOLD = '#ffd84a'

export const ART: Record<string, string> = {
  unicorn: `<g>
${p('M20 56 C8 52 4 66 10 76 C12 70 16 66 22 66 Z', '#ff8fab')}
<path d="M10 64 Q12 60 18 58" fill="none" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round"/>
${p('M24 66 H33 V88 H24 Z M54 66 H63 V88 H54 Z', '#f1ecff')}
${p('M33 66 H42 V90 H33 Z M63 66 H72 V90 H63 Z', '#fff')}
<path d="M24 84 H33 M54 84 H63 M33 86 H42 M63 86 H72" stroke="#b7a3ff" stroke-width="4"/>
${p('M20 60 C20 48 30 44 46 44 L62 44 C72 44 76 50 76 60 C76 72 68 76 48 76 C28 76 20 72 20 60 Z', '#fff', 'stroke-width="3"')}
${p('M58 52 L62 30 L84 34 L74 56 Z', '#fff', 'stroke-width="0"')}
${p('M58 50 C58 40 60 32 64 26', 'none', 'stroke-width="3"')}
${p('M66 28 C64 18 72 12 82 16 C92 20 96 34 92 40 C88 46 80 46 74 42 L74 56', '#fff', 'stroke-width="3"')}
${p('M64 22 L62 10 L72 18 Z', '#fff')}
${p('M72 16 L80 2 L82 18 Z', GOLD)}
<path d="M74 12 L80 13 M76 8 L80.5 8.5" stroke="#d9a400" stroke-width="1.6" stroke-linecap="round"/>
${p('M66 20 C54 22 50 32 52 44 C46 50 46 58 50 62 C52 54 56 50 60 50 C58 42 60 32 68 28 Z', '#ff8fab')}
<path d="M62 24 C56 30 55 38 56 46" fill="none" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round"/>
<ellipse cx="78" cy="28" rx="2.6" ry="3.2" fill="${O}"/><circle cx="79" cy="27" r="1" fill="#fff"/>
<circle cx="89" cy="36" r="1.3" fill="${O}"/>
<circle cx="80" cy="37" r="3" fill="#ff6b8a" opacity=".35"/>
${spark(30, 30, 6)}
</g>`,

  mushroom: `<g>
${p('M14 92 Q18 84 22 92 Q25 84 28 92 Z M72 92 Q76 84 80 92 Q83 84 86 92 Z', '#2e9a48', 'stroke-width="2"')}
${p('M34 52 C32 66 30 80 28 92 H72 C70 80 68 66 66 52 Z', '#fff4d6', 'stroke-width="3"')}
${face(50, 70, 7)}
${p('M8 54 C8 26 28 8 50 8 C72 8 92 26 92 54 Q72 62 50 60 Q28 62 8 54 Z', '#e5383b', 'stroke-width="3"')}
${c(30, 30, 7, '#fff', 'stroke-width="0"')}${c(56, 22, 6, '#fff', 'stroke-width="0"')}${c(74, 38, 7, '#fff', 'stroke-width="0"')}${c(46, 44, 5, '#fff', 'stroke-width="0"')}${c(18, 46, 3.5, '#fff', 'stroke-width="0"')}${c(84, 52, 2.8, '#fff', 'stroke-width="0"')}
${shine('M18 34 Q24 20 36 14', 3.5)}
</g>`,

  scroll: `<g transform="rotate(-8 50 50)">
${p('M20 16 H80 V84 H20 Z', '#f6e6bc', 'stroke-width="3"')}
<path d="M30 32 Q40 28 50 32 T70 32 M30 44 Q40 40 50 44 T70 44 M30 56 Q38 52 46 56 T60 56" fill="none" stroke="#b08a4a" stroke-width="2.2" stroke-linecap="round"/>
<path d="${starD(66, 60, 5, 2.2)}" fill="#8b5cf6"/>
<rect x="10" y="8" width="80" height="14" rx="7" fill="#e2c584" ${st('stroke-width')} stroke-width="3"/>
<rect x="10" y="78" width="80" height="14" rx="7" fill="#e2c584" ${st('stroke-width')} stroke-width="3"/>
${c(14, 15, 4, '#c9a34a', 'stroke-width="2"')}${c(86, 15, 4, '#c9a34a', 'stroke-width="2"')}${c(14, 85, 4, '#c9a34a', 'stroke-width="2"')}${c(86, 85, 4, '#c9a34a', 'stroke-width="2"')}
${p('M44 78 L40 96 L46 92 L48 97 L50 80 Z M56 78 L60 96 L54 92 L52 97 L50 80 Z', '#e5383b', 'stroke-width="2"')}
${c(50, 78, 7, '#e5383b')}
<path d="${starD(50, 78, 3.6, 1.6)}" fill="#ff9a9c"/>
</g>`,

  key: `<g transform="rotate(35 50 50)">
${p('M46 40 H54 V80 H66 V86 H60 V91 H54 V94 H46 Z', '#c9ced6', 'stroke-width="3"')}
<path d="M54 82 H62" stroke="${O}" stroke-width="1.8"/>
${c(50, 12, 10, '#c9ced6', 'stroke-width="3"')}${c(37, 26, 10, '#c9ced6', 'stroke-width="3"')}${c(63, 26, 10, '#c9ced6', 'stroke-width="3"')}${c(50, 30, 10, '#c9ced6', 'stroke-width="3"')}
<circle cx="50" cy="12" r="8.5" fill="#c9ced6"/><circle cx="37" cy="26" r="8.5" fill="#c9ced6"/><circle cx="63" cy="26" r="8.5" fill="#c9ced6"/><circle cx="50" cy="28" r="10" fill="#c9ced6"/>
${c(50, 24, 6.5, '#8b5cf6', 'stroke-width="2"')}
<circle cx="48" cy="22" r="2" fill="#fff" opacity=".8"/>
<rect x="42" y="44" width="16" height="6" rx="3" fill="#9aa0a6" ${S}/>
<rect x="42" y="56" width="16" height="5" rx="2.5" fill="#9aa0a6" ${S}/>
${shine('M33 21 A6 6 0 0 1 38 19', 2.5)}
</g>`,

  lantern: `<g>
<circle cx="50" cy="54" r="24" fill="#ffc83d" opacity=".25"/>
${p('M50 4 C62 4 62 16 50 16 C38 16 38 4 50 4 Z', 'none', 'stroke-width="3"')}
${p('M34 26 L40 16 H60 L66 26 Z', '#3d3d50', 'stroke-width="3"')}
${p('M30 26 H70 V32 H30 Z', '#55556c')}
${p('M33 32 H67 L64 76 H36 Z', '#ffb347', 'stroke-width="3"')}
<path d="M50 40 C58 50 60 58 56 64 C54 67 46 67 44 64 C40 58 42 50 50 40 Z" fill="#f77f00"/>
<path d="M50 52 C53 56 54 60 52 63 C51 64 49 64 48 63 C46 60 47 56 50 52 Z" fill="#fff3a0"/>
<path d="M42 32 L40 76 M58 32 L60 76" stroke="#3d3d50" stroke-width="2.5"/>
${p('M28 76 H72 V84 H28 Z', '#55556c', 'stroke-width="3"')}
${p('M34 84 H66 L62 92 H38 Z', '#3d3d50')}
${shine('M37 38 L36 68', 3)}
${spark(16, 30, 5)}${spark(86, 44, 4)}
</g>`,

  frog: `<g>
${p('M16 90 Q12 84 20 82 L30 84 L22 90 Z M84 90 Q88 84 80 82 L70 84 L78 90 Z', '#25803b')}
${p('M18 80 C12 58 28 42 50 42 C72 42 88 58 82 80 Q50 92 18 80 Z', '#2e9a48', 'stroke-width="3"')}
<ellipse cx="50" cy="74" rx="20" ry="12" fill="#b8ea6a"/>
${p('M30 80 Q28 90 22 92 H40 Q40 86 36 80 Z M70 80 Q72 90 78 92 H60 Q60 86 64 80 Z', '#2e9a48')}
${c(33, 36, 13, '#2e9a48', 'stroke-width="3"')}${c(67, 36, 13, '#2e9a48', 'stroke-width="3"')}
${c(33, 35, 8.5, '#fff', 'stroke-width="2"')}${c(67, 35, 8.5, '#fff', 'stroke-width="2"')}
<circle cx="34" cy="36" r="4.6" fill="${O}"/><circle cx="66" cy="36" r="4.6" fill="${O}"/>
<circle cx="35.6" cy="34" r="1.6" fill="#fff"/><circle cx="67.6" cy="34" r="1.6" fill="#fff"/>
<path d="M30 56 Q50 70 70 56" fill="none" stroke="${O}" stroke-width="2.6" stroke-linecap="round"/>
<circle cx="25" cy="56" r="4" fill="#ff6b8a" opacity=".4"/><circle cx="75" cy="56" r="4" fill="#ff6b8a" opacity=".4"/>
<circle cx="46" cy="50" r="1.2" fill="${O}"/><circle cx="54" cy="50" r="1.2" fill="${O}"/>
${shine('M24 30 A11 11 0 0 1 30 25', 2.5)}
</g>`,

  cat: `<g>
${line('M64 84 Q88 84 86 60 Q84 44 92 36', '#2f2f3a', 11, 6)}
${p('M28 92 C22 74 30 56 50 56 C70 56 78 74 72 92 Z', '#2f2f3a', 'stroke-width="3"')}
<ellipse cx="50" cy="76" rx="9" ry="11" fill="#4a4a5a"/>
${p('M26 28 L22 6 L44 18 Z M74 28 L78 6 L56 18 Z', '#2f2f3a', 'stroke-width="3"')}
<path d="M28 22 L27 13 L36 19 Z M72 22 L73 13 L64 19 Z" fill="#ff8fab"/>
<ellipse cx="50" cy="37" rx="27" ry="22" fill="#2f2f3a" ${st('stroke-width')} stroke-width="3"/>
<ellipse cx="39" cy="36" rx="7" ry="8" fill="#7bd65a" ${E}/><ellipse cx="61" cy="36" rx="7" ry="8" fill="#7bd65a" ${E}/>
<ellipse cx="39" cy="36" rx="2.2" ry="6" fill="${O}"/><ellipse cx="61" cy="36" rx="2.2" ry="6" fill="${O}"/>
<circle cx="41" cy="33" r="1.6" fill="#fff"/><circle cx="63" cy="33" r="1.6" fill="#fff"/>
<path d="M47 45 H53 L50 48.5 Z" fill="#ff8fab"/>
<path d="M50 48.5 Q46 53 43 50 M50 48.5 Q54 53 57 50" fill="none" stroke="#9a9ab0" stroke-width="1.8" stroke-linecap="round"/>
<path d="M30 44 L18 42 M30 48 L19 51 M70 44 L82 42 M70 48 L81 51" stroke="#9a9ab0" stroke-width="1.5" stroke-linecap="round"/>
<path d="M36 58 Q50 64 64 58" fill="none" stroke="#8b5cf6" stroke-width="4" stroke-linecap="round"/>
${c(50, 63, 4, GOLD, 'stroke-width="1.8"')}
<ellipse cx="41" cy="90" rx="6.5" ry="4" fill="#2f2f3a" ${S}/><ellipse cx="59" cy="90" rx="6.5" ry="4" fill="#2f2f3a" ${S}/>
</g>`,

  star: `<g>
<path d="M14 88 Q26 82 34 70" fill="none" stroke="#ffd84a" stroke-width="5" stroke-linecap="round" opacity=".7"/>
<path d="M8 76 Q20 74 28 64" fill="none" stroke="#ff8fab" stroke-width="4" stroke-linecap="round" opacity=".7"/>
<g transform="rotate(12 56 46)">
${p(starD(56, 48, 40, 18), '#ffc83d', 'stroke-width="3"')}
<path d="M56 16 L61 32" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
</g>
${face(56, 48, 7.5, 2.8)}
${spark(18, 20, 7)}${spark(90, 86, 5)}<circle cx="30" cy="40" r="2" fill="${GOLD}"/>
</g>`,

  crown: `<g>
${p('M12 76 L8 30 L30 50 L50 18 L70 50 L92 30 L88 76 Z', '#ffc83d', 'stroke-width="3"')}
${p('M12 70 H88 V86 Q50 92 12 86 Z', '#e0a000', 'stroke-width="3"')}
${c(8, 28, 5, '#ffc83d')}${c(50, 15, 5.5, '#ffc83d')}${c(92, 28, 5, '#ffc83d')}
${c(50, 78, 5.5, '#e5383b', 'stroke-width="2"')}${p('M27 73 L32 78 L27 83 L22 78 Z M73 73 L78 78 L73 83 L68 78 Z', '#1d70d8', 'stroke-width="2"')}
<path d="M50 40 L56 52 L50 62 L44 52 Z" fill="#2e9a48" ${E}/>
${shine('M18 44 L20 64', 3.5)}
<circle cx="48.5" cy="76.5" r="1.6" fill="#fff" opacity=".8"/>
</g>`,

  rabbit: `<g>
${p('M30 16 C24 2 36 0 40 10 C42 18 42 28 42 32 L34 32 C34 26 32 20 30 16 Z', '#fff', 'stroke-width="3"')}
${p('M70 16 C76 2 64 0 60 10 C58 18 58 28 58 32 L66 32 C66 26 68 20 70 16 Z', '#fff', 'stroke-width="3"')}
<path d="M33 14 C31 8 36 6 37 11 C38 16 38 22 38 27" fill="none" stroke="#ff8fab" stroke-width="3.5" stroke-linecap="round"/>
<path d="M67 14 C69 8 64 6 63 11 C62 16 62 22 62 27" fill="none" stroke="#ff8fab" stroke-width="3.5" stroke-linecap="round"/>
<ellipse cx="50" cy="44" rx="20" ry="17" fill="#fff" ${st('stroke-width')} stroke-width="3"/>
${face(50, 42, 7, 2.6)}
<path d="M48 46.5 H52 L50 48.5 Z" fill="#ff6b8a"/>
${p('M22 60 H78 L72 92 H28 Z', '#8b5cf6', 'stroke-width="3"')}
<path d="M23.5 68 H76.5 L75 76 H25 Z" fill="${GOLD}" ${E}/>
<ellipse cx="50" cy="58" rx="36" ry="8" fill="#5126b0" ${st('stroke-width')} stroke-width="3"/>
<path d="M22 58 Q50 50 78 58" fill="none" stroke="#2f1a70" stroke-width="2"/>
${p('M30 58 C28 54 36 52 38 56 M70 58 C72 54 64 52 62 56', '#fff', 'stroke-width="2.5"')}
${spark(14, 36, 6)}${spark(88, 40, 5)}
</g>`,

  candle: `<g>
<circle cx="50" cy="20" r="16" fill="#ffc83d" opacity=".3"/>
${p('M50 6 C58 14 60 22 56 28 C54 31 46 31 44 28 C40 22 42 14 50 6 Z', '#ffb347', 'stroke-width="2.5"')}
<path d="M50 16 C53 20 54 24 52 27 C51 28 49 28 48 27 C46 24 47 20 50 16 Z" fill="#fff3a0"/>
<path d="M50 30 V36" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/>
${p('M36 40 Q36 34 44 35 Q50 36 56 35 Q64 34 64 40 V82 H36 Z', '#1d70d8', 'stroke-width="3"')}
${p('M36 40 Q36 34 44 35 Q50 36 56 35 Q64 34 64 40 V46 Q62 52 59 46 Q56 42 54 50 Q52 56 50 48 Q47 42 44 46 Q40 52 36 46 Z', '#7fb8f2', 'stroke-width="2"')}
${shine('M42 54 V76', 3.5)}
${line('M82 80 C94 80 94 64 82 66', '#ffc83d', 8, 3.5)}
${p('M10 82 Q10 78 16 78 H84 Q90 78 90 82 Q90 92 50 92 Q10 92 10 82 Z', '#ffc83d', 'stroke-width="3"')}
<path d="M18 84 Q50 88 82 84" fill="none" stroke="#d99a10" stroke-width="2" stroke-linecap="round"/>
</g>`,

  chest: `<g>
${p('M10 52 H90 V86 Q90 90 86 90 H14 Q10 90 10 86 Z', '#8d5524', 'stroke-width="3"')}
${p('M10 52 V40 C10 20 26 14 50 14 C74 14 90 20 90 40 V52 Z', '#a8682f', 'stroke-width="3"')}
<path d="M14 70 H86 M14 34 Q50 26 86 34" fill="none" stroke="#5e3614" stroke-width="2.2" stroke-linecap="round"/>
${p('M22 16 H32 V90 H22 Z M68 16 H78 V90 H68 Z', GOLD)}
${p('M8 48 H92 V56 H8 Z', GOLD)}
${p('M42 46 H58 V64 Q58 68 54 68 H46 Q42 68 42 64 Z', GOLD)}
<path d="M50 54 V61" stroke="${O}" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="53" r="2.4" fill="${O}"/>
${shine('M16 38 Q18 26 30 21', 3)}
${spark(88, 12, 6)}${spark(12, 10, 4)}
</g>`,

  mirror: `<g transform="rotate(-18 50 50)">
${p('M45 66 H55 L57 90 Q57 95 50 95 Q43 95 43 90 Z', '#d6336c', 'stroke-width="3"')}
<path d="M46 76 H54" stroke="${O}" stroke-width="2"/>
${c(50, 68, 6, '#ff8fab')}
<ellipse cx="50" cy="38" rx="28" ry="32" fill="#ff8fab" ${st('stroke-width')} stroke-width="3"/>
${p('M44 6 Q50 -2 56 6 Q50 12 44 6 Z', '#ff8fab', 'stroke-width="2"')}
<ellipse cx="50" cy="38" rx="20" ry="24" fill="#bfe6ff" ${st('stroke-width')} stroke-width="2.5"/>
<path d="M38 30 Q40 20 48 17 M37 40 L48 26" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="50" cy="10" r="1.8" fill="${GOLD}"/>
<circle cx="24" cy="38" r="2.2" fill="#fff" ${E}/><circle cx="76" cy="38" r="2.2" fill="#fff" ${E}/>
${spark(60, 48, 5, '#fff')}
</g>`,

  fairy: `<g>
${p('M46 46 C34 26 12 22 10 34 C8 46 28 50 46 50 Z M54 46 C66 26 88 22 90 34 C92 46 72 50 54 50 Z', '#c9e9ff', 'stroke-width="2.5"')}
${p('M46 52 C30 54 16 66 22 74 C28 80 40 66 47 56 Z M54 52 C70 54 84 66 78 74 C72 80 60 66 53 56 Z', '#e9d9ff', 'stroke-width="2.5"')}
<path d="M44 46 C34 36 22 32 16 34 M56 46 C66 36 78 32 84 34" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
<path d="M45 84 V92 M55 84 V92" stroke="${O}" stroke-width="5" stroke-linecap="round"/><path d="M45 84 V92 M55 84 V92" stroke="#f6d2b5" stroke-width="2.2" stroke-linecap="round"/>
${p('M43 46 Q50 43 57 46 L68 84 Q50 90 32 84 Z', '#2ec4b6', 'stroke-width="2.6"')}
<path d="M34 80 Q50 86 66 80" fill="none" stroke="#1b8f84" stroke-width="2.5"/>
${line('M44 52 L34 62', '#f6d2b5', 7, 3.4)}
${line('M56 52 L70 46', '#f6d2b5', 7, 3.4)}
<path d="M70 46 L82 20" stroke="${O}" stroke-width="2.4" stroke-linecap="round"/>
<path d="${starD(83, 17, 7, 3)}" fill="${GOLD}" ${E}/>
${c(50, 13, 6.5, '#e2a93b')}
${c(50, 30, 13, '#f6d2b5')}
${p('M37 30 C35 18 44 14 50 15 C58 14 66 18 63 30 C60 23 55 21 50 23 C45 21 40 23 37 30 Z', '#e2a93b')}
${face(50, 32, 5, 2.2)}
${spark(16, 86, 4)}${spark(88, 64, 4)}
</g>`,
}
