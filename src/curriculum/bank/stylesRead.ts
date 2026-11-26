/* School reading: niqqud (the vowel marks), final letters, reading whole words, sentences, grammar and
   short stories to understand. Kindergarten meets the easier ones; first and second grade live here.
   Spec `set` for niqqud is the vowel sounds learned so far ('a', 'ai', 'aiou', 'aeiou');
   for grammar it is the kinds practised: p plural · o opposite · g gender · t tense · s same meaning. */

import type { Spec } from '../course'
import type { Show, Tile } from '../lessonTypes'
import { alike, CATS, LETTER_NAME, LETTERS, LOOKALIKE, SHORT3, WORDS_BY_LETTER, type Pic } from '../kdata'
import { COLOR_HEX, COLOR_F } from '../../worlds/kits'
import { hero, v } from './ctx'
import { choices, he, int, match, mix, nice, one, order, pick, some, style, tapall, YES, NO, type R, type Style } from './util'

const txt = (text: string): Show => ({ kind: 'text', text })
const pic = (p: { e: string }): Tile => ({ e: p.e })

/* ───────── niqqud ───────── */
type Sign = 'kamatz' | 'patach' | 'tzere' | 'segol' | 'hirik' | 'holam' | 'holamh' | 'shuruk' | 'kubutz'
const MARK: Record<Sign, string> = { kamatz: 'ָ', patach: 'ַ', tzere: 'ֵ', segol: 'ֶ', hirik: 'ִ', holam: 'וֹ', holamh: 'ֹ', shuruk: 'וּ', kubutz: 'ֻ' }
const SOUND: Record<Sign, string> = { kamatz: 'a', patach: 'a', tzere: 'e', segol: 'e', hirik: 'i', holam: 'o', holamh: 'o', shuruk: 'u', kubutz: 'u' }
const SIGN_NAME: Record<Sign, string> = { kamatz: 'קמץ', patach: 'פתח', tzere: 'צירה', segol: 'סגול', hirik: 'חיריק', holam: 'חולם', holamh: 'חולם', shuruk: 'שורוק', kubutz: 'קובוץ' }
const CANON: Record<string, Sign> = { a: 'kamatz', e: 'tzere', i: 'hirik', o: 'holam', u: 'shuruk' }
const SAY: Record<string, string> = { a: 'אַ', e: 'אֶ', i: 'אִי', o: 'אוֹ', u: 'אוּ' }
/** A word with niqqud, its picture, the first letter as written (with its dot) and the vowel under or after it. */
type NW = { w: string; e: string; base: string; sign: Sign; plain: string }
const NW = (rows: string): NW[] => rows.trim().split(/\s*,\s*/).map((row) => {
  const [w, e, base, sign] = row.split(' ')
  return { w, e, base, sign: sign as Sign, plain: base.replace(/[ְ-ׇ]/g, '') }
})
const NIKUD: NW[] = NW(`
  דָּג 🐟 דּ kamatz, יָד ✋ י kamatz, גַּל 🌊 גּ patach, הַר ⛰️ ה patach, צַב 🐢 צ patach, בַּיִת 🏠 בּ patach, זַיִת 🫒 ז patach,
  גָּמָל 🐪 גּ kamatz, חָתוּל 🐱 ח kamatz, חָלָב 🥛 ח kamatz, בָּנָנָה 🍌 בּ kamatz, פַּרְפַּר 🦋 פּ patach, תַּפּוּחַ 🍎 תּ patach,
  כַּדּוּר ⚽ כּ patach, סַבָּא 👴 ס patach, מַטּוֹס ✈️ מ patach, נָחָשׁ 🐍 נ kamatz, שָׁעוֹן ⏰ שׁ kamatz, אַרְיֵה 🦁 א patach,
  נֵר 🕯️ נ tzere, לֵב ❤️ ל tzere, עֵז 🐐 ע tzere, שֵׁן 🦷 שׁ tzere, בֵּיצָה 🥚 בּ tzere, כֶּלֶב 🐶 כּ segol, סֵפֶר 📖 ס tzere,
  קֶשֶׁת 🌈 ק segol, שֶׁמֶשׁ ☀️ שׁ segol, דֶּלֶת 🚪 דּ segol, גֶּזֶר 🥕 גּ segol, פֶּרַח 🌸 פּ segol, רֶגֶל 🦵 ר segol, מֶלֶךְ 🤴 מ segol,
  פִּיל 🐘 פּ hirik, תִּינוֹק 👶 תּ hirik, סִירָה ⛵ ס hirik, כִּסֵּא 🪑 כּ hirik, גִּיטָרָה 🎸 גּ hirik, מִטָּה 🛏️ מ hirik,
  לִימוֹן 🍋 ל hirik, צִפּוֹר 🐦 צ hirik, קִיר 🧱 ק hirik, נִמְלָה 🐜 נ hirik, דִּינוֹזָאוּר 🦕 דּ hirik, עִפָּרוֹן ✏️ ע hirik, זִיקִית 🦎 ז hirik,
  דֹּב 🐻 דּ holamh, שׁוֹר 🐂 שׁ holam, קוֹף 🐵 ק holam, כּוֹס 🥤 כּ holam, חוֹל 🏖️ ח holam, כּוֹבַע 🧢 כּ holam, יוֹנָה 🕊️ י holam,
  אוֹטוֹבּוּס 🚌 א holam, תּוֹף 🥁 תּ holam, גּוֹרִילָה 🦍 גּ holam, רוֹבּוֹט 🤖 ר holam, שׁוֹקוֹלָד 🍫 שׁ holam,
  סוּס 🐴 ס shuruk, דּוּבִּי 🧸 דּ shuruk, עוּגָה 🎂 ע shuruk, תּוּכִּי 🦜 תּ shuruk, שׁוּעָל 🦊 שׁ shuruk, תּוּת 🍓 תּ shuruk,
  שׁוּם 🧄 שׁ shuruk, קֻבִּיָּה 🎲 ק kubutz, נוּרָה 💡 נ shuruk, גּוּלָה 🔮 גּ shuruk
`)
const syl = (x: { base: string; sign: Sign }) => x.base + MARK[x.sign]
const sounds = (sp: Spec) => [...(sp.set ?? 'aeiou')]
/** Every vowel sound in a word: a word is readable only once the child knows all of them. */
function vowelsOf(w: string): Set<string> {
  const out = new Set<string>(), ch = [...w]
  ch.forEach((c, i) => {
    if (c === 'ָ' || c === 'ַ') out.add('a'); else if (c === 'ֵ' || c === 'ֶ') out.add('e'); else if (c === 'ִ') out.add('i'); else if (c === 'ֹ') out.add('o'); else if (c === 'ֻ') out.add('u')
    else if (c === 'ּ' && ch[i - 1] === 'ו' && i > 1 && !/[ְ-ֻ]/.test(ch[i + 1] ?? '')) out.add('u') // שורוק
  })
  return out
}
const nwords = (sp: Spec) => NIKUD.filter((x) => sounds(sp).includes(SOUND[x.sign]) && [...vowelsOf(x.w)].every((v) => sounds(sp).includes(v)))
/** Two first syllables a child would hear as the same: same sound and a letter that sounds the same. */
const sameStart = (a: NW, b: NW) => SOUND[a.sign] === SOUND[b.sign] && alike(a.plain, b.plain) && a.base.includes('ּ') === b.base.includes('ּ')
/** Wrong syllables: the same letter with another vowel the child knows, else another letter with the same vowel. */
function otherSyls(r: R, x: NW, sp: Spec, n: number): string[] {
  const vs = sounds(sp).filter((s) => s !== SOUND[x.sign])
  let out = mix(r, vs).map((s) => x.base + MARK[CANON[s]])
  if (out.length < n) out = [...out, ...mix(r, nwords(sp).filter((y) => !alike(y.plain, x.plain))).map(syl)]
  return [...new Set(out)].filter((s) => s !== syl(x)).slice(0, n)
}

