import { AQI_LEVELS, getAQILevel } from '../utils/weatherCodes'
import './Conditions.css'

const SCALE_MAX = 120 // six EEA bands of 20 points each

export default function AirQuality({ aq }) {
  if (aq?.european_aqi == null) {
    return (
      <section className="card cond air" aria-labelledby="air-title">
        <h2 id="air-title" className="eyebrow">Calidad del aire</h2>
        <p className="cond__empty">No hay datos de calidad del aire para este lugar.</p>
      </section>
    )
  }

  const aqi = Math.round(aq.european_aqi)
  const level = getAQILevel(aqi)
  const pos = (Math.min(aqi, SCALE_MAX) / SCALE_MAX) * 100
  const pollutants = [
    { label: 'PM2.5', value: aq.pm2_5, digits: 1 },
    { label: 'PM10',  value: aq.pm10, digits: 1 },
    { label: 'O₃',    value: aq.ozone, digits: 0 },
    { label: 'NO₂',   value: aq.nitrogen_dioxide, digits: 1 },
  ]

  return (
    <section className="card cond air" aria-labelledby="air-title">
      <h2 id="air-title" className="eyebrow">Calidad del aire</h2>
      <p className="air__score">
        <span className="cond__value">{aqi}</span>
        <span className="air__level">
          <span className="air__dot" style={{ '--c': level.color }} aria-hidden="true" />
          {level.label}
        </span>
      </p>
      <p className="cond__sub">{level.desc}</p>

      <div className="air__scale" aria-hidden="true">
        {AQI_LEVELS.map(l => <span key={l.label} className="air__band" style={{ '--c': l.color }} />)}
        <span className="air__marker" style={{ '--pos': `${pos}%` }} />
      </div>
      <div className="air__ticks num" aria-hidden="true">
        <span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100+</span>
      </div>

      <dl className="air__pollutants">
        {pollutants.map(p => (
          <div key={p.label}>
            <dt>{p.label}</dt>
            <dd className="num">
              {p.value != null ? p.value.toFixed(p.digits) : '—'}
              <span> µg/m³</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="cond__note">Índice europeo (EEA): menos es mejor.</p>
    </section>
  )
}
