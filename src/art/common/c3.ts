/* Common drawings, batch 3: one per emoji the lessons use (viewBox 0 0 100 100). */

const S = '#2b2b3a'
const N = 'stroke="none"'
/** Shared outline style (children inherit the stroke). */
const wrap = (s: string) =>
  `<g stroke="${S}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round">${s}</g>`
const r1 = (n: number) => Math.round(n * 10) / 10

const eye = (x: number, y: number, r = 4) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r1(r * 1.15)}" fill="${S}" ${N}/>` +
  `<circle cx="${r1(x + r * 0.35)}" cy="${r1(y - r * 0.45)}" r="${r1(r * 0.4)}" fill="#fff" ${N}/>`
const eyes = (cx: number, y: number, dx: number, r = 4) => eye(cx - dx, y, r) + eye(cx + dx, y, r)
const cheeks = (cx: number, y: number, dx: number, c = '#ff6b8b') =>
  `<ellipse cx="${cx - dx}" cy="${y}" rx="4.2" ry="2.6" fill="${c}" opacity=".45" ${N}/>` +
  `<ellipse cx="${cx + dx}" cy="${y}" rx="4.2" ry="2.6" fill="${c}" opacity=".45" ${N}/>`
const smile = (cx: number, y: number, w: number) =>
  `<path d="M${cx - w} ${y}Q${cx} ${r1(y + w * 0.9)} ${cx + w} ${y}" fill="none" stroke-width="2.5"/>`
/** Thick outlined tube. */
const tube = (d: string, c: string, w = 7) =>
  `<path d="${d}" fill="none" stroke-width="${r1(w + 5.6)}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Shapes drawn so their union gets one shared outline. */
const unite = (...els: string[]) =>
  els.map((e) => e.replace('/>', ' stroke-width="5.6"/>')).join('') + els.map((e) => e.replace('/>', ` ${N}/>`)).join('')
const shine = (x: number, y: number, rx: number, ry: number, rot = 0) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".4" transform="rotate(${rot} ${x} ${y})" ${N}/>`
const starD = (cx: number, cy: number, R: number, r: number) => {
  let d = ''
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rr = i % 2 ? r : R
    d += `${i ? 'L' : 'M'}${r1(cx + rr * Math.cos(a))} ${r1(cy + rr * Math.sin(a))}`
  }
  return d + 'Z'
}

const RED = '#e5383b', BLUE = '#1d70d8', YEL = '#ffc83d', GRN = '#2e9a48', ORA = '#f77f00'
const PUR = '#8b5cf6', PINK = '#ff8fab', BRN = '#8d5524', BLK = '#2f2f3a', DK = '#4a4a5a', GRAY = '#9aa0a6'
const WHITE = '#f6f7f9', SILVER = '#d3d8de'

/* ---------------- yellow faces ---------------- */
const face = (inner: string) =>
  wrap(`<circle cx="50" cy="50" r="42" fill="${YEL}"/>` + shine(34, 24, 12, 6, -25) + inner)

/* ---------------- people (bust, front-facing) ---------------- */
type P = { skin: string; shirt: string; hair?: string; back?: string; chest?: string; top?: string; front?: string; mouth?: string; noEars?: boolean }
const shortHair = (c: string) =>
  `<path d="M31 43Q27 19 50 19Q73 19 69 43Q67 32 59 29Q50 34 40 30Q33 33 31 43Z" fill="${c}"/>`
const person = (o: P) =>
  wrap(
    (o.back ?? '') +
      `<path d="M18 97V85Q18 66 40 62H60Q82 66 82 85V97Z" fill="${o.shirt}"/>` +
      (o.chest ?? '') +
      `<path d="M43 55V63Q50 68 57 63V55Z" fill="${o.skin}"/>` +
      (o.noEars ? '' : `<circle cx="31" cy="42" r="5" fill="${o.skin}"/><circle cx="69" cy="42" r="5" fill="${o.skin}"/>`) +
      `<circle cx="50" cy="40" r="19" fill="${o.skin}"/>` +
      (o.hair ?? '') +
      eyes(50, 42, 7, 3) + cheeks(50, 49, 12) +
      (o.mouth ?? smile(50, 50, 5)) +
      (o.top ?? '') + (o.front ?? '')
  )
const hand = (x: number, y: number, skin: string) => `<circle cx="${x}" cy="${y}" r="6" fill="${skin}"/>`

/* ---------------- vehicles ---------------- */
const wheel = (x: number, y: number) =>
  `<circle cx="${x}" cy="${y}" r="9" fill="${BLK}"/><circle cx="${x}" cy="${y}" r="3.8" fill="${SILVER}"/>`

/* ---------------- camera ---------------- */
const camera = (k = 1, dx = 0, dy = 0) =>
  `<g transform="translate(${dx} ${dy}) scale(${k})">` +
  `<path d="M34 30L39 21H61L66 30Z" fill="${DK}"/>` +
  `<rect x="9" y="29" width="82" height="54" rx="9" fill="${BLK}"/>` +
  `<rect x="15" y="34" width="13" height="7" rx="2" fill="${SILVER}" stroke-width="2"/>` +
  `<circle cx="80" cy="39" r="3.5" fill="${RED}" stroke-width="2"/>` +
  `<circle cx="51" cy="57" r="21" fill="${SILVER}"/><circle cx="51" cy="57" r="14" fill="${DK}"/>` +
  `<circle cx="51" cy="57" r="8" fill="#1b2450"/><circle cx="47" cy="53" r="3" fill="#fff" opacity=".8" ${N}/></g>`