export const NIKUD_STYLES: Style[] = [
  style('nk-first', 'באיזו הברה מתחילה?', ['nikud'], 'e', (sp, r) => {
    const x = one(r, nwords(sp))
    return [`nkf|${x.w}`, pick(r, `באיזו הברה מתחילה המילה? (${x.w})`, { g: syl(x) }, otherSyls(r, x, sp, 2).map((g) => ({ g })), `${x.w} מתחילה ב־${syl(x)}: ${LETTER_NAME[x.plain]} עם ${SIGN_NAME[x.sign]}.`, { kind: 'tile', tile: { e: x.e } })]
  }),
  style('nk-pic', 'מה מתחיל בהברה?', ['nikud'], 'h', (sp, r) => {
    const x = one(r, nwords(sp)), o = mix(r, NIKUD.filter((y) => !sameStart(x, y) && (y.plain === x.plain || SOUND[y.sign] === SOUND[x.sign]))).slice(0, 2)
    if (o.length < 2) return null
    return [`nkp|${x.w}`, pick(r, `איזו תמונה מתחילה בהברה ${syl(x)}?`, pic(x), o.map(pic), `${x.w} מתחילה ב־${syl(x)}.`, { kind: 'tile', tile: { g: syl(x) } })]
  }),
  style('nk-read', 'קוראים מילה מנוקדת', ['nikud'], 'h', (sp, r) => {
    const x = one(r, nwords(sp)), o = some(r, nwords(sp).filter((y) => y !== x && y.plain !== x.plain), 2)
    return [`nkr|${x.w}`, pick(r, 'קוראים את המילה ובוחרים את התמונה', pic(x), o.map(pic), `כתוב ${x.w}.`, { kind: 'word', w: x.w })]
  }),
  style('nk-word', 'איזו מילה מתאימה?', ['nikud'], 't', (sp, r) => {
    const known = nwords(sp), x = one(r, known), close = known.filter((y) => y !== x && (y.plain === x.plain || y.w.replace(/[ְ-ׇ]/g, '').length === x.w.replace(/[ְ-ׇ]/g, '').length))
    const o = some(r, close.length >= 2 ? close : known.filter((y) => y !== x), 2)
    if (o.length < 2) return null
    return [`nkw|${x.w}`, pick(r, 'איזו מילה מתאימה לתמונה? קוראים עד הסוף!', { t: x.w }, o.map((y) => ({ t: y.w })), `כתוב ${x.w}.`, { kind: 'tile', tile: { e: x.e } })]
  }),
  style('nk-sign', 'מה שם הניקוד?', ['nikud'], 'h', (sp, r) => {
    const x = one(r, nwords(sp)), others = mix(r, (Object.keys(SIGN_NAME) as Sign[]).filter((s) => SOUND[s] !== SOUND[x.sign] && s !== 'holamh')).slice(0, 2)
    return [`nks|${syl(x)}`, pick(r, `איך קוראים לניקוד של ${syl(x)}?`, { t: SIGN_NAME[x.sign] }, others.map((s) => ({ t: SIGN_NAME[s] })), `זה ${SIGN_NAME[x.sign]}, והוא נשמע ${SAY[SOUND[x.sign]]}: ${syl(x)}.`, { kind: 'tile', tile: { g: syl(x) } })]
  }),
  style('nk-sound', 'אותו צליל', ['nikud'], 't', (sp, r) => {
    const s = one(r, sounds(sp)), pool = mix(r, nwords(sp))
    const rights = [...new Map(pool.filter((x) => SOUND[x.sign] === s).map((x) => [syl(x), x])).values()].slice(0, 2)
    const wr = [...new Map(pool.filter((x) => SOUND[x.sign] !== s).map((x) => [syl(x), x])).values()].slice(0, 3)
    if (rights.length < 2 || wr.length < 2) return null
    return [`nko|${s}|${rights.map(syl).join()}`, tapall(r, `מסמנים את כל ההברות שנשמעות ${SAY[s]}`, rights.map((x) => ({ g: syl(x) })), wr.map((x) => ({ g: syl(x) })), `${rights.map(syl).join(', ')}: כולן נשמעות ${SAY[s]}.${s === 'a' ? ' קמץ ופתח נשמעים אותו דבר.' : s === 'e' ? ' צירה וסגול נשמעים אותו דבר.' : ''}`)]
  }),
  style('nk-match', 'הברה ותמונה', ['nikud'], 'h', (sp, r) => {
    const out: NW[] = []
    for (const x of mix(r, nwords(sp))) { if (out.length >= 3) break; if (!out.some((y) => sameStart(x, y) || syl(x) === syl(y))) out.push(x) }
    if (out.length < 3) return null
    return [`nkm|${out.map((x) => x.w).sort().join()}`, match('מחברים כל הברה לתמונה שמתחילה בה', out.map((x) => [{ g: syl(x) }, pic(x)]), out.map((x) => `${syl(x)}: ${x.w}`).join(' · '))]
  }),
]

