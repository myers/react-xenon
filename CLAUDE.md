# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**react-xenon** - A pnpm monorepo for building WebXR user interfaces with Canvas UI and React Three Fiber.

This project provides `@react-xenon/core`, a package that bridges Canvas UI (a React reconciler rendering to canvas) with WebXR, enabling React-based UIs to run in VR headsets like Meta Quest.

**Status:** Production-ready monorepo structure with publishable package, working examples, and comprehensive VitePress documentation.

## Monorepo Structure

```
react-xenon/
├── packages/
│   └── react-xenon/          # @react-xenon/core - Main publishable package
│       ├── src/
│       │   ├── index.ts      # Public API exports
│       │   ├── Xenon.tsx     # WebXR component
│       │   ├── XenonContext.tsx # Context for XR platform adapter
│       │   └── hooks/        # React hooks (useXenonFrame)
│       ├── package.json
│       └── README.md
│
├── examples/
│   ├── basic/               # Minimal WebXR hello world
│   └── music-player/        # Full-featured music player (2D and WebXR)
│
├── docs/                    # VitePress documentation
│   ├── .vitepress/         # VitePress config and theme
│   ├── guide/              # Getting started, core concepts
│   ├── api/                # API reference (Xenon)
│   └── index.md            # Documentation homepage
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages deployment workflow
│
├── scripts/
│   └── build-pages.js       # Build docs + examples for GitHub Pages
│
├── vendor/
│   └── canvas-ui/          # Canvas UI submodule (modified with OffscreenCanvas support)
│
├── v/                       # Old vendored dependencies (not in workspace)
│   ├── xr/                 # Modified React Three XR
│   ├── uikit/              # React Three UIKit
│   └── motion/             # Motion library
│
├── archive/                 # Old code (pre-monorepo)
├── pnpm-workspace.yaml      # Workspace configuration
└── package.json             # Root workspace config
```

## Development Commands

**Package Manager**: Use `pnpm` (required for monorepo)

### Workspace Commands

```bash
# Install all dependencies
pnpm install

# Run all examples in parallel
pnpm dev

# Build packages only
pnpm build

# Build everything including vendored deps
pnpm build:all

# Build all examples
pnpm examples:build
```

### Documentation Commands

```bash
# Run documentation site locally (with hot reload)
pnpm docs:dev

# Build documentation for production
pnpm docs:build

# Preview built documentation
pnpm docs:preview
```

### GitHub Pages Commands

```bash
# Build docs + all examples for GitHub Pages deployment
pnpm pages:build

# Preview the GitHub Pages build locally
npx serve dist-pages
```

### Example Commands

```bash
# Run a specific example
cd examples/basic
pnpm dev

# Or from root
pnpm --filter basic-example dev
pnpm --filter music-player-example dev
```

## Package: @react-xenon/core

The main package exports:

- `<Xenon>` - WebXR component for VR/AR rendering
- `XenonProps` - TypeScript props type for Xenon
- `useXenonFrame` - XR-aware frame loop hook
- `XRPlatformAdapter` - Platform adapter for WebXR rendering

The Xenon component provides a clean, declarative API for rendering Canvas UI in WebXR.

### Key Architecture

**Component Pattern:**
Xenon uses this architecture:
- Uses Canvas UI's HeadlessCanvas for rendering React components to OffscreenCanvas
- Implements BridgeEventBinding internally for event translation
- Handles pointer events from XR controllers seamlessly
- Auto-generates hover/leave events via SyntheticEventManager
- Supports full Canvas UI component library (Flex, Text, ScrollView, etc.)
- Provides XenonContext for child components to access XR frame loop

**Event Flow:**
```
External Source (DOM/XR) → Component event handler →
BridgeEventBinding.injectPointerEvent() → Buffer →
SyntheticEventManager → Auto-generate hover events →
Dispatch to React component handlers
```

**Rendering:**
- OffscreenCanvas → WebGL Texture → XRLayer (for WebXR)
- XRPlatformAdapter provides XR-aware frame loop via useXenonFrame hook

## Examples

