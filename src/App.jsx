import { useEffect } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import CityView, { CitySkeleton } from './components/CityView'
import ErrorState from './components/ErrorState'
import Footer from './components/Footer'
import { useWeather } from './hooks/useWeather'
import { useFavorites, sameCity, MAX_FAVORITES } from './hooks/useFavorites'
import { useFavoritesWeather } from './hooks/useFavoritesWeather'
import { useTheme } from './hooks/useTheme'

const TITLE = 'MeAtmos by miguesco'

export default function App() {
  const { weather, aq, location, error, loading, search, open, retry, reset } = useWeather()
  const { favorites, toggle, remove, replace } = useFavorites()
  const liveFor = useFavoritesWeather(favorites)
  const [theme, toggleTheme] = useTheme()

  const view = loading ? 'loading' : error ? 'error' : weather ? 'city' : 'home'
  const isFavorite = location ? favorites.some(f => sameCity(f, location)) : false

  useEffect(() => {
    document.title = view === 'city' ? `${location.name} · ${TITLE}` : `${TITLE} — El clima de cualquier ciudad`
  }, [view, location])

  const openFavorite = async (fav) => {
    if (fav.lat != null) return open(fav)
    // Legacy entry (name only): resolve it once with its country, which the
    // geocoder reads unambiguously, then store the full location
    const loc = await search(`${fav.name}, ${fav.country}`)
    if (loc && loc.country_code === fav.country_code) replace(fav, loc)
  }

  const goHome = () => {
    reset()
    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <a href="#main" className="skip-link">Saltar al contenido</a>
      <Header
        onHome={goHome}
        onSearch={search}
        loading={loading}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main id="main" className="page main">
        {view === 'home' && (
          <Home
            favorites={favorites}
            liveFor={liveFor}
            max={MAX_FAVORITES}
            onOpen={openFavorite}
            onRemove={remove}
          />
        )}
        {view === 'loading' && <CitySkeleton />}
        {view === 'error' && <ErrorState error={error} onRetry={retry} onHome={goHome} />}
        {view === 'city' && (
          <CityView
            weather={weather}
            aq={aq}
            location={location}
            isFavorite={isFavorite}
            canSave={favorites.length < MAX_FAVORITES}
            onToggleFavorite={() => toggle(location)}
          />
        )}
      </main>

      <Footer />
    </>
  )
}
