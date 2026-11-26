import { createContext, useContext, type ReactNode } from 'react'

/* The ten Pikos the child can choose from in onboarding. Each is drawn in the same 120×120 box and
   language as the original robot: flat soft colors, and the shared face (eyes, cheeks, mouth) from
   Sprout.tsx placed at `eyeY`. Whichever one the child picks becomes "Piko" everywhere in the app. */

export type BuddyId = 'astro' | 'rocket' | 'dino' | 'owl' | 'fox' | 'car' | 'star' | 'monster' | 'penguin' | 'bear'

export type BuddyInfo = {
  id: BuddyId
  /** What the card calls it. */
  name: string
  /** One line under the name. */
  tagline: string
  /** For the parent to read aloud: why this Piko is the one. */
  story: string
  /** Its special power, a small chip on the card. */
  power: string
  /** The soft stage behind it on its card. */
  tint: string
}

export const BUDDIES: BuddyInfo[] = [
  { id: 'astro', name: 'פיקו האסטרונאוט', tagline: 'גר בתחנת חלל ליד הירח', power: '🚀 מנווט בין כוכבים', tint: '#e6f0ff',
    story: 'פיקו גר בתחנת חלל קטנה ליד הירח. הוא רוצה לנווט את החללית לבד, אבל לשם כך צריך לדעת לספור ולקרוא את הכפתורים. כל שיעור שנעשה ביחד מקרב אותו עוד צעד אל הירח!' },
  { id: 'rocket', name: 'פיקו הטיל', tagline: 'עוד לא המריא, אבל כמעט', power: '🔥 דלק של ידע', tint: '#fff1ea',
    story: 'פיקו הוא טיל קטן שעוד לא המריא אף פעם. כל שיעור שמסיימים ממלא לו קצת דלק. בסוף השנה סופרים יחד: שלוש, שתיים, אחת... והוא ממריא איתך אל השנה הבאה!' },
  { id: 'dino', name: 'פיקו הדינוזאור', tagline: 'ישן מיליון שנה והתעורר', power: '🦖 שאגה של אלופים', tint: '#eef8ec',
    story: 'פיקו בקע מביצה ענקית לפני מיליון שנה, ואז נרדם. עכשיו הוא התעורר, ולא יודע לקרוא ולא לחשבן! מי ילמד אותו? אתה!' },
  { id: 'owl', name: 'פיקו הינשוף', tagline: 'קורא ספרים כל הלילה', power: '🧠 פותר חידות', tint: '#f6efe6',
    story: 'פיקו הינשוף ער כל הלילה וקורא ספרים מתחת לירח. הוא אוהב חידות, והוא מחפש חבר חכם במיוחד שיפתור אותן איתו. אולי זה אתה?' },
  { id: 'fox', name: 'פיקו השועל', tagline: 'הכי סקרן ביער', power: '🗝️ מוצא אוצרות', tint: '#fff1ea',
    story: 'פיקו השועל מחפש אוצרות שמוחבאים ביער. את המפתח לכל אוצר מקבלים רק כשפותרים משימה: סופרים, מזהים אות, מוצאים צורה. בוא נצא איתו לחפש!' },
  { id: 'car', name: 'פיקו המכונית', tagline: 'מכונית מרוץ מהירה', power: '🏁 מהירות שיא', tint: '#fdeceb',
    story: 'פיקו היא מכונית מרוץ אדומה וזריזה. בכל שיעור היא מתאמנת על המסלול ונהיית מהירה יותר. בסוף השנה יש מרוץ גדול, עד קו הסיום!' },
  { id: 'star', name: 'פיקו הכוכב', tagline: 'נפל מהשמיים בלילה אחד', power: '✨ זוהר בחושך', tint: '#fff7e0',
    story: 'בלילה אחד פיקו נפל מהשמיים ואיבד את האור שלו. כל דבר חדש שתלמד מחזיר לו קצת אור, עד שיזרח הכי חזק בשמיים, ממש כמוך.' },
  { id: 'monster', name: 'פיקו המפלצונת', tagline: 'נראה מפחיד, בעצם מצחיק', power: '😋 אוכל אותיות', tint: '#f1edfe',
    story: 'פיקו המפלצונת נראה קצת מפחיד, אבל הוא הכי מצחיק וטוב לב שיש. ויש לו סוד: הוא אוכל רק אותיות ומספרים! כל שאלה שתענה עליה היא ארוחה בשבילו.' },
  { id: 'penguin', name: 'פיקו הפינגווין', tagline: 'הגיע מהקוטב הקר', power: '❄️ מחליק על הקרח', tint: '#eaf3ff',
    story: 'פיקו הפינגווין הגיע מהקוטב הצפוני, עם כובע צמר ירוק. הוא מחליק על הקרח ואוהב לספור דגים. בוא תספור איתו, ואולי הוא ילמד אותך להחליק!' },
  { id: 'bear', name: 'פיקו הדובי', tagline: 'אלוף החיבוקים', power: '🤗 לא מוותר אף פעם', tint: '#f6efe6',
    story: 'פיקו הדובי הכי טוב בחיבוקים. כשמשהו קשה, הוא תמיד אומר: "לא נורא, ננסה שוב ביחד!" איתו לא מפחדים לטעות.' },
]

