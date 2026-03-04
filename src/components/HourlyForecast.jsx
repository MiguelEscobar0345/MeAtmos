import React, { useRef } from 'react'
import { getWMO } from '../utils/weatherCodes'
import { formatTemp, formatHour } from '../utils/formatters'

export default function HourlyForecast({ weather }) {
  const scrollRef = useRef(null)
  const now = new Date()

  // Get next 24 hours
  const hours = weather.hourly.time
    .map((t, i) => ({
      time: t,
      temp: weather.hourly.temperature_2m[i],
      code: weather.hourly.weather_code[i],
      precip: weather.hourly.precipitation_probability[i],
    }))
    .filter(h => new Date(h.time) >= now)
    .slice(0, 24)

  const temps = hours.map(h => h.temp)
  const minT  = Math.min(...temps)
  const maxT  = Math.max(...temps)

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px 28px',
      animation: 'fadeUp 0.5s ease 0.2s both',
    }}>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>
        24-Hour Forecast
      </div>

      <div
        ref={scrollRef}
        style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}
      >
        {hours.map((h, i) => {
          const wmo   = getWMO(h.code)
          const norm  = maxT === minT ? 0.5 : (h.temp - minT) / (maxT - minT)
          const isNow = i === 0
          return (
            <div key={h.time} style={{
              flexShrink: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '12px 10px',
              borderRadius: 12,
              background: isNow ? 'rgba(96,165,250,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isNow ? 'rgba(96,165,250,0.3)' : 'transparent'}`,
              minWidth: 58,
            }}>
              <div style={{ fontSize: '0.7rem', color: isNow ? 'var(--accent)' : 'var(--text-3)', fontFamily: 'var(--font-mono)', fontWeight: isNow ? 600 : 400 }}>
                {isNow ? 'Now' : formatHour(h.time)}
              </div>
              <div style={{ fontSize: '1.2rem' }}>{wmo.emoji}</div>
              {/* Temp bar */}
              <div style={{ height: 40, width: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', bottom: 0, width: '100%',
                  height: `${Math.max(10, norm * 100)}%`,
                  background: `hsl(${200 + norm * 40}, 80%, 65%)`,
                  borderRadius: 2, transition: 'height 0.8s ease',
                }} />
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>
                {formatTemp(h.temp)}
              </div>
              {h.precip > 0 && (
                <div style={{ fontSize: '0.62rem', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                  {h.precip}%
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}