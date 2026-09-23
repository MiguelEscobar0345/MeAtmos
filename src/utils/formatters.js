// Open-Meteo (timezone=auto) returns the city's local wall-clock time without an
// offset: "2026-09-23T11:00" or "2026-09-23". Parsing those with `new Date()`
// shifts them into the browser's zone (date-only strings even parse as UTC).
// Read them as UTC and format them in UTC so the wall clock stays untouched.
export const wallClock = (iso) => new Date(iso.length === 10 ? `${iso}T00:00Z` : `${iso}Z`)

const fmt = (iso, opts) => wallClock(iso).toLocaleString('en', { ...opts, timeZone: 'UTC' })

// "2026-09-23T11:15" → "2026-09-23T11:00", comparable with hourly.time entries
export const currentHour = (iso) => `${iso.slice(0, 13)}:00`

export const formatTemp  = (t) => `${Math.round(t)}°`
export const formatHour  = (iso) => fmt(iso, { hour: 'numeric' }).replace(' ', '').toLowerCase()
export const formatClock = (iso) => fmt(iso, { hour: '2-digit', minute: '2-digit' })
export const formatDay   = (iso) => fmt(iso, { weekday: 'short' })
export const formatDate  = (iso) => fmt(iso, { weekday: 'long', month: 'long', day: 'numeric' })
// The forecast API already returns km/h (current_units.wind_speed_10m)
export const formatWind  = (kmh) => `${Math.round(kmh)} km/h`
export const uvLabel    = (uv) => {
  if (uv <= 2)  return { label: 'Low',       color: '#34d399' }
  if (uv <= 5)  return { label: 'Moderate',  color: '#fbbf24' }
  if (uv <= 7)  return { label: 'High',      color: '#f97316' }
  if (uv <= 10) return { label: 'Very High', color: '#f87171' }
  return            { label: 'Extreme',      color: '#c026d3' }
}
