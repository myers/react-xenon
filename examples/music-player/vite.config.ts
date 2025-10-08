import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@react-xenon/core': path.resolve(__dirname, '../../packages/react-xenon/src'),
      '@canvas-ui/core': path.resolve(__dirname, '../../v/canvas-ui/packages/core/src'),
      '@canvas-ui/react': path.resolve(__dirname, '../../v/canvas-ui/packages/react/src'),
      '@canvas-ui/assert': path.resolve(__dirname, '../../v/canvas-ui/packages/assert/src'),
    },
  },
})
