/* Question styles about the child's world: stories and time, seasons and holidays, feelings, friends,
   school — and the riddle pool: shadows, peekaboo, true-or-false, "who am I?" and more. */

import { DAYS, FEELINGS, FEEL_THINK, ROUTINE, SCHOOLBAG, SEASONS, SOCIAL, STORIES, type Pic } from '../kdata'
import {
  BABIES, CLASS_TIME, DAYTIME, DAYTIME_NAMES, FOODS, HEALTHY, HELPERS, HOLIDAYS, HOMES, JOBS, MANNERS, OUTLINES, PEEKERS, RIDDLES,
  SAFE, SCHOOL_FOR, SENSES, SOUNDS, SPOT, TREATS, TRUE_FALSE, UNSAFE, USES, WEAR, WEATHER,
} from './data'
import { int, match, mix, nice, one, order, pick, picTile, some, sort, style, tapall, YES, NO, type Style } from './util'

const P = (list: string): Pic[] => list.trim().split(/\s*,\s*/).map((x) => { const i = x.lastIndexOf(' '); return { w: x.slice(0, i), e: x.slice(i + 1) } })
const ALL_STORIES: Pic[][] = [
  ...STORIES, ROUTINE,
  P('זרע 🌰, נבט 🌱, פרח 🌻'), P('תינוק 👶, ילד 🧒, מבוגר 🧑, סבא 👴'), P('לוקחים מברשת 🪥, שמים משחה 🧴, מצחצחים 😁'),
  P('שותלים 🌱, משקים 💧, קוטפים עגבנייה 🍅'), P('קוטפים תפוח 🍎, שוטפים 🚰, אוכלים 😋'), P('מתקלחים 🚿, לובשים פיג׳מה 👕, הולכים לישון 🛏️'),
  P('קונים כרטיס 🎟️, עולים לרכבת 🚂, יורדים בתחנה 🚉'), P('מנפחים בלון 🎈, קושרים חוט 🧵, משחקים 🥳'),
]

export const STORY_STYLES: Style[] = [
  style('st-order', 'מה קרה קודם?', ['story'], 'e', (_sp, r) => {
    const i = int(r, 0, ALL_STORIES.length - 1), s = ALL_STORIES[i]
    return [`st-order|${i}`, order('מה קרה קודם? מסדרים לפי הסדר', s.slice(0, 4).map(picTile), s.map((x) => nice(x.w)).join(', '))]
  }),
  style('st-before', 'מה קרה ממש לפני?', ['story'], 't', (_sp, r) => {
    const i = int(r, 0, ALL_STORIES.length - 1), s = ALL_STORIES[i], k = int(r, 1, s.length - 1)
    const o = s.filter((_, j) => j !== k - 1 && j !== k).slice(0, 2)
    if (!o.length) return null
    return [`st-before|${i}|${k}`, pick(r, 'מה קרה ממש לפני זה?', picTile(s[k - 1]), o.map(picTile), `קודם ${nice(s[k - 1].w)}, ואחר כך ${nice(s[k].w)}.`, { kind: 'tile', tile: picTile(s[k]) })]
  }),
  style('st-after', 'מה יקרה אחר כך?', ['story'], 't', (_sp, r) => {
    const i = int(r, 0, ALL_STORIES.length - 1), s = ALL_STORIES[i], k = int(r, 0, s.length - 2)
    const o = s.filter((_, j) => j !== k + 1 && j !== k).slice(0, 2)
    if (!o.length) return null
    return [`st-after|${i}|${k}`, pick(r, 'מה יקרה מיד אחרי זה?', picTile(s[k + 1]), o.map(picTile), `אחרי ${nice(s[k].w)} בא ${nice(s[k + 1].w)}.`, { kind: 'tile', tile: picTile(s[k]) })]
  }),
  style('st-first', 'מה היה בהתחלה?', ['story'], 'h', (_sp, r) => {
    const i = int(r, 0, ALL_STORIES.length - 1), s = ALL_STORIES[i]
    return [`st-first|${i}`, pick(r, 'מה היה הכי בהתחלה?', picTile(s[0]), s.slice(1, 3).map(picTile), `הכול התחיל ב${nice(s[0].w)}.`)]
  }),
  style('st-last', 'איך זה נגמר?', ['story'], 'h', (_sp, r) => {
    const i = int(r, 0, ALL_STORIES.length - 1), s = ALL_STORIES[i]
    return [`st-last|${i}`, pick(r, 'מה קרה בסוף?', picTile(s[s.length - 1]), s.slice(0, 2).map(picTile), `בסוף: ${nice(s[s.length - 1].w)}.`)]
  }),
]

