/* Common drawings, batch 4: one per emoji the lessons use (viewBox 0 0 100 100). */

const S = '#2b2b3a'
const N = 'stroke="none"'
const R = '#e5383b', B = '#1d70d8', Y = '#ffc83d', G = '#2e9a48', O = '#f77f00'
const P = '#8b5cf6', K = '#ff8fab', BR = '#8d5524', GR = '#9aa0a6', BK = '#2f2f3a'
/** Wraps a drawing in the shared outline style (children inherit the stroke). */
const wrap = (s: string) =>
  `<g stroke="${S}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round">${s}</g>`
const r1 = (n: number) => Math.round(n * 10) / 10
/** Shiny cartoon eye. */
const eye = (x: number, y: number, r = 4) =>
  `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r1(r * 1.15)}" fill="${S}" ${N}/>` +
  `<circle cx="${r1(x + r * 0.35)}" cy="${r1(y - r * 0.45)}" r="${r1(r * 0.4)}" fill="#fff" ${N}/>`
/** Thick outlined tube. */
const tube = (d: string, c: string, w = 7) =>
  `<path d="${d}" fill="none" stroke-width="${w + 5.6}"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}"/>`
/** Draws shapes so their union gets one shared outline (outlines first, fills on top). */
const unite = (...els: string[]) =>
  els.map((e) => e.replace('/>', ' stroke-width="5.6"/>')).join('') + els.map((e) => e.replace('/>', ` ${N}/>`)).join('')
const C = (x: number, y: number, r: number, c: string) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`
/** Soft white highlight. */
const hi = (x: number, y: number, rx: number, ry: number, rot = 0) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".45" ${N}${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}/>`
const smile = (cx: number, y: number, w: number) =>
  `<path d="M${cx - w} ${y}Q${cx} ${r1(y + w * 0.9)} ${cx + w} ${y}" fill="none" stroke-width="2.5"/>`

/** Glove pointing up, thumb to the right; spans x 10..48. */
const glove = (c: string, cuff: string) =>
  unite(
    `<rect x="12" y="20" width="9" height="34" rx="4.5" fill="${c}"/>`,
    `<rect x="20.5" y="12" width="9" height="40" rx="4.5" fill="${c}"/>`,
    `<rect x="29" y="14" width="9" height="40" rx="4.5" fill="${c}"/>`,
    `<rect x="37.5" y="22" width="9" height="32" rx="4.5" fill="${c}"/>`,
    `<rect x="40" y="40" width="9" height="22" rx="4.5" fill="${c}" transform="rotate(35 44 52)"/>`,
    `<rect x="12" y="38" width="35" height="36" rx="10" fill="${c}"/>`,
  ) +
  `<path d="M21 24V44M29.5 18V44M38 26V44" stroke-width="1.6" opacity=".5" fill="none"/>` +
  `<rect x="13" y="70" width="33" height="18" rx="4" fill="${cuff}"/>` +
  `<path d="M20 72V86M26 72V86M32 72V86M38 72V86" stroke-width="1.6" opacity=".5"/>`

/** Flip-flop seen from above. */
const flip = (c: string, strap: string) =>
  `<path d="M30 12C44 10 50 22 48 36C46 48 52 60 52 74C52 88 42 94 32 92C20 90 18 78 20 64C22 52 18 44 18 32C18 18 22 13 30 12Z" fill="${c}"/>` +
  `<path d="M28 18C38 16 42 24 41 34" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/>` +
  tube('M20 50Q24 32 33 26Q42 32 47 50', strap, 4) + C(33, 26, 3, strap)

/** Folding fan: pleated sector around a pivot. */
const fan = () => {
  const cx = 50, cy = 84, r0 = 14, r = 44, n = 10
  let s = ''
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * (1.08 + (0.84 * i) / n), a1 = Math.PI * (1.08 + (0.84 * (i + 1)) / n)
    const p = (a: number, rr: number) => `${r1(cx + rr * Math.cos(a))} ${r1(cy + rr * Math.sin(a))}`
    s += `<path d="M${p(a0, r0)}L${p(a0, r)}A${r} ${r} 0 0 1 ${p(a1, r)}L${p(a1, r0)}Z" fill="${i % 2 ? K : '#ffb3c6'}" stroke-width="2"/>`
  }
  const st = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const a = Math.PI * (1.08 + 0.84 * t)
    return `M${cx} ${cy}L${r1(cx + r0 * Math.cos(a))} ${r1(cy + r0 * Math.sin(a))}`
  }).join('')
  return wrap(
    `<path d="M${r1(cx + r * Math.cos(Math.PI * 1.08))} ${r1(cy + r * Math.sin(Math.PI * 1.08))}A${r} ${r} 0 0 1 ${r1(cx + r * Math.cos(Math.PI * 1.92))} ${r1(cy + r * Math.sin(Math.PI * 1.92))}L${cx} ${cy}Z" fill="${K}" stroke-width="5.6"/>` +
    s + `<path d="M50 56C42 44 30 46 32 54C34 60 44 62 50 70C56 62 66 60 68 54C70 46 58 44 50 56Z" fill="${R}" opacity=".75" stroke-width="2"/>` +
    `<path d="${st}" stroke="${BR}" stroke-width="4"/><path d="${st}" fill="none" stroke-width="1"/>` + C(cx, cy, 4.5, '#ffc83d'),
  )
}

