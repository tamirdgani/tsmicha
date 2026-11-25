/* The worlds a child can choose in onboarding ("what do you love?").
   Each world brings its own cast (characters that differ by their main color), its own things
   (objects with distinct shapes), what goes with what, real facts that fit it, and cheers.
   The questions in bank/stylesKit.ts are written once and asked in every world with that world's cast.
   Pictures are referenced as "@world/key" and drawn by worlds/Art.tsx from worlds/art/<world>.ts. */

export type WorldId = 'heroes' | 'magic' | 'space' | 'cars' | 'animals' | 'dinos'
export const WORLD_IDS: WorldId[] = ['heroes', 'magic', 'space', 'cars', 'animals', 'dinos']

/** One of the world's characters. `c` is the Hebrew color word of its main color; `f` feminine (for grammar). */
export type Char = { k: string; name: string; f?: boolean; c: string; syl: number; clue: string }
/** A thing in the world. `w` singular, `pl` plural, `syl` syllables of `w`. */
export type Thing = { k: string; w: string; pl: string; f?: boolean; syl: number }

export type Kit = {
  id: WorldId
  title: string
  /** The cast as a group ("הגיבורים") and one of them ("גיבור"). */
  crew: string
  one: string
  /** "Who has the red suit?" — `{c}` is the color word, feminine when `colorF`. */
  colorQ: string
  colorF: boolean
  /** "What color is X's suit?" — `{n}` is the name. */
  colorOf: string
  chars: Char[]
  things: Thing[]
  /** Things that go together: [a, b, why]. Keys of chars or things. */
  pairs: [string, string, string][]
  /** What happens when some are taken away ("עפו", "נעלמו בקסם"…). */
  gone: [m: string, f: string]
  facts: { e: string; t: string }[]
  cheer: string[]
  /** Piko's opening line for every lesson. */
  hello: string
}

export const COLOR_HEX: Record<string, string> = {
  אדום: '#e5383b', כחול: '#1d70d8', צהוב: '#ffc83d', ירוק: '#2e9a48', כתום: '#f77f00', סגול: '#8b5cf6', ורוד: '#ff8fab', חום: '#8d5524', שחור: '#2f2f3a', אפור: '#9aa0a6',
}
export const COLOR_F: Record<string, string> = {
  אדום: 'אדומה', כחול: 'כחולה', צהוב: 'צהובה', ירוק: 'ירוקה', כתום: 'כתומה', סגול: 'סגולה', ורוד: 'ורודה', חום: 'חומה', שחור: 'שחורה', אפור: 'אפורה',
}

