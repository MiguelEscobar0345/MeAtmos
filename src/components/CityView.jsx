import { m } from 'motion/react'
import NowHero from './NowHero'
import HourlyChart from './HourlyChart'
import WeekForecast from './WeekForecast'
import AirQuality from './AirQuality'
import SunCard from './SunCard'
import WindCard from './WindCard'
import DetailsCard from './DetailsCard'
import { EASE } from '../utils/motion'
import './CityView.css'

export default function CityView({ weather, aq, location, isFavorite, canSave, onToggleFavorite }) {
  return (
    <div className="city">
      <NowHero
        weather={weather}
        location={location}
        isFavorite={isFavorite}
        canSave={canSave}
        onToggleFavorite={onToggleFavorite}
      />
      <HourlyChart weather={weather} />
      <div className="city__grid">
        <div className="city__week"><WeekForecast weather={weather} /></div>
        <AirQuality aq={aq} />
        <SunCard weather={weather} />
        <WindCard weather={weather} />
        <DetailsCard weather={weather} />
      </div>
    </div>
  )
}

// The name is often known before the forecast (suggestion, favorite, link)
export function CitySkeleton({ location }) {
  return (
    <div className="city" aria-busy="true" aria-label="Cargando el clima">
      {/* Same layoutId as the favorite card and the hero, so the card keeps
          growing while the forecast loads */}
      <m.div
        layoutId={location ? `city-${location.id}` : undefined}
        className="skeleton city__sk-hero"
        initial={{ borderRadius: 32 }}
        animate={{ borderRadius: 32 }}
        transition={{ layout: { duration: 0.6, ease: EASE } }}
      >
        {location && <p className="city__sk-name">{location.name}</p>}
      </m.div>
      <div className="skeleton city__sk-block" />
      <div className="city__grid">
        <div className="city__week skeleton city__sk-tall" />
        <div className="skeleton city__sk-card" />
        <div className="skeleton city__sk-card" />
        <div className="skeleton city__sk-card" />
        <div className="skeleton city__sk-card" />
      </div>
    </div>
  )
}