const day = (t: string) => ({ t })
export const TIME_STYLES: Style[] = [
  style('dy-order', 'ימי השבוע לפי הסדר', ['days'], 'e', (_sp, r) => {
    const st = int(r, 0, 3)
    return [`dy-order|${st}`, order('מסדרים את ימי השבוע', DAYS.slice(st, st + 4).map(day), DAYS.join(', '))]
  }),
  style('dy-after', 'איזה יום בא אחרי?', ['days'], 'h', (_sp, r) => {
    const i = int(r, 0, 5)
    return [`dy-after|${i}`, pick(r, `איזה יום בא אחרי יום ${DAYS[i]}?`, day(DAYS[i + 1]), some(r, DAYS.filter((_, k) => k !== i + 1 && k !== i), 2).map(day), `אחרי ${DAYS[i]} בא ${DAYS[i + 1]}.`)]
  }),
  style('dy-yesterday', 'מה היה אתמול?', ['days'], 't', (_sp, r) => {
    const i = int(r, 1, 5)
    return [`dy-yesterday|${i}`, pick(r, `היום יום ${DAYS[i]}. איזה יום היה אתמול?`, day(DAYS[i - 1]), [day(DAYS[i + 1]), day(DAYS[(i + 3) % 7])], `לפני ${DAYS[i]} בא ${DAYS[i - 1]}.`)]
  }),
  style('dy-tomorrow', 'מה יהיה מחר?', ['days'], 'h', (_sp, r) => {
    const i = int(r, 0, 5)
    return [`dy-tomorrow|${i}`, pick(r, `היום יום ${DAYS[i]}. איזה יום יהיה מחר?`, day(DAYS[i + 1]), [day(DAYS[(i + 6) % 7]), day(DAYS[(i + 3) % 7])], `מחר זה היום שאחרי: ${DAYS[i + 1]}.`)]
  }),
  style('dy-shabbat', 'יום המנוחה', ['days'], 'h', (_sp, r) => [
    'dy-shabbat', pick(r, 'באיזה יום אין גן ואין בית ספר?', { t: 'שבת', e: '🕯️' }, some(r, DAYS.slice(0, 5), 2).map(day), 'בשבת נחים בבית.'),
  ]),
  style('dy-when', 'מתי ביום?', ['days', 'story'], 'e', (_sp, r) => {
    const x = one(r, DAYTIME)
    return [`dy-when|${x.w}`, pick(r, `מתי ${x.w}?`, DAYTIME_NAMES[x.t], DAYTIME_NAMES.filter((_, k) => k !== x.t), `${x.w} ב${DAYTIME_NAMES[x.t].t}.`, { kind: 'tile', tile: { e: x.e } })]
  }),
  style('dy-daynight', 'ביום או בלילה?', ['days'], 'h', (_sp, r) => {
    const day0 = some(r, DAYTIME.filter((x) => x.t < 2), 3), night = some(r, DAYTIME.filter((x) => x.t === 2), 3)
    return [`dy-daynight|${[...day0, ...night].map((x) => x.w).sort().join()}`, sort('מה עושים ביום, ומה בלילה?', ['☀️ ביום', '🌙 בלילה'], [...day0.map((x) => ({ ...x, b: 0 })), ...night.map((x) => ({ ...x, b: 1 }))], 'ביום פעילים, בלילה נחים.')]
  }),
]