export const buddyInfo = (id: BuddyId) => BUDDIES.find((b) => b.id === id) ?? BUDDIES[0]

/* ───────── which Piko this learner has ───────── */
const BuddyCtx = createContext<BuddyId | 'robot'>('robot')
export function BuddyProvider({ id, children }: { id: BuddyId | 'robot'; children: ReactNode }) {
  return <BuddyCtx.Provider value={id}>{children}</BuddyCtx.Provider>
}
export const useBuddy = () => useContext(BuddyCtx)

/* ───────── drawings ───────── */
const INK = '#10361C'

/** `eyeY`: where the shared face sits. `mouthDy`: pushes the mouth down under a nose or beak. `top`: where a crown goes. */
export type BuddyShape = { eyeY: number; mouthDy?: number; top: number; body: ReactNode; front?: ReactNode }

export const SHAPES: Record<BuddyId, BuddyShape> = {
  astro: {
    eyeY: 66, top: 6,
    body: (
      <>
        <rect x="56" y="8" width="8" height="14" rx="4" fill="#22803B" />
        <circle cx="60" cy="8" r="6" fill="#FFC83D" />
        <circle cx="60" cy="66" r="46" fill="#E9F6D8" />
        <circle cx="60" cy="66" r="46" fill="none" stroke="#B4E3AA" strokeWidth="5" />
        <rect x="10" y="58" width="10" height="18" rx="5" fill="#4FB65A" />
        <rect x="100" y="58" width="10" height="18" rx="5" fill="#4FB65A" />
        <rect x="30" y="50" width="60" height="40" rx="20" fill="#F7FCF3" />
      </>
    ),
  },
  rocket: {
    eyeY: 66, top: 8,
    body: (
      <>
        <path d="M36 92 L24 108 L44 102 Z" fill="#FF7A45" />
        <path d="M84 92 L96 108 L76 102 Z" fill="#FF7A45" />
        <path d="M52 102 Q60 120 68 102 Z" fill="#FFC83D" style={{ transformOrigin: '60px 102px', animation: 'breathe 0.5s ease-in-out infinite' }} />
        <path d="M60 6 C86 22 90 60 84 102 H36 C30 60 34 22 60 6 Z" fill="#E9F6D8" />
        <path d="M60 6 C72 13 79 24 82 34 H38 C41 24 48 13 60 6 Z" fill="#4FB65A" />
        <rect x="36" y="52" width="48" height="36" rx="17" fill="#F7FCF3" />
      </>
    ),
  },
  dino: {
    eyeY: 53, top: 10,
    body: (
      <>
        <path d="M40 30 L46 16 L52 30 Z M54 24 L60 8 L66 24 Z M68 30 L74 16 L80 30 Z" fill="#FFC83D" />
        <path d="M94 92 Q116 96 112 78 Q104 88 92 82 Z" fill="#4FB65A" />
        <ellipse cx="44" cy="113" rx="9" ry="4.5" fill="#22803B" />
        <ellipse cx="76" cy="113" rx="9" ry="4.5" fill="#22803B" />
        <ellipse cx="60" cy="68" rx="38" ry="44" fill="#4FB65A" />
        <ellipse cx="60" cy="84" rx="24" ry="25" fill="#C9F27B" />
        <circle cx="49" cy="53" r="7.5" fill="#fff" />
        <circle cx="71" cy="53" r="7.5" fill="#fff" />
      </>
    ),
  },
  owl: {
    eyeY: 53, mouthDy: 8, top: 12,
    body: (
      <>
        <path d="M24 32 L32 10 L46 26 Z M96 32 L88 10 L74 26 Z" fill="#8d5524" />
        <ellipse cx="46" cy="115" rx="7" ry="3.5" fill="#FFC83D" />
        <ellipse cx="74" cy="115" rx="7" ry="3.5" fill="#FFC83D" />
        <ellipse cx="60" cy="68" rx="38" ry="46" fill="#b07a4a" />
        <ellipse cx="60" cy="88" rx="24" ry="24" fill="#F3E3CF" />
        <circle cx="49" cy="53" r="11" fill="#F7FCF3" stroke="#22803B" strokeWidth="2.5" />
        <circle cx="71" cy="53" r="11" fill="#F7FCF3" stroke="#22803B" strokeWidth="2.5" />
        <path d="M58 53 H62" stroke="#22803B" strokeWidth="2.5" />
      </>
    ),
    front: <path d="M56.5 61 H63.5 L60 66 Z" fill="#FFC83D" />,
  },
  fox: {
    eyeY: 60, mouthDy: 10, top: 18,
    body: (
      <>
        <path d="M24 50 L28 14 L50 34 Z M96 50 L92 14 L70 34 Z" fill="#FF7A45" />
        <path d="M30 42 L31 22 L44 34 Z M90 42 L89 22 L76 34 Z" fill="#FFE3D6" />
        <path d="M60 28 C92 28 102 54 98 72 C92 98 74 110 60 110 C46 110 28 98 22 72 C18 54 28 28 60 28 Z" fill="#FF7A45" />
        <path d="M60 66 C80 66 90 78 84 92 C78 104 68 108 60 108 C52 108 42 104 36 92 C30 78 40 66 60 66 Z" fill="#FFF4EC" />
      </>
    ),
    front: <ellipse cx="60" cy="72" rx="5" ry="3.6" fill={INK} />,
  },
  car: {
    eyeY: 56, top: 30,
    body: (
      <>
        <rect x="84" y="40" width="22" height="8" rx="3" fill="#22803B" />
        <rect x="92" y="44" width="5" height="20" fill="#22803B" />
        <path d="M14 84 C14 64 26 56 42 54 C50 38 70 34 84 46 C98 50 108 60 108 76 L108 86 C108 92 104 94 100 94 H20 C16 94 14 90 14 84 Z" fill="#E5383B" />
        <path d="M44 56 C50 42 68 40 80 48 L82 72 H40 Z" fill="#F7FCF3" />
        <rect x="20" y="72" width="10" height="8" rx="3" fill="#FFC83D" />
        <circle cx="36" cy="98" r="13" fill="#24324a" />
        <circle cx="36" cy="98" r="5" fill="#FFC83D" />
        <circle cx="88" cy="98" r="13" fill="#24324a" />
        <circle cx="88" cy="98" r="5" fill="#FFC83D" />
      </>
    ),
  },
  star: {
    eyeY: 58, top: 2,
    body: (
      <path d="M60 6 L74 40 L112 42 L82 66 L92 104 L60 84 L28 104 L38 66 L8 42 L46 40 Z" fill="#FFC83D" stroke="#946200" strokeWidth="2" strokeLinejoin="round" />
    ),
  },
  monster: {
    eyeY: 56, top: 4,
    body: (
      <>
        <path d="M54 22 L60 4 L66 22 Z" fill="#FFC83D" />
        <path d="M22 70 C22 40 38 20 60 20 C82 20 98 40 98 70 L98 106 L88 98 L78 108 L68 98 L60 108 L52 98 L42 108 L32 98 L22 106 Z" fill="#8b6cf6" />
        <ellipse cx="60" cy="56" rx="22" ry="13" fill="#F7FCF3" />
      </>
    ),
  },
  penguin: {
    eyeY: 54, mouthDy: 8, top: 14,
    body: (
      <>
        <ellipse cx="22" cy="74" rx="8" ry="18" fill="#24324a" transform="rotate(20 22 74)" />
        <ellipse cx="98" cy="74" rx="8" ry="18" fill="#24324a" transform="rotate(-20 98 74)" />
        <ellipse cx="48" cy="114" rx="9" ry="4" fill="#FF7A45" />
        <ellipse cx="72" cy="114" rx="9" ry="4" fill="#FF7A45" />
        <ellipse cx="60" cy="66" rx="38" ry="46" fill="#24324a" />
        <ellipse cx="60" cy="74" rx="28" ry="36" fill="#F7FCF3" />
        <path d="M36 28 Q60 12 84 28 L80 34 Q60 22 40 34 Z" fill="#4FB65A" />
        <circle cx="60" cy="14" r="5" fill="#C9F27B" />
      </>
    ),
    front: <path d="M55 61 H65 L60 67 Z" fill="#FF7A45" />,
  },
  bear: {
    eyeY: 58, mouthDy: 9, top: 16,
    body: (
      <>
        <circle cx="30" cy="30" r="14" fill="#b07a4a" />
        <circle cx="30" cy="30" r="7" fill="#F3E3CF" />
        <circle cx="90" cy="30" r="14" fill="#b07a4a" />
        <circle cx="90" cy="30" r="7" fill="#F3E3CF" />
        <circle cx="60" cy="66" r="44" fill="#b07a4a" />
        <ellipse cx="60" cy="82" rx="20" ry="16" fill="#F3E3CF" />
        <path d="M44 106 L60 112 L76 106 L72 118 H48 Z" fill="#4FB65A" />
      </>
    ),
    front: <ellipse cx="60" cy="73" rx="6" ry="4.4" fill={INK} />,
  },
}

