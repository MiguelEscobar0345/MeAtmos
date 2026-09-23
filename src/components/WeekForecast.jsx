import WeatherIcon from './WeatherIcon'
import Icon from './Icon'
import { getWMO } from '../utils/weatherCodes'
import { formatTemp, formatDay } from '../utils/formatters'
import { tempColor } from '../utils/temperature'
import { todayIndex } from '../utils/forecast'
import './WeekForecast.css'

export default function WeekForecast({ weather }) {
  const d = weather.daily
  const today = todayIndex(weather)
  const days = d.time.map((time, i) => ({
    time,
    code: d.weather_code[i],
    max:  d.temperature_2m_max[i],
    min:  d.temperature_2m_min[i],
    rain: d.precipitation_probability_max?.[i] ?? 0,
    isToday: i === today,
  })).slice(today, today + 7)

  // Every bar shares the week's scale, so the rows compare at a glance
  const lo = Math.min(...days.map(x => x.min))
  const hi = Math.max(...days.map(x => x.max))
  const span = hi - lo || 1
  const pct = (t) => `${(((t - lo) / span) * 100).toFixed(1)}%`
  const now = weather.current.temperature_2m

  return (
    <section className="card week" aria-labelledby="week-title">
      <h2 id="week-title" className="eyebrow">Próximos 7 días</h2>
      <ol className="week__list">
        {days.map(day => {
          const wmo = getWMO(day.code)
          return (
            <li key={day.time} className={`week__row ${day.isToday ? 'is-today' : ''}`}>
              <span className="week__day">{day.isToday ? 'Hoy' : formatDay(day.time)}</span>
              <WeatherIcon icon={wmo.icon} size={30} label={wmo.label} />
              <span className="week__cond">{wmo.label}</span>
              <span className="week__rain num" title="Probabilidad máxima de lluvia">
                {day.rain >= 10 && (
                  <>
                    <Icon name="droplet" size={13} />
                    {day.rain}%
                    <span className="visually-hidden"> de probabilidad de lluvia</span>
                  </>
                )}
              </span>
              <span className="week__min num">
                <span className="visually-hidden">mínima </span>{formatTemp(day.min)}
              </span>
              <span
                className="range"
                aria-hidden="true"
                style={{
                  '--from': pct(day.min),
                  '--to': pct(day.max),
                  '--c1': tempColor(day.min),
                  '--c2': tempColor(day.max),
                  '--now': pct(now),
                }}
              >
                <span className="range__fill" />
                {day.isToday && <span className="range__now" title="Ahora" />}
              </span>
              <span className="week__max num">
                <span className="visually-hidden">máxima </span>{formatTemp(day.max)}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
