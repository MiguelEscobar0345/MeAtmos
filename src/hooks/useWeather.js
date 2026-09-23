import { useState, useCallback, useRef } from 'react'
import { geocode, fetchForecast, fetchAirQuality } from '../api/openMeteo'

const EMPTY = { weather: null, aq: null, location: null, error: null }

export function useWeather() {
  const [state, setState]     = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  // Only the latest request may write state; older responses can arrive later
  const requestId = useRef(0)
  const lastLoad  = useRef(null)

  const load = useCallback(async (resolveLocation, query) => {
    const id = ++requestId.current
    lastLoad.current = () => load(resolveLocation, query)
    setLoading(true)

    try {
      const loc = await resolveLocation()
      if (id !== requestId.current) return null
      // An error replaces the previous city instead of stacking on top of it
      if (!loc) {
        setState({ ...EMPTY, error: { type: 'not-found', query } })
        return null
      }

      // Air quality is optional: its failure must not hide the forecast
      const [weather, aq] = await Promise.all([
        fetchForecast(loc),
        fetchAirQuality(loc).catch(() => null),
      ])
      if (id !== requestId.current) return null
      setState({ weather, aq, location: loc, error: null })
      return loc
    } catch {
      if (id === requestId.current) setState({ ...EMPTY, error: { type: 'network', query } })
      return null
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [])

  const search = useCallback((query) => {
    const q = query.trim()
    if (!q) return Promise.resolve(null)
    return load(async () => (await geocode(q, { count: 3 }))[0] ?? null, q)
  }, [load])

  // Favorites and suggestions already know their coordinates: no geocoding
  const open = useCallback((loc) => load(async () => loc, loc.name), [load])

  const retry = useCallback(() => lastLoad.current?.(), [])

  const reset = useCallback(() => {
    requestId.current++
    setLoading(false)
    setState(EMPTY)
  }, [])

  return { ...state, loading, search, open, retry, reset }
}
