// One fixed scale for every city, so 30° always looks like 30°: a warm bar in
// Tokio and a warm bar in Bogotá mean the same thing.
const STOPS = [
  [-15, [74, 88, 196]],
  [0,   [70, 132, 214]],
  [10,  [74, 172, 178]],
  [18,  [142, 190, 104]],
  [25,  [236, 180, 62]],
  [32,  [232, 116, 58]],
  [40,  [196, 52, 58]],
]

export function tempColor(t) {
  if (t <= STOPS[0][0]) return `rgb(${STOPS[0][1].join(',')})`
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i]
    if (t <= t1) {
      const [t0, c0] = STOPS[i - 1]
      const k = (t - t0) / (t1 - t0)
      return `rgb(${c0.map((v, j) => Math.round(v + (c1[j] - v) * k)).join(',')})`
    }
  }
  return `rgb(${STOPS[STOPS.length - 1][1].join(',')})`
}
