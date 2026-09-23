import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LazyMotion, MotionConfig } from 'motion/react'
import App from './App.jsx'
import './styles/tokens.css'
import './styles/base.css'

const loadMotion = () => import('./motionFeatures.js').then(mod => mod.default)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* domMax includes layout/shared-element animations; "user" follows prefers-reduced-motion */}
    <LazyMotion features={loadMotion} strict>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </LazyMotion>
  </StrictMode>
)
