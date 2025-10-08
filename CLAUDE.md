# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**react-xenon** - A pnpm monorepo for building WebXR user interfaces with Canvas UI and React Three Fiber.

This project provides `@react-xenon/core`, a package that bridges Canvas UI (a React reconciler rendering to canvas) with WebXR, enabling React-based UIs to run in VR headsets like Meta Quest.

**Status:** Production-ready monorepo structure with publishable package and working examples.

## Monorepo Structure

```
react-xenon/
├── packages/
│   └── react-xenon/          # @react-xenon/core - Main publishable package
│       ├── src/
│       │   ├── index.ts      # Public API exports
│       │   ├── Xenon.tsx     # WebXR component
│       │   ├── XenonAsImg.tsx           # DOM/2D testing component
│       │   ├── useCanvasUISetup.tsx     # Core setup hook
│       │   └── BridgeEventBinding.ts    # Event bridge utility
│       ├── package.json
│       └── README.md
│
├── examples/
│   ├── basic/               # Minimal hello world example
│   ├── music-player/        # Full 2D music player (Canvas UI)
│   └── xenon-demo/          # WebXR music player demo
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

# Build packages only (examples don't need builds)
pnpm build

# Build everything including vendored deps
pnpm build:all
```

### Example Commands

```bash
# Run a specific example
cd examples/xenon-demo
pnpm dev

# Or from root
pnpm --filter xenon-demo-example dev
```

## Package: @react-xenon/core

The main package exports:

- `<Xenon>` - WebXR component for VR/AR
- `<XenonAsImg>` - DOM component for 2D testing
- `useCanvasUISetup` - Core setup hook
- `BridgeEventBinding` - Event bridge class

### Key Architecture

**BridgeEventBinding Pattern:**
- Translates external events (DOM, XR controllers) → Canvas UI event system
- Handles hit testing, hover state, event propagation automatically
- Clean API: `binding.injectPointerEvent()`, `binding.injectWheelEvent()`

**Event Flow:**
```
External Source (DOM/XR) → BridgeEventBinding.injectPointerEvent() →
Buffer → SyntheticEventManager → Auto-generate hover events →
Dispatch to React components
```

## Examples

### basic/
Minimal "Hello Xenon" example showing:
- `<Xenon>` component in WebXR
- Basic Canvas UI components (Flex, Text)
- VR button to enter XR

**Run:** `pnpm --filter basic-example dev`

### music-player/
Full-featured 2D music player using:
- `<XenonAsImg>` for DOM rendering
- Canvas UI components (Flex, Text, ScrollView)
- Zustand for state management
- Inter Variable font via @fontsource

**Run:** `pnpm --filter music-player-example dev`

### xenon-demo/
Complete WebXR music player demo featuring:
- `<Xenon>` component in VR
- XR controller events
- Joystick scrolling
- Full music player UI in VR

**Run:** `pnpm --filter xenon-demo-example dev` (requires HTTPS)

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

**Important:** When committing, exclude vendored dependencies from commits unless intentionally modifying them.

```bash
# Don't accidentally commit v/ changes
git status
git add packages/ examples/ *.md package.json
git commit
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
```

### WebXR Testing
Requires HTTPS for WebXR API access:

```bash
cd examples/xenon-demo
pnpm dev  # Uses @vitejs/plugin-basic-ssl
```

Access from:
- Browser with WebXR emulator
- Meta Quest browser (connect to local network)
- WebXR Device Emulator extension

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

## Publishing (Future)

To publish `@react-xenon/core` to npm:

1. Fix package imports to use actual npm packages instead of path aliases
2. Build package: `cd packages/react-xenon && pnpm build`
3. Test build output
4. Publish: `npm publish`

Currently blocked by vendored dependencies - need to either:
- Publish modified canvas-ui to npm
- Or bundle canvas-ui into the package
