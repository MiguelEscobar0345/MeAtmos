import { m } from 'motion/react'
import { formatClock, formatDuration } from '../utils/formatters'
import { sunState } from '../utils/sky'
import { EASE, rise } from '../utils/motion'
import './Conditions.css'

// Arc geometry: a half circle over the horizon
const CX = 130
const CY = 118
const R = 100
const ARC = `M${CX - R} ${CY}A${R} ${R} 0 0 1 ${CX + R} ${CY}`
const reveal = { variants: rise, initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.3 } }

export default function SunCard({ weather }) {
  const sun = sunState(weather)
  const t = sun ? Math.max(0, Math.min(1, sun.progress)) : 0
  const travel = { duration: 1.6, ease: EASE, delay: 0.35 }

  if (!sun || sun.dayLength <= 0) {
    return (
      <m.section className="card cond sun" aria-labelledby="sun-title" {...reveal}>
        <h2 id="sun-title" className="eyebrow">Sol</h2>
        <p className="cond__empty">Hoy no hay amanecer ni atardecer en este lugar.</p>
      </m.section>
    )
  }

  const { sunrise, sunset, nextSunrise, dayLength, sinceRise, untilSet } = sun
  const isUp = sinceRise >= 0 && untilSet >= 0

  const status = sinceRise < 0
    ? `Amanece en ${formatDuration(-sinceRise)}`
    : isUp
      ? `Quedan ${formatDuration(untilSet)} de sol`
      : nextSunrise ? `Mañana amanece a las ${formatClock(nextSunrise)}` : 'Ya anocheció'

  return (
    <m.section className="card cond sun" aria-labelledby="sun-title" {...reveal}>
      <h2 id="sun-title" className="eyebrow">Sol</h2>
      <p className="cond__lead">{status}</p>

      <svg className="sun__arc" viewBox="0 0 260 132" aria-hidden="true">
        <path className="sun__track" d={ARC} />
        <m.path
          className="sun__done"
          d={ARC}
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: t, transition: travel } }}
        />
        <line className="sun__horizon" x1="6" x2="254" y1={CY} y2={CY} />
        {/* The sun sits at sunrise; rotating the group t·180° around the arc's
            center walks it along the arc to where it is now. The invisible
            circle centers the group's box on that pivot. */}
        <m.g variants={{ hidden: { rotate: 0 }, visible: { rotate: t * 180, transition: travel } }}>
          <circle cx={CX} cy={CY} r={R} fill="none" />
          <circle className={`sun__body ${isUp ? '' : 'is-down'}`} cx={CX - R} cy={CY} r="9" />
        </m.g>
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
    </m.section>
  )
}
