import WeatherIcon from './WeatherIcon'
import Icon from './Icon'
import { getWMO } from '../utils/weatherCodes'
import { formatClock, countryName } from '../utils/formatters'
import { favKey } from '../hooks/useFavoritesWeather'
import { rememberLocation } from '../hooks/useCity'
import { cityPath, onLinkClick } from '../router'

// Saved cities are links (open in a new tab, copy the URL…). Entries saved
// before v2 have no id, so they resolve through a button first.
function Open({ city, onOpenLegacy, children }) {
  if (city.id == null) {
    return <button type="button" className="fav__open" onClick={() => onOpenLegacy(city)}>{children}</button>
  }
  const to = cityPath(city)
  return (
    <a href={to} className="fav__open" onClick={e => onLinkClick(e, to, () => rememberLocation(city))}>
      {children}
    </a>
  )
}

export default function FavoriteCities({ favorites, liveFor, max, onOpenLegacy, onRemove }) {
  return (
    <section className="favs" aria-labelledby="favs-title">
      <div className="favs__head">
        <h2 id="favs-title" className="eyebrow">Tus ciudades</h2>
        {favorites.length > 0 && (
          <span className="favs__count num">{favorites.length}/{max}</span>
        )}
      </div>

      {favorites.length === 0 ? (
        <p className="favs__empty">
          <Icon name="star" size={18} />
          <span>
            Todavía no guardas ciudades. Abre una y toca <b>Guardar</b>: aparecerá aquí con su clima en vivo.
          </span>
        </p>
      ) : (
        <ul className="favs__grid">
          {favorites.map(city => {
            // Live conditions; legacy entries without coordinates keep their snapshot
            const live = liveFor(city)
            const temp = live?.temperature_2m ?? city.temp
            const wmo  = getWMO(live?.weather_code ?? city.weatherCode)
            const waiting = city.lat != null && !live
            return (
              <li key={favKey(city)} className="fav">
                <Open city={city} onOpenLegacy={onOpenLegacy}>
                  <span className="fav__top">
                    {waiting
                      ? <span className="skeleton fav__icon-sk" />
                      : <WeatherIcon icon={wmo.icon} isDay={live?.is_day ?? 1} size={40} />}
                    {live && <span className="fav__time num">{formatClock(live.time)}</span>}
                  </span>
                  <span className="fav__name">{city.name}</span>
                  <span className="fav__country">{countryName(city.country_code, city.country)}</span>
                  <span className="fav__bottom">
                    {waiting
                      ? <span className="skeleton fav__temp-sk" />
                      : <span className="fav__temp">{temp != null ? `${Math.round(temp)}°` : '—'}</span>}
                    {!waiting && <span className="fav__cond">{wmo.label}</span>}
                  </span>
                </Open>
                <button
                  type="button"
                  className="fav__remove"
                  onClick={() => onRemove(city)}
                  aria-label={`Quitar ${city.name} de tus ciudades`}
                  title="Quitar"
                >
                  <Icon name="close" size={16} />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
