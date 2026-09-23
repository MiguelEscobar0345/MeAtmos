import { useId, useRef, useState } from 'react'
import { m } from 'motion/react'
import WeatherIcon from './WeatherIcon'
import { getWMO } from '../utils/weatherCodes'
import { formatTemp, formatClock } from '../utils/formatters'
import { nextHours } from '../utils/forecast'
import { tempColor } from '../utils/temperature'
import { smoothPath, runs } from '../utils/chart'
import { useElementWidth } from '../hooks/useElementWidth'
import { EASE, rise } from '../utils/motion'
import './HourlyChart.css'

const H = 200
const PX = 18           // horizontal padding so edge labels fit
const ICON_Y = 2
const CURVE_TOP = 62
const CURVE_BOTTOM = 124
const BAR_TOP = 138
const BAR_BOTTOM = 166
const LABEL_Y = 188
const FOLLOW = { type: 'spring', stiffness: 500, damping: 40 }

const describe = (h, i) =>
  `${i === 0 ? 'Ahora' : formatClock(h.time)}, ${formatTemp(h.temp)}, ${getWMO(h.code).label.toLowerCase()}, ${h.precip}% de probabilidad de lluvia`

export default function HourlyChart({ weather }) {
  const wrapRef = useRef(null)
  const width = useElementWidth(wrapRef)
  const [active, setActive] = useState(0)
  const gradId = useId()
  const hours = nextHours(weather)
  const n = hours.length
  const current = hours[Math.min(active, n - 1)]

  const temps = hours.map(h => h.temp)
  const minT = Math.min(...temps)
  const maxT = Math.max(...temps)
  const span = maxT - minT || 1
  const innerW = Math.max(1, width - PX * 2)
  const x = (i) => PX + (i * innerW) / (n - 1)
  const y = (t) => CURVE_BOTTOM - ((t - minT) / span) * (CURVE_BOTTOM - CURVE_TOP)
  const every = width >= 900 ? 2 : width >= 560 ? 3 : 4
  const slot = innerW / (n - 1)

  const points = hours.map((h, i) => [x(i), y(h.temp)])
  const line = smoothPath(points)
  const area = `${line}L${x(n - 1)},${CURVE_BOTTOM + 6}L${x(0)},${CURVE_BOTTOM + 6}Z`
  const nights = runs(hours, h => !h.isDay)

  const move = (i) => setActive(Math.max(0, Math.min(n - 1, i)))

  const onKeyDown = (e) => {
    const keys = { ArrowRight: 1, ArrowLeft: -1, PageUp: 6, PageDown: -6 }
    if (e.key in keys) move(active + keys[e.key])
    else if (e.key === 'Home') move(0)
    else if (e.key === 'End') move(n - 1)
    else return
    e.preventDefault()
  }

  const onPointer = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    move(Math.round(((e.clientX - rect.left - PX) / innerW) * (n - 1)))
  }

  return (
    <m.section
      className="card hourly"
      aria-labelledby="hourly-title"
      variants={rise}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.15 }}
    >
      <div className="hourly__head">
        <h2 id="hourly-title" className="eyebrow">Próximas 24 horas</h2>
        <p className="hourly__readout" aria-hidden="true">
          <strong>{active === 0 ? 'Ahora' : formatClock(current.time)}</strong>
          <span className="num">{formatTemp(current.temp)}</span>
          <span>{getWMO(current.code).label}</span>
          <span className="hourly__rain num">{current.precip}% lluvia</span>
        </p>
      </div>

      <div
        ref={wrapRef}
        className="hourly__chart"
        tabIndex={0}
        role="slider"
        aria-label="Pronóstico por hora. Usa las flechas para recorrer las horas."
        aria-valuemin={0}
        aria-valuemax={n - 1}
        aria-valuenow={active}
        aria-valuetext={describe(current, active)}
        onKeyDown={onKeyDown}
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        onPointerLeave={e => { if (e.pointerType === 'mouse') setActive(0) }}
      >
        {width > 0 && (
          <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} aria-hidden="true">
            <defs>
              <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1={x(0)} x2={x(n - 1)} y1="0" y2="0">
                {hours.map((h, i) => (
                  <stop key={h.time} offset={i / (n - 1)} stopColor={tempColor(h.temp)} />
                ))}
              </linearGradient>
            </defs>

            {nights.map(([a, b]) => (
              <rect
                key={a}
                className="hourly__night"
                x={Math.max(0, x(a) - slot / 2)}
                y={0}
                width={Math.min(width, x(b) + slot / 2) - Math.max(0, x(a) - slot / 2)}
                height={BAR_BOTTOM + 4}
                rx={10}
              />
            ))}

            {/* Rain bars grow from the baseline, one hour after another */}
            {hours.map((h, i) => {
              const barH = Math.max(1.5, (h.precip / 100) * (BAR_BOTTOM - BAR_TOP))
              return (
                <m.rect
                  key={h.time}
                  className="hourly__bar"
                  x={x(i) - slot * 0.28}
                  width={slot * 0.56}
                  rx={2}
                  initial={{ y: BAR_BOTTOM, height: 0 }}
                  animate={{ y: BAR_BOTTOM - barH, height: barH }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.5 + i * 0.025 }}
                />
              )
            })}

            {/* The line draws itself left to right, then the area fades in under it */}
            <m.path
              className="hourly__area"
              d={area}
              fill={`url(#${gradId})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.14 }}
              transition={{ duration: 0.8, delay: 1 }}
            />
            <m.path
              className="hourly__line"
              d={line}
              stroke={`url(#${gradId})`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, ease: EASE, delay: 0.2 }}
            />

            <m.line
              className="hourly__guide"
              y1={ICON_Y + 30}
              y2={BAR_BOTTOM}
              initial={false}
              animate={{ x1: x(active), x2: x(active) }}
              transition={FOLLOW}
            />

            {hours.map((h, i) => (i % every === 0 || i === active) && (
              <g key={h.time} className={`hourly__tick ${i === active ? 'is-active' : ''}`}>
                {i % every === 0 && (
                  <WeatherIcon icon={getWMO(h.code).icon} isDay={h.isDay} size={24} x={x(i) - 12} y={ICON_Y} />
                )}
                <text className="hourly__temp" x={x(i)} y={y(h.temp) - 12} textAnchor="middle">
                  {formatTemp(h.temp)}
                </text>
                {i % every === 0 && (
                  <text className="hourly__hour" x={x(i)} y={LABEL_Y} textAnchor="middle">
                    {i === 0 ? 'Ahora' : formatClock(h.time)}
                  </text>
                )}
              </g>
            ))}

            <m.circle
              className="hourly__dot"
              r={5.5}
              initial={false}
              animate={{ cx: x(active), cy: y(current.temp), stroke: tempColor(current.temp) }}
              transition={FOLLOW}
            />
          </svg>
        )}
      </div>

      <p className="hourly__legend">
        <span className="hourly__legend-bar" aria-hidden="true" /> Probabilidad de lluvia
        <span className="hourly__legend-night" aria-hidden="true" /> Noche
      </p>
    </m.section>
  )
}
