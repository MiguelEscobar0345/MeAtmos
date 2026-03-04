import React from 'react'
import { getAQILevel } from '../utils/weatherCodes'

export default function AirQuality({ aq }) {
  if (!aq) return null

  const aqi   = aq.european_aqi
  const level = getAQILevel(aqi)
  const pct   = Math.min(100, (aqi / 100) * 100)

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '24px 28px',
      animation: 'fadeUp 0.5s ease 0.1s both',
    }}>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>
        Air Quality
      </div>

      {/* AQI score */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.04em', color: level.color, fontFamily: 'var(--font-mono)' }}>
          {aqi}
        </span>
        <span style={{ fontSize: '1rem', fontWeight: 600, color: level.color }}>
          {level.label}
        </span>
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: 20 }}>
        {level.desc}
      </div>

      {/* Bar */}
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 3,
          background: `linear-gradient(90deg, #34d399, ${level.color})`,
          transition: 'width 1s cubic-bezier(0.34,1.1,0.64,1)',
        }} />
      </div>

      {/* Pollutants */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'PM2.5', value: aq.pm2_5?.toFixed(1), unit: 'μg/m³' },
          { label: 'PM10',  value: aq.pm10?.toFixed(1),  unit: 'μg/m³' },
          { label: 'O₃',    value: aq.ozone?.toFixed(0), unit: 'μg/m³' },
          { label: 'NO₂',   value: aq.nitrogen_dioxide?.toFixed(1), unit: 'μg/m³' },
        ].map(p => (
          <div key={p.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '8px 12px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{p.label}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>
              {p.value ?? '—'} <span style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>{p.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}