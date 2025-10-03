import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { WebXRApp } from './WebXRApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WebXRApp />
  </StrictMode>,
)
