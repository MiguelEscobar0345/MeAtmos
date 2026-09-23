import { useId } from 'react'
import { m } from 'motion/react'
import { EASE } from '../utils/motion'

// The logo mark as a scene: the dome draws itself, the horizon lays down and
// the sun rises from behind it, then its rays come out
export default function HomeArt() {
  const clip = useId()
  const rays = [-60, -30, 0, 30, 60]
  return (
    <svg className="home-art" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <rect x="0" y="0" width="32" height="22" />
        </clipPath>
      </defs>

      <m.path
        className="home-art__dome"
        d="M5 22a11 11 0 0 1 22 0"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
      />

      <g clipPath={`url(#${clip})`}>
        <m.circle
          className="home-art__sun"
          cx="16"
          cy="22"
          r="5.5"
          initial={{ y: 7 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.6 }}
        />
      </g>

      {rays.map((a, i) => {
        const rad = ((a - 90) * Math.PI) / 180
        return (
          <m.line
            key={a}
            className="home-art__ray"
            x1={16 + Math.cos(rad) * 7.5}
            y1={22 + Math.sin(rad) * 7.5}
            x2={16 + Math.cos(rad) * 9}
            y2={22 + Math.sin(rad) * 9}
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 1.7 + i * 0.07 }}
          />
        )
      })}

      <m.path
        className="home-art__horizon"
        d="M3 22h26M9 26.5h14"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: EASE }}
      />
    </svg>
  )
}
