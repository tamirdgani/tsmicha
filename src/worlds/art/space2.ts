/* Space world, set 2: original illustrations of space things (viewBox 0 0 100 100). */

const K = '#2b2b3a'
const O = `stroke="${K}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"`
const T = `stroke="${K}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`

/** thick outlined line: dark outline under a coloured core */
function bar(d: string, col: string, w1: number, w2: number): string {
  return (
    `<path d="${d}" fill="none" stroke="${K}" stroke-width="${w1}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w2}" stroke-linecap="round" stroke-linejoin="round"/>`
  )
}
function eyes(x: number, y: number, dx: number, r = 2.8): string {
  return (
    `<circle cx="${x - dx}" cy="${y}" r="${r}" fill="${K}"/><circle cx="${x + dx}" cy="${y}" r="${r}" fill="${K}"/>` +
    `<circle cx="${x - dx + r * 0.35}" cy="${y - r * 0.4}" r="${r * 0.36}" fill="#fff"/><circle cx="${x + dx + r * 0.35}" cy="${y - r * 0.4}" r="${r * 0.36}" fill="#fff"/>`
  )
}
function star5(cx: number, cy: number, R: number, r: number): string {
  let d = ''
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rr = i % 2 ? r : R
    d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1)
  }
  return d + 'Z'
}
/** n triangular rays between radius r1 and r2 around (cx, cy). */
function rays(cx: number, cy: number, n: number, r1: number, r2: number, half: number): string {
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2
    const pt = (ang: number, r: number) => `${(cx + r * Math.cos(ang)).toFixed(1)} ${(cy + r * Math.sin(ang)).toFixed(1)}`
    d += `M${pt(a - half, r1)}L${pt(a, r2)}L${pt(a + half, r1)}Z`
  }
  return d
}
/** wheel with hub */
function wheel(x: number, y: number, r: number, tyre = '#4a4a5a', hub = '#c9ced6'): string {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${tyre}" ${O}/><circle cx="${x}" cy="${y}" r="${r * 0.45}" fill="${hub}" ${T}/>`
}

