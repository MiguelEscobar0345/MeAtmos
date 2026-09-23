import React, { useState } from 'react'
import SearchBar from './components/SearchBar'
import CurrentWeather from './components/CurrentWeather'
import AirQuality from './components/AirQuality'
import HourlyForecast from './components/HourlyForecast'
import WeekForecast from './components/WeekForecast'
import WeatherDetails from './components/WeatherDetails'
import FavoriteCities from './components/FavoriteCities'
import Footer from './components/footer'
import { useWeather } from './hooks/useWeather'
import { useFavoritesWeather, favKey } from './hooks/useFavoritesWeather'
import { getWMO, BG_GRADIENTS } from './utils/weatherCodes'

// ── Constants ──
const MAX_FAVORITES = 3
const FAVS_KEY = 'atmos_favorites'

// ── Helpers (outside component, no hooks) ──
function loadFavs() {
  try {
    const stored = localStorage.getItem(FAVS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveFavs(favs) {
  try {
    localStorage.setItem(FAVS_KEY, JSON.stringify(favs))
  } catch {
    // Ignore write errors (e.g. quota exceeded)
  }
}

// Favorites saved before v2 only kept the name, which is ambiguous
// (San José CR vs San Jose US): match those by name + country instead of id
const sameCity = (fav, loc) =>
  fav.id != null
    ? fav.id === loc.id
    : fav.name === loc.name && fav.country_code === loc.country_code

// ── Component ──
export default function App() {
  const { weather, aq, location, loading, error, search, open } = useWeather()
  const [favorites, setFavorites] = useState(loadFavs)
  const liveFor = useFavoritesWeather(favorites)

  const updateFavs = (fn) => {
    setFavorites(prev => {
      const next = fn(prev)
      if (next !== prev) saveFavs(next)
      return next
    })
  }

  const group = weather ? getWMO(weather.current.weather_code, weather.current.is_day).group : 'clear'
  const bg    = BG_GRADIENTS[group]

  const isFavorite = location
    ? favorites.some(f => sameCity(f, location))
    : false

  const toggleFavorite = () => {
    if (!location || !weather) return
    updateFavs(prev => {
      if (prev.some(f => sameCity(f, location))) return prev.filter(f => !sameCity(f, location))
      if (prev.length >= MAX_FAVORITES) return prev
      return [...prev, location]
    })
  }

  const removeFavorite = (fav) => {
    updateFavs(prev => prev.filter(f => favKey(f) !== favKey(fav)))
  }

  const selectFavorite = async (fav) => {
    if (fav.lat != null) return open(fav)
    // Legacy entry: resolve it once ("San José, Costa Rica" is unambiguous
    // for the geocoder), then store the full location
    const loc = await search(`${fav.name}, ${fav.country}`)
    if (loc && loc.country_code === fav.country_code) {
      updateFavs(prev => prev.map(f => (favKey(f) === favKey(fav) ? loc : f)))
    }
  }

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .header-inner {
            flex-wrap: wrap !important;
            height: auto !important;
            padding: 10px 16px 12px !important;
            gap: 8px !important;
          }
          .header-search {
            width: 100% !important;
            max-width: 100% !important;
            flex: none !important;
            order: 2;
          }
          .header-inner a {
            order: 1;
          }
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: bg,
        transition: 'background 1s ease',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflowX: 'hidden',
      }}>

        {/* Header */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(8,14,28,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          width: '100%',
        }}>
          <div className="header-inner" style={{
            width: '100%', maxWidth: 1200,
            margin: '0 auto', padding: '0 24px',
            height: 64, display: 'flex',
            alignItems: 'center', gap: 20,
            boxSizing: 'border-box',
          }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{
                fontSize: '1.2rem', fontWeight: 800,
                letterSpacing: '-0.03em', color: 'var(--text-1)',
                fontFamily: 'var(--font-display)',
              }}>
               Me Atmos
              </span>
              <span style={{
                fontSize: '0.58rem', fontWeight: 600, color: 'var(--accent)',
                background: 'rgba(96,165,250,0.12)',
                border: '1px solid rgba(96,165,250,0.25)',
                borderRadius: 6, padding: '2px 7px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
              }}>
                Weather
              </span>
            </a>

            <div className="header-search" style={{ flex: 1, maxWidth: 460 }}>
              <SearchBar onSearch={search} loading={loading} />
            </div>
          </div>
        </header>

        {/* Main */}
        <main style={{
          flex: 1, width: '100%', maxWidth: 1200,
          margin: '0 auto', padding: '40px 20px 60px',
          boxSizing: 'border-box',
        }}>

          {/* Home / empty state */}
          {!weather && !loading && !error && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={{ textAlign: 'center', padding: '60px 16px 0' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>🌍</div>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                  fontWeight: 800, letterSpacing: '-0.03em',
                  color: 'var(--text-1)', marginBottom: 12, lineHeight: 1.1,
                }}>
                  Your world,<br />at a glance.
                </h1>
                <p style={{
                  color: 'var(--text-2)', fontSize: '1rem',
                  maxWidth: 340, margin: '0 auto 32px', lineHeight: 1.6,
                }}>
                  Search any city to see real-time weather and air quality data.
                </p>
                <br />
                <p>Miguel E. Escobar P.</p>
              </div>
              <FavoriteCities
                favorites={favorites}
                liveFor={liveFor}
                onSelect={selectFavorite}
                onRemove={removeFavorite}
              />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ textAlign: 'center', padding: '60px 20px', animation: 'fadeIn 0.4s ease' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚠️</div>
              <p style={{ color: 'var(--danger)', fontSize: '1rem' }}>{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '80px 0' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: `pulse 0.8s ease ${i * 0.15}s infinite`,
                }} />
              ))}
            </div>
          )}

          {/* Dashboard */}
          {weather && !loading && !error && (
            <div className="dash-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 320px',
              gap: 16, alignItems: 'start', width: '100%',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
                <CurrentWeather
                  weather={weather}
                  location={location}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />
                <HourlyForecast weather={weather} />
                <WeekForecast weather={weather} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
                <AirQuality aq={aq} />
                <WeatherDetails weather={weather} />
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  )
}