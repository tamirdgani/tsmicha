import { motion } from 'motion/react'
import type { Visual } from '../curriculum/lessonTypes'
import { useI18n } from '../i18n/I18n'

/* Small illustrations that open explain steps. Flat shapes, brand palette,
   one gentle motion each — they set the scene, they don't compete with the text. */

const pop = (d: number) => ({ initial: { scale: 0.6, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { delay: d, type: 'spring' as const, stiffness: 320, damping: 18 } })

export function LessonVisual({ v }: { v: Visual }) {
  return (
    <div className="w-full h-[clamp(96px,20dvh,192px)] rounded-2xl grid place-items-center overflow-hidden" style={{ background: 'var(--brand-soft)' }} aria-hidden="true">
      {v === 'barter' && <Barter />}
      {v === 'commodity' && <Commodity />}
      {v === 'jobs' && <Jobs />}
      {v === 'shekel' && <Shekel />}
      {v === 'trust' && <Trust />}
      {v === 'sources' && <Sources />}
      {v === 'work' && <Work />}
      {v === 'stand' && <Stand />}
      {v === 'needwant' && <NeedWant />}
      {v === 'sale' && <Sale />}
      {v === 'clockcoin' && <ClockCoin />}
      {v === 'fork' && <Fork />}
      {v === 'week' && <WeekBars />}
    </div>
  )
}

function Person({ x, color, children }: { x: number; color: string; children?: React.ReactNode }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <circle cx="0" cy="58" r="16" fill="#FFD9B8" />
      <path d="M-26 140 C-26 100 26 100 26 140Z" fill={color} />
      <circle cx="-5" cy="56" r="2.2" fill="#10361C" /><circle cx="5" cy="56" r="2.2" fill="#10361C" />
      <path d="M-5 64 Q0 68 5 64" stroke="#10361C" strokeWidth="2" fill="none" strokeLinecap="round" />
      {children}
    </g>
  )
}

function Barter() {
  return (
    <svg viewBox="0 0 320 150" className="h-full max-w-full">
      <Person x={70} color="#4DA3FF" />
      <Person x={250} color="#FF7A45" />
      <motion.g {...pop(0.2)}>
        <rect x="104" y="38" width="44" height="28" rx="14" fill="#E9B872" />
        <path d="M112 46 q6 -6 12 0 q6 -6 12 0" stroke="#B9823F" strokeWidth="2" fill="none" />
      </motion.g>
      <motion.g {...pop(0.35)}>
        <path d="M176 60 h34 a6 6 0 0 0 6 -6 v-6 h-14 l-6 -10 h-14 a6 6 0 0 0 -6 6z" fill="#8B6CF6" />
      </motion.g>
      <motion.g {...pop(0.6)}>
        <path d="M124 92 C150 78 170 78 196 92" stroke="#2E9A48" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M190 84 l8 8 -10 4" stroke="#2E9A48" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="160" cy="112" r="14" fill="#fff" />
        <text x="160" y="118" textAnchor="middle" fontSize="18" fontWeight="800" fill="#FF7A45">?</text>
      </motion.g>
    </svg>
  )
}

function Commodity() {
  const items = [
    <g key="s"><path d="M-18 10 C-18 -14 18 -14 18 10Z" fill="#FFC83D" /><path d="M-10 8 L-6 -6 M0 8 V-10 M10 8 L6 -6" stroke="#D9A21A" strokeWidth="2.5" /></g>,
    <g key="salt"><rect x="-18" y="-12" width="36" height="24" rx="6" fill="#fff" stroke="#CFD7C9" strokeWidth="2" /><path d="M-10 -2 h20 M-10 5 h14" stroke="#CFD7C9" strokeWidth="2" /></g>,
    <g key="grain"><path d="M0 18 V-14" stroke="#B4884A" strokeWidth="3" />{[-10, -2, 6].map((y) => <g key={y}><ellipse cx="-6" cy={y} rx="5" ry="3" fill="#E9B872" transform={`rotate(-30 -6 ${y})`} /><ellipse cx="6" cy={y} rx="5" ry="3" fill="#E9B872" transform={`rotate(30 6 ${y})`} /></g>)}</g>,
    <g key="coin"><circle r="18" fill="#FFC83D" /><circle r="12" fill="none" stroke="#D9A21A" strokeWidth="2.5" /></g>,
  ]
  return (
    <svg viewBox="0 0 320 120" className="h-full max-w-full">
      {items.map((it, i) => (
        <motion.g key={i} {...pop(0.15 + i * 0.15)} style={{ x: 55 + i * 70, y: 60 }}>
          <circle r="30" fill="var(--surface)" />
          {it}
        </motion.g>
      ))}
    </svg>
  )
}

