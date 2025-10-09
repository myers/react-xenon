import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
      },
    }),
    basicSsl(),
  ],
  resolve: {
    alias: {
      '@react-xenon/core': path.resolve(__dirname, '../../packages/react-xenon/src'),
      '@canvas-ui/core': path.resolve(__dirname, '../../v/canvas-ui/packages/core/src'),
      '@canvas-ui/react': path.resolve(__dirname, '../../v/canvas-ui/packages/react/src'),
      '@canvas-ui/assert': path.resolve(__dirname, '../../v/canvas-ui/packages/assert/src'),
      '@react-three/xr': path.resolve(__dirname, '../../v/xr/packages/react/xr/src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        img: path.resolve(__dirname, 'img.html'),
        canvas: path.resolve(__dirname, 'canvas.html'),
      },
    },
  },
})
