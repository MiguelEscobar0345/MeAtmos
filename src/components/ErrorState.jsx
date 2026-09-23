import Icon from './Icon'
import './ErrorState.css'

export default function ErrorState({ error, onRetry, onHome }) {
  const notFound = error.type === 'not-found'
  return (
    <section className="error" role="alert">
      <span className="error__icon" aria-hidden="true">
        <Icon name={notFound ? 'search' : 'alert'} size={26} />
      </span>
      <h1 className="error__title">
        {notFound ? <>No encontramos «{error.query}»</> : 'No pudimos traer el clima'}
      </h1>
      <p className="error__text">
        {notFound
          ? <>Revisa cómo se escribe o agrega el país, por ejemplo <b>San José, Costa Rica</b>.</>
          : 'Puede ser tu conexión o el servicio de Open-Meteo. Inténtalo de nuevo en un momento.'}
      </p>
      <div className="error__actions">
        {!notFound && (
          <button type="button" className="btn btn--primary" onClick={onRetry}>
            <Icon name="refresh" size={17} /> Reintentar
          </button>
        )}
        <button type="button" className="btn" onClick={onHome}>
          <Icon name="home" size={17} /> Volver al inicio
        </button>
      </div>
    </section>
  )
}