function Jobs() {
  const c = ['#2E9A48', '#4DA3FF', '#FFC83D']
  return (
    <svg viewBox="0 0 320 130" className="h-full max-w-full">
      {[0, 1, 2].map((i) => (
        <motion.g key={i} {...pop(0.15 + i * 0.15)}>
          <rect x={20 + i * 100} y="20" width="80" height="90" rx="18" fill="var(--surface)" />
          <circle cx={60 + i * 100} cy="56" r="18" fill={c[i]} />
          {i === 0 && <path d="M50 56 h20 m-6 -6 l6 6 -6 6" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          {i === 1 && <path d="M148 64 v-8 M156 64 v-14 M164 64 v-4" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />}
          {i === 2 && <path d="M250 50 h20 v14 h-20z M254 50 v-4 h12 v4" stroke="#7a5600" strokeWidth="3" fill="none" strokeLinejoin="round" />}
          <rect x={40 + i * 100} y="86" width="40" height="6" rx="3" fill="var(--line-strong)" />
        </motion.g>
      ))}
    </svg>
  )
}

function Shekel() {
  return (
    <svg viewBox="0 0 320 130" className="h-full max-w-full">
      <motion.g {...pop(0.1)}>
        <rect x="40" y="28" width="150" height="76" rx="10" fill="#B4E3AA" stroke="#4FB65A" strokeWidth="3" />
        <circle cx="115" cy="66" r="20" fill="#E9F6D8" />
        <text x="115" y="73" textAnchor="middle" fontSize="20" fontWeight="800" fill="#174F28">₪</text>
        <text x="60" y="48" fontSize="13" fontWeight="800" fill="#174F28">100</text>
      </motion.g>
      {[[220, 50, 24], [262, 80, 20], [228, 96, 15]].map(([x, y, r], i) => (
        <motion.g key={i} {...pop(0.35 + i * 0.12)}>
          <circle cx={x} cy={y} r={r} fill="#FFC83D" stroke="#D9A21A" strokeWidth="3" />
          <text x={x} y={y + r * 0.35} textAnchor="middle" fontSize={r * 0.9} fontWeight="800" fill="#7a5600">₪</text>
        </motion.g>
      ))}
    </svg>
  )
}

function Trust() {
  return (
    <svg viewBox="0 0 320 130" className="h-full max-w-full">
      <motion.g {...pop(0.1)}>
        <rect x="30" y="34" width="110" height="62" rx="10" fill="#B4E3AA" stroke="#4FB65A" strokeWidth="3" />
        <text x="85" y="72" textAnchor="middle" fontSize="20" fontWeight="800" fill="#174F28">₪</text>
      </motion.g>
      <motion.g {...pop(0.35)}>
        <path d="M152 65 h24" stroke="#2E9A48" strokeWidth="4" strokeLinecap="round" />
        <path d="M170 58 l8 7 -8 7" stroke="#2E9A48" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      <motion.g {...pop(0.55)}>
        <rect x="190" y="22" width="100" height="86" rx="16" fill="var(--surface)" />
        <rect x="204" y="36" width="72" height="14" rx="7" fill="#E3F0FF" />
        <rect x="204" y="58" width="50" height="10" rx="5" fill="var(--line-strong)" />
        <text x="240" y="96" textAnchor="middle" fontSize="18" fontWeight="800" fill="#2E9A48">1,240 ₪</text>
      </motion.g>
    </svg>
  )
}

/** Five ways money reaches a teen, all flowing into one wallet. */
function Sources() {
  const items = [
    // pocket money: a small stack of coins
    <g key="coins"><ellipse cx="0" cy="8" rx="14" ry="5" fill="#D9A21A" /><rect x="-14" y="-2" width="28" height="10" fill="#FFC83D" /><ellipse cx="0" cy="-2" rx="14" ry="5" fill="#FFD76A" /><ellipse cx="0" cy="-8" rx="14" ry="5" fill="#FFC83D" stroke="#D9A21A" strokeWidth="1.5" /></g>,
    // gift
    <g key="gift"><rect x="-14" y="-6" width="28" height="20" rx="3" fill="#FF7A45" /><rect x="-16" y="-12" width="32" height="8" rx="2" fill="#FF9A6E" /><path d="M0 -12 V14" stroke="#FFC83D" strokeWidth="4" /><path d="M0 -12 C-8 -22 -14 -12 0 -12 C14 -12 8 -22 0 -12" fill="none" stroke="#FFC83D" strokeWidth="3" /></g>,
    // job: briefcase
    <g key="job"><rect x="-16" y="-8" width="32" height="22" rx="4" fill="#4DA3FF" /><path d="M-6 -8 v-5 h12 v5" stroke="#2B7FD9" strokeWidth="3" fill="none" /><path d="M-16 2 h32" stroke="#2B7FD9" strokeWidth="2" /></g>,
    // small business: a stand with an awning
    <g key="biz"><path d="M-16 -12 h32 l-3 8 h-26z" fill="#2E9A48" /><path d="M-8 -12 l-2 8 M0 -12 v8 M8 -12 l2 8" stroke="#fff" strokeWidth="2" /><rect x="-13" y="-4" width="26" height="18" rx="2" fill="#B4E3AA" /></g>,
    // selling: a price tag
    <g key="tag"><path d="M-14 -10 h16 l12 12 -14 14 -14 -14z" fill="#8B6CF6" /><circle cx="-7" cy="-3" r="3" fill="var(--surface)" /></g>,
  ]
  // Same order as the text: in Hebrew the first source sits on the right.
  const { dir } = useI18n()
  const xs = dir === 'rtl' ? [284, 222, 160, 98, 36] : [36, 98, 160, 222, 284]
  return (
    <svg viewBox="0 0 320 150" className="h-full max-w-full">
      {xs.map((x, i) => (
        <motion.path key={`l${i}`} d={`M${x} 64 Q${x} 96 160 112`} fill="none" stroke="var(--line-strong)" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }} />
      ))}
      {items.map((it, i) => (
        <motion.g key={i} {...pop(0.1 + i * 0.1)} style={{ x: xs[i], y: 38 }}>
          <circle r="26" fill="var(--surface)" />
          {it}
        </motion.g>
      ))}
      <motion.g {...pop(0.9)}>
        <rect x="132" y="104" width="56" height="38" rx="9" fill="#174F28" />
        <rect x="132" y="104" width="56" height="12" rx="6" fill="#2E9A48" />
        <circle cx="176" cy="126" r="5" fill="#C9F27B" />
      </motion.g>
    </svg>
  )
}

