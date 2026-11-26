/* Every picture in the app is one of our own drawings — never an emoji.
   A picture field holds either "@world/key" (a world's character or thing) or an emoji, which is only a
   *name* for the drawing of the same thing in src/art/common. <Emo> draws a picture, <RichText> draws
   text with pictures inside it, and artImage() gives canvases (the jigsaw, the ball games) the same drawings. */

import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { COMMON } from '../art/common'
import { ART as animals } from './art/animals'
import { ART as animals2 } from './art/animals2'
import { ART as cars } from './art/cars'
import { ART as cars2 } from './art/cars2'
import { ART as dinos } from './art/dinos'
import { ART as dinos2 } from './art/dinos2'
import { ART as heroes } from './art/heroes'
import { ART as heroes2 } from './art/heroes2'
import { ART as magic } from './art/magic'
import { ART as magic2 } from './art/magic2'
import { ART as space } from './art/space'
import { ART as space2 } from './art/space2'
import type { WorldId } from './kits'

export const ARTS: Record<WorldId, Record<string, string>> = {
  heroes: { ...heroes, ...heroes2 }, magic: { ...magic, ...magic2 }, space: { ...space, ...space2 },
  cars: { ...cars, ...cars2 }, animals: { ...animals, ...animals2 }, dinos: { ...dinos, ...dinos2 },
}

const PICTO = /\p{Extended_Pictographic}|⃣|\p{Regional_Indicator}/u
const seg = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter('en', { granularity: 'grapheme' }) : null
/** Splits text into characters as people see them (an emoji with its modifiers is one). */
export const graphemes = (s: string): string[] => (seg ? [...seg.segment(s)].map((x) => x.segment) : [...s])
export const isPicto = (g: string) => PICTO.test(g)
/** The key a drawing is stored under: the emoji without its presentation selector. */
export const norm = (e: string) => e.replace(/️/g, '')

export const isArt = (e?: string) => !!e && e.startsWith('@')
export function artMarkup(e: string): string | undefined {
  if (e.startsWith('@')) { const [w, k] = e.slice(1).split('/'); return ARTS[w as WorldId]?.[k] }
  return COMMON[norm(e)]
}
export const svgDoc = (inner: string, size = 200) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">${inner}</svg>`
export const svgUrl = (inner: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgDoc(inner))}`

function Drawing({ markup, px, style, className }: { markup: string; px: number; style?: CSSProperties; className?: string }) {
  return <svg viewBox="0 0 100 100" width={px} height={px} aria-hidden="true" className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible', flexShrink: 0, ...style }} dangerouslySetInnerHTML={{ __html: markup }} />
}

/** A picture at `size` (the size an emoji of that font-size would have). A string of several emoji draws them all in a row. */
export function Emo({ e, size, style, className }: { e: string; size: number; style?: CSSProperties; className?: string }) {
  const one = artMarkup(e)
  if (one) return <Drawing markup={one} px={size * 1.55} style={style} className={className} />
  const parts = graphemes(e).filter((g) => g.trim())
  if (parts.length > 1) {
    return (
      <span className={`inline-flex items-center flex-wrap justify-center ${className ?? ''}`} style={{ gap: size * 0.12, ...style }}>
        {parts.map((g, i) => { const m = artMarkup(g); return m ? <Drawing key={i} markup={m} px={size * 1.3} /> : isPicto(g) ? null : <span key={i} style={{ fontSize: size * 0.9, fontWeight: 800, lineHeight: 1 }}>{g}</span> })}
      </span>
    )
  }
  return null // an emoji with no drawing yet is left out rather than shown (scripts/check-lessons.ts reports it)
}

/** A row of pictures written as one string ("@world/key" tokens and emoji, separated by spaces or not). */
export function EmoLine({ text, size, gap = 8 }: { text: string; size: number; gap?: number }) {
  const tokens = text.split(/\s+/).filter(Boolean).flatMap((t) => (t.startsWith('@') ? [t] : graphemes(t)))
  return (
    <span className="inline-flex items-center flex-wrap justify-center" style={{ gap }}>
      {tokens.map((t, i) => <Emo key={i} e={t} size={size} />)}
    </span>
  )
}

/** An exercise inside Hebrew text ("7 − 3 = 4", "3 × 4"): math is written left to right, so it is isolated
    from the sentence around it — otherwise the browser would show "7 − 3" as "3 − 7". */
const MATH = /((?:\d+|\?)(?: ?[+−×:=<>-] ?(?:\d+|\?))+)/g
function withMath(text: string, key: string): ReactNode {
  if (!/\d ?[+−×:=<>-] ?[\d?]|\? ?[+−×:=] ?\d/.test(text)) return text
  return text.split(MATH).map((part, i) => i % 2
    ? <bdi key={`${key}-${i}`} dir="ltr" style={{ unicodeBidi: 'isolate', whiteSpace: 'nowrap' }}>{part}</bdi>
    : <Fragment key={`${key}-${i}`}>{part}</Fragment>)
}

/** Text with any emoji in it drawn as small pictures inline, at the text's own size (and exercises kept left to right). */
export function RichText({ text }: { text: string }): ReactNode {
  if (!PICTO.test(text)) return withMath(text, 't')
  const out: ReactNode[] = []
  let buf = ''
  for (const g of graphemes(text)) {
    if (!isPicto(g)) { buf += g; continue }
    if (buf) { out.push(withMath(buf, `b${out.length}`)); buf = '' }
    const m = artMarkup(g)
    if (m) out.push(<svg key={out.length} viewBox="0 0 100 100" aria-hidden="true" style={{ width: '1.35em', height: '1.35em', display: 'inline-block', verticalAlign: '-0.32em', margin: '0 0.06em' }} dangerouslySetInnerHTML={{ __html: m }} />)
  }
  if (buf) out.push(withMath(buf, `b${out.length}`))
  return <>{out.map((x, i) => <Fragment key={i}>{x}</Fragment>)}</>
}

/** For canvases: the drawing as a loaded image, cached. */
const images = new Map<string, HTMLImageElement>()
export function artImage(e: string, onLoad?: () => void): HTMLImageElement | null {
  const m = artMarkup(e)
  if (!m) return null
  let img = images.get(e)
  if (!img) { img = new Image(); img.src = svgUrl(m); images.set(e, img) }
  if (!img.complete && onLoad) img.addEventListener('load', onLoad, { once: true })
  return img
}
export const EMOJI_FONT = 'sans-serif'
