import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import Icon from './Icon'
import { useSuggestions, fetchSuggestions, MIN_QUERY } from '../hooks/useSuggestions'
import { useRecents } from '../hooks/useRecents'
import { nearestCity } from '../api/nearestCity'
import { countryName } from '../utils/formatters'
import { EASE } from '../utils/motion'

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

const GEO_MESSAGES = {
  locating: 'Buscando tu ubicación…',
  denied: 'No diste permiso de ubicación. Busca tu ciudad por nombre.',
  error: 'No pudimos obtener tu ubicación. Inténtalo de nuevo.',
  none: 'No encontramos una ciudad cerca de ti.',
}

const canLocate = typeof navigator !== 'undefined' && 'geolocation' in navigator

// Combobox with list autocomplete (WAI-ARIA APG pattern). Empty, it offers
// your location and the cities you opened last.
export default function SearchBar({ onSelect, currentId }) {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [submitting, setSubmitting] = useState(false)
  // Outcome of pressing Enter before the dropdown had results
  const [submitMsg, setSubmitMsg] = useState(null)
  const [geo, setGeo] = useState('idle')
  const inputRef = useRef(null)
  const listId = useId()
  const { status, list } = useSuggestions(value)
  // The city on screen isn't a useful shortcut
  const recents = useRecents().filter(loc => String(loc.id) !== currentId)

  const query = value.trim()
  const searching = query.length >= MIN_QUERY
  const options = searching
    ? list.map(loc => ({ kind: 'city', loc }))
    : query ? [] : [...(canLocate ? [{ kind: 'locate' }] : []), ...recents.map(loc => ({ kind: 'recent', loc }))]
  const hasList = open && options.length > 0
  const current = active >= 0 && active < options.length ? active : -1

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
    setGeo('idle')
    inputRef.current?.blur()
    onSelect(loc)
  }

  const locate = () => {
    setGeo('locating')
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const loc = await nearestCity(coords.latitude, coords.longitude)
          if (loc) choose(loc)
          else setGeo('none')
        } catch {
          setGeo('error')
        }
      },
      (err) => setGeo(err.code === err.PERMISSION_DENIED ? 'denied' : 'error'),
      { timeout: 12000, maximumAge: 10 * 60 * 1000 },
    )
  }

  const pick = (option) => (option.kind === 'locate' ? locate() : choose(option.loc))

  const submit = async (e) => {
    e.preventDefault()
    if (current >= 0) return pick(options[current])
    if (!query) return
    if (list.length && status === 'ready') return choose(list[0])
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
      if (!options.length) return
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActive(current === -1
        ? (step === 1 ? 0 : options.length - 1)
        : (current + step + options.length) % options.length)
    } else if (e.key === 'Enter' && hasList && current >= 0) {
      // Handled here: with an empty query the submit button is disabled,
      // which blocks the form's implicit submission
      e.preventDefault()
      pick(options[current])
    } else if (e.key === 'Escape') {
      // Search inputs clear themselves on Esc; first close, clear on the second
      e.preventDefault()
      if (open) setOpen(false)
      else setValue('')
      setActive(-1)
    }
  }

  const sent = submitMsg?.query === query ? submitMsg.type : null
  const message = !searching ? null
    : status === 'error' || sent === 'error' ? 'No pudimos buscar. Revisa tu conexión.'
      : (status === 'ready' && !list.length) || sent === 'empty'
        ? `Sin resultados para «${query}». Prueba agregando el país: «Valencia, Venezuela».`
        : status === 'loading' && !list.length ? 'Buscando…'
          : null
  const showPanel = open && (hasList || message)
  const optionId = (i) => `${listId}-${i}`
  const firstRecent = options.findIndex(o => o.kind === 'recent')

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
          aria-activedescendant={hasList && current >= 0 ? optionId(current) : undefined}
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

      <AnimatePresence>
        {showPanel && (
          <m.div
            key="panel"
            className="search__panel"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE } }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
          >
            {hasList && (
              <ul
                className="search__list"
                id={listId}
                role="listbox"
                aria-label={searching ? 'Ciudades encontradas' : 'Tu ubicación y ciudades recientes'}
              >
                {options.map((option, i) => {
                  const common = {
                    id: optionId(i),
                    role: 'option',
                    'aria-selected': i === current,
                    className: 'option',
                    // Keep focus in the input so the click isn't lost to blur
                    onMouseDown: e => e.preventDefault(),
                    onMouseMove: () => { if (i !== current) setActive(i) },
                    onClick: () => pick(option),
                  }
                  if (option.kind === 'locate') {
                    return (
                      <li key="locate" {...common} className="option option--locate">
                        <span className="option__cc" aria-hidden="true"><Icon name="locate" size={15} /></span>
                        <span className="option__text">
                          <span className="option__name">Usar mi ubicación</span>
                          <span className="option__place">
                            {GEO_MESSAGES[geo] ?? 'Tu navegador te pedirá permiso'}
                          </span>
                        </span>
                        <Icon name="arrowUpRight" size={16} className="option__go" />
                      </li>
                    )
                  }
                  const { loc } = option
                  return [
                    i === firstRecent && (
                      <li key="recent-heading" role="presentation" className="search__heading">Recientes</li>
                    ),
                    <li key={`${option.kind}-${loc.id}`} {...common}>
                      <span className="option__cc num" aria-hidden="true">{loc.country_code}</span>
                      <span className="option__text">
                        <span className="option__name"><Highlight text={loc.name} query={query} /></span>
                        <span className="option__place">{place(loc)}</span>
                      </span>
                      <Icon name="arrowUpRight" size={16} className="option__go" />
                    </li>,
                  ]
                })}
              </ul>
            )}
            {message && !hasList && <p className="search__msg">{message}</p>}
          </m.div>
        )}
      </AnimatePresence>
      <p className="visually-hidden" aria-live="polite">
        {searching && open && status === 'ready' ? `${list.length} ${list.length === 1 ? 'ciudad encontrada' : 'ciudades encontradas'}` : ''}
        {geo !== 'idle' ? GEO_MESSAGES[geo] : ''}
      </p>
    </form>
  )
}
