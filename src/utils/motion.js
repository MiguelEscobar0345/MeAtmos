// Shared motion language: one ease for entrances, springs for things that
// "settle" on a value (needles, markers, cards)
export const EASE = [0.22, 1, 0.36, 1]
export const SPRING = { type: 'spring', stiffness: 260, damping: 30 }
export const SOFT = { type: 'spring', stiffness: 90, damping: 18 }

export const rise = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export const stagger = (gap = 0.07, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
})

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
