import React from 'react'
import { getWMO } from '../utils/weatherCodes'

export default function FavoriteCities({ favorites, onSelect, onRemove }) {
  if (!favorites.length) return null

  return (
    <div style={{ marginTop: 32, animation: 'fadeUp 0.5s ease both' }}>
      <div style={{
        fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase', letterSpacing: '0.1em',
        fontFamily: 'var(--font-mono)', marginBottom: 14,
      }}>
        Favorite Cities
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 12,
      }}>
        {favorites.map(city => {
          const wmo = getWMO(city.weatherCode ?? 0)
          return (
            <div
              key={city.name + city.country}
              onClick={() => onSelect(city.name)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: '16px 18px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
                e.currentTarget.style.borderColor = 'rgba(96,165,250,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              {/* Remove star */}
              <button
                onClick={e => { e.stopPropagation(); onRemove(city.name) }}
                aria-label="Remove favorite"
                style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'none', border: 'none',
                  cursor: 'pointer', padding: 4,
                  color: '#fbbf24',
                  fontSize: '1rem',
                  lineHeight: 1,
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                ★
              </button>

              <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{wmo.emoji}</div>
              <div style={{
                fontSize: '0.95rem', fontWeight: 700,
                color: 'var(--text-1)', letterSpacing: '-0.01em', marginBottom: 2,
              }}>
                {city.name}
              </div>
              <div style={{
                fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)',
                fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {city.country}
              </div>
              {city.temp != null && (
                <div style={{
                  marginTop: 10,
                  fontSize: '1.3rem', fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent)',
                  letterSpacing: '-0.03em',
                }}>
                  {Math.round(city.temp)}°
                </div>
              )}
            </div>
          )
        })}
        {/* Empty slots */}
        {Array.from({ length: Math.max(0, 3 - favorites.length) }).map((_, i) => (
          <div key={`empty-${i}`} style={{
            border: '1px dashed rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '16px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 110,
          }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
              Search &amp; ★ a city
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}