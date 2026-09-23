// WMO weather interpretation codes (Open-Meteo docs) → Spanish label, icon, sky group
export const WMO = {
  0:  { label: 'Despejado',                  icon: 'clear',    group: 'clear'  },
  1:  { label: 'Mayormente despejado',       icon: 'mostly',   group: 'clear'  },
  2:  { label: 'Parcialmente nublado',       icon: 'partly',   group: 'cloudy' },
  3:  { label: 'Nublado',                    icon: 'overcast', group: 'cloudy' },
  45: { label: 'Niebla',                     icon: 'fog',      group: 'fog'    },
  48: { label: 'Niebla con escarcha',        icon: 'fog',      group: 'fog'    },
  51: { label: 'Llovizna ligera',            icon: 'drizzle',  group: 'rain'   },
  53: { label: 'Llovizna',                   icon: 'drizzle',  group: 'rain'   },
  55: { label: 'Llovizna intensa',           icon: 'drizzle',  group: 'rain'   },
  56: { label: 'Llovizna helada',            icon: 'sleet',    group: 'rain'   },
  57: { label: 'Llovizna helada intensa',    icon: 'sleet',    group: 'rain'   },
  61: { label: 'Lluvia ligera',              icon: 'rain',     group: 'rain'   },
  63: { label: 'Lluvia',                     icon: 'rain',     group: 'rain'   },
  65: { label: 'Lluvia fuerte',              icon: 'rain',     group: 'rain'   },
  66: { label: 'Lluvia helada',              icon: 'sleet',    group: 'rain'   },
  67: { label: 'Lluvia helada fuerte',       icon: 'sleet',    group: 'rain'   },
  71: { label: 'Nevada ligera',              icon: 'snow',     group: 'snow'   },
  73: { label: 'Nevada',                     icon: 'snow',     group: 'snow'   },
  75: { label: 'Nevada fuerte',              icon: 'snow',     group: 'snow'   },
  77: { label: 'Granos de nieve',            icon: 'snow',     group: 'snow'   },
  80: { label: 'Chubascos ligeros',          icon: 'showers',  group: 'rain'   },
  81: { label: 'Chubascos',                  icon: 'showers',  group: 'rain'   },
  82: { label: 'Chubascos fuertes',          icon: 'showers',  group: 'storm'  },
  85: { label: 'Chubascos de nieve',         icon: 'snow',     group: 'snow'   },
  86: { label: 'Chubascos de nieve fuertes', icon: 'snow',     group: 'snow'   },
  95: { label: 'Tormenta',                   icon: 'thunder',  group: 'storm'  },
  96: { label: 'Tormenta con granizo',       icon: 'hail',     group: 'storm'  },
  99: { label: 'Tormenta con granizo fuerte', icon: 'hail',    group: 'storm'  },
}

const UNKNOWN = { label: 'Sin datos', icon: 'overcast', group: 'cloudy' }

export const getWMO = (code) => WMO[code] ?? UNKNOWN

// ── European Air Quality Index (EEA bands and colors) ──
export const AQI_LEVELS = [
  { max: 20,       label: 'Buena',               color: '#50c8be', desc: 'Aire limpio. Buen momento para salir.' },
  { max: 40,       label: 'Aceptable',           color: '#50ab8c', desc: 'Sin riesgo para la mayoría de las personas.' },
  { max: 60,       label: 'Moderada',            color: '#e0c52c', desc: 'Si eres sensible, modera el ejercicio al aire libre.' },
  { max: 80,       label: 'Mala',                color: '#f0643c', desc: 'Reduce la actividad intensa al aire libre.' },
  { max: 100,      label: 'Muy mala',            color: '#c0284b', desc: 'Evita el ejercicio al aire libre.' },
  { max: Infinity, label: 'Extremadamente mala', color: '#7d2181', desc: 'Quédate en interiores si puedes.' },
]

export const getAQILevel = (aqi) => AQI_LEVELS.find(l => aqi <= l.max)

// ── UV index (WHO bands and colors) ──
const UV_LEVELS = [
  { max: 2,        label: 'Bajo',     color: '#4eb400' },
  { max: 5,        label: 'Moderado', color: '#e8c800' },
  { max: 7,        label: 'Alto',     color: '#f85900' },
  { max: 10,       label: 'Muy alto', color: '#d8001d' },
  { max: Infinity, label: 'Extremo',  color: '#6b49c8' },
]

// WHO bands are defined on the rounded index
export const getUVLevel = (uv) => UV_LEVELS.find(l => Math.round(uv) <= l.max)

// ── Beaufort scale (km/h upper bounds) ──
const BEAUFORT = [
  [1, 'Calma'], [5, 'Ventolina'], [11, 'Brisa muy débil'], [19, 'Brisa débil'],
  [28, 'Brisa moderada'], [38, 'Brisa fresca'], [49, 'Brisa fuerte'], [61, 'Viento fuerte'],
  [74, 'Temporal'], [88, 'Temporal fuerte'], [102, 'Temporal duro'], [117, 'Temporal muy duro'],
  [Infinity, 'Huracán'],
]

export const beaufort = (kmh) => BEAUFORT.find(([max]) => kmh < max)[1]

// Wind direction is where the wind comes FROM (meteorological convention)
const POINTS = ['norte', 'noreste', 'este', 'sureste', 'sur', 'suroeste', 'oeste', 'noroeste']
export const windFrom = (deg) => POINTS[Math.round(deg / 45) % 8]
