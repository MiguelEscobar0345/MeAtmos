import Icon from './Icon'
import { onLinkClick } from '../router'
import './ErrorState.css'

const COPY = {
  'unknown-city': {
    icon: 'search',
    title: 'No encontramos esa ciudad',
    text: 'El enlace puede estar incompleto o mal copiado. Búscala de nuevo arriba.',
  },
  page: {
    icon: 'search',
    title: 'Esta página no existe',
    text: 'Busca una ciudad arriba o vuelve al inicio.',
  },
  network: {
    icon: 'alert',
    title: 'No pudimos traer el clima',
    text: 'Puede ser tu conexión o el servicio de Open-Meteo. Inténtalo de nuevo en un momento.',
    retry: true,
  },
}

export default function ErrorState({ type, onRetry }) {
  const copy = COPY[type] ?? COPY.network
  return (
    <section className="error" role="alert">
      <span className="error__icon" aria-hidden="true">
        <Icon name={copy.icon} size={26} />
      </span>
      <h1 className="error__title">{copy.title}</h1>
      <p className="error__text">{copy.text}</p>
      <div className="error__actions">
        {copy.retry && (
          <button type="button" className="btn btn--primary" onClick={onRetry}>
            <Icon name="refresh" size={17} /> Reintentar
          </button>
        )}
        <a href="/" className="btn" onClick={e => onLinkClick(e, '/')}>
          <Icon name="home" size={17} /> Volver al inicio
        </a>
      </div>
    </section>
  )
}
