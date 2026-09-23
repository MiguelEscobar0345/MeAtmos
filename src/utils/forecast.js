import { currentHour } from './formatters'

// Index of "today" (the city's date) inside the daily arrays
export const todayIndex = (weather) => {
  const i = weather.daily.time.indexOf(weather.current.time.slice(0, 10))
  return i === -1 ? 0 : i
}

const HOURS = 24

// The next 24 hours, starting at the city's current hour
export function nextHours(weather) {
  // Both strings are the city's wall clock, so they compare directly
  const start = weather.hourly.time.findIndex(t => t >= currentHour(weather.current.time))
  const from = start === -1 ? 0 : start
  return weather.hourly.time.slice(from, from + HOURS).map((time, k) => {
    const i = from + k
    return {
      time,
      temp:   weather.hourly.temperature_2m[i],
      code:   weather.hourly.weather_code[i],
      isDay:  weather.hourly.is_day[i],
      precip: weather.hourly.precipitation_probability[i] ?? 0,
    }
  })
}
