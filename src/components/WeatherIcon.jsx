import { useId } from 'react'
import './WeatherIcon.css'

// 32×32 grid. The cloud spans x 4.5–29.5, y 9–25 at scale 1.
const CLOUD = 'M9.5 25h14a5.5 5.5 0 0 0 .9-10.93A7.5 7.5 0 0 0 10.1 14.6 5.25 5.25 0 0 0 9.5 25z'

function Sun({ cx = 16, cy = 16, r = 6 }) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <g className="wi-sun-g">
      <g className="wi-rays">
        {rays.map(a => {
          const rad = (a * Math.PI) / 180
          return (
            <line
              key={a}
              className="wi-ray"
              x1={cx + Math.cos(rad) * (r + 3)}
              y1={cy + Math.sin(rad) * (r + 3)}
              x2={cx + Math.cos(rad) * (r + 5.5)}
              y2={cy + Math.sin(rad) * (r + 5.5)}
            />
          )
        })}
      </g>
      <circle className="wi-sun" cx={cx} cy={cy} r={r} />
    </g>
  )
}

function Moon({ cx = 16, cy = 16, r = 8 }) {
  const id = useId()
  return (
    <g className="wi-moon-g">
      <mask id={id}>
        <rect width="32" height="32" fill="#fff" />
        <circle cx={cx + r * 0.5} cy={cy - r * 0.5} r={r * 0.85} fill="#000" />
      </mask>
      <circle className="wi-moon" cx={cx} cy={cy} r={r} mask={`url(#${id})`} />
    </g>
  )
}

const Cloud = ({ transform }) => (
  <g className="wi-cloud-g" transform={transform}>
    <path className="wi-cloud" d={CLOUD} />
  </g>
)

// Cloud lifted to leave room for precipitation underneath
const RAISED = 'translate(0 -4)'
const Drops = () => (
  <g className="wi-drops">
    <line className="wi-drop" x1="11" y1="24" x2="9.5" y2="28.5" />
    <line className="wi-drop" x1="16.5" y1="24" x2="15" y2="28.5" />
    <line className="wi-drop" x1="22" y1="24" x2="20.5" y2="28.5" />
  </g>
)
const Drizzle = () => (
  <g className="wi-drops">
    <line className="wi-drop" x1="11" y1="24.5" x2="10.5" y2="26" />
    <line className="wi-drop" x1="16.5" y1="26.5" x2="16" y2="28" />
    <line className="wi-drop" x1="22" y1="24.5" x2="21.5" y2="26" />
  </g>
)
const Flake = ({ x, y }) => (
  <g className="wi-flake">
    <line x1={x - 1.8} y1={y} x2={x + 1.8} y2={y} />
    <line x1={x - 0.9} y1={y - 1.6} x2={x + 0.9} y2={y + 1.6} />
    <line x1={x - 0.9} y1={y + 1.6} x2={x + 0.9} y2={y - 1.6} />
  </g>
)
const Bolt = () => <path className="wi-bolt" d="M17.5 19.5 13 26h3.6l-1.4 5 5.3-7.2h-3.6l1.6-4.3z" />

const SHAPES = {
  clear:    (day) => (day ? <Sun r={6.5} /> : <Moon r={9} />),
  mostly:   (day) => (
    <>
      {day ? <Sun cx={14} cy={13} r={5.5} /> : <Moon cx={14} cy={13} r={7.5} />}
      <Cloud transform="translate(13 14) scale(0.55)" />
    </>
  ),
  partly:   (day) => (
    <>
      {day ? <Sun cx={11} cy={11} r={4.5} /> : <Moon cx={11} cy={11} r={6} />}
      <Cloud transform="translate(4 5) scale(0.86)" />
    </>
  ),
  overcast: () => (
    <>
      <Cloud transform="translate(-3 -3) scale(0.7)" />
      <Cloud />
    </>
  ),
  fog:      () => (
    <>
      <Cloud transform="translate(0 -5)" />
      <g className="wi-fog-g">
        <line className="wi-fog" x1="6" y1="23.5" x2="26" y2="23.5" />
        <line className="wi-fog" x1="9" y1="27.5" x2="23" y2="27.5" />
      </g>
    </>
  ),
  drizzle:  () => (<><Cloud transform={RAISED} /><Drizzle /></>),
  rain:     () => (<><Cloud transform={RAISED} /><Drops /></>),
  showers:  (day) => (
    <>
      {day ? <Sun cx={22} cy={8} r={4} /> : <Moon cx={22} cy={8} r={5} />}
      <Cloud transform={RAISED} />
      <Drops />
    </>
  ),
  sleet:    () => (
    <>
      <Cloud transform={RAISED} />
      <line className="wi-drop" x1="11" y1="24" x2="9.5" y2="28.5" />
      <Flake x={16.5} y={26.5} />
      <line className="wi-drop" x1="22" y1="24" x2="20.5" y2="28.5" />
    </>
  ),
  snow:     () => (
    <>
      <Cloud transform={RAISED} />
      <Flake x={10.5} y={25.5} />
      <Flake x={16.5} y={28} />
      <Flake x={22.5} y={25.5} />
    </>
  ),
  thunder:  () => (<><Cloud transform={RAISED} /><Bolt /></>),
  hail:     () => (
    <>
      <Cloud transform={RAISED} />
      <Bolt />
      <circle className="wi-hail" cx="10" cy="26" r="1.4" />
      <circle className="wi-hail" cx="23" cy="26.5" r="1.4" />
    </>
  ),
}

// x/y let a chart nest the icon inside its own <svg>
export default function WeatherIcon({ icon, isDay = 1, size = 32, label, className = '', x, y }) {
  const draw = SHAPES[icon] ?? SHAPES.overcast
  return (
    <svg
      className={`wi wi--${icon} ${className}`}
      viewBox="0 0 32 32"
      width={size}
      height={size}
      x={x}
      y={y}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {draw(isDay)}
    </svg>
  )
}
