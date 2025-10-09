import '@fontsource-variable/inter'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { XRApp } from './XRApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <XRApp />
  </StrictMode>,
)
