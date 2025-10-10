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
│       │   └── XenonAsImg.tsx           # DOM/2D testing component
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
│   ├── api/                # API reference (Xenon, XenonAsImg)
│   └── index.md            # Documentation homepage
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages deployment workflow
│
├── scripts/
│   └── build-pages.js       # Build docs + examples for GitHub Pages
│
├── v/                       # Vendored dependencies (not in workspace)
│   ├── canvas-ui/          # Modified Canvas UI packages
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
- `<XenonAsImg>` - DOM component for 2D testing/development
- `XenonAsImgProps` - TypeScript props type for XenonAsImg

Both components provide a clean, declarative API for rendering Canvas UI in different contexts (WebXR vs DOM).

### Key Architecture

**Component Pattern:**
Both `Xenon` and `XenonAsImg` follow a unified architecture:
- Use Canvas UI's HeadlessCanvas for rendering React components to canvas
- Implement BridgeEventBinding internally for event translation
- Handle pointer events (mouse, touch, XR controllers) seamlessly
- Auto-generate hover/leave events via SyntheticEventManager
- Support full Canvas UI component library (Flex, Text, ScrollView, etc.)

**Event Flow:**
```
External Source (DOM/XR) → Component event handler →
BridgeEventBinding.injectPointerEvent() → Buffer →
SyntheticEventManager → Auto-generate hover events →
Dispatch to React component handlers
```

**Rendering:**
- `XenonAsImg`: Canvas → Blob URL → `<img>` element (for 2D testing)
- `Xenon`: OffscreenCanvas → Texture → XRLayer (for WebXR)

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
Full-featured music player supporting both 2D and WebXR modes:
- `<XenonAsImg>` for 2D DOM rendering (testing/development)
- `<Xenon>` for WebXR VR rendering
- Complex UI with Canvas UI components (Flex, Text, ScrollView, Image)
- State management with Zustand
- Album artwork and playlist support
- Inter Variable font via @fontsource-variable
- XR controller interaction and joystick scrolling (in VR mode)

**Run:** `pnpm --filter music-player-example dev`

**Technologies:** React, Canvas UI, React Three Fiber, @react-three/xr, @react-three/drei, Zustand, Lucide icons

## Documentation

The project uses **VitePress** for documentation, located in the `docs/` directory.

### Structure
- `docs/guide/` - Getting started guides and core concepts
- `docs/api/` - API reference for Xenon and XenonAsImg components
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

## Vendored Dependencies

The `v/` directory contains modified versions of:

- **canvas-ui** - Canvas UI library with OffscreenCanvas support
- **xr** - React Three XR with custom modifications
- **uikit** - React Three UIKit (reference)
- **motion** - Motion library (reference)

These are **not in the pnpm workspace**. Examples access them via Vite path aliases:

```typescript
// In vite.config.ts
resolve: {
  alias: {
    '@react-xenon/core': '../../packages/react-xenon/src',
    '@canvas-ui/core': '../../v/canvas-ui/packages/core/src',
    '@canvas-ui/react': '../../v/canvas-ui/packages/react/src',
  }
}
```

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

### 2D Testing (No VR headset needed)
Use `<XenonAsImg>` component - renders Canvas UI to `<img>` via blob URLs

```bash
cd examples/music-player
pnpm dev
# Open http://localhost:5173 in browser
```

The music-player example can toggle between 2D (`XenonAsImg`) and WebXR (`Xenon`) modes, making it easy to develop and test UI without a headset.

### WebXR Testing
Both examples support WebXR. Requires HTTPS for WebXR API access:

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
1. Installs dependencies with pnpm
2. Builds packages (`pnpm build`)
3. Builds documentation and examples (`pnpm pages:build`)
4. Deploys to GitHub Pages

### Build Script
The `scripts/build-pages.js` script:
- Builds VitePress documentation
- Builds all examples with production settings
- Combines everything into `dist-pages/` directory
- Documentation at root, examples at `/examples/{example-name}/`

### Local Preview
Test the GitHub Pages build locally:
```bash
pnpm pages:build
npx serve dist-pages
```

### Accessing Deployed Site
- **Documentation**: `https://your-username.github.io/react-xenon/`
- **Examples**: `https://your-username.github.io/react-xenon/examples/basic/`

## Publishing (Future)

To publish `@react-xenon/core` to npm:

1. Fix package imports to use actual npm packages instead of path aliases
2. Build package: `cd packages/react-xenon && pnpm build`
3. Test build output
4. Publish: `npm publish`

Currently blocked by vendored dependencies - need to either:
- Publish modified canvas-ui to npm
- Or bundle canvas-ui into the package
