import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { pointer } from './pointer'
import { HERO, SHAPES, Upgrades, useBuddy, type BuddyId } from './buddies'
import { sfx } from '../lib/sfx'

/** Piko, the little robot who learns with the child. He upgrades as the child moves along:
 *  stage 0 = just switched on · 1 = antenna lights up · 2 = side lights · 3 = second antenna and rocket hands · 4 = star.
 *
 *  It's alive: the eyes follow the mouse (or the last finger touch on phones), the head tilts
 *  toward it, the leaves lean in and swing when the pointer moves fast, hovering makes it
 *  light up, and a tap makes it jump. When nobody moves for a while it looks around on its own.
 *
 *  A Rive version can replace this drawing without touching any screen: set VITE_SPROUT_RIV to the
 *  .riv file and the same props drive its state machine (see docs/rive-sprout.md). */
export type SproutMood = 'happy' | 'cheer' | 'think' | 'wink' | 'calm'

export type SproutProps = {
  size?: number
  stage?: 0 | 1 | 2 | 3 | 4
  /** Which Piko to draw. Defaults to the one this learner chose (or the robot before they choose). */
  kind?: BuddyId | 'robot' | 'hero'
  mood?: SproutMood
  /** Gentle idle motion (sway, blink, breathing). */
  animate?: boolean
  /** Follow the pointer and react to hover and taps. Off for tiny or decorative copies. */
  interactive?: boolean
  className?: string
  title?: string
}

const RIVE_SRC = import.meta.env.VITE_SPROUT_RIV as string | undefined
const SproutRive = RIVE_SRC ? lazy(() => import('./SproutRive')) : null

export function Sprout(props: SproutProps) {
  if (SproutRive) {
    return (
      <Suspense fallback={<SproutSvg {...props} />}>
        <SproutRive src={RIVE_SRC!} {...props} />
      </Suspense>
    )
  }
  return <SproutSvg {...props} />
}

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Where this Sprout should look, as -1…1 on each axis, plus how fast the pointer moves sideways. */
export function useLook(ref: React.RefObject<Element | null>, enabled: boolean) {
  const lookX = useMotionValue(0)
  const lookY = useMotionValue(0)
  const swing = useMotionValue(0)
  useEffect(() => {
    if (!enabled || reducedMotion()) return
    let wander = 0
    let idleTimer = 0
    const aim = (x: number, y: number) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (!r.width) return
      const dx = x - (r.left + r.width / 2)
      const dy = y - (r.top + r.height * 0.7)
      const reach = Math.max(260, r.width * 2.5)
      lookX.set(Math.max(-1, Math.min(1, dx / reach)))
      lookY.set(Math.max(-1, Math.min(1, dy / reach)))
    }
    // Nobody around: glance somewhere new every couple of seconds, sometimes back to the middle.
    const lookAround = () => {
      if (Math.random() < 0.3) { lookX.set(0); lookY.set(0) }
      else { lookX.set((Math.random() * 2 - 1) * 0.8); lookY.set((Math.random() * 2 - 1) * 0.5) }
      wander = window.setTimeout(lookAround, 1600 + Math.random() * 2200)
    }
    const goIdle = () => { window.clearTimeout(idleTimer); window.clearTimeout(wander); idleTimer = window.setTimeout(lookAround, 4000) }
    const off = pointer.subscribe((p) => {
      aim(p.x, p.y)
      swing.set(Math.max(-1, Math.min(1, p.vx / 1.6)))
      goIdle()
    })
    if (pointer.last) aim(pointer.last.x, pointer.last.y)
    goIdle()
    return () => { off(); window.clearTimeout(idleTimer); window.clearTimeout(wander) }
  }, [enabled, ref, lookX, lookY, swing])
  return { lookX, lookY, swing }
}

