import { useEffect } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import CityView, { CitySkeleton } from './components/CityView'
import ErrorState from './components/ErrorState'
import Footer from './components/Footer'
import { usePath, parseRoute, navigate, cityPath } from './router'
import { useCity, rememberLocation } from './hooks/useCity'
import { addRecent } from './hooks/useRecents'
import { useFavorites, sameCity, MAX_FAVORITES } from './hooks/useFavorites'
import { useFavoritesWeather } from './hooks/useFavoritesWeather'
import { useTheme } from './hooks/useTheme'
import { geocode } from './api/openMeteo'

const TITLE = 'MeAtmos by miguesco'

export default function App() {
  const route = parseRoute(usePath())
  const city = useCity(route.name === 'city' ? route.id : null)
  const { favorites, toggle, remove, replace } = useFavorites()
  const liveFor = useFavoritesWeather(favorites)
  const [theme, toggleTheme] = useTheme()

  // Every city that finishes loading goes to the search's "Recientes"
  const readyLocation = city.status === 'ready' ? city.location : null
  useEffect(() => { addRecent(readyLocation) }, [readyLocation])

  const cityName = city.location?.name
  useEffect(() => {
    document.title =
      route.name === 'home' ? `${TITLE} — El clima de cualquier ciudad`
        : cityName ? `${cityName} · ${TITLE}`
          : TITLE
  }, [route.name, cityName])

  const openCity = (loc) => {
    rememberLocation(loc)
    navigate(cityPath(loc))
  }

  // Favorites saved before v2 only kept a name: resolve it once with its
  // country (the geocoder reads "San José, Costa Rica" unambiguously)
  const openLegacy = async (fav) => {
    try {
      const [loc] = await geocode(`${fav.name}, ${fav.country}`, { count: 1 })
      if (loc && loc.country_code === fav.country_code) {
        replace(fav, loc)
        openCity(loc)
      }
    } catch { /* stays on the home page */ }
  }

  const isFavorite = city.location ? favorites.some(f => sameCity(f, city.location)) : false

  return (
    <>
      <a href="#main" className="skip-link">Saltar al contenido</a>
      <Header
        onSelectCity={openCity}
        currentCityId={route.name === 'city' ? route.id : null}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main id="main" className="page main" tabIndex={-1}>
        {route.name === 'home' && (
          <Home
            favorites={favorites}
            liveFor={liveFor}
            max={MAX_FAVORITES}
            onOpenLegacy={openLegacy}
            onRemove={remove}
          />
        )}
        {route.name === 'city' && city.status === 'loading' && <CitySkeleton location={city.location} />}
        {route.name === 'city' && city.status === 'error' && <ErrorState type={city.error.type} onRetry={city.retry} />}
        {route.name === 'city' && city.status === 'ready' && (
          <CityView
            weather={city.weather}
            aq={city.aq}
            location={city.location}
            isFavorite={isFavorite}
            canSave={favorites.length < MAX_FAVORITES}
            onToggleFavorite={() => toggle(city.location)}
          />
        )}
        {route.name === 'not-found' && <ErrorState type="page" />}
      </main>

      <Footer />
    </>
  )
}
