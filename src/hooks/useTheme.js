import { useCallback, useState } from 'react'

const KEY = 'atmos_theme'
const THEME_COLOR = { light: '#f3f0e8', dark: '#0b0e17' }

// index.html already applied the saved/system theme before the first paint
const current = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

export function useTheme() {
  const [theme, setTheme] = useState(current)

  const toggle = useCallback(() => {
    const next = current() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next])
    try { localStorage.setItem(KEY, next) } catch { /* private mode: theme just won't persist */ }
    setTheme(next)
  }, [])

  return [theme, toggle]
}
