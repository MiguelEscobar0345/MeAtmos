// Open-Meteo: free, no key. Attribution (CC BY 4.0) lives in the footer.
const GEO_API      = 'https://geocoding-api.open-meteo.com/v1/search'
const GEO_GET_API  = 'https://geocoding-api.open-meteo.com/v1/get'
const WEATHER_API  = 'https://api.open-meteo.com/v1/forecast'
const AQ_API       = 'https://air-quality-api.open-meteo.com/v1/air-quality'

async function getJSON(url, signal) {
  const res = await fetch(url, { signal })
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

// Spanish names first ("Tokyo" → Tokio, "London" → Londres), but some English
// names miss in Spanish ("New York" → York, Nebraska). Ask both and let an
// English-only hit lead only when it is a bigger place than every Spanish one.
export async function geocode(query, { count = 6, signal } = {}) {
  const url = (lang) => `${GEO_API}?name=${encodeURIComponent(query)}&count=${count}&language=${lang}&format=json`
  const [es, en] = await Promise.all([
    getJSON(url('es'), signal),
    getJSON(url('en'), signal).catch(() => ({})),
  ])
  const esResults = es.results ?? []
  const seen = new Set(esResults.map(r => r.id))
  const biggest = Math.max(0, ...esResults.map(r => r.population ?? 0))
  const lead = []
  const tail = []
  for (const r of en.results ?? []) {
    if (seen.has(r.id)) continue
    ;((r.population ?? 0) > biggest ? lead : tail).push(r)
  }
  // A leading English-only hit is shown first, so fetch its Spanish record
  // ("New York" → Nueva York). Rare, and usually a single request.
  const leadEs = await Promise.all(
    lead.map(r => getJSON(`${GEO_GET_API}?id=${r.id}&language=es`, signal).catch(() => r)),
  )
  return [...leadEs, ...esResults, ...tail].slice(0, count).map(toLocation)
}

// A shared URL only carries the GeoNames id. The API answers 400 for ids it
// doesn't know (or that aren't Int32), which is "not found", not a network error.
export async function lookupLocation(id) {
  const res = await fetch(`${GEO_GET_API}?id=${id}&language=es`)
  if (res.status === 400) return null
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return toLocation(await res.json())
}

const CURRENT = [
  'temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'dew_point_2m',
  'weather_code', 'is_day', 'cloud_cover', 'precipitation',
  'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m',
  'pressure_msl', 'uv_index',
]
const HOURLY = ['temperature_2m', 'weather_code', 'precipitation_probability', 'is_day']
const DAILY = [
  'weather_code', 'temperature_2m_max', 'temperature_2m_min',
  'precipitation_sum', 'precipitation_probability_max', 'uv_index_max', 'sunrise', 'sunset',
]

export function fetchForecast(loc) {
  const params = new URLSearchParams({
    latitude:  loc.lat,
    longitude: loc.lon,
    current:   CURRENT.join(','),
    hourly:    HOURLY.join(','),
    daily:     DAILY.join(','),
    timezone:  'auto',
    forecast_days: 7,
    // Yesterday, for "warmer than yesterday"; views locate today by date
    past_days: 1,
  })
  return getJSON(`${WEATHER_API}?${params}`)
}

export async function fetchAirQuality(loc) {
  const params = new URLSearchParams({
    latitude:  loc.lat,
    longitude: loc.lon,
    current:   'european_aqi,pm2_5,pm10,ozone,nitrogen_dioxide',
  })
  const data = await getJSON(`${AQ_API}?${params}`)
  return data.current ?? null
}

// Current conditions for many places in ONE request: the API accepts
// comma-separated coordinates and answers with an array (object for one).
export async function fetchCurrentMany(coords, signal) {
  const params = new URLSearchParams({
    latitude:  coords.map(c => c.lat).join(','),
    longitude: coords.map(c => c.lon).join(','),
    current:   'temperature_2m,weather_code,is_day',
    timezone:  'auto',
  })
  const data = await getJSON(`${WEATHER_API}?${params}`, signal)
  // The offset lets each card run the city's own clock
  return (Array.isArray(data) ? data : [data]).map(d => ({ ...d.current, offset: d.utc_offset_seconds }))
}
