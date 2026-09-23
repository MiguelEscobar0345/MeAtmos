import { createStore, useStore, readStorage, writeStorage } from '../utils/store'

const KEY = 'atmos_recents'
const MAX = 5
const recents = createStore(readStorage(KEY, []), { onChange: v => writeStorage(KEY, v) })

export const addRecent = (loc) => {
  if (loc?.id == null) return
  recents.set(list => [loc, ...list.filter(l => l.id !== loc.id)].slice(0, MAX))
}

export const useRecents = () => useStore(recents)
