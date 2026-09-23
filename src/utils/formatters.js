// Open-Meteo (timezone=auto) returns the city's local wall-clock time without an
// offset: "2026-09-23T11:00" or "2026-09-23". Parsing those with `new Date()`
// shifts them into the browser's zone (date-only strings even parse as UTC).
// Read them as UTC and format them in UTC so the wall clock stays untouched.
export const wallClock = (iso) => new Date(iso.length === 10 ? `${iso}T00:00Z` : `${iso}Z`)

const fmt = (iso, opts) => wallClock(iso).toLocaleString('es', { ...opts, timeZone: 'UTC' })
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// "2026-09-23T11:15" → "2026-09-23T11:00", comparable with hourly.time entries
export const currentHour = (iso) => `${iso.slice(0, 13)}:00`

export const formatTemp  = (t) => `${Math.round(t)}°`
export const formatClock = (iso) => iso.slice(11, 16)
export const formatDay   = (iso) => cap(fmt(iso, { weekday: 'short' }).replace('.', ''))
export const formatDate  = (iso) => cap(fmt(iso, { weekday: 'long', day: 'numeric', month: 'long' }))
export const formatWind  = (kmh) => `${Math.round(kmh)} km/h`

export const minutesBetween = (fromIso, toIso) =>
  Math.round((wallClock(toIso) - wallClock(fromIso)) / 60000)

export const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h ? `${h} h ${m} min` : `${m} min`
}

export const countryName = (code, fallback) => {
  try {
    return new Intl.DisplayNames(['es'], { type: 'region' }).of(code) ?? fallback
  } catch {
    return fallback
  }
}
