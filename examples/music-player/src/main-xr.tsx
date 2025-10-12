import '@fontsource-variable/inter'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Log } from '@canvas-ui/core'
import { XRApp } from './XRApp'

// Disable Canvas UI debug logs for cleaner console output
Log.disableAll = true

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <XRApp />
  </StrictMode>,
)
