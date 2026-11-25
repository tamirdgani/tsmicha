/* Cars world: original illustrations (viewBox 0 0 100 100). */

const K = '#2b2b3a'
const O = `stroke="${K}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"`
const T = `stroke="${K}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`
const GLASS = '#bfe6ff'

function wheel(cx: number, cy: number, r: number, hub = '#c9ced6'): string {
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#3a3a48" ${O}/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.45}" fill="${hub}" ${T}/>`
  )
}

function eye(cx: number, cy: number, r: number): string {
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" ${O}/>` +
    `<circle cx="${cx + r * 0.18}" cy="${cy + r * 0.1}" r="${r * 0.55}" fill="${K}"/>` +
    `<circle cx="${cx + r * 0.36}" cy="${cy - r * 0.18}" r="${r * 0.2}" fill="#fff"/>`
  )
}

type Cabin = 'std' | 'low' | 'dome' | 'tall' | 'box'

const CABIN: Record<Cabin, [string, string]> = {
  std: ['M22 50L31 30Q33 26 39 26H60Q66 26 69 31L77 50Z', 'M29 47L35 32H48V47ZM52 47V32H61Q64 32 66 35L71 47Z'],
  low: ['M24 50L36 35Q39 32 45 32H60Q66 32 70 37L79 50Z', 'M31 47L39 37H50V47ZM54 47V37H62Q65 37 67 40L72 47Z'],
  dome: ['M18 52Q22 22 48 22Q72 22 79 52Z', 'M27 48Q30 30 46 29V48ZM50 48V29Q65 30 71 48Z'],
  tall: ['M12 52V24Q12 18 18 18H62Q70 18 73 24L80 52Z', 'M18 46V27Q18 24 21 24H37V46ZM41 46V24H61Q65 24 67 28L74 46Z'],
  box: ['M21 50L23 27H66L74 50Z', 'M28 46L29 32H45V46ZM49 46V32H63L68 46Z'],
}

interface CarOpts {
  cabin: Cabin
  stripe?: string
  spoiler?: boolean
  rack?: boolean
  spare?: boolean
  bigWheels?: boolean
  detail?: string
  mouth?: string
}

function car(c: string, o: CarOpts): string {
  const dt = o.detail ?? '#fff'
  const [cab, win] = CABIN[o.cabin]
  const wr = o.bigWheels ? 12.5 : 10.5
  const wy = o.bigWheels ? 79 : 80
  return (
    `<ellipse cx="52" cy="91" rx="42" ry="3.2" fill="${K}" opacity=".15"/>` +
    (o.spoiler ? `<path d="M13 50V42" ${O}/><path d="M4 37H22Q24 43 19 43H6Q3 42 4 37Z" fill="${c}" ${O}/>` : '') +
    (o.rack ? `<path d="M30 ${o.cabin === 'dome' ? 22 : 26}V18M60 ${o.cabin === 'dome' ? 22 : 26}V18M24 18H66" fill="none" ${O}/><rect x="32" y="11" width="26" height="7" rx="2" fill="#ffc83d" ${T}/>` : '') +
    (o.spare ? `<circle cx="9" cy="62" r="8" fill="#3a3a48" ${O}/><circle cx="9" cy="62" r="3.5" fill="#c9ced6" ${T}/>` : '') +
    `<path d="${cab}" fill="${c}" ${O}/>` +
    `<path d="${win}" fill="${GLASS}" ${T}/>` +
    `<path d="M33 44L38 35" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>` +
    `<path d="M12 68Q10 52 20 50L66 47Q88 46 93 54Q96 62 95 71Q94 80 86 80H18Q12 80 12 68Z" fill="${c}" ${O}/>` +
    `<path d="M67 48Q63 63 65 80" fill="none" ${T}/>` +
    (o.stripe ? `<path d="M14 60H64" stroke="${o.stripe}" stroke-width="5" stroke-linecap="round"/>` : '') +
    `<path d="M18 55H50" stroke="${dt}" stroke-width="2.6" stroke-linecap="round" opacity="${o.detail ? 1 : 0.45}"/>` +
    `<path d="M46 56H51" stroke="${K}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M66 76H94" stroke="${K}" stroke-width="2.4" stroke-linecap="round" opacity=".5"/>` +
    eye(74, 59, 7.2) +
    eye(88, 60, 6.4) +
    `<path d="M73 70Q80.5 77 88 70" fill="none" stroke="${o.mouth ?? K}" stroke-width="2.8" stroke-linecap="round"/>` +
    wheel(29, wy, wr) +
    wheel(60, wy, wr)
  )
}

