import { useSyncExternalStore } from 'react'

// Two routes don't need a routing library: `/` and `/c/<geonames id>/<slug>`.
const listeners = new Set()

function subscribe(listener) {
  listeners.add(listener)
  window.addEventListener('popstate', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('popstate', listener)
  }
}

const snapshot = () => window.location.pathname

export const usePath = () => useSyncExternalStore(subscribe, snapshot)

export function navigate(to, { replace = false } = {}) {
  if (to === window.location.pathname) return
  window.history[replace ? 'replaceState' : 'pushState'](null, '', to)
  listeners.forEach(l => l())
  if (!replace) {
    window.scrollTo({ top: 0 })
    // Keyboard and screen reader users land on the new content, not on <body>
    requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }))
  }
}

export const slugify = (name) =>
  name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const cityPath = (loc) => `/c/${loc.id}/${slugify(loc.name)}`

export function parseRoute(path) {
  if (path === '/' || path === '') return { name: 'home' }
  const city = path.match(/^\/c\/(\d{1,10})(?:\/[^/]*)?\/?$/)
  if (city) return { name: 'city', id: city[1] }
  return { name: 'not-found' }
}

// Plain click → client navigation; modified clicks keep the browser's behavior
// (new tab, copy link…) because the href is a real URL
export function onLinkClick(e, to, before) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  before?.()
  navigate(to)
}
