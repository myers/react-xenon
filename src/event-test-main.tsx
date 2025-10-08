import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EventTestApp from './EventTestApp'
import { Log } from '@canvas-ui/core'

// Disable Canvas UI verbose logging
Log.disableAll = true

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EventTestApp />
  </StrictMode>,
)