const ST = (s: (typeof SEASONS)[number]) => ({ e: s.e, t: s.n })
export const SEASON_STYLES: Style[] = [
  style('se-clue', 'באיזו עונה?', ['seasons'], 'e', (_sp, r) => {
    const s = one(r, SEASONS), clue = one(r, s.clues)
    return [`se-clue|${clue}`, pick(r, `${clue}. באיזו עונה?`, ST(s), some(r, SEASONS.filter((x) => x !== s), 2).map(ST), `זה קורה ב${s.n}.`)]
  }),
  style('se-next', 'איזו עונה באה אחרי?', ['seasons'], 't', (_sp, r) => {
    const i = int(r, 0, 3), nx = SEASONS[(i + 1) % 4]
    return [`se-next|${i}`, pick(r, `איזו עונה באה אחרי ה${SEASONS[i].n}?`, ST(nx), SEASONS.filter((_, k) => k !== (i + 1) % 4 && k !== i).map(ST), 'חורף, אביב, קיץ, סתיו, ושוב חורף.')]
  }),
  style('se-match', 'עונה ומה קורה בה', ['seasons'], 'h', (_sp, r) => {
    const ss = some(r, SEASONS, 3)
    return [`se-match|${ss.map((x) => x.n).sort().join()}`, match('מחברים כל עונה למה שקורה בה', ss.map((x) => [ST(x), { t: one(r, x.clues) }]), 'לכל עונה יש משהו משלה.')]
  }),
  style('se-wear', 'מתי לובשים?', ['seasons'], 'h', (_sp, r) => {
    const x = one(r, WEAR)
    const [w, s] = [SEASONS[0], SEASONS[2]]
    return [`se-wear|${x.w}`, pick(r, `מתי צריך ${x.w}?`, ST(x.s ? s : w), [ST(x.s ? w : s)], `${x.w}: ב${x.s ? 'קיץ' : 'חורף'}.`, { kind: 'tile', tile: { e: x.e } })]
  }),
  style('se-tap', 'מסמנים בגדי עונה', ['seasons'], 'h', (_sp, r) => {
    const s = int(r, 0, 1)
    return [`se-tap|${s}`, tapall(r, s ? 'מסמנים את כל מה שלוקחים ליום חם בקיץ' : 'מסמנים את כל מה שלובשים ביום קר בחורף', some(r, WEAR.filter((x) => x.s === s), 3).map(picTile), some(r, WEAR.filter((x) => x.s !== s), 3).map(picTile), s ? 'בקיץ שומרים על עצמנו מהשמש.' : 'בחורף שומרים על עצמנו חמים.')]
  }),
  style('se-weather', 'מה לוקחים?', ['seasons', 'logic'], 't', (_sp, r) => {
    const x = one(r, WEATHER)
    return [`se-weather|${x.w}`, pick(r, `בחוץ ${x.w}. מה הכי כדאי לקחת?`, picTile(x.need), x.bad.map(picTile), `כש${x.w}, ${x.need.w} עוזר.`, { kind: 'tile', tile: { e: x.e } })]
  }),
  style('se-holiday', 'איזה חג?', ['seasons', 'days', 'riddle'], 'h', (_sp, r) => {
    const h = one(r, HOLIDAYS)
    return [`se-holiday|${h.w}`, pick(r, `באיזה חג ${h.clue}?`, { e: h.e, t: h.w }, some(r, HOLIDAYS.filter((x) => x !== h), 2).map((x) => ({ e: x.e, t: x.w })), `ב${h.w} ${h.clue}.`)]
  }),
]

