import { useState, useCallback, useRef } from 'react'

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'
const AQ_API = 'https://air-quality-api.open-meteo.com/v1/air-quality'

async function getJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const toLocation = (r) => ({
  id:           r.id,
  name:         r.name,
  admin1:       r.admin1,
  country:      r.country,
  country_code: r.country_code,
  lat:          r.latitude,
  lon:          r.longitude,
})

export function useWeather() {
  const [weather, setWeather]     = useState(null)
  const [aq, setAq]               = useState(null)
  const [location, setLocation]   = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  // Only the latest request may write state; older responses can arrive later
  const requestId = useRef(0)

  const load = useCallback(async (resolveLocation) => {
    const id = ++requestId.current
    // An error replaces the previous city instead of stacking on top of it
    const fail = (message) => {
      setWeather(null)
      setAq(null)
      setLocation(null)
      setError(message)
    }
    setLoading(true)
    setError(null)

    try {
      const loc = await resolveLocation()
      if (id !== requestId.current) return null
      if (!loc) {
        fail('City not found. Try another name.')
        return null
      }

      const params = new URLSearchParams({
        latitude:  loc.lat,
        longitude: loc.lon,
        current: [
          'temperature_2m','relative_humidity_2m','apparent_temperature',
          'weather_code','wind_speed_10m','wind_direction_10m',
          'surface_pressure','uv_index','precipitation','is_day',
        ].join(','),
        hourly: [
          'temperature_2m','weather_code','precipitation_probability','is_day',
        ].join(','),
        daily: [
          'weather_code','temperature_2m_max','temperature_2m_min',
          'precipitation_sum','uv_index_max','sunrise','sunset',
        ].join(','),
        timezone: 'auto',
        forecast_days: 7,
      })

      const aqParams = new URLSearchParams({
        latitude:  loc.lat,
        longitude: loc.lon,
        current: ['european_aqi', 'pm2_5', 'pm10', 'ozone', 'nitrogen_dioxide'].join(','),
      })

      // Air quality is optional: its failure must not hide the forecast
      const [wData, aqData] = await Promise.all([
        getJSON(`${WEATHER_API}?${params}`),
        getJSON(`${AQ_API}?${aqParams}`).catch(() => null),
      ])
      if (id !== requestId.current) return null
      setLocation(loc)
      setWeather(wData)
      setAq(aqData?.current ?? null)
      return loc
    } catch {
      if (id === requestId.current) fail('Failed to fetch weather data. Please try again.')
      return null
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [])

  const search = useCallback((query) => {
    if (!query.trim()) return Promise.resolve(null)
    return load(async () => {
      const geo = await getJSON(`${GEO_API}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`)
      return geo.results?.length ? toLocation(geo.results[0]) : null
    })
  }, [load])

  // Favorites already know their coordinates: skip geocoding (and its ambiguity)
  const open = useCallback((loc) => load(async () => loc), [load])

  return { weather, aq, location, loading, error, search, open }
}