export const ART: Record<string, string> = {
  '✉': wrap(
    `<rect x="10" y="24" width="80" height="54" rx="6" fill="#fff"/>` +
    `<path d="M12 76L40 52M88 76L60 52" fill="none" stroke-width="2.5"/>` +
    `<path d="M12 27L50 56L88 27" fill="#f1f1f6"/>` +
    C(50, 56, 6, R) + `<path d="M50 59l-3-3a2 2 0 0 1 3-2.5a2 2 0 0 1 3 2.5z" fill="#fff" ${N}/>`,
  ),
  '🎣': wrap(
    tube('M14 92L70 10', BR, 5) + `<circle cx="27" cy="73" r="7" fill="${GR}"/>` + C(27, 73, 2, BK) +
    `<path d="M70 10Q78 14 77 40" fill="none" stroke-width="1.6"/>` +
    `<path d="M76 80L64 96H88Z" fill="${B}"/>` +
    `<ellipse cx="76" cy="62" rx="14" ry="22" fill="${B}"/>` +
    `<path d="M66 70Q76 77 86 70" fill="none" stroke-width="2" opacity=".6"/>` + hi(70, 56, 3.5, 8) +
    eye(81, 52, 3) + `<path d="M72 42Q77 40 81 43" fill="none" stroke-width="2.4"/>`,
  ),
  '🪝': wrap(
    tube('M57 30V58Q57 84 39 84Q23 84 23 64', GR, 8) +
    `<path d="M15 68L23 48L31 68Z" fill="${GR}"/>` +
    `<path d="M50 14a7 8 0 1 0 14 0a7 8 0 1 0 -14 0" fill="none" stroke-width="10"/>` +
    `<path d="M50 14a7 8 0 1 0 14 0a7 8 0 1 0 -14 0" fill="none" stroke="${GR}" stroke-width="4.5"/>` +
    `<path d="M61 40V58" stroke="#fff" stroke-width="2" opacity=".6"/>`,
  ),
  '🦷': wrap(
    `<path d="M26 24Q26 10 38 10Q44 10 50 15Q56 10 62 10Q74 10 74 24Q74 42 68 52L64 86Q62 92 58 86L54 66Q50 58 46 66L42 86Q38 92 36 86L32 52Q26 42 26 24Z" fill="#fff"/>` +
    hi(34, 24, 3, 7, 15) + eye(42, 34, 3.4) + eye(58, 34, 3.4) + smile(50, 42, 5) +
    `<ellipse cx="36" cy="43" rx="4" ry="2.4" fill="#ff6b8b" opacity=".45" ${N}/><ellipse cx="64" cy="43" rx="4" ry="2.4" fill="#ff6b8b" opacity=".45" ${N}/>`,
  ),
  '🔒': wrap(
    tube('M34 48V32Q34 14 50 14Q66 14 66 32V48', GR, 8) +
    `<rect x="20" y="44" width="60" height="46" rx="9" fill="${Y}"/>` +
    `<rect x="26" y="49" width="48" height="5" rx="2.5" fill="#fff" opacity=".45" ${N}/>` +
    C(50, 64, 6, S) + `<path d="M47.5 66H52.5L54 80H46Z" fill="${S}"/>`,
  ),
  '📓': wrap(
    `<rect x="20" y="8" width="62" height="84" rx="5" fill="#fff"/>` +
    `<rect x="16" y="8" width="62" height="84" rx="5" fill="${BK}"/>` +
    `<path d="M28 9V91" stroke="#4a4a5a" stroke-width="6"/>` +
    `<path d="M40 70l3 2M60 22l3-2M66 78l-2 3M38 30l-3 1M68 50l2 2M48 84l3-1" stroke="#7a7a8a" stroke-width="2"/>` +
    `<rect x="38" y="34" width="32" height="20" rx="3" fill="#fff"/>` +
    `<path d="M43 41H65M43 47H59" stroke-width="2"/>`,
  ),
  '🥣': wrap(
    tube('M60 50L82 12', GR, 5) + `<ellipse cx="83" cy="10" rx="6" ry="8" fill="${GR}" transform="rotate(30 83 10)"/>` +
    `<rect x="38" y="80" width="24" height="9" rx="3" fill="${B}"/>` +
    `<path d="M10 50H90Q88 84 50 86Q12 84 10 50Z" fill="${B}"/>` +
    `<ellipse cx="50" cy="50" rx="40" ry="9" fill="#fff6dc"/>` +
    `<circle cx="36" cy="49" r="3.5" fill="#f3b24a" stroke-width="1.6"/><circle cx="46" cy="52" r="3.5" fill="#f3b24a" stroke-width="1.6"/><circle cx="68" cy="49" r="3.5" fill="#f3b24a" stroke-width="1.6"/><circle cx="28" cy="52" r="3" fill="#f3b24a" stroke-width="1.6"/>` +
    `<path d="M18 62Q24 76 40 80" fill="none" stroke="#fff" stroke-width="3" opacity=".45"/>`,
  ),
  '🥅': wrap(
    `<rect x="4" y="82" width="92" height="10" rx="4" fill="${G}"/>` +
    `<path d="M18 26L26 36V84M82 26L74 36V84M26 36H74" fill="none" stroke="${GR}" stroke-width="2"/>` +
    `<path d="M14 34H86M14 44H86M14 54H86M14 64H86M14 74H86M24 24V84M34 24V84M44 24V84M54 24V84M64 24V84M76 24V84" stroke="#b8bec4" stroke-width="1.6"/>` +
    tube('M14 86V22H86V86', '#fff', 6),
  ),
  '🎂': wrap(
    `<ellipse cx="50" cy="86" rx="42" ry="7" fill="#fff"/>` +
    `<rect x="18" y="48" width="64" height="36" rx="5" fill="#fff3e0"/>` +
    `<path d="M18 68H82" stroke="${K}" stroke-width="5"/>` +
    `<path d="M18 55Q18 46 26 46H74Q82 46 82 55V58Q78 64 74 58Q70 52 64 60Q58 68 54 58Q50 52 44 60Q38 66 34 58Q30 52 26 60Q20 64 18 58Z" fill="${K}"/>` +
    `<rect x="30" y="28" width="6" height="18" rx="2" fill="${B}"/><rect x="47" y="24" width="6" height="22" rx="2" fill="${Y}"/><rect x="64" y="28" width="6" height="18" rx="2" fill="${G}"/>` +
    [33, 50, 67].map((x, i) => `<path d="M${x} ${i === 1 ? 10 : 14}Q${x + 5} ${i === 1 ? 18 : 22} ${x} ${i === 1 ? 22 : 26}Q${x - 5} ${i === 1 ? 18 : 22} ${x} ${i === 1 ? 10 : 14}Z" fill="${O}" stroke-width="2"/>`).join(''),
  ),
  '🪁': wrap(
    `<path d="M50 78Q46 86 54 88Q62 90 60 96" fill="none" stroke-width="2"/>` +
    `<path d="M50 84l-6-3v6zM50 84l6-3v6z" fill="${Y}" stroke-width="1.8"/><path d="M58 92l-6-2v6zM58 92l6-3v6z" fill="${R}" stroke-width="1.8"/>` +
    `<path d="M50 6L82 40L50 80L18 40Z" fill="${B}" stroke-width="5.6"/>` +
    `<path d="M50 6L82 40H50Z" fill="${R}" ${N}/><path d="M50 6L18 40H50Z" fill="${Y}" ${N}/>` +
    `<path d="M18 40L50 80V40Z" fill="${G}" ${N}/>` +
    `<path d="M50 6V80M18 40H82" stroke-width="2.4"/>`,
  ),
  '🌬': wrap(
    unite(C(30, 46, 20, '#dfe8f2'), C(46, 32, 16, '#dfe8f2'), C(46, 62, 15, '#dfe8f2'), C(18, 60, 11, '#dfe8f2'), C(18, 32, 11, '#dfe8f2')) +
    `<path d="M26 36Q32 32 38 36" fill="none" stroke-width="2.5"/>` + eye(34, 44, 3) +
    `<ellipse cx="46" cy="54" rx="6" ry="4" fill="#ff8fab" opacity=".5" ${N}/>` +
    `<ellipse cx="54" cy="48" rx="5" ry="6" fill="#ff8fab"/><ellipse cx="55" cy="48" rx="2" ry="3" fill="${S}" ${N}/>` +
    `<path d="M62 40H80Q88 40 88 34Q88 28 82 30M62 50H90M62 60H78Q86 60 86 67Q86 72 80 70" fill="none" stroke="#8fb7e0" stroke-width="4"/>`,
  ),
  '🛤': wrap(
    [[92, 14], [74, 12], [58, 10], [44, 8], [32, 6.5], [22, 5]].map(([y, h]) => {
      const t = (92 - y) / 84, w = 40 - 26 * t
      return `<rect x="${r1(50 - w)}" y="${r1(y - h / 2)}" width="${r1(w * 2)}" height="${r1(h * 0.7)}" rx="1.5" fill="${BR}" stroke-width="2"/>`
    }).join('') +
    `<path d="M28 94L44 14M72 94L56 14" stroke-width="8"/><path d="M28 94L44 14M72 94L56 14" stroke="#c4c9ce" stroke-width="4"/>`,
  ),
  '🧈': wrap(
    `<ellipse cx="50" cy="72" rx="44" ry="15" fill="#fff"/>` +
    `<path d="M22 44L36 32H80L66 44Z" fill="#ffe08a"/>` +
    `<path d="M66 44L80 32V56L66 68Z" fill="#e8a92a"/>` +
    `<rect x="22" y="44" width="44" height="24" fill="${Y}"/>` +
    `<path d="M28 50H44" stroke="#fff" stroke-width="3" opacity=".6"/>`,
  ),
  '🧸': wrap(
    `<circle cx="30" cy="20" r="9" fill="${BR}"/><circle cx="70" cy="20" r="9" fill="${BR}"/>` +
    `<circle cx="30" cy="20" r="4" fill="#d9a066" ${N}/><circle cx="70" cy="20" r="4" fill="#d9a066" ${N}/>` +
    `<ellipse cx="34" cy="86" rx="11" ry="8" fill="${BR}"/><ellipse cx="66" cy="86" rx="11" ry="8" fill="${BR}"/>` +
    `<ellipse cx="34" cy="87" rx="5.5" ry="4.5" fill="#d9a066" ${N}/><ellipse cx="66" cy="87" rx="5.5" ry="4.5" fill="#d9a066" ${N}/>` +
    `<ellipse cx="50" cy="70" rx="21" ry="19" fill="${BR}"/><ellipse cx="50" cy="73" rx="12" ry="11" fill="#d9a066" ${N}/>` +
    `<ellipse cx="26" cy="64" rx="7" ry="11" fill="${BR}" transform="rotate(35 26 64)"/><ellipse cx="74" cy="64" rx="7" ry="11" fill="${BR}" transform="rotate(-35 74 64)"/>` +
    `<circle cx="50" cy="36" r="22" fill="${BR}"/>` +
    `<ellipse cx="50" cy="44" rx="10" ry="8" fill="#d9a066"/>` +
    eye(41, 32, 3.4) + eye(59, 32, 3.4) +
    `<ellipse cx="50" cy="40" rx="4" ry="3" fill="${S}"/><path d="M50 43V46M46 47Q50 50 54 47" fill="none" stroke-width="2.2"/>`,
  ),
  '🎨': wrap(
    tube('M50 66L88 12', BR, 5) +
    `<path d="M50 12C76 12 92 28 90 50C88 68 74 70 66 66C58 62 52 70 56 78C60 88 50 92 40 88C20 82 8 66 10 46C12 26 28 12 50 12Z" fill="#e0b57a"/>` +
    `<circle cx="38" cy="68" r="6" fill="#fff"/>` +
    C(28, 38, 6.5, R) + C(46, 26, 6.5, Y) + C(66, 26, 6.5, G) + C(78, 44, 6.5, B) + C(24, 56, 6, P) +
    `<path d="M60 52L66 46L71 49L64 56Z" fill="${GR}"/><path d="M64 56Q56 60 54 66Q62 64 64 56Z" fill="${R}"/>`,
  ),
  '🔩': wrap(
    `<rect x="40" y="28" width="20" height="62" rx="3" fill="${GR}"/>` +
    `<path d="M40 36L60 32M40 44L60 40M40 76L60 72M40 84L60 80" fill="none" stroke-width="2"/>` +
    `<rect x="22" y="52" width="56" height="18" rx="3" fill="#7d848b"/><path d="M38 52V70M62 52V70" stroke-width="2"/>` +
    `<rect x="24" y="12" width="52" height="18" rx="4" fill="${GR}"/><path d="M40 12V30M60 12V30" stroke-width="2"/>` +
    `<rect x="27" y="15" width="10" height="4" rx="2" fill="#fff" opacity=".5" ${N}/>`,
  ),
  '⛽': wrap(
    tube('M66 42Q86 36 84 58V80Q84 88 76 86', BK, 4) +
    `<path d="M70 24L82 22L84 34L76 38Z" fill="${GR}"/>` +
    `<rect x="12" y="84" width="62" height="9" rx="3" fill="#4a4a5a"/>` +
    `<rect x="18" y="14" width="50" height="72" rx="7" fill="${R}"/>` +
    `<rect x="26" y="22" width="34" height="22" rx="3" fill="#fff"/>` +
    `<path d="M32 30H46M32 37H52" stroke="${GR}" stroke-width="2.4"/>` +
    `<rect x="30" y="54" width="26" height="18" rx="3" fill="#fff" opacity=".35" ${N}/>` +
    `<path d="M43 56Q48 63 48 66A5 5 0 0 1 38 66Q38 63 43 56Z" fill="${Y}" stroke-width="2"/>`,
  ),
  '🧽': wrap(
    `<path d="M10 40L24 28H90L76 40Z" fill="#ffe08a"/>` +
    `<path d="M76 40L90 28V60L76 72Z" fill="#e8a92a"/>` +
    `<rect x="10" y="40" width="66" height="32" rx="3" fill="${Y}"/>` +
    `<g fill="#e8a92a" ${N}><ellipse cx="22" cy="50" rx="4" ry="3"/><ellipse cx="38" cy="60" rx="5" ry="3.5"/><ellipse cx="56" cy="48" rx="3.5" ry="3"/><ellipse cx="64" cy="64" rx="4" ry="3"/><ellipse cx="26" cy="64" rx="2.5" ry="2"/><ellipse cx="46" cy="48" rx="2.5" ry="2"/><ellipse cx="84" cy="44" rx="2" ry="3"/><ellipse cx="56" cy="34" rx="4" ry="2"/><ellipse cx="34" cy="35" rx="3" ry="1.6"/></g>`,
  ),
  '🧹': wrap(
    `<g transform="rotate(25 50 50)">` +
    `<rect x="46" y="2" width="8" height="50" rx="4" fill="${BR}"/>` +
    `<path d="M38 58H62L78 94Q50 100 22 94Z" fill="#e8b64a"/>` +
    `<path d="M44 62L36 94M50 62V96M56 62L64 94" fill="none" stroke="#b8862a" stroke-width="2.2"/>` +
    `<rect x="36" y="48" width="28" height="12" rx="4" fill="${R}"/></g>`,
  ),
  '🪮': wrap(
    `<rect x="18" y="42" width="64" height="14" rx="5" fill="${BK}"/>` +
    [24, 34, 44, 56, 66, 76].map((x) => `<rect x="${x - 3}" y="54" width="6" height="38" rx="3" fill="${BK}"/>`).join('') +
    `<rect x="38" y="6" width="24" height="38" rx="10" fill="${BK}"/>` +
    `<rect x="43" y="11" width="5" height="26" rx="2.5" fill="#4a4a5a" ${N}/><rect x="22" y="45" width="40" height="4" rx="2" fill="#4a4a5a" ${N}/>`,
  ),
  '🧻': wrap(
    `<path d="M24 24V78A23 9 0 0 0 70 78V24Z" fill="#fff"/>` +
    `<path d="M24 34Q26 40 30 42" fill="none" stroke="#d8d8e2" stroke-width="2"/>` +
    `<ellipse cx="47" cy="24" rx="23" ry="9" fill="#f2f2f7"/>` +
    `<ellipse cx="47" cy="24" rx="8" ry="3.5" fill="#c8a57a"/>` +
    `<path d="M54 56H80V92L75 88L70 92L65 88L60 92L54 88Z" fill="#fff"/>` +
    `<path d="M57 72H77" stroke="#c4c4d0" stroke-width="2" stroke-dasharray="2 3"/>`,
  ),
  '📱': wrap(
    `<rect x="26" y="6" width="48" height="88" rx="10" fill="${BK}"/>` +
    `<rect x="31" y="13" width="38" height="70" rx="5" fill="#7cc4f5"/>` +
    `<rect x="44" y="15" width="12" height="4" rx="2" fill="${BK}" ${N}/>` +
    `<g ${N}><rect x="35" y="26" width="8" height="8" rx="2" fill="${R}"/><rect x="46" y="26" width="8" height="8" rx="2" fill="${Y}"/><rect x="57" y="26" width="8" height="8" rx="2" fill="${G}"/>` +
    `<rect x="35" y="38" width="8" height="8" rx="2" fill="${P}"/><rect x="46" y="38" width="8" height="8" rx="2" fill="${O}"/><rect x="57" y="38" width="8" height="8" rx="2" fill="#fff"/></g>` +
    `<rect x="42" y="87" width="16" height="3" rx="1.5" fill="#6a6a7a" ${N}/>`,
  ),
  '🥤': wrap(
    tube('M54 28L60 8H74', '#fff', 5) + `<path d="M56.5 20L58.5 13" stroke="${R}" stroke-width="3"/>` +
    `<path d="M24 32H76L68 92H32Z" fill="${R}"/>` +
    `<path d="M27 52H73L71 66H29Z" fill="#fff"/>` +
    `<rect x="19" y="24" width="62" height="11" rx="5" fill="#fff"/>` +
    `<path d="M32 40L36 84" stroke="#fff" stroke-width="3" opacity=".4"/>`,
  ),
  '💡': wrap(
    `<path d="M36 64Q20 54 20 38A30 30 0 0 1 80 38Q80 54 64 64V70H36Z" fill="${Y}"/>` +
    `<path d="M42 66V50L38 42M58 66V50L62 42M38 42Q44 48 50 42Q56 48 62 42" fill="none" stroke="#c98a1a" stroke-width="2.2"/>` +
    hi(34, 30, 5, 9, 30) +
    `<rect x="35" y="69" width="30" height="8" rx="3" fill="${GR}"/><rect x="37" y="77" width="26" height="8" rx="3" fill="${GR}"/>` +
    `<path d="M43 85H57Q55 93 50 93Q45 93 43 85Z" fill="#4a4a5a"/>` +
    `<path d="M8 20L14 23M92 20L86 23M4 42H10M90 42H96" stroke="${O}" stroke-width="3.2"/>`,
  ),
  '🧼': wrap(
    `<path d="M14 54Q14 46 24 44L70 40Q82 40 84 48V62Q84 72 72 74L26 78Q14 78 14 68Z" fill="#5fb0ec"/>` +
    `<path d="M14 54Q14 46 24 44L70 40Q82 40 84 48Q84 56 72 56L26 60Q14 60 14 54Z" fill="#a8d6f7"/>` +
    `<path d="M34 50L60 48" stroke="#fff" stroke-width="3" opacity=".7"/>` +
    `<g fill="#fff" stroke-width="2"><circle cx="30" cy="32" r="7"/><circle cx="46" cy="22" r="9"/><circle cx="64" cy="28" r="6"/><circle cx="56" cy="12" r="4"/><circle cx="76" cy="18" r="4"/></g>` +
    `<path d="M43 18Q45 16 48 17M27 30Q28 28 31 28" fill="none" stroke="#5fb0ec" stroke-width="2"/>`,
  ),
  '👀': wrap(
    `<ellipse cx="31" cy="50" rx="17" ry="25" fill="#fff"/><ellipse cx="69" cy="50" rx="17" ry="25" fill="#fff"/>` +
    `<ellipse cx="24" cy="54" rx="9" ry="12" fill="${S}" ${N}/><ellipse cx="62" cy="54" rx="9" ry="12" fill="${S}" ${N}/>` +
    `<circle cx="21" cy="48" r="3.5" fill="#fff" ${N}/><circle cx="59" cy="48" r="3.5" fill="#fff" ${N}/>`,
  ),
  '👂': wrap(
    `<path d="M34 22C48 4 82 10 82 40C82 56 68 60 66 72C64 86 52 94 42 88C34 84 34 76 40 70C28 60 24 34 34 22Z" fill="#e0ac80"/>` +
    `<path d="M44 30C54 20 70 26 70 40C70 50 58 52 58 62" fill="none" stroke="#b97a56" stroke-width="4.5"/>` +
    `<path d="M44 30C54 20 70 26 70 40C70 50 58 52 58 62" fill="none" stroke-width="2.2"/>` +
    `<path d="M48 44Q56 38 58 48" fill="none" stroke-width="2.4"/>`,
  ),
  '👃': wrap(
    `<path d="M50 8C46 30 40 44 32 58C24 66 20 78 30 84C36 88 42 84 46 86Q50 90 54 86C58 84 64 88 70 84C80 78 76 66 68 58C60 44 54 30 50 8Z" fill="#f6d2b5"/>` +
    `<ellipse cx="40" cy="78" rx="5" ry="3" fill="#8a5a3c" transform="rotate(20 40 78)"/><ellipse cx="60" cy="78" rx="5" ry="3" fill="#8a5a3c" transform="rotate(-20 60 78)"/>` +
    hi(48, 50, 3, 10),
  ),
  '👅': wrap(
    `<path d="M16 24H84Q86 62 68 80Q50 94 32 80Q14 62 16 24Z" fill="#ff6b8b"/>` +
    `<path d="M16 24Q50 34 84 24" fill="none" stroke-width="2.6"/>` +
    `<path d="M50 34V62" stroke="#d94468" stroke-width="3"/>` + hi(34, 46, 5, 9, 15),
  ),
  '🖐': wrap(
    `<g stroke-width="17.6">` + ['M34 66L17 50', 'M41 50L31 16', 'M50 48V10', 'M59 50L69 16', 'M66 58L82 32'].map((d) => `<path d="${d}"/>`).join('') + `</g>` +
    `<ellipse cx="50" cy="68" rx="21" ry="23" fill="#b97a56" stroke-width="5.6"/>` +
    `<g stroke="#b97a56" stroke-width="12">` + ['M34 66L17 50', 'M41 50L31 16', 'M50 48V10', 'M59 50L69 16', 'M66 58L82 32'].map((d) => `<path d="${d}"/>`).join('') + `</g>` +
    `<ellipse cx="50" cy="68" rx="21" ry="23" fill="#b97a56" ${N}/>` +
    `<path d="M40 74Q50 82 60 72" fill="none" stroke="#7a4b2f" stroke-width="2.2"/>`,
  ),
  '🦶': wrap(
    `<path d="M30 6H52V50C52 58 58 62 70 64C84 66 92 72 90 80C88 88 80 90 70 90H34C26 90 22 82 24 72C26 62 30 56 30 50Z" fill="#f6d2b5"/>` +
    `<path d="M80 66Q86 70 84 78M71 64Q76 70 74 78" fill="none" stroke-width="2"/>` +
    `<ellipse cx="86" cy="74" rx="2.5" ry="3" fill="#fff" ${N}/>` +
    `<path d="M48 70Q54 74 60 72" fill="none" stroke="#d8a27e" stroke-width="2.5"/>`,
  ),
  '🧠': wrap(
    unite(C(28, 40, 17, K), C(44, 28, 17, K), C(62, 28, 17, K), C(76, 42, 16, K), C(72, 60, 15, K), C(52, 64, 17, K), C(30, 60, 15, K)) +
    `<path d="M50 14V78" fill="none" stroke="#d9587a" stroke-width="2.6"/>` +
    `<path d="M22 36Q30 32 34 40Q38 48 30 52M40 22Q44 30 38 34M60 22Q56 30 62 34M76 36Q68 34 66 42Q64 50 72 52M28 64Q36 60 40 68M62 66Q66 60 74 64M42 46Q46 52 42 58M58 46Q54 52 58 58" fill="none" stroke="#d9587a" stroke-width="2.6"/>` +
    hi(34, 30, 6, 3, -30),
  ),
  '🥦': wrap(
    `<path d="M42 58L36 90H62L58 58Z" fill="#a7d97c"/><path d="M48 66L46 84M54 66L55 84" stroke="#6fae4a" stroke-width="2"/>` +
    unite(C(28, 44, 15, G), C(44, 28, 16, G), C(64, 30, 16, G), C(76, 48, 14, G), C(52, 48, 16, G), C(34, 58, 12, G), C(68, 60, 12, G)) +
    `<g fill="#1f7a36" ${N}><circle cx="30" cy="42" r="3"/><circle cx="44" cy="26" r="3.5"/><circle cx="64" cy="28" r="3"/><circle cx="74" cy="48" r="2.5"/><circle cx="52" cy="46" r="3"/><circle cx="38" cy="36" r="2"/><circle cx="58" cy="38" r="2"/></g>` +
    hi(40, 22, 5, 3, -20),
  ),
  '🥒': wrap(
    `<g transform="rotate(-35 50 50)"><rect x="6" y="36" width="88" height="28" rx="14" fill="${G}"/>` +
    `<path d="M20 44H70" stroke="#7cc68a" stroke-width="3" opacity=".8"/>` +
    `<g fill="#bfe6a3" ${N}><circle cx="24" cy="56" r="1.8"/><circle cx="36" cy="52" r="1.8"/><circle cx="48" cy="57" r="1.8"/><circle cx="60" cy="52" r="1.8"/><circle cx="72" cy="56" r="1.8"/><circle cx="82" cy="50" r="1.8"/></g>` +
    `<path d="M94 50h4" stroke-width="4"/></g>`,
  ),
  '🍇': wrap(
    `<path d="M50 22Q50 12 56 6" fill="none" stroke="${BR}" stroke-width="4"/>` +
    `<path d="M52 16Q62 4 78 10Q70 24 52 16Z" fill="${G}"/>` +
    [[50, 80], [42, 65], [58, 65], [34, 50], [50, 50], [66, 50], [26, 35], [42, 35], [58, 35], [74, 35]]
      .map(([x, y]) => C(x, y, 9.5, P) + `<circle cx="${x - 3}" cy="${y - 3}" r="2.4" fill="#fff" opacity=".55" ${N}/>`).join(''),
  ),
  '🍓': wrap(
    `<path d="M50 92C30 84 14 62 16 42C18 28 32 24 50 28C68 24 82 28 84 42C86 62 70 84 50 92Z" fill="${R}"/>` +
    `<path d="M50 34L36 38L42 28L28 22L46 22L50 10L54 22L72 22L58 28L64 38Z" fill="${G}"/>` +
    `<g fill="${Y}" ${N}>` + [[34, 46], [50, 48], [66, 46], [28, 60], [42, 62], [58, 62], [72, 60], [40, 76], [60, 76], [50, 86]]
      .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.4"/>`).join('') + `</g>` + hi(30, 40, 3, 6, 30),
  ),
  '🍐': wrap(
    `<path d="M50 18Q52 10 56 6" fill="none" stroke="${BR}" stroke-width="4"/>` +
    `<path d="M54 14Q64 4 76 10Q68 22 54 14Z" fill="${G}"/>` +
    `<path d="M50 16C40 16 38 28 38 34C38 44 22 52 22 68C22 84 36 94 50 94C64 94 78 84 78 68C78 52 62 44 62 34C62 28 60 16 50 16Z" fill="#a6c93a"/>` +
    hi(34, 68, 4, 9, 20),
  ),
  '🥑': wrap(
    `<path d="M50 6C36 6 34 22 30 32C26 42 14 50 14 68C14 86 30 96 50 96C70 96 86 86 86 68C86 50 74 42 70 32C66 22 64 6 50 6Z" fill="#2c6e2f"/>` +
    `<path d="M50 14C40 14 40 26 37 34C34 42 22 52 22 68C22 82 34 88 50 88C66 88 78 82 78 68C78 52 66 42 63 34C60 26 60 14 50 14Z" fill="#d7ea8a" ${N}/>` +
    `<circle cx="50" cy="64" r="15" fill="${BR}"/>` + hi(45, 59, 4, 3, -30),
  ),
  '🫑': wrap(
    `<path d="M50 26C36 18 18 26 18 48C18 70 30 92 42 88Q46 86 50 84Q54 86 58 88C70 92 82 70 82 48C82 26 64 18 50 26Z" fill="${G}"/>` +
    `<path d="M38 36Q34 60 42 84M62 36Q66 60 58 84" fill="none" stroke="#1f7a36" stroke-width="2.4"/>` +
    hi(30, 46, 4, 10, 10) +
    `<path d="M38 28Q50 20 62 28Q50 34 38 28Z" fill="#1f7a36"/>` +
    tube('M50 26Q50 12 60 8', '#3a8a3a', 5),
  ),
  '🍭': wrap(
    `<rect x="46" y="62" width="8" height="34" rx="3" fill="#fff"/>` +
    `<circle cx="50" cy="38" r="31" fill="${K}"/>` +
    `<path d="M50 38a4 4 0 0 1 8 0a8 8 0 0 1 -16 0a12 12 0 0 1 24 0a16 16 0 0 1 -32 0a20 20 0 0 1 40 0a24 24 0 0 1 -48 0" fill="none" stroke="#fff" stroke-width="4.5"/>` +
    hi(34, 22, 6, 3, -35),
  ),
  '🍬': wrap(
    `<g transform="rotate(-20 50 50)">` +
    `<path d="M32 50L8 32Q12 50 8 68Z" fill="${K}"/><path d="M68 50L92 32Q88 50 92 68Z" fill="${K}"/>` +
    `<path d="M14 44L28 50M14 56L28 50M86 44L72 50M86 56L72 50" stroke-width="2"/>` +
    `<ellipse cx="50" cy="50" rx="23" ry="18" fill="${K}"/>` +
    `<path d="M38 36Q34 50 40 64M52 33Q46 50 52 67M64 36Q58 50 62 64" fill="none" stroke="#fff" stroke-width="4" opacity=".85"/></g>`,
  ),
  '🍟': wrap(
    [[30, 18, -12], [40, 10, -6], [50, 8, 0], [60, 12, 6], [70, 20, 12], [36, 26, -3], [56, 22, 3], [46, 18, -2], [64, 28, 8]]
      .map(([x, y, a]) => `<rect x="${x - 4}" y="${y}" width="8" height="${56 - y}" rx="1.5" fill="${Y}" stroke-width="2.2" transform="rotate(${a} ${x} 56)"/>`).join('') +
    `<path d="M20 44Q50 60 80 44L70 92H30Z" fill="${R}"/>` +
    `<path d="M50 66a6 6 0 1 0 0.1 0" fill="${Y}" stroke-width="2"/>`,
  ),
  '🧁': wrap(
    `<path d="M24 56H76L68 92H32Z" fill="#fff"/>` +
    `<path d="M36 58L40 90M50 58V90M64 58L60 90" stroke="${K}" stroke-width="3"/>` +
    `<path d="M20 58Q14 46 28 42Q28 30 42 30Q46 18 58 22Q70 26 66 36Q82 38 80 58Z" fill="${K}"/>` +
    `<path d="M30 48Q44 52 66 44M40 36Q50 40 60 32" fill="none" stroke="#e5678a" stroke-width="2.2"/>` +
    `<g ${N}><rect x="34" y="40" width="5" height="2" rx="1" fill="${B}" transform="rotate(30 36 41)"/><rect x="52" y="48" width="5" height="2" rx="1" fill="${Y}"/><rect x="62" y="38" width="5" height="2" rx="1" fill="${G}" transform="rotate(-30 64 39)"/><rect x="44" y="26" width="5" height="2" rx="1" fill="#fff"/></g>` +
    C(56, 16, 6, R) + `<path d="M56 10Q58 4 64 4" fill="none" stroke-width="2"/>`,
  ),
  '🍰': wrap(
    `<path d="M8 60L90 46V76L8 88Z" fill="#fff3e0"/>` +
    `<path d="M8 72L90 60V66L8 78Z" fill="${R}" stroke-width="2"/>` +
    `<path d="M8 60L66 32L90 46Z" fill="#fff"/>` +
    `<path d="M8 60Q20 64 30 58Q42 60 52 54Q64 56 74 49Q84 50 90 46" fill="none" stroke-width="2"/>` +
    `<path d="M62 42C54 38 54 28 60 26C64 24 68 26 70 28C74 26 80 28 78 34C76 40 68 42 62 42Z" fill="${R}"/>` +
    `<path d="M66 26L62 20M66 26L72 21M66 26L66 19" stroke="${G}" stroke-width="3"/>`,
  ),
  '🍝': wrap(
    tube('M80 46L92 12', GR, 3.5) + `<path d="M86 14L88 4M90 15L92 5M94 16L96 6" stroke="${GR}" stroke-width="2"/>` +
    `<ellipse cx="50" cy="66" rx="46" ry="20" fill="#fff"/><ellipse cx="50" cy="64" rx="36" ry="13" fill="#f1f1f6" ${N}/>` +
    `<path d="M18 64Q16 44 36 40Q50 30 66 40Q86 44 82 64Q50 74 18 64Z" fill="#ffd66b"/>` +
    `<path d="M24 58Q34 48 44 58Q54 46 66 58Q74 50 78 60M30 50Q40 44 50 50Q60 42 70 50" fill="none" stroke="#e8a92a" stroke-width="2"/>` +
    `<path d="M34 42Q38 30 52 32Q66 30 68 42Q60 48 50 44Q40 48 34 42Z" fill="${R}"/>` +
    C(44, 40, 5, BR) + C(58, 38, 5, BR),
  ),
  '🧥': wrap(
    `<path d="M36 12L22 18Q16 22 14 32L8 74L20 77L26 46V92H74V46L80 77L92 74L86 32Q84 22 78 18L64 12L50 30Z" fill="${BR}"/>` +
    `<path d="M36 12L50 30L42 54L32 24Z" fill="#b5773e"/><path d="M64 12L50 30L58 54L68 24Z" fill="#b5773e"/>` +
    `<path d="M50 30V92" stroke-width="2.4"/>` +
    `<g fill="#d9a066" stroke-width="2"><circle cx="56" cy="64" r="2.6"/><circle cx="56" cy="76" r="2.6"/></g>` +
    `<path d="M30 70H42M58 82H70" stroke-width="2.4"/>`,
  ),
  '🧣': wrap(
    `<path d="M40 46L32 86H48L54 50Z" fill="${R}"/><path d="M56 46L64 90H80L70 42Z" fill="${R}"/>` +
    `<path d="M34 76H50M36 68H52M65 78H79M64 70H78" stroke="#fff" stroke-width="3"/>` +
    `<path d="M34 86V94M38 86V94M42 86V94M46 86V94M66 90V98M70 90V98M74 90V98M78 90V98" stroke-width="2"/>` +
    `<path d="M14 26Q50 46 86 26V40Q50 62 14 40Z" fill="${R}"/>` +
    `<path d="M24 34Q50 48 76 34" fill="none" stroke="#fff" stroke-width="3"/>`,
  ),
  '🧤': wrap(glove(G, '#7cc68a') + `<g transform="translate(100 0) scale(-1 1)">${glove(G, '#7cc68a')}</g>`),
  '🥾': wrap(
    `<rect x="16" y="76" width="76" height="12" rx="5" fill="#4a4a5a"/>` +
    `<path d="M22 82h4M34 82h4M46 82h4M58 82h4M70 82h4M82 82h4" stroke="#9aa0a6" stroke-width="2"/>` +
    `<path d="M28 10H58L60 50L82 60Q92 64 90 76H18Q20 40 28 10Z" fill="${BR}"/>` +
    `<path d="M64 52Q78 58 86 64L90 76H64Z" fill="#6b3f18" opacity=".55" ${N}/>` +
    `<rect x="26" y="8" width="34" height="9" rx="4" fill="#6b3f18"/>` +
    `<path d="M40 24L54 30M40 34L56 40M40 44L58 50M40 24L54 34M40 34L56 44" fill="none" stroke="${Y}" stroke-width="2.4"/>`,
  ),
  '🩳': wrap(
    `<path d="M20 20H80L90 80H58L50 46L42 80H10Z" fill="${B}"/>` +
    `<rect x="20" y="14" width="60" height="10" rx="3" fill="#4d93e6"/>` +
    `<path d="M48 24Q44 34 40 34M52 24Q56 34 60 34" fill="none" stroke="#fff" stroke-width="2.4"/>` +
    `<path d="M50 24V46M14 72H42M58 72H86" stroke-width="2"/>`,
  ),
  '🩴': wrap(flip(B, '#ffc83d') + `<g transform="translate(40 2)">${flip(B, '#ffc83d')}</g>`),
  '🕶': wrap(
    `<path d="M10 40L3 34M90 40L97 34" stroke-width="4"/>` +
    `<path d="M44 42Q50 36 56 42" fill="none" stroke-width="5"/>` +
    `<path d="M8 36H44Q48 36 47 46Q44 66 28 66Q12 66 9 46Q8 36 8 36Z" fill="${BK}"/>` +
    `<path d="M92 36H56Q52 36 53 46Q56 66 72 66Q88 66 91 46Q92 36 92 36Z" fill="${BK}"/>` +
    `<path d="M16 44L26 42M64 44L74 42M18 52L22 50M66 52L70 50" stroke="#fff" stroke-width="3" opacity=".55"/>`,
  ),
  '👒': wrap(
    `<ellipse cx="50" cy="62" rx="45" ry="17" fill="${Y}"/>` +
    `<path d="M26 62Q24 28 50 26Q76 28 74 62Q50 70 26 62Z" fill="${Y}"/>` +
    `<path d="M26 52Q50 60 74 52L74 61Q50 69 26 61Z" fill="${K}"/>` +
    `<path d="M70 58Q86 46 86 58Q86 66 70 58ZM70 58Q80 72 72 74Q66 74 70 58Z" fill="${K}"/>` + C(70, 58, 3.5, '#e5678a') +
    hi(38, 38, 4, 8, 20),
  ),
  '🩱': wrap(
    `<path d="M30 8H38Q40 26 50 28Q60 26 62 8H70V40Q70 56 78 70Q64 72 58 90H42Q36 72 22 70Q30 56 30 40Z" fill="${B}"/>` +
    `<path d="M30 46Q50 56 70 46V54Q50 64 30 54Z" fill="#fff" opacity=".85" ${N}/>` +
    hi(38, 66, 3, 6),
  ),
  '🧴': wrap(
    `<path d="M60 18H76V24H60Z" fill="#fff"/>` +
    `<rect x="36" y="14" width="26" height="9" rx="3" fill="#fff"/><rect x="44" y="22" width="12" height="14" fill="#fff"/>` +
    `<rect x="26" y="34" width="48" height="58" rx="11" fill="#3fb3c9"/>` +
    `<rect x="34" y="50" width="32" height="28" rx="4" fill="#fff"/>` +
    `<path d="M50 54Q57 63 57 67A7 7 0 0 1 43 67Q43 63 50 54Z" fill="#3fb3c9" stroke-width="2"/>` +
    hi(32, 48, 2.5, 8),
  ),
  '🥶': wrap(
    `<circle cx="50" cy="52" r="40" fill="#5aa9f0"/>` +
    `<path d="M12 40A40 40 0 0 1 88 40L83 40L80 46L76 40H66L62 49L58 40H46L42 48L38 40H28L24 45L20 40Z" fill="#eaf7ff" stroke-width="2.2"/>` +
    `<path d="M27 56L41 51M73 56L59 51" stroke-width="3.6"/>` +
    eye(37, 63, 4) + eye(63, 63, 4) +
    `<rect x="31" y="72" width="38" height="14" rx="5" fill="#fff"/>` +
    `<path d="M31 79H69M38.5 72V86M46 72V86M53.5 72V86M61 72V86" stroke-width="2"/>` +
    `<path d="M4 50l4 4-4 4M96 50l-4 4 4 4" fill="none" stroke="#8fc4f2" stroke-width="3"/>`,
  ),
  '🎿': wrap(
    `<g transform="translate(0 -12) rotate(-18 50 50)">` +
    tube('M10 80H72Q86 80 88 68', R, 5) + tube('M16 70H66Q80 70 82 58', '#f15f62', 5) +
    `<path d="M30 68V36Q30 28 38 28H54Q60 28 60 36V52L70 58Q76 62 74 70H30Z" fill="${B}"/>` +
    `<rect x="28" y="24" width="34" height="9" rx="4" fill="#4a4a5a"/>` +
    `<path d="M36 44H54M36 54H58" stroke="${GR}" stroke-width="3"/></g>`,
  ),
  '🪭': fan(),
}
