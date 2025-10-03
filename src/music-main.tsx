import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MusicPlayerApp } from './MusicPlayerApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MusicPlayerApp />
  </StrictMode>,
)