/* ───────── final letters ───────── */
const FINAL: Record<string, string> = { כ: 'ך', מ: 'ם', נ: 'ן', פ: 'ף', צ: 'ץ' }
const REGULAR: Record<string, string> = Object.fromEntries(Object.entries(FINAL).map(([a, b]) => [b, a]))
const P = (list: string): Pic[] => list.trim().split(/\s*,\s*/).map((x) => { const [w, e] = x.split(' '); return { w, e } })
const FIN_WORDS = P('מלך 🤴, כריך 🥪, שום 🧄, מים 💧, לחם 🍞, ים 🌊, סולם 🪜, שעון ⏰, בלון 🎈, חלון 🪟, לימון 🍋, שן 🦷, קן 🪺, אוזן 👂, מלפפון 🥒, אף 👃, כף 🥄, קוף 🐵, תוף 🥁, חוף 🏖️, דף 📄, עץ 🌳, חץ 🏹, מיץ 🧃')
export const FINAL_STYLES: Style[] = [
  style('fn-end', 'איך נגמרת המילה?', ['finals'], 'e', (_sp, r) => {
    const w = one(r, FIN_WORDS), f = w.w.at(-1)!, o = [REGULAR[f], one(r, Object.values(FINAL).filter((x) => x !== f))]
    return [`fne|${w.w}`, pick(r, `איזו אות חסרה בסוף המילה ${w.w}?`, { g: f }, o.map((g) => ({ g })), `בסוף מילה כותבים ${f} (${LETTER_NAME[REGULAR[f]]} סופית), לא ${REGULAR[f]}.`, { kind: 'word', e: w.e, w: w.w, hide: w.w.length - 1 })]
  }),
  style('fn-pair', 'אות ואות סופית', ['finals'], 'h', (_sp, r) => {
    const ks = some(r, Object.keys(FINAL), 3)
    return [`fnp|${ks.sort().join()}`, match('מחברים כל אות לאות הסופית שלה', ks.map((k) => [{ g: k }, { g: FINAL[k] }]), ks.map((k) => `${k} ← ${FINAL[k]}`).join(' · '))]
  }),
  style('fn-spell', 'איך כותבים נכון?', ['finals', 'words'], 't', (_sp, r) => {
    const w = one(r, FIN_WORDS), f = w.w.at(-1)!, head = w.w.slice(0, -1)
    const wrong = [head + REGULAR[f], head + one(r, Object.values(FINAL).filter((x) => x !== f))]
    return [`fns|${w.w}`, pick(r, 'איך כותבים נכון? מסתכלים על הסוף!', { t: w.w }, wrong.map((t) => ({ t })), `${w.w}: בסוף מילה ${REGULAR[f]} הופכת ל־${f}.`, { kind: 'tile', tile: { e: w.e } })]
  }),
  style('fn-tap', 'מסמנים אותיות סופיות', ['finals'], 'h', (_sp, r) => {
    const rights = some(r, Object.values(FINAL), 3), wr = some(r, [...'כמנפצוזדר'], 3)
    return [`fnt|${rights.sort().join()}|${wr.sort().join()}`, tapall(r, 'מסמנים רק את האותיות הסופיות', rights.map((g) => ({ g })), wr.map((g) => ({ g })), 'האותיות הסופיות: ך ם ן ף ץ. הן באות רק בסוף מילה.')]
  }),
  style('fn-pic', 'מה נגמר באות?', ['finals'], 'h', (_sp, r) => {
    const f = one(r, Object.values(FINAL)), right = one(r, FIN_WORDS.filter((w) => w.w.endsWith(f))), o = some(r, FIN_WORDS.filter((w) => !w.w.endsWith(f)), 2)
    return [`fnc|${right.w}`, pick(r, `איזו מילה נגמרת ב־${f}?`, pic(right), o.map(pic), `${right.w} נגמרת ב־${f}.`, { kind: 'tile', tile: { g: f } })]
  }),
  style('fn-sister', 'האחות של האות', ['finals'], 'e', (_sp, r) => {
    const f = one(r, Object.values(FINAL)), reg = REGULAR[f], o = some(r, [...LETTERS].filter((x) => x !== reg), 2)
    return [`fnr|${f}`, pick(r, `${f} היא אות סופית. איזו אות היא באמצע מילה?`, { g: reg }, o.map((g) => ({ g })), `${f} היא ${LETTER_NAME[reg]} סופית. באמצע מילה כותבים ${reg}.`, { kind: 'tile', tile: { g: f } })]
  }),
]

/* ───────── reading whole words ───────── */
const LONG = Object.values(WORDS_BY_LETTER).flat().filter((x) => !x.w.includes('׳'))
const allW = [...LONG, ...SHORT3]
const plainLetters = (w: string) => [...w]
export const WORDS_STYLES: Style[] = [
  style('wd-pic', 'קוראים מילה', ['words'], 'e', (_sp, r) => {
    const w = one(r, LONG), o = some(r, LONG.filter((x) => x !== w && x.w.length === w.w.length), 2)
    if (o.length < 2) return null
    return [`wdp|${w.w}`, pick(r, 'קוראים את המילה ובוחרים תמונה', pic(w), o.map(pic), `${plainLetters(w.w).join(' · ')}: ${nice(w.w)}.`, { kind: 'word', w: w.w })]
  }),
  style('wd-name', 'איזו מילה?', ['words'], 'h', (_sp, r) => {
    const w = one(r, LONG), same = LONG.filter((x) => x !== w && x.w[0] === w.w[0])
    const o = some(r, same.length >= 2 ? same : LONG.filter((x) => x !== w), 2)
    return [`wdn|${w.w}`, pick(r, 'איזו מילה מתאימה לתמונה? כולן מתחילות באותה אות!', { t: w.w }, o.map((x) => ({ t: x.w })), `כתוב ${w.w}.`, { kind: 'tile', tile: pic(w) })]
  }),
  style('wd-last', 'האות האחרונה', ['words', 'finals'], 'h', (_sp, r) => {
    const w = one(r, allW), l = w.w.at(-1)!, o = some(r, [...LETTERS, 'ם', 'ן'].filter((x) => x !== l && !w.w.endsWith(x)), 2)
    return [`wdl|${w.w}`, pick(r, `מה האות האחרונה במילה ${w.w}? קוראים מימין לשמאל, עד הסוף`, { g: l }, o.map((g) => ({ g })), `${w.w} נגמרת ב־${l}.`, { kind: 'word', e: w.e, w: w.w })]
  }),
  style('wd-missing', 'איזו אות חסרה?', ['words'], 't', (_sp, r) => {
    const w = one(r, LONG.filter((x) => x.w.length >= 4)), i = int(r, 1, w.w.length - 2), l = w.w[i]
    const o = [...new Set([...(LOOKALIKE[l] ?? ''), ...some(r, [...LETTERS], 4)])].filter((x) => x !== l && !alike(x, l)).slice(0, 2)
    return [`wdm|${w.w}|${i}`, pick(r, `איזו אות חסרה במילה ${w.w}?`, { g: l }, o.map((g) => ({ g })), `${w.w}: ${plainLetters(w.w).join(' · ')}.`, { kind: 'word', e: w.e, w: w.w, hide: i })]
  }),
  style('wd-count', 'כמה אותיות?', ['words'], 'h', (_sp, r) => {
    const w = one(r, LONG.filter((x) => x.w.length >= 4)), n = w.w.length
    return [`wdc|${w.w}`, pick(r, `כמה אותיות יש במילה ${w.w}?`, { g: String(n) }, [n - 1, n + 1].map((k) => ({ g: String(k) })), `${plainLetters(w.w).join(' · ')}: ${n} אותיות.`, { kind: 'word', w: w.w })]
  }),
  style('wd-odd', 'מה לא שייך?', ['words', 'grammar'], 't', (_sp, r) => {
    const [a, b] = some(r, Object.values(CATS), 2), ins = some(r, a.items, 3), out = one(r, b.items.filter((x) => !a.items.some((y) => y.w === x.w)))
    if (ins.length < 3 || !out) return null
    return [`wdo|${ins.map((x) => x.w).sort().join()}|${out.w}`, pick(r, 'קוראים את המילים. איזו מילה לא שייכת?', { t: nice(out.w) }, ins.map((x) => ({ t: nice(x.w) })), `${ins.map((x) => nice(x.w)).join(', ')} הם ${a.name}. ${nice(out.w)} לא.`)]
  }),
  style('wd-abc', 'לפי האלף־בית', ['words'], 't', (_sp, r) => {
    const ws: Pic[] = []
    for (const w of mix(r, LONG)) { if (ws.length >= 3) break; if (!ws.some((x) => x.w[0] === w.w[0])) ws.push(w) }
    const sorted = [...ws].sort((a, b) => LETTERS.indexOf(a.w[0]) - LETTERS.indexOf(b.w[0]))
    return [`wda|${sorted.map((x) => x.w).join()}`, order('מסדרים את המילים לפי סדר האלף־בית', sorted.map((x) => ({ t: x.w })), `${sorted.map((x) => `${x.w[0]} (${x.w})`).join(', ')}: ככה הן באות באלף־בית.`)]
  }),
]

