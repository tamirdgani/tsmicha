import { Direction } from 'radix-ui'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { STRINGS, type Lang, type StrKey } from './strings'
import type { L } from '../curriculum/course'

type Theme = 'light' | 'dark'
type Ctx = {
  lang: Lang
  dir: 'rtl' | 'ltr'
  setLang: (l: Lang) => void
  theme: Theme
  setTheme: (t: Theme) => void
  t: (k: StrKey, vars?: Record<string, string | number>) => string
  pick: (l: L) => string
  num: (n: number) => string
}

const I18nCtx = createContext<Ctx | null>(null)

const read = <T extends string>(k: string, fallback: T): T => {
  try { return (localStorage.getItem(k) as T) || fallback } catch { return fallback }
}
const write = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* private mode */ } }

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => read<Lang>('kfitza.lang', 'he'))
  const [theme, setThemeState] = useState<Theme>(() =>
    read<Theme>('kfitza.theme', 'light'))
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    document.title = lang === 'he' ? 'קפיצה · מוכנים לכיתה א׳' : 'Kfitza · Ready for first grade'
  }, [lang, dir])
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  const setLang = useCallback((l: Lang) => { setLangState(l); write('kfitza.lang', l) }, [])
  const setTheme = useCallback((t: Theme) => { setThemeState(t); write('kfitza.theme', t) }, [])

  const value = useMemo<Ctx>(() => ({
    lang, dir, setLang, theme, setTheme,
    t: (k, vars) => {
      let s: string = STRINGS[lang][k] ?? STRINGS.he[k] ?? k
      if (vars) for (const [vk, vv] of Object.entries(vars)) s = s.replaceAll(`{${vk}}`, String(vv))
      return s
    },
    pick: (l) => l[lang],
    num: (n) => new Intl.NumberFormat(lang === 'he' ? 'he-IL' : 'en-US').format(n),
  }), [lang, dir, setLang, theme, setTheme])

  // Radix menus, sheets and sliders read direction from here (Hebrew is RTL).
  return <I18nCtx.Provider value={value}><Direction.Provider dir={value.dir}>{children}</Direction.Provider></I18nCtx.Provider>
}

export function useI18n() {
  const c = useContext(I18nCtx)
  if (!c) throw new Error('useI18n outside provider')
  return c
}
