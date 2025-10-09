import '@fontsource-variable/inter'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ImgApp } from './ImgApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ImgApp />
  </StrictMode>,
)
