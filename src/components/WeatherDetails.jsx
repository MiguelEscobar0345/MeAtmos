import React from 'react'
import { formatWind, uvLabel } from '../utils/formatters'

export default function WeatherDetails({ weather }) {
  const c    = weather.current
  const uv   = uvLabel(c.uv_index)
  const sunrise = new Date(weather.daily.sunrise[0]).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
  const sunset  = new Date(weather.daily.sunset[0]).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })

  const items = [
    { icon: '💨', label: 'Wind Speed',   value: formatWind(c.wind_speed_10m) },
    { icon: '🧭', label: 'Wind Dir',     value: `${c.wind_direction_10m}°` },
    { icon: '💧', label: 'Humidity',     value: `${c.relative_humidity_2m}%` },
    { icon: '🔵', label: 'Pressure',     value: `${Math.round(c.surface_pressure)} hPa` },
    { icon: '☀️', label: 'UV Index',     value: `${c.uv_index}`, tag: uv.label, tagColor: uv.color },
    { icon: '🌧️', label: 'Precipitation',value: `${c.precipitation} mm` },
    { icon: '🌅', label: 'Sunrise',      value: sunrise },
    { icon: '🌇', label: 'Sunset',       value: sunset },
  ]

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px 28px',
      animation: 'fadeUp 0.5s ease 0.4s both',
    }}>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>
        Details
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {items.map(item => (
          <div key={item.label} style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 10, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: item.tagColor || 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>
                {item.value}
                {item.tag && <span style={{ fontSize: '0.65rem', marginLeft: 4 }}>{item.tag}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}