export const ART: Record<string, string> = {
  'car-red': car('#e5383b', { cabin: 'low', spoiler: true }),
  'car-blue': car('#1d70d8', { cabin: 'dome' }),
  'car-yellow': car('#ffc83d', { cabin: 'tall', detail: '#fff' }),
  'car-orange': car('#f77f00', { cabin: 'low', stripe: '#fff' }),
  'car-green': car('#2e9a48', { cabin: 'box', spare: true, bigWheels: true }),
  'car-purple': car('#8b5cf6', { cabin: 'std', stripe: '#ffc83d' }),
  'car-pink': car('#ff8fab', { cabin: 'dome', rack: true }),
  'car-black': car('#2f2f3a', { cabin: 'std', stripe: '#4a4a5a', spoiler: true, detail: '#5a5a6c', mouth: '#c9ced6' }),

  truck:
    `<ellipse cx="50" cy="91" rx="44" ry="3" fill="${K}" opacity=".15"/>` +
    `<rect x="6" y="24" width="56" height="50" rx="4" fill="#f4f5fb" ${O}/>` +
    `<path d="M14 34H54M14 44H54M14 54H54M14 64H54" stroke="#c9ced6" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M62 38H80Q86 38 89 46L94 58V74Q94 78 90 78H62Z" fill="#1d70d8" ${O}/>` +
    `<path d="M68 44H79Q82 44 84 48L87 56H68Z" fill="${GLASS}" ${T}/>` +
    `<rect x="4" y="72" width="90" height="8" rx="3" fill="#9aa0a6" ${O}/>` +
    `<rect x="88" y="62" width="6" height="6" rx="2" fill="#ffc83d" ${T}/>` +
    wheel(20, 80, 9) + wheel(42, 80, 9) + wheel(78, 80, 9),

  bus:
    `<ellipse cx="50" cy="90" rx="44" ry="3" fill="${K}" opacity=".15"/>` +
    `<path d="M6 30Q6 22 14 22H82Q92 22 94 34L95 74Q95 80 89 80H11Q6 80 6 74Z" fill="#ffc83d" ${O}/>` +
    `<path d="M6 60H95" stroke="${K}" stroke-width="2.4"/><path d="M8 66H93" stroke="#f77f00" stroke-width="4"/>` +
    `<rect x="12" y="30" width="14" height="16" rx="3" fill="${GLASS}" ${T}/><rect x="30" y="30" width="14" height="16" rx="3" fill="${GLASS}" ${T}/>` +
    `<rect x="48" y="30" width="14" height="16" rx="3" fill="${GLASS}" ${T}/>` +
    `<rect x="67" y="30" width="12" height="44" rx="2" fill="${GLASS}" ${T}/><path d="M73 30V74" ${T}/>` +
    `<path d="M83 30H88Q91 30 92 34L93 46H83Z" fill="${GLASS}" ${T}/>` +
    `<circle cx="90" cy="70" r="3" fill="#fff" ${T}/>` +
    wheel(24, 80, 9) + wheel(80, 80, 9),

  motorbike:
    `<ellipse cx="50" cy="90" rx="42" ry="3" fill="${K}" opacity=".15"/>` +
    `<path d="M24 74L42 52H62L76 74" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M66 40L72 30M66 30H78" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M70 36L78 74" fill="none" stroke="#9aa0a6" stroke-width="5" stroke-linecap="round"/>` +
    wheel(22, 74, 15) + wheel(78, 74, 15) +
    `<path d="M36 52Q40 40 56 40H66Q72 40 72 46L68 56H42Z" fill="#e5383b" ${O}/>` +
    `<path d="M22 46Q24 40 32 40H44Q46 46 42 48H24Z" fill="${K}" ${O}/>` +
    `<path d="M44 58H62L58 66H46Z" fill="#9aa0a6" ${O}/>` +
    `<path d="M14 58Q20 54 32 58L36 62H16Z" fill="#c9ced6" ${O}/>` +
    `<circle cx="76" cy="46" r="5" fill="#ffc83d" ${O}/>` +
    `<path d="M48 45H62" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>`,

  tractor:
    `<ellipse cx="50" cy="91" rx="42" ry="3" fill="${K}" opacity=".15"/>` +
    `<rect x="70" y="14" width="6" height="30" rx="2" fill="#9aa0a6" ${O}/>` +
    `<path d="M14 18H50V50H14Z" fill="#e5383b" ${O}/>` +
    `<path d="M19 23H45V44H19Z" fill="${GLASS}" ${T}/><path d="M24 40L32 28" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M10 14H54" stroke="${K}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M10 50H50V44H86Q92 44 92 50V70H10Z" fill="#2e9a48" ${O}/>` +
    `<path d="M58 52H86M58 58H86" stroke="#1f6e33" stroke-width="2.6" stroke-linecap="round"/>` +
    `<circle cx="28" cy="68" r="22" fill="#3a3a48" ${O}/><circle cx="28" cy="68" r="11" fill="#ffc83d" ${O}/><circle cx="28" cy="68" r="3.5" fill="${K}"/>` +
    `<circle cx="78" cy="78" r="12" fill="#3a3a48" ${O}/><circle cx="78" cy="78" r="5.5" fill="#ffc83d" ${O}/>`,

  firetruck:
    `<ellipse cx="50" cy="91" rx="44" ry="3" fill="${K}" opacity=".15"/>` +
    `<path d="M10 24L66 12" stroke="${K}" stroke-width="9" stroke-linecap="round"/><path d="M10 24L66 12" stroke="#c9ced6" stroke-width="4.4" stroke-linecap="round"/>` +
    `<path d="M18 22L17 18M26 20L25 16M34 18L33 14M42 17L41 13M50 15L49 11M58 13L57 9" stroke="${K}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M40 30L14 24" stroke="${K}" stroke-width="3"/>` +
    `<rect x="6" y="34" width="60" height="40" rx="4" fill="#e5383b" ${O}/>` +
    `<path d="M66 34H80Q86 34 89 42L94 56V74H66Z" fill="#e5383b" ${O}/>` +
    `<path d="M70 40H79Q82 40 84 44L87 54H70Z" fill="${GLASS}" ${T}/>` +
    `<rect x="70" y="26" width="10" height="8" rx="3" fill="#1d70d8" ${O}/>` +
    `<rect x="12" y="42" width="20" height="14" rx="2" fill="#c9ced6" ${T}/><rect x="38" y="42" width="22" height="14" rx="2" fill="#c9ced6" ${T}/>` +
    `<path d="M6 64H94" stroke="#fff" stroke-width="3.5"/>` +
    `<rect x="4" y="72" width="91" height="7" rx="3" fill="#9aa0a6" ${O}/>` +
    wheel(20, 80, 9) + wheel(44, 80, 9) + wheel(80, 80, 9),

  ambulance:
    `<ellipse cx="50" cy="91" rx="44" ry="3" fill="${K}" opacity=".15"/>` +
    `<rect x="26" y="16" width="14" height="8" rx="3" fill="#1d70d8" ${O}/><rect x="44" y="16" width="14" height="8" rx="3" fill="#e5383b" ${O}/>` +
    `<path d="M6 28Q6 24 10 24H66V78H10Q6 78 6 74Z" fill="#f4f5fb" ${O}/>` +
    `<path d="M66 36H80Q86 36 89 44L94 56V74Q94 78 90 78H66Z" fill="#f4f5fb" ${O}/>` +
    `<path d="M70 42H79Q82 42 84 46L87 55H70Z" fill="${GLASS}" ${T}/>` +
    `<path d="M6 64H94" stroke="#e5383b" stroke-width="5"/>` +
    `<path d="M30 34H40V42H48V52H40V60H30V52H22V42H30Z" fill="#e5383b" ${T}/>` +
    `<circle cx="90" cy="70" r="3" fill="#ffc83d" ${T}/>` +
    wheel(22, 79, 9.5) + wheel(76, 79, 9.5),

  helicopter:
    `<path d="M12 18H86" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M12 18H86" stroke="#9aa0a6" stroke-width="2.6" stroke-linecap="round"/>` +
    `<path d="M50 18V30" ${O}/><rect x="45" y="16" width="10" height="5" rx="2" fill="#3a3a48" ${T}/>` +
    `<path d="M36 54L6 46L4 54L34 66Z" fill="#ffc83d" ${O}/>` +
    `<circle cx="8" cy="46" r="9" fill="none" stroke="${K}" stroke-width="2.2" stroke-dasharray="5 4"/><circle cx="8" cy="46" r="2.6" fill="${K}"/>` +
    `<path d="M38 80L34 88M68 80L72 88M24 88H84" fill="none" ${O}/>` +
    `<path d="M30 56Q30 30 58 30Q86 30 88 58Q88 80 62 80H44Q30 80 30 56Z" fill="#ffc83d" ${O}/>` +
    `<path d="M58 36Q80 36 82 56H60Z" fill="${GLASS}" ${T}/><path d="M64 42Q72 42 76 50" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none"/>` +
    `<path d="M34 64H84" stroke="#f77f00" stroke-width="4" stroke-linecap="round"/>`,

  train:
    `<ellipse cx="50" cy="91" rx="44" ry="3" fill="${K}" opacity=".15"/>` +
    `<path d="M70 32L66 18H82L78 32Z" fill="#3a3a48" ${O}/>` +
    `<path d="M74 14Q66 8 72 4Q80 2 82 8Q90 6 88 14" fill="#f4f5fb" ${T}/>` +
    `<rect x="10" y="22" width="30" height="50" rx="3" fill="#1d70d8" ${O}/>` +
    `<path d="M6 22H44" stroke="${K}" stroke-width="5" stroke-linecap="round"/>` +
    `<rect x="16" y="30" width="18" height="16" rx="3" fill="${GLASS}" ${T}/>` +
    `<path d="M40 40H82Q90 40 90 48V72H40Z" fill="#e5383b" ${O}/>` +
    `<path d="M56 40V72" ${T}/><rect x="58" y="34" width="8" height="6" rx="2" fill="#ffc83d" ${T}/>` +
    `<circle cx="91" cy="54" r="4" fill="#ffc83d" ${O}/>` +
    `<path d="M90 70L98 84H86Z" fill="#9aa0a6" ${O}/>` +
    `<rect x="6" y="70" width="86" height="6" rx="2" fill="#3a3a48" ${O}/>` +
    `<path d="M20 82H76" stroke="#9aa0a6" stroke-width="3"/>` +
    wheel(22, 80, 10, '#e5383b') + wheel(50, 82, 7.5, '#e5383b') + wheel(72, 82, 7.5, '#e5383b'),

  bicycle:
    `<ellipse cx="50" cy="91" rx="42" ry="3" fill="${K}" opacity=".15"/>` +
    `<circle cx="24" cy="68" r="17" fill="none" stroke="${K}" stroke-width="5"/><circle cx="24" cy="68" r="12" fill="none" stroke="#c9ced6" stroke-width="1.6"/>` +
    `<circle cx="76" cy="68" r="17" fill="none" stroke="${K}" stroke-width="5"/><circle cx="76" cy="68" r="12" fill="none" stroke="#c9ced6" stroke-width="1.6"/>` +
    `<path d="M24 68L40 42H68M46 68L36 32M46 68L68 42M24 68H46M68 42L76 68M68 42L64 28" fill="none" stroke="${K}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M24 68L40 42H68M46 68L36 32M46 68L68 42M24 68H46M68 42L76 68M68 42L64 28" fill="none" stroke="#2e9a48" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M28 30Q34 26 44 30Q40 34 30 33Z" fill="${K}" ${T}/>` +
    `<path d="M58 28H70Q74 28 74 24" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>` +
    `<circle cx="46" cy="68" r="5" fill="#9aa0a6" ${T}/><circle cx="24" cy="68" r="2.5" fill="${K}"/><circle cx="76" cy="68" r="2.5" fill="${K}"/>`,

  trafficlight:
    `<rect x="46" y="72" width="8" height="20" fill="#9aa0a6" ${O}/>` +
    `<rect x="34" y="88" width="32" height="6" rx="2" fill="#3a3a48" ${O}/>` +
    `<path d="M32 16L24 22M32 40L24 46M32 64L24 70M68 16L76 22M68 40L76 46M68 64L76 70" stroke="${K}" stroke-width="3" stroke-linecap="round"/>` +
    `<rect x="31" y="6" width="38" height="70" rx="10" fill="#3a3a48" ${O}/>` +
    `<circle cx="50" cy="20" r="9" fill="#e5383b" ${O}/><circle cx="50" cy="41" r="9" fill="#ffc83d" ${O}/><circle cx="50" cy="62" r="9" fill="#2e9a48" ${O}/>` +
    `<circle cx="47" cy="17" r="2.6" fill="#fff" opacity=".7"/><circle cx="47" cy="38" r="2.6" fill="#fff" opacity=".7"/><circle cx="47" cy="59" r="2.6" fill="#fff" opacity=".7"/>`,

  badge:
    `<circle cx="50" cy="50" r="44" fill="#1d70d8" ${O}/>` +
    `<circle cx="50" cy="50" r="37" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 5" opacity=".7"/>` +
    `<g transform="translate(13 16) scale(.74)">${car('#e5383b', { cabin: 'std' }).replace(/<ellipse[^>]*opacity="\.15"\/>/, '')}</g>`,

  pattern:
    `<g fill="none" stroke="#000" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">` +
    `<path d="M8 22Q8 16 14 16L18 10H28L32 16Q36 16 36 22Z"/><circle cx="15" cy="23" r="3"/><circle cx="29" cy="23" r="3"/>` +
    `<rect x="66" y="8" width="12" height="24" rx="4"/><circle cx="72" cy="14" r="2.4"/><circle cx="72" cy="20" r="2.4"/><circle cx="72" cy="26" r="2.4"/>` +
    `<circle cx="28" cy="70" r="9"/><circle cx="28" cy="70" r="3"/>` +
    `<path d="M66 84V60Q74 56 80 60Q86 64 92 60V72Q86 76 80 72Q74 68 66 72"/>` +
    `<path d="M44 46H52M86 48H94M4 92H12M44 92H52"/></g>`,
}
