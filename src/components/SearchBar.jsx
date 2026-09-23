import { useEffect, useId, useRef, useState } from 'react'
import Icon from './Icon'
import { useSuggestions, fetchSuggestions, MIN_QUERY } from '../hooks/useSuggestions'
import { countryName } from '../utils/formatters'

const fold = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

// Bold the part of the name that matches what was typed
function Highlight({ text, query }) {
  const q = fold(query.trim())
  if (!q || !fold(text).startsWith(q)) return text
  return <><mark>{text.slice(0, q.length)}</mark>{text.slice(q.length)}</>
}

const place = (loc) =>
  [loc.admin1 !== loc.name && loc.admin1, countryName(loc.country_code, loc.country)]
    .filter(Boolean)
    .join(', ')

// Combobox with list autocomplete (WAI-ARIA APG pattern)
export default function SearchBar({ onSelect }) {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [submitting, setSubmitting] = useState(false)
  // Outcome of pressing Enter before the dropdown had results
  const [submitMsg, setSubmitMsg] = useState(null)
  const inputRef = useRef(null)
  const listId = useId()
  const { status, list } = useSuggestions(value)

  const query = value.trim()
  const showPanel = open && query.length >= MIN_QUERY
  const hasList = showPanel && list.length > 0
  const current = active >= 0 && active < list.length ? active : -1

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

  const choose = (loc) => {
    setValue('')
    setOpen(false)
    setActive(-1)
    setSubmitMsg(null)
    inputRef.current?.blur()
    onSelect(loc)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!query) return
    if (list.length && status === 'ready') return choose(list[Math.max(current, 0)])
    // Enter before the suggestions arrived: ask directly (shares their cache)
    setSubmitting(true)
    try {
      const results = await fetchSuggestions(query)
      if (results.length) choose(results[0])
      else setSubmitMsg({ query, type: 'empty' })
    } catch {
      setSubmitMsg({ query, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      setOpen(true)
      if (!list.length) return
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActive(current === -1
        ? (step === 1 ? 0 : list.length - 1)
        : (current + step + list.length) % list.length)
    } else if (e.key === 'Escape') {
      if (showPanel) setOpen(false)
      else setValue('')
      setActive(-1)
    }
  }

  const sent = submitMsg?.query === query ? submitMsg.type : null
  const message =
    status === 'error' || sent === 'error' ? 'No pudimos buscar. Revisa tu conexión.'
      : (status === 'ready' && !list.length) || sent === 'empty'
        ? `Sin resultados para «${query}». Prueba agregando el país: «Valencia, Venezuela».`
        : status === 'loading' && !list.length ? 'Buscando…'
          : null

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
          autoCorrect="off"
          spellCheck="false"
          enterKeyHint="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={hasList}
          aria-controls={listId}
          aria-activedescendant={hasList && current >= 0 ? `${listId}-${current}` : undefined}
          value={value}
          onChange={e => {
            setValue(e.target.value)
            setOpen(true)
            setActive(-1)
            setSubmitMsg(null)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
        <kbd className="search__kbd" aria-hidden="true">/</kbd>
      </label>
      <button type="submit" className="search__submit" disabled={!query || submitting}>
        {submitting ? 'Buscando…' : 'Buscar'}
      </button>

      {showPanel && (message || hasList) && (
        <div className="search__panel">
          {hasList && (
            <ul className="search__list" id={listId} role="listbox" aria-label="Ciudades encontradas">
              {list.map((loc, i) => (
                <li
                  key={loc.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === current}
                  className="option"
                  // Keep focus in the input so the click isn't lost to blur
                  onMouseDown={e => e.preventDefault()}
                  onMouseMove={() => { if (i !== current) setActive(i) }}
                  onClick={() => choose(loc)}
                >
                  <span className="option__cc num" aria-hidden="true">{loc.country_code}</span>
                  <span className="option__text">
                    <span className="option__name"><Highlight text={loc.name} query={query} /></span>
                    <span className="option__place">{place(loc)}</span>
                  </span>
                  <Icon name="arrowUpRight" size={16} className="option__go" />
                </li>
              ))}
            </ul>
          )}
          {message && !hasList && <p className="search__msg">{message}</p>}
        </div>
      )}
      <p className="visually-hidden" aria-live="polite">
        {showPanel && status === 'ready' ? `${list.length} ${list.length === 1 ? 'ciudad encontrada' : 'ciudades encontradas'}` : ''}
      </p>
    </form>
  )
}