/* ───────── sentences ───────── */
type Act = { m: string; f: string; q: [string, string]; things: Pic[] }
const ACTS: Act[] = [
  { m: 'אוכל', f: 'אוכלת', q: ['מה {n} אוכל?', 'מה {n} אוכלת?'], things: P('תפוח 🍎, בננה 🍌, פיצה 🍕, גלידה 🍦, עוגה 🎂, ענבים 🍇, גזר 🥕, אבטיח 🍉') },
  { m: 'שותה', f: 'שותה', q: ['מה {n} שותה?', 'מה {n} שותה?'], things: P('חלב 🥛, מיץ 🧃, מים 💧') },
  { m: 'נוסע', f: 'נוסעת', q: ['במה {n} נוסע?', 'במה {n} נוסעת?'], things: [] },
  { m: 'רואה', f: 'רואה', q: ['את מי {n} רואה?', 'את מי {n} רואה?'], things: P('פיל 🐘, ג׳ירפה 🦒, קוף 🐵, ינשוף 🦉, צב 🐢, נמר 🐯, זברה 🦓') },
  { m: 'מצייר', f: 'מציירת', q: ['מה {n} מצייר?', 'מה {n} מציירת?'], things: P('בית 🏠, פרח 🌸, שמש ☀️, עץ 🌳, כוכב ⭐, לב ❤️') },
]
/** Verbs that fit almost any object (you can see or draw anything): never offered as a wrong answer. */
const OPEN_VERBS = ['רואה', 'מצייר']
const RIDES = P('אוטובוס 🚌, רכבת 🚂, מטוס ✈️, אופניים 🚲, סירה ⛵')
const PLACES = ['בגן', 'בבית', 'בפארק', 'בחצר', 'בכיתה']
const SILLY: [string, boolean][] = [
  ['הדג שוחה במים', true], ['הפיל קטן מהעכבר', false], ['בלילה רואים את הירח', true], ['השלג חם מאוד', false], ['לכלב יש ארבע רגליים', true],
  ['החתול נובח', false], ['תפוחים גדלים על עצים', true], ['המכונית עפה בשמיים', false], ['בחורף קר יותר מבקיץ', true], ['לציפור יש כנפיים', true],
  ['הקרח חם', false], ['אנחנו ישנים בלילה', true], ['הפרה נותנת חלב', true], ['הדג הולך ברגליים', false], ['הלימון מתוק כמו סוכר', false],
  ['השמש זורחת בבוקר', true], ['לשבוע יש שבעה ימים', true], ['הצב רץ מהר מכולם', false], ['בים יש מים מלוחים', true], ['לנחש יש רגליים', false],
  ['הגזר כתום', true], ['העננים עשויים מאבן', false], ['תינוק גדול מסבא', false], ['כדור הוא עגול', true],
]
const NUM_M = ['', '', 'שני', 'שלושה', 'ארבעה', 'חמישה']
const MANY: { pl: string; e: string }[] = [{ pl: 'כלבים', e: '🐶' }, { pl: 'פילים', e: '🐘' }, { pl: 'דגים', e: '🐟' }, { pl: 'צבים', e: '🐢' }, { pl: 'ברווזים', e: '🦆' }, { pl: 'ארנבים', e: '🐰' }]
const actThings = (a: Act) => (a.things.length ? a.things : RIDES)
const sentence = (r: R) => {
  const h = hero(r), a = one(r, ACTS), x = one(r, actThings(a))
  const ride = !a.things.length
  const verb = ride ? (h.f ? 'נוסעת ב' : 'נוסע ב') + x.w : `${h.f ? a.f : a.m} ${nice(x.w)}`
  const where = !ride && r() < 0.5 ? ` ${one(r, PLACES)}` : ''
  return { h, a, x, text: `${h.n} ${verb}${where}.`, verb }
}
export const SENTENCE_STYLES: Style[] = [
  style('sn-what', 'קוראים משפט', ['sentence'], 'e', (_sp, r) => {
    const s = sentence(r), o = some(r, actThings(s.a).filter((y) => y !== s.x), 2)
    return [`snw|${s.text}`, pick(r, s.a.q[s.h.f ? 1 : 0].replace('{n}', s.h.n), pic(s.x), o.map(pic), `כתוב: "${s.text}"`, txt(s.text))]
  }),
  style('sn-fill', 'משלימים משפט', ['sentence', 'grammar'], 'h', (_sp, r) => {
    const h = hero(r), a = one(r, ACTS.filter((x) => x.things.length)), x = one(r, a.things)
    const others = mix(r, ACTS.filter((y) => y !== a && y.things.length && !y.things.includes(x) && !OPEN_VERBS.includes(y.m))).slice(0, 2).map((y) => (h.f ? y.f : y.m))
    if (others.length < 2) others.push(h.f ? 'נוסעת' : 'נוסע')
    const right = h.f ? a.f : a.m
    if (others.some((o) => o === right)) return null
    return [`snf|${h.n}|${a.m}|${x.w}`, pick(r, 'איזו מילה משלימה את המשפט?', { t: right }, others.map((t) => ({ t })), `${h.n} ${right} ${nice(x.w)}.`, txt(`${h.n} ___ ${nice(x.w)}`))]
  }),
  style('sn-gender', 'הוא או היא?', ['sentence', 'grammar'], 't', (_sp, r) => {
    const h = hero(r), a = one(r, ACTS.filter((x) => x.m !== x.f && x.things.length)), x = one(r, a.things)
    return [`sng|${h.n}|${a.m}|${x.w}`, pick(r, `איך אומרים נכון? ${h.n} ${h.f ? 'היא בת' : 'הוא בן'}.`, { t: h.f ? a.f : a.m }, [{ t: h.f ? a.m : a.f }], h.f ? `${h.n} היא בת, אז אומרים "${a.f}".` : `${h.n} הוא בן, אז אומרים "${a.m}".`, txt(`${h.n} ___ ${nice(x.w)}`))]
  }),
  style('sn-order', 'בונים משפט', ['sentence'], 't', (_sp, r) => {
    const s = sentence(r), words = s.text.replace('.', '').split(' ')
    if (words.length < 3 || new Set(words).size !== words.length) return null
    return [`sno|${s.text}`, order('מסדרים את המילים למשפט', words.map((t) => ({ t })), `"${s.text}"`)]
  }),
  style('sn-true', 'נכון או לא?', ['sentence', 'riddle'], 'h', (_sp, r) => {
    const [t, ok] = one(r, SILLY)
    return [`snt|${t}`, pick(r, 'קוראים את המשפט. זה נכון?', ok ? YES : NO, [ok ? NO : YES], ok ? 'נכון!' : 'לא נכון! ככה זה לא קורה.', txt(`${t}.`))]
  }),
  style('sn-many', 'כמה כתוב?', ['sentence'], 'h', (_sp, r) => {
    const m = one(r, MANY), n = int(r, 2, 5), o = one(r, MANY.filter((x) => x !== m))
    const wr: Tile[] = [{ many: { e: m.e, n: n === 2 ? 3 : n - 1 } }, { many: { e: o.e, n } }]
    return [`snm|${m.pl}|${n}`, pick(r, 'קוראים ובוחרים את התמונה המתאימה', { many: { e: m.e, n } }, wr, `כתוב ${NUM_M[n]} ${m.pl}: ${n} ${m.pl}.`, txt(`בחצר יש ${NUM_M[n]} ${m.pl}.`))]
  }),
]