/** Upgrades as the child moves along: a sparkle, then two, then a crown on top. */
/** The Piko of the welcome screens: a little robot superhero (cape, mask, a bolt on the chest, rocket boots).
 *  Original design; the face is the shared one, looking out through the mask. */
export const HERO: BuddyShape = {
  eyeY: 52, mouthDy: -1, top: 6,
  body: (
    <>
      {/* the cape, flapping behind */}
      <g style={{ transformOrigin: '60px 70px', animation: 'sway 2.6s ease-in-out infinite' }}>
        <path d="M34 66 C22 84 16 98 12 114 C30 108 44 116 60 110 C76 116 90 108 108 114 C104 98 98 84 86 66 Z" fill="#E5383B" />
        <path d="M44 70 C38 88 36 100 34 112 C42 110 50 112 56 110 C54 96 52 84 50 70 Z" fill="#B8262A" opacity=".55" />
      </g>
      {/* rocket boots' flames */}
      <g style={{ transformOrigin: '60px 112px', animation: 'breathe 0.45s ease-in-out infinite' }}>
        <path d="M46 108 Q49 120 52 108 Z" fill="#FFC83D" /><path d="M68 108 Q71 120 74 108 Z" fill="#FFC83D" />
        <path d="M47.5 108 Q49 115 50.5 108 Z" fill="#FF7A45" /><path d="M69.5 108 Q71 115 72.5 108 Z" fill="#FF7A45" />
      </g>
      {/* left arm down, right fist up */}
      <path d="M38 80 L27 96" stroke="#2F6FE4" strokeWidth="9" strokeLinecap="round" />
      <circle cx="26" cy="98" r="6" fill="#FFC83D" />
      <path d="M80 80 L102 60" stroke="#2F6FE4" strokeWidth="9" strokeLinecap="round" />
      <circle cx="104" cy="57" r="7" fill="#FFC83D" />
      {/* body, belt and the bolt */}
      <rect x="38" y="68" width="44" height="42" rx="16" fill="#3F7DFF" />
      <rect x="38" y="98" width="44" height="6" fill="#FFC83D" />
      <rect x="44" y="104" width="12" height="8" rx="3" fill="#1B2A52" /><rect x="64" y="104" width="12" height="8" rx="3" fill="#1B2A52" />
      <path d="M64 78 L53 89 L60 89 L56 97 L69 85 L62 85 Z" fill="#FFC83D" stroke="#946200" strokeWidth="1" strokeLinejoin="round" />
      {/* helmet with a fin, ear pods and the face plate */}
      <path d="M53 20 L60 4 L67 20 Z" fill="#FFC83D" />
      <circle cx="29" cy="48" r="6" fill="#FFC83D" /><circle cx="29" cy="48" r="2.5" fill="#2F6FE4" />
      <circle cx="91" cy="48" r="6" fill="#FFC83D" /><circle cx="91" cy="48" r="2.5" fill="#2F6FE4" />
      <circle cx="60" cy="48" r="30" fill="#3F7DFF" />
      <ellipse cx="60" cy="54" rx="23" ry="18" fill="#EAF3FF" />
      {/* the mask: the eyes look out through it */}
      <rect x="33" y="44" width="54" height="16" rx="8" fill="#1B2A52" />
      <ellipse cx="49" cy="52" rx="7.5" ry="6.5" fill="#fff" /><ellipse cx="71" cy="52" rx="7.5" ry="6.5" fill="#fff" />
      <ellipse cx="47" cy="31" rx="7" ry="3.5" fill="#fff" opacity=".35" transform="rotate(-25 47 31)" />
    </>
  ),
}

export function Upgrades({ stage, top }: { stage: number; top: number }) {
  return (
    <g pointerEvents="none">
      {stage >= 2 && <path d="M104 40 l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3 Z" fill="#FFC83D" style={{ transformOrigin: '104px 49px', animation: 'twinkle 2.8s ease-in-out infinite' }} />}
      {stage >= 3 && <path d="M14 30 l2.5 5 l5 2.5 l-5 2.5 l-2.5 5 l-2.5 -5 l-5 -2.5 l5 -2.5 Z" fill="#4DA3FF" style={{ transformOrigin: '14px 37px', animation: 'twinkle 3.4s ease-in-out .8s infinite' }} />}
      {stage >= 4 && (
        <path d={`M46 ${top + 10} L48 ${top - 4} L54 ${top + 4} L60 ${top - 8} L66 ${top + 4} L72 ${top - 4} L74 ${top + 10} Z`} fill="#FFC83D" stroke="#946200" strokeWidth="1.5" strokeLinejoin="round" />
      )}
    </g>
  )
}
