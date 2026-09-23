import { useSyncExternalStore } from 'react'

// Minimal external store: shared state without providers, read with
// useSyncExternalStore (same pattern as the router)
export function createStore(initial, { onChange } = {}) {
  let value = initial
  const listeners = new Set()
  return {
    get: () => value,
    set(next) {
      value = typeof next === 'function' ? next(value) : next
      onChange?.(value)
      listeners.forEach(l => l())
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export const useStore = (store) => useSyncExternalStore(store.subscribe, store.get)

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota or private mode */ }
}
