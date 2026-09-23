import { useEffect, useState } from 'react'
import Logo from './Logo'
import SearchBar from './SearchBar'
import { AnimatePresence, m } from 'motion/react'
import Icon from './Icon'
import './Header.css'

export default function Header({ onSelectCity, theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const next = theme === 'dark' ? 'claro' : 'oscuro'

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="page header__row">
        <Logo />
        <SearchBar onSelect={onSelectCity} />
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Cambiar a modo ${next}`}
          title={`Modo ${next}`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <m.span
              key={theme}
              className="theme-toggle__icon"
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
            </m.span>
          </AnimatePresence>
        </button>
      </div>
    </header>
  )
}