/* ───────── grammar ───────── */
const PLURALS: [string, string, string][] = [
  ['ילד', 'ילדים', '👦'], ['ילדה', 'ילדות', '👧'], ['כלב', 'כלבים', '🐶'], ['ספר', 'ספרים', '📖'], ['עץ', 'עצים', '🌳'], ['פרח', 'פרחים', '🌸'],
  ['בית', 'בתים', '🏠'], ['שולחן', 'שולחנות', '🍽️'], ['חלון', 'חלונות', '🪟'], ['כיסא', 'כיסאות', '🪑'], ['ביצה', 'ביצים', '🥚'], ['יד', 'ידיים', '✋'],
  ['רגל', 'רגליים', '🦵'], ['עין', 'עיניים', '👁️'], ['אוזן', 'אוזניים', '👂'], ['דג', 'דגים', '🐟'], ['סוס', 'סוסים', '🐴'], ['ציפור', 'ציפורים', '🐦'],
  ['מכונית', 'מכוניות', '🚗'], ['עוגה', 'עוגות', '🎂'], ['כדור', 'כדורים', '⚽'], ['אישה', 'נשים', '👩'], ['איש', 'אנשים', '👨'], ['עיר', 'ערים', '🏙️'],
  ['לילה', 'לילות', '🌙'], ['שן', 'שיניים', '🦷'], ['כוכב', 'כוכבים', '⭐'],
]
const FIN2REG: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' }
/** A final letter turns regular before an ending: עין → עינים (a wrong plural, but a real-looking one). */
const stem = (s: string) => s.slice(0, -1) + (FIN2REG[s.at(-1)!] ?? s.at(-1))
const naive = (s: string) => (s.endsWith('ה') ? s.slice(0, -1) + 'ות' : stem(s) + 'ים')
const naive2 = (s: string) => (s.endsWith('ה') ? s.slice(0, -1) + 'ים' : stem(s) + 'ות')
const OPP: [string, string][] = [['גדול', 'קטן'], ['חם', 'קר'], ['יום', 'לילה'], ['למעלה', 'למטה'], ['מהר', 'לאט'], ['שמח', 'עצוב'], ['פתוח', 'סגור'], ['ארוך', 'קצר'],
  ['כבד', 'קל'], ['רטוב', 'יבש'], ['חדש', 'ישן'], ['מלא', 'ריק'], ['רחוק', 'קרוב'], ['ראשון', 'אחרון'], ['נקי', 'מלוכלך'], ['חזק', 'חלש'], ['גבוה', 'נמוך'],
  ['רך', 'קשה'], ['בפנים', 'בחוץ'], ['לפני', 'אחרי'], ['שקט', 'רועש'], ['זקן', 'צעיר'], ['מתוק', 'חמוץ'], ['אור', 'חושך']]
const SAME: [string, string][] = [['גדול', 'ענק'], ['קטן', 'זעיר'], ['שמח', 'עליז'], ['מהיר', 'זריז'], ['חכם', 'נבון'], ['יפה', 'נאה'], ['מתנה', 'שי'],
  ['להסתכל', 'להביט'], ['לדבר', 'לומר'], ['אמיץ', 'גיבור'], ['רעב', 'רוצה לאכול'], ['עייף', 'רוצה לישון'], ['לרוץ', 'למהר'], ['פחד', 'מורא']]
const ADJ: [string, string][] = [['גבוה', 'גבוהה'], ['שמח', 'שמחה'], ['קטן', 'קטנה'], ['חכם', 'חכמה'], ['מהיר', 'מהירה'], ['חזק', 'חזקה'], ['גדול', 'גדולה'], ['יפה', 'יפה']]
const NOUNS: [string, boolean, string][] = [['הילדה', true, '👧'], ['הילד', false, '👦'], ['הכלב', false, '🐶'], ['הפרה', true, '🐄'], ['המכונית', true, '🚗'],
  ['האוטובוס', false, '🚌'], ['הארנבת', true, '🐰'], ['הפיל', false, '🐘'], ['הרכבת', true, '🚂'], ['הסוס', false, '🐴']]
const TENSE: [string, string, string, string][] = [ // past, present, future, rest of the sentence
  ['שיחקתי', 'משחק', 'אשחק', 'בכדור'], ['קראתי', 'קורא', 'אקרא', 'ספר'], ['כתבתי', 'כותב', 'אכתוב', 'מכתב'], ['ציירתי', 'מצייר', 'אצייר', 'פרח'],
  ['שתיתי', 'שותה', 'אשתה', 'מיץ'], ['רצתי', 'רץ', 'ארוץ', 'בפארק'], ['קפצתי', 'קופץ', 'אקפוץ', 'בחבל'], ['שרתי', 'שר', 'אשיר', 'שיר'], ['ישנתי', 'ישן', 'אישן', 'אצל סבתא'],
  ['הלכתי', 'הולך', 'אלך', 'לים'], ['בניתי', 'בונה', 'אבנה', 'מגדל'], ['שחיתי', 'שוחה', 'אשחה', 'בבריכה']]
