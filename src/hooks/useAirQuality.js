import { useState, useEffect } from 'react'

const AQ_API = 'https://air-quality-api.open-meteo.com/v1/air-quality'

export function useAirQuality(lat, lon) {
  const [aq, setAq]           = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (lat == null || lon == null) return

    let cancelled = false

    const fetchAQ = async () => {
      setLoading(true)

      try {
        const params = new URLSearchParams({
          latitude:  lat,
          longitude: lon,
          current: ['european_aqi', 'pm2_5', 'pm10', 'ozone', 'nitrogen_dioxide'].join(','),
        })

        const res  = await fetch(`${AQ_API}?${params}`)
        const data = await res.json()

        if (!cancelled) setAq(data.current)
      } catch {
        // silently fail — AQ is optional data
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAQ()

    return () => { cancelled = true }
  }, [lat, lon])

  return { aq, loading }
}