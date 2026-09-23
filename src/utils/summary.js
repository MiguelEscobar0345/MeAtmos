import { getWMO } from './weatherCodes'
import { formatClock } from './formatters'
import { nextHours, todayIndex } from './forecast'

const WET = new Set(['drizzle', 'rain', 'showers', 'sleet', 'thunder', 'hail', 'snow'])
const isWet = (code) => WET.has(getWMO(code).icon)
const isSnow = (code) => getWMO(code).icon === 'snow'
const hour = (iso) => formatClock(iso)

// A few short sentences about the next hours, from the same data the
// cards show: when the rain starts or stops, where the temperature goes and
// how today compares with yesterday.
export function summarize(weather, { fmtTemp, tempDelta }) {
  const hours = nextHours(weather)
  const next12 = hours.slice(0, 12)
  const nowCode = weather.current.weather_code
  const parts = []

  if (isWet(nowCode)) {
    const what = isSnow(nowCode) ? 'Nieva' : 'Llueve'
    const stop = next12.findIndex((h, i) => i > 0 && !isWet(h.code) && h.precip < 40)
    parts.push(stop > 0 ? `${what} ahora; para hacia las ${hour(next12[stop].time)}.` : `${what} durante las próximas horas.`)
  } else {
    // "Probable" only when the probability says so; a wet code with a low
    // probability is just "posible"
    const likely = next12.findIndex((h, i) => i > 0 && h.precip >= 50)
    const maybe = next12.findIndex((h, i) => i > 0 && (h.precip >= 30 || isWet(h.code)))
    const what = (h) => (isSnow(h.code) ? 'nieve' : 'lluvia')
    if (likely > 0) {
      const h = next12[likely]
      parts.push(`Probable ${what(h)} desde las ${hour(h.time)} (${h.precip}%).`)
    } else if (maybe > 0) {
      const h = next12[maybe]
      parts.push(`Posible ${what(h)} hacia las ${hour(h.time)}${h.precip >= 30 ? ` (${h.precip}%)` : ''}.`)
    } else {
      parts.push('Sin lluvia en las próximas 12 horas.')
    }
  }

  // Still warming up today, or cooling down from here on
  const today = weather.current.time.slice(0, 10)
  const rest = hours.filter(h => h.time.startsWith(today))
  const peak = rest.reduce((a, b) => (b.temp > a.temp ? b : a), rest[0] ?? hours[0])
  let trend
  if (peak && peak !== hours[0] && peak.temp - hours[0].temp >= 1) {
    trend = `Máxima de ${fmtTemp(peak.temp)} a las ${hour(peak.time)}`
  } else {
    const low = next12.reduce((a, b) => (b.temp < a.temp ? b : a), next12[0])
    trend = low.temp < hours[0].temp - 1 ? `Baja a ${fmtTemp(low.temp)} hacia las ${hour(low.time)}` : 'Temperatura estable'
  }

  parts.push(`${trend}.`)

  // Needs past_days=1: yesterday sits right before today in the daily arrays
  const i = todayIndex(weather)
  const max = weather.daily.temperature_2m_max
  if (i > 0 && max[i] != null && max[i - 1] != null) {
    const diff = Math.round(tempDelta(max[i] - max[i - 1]))
    parts.push(diff >= 2 ? `${diff}° más cálido que ayer.` : diff <= -2 ? `${-diff}° más fresco que ayer.` : 'Parecido a ayer.')
  }
  return parts.join(' ')
}
