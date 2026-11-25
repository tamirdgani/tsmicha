/* Superheroes world: original illustrations (viewBox 0 0 100 100). */

const O = '#2b2b3a'
const S = `stroke="${O}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`
/** outline attrs; a stroke-width given in `extra` replaces the default one */
const st = (extra: string) => (extra.includes('stroke-width') ? S.replace(/ stroke-width="[^"]*"/, '') : S)
const p = (d: string, fill: string, extra = '') => `<path d="${d}" fill="${fill}" ${st(extra)} ${extra}/>`
const c = (x: number, y: number, r: number, fill: string, extra = '') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${st(extra)} ${extra}/>`

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

/* ---- chest emblems, centred on (50,57) ---- */
const E = 'stroke="#2b2b3a" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"'
const EMBLEM: Record<string, string> = {
  bolt: `<path d="M52.5 49.5 L44.5 58.5 L49.5 58.5 L47 65 L55.5 55.5 L50.5 55.5 L53.5 49.5 Z" fill="#ffc83d" ${E}/>`,
  wave: `<path d="M43.5 54.5 q3.2 -3.4 6.5 0 t6.5 0 M43.5 60 q3.2 -3.4 6.5 0 t6.5 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
  flame: `<path d="M50 49.5 C55 53.5 57 57.5 56 60.5 C55.2 63.3 52.8 64.8 50 64.8 C46.8 64.8 44.2 62.7 44.2 59.6 C44.2 56.6 46.5 55.6 47.3 53.2 C48.4 54.6 49 55.6 49.6 56.4 C50.6 54.3 50.8 52 50 49.5 Z" fill="#e5383b" ${E}/><path d="M50 56.5 C52.6 58.6 53 60.6 52 62 C51 63.3 49 63.3 48 62 C47.2 60.6 48.4 59.2 50 56.5 Z" fill="#ffd23f"/>`,
  star: `<path d="${starD(50, 57.4, 6.6, 2.8)}" fill="#fff" ${E}/>`,
  shield: `<path d="M50 49.8 L56.4 52 Q56.4 60.4 50 64 Q43.6 60.4 43.6 52 Z" fill="#eef3f8" ${E}/><path d="M50 50.6 V63" stroke="#2e9a48" stroke-width="2.6"/>`,
  cloud: `<path d="M45.4 61.5 Q42 61.5 42.4 58.4 Q43 55.6 46 56.1 Q46.6 52.4 50.2 52.4 Q53.8 52.4 54.6 55.6 Q57.8 55.4 58 58.4 Q58 61.5 54.8 61.5 Z" fill="#fff" ${E}/>`,
  moon: `<path d="M52.6 50 A7.4 7.4 0 1 0 57.4 61.6 A5.8 5.8 0 1 1 52.6 50 Z" fill="#ffe9a0" ${E}/>`,
  sun: `<path d="M50 49.4 V51.4 M50 62.6 V64.6 M42.4 57 H44.4 M55.6 57 H57.6 M44.6 51.6 L46 53 M54 61 L55.4 62.4 M55.4 51.6 L54 53 M46 61 L44.6 62.4" stroke="#f77f00" stroke-width="1.8" stroke-linecap="round"/><circle cx="50" cy="57" r="3.8" fill="#ffc83d" ${E}/>`,
}

type Hero = {
  suit: string // main colour
  cape: string
  accent: string // boots + gloves + belt
  mask: string
  badge: string // emblem disc colour
  emblem: keyof typeof EMBLEM
  hair: string
  skin: string
  girl?: 'pony' | 'long'
}

