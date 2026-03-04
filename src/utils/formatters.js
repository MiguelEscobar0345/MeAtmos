export const formatTemp  = (t) => `${Math.round(t)}°`
export const formatHour  = (iso) => {
  const d = new Date(iso)
  const h = d.getHours()
  return h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`
}
export const formatDay = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en', { weekday: 'short' })
}
export const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })
}
export const formatWind = (ms) => `${Math.round(ms * 3.6)} km/h`
export const msToKmh    = (ms) => Math.round(ms * 3.6)
export const uvLabel    = (uv) => {
  if (uv <= 2)  return { label: 'Low',       color: '#34d399' }
  if (uv <= 5)  return { label: 'Moderate',  color: '#fbbf24' }
  if (uv <= 7)  return { label: 'High',      color: '#f97316' }
  if (uv <= 10) return { label: 'Very High', color: '#f87171' }
  return            { label: 'Extreme',      color: '#c026d3' }
}