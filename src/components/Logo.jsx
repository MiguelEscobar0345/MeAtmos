// The mark: a low sun on the horizon under the sky's dome
export function LogoMark({ size = 30 }) {
  return (
    <svg className="logo-mark" viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <path className="logo-mark__dome" d="M5 22a11 11 0 0 1 22 0" />
      <path className="logo-mark__sun" d="M10.5 22a5.5 5.5 0 0 1 11 0z" />
      <path className="logo-mark__horizon" d="M3 22h26M9 26.5h14" />
    </svg>
  )
}

export default function Logo({ onHome }) {
  return (
    <a
      href="/"
      className="logo"
      aria-label="MeAtmos by miguesco, inicio"
      onClick={e => {
        if (!onHome || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        onHome()
      }}
    >
      <LogoMark />
      <span className="logo__word">Me<span>Atmos</span></span>
      <span className="logo__by">by miguesco</span>
    </a>
  )
}
