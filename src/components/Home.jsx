import { m } from 'motion/react'
import FavoriteCities from './FavoriteCities'
import HomeArt from './HomeArt'
import { SUGGESTED } from '../utils/cities'
import { cityPath, onLinkClick } from '../router'
import { rememberLocation } from '../hooks/useCity'
import { rise, stagger } from '../utils/motion'
import './Home.css'

export default function Home({ favorites, liveFor, max, onOpenLegacy, onRemove }) {
  return (
    <div className="home">
      <section className="home__hero" aria-labelledby="home-title">
        <m.div className="home__copy" variants={stagger(0.09)} initial="hidden" animate="visible">
          <m.p className="eyebrow" variants={rise}>Clima con la hora de cada lugar</m.p>
          <m.h1 id="home-title" className="home__title" variants={rise}>¿Cómo está el cielo allá?</m.h1>
          <m.p className="home__lead" variants={rise}>
            Busca una ciudad y mira su clima a la hora de allá: la lluvia hora por hora,
            los próximos siete días, el viento, el sol y la calidad del aire.
          </m.p>
          <m.div className="home__try" variants={rise}>
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
          </m.div>
        </m.div>
        <div className="home__art" aria-hidden="true">
          <HomeArt />
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
