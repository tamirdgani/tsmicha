#!/usr/bin/env node
/* Checks every colour pair the design system relies on against WCAG 2.1 AA, in both themes.
   Run: npm run check:contrast   (exits with 1 if anything fails)

   Text needs 4.5:1 (1.4.3). Icons, rings and other meaningful graphics need 3:1 (1.4.11).
   Values are read straight from src/index.css and src/ds/tokens.css, so a token change that breaks
   contrast fails here before it reaches a screen. */
import { readFileSync } from 'node:fs'

const css = ['src/index.css', 'src/ds/tokens.css'].map((f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8')).join('\n').replace(/\/\*[\s\S]*?\*\//g, '')

/** Custom properties declared inside blocks whose selector matches `test`. */
function vars(test) {
  const out = {}
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    // the selector is the last statement before the brace (skips @import lines above it)
    const selector = m[1].split(/[;\n]/).map((x) => x.trim()).filter(Boolean).at(-1) ?? ""
    if (!test(selector)) continue
    for (const d of m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[d[1]] = d[2].replace(/\/\*.*?\*\//g, '').trim()
  }
  return out
}
const base = { ...vars((s) => s.startsWith('@theme')), ...vars((s) => s === ':root') }
const themes = {
  light: base,
  dark: { ...base, ...vars((s) => s === ':root[data-theme="dark"]') },
}

// ── colour parsing: hex, oklch(L C H [/ a]), var(--x), color-mix is not used in these pairs ──
function oklchToRgb(L, C, H) {
  const h = (H * Math.PI) / 180
  const a = C * Math.cos(h), b = C * Math.sin(h)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3
  const lin = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s]
  return lin.map((c) => Math.max(0, Math.min(1, c)))   // linear sRGB
}
function toLinear(value, t, depth = 0) {
  if (depth > 8) throw new Error(`var loop at ${value}`)
  const v = value.trim()
  const ref = v.match(/^var\((--[\w-]+)\)$/)
  if (ref) {
    if (!(ref[1] in t)) throw new Error(`unknown token ${ref[1]}`)
    return toLinear(t[ref[1]], t, depth + 1)
  }
  if (v.startsWith('#')) {
    const hex = v.length === 4 ? v.slice(1).split('').map((c) => c + c).join('') : v.slice(1, 7)
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  }
  const ok = v.match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/)
  if (ok) return oklchToRgb(+ok[1], +ok[2], +ok[3])
  throw new Error(`can't read colour "${v}"`)
}
const lum = (rgb) => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

// ── the pairs the UI actually uses ──
const TEXT = 4.5, GRAPHIC = 3
const pairs = [
  // body text and secondary text on every surface
  ['--foreground', '--background', TEXT], ['--foreground', '--card', TEXT], ['--foreground', '--muted', TEXT],
  ['--muted-foreground', '--background', TEXT], ['--muted-foreground', '--card', TEXT], ['--muted-foreground', '--muted', TEXT],
  ['--ink-2', '--background', TEXT], ['--ink-2', '--card', TEXT], ['--ink-2', '--muted', TEXT],
  // buttons
  ['--primary-foreground', '--primary', TEXT], ['--on-strong', '--flame-strong', TEXT],
  // labels on soft tints (badges, notes, feedback)
  ['--brand-ink', '--brand-soft', TEXT], ['--brand-ink', '--card', TEXT],
  ['--color-sun-ink', '--sun-soft', TEXT], ['--color-sun-ink', '--card', TEXT], ['--sun-text', '--sun-soft', TEXT],
  ['--color-flame-ink', '--flame-soft', TEXT], ['--flame-text', '--flame-soft', TEXT], ['--flame-text', '--card', TEXT],
  ['--color-sky-ink', '--sky-soft', TEXT], ['--color-sky-ink', '--card', TEXT], ['--color-sky-ink', '--background', TEXT],
  ['--color-berry-ink', '--berry-soft', TEXT], ['--color-berry-ink', '--card', TEXT], ['--color-berry-ink', '--background', TEXT],
  // strong accents used as text, selected borders and progress
  ['--sky-strong', '--card', TEXT], ['--berry-strong', '--card', TEXT], ['--flame-strong', '--card', TEXT], ['--sun-strong', '--card', TEXT],
  ['--sky-strong', '--background', TEXT], ['--berry-strong', '--background', TEXT], ['--flame-strong', '--background', TEXT], ['--sun-strong', '--background', TEXT],
  // map steps: the circle against the page, and its icon against the circle
  ['--primary', '--background', GRAPHIC], ['--on-strong', '--primary', GRAPHIC],
  ['--on-strong', '--berry-strong', GRAPHIC], ['--on-strong', '--sky-strong', GRAPHIC],
  // the yellow unit-test circle is outlined in --sun-strong, which carries its edge on the page
  ['--color-leaf-900', '--color-sun', GRAPHIC], ['--sun-strong', '--background', GRAPHIC], ['--sun-strong', '--card', GRAPHIC],
  ['--muted-foreground', '--muted', GRAPHIC],
  // focus ring
  ['--ring', '--background', GRAPHIC],
]

let failed = 0
for (const [name, t] of Object.entries(themes)) {
  for (const [fg, bg, min] of pairs) {
    let r
    try { r = ratio(toLinear(`var(${fg})`, t), toLinear(`var(${bg})`, t)) } catch (e) { console.error(`✗ ${name}: ${fg} on ${bg}: ${e.message}`); failed++; continue }
    if (r < min) { failed++; console.error(`✗ ${name}: ${fg} on ${bg} = ${r.toFixed(2)}:1 (needs ${min}:1)`) }
  }
}
if (failed) { console.error(`\n${failed} pair(s) fail WCAG AA.`); process.exit(1) }
console.log(`✓ All ${pairs.length} colour pairs pass WCAG AA in light and dark.`)