const TIMES = ['אתמול', 'עכשיו', 'מחר']
const kinds = (sp: Spec) => sp.set ?? 'pog'
export const GRAMMAR_STYLES: Style[] = [
  style('gr-plural', 'אחד והרבה', ['grammar'], 'h', (sp, r) => {
    if (!kinds(sp).includes('p')) return null
    const [s, p, e] = one(r, PLURALS), wr = [...new Set([naive(s), naive2(s), s])].filter((x) => x !== p).slice(0, 2)
    return [`grp|${s}`, pick(r, `אחד: ${s}. הרבה: ?`, { t: p }, wr.map((t) => ({ t })), `אחד ${s}, הרבה ${p}.`, { kind: 'row', items: [{ e }, { e: '➡️' }, { many: { e, n: 3 } }] })]
  }),
  style('gr-single', 'מהרבה לאחד', ['grammar'], 't', (sp, r) => {
    if (!kinds(sp).includes('p')) return null
    const [s, p, e] = one(r, PLURALS), wr = [...new Set([p.replace(/(ים|ות)$/, ''), p.replace(/(ים|ות)$/, 'ה'), p])].filter((x) => x !== s && x.length > 1).slice(0, 2)
    if (wr.length < 2) return null
    return [`grs|${s}`, pick(r, `הרבה: ${p}. אחד: ?`, { t: s }, wr.map((t) => ({ t })), `הרבה ${p}, אחד ${s}.`, { kind: 'tile', tile: { e } })]
  }),
  style('gr-opp', 'מה ההפך?', ['grammar'], 'h', (sp, r) => {
    if (!kinds(sp).includes('o')) return null
    const pair = one(r, OPP), flip = r() < 0.5, [w, ans] = flip ? [pair[1], pair[0]] : pair
    const o = some(r, OPP.filter((x) => x !== pair).flat(), 2)
    return [`gro|${w}`, pick(r, `מה ההפך של "${w}"?`, { t: ans }, o.map((t) => ({ t })), `${w} ← → ${ans}`)]
  }),
  style('gr-gender', 'זכר ונקבה', ['grammar'], 'h', (sp, r) => {
    if (!kinds(sp).includes('g')) return null
    const [n, f, e] = one(r, NOUNS), thing = ['המכונית', 'האוטובוס', 'הרכבת'].includes(n)
    const fits = ADJ.filter(([m, ff]) => m !== ff && (!thing || ['גדול', 'קטן', 'מהיר', 'חזק'].includes(m)))
    const [am, af] = one(r, fits), other = one(r, fits.filter(([m]) => m !== am))
    return [`grg|${n}|${am}`, pick(r, 'איזו מילה מתאימה?', { t: f ? af : am }, [{ t: f ? am : af }, { t: f ? other[0] : other[1] }].filter((x) => x.t !== (f ? af : am)), f ? `${n} היא נקבה, אז "${af}".` : `${n} הוא זכר, אז "${am}".`, txt(`${n} ${e} ___`))]
  }),
  style('gr-tense', 'עבר, הווה, עתיד', ['grammar'], 't', (sp, r) => {
    if (!kinds(sp).includes('t')) return null
    const row = one(r, TENSE), i = int(r, 0, 2)
    return [`grt|${row[0]}|${i}`, pick(r, 'איזו מילה מתאימה?', { t: row[i] }, row.slice(0, 3).filter((_, k) => k !== i).map((t) => ({ t })), `${TIMES[i]} = ${['עבר', 'הווה', 'עתיד'][i]}: "${TIMES[i]} אני ${row[i]} ${row[3]}".`, txt(`${TIMES[i]} אני ___ ${row[3]}`))]
  }),
  style('gr-same', 'אותו דבר', ['grammar'], 't', (sp, r) => {
    if (!kinds(sp).includes('s')) return null
    const [a, b] = one(r, SAME), o = some(r, OPP.flat().filter((x) => x !== a && x !== b), 2)
    return [`grm|${a}`, pick(r, `איזו מילה אומרת כמעט אותו דבר כמו "${a}"?`, { t: b }, o.map((t) => ({ t })), `"${a}" ו"${b}" אומרות כמעט אותו דבר.`)]
  }),
]

