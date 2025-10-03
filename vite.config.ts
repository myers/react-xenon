import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'
import { resolve } from 'path'

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
    basicSsl(),
  ],
  resolve: {
    alias: {
      '@react-three/xr': path.resolve(__dirname, './v/xr/packages/react/xr/src'),
      '@canvas-ui/core': path.resolve(__dirname, './v/canvas-ui/packages/core/src'),
      '@canvas-ui/react': path.resolve(__dirname, './v/canvas-ui/packages/react/src'),
      '@canvas-ui/assert': path.resolve(__dirname, './v/canvas-ui/packages/assert/src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'canvas-ui': resolve(__dirname, 'canvas-ui.html'),
        'webxr-demo': resolve(__dirname, 'webxr-demo.html'),
        'music-player': resolve(__dirname, 'music-player.html'),
        'xr-canvas-ui-demo': resolve(__dirname, 'xr-canvas-ui-demo.html'),
      },
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
