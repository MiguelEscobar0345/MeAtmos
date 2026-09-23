import { useEffect, useState } from 'react'

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'

export const favKey = (f) => (f.id != null ? `id:${f.id}` : `name:${f.name}|${f.country_code}`)

// Current conditions for every saved city in ONE request: the forecast API
// accepts comma-separated coordinates and answers with an array.
export function useFavoritesWeather(favorites) {
  const [live, setLive] = useState({})
  const withCoords = favorites.filter(f => f.lat != null && f.lon != null)
  const query = withCoords.map(f => `${f.lat},${f.lon}`).join(';')

  useEffect(() => {
    if (!query) return
    let cancelled = false
    const coords = query.split(';').map(c => c.split(','))
    const params = new URLSearchParams({
      latitude:  coords.map(c => c[0]).join(','),
      longitude: coords.map(c => c[1]).join(','),
      current:   'temperature_2m,weather_code,is_day',
      timezone:  'auto',
    })

    fetch(`${WEATHER_API}?${params}`)
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(data => {
        if (cancelled) return
        const list = Array.isArray(data) ? data : [data]
        const next = {}
        list.forEach((entry, i) => {
          next[`${coords[i][0]},${coords[i][1]}`] = entry.current
        })
        setLive(next)
      })
      .catch(() => { /* cards fall back to their saved snapshot */ })

    return () => { cancelled = true }
  }, [query])

  return (f) => (f.lat != null ? live[`${f.lat},${f.lon}`] : undefined)
}