### basic/
Minimal "Hello Xenon" WebXR example showing:
- `<Xenon>` component for WebXR rendering
- Basic Canvas UI components (Flex, Text)
- VR button to enter XR mode
- Simple pointer interaction

**Run:** `pnpm --filter basic-example dev`

**Technologies:** React, Canvas UI, React Three Fiber, @react-three/xr

### music-player/
Full-featured music player in WebXR:
- `<Xenon>` for WebXR VR rendering
- Complex UI with Canvas UI components (Flex, Text, ScrollView, Image)
- XR-aware animations using useXenonFrame hook
- State management with Zustand
- Album artwork and playlist support
- Inter Variable font via @fontsource-variable
- XR controller interaction and joystick scrolling

**Run:** `pnpm --filter music-player-example dev`

**Technologies:** React, Canvas UI, React Three Fiber, @react-three/xr, @react-three/drei, Zustand, Lucide icons

## Documentation

The project uses **VitePress** for documentation, located in the `docs/` directory.

### Structure
- `docs/guide/` - Getting started guides and core concepts
- `docs/api/` - API reference for Xenon component
- `docs/examples.md` - Live example showcase
- `docs/.vitepress/config.ts` - VitePress configuration

### Local Development
```bash
pnpm docs:dev  # http://localhost:5173
```

### Deployment
Documentation is automatically deployed to GitHub Pages via `.github/workflows/deploy.yml` when pushing to `main`. The deployment includes:
- Full VitePress documentation
- Built examples (accessible via `/examples/basic/`, `/examples/music-player/`)

## Dependencies

### Canvas UI Fork

This project uses a **forked version of Canvas UI** (`myers/canvas-ui#headless-canvas`) with:
- OffscreenCanvas support for WebXR rendering
- BridgeEventBinding for programmatic event injection
- HeadlessCanvas component for headless rendering
- Fixed pointerenter/pointerleave event bubbling

The fork is distributed as **pre-built tarballs hosted on GitHub Pages**:
- `https://icepick.info/react-xenon/deps/canvas-ui/canvas-ui-core-2.0.0.tgz`
- `https://icepick.info/react-xenon/deps/canvas-ui/canvas-ui-react-2.0.0.tgz`
- `https://icepick.info/react-xenon/deps/canvas-ui/canvas-ui-assert-2.0.0.tgz`

These are referenced via **pnpm overrides** in the root `package.json`:
```json
{
  "pnpm": {
    "overrides": {
      "@canvas-ui/core": "https://icepick.info/react-xenon/deps/canvas-ui/canvas-ui-core-2.0.0.tgz",
      "@canvas-ui/react": "https://icepick.info/react-xenon/deps/canvas-ui/canvas-ui-react-2.0.0.tgz",
      "@canvas-ui/assert": "https://icepick.info/react-xenon/deps/canvas-ui/canvas-ui-assert-2.0.0.tgz"
    }
  }
}
```

### Updating Canvas UI

When you push changes to `myers/canvas-ui` branch `headless-canvas`:
1. Trigger the GitHub Actions workflow manually or push to main
2. The workflow will:
   - Fetch the latest commit hash from the canvas-ui repo
   - Check if cached tarballs exist for that commit
   - If not cached: clone, build, and pack the packages
   - If cached: restore tarballs from GitHub Actions cache (~1-2 seconds)
3. Tarballs are deployed to GitHub Pages at `/deps/canvas-ui/`
4. Run `pnpm install` locally to fetch the updated tarballs

### Legacy Vendored Dependencies

The `v/` directory contains old vendored dependencies (not currently used):
- **xr** - React Three XR (now using official npm package @react-three/xr)
- **uikit** - React Three UIKit (reference)
- **motion** - Motion library (reference)

## TypeScript Configuration

- Root `tsconfig.json` - Base configuration for all packages
- Examples extend root config
- Package uses `tsconfig.build.json` for builds (currently has errors due to path aliases)

**Note:** Package build currently fails due to @canvas-ui imports. This is OK for development since examples use source directly via path aliases. Building is only needed for npm publishing.

## Git Workflow

**Important:** When committing, be selective about what to include.

