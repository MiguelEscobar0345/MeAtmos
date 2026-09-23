import WeatherIcon from './WeatherIcon'
import Icon from './Icon'
import { getWMO } from '../utils/weatherCodes'
import { formatTemp, formatDate, formatClock, countryName } from '../utils/formatters'
import { skyName } from '../utils/sky'
import { todayIndex } from '../utils/forecast'
import './NowHero.css'

export default function NowHero({ weather, location, isFavorite, canSave, onToggleFavorite }) {
  const c   = weather.current
  const wmo = getWMO(c.weather_code)
  const i   = todayIndex(weather)
  const country = countryName(location.country_code, location.country)
  const region  = location.admin1 && location.admin1 !== location.name ? `${location.admin1}, ` : ''

  const saveLabel = isFavorite ? 'Guardada' : 'Guardar'
  const saveHint = isFavorite
    ? `Quitar ${location.name} de tus ciudades`
    : canSave
      ? `Guardar ${location.name} en tus ciudades`
      : 'Ya tienes 6 ciudades guardadas. Quita una para guardar otra.'

  return (
    <section className="hero" data-sky={skyName(weather)} aria-labelledby="hero-city">
      <div className="hero__head">
        <div>
          <p className="hero__place">
            <Icon name="pin" size={15} />
            {region}{country}
          </p>
          <h1 id="hero-city" className="hero__city">{location.name}</h1>
          <p className="hero__time">
            {formatDate(c.time)} · <span className="hero__clock"><span className="num">{formatClock(c.time)}</span> hora local</span>
          </p>
        </div>
        <button
          type="button"
          className="save"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          disabled={!isFavorite && !canSave}
          title={saveHint}
          aria-label={saveHint}
        >
          <Icon name="star" size={17} filled={isFavorite} />
          <span>{saveLabel}</span>
        </button>
      </div>

      <div className="hero__now">
        <p className="hero__temp">{formatTemp(c.temperature_2m)}</p>
        <WeatherIcon icon={wmo.icon} isDay={c.is_day} size={190} className="hero__icon" />
      </div>

      <div className="hero__foot">
        <p className="hero__cond">{wmo.label}</p>
        <p className="hero__range">
          Sensación <span className="num">{formatTemp(c.apparent_temperature)}</span>
          <span aria-hidden="true"> · </span>
          Máx <span className="num">{formatTemp(weather.daily.temperature_2m_max[i])}</span>
          <span aria-hidden="true"> · </span>
          Mín <span className="num">{formatTemp(weather.daily.temperature_2m_min[i])}</span>
        </p>
      </div>
    </section>
  )
}