const SAME_FACE: Record<string, string> = { שמח: '😄', עצוב: '😭', כועס: '😡', מפחד: '😱', מופתע: '😮', עייף: '🥱' }
export const FEEL_STYLES: Style[] = [
  style('fe-face', 'איך הוא מרגיש?', ['feelings'], 'e', (_sp, r) => {
    const f = one(r, FEELINGS)
    return [`fe-face|${f.n}`, pick(r, 'איך הוא מרגיש?', { t: f.n }, some(r, FEELINGS.filter((x) => x !== f), 2).map((x) => ({ t: x.n })), `הוא ${f.n}.`, { kind: 'tile', tile: { e: f.e } })]
  }),
  style('fe-when', 'איך מרגישים כש...?', ['feelings'], 'h', (_sp, r) => {
    const f = one(r, FEELINGS), w = one(r, f.when)
    return [`fe-when|${w}`, pick(r, `${w}. איך מרגישים?`, { e: f.e, t: f.n }, some(r, FEELINGS.filter((x) => x !== f), 2).map((x) => ({ e: x.e, t: x.n })), `מרגישים ${f.n}. כל הרגשות בסדר!`)]
  }),
  style('fe-think', 'מה יעזור?', ['feelings', 'social'], 't', (_sp, r) => {
    const i = int(r, 0, FEEL_THINK.length - 1), f = FEEL_THINK[i]
    const [right, ...rest] = f.opts.map(([e, t]) => ({ e, t }))
    return [`fe-think|${i}`, pick(r, f.q, right, rest, `${right.t}. ככה עוזרים ומבינים אחרים.`)]
  }),
  style('fe-match', 'פרצוף ורגש', ['feelings'], 'h', (_sp, r) => {
    const fs = some(r, FEELINGS, 3)
    return [`fe-match|${fs.map((x) => x.n).sort().join()}`, match('מחברים כל פרצוף לרגש שלו', fs.map((x) => [{ e: x.e }, { t: x.n }]), 'מסתכלים על העיניים ועל הפה.')]
  }),
  style('fe-same', 'מי מרגיש אותו דבר?', ['feelings'], 'h', (_sp, r) => {
    const f = one(r, FEELINGS), o = some(r, FEELINGS.filter((x) => x !== f), 2)
    return [`fe-same|${f.n}`, pick(r, 'מי מרגיש בדיוק כמו הפרצוף הזה?', { e: SAME_FACE[f.n] }, o.map((x) => ({ e: SAME_FACE[x.n] })), `גם הוא ${f.n}!`, { kind: 'tile', tile: { e: f.e } })]
  }),
]

const soc = (s: (typeof SOCIAL)[number]) => { const [right, ...rest] = s.opts.map(([e, t]) => ({ e, t })); return { right, rest } }
export const SOCIAL_STYLES: Style[] = [
  style('so-what', 'מה עושים?', ['social'], 'e', (_sp, r) => {
    const s = one(r, SOCIAL.filter((x) => !x.hard)), { right, rest } = soc(s)
    return [`so-what|${s.q}`, pick(r, s.q, right, rest, `${right.t}. ככה עושים חברים טובים!`)]
  }),
  style('so-class', 'בכיתה', ['social', 'schoolbag'], 'h', (_sp, r) => {
    const s = one(r, SOCIAL.filter((x) => x.hard)), { right, rest } = soc(s)
    return [`so-class|${s.q}`, pick(r, s.q, right, rest, `${right.t}. ככה מתנהגים בכיתה.`)]
  }),
  style('so-manners', 'מה אומרים?', ['social'], 'h', (_sp, r) => {
    const m = one(r, MANNERS)
    return [`so-manners|${m.q}`, pick(r, m.q, picTile(m.a), m.bad.map(picTile), `אומרים: ${m.a.w}`)]
  }),
  style('so-helper', 'מי עוזר לנו?', ['social', 'riddle'], 't', (_sp, r) => {
    const m = one(r, HELPERS)
    return [`so-helper|${m.q}`, pick(r, m.q, picTile(m.a), m.bad.map(picTile), `${m.a.w}: הם יודעים לעזור.`)]
  }),
  style('so-safe', 'מה בטוח?', ['social'], 't', (_sp, r) => {
    const dir = int(r, 0, 1)
    const [good, bad] = dir ? [UNSAFE, SAFE] : [SAFE, UNSAFE]
    return [`so-safe|${dir}`, tapall(r, dir ? 'מסמנים את כל מה שמסוכן לעשות' : 'מסמנים את כל מה שבטוח וחכם לעשות', some(r, good, 3).map(picTile), some(r, bad, 3).map(picTile), dir ? 'את אלה לא עושים, ושומרים על עצמנו!' : 'ככה שומרים על עצמנו.')]
  }),
]

