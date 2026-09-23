import { minutesBetween } from './formatters'
import { getWMO } from './weatherCodes'
import { todayIndex } from './forecast'

// Where the sun is in the city right now: minutes since sunrise, day length…
export function sunState(weather) {
  const i = todayIndex(weather)
  const now = weather.current.time
  const sunrise = weather.daily.sunrise[i]
  const sunset = weather.daily.sunset[i]
  if (!sunrise || !sunset) return null
  const dayLength = minutesBetween(sunrise, sunset)
  const sinceRise = minutesBetween(sunrise, now)
  return {
    sunrise,
    sunset,
    nextSunrise: weather.daily.sunrise[i + 1],
    dayLength,
    sinceRise,
    untilSet: dayLength - sinceRise,
    progress: dayLength > 0 ? sinceRise / dayLength : 0,
  }
}

const TWILIGHT = 45 // minutes around sunrise/sunset painted as dawn/dusk

// "clear-day", "rain-night", "clear-dusk"…: picks the hero sky in CSS
export function skyName(weather) {
  const { group } = getWMO(weather.current.weather_code)
  const sun = sunState(weather)
  let phase = weather.current.is_day ? 'day' : 'night'
  if (sun && (group === 'clear' || group === 'cloudy')) {
    if (Math.abs(sun.sinceRise) <= TWILIGHT) phase = 'dawn'
    else if (Math.abs(sun.untilSet) <= TWILIGHT) phase = 'dusk'
  }
  return `${group}-${phase}`
}
