// Monotone cubic interpolation (Fritsch–Carlson): a smooth curve that never
// overshoots between two hours, so the line never shows a peak that isn't real.
export function smoothPath(pts) {
  const n = pts.length
  if (n < 2) return ''
  const dx = []
  const m = []
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0]
    m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i]
  }
  const t = [m[0]]
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2
  t[n - 1] = m[n - 2]
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue }
    const a = t[i] / m[i]
    const b = t[i + 1] / m[i]
    const s = a * a + b * b
    if (s > 9) {
      const k = 3 / Math.sqrt(s)
      t[i] = k * a * m[i]
      t[i + 1] = k * b * m[i]
    }
  }
  const r = (v) => Math.round(v * 10) / 10
  let d = `M${r(pts[0][0])},${r(pts[0][1])}`
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3
    d += `C${r(pts[i][0] + h)},${r(pts[i][1] + t[i] * h)} ${r(pts[i + 1][0] - h)},${r(pts[i + 1][1] - t[i + 1] * h)} ${r(pts[i + 1][0])},${r(pts[i + 1][1])}`
  }
  return d
}

// Consecutive indexes where `test` holds, as [start, end] pairs
export function runs(list, test) {
  const out = []
  let start = null
  list.forEach((item, i) => {
    if (test(item) && start === null) start = i
    if (!test(item) && start !== null) { out.push([start, i - 1]); start = null }
  })
  if (start !== null) out.push([start, list.length - 1])
  return out
}
