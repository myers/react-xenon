# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**react-xenon** - A WebXR UI library for building interactive user interfaces in virtual reality, specifically targeting Meta Quest devices.

This project started as an experiment exploring Canvas UI and WebXR integration, and has evolved into a production-ready library. It bridges Canvas UI (a React reconciler that renders to canvas) with WebXR, enabling React-based UIs to run in VR headsets.

**Current Status:** Building a clean event bridge architecture that translates external input sources (DOM events, XR controllers) to Canvas UI's event system using the `BridgeEventBinding` pattern.

## Development Commands

**Package Manager**: Use `pnpm` (not npm)

- **Development server**: `pnpm dev` (runs on HTTPS with basic SSL, accessible via `--host`)
- **Build**: `pnpm build` (runs TypeScript compiler then Vite build)
- **Preview**: `pnpm preview`
- **Type checking**: `npx tsc` (note: uses project references via tsconfig.json)

## Multi-Page Application

The project uses Vite's multi-page setup with separate HTML entry points:

- `index.html` - Landing page with links to all demos
- `canvas-ui.html` - Canvas UI + OffscreenCanvas comparison demo
- `webxr-demo.html` - UIKit music player in WebXR
- `music-player.html` - Canvas UI music player (2D)
- `xr-canvas-ui-demo.html` - XR Canvas UI music player demo

Each HTML file loads a different entry point from `src/`. When adding new demos, update both the Vite config's `build.rollupOptions.input` and create the corresponding HTML file.

## Architecture

### Vendored Dependencies

The project vendors modified versions of several libraries in the `v/` directory:

- `v/canvas-ui/` - Canvas UI library (@canvas-ui/core, @canvas-ui/react, @canvas-ui/assert)
- `v/xr/` - React Three XR (@react-three/xr)
- `v/uikit/` - React Three UIKit
- `v/motion/` - Motion library
- `v/immersive-web-emulation-runtime/` - WebXR emulation

These are aliased in `vite.config.ts` via `resolve.alias` to point to source directories, allowing live editing of library code. When modifying core UI behavior, check these directories first.

### Event Bridge Architecture

**BridgeEventBinding** (`src/utils/BridgeEventBinding.ts`)
- Implements `NativeEventBinding` interface from Canvas UI
- Bridges external event sources to Canvas UI's event processing system
- Buffers events in `NativePointerEvents` format (keyed by pointerId)
- Methods: `injectPointerEvent()`, `injectWheelEvent()`, `flushPointerEvents()`, `flushWheelEvent()`
- Automatically triggers frame scheduling via `onEvents()` callback
- Used by both OffscreenCanvas (2D testing) and XRLayer (VR) components

**Key Insight:** Instead of manually creating synthetic events and dispatching them, we inject native-like events into a binding, and let Canvas UI's `SyntheticEventManager` handle all the complexity:
- Hit testing via `hitTestFromRoot()`
- Automatic generation of hover events (pointerenter/pointerleave) from pointermove
- Event propagation through capture/target/bubble phases
- Path calculation and event targeting

**Event Flow:**
```
External Source (DOM/XR) → BridgeEventBinding.injectPointerEvent() →
NativePointerEvents buffer → SyntheticEventManager.flushNativeEvents() →
SyntheticEventManager.handlePointerEvents() → Auto-generates hover events →
Synthetic events dispatched to React components
```

### Core XR Canvas UI System

The `src/xr-canvas-ui/` directory contains the core integration layer:

**OffscreenCanvas Component** (`src/components/OffscreenCanvas.tsx`)
- Headless Canvas UI rendering to OffscreenCanvas without DOM mounting
- Creates `RenderCanvas`, `Surface`, `Rasterizer` manually
- Creates `BridgeEventBinding` and wires to `SyntheticEventManager`
- Intentionally does NOT set `renderCanvas.el` to avoid DOM event bindings
- Exposes binding via `bindingRef` prop for external event injection
- Continuous render loop checks `frameDirty` flag for lazy updates
- Returns `null` (doesn't render to DOM)

**XRCanvasUILayer** (`XRCanvasUILayer.tsx`)
- Component that creates an XRLayer displaying Canvas UI content
- Converts XR pointer events (UV coordinates) to Canvas UI events (pixel coordinates)
- Handles pointer interactions: down, up, move, over, leave
- Supports XR controller joystick for scrolling (enableJoystickScroll, scrollSensitivity)
- Uses hit testing via `renderCanvas.hitTestFromRoot()` for event targeting

**Event Flow (XR)**:
```
XR Controller → XRLayer (UV coords) → XRCanvasUILayer (pixel coords) →
BridgeEventBinding → SyntheticEventManager → React components
```

**Event Flow (2D Testing)**:
```
DOM Event → Image coordinates → Canvas coordinates →
BridgeEventBinding → SyntheticEventManager → React components
```

### Canvas UI Integration

Canvas UI is a React reconciler that renders to canvas instead of DOM:
- Uses `@canvas-ui/core` for the render tree (`RenderCanvas`, `createElement`)
- Uses `@canvas-ui/react` for React integration (`render()`, components like `<Flex>`, `<Text>`)
- Components: `View`, `Canvas`, `Flex`, `Text`, `Image`, `ScrollView`
- Manual event dispatch via `renderCanvas.dispatchEvent()` with synthetic events
- Hit testing via `renderCanvas.hitTestFromRoot(Point)` returns path of targets

### State Management

- Music player uses Zustand store (`src/hooks/useMusicPlayer.ts`)
- XR/3D demos may use `@preact/signals` for reactive state
- Standard React hooks throughout

## Key Patterns

### Adding XR Canvas UI to a Scene

```tsx
import { XRCanvasUILayer } from './xr-canvas-ui'
import { Text, Flex, ScrollView } from '@canvas-ui/react'

<XRCanvasUILayer
  position={[0, 0, -1]}
  pixelWidth={1024}
  pixelHeight={1024}
  dpr={2}
>
  <Flex style={{ padding: 20 }}>
    <Text>Hello WebXR!</Text>
  </Flex>
</XRCanvasUILayer>
```

### Dispatching Events to Canvas UI

**The Clean Way (using BridgeEventBinding):**
```tsx
const bindingRef = useRef<BridgeEventBinding>()

// In component:
<OffscreenCanvas bindingRef={bindingRef} ... />

// To inject events:
bindingRef.current?.injectPointerEvent('pointermove', x, y, button, pointerId)
bindingRef.current?.injectWheelEvent(x, y, deltaX, deltaY)
```

Canvas UI's `SyntheticEventManager` automatically:
- Performs hit testing to find targets under the pointer
- Generates `pointerenter`/`pointerleave` events when hover state changes
- Handles event propagation (capture → target → bubble)
- Manages pointer state tracking

**DO NOT** manually create synthetic events or call `dispatchEvent()` directly. Use `BridgeEventBinding` instead.

## TypeScript Configuration

- Uses project references (tsconfig.json → tsconfig.app.json, tsconfig.node.json)
- Strict mode enabled with `experimentalDecorators` for Babel decorator plugin
- Module resolution: "bundler" mode
- When type checking, run `npx tsc` (not `tsc -b` directly)

## Testing

### Event Testing (2D)
Run `event-test.html` to test the event bridge:
- Interactive counter button with hover effects
- Record mouse interactions and play them back
- Load pre-recorded event sequences from JSON
- Validates BridgeEventBinding integration

### WebXR Testing (VR)
1. Build and serve over HTTPS (dev server uses `@vitejs/plugin-basic-ssl`)
2. Access from Meta Quest browser or use WebXR emulation
3. Test pointer events, scrolling, and interactions with controllers
4. For performance: use `dpr: 2` for crisp text, keep dimensions power-of-2

## Project Goals

1. **Clean Architecture** - Use Canvas UI's built-in patterns (NativeEventBinding) rather than working around them
2. **Reusability** - BridgeEventBinding works for both 2D testing and XR production use
3. **Type Safety** - Leverage TypeScript and Canvas UI's interfaces
4. **Performance** - Lazy rendering via `frameDirty`, efficient event processing
5. **Developer Experience** - Simple API, clear patterns, good documentation
- Test all changes using the chrome devtools mcp