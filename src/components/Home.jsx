import FavoriteCities from './FavoriteCities'
import { LogoMark } from './Logo'
import { SUGGESTED } from '../utils/cities'
import { cityPath, onLinkClick } from '../router'
import { rememberLocation } from '../hooks/useCity'
import './Home.css'

export default function Home({ favorites, liveFor, max, onOpenLegacy, onRemove }) {
  return (
    <div className="home">
      <section className="home__hero" aria-labelledby="home-title">
        <div className="home__copy">
          <p className="eyebrow">Clima con la hora de cada lugar</p>
          <h1 id="home-title" className="home__title">¿Cómo está el cielo allá?</h1>
          <p className="home__lead">
            Busca una ciudad y mira su clima a la hora de allá: la lluvia hora por hora,
            los próximos siete días, el viento, el sol y la calidad del aire.
          </p>
          <div className="home__try">
            <span className="home__try-label">Prueba con</span>
            <ul className="chips">
              {SUGGESTED.map(city => (
                <li key={city.id}>
                  <a
                    href={cityPath(city)}
                    className="chip"
                    onClick={e => onLinkClick(e, cityPath(city), () => rememberLocation(city))}
                  >
                    {city.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="home__art" aria-hidden="true">
          <LogoMark size={260} />
        </div>
      </section>

      <FavoriteCities
        favorites={favorites}
        liveFor={liveFor}
        max={max}
        onOpenLegacy={onOpenLegacy}
        onRemove={onRemove}
      />
    </div>
  )
}
