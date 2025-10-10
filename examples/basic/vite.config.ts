import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/react-xenon/examples/basic/' : '/',
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
      '@canvas-ui/core': path.resolve(__dirname, '../../vendor/canvas-ui/packages/core/src'),
      '@canvas-ui/react': path.resolve(__dirname, '../../vendor/canvas-ui/packages/react/src'),
      '@canvas-ui/assert': path.resolve(__dirname, '../../vendor/canvas-ui/packages/assert/src'),
      // Ensure three is resolved from node_modules when building vendored packages
      'three': path.resolve(__dirname, 'node_modules/three'),
    },
    dedupe: ['three', '@react-three/fiber', 'react', 'react-dom'],
  },
})
