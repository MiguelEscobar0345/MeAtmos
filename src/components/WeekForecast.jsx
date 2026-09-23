import React from 'react'
import { getWMO } from '../utils/weatherCodes'
import { formatTemp, formatDay } from '../utils/formatters'

export default function WeekForecast({ weather }) {
  const days = weather.daily.time.slice(0, 7)
  const allMaxes = weather.daily.temperature_2m_max
  const globalMax = Math.max(...allMaxes)
  const globalMin = Math.min(...weather.daily.temperature_2m_min)
  const span = globalMax - globalMin || 1

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px 28px',
      animation: 'fadeUp 0.5s ease 0.3s both',
    }}>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>
        7-Day Forecast
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {days.map((day, i) => {
          const wmo  = getWMO(weather.daily.weather_code[i])
          const max  = weather.daily.temperature_2m_max[i]
          const min  = weather.daily.temperature_2m_min[i]
          const isToday = i === 0
          const barLeft  = ((min - globalMin) / span) * 100
          const barWidth = ((max - min) / span) * 100

          return (
            <div key={day} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px',
              borderRadius: 10,
              background: isToday ? 'rgba(96,165,250,0.08)' : 'transparent',
              transition: 'background var(--transition)',
            }}
              onMouseEnter={e => { if (!isToday) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!isToday) e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ width: 36, fontSize: '0.8rem', fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--accent)' : 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>
                {isToday ? 'Today' : formatDay(day)}
              </div>
              <div style={{ fontSize: '1.1rem', width: 28, textAlign: 'center' }}>{wmo.emoji}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', flex: 0, width: 80 }}>{wmo.label}</div>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: `${barLeft}%`,
                  width: `${Math.max(barWidth, 8)}%`,
                  height: '100%',
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #60a5fa, #fbbf24)',
                }} />
              </div>
              <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-2)', width: 24, textAlign: 'right' }}>
                {formatTemp(min)}
              </div>
              <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-1)', width: 30, textAlign: 'right' }}>
                {formatTemp(max)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}