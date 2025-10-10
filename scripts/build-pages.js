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

// Build and copy each example FIRST (before docs build)
// This puts them in docs/public/ so VitePress includes them as static assets
const examplesDir = path.join(rootDir, 'examples')
const examples = fs.readdirSync(examplesDir).filter(file => {
  const examplePath = path.join(examplesDir, file)
  const isDir = fs.statSync(examplePath).isDirectory()
  const hasPackageJson = fs.existsSync(path.join(examplePath, 'package.json'))
  return isDir && hasPackageJson
})

console.log(`\n🎨 Building ${examples.length} examples...`)

// Clean docs/public/examples before building
const docsPublicExamplesDir = path.join(rootDir, 'docs/public/examples')
fs.removeSync(docsPublicExamplesDir)

for (const example of examples) {
  console.log(`\n  Building ${example}...`)
  const examplePath = path.join(examplesDir, example)

  try {
    execSync('pnpm build', {
      stdio: 'inherit',
      cwd: examplePath,
      env: { ...process.env, GITHUB_PAGES: 'true' }
    })

    // Copy built example to docs/public/examples/<example-name>
    // VitePress will include these as static assets
    const exampleDistSrc = path.join(examplePath, 'dist')
    const exampleDistDest = path.join(docsPublicExamplesDir, example)

    if (fs.existsSync(exampleDistSrc)) {
      fs.ensureDirSync(path.dirname(exampleDistDest))
      fs.copySync(exampleDistSrc, exampleDistDest)
      console.log(`  ✓ Copied ${example} to docs/public/examples/${example}`)
    } else {
      console.warn(`  ⚠️  No dist directory found for ${example}`)
    }
  } catch (error) {
    console.error(`  ❌ Failed to build ${example}:`, error.message)
  }
}

// Build docs (which will include examples from public/ directory)
console.log('\n📚 Building documentation...')
execSync('pnpm docs:build', { stdio: 'inherit', cwd: rootDir })

// Copy docs to root of dist
console.log('\n📦 Copying docs to dist...')
fs.copySync(
  path.join(rootDir, 'docs/.vitepress/dist'),
  distDir
)

// Create a .nojekyll file to prevent GitHub Pages from ignoring files starting with _
fs.writeFileSync(path.join(distDir, '.nojekyll'), '')

console.log('\n✅ GitHub Pages build complete!')
console.log(`📂 Output directory: ${distDir}`)
console.log('\nTo preview locally:')
console.log('  npx serve dist-pages')
