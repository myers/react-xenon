import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Plugin to resolve vendor dependencies from vendor/canvas-ui/node_modules
// Only runs during builds, not dev server (dev server handles resolution naturally)
function vendorResolve(): Plugin {
  const vendorNodeModules = path.resolve(__dirname, '../../vendor/canvas-ui/node_modules')
  let isServing = false

  return {
    name: 'vendor-resolve',
    enforce: 'pre',
    configResolved(config) {
      isServing = config.command === 'serve'
    },
    resolveId(source, importer) {
      // Skip resolution in dev mode - let Vite handle it naturally
      if (isServing) {
        return null
      }
      // Only try to resolve bare imports (not relative or absolute paths)
      // Skip our own aliases (@react-xenon, @canvas-ui)
      if (source.startsWith('.') || source.startsWith('/')) {
        return null
      }
      if (source.startsWith('@react-xenon') || source.startsWith('@canvas-ui')) {
        return null
      }

      // IMPORTANT: Never resolve React or packages in dedupe list from vendor
      // These MUST come from the example's node_modules to avoid duplicates
      const dedupePackages = ['react', 'react-dom', 'react-reconciler', 'react-use-measure', 'three', '@react-three/fiber']
      if (dedupePackages.some(pkg => source === pkg || source.startsWith(pkg + '/'))) {
        return null
      }

      // Check if this is being imported from a vendor file
      if (importer && importer.includes('/vendor/canvas-ui/')) {
        // Try to resolve from vendor/canvas-ui/node_modules
        const pnpmStore = path.join(vendorNodeModules, '.pnpm')
        if (fs.existsSync(pnpmStore)) {
          const pnpmDirs = fs.readdirSync(pnpmStore)

          // For scoped packages like @mapbox/shelf-pack, need to escape the slash
          const searchPrefix = source.replace('/', '+')
          const packageDir = pnpmDirs.find(dir => dir.startsWith(searchPrefix + '@'))

          if (packageDir) {
            const packagePath = path.join(pnpmStore, packageDir, 'node_modules', source)
            if (fs.existsSync(packagePath)) {
              const packageJson = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'), 'utf-8'))
              let entry = packageJson.module || packageJson.main || 'index.js'

              // If entry doesn't have an extension, try adding .js
              let entryPath = path.join(packagePath, entry)
              if (!fs.existsSync(entryPath) && !path.extname(entry)) {
                const withJs = entry + '.js'
                const withJsPath = path.join(packagePath, withJs)
                if (fs.existsSync(withJsPath)) {
                  entryPath = withJsPath
                }
              }

              return entryPath
            }
          }
        }
      }
      return null
    }
  }
}

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/react-xenon/examples/music-player/' : '/',
  plugins: [
    react({
      babel: {
        plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
      },
    }),
    basicSsl(),
    vendorResolve(),
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
    dedupe: ['three', '@react-three/fiber', 'react', 'react-dom', 'react-reconciler', 'react-use-measure'],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        canvas: path.resolve(__dirname, 'canvas.html'),
      },
    },
  },
})
