import { useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import WeatherIcon from './WeatherIcon'
import Icon from './Icon'
import Sky from './Sky'
import RollingNumber from './RollingNumber'
import { getWMO } from '../utils/weatherCodes'
import { formatTemp, formatDate, formatClock, countryName } from '../utils/formatters'
import { skyName } from '../utils/sky'
import { todayIndex } from '../utils/forecast'
import { EASE, rise, stagger } from '../utils/motion'
import './NowHero.css'

// Six sparks around the star when a city is saved
const SPARKS = [0, 60, 120, 180, 240, 300]

export default function NowHero({ weather, location, isFavorite, canSave, onToggleFavorite }) {
  const c   = weather.current
  const wmo = getWMO(c.weather_code)
  const i   = todayIndex(weather)
  const country = countryName(location.country_code, location.country)
  const region  = location.admin1 && location.admin1 !== location.name ? `${location.admin1}, ` : ''

  const [copied, setCopied] = useState(false)
  const [burst, setBurst] = useState(0)

  // Native share sheet when there is one (phones, Edge/Safari), clipboard otherwise
  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: `${location.name} · MeAtmos`, text: `El clima en ${location.name}: ${formatTemp(c.temperature_2m)}, ${wmo.label.toLowerCase()}`, url })
        return
      } catch (err) {
        if (err.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch { /* clipboard blocked: the URL is still in the address bar */ }
  }

  const toggleSave = () => {
    if (!isFavorite) setBurst(b => b + 1)
    onToggleFavorite()
  }

  const saveLabel = isFavorite ? 'Guardada' : 'Guardar'
  const saveHint = isFavorite
    ? `Quitar ${location.name} de tus ciudades`
    : canSave
      ? `Guardar ${location.name} en tus ciudades`
      : 'Ya tienes 6 ciudades guardadas. Quita una para guardar otra.'

  return (
    // Shares its layoutId with the city's favorite card: the card grows into this window
    <m.section
      layoutId={`city-${location.id}`}
      className="hero"
      data-sky={skyName(weather)}
      aria-labelledby="hero-city"
      initial={{ borderRadius: 32 }}
      animate={{ borderRadius: 32 }}
      transition={{ layout: { duration: 0.6, ease: EASE } }}
    >
      <Sky weather={weather} />
      <m.div className="hero__inner" variants={stagger(0.08, 0.12)} initial="hidden" animate="visible">
        <div className="hero__head">
          <m.div variants={rise}>
            <p className="hero__place">
              <Icon name="pin" size={15} />
              {region}{country}
            </p>
            <h1 id="hero-city" className="hero__city">{location.name}</h1>
            <p className="hero__time">
              {formatDate(c.time)} · <span className="hero__clock"><span className="num">{formatClock(c.time)}</span> hora local</span>
            </p>
          </m.div>
          <m.div className="hero__actions" variants={rise}>
            <button type="button" className="save" onClick={share} aria-label={`Compartir el clima de ${location.name}`}>
              <Icon name={copied ? 'check' : 'share'} size={17} />
              <span className="save__label">{copied ? 'Enlace copiado' : 'Compartir'}</span>
            </button>
            <button
              type="button"
              className="save"
              onClick={toggleSave}
              aria-pressed={isFavorite}
              disabled={!isFavorite && !canSave}
              title={saveHint}
              aria-label={saveHint}
            >
              <span className="save__star">
                <m.span
                  key={isFavorite ? 'on' : 'off'}
                  className="save__icon"
                  initial={{ scale: isFavorite ? 0.4 : 1 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 14 }}
                >
                  <Icon name="star" size={17} filled={isFavorite} />
                </m.span>
                <AnimatePresence>
                  {burst > 0 && isFavorite && SPARKS.map(a => (
                    <m.span
                      key={`${burst}-${a}`}
                      className="save__spark"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos((a * Math.PI) / 180) * 16,
                        y: Math.sin((a * Math.PI) / 180) * 16,
                        opacity: 0,
                        scale: 0.4,
                      }}
                      transition={{ duration: 0.55, ease: EASE }}
                    />
                  ))}
                </AnimatePresence>
              </span>
              <span className="save__label">{saveLabel}</span>
            </button>
          </m.div>
          <p className="visually-hidden" aria-live="polite">{copied ? 'Enlace copiado' : ''}</p>
        </div>

        <m.div className="hero__now" variants={rise}>
          <p className="hero__temp">
            <RollingNumber value={Math.round(c.temperature_2m)} suffix="°" />
          </p>
          <m.div
            className="hero__icon-wrap"
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
          >
            <WeatherIcon icon={wmo.icon} isDay={c.is_day} size={190} className="hero__icon wi--live" />
          </m.div>
        </m.div>

        <m.div className="hero__foot" variants={rise}>
          <p className="hero__cond">{wmo.label}</p>
          <p className="hero__range">
            Sensación <span className="num">{formatTemp(c.apparent_temperature)}</span>
            <span aria-hidden="true"> · </span>
            Máx <span className="num">{formatTemp(weather.daily.temperature_2m_max[i])}</span>
            <span aria-hidden="true"> · </span>
            Mín <span className="num">{formatTemp(weather.daily.temperature_2m_min[i])}</span>
          </p>
        </m.div>
      </m.div>
    </m.section>
  )
}
