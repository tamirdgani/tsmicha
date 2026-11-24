import { Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { useEffect, useRef } from 'react'
import { useLook, type SproutMood, type SproutProps } from './Sprout'

/** Sprout drawn by Rive. Loaded only when VITE_SPROUT_RIV points at a .riv file.
 *  The file's state machine must match docs/rive-sprout.md: same inputs, same names. */
const SM = 'Sprout'
const MOODS: SproutMood[] = ['happy', 'cheer', 'think', 'wink', 'calm']

export default function SproutRive({ src, size = 120, stage = 1, mood = 'happy', animate = true, interactive = true, className, title }: SproutProps & { src: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const live = animate && interactive && size >= 40
  const { rive, RiveComponent } = useRive({ src, stateMachines: SM, autoplay: animate, layout: new Layout({ fit: Fit.Contain }) })
  const lookX = useStateMachineInput(rive, SM, 'lookX')
  const lookY = useStateMachineInput(rive, SM, 'lookY')
  const swing = useStateMachineInput(rive, SM, 'swing')
  const moodIn = useStateMachineInput(rive, SM, 'mood')
  const stageIn = useStateMachineInput(rive, SM, 'stage')
  const hover = useStateMachineInput(rive, SM, 'hover')
  const tap = useStateMachineInput(rive, SM, 'tap')
  const look = useLook(wrap, live)

  useEffect(() => { if (moodIn) moodIn.value = MOODS.indexOf(mood) }, [moodIn, mood])
  useEffect(() => { if (stageIn) stageIn.value = stage }, [stageIn, stage])
  useEffect(() => {
    const offs = [
      look.lookX.on('change', (v) => { if (lookX) lookX.value = v * 100 }),
      look.lookY.on('change', (v) => { if (lookY) lookY.value = v * 100 }),
      look.swing.on('change', (v) => { if (swing) swing.value = v * 100 }),
    ]
    return () => offs.forEach((o) => o())
  }, [look, lookX, lookY, swing])

  return (
    <div ref={wrap} className={className} style={{ width: size, height: size, cursor: live ? 'pointer' : undefined }}
      role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}
      onPointerEnter={live ? () => { if (hover) hover.value = true } : undefined}
      onPointerLeave={live ? () => { if (hover) hover.value = false } : undefined}
      onPointerDown={live ? () => tap?.fire() : undefined}>
      <RiveComponent style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
