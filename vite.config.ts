import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@react-three/xr': path.resolve(__dirname, './v/xr/packages/react/xr/src'),
    },
  },
  server: {
    fs: {
      allow: ['.'],
    },
    watch: {
      ignored: ['**/v/xr/examples/**', '**/v/canvas-ui/**'],
    },
  },
  optimizeDeps: {
    entries: ['src/**/*.tsx', 'src/**/*.ts'],
    exclude: [],
  },
})
