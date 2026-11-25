/* Draws a picture field: an emoji, or one of our own illustrations when it reads "@world/key".
   Every place that shows a picture in a lesson goes through <Emo>, so a world's drawings appear everywhere. */

import type { CSSProperties } from 'react'
import { ART as animals } from './art/animals'
import { ART as cars } from './art/cars'
import { ART as dinos } from './art/dinos'
import { ART as heroes } from './art/heroes'
import { ART as magic } from './art/magic'
import { ART as space } from './art/space'
import type { WorldId } from './kits'

export const ARTS: Record<WorldId, Record<string, string>> = { heroes, magic, space, cars, animals, dinos }
export const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'

export const isArt = (e?: string) => !!e && e.startsWith('@')
export function artMarkup(e: string): string | undefined {
  const [w, k] = e.slice(1).split('/')
  return ARTS[w as WorldId]?.[k]
}
export const svgDoc = (inner: string, size = 200) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">${inner}</svg>`
export const svgUrl = (inner: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgDoc(inner))}`

/** A picture at `size` px: our drawing for "@world/key", otherwise the emoji itself. */
export function Emo({ e, size, style, className }: { e: string; size: number; style?: CSSProperties; className?: string }) {
  if (isArt(e)) {
    const m = artMarkup(e)
    return (
      <svg viewBox="0 0 100 100" width={size * 1.55} height={size * 1.55} aria-hidden="true" className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible', ...style }} dangerouslySetInnerHTML={{ __html: m ?? '' }} />
    )
  }
  return <span className={className} style={{ fontFamily: EMOJI_FONT, fontSize: size, lineHeight: 1.1, ...style }}>{e}</span>
}

/** A row of pictures written as one string: emoji, and "@world/key" tokens separated by spaces. */
export function EmoLine({ text, size, gap = 8 }: { text: string; size: number; gap?: number }) {
  if (!text.includes('@')) return <span style={{ fontFamily: EMOJI_FONT, fontSize: size, lineHeight: 1.15, letterSpacing: 4 }}>{text}</span>
  return (
    <span className="inline-flex items-center flex-wrap justify-center" style={{ gap }}>
      {text.split(/\s+/).filter(Boolean).map((t, i) => <Emo key={i} e={t} size={size} />)}
    </span>
  )
}

/** For canvases (the jigsaw): the drawing as a loaded image, cached. */
const images = new Map<string, HTMLImageElement>()
export function artImage(e: string, onLoad?: () => void): HTMLImageElement | null {
  const m = artMarkup(e)
  if (!m) return null
  let img = images.get(e)
  if (!img) { img = new Image(); img.src = svgUrl(m); images.set(e, img) }
  if (!img.complete && onLoad) img.addEventListener('load', onLoad, { once: true })
  return img
}