function SproutSvg({ size = 120, stage = 1, mood = 'happy', animate = true, interactive = true, className, title, kind: kindProp }: SproutProps) {
  const chosen = useBuddy()
  const kind = kindProp ?? chosen
  const shape = kind === 'hero' ? HERO : kind === 'robot' ? SHAPES.astro : SHAPES[kind]
  const ref = useRef<SVGSVGElement>(null)
  const live = animate && interactive && size >= 40
  const { lookX, lookY, swing } = useLook(ref, live)

  // Springs make every reaction soft, never twitchy.
  const lx = useSpring(lookX, { stiffness: 140, damping: 16 })
  const ly = useSpring(lookY, { stiffness: 140, damping: 16 })
  const sw = useSpring(swing, { stiffness: 60, damping: 6 })
  const pupilX = useTransform(lx, [-1, 1], [-2.6, 2.6])
  const pupilY = useTransform(ly, [-1, 1], [-2, 2.2])
  const faceX = useTransform(lx, [-1, 1], [-2.5, 2.5])
  const faceY = useTransform(ly, [-1, 1], [-1.5, 1.5])
  const headTilt = useTransform(lx, [-1, 1], [-4, 4])
  const leafLean = useTransform(() => lx.get() * 7 - sw.get() * 14)

  const [hover, setHover] = useState(false)
  const [tapped, setTapped] = useState(0)
  useEffect(() => {
    if (!tapped) return
    const t = window.setTimeout(() => setTapped(0), 900)
    return () => window.clearTimeout(t)
  }, [tapped])

  // Reactions borrow the face for a moment, then hand it back to the mood the screen asked for.
  const face: SproutMood = tapped ? 'cheer' : hover && (mood === 'happy' || mood === 'calm') ? 'wink' : mood
  const stemTop = [54, 50, 46, 42, 38][stage]

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ overflow: 'visible', cursor: live ? 'pointer' : undefined, touchAction: 'manipulation' }}
      onPointerEnter={live ? () => setHover(true) : undefined}
      onPointerLeave={live ? () => setHover(false) : undefined}
      onPointerDown={live ? () => { sfx.boing(); setTapped(Date.now()) } : undefined}
    >
      <motion.g
        animate={tapped ? { y: [0, -14, 0, -5, 0] } : hover ? { y: -3 } : { y: 0 }}
        transition={tapped ? { duration: 0.7, times: [0, 0.3, 0.6, 0.8, 1], ease: 'easeOut' } : { type: 'spring', stiffness: 300, damping: 18 }}
      >
        {kind !== 'robot' ? (
          <g style={{ transformOrigin: '60px 118px', animation: animate ? 'breathe 3.6s ease-in-out infinite' : undefined }}>
            <motion.g style={{ originX: '60px', originY: '118px', rotate: live ? headTilt : 0 }}>
              {shape.body}
              <g transform={`translate(0 ${shape.eyeY - 94})`}>
                <motion.g style={{ x: live ? faceX : 0, y: live ? faceY : 0 }}>
                  <Face mood={face} animate={animate} pupilX={live ? pupilX : undefined} pupilY={live ? pupilY : undefined} wide={hover && !tapped} mouthDy={shape.mouthDy ?? 0} />
                </motion.g>
              </g>
              {shape.front}
              <Upgrades stage={stage} top={shape.top} />
            </motion.g>
          </g>
        ) : (<>
        {/* breathing: the whole robot swells a hair, from its feet */}
        <g style={{ transformOrigin: '60px 118px', animation: animate ? 'breathe 3.6s ease-in-out infinite' : undefined }}>
          {/* antenna leans toward the pointer and wobbles when it moves fast */}
          <motion.g style={{ originX: '60px', originY: '70px', rotate: live ? leafLean : 0 }}>
            <g style={{ transformOrigin: '60px 70px', animation: animate ? 'sway 4.5s ease-in-out infinite' : undefined }}>
              <Antenna stage={stage} top={stemTop} flutter={!!tapped} />
            </g>
          </motion.g>

          {/* body + face tilt together, like a head turning */}
          <motion.g style={{ originX: '60px', originY: '118px', rotate: live ? headTilt : 0 }}>
            <Arms stage={stage} wave={!!tapped || mood === 'cheer'} />
            {/* feet */}
            <ellipse cx="45" cy="117" rx="9" ry="4.5" fill="#22803B" />
            <ellipse cx="75" cy="117" rx="9" ry="4.5" fill="#22803B" />
            {/* body */}
            <rect x="24" y="68" width="72" height="49" rx="24" fill="#E9F6D8" />
            <rect x="24" y="68" width="72" height="12" rx="6" fill="#B4E3AA" opacity=".9" />
            {stage >= 2 && (
              <>
                <rect x="16" y="84" width="10" height="20" rx="5" fill="#4FB65A" />
                <rect x="94" y="84" width="10" height="20" rx="5" fill="#4FB65A" />
              </>
            )}
            {/* face screen */}
            <rect x="33" y="83" width="54" height="30" rx="14" fill="#F7FCF3" />
            <motion.g style={{ x: live ? faceX : 0, y: live ? faceY : 0 }}>
              <Face mood={face} animate={animate} pupilX={live ? pupilX : undefined} pupilY={live ? pupilY : undefined} wide={hover && !tapped} />
            </motion.g>
          </motion.g>
        </g>
        </>)}
      </motion.g>
    </svg>
  )
}

