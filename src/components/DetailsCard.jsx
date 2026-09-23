import { m } from 'motion/react'
import Icon from './Icon'
import { getUVLevel } from '../utils/weatherCodes'
import { formatTemp } from '../utils/formatters'
import { todayIndex } from '../utils/forecast'
import { rise } from '../utils/motion'
import './Conditions.css'

export default function DetailsCard({ weather }) {
  const c = weather.current
  const d = weather.daily
  const i = todayIndex(weather)
  const uv = getUVLevel(c.uv_index ?? 0)
  const uvMax = d.uv_index_max[i]
  const uvMaxLevel = getUVLevel(uvMax ?? 0)
  const rainToday = d.precipitation_sum[i] ?? 0
  const rainChance = d.precipitation_probability_max?.[i]

  const items = [
    {
      icon: 'droplet',
      label: 'Humedad',
      value: <>{c.relative_humidity_2m}<span className="cond__unit">%</span></>,
      sub: `Punto de rocío ${formatTemp(c.dew_point_2m)}`,
    },
    {
      icon: 'gauge',
      label: 'Presión',
      value: <>{Math.round(c.pressure_msl)}<span className="cond__unit"> hPa</span></>,
      sub: 'Al nivel del mar',
    },
    {
      icon: 'uv',
      label: 'Índice UV',
      value: (
        <>
          {Math.round(c.uv_index ?? 0)}
          <span className="uv__tag">
            <span className="air__dot" style={{ '--c': uv.color }} aria-hidden="true" />
            {uv.label}
          </span>
        </>
      ),
      sub: uvMax != null ? `Máximo hoy ${Math.round(uvMax)} · ${uvMaxLevel.label.toLowerCase()}` : '',
    },
    {
      icon: 'umbrella',
      label: 'Lluvia hoy',
      value: <>{rainToday.toFixed(1)}<span className="cond__unit"> mm</span></>,
      sub: rainChance != null ? `Probabilidad ${rainChance}%` : '',
    },
  ]

  return (
    <m.section
      className="card cond details"
      aria-labelledby="details-title"
      variants={rise}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <h2 id="details-title" className="visually-hidden">Más datos</h2>
      <dl className="details__grid">
        {items.map(item => (
          <div key={item.label} className="details__item">
            <dt className="eyebrow">
              <Icon name={item.icon} size={15} />
              {item.label}
            </dt>
            <dd className="details__value">{item.value}</dd>
            {item.sub && <dd className="cond__sub">{item.sub}</dd>}
          </div>
        ))}
      </dl>
    </m.section>
  )
}