const hero = (h: Hero) => {
  const back =
    h.girl === 'long'
      ? p('M32.5 27 C29 44 30 54 36 56 L64 56 C70 54 71 44 67.5 27 Z', h.hair)
      : h.girl === 'pony'
        ? p('M60 15 C76 9 86 22 80 40 C78 46 74 50 70 52 C72 42 70 32 63 25 Z', h.hair) +
          `<circle cx="64.5" cy="17.5" r="3.4" fill="${h.accent}" ${S}/>`
        : ''
  const hairTop = h.girl
    ? 'M32.5 29 C31 15 41 10.5 50 11 C59.5 10.5 69.5 15 67.5 29 C64 22 57 18.5 50.5 21 C44 18.5 37 22 32.5 29 Z'
    : 'M32.5 28.5 C31.5 15 41 10 50 10.5 C60 10 69.5 15 67.5 28.5 C65 23 61 21 57 21.5 L54.5 17 L51.5 21.5 L47 17.5 L45.5 21.5 C40 21.5 35 24 32.5 28.5 Z'
  const arm = (d: string) =>
    `<path d="${d}" fill="none" stroke="${O}" stroke-width="10.5" stroke-linecap="round" stroke-linejoin="round"/>`
  return `<g>
${p('M38.5 47 C31 60 23 75 17 90 Q33.5 86 50 90 Q66.5 86 83 90 C77 75 69 60 61.5 47 Z', h.cape)}
${back}
${p('M40 68 H48.5 V84 H40 Z M51.5 68 H60 V84 H51.5 Z', h.suit)}
${p('M38.5 79 H49.5 V88.5 Q49.5 91.5 46.5 91.5 H38.5 Q36 91.5 36.5 88.5 Z M61.5 79 H50.5 V88.5 Q50.5 91.5 53.5 91.5 H61.5 Q64 91.5 63.5 88.5 Z', h.accent)}
${arm('M39.5 50.5 L29 60 L37 67.5 M60.5 50.5 L71 60 L63 67.5')}
<path d="M39.5 50.5 L29 60 M60.5 50.5 L71 60" stroke="${h.suit}" stroke-width="5.6" stroke-linecap="round"/>
${p('M38 47 Q50 43 62 47 L63 72 Q50 75 37 72 Z', h.suit)}
${p('M37.3 65.5 Q50 68.5 62.7 65.5 L62.9 71.5 Q50 74.5 37.1 71.5 Z', h.accent)}
<rect x="47" y="66.6" width="6" height="5.8" rx="1.2" fill="${h.cape}" ${E}/>
<path d="M29 60 L37 67.5 M71 60 L63 67.5" stroke="${h.accent}" stroke-width="5.6" stroke-linecap="round"/>
${c(37, 67.5, 4.3, h.accent)}${c(63, 67.5, 4.3, h.accent)}
${c(50, 57, 8, h.badge, 'stroke-width="2"')}
${EMBLEM[h.emblem]}
${c(50, 29, 17.5, h.skin)}
${p(hairTop, h.hair)}
${p('M31.5 27.5 Q50 22.5 68.5 27.5 Q70 33.5 66 36.5 Q58 37.5 52.5 33.5 Q50 32 47.5 33.5 Q42 37.5 34 36.5 Q30 33.5 31.5 27.5 Z', h.mask)}
<ellipse cx="42.5" cy="30.6" rx="4.2" ry="3.4" fill="#fff"/><ellipse cx="57.5" cy="30.6" rx="4.2" ry="3.4" fill="#fff"/>
<circle cx="43" cy="31" r="2.2" fill="${O}"/><circle cx="57" cy="31" r="2.2" fill="${O}"/>
<circle cx="43.8" cy="30.2" r="0.8" fill="#fff"/><circle cx="57.8" cy="30.2" r="0.8" fill="#fff"/>
<circle cx="37" cy="39.5" r="2.6" fill="#ff6b8a" opacity=".35"/><circle cx="63" cy="39.5" r="2.6" fill="#ff6b8a" opacity=".35"/>
<path d="M45 39.5 Q50 44.5 55 39.5" fill="none" stroke="${O}" stroke-width="2.2" stroke-linecap="round"/>
</g>`
}

