import { createStore, useStore, readStorage, writeStorage } from '../utils/store'

// The API always answers in °C, km/h and mm; conversion happens on screen,
// so switching units is instant (and the odometer rolls)
const KEY = 'atmos_units'
const saved = readStorage(KEY, 'c')
const units = createStore(saved === 'f' ? 'f' : 'c', { onChange: v => writeStorage(KEY, v) })

export const toggleUnits = () => units.set(u => (u === 'c' ? 'f' : 'c'))

export function useUnits() {
  const unit = useStore(units)
  const imperial = unit === 'f'
  const temp = (c) => (imperial ? (c * 9) / 5 + 32 : c)
  return {
    unit,
    temp,
    // Differences scale without the offset
    tempDelta: (d) => (imperial ? (d * 9) / 5 : d),
    fmtTemp: (c) => `${Math.round(temp(c))}°`,
    wind: (kmh) => Math.round(imperial ? kmh * 0.621371 : kmh),
    windUnit: imperial ? 'mph' : 'km/h',
    rain: (mm) => (imperial ? (mm / 25.4).toFixed(2) : mm.toFixed(1)),
    rainUnit: imperial ? 'in' : 'mm',
  }
}
