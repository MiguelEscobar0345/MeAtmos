import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

export default function SearchBar({ onSearch, loading }) {
  const [val, setVal] = useState('')
  const inputRef = useRef(null)

  // "/" or Ctrl/⌘+K jumps to the search box from anywhere
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)
      if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    if (val.trim()) onSearch(val.trim())
  }

  return (
    <form className="search" role="search" onSubmit={submit}>
      <label className="search__field">
        <Icon name="search" size={17} className="search__icon" />
        <span className="visually-hidden">Buscar ciudad</span>
        <input
          ref={inputRef}
          type="search"
          className="search__input"
          placeholder="Busca una ciudad…"
          autoComplete="off"
          enterKeyHint="search"
          value={val}
          onChange={e => setVal(e.target.value)}
        />
        <kbd className="search__kbd" aria-hidden="true">/</kbd>
      </label>
      <button type="submit" className="search__submit" disabled={loading || !val.trim()}>
        {loading ? 'Buscando…' : 'Buscar'}
      </button>
    </form>
  )
}
