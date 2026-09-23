import { useEffect, useState } from 'react'
import { geocode } from '../api/openMeteo'

export const MIN_QUERY = 2
const DEBOUNCE_MS = 220
const cache = new Map()

const norm = (q) => q.trim().toLowerCase()

// Same cache as the dropdown, so pressing Enter before it shows up still works
export async function fetchSuggestions(query, signal) {
  const q = norm(query)
  if (cache.has(q)) return cache.get(q)
  const list = await geocode(query.trim(), { count: 6, signal })
  cache.set(q, list)
  return list
}

export function useSuggestions(query) {
  const q = norm(query)
  const enabled = q.length >= MIN_QUERY
  const [result, setResult] = useState({ q: null, list: [] })

  useEffect(() => {
    if (!enabled || cache.has(q)) return
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetchSuggestions(q, controller.signal)
        .then(list => setResult({ q, list }))
        .catch(err => { if (err.name !== 'AbortError') setResult({ q, list: [], error: true }) })
    }, DEBOUNCE_MS)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [q, enabled])

  if (!enabled) return { status: 'idle', list: [] }
  if (cache.has(q)) return { status: 'ready', list: cache.get(q) }
  if (result.q === q) return { status: result.error ? 'error' : 'ready', list: result.list }
  // Keep the previous list on screen while the next one loads
  return { status: 'loading', list: result.list }
}