export const ART: Record<string, string> = {
  sun:
    `<path d="${rays(50, 50, 12, 30, 45, 0.2)}" fill="#f77f00" ${O}/>` +
    `<circle cx="50" cy="50" r="31" fill="#ffc83d" ${O}/>` +
    `<path d="M30 38A24 24 0 0 1 42 25" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".6"/>` +
    eyes(50, 47, 9, 3.4) +
    `<path d="M40 58Q50 68 60 58" fill="none" ${O}/>` +
    `<circle cx="33" cy="57" r="4" fill="#ff5d7a" opacity=".4"/><circle cx="67" cy="57" r="4" fill="#ff5d7a" opacity=".4"/>`,

  robot:
    `<ellipse cx="50" cy="93" rx="30" ry="3" fill="${K}" opacity=".15"/>` +
    bar('M30 56L16 48M70 56L84 64', '#9aa0a6', 9, 4) +
    `<path d="M12 42L16 48L10 50M88 70L84 64L90 62" fill="none" ${O}/>` +
    `<rect x="24" y="76" width="52" height="8" rx="3" fill="#9aa0a6" ${O}/>` +
    wheel(28, 84, 9) + wheel(72, 84, 9) +
    `<rect x="28" y="44" width="44" height="34" rx="8" fill="#1d70d8" ${O}/>` +
    `<rect x="38" y="52" width="24" height="12" rx="3" fill="#0e3f85" ${T}/>` +
    `<circle cx="44" cy="58" r="2.4" fill="#2e9a48"/><circle cx="50" cy="58" r="2.4" fill="#ffc83d"/><circle cx="56" cy="58" r="2.4" fill="#e5383b"/>` +
    `<path d="M34 50V70" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"/>` +
    `<path d="M50 18V8" fill="none" ${O}/><circle cx="50" cy="7" r="4" fill="#e5383b" ${T}/>` +
    `<path d="M26 46C26 26 36 18 50 18C64 18 74 26 74 46Z" fill="#a8e6ff" ${O}/>` +
    `<rect x="34" y="27" width="32" height="15" rx="7" fill="#2b3a67" ${T}/>` +
    `<circle cx="43" cy="34.5" r="3.6" fill="#7fe6ff"/><circle cx="57" cy="34.5" r="3.6" fill="#7fe6ff"/>` +
    `<path d="M31 34Q33 24 42 22" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`,

  flag:
    `<path d="M8 92C14 76 30 70 50 70C70 70 86 76 92 92Z" fill="#c9ced6" ${O}/>` +
    `<ellipse cx="30" cy="84" rx="6" ry="2.5" fill="#9aa0a6"/><ellipse cx="70" cy="82" rx="5" ry="2" fill="#9aa0a6"/>` +
    `<path d="M32 16H86V54H32Z" fill="#e5383b" ${O}/>` +
    `<path d="M32 24H86M32 46H86" stroke="#fff" stroke-width="3" opacity=".9"/>` +
    `<path d="${star5(59, 35, 9, 4)}" fill="#fff" ${T}/>` +
    bar('M30 12V76', '#dfe4ec', 7, 3.2) +
    `<path d="M24 12H40" fill="none" ${O}/><circle cx="30" cy="9" r="4" fill="#ffc83d" ${T}/>`,

  boot:
    `<path d="M24 10H62V58C70 60 84 62 88 72V80H18V58C18 40 22 22 24 10Z" fill="#8b5cf6" ${O}/>` +
    `<path d="M21 26H63M20 42H63M19 58H64" fill="none" stroke="#5126b0" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M20 6Q42 2 66 6Q68 12 64 16Q42 12 22 16Q18 12 20 6Z" fill="#dfe4ec" ${O}/>` +
    `<path d="M14 78H92V86Q92 92 86 92H18Q14 92 14 86Z" fill="#9aa0a6" ${O}/>` +
    `<path d="M24 92V87M36 92V87M48 92V87M60 92V87M72 92V87M84 92V87" stroke="${K}" stroke-width="2.2" stroke-linecap="round"/>` +
    `<path d="M30 22V60" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".4"/>` +
    `<rect x="64" y="64" width="14" height="8" rx="3" fill="#ffc83d" ${T}/>`,

  antenna:
    `<path d="M24 92L40 60L56 92" fill="none" stroke="${K}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M24 92L40 60L56 92" fill="none" stroke="#9aa0a6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<rect x="16" y="86" width="48" height="7" rx="3" fill="#f77f00" ${O}/>` +
    `<g transform="rotate(-35 46 46)">` +
    `<path d="M10 40Q46 74 82 40Z" fill="#f4f5fb" ${O}/>` +
    `<path d="M20 46Q46 64 72 46" fill="none" stroke="#c9ced6" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M46 56V58" fill="none" ${O}/>` +
    `<path d="M46 52V20M28 44L46 20M64 44L46 20" fill="none" ${T}/>` +
    `<circle cx="46" cy="18" r="4.5" fill="#e5383b" ${T}/></g>` +
    `<path d="M74 22Q80 26 80 32M80 14Q90 20 90 32" fill="none" stroke="#1d70d8" stroke-width="3" stroke-linecap="round"/>`,

  asteroid:
    `<path d="M4 66L18 60M8 80L22 72M14 50L24 50" fill="none" stroke="#c9ced6" stroke-width="3.5" stroke-linecap="round"/>` +
    `<path d="M34 16C44 8 58 14 64 12C76 10 90 22 88 36C94 46 92 62 84 70C80 82 66 92 52 88C40 92 26 86 24 74C16 66 16 52 22 44C20 32 24 20 34 16Z" fill="#8d5524" ${O}/>` +
    `<path d="M30 26C36 20 44 18 50 20" fill="none" stroke="#c08552" stroke-width="3.5" stroke-linecap="round"/>` +
    `<ellipse cx="44" cy="42" rx="9" ry="7" fill="#6b3d17" ${T}/><ellipse cx="68" cy="34" rx="6" ry="5" fill="#6b3d17" ${T}/>` +
    `<ellipse cx="66" cy="64" rx="11" ry="8" fill="#6b3d17" ${T}/><ellipse cx="38" cy="70" rx="5" ry="4" fill="#6b3d17" ${T}/>` +
    `<path d="M38 40A6 5 0 0 1 48 38M60 62A8 6 0 0 1 72 60" fill="none" stroke="#4d2a0e" stroke-width="2" stroke-linecap="round"/>`,

  glove:
    `<path d="M30 70H70L74 92H26Z" fill="#f77f00" ${O}/>` +
    `<path d="M28 80H72" stroke="#ffc83d" stroke-width="4"/>` +
    `<path d="M26 44Q24 26 30 24Q36 22 37 34V30Q36 14 43 13Q50 12 50 28Q50 12 57 12Q64 12 63 28V32Q64 20 70 20Q77 21 75 38V58Q74 74 58 74H40Q28 74 26 60Z" fill="#f4f5fb" ${O}/>` +
    `<path d="M37 34V46M50 28V46M63 32V46" fill="none" stroke="#c9ced6" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M26 52Q14 46 12 36Q12 30 18 31Q24 34 30 44Z" fill="#f4f5fb" ${O}/>` +
    `<rect x="44" y="54" width="16" height="10" rx="3" fill="#1d70d8" ${T}/>` +
    `<path d="M42 20Q43 16 46 16M56 19Q57 15 60 15" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M29 32V56" stroke="#c9ced6" stroke-width="2.5" stroke-linecap="round"/>`,

  ladder:
    bar('M30 6L24 94M70 6L76 94', '#2e9a48', 10, 5.5) +
    bar('M29 18H71M28 34H72M26 50H74M25 66H75M24 82H76', '#2e9a48', 8, 3.6) +
    `<path d="M31 12L27 50" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/>` +
    `<circle cx="30" cy="6" r="3.5" fill="#ffc83d" ${T}/><circle cx="70" cy="6" r="3.5" fill="#ffc83d" ${T}/>`,

  crater:
    `<path d="M4 58Q12 50 22 54Q30 46 40 52Q50 48 60 52Q70 46 78 52Q88 48 96 56V88Q96 92 92 92H8Q4 92 4 88Z" fill="#c9ced6" ${O}/>` +
    `<path d="M14 72C14 62 30 58 50 58C70 58 86 62 86 72C86 80 70 84 50 84C30 84 14 80 14 72Z" fill="#e9ecf1" ${O}/>` +
    `<path d="M22 72C22 66 34 63 50 63C66 63 78 66 78 72C78 77 66 80 50 80C34 80 22 77 22 72Z" fill="#7d838b" ${T}/>` +
    `<path d="M24 74C30 70 40 69 50 69C60 69 70 70 76 74C70 78 60 79 50 79C40 79 30 78 24 74Z" fill="#9aa0a6"/>` +
    `<ellipse cx="16" cy="60" rx="4" ry="2" fill="#9aa0a6"/><ellipse cx="88" cy="86" rx="4" ry="2" fill="#9aa0a6"/><ellipse cx="70" cy="56" rx="3" ry="1.5" fill="#9aa0a6"/>` +
    `<path d="M10 62Q18 56 26 58" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>` +
    `<path d="${star5(22, 22, 8, 3.4)}" fill="#ffc83d" ${T}/><path d="${star5(76, 18, 5.5, 2.4)}" fill="#fff" ${T}/>` +
    `<circle cx="50" cy="30" r="2" fill="${K}"/><circle cx="90" cy="36" r="1.6" fill="${K}"/>`,

  capsule:
    `<path d="M10 40L36 70M90 40L64 70M30 40L42 70M70 40L58 70M50 40V68" fill="none" stroke="${K}" stroke-width="1.8"/>` +
    `<path d="M8 42C8 20 28 6 50 6C72 6 92 20 92 42Q50 34 8 42Z" fill="#fff" ${O}/>` +
    `<path d="M8 42C8 20 28 6 50 6C38 10 30 24 30 38Q18 39 8 42ZM50 6C62 10 70 24 70 38Q82 39 92 42C92 20 72 6 50 6Z" fill="#f77f00" ${T}/>` +
    `<path d="M50 6C46 16 44 26 44 36" fill="none" stroke="${K}" stroke-width="1.6" opacity=".4"/>` +
    `<path d="M40 70H60L70 90H30Z" fill="#9aa0a6" ${O}/>` +
    `<path d="M28 88H72Q74 94 70 95H30Q26 94 28 88Z" fill="#4a4a5a" ${O}/>` +
    `<circle cx="50" cy="80" r="4.5" fill="#7fd1ff" ${T}/>` +
    `<path d="M42 74L36 86" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>`,

  galaxy:
    `<circle cx="50" cy="50" r="40" fill="#8b5cf6" opacity=".18"/>` +
    bar('M50 50C50 34 68 30 78 42C88 56 78 78 58 82', '#8b5cf6', 12, 7) +
    bar('M50 50C50 66 32 70 22 58C12 44 22 22 42 18', '#ff8fab', 12, 7) +
    `<circle cx="50" cy="50" r="12" fill="#ffe27a" ${O}/>` +
    `<circle cx="46.5" cy="46.5" r="3.5" fill="#fff" opacity=".8"/>` +
    `<path d="${star5(78, 18, 6, 2.6)}" fill="#ffc83d" ${T}/><path d="${star5(20, 82, 5, 2.2)}" fill="#fff" ${T}/>` +
    `<circle cx="88" cy="70" r="1.8" fill="${K}"/><circle cx="12" cy="30" r="1.8" fill="${K}"/>`,

  rover:
    wheel(24, 74, 8, '#2f2f3a') + wheel(50, 74, 8, '#2f2f3a') + wheel(76, 74, 8, '#2f2f3a') +
    `<path d="M14 64L20 50H82L88 64Z" fill="#9aa0a6" ${O}/>` +
    `<path d="M10 54H90Q94 54 94 58V66Q94 70 90 70H10Q6 70 6 66V58Q6 54 10 54Z" fill="#ffc83d" ${O}/>` +
    `<path d="M12 60H88" stroke="#e0a520" stroke-width="2.5" stroke-linecap="round"/>` +
    `<rect x="26" y="32" width="38" height="18" rx="3" fill="#1d70d8" ${O}/>` +
    `<path d="M33 32V50M41 32V50M49 32V50M57 32V50" stroke="#7fd1ff" stroke-width="1.6"/>` +
    `<path d="M74 50V28" fill="none" ${O}/>` +
    `<rect x="66" y="18" width="18" height="12" rx="3" fill="#f4f5fb" ${O}/><circle cx="79" cy="24" r="3" fill="#2b3a67"/>` +
    `<path d="M18 50V34" fill="none" ${O}/><path d="M8 30Q18 42 28 30Z" fill="#f4f5fb" ${T}/><circle cx="18" cy="26" r="2.6" fill="#e5383b" ${T}/>` +
    wheel(18, 80, 10) + wheel(50, 80, 10) + wheel(82, 80, 10) +
    `<path d="M14 92H86" stroke="${K}" stroke-width="2.4" stroke-linecap="round" opacity=".25"/>`,

  clock:
    `<path d="M30 80L22 92M70 80L78 92" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/>` +
    `<path d="M14 30A14 14 0 0 1 36 14Z" fill="#ffc83d" ${O}/><path d="M86 30A14 14 0 0 0 64 14Z" fill="#ffc83d" ${O}/>` +
    `<path d="M24 22L30 28M76 22L70 28" fill="none" ${O}/>` +
    `<path d="M44 14H56M50 14V20" fill="none" ${O}/>` +
    `<circle cx="50" cy="54" r="34" fill="#ff8fab" ${O}/>` +
    `<circle cx="50" cy="54" r="26" fill="#fff" ${O}/>` +
    `<path d="M50 32V36M50 72V76M28 54H32M68 54H72" stroke="${K}" stroke-width="2.6" stroke-linecap="round"/>` +
    `<path d="M50 54V40M50 54L61 60" fill="none" stroke="${K}" stroke-width="3.2" stroke-linecap="round"/>` +
    `<circle cx="50" cy="54" r="2.6" fill="#e5383b"/>` +
    `<path d="M24 40A28 28 0 0 1 36 26" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".7"/>`,

  camera:
    `<rect x="20" y="20" width="18" height="10" rx="2" fill="#4a4a5a" ${O}/>` +
    `<rect x="66" y="18" width="16" height="12" rx="3" fill="#e5383b" ${O}/>` +
    `<path d="M8 36Q8 28 16 28H84Q92 28 92 36V78Q92 86 84 86H16Q8 86 8 78Z" fill="#2f2f3a" ${O}/>` +
    `<path d="M8 40H92" stroke="#4a4a5a" stroke-width="3"/>` +
    `<rect x="70" y="44" width="14" height="8" rx="2" fill="#fff6c2" ${T}/>` +
    `<circle cx="48" cy="58" r="22" fill="#9aa0a6" ${O}/>` +
    `<circle cx="48" cy="58" r="14" fill="#2b3a67" ${O}/>` +
    `<circle cx="48" cy="58" r="7" fill="#7fd1ff"/>` +
    `<path d="M40 52A10 10 0 0 1 47 47" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` +
    `<circle cx="18" cy="48" r="3" fill="#4a4a5a"/>`,
}
