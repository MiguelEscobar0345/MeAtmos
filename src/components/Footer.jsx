import { m } from 'motion/react'
import Icon from './Icon'
import { EASE } from '../utils/motion'
import './Footer.css'

const CONTACT = [
  { label: 'Portafolio', href: 'https://miguesco.dev' },
  { label: 'Correo',     href: 'mailto:miguelescobarp03@gmail.com' },
]

const SOCIALS = [
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/miguel-escobar-p' },
  { label: 'GitHub',    href: 'https://github.com/MiguelEscobar0345' },
  { label: 'Instagram', href: 'https://www.instagram.com/escomiguep' },
]

const external = (href) => (href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})

export default function Footer() {
  return (
    <footer className="footer">
      <div className="page">
        <div className="footer__top">
          <div className="footer__brand">
            <p className="eyebrow">Diseñado y construido por Miguel Escobar</p>
            {/* Observe the visible link, not the masked text: the text starts
                fully clipped, so it would never count as in view */}
            <m.a
              href="https://miguesco.dev"
              target="_blank"
              rel="noreferrer"
              className="footer__name"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <span className="footer__mask">
                <m.span
                  className="footer__line"
                  variants={{ hidden: { y: '110%' }, visible: { y: 0 } }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  miguesco
                </m.span>
              </span>
              <m.span
                className="footer__arrow-wrap"
                variants={{ hidden: { opacity: 0, x: -8, y: 8 }, visible: { opacity: 1, x: 0, y: 0 } }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
              >
                <Icon name="arrowUpRight" size={40} className="footer__arrow" />
              </m.span>
            </m.a>
          </div>

          <nav className="footer__cols" aria-label="Contacto y redes">
            <div>
              <p className="eyebrow">Contacto</p>
              <ul>
                {CONTACT.map(l => (
                  <li key={l.label}><a href={l.href} {...external(l.href)}>{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow">Redes</p>
              <ul>
                {SOCIALS.map(l => (
                  <li key={l.label}><a href={l.href} {...external(l.href)}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="footer__bottom">
          <p>
            Datos del clima:{' '}
            <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo.com</a>{' '}
            (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>)
          </p>
          <p className="footer__sign">
            <span className="footer__macaw" aria-hidden="true" />
            MeAtmos · 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