const HEROES: Kit = {
  id: 'heroes', title: 'גיבורי על', crew: 'הגיבורים', one: 'גיבור',
  colorQ: 'למי יש חליפה {c}?', colorF: true, colorOf: 'באיזה צבע החליפה של {n}?',
  chars: [
    { k: 'hero-red', name: 'אדיר', c: 'אדום', syl: 2, clue: 'יש לי ברק על החזה' },
    { k: 'hero-blue', name: 'גלית', f: true, c: 'כחול', syl: 2, clue: 'יש לי גל על החזה' },
    { k: 'hero-orange', name: 'זיק', c: 'כתום', syl: 1, clue: 'יש לי להבה על החזה' },
    { k: 'hero-yellow', name: 'כוכבית', f: true, c: 'צהוב', syl: 3, clue: 'יש לי כוכב על החזה' },
    { k: 'hero-green', name: 'מגן', c: 'ירוק', syl: 2, clue: 'יש לי מגן על החזה' },
    { k: 'hero-purple', name: 'סערה', f: true, c: 'סגול', syl: 3, clue: 'יש לי ענן על החזה' },
    { k: 'hero-black', name: 'רעם', c: 'שחור', syl: 2, clue: 'יש לי ירח על החזה' },
    { k: 'hero-pink', name: 'שחר', f: true, c: 'ורוד', syl: 2, clue: 'יש לי שמש על החזה' },
  ],
  things: [
    { k: 'shield', w: 'מגן', pl: 'מגנים', syl: 2 },
    { k: 'mask', w: 'מסכה', pl: 'מסכות', f: true, syl: 3 },
    { k: 'cape', w: 'גלימה', pl: 'גלימות', f: true, syl: 3 },
    { k: 'boot', w: 'מגף', pl: 'מגפיים', syl: 2 },
    { k: 'bolt', w: 'ברק', pl: 'ברקים', syl: 2 },
    { k: 'helmet', w: 'קסדה', pl: 'קסדות', f: true, syl: 2 },
    { k: 'belt', w: 'חגורה', pl: 'חגורות', f: true, syl: 3 },
    { k: 'tower', w: 'מגדל', pl: 'מגדלים', syl: 2 },
    { k: 'robot', w: 'רובוט', pl: 'רובוטים', syl: 2 },
    { k: 'glove', w: 'כפפה', pl: 'כפפות', f: true, syl: 3 },
    { k: 'ring', w: 'טבעת', pl: 'טבעות', f: true, syl: 2 },
    { k: 'medal', w: 'מדליה', pl: 'מדליות', f: true, syl: 3 },
    { k: 'flashlight', w: 'פנס', pl: 'פנסים', syl: 2 },
    { k: 'key', w: 'מפתח', pl: 'מפתחות', syl: 2 },
    { k: 'rope', w: 'חבל', pl: 'חבלים', syl: 2 },
    { k: 'magnet', w: 'מגנט', pl: 'מגנטים', syl: 2 },
    { k: 'trophy', w: 'גביע', pl: 'גביעים', syl: 2 },
    { k: 'spotlight', w: 'זרקור', pl: 'זרקורים', syl: 2 },
    { k: 'gem', w: 'יהלום', pl: 'יהלומים', syl: 2 },
    { k: 'bridge', w: 'גשר', pl: 'גשרים', syl: 2 },
    { k: 'kitten', w: 'חתלתול', pl: 'חתלתולים', syl: 3 },
    { k: 'flag', w: 'דגל', pl: 'דגלים', syl: 2 },
    { k: 'map', w: 'מפה', pl: 'מפות', f: true, syl: 2 },
    { k: 'binoculars', w: 'משקפת', pl: 'משקפות', f: true, syl: 3 },
  ],
  pairs: [
    ['mask', 'hero-red', 'הגיבור שם מסכה על העיניים.'], ['boot', 'glove', 'מגף לרגל, כפפה ליד.'], ['helmet', 'tower', 'קסדה על הראש, מגדל בעיר.'],
    ['shield', 'hero-green', 'מגן מחזיק מגן!'], ['bolt', 'hero-red', 'לאדיר יש ברק על החזה.'], ['robot', 'belt', 'הרובוט עוזר, והחגורה מחזיקה כלים.'],
  ],
  gone: ['עפו להציל מישהו', 'עפו להציל מישהו'],
  facts: [
    { e: '@heroes/hero-green', t: 'נמלה יכולה להרים משהו כבד פי 50 ממנה. זה כוח על אמיתי!' },
    { e: '@heroes/hero-blue', t: 'שממית יכולה לטפס על קירות, ואפילו ללכת על התקרה!' },
    { e: '@heroes/hero-orange', t: 'הברדלס רץ מהר כמו מכונית בכביש מהיר.' },
    { e: '@heroes/hero-purple', t: 'התמנון יכול לשנות צבע בשנייה, ולהתחבא כמו גיבור על.' },
    { e: '@heroes/hero-pink', t: 'כבאים, רופאות ומצילים הם גיבורי על אמיתיים. הם עוזרים לאנשים כל יום.' },
    { e: '@heroes/hero-black', t: 'עטלף מוצא את הדרך בחושך בעזרת הד, בלי לראות כלום!' },
    { e: '@heroes/hero-yellow', t: 'יש סוג של שרימפס שמכה כל כך מהר, שהמים סביבו רותחים לרגע!' },
    { e: '@heroes/hero-red', t: 'הכוח הכי גדול של גיבור הוא לעזור לחבר שצריך.' },
  ],
  cheer: ['כוח על!', 'בום! תשובה של גיבור!', 'הצלת את המצב!', 'גיבור אמיתי!', 'מהיר כמו ברק!'],
  hello: '{a} ו{b} באו להתאמן איתך היום!',
}