/* ───────── short stories to read and understand ───────── */
const GO = P('לים 🏖️, לפארק 🌳, לגן־החיות 🦒, להר ⛰️, לחווה 🐄')
/** Who you might see in each place. */
const SEEN_AT: Record<string, { pl: string; e: string }[]> = {
  'לים': [{ pl: 'דגים', e: '🐟' }, { pl: 'סרטנים', e: '🦀' }, { pl: 'שחפים', e: '🐦' }],
  'לפארק': [{ pl: 'כלבים', e: '🐶' }, { pl: 'ברווזים', e: '🦆' }, { pl: 'פרפרים', e: '🦋' }],
  'לגן־החיות': [{ pl: 'פילים', e: '🐘' }, { pl: 'קופים', e: '🐵' }, { pl: 'אריות', e: '🦁' }],
  'להר': [{ pl: 'ציפורים', e: '🐦' }, { pl: 'עזים', e: '🐐' }, { pl: 'פרפרים', e: '🦋' }],
  'לחווה': [{ pl: 'סוסים', e: '🐴' }, { pl: 'ברווזים', e: '🦆' }, { pl: 'ארנבים', e: '🐰' }],
}
const WITH = P('אמא 👩, סבא 👴, הכלב 🐶, סבתא 👵, אבא 👨')
const FOUND: { w: string; f: boolean; e: string }[] = [{ w: 'כדור', f: false, e: '⚽' }, { w: 'בובה', f: true, e: '🪆' }, { w: 'עפיפון', f: false, e: '🪁' }, { w: 'כובע', f: false, e: '🧢' }, { w: 'מטרייה', f: true, e: '☂️' }]
const COLS = ['אדום', 'כחול', 'צהוב', 'ירוק', 'סגול', 'כתום']
function tale(r: R) {
  const h = hero(r), go = one(r, GO), wi = one(r, WITH.filter((x) => !(go.w.includes('חיות') && x.w === 'הכלב'))), m = one(r, SEEN_AT[go.w] ?? MANY), n = int(r, 2, 5), fd = one(r, FOUND), c = one(r, COLS)
  const color = fd.f ? COLOR_F[c] : c
  const sawFirst = r() < 0.5
  const saw = `${v(h, 'הוא ראה', 'היא ראתה')} ${NUM_M[n]} ${m.pl}`, found = `${v(h, 'הוא מצא', 'היא מצאה')} ${fd.w} ${color}`
  const text = `${h.n} ${v(h, 'הלך', 'הלכה')} ${nice(go.w)} עם ${wi.w}. ${sawFirst ? `שם ${saw}. אחר כך ${found}.` : `קודם ${found}. אחר כך ${saw}.`}`
  return { h, go, wi, m, n, fd, c, text, sawFirst, key: `${h.n}|${go.w}|${wi.w}|${m.pl}${n}|${fd.w}${c}|${sawFirst}` }
}
export const READING_STYLES: Style[] = [
  style('rc-where', 'לאן הלכו?', ['reading'], 'h', (_sp, r) => {
    const t = tale(r)
    return [`rcw|${t.key}`, pick(r, `קוראים את הסיפור. לאן ${v(t.h, 'הלך', 'הלכה')} ${t.h.n}?`, pic(t.go), some(r, GO.filter((x) => x !== t.go), 2).map(pic), `כתוב: "${v(t.h, 'הלך', 'הלכה')} ${nice(t.go.w)}".`, txt(t.text))]
  }),
  style('rc-with', 'עם מי?', ['reading'], 'h', (_sp, r) => {
    const t = tale(r)
    return [`rcm|${t.key}`, pick(r, `עם מי ${v(t.h, 'הלך', 'הלכה')} ${t.h.n}?`, pic(t.wi), some(r, WITH.filter((x) => x !== t.wi), 2).map(pic), `כתוב: "עם ${t.wi.w}".`, txt(t.text))]
  }),
  style('rc-many', 'כמה?', ['reading'], 't', (_sp, r) => {
    const t = tale(r)
    return [`rcn|${t.key}`, pick(r, `כמה ${t.m.pl} ${v(t.h, 'ראה', 'ראתה')} ${t.h.n}?`, { g: String(t.n) }, [2, 3, 4, 5].filter((x) => x !== t.n).slice(0, 2).map((x) => ({ g: String(x) })), `כתוב "${NUM_M[t.n]} ${t.m.pl}": זה ${t.n}.`, txt(t.text))]
  }),
  style('rc-color', 'באיזה צבע?', ['reading'], 't', (_sp, r) => {
    const t = tale(r), o = some(r, COLS.filter((x) => x !== t.c), 2)
    const tile = (c: string): Tile => ({ shape: 'circle', color: COLOR_HEX[c], t: t.fd.f ? COLOR_F[c] : c })
    return [`rcc|${t.key}`, pick(r, `באיזה צבע ${t.fd.f ? 'הייתה' : 'היה'} ה${t.fd.w}?`, tile(t.c), o.map(tile), `כתוב: "${t.fd.w} ${t.fd.f ? COLOR_F[t.c] : t.c}".`, txt(t.text))]
  }),
  style('rc-first', 'מה קרה קודם?', ['reading', 'story'], 't', (_sp, r) => {
    const t = tale(r)
    const sawIt = `${v(t.h, 'ראה', 'ראתה')} ${t.m.pl}`, foundIt = `${v(t.h, 'מצא', 'מצאה')} ${t.fd.w}`
    const [a, b] = t.sawFirst ? [sawIt, foundIt] : [foundIt, sawIt]
    const { options, correct } = choices(r, { t: a }, [{ t: b }])
    return [`rcf|${t.key}`, { kind: 'pick', q: he(`מה קרה קודם? ${t.h.n}...`), show: txt(t.text), options, correct, why: he(`קודם ${a}, ואחר כך ${b}.`) }]
  }),
  style('rc-found', 'מה מצאו?', ['reading'], 'h', (_sp, r) => {
    const t = tale(r)
    return [`rcd|${t.key}`, pick(r, `מה ${v(t.h, 'מצא', 'מצאה')} ${t.h.n}?`, { e: t.fd.e }, some(r, FOUND.filter((x) => x !== t.fd), 2).map((x) => ({ e: x.e })), `כתוב: "${v(t.h, 'מצא', 'מצאה')} ${t.fd.w}".`, txt(t.text))]
  }),
]

