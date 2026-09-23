import { useEffect, useState } from 'react'

// Width of an element, kept in sync with ResizeObserver (charts draw in real pixels)
export function useElementWidth(ref) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])

  return width
}