const MAGIC: Kit = {
  id: 'magic', title: 'קוסמים וקסמים', crew: 'הקוסמים', one: 'קוסם',
  colorQ: 'למי יש גלימה {c}?', colorF: true, colorOf: 'באיזה צבע הגלימה של {n}?',
  chars: [
    { k: 'wiz-blue', name: 'אורן', c: 'כחול', syl: 2, clue: 'יש לי גלימה וכובע כחולים' },
    { k: 'wiz-purple', name: 'בתיה', f: true, c: 'סגול', syl: 2, clue: 'יש לי גלימה וכובע סגולים' },
    { k: 'wiz-green', name: 'גפן', c: 'ירוק', syl: 2, clue: 'יש לי גלימה וכובע ירוקים' },
    { k: 'wiz-pink', name: 'דנה', f: true, c: 'ורוד', syl: 2, clue: 'יש לי גלימה וכובע ורודים' },
    { k: 'wiz-yellow', name: 'זוהר', c: 'צהוב', syl: 2, clue: 'יש לי גלימה וכובע צהובים' },
    { k: 'wiz-red', name: 'טל', c: 'אדום', syl: 1, clue: 'יש לי גלימה וכובע אדומים' },
    { k: 'wiz-orange', name: 'נוגה', f: true, c: 'כתום', syl: 2, clue: 'יש לי גלימה וכובע כתומים' },
    { k: 'wiz-black', name: 'רז', c: 'שחור', syl: 1, clue: 'יש לי גלימה וכובע שחורים' },
  ],
  things: [
    { k: 'wand', w: 'שרביט', pl: 'שרביטים', syl: 2 },
    { k: 'hat', w: 'כובע', pl: 'כובעים', syl: 2 },
    { k: 'potion', w: 'שיקוי', pl: 'שיקויים', syl: 2 },
    { k: 'book', w: 'ספר', pl: 'ספרים', syl: 2 },
    { k: 'owl', w: 'ינשוף', pl: 'ינשופים', syl: 2 },
    { k: 'broom', w: 'מטאטא', pl: 'מטאטאים', syl: 3 },
    { k: 'crystal', w: 'כדור בדולח', pl: 'כדורי בדולח', syl: 0 },
    { k: 'castle', w: 'טירה', pl: 'טירות', f: true, syl: 2 },
    { k: 'dragon', w: 'דרקון', pl: 'דרקונים', syl: 2 },
    { k: 'cauldron', w: 'קדרה', pl: 'קדרות', f: true, syl: 3 },
    { k: 'unicorn', w: 'חד־קרן', pl: 'חדי־קרן', syl: 3 },
    { k: 'mushroom', w: 'פטרייה', pl: 'פטריות', f: true, syl: 3 },
    { k: 'scroll', w: 'מגילה', pl: 'מגילות', f: true, syl: 3 },
    { k: 'key', w: 'מפתח', pl: 'מפתחות', syl: 2 },
    { k: 'lantern', w: 'עששית', pl: 'עששיות', f: true, syl: 3 },
    { k: 'frog', w: 'צפרדע', pl: 'צפרדעים', f: true, syl: 3 },
    { k: 'cat', w: 'חתול', pl: 'חתולים', syl: 2 },
    { k: 'star', w: 'כוכב', pl: 'כוכבים', syl: 2 },
    { k: 'crown', w: 'כתר', pl: 'כתרים', syl: 2 },
    { k: 'rabbit', w: 'ארנב', pl: 'ארנבים', syl: 2 },
    { k: 'candle', w: 'נר', pl: 'נרות', syl: 1 },
    { k: 'chest', w: 'תיבה', pl: 'תיבות', f: true, syl: 2 },
    { k: 'mirror', w: 'מראה', pl: 'מראות', f: true, syl: 2 },
    { k: 'fairy', w: 'פיה', pl: 'פיות', f: true, syl: 2 },
  ],
  pairs: [
    ['wand', 'hat', 'שרביט וכובע: מה שכל קוסם צריך.'], ['potion', 'cauldron', 'את השיקוי מבשלים בקדרה.'], ['broom', 'owl', 'שניהם עפים בשמיים!'],
    ['book', 'crystal', 'בספר קוראים לחשים, בכדור רואים קסמים.'], ['dragon', 'castle', 'הדרקון שומר על הטירה.'], ['wand', 'wiz-blue', 'לכל קוסם יש שרביט.'],
  ],
  gone: ['נעלמו בקסם', 'נעלמו בקסם'],
  facts: [
    { e: '@magic/owl', t: 'ינשוף יכול לסובב את הראש כמעט סביב עצמו!' },
    { e: '@magic/potion', t: 'כשמערבבים צבע צהוב וכחול מקבלים ירוק. כמו שיקוי קסמים!' },
    { e: '@magic/crystal', t: 'יש פטריות שזוהרות בחושך, כמו מנורה קטנה ביער.' },
    { e: '@magic/wand', t: 'גחליליות מאירות בלילה, כמו שרביט קסמים קטן שעף.' },
    { e: '@magic/castle', t: 'קשת בענן מופיעה כשהשמש מאירה על טיפות גשם.' },
    { e: '@magic/book', t: 'מגנט מושך ברזל בלי לגעת בו. זה נראה כמו קסם, אבל זה מדע!' },
    { e: '@magic/dragon', t: 'יש לטאה אמיתית שקוראים לה "דרקון קומודו". היא ארוכה כמו מיטה!' },
    { e: '@magic/hat', t: 'זיקית יכולה לשנות צבע, ממש כמו בקסם.' },
  ],
  cheer: ['קסם!', 'אברה־קדברה, צדקת!', 'לחש מושלם!', 'כמו קוסם אמיתי!', 'הקסם עבד!'],
  hello: '{a} ו{b} הכינו לך שיעור קסום!',
}