export const SCHOOL_STYLES: Style[] = [
  style('sc-bag', 'מה לוקחים לבית הספר?', ['schoolbag'], 'e', (_sp, r) => {
    const a = some(r, SCHOOLBAG.take, 3), b = some(r, SCHOOLBAG.stay, 3)
    return [`sc-bag|${[...a, ...b].map((x) => x.w).sort().join()}`, sort('מה לוקחים לבית הספר?', ['🎒 לוקחים', '🏠 נשאר בבית'], [...a.map((x) => ({ ...x, b: 0 })), ...b.map((x) => ({ ...x, b: 1 }))], 'בילקוט רק מה שצריך ללמידה, ואוכל.')]
  }),
  style('sc-for', 'מה צריך לשיעור?', ['schoolbag'], 'h', (_sp, r) => {
    const i = int(r, 0, SCHOOL_FOR.length - 1), x = SCHOOL_FOR[i]
    return [`sc-for|${i}`, tapall(r, `${x.q} מסמנים הכול`, x.need.map(picTile), x.not.map(picTile), `צריך: ${x.need.map((p) => p.w).join(', ')}.`)]
  }),
  style('sc-use', 'מה עושים עם זה?', ['schoolbag', 'logic', 'riddle'], 'h', (_sp, r) => {
    const x = one(r, USES)
    return [`sc-use|${x.w}`, pick(r, `מה עושים עם ${x.w}?`, { t: x.v }, some(r, USES.filter((u) => u !== x), 2).map((u) => ({ t: u.v })), `עם ${x.w} ${x.v}.`, { kind: 'tile', tile: { e: x.e } })]
  }),
  style('sc-tool', 'במה משתמשים?', ['schoolbag', 'logic'], 'e', (_sp, r) => {
    const x = one(r, USES)
    return [`sc-tool|${x.w}`, pick(r, `במה משתמשים כש${x.v}?`, picTile(x), some(r, USES.filter((u) => u !== x), 2).map(picTile), `כש${x.v}, משתמשים ב${x.w}.`)]
  }),
  style('sc-recess', 'בשיעור או בהפסקה?', ['schoolbag', 'social'], 'h', (_sp, r) => {
    const a = some(r, CLASS_TIME.filter((x) => !x.when), 3), b = some(r, CLASS_TIME.filter((x) => x.when), 3)
    return [`sc-recess|${[...a, ...b].map((x) => x.w).sort().join()}`, sort('מה עושים בשיעור, ומה בהפסקה?', ['📚 בשיעור', '🛝 בהפסקה'], [...a.map((x) => ({ ...x, b: 0 })), ...b.map((x) => ({ ...x, b: 1 }))], 'בשיעור לומדים, ובהפסקה משחקים ואוכלים.')]
  }),
]

