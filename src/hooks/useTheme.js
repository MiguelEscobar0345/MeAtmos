import { useCallback, useState } from 'react'
import { flushSync } from 'react-dom'
import { EASE, prefersReducedMotion } from '../utils/motion'

const KEY = 'atmos_theme'
const THEME_COLOR = { light: '#f3f0e8', dark: '#0b0e17' }

// index.html already applied the saved/system theme before the first paint
const current = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

export function useTheme() {
  const [theme, setTheme] = useState(current)

  const toggle = useCallback((e) => {
    const next = current() === 'dark' ? 'light' : 'dark'
    const apply = () => {
      document.documentElement.dataset.theme = next
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next])
      try { localStorage.setItem(KEY, next) } catch { /* private mode: theme just won't persist */ }
      flushSync(() => setTheme(next))
    }

    if (!document.startViewTransition || prefersReducedMotion()) return apply()

    // The new theme spreads as a circle from the button (its center when the
    // click came from the keyboard, which reports 0,0)
    const rect = e?.currentTarget?.getBoundingClientRect()
    const x = e?.detail ? e.clientX : rect ? rect.left + rect.width / 2 : window.innerWidth - 40
    const y = e?.detail ? e.clientY : rect ? rect.top + rect.height / 2 : 40
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const transition = document.startViewTransition(apply)
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        // Short: the page doesn't take clicks while a view transition runs
        { duration: 450, easing: `cubic-bezier(${EASE.join(',')})`, pseudoElement: '::view-transition-new(root)' },
      )
    })
  }, [])

  return [theme, toggle]
}
