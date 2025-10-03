# Canvas UI Rendering Model

## Overview

Canvas UI uses a **two-phase rendering architecture** similar to Flutter:

### Phase 1: Building the Layer Tree (Layout → Compositing → Paint)

The three flush methods **do not draw pixels**. They build a layer tree with recorded drawing commands:

1. **`pipeline.flushLayout()`** - Calculates sizes and positions of all render objects
2. **`pipeline.flushNeedsCompositing()`** - Determines which objects need their own compositing layers  
3. **`pipeline.flushPaint()`** - Records drawing commands into `Picture` objects (via `PictureRecorder`)

**Key insight from PaintingContext** (painting-context.ts:119-125):
- When you call `context.canvas`, it starts recording with `PictureRecorder.begin()`
- Drawing commands go into a `Picture` object, **not directly to screen**
- At `stopRecordingIfNeeded()`, the recorder finishes and attaches the `Picture` to a `PictureLayer`

**`flushPaint()` creates Pictures, it doesn't rasterize them.**

### Phase 2: Compositing and Rasterizing

Only **after** all three flushes complete does rasterization happen:

1. Create a `LayerTree` from the root layer
2. Call `rasterizer.draw(tree, frameSize)` which **finally** draws the Pictures to the canvas

In `RenderCanvas.drawFrame()` (render-canvas.ts:136-154), this is done synchronously:

```typescript
private drawFrame = () => {
  this.pipeline.flushEnterFrame()
  
  if (!this.frameDirty) {
    return
  }
  
  this.pipeline.flushLayout()
  this.pipeline.flushNeedsCompositing()
  this.pipeline.flushPaint()
  
  this.frameDirty = false
  
  this.composeFrame()  // <- Immediately calls rasterizer.draw()
  this.dispatchFrameEnd()
}
```

### The frameDirty Flag

- **`frameDirty`** is set to `true` when any render object requests a visual update (render-canvas.ts:37-40)
- `flushEnterFrame()` runs **every frame regardless** of frameDirty (for animations like scrollbar fade)
- The three flush methods and `composeFrame()` only run when `frameDirty` is true
- After the three flushes complete, `frameDirty` is set back to `false` (render-canvas.ts:150)

### Correct Pattern for Manual Rendering

**No `requestAnimationFrame` delay is needed** between `flushPaint()` and `rasterizer.draw()`:

```typescript
// Flush the pipeline
pipeline.flushLayout()
pipeline.flushNeedsCompositing()
pipeline.flushPaint()

// Immediately compose - Picture recording is already complete
const tree = new LayerTree({ rootLayer: layerTree })
const frameSize = Size.scale({ width, height }, dpr)
rasterizer.draw(tree, frameSize)
```

The Picture recording completes **synchronously** during `flushPaint()`. No delay is needed.

### For WebXR Integration

When using XRPlatformAdapter with `XRSession.requestAnimationFrame()`:

1. The XR RAF callback provides proper frame timing
2. Call `flushEnterFrame()` every frame (for animations)
3. Check `frameDirty` flag - only render if true
4. Call the three flushes + `rasterizer.draw()` synchronously
5. No nested RAF needed - XR session already handles timing
