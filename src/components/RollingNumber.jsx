import { useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { EASE } from '../utils/motion'

// Odometer: only the digits that change roll, upward when the value rises
// and downward when it falls
export default function RollingNumber({ value, suffix = '', className = '' }) {
  const [prev, setPrev] = useState({ value, dir: 1 })
  if (prev.value !== value) setPrev({ value, dir: value > prev.value ? 1 : -1 })
  const dir = prev.dir

  const chars = String(value).split('')
  return (
    <span className={`roll ${className}`} aria-label={`${value}${suffix}`} role="img">
      {chars.map((ch, i) => (
        // Keyed from the right so units stay units when the length changes
        <span key={chars.length - i} className="roll__slot" aria-hidden="true">
          <AnimatePresence mode="popLayout" custom={dir}>
            <m.span
              key={ch}
              className="roll__digit"
              custom={dir}
              variants={{
                enter: d => ({ y: `${d * 70}%`, opacity: 0 }),
                center: { y: 0, opacity: 1 },
                exit: d => ({ y: `${d * -70}%`, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: EASE, delay: (chars.length - i) * 0.04 }}
            >
              {ch}
            </m.span>
          </AnimatePresence>
        </span>
      ))}
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  )
}