const SPACE: Kit = {
  id: 'space', title: 'חלל', crew: 'החייזרים', one: 'חייזר',
  colorQ: 'איזה חייזר {c}?', colorF: false, colorOf: 'באיזה צבע {n}?',
  chars: [
    { k: 'alien-green', name: 'בלופ', c: 'ירוק', syl: 1, clue: 'יש לי עין אחת' },
    { k: 'alien-blue', name: 'גוגו', c: 'כחול', syl: 2, clue: 'יש לי שתי עיניים' },
    { k: 'alien-purple', name: 'זיפי', c: 'סגול', syl: 2, clue: 'יש לי שלוש עיניים' },
    { k: 'alien-orange', name: 'טופי', c: 'כתום', syl: 2, clue: 'יש לי שתי עיניים' },
    { k: 'alien-pink', name: 'לולו', c: 'ורוד', syl: 2, clue: 'יש לי עין אחת' },
    { k: 'alien-yellow', name: 'מומו', c: 'צהוב', syl: 2, clue: 'יש לי שלוש עיניים' },
    { k: 'alien-red', name: 'פיפו', c: 'אדום', syl: 2, clue: 'יש לי שתי עיניים' },
    { k: 'alien-brown', name: 'קוקי', c: 'חום', syl: 2, clue: 'יש לי עין אחת' },
  ],
  things: [
    { k: 'rocket', w: 'חללית', pl: 'חלליות', f: true, syl: 3 },
    { k: 'planet', w: 'כוכב לכת', pl: 'כוכבי לכת', syl: 4 },
    { k: 'moon', w: 'ירח', pl: 'ירחים', syl: 0 },
    { k: 'star', w: 'כוכב', pl: 'כוכבים', syl: 2 },
    { k: 'astronaut', w: 'אסטרונאוט', pl: 'אסטרונאוטים', syl: 4 },
    { k: 'ufo', w: 'צלחת מעופפת', pl: 'צלחות מעופפות', f: true, syl: 0 },
    { k: 'comet', w: 'שביט', pl: 'שביטים', syl: 2 },
    { k: 'telescope', w: 'טלסקופ', pl: 'טלסקופים', syl: 3 },
    { k: 'satellite', w: 'לוויין', pl: 'לוויינים', syl: 2 },
    { k: 'helmet', w: 'קסדה', pl: 'קסדות', f: true, syl: 2 },
    { k: 'sun', w: 'שמש', pl: 'שמשות', f: true, syl: 1 },
    { k: 'robot', w: 'רובוט', pl: 'רובוטים', syl: 2 },
    { k: 'flag', w: 'דגל', pl: 'דגלים', syl: 2 },
    { k: 'boot', w: 'מגף', pl: 'מגפיים', syl: 2 },
    { k: 'antenna', w: 'אנטנה', pl: 'אנטנות', f: true, syl: 3 },
    { k: 'asteroid', w: 'אסטרואיד', pl: 'אסטרואידים', syl: 4 },
    { k: 'glove', w: 'כפפה', pl: 'כפפות', f: true, syl: 3 },
    { k: 'ladder', w: 'סולם', pl: 'סולמות', syl: 2 },
    { k: 'crater', w: 'מכתש', pl: 'מכתשים', syl: 2 },
    { k: 'capsule', w: 'קפסולה', pl: 'קפסולות', f: true, syl: 4 },
    { k: 'galaxy', w: 'גלקסיה', pl: 'גלקסיות', f: true, syl: 4 },
    { k: 'rover', w: 'רכב', pl: 'רכבים', syl: 2 },
    { k: 'clock', w: 'שעון', pl: 'שעונים', syl: 2 },
    { k: 'camera', w: 'מצלמה', pl: 'מצלמות', f: true, syl: 3 },
  ],
  pairs: [
    ['astronaut', 'helmet', 'האסטרונאוט שם קסדה בחלל.'], ['rocket', 'astronaut', 'האסטרונאוט טס בחללית.'], ['telescope', 'star', 'בטלסקופ מסתכלים על הכוכבים.'],
    ['ufo', 'alien-green', 'החייזר טס בצלחת מעופפת!'], ['moon', 'planet', 'שניהם מסתובבים בחלל.'], ['satellite', 'comet', 'שניהם טסים מעל כדור הארץ.'],
  ],
  gone: ['טסו הביתה', 'טסו הביתה'],
  facts: [
    { e: '@space/moon', t: 'על הירח אין רוח, אז עקבות הנעליים של האסטרונאוטים עדיין שם!' },
    { e: '@space/star', t: 'השמש היא כוכב. היא פשוט הכוכב הכי קרוב אלינו.' },
    { e: '@space/planet', t: 'לשבתאי יש טבעות שעשויות מקרח ואבנים.' },
    { e: '@space/astronaut', t: 'בחלל מרחפים, אז האסטרונאוטים ישנים קשורים לקיר!' },
    { e: '@space/rocket', t: 'חללית טסה מהר יותר מכל מטוס. היא מקיפה את כדור הארץ בשעה וחצי.' },
    { e: '@space/telescope', t: 'יש בשמיים יותר כוכבים מגרגרי חול בכל החופים בעולם.' },
    { e: '@space/comet', t: 'לשביט יש זנב ארוך שעשוי מקרח ואבק.' },
    { e: '@space/satellite', t: 'לוויינים בחלל עוזרים לנו לדעת אם מחר יהיה גשם.' },
  ],
  cheer: ['מדהים כמו כוכב!', 'שיגור מוצלח!', 'עד הירח וחזרה!', 'נחיתה מושלמת!', 'אסטרונאוט אמיתי!'],
  hello: '{a} ו{b} נחתו לשיעור איתך!',
}

const CARS: Kit = {
  id: 'cars', title: 'מכוניות', crew: 'המכוניות', one: 'מכונית',
  colorQ: 'איזו מכונית {c}?', colorF: true, colorOf: 'באיזה צבע {n}?',
  chars: [
    { k: 'car-red', name: 'בום', f: true, c: 'אדום', syl: 1, clue: 'אני מכונית אדומה ומהירה' },
    { k: 'car-blue', name: 'גלגלית', f: true, c: 'כחול', syl: 3, clue: 'אני מכונית כחולה' },
    { k: 'car-yellow', name: 'זינוק', f: true, c: 'צהוב', syl: 2, clue: 'אני מכונית צהובה' },
    { k: 'car-orange', name: 'טורבו', f: true, c: 'כתום', syl: 2, clue: 'אני מכונית כתומה' },
    { k: 'car-green', name: 'ניצה', f: true, c: 'ירוק', syl: 2, clue: 'אני מכונית ירוקה' },
    { k: 'car-purple', name: 'סופה', f: true, c: 'סגול', syl: 2, clue: 'אני מכונית סגולה' },
    { k: 'car-pink', name: 'רוני', f: true, c: 'ורוד', syl: 2, clue: 'אני מכונית ורודה' },
    { k: 'car-black', name: 'לילה', f: true, c: 'שחור', syl: 2, clue: 'אני מכונית שחורה' },
  ],
  things: [
    { k: 'truck', w: 'משאית', pl: 'משאיות', f: true, syl: 3 },
    { k: 'bus', w: 'אוטובוס', pl: 'אוטובוסים', syl: 3 },
    { k: 'motorbike', w: 'אופנוע', pl: 'אופנועים', syl: 4 },
    { k: 'tractor', w: 'טרקטור', pl: 'טרקטורים', syl: 2 },
    { k: 'firetruck', w: 'כבאית', pl: 'כבאיות', f: true, syl: 3 },
    { k: 'ambulance', w: 'אמבולנס', pl: 'אמבולנסים', syl: 3 },
    { k: 'helicopter', w: 'מסוק', pl: 'מסוקים', syl: 2 },
    { k: 'train', w: 'רכבת', pl: 'רכבות', f: true, syl: 3 },
    { k: 'bicycle', w: 'אופניים', pl: 'אופניים', syl: 3 },
    { k: 'trafficlight', w: 'רמזור', pl: 'רמזורים', syl: 2 },
    { k: 'taxi', w: 'מונית', pl: 'מוניות', f: true, syl: 2 },
    { k: 'van', w: 'טנדר', pl: 'טנדרים', syl: 2 },
    { k: 'scooter', w: 'קורקינט', pl: 'קורקינטים', syl: 3 },
    { k: 'boat', w: 'סירה', pl: 'סירות', f: true, syl: 2 },
    { k: 'plane', w: 'מטוס', pl: 'מטוסים', syl: 2 },
    { k: 'crane', w: 'מנוף', pl: 'מנופים', syl: 2 },
    { k: 'bulldozer', w: 'דחפור', pl: 'דחפורים', syl: 2 },
    { k: 'policecar', w: 'ניידת', pl: 'ניידות', f: true, syl: 3 },
    { k: 'tire', w: 'צמיג', pl: 'צמיגים', syl: 2 },
    { k: 'cone', w: 'קונוס', pl: 'קונוסים', syl: 2 },
    { k: 'key', w: 'מפתח', pl: 'מפתחות', syl: 2 },
    { k: 'helmet', w: 'קסדה', pl: 'קסדות', f: true, syl: 2 },
    { k: 'flag', w: 'דגל', pl: 'דגלים', syl: 2 },
    { k: 'garage', w: 'מוסך', pl: 'מוסכים', syl: 2 },
  ],
  pairs: [
    ['firetruck', 'ambulance', 'שתיהן ממהרות לעזור, עם סירנה.'], ['bus', 'train', 'בשניהם נוסעים הרבה אנשים.'], ['tractor', 'truck', 'שניהם עובדים קשה ומסיעים דברים.'],
    ['bicycle', 'motorbike', 'לשניהם יש שני גלגלים.'], ['trafficlight', 'car-red', 'המכונית עוצרת ברמזור.'], ['helicopter', 'ambulance', 'שניהם יכולים להביא מישהו לבית החולים.'],
  ],
  gone: ['נסעו הביתה', 'נסעו הביתה'],
  facts: [
    { e: '@cars/firetruck', t: 'הכבאיות הראשונות נמשכו בידי סוסים!' },
    { e: '@cars/bicycle', t: 'לאופניים הראשונים לא היו דוושות. דחפו אותם עם הרגליים.' },
    { e: '@cars/trafficlight', t: 'ברמזור: אדום אומר עוצרים, ירוק אומר נוסעים.' },
    { e: '@cars/truck', t: 'למשאית גדולה יכולים להיות 18 גלגלים!' },
    { e: '@cars/helicopter', t: 'מסוק יכול לעמוד באוויר במקום אחד, כמו יונק דבש.' },
    { e: '@cars/car-red', t: 'לגלגלים של מכונית מרוץ אין חריצים. הם חלקים לגמרי!' },
    { e: '@cars/train', t: 'יש רכבות שנוסעות מהר יותר ממכונית מרוץ.' },
    { e: '@cars/ambulance', t: 'על הרבה אמבולנסים המילה כתובה הפוך, כדי שהנהג שלפניהם יקרא אותה ישר במראה.' },
  ],
  cheer: ['ווררום! צדקת!', 'ראשון בקו הסיום!', 'נסיעה מושלמת!', 'מהיר כמו מכונית מרוץ!', 'ירוק! ממשיכים!'],
  hello: '{a} ו{b} מחכות לך בקו הזינוק!',
}

const ANIMALS: Kit = {
  id: 'animals', title: 'חיות', crew: 'החיות', one: 'חיה',
  colorQ: 'איזו חיה {c}?', colorF: true, colorOf: 'באיזה צבע ה{n}?',
  chars: [
    { k: 'lion', name: 'אריה', c: 'צהוב', syl: 2, clue: 'יש לי רעמה ואני שואג' },
    { k: 'elephant', name: 'פיל', c: 'אפור', syl: 1, clue: 'יש לי חדק ארוך' },
    { k: 'frog', name: 'צפרדע', f: true, c: 'ירוק', syl: 3, clue: 'אני קופצת ואומרת קווה קווה' },
    { k: 'pig', name: 'חזיר', c: 'ורוד', syl: 2, clue: 'יש לי אף עגול ואני אוהב בוץ' },
    { k: 'bear', name: 'דוב', c: 'חום', syl: 1, clue: 'אני אוהב דבש וישן כל החורף' },
    { k: 'penguin', name: 'פינגווין', c: 'שחור', syl: 2, clue: 'אני לא עף, אבל שוחה מהר' },
    { k: 'fish', name: 'דג', c: 'כתום', syl: 1, clue: 'אני גר במים ויש לי סנפירים' },
    { k: 'octopus', name: 'תמנון', c: 'סגול', syl: 2, clue: 'יש לי שמונה זרועות' },
  ],
  things: [
    { k: 'rabbit', w: 'ארנב', pl: 'ארנבים', syl: 2 },
    { k: 'turtle', w: 'צב', pl: 'צבים', syl: 1 },
    { k: 'cat', w: 'חתול', pl: 'חתולים', syl: 2 },
    { k: 'dog', w: 'כלב', pl: 'כלבים', syl: 2 },
    { k: 'owl', w: 'ינשוף', pl: 'ינשופים', syl: 2 },
    { k: 'butterfly', w: 'פרפר', pl: 'פרפרים', syl: 2 },
    { k: 'ant', w: 'נמלה', pl: 'נמלים', f: true, syl: 3 },
    { k: 'hen', w: 'תרנגולת', pl: 'תרנגולות', f: true, syl: 4 },
    { k: 'monkey', w: 'קוף', pl: 'קופים', syl: 1 },
    { k: 'zebra', w: 'זברה', pl: 'זברות', f: true, syl: 2 },
    { k: 'giraffe', w: 'ג׳ירפה', pl: 'ג׳ירפות', f: true, syl: 3 },
    { k: 'horse', w: 'סוס', pl: 'סוסים', syl: 1 },
    { k: 'cow', w: 'פרה', pl: 'פרות', f: true, syl: 2 },
    { k: 'sheep', w: 'כבשה', pl: 'כבשים', f: true, syl: 2 },
    { k: 'duck', w: 'ברווז', pl: 'ברווזים', syl: 2 },
    { k: 'snail', w: 'חילזון', pl: 'חלזונות', syl: 3 },
    { k: 'bee', w: 'דבורה', pl: 'דבורים', f: true, syl: 3 },
    { k: 'snake', w: 'נחש', pl: 'נחשים', syl: 2 },
    { k: 'crab', w: 'סרטן', pl: 'סרטנים', syl: 2 },
    { k: 'parrot', w: 'תוכי', pl: 'תוכים', syl: 2 },
    { k: 'mouse', w: 'עכבר', pl: 'עכברים', syl: 2 },
    { k: 'hedgehog', w: 'קיפוד', pl: 'קיפודים', syl: 2 },
    { k: 'kangaroo', w: 'קנגורו', pl: 'קנגורו', syl: 3 },
    { k: 'camel', w: 'גמל', pl: 'גמלים', syl: 2 },
  ],
  pairs: [
    ['cat', 'dog', 'שניהם חיות מחמד בבית.'], ['fish', 'octopus', 'שניהם גרים בים.'], ['lion', 'zebra', 'שניהם גרים בסוואנה באפריקה.'],
    ['owl', 'butterfly', 'לשניהם יש כנפיים.'], ['monkey', 'elephant', 'שניהם גרים בג׳ונגל.'], ['hen', 'pig', 'שניהם גרים בחווה.'],
  ],
  gone: ['הלכו לישון', 'הלכו לישון'],
  facts: [
    { e: '@animals/octopus', t: 'לתמנון יש שלושה לבבות!' },
    { e: '@animals/penguin', t: 'פינגווינים לא עפים, אבל שוחים מהר מאוד.' },
    { e: '@animals/frog', t: 'צפרדע שותה מים דרך העור, בלי לפתוח את הפה.' },
    { e: '@animals/elephant', t: 'פיל יכול לשאוב בחדק מים כמו שיש בדלי שלם.' },
    { e: '@animals/bear', t: 'דובים ישנים כמעט כל החורף, בלי לאכול בכלל.' },
    { e: '@animals/lion', t: 'שאגה של אריה שומעים רחוק מאוד, כמו מכאן ועד העיר הבאה.' },
    { e: '@animals/pig', t: 'חזירים חכמים מאוד. הם יכולים ללמוד את השם שלהם.' },
    { e: '@animals/fish', t: 'יש דגים שישנים עם עיניים פקוחות, כי אין להם עפעפיים.' },
  ],
  cheer: ['שאגה של אלופים!', 'קפיצה של צפרדע, צדקת!', 'חכם כמו ינשוף!', 'מושלם!', 'כל הכבוד, אלוף החיות!'],
  hello: 'ה{a} וה{b} באו לשחק איתך!',
}

const DINOS: Kit = {
  id: 'dinos', title: 'דינוזאורים', crew: 'הדינוזאורים', one: 'דינוזאור',
  colorQ: 'איזה דינוזאור {c}?', colorF: false, colorOf: 'באיזה צבע {n}?',
  chars: [
    { k: 'dino-trex', name: 'רקסי', c: 'ירוק', syl: 2, clue: 'יש לי שיניים גדולות וידיים קטנות' },
    { k: 'dino-longneck', name: 'צווארון', c: 'כחול', syl: 3, clue: 'יש לי צוואר ארוך מאוד' },
    { k: 'dino-trike', name: 'טרי', c: 'כתום', syl: 1, clue: 'יש לי שלוש קרניים' },
    { k: 'dino-stego', name: 'סטגי', c: 'סגול', syl: 2, clue: 'יש לי לוחות על הגב' },
    { k: 'dino-ptero', name: 'פטרי', c: 'אדום', syl: 2, clue: 'יש לי כנפיים ואני עף' },
    { k: 'dino-ankylo', name: 'אנקי', c: 'צהוב', syl: 2, clue: 'יש לי פטיש בסוף הזנב' },
    { k: 'dino-raptor', name: 'דינה', f: true, c: 'ורוד', syl: 2, clue: 'אני קטנה ורצה מהר' },
    { k: 'dino-spino', name: 'ספינו', c: 'חום', syl: 2, clue: 'יש לי מפרש גדול על הגב' },
  ],
  things: [
    { k: 'egg', w: 'ביצה', pl: 'ביצים', f: true, syl: 2 },
    { k: 'bone', w: 'עצם', pl: 'עצמות', f: true, syl: 2 },
    { k: 'volcano', w: 'הר געש', pl: 'הרי געש', syl: 3 },
    { k: 'palm', w: 'דקל', pl: 'דקלים', syl: 2 },
    { k: 'footprint', w: 'עקבה', pl: 'עקבות', f: true, syl: 3 },
    { k: 'fossil', w: 'מאובן', pl: 'מאובנים', syl: 3 },
    { k: 'rock', w: 'סלע', pl: 'סלעים', syl: 2 },
    { k: 'meteor', w: 'מטאור', pl: 'מטאורים', syl: 3 },
    { k: 'nest', w: 'קן', pl: 'קנים', syl: 1 },
    { k: 'leaf', w: 'עלה', pl: 'עלים', syl: 2 },
    { k: 'tree', w: 'עץ', pl: 'עצים', syl: 1 },
    { k: 'cave', w: 'מערה', pl: 'מערות', f: true, syl: 3 },
    { k: 'shovel', w: 'את', pl: 'אתים', syl: 1 },
    { k: 'brush', w: 'מברשת', pl: 'מברשות', f: true, syl: 3 },
    { k: 'river', w: 'נהר', pl: 'נהרות', syl: 2 },
    { k: 'mammoth', w: 'ממותה', pl: 'ממותות', f: true, syl: 3 },
    { k: 'sun', w: 'שמש', pl: 'שמשות', f: true, syl: 1 },
    { k: 'flower', w: 'פרח', pl: 'פרחים', syl: 2 },
    { k: 'mountain', w: 'הר', pl: 'הרים', syl: 1 },
    { k: 'tooth', w: 'שן', pl: 'שיניים', f: true, syl: 1 },
    { k: 'claw', w: 'טופר', pl: 'טפרים', syl: 2 },
    { k: 'hat', w: 'כובע', pl: 'כובעים', syl: 2 },
    { k: 'map', w: 'מפה', pl: 'מפות', f: true, syl: 2 },
    { k: 'pinecone', w: 'אצטרובל', pl: 'אצטרובלים', syl: 3 },
  ],
  pairs: [
    ['egg', 'nest', 'הביצים שוכבות בקן.'], ['bone', 'fossil', 'את שניהם מוצאים כשחופרים באדמה.'], ['leaf', 'dino-longneck', 'צווארון אוכל עלים מהעצים.'],
    ['palm', 'leaf', 'לדקל יש עלים גדולים.'], ['meteor', 'volcano', 'שניהם חמים ומלאי אש.'], ['footprint', 'dino-trex', 'רקסי השאיר עקבה בבוץ.'],
  ],
  gone: ['הלכו לישון', 'הלכו לישון'],
  facts: [
    { e: '@dinos/egg', t: 'דינוזאורים בקעו מביצים, ממש כמו אפרוחים!' },
    { e: '@dinos/dino-trex', t: 'לטירנוזאורוס היו שיניים ארוכות כמו בננה, וידיים קצרות מאוד.' },
    { e: '@dinos/dino-ptero', t: 'הציפורים של היום הן קרובות משפחה של הדינוזאורים!' },
    { e: '@dinos/bone', t: 'מי שחופר ומוצא עצמות של דינוזאורים נקרא פלאונטולוג.' },
    { e: '@dinos/dino-longneck', t: 'יש דינוזאורים עם צוואר ארוך כמו אוטובוס.' },
    { e: '@dinos/dino-raptor', t: 'היו דינוזאורים קטנים, בגודל של תרנגולת.' },
    { e: '@dinos/fossil', t: 'מאובן הוא צורה של חיה עתיקה שנשארה בתוך אבן.' },
    { e: '@dinos/dino-stego', t: 'לסטגוזאורוס היה מוח קטן מאוד, בגודל של לימון.' },
  ],
  cheer: ['ראאאר! צדקת!', 'צעד ענק של דינוזאור!', 'מושלם!', 'חכם כמו פלאונטולוג!', 'בקיעה מוצלחת!'],
  hello: '{a} ו{b} יצאו מהביצה כדי ללמוד איתך!',
}

export const KITS: Record<WorldId, Kit> = { heroes: HEROES, magic: MAGIC, space: SPACE, cars: CARS, animals: ANIMALS, dinos: DINOS }

/** "@heroes/shield" — how a world picture is referenced inside an emoji field. */
export const art = (w: WorldId, k: string) => `@${w}/${k}`
