# WebXR Integration Strategy: XRPlatformAdapter

## Overview

The best approach for integrating Canvas UI with WebXR is to create a custom `XRPlatformAdapter` that implements Canvas UI's `IPlatformAdapter` interface. This allows Canvas UI's existing render loop architecture to seamlessly work with WebXR's frame scheduling.

## Why XRPlatformAdapter is the Ideal Solution

### Current Architecture

Canvas UI uses a **PlatformAdapter** pattern to abstract platform-specific rendering:

```typescript
// v/canvas-ui/packages/core/src/platform/types.ts
export interface IPlatformAdapter {
  scheduleFrame(): void
  onFrame(callback: FrameCallback): () => void
  createCanvas(width: number, height: number): CrossPlatformCanvasElement
  createOffscreenCanvas(width: number, height: number): CrossPlatformOffscreenCanvas
  createRenderingContext(width: number, height: number): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null
  resizeCanvas(el: CrossPlatformCanvasOrOffscreenCanvas, width: number, height: number): void
  readonly supportOffscreenCanvas: boolean
}
```

Currently only `WebPlatformAdapter` exists (singleton), which uses browser's `requestAnimationFrame`.

### How RenderCanvas Uses PlatformAdapter

In the constructor, RenderCanvas registers callbacks (render-canvas.ts:49-50):

```typescript
const clearHandleEvents = PlatformAdapter.onFrame(this.handleNativeEvents)
const clearDrawFrame = PlatformAdapter.onFrame(this.drawFrame)
```

Every frame, the adapter calls all registered callbacks. This drives:
1. **Event handling** - Process pointer/keyboard events
2. **Rendering** - Run `drawFrame()` which calls `flushEnterFrame()`, checks `frameDirty`, and renders if needed

### Benefits of XRPlatformAdapter

1. **No Code Changes to RenderCanvas** - It already uses PlatformAdapter abstraction
2. **Perfect Synchronization** - XR session's RAF drives Canvas UI rendering
3. **No Double RAF Loops** - Single render loop controlled by XRSession
4. **Automatic Animation Support** - `flushEnterFrame()` runs every frame for scrollbar fade, etc.
5. **frameDirty Optimization Preserved** - Lazy updates still work via existing logic in drawFrame()

## Implementation Plan

### 1. Create XRPlatformAdapter

**File**: `src/xr-canvas-ui/XRPlatformAdapter.ts`

```typescript
import { IPlatformAdapter, FrameCallback } from '@canvas-ui/core'

export class XRPlatformAdapter implements IPlatformAdapter {
  private xrSession: XRSession | null = null
  private rafHandle: number = 0
  private onFrameCallbacks: FrameCallback[] = []

  readonly supportOffscreenCanvas = true

  // Register a callback to run every XR frame
  onFrame(callback: FrameCallback): () => void {
    this.onFrameCallbacks.push(callback)
    return () => {
      this.onFrameCallbacks = this.onFrameCallbacks.filter(it => it !== callback)
    }
  }

  // In XR, frames are auto-scheduled by XRSession
  scheduleFrame(): void {
    // No-op - XRSession handles scheduling
  }

  // Canvas creation - delegate to browser APIs
  createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    this.resizeCanvas(canvas, width, height)
    return canvas
  }

  createOffscreenCanvas(width: number, height: number): OffscreenCanvas {
    return new OffscreenCanvas(Math.round(width), Math.round(height))
  }

  createRenderingContext(width: number, height: number): OffscreenCanvasRenderingContext2D | null {
    return this.createOffscreenCanvas(width, height).getContext('2d')
  }

  resizeCanvas(el: HTMLCanvasElement | OffscreenCanvas, width: number, height: number): void {
    el.width = Math.round(width)
    el.height = Math.round(height)
  }

  // XR-specific methods
  startXRLoop(session: XRSession): void {
    this.xrSession = session
    this.rafHandle = session.requestAnimationFrame(this.xrFrameCallback)
  }

  stopXRLoop(): void {
    if (this.xrSession && this.rafHandle) {
      this.xrSession.cancelAnimationFrame(this.rafHandle)
      this.rafHandle = 0
      this.xrSession = null
    }
  }

  private xrFrameCallback = (time: number, frame: XRFrame) => {
    // Call all registered Canvas UI callbacks
    this.onFrameCallbacks.forEach(callback => callback(time))

    // Schedule next frame
    if (this.xrSession) {
      this.rafHandle = this.xrSession.requestAnimationFrame(this.xrFrameCallback)
    }
  }
}
```

