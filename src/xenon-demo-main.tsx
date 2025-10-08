import '@fontsource-variable/inter'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { XenonDemoApp } from './XenonDemoApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <XenonDemoApp />
  </StrictMode>,
)
