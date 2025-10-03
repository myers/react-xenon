import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@react-three/xr': path.resolve(__dirname, './v/xr/packages/react/xr/src'),
      '@canvas-ui/core': path.resolve(__dirname, './v/canvas-ui/packages/core/src'),
      '@canvas-ui/react': path.resolve(__dirname, './v/canvas-ui/packages/react/src'),
      '@canvas-ui/assert': path.resolve(__dirname, './v/canvas-ui/packages/assert/src'),
    },
  },
  server: {
    fs: {
      allow: ['.'],
    },
    watch: {
      ignored: ['**/v/xr/examples/**'],
    },
  },
  optimizeDeps: {
    entries: ['src/**/*.tsx', 'src/**/*.ts'],
    exclude: [],
  },
})
