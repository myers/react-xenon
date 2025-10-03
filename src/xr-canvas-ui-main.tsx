import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { XRCanvasUIApp } from './XRCanvasUIApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <XRCanvasUIApp />
  </StrictMode>,
)