/* ───────── the riddle pool: a surprise question in the middle of any lesson ───────── */
export const RIDDLE_STYLES: Style[] = [
  style('rd-who', 'מי אני?', ['riddle'], 'h', (_sp, r) => {
    const x = one(r, RIDDLES), o = some(r, RIDDLES.filter((y) => y !== x), 2)
    return [`rd-who|${x.w}`, pick(r, `חידה! ${x.q} מי אני?`, { e: x.e }, o.map((y) => ({ e: y.e })), `זה ${x.w}!`)]
  }),
  style('rd-tf', 'נכון או לא נכון?', ['riddle'], 'h', (_sp, r) => {
    const i = int(r, 0, TRUE_FALSE.length - 1), [e, s, ok] = TRUE_FALSE[i]
    return [`rd-tf|${i}`, pick(r, `נכון או לא נכון? ${s}.`, ok ? YES : NO, [ok ? NO : YES], ok ? 'נכון מאוד!' : 'זה לא נכון! איזה מצחיק.', { kind: 'tile', tile: { e } })]
  }),
  style('rd-shadow', 'של מי הצל?', ['riddle'], 't', (_sp, r) => {
    const x = one(r, OUTLINES), o = some(r, OUTLINES.filter((y) => y !== x), 2)
    return [`rd-shadow|${x.e}`, pick(r, 'של מי הצל הזה?', { e: x.e }, o.map((y) => ({ e: y.e })), `זה הצל של ה${x.w}!`, { kind: 'tile', tile: { e: x.e, fx: 'sil' } })]
  }),
  style('rd-shadows', 'מחברים צללים', ['riddle'], 't', (_sp, r) => {
    const xs = some(r, OUTLINES, 3)
    return [`rd-shadows|${xs.map((x) => x.e).sort().join('')}`, match('מחברים כל צל לבעלים שלו', xs.map((x) => [{ e: x.e, fx: 'sil' }, { e: x.e }]), 'מסתכלים על הצורה מבחוץ.')]
  }),
  style('rd-peek', 'מי מציץ?', ['riddle'], 'h', (_sp, r) => {
    const x = one(r, PEEKERS), o = some(r, PEEKERS.filter((y) => y !== x), 2)
    return [`rd-peek|${x.e}`, pick(r, 'מישהו מציץ מאחורי הקיר! מי זה?', { e: x.e }, o.map((y) => ({ e: y.e })), `זה ה${x.w}! רואים את האוזניים והעיניים.`, { kind: 'tile', tile: { e: x.e, fx: 'peek' } })]
  }),
  style('rd-spot', 'מצאו את השונה', ['riddle', 'odd'], 'h', (_sp, r) => {
    const i = int(r, 0, SPOT.length - 1), [a, b] = r() < 0.5 ? SPOT[i] : [SPOT[i][1], SPOT[i][0]]
    return [`rd-spot|${i}`, pick(r, 'עיני נשר! איזה אחד שונה מכל האחרים?', { e: b }, Array(8).fill(0).map(() => ({ e: a })), 'מצאת! הוא דומה, אבל לא אותו דבר.')]
  }),
  style('rd-upside', 'מה הפוך?', ['riddle', 'position'], 'e', (_sp, r) => {
    const xs = some(r, OUTLINES, 4)
    return [`rd-upside|${xs[0].e}`, pick(r, 'מישהו עומד על הראש! מי הפוך?', { e: xs[0].e, fx: 'tilt' }, xs.slice(1).map((x) => ({ e: x.e })), `ה${xs[0].w} הפוך!`)]
  }),
  style('rd-sound', 'מי עושה את הקול?', ['riddle'], 'e', (_sp, r) => {
    const x = one(r, SOUNDS), o = some(r, SOUNDS.filter((y) => y !== x), 2)
    return [`rd-sound|${x.w}`, pick(r, `מי ${x.v}?`, picTile(x), o.map(picTile), `ה${x.w} ${x.v}. בואו נעשה את הקול!`)]
  }),
  style('rd-home', 'איפה הוא גר?', ['riddle'], 'h', (_sp, r) => {
    const i = int(r, 0, HOMES.length - 1), [a, b] = HOMES[i]
    return [`rd-home|${a.w}`, pick(r, `איפה גר ה${a.w}?`, picTile(b), some(r, HOMES.filter((_, k) => k !== i), 2).map((x) => picTile(x[1])), `ה${a.w} גר ב${b.w}.`, { kind: 'tile', tile: picTile(a) })]
  }),
  style('rd-baby', 'איך קוראים לתינוק?', ['riddle'], 't', (_sp, r) => {
    const i = int(r, 0, BABIES.length - 1), [a, b] = BABIES[i]
    return [`rd-baby|${a.w}`, pick(r, `איך קוראים לתינוק של ה${a.w}?`, { t: b }, some(r, BABIES.filter((_, k) => k !== i), 2).map((x) => ({ t: x[1] })), `התינוק של ה${a.w} נקרא ${b}.`, { kind: 'tile', tile: { e: a.e } })]
  }),
  style('rd-food', 'מה הוא אוהב לאכול?', ['riddle'], 'e', (_sp, r) => {
    const i = int(r, 0, FOODS.length - 1), [a, b] = FOODS[i]
    return [`rd-food|${a.w}`, pick(r, `מה ה${a.w} הכי אוהב לאכול?`, picTile(b), some(r, FOODS.filter((_, k) => k !== i), 2).map((x) => picTile(x[1])), `ה${a.w} אוהב ${b.w}. יאמי!`, { kind: 'tile', tile: picTile(a) })]
  }),
  style('rd-sense', 'במה משתמשים?', ['riddle'], 'e', (_sp, r) => {
    const x = one(r, SENSES), o = some(r, SENSES.filter((y) => y !== x), 2)
    return [`rd-sense|${x.w}`, pick(r, `במה ${x.v}?`, picTile(x), o.map(picTile), `${x.v} עם ה${x.w}.`)]
  }),
  style('rd-healthy', 'מה בריא?', ['riddle'], 'h', (_sp, r) => {
    const h = one(r, HEALTHY)
    return [`rd-healthy|${h.w}`, pick(r, 'מה הכי בריא לאכול כל יום?', picTile(h), some(r, TREATS, 2).map(picTile), `${h.w} נותן כוח לגוף. ממתקים רק לפעמים.`)]
  }),
  style('rd-plate', 'צלחת בריאה', ['riddle'], 't', (_sp, r) => [
    'rd-plate', tapall(r, 'בונים צלחת בריאה: מסמנים את כל האוכל הבריא', some(r, HEALTHY, 3).map(picTile), some(r, TREATS, 3).map(picTile), 'פירות, ירקות וחלב נותנים לנו כוח לגדול.'),
  ]),
  style('rd-workplace', 'איפה הם עובדים?', ['riddle', 'social'], 'h', (_sp, r) => {
    const pool = JOBS.filter((j) => j.place), j = one(r, pool)
    return [`rd-workplace|${j.w}`, pick(r, `איפה עובד${/[הת]$/.test(j.w) ? 'ת' : ''} ה${j.w}?`, picTile(j.place!), some(r, pool.filter((x) => x !== j), 2).map((x) => picTile(x.place!)), `ה${j.w} עובד${/[הת]$/.test(j.w) ? 'ת' : ''} ב${j.place!.w}.`, { kind: 'tile', tile: { e: j.e, t: j.w } })]
  }),
  style('rd-count9', 'כמה מתחבאים?', ['riddle', 'count'], 't', (_sp, r) => {
    const [a, b] = some(r, ['🐞', '🌸', '🐝', '🍄', '🦋', '🐌', '🍀', '🐸'], 2)
    const na = int(r, 2, 4), nb = 9 - na
    return [`rd-count9|${a}|${na}`, pick(r, `בגינה מתחבאים ${a}. כמה ${a} יש בגינה?`, { g: String(na) }, [{ g: String(nb) }, { g: String(na + 1) }], `יש ${na} ${a}.`, { kind: 'row', items: mix(r, [...Array(na).fill(a), ...Array(nb).fill(b)]).map((e) => ({ e })) })]
  }),
]

export const WORLD_STYLES: Style[] = [...STORY_STYLES, ...TIME_STYLES, ...SEASON_STYLES, ...FEEL_STYLES, ...SOCIAL_STYLES, ...SCHOOL_STYLES, ...RIDDLE_STYLES]
