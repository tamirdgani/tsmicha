/* Space world: original illustrations (viewBox 0 0 100 100). */

const K = '#2b2b3a'
const O = `stroke="${K}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"`
const T = `stroke="${K}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`

/** Mix a hex color toward black (f<0) or white (f>0). */
function mix(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16)
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f),
  )
  return '#' + ch.map((v) => v.toString(16).padStart(2, '0')).join('')
}

function eye(cx: number, cy: number, r: number): string {
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" ${O}/>` +
    `<circle cx="${cx}" cy="${cy + r * 0.12}" r="${r * 0.56}" fill="${K}"/>` +
    `<circle cx="${cx + r * 0.22}" cy="${cy - r * 0.16}" r="${r * 0.22}" fill="#fff"/>`
  )
}

type Body = 'round' | 'bean' | 'wide' | 'drop'
type Ant = 'two' | 'one' | 'three' | 'bent' | 'nubs'

const BODY: Record<Body, { d: string; top: number }> = {
  round: { d: 'M50 26C68 26 80 40 80 58C80 76 67 87 50 87C33 87 20 76 20 58C20 40 32 26 50 26Z', top: 26 },
  bean: { d: 'M50 25C67 25 75 39 76 54C78 74 69 87 50 87C31 87 22 74 24 54C25 39 33 25 50 25Z', top: 25 },
  wide: { d: 'M50 33C72 33 84 45 84 61C84 78 69 87 50 87C31 87 16 78 16 61C16 45 28 33 50 33Z', top: 33 },
  drop: { d: 'M50 24C56 30 79 40 79 61C79 78 66 87 50 87C34 87 21 78 21 61C21 40 44 30 50 24Z', top: 24 },
}