/* ───────── more kinds of stories: something lost, a whole day, a feeling and its reason ───────── */
type Lost = { w: string; f: boolean; e: string }
const LOST: Lost[] = [{ w: 'כדור', f: false, e: '⚽' }, { w: 'בובה', f: true, e: '🪆' }, { w: 'כובע', f: false, e: '🧢' }, { w: 'מפתח', f: false, e: '🔑' }, { w: 'מחברת', f: true, e: '📓' }, { w: 'דובי', f: false, e: '🧸' }]
const LOOKED = ['מתחת למיטה', 'מתחת לשולחן', 'מאחורי הספה', 'בתוך הארון']
const FOUND_IN = ['בתיק', 'בגינה', 'באמבטיה', 'בארגז הצעצועים', 'במכונית של אבא']
function lostStory(r: R) {
  const h = hero(r), x = one(r, LOST), [l1, l2] = some(r, LOOKED, 2), at = one(r, FOUND_IN)
  const it = x.f ? 'אותה' : 'אותו', was = x.f ? 'הייתה' : 'היה'
  const text = `${h.n} ${v(h, 'חיפש', 'חיפשה')} את ה${x.w} ${v(h, 'שלו', 'שלה')}. ${v(h, 'הוא חיפש', 'היא חיפשה')} ${l1} ו${l2}, אבל ה${x.w} לא ${was} שם. בסוף ${v(h, 'הוא מצא', 'היא מצאה')} ${it} ${at}, ו${v(h, 'הוא שמח', 'היא שמחה')} מאוד.`
  return { h, x, l1, l2, at, text, key: `${h.n}|${x.w}|${l1}|${l2}|${at}` }
}
type Plot = { cause: [string, string]; feel: 'sad' | 'happy'; fix: [string, string] }
/** [what happened (he, she)], how they felt, [what came next (he, she)]. */
const PLOTS: Plot[] = [
  { cause: ['המגדל שהוא בנה מקוביות נפל', 'המגדל שהיא בנתה מקוביות נפל'], feel: 'sad', fix: ['חבר עזר לו לבנות מגדל חדש', 'חברה עזרה לה לבנות מגדל חדש'] },
  { cause: ['הבלון שלו עף לשמיים', 'הבלון שלה עף לשמיים'], feel: 'sad', fix: ['סבא נתן לו בלון חדש וקשר אותו ליד', 'סבא נתן לה בלון חדש וקשר אותו ליד'] },
  { cause: ['התחיל גשם באמצע הפיקניק', 'התחיל גשם באמצע הפיקניק'], feel: 'sad', fix: ['כולם נכנסו הביתה ושיחקו משחק קופסה', 'כולם נכנסו הביתה ושיחקו משחק קופסה'] },
  { cause: ['הוא קיבל אופניים חדשים ליום ההולדת', 'היא קיבלה אופניים חדשים ליום ההולדת'], feel: 'happy', fix: ['הוא אמר תודה ויצא לרכוב', 'היא אמרה תודה ויצאה לרכוב'] },
  { cause: ['הכלב שלו חזר הביתה אחרי שהלך לאיבוד', 'הכלב שלה חזר הביתה אחרי שהלך לאיבוד'], feel: 'happy', fix: ['הוא חיבק אותו חזק', 'היא חיבקה אותו חזק'] },
  { cause: ['החבר הכי טוב שלו עבר לגור בעיר אחרת', 'החברה הכי טובה שלה עברה לגור בעיר אחרת'], feel: 'sad', fix: ['הם דיברו בטלפון וקבעו להיפגש', 'הן דיברו בטלפון וקבעו להיפגש'] },
]
const FEEL: Record<Plot['feel'], [string, string, string]> = { sad: ['😢', 'עצוב', 'עצובה'], happy: ['😀', 'שמח', 'שמחה'] }
const OTHER_FEEL: [string, string, string][] = [['😠', 'כועס', 'כועסת'], ['😨', 'מפחד', 'מפחדת']]
function plotStory(r: R) {
  const h = hero(r), i = int(r, 0, PLOTS.length - 1), p = PLOTS[i], g = h.f ? 1 : 0
  const fe = FEEL[p.feel]
  const text = `${h.n} ${v(h, 'היה', 'הייתה')} ${fe[g + 1]} כי ${p.cause[g]}. אחר כך ${p.fix[g]}.`
  return { h, i, p, g, fe, text, key: `${h.n}|${i}` }
}
const WHEN = [{ e: '🌅', t: 'בבוקר' }, { e: '☀️', t: 'בצהריים' }, { e: '🌙', t: 'בערב' }]
const DAY_ACTS: [string, string][] = [['אכל דייסה', 'אכלה דייסה'], ['הלך לגן', 'הלכה לגן'], ['שיחק בכדור', 'שיחקה בכדור'], ['קרא ספר', 'קראה ספר'], ['צייר פרח', 'ציירה פרח'], ['שתה חלב', 'שתתה חלב'], ['ביקר את סבתא', 'ביקרה את סבתא'], ['בנה מגדל', 'בנתה מגדל']]
function dayStory(r: R) {
  const h = hero(r), acts = some(r, DAY_ACTS, 3), g = h.f ? 1 : 0
  const text = acts.map((a, k) => `${WHEN[k].t} ${k === 0 ? h.n : v(h, 'הוא', 'היא')} ${a[g]}.`).join(' ')
  return { h, acts, g, text, key: `${h.n}|${acts.map((a) => a[0]).join()}` }
}
export const STORY_STYLES: Style[] = [
  style('rc-lost-what', 'מה חיפשו?', ['reading'], 'e', (_sp, r) => {
    const t = lostStory(r)
    return [`rclw|${t.key}`, pick(r, `מה ${v(t.h, 'חיפש', 'חיפשה')} ${t.h.n}?`, { e: t.x.e }, some(r, LOST.filter((y) => y !== t.x), 2).map((y) => ({ e: y.e })), `כתוב: "${v(t.h, 'חיפש', 'חיפשה')} את ה${t.x.w}".`, txt(t.text))]
  }),
  style('rc-lost-where', 'איפה מצאו?', ['reading'], 'h', (_sp, r) => {
    const t = lostStory(r)
    return [`rclr|${t.key}`, pick(r, `איפה ${v(t.h, 'מצא', 'מצאה')} ${t.h.n} את ה${t.x.w}?`, { t: t.at }, [{ t: t.l1 }, { t: one(r, FOUND_IN.filter((y) => y !== t.at)) }], `קודם ${v(t.h, 'חיפש', 'חיפשה')} ${t.l1}, אבל ${v(t.h, 'מצא', 'מצאה')} ${t.at}.`, txt(t.text))]
  }),
  style('rc-lost-not', 'איפה לא היה?', ['reading'], 't', (_sp, r) => {
    const t = lostStory(r)
    return [`rcln|${t.key}`, pick(r, `באיזה מקום ${v(t.h, 'הוא חיפש', 'היא חיפשה')}, וה${t.x.w} לא ${t.x.f ? 'הייתה' : 'היה'} שם?`, { t: t.l2 }, [{ t: t.at }, { t: one(r, LOOKED.filter((y) => y !== t.l1 && y !== t.l2)) }], `${v(t.h, 'חיפש', 'חיפשה')} ${t.l1} ו${t.l2}, ושם לא ${v(t.h, 'מצא', 'מצאה')}.`, txt(t.text))]
  }),
  style('rc-why', 'למה?', ['reading'], 't', (_sp, r) => {
    const t = plotStory(r), others = some(r, PLOTS.filter((x) => x !== t.p), 2)
    return [`rcy|${t.key}`, pick(r, `למה ${t.h.n} ${v(t.h, 'היה', 'הייתה')} ${t.fe[t.g + 1]}?`, { t: t.p.cause[t.g] }, others.map((x) => ({ t: x.cause[t.g] })), `כתוב: "${t.fe[t.g + 1]} כי ${t.p.cause[t.g]}". המילה "כי" אומרת לנו למה.`, txt(t.text))]
  }),
  style('rc-feel', 'איך הרגישו?', ['reading', 'feelings'], 'h', (_sp, r) => {
    const t = plotStory(r), wrong = [t.p.feel === 'sad' ? FEEL.happy : FEEL.sad, one(r, OTHER_FEEL)]
    const face = (f: [string, string, string]) => ({ e: f[0], t: f[t.g + 1] })
    return [`rcf2|${t.key}`, pick(r, `איך ${v(t.h, 'הרגיש', 'הרגישה')} ${t.h.n}?`, face(t.fe), wrong.map(face), `כתוב: "${v(t.h, 'היה', 'הייתה')} ${t.fe[t.g + 1]}".`, txt(t.text))]
  }),
  style('rc-then', 'מה קרה אחר כך?', ['reading', 'story'], 't', (_sp, r) => {
    const t = plotStory(r), others = some(r, PLOTS.filter((x) => x !== t.p), 2)
    return [`rct|${t.key}`, pick(r, 'מה קרה אחר כך?', { t: t.p.fix[t.g] }, others.map((x) => ({ t: x.fix[t.g] })), `כתוב: "אחר כך ${t.p.fix[t.g]}".`, txt(t.text))]
  }),
  style('rc-when', 'מתי?', ['reading', 'days'], 'h', (_sp, r) => {
    const t = dayStory(r), k = int(r, 0, 2)
    return [`rcwh|${t.key}|${k}`, pick(r, `מתי ${t.h.n} ${t.acts[k][t.g]}?`, WHEN[k], WHEN.filter((_, j) => j !== k), `כתוב: "${WHEN[k].t} ${t.h.n} ${t.acts[k][t.g]}".`, txt(t.text))]
  }),
  style('rc-day-what', 'מה עשו?', ['reading'], 't', (_sp, r) => {
    const t = dayStory(r), k = int(r, 0, 2), other = one(r, DAY_ACTS.filter((a) => !t.acts.includes(a)))
    return [`rcdw|${t.key}|${k}`, pick(r, `מה ${v(t.h, 'עשה', 'עשתה')} ${t.h.n} ${WHEN[k].t}?`, { t: t.acts[k][t.g] }, [...t.acts.filter((_, j) => j !== k).slice(0, 1), other].map((a) => ({ t: a[t.g] })), `כתוב: "${WHEN[k].t} ${t.h.n} ${t.acts[k][t.g]}".`, txt(t.text))]
  }),
]

export const READ_SCHOOL_STYLES: Style[] = [...NIKUD_STYLES, ...FINAL_STYLES, ...WORDS_STYLES, ...SENTENCE_STYLES, ...GRAMMAR_STYLES, ...READING_STYLES, ...STORY_STYLES]
