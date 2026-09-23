# MeAtmos by miguesco

The weather of any city, on that city's own clock. Built with React, Vite and [Motion](https://motion.dev). The interface is in Spanish.

Live → **[me-atmos.vercel.app](https://me-atmos.vercel.app/)**

---

## What it does

- **Search any city.** Autocomplete shows region and country, understands Spanish and English names ("New York" → Nueva York), and works with the keyboard. You can also use your location.
- **Every city has a URL.** `/c/<GeoNames id>/<slug>`, e.g. [`/c/1850147/tokio`](https://me-atmos.vercel.app/c/1850147/tokio). You can share it, bookmark it, and back/forward work.
- **The sky right now.** The main card is a window to the city's sky:
  - the gradient follows the weather and the real local dawn, day, dusk or night;
  - a canvas layer draws rain slanted by the actual wind, snow, drifting fog and clouds sized by cloud cover, stars at night and soft lightning in storms.
- **A sentence, not just numbers.** For example: "Probable lluvia desde las 16:00 (70%). Máxima de 23° a las 14:00. 2° más cálido que ayer."
- **Next 24 hours.** A temperature curve colored on one fixed scale, with rain probability bars and night bands. Scrub it with the pointer or the arrow keys.
- **Next 7 days.** Ranges share the week's scale, so the rows compare at a glance.
- **Details, each shown once:**
  - air quality on the official EEA bands;
  - sun arc with time left until sunset;
  - wind compass with Beaufort scale and gusts;
  - humidity and dew point;
  - sea-level pressure;
  - UV index on the WHO bands;
  - rain today.
- **Your cities.** Up to 6 favorites with live conditions and local time, fetched in a single request. Recent cities appear in the search box.
- **Preferences.** °C/°F (wind in mph and rain in inches follow), light and dark themes, and `prefers-reduced-motion` is respected.

## Motion, with a purpose

| Where | What moves | Why |
|---|---|---|
| Favorite → city | The card grows into the city's sky window (shared `layoutId`), through the loading skeleton when needed | Keeps your place between views |
| Temperature | Odometer digits roll (also when switching °C/°F) | Shows the change, not just the new value |
| 24 hours | The line draws itself; rain bars rise hour by hour | Reads left to right like time |
| 7 days | Ranges grow from each day's minimum, row by row | Compares the days |
| Sun | The sun walks its arc up to the local hour | Shows how much day is left |
| Wind | The needle swings in and wobbles with the gusts | Gustier wind, livelier needle |
| Theme | The new theme spreads from the toggle (View Transitions) | Ties the change to its cause |

Motion's features load in a separate chunk (`LazyMotion`). `MotionConfig reducedMotion="user"`, a CSS fallback and a single still frame of the sky cover reduced motion.

## Stack

| Layer | Technology |
|---|---|
| UI | React 19 |
| Build | Vite 7 |
| Motion | Motion 13 (`motion/react`, `LazyMotion` + `m`) |
| Styling | Plain CSS per component + design tokens (light/dark) |
| Routing | ~40-line router on `useSyncExternalStore` |
| Weather, air quality, geocoding | [Open-Meteo](https://open-meteo.com) (free, no key, CC BY 4.0) |
| "Use my location" | [BigDataCloud](https://www.bigdatacloud.com) client reverse geocoding (free, no key) |
| Fonts | Syne · IBM Plex Mono |
| Deploy | Vercel |

## Data notes

- **Local time.** Open-Meteo answers in the city's wall-clock time without an offset (`timezone=auto`). Those strings are formatted as UTC so the browser never shifts them into the visitor's time zone. The clock in the main card runs from `utc_offset_seconds`, because `current.time` is the last 15-minute sample, not the time now.
- **Units.** Wind comes in km/h, and pressure is sea-level (`pressure_msl`). All unit conversion happens on screen.
- **Past day.** `past_days=1` provides yesterday's maximum for the comparison. The views find "today" by date, not by index.
- **Favorites.** They store the GeoNames id and coordinates. Name-only favorites saved by the first version are resolved once with their country and upgraded.
- **Your location.** It is only sent after you tap "Usar mi ubicación", rounded to ~1 km.

## Getting started

```bash
git clone https://github.com/MiguelEscobar0345/MeAtmos.git
cd MeAtmos
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run lint
npm run build
npm run preview
```

## Project structure

```
src/
├── api/            Open-Meteo calls and nearest-city lookup
├── components/     One component per file, each with its own CSS
├── hooks/          City data, suggestions, favorites, units, clock, theme
├── styles/         tokens.css (palette, type, radii) and base.css
├── utils/          Formatting, WMO codes, EEA/UV/Beaufort scales, sky engine, summary
├── router.js       Routes, links and navigation
└── main.jsx        LazyMotion + MotionConfig
```

## Deploy

Vercel with the Vite preset. `vercel.json` rewrites every path to `index.html`, so city URLs load directly:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## License

MIT © [Miguel Escobar, miguesco](https://miguesco.dev)
