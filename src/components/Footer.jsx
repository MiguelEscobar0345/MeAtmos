import Icon from './Icon'
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
            <a href="https://miguesco.dev" target="_blank" rel="noreferrer" className="footer__name">
              miguesco
              <Icon name="arrowUpRight" size={40} className="footer__arrow" />
            </a>
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
