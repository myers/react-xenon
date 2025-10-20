#!/usr/bin/env node
import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist-pages')

console.log('🏗️  Building GitHub Pages...\n')

// Clean dist directory
console.log('🧹 Cleaning dist directory...')
fs.removeSync(distDir)
fs.ensureDirSync(distDir)

// Build docs FIRST
console.log('\n📚 Building documentation...')
execSync('pnpm docs:build', { stdio: 'inherit', cwd: rootDir })

// Copy docs to root of dist
console.log('\n📦 Copying docs to dist...')
fs.copySync(
  path.join(rootDir, 'docs/.vitepress/dist'),
  distDir
)

// Copy canvas-ui tarballs to dist-pages/deps/canvas-ui/
console.log('\n📦 Copying canvas-ui tarballs...')
const tarballsDir = path.join(rootDir, 'canvas-ui-tarballs')
const depsDest = path.join(distDir, 'deps', 'canvas-ui')

if (fs.existsSync(tarballsDir)) {
  fs.ensureDirSync(depsDest)
  fs.copySync(tarballsDir, depsDest)
  console.log('  ✓ Copied canvas-ui tarballs to deps/canvas-ui/')
} else {
  console.warn('  ⚠️  No canvas-ui tarballs found - they will be built in CI')
}

// Build and copy each example AFTER docs build
// This ensures they're not processed by VitePress
const examplesDir = path.join(rootDir, 'examples')
const examples = fs.readdirSync(examplesDir).filter(file => {
  const examplePath = path.join(examplesDir, file)
  const isDir = fs.statSync(examplePath).isDirectory()
  const hasPackageJson = fs.existsSync(path.join(examplePath, 'package.json'))
  return isDir && hasPackageJson
})

console.log(`\n🎨 Building ${examples.length} examples...`)

for (const example of examples) {
  console.log(`\n  Building ${example}...`)
  const examplePath = path.join(examplesDir, example)

  try {
    execSync('pnpm build', {
      stdio: 'inherit',
      cwd: examplePath,
      env: { ...process.env, GITHUB_PAGES: 'true' }
    })

    // Copy built example directly to dist-pages/examples/<example-name>
    // This bypasses VitePress entirely
    const exampleDistSrc = path.join(examplePath, 'dist')
    const exampleDistDest = path.join(distDir, 'examples', example)

    if (fs.existsSync(exampleDistSrc)) {
      fs.ensureDirSync(path.dirname(exampleDistDest))
      fs.copySync(exampleDistSrc, exampleDistDest)
      console.log(`  ✓ Copied ${example} to dist-pages/examples/${example}`)
    } else {
      console.warn(`  ⚠️  No dist directory found for ${example}`)
    }
  } catch (error) {
    console.error(`  ❌ Failed to build ${example}:`, error.message)
  }
}

// Create a .nojekyll file to prevent GitHub Pages from ignoring files starting with _
fs.writeFileSync(path.join(distDir, '.nojekyll'), '')

console.log('\n✅ GitHub Pages build complete!')
console.log(`📂 Output directory: ${distDir}`)
console.log('\nTo preview locally:')
console.log('  npx serve dist-pages')
