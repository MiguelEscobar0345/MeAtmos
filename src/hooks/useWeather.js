import { useState, useCallback } from 'react'

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'

export function useWeather() {
  const [weather, setWeather]     = useState(null)
  const [location, setLocation]   = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const search = useCallback(async (query) => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)

    try {
      // 1. Geocode
      const geoRes = await fetch(`${GEO_API}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`)
      const geoData = await geoRes.json()

      if (!geoData.results?.length) {
        setError('City not found. Try another name.')
        setLoading(false)
        return
      }

      const loc = geoData.results[0]
      setLocation({ name: loc.name, country: loc.country, country_code: loc.country_code, lat: loc.latitude, lon: loc.longitude })

      // 2. Fetch weather
      const params = new URLSearchParams({
        latitude:  loc.latitude,
        longitude: loc.longitude,
        current: [
          'temperature_2m','relative_humidity_2m','apparent_temperature',
          'weather_code','wind_speed_10m','wind_direction_10m',
          'surface_pressure','uv_index','precipitation','is_day',
        ].join(','),
        hourly: [
          'temperature_2m','weather_code','precipitation_probability',
        ].join(','),
        daily: [
          'weather_code','temperature_2m_max','temperature_2m_min',
          'precipitation_sum','uv_index_max','sunrise','sunset',
        ].join(','),
        timezone: 'auto',
        forecast_days: 7,
      })

      const wRes  = await fetch(`${WEATHER_API}?${params}`)
      const wData = await wRes.json()
      setWeather(wData)
    } catch {
      setError('Failed to fetch weather data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  return { weather, location, loading, error, search }
}