/** A teen at a till, with a clock turning into coins: time for money. */
function Work() {
  return (
    <svg viewBox="0 0 320 150" className="h-full max-w-full">
      <Person x={92} color="#4DA3FF" />
      <rect x="40" y="112" width="110" height="34" rx="6" fill="#8FA393" />
      <rect x="40" y="112" width="110" height="8" rx="4" fill="#B7C4B9" />
      <motion.g {...pop(0.2)}>
        <rect x="104" y="86" width="40" height="28" rx="4" fill="#E3F0FF" stroke="#4DA3FF" strokeWidth="2" />
        <rect x="110" y="92" width="28" height="8" rx="2" fill="#4DA3FF" />
      </motion.g>
      <motion.g {...pop(0.4)}>
        <circle cx="210" cy="58" r="26" fill="var(--surface)" stroke="#2E9A48" strokeWidth="4" />
        <motion.path d="M210 58 V40" stroke="#174F28" strokeWidth="3.5" strokeLinecap="round" style={{ originX: 0.5, originY: 1 }}
          animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
        <path d="M210 58 h12" stroke="#174F28" strokeWidth="3.5" strokeLinecap="round" />
      </motion.g>
      <motion.g {...pop(0.6)}>
        <path d="M236 80 q14 16 24 18" stroke="#2E9A48" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M252 92 l9 6 -10 4" stroke="#2E9A48" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      {[[276, 108, 18], [296, 124, 13]].map(([x, y, r], i) => (
        <motion.g key={i} {...pop(0.75 + i * 0.12)}>
          <circle cx={x} cy={y} r={r} fill="#FFC83D" stroke="#D9A21A" strokeWidth="3" />
          <text x={x} y={y + r * 0.35} textAnchor="middle" fontSize={r * 0.9} fontWeight="800" fill="#7a5600">₪</text>
        </motion.g>
      ))}
    </svg>
  )
}

