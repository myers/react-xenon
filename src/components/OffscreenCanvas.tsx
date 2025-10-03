import { createElement, Surface, Rasterizer, LayerTree, Size } from '@canvas-ui/core'
import { useBinding } from '@canvas-ui/react'
import { ReactNode, RefObject, useLayoutEffect, useRef, useState } from 'react'

export interface FrameInfo {
  canvas: OffscreenCanvas
  frameNumber: number
  timestamp: number
}

export interface OffscreenCanvasProps {
  width: number
  height: number
  dpr?: number
  children: ReactNode
  canvasRef?: RefObject<OffscreenCanvas | undefined>
  onReady?: () => void
  onFrameRendered?: (info: FrameInfo) => void
}

/**
 * Headless Canvas UI component that renders to OffscreenCanvas
 * Similar to <Canvas> but without DOM mounting - suitable for WebXR layers
 */
export function OffscreenCanvas({
  width,
  height,
  dpr = 2,
  children,
  canvasRef,
  onReady,
  onFrameRendered,
}: OffscreenCanvasProps) {
  const frameNumberRef = useRef(0)

  const surfaceRef = useRef<any>(null)

  const [binding] = useState(() => {
    console.log('[OffscreenCanvas] Creating RenderCanvas')
    const renderCanvas = createElement('Canvas')

    // Step 1: prepareInitialFrame FIRST (like normal <Canvas>)
    renderCanvas.prepareInitialFrame()

    // Step 2: Create OffscreenCanvasSurface with canvasRef
    const surface = Surface.makeOffscreenCanvasSurface({ canvasRef })
    surfaceRef.current = surface

    // Step 3: Manually set _surface (bypass el requirement)
    ;(renderCanvas as any)._surface = surface

    // Step 4: Create and set _rasterizer
    const rasterizer = new Rasterizer({ surface })
    ;(renderCanvas as any)._rasterizer = rasterizer

    console.log('[OffscreenCanvas] RenderCanvas created and configured')
    return renderCanvas
  })

  // Configure size and dpr
  useLayoutEffect(() => {
    console.log('[OffscreenCanvas] Setting size and dpr', { width, height, dpr })
    binding.dpr = dpr
    binding.size = { width, height }
    console.log('[OffscreenCanvas] After setting size, canvasRef.current:', canvasRef?.current)
  }, [binding, width, height, dpr])

  // Use Canvas UI's binding hook to connect React reconciler
  useBinding({
    binding,
    left: 0,
    top: 0,
    width,
    height,
    onReady,
    children,
  })

  // Manually trigger rendering after each React update
  useLayoutEffect(() => {
    // Trigger render after React reconciler has updated the Canvas UI tree
    const renderFrame = () => {
      const pipeline = (binding as any).pipeline
      const layerTree = (binding as any)._layer
      const rasterizer = (binding as any)._rasterizer

      if (layerTree && rasterizer && pipeline) {
        // Flush the pipeline like drawFrame() does
        pipeline.flushLayout()
        pipeline.flushNeedsCompositing()
        pipeline.flushPaint()

        // Schedule drawing for next frame to ensure paint has completed
        requestAnimationFrame(() => {
          // Now draw to the OffscreenCanvas
          const tree = new LayerTree({ rootLayer: layerTree })
          const frameSize = Size.scale({ width, height }, dpr)
          rasterizer.draw(tree, frameSize)

          // Call onFrameRendered callback if provided
          if (onFrameRendered) {
            // Try to get canvas from ref first, then from surface
            let canvas = canvasRef?.current
            if (!canvas && surfaceRef.current) {
              try {
                canvas = surfaceRef.current.canvas
              } catch (e) {
                // Canvas not ready yet
              }
            }

            if (canvas) {
              frameNumberRef.current += 1
              onFrameRendered({
                canvas,
                frameNumber: frameNumberRef.current,
                timestamp: performance.now()
              })
            }
          }
        })
      }
    }

    // Delay to ensure React reconciler has finished
    requestAnimationFrame(renderFrame)
  }) // No dependencies - run after every render

  // Like <Canvas>'s Binding component - returns null (headless)
  return null
}
