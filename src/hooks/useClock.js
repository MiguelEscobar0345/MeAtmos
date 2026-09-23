import { createStore, useStore } from '../utils/store'

// One shared clock that ticks while someone is watching it
const clock = createStore(Date.now())
let timer = 0
let watchers = 0

const subscribe = (listener) => {
  const off = clock.subscribe(listener)
  if (watchers++ === 0) {
    clock.set(Date.now())
    timer = setInterval(() => clock.set(Date.now()), 20_000)
  }
  return () => {
    off()
    if (--watchers === 0) clearInterval(timer)
  }
}

const watched = { ...clock, subscribe }

// The city's wall clock right now ("2026-09-23T06:12"), from its UTC offset.
// Open-Meteo's current.time is the last 15-minute sample, not the time now.
export function useCityNow(offsetSeconds) {
  const now = useStore(watched)
  return new Date(now + (offsetSeconds ?? 0) * 1000).toISOString().slice(0, 16)
}
