import { geocode, lookupLocation } from './openMeteo'

// Open-Meteo has no reverse geocoding. BigDataCloud's client endpoint (free,
// no key, meant for browsers) returns the GeoNames ids around a point, the
// same ids Open-Meteo uses, so "my location" becomes a normal /c/<id> URL.
const REVERSE_API = 'https://api-bdc.io/data/reverse-geocode-client'

// ~1 km is enough to know the city; no need to send a precise position
const coarse = (v) => Math.round(v * 100) / 100

const distance = (a, b) => Math.hypot(a.lat - b.lat, (a.lon - b.lon) * Math.cos((a.lat * Math.PI) / 180))

export async function nearestCity(latitude, longitude) {
  const here = { lat: coarse(latitude), lon: coarse(longitude) }
  const res = await fetch(`${REVERSE_API}?latitude=${here.lat}&longitude=${here.lon}&localityLanguage=es`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const name = data.city || data.locality
  if (!name) return null

  // The most specific administrative entry named like the city is the city
  // itself (Tokio: prefecture 1850144, then city 1850147)
  const ids = (data.localityInfo?.administrative ?? [])
    .filter(a => a.geonameId && a.name === name)
    .map(a => a.geonameId)
    .reverse()
  for (const id of ids) {
    const loc = await lookupLocation(id).catch(() => null)
    if (loc) return loc
  }

  // Otherwise: same name, same country, closest to where we are
  const candidates = (await geocode(name, { count: 10 })).filter(l => l.country_code === data.countryCode)
  return candidates.sort((a, b) => distance(a, here) - distance(b, here))[0] ?? null
}
