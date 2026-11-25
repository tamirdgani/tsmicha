/* Our drawing of every emoji the lessons name, keyed by the emoji (without U+FE0F). */
import { ART as c1 } from './c1'
import { ART as c2 } from './c2'
import { ART as c3 } from './c3'
import { ART as c4 } from './c4'
import { ART as c5 } from './c5'
import { ART as c6 } from './c6'
import { ART as c7 } from './c7'
import { ART as c8 } from './c8'

export const COMMON: Record<string, string> = { ...c1, ...c2, ...c3, ...c4, ...c5, ...c6, ...c7, ...c8 }
