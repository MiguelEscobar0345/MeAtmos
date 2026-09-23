import React from 'react'
import { getWMO } from '../utils/weatherCodes'
import { formatTemp, formatDate, formatWind, uvLabel } from '../utils/formatters'

export default function CurrentWeather({ weather, location, isFavorite, onToggleFavorite }) {
  const c   = weather.current
  const wmo = getWMO(c.weather_code, c.is_day)
  const uv  = uvLabel(c.uv_index)
  // The city's date, not the visitor's (Tokyo is already tomorrow from Bogotá)
  const now = formatDate(c.time)

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '28px 24px',
      animation: 'fadeUp 0.5s ease both',
      position: 'relative',
    }}>
      {/* Favorite star button */}
      <button
        onClick={onToggleFavorite}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        title={isFavorite ? 'Remove from favorites' : 'Save city'}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: isFavorite ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${isFavorite ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 10, width: 38, height: 38,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '1.1rem',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {isFavorite ? '★' : '☆'}
      </button>

      {/* Location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <span style={{
          fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {location.name}, {location.country_code}
        </span>
      </div>
      <div style={{
        fontSize: '0.72rem', color: 'var(--text-2)', marginBottom: 24,
        fontFamily: 'var(--font-mono)',
      }}>
        {now}
      </div>

      {/* Temp + Emoji */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 8 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 10vw, 7rem)',
          fontWeight: 800, lineHeight: 1,
          letterSpacing: '-0.04em', color: 'var(--text-1)',
        }}>
          {formatTemp(c.temperature_2m)}
        </div>
        <div style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', marginTop: 8 }}>
          {wmo.emoji}
        </div>
      </div>

      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>
        {wmo.label}
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text-2)', marginBottom: 24 }}>
        Feels like {formatTemp(c.apparent_temperature)} · Humidity {c.relative_humidity_2m}%
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {[
          { label: 'Wind',      value: formatWind(c.wind_speed_10m) },
          { label: 'Pressure',  value: `${Math.round(c.surface_pressure)} hPa` },
          { label: 'UV Index',  value: c.uv_index, extra: uv.label, color: uv.color },
          { label: 'Rain',      value: `${c.precipitation} mm` },
        ].map(item => (
          <div key={item.label} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)',
            borderRadius: 12, padding: '10px 14px',
          }}>
            <div style={{
              fontSize: '0.62rem', color: 'var(--text-3)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              marginBottom: 4, fontFamily: 'var(--font-mono)',
            }}>
              {item.label}
            </div>
            <div style={{
              fontSize: '0.9rem', fontWeight: 600,
              color: item.color || 'var(--text-1)',
              fontFamily: 'var(--font-mono)',
            }}>
              {item.value}
              {item.extra && (
                <span style={{ fontSize: '0.65rem', color: item.color, marginLeft: 4 }}>
                  {item.extra}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}