function antennae(kind: Ant, top: number, tip: string): string {
  const stalk = (d: string) => `<path d="${d}" fill="none" ${O}/>`
  const ball = (x: number, y: number, r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${tip}" ${O}/>`
  const b = top + 6
  switch (kind) {
    case 'one':
      return stalk(`M50 ${b}V12`) + ball(50, 10, 6)
    case 'two':
      return stalk(`M41 ${b}L33 13M59 ${b}L67 13`) + ball(32, 11) + ball(68, 11)
    case 'three':
      return stalk(`M38 ${b}L28 16M50 ${b - 2}V12M62 ${b}L72 16`) + ball(27, 15, 4.5) + ball(50, 10, 4.5) + ball(73, 15, 4.5)
    case 'bent':
      return stalk(`M43 ${b}Q41 12 28 12M57 ${b}Q59 12 72 12`) + ball(27, 12, 4.5) + ball(73, 12, 4.5)
    case 'nubs':
      return (
        `<path d="M30 ${top + 9}L24 ${top - 8}L42 ${top + 2}Z" fill="${tip}" ${O}/>` +
        `<path d="M70 ${top + 9}L76 ${top - 8}L58 ${top + 2}Z" fill="${tip}" ${O}/>` +
        stalk(`M50 ${top + 2}V${top - 12}`) + ball(50, top - 15, 4.5)
      )
  }
}

function alien(c: string, eyes: 1 | 2 | 3, body: Body, ant: Ant, tip: string, mouth: 'open' | 'grin' | 'tooth' = 'open', limb?: string): string {
  const B = BODY[body]
  const dk = limb ?? mix(c, -0.25)
  const eY = body === 'wide' ? 55 : 51
  let e = ''
  if (eyes === 1) e = eye(50, eY, 13)
  if (eyes === 2) e = eye(39, eY, 9.5) + eye(61, eY, 9.5)
  if (eyes === 3) e = eye(34, eY + 3, 8) + eye(50, eY - 4, 8) + eye(66, eY + 3, 8)
  const mY = eY + 18
  const m =
    mouth === 'open'
      ? `<path d="M41 ${mY}Q50 ${mY + 1} 59 ${mY}Q57 ${mY + 9} 50 ${mY + 9}Q43 ${mY + 9} 41 ${mY}Z" fill="#7a2638" ${T}/><path d="M45 ${mY + 6}Q50 ${mY + 3} 55 ${mY + 6}Q53 ${mY + 8.5} 50 ${mY + 8.5}Q47 ${mY + 8.5} 45 ${mY + 6}Z" fill="#ff7a8a"/>`
      : mouth === 'tooth'
        ? `<path d="M41 ${mY}Q50 ${mY + 8} 59 ${mY}" fill="none" ${O}/><path d="M47 ${mY + 3.3}L48 ${mY + 7}L52 ${mY + 7}L53 ${mY + 3.3}" fill="#fff" ${T}/>`
        : `<path d="M40 ${mY}Q50 ${mY + 9} 60 ${mY}" fill="none" ${O}/>`
  return (
    `<ellipse cx="50" cy="93" rx="26" ry="3" fill="${K}" opacity=".15"/>` +
    antennae(ant, B.top, tip) +
    `<ellipse cx="18" cy="67" rx="6" ry="10" transform="rotate(35 18 67)" fill="${dk}" ${O}/>` +
    `<ellipse cx="82" cy="67" rx="6" ry="10" transform="rotate(-35 82 67)" fill="${dk}" ${O}/>` +
    `<ellipse cx="38" cy="88" rx="9" ry="5.5" fill="${dk}" ${O}/>` +
    `<ellipse cx="62" cy="88" rx="9" ry="5.5" fill="${dk}" ${O}/>` +
    `<path d="${B.d}" fill="${c}" ${O}/>` +
    `<ellipse cx="50" cy="80" rx="15" ry="5" fill="#fff" opacity=".22"/>` +
    `<circle cx="${eyes === 1 ? 31 : 27}" cy="${mY - 2}" r="4" fill="#ff5d7a" opacity=".35"/>` +
    `<circle cx="${eyes === 1 ? 69 : 73}" cy="${mY - 2}" r="4" fill="#ff5d7a" opacity=".35"/>` +
    e +
    m
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

export const ART: Record<string, string> = {
  'alien-green': alien('#2e9a48', 1, 'round', 'two', '#ffc83d'),
  'alien-blue': alien('#1d70d8', 2, 'bean', 'one', '#ffc83d', 'grin'),
  'alien-purple': alien('#8b5cf6', 3, 'wide', 'bent', '#ff8fab'),
  'alien-orange': alien('#f77f00', 2, 'drop', 'two', '#1d70d8', 'tooth'),
  'alien-pink': alien('#ff8fab', 1, 'bean', 'bent', '#8b5cf6', 'grin', '#e8678b'),
  'alien-yellow': alien('#ffc83d', 3, 'round', 'one', '#2e9a48', 'tooth', '#e9a21f'),
  'alien-red': alien('#e5383b', 2, 'wide', 'nubs', '#ffc83d'),
  'alien-brown': alien('#8d5524', 1, 'drop', 'three', '#7fd1ff', 'tooth'),

  rocket:
    `<path d="M40 76Q50 100 60 76Z" fill="#ffc83d" ${O}/><path d="M45 77Q50 90 55 77Z" fill="#f77f00"/>` +
    `<path d="M35 52L18 70L19 82L36 74Z" fill="#e5383b" ${O}/><path d="M65 52L82 70L81 82L64 74Z" fill="#e5383b" ${O}/>` +
    `<path d="M50 7C66 20 70 44 66 77L34 77C30 44 34 20 50 7Z" fill="#f4f5fb" ${O}/>` +
    `<path d="M50 7C58 14 62 20 64 27L36 27C38 20 42 14 50 7Z" fill="#e5383b" ${O}/>` +
    `<path d="M50 60V80" ${O}/><rect x="38" y="76" width="24" height="6" rx="2" fill="#9aa0a6" ${O}/>` +
    `<circle cx="50" cy="44" r="9.5" fill="#7fd1ff" ${O}/><path d="M45 42A6 6 0 0 1 50 38" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>` +
    `<path d="M40 30Q38 50 41 70" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`,

  planet:
    `<g transform="rotate(-18 50 52)">` +
    `<path d="M7 52A43 13 0 0 1 93 52" fill="none" stroke="${K}" stroke-width="10" stroke-linecap="round"/>` +
    `<path d="M7 52A43 13 0 0 1 93 52" fill="none" stroke="#ffc83d" stroke-width="4.6" stroke-linecap="round"/></g>` +
    `<circle cx="50" cy="52" r="27" fill="#8b5cf6" ${O}/>` +
    `<path d="M26 42Q50 50 74 42M24 58Q50 66 76 58" fill="none" stroke="#b49cff" stroke-width="4" stroke-linecap="round"/>` +
    `<circle cx="40" cy="38" r="5" fill="#fff" opacity=".35"/>` +
    `<g transform="rotate(-18 50 52)">` +
    `<path d="M7 52A43 13 0 0 0 93 52" fill="none" stroke="${K}" stroke-width="10" stroke-linecap="round"/>` +
    `<path d="M7 52A43 13 0 0 0 93 52" fill="none" stroke="#ffc83d" stroke-width="4.6" stroke-linecap="round"/></g>`,

  moon:
    `<g transform="translate(5 0)">` +
    `<path d="M60 9A41 41 0 1 0 60 91A60 60 0 0 1 60 9Z" fill="#ffe27a" ${O}/>` +
    `<circle cx="30" cy="70" r="4" fill="#e9c24a"/><circle cx="40" cy="22" r="3" fill="#e9c24a"/>` +
    `<path d="M27 43Q32 47 37 43" fill="none" ${O}/>` +
    `<path d="M28 56Q34 61 40 55" fill="none" ${O}/>` +
    `<circle cx="22" cy="50" r="3.5" fill="#ff5d7a" opacity=".35"/>` +
    `<path d="M80 18v10M75 23h10" fill="none" ${T}/>` +
    `<path d="${star5(80, 66, 9, 4)}" fill="#ffc83d" ${T}/></g>`,

  star:
    `<path d="${star5(50, 54, 44, 20)}" fill="#ffc83d" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>` +
    `<path d="M50 20L56 38" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>` +
    `<circle cx="43" cy="54" r="3.2" fill="${K}"/><circle cx="57" cy="54" r="3.2" fill="${K}"/>` +
    `<path d="M44 62Q50 67 56 62" fill="none" ${O}/>` +
    `<circle cx="37" cy="61" r="3" fill="#ff5d7a" opacity=".4"/><circle cx="63" cy="61" r="3" fill="#ff5d7a" opacity=".4"/>`,

  astronaut:
    `<rect x="24" y="52" width="52" height="30" rx="10" fill="#c9ced6" ${O}/>` +
    `<path d="M30 60Q16 62 16 74" fill="none" stroke="${K}" stroke-width="11" stroke-linecap="round"/><path d="M30 60Q16 62 16 74" fill="none" stroke="#f4f5fb" stroke-width="5.5" stroke-linecap="round"/>` +
    `<path d="M70 60Q84 58 86 48" fill="none" stroke="${K}" stroke-width="11" stroke-linecap="round"/><path d="M70 60Q84 58 86 48" fill="none" stroke="#f4f5fb" stroke-width="5.5" stroke-linecap="round"/>` +
    `<circle cx="16" cy="76" r="5" fill="#f77f00" ${O}/><circle cx="86" cy="46" r="5" fill="#f77f00" ${O}/>` +
    `<rect x="34" y="78" width="13" height="14" rx="4" fill="#f4f5fb" ${O}/><rect x="53" y="78" width="13" height="14" rx="4" fill="#f4f5fb" ${O}/>` +
    `<path d="M32 92V88Q32 85 36 85H46V92ZM54 92V85H64Q68 85 68 88V92Z" fill="#9aa0a6" ${O}/>` +
    `<rect x="30" y="54" width="40" height="28" rx="11" fill="#f4f5fb" ${O}/>` +
    `<rect x="42" y="62" width="16" height="11" rx="3" fill="#dfe4ec" ${T}/>` +
    `<circle cx="47" cy="67.5" r="2.2" fill="#e5383b"/><circle cx="53" cy="67.5" r="2.2" fill="#1d70d8"/>` +
    `<circle cx="50" cy="33" r="25" fill="#f4f5fb" ${O}/>` +
    `<rect x="31" y="21" width="38" height="28" rx="13" fill="#2b3a67" ${O}/>` +
    `<ellipse cx="50" cy="37" rx="14" ry="11" fill="#e0ac80"/>` +
    `<path d="M36 31Q40 21 50 22Q60 21 64 31Q57 27 50 28Q43 27 36 31Z" fill="#6b3e22"/>` +
    `<circle cx="45" cy="36" r="2.4" fill="${K}"/><circle cx="55" cy="36" r="2.4" fill="${K}"/>` +
    `<path d="M46 41Q50 44.5 54 41" fill="none" stroke="${K}" stroke-width="2" stroke-linecap="round"/>` +
    `<path d="M60 24Q66 27 66 34" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".7"/>`,

  ufo:
    `<path d="M33 78L26 92M67 78L74 92" fill="none" ${O}/>` +
    `<path d="M30 52C30 30 70 30 70 52Z" fill="#a8e6ff" ${O}/>` +
    `<path d="M38 44Q40 36 47 34" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` +
    `<ellipse cx="50" cy="60" rx="43" ry="15" fill="#9aa0a6" ${O}/>` +
    `<path d="M10 58Q50 70 90 58" fill="none" ${T}/>` +
    `<ellipse cx="50" cy="52" rx="24" ry="5" fill="#c9ced6" ${T}/>` +
    `<circle cx="22" cy="64" r="3.8" fill="#ffc83d" ${T}/><circle cx="36" cy="68" r="3.8" fill="#ff8fab" ${T}/>` +
    `<circle cx="50" cy="69.5" r="3.8" fill="#2e9a48" ${T}/><circle cx="64" cy="68" r="3.8" fill="#1d70d8" ${T}/><circle cx="78" cy="64" r="3.8" fill="#ffc83d" ${T}/>` +
    `<path d="M47 32L45 22M53 32L55 22" ${T}/><circle cx="45" cy="21" r="2.6" fill="#e5383b" ${T}/><circle cx="55" cy="21" r="2.6" fill="#e5383b" ${T}/>`,

  comet:
    `<path d="M60 22L14 60Q8 66 12 70L26 66L18 82Q20 88 26 84L44 66L40 82Q44 86 48 82L76 42Z" fill="#ffb347" ${O}/>` +
    `<path d="M58 32L24 64M64 40L40 68" fill="none" stroke="#ffe27a" stroke-width="4" stroke-linecap="round"/>` +
    `<circle cx="70" cy="30" r="17" fill="#ffc83d" ${O}/>` +
    `<circle cx="65" cy="25" r="5" fill="#fff" opacity=".6"/>` +
    `<circle cx="88" cy="10" r="2" fill="${K}"/><circle cx="90" cy="56" r="2.4" fill="${K}"/><circle cx="16" cy="28" r="2" fill="${K}"/>`,

  telescope:
    `<path d="M50 58L28 92M50 58L72 92M50 58V92" fill="none" stroke="${K}" stroke-width="8" stroke-linecap="round"/>` +
    `<path d="M50 58L28 92M50 58L72 92M50 58V92" fill="none" stroke="#8d5524" stroke-width="3.6" stroke-linecap="round"/>` +
    `<g transform="rotate(-32 50 50)">` +
    `<rect x="12" y="43" width="20" height="14" rx="3" fill="#1d70d8" ${O}/>` +
    `<rect x="30" y="40" width="40" height="20" rx="3" fill="#1d70d8" ${O}/>` +
    `<rect x="68" y="36" width="20" height="28" rx="4" fill="#ffc83d" ${O}/>` +
    `<rect x="44" y="38" width="6" height="24" rx="2" fill="#ffc83d" ${T}/>` +
    `<path d="M34 45H62" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".6"/></g>` +
    `<circle cx="50" cy="58" r="5" fill="#9aa0a6" ${O}/>`,

  satellite:
    `<g transform="rotate(-25 50 52)">` +
    `<path d="M30 52H70" stroke="${K}" stroke-width="3"/>` +
    `<rect x="5" y="40" width="27" height="24" rx="2" fill="#1d70d8" ${O}/><path d="M14 40V64M23 40V64M5 52H32" stroke="#7fd1ff" stroke-width="1.8"/>` +
    `<rect x="68" y="40" width="27" height="24" rx="2" fill="#1d70d8" ${O}/><path d="M77 40V64M86 40V64M68 52H95" stroke="#7fd1ff" stroke-width="1.8"/>` +
    `<rect x="37" y="38" width="26" height="28" rx="5" fill="#ffc83d" ${O}/>` +
    `<path d="M42 60H58" stroke="#e0a520" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M50 38V28" ${O}/><path d="M38 22Q50 34 62 22Z" fill="#f4f5fb" ${O}/><circle cx="50" cy="18" r="3" fill="#e5383b" ${T}/><path d="M50 26V21" ${T}/></g>`,

  helmet:
    `<path d="M22 76H78L82 90H18Z" fill="#9aa0a6" ${O}/>` +
    `<circle cx="50" cy="46" r="37" fill="#f4f5fb" ${O}/>` +
    `<rect x="22" y="28" width="56" height="38" rx="18" fill="#2b3a67" ${O}/>` +
    `<path d="M30 40Q32 32 42 31" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>` +
    `<circle cx="66" cy="54" r="3" fill="#fff" opacity=".6"/>` +
    `<rect x="84" y="36" width="8" height="18" rx="3" fill="#e5383b" ${O}/>` +
    `<circle cx="24" cy="74" r="3" fill="#2e9a48" ${T}/><circle cx="76" cy="74" r="3" fill="#ffc83d" ${T}/>`,

  badge:
    `<circle cx="50" cy="50" r="44" fill="#2b3a67" ${O}/>` +
    `<circle cx="50" cy="50" r="37" fill="none" stroke="#4b5c99" stroke-width="2.5" stroke-dasharray="3 5" stroke-linecap="round"/>` +
    `<g transform="rotate(-20 50 54)"><path d="M18 54A32 9 0 0 1 82 54" fill="none" stroke="${K}" stroke-width="8"/><path d="M18 54A32 9 0 0 1 82 54" fill="none" stroke="#ffc83d" stroke-width="3.5"/></g>` +
    `<circle cx="50" cy="54" r="19" fill="#f77f00" ${O}/><path d="M34 50Q50 56 66 50" fill="none" stroke="#ffb347" stroke-width="3.5" stroke-linecap="round"/>` +
    `<g transform="rotate(-20 50 54)"><path d="M18 54A32 9 0 0 0 82 54" fill="none" stroke="${K}" stroke-width="8"/><path d="M18 54A32 9 0 0 0 82 54" fill="none" stroke="#ffc83d" stroke-width="3.5"/></g>` +
    `<path d="${star5(28, 26, 8, 3.6)}" fill="#fff" ${T}/><path d="${star5(74, 24, 6, 2.7)}" fill="#ffe27a" ${T}/><path d="${star5(76, 76, 5, 2.3)}" fill="#fff" ${T}/>`,

  pattern:
    `<g fill="none" stroke="#000" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">` +
    `<path d="${star5(18, 18, 7, 3.2)}"/>` +
    `<circle cx="72" cy="22" r="7"/><path d="M60 26Q72 14 84 18" />` +
    `<path d="M24 62A12 12 0 1 0 34 78A9 9 0 0 1 24 62Z"/>` +
    `<path d="M70 58C76 64 77 74 75 82H65C63 74 64 64 70 58ZM65 78L61 84M75 78L79 84"/>` +
    `<path d="M46 44v4M44 46h4M88 88v4M86 90h4M8 92v2M50 92v3"/></g>` +
    `<circle cx="40" cy="12" r="1.3" fill="#000"/><circle cx="92" cy="50" r="1.3" fill="#000"/><circle cx="50" cy="70" r="1.3" fill="#000"/>`,
}
