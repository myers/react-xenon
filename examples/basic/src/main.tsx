import { createRoot } from 'react-dom/client'
import { Log } from '@canvas-ui/core'
import { App } from './App'

// Disable Canvas UI debug logs for cleaner console output
Log.disableAll = true

createRoot(document.getElementById('root')!).render(
  <App />,
)
