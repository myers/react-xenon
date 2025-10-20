import type { IPlatformAdapter, FrameCallback, CrossPlatformCanvasElement, CrossPlatformOffscreenCanvas } from '@canvas-ui/core'

/**
 * Platform adapter for WebXR that integrates with React Three Fiber's render loop
 *
 * Unlike WebPlatformAdapter which uses requestAnimationFrame (paused in XR foreground),
 * this adapter is driven externally via executeFrame() called from R3F's useFrame hook.
 *
 * This ensures Canvas UI renders in sync with the XR session's frame loop.
 */
export class XRPlatformAdapter implements IPlatformAdapter {
  private onFrameCallbacks: FrameCallback[] = []
  private debugFrameCount = 0  // Track frames for debug logging

  readonly supportOffscreenCanvas = typeof OffscreenCanvas !== 'undefined'

  /**
   * Register a callback to run on each frame
   * Canvas UI calls this in RenderCanvas constructor
   */
  onFrame(callback: FrameCallback): () => void {
    console.log('[XRPlatformAdapter] Registering callback:', callback.name || 'anonymous')
    this.onFrameCallbacks.push(callback)
    console.log('[XRPlatformAdapter] Total callbacks:', this.onFrameCallbacks.length)
    return () => {
      console.log('[XRPlatformAdapter] Unregistering callback')
      this.onFrameCallbacks = this.onFrameCallbacks.filter(it => it !== callback)
    }
  }

  /**
   * Mark that a frame is needed
   * In WebPlatformAdapter this calls requestAnimationFrame
   * In XR mode, we ignore this - frames run every frame anyway
   */
  scheduleFrame(): void {
    // No-op in XR mode - frames run continuously via executeFrame()
    // Canvas UI's internal frameDirty flag prevents unnecessary work
  }

  /**
   * Execute pending frame callbacks
   * Called from React Three Fiber's useFrame or XRLayer customRender
   *
   * @param timestamp - Frame timestamp in milliseconds
   */
  executeFrame(timestamp: number): void {
    const shouldLog = this.debugFrameCount < 5

    if (shouldLog) {
      console.log('[XRPlatformAdapter] executeFrame called, timestamp:', timestamp, 'callbacks:', this.onFrameCallbacks.length, 'frame:', this.debugFrameCount)
    }

    // In XR mode, always run callbacks - Canvas UI's frameDirty flag handles skipping
    if (this.onFrameCallbacks.length > 0) {
      // Call all registered callbacks (drawFrame, handleNativeEvents, etc.)
      this.onFrameCallbacks.forEach((callback, i) => {
        if (shouldLog) {
          console.log(`[XRPlatformAdapter] Calling callback ${i}:`, callback.name || 'anonymous')
        }
        callback(timestamp)
      })
    }

    this.debugFrameCount++
  }

  // Canvas creation methods - delegate to browser APIs
  createCanvas(width: number, height: number): CrossPlatformCanvasElement {
    const canvas = document.createElement('canvas')
    this.resizeCanvas(canvas, width, height)
    return canvas
  }

  createOffscreenCanvas(width: number, height: number): CrossPlatformOffscreenCanvas {
    return new OffscreenCanvas(Math.round(width), Math.round(height))
  }

  createRenderingContext(width: number, height: number): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null {
    if (this.supportOffscreenCanvas) {
      return this.createOffscreenCanvas(width, height).getContext('2d')
    }
    return this.createCanvas(width, height).getContext('2d')
  }

  resizeCanvas(el: CrossPlatformCanvasElement | CrossPlatformOffscreenCanvas, width: number, height: number): void {
    el.width = Math.round(width)
    el.height = Math.round(height)
  }
}