/** The antenna: a bulb that lights up, and grows a star at the last stage. */
function Antenna({ stage, top, flutter }: { stage: number; top: number; flutter: boolean }) {
  const glow = stage >= 1
  return (
    <>
      <path d={`M60 70 C60 ${top + 12} 60 ${top + 6} 60 ${top}`} stroke="#22803B" strokeWidth="4" strokeLinecap="round" fill="none" />
      {stage >= 3 && (
        <>
          <path d={`M50 71 C47 ${top + 14} 44 ${top + 10} 40 ${top + 8}`} stroke="#22803B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="40" cy={top + 8} r="4" fill="#4FB65A" />
        </>
      )}
      {glow && <circle cx="60" cy={top} r="11" fill="#FFC83D" opacity=".28" style={{ animation: 'breathe 2.4s ease-in-out infinite', transformOrigin: `60px ${top}px` }} />}
      <motion.g style={{ originX: '60px', originY: `${top}px` }} animate={flutter ? { scale: [1, 1.35, 0.9, 1.1, 1] } : { scale: 1 }} transition={{ duration: 0.6 }}>
        {stage >= 4 ? (
          <path d={`M60 ${top - 10} L63 ${top - 3} L71 ${top - 3} L65 ${top + 2} L67 ${top + 10} L60 ${top + 5} L53 ${top + 10} L55 ${top + 2} L49 ${top - 3} L57 ${top - 3} Z`} fill="#FFC83D" stroke="#946200" strokeWidth="1" strokeLinejoin="round" />
        ) : (
          <circle cx="60" cy={top} r="6.5" fill={glow ? '#FFC83D' : '#B4E3AA'} />
        )}
      </motion.g>
      {stage >= 4 && (
        <>
          <circle cx="36" cy={top + 2} r="3" fill="#FF7A45" />
          <circle cx="86" cy={top - 4} r="3.5" fill="#4DA3FF" />
        </>
      )}
    </>
  )
}

/** Little arms that wave on a cheer or a tap. From stage 3 they hold a tiny jet on each side. */
function Arms({ stage, wave }: { stage: number; wave: boolean }) {
  const arm = (side: 1 | -1) => (
    <motion.g style={{ originX: `${60 - side * 34}px`, originY: '96px' }}
      animate={wave ? { rotate: [0, side * 28, side * 6, side * 24, 0] } : { rotate: 0 }} transition={{ duration: 0.8 }}>
      <path d={`M${60 - side * 34} 96 Q${60 - side * 44} 94 ${60 - side * 46} 84`} stroke="#22803B" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx={60 - side * 46} cy="83" r="5" fill={stage >= 3 ? '#FF7A45' : '#4FB65A'} />
    </motion.g>
  )
  return <>{arm(1)}{arm(-1)}</>
}

function Face({ mood, animate, pupilX, pupilY, wide, mouthDy = 0 }: { mood: SproutMood; animate: boolean; pupilX?: MotionValue<number>; pupilY?: MotionValue<number>; wide: boolean; mouthDy?: number }) {
  const eyeY = 94
  const blink = animate ? { transformOrigin: `60px ${eyeY}px`, animation: 'blink 5s infinite' } : undefined
  const r = wide ? 4.8 : 4.2
  const eye = (cx: number, dy = 0) => (
    <motion.g style={{ x: pupilX ?? 0, y: pupilY ?? 0 }}>
      <motion.circle cx={cx} cy={eyeY + dy} fill="#10361C" initial={false} animate={{ r }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} />
      <circle cx={cx + 1.4} cy={eyeY + dy - 1.6} r="1.3" fill="#fff" />
    </motion.g>
  )
  const blush = wide || mood === 'cheer' ? 0.7 : 0.45
  return (
    <g>
      <motion.ellipse cx="44" cy="101" rx="5" ry="3" fill="#FF9F80" initial={false} animate={{ opacity: blush }} />
      <motion.ellipse cx="76" cy="101" rx="5" ry="3" fill="#FF9F80" initial={false} animate={{ opacity: blush }} />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.g key={mood} initial={{ opacity: 0, scaleY: 0.6 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0, scaleY: 0.6 }}
          transition={{ duration: 0.14 }} style={{ originX: '60px', originY: '100px' }}>
          {mood === 'cheer' ? (
            <g stroke="#10361C" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M45 95 Q49 90 53 95" />
              <path d="M67 95 Q71 90 75 95" />
            </g>
          ) : mood === 'wink' ? (
            <g>
              <g style={blink}>{eye(49)}</g>
              <path d="M67 95 Q71 91 75 95" stroke="#10361C" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          ) : mood === 'calm' ? (
            <g stroke="#10361C" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M45 94 Q49 97 53 94" />
              <path d="M67 94 Q71 97 75 94" />
            </g>
          ) : (
            <g style={blink}>
              {eye(49, mood === 'think' ? -1 : 0)}
              {eye(71, mood === 'think' ? -1 : 0)}
            </g>
          )}
          <g transform={`translate(0 ${mouthDy})`}>
          {mood === 'think' ? (
            <path d="M55 105 H65" stroke="#10361C" strokeWidth="3" strokeLinecap="round" />
          ) : mood === 'cheer' ? (
            <path d="M52 102 Q60 112 68 102 Z" fill="#10361C" />
          ) : (
            <path d="M53 103 Q60 109 67 103" stroke="#10361C" strokeWidth="3" strokeLinecap="round" fill="none" />
          )}
          </g>
        </motion.g>
      </AnimatePresence>
    </g>
  )
}
