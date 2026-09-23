// 24×24 line icons for the interface (weather glyphs live in WeatherIcon)
const PATHS = {
  search:   <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  star:     <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />,
  pin:      <><path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z" /><circle cx="12" cy="9.8" r="2.3" /></>,
  sun:      <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></>,
  moon:     <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  close:    <path d="M6 6l12 12M18 6 6 18" />,
  alert:    <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5v.01" /></>,
  refresh:  <><path d="M20 11a8 8 0 0 0-14.5-4.5L4 8" /><path d="M4 3.5V8h4.5" /><path d="M4 13a8 8 0 0 0 14.5 4.5L20 16" /><path d="M20 20.5V16h-4.5" /></>,
  droplet:  <path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z" />,
  gauge:    <><path d="M4.5 17a8.5 8.5 0 1 1 15 0" /><path d="m12 13 4-4" /><circle cx="12" cy="13" r="1" /></>,
  umbrella: <><path d="M3 12a9 9 0 0 1 18 0z" /><path d="M12 12v6.5a2 2 0 0 1-4 0" /></>,
  uv:       <><circle cx="12" cy="12" r="3.5" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></>,
  home:     <><path d="M4 11 12 4l8 7" /><path d="M6 9.5V20h12V9.5" /></>,
}

export default function Icon({ name, size = 20, filled = false, className = '' }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}