export const ART: Record<string, string> = {
  'hero-red': hero({ suit: '#e5383b', cape: '#9e1b22', accent: '#ffc83d', mask: '#9e1b22', badge: '#9e1b22', emblem: 'bolt', hair: '#5a3825', skin: '#f6d2b5' }),
  'hero-blue': hero({ suit: '#1d70d8', cape: '#0e3f85', accent: '#8fd8ff', mask: '#0e3f85', badge: '#0e3f85', emblem: 'wave', hair: '#2b2420', skin: '#e0ac80', girl: 'long' }),
  'hero-orange': hero({ suit: '#f77f00', cape: '#a84a00', accent: '#ffe08a', mask: '#a84a00', badge: '#fff', emblem: 'flame', hair: '#e2a93b', skin: '#f6d2b5' }),
  'hero-yellow': hero({ suit: '#ffc83d', cape: '#d97a00', accent: '#2f5fb0', mask: '#2f5fb0', badge: '#2f5fb0', emblem: 'star', hair: '#8a3b1e', skin: '#b97a56', girl: 'pony' }),
  'hero-green': hero({ suit: '#2e9a48', cape: '#185c2a', accent: '#b8ea6a', mask: '#185c2a', badge: '#185c2a', emblem: 'shield', hair: '#2b2420', skin: '#e0ac80' }),
  'hero-purple': hero({ suit: '#8b5cf6', cape: '#5126b0', accent: '#ffd36b', mask: '#5126b0', badge: '#5126b0', emblem: 'cloud', hair: '#6b4226', skin: '#f6d2b5', girl: 'pony' }),
  'hero-black': hero({ suit: '#2f2f3a', cape: '#4a4a5a', accent: '#6c6c82', mask: '#4a4a5a', badge: '#4a4a5a', emblem: 'moon', hair: '#1f1712', skin: '#7a4b2f' }),
  'hero-pink': hero({ suit: '#ff8fab', cape: '#d6336c', accent: '#fff', mask: '#d6336c', badge: '#fff', emblem: 'sun', hair: '#f0c35a', skin: '#e0ac80', girl: 'long' }),

  shield: `<g>
${c(50, 50, 42, '#ffc83d', 'stroke-width="3"')}
${c(50, 50, 33, '#1d70d8')}
<path d="M28 34 A27 27 0 0 1 46 23.5" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".45"/>
<path d="${starD(50, 52, 22, 9.5)}" fill="#fff" ${S}/>
<circle cx="50" cy="12.5" r="2" fill="#d99a10"/><circle cx="50" cy="87.5" r="2" fill="#d99a10"/><circle cx="12.5" cy="50" r="2" fill="#d99a10"/><circle cx="87.5" cy="50" r="2" fill="#d99a10"/>
</g>`,

  mask: `<g>
${p('M6 44 C10 28 32 26 50 37 C68 26 90 28 94 44 C96 60 86 70 72 68 C62 66.5 56 60 50 60 C44 60 38 66.5 28 68 C14 70 4 60 6 44 Z M20 49 C22.5 40 34 40 40 49.5 C34.5 56 25 57 20 49 Z M80 49 C77.5 40 66 40 60 49.5 C65.5 56 75 57 80 49 Z', '#1d70d8', 'fill-rule="evenodd" stroke-width="3"')}
<path d="M14 40 Q22 32 34 34" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"/>
</g>`,

  cape: `<g>
${p('M38 16 Q50 21 62 16 L67 22 C74 42 82 62 92 82 Q82 78 75 88 Q67 81 59 90 Q50 82 41 90 Q33 81 25 88 Q18 78 8 82 C18 62 26 42 33 22 Z', '#e5383b', 'stroke-width="3"')}
<path d="M42 30 C38 50 33 68 30 84 M58 30 C62 50 67 68 70 84 M50 32 V86" fill="none" stroke="#a4161a" stroke-width="2.5" stroke-linecap="round"/>
<path d="M30 40 C27 52 23 62 18 72" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"/>
${p('M33 15 Q50 25 67 15 Q65 8 50 10 Q35 8 33 15 Z', '#a4161a')}
${c(50, 17, 5, '#ffc83d')}
</g>`,

  boot: `<g>
${p('M27 20 H59 V56 C63 62 73 63 82 66 C90 69 93 76 92 82 H22 C21 66 24 42 27 20 Z', '#e5383b', 'stroke-width="3"')}
${p('M21 84 Q21 80 25 80 H90 Q94 80 94 84 V88 Q94 91 90 91 H25 Q21 91 21 88 Z', '#5a3a2e')}
${p('M22 8 H64 Q66 17 62 26 H24 Q20 17 22 8 Z', '#ffc83d', 'stroke-width="3"')}
<path d="M32 32 V70" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".4"/>
<path d="${starD(43, 17, 5.5, 2.4)}" fill="#e5383b" ${E}/>
</g>`,

  bolt: `<g>
${p('M62 6 L20 56 H46 L34 94 L82 38 H56 L70 6 Z', '#ffc83d', 'stroke-width="3"')}
<path d="M60 14 L33 47" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".6"/>
<path d="M55 44 L70 40" stroke="#e0a000" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>
</g>`,

  helmet: `<g>
${p('M27 54 C17 52 8 45 5 32 C10 35 14 34 13 27 C18 31 22 29 22 22 C26 29 30 33 33 38 Z', '#ffc83d')}
${p('M73 54 C83 52 92 45 95 32 C90 35 86 34 87 27 C82 31 78 29 78 22 C74 29 70 33 67 38 Z', '#ffc83d')}
${p('M18 56 C16 32 32 18 50 18 C68 18 84 32 82 56 C82 72 76 82 66 86 L61 72 Q50 69 39 72 L34 86 C24 82 18 72 18 56 Z', '#1d70d8', 'stroke-width="3"')}
${p('M44 21 Q50 4 56 21 Z', '#e5383b')}
${p('M23 46 Q50 36 77 46 L76 60 Q63 55 54 60 L50 64 L46 60 Q37 55 24 60 Z', '#2f3550')}
<path d="M30 48 Q40 44 47 44" stroke="#9fd0ff" stroke-width="2.5" stroke-linecap="round"/>
<path d="M39 72 Q50 69 61 72 L64 80 Q50 76 36 80 Z" fill="#2f3550"/>
<path d="M30 36 Q35 27 43 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"/>
</g>`,

  belt: `<g>
${p('M7 38 Q50 50 93 38 L93 56 Q50 68 7 56 Z', '#8d5524', 'stroke-width="3"')}
${p('M12 50 H27 V67 Q27 71 23 71 H16 Q12 71 12 67 Z', '#c58a4a')}
${p('M73 50 H88 V67 Q88 71 84 71 H77 Q73 71 73 67 Z', '#c58a4a')}
<path d="M12 56 H27 M73 56 H88" stroke="${O}" stroke-width="2"/>
${c(50, 53, 15, '#ffc83d', 'stroke-width="3"')}
<path d="${starD(50, 53.5, 9, 4)}" fill="#e5383b" ${E}/>
<circle cx="35" cy="51" r="1.8" fill="${O}"/><circle cx="65" cy="51" r="1.8" fill="${O}"/>
</g>`,

  tower: `<g>
${p('M14 58 H30 V94 H14 Z', '#a7b8cc')}
${p('M70 46 H86 V94 H70 Z', '#8ea4bf')}
${p('M30 30 H70 V94 H30 Z', '#5f8ac4', 'stroke-width="3"')}
${p('M36 18 H64 V30 H36 Z', '#5f8ac4')}
${p('M44 10 H56 V18 H44 Z', '#4a74ad')}
<path d="M50 10 V4" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/><circle cx="50" cy="4" r="2.2" fill="#e5383b"/>
<path d="M36 38h6v6h-6zM47 38h6v6h-6zM58 38h6v6h-6zM36 52h6v6h-6zM58 52h6v6h-6zM47 66h6v6h-6zM36 66h6v6h-6zM58 80h6v6h-6zM18 64h8v5h-8zM18 76h8v5h-8zM74 54h8v5h-8zM74 68h8v5h-8z" fill="#ffd966"/>
<path d="M47 52h6v6h-6zM58 66h6v6h-6zM36 80h6v6h-6zM74 82h8v5h-8z" fill="#3e5f8f"/>
<path d="M8 94 H92" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
</g>`,

  robot: `<g>
<path d="M33 52 L21 66 M67 52 L79 36" stroke="${O}" stroke-width="9" stroke-linecap="round"/>
<path d="M33 52 L21 66 M67 52 L79 36" stroke="#b8c8d8" stroke-width="4" stroke-linecap="round"/>
${c(20, 68, 5, '#ffc83d')}${c(80, 33, 5, '#ffc83d')}
${p('M38 76 H46 V86 H38 Z M54 76 H62 V86 H54 Z', '#8a9bb0')}
${p('M33 84 H48 Q50 84 50 87 V92 H31 V87 Q31 84 33 84 Z M52 84 H67 Q69 84 69 87 V92 H50 V87 Q50 84 52 84 Z', '#1d70d8')}
<rect x="31" y="44" width="38" height="33" rx="7" fill="#d5e0ea" ${st('stroke-width')} stroke-width="3"/>
<rect x="39" y="51" width="22" height="16" rx="4" fill="#9fd0ff" ${S}/>
<path d="M50 63 C44 58 44 54 47 54 C48.5 54 49.5 55 50 56 C50.5 55 51.5 54 53 54 C56 54 56 58 50 63 Z" fill="#e5383b"/>
<path d="M50 14 V6" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/>${c(50, 6, 3, '#e5383b')}
<rect x="24" y="22" width="6" height="12" rx="2" fill="#1d70d8" ${S}/><rect x="70" y="22" width="6" height="12" rx="2" fill="#1d70d8" ${S}/>
<rect x="29" y="13" width="42" height="30" rx="9" fill="#d5e0ea" ${st('stroke-width')} stroke-width="3"/>
${c(41, 27, 5.5, '#fff', 'stroke-width="2"')}${c(59, 27, 5.5, '#fff', 'stroke-width="2"')}
<circle cx="41.5" cy="27.5" r="3" fill="${O}"/><circle cx="59.5" cy="27.5" r="3" fill="${O}"/>
<circle cx="42.5" cy="26.3" r="1" fill="#fff"/><circle cx="60.5" cy="26.3" r="1" fill="#fff"/>
<path d="M44 35 Q50 39.5 56 35" fill="none" stroke="${O}" stroke-width="2.2" stroke-linecap="round"/>
</g>`,

  glove: `<g>
${p('M32 68 H72 L78 93 H26 Z', '#185c2a', 'stroke-width="3"')}
<path d="M29 81 H75" stroke="#b8ea6a" stroke-width="4"/>
${p('M26 38 H82 V58 Q82 73 67 73 H39 Q26 73 26 60 Z', '#2e9a48', 'stroke-width="3"')}
${p('M28 40 V24 Q28 17 34.5 17 Q41 17 41 24 V40 Z M41 40 V20 Q41 13 47.5 13 Q54 13 54 20 V40 Z M54 40 V21 Q54 14 60.5 14 Q67 14 67 21 V40 Z M67 40 V26 Q67 19 73.5 19 Q80 19 80 26 V40 Z', '#2e9a48')}
${p('M14 47 Q12 38 21 38 H52 Q59 39 58 46 Q57 53 50 53 H24 Q15 54 14 47 Z', '#3cb35a', 'stroke-width="3"')}
<path d="M31 25 Q32 21 35 20 M44 21 Q45 17 48 16" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>
</g>`,

  badge: `<g>
${c(50, 50, 42, '#e5383b', 'stroke-width="3"')}
<circle cx="50" cy="50" r="34" fill="none" stroke="#ffc83d" stroke-width="4"/>
${p('M57 16 L32 53 H48 L41 84 L69 45 H53 L62 16 Z', '#ffc83d', 'stroke-width="3"')}
<path d="${starD(24, 36, 5, 2.2)}" fill="#fff"/><path d="${starD(76, 64, 5, 2.2)}" fill="#fff"/>
</g>`,

  pattern: `<g fill="none" stroke="#000" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
<path d="${starD(18, 18, 6, 2.6)}"/>
<path d="M74 8 L65 21 H71 L68 30 L78 16 H72 L76 8 Z" fill="#000"/>
<path d="M10 70 C12 64 20 63 25 67 C30 63 38 64 40 70 C41 76 36 78 32 77 C29 76 27 74 25 74 C23 74 21 76 18 77 C14 78 9 76 10 70 Z M16 70 a2.5 2 0 1 0 0.1 0 M34 70 a2.5 2 0 1 0 0.1 0"/>
<circle cx="76" cy="72" r="9"/><path d="${starD(76, 72.5, 4.5, 2)}" fill="#000"/>
<path d="M46 38 H54 L60 56 Q50 52 40 56 Z"/>
</g>`,
}
