import { formatClock, formatDuration } from '../utils/formatters'
import { sunState } from '../utils/sky'
import './Conditions.css'

// Arc geometry: a half circle over the horizon
const CX = 130
const CY = 118
const R = 100

export default function SunCard({ weather }) {
  const sun = sunState(weather)

  if (!sun || sun.dayLength <= 0) {
    return (
      <section className="card cond sun" aria-labelledby="sun-title">
        <h2 id="sun-title" className="eyebrow">Sol</h2>
        <p className="cond__empty">Hoy no hay amanecer ni atardecer en este lugar.</p>
      </section>
    )
  }

  const { sunrise, sunset, nextSunrise, dayLength, sinceRise, untilSet } = sun
  const isUp = sinceRise >= 0 && untilSet >= 0
  const t = Math.max(0, Math.min(1, sun.progress))
  const angle = Math.PI * (1 - t)
  const sx = CX + R * Math.cos(angle)
  const sy = CY - R * Math.sin(angle)

  const status = sinceRise < 0
    ? `Amanece en ${formatDuration(-sinceRise)}`
    : isUp
      ? `Quedan ${formatDuration(untilSet)} de sol`
      : nextSunrise ? `Mañana amanece a las ${formatClock(nextSunrise)}` : 'Ya anocheció'

  return (
    <section className="card cond sun" aria-labelledby="sun-title">
      <h2 id="sun-title" className="eyebrow">Sol</h2>
      <p className="cond__lead">{status}</p>

      <svg className="sun__arc" viewBox="0 0 260 132" aria-hidden="true">
        <path className="sun__track" d={`M${CX - R} ${CY}A${R} ${R} 0 0 1 ${CX + R} ${CY}`} />
        <path
          className="sun__done"
          d={`M${CX - R} ${CY}A${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          pathLength="1"
          strokeDasharray={`${t} 1`}
        />
        <line className="sun__horizon" x1="6" x2="254" y1={CY} y2={CY} />
        <circle className={`sun__body ${isUp ? '' : 'is-down'}`} cx={sx} cy={sy} r="9" />
      </svg>

      <dl className="sun__times">
        <div>
          <dt>Amanecer</dt>
          <dd className="num">{formatClock(sunrise)}</dd>
        </div>
        <div>
          <dt>Luz del día</dt>
          <dd className="num">{formatDuration(dayLength)}</dd>
        </div>
        <div>
          <dt>Atardecer</dt>
          <dd className="num">{formatClock(sunset)}</dd>
        </div>
      </dl>
    </section>
  )
}