### Generally commit:
- `packages/` - Source code changes
- `examples/` - Example code changes
- `docs/` - Documentation source changes
- `.github/` - Workflow configurations
- `scripts/` - Build scripts
- `*.md` files - Documentation updates
- `package.json`, `pnpm-lock.yaml` - Dependency updates

### Generally exclude:
- `v/` - Vendored dependencies (unless intentionally modifying)
- `dist-pages/` - Built documentation (generated by CI)
- `node_modules/` - Dependencies (gitignored)
- `dist/` - Build outputs (gitignored)
- `.vitepress/dist/` - Built docs (generated)

```bash
# Example commit workflow
git status
git add packages/ examples/ docs/ CLAUDE.md
git commit -m "Update documentation"
```

## Adding New Examples

1. Create directory in `examples/`
2. Copy structure from `examples/basic/`
3. Update `package.json` with unique name
4. Create `vite.config.ts` with path aliases
5. Add example-specific dependencies
6. Run `pnpm install` at root

## Testing

### WebXR Testing
Examples support WebXR. Requires HTTPS for WebXR API access:

```bash
# Basic example
cd examples/basic
pnpm dev  # Uses @vitejs/plugin-basic-ssl

# Music player with full UI
cd examples/music-player
pnpm dev  # Uses @vitejs/plugin-basic-ssl
```

Access from:
- **Desktop browser**: Use WebXR Device Emulator extension for testing
- **Meta Quest**: Connect to your local network (https://YOUR_IP:5173)
- **Other VR headsets**: Any WebXR-compatible browser

**Note:** Accept the self-signed SSL certificate warning when accessing via HTTPS locally.

## Common Issues

### Build Errors
**Package build fails with "Cannot find module @canvas-ui/core"**
- This is expected - package uses path aliases not npm dependencies
- Examples work fine via Vite's alias resolution
- Only matters when publishing to npm (future work)

### HMR Issues
**Changes not reflecting after editing vendored code**
- Clear Vite cache: `rm -rf node_modules/.vite`
- Full page reload (not just HMR)

### Workspace Errors
**"Package not found in workspace"**
- Check `pnpm-workspace.yaml` includes correct paths
- Run `pnpm install` at root
- Ensure package.json has correct workspace:* references

## GitHub Pages Deployment

The project automatically deploys documentation and examples to GitHub Pages on every push to `main`.

### Deployment Workflow
The `.github/workflows/deploy.yml` GitHub Action:
1. Checks out repository
2. Fetches latest canvas-ui commit hash from GitHub API
3. Checks GitHub Actions cache for pre-built canvas-ui tarballs
4. If cache miss: clones canvas-ui, builds packages, creates tarballs (~30-60s)
5. If cache hit: restores tarballs from cache (~1-2s)
6. Installs dependencies with pnpm
7. Builds documentation and examples (`pnpm pages:build`)
8. Copies canvas-ui tarballs to `dist-pages/deps/canvas-ui/`
9. Deploys to GitHub Pages

**Caching:** Tarballs are cached with key `canvas-ui-tarballs-<commit-hash>`, so they're only rebuilt when canvas-ui changes.

### Build Script
The `scripts/build-pages.js` script:
- Builds VitePress documentation
- Copies canvas-ui tarballs to `dist-pages/deps/canvas-ui/`
- Builds all examples with production settings
- Combines everything into `dist-pages/` directory
- Documentation at root, examples at `/examples/{example-name}/`, tarballs at `/deps/canvas-ui/`

### Local Preview
Test the GitHub Pages build locally:
```bash
pnpm pages:build
npx serve dist-pages
```

### Accessing Deployed Site
- **Documentation**: `https://icepick.info/react-xenon/`
- **Examples**: `https://icepick.info/react-xenon/examples/basic/`
- **Canvas UI Tarballs**: `https://icepick.info/react-xenon/deps/canvas-ui/`

## Publishing (Future)

To publish `@react-xenon/core` to npm:

1. Fix package imports to use actual npm packages instead of path aliases
2. Build package: `cd packages/react-xenon && pnpm build`
3. Test build output
4. Publish: `npm publish`

Currently blocked by vendored dependencies - need to either:
- Publish modified canvas-ui to npm
- Or bundle canvas-ui into the package
