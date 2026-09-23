import { useEffect, useState } from 'react'
import { lookupLocation, fetchForecast, fetchAirQuality } from '../api/openMeteo'

// Locations we already know (suggestions, favorites): no lookup needed
const locations = new Map()
// Last forecast per city: back/forward renders it instantly, then it's
// refreshed in the background when older than FRESH_MS
const forecasts = new Map()
const FRESH_MS = 10 * 60 * 1000

export const rememberLocation = (loc) => {
  if (loc?.id != null) locations.set(String(loc.id), loc)
}

async function loadCity(id) {
  const location = locations.get(id) ?? await lookupLocation(id)
  if (!location) return { error: { type: 'unknown-city' } }
  rememberLocation(location)
  // Air quality is optional: its failure must not hide the forecast
  const [weather, aq] = await Promise.all([
    fetchForecast(location),
    fetchAirQuality(location).catch(() => null),
  ])
  const data = { location, weather, aq, at: Date.now() }
  forecasts.set(id, data)
  return data
}

export function useCity(id) {
  const [attempt, setAttempt] = useState(0)
  const key = id ? `${id}#${attempt}` : null
  // Results are stored with the key they belong to, so "loading" is derived
  // (result.key !== key) instead of being set inside the effect
  const [result, setResult] = useState({ key: null })

  useEffect(() => {
    if (!key) return
    const cached = forecasts.get(id)
    if (cached && Date.now() - cached.at < FRESH_MS) return
    let cancelled = false
    loadCity(id)
      .then(data => { if (!cancelled) setResult({ key, ...data }) })
      .catch(() => { if (!cancelled) setResult({ key, error: { type: 'network' } }) })
    return () => { cancelled = true }
  }, [id, key])

  const retry = () => setAttempt(a => a + 1)

  if (!id) return { status: 'idle', retry }
  if (result.key === key) {
    return result.error
      ? { status: 'error', error: result.error, retry }
      : { status: 'ready', ...result, retry }
  }
  const cached = forecasts.get(id)
  if (cached) return { status: 'ready', ...cached, retry }
  return { status: 'loading', location: locations.get(id), retry }
}