export const ART: Record<string, string> = {
  /* dog: tan, side view facing left */
  '🐕': wrap(
    tube('M80 54Q90 46 88 34', '#d9a46e', 5) +
      `<rect x="32" y="60" width="9" height="28" rx="4" fill="#d9a46e"/><rect x="66" y="60" width="9" height="28" rx="4" fill="#d9a46e"/>` +
      `<rect x="40" y="62" width="8" height="25" rx="4" fill="#c58f58"/><rect x="73" y="60" width="8" height="26" rx="4" fill="#c58f58"/>` +
      `<ellipse cx="57" cy="56" rx="27" ry="14" fill="#d9a46e"/>` +
      `<ellipse cx="62" cy="52" rx="10" ry="6" fill="${BRN}" opacity=".55" ${N}/>` +
      `<path d="M32 46Q34 56 40 58" fill="none" stroke="${RED}" stroke-width="5"/>` +
      `<circle cx="28" cy="36" r="15" fill="#d9a46e"/>` +
      `<ellipse cx="15" cy="43" rx="11" ry="7.5" fill="#efc896"/>` +
      `<circle cx="6.5" cy="40" r="3.8" fill="${S}"/>` +
      `<path d="M10 49Q15 51 19 48" fill="none" stroke-width="2.2"/>` +
      `<path d="M30 22Q44 20 42 36Q40 46 34 44Q32 34 30 22Z" fill="${BRN}"/>` +
      eye(23, 33, 3.2)
  ),
  /* hammer */
  '🔨': wrap(
    `<g transform="translate(50 54) rotate(-35) scale(.86) translate(-50 -54)">` +
      `<rect x="45" y="30" width="10" height="64" rx="4.5" fill="#c98a4b"/>` +
      `<path d="M47 40V88" stroke="#e7b37a" stroke-width="2.4"/>` +
      `<path d="M18 14H70Q86 14 88 22Q86 30 70 30H18Q14 22 18 14Z" fill="${GRAY}"/>` +
      `<rect x="12" y="11" width="10" height="22" rx="2.5" fill="${GRAY}"/>` +
      `<path d="M26 18H64" stroke="#d6dbe0" stroke-width="3"/></g>`
  ),
  /* scissors: black handles, silver blades */
  '✂': wrap(
    `<path d="M48 54L86 10Q92 8 90 16L56 60Z" fill="${SILVER}"/>` +
      `<path d="M52 54L14 10Q8 8 10 16L44 60Z" fill="#e8ecef"/>` +
      `<circle cx="50" cy="56" r="3" fill="${DK}"/>` +
      `<path d="M44 60Q40 64 38 68" fill="none" stroke-width="7"/><path d="M56 60Q60 64 62 68" fill="none" stroke-width="7"/>` +
      `<ellipse cx="30" cy="78" rx="15" ry="12" fill="${BLK}"/><ellipse cx="30" cy="78" rx="7.5" ry="5.5" fill="#fff"/>` +
      `<ellipse cx="70" cy="78" rx="15" ry="12" fill="${BLK}"/><ellipse cx="70" cy="78" rx="7.5" ry="5.5" fill="#fff"/>` +
      `<path d="M22 72Q26 68 32 68" fill="none" stroke="${DK}" stroke-width="2.5"/><path d="M62 72Q66 68 72 68" fill="none" stroke="${DK}" stroke-width="2.5"/>`
  ),
  /* spoon */
  '🥄': wrap(
    `<g transform="rotate(35 50 50)">` +
      `<path d="M46 46H54L56 90Q50 96 44 90Z" fill="${SILVER}"/>` +
      `<ellipse cx="50" cy="28" rx="17" ry="23" fill="${SILVER}"/>` +
      `<ellipse cx="50" cy="29" rx="11" ry="16" fill="#b8bfc6" ${N}/>` + shine(45, 22, 4, 8) + `</g>`
  ),
  /* running shoe: blue */
  '👟': wrap(
    `<path d="M8 72Q6 50 14 42Q22 38 28 44Q40 52 52 46L58 40Q76 50 88 60Q96 66 94 74Z" fill="${BLUE}"/>` +
      `<path d="M6 72H94Q96 84 86 86H14Q4 86 6 72Z" fill="#fff"/>` +
      `<path d="M10 79H90" stroke="#c9ced3" stroke-width="2.4" fill="none"/>` +
      `<path d="M30 48L36 56M38 47L44 55M46 44L52 52" stroke="#fff" stroke-width="3" fill="none"/>` +
      `<path d="M14 44Q20 50 18 60" fill="none" stroke="#7fb8ff" stroke-width="2.4"/>` +
      `<path d="M58 60Q70 62 78 70" fill="none" stroke="#7fb8ff" stroke-width="4"/>`
  ),
  /* crown */
  '👑': wrap(
    `<path d="M12 30L30 54L50 20L70 54L88 30L82 78H18Z" fill="${YEL}"/>` +
      `<rect x="16" y="72" width="68" height="14" rx="4" fill="#f5b020"/>` +
      `<circle cx="12" cy="27" r="5" fill="${YEL}"/><circle cx="50" cy="17" r="5" fill="${YEL}"/><circle cx="88" cy="27" r="5" fill="${YEL}"/>` +
      `<circle cx="50" cy="56" r="7" fill="${RED}"/><circle cx="30" cy="66" r="4.5" fill="${BLUE}"/><circle cx="70" cy="66" r="4.5" fill="${BLUE}"/>` +
      `<circle cx="34" cy="79" r="2.5" fill="${RED}" stroke-width="1.6"/><circle cx="50" cy="79" r="2.5" fill="${GRN}" stroke-width="1.6"/><circle cx="66" cy="79" r="2.5" fill="${RED}" stroke-width="1.6"/>` +
      `<path d="M26 46L32 56" stroke="#fff3c4" stroke-width="3" opacity=".8"/>`
  ),
  /* mouse: gray, side view facing left */
  '🐁': wrap(
    `<path d="M80 74Q96 78 94 62Q92 50 82 54" fill="none" stroke="#e58aa0" stroke-width="3.2"/>` +
      `<path d="M12 66Q22 42 52 42Q84 42 84 70Q84 80 70 80H26Q14 78 12 66Z" fill="${GRAY}"/>` +
      `<ellipse cx="54" cy="74" rx="18" ry="5" fill="#c4c9ce" ${N}/>` +
      `<circle cx="44" cy="38" r="12" fill="${GRAY}"/><circle cx="44" cy="38" r="7" fill="#f4b4c6" ${N}/>` +
      `<ellipse cx="34" cy="82" rx="6" ry="3" fill="#f4b4c6"/><ellipse cx="64" cy="82" rx="6" ry="3" fill="#f4b4c6"/>` +
      `<circle cx="12" cy="65" r="3.6" fill="#e58aa0"/>` +
      `<path d="M16 62L4 56M16 66L3 68" fill="none" stroke-width="1.6"/>` +
      eye(30, 56, 3.4) + cheeks(30, 64, 0)
  ),
  /* whale: blue, side view */
  '🐋': wrap(
    `<path d="M8 60Q8 34 40 34Q64 34 76 52L84 42Q90 36 96 38L90 54L96 68Q90 72 84 64L76 60Q66 82 40 82Q8 82 8 60Z" fill="${BLUE}"/>` +
      `<path d="M12 66Q24 76 44 76Q62 76 72 64Q60 72 44 72Q26 72 12 66Z" fill="#a8d4ff" ${N}/>` +
      `<path d="M42 70Q50 80 58 74" fill="#165cb4"/>` +
      eye(26, 54, 3.4) + `<path d="M14 64Q22 68 30 64" fill="none" stroke-width="2.2"/>` +
      `<path d="M34 32Q34 24 30 16M34 32Q38 22 42 18M34 32Q32 22 22 22" fill="none" stroke="#7fc4ff" stroke-width="3.2"/>` +
      `<circle cx="30" cy="13" r="3" fill="#7fc4ff" stroke-width="2"/><circle cx="44" cy="15" r="3" fill="#7fc4ff" stroke-width="2"/><circle cx="19" cy="20" r="3" fill="#7fc4ff" stroke-width="2"/>` +
      shine(40, 42, 10, 4, -8)
  ),
  /* tiger face: orange */
  '🐯': wrap(
    `<circle cx="24" cy="26" r="11" fill="${ORA}"/><circle cx="76" cy="26" r="11" fill="${ORA}"/>` +
      `<circle cx="24" cy="26" r="5.5" fill="#fff" ${N}/><circle cx="76" cy="26" r="5.5" fill="#fff" ${N}/>` +
      `<ellipse cx="50" cy="54" rx="38" ry="34" fill="${ORA}"/>` +
      `<path d="M50 22L44 34H56ZM40 22L38 30L44 26ZM60 22L62 30L56 26Z" fill="${S}" ${N}/>` +
      `<path d="M12 48L24 52L13 56ZM12 62L24 63L14 68ZM88 48L76 52L87 56ZM88 62L76 63L86 68Z" fill="${S}" ${N}/>` +
      `<ellipse cx="40" cy="68" rx="13" ry="10" fill="#fff" ${N}/><ellipse cx="60" cy="68" rx="13" ry="10" fill="#fff" ${N}/>` +
      `<path d="M40 76Q50 88 60 76" fill="#fff" ${N}/>` +
      eyes(50, 48, 14, 4) +
      `<path d="M44 60H56L50 67Z" fill="#e0607f" stroke-width="2"/>` +
      `<path d="M50 67V71M42 72Q46 75 50 71Q54 75 58 72" fill="none" stroke-width="2.3"/>`
  ),
  /* fox face: orange, pointy */
  '🦊': wrap(
    `<path d="M16 48L18 8L46 34Z" fill="${ORA}"/><path d="M84 48L82 8L54 34Z" fill="${ORA}"/>` +
      `<path d="M22 40L23 18L38 33Z" fill="${S}" opacity=".75" ${N}/><path d="M78 40L77 18L62 33Z" fill="${S}" opacity=".75" ${N}/>` +
      `<path d="M50 88Q38 80 20 64Q8 52 12 38Q30 30 50 30Q70 30 88 38Q92 52 80 64Q62 80 50 88Z" fill="${ORA}"/>` +
      `<path d="M50 88Q38 80 20 64Q10 56 12 48Q22 62 38 60Q46 62 50 70Q54 62 62 60Q78 62 88 48Q90 56 80 64Q62 80 50 88Z" fill="#fff"/>` +
      eyes(50, 48, 14, 3.8) +
      `<ellipse cx="50" cy="80" rx="5.5" ry="4" fill="${S}"/>` +
      `<path d="M44 40Q50 44 56 40" fill="none" stroke="#c45f00" stroke-width="2"/>`
  ),
  /* pig face: pink */
  '🐷': wrap(
    `<path d="M20 38Q12 12 22 10Q32 12 42 24Z" fill="${PINK}"/><path d="M80 38Q88 12 78 10Q68 12 58 24Z" fill="${PINK}"/>` +
      `<path d="M23 30L22 17L33 24Z" fill="#e0607f" ${N}/><path d="M77 30L78 17L67 24Z" fill="#e0607f" ${N}/>` +
      `<ellipse cx="50" cy="54" rx="38" ry="34" fill="${PINK}"/>` + shine(34, 32, 9, 4, -20) +
      eyes(50, 46, 15, 4) + cheeks(50, 62, 26, '#e83e6c') +
      `<ellipse cx="50" cy="64" rx="15" ry="11" fill="#ffc2d1"/>` +
      `<ellipse cx="44.5" cy="64" rx="2.8" ry="4.2" fill="#d04a6c" ${N}/><ellipse cx="55.5" cy="64" rx="2.8" ry="4.2" fill="#d04a6c" ${N}/>` +
      smile(50, 79, 5)
  ),
  /* cow face: white with black spots, pink muzzle */
  '🐮': wrap(
    `<path d="M26 22Q16 18 18 6Q24 14 32 16Z" fill="#f3e3c3"/><path d="M74 22Q84 18 82 6Q76 14 68 16Z" fill="#f3e3c3"/>` +
      `<ellipse cx="14" cy="38" rx="12" ry="7" fill="#fff" transform="rotate(20 14 38)"/><ellipse cx="86" cy="38" rx="12" ry="7" fill="#fff" transform="rotate(-20 86 38)"/>` +
      `<path d="M24 56Q20 16 50 16Q80 16 76 56Z" fill="#fff"/>` +
      `<path d="M30 22Q40 20 42 30Q40 40 30 38Q24 30 30 22Z" fill="${BLK}" ${N}/><path d="M66 30Q74 28 75 38Q70 44 64 40Q62 34 66 30Z" fill="${BLK}" ${N}/>` +
      eyes(50, 40, 12, 3.8) +
      `<ellipse cx="50" cy="70" rx="28" ry="20" fill="#ffb3c6"/>` +
      `<ellipse cx="40" cy="68" rx="4" ry="5.5" fill="#d04a6c" ${N}/><ellipse cx="60" cy="68" rx="4" ry="5.5" fill="#d04a6c" ${N}/>` +
      smile(50, 80, 6)
  ),
  /* koala: gray, big ears, big nose */
  '🐨': wrap(
    `<circle cx="20" cy="32" r="17" fill="${GRAY}"/><circle cx="80" cy="32" r="17" fill="${GRAY}"/>` +
      `<circle cx="21" cy="34" r="10" fill="#eef0f2" ${N}/><circle cx="79" cy="34" r="10" fill="#eef0f2" ${N}/>` +
      `<ellipse cx="50" cy="56" rx="33" ry="31" fill="${GRAY}"/>` +
      `<ellipse cx="50" cy="74" rx="16" ry="9" fill="#c4c9ce" ${N}/>` +
      eyes(50, 50, 16, 3.6) + cheeks(50, 64, 23) +
      `<path d="M41 54Q41 72 50 74Q59 72 59 54Q59 48 50 48Q41 48 41 54Z" fill="${BLK}"/>` +
      shine(46, 55, 2, 4) + smile(50, 80, 4)
  ),
  /* baby chick, front-facing: yellow */
  '🐥': wrap(
    `<path d="M38 86V93M34 93H42M62 86V93M58 93H66" stroke="${ORA}" stroke-width="3.2" fill="none"/>` +
      `<path d="M44 14Q46 4 52 8Q50 12 50 14" fill="${YEL}" stroke-width="2.2"/>` +
      `<ellipse cx="18" cy="58" rx="8" ry="14" fill="${YEL}" transform="rotate(30 18 58)"/><ellipse cx="82" cy="58" rx="8" ry="14" fill="${YEL}" transform="rotate(-30 82 58)"/>` +
      `<ellipse cx="50" cy="52" rx="33" ry="36" fill="${YEL}"/>` + shine(36, 30, 9, 5, -25) +
      eyes(50, 44, 12, 4) + cheeks(50, 56, 20) +
      `<path d="M42 52L50 46L58 52L50 60Z" fill="${ORA}" stroke-width="2.2"/><path d="M42 52H58" stroke-width="1.8"/>`
  ),
  /* lizard: green, top view */
  '🦎': wrap(
    `<path d="M40 30Q26 30 22 20M22 20L16 18M22 20L20 13M60 30Q74 30 78 20M78 20L84 18M78 20L80 13" fill="none" stroke-width="9"/>` +
      `<path d="M40 30Q26 30 22 20M60 30Q74 30 78 20" fill="none" stroke="${GRN}" stroke-width="4"/>` +
      `<path d="M42 58Q28 60 22 72M22 72L15 72M22 72L19 79M58 58Q72 60 78 72M78 72L85 72M78 72L81 79" fill="none" stroke-width="9"/>` +
      `<path d="M42 58Q28 60 22 72M58 58Q72 60 78 72" fill="none" stroke="${GRN}" stroke-width="4"/>` +
      tube('M50 64Q50 84 64 88Q80 90 84 80Q86 72 78 72', GRN, 6) +
      `<ellipse cx="50" cy="44" rx="12" ry="23" fill="${GRN}"/>` +
      `<ellipse cx="50" cy="14" rx="10" ry="12" fill="${GRN}"/>` +
      `<path d="M46 34L50 38L54 34M46 46L50 50L54 46" fill="none" stroke="#a6e39a" stroke-width="2.4"/>` +
      eye(42, 12, 2.6) + eye(58, 12, 2.6)
  ),
  /* t-rex: green, facing right, roaring */
  '🦖': wrap(
    unite(
      `<path d="M4 76Q22 66 34 52Q40 46 50 44L60 60Q60 74 48 80Q30 84 4 76Z" fill="${GRN}"/>`,
      `<path d="M48 54Q50 34 58 24Q64 14 78 14H86Q94 14 94 22V30Q94 34 88 34H72Q66 40 66 52Z" fill="${GRN}"/>`,
      `<ellipse cx="46" cy="64" rx="19" ry="17" fill="${GRN}"/>`
    ) +
      `<path d="M70 36H90Q92 44 84 44H74Z" fill="${GRN}"/>` +
      `<path d="M76 34L78.5 39L81 34ZM82 34L84.5 39L87 34Z" fill="#fff" stroke-width="1.6"/>` +
      tube('M60 56Q68 57 71 63', GRN, 3.6) +
      `<path d="M36 72L32 90H44M54 74L58 90H68" fill="none" stroke-width="10"/>` +
      `<path d="M36 72L32 90H44M54 74L58 90H68" fill="none" stroke="${GRN}" stroke-width="4.4"/>` +
      `<ellipse cx="44" cy="68" rx="10" ry="8" fill="#a6e39a" ${N}/>` +
      eye(76, 22, 3.2)
  ),

  /* ---------------- faces ---------------- */
  '😀': face(
    `<ellipse cx="36" cy="38" rx="5" ry="8" fill="${S}" ${N}/><ellipse cx="64" cy="38" rx="5" ry="8" fill="${S}" ${N}/>` +
      `<path d="M20 54Q50 60 80 54Q78 84 50 84Q22 84 20 54Z" fill="#7a2b2b"/>` +
      `<path d="M22 55Q50 61 78 55L77 64Q50 70 23 64Z" fill="#fff" stroke-width="2"/>` +
      `<path d="M30 76Q50 70 70 76Q62 84 50 84Q38 84 30 76Z" fill="#ff7a8a" ${N}/>`
  ),
  '😃': face(
    `<ellipse cx="35" cy="36" rx="7" ry="10" fill="#fff" stroke-width="2.4"/><ellipse cx="65" cy="36" rx="7" ry="10" fill="#fff" stroke-width="2.4"/>` +
      eye(36, 38, 4.6) + eye(64, 38, 4.6) +
      `<path d="M30 56Q50 52 70 56Q70 88 50 88Q30 88 30 56Z" fill="#7a2b2b"/>` +
      `<path d="M32 57Q50 54 68 57L67.5 62Q50 60 32.5 62Z" fill="#fff" stroke-width="1.8"/>` +
      `<ellipse cx="50" cy="79" rx="11" ry="7" fill="#ff7a8a" ${N}/>` +
      `<path d="M24 22Q30 16 40 18M60 18Q70 16 76 22" fill="none" stroke-width="3"/>`
  ),
  '🙂': face(
    `<ellipse cx="36" cy="40" rx="4.5" ry="6.5" fill="${S}" ${N}/><ellipse cx="64" cy="40" rx="4.5" ry="6.5" fill="${S}" ${N}/>` +
      `<path d="M32 62Q50 74 68 62" fill="none" stroke-width="4"/>`
  ),
  '😊': face(
    `<path d="M26 44Q35 32 44 44M56 44Q65 32 74 44" fill="none" stroke-width="4.4"/>` +
      `<ellipse cx="26" cy="58" rx="9" ry="6" fill="#ff6b8b" opacity=".6" ${N}/><ellipse cx="74" cy="58" rx="9" ry="6" fill="#ff6b8b" opacity=".6" ${N}/>` +
      `<path d="M30 60Q50 82 70 60Q50 70 30 60Z" fill="#7a2b2b" stroke-width="3"/>`
  ),

  /* tomato: red */
  '🍅': wrap(
    `<path d="M50 24Q90 18 92 54Q92 88 50 90Q8 88 8 54Q10 18 50 24Z" fill="${RED}"/>` +
      shine(30, 40, 8, 5, -35) +
      `<path d="M50 30L36 20L44 30L30 34L46 34L44 42L52 34L64 40L58 32L72 28L56 28L60 18Z" fill="${GRN}" stroke-width="2.2"/>` +
      `<path d="M50 28Q50 16 56 10" fill="none" stroke="${GRN}" stroke-width="4.5"/>`
  ),
  /* glowing star */
  '🌟': wrap(
    `<path d="M50 4V12M50 88V96M8 38L15 41M92 38L85 41M20 86L25 80M80 86L75 80" fill="none" stroke="${ORA}" stroke-width="4"/>` +
      `<path d="${starD(50, 54, 40, 17)}" fill="${YEL}"/>` +
      `<path d="${starD(50, 54, 26, 11)}" fill="#ffe58a" ${N}/>` +
      `<path d="M14 14L16 20L22 22L16 24L14 30L12 24L6 22L12 20Z" fill="#fff3a8" stroke-width="1.8"/>` +
      `<path d="M86 12L87.5 16L92 17.5L87.5 19L86 23L84.5 19L80 17.5L84.5 16Z" fill="#fff3a8" stroke-width="1.8"/>`
  ),
  /* tropical fish: yellow + blue stripes */
  '🐠': wrap(
    `<path d="M74 50L94 30Q98 50 94 70Z" fill="${BLUE}"/>` +
      `<path d="M30 30Q44 10 64 28Z" fill="${BLUE}"/><path d="M40 70Q50 86 60 72Z" fill="${BLUE}"/>` +
      `<path d="M8 50Q22 24 50 24Q72 26 80 50Q72 74 50 76Q22 76 8 50Z" fill="${YEL}"/>` +
      `<path d="M30 30Q38 50 30 72L40 75Q48 50 40 26Z" fill="${BLUE}" ${N}/>` +
      `<path d="M54 25Q62 50 54 76L62 74Q70 50 62 27Z" fill="${BLUE}" ${N}/>` +
      `<path d="M8 50Q22 24 50 24Q72 26 80 50Q72 74 50 76Q22 76 8 50Z" fill="none"/>` +
      eye(20, 46, 3.4) + `<path d="M10 56Q15 58 19 56" fill="none" stroke-width="2"/>`
  ),
  /* hibiscus: pink */
  '🌺': wrap(
    [0, 72, 144, 216, 288]
      .map((a) => `<ellipse cx="50" cy="27" rx="19" ry="22" fill="${PINK}" transform="rotate(${a} 50 50)"/>`)
      .join('') +
      `<circle cx="50" cy="50" r="15" fill="${PINK}" ${N}/>` +
      `<circle cx="50" cy="50" r="11" fill="#d6336c"/>` +
      `<path d="M50 50L70 26" fill="none" stroke="#d6336c" stroke-width="4"/>` +
      `<circle cx="71" cy="24" r="3" fill="${YEL}" stroke-width="1.8"/><circle cx="76" cy="27" r="3" fill="${YEL}" stroke-width="1.8"/><circle cx="68" cy="20" r="3" fill="${YEL}" stroke-width="1.8"/>`
  ),
  /* SUV: blue, side view */
  '🚙': wrap(
    `<path d="M6 68V52Q6 46 12 45L22 44L30 26Q32 22 37 22H72Q78 22 80 28L86 44Q94 46 94 54V68Q94 74 88 74H12Q6 74 6 68Z" fill="${BLUE}"/>` +
      `<path d="M27 44L34 29H50V44Z" fill="#cfe8ff"/><path d="M56 29H72Q75 29 76 32L80 44H56Z" fill="#cfe8ff"/>` +
      `<path d="M53 46V70M44 52H48M74 52H78" fill="none" stroke-width="2.4"/>` +
      `<rect x="6" y="52" width="6" height="6" rx="2" fill="${YEL}" stroke-width="2"/><rect x="88" y="54" width="6" height="6" rx="2" fill="${RED}" stroke-width="2"/>` +
      `<path d="M38 20H70" stroke-width="3.4"/>` +
      wheel(26, 74) + wheel(74, 74)
  ),
  /* volleyball */
  '🏐': wrap(
    `<circle cx="50" cy="50" r="42" fill="#fff"/>` +
      `<path d="M50 50Q38 28 50 8A42 42 0 0 1 86.4 71Q66 52 50 50Z" fill="${YEL}"/>` +
      `<path d="M50 50Q66 52 86.4 71A42 42 0 0 1 13.6 71Q36 64 50 50Z" fill="${BLUE}"/>` +
      `<path d="M58.3 52Q48 30 64.4 10.5M67.1 56.3Q60 36 79.7 20.3" fill="none" stroke-width="2.4"/>` +
      `<path d="M42.5 56.5Q60 62 77 82.2M33.9 62.3Q50 70 64.4 89.5" fill="none" stroke-width="2.4"/>` +
      `<path d="M45.5 39.1Q28 44 8.6 57.3M44 28.5Q26 30 9.4 39.1" fill="none" stroke-width="2.4"/>` +
      shine(30, 26, 8, 4, -35) + `<circle cx="50" cy="50" r="42" fill="none"/>`
  ),
  /* beetle: black/dark, top view */
  '🪲': wrap(
    `<path d="M30 40L14 32L10 22M30 56L10 56L6 48M32 70L16 80L14 90M70 40L86 32L90 22M70 56L90 56L94 48M68 70L84 80L86 90" fill="none" stroke-width="3.2"/>` +
      `<path d="M44 16Q40 8 32 6M56 16Q60 8 68 6" fill="none" stroke-width="2.8"/>` +
      `<ellipse cx="50" cy="20" rx="10" ry="7" fill="${BLK}"/>` +
      `<path d="M30 30Q50 24 70 30Q72 34 70 36H30Q28 34 30 30Z" fill="${DK}"/>` +
      `<path d="M30 36H70Q76 60 68 80Q60 92 50 92Q40 92 32 80Q24 60 30 36Z" fill="${BLK}"/>` +
      `<path d="M50 36V92" fill="none" stroke="#6a6a7a" stroke-width="2.4"/>` +
      `<ellipse cx="40" cy="54" rx="4" ry="12" fill="#6b7d9a" opacity=".7" ${N}/><ellipse cx="60" cy="54" rx="4" ry="12" fill="#6b7d9a" opacity=".7" ${N}/>`
  ),
  /* peach */
  '🍑': wrap(
    `<path d="M50 28Q22 14 12 42Q4 72 30 88Q42 94 50 88Q58 94 70 88Q96 72 88 42Q78 14 50 28Z" fill="#ffa26b"/>` +
      `<path d="M50 30Q64 22 76 30Q90 44 86 62Q82 78 68 86Q60 88 56 84Q72 66 50 30Z" fill="${PINK}" opacity=".75" ${N}/>` +
      `<path d="M50 30Q40 58 50 88" fill="none" stroke="#e0607f" stroke-width="2.6"/>` +
      shine(26, 46, 5, 9, 20) +
      `<path d="M50 28Q48 18 52 12" fill="none" stroke="${BRN}" stroke-width="3.4"/>` +
      `<path d="M52 18Q62 4 80 10Q70 26 52 18Z" fill="${GRN}"/><path d="M48 20Q40 8 26 12Q34 26 48 20Z" fill="#45b35e"/>`
  ),
  /* hamster face: tan/orange with white cheeks */
  '🐹': wrap(
    `<circle cx="24" cy="26" r="11" fill="#e8a25a"/><circle cx="76" cy="26" r="11" fill="#e8a25a"/>` +
      `<circle cx="24" cy="26" r="6" fill="#f4b4c6" ${N}/><circle cx="76" cy="26" r="6" fill="#f4b4c6" ${N}/>` +
      `<path d="M50 20Q86 20 90 58Q92 88 50 88Q8 88 10 58Q14 20 50 20Z" fill="#e8a25a"/>` +
      `<path d="M50 40Q38 44 22 52Q10 60 14 74Q24 88 50 88Q76 88 86 74Q90 60 78 52Q62 44 50 40Z" fill="#fff4e6" ${N}/>` +
      eyes(50, 46, 15, 4) + cheeks(50, 62, 24) +
      `<ellipse cx="50" cy="58" rx="4" ry="3" fill="#e0607f" stroke-width="2"/>` +
      `<path d="M50 61V65M44 66Q47 69 50 65Q53 69 56 66" fill="none" stroke-width="2.2"/>` +
      `<rect x="47" y="67" width="6" height="5" rx="1" fill="#fff" stroke-width="1.6"/>`
  ),
  /* cookie: brown */
  '🍪': wrap(
    `<path d="M50 8Q60 10 66 12Q76 14 82 22Q90 30 90 40Q94 50 90 60Q88 72 80 80Q72 88 60 90Q50 94 40 90Q28 88 20 80Q12 72 10 60Q6 50 10 40Q12 28 20 20Q28 12 40 10Q46 6 50 8Z" fill="#c98a4b"/>` +
      `<path d="M50 14Q72 16 82 32" fill="none" stroke="#e2ad72" stroke-width="5"/>` +
      [[34, 30], [62, 28], [48, 50], [26, 56], [70, 54], [40, 74], [62, 76], [76, 38]]
        .map(([x, y], i) => `<path d="M${x - 5} ${y}Q${x - 4} ${y - 5} ${x} ${y - 5}Q${x + 5} ${y - 3} ${x + 4} ${y + 2}Q${x} ${y + 5} ${x - 5} ${y}Z" fill="#5a3418" stroke-width="${i % 2 ? 1.8 : 0}"/>`)
        .join('')
  ),
  /* doughnut: pink frosting */
  '🍩': (() => {
    let d = ''
    for (let i = 0; i <= 36; i++) {
      const a = (i / 36) * Math.PI * 2
      const r = 35 + 3.2 * Math.sin(a * 7)
      d += `${i ? 'L' : 'M'}${r1(50 + r * Math.cos(a))} ${r1(48 + r * Math.sin(a))}`
    }
    const hole = (r: number, cy: number) => `M${50 - r} ${cy}A${r} ${r} 0 1 0 ${50 + r} ${cy}A${r} ${r} 0 1 0 ${50 - r} ${cy}Z`
    const spr: [number, number, number, string][] = [
      [30, 30, 30, YEL], [50, 20, -20, BLUE], [70, 30, 60, '#fff'], [76, 52, -30, GRN], [66, 72, 20, YEL],
      [40, 74, -50, BLUE], [24, 58, 70, '#fff'], [26, 42, -10, GRN], [60, 24, 80, PUR],
    ]
    return wrap(
      `<path d="M8 50A42 42 0 1 0 92 50A42 42 0 1 0 8 50Z${hole(14, 50)}" fill="#e0ac80" fill-rule="evenodd"/>` +
        `<path d="${d}Z${hole(15, 48)}" fill="${PINK}" fill-rule="evenodd"/>` +
        spr.map(([x, y, a, c]) => `<rect x="${x - 4}" y="${y - 1.5}" width="8" height="3" rx="1.5" fill="${c}" stroke-width="1.2" transform="rotate(${a} ${x} ${y})"/>`).join('') +
        shine(30, 24, 7, 3, -30)
    )
  })(),
  /* caterpillar: green */
  '🐛': wrap(
    [[16, 66], [30, 58], [44, 54], [58, 58]]
      .map(([x, y]) => `<path d="M${x - 2} ${y + 10}L${x - 4} ${y + 16}M${x + 3} ${y + 10}L${x + 4} ${y + 16}" stroke-width="2.6" fill="none"/>`)
      .join('') +
      [[16, 66], [30, 58], [44, 54], [58, 58]]
        .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="12" fill="${i % 2 ? '#7ccf6b' : GRN}"/>`)
        .join('') +
      `<path d="M70 34Q66 18 60 14M80 34Q82 18 90 14" fill="none" stroke-width="2.6"/>` +
      `<circle cx="60" cy="13" r="3" fill="${RED}" stroke-width="2"/><circle cx="90" cy="13" r="3" fill="${RED}" stroke-width="2"/>` +
      `<circle cx="76" cy="50" r="17" fill="#7ccf6b"/>` +
      eyes(76, 46, 6, 3.2) + cheeks(76, 54, 10) + smile(76, 56, 4)
  ),

  /* ---------------- jobs ---------------- */
  /* doctor */
  '🧑‍⚕': person({
    skin: '#e0ac80', shirt: WHITE, hair: shortHair('#5a3418'),
    chest:
      `<path d="M40 62L50 82L60 62Z" fill="#7fb8ff"/>` +
      `<path d="M40 62L46 86M60 62L54 86" fill="none" stroke-width="2.4"/>` +
      `<path d="M38 64Q30 80 42 86M62 64Q72 78 62 84" fill="none" stroke="${DK}" stroke-width="3"/>` +
      `<circle cx="61" cy="86" r="5" fill="${SILVER}" stroke-width="2.4"/>` +
      `<path d="M26 78H34M30 74V82" stroke="${RED}" stroke-width="3.4"/>`,
  }),
  /* stethoscope */
  '🩺': wrap(
    `<path d="M30 10V36Q30 54 46 56Q62 54 62 36V10" fill="none" stroke-width="9"/>` +
      `<path d="M30 10V36Q30 54 46 56Q62 54 62 36V10" fill="none" stroke="${SILVER}" stroke-width="3.6"/>` +
      `<rect x="24" y="6" width="12" height="7" rx="3.5" fill="${DK}" stroke-width="2"/><rect x="56" y="6" width="12" height="7" rx="3.5" fill="${DK}" stroke-width="2"/>` +
      tube('M46 56Q46 78 60 82Q74 84 76 70', DK, 5) +
      `<circle cx="76" cy="62" r="13" fill="${SILVER}"/><circle cx="76" cy="62" r="7.5" fill="#eef1f4" stroke-width="2"/>` +
      shine(72, 58, 3, 2)
  ),
  /* hospital */
  '🏥': wrap(
    `<rect x="8" y="34" width="84" height="58" rx="3" fill="${WHITE}"/>` +
      `<rect x="28" y="14" width="44" height="78" rx="3" fill="#ffe1e6"/>` +
      `<rect x="36" y="20" width="28" height="28" rx="5" fill="#fff"/>` +
      `<path d="M45 24H55V29H60V39H55V44H45V39H40V29H45Z" fill="${RED}" stroke-width="2"/>` +
      [14, 76].map((x) => `<rect x="${x}" y="44" width="10" height="10" rx="1.5" fill="#9fd3ff" stroke-width="2"/><rect x="${x}" y="62" width="10" height="10" rx="1.5" fill="#9fd3ff" stroke-width="2"/>`).join('') +
      `<rect x="34" y="56" width="12" height="10" rx="1.5" fill="#9fd3ff" stroke-width="2"/><rect x="54" y="56" width="12" height="10" rx="1.5" fill="#9fd3ff" stroke-width="2"/>` +
      `<path d="M40 92V78Q40 74 44 74H56Q60 74 60 78V92Z" fill="#9fd3ff"/><path d="M50 74V92" stroke-width="2"/>`
  ),
  /* firefighter */
  '🧑‍🚒': person({
    skin: '#b97a56', shirt: '#3a3f5a',
    chest:
      `<path d="M21 80H79" stroke="${YEL}" stroke-width="6"/><path d="M21 80H79" stroke="${SILVER}" stroke-width="2"/>` +
      `<path d="M50 64V97" stroke-width="2.4" fill="none"/>` +
      `<path d="M38 62L44 70M62 62L56 70" stroke="${YEL}" stroke-width="5" fill="none"/>`,
    top:
      `<path d="M28 36Q28 10 50 10Q72 10 72 36Z" fill="${RED}"/>` +
      `<path d="M50 12V34" stroke="#b52a2d" stroke-width="3" fill="none"/>` +
      `<path d="M18 36Q50 28 82 36Q84 42 76 42Q50 36 24 42Q16 42 18 36Z" fill="#c92a2d"/>` +
      `<path d="M42 18H58V30Q50 34 42 30Z" fill="${YEL}" stroke-width="2.2"/>` +
      `<path d="M50 20L52 25L50 29L48 25Z" fill="${RED}" ${N}/>`,
  }),
  /* fire */
  '🔥': wrap(
    `<path d="M50 4Q58 22 70 32Q88 48 84 68Q80 94 50 95Q20 94 16 68Q14 50 28 38Q30 52 38 54Q32 30 50 4Z" fill="${ORA}"/>` +
      `<path d="M76 30Q86 40 84 54Q80 44 74 40Z" fill="${ORA}"/>` +
      `<path d="M50 42Q58 56 66 63Q72 74 66 84Q60 91 50 91Q38 91 34 82Q30 70 40 62Q42 70 47 70Q44 56 50 42Z" fill="${YEL}"/>` +
      `<path d="M50 70Q56 78 54 84Q50 88 46 84Q44 78 50 70Z" fill="#fff3c4" ${N}/>`
  ),
  /* police officer */
  '👮': person({
    skin: '#f6d2b5', shirt: BLUE, hair: shortHair('#2f2f3a'),
    chest:
      `<path d="M40 62L50 72L60 62Z" fill="#cfe8ff"/>` +
      `<path d="M50 72L47 84L50 90L53 84Z" fill="#1b2450" stroke-width="2"/>` +
      `<path d="${starD(66, 76, 6, 2.8)}" fill="${YEL}" stroke-width="1.8"/>` +
      `<path d="M26 72H36" stroke="#1b2450" stroke-width="2.4"/>`,
    top:
      `<path d="M26 30Q20 14 50 10Q80 14 74 30Z" fill="#1b2450"/>` +
      `<path d="M30 30H70V35H30Z" fill="#111" stroke-width="2"/>` +
      `<path d="M30 35Q50 46 70 35" fill="${S}"/>` +
      `<path d="M50 14L55 19L53 26H47L45 19Z" fill="${YEL}" stroke-width="2"/>`,
  }),
  /* police car: side view, black & white, siren */
  '🚓': wrap(
    `<rect x="40" y="24" width="10" height="7" rx="2" fill="${RED}" stroke-width="2.2"/><rect x="50" y="24" width="10" height="7" rx="2" fill="${BLUE}" stroke-width="2.2"/>` +
      `<path d="M6 68V58Q6 52 14 50L28 48L38 34Q40 31 44 31H64Q68 31 70 34L80 48L88 50Q94 52 94 58V68Q94 74 88 74H12Q6 74 6 68Z" fill="${BLK}"/>` +
      `<path d="M30 49H78V74H30Z" fill="#fff" ${N}/><path d="M30 49V74M78 49V74" stroke-width="2.4"/>` +
      `<path d="M33 48L41 36H52V48Z" fill="#cfe8ff" stroke-width="2.4"/><path d="M57 36H66L74 48H57Z" fill="#cfe8ff" stroke-width="2.4"/>` +
      `<path d="M54 52V72" stroke-width="2.2"/>` +
      `<path d="${starD(42, 61, 6, 2.6)}" fill="${YEL}" stroke-width="1.8"/>` +
      `<rect x="88" y="55" width="6" height="5" rx="2" fill="${YEL}" stroke-width="2"/>` +
      `<path d="M6 68V58Q6 52 14 50L28 48L38 34Q40 31 44 31H64Q68 31 70 34L80 48L88 50Q94 52 94 58V68Q94 74 88 74H12Q6 74 6 68Z" fill="none"/>` +
      wheel(24, 74) + wheel(76, 74)
  ),
  /* cook */
  '🧑‍🍳': person({
    skin: '#7a4b2f', shirt: WHITE,
    chest:
      `<path d="M40 62L50 70L60 62L56 74H44Z" fill="${RED}" stroke-width="2.4"/>` +
      `<circle cx="42" cy="80" r="2.2" fill="${GRAY}" stroke-width="1.4"/><circle cx="58" cy="80" r="2.2" fill="${GRAY}" stroke-width="1.4"/>` +
      `<circle cx="42" cy="90" r="2.2" fill="${GRAY}" stroke-width="1.4"/><circle cx="58" cy="90" r="2.2" fill="${GRAY}" stroke-width="1.4"/>`,
    top: unite(
      `<circle cx="35" cy="15" r="10" fill="#fff"/>`,
      `<circle cx="50" cy="10" r="10" fill="#fff"/>`,
      `<circle cx="65" cy="15" r="10" fill="#fff"/>`,
      `<rect x="31" y="14" width="38" height="18" fill="#fff"/>`
    ) + `<rect x="30" y="24" width="40" height="10" rx="2" fill="#fff"/>` + `<path d="M40 12V22M50 10V22M60 12V22" stroke="#d8dce2" stroke-width="2"/>`,
  }),
  /* frying pan with egg */
  '🍳': wrap(
    `<path d="M68 64L92 86" stroke-width="13"/><path d="M68 64L92 86" stroke="${DK}" stroke-width="7.4"/>` +
      `<circle cx="42" cy="44" r="36" fill="${BLK}"/><circle cx="42" cy="44" r="29" fill="${DK}" ${N}/>` +
      `<path d="M24 40Q20 24 36 22Q48 16 58 26Q68 34 62 48Q60 62 44 62Q28 64 26 52Q20 48 24 40Z" fill="#fff"/>` +
      `<circle cx="43" cy="42" r="10" fill="${YEL}"/>` + shine(40, 39, 3, 2)
  ),
  /* pot of food */
  '🍲': wrap(
    `<path d="M30 22Q24 14 30 6M50 22Q44 14 50 6M70 22Q64 14 70 6" fill="none" stroke="#b7c3cf" stroke-width="3.4"/>` +
      `<path d="M14 46Q4 46 4 54Q4 60 12 60M86 46Q96 46 96 54Q96 60 88 60" fill="none" stroke-width="5"/>` +
      `<path d="M12 44H88V72Q88 90 70 90H30Q12 90 12 72Z" fill="${GRAY}"/>` +
      `<ellipse cx="50" cy="40" rx="40" ry="11" fill="#c96a2b"/>` +
      `<circle cx="32" cy="38" r="5" fill="${ORA}" stroke-width="2"/><circle cx="52" cy="34" r="5" fill="${GRN}" stroke-width="2"/>` +
      `<circle cx="66" cy="40" r="5" fill="${ORA}" stroke-width="2"/><circle cx="44" cy="44" r="4" fill="#f6e3a1" stroke-width="2"/><circle cx="74" cy="36" r="3.5" fill="${GRN}" stroke-width="2"/>` +
      `<path d="M18 56H82" stroke="#c4c9ce" stroke-width="4"/>`
  ),
  /* artist */
  '🧑‍🎨': person({
    skin: '#f6d2b5', shirt: PUR,
    hair: `<path d="M30 44Q24 20 48 18Q74 18 70 44Q72 54 76 58Q66 58 66 44Q62 30 50 30Q38 30 34 44Q34 58 24 58Q28 54 30 44Z" fill="#c45f00"/>`,
    chest: `<circle cx="30" cy="80" r="3" fill="${YEL}" ${N}/><circle cx="40" cy="90" r="2.5" fill="#7fb8ff" ${N}/>`,
    top:
      `<ellipse cx="46" cy="22" rx="24" ry="8" fill="${RED}" transform="rotate(-8 46 22)"/>` +
      `<path d="M46 14L44 8" stroke-width="3.4"/>`,
    front:
      `<path d="M54 74Q62 62 80 66Q96 72 92 84Q88 92 76 90Q72 86 66 88Q54 90 54 74Z" fill="#e7b37a"/>` +
      `<circle cx="64" cy="74" r="3.4" fill="${RED}" stroke-width="1.8"/><circle cx="74" cy="70" r="3.4" fill="${YEL}" stroke-width="1.8"/>` +
      `<circle cx="84" cy="74" r="3.4" fill="${BLUE}" stroke-width="1.8"/><circle cx="84" cy="83" r="3.4" fill="${GRN}" stroke-width="1.8"/>` +
      `<path d="M74 58L94 40" stroke-width="5"/><path d="M74 58L94 40" stroke="#c98a4b" stroke-width="2"/>` +
      `<path d="M74 58L70 62" stroke="${RED}" stroke-width="5"/>`,
  }),
  /* paintbrush: tip pointing lower-left */
  '🖌': wrap(
    `<g transform="rotate(45 50 50)">` +
      `<rect x="44" y="2" width="12" height="54" rx="6" fill="${BLUE}"/>` +
      `<path d="M47 8V48" stroke="#7fb8ff" stroke-width="2.4"/>` +
      `<rect x="42" y="54" width="16" height="14" rx="2" fill="${SILVER}"/>` +
      `<path d="M42 68H58Q60 84 50 98Q40 84 42 68Z" fill="${RED}"/>` +
      `<path d="M46 72Q46 84 50 92" fill="none" stroke="#ff8a8c" stroke-width="2.4"/></g>`
  ),
  /* pilot */
  '🧑‍✈': person({
    skin: '#b97a56', shirt: '#fff', hair: shortHair('#2f2f3a'),
    chest:
      `<path d="M40 62L50 70L60 62" fill="none" stroke-width="2.4"/>` +
      `<path d="M50 70L46 76L50 94L54 76Z" fill="#1b2450" stroke-width="2"/>` +
      `<path d="M20 70L36 64V72L22 78Z" fill="#1b2450" stroke-width="2"/><path d="M80 70L64 64V72L78 78Z" fill="#1b2450" stroke-width="2"/>` +
      `<path d="M24 72L34 68M66 68L76 72" stroke="${YEL}" stroke-width="2"/>` +
      `<path d="M60 80Q66 76 72 80M66 78V82" stroke="${YEL}" stroke-width="2.6" fill="none"/>`,
    top:
      `<path d="M24 30Q18 14 50 12Q82 14 76 30Z" fill="#1b2450"/>` +
      `<rect x="28" y="28" width="44" height="6" rx="2" fill="#1b2450" stroke-width="2"/>` +
      `<path d="M30 34Q50 46 70 34" fill="${S}"/>` +
      `<path d="M36 31H64" stroke="${YEL}" stroke-width="2"/>` +
      `<path d="M40 20Q46 17 50 21Q54 17 60 20Q54 24 50 24Q46 24 40 20Z" fill="${YEL}" stroke-width="1.6"/>`,
  }),
  /* airplane taking off */
  '🛫': wrap(
    `<path d="M6 92H94" stroke="${GRAY}" stroke-width="3.4" stroke-dasharray="10 7" fill="none"/>` +
      `<g transform="rotate(-35 50 52)">` +
      `<path d="M50 52L26 30H18L34 52Z" fill="${GRAY}"/><path d="M50 52L26 74H18L34 52Z" fill="${GRAY}"/>` +
      `<path d="M14 52L6 42H2L6 52L2 62H6Z" fill="${GRAY}"/>` +
      `<path d="M8 52Q8 46 16 46H80Q96 48 96 52Q96 56 80 58H16Q8 58 8 52Z" fill="#e6eaee"/>` +
      `<path d="M86 48Q92 49 93 52H86Z" fill="#7fb8ff" stroke-width="1.6"/>` +
      `<path d="M28 52H76" stroke="${BLUE}" stroke-width="2.6" stroke-dasharray="3 4"/></g>`
  ),
  /* farmer */
  '🧑‍🌾': person({
    skin: '#e0ac80', shirt: RED, hair: shortHair('#a0522d'),
    chest:
      `<path d="M30 70V97M40 66V97M60 66V97M70 70V97M20 80H80M19 90H81" stroke="#b52a2d" stroke-width="1.6" fill="none"/>` +
      `<path d="M36 76H64V97H36Z" fill="${BLUE}"/>` +
      `<path d="M36 76L30 64M64 76L70 64" stroke="${BLUE}" stroke-width="5"/>` +
      `<circle cx="40" cy="80" r="2" fill="${YEL}" stroke-width="1.4"/><circle cx="60" cy="80" r="2" fill="${YEL}" stroke-width="1.4"/>`,
    top:
      `<ellipse cx="50" cy="28" rx="36" ry="8" fill="#f0c060"/>` +
      `<path d="M33 28Q32 8 50 8Q68 8 67 28Z" fill="#f0c060"/>` +
      `<path d="M33 22Q50 26 67 22V27Q50 31 33 27Z" fill="${RED}" stroke-width="2"/>` +
      `<path d="M24 28Q50 34 76 28" stroke="#c99a30" stroke-width="2" fill="none"/>`,
    front:
      `<path d="M86 96Q84 76 88 54" fill="none" stroke="#c99a30" stroke-width="3"/>` +
      [56, 63, 70].map((y) => `<ellipse cx="84" cy="${y}" rx="3" ry="5" fill="${YEL}" stroke-width="1.8" transform="rotate(-25 84 ${y})"/><ellipse cx="92" cy="${y + 1}" rx="3" ry="5" fill="${YEL}" stroke-width="1.8" transform="rotate(25 92 ${y + 1})"/>`).join('') +
      `<ellipse cx="88" cy="48" rx="3" ry="5" fill="${YEL}" stroke-width="1.8"/>` + hand(84, 84, '#e0ac80'),
  }),
  /* mechanic */
  '🧑‍🔧': person({
    skin: '#7a4b2f', shirt: BLUE, hair: shortHair('#2f2f3a'),
    chest:
      `<path d="M40 62L50 72L60 62" fill="none" stroke-width="2.4"/><path d="M50 72V97" stroke-width="2.4"/>` +
      `<rect x="26" y="74" width="12" height="10" rx="2" fill="#165cb4" stroke-width="2"/>`,
    top: `<path d="M30 33Q28 14 50 14Q72 14 70 33Z" fill="${RED}"/><path d="M50 33H84Q86 38 80 38H50Z" fill="#b52a2d"/><circle cx="50" cy="14" r="2.5" fill="${RED}" stroke-width="2"/>`,
    front:
      `<ellipse cx="40" cy="52" rx="3.5" ry="2" fill="${S}" opacity=".35" ${N}/>` +
      `<g transform="rotate(25 78 64)"><rect x="74" y="50" width="8" height="40" rx="3" fill="${SILVER}"/>` +
      `<path d="M68 52V38L73 33V43H83V33L88 38V52Q78 56 68 52Z" fill="${SILVER}"/></g>` +
      hand(70, 80, '#7a4b2f'),
  }),
  /* teacher, in front of a chalkboard */
  '🧑‍🏫': person({
    skin: '#f6d2b5', shirt: GRN,
    back:
      `<rect x="4" y="6" width="92" height="56" rx="4" fill="#c98a4b"/>` +
      `<rect x="9" y="11" width="82" height="46" rx="2" fill="#2e5e48"/>` +
      `<path d="M14 20Q18 16 22 20T30 20M14 30H26M76 18L84 26M84 18L76 26M74 38Q80 32 86 38" fill="none" stroke="#fff" stroke-width="2.2"/>`,
    hair:
      `<circle cx="50" cy="18" r="8" fill="#8d5524"/>` +
      `<path d="M31 44Q27 20 50 21Q73 20 69 44Q66 30 50 28Q34 30 31 44Z" fill="#8d5524"/>`,
    chest: `<path d="M40 62L50 76L60 62" fill="#fff" stroke-width="2.4"/><circle cx="50" cy="84" r="2" fill="#fff" stroke-width="1.4"/><circle cx="50" cy="92" r="2" fill="#fff" stroke-width="1.4"/>`,
    top:
      `<circle cx="43" cy="42" r="6.5" fill="#fff" opacity=".25" stroke-width="2.2"/><circle cx="57" cy="42" r="6.5" fill="#fff" opacity=".25" stroke-width="2.2"/>` +
      `<circle cx="43" cy="42" r="6.5" fill="none" stroke-width="2.2"/><circle cx="57" cy="42" r="6.5" fill="none" stroke-width="2.2"/><path d="M49.5 42H50.5" stroke-width="2.2"/>`,
    front: `<path d="M74 84L94 52" stroke-width="5"/><path d="M74 84L94 52" stroke="#c98a4b" stroke-width="2"/>` + hand(74, 84, '#f6d2b5'),
  }),
  /* books: stack */
  '📚': wrap(
    `<rect x="10" y="68" width="80" height="20" rx="3" fill="${ORA}"/><path d="M80 71V85" stroke="#fff" stroke-width="5"/><path d="M18 74H40" stroke="#ffd29a" stroke-width="3"/>` +
      `<rect x="16" y="48" width="70" height="20" rx="3" fill="${BLUE}"/><path d="M76 51V65" stroke="#fff" stroke-width="5"/><path d="M24 54H44" stroke="#9fd3ff" stroke-width="3"/>` +
      `<g transform="rotate(-8 50 38)"><rect x="12" y="28" width="72" height="20" rx="3" fill="${GRN}"/><path d="M74 31V45" stroke="#fff" stroke-width="5"/><path d="M20 34H40" stroke="#a6e39a" stroke-width="3"/></g>` +
      `<path d="M60 10V24L64 20L68 24V10" fill="${RED}" stroke-width="2" transform="rotate(-8 50 38)"/>`
  ),
  /* school */
  '🏫': wrap(
    `<rect x="6" y="46" width="88" height="46" rx="2" fill="#ffd77a"/>` +
      `<path d="M2 48L50 20L98 48Z" fill="${RED}"/>` +
      `<path d="M40 22V8H60V22" fill="${RED}"/><path d="M36 8H64L50 0Z" fill="${RED}" stroke-width="2.2"/>` +
      `<circle cx="50" cy="36" r="9" fill="#fff"/><path d="M50 30V36L54 38" fill="none" stroke-width="2.2"/>` +
      `<path d="M50 4V8" stroke-width="2" fill="none"/>` +
      [12, 28, 62, 78].map((x) => `<rect x="${x}" y="56" width="10" height="12" rx="1.5" fill="#9fd3ff" stroke-width="2"/><rect x="${x}" y="74" width="10" height="10" rx="1.5" fill="#9fd3ff" stroke-width="2"/>`).join('') +
      `<path d="M42 92V68Q42 60 50 60Q58 60 58 68V92Z" fill="${BRN}"/><path d="M50 60V92" stroke-width="2"/>`
  ),
  /* astronaut */
  '🧑‍🚀': wrap(
    `<path d="M14 97V84Q14 66 38 62H62Q86 66 86 84V97Z" fill="${WHITE}"/>` +
      `<rect x="38" y="74" width="24" height="16" rx="3" fill="#dfe4ea"/>` +
      `<circle cx="44" cy="80" r="2.5" fill="${RED}" stroke-width="1.6"/><circle cx="52" cy="80" r="2.5" fill="${BLUE}" stroke-width="1.6"/><rect x="42" y="85" width="16" height="2.5" rx="1" fill="${GRAY}" stroke-width="1.2"/>` +
      `<rect x="20" y="74" width="10" height="7" rx="1.5" fill="${BLUE}" stroke-width="2"/>` +
      `<circle cx="50" cy="38" r="32" fill="${WHITE}"/>` +
      `<circle cx="50" cy="40" r="22" fill="#1b2450"/>` +
      `<circle cx="50" cy="44" r="16" fill="#e0ac80" stroke-width="2.4"/>` +
      `<path d="M35 42Q34 28 50 28Q66 28 65 42Q60 34 50 34Q40 34 35 42Z" fill="#3a2414" stroke-width="2.2"/>` +
      eyes(50, 45, 6, 2.6) + cheeks(50, 51, 10) + smile(50, 52, 4) +
      `<path d="M34 28Q42 20 54 20" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>` +
      `<rect x="14" y="32" width="6" height="14" rx="3" fill="${SILVER}" stroke-width="2"/><rect x="80" y="32" width="6" height="14" rx="3" fill="${SILVER}" stroke-width="2"/>`
  ),
  /* milky way */
  '🌌': wrap(
    `<rect x="6" y="6" width="88" height="88" rx="14" fill="#1b2450"/>` +
      `<path d="M8 82Q40 60 92 18V40Q50 70 22 92H14Q8 90 8 82Z" fill="${PUR}" opacity=".75" ${N}/>` +
      `<path d="M16 80Q46 60 90 28" fill="none" stroke="#c9b6ff" stroke-width="6" opacity=".8"/>` +
      [[22, 22, 3], [40, 30, 2], [70, 66, 3], [82, 82, 2], [30, 50, 2], [60, 44, 2.4], [52, 18, 2], [78, 52, 1.8]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${N}/>`).join('') +
      `<path d="${starD(70, 26, 7, 3)}" fill="${YEL}" stroke-width="1.6"/><path d="${starD(28, 72, 5, 2.2)}" fill="${YEL}" stroke-width="1.6"/>`
  ),
  /* singer */
  '🧑‍🎤': person({
    skin: '#b97a56', shirt: BLK,
    hair: `<path d="M30 40L24 22L36 26L38 10L48 22L56 6L60 22L72 12L70 28L80 30L70 40Q64 30 50 30Q36 30 30 40Z" fill="${PUR}"/>`,
    chest:
      `<path d="M40 62L46 80H54L60 62" fill="${DK}" stroke-width="2.4"/>` +
      `<path d="${starD(30, 78, 5, 2.2)}" fill="${YEL}" stroke-width="1.6"/>`,
    mouth: `<ellipse cx="50" cy="53" rx="4" ry="4.5" fill="#7a2b2b" stroke-width="2.2"/>`,
    front:
      `<path d="M66 64L74 90" stroke-width="9"/><path d="M66 64L74 90" stroke="${DK}" stroke-width="4"/>` +
      `<circle cx="64" cy="58" r="7.5" fill="${GRAY}"/><path d="M59 55H69M58 59H70M60 63H68" stroke="#6a6f75" stroke-width="1.4"/>` +
      hand(70, 76, '#b97a56') +
      `<path d="M84 16V30M84 16L92 14V26" fill="none" stroke-width="2.6"/><ellipse cx="82" cy="31" rx="3.5" ry="2.6" fill="${S}"/><ellipse cx="90" cy="27" rx="3.5" ry="2.6" fill="${S}"/>` +
      `<path d="M14 18V30" stroke-width="2.6"/><ellipse cx="12" cy="31" rx="3.5" ry="2.6" fill="${S}"/>`,
  }),
  /* microphone: head upper-right */
  '🎤': wrap(
    `<g transform="rotate(30 50 50)">` +
      `<path d="M42 44H58L54 92Q50 96 46 92Z" fill="${BLK}"/>` +
      `<path d="M46 50L48 86" stroke="${DK}" stroke-width="2.4"/>` +
      `<rect x="40" y="38" width="20" height="9" rx="3" fill="${SILVER}"/>` +
      `<circle cx="50" cy="24" r="17" fill="${GRAY}"/>` +
      `<path d="M36 18H64M34 26H66M38 34H62M44 9V39M56 9V39" stroke="#6a6f75" stroke-width="1.6" fill="none"/>` +
      shine(44, 17, 4, 3) + `</g>`
  ),
  /* camera with flash */
  '📸': wrap(
    camera(0.78, 18, 22) +
      `<path d="M22 4L26 16L38 12L30 22L40 30L27 29L24 40L19 29L6 30L16 22L8 12L20 16Z" fill="${YEL}" stroke-width="2.2"/>` +
      `<path d="M42 8L48 4M44 18L52 18M4 44L10 38" fill="none" stroke="${ORA}" stroke-width="3"/>`
  ),
  /* camera */
  '📷': wrap(camera()),
  /* postbox: red */
  '📮': wrap(
    `<rect x="24" y="84" width="52" height="10" rx="2" fill="#b52a2d"/>` +
      `<path d="M28 86V36Q28 14 50 14Q72 14 72 36V86Z" fill="${RED}"/>` +
      `<path d="M26 34H74" stroke-width="3"/>` + shine(36, 52, 3, 14) +
      `<g transform="rotate(-8 50 40)"><rect x="38" y="30" width="24" height="17" rx="2" fill="#fff" stroke-width="2.2"/><path d="M38 31L50 39L62 31" fill="none" stroke-width="2"/></g>` +
      `<rect x="36" y="42" width="28" height="7" rx="3" fill="${BLK}"/>` +
      `<rect x="38" y="60" width="24" height="12" rx="2" fill="#fff" stroke-width="2"/><path d="M42 66H58" stroke="${GRAY}" stroke-width="2"/>`
  ),
}
