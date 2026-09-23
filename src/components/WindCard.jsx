import { beaufort, windFrom } from '../utils/weatherCodes'
import './Conditions.css'

const TICKS = Array.from({ length: 24 }, (_, i) => i * 15)
const LABELS = [['N', 0], ['E', 90], ['S', 180], ['O', 270]]

export default function WindCard({ weather }) {
  const c = weather.current
  const speed = Math.round(c.wind_speed_10m)
  const gusts = c.wind_gusts_10m != null ? Math.round(c.wind_gusts_10m) : null
  const from = c.wind_direction_10m
  const calm = speed < 1

  return (
    <section className="card cond wind" aria-labelledby="wind-title">
      <h2 id="wind-title" className="eyebrow">Viento</h2>
      <div className="wind__body">
        <svg className="wind__compass" viewBox="0 0 120 120" role="img"
          aria-label={calm ? 'Sin viento' : `Viento del ${windFrom(from)}`}>
          <circle className="wind__ring" cx="60" cy="60" r="50" />
          {TICKS.map(a => (
            <line
              key={a}
              className={`wind__tick ${a % 90 === 0 ? 'is-major' : ''}`}
              x1="60" y1="12" x2="60" y2={a % 90 === 0 ? 20 : 16}
              transform={`rotate(${a} 60 60)`}
            />
          ))}
          {LABELS.map(([l, a]) => {
            const rad = ((a - 90) * Math.PI) / 180
            return (
              <text key={l} className="wind__label" x={60 + Math.cos(rad) * 31} y={60 + Math.sin(rad) * 31 + 4} textAnchor="middle">{l}</text>
            )
          })}
          {/* The arrow points where the wind goes: opposite to where it comes from */}
          {!calm && (
            <g className="wind__arrow" transform={`rotate(${from + 180} 60 60)`}>
              <line x1="60" y1="92" x2="60" y2="30" />
              <path d="M60 22 67 36 60 32 53 36z" />
            </g>
          )}
          <circle className="wind__hub" cx="60" cy="60" r="3.5" />
        </svg>

        <div>
          <p className="cond__value">{speed}<span className="cond__unit"> km/h</span></p>
          <p className="cond__lead">{beaufort(c.wind_speed_10m)}</p>
          <p className="cond__sub">
            {calm ? 'Aire en calma' : `Viene del ${windFrom(from)} (${Math.round(from)}°)`}
          </p>
          {gusts != null && <p className="cond__sub">Ráfagas de <span className="num">{gusts} km/h</span></p>}
        </div>
      </div>
    </section>
  )
}