/** A little cookie stand: you set the price. */
function Stand() {
  return (
    <svg viewBox="0 0 320 150" className="h-full max-w-full">
      <motion.g {...pop(0.1)}>
        <rect x="86" y="40" width="10" height="100" fill="#B4884A" />
        <rect x="224" y="40" width="10" height="100" fill="#B4884A" />
        <path d="M76 22 h168 l-10 24 h-148z" fill="#2E9A48" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${100 + i * 24} 22 l-4 24 h12 l4 -24z`} fill="#fff" opacity=".9" />)}
        <rect x="80" y="92" width="160" height="48" rx="6" fill="#E9B872" />
        <rect x="80" y="92" width="160" height="10" rx="5" fill="#D9A866" />
      </motion.g>
      {[118, 148, 178].map((x, i) => (
        <motion.g key={x} {...pop(0.35 + i * 0.1)}>
          <circle cx={x} cy="84" r="11" fill="#C98A4B" />
          <circle cx={x - 4} cy="81" r="2" fill="#5B3A1A" /><circle cx={x + 3} cy="86" r="2" fill="#5B3A1A" /><circle cx={x + 4} cy="79" r="1.6" fill="#5B3A1A" />
        </motion.g>
      ))}
      <motion.g {...pop(0.7)}>
        <rect x="196" y="62" width="36" height="28" rx="6" fill="var(--surface)" stroke="#2E9A48" strokeWidth="2.5" />
        <text x="214" y="82" textAnchor="middle" fontSize="15" fontWeight="800" fill="#174F28">5 ₪</text>
      </motion.g>
    </svg>
  )
}

/** A balance: bread and a jacket on one pan, a game controller and sneakers on the other. */
function NeedWant() {
  const { t } = useI18n()
  return (
    <svg viewBox="0 0 320 150" className="h-full max-w-full">
      <motion.g {...pop(0.05)}>
        <rect x="154" y="40" width="12" height="96" rx="4" fill="#8FA393" />
        <rect x="120" y="132" width="80" height="10" rx="5" fill="#8FA393" />
        <circle cx="160" cy="38" r="9" fill="#B7C4B9" />
      </motion.g>
      <motion.g initial={{ rotate: 0 }} animate={{ rotate: [0, -6, 4, -2, 0] }} transition={{ delay: 0.5, duration: 1.6, ease: 'easeInOut' }} style={{ originX: '160px', originY: '38px' }}>
        <rect x="56" y="34" width="208" height="7" rx="3.5" fill="#B7C4B9" />
        <path d="M70 41 L50 92 M70 41 L100 92 M250 41 L220 92 M250 41 L270 92" stroke="#B7C4B9" strokeWidth="2" />
        <path d="M40 92 H110 Q108 108 75 108 Q42 108 40 92Z" fill="var(--surface)" />
        <path d="M210 92 H280 Q278 108 245 108 Q212 108 210 92Z" fill="var(--surface)" />
        {/* needs: bread + jacket */}
        <motion.g {...pop(0.25)}>
          <path d="M52 90 Q52 74 66 74 Q80 74 80 90Z" fill="#E9B872" />
          <path d="M58 80 l4 -3 M66 80 l4 -3" stroke="#B4884A" strokeWidth="2" strokeLinecap="round" />
          <path d="M84 90 V78 l6 -5 h8 l6 5 v12Z" fill="#4DA3FF" />
        </motion.g>
        {/* wants: controller + sneaker */}
        <motion.g {...pop(0.4)}>
          <rect x="216" y="76" width="34" height="16" rx="8" fill="#8B6CF6" />
          <path d="M223 84 h6 M226 81 v6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="242" cy="82" r="1.8" fill="#fff" /><circle cx="245" cy="86" r="1.8" fill="#fff" />
          <path d="M254 90 v-8 q0 -4 4 -4 h4 l3 5 q9 1 10 7Z" fill="#FF7A45" />
        </motion.g>
      </motion.g>
      <motion.g {...pop(0.6)}>
        <rect x="34" y="116" width="58" height="20" rx="10" fill="#E9F6D8" />
        <text x="63" y="130" textAnchor="middle" fontSize="11" fontWeight="800" fill="#174F28">{t('lesson.basket.need')}</text>
        <rect x="228" y="116" width="58" height="20" rx="10" fill="#E3F0FF" />
        <text x="257" y="130" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0B4A8F">{t('lesson.basket.want')}</text>
      </motion.g>
    </svg>
  )
}

/** A screaming sale: a big tag, a countdown and a "3 left" pill. */
function Sale() {
  const { pick } = useI18n()
  return (
    <svg viewBox="0 0 320 150" className="h-full max-w-full">
      <motion.g {...pop(0.1)}>
        <path d="M70 30 h110 l30 45 -30 45 h-110 a10 10 0 0 1 -10 -10 v-70 a10 10 0 0 1 10 -10z" fill="#FF7A45" />
        <circle cx="186" cy="75" r="7" fill="var(--surface)" />
        <text x="114" y="87" textAnchor="middle" fontSize="33" fontWeight="900" fill="#fff" direction="ltr">-50%</text>
      </motion.g>
      <motion.g {...pop(0.35)}>
        <rect x="222" y="30" width="78" height="34" rx="10" fill="var(--surface)" />
        <circle cx="240" cy="47" r="9" fill="none" stroke="#FF7A45" strokeWidth="3" />
        <motion.path d="M240 47 V41" stroke="#FF7A45" strokeWidth="3" strokeLinecap="round" style={{ originX: 0.5, originY: 1 }}
          animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
        <text x="276" y="53" textAnchor="middle" fontSize="15" fontWeight="800" fill="#8A2E0B" direction="ltr">00:59</text>
      </motion.g>
      <motion.g {...pop(0.55)} animate={{ opacity: 1, scale: [1, 1.08, 1] }} transition={{ delay: 1, duration: 0.9, repeat: Infinity, repeatDelay: 0.6 }} style={{ originX: '261px', originY: '104px' }}>
        <rect x="222" y="88" width="78" height="32" rx="16" fill="#8B6CF6" />
        <text x="261" y="109" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">{pick({ he: 'נשארו 3', en: '3 left' })}</text>
      </motion.g>
    </svg>
  )
}

/** A price tag that turns into a clock: 300 ₪ = 10 hours. */
function ClockCoin() {
  const { pick } = useI18n()
  return (
    <svg viewBox="0 0 320 150" className="h-full max-w-full">
      <motion.g {...pop(0.1)}>
        <path d="M30 50 h80 l22 25 -22 25 h-80 a8 8 0 0 1 -8 -8 v-34 a8 8 0 0 1 8 -8z" fill="#FFC83D" />
        <circle cx="114" cy="75" r="5" fill="var(--surface)" />
        <text x="66" y="83" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7a5600" direction="ltr">300 ₪</text>
      </motion.g>
      <motion.g {...pop(0.35)}>
        <path d="M146 75 h32" stroke="#2E9A48" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 9" />
        <path d="M176 66 l10 9 -10 9" stroke="#2E9A48" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      <motion.g {...pop(0.55)}>
        <circle cx="244" cy="70" r="42" fill="var(--surface)" stroke="#2E9A48" strokeWidth="5" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2
          return <circle key={i} cx={244 + Math.sin(a) * 33} cy={70 - Math.cos(a) * 33} r="2" fill="#B7C4B9" />
        })}
        <motion.path d="M244 70 V42" stroke="#174F28" strokeWidth="4" strokeLinecap="round" style={{ originX: 0.5, originY: 1 }}
          animate={{ rotate: 300 }} transition={{ delay: 0.8, duration: 1.6, ease: 'easeInOut' }} />
        <circle cx="244" cy="70" r="4" fill="#174F28" />
      </motion.g>
      <motion.g {...pop(1.2)}>
        <rect x="204" y="118" width="80" height="24" rx="12" fill="#E9F6D8" />
        <text x="244" y="135" textAnchor="middle" fontSize="13" fontWeight="800" fill="#174F28">{pick({ he: '10 שעות', en: '10 hours' })}</text>
      </motion.g>
    </svg>
  )
}

/** A signpost with two ways: choosing one means giving up the other. */
function Fork() {
  const { pick } = useI18n()
  return (
    <svg viewBox="0 0 320 150" className="h-full max-w-full">
      <motion.path d="M160 146 C160 110 160 100 160 92 C160 70 110 60 70 40" stroke="#B7C4B9" strokeWidth="18" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
      <motion.path d="M160 92 C160 70 210 60 250 40" stroke="#B7C4B9" strokeWidth="18" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.7 }} />
      <motion.g {...pop(0.8)}>
        <rect x="155" y="58" width="10" height="70" rx="3" fill="#B4884A" />
        <path d="M100 44 h56 v24 h-56 l-10 -12z" fill="#FF7A45" />
        <text x="126" y="61" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">{pick({ he: 'מסיבה', en: 'Party' })}</text>
        <path d="M164 70 h56 l10 12 -10 12 h-56z" fill="#2E9A48" />
        <text x="194" y="87" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">{pick({ he: 'משמרת', en: 'Shift' })}</text>
      </motion.g>
    </svg>
  )
}

/** Seven days as seven bars, each split into sleep, school and the rest. */
function WeekBars() {
  const parts = [{ h: 9, c: '#8B6CF6' }, { h: 7, c: '#4DA3FF' }, { h: 3, c: '#B7C4B9' }, { h: 5, c: '#FFC83D' }]
  return (
    <svg viewBox="0 0 320 150" className="h-full max-w-full">
      {Array.from({ length: 7 }, (_, d) => {
        let y = 130
        return (
          <motion.g key={d} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.1 + d * 0.07, type: 'spring', stiffness: 200, damping: 20 }} style={{ originY: '130px' }}>
            {parts.map((p, i) => {
              const hgt = p.h * 4.6
              y -= hgt
              return <rect key={i} x={36 + d * 38} y={y} width="28" height={hgt} rx={i === parts.length - 1 ? 6 : 0} fill={p.c} />
            })}
          </motion.g>
        )
      })}
      <text x="160" y="146" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ink-3)" direction="ltr">7 × 24 = 168</text>
    </svg>
  )
}
