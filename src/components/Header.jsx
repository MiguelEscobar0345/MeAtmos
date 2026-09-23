import { useEffect, useState } from 'react'
import Logo from './Logo'
import SearchBar from './SearchBar'
import Icon from './Icon'
import './Header.css'

export default function Header({ onHome, onSearch, loading, theme, onToggleTheme }) {
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
        <Logo onHome={onHome} />
        <SearchBar onSearch={onSearch} loading={loading} />
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Cambiar a modo ${next}`}
          title={`Modo ${next}`}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
        </button>
      </div>
    </header>
  )
}
