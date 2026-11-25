/* Superheroes world, set 2: original illustrations of hero gear (viewBox 0 0 100 100). */

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

export const ART: Record<string, string> = {
  ring: `<g>
${p('M18 63 A32 30 0 1 0 82 63 A32 30 0 1 0 18 63 Z M28 63 A22 20 0 1 1 72 63 A22 20 0 1 1 28 63 Z', '#ffc83d', 'fill-rule="evenodd" stroke-width="3"')}
${shine('M24 70 A26 24 0 0 1 30 46', 3.5)}
${p('M38 40 H62 L57 30 H43 Z', '#e0a000')}
${p('M28 22 L37 8 H63 L72 22 L50 42 Z', '#ff8fab', 'stroke-width="3"')}
<path d="M28 22 H72 M37 8 L44 22 L50 42 M63 8 L56 22 L50 42" fill="none" stroke="#d6336c" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M40 11 L36 18" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
<path d="${sparkD(84, 20, 6)}" fill="#fff" ${E}/>
</g>`,

  medal: `<g>
${p('M18 6 H40 L60 52 H42 Z', '#1d70d8')}
${p('M82 6 H60 L40 52 H58 Z', '#e5383b')}
<path d="M23 6 L44 52 M77 6 L56 52" stroke="#fff" stroke-width="2" opacity=".5"/>
${c(50, 67, 25, '#ffc83d', 'stroke-width="3"')}
<circle cx="50" cy="67" r="18" fill="none" stroke="#e0a000" stroke-width="2.5"/>
<path d="${starD(50, 68, 12, 5.2)}" fill="#fff" ${S}/>
${shine('M32 58 A19 19 0 0 1 40 50', 3.5)}
</g>`,

  flashlight: `<g transform="rotate(-14 50 54) translate(0 4)">
<path d="M66 33 L92 20 V80 L66 67 Z" fill="#fff3a0" opacity=".9"/>
<path d="M75 40 L87 35 M75 60 L87 65" stroke="#ffd84a" stroke-width="3" stroke-linecap="round"/>
${p('M8 40 Q8 36 12 36 H50 V64 H12 Q8 64 8 60 Z', '#8b5cf6', 'stroke-width="3"')}
${p('M50 36 L64 28 V72 L50 64 Z', '#6a3fd6', 'stroke-width="3"')}
<rect x="62" y="26" width="7" height="48" rx="3" fill="#c9ced6" ${S}/>
<path d="M16 36 V64 M22 36 V64" stroke="#5126b0" stroke-width="2.2"/>
<rect x="30" y="30" width="10" height="7" rx="2" fill="#ffc83d" ${S}/>
${shine('M28 41 H46', 3)}
</g>`,

  key: `<g transform="rotate(-30 50 50)">
${p('M40 44 H92 V56 H90 V67 H82 V56 H77 V71 H69 V56 H40 Z', '#9aa0a6', 'stroke-width="3"')}
${p('M8 50 A18 18 0 1 0 44 50 A18 18 0 1 0 8 50 Z M18 50 A8 8 0 1 1 34 50 A8 8 0 1 1 18 50 Z', '#9aa0a6', 'fill-rule="evenodd" stroke-width="3"')}
${shine('M13 44 A13 13 0 0 1 22 36', 3)}
${shine('M46 48 H86', 2.5)}
</g>`,

  rope: `<g transform="translate(-7 2)">
${line('M50 50 A7 7 0 0 1 64 50 A14 14 0 0 1 36 50 A21 21 0 0 1 78 50 A28 28 0 0 1 22 50 A35 35 0 0 1 92 50 Q94 70 84 80 Q78 86 84 90', '#c58a4a', 10, 5.5)}
<path d="M50 50 A7 7 0 0 1 64 50 A14 14 0 0 1 36 50 A21 21 0 0 1 78 50 A28 28 0 0 1 22 50 A35 35 0 0 1 92 50 Q94 70 84 80 Q78 86 84 90" fill="none" stroke="#8d5524" stroke-width="5.5" stroke-dasharray="1.5 3.5"/>
${p('M81 87 L80 95 M85 87 L86 95', 'none', 'stroke-width="2.5"')}
</g>`,

  magnet: `<g>
${p('M14 12 H40 V54 A10 10 0 0 0 60 54 V12 H86 V54 A36 36 0 0 1 14 54 Z', '#e5383b', 'stroke-width="3"')}
${p('M14 12 H40 V30 H14 Z M60 12 H86 V30 H60 Z', '#dfe4ec', 'stroke-width="3"')}
${shine('M21 36 V56 Q22 70 32 78', 4)}
<path d="M20 4 L23 8 M27 2 V7 M34 4 L31 8 M66 4 L69 8 M73 2 V7 M80 4 L77 8" stroke="${O}" stroke-width="2" stroke-linecap="round"/>
</g>`,

  trophy: `<g>
${line('M28 26 C10 24 12 50 32 50 M72 26 C90 24 88 50 68 50', '#ffc83d', 10, 5)}
${p('M24 12 H76 V32 C76 52 64 62 50 62 C36 62 24 52 24 32 Z', '#ffc83d', 'stroke-width="3"')}
${p('M44 61 H56 L58 74 H42 Z', '#e0a000')}
${p('M34 74 H66 V82 H34 Z', '#ffc83d')}
${p('M26 82 H74 V92 H26 Z', '#8d5524')}
<path d="${starD(50, 34, 11, 4.8)}" fill="#fff" ${S}/>
${shine('M31 18 V34 Q32 44 38 50', 3.5)}
</g>`,

  spotlight: `<g>
<path d="M57 59 L36 38 L60 4 H96 V20 Z" fill="#fff3a0" opacity=".9"/>
<path d="${starD(76, 22, 10, 4.4)}" fill="#2f2f3a"/>
${line('M32 64 L22 88 M32 64 L44 88', '#4a4a5a', 8, 3.5)}
<rect x="12" y="86" width="42" height="7" rx="3" fill="#4a4a5a" ${S}/>
<g transform="rotate(-45 32 62)">
<rect x="10" y="50" width="38" height="24" rx="5" fill="#2f2f3a" ${st('stroke-width')} stroke-width="3"/>
<path d="M18 50 V74 M26 50 V74" stroke="#4a4a5a" stroke-width="2.5"/>
<rect x="45" y="45" width="9" height="34" rx="3" fill="#6c6c82" ${S}/>
<path d="M53 49 V75" stroke="#ffe680" stroke-width="3" stroke-linecap="round"/>
</g>
${c(32, 62, 4, '#9aa0a6', 'stroke-width="2"')}
</g>`,

  gem: `<g>
${p('M10 36 L30 12 H70 L90 36 L50 92 Z', '#7fd1ff', 'stroke-width="3"')}
<path d="M10 36 H90 M30 12 L40 36 L50 92 M70 12 L60 36 L50 92 M40 36 L50 12 L60 36" fill="none" stroke="#3a9fd8" stroke-width="2" stroke-linejoin="round"/>
<path d="M33 16 L24 28 H34 Z" fill="#fff" opacity=".75"/>
<path d="M44 40 L50 70" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>
<path d="${sparkD(84, 14, 7)}" fill="#fff" ${E}/>
</g>`,

  bridge: `<g>
${p('M6 82 Q14 78 22 82 T38 82 T54 82 T70 82 T86 82 Q90 80 94 82 V94 H6 Z', '#9fd0ff')}
${p('M25 18 H35 V84 H25 Z M65 18 H75 V84 H65 Z', '#1d70d8', 'stroke-width="3"')}
<path d="M25 30 H35 M65 30 H75 M25 44 H35 M65 44 H75" stroke="${O}" stroke-width="2"/>
<path d="M38 60 V44 M44 60 V38 M50 60 V36 M56 60 V38 M62 60 V44 M16 60 V46 M10 60 V54 M84 60 V46 M90 60 V54" stroke="${O}" stroke-width="1.8"/>
<path d="M4 56 Q18 50 30 20 Q50 64 70 20 Q82 50 96 56" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>
<rect x="4" y="58" width="92" height="9" rx="2" fill="#0e3f85" ${S}/>
<path d="M8 62.5 H92" stroke="#ffc83d" stroke-width="1.8" stroke-dasharray="5 4"/>
</g>`,

  kitten: `<g>
${line('M66 84 Q86 86 86 70 Q86 60 78 58', '#f7a23a', 11, 6)}
${p('M30 90 C26 76 32 60 50 60 C68 60 74 76 70 90 Z', '#f7a23a', 'stroke-width="3"')}
${p('M42 70 Q50 66 58 70 L56 86 H44 Z', '#fff3e0', 'stroke-width="0"')}
<ellipse cx="41" cy="89" rx="7" ry="4.5" fill="#fff3e0" ${S}/><ellipse cx="59" cy="89" rx="7" ry="4.5" fill="#fff3e0" ${S}/>
${p('M27 30 L24 8 L44 20 Z M73 30 L76 8 L56 20 Z', '#f7a23a', 'stroke-width="3"')}
<path d="M29 25 L28 15 L38 21 Z M71 25 L72 15 L62 21 Z" fill="#ff8fab"/>
<ellipse cx="50" cy="39" rx="27" ry="23" fill="#f7a23a" ${st('stroke-width')} stroke-width="3"/>
<path d="M44 18 L45 25 M50 17 V25 M56 18 L55 25" stroke="#c45a00" stroke-width="2.5" stroke-linecap="round"/>
<ellipse cx="40" cy="39" rx="5" ry="6" fill="${O}"/><ellipse cx="60" cy="39" rx="5" ry="6" fill="${O}"/>
<circle cx="41.8" cy="36.6" r="1.8" fill="#fff"/><circle cx="61.8" cy="36.6" r="1.8" fill="#fff"/>
<path d="M47 46 H53 L50 49.5 Z" fill="#ff6b8a" ${E}/>
<path d="M50 49.5 Q46 54 43 51 M50 49.5 Q54 54 57 51" fill="none" stroke="${O}" stroke-width="1.8" stroke-linecap="round"/>
<path d="M32 46 L19 44 M32 50 L20 53 M68 46 L81 44 M68 50 L80 53" stroke="${O}" stroke-width="1.5" stroke-linecap="round"/>
<circle cx="33" cy="51" r="3" fill="#ff6b8a" opacity=".35"/><circle cx="67" cy="51" r="3" fill="#ff6b8a" opacity=".35"/>
</g>`,

  flag: `<g>
${p('M26 16 C40 9 54 22 68 16 Q80 11 90 14 V54 Q80 51 68 56 C54 62 40 49 26 56 Z', '#2e9a48', 'stroke-width="3"')}
<path d="M30 22 C40 18 50 26 60 22" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"/>
<path d="${starD(57, 36, 11, 4.8)}" fill="#ffc83d" ${S}/>
${line('M22 12 V88', '#9aa0a6', 8, 3.5)}
${c(22, 9, 5, '#ffc83d')}
${p('M10 92 Q10 86 16 86 H28 Q34 86 34 92 Z', '#6c6c82')}
</g>`,

  map: `<g>
${p('M8 22 L36 12 L64 22 L92 12 V78 L64 88 L36 78 L8 88 Z', '#f3dfae', 'stroke-width="3"')}
<path d="M36 12 L64 22 V88 L36 78 Z" fill="#e2c584"/>
<path d="M36 12 V78 M64 22 V88" stroke="${O}" stroke-width="2"/>
<path d="M14 40 Q20 32 28 38 Q30 46 22 48 Q14 48 14 40 Z" fill="#7fd1ff" ${E}/>
<path d="M44 66 L50 56 L56 66 Z M50 70 L55 62 L60 70 Z" fill="#2e9a48" ${E}/>
<path d="M18 72 Q30 58 40 52 T60 44 T78 36" fill="none" stroke="#c0392b" stroke-width="2.5" stroke-dasharray="1 5" stroke-linecap="round"/>
<path d="M74 22 L86 34 M86 22 L74 34" stroke="#e5383b" stroke-width="5" stroke-linecap="round"/>
<path d="M74 22 L86 34 M86 22 L74 34" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round"/>
</g>`,

  binoculars: `<g>
${p('M18 14 H40 V32 H18 Z M60 14 H82 V32 H60 Z', '#4a4a5a', 'stroke-width="3"')}
${p('M8 40 Q8 30 18 30 H40 Q46 30 46 40 V82 Q46 90 38 90 H16 Q8 90 8 82 Z', '#2f2f3a', 'stroke-width="3"')}
${p('M54 40 Q54 30 60 30 H82 Q92 30 92 40 V82 Q92 90 84 90 H62 Q54 90 54 82 Z', '#2f2f3a', 'stroke-width="3"')}
<rect x="42" y="36" width="16" height="20" rx="4" fill="#6c6c82" ${S}/>
<path d="M8 46 H46 M54 46 H92" stroke="#4a4a5a" stroke-width="3"/>
${c(27, 68, 14, '#7fd1ff', 'stroke-width="3"')}${c(73, 68, 14, '#7fd1ff', 'stroke-width="3"')}
<circle cx="27" cy="68" r="8" fill="#3a9fd8"/><circle cx="73" cy="68" r="8" fill="#3a9fd8"/>
<path d="M19 62 A9 9 0 0 1 25 57 M65 62 A9 9 0 0 1 71 57" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
</g>`,
}
