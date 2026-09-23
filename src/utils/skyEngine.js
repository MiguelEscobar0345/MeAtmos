import { getWMO } from './weatherCodes'

const DRIZZLE = { 51: 70, 53: 100, 55: 130, 56: 90, 57: 130 }
const RAIN = { 61: 80, 63: 130, 65: 190, 66: 110, 67: 170, 80: 90, 81: 140, 82: 200, 95: 170, 96: 170, 99: 200 }
const SNOW = { 71: 50, 73: 90, 75: 140, 77: 60, 85: 80, 86: 130 }

// What the sky should show, from the real conditions: rain density from the
// WMO code, slant from the wind, stars thinned by cloud cover…
export function skyConfig(weather) {
  const c = weather.current
  const code = c.weather_code
  const { group } = getWMO(code)
  const night = !c.is_day
  const cover = (c.cloud_cover ?? (group === 'clear' ? 10 : 80)) / 100
  // Direction is where the wind comes FROM; drops travel the other way
  const toward = ((c.wind_direction_10m + 180) * Math.PI) / 180
  const slant = Math.sin(toward) * Math.min((c.wind_speed_10m ?? 0) / 45, 0.55)

  return {
    drizzle: DRIZZLE[code] ?? 0,
    rain: RAIN[code] ?? 0,
    snow: SNOW[code] ?? 0,
    stars: night && (group === 'clear' || group === 'cloudy') ? Math.round(110 * (1 - cover * 0.85)) : 0,
    clouds: group === 'clear' ? Math.round(cover * 4) : group === 'fog' ? 3 : Math.max(3, Math.round(cover * 6)),
    fog: group === 'fog' ? 4 : 0,
    lightning: group === 'storm' && code >= 95,
    night,
    slant: Math.round(slant * 100) / 100,
  }
}

const rnd = (a, b) => a + Math.random() * (b - a)

export function runSky(canvas, cfg, animate) {
  const ctx = canvas.getContext('2d')
  let w = 0
  let h = 0
  let raf = 0
  let last = performance.now()
  let running = false
  let visible = true

  // Positions are normalized (0–1) so a resize never needs a reset
  const stars = Array.from({ length: cfg.stars }, () => ({ x: rnd(0, 1), y: rnd(0, 0.75), r: rnd(0.4, 1.4), phase: rnd(0, 6.3), speed: rnd(0.6, 1.8) }))
  const clouds = Array.from({ length: cfg.clouds }, () => ({ x: rnd(-0.1, 1.1), y: rnd(0.02, 0.55), rx: rnd(0.22, 0.42), ry: rnd(0.12, 0.22), speed: rnd(0.004, 0.012), alpha: rnd(0.05, 0.12) }))
  const fog = Array.from({ length: cfg.fog }, (_, i) => ({ x: rnd(0, 1), y: 0.3 + i * 0.17, speed: rnd(0.006, 0.014) * (i % 2 ? -1 : 1) }))
  const drops = Array.from({ length: cfg.rain + cfg.drizzle }, (_, i) => {
    const light = i >= cfg.rain
    return { x: rnd(-0.2, 1.2), y: rnd(0, 1), len: light ? rnd(5, 9) : rnd(12, 24), speed: light ? rnd(0.45, 0.7) : rnd(0.9, 1.4), alpha: light ? 0.28 : rnd(0.22, 0.42) }
  })
  const flakes = Array.from({ length: cfg.snow }, () => ({ x: rnd(0, 1), y: rnd(0, 1), r: rnd(1, 2.8), speed: rnd(0.04, 0.1), sway: rnd(0, 6.3), amp: rnd(4, 12) }))
  const bolt = { next: last + rnd(2500, 5000), flash: 0, second: 0 }

  function resize() {
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    w = rect.width
    h = rect.height
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function draw(t, dt) {
    ctx.clearRect(0, 0, w, h)

    for (const s of stars) {
      const a = animate ? 0.35 + 0.4 * Math.sin((t / 1000) * s.speed + s.phase) : 0.6
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`
      ctx.beginPath()
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2)
      ctx.fill()
    }

    for (const c of clouds) {
      c.x += c.speed * dt
      if (c.x - c.rx > 1.05) c.x = -c.rx
      ctx.save()
      ctx.translate(c.x * w, c.y * h)
      ctx.scale(c.rx * w, c.ry * h)
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
      const a = cfg.night ? c.alpha * 0.6 : c.alpha
      g.addColorStop(0, `rgba(255,255,255,${a})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(-1, -1, 2, 2)
      ctx.restore()
    }

    // Fog: wide flat ellipses that fade on every edge (no hard band limits)
    for (const f of fog) {
      f.x = (f.x + f.speed * dt + 1) % 1
      for (const dx of [-1, 0, 1]) {
        ctx.save()
        ctx.translate((f.x + dx) * w, f.y * h)
        ctx.scale(w * 0.75, h * 0.16)
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
        g.addColorStop(0, 'rgba(235,238,243,0.2)')
        g.addColorStop(1, 'rgba(235,238,243,0)')
        ctx.fillStyle = g
        ctx.fillRect(-1, -1, 2, 2)
        ctx.restore()
      }
    }

    ctx.lineCap = 'round'
    ctx.lineWidth = 1.2
    for (const d of drops) {
      d.y += d.speed * dt
      d.x += cfg.slant * d.speed * dt * (h / w)
      if (d.y > 1.05) { d.y = -0.05; d.x = rnd(-0.2, 1.2) }
      const x = d.x * w
      const y = d.y * h
      ctx.strokeStyle = `rgba(214,228,255,${d.alpha})`
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x - cfg.slant * d.len, y - d.len)
      ctx.stroke()
    }

    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    for (const f of flakes) {
      f.y += f.speed * dt
      if (f.y > 1.03) { f.y = -0.03; f.x = rnd(0, 1) }
      const x = f.x * w + Math.sin(t / 1400 + f.sway) * f.amp + cfg.slant * f.y * 40
      ctx.beginPath()
      ctx.arc(x, f.y * h, f.r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Soft, infrequent flashes (never more than two within a second)
    if (cfg.lightning && animate) {
      if (t > bolt.next) {
        bolt.flash = 1
        bolt.second = t + rnd(160, 260)
        bolt.next = t + rnd(4500, 9000)
      }
      if (bolt.second && t > bolt.second) { bolt.flash = 0.7; bolt.second = 0 }
      if (bolt.flash > 0.01) {
        ctx.fillStyle = `rgba(230,236,255,${(bolt.flash * 0.22).toFixed(3)})`
        ctx.fillRect(0, 0, w, h)
        bolt.flash *= Math.pow(0.004, dt)
      }
    }
  }

  function frame(t) {
    const dt = Math.min(0.05, (t - last) / 1000)
    last = t
    draw(t, dt)
    if (running) raf = requestAnimationFrame(frame)
  }

  function update() {
    const should = animate && visible && document.visibilityState === 'visible'
    if (should && !running) {
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    } else if (!should && running) {
      running = false
      cancelAnimationFrame(raf)
    }
  }

  const ro = new ResizeObserver(() => { resize(); if (!running) draw(performance.now(), 0) })
  ro.observe(canvas)
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
  io.observe(canvas)
  document.addEventListener('visibilitychange', update)

  resize()
  draw(performance.now(), 0)
  update()

  return () => {
    running = false
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    document.removeEventListener('visibilitychange', update)
  }
}