### 2. Modify OffscreenCanvas Component

**File**: `src/components/OffscreenCanvas.tsx`

Add optional `platformAdapter` prop:

```typescript
export interface OffscreenCanvasProps {
  width: number
  height: number
  dpr?: number
  children: ReactNode
  canvasRef?: RefObject<OffscreenCanvas | undefined>
  onReady?: () => void
  onFrameRendered?: (info: FrameInfo) => void
  platformAdapter?: IPlatformAdapter  // NEW: Allow custom adapter
}
```

Use it when creating the RenderCanvas:

```typescript
import { PlatformAdapter as DefaultPlatformAdapter } from '@canvas-ui/core'

export function OffscreenCanvas({
  width,
  height,
  dpr = 2,
  children,
  canvasRef,
  onReady,
  onFrameRendered,
  platformAdapter,  // NEW
}: OffscreenCanvasProps) {
  const adapter = platformAdapter || DefaultPlatformAdapter

  const [binding] = useState(() => {
    const renderCanvas = createElement('Canvas')
    renderCanvas.prepareInitialFrame()

    const surface = Surface.makeOffscreenCanvasSurface({ canvasRef })
    ;(renderCanvas as any)._surface = surface

    const rasterizer = new Rasterizer({ surface })
    ;(renderCanvas as any)._rasterizer = rasterizer

    return renderCanvas
  })

  // Register with platform adapter (either default or XR)
  useEffect(() => {
    const cleanup = adapter.onFrame((binding as any).drawFrame)
    return cleanup
  }, [adapter, binding])

  // ... rest of component
}
```

### 3. Update XRCanvasUILayer

**File**: `src/xr-canvas-ui/XRCanvasUILayer.tsx`

```typescript
import { XRPlatformAdapter } from './XRPlatformAdapter'

export function XRCanvasUILayer({ children, ...props }: XRCanvasUILayerProps) {
  const [xrAdapter] = useState(() => new XRPlatformAdapter())

  // Start XR loop when session begins
  useEffect(() => {
    const session = useXRSession() // Get XR session from React Three XR
    if (session) {
      xrAdapter.startXRLoop(session)
      return () => xrAdapter.stopXRLoop()
    }
  }, [xrAdapter])

  return (
    <OffscreenCanvas
      platformAdapter={xrAdapter}
      width={1024}
      height={1024}
      dpr={2}
    >
      {children}
    </OffscreenCanvas>
  )
}
```

## Key Advantages

### 1. Clean Architecture
- Single abstraction point (IPlatformAdapter)
- No RenderCanvas modifications needed
- Easy to test (can mock the adapter)

### 2. Automatic Features
- ScrollView animations work automatically
- All Canvas UI timers/animations work
- Event handling works as expected

### 3. Performance
- Single render loop (no double RAF)
- frameDirty flag prevents unnecessary renders
- Perfect sync with XR compositor

### 4. Flexibility
- Can have multiple XR adapters for different sessions
- Can swap adapters at runtime if needed
- Demo mode (WebPlatformAdapter) and XR mode (XRPlatformAdapter) use same component

## Migration Path

1. **Phase 1** (Current): Use WebPlatformAdapter for demo
2. **Phase 2**: Implement XRPlatformAdapter
3. **Phase 3**: Test in WebXR with XRPlatformAdapter
4. **Phase 4**: Production ready

## Notes

- Each XRPlatformAdapter instance is tied to one XRSession
- Multiple Canvas UI instances can share the same adapter (callbacks array)
- Adapter lifecycle matches XRSession lifecycle
- No global state issues - each adapter is independent
