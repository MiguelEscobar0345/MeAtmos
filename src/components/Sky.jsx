import { useEffect, useRef } from 'react'
import { skyConfig, runSky } from '../utils/skyEngine'
import { prefersReducedMotion } from '../utils/motion'

// The moving layer of the hero's sky. With reduced motion it paints one still frame.
export default function Sky({ weather }) {
  const ref = useRef(null)
  const config = JSON.stringify(skyConfig(weather))

  useEffect(() => {
    if (!ref.current) return
    return runSky(ref.current, JSON.parse(config), !prefersReducedMotion())
  }, [config])

  return <canvas ref={ref} className="hero__sky" aria-hidden="true" />
}
