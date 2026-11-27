/* Hebrew grammatical gender and number of the nouns our templates use, so a sentence can agree with its noun:
   "הציפור גרה", "המטרייה עוזרת", "הכפפות עוזרות". */

/** Feminine nouns that don't end in ה or ת. */
const FEM = new Set(['ציפור', 'צפרדע', 'עז', 'אבן', 'עיר', 'כף', 'נעל', 'רגל', 'יד', 'עין', 'אוזן', 'שמש', 'ארץ', 'דרך', 'כוס', 'סכין', 'בטן', 'כנף', 'ציפורן', 'אם', 'בת'])
/** Masculine nouns that do end in ה or ת. */
const MASC = new Set(['לילה', 'מורה', 'בית', 'זית', 'תות', 'שדה', 'מחנה', 'צוות', 'קנה', 'מקרה', 'עלה', 'פה', 'שה', 'שעווה'])
/** Plural nouns (some end in ־יים and look singular in a list). */
const PLURAL = new Set(['אופניים', 'משקפיים', 'משקפי שמש', 'מכנסיים', 'מכנסיים קצרים', 'מספריים', 'מגפיים', 'כפכפים', 'כפפות', 'ענבים', 'קורים', 'מים', 'שמיים'])

export type G = 'm' | 'f' | 'p'

/** Gender of a noun, judged by its first word ("מגרש כדורגל" → מגרש). */
export function gOf(w: string): G {
  const word = w.replace(/^ה/, '')
  if (PLURAL.has(word)) return 'p'
  const head = word.split(/[\s־]/)[0]
  if (PLURAL.has(head) || /(ים|ות|יים)$/.test(head) && !['מים'].includes(head) && head.length > 3) return 'p'
  if (FEM.has(head)) return 'f'
  if (MASC.has(head)) return 'm'
  return /[הת]$/.test(head) ? 'f' : 'm'
}
/** Pick the form that agrees with the noun: g(w, 'גר', 'גרה', 'גרים'). */
export const agree = (w: string, m: string, f: string, p = m) => ({ m, f, p })[gOf(w)]
