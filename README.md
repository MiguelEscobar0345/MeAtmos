# ME Atmos — Weather & Air Quality Dashboard

A dark, cinematic weather dashboard built with React and Vite. Real-time weather conditions, 7-day forecasts, hourly trends, and air quality data — all from free APIs with no API key required.

Live demo → **Coming soon**

---

## Preview

> Deep navy atmosphere that shifts with the weather. Monospaced data typography meets editorial layout — built to impress and to actually work.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | CSS-in-JS + CSS variables |
| Weather data | [Open-Meteo](https://open-meteo.com) — free, no key |
| Air quality | [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) |
| Geocoding | [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) |
| Fonts | Syne · IBM Plex Mono (Google Fonts) |
| Deployment | Vercel |

---

## Features

- **Real-time weather** — temperature, feels like, humidity, wind, pressure, UV index, precipitation
- **24-hour hourly forecast** — scrollable, with mini temperature bars and precipitation probability
- **7-day forecast** — min/max range bars, weather icons, day-by-day breakdown
- **Air Quality Index** — European AQI scale + PM2.5, PM10, Ozone, NO₂
- **Dynamic background** — shifts between moods (clear, rain, storm, snow, fog) based on current conditions
- **City search** — geocoding for any city in the world
- **Zero API keys** — 100% free, open APIs
- **Fully responsive** — desktop dashboard layout collapses gracefully to mobile

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/MiguelEscobar0345/MeAtmos.git
cd atmos

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and search any city.

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
atmos/
├── public/
│   ├── favicon.svg
│   └── macaw.png           # Personal branding asset
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx         # City search input
│   │   ├── CurrentWeather.jsx    # Main weather hero card
│   │   ├── HourlyForecast.jsx    # 24h scrollable timeline
│   │   ├── WeekForecast.jsx      # 7-day forecast rows
│   │   ├── AirQuality.jsx        # AQI + pollutants panel
│   │   ├── WeatherDetails.jsx    # Wind, pressure, UV, sunrise/sunset
│   │   └── Footer.jsx            # Personal links footer
│   ├── hooks/
│   │   ├── useWeather.js         # Geocoding + weather fetch logic
│   │   └── useAirQuality.js      # Air quality fetch logic
│   ├── utils/
│   │   ├── weatherCodes.js       # WMO codes, AQI levels, bg gradients
│   │   └── formatters.js         # Temp, wind, date formatters
│   ├── styles/
│   │   └── globals.css           # CSS variables + keyframes
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

## Deploy on Vercel

### Option 1 — Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2 — GitHub Import

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Set **Framework Preset** to `Vite`
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. Click **Deploy**

The `vercel.json` handles client-side routing automatically.

---

## APIs Used

All endpoints are free and require no authentication.

| API | Endpoint | Usage |
|-----|----------|-------|
| Open-Meteo Geocoding | `/v1/search` | Resolve city name → lat/lon |
| Open-Meteo Forecast | `/v1/forecast` | Current + hourly + daily weather |
| Open-Meteo Air Quality | `/v1/air-quality` | AQI, PM2.5, PM10, O₃, NO₂ |

### WMO Weather Codes

Weather conditions are interpreted from [WMO codes](https://open-meteo.com/en/docs) (0–99), mapped to human-readable labels, emojis, and background themes.

### AQI Scale

Uses the **European AQI** scale (0–100+):

| Range | Level | Color |
|-------|-------|-------|
| 0–20 | Good | Green |
| 21–40 | Fair | Blue |
| 41–60 | Moderate | Amber |
| 61–80 | Poor | Orange |
| 81–100 | Very Poor | Red |
| 100+ | Hazardous | Purple |

---

## Design Decisions

**Why dark theme?**
Weather data is inherently atmospheric — a dark canvas makes color-coded conditions (blue for rain, amber for UV, green for good air) pop with much more clarity than a light UI. It also differentiates this project visually from the MeDex Pokédex (light, Apple-inspired) in the portfolio.

**Why IBM Plex Mono for data?**
Monospaced fonts give numeric data visual rhythm and alignment. Temperature readings, AQI scores, and timestamps feel more precise and dashboard-like compared to proportional type.

**Why no state management library?**
The data flow is linear: search → geocode → fetch weather + AQ → render. Two custom hooks handle all async logic cleanly without needing Redux or Zustand.

---

## License

MIT © [Miguel E. Escobar P.](https://portfolio.com)