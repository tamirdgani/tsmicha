import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Icon } from '../ds/Icon'
import { Sprout, type SproutMood } from '../ds/Sprout'
import { LangThemeToggles, Logo, Ring } from '../ds/ui'

/* A living reference of the Shoresh design system. English-only on purpose:
   it is a tool for us, not a screen for learners. */

const SWATCHES: [string, string, string][] = [
  ['Leaf 500 · brand', 'var(--color-leaf-500)', 'Primary actions, progress, the path'],
  ['Leaf 50 · brand soft', 'var(--brand-soft)', 'Calm tinted surfaces'],
  ['Lime', 'var(--color-lime)', 'Sprout highlights, selection, avatars'],
  ['Sun', 'var(--sun-strong)', 'XP, unit tests, rewards'],
  ['Flame', 'var(--flame-strong)', 'Streaks only'],
  ['Sky', 'var(--sky-strong)', 'Mixed reviews'],
  ['Berry', 'var(--berry-strong)', 'Midpoint checks'],
  ['Ink', 'var(--ink)', 'Text'],
  ['Background', 'var(--bg)', 'Page canvas'],
  ['Surface', 'var(--surface)', 'Cards'],
]

const MOODS: SproutMood[] = ['happy', 'cheer', 'wink', 'think', 'calm']

export function DesignSystem() {
  return (
    <div dir="ltr" lang="en" className="min-h-dvh">
      <header className="max-w-5xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="no-underline" style={{ color: 'inherit' }}><Logo /></Link>
        <LangThemeToggles />
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-8 pb-24 grid gap-14">
        <section>
          <span className="badge">Design system v0.1</span>
          <h1 className="t-display mt-3">Calm base, playful moments</h1>
          <p className="ink-2 max-w-[60ch]" style={{ fontSize: 18 }}>
            One brand green for growth. Four moment colors that appear only for rewards and progress states.
            Rubik for every weight, Hebrew and English alike. Buttons have a pressable lip; everything else stays quiet.
          </p>
        </section>

        <Block title="Color">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {SWATCHES.map(([n, c, d]) => (
              <div key={n} className="card overflow-hidden" style={{ boxShadow: 'none' }}>
                <div className="h-20" style={{ background: c, borderBottom: '1px solid var(--line)' }} />
                <div className="p-3">
                  <div className="t-small font-semibold">{n}</div>
                  <div className="t-caption ink-3 font-normal">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Type · Rubik">
          <div className="grid gap-3">
            <div className="t-display">Display 44 · שורש צומח</div>
            <div className="t-h1">Heading 1 · 28 bold</div>
            <div className="t-h2">Heading 2 · 22 bold</div>
            <div className="t-h3">Heading 3 · 18 semibold</div>
            <div className="t-body">Body 16 · כל שקל שנחסך היום עובד בשבילך שנים קדימה.</div>
            <div className="t-small ink-2">Small 14 · supporting text</div>
            <div className="t-caption ink-3">Caption 12 · metadata</div>
          </div>
        </Block>

        <Block title="Buttons">
          <div className="flex flex-wrap gap-3 items-center">
            <button className={cn(buttonVariants({ variant: 'default', size: 'xl' }))}><Icon name="play" size={18} />Primary</button>
            <button className={cn(buttonVariants({ variant: 'outline', size: 'xl' }))}>Secondary</button>
            <button className={cn(buttonVariants({ variant: 'default', size: 'xl' }))}><Icon name="trophy" size={18} />Reward</button>
            <button className={cn(buttonVariants({ variant: 'ghost', size: 'xl' }))}>Ghost</button>
            <button className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}>Small</button>
          </div>
          <p className="t-small ink-2 mt-3">One primary per view. The lip collapses on press — that small physical moment is the button’s whole personality.</p>
        </Block>

        <Block title="Chips, badges, progress">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="chip chip-flame"><Icon name="flame" size={18} style={{ color: 'var(--flame-strong)' }} />6</span>
            <span className="chip chip-sun"><Icon name="xp" size={18} style={{ color: 'var(--color-sun)' }} />340</span>
            <span className="chip chip-leaf"><Icon name="check" size={18} />Done</span>
            <span className="badge">Unit 2</span>
            <span className="badge badge-berry">Midpoint check</span>
            <span className="badge badge-sky">Review</span>
            <span className="badge badge-muted">Locked</span>
          </div>
          <div className="flex items-center gap-6 mt-6">
            <div className="bar flex-1"><i style={{ width: '42%' }} /></div>
            <Ring value={0.66} size={64} stroke={8} color="var(--color-sun)"><Icon name="xp" size={22} style={{ color: 'var(--color-sun)' }} /></Ring>
            <Ring value={0.4} size={52} stroke={6}><span className="t-caption font-bold">4/11</span></Ring>
          </div>
        </Block>

        <Block title="Path nodes">
          <div className="flex flex-wrap gap-8 items-end">
            {([
              ['Lesson', 'var(--brand)', 'var(--brand-press)', 'book', 'var(--on-strong)'],
              ['Done', 'var(--brand)', 'var(--brand-press)', 'check', 'var(--on-strong)'],
              ['Midpoint check', 'var(--berry-strong)', '#6447d6', 'flag', 'var(--on-strong)'],
              ['Mixed review', 'var(--sky-strong)', '#2b7fd9', 'refresh', 'var(--on-strong)'],
              ['Unit test', 'var(--sun-strong)', '#d9a21a', 'trophy', 'var(--color-leaf-900)'],
              ['Locked', 'var(--bg-deep)', 'var(--line-strong)', 'lock', 'var(--ink-3)'],
            ] as const).map(([n, f, l, i, ink]) => (
              <div key={n} className="flex flex-col items-center gap-3">
                <span className="grid place-items-center w-[72px] h-[72px] rounded-full" style={{ background: f, boxShadow: `0 6px 0 ${l}`, color: ink }}><Icon name={i} size={28} /></span>
                <span className="t-small ink-2">{n}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Sprout · the mentor">
          <p className="t-small ink-2 mt-0">Grows one stage roughly every three units. Five stages, five moods. Leaves always sway gently; eyes blink.</p>
          <div className="flex flex-wrap gap-4 items-end mt-4">
            {([0, 1, 2, 3, 4] as const).map((s) => (
              <div key={s} className="card p-3 flex flex-col items-center" style={{ boxShadow: 'none' }}>
                <Sprout size={110} stage={s} />
                <span className="t-caption ink-3">Stage {s + 1}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 items-end mt-4">
            {MOODS.map((m) => (
              <div key={m} className="card p-3 flex flex-col items-center" style={{ boxShadow: 'none', background: 'var(--brand-soft)' }}>
                <Sprout size={96} stage={2} mood={m} />
                <span className="t-caption ink-3 capitalize">{m}</span>
              </div>
            ))}
          </div>
        </Block>
      </main>
    </div>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="t-h2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--line)' }}>{title}</h2>
      {children}
    </section>
  )
}
