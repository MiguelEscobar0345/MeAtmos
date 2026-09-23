// WMO Weather interpretation codes → label + emoji
export const WMO = {
  0:  { label: 'Clear Sky',        emoji: '☀️',  group: 'clear'  },
  1:  { label: 'Mainly Clear',     emoji: '🌤️',  group: 'clear'  },
  2:  { label: 'Partly Cloudy',    emoji: '⛅',  group: 'cloudy' },
  3:  { label: 'Overcast',         emoji: '☁️',  group: 'cloudy' },
  45: { label: 'Foggy',            emoji: '🌫️',  group: 'fog'    },
  48: { label: 'Icy Fog',          emoji: '🌫️',  group: 'fog'    },
  51: { label: 'Light Drizzle',    emoji: '🌦️',  group: 'rain'   },
  53: { label: 'Drizzle',          emoji: '🌦️',  group: 'rain'   },
  55: { label: 'Heavy Drizzle',    emoji: '🌧️',  group: 'rain'   },
  56: { label: 'Freezing Drizzle', emoji: '🌧️',  group: 'rain'   },
  57: { label: 'Heavy Freezing Drizzle', emoji: '🌧️', group: 'rain' },
  61: { label: 'Light Rain',       emoji: '🌧️',  group: 'rain'   },
  63: { label: 'Rain',             emoji: '🌧️',  group: 'rain'   },
  65: { label: 'Heavy Rain',       emoji: '🌧️',  group: 'rain'   },
  66: { label: 'Freezing Rain',    emoji: '🌧️',  group: 'rain'   },
  67: { label: 'Heavy Freezing Rain', emoji: '🌧️', group: 'rain'  },
  71: { label: 'Light Snow',       emoji: '🌨️',  group: 'snow'   },
  73: { label: 'Snow',             emoji: '❄️',  group: 'snow'   },
  75: { label: 'Heavy Snow',       emoji: '❄️',  group: 'snow'   },
  77: { label: 'Snow Grains',      emoji: '🌨️',  group: 'snow'   },
  80: { label: 'Rain Showers',     emoji: '🌦️',  group: 'rain'   },
  81: { label: 'Showers',          emoji: '🌧️',  group: 'rain'   },
  82: { label: 'Heavy Showers',    emoji: '⛈️',  group: 'storm'  },
  85: { label: 'Snow Showers',     emoji: '🌨️',  group: 'snow'   },
  86: { label: 'Heavy Snow Showers', emoji: '🌨️', group: 'snow'  },
  95: { label: 'Thunderstorm',     emoji: '⛈️',  group: 'storm'  },
  96: { label: 'Thunder + Hail',   emoji: '⛈️',  group: 'storm'  },
  99: { label: 'Heavy Hail Storm', emoji: '⛈️',  group: 'storm'  },
}

// Sun emojis make no sense after sunset
const NIGHT = {
  0: { label: 'Clear Night',   emoji: '🌙' },
  1: { label: 'Mainly Clear',  emoji: '🌙' },
  2: { label: 'Partly Cloudy', emoji: '☁️' },
}

export const getWMO = (code, isDay = 1) => {
  const wmo = WMO[code] ?? { label: 'Unknown', emoji: '🌡️', group: 'clear' }
  return !isDay && NIGHT[code] ? { ...wmo, ...NIGHT[code] } : wmo
}

// Background gradient per weather group
export const BG_GRADIENTS = {
  clear:  'radial-gradient(ellipse at 20% 20%, #0f2547 0%, #080e1c 60%)',
  cloudy: 'radial-gradient(ellipse at 20% 20%, #1a1f2e 0%, #080e1c 60%)',
  fog:    'radial-gradient(ellipse at 20% 20%, #1e2030 0%, #080e1c 60%)',
  rain:   'radial-gradient(ellipse at 20% 20%, #0a1a30 0%, #080e1c 60%)',
  snow:   'radial-gradient(ellipse at 20% 20%, #141d2e 0%, #080e1c 60%)',
  storm:  'radial-gradient(ellipse at 20% 20%, #150a20 0%, #080e1c 60%)',
}

// AQI level info
export const AQI_LEVELS = [
  { max: 20,  label: 'Good',        color: '#34d399', desc: 'Air quality is excellent.' },
  { max: 40,  label: 'Fair',        color: '#60a5fa', desc: 'Air quality is acceptable.' },
  { max: 60,  label: 'Moderate',    color: '#fbbf24', desc: 'Sensitive groups may be affected.' },
  { max: 80,  label: 'Poor',        color: '#f97316', desc: 'Health effects possible for everyone.' },
  { max: 100, label: 'Very Poor',   color: '#f87171', desc: 'Health alert — avoid outdoor activity.' },
  { max: Infinity, label: 'Extremely Poor', color: '#c026d3', desc: 'Emergency conditions.' },
]

export const getAQILevel = (aqi) =>
  AQI_LEVELS.find(l => aqi <= l.max) ?? AQI_LEVELS[AQI_LEVELS.length - 1]