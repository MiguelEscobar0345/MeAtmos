import { useEffect, useState } from 'react'
import { fetchCurrentMany } from '../api/openMeteo'

export const favKey = (f) => (f.id != null ? `id:${f.id}` : `name:${f.name}|${f.country_code}`)
const coordKey = (f) => `${f.lat},${f.lon}`

// Live conditions for every saved city with ONE request
export function useFavoritesWeather(favorites) {
  const [live, setLive] = useState({})
  const query = favorites
    .filter(f => f.lat != null && f.lon != null)
    .map(coordKey)
    .join(';')

  useEffect(() => {
    if (!query) return
    const controller = new AbortController()
    const coords = query.split(';').map(c => {
      const [lat, lon] = c.split(',')
      return { lat, lon }
    })

    fetchCurrentMany(coords, controller.signal)
      .then(list => {
        const next = {}
        list.forEach((current, i) => { next[coordKey(coords[i])] = current })
        setLive(next)
      })
      .catch(() => { /* cards keep their skeleton or saved snapshot */ })

    return () => controller.abort()
  }, [query])

  return (f) => (f.lat != null ? live[coordKey(f)] : undefined)
}
