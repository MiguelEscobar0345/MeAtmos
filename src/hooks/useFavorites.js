import { useCallback, useState } from 'react'
import { favKey } from './useFavoritesWeather'

export const MAX_FAVORITES = 6
const KEY = 'atmos_favorites'

function load() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function save(favs) {
  try { localStorage.setItem(KEY, JSON.stringify(favs)) } catch { /* quota or private mode */ }
}

// Entries saved before v2 only kept the name, which is ambiguous
// (San José CR vs San Jose US): match those by name + country instead of id
export const sameCity = (fav, loc) =>
  fav.id != null
    ? fav.id === loc.id
    : fav.name === loc.name && fav.country_code === loc.country_code

export function useFavorites() {
  const [favorites, setFavorites] = useState(load)

  const update = useCallback((fn) => {
    setFavorites(prev => {
      const next = fn(prev)
      if (next !== prev) save(next)
      return next
    })
  }, [])

  const toggle = useCallback((loc) => update(prev => {
    if (prev.some(f => sameCity(f, loc))) return prev.filter(f => !sameCity(f, loc))
    if (prev.length >= MAX_FAVORITES) return prev
    return [...prev, loc]
  }), [update])

  const remove = useCallback((fav) => update(prev => prev.filter(f => favKey(f) !== favKey(fav))), [update])

  const replace = useCallback((fav, loc) => update(prev => prev.map(f => (favKey(f) === favKey(fav) ? loc : f))), [update])

  return { favorites, toggle, remove, replace }
}
