import { m } from 'motion/react'
import { beaufort, windFrom } from '../utils/weatherCodes'
import { rise } from '../utils/motion'
import { useUnits } from '../hooks/useUnits'
import './Conditions.css'

const TICKS = Array.from({ length: 24 }, (_, i) => i * 15)
const LABELS = [['N', 0], ['E', 90], ['S', 180], ['O', 270]]
const reveal = { variants: rise, initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.3 } }

export default function WindCard({ weather }) {
  const c = weather.current
  const units = useUnits()
  const speed = Math.round(c.wind_speed_10m)
  const gusts = c.wind_gusts_10m != null ? Math.round(c.wind_gusts_10m) : null
  const from = c.wind_direction_10m
  const calm = speed < 1
  // Gustier wind → livelier needle (degrees of wobble)
  const wobble = Math.max(1, Math.min(7, ((gusts ?? speed) - speed) / 4))

  return (
    <m.section className="card cond wind" aria-labelledby="wind-title" {...reveal}>
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
          {/* The arrow points where the wind goes: it swings in from north like a
              real needle, then keeps a small wobble. The invisible circle makes
              each group's box centered on the compass, so rotation pivots there. */}
          {!calm && (
            <m.g
              className="wind__arrow"
              variants={{
                hidden: { rotate: 0 },
                visible: { rotate: from + 180, transition: { type: 'spring', stiffness: 45, damping: 7, delay: 0.3 } },
              }}
            >
              <circle cx="60" cy="60" r="50" fill="none" />
              <m.g
                animate={{ rotate: [-wobble, wobble] }}
                transition={{ duration: 1.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
              >
                <circle cx="60" cy="60" r="50" fill="none" />
                <line x1="60" y1="92" x2="60" y2="30" />
                <path d="M60 22 67 36 60 32 53 36z" />
              </m.g>
            </m.g>
          )}
          <circle className="wind__hub" cx="60" cy="60" r="3.5" />
        </svg>

        <div>
          <p className="cond__value">{units.wind(c.wind_speed_10m)}<span className="cond__unit"> {units.windUnit}</span></p>
          <p className="cond__lead">{beaufort(c.wind_speed_10m)}</p>
          <p className="cond__sub">
            {calm ? 'Aire en calma' : `Viene del ${windFrom(from)} (${Math.round(from)}°)`}
          </p>
          {gusts != null && <p className="cond__sub">Ráfagas de <span className="num">{units.wind(gusts)} {units.windUnit}</span></p>}
        </div>
      </div>
    </m.section>
  )
}
