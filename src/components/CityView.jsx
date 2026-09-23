import NowHero from './NowHero'
import HourlyChart from './HourlyChart'
import WeekForecast from './WeekForecast'
import AirQuality from './AirQuality'
import SunCard from './SunCard'
import WindCard from './WindCard'
import DetailsCard from './DetailsCard'
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

export function CitySkeleton() {
  return (
    <div className="city" aria-busy="true" aria-label="Cargando el clima">
      <div className="skeleton city__sk-hero" />
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
