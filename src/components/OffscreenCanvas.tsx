import { createElement, Surface, Rasterizer, LayerTree, Size } from '@canvas-ui/core'
import { useBinding } from '@canvas-ui/react'
import { ReactNode, RefObject, useLayoutEffect, useState } from 'react'

export interface OffscreenCanvasProps {
  width: number
  height: number
  dpr?: number
  children: ReactNode
  canvasRef?: RefObject<OffscreenCanvas | undefined>
  onReady?: () => void
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
}: OffscreenCanvasProps) {
  const [binding] = useState(() => {
    console.log('[OffscreenCanvas] Creating RenderCanvas')
    const renderCanvas = createElement('Canvas')

    // Step 1: prepareInitialFrame FIRST (like normal <Canvas>)
    renderCanvas.prepareInitialFrame()

    // Step 2: Create OffscreenCanvasSurface with canvasRef
    const surface = Surface.makeOffscreenCanvasSurface({ canvasRef })

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

  // Manually trigger initial frame render to populate canvasRef
  useLayoutEffect(() => {
    // Need to wait for next frame after React reconciler runs
    requestAnimationFrame(() => {
      const layerTree = (binding as any)._layer
      const rasterizer = (binding as any)._rasterizer
      if (layerTree && rasterizer) {
        console.log('[OffscreenCanvas] Manually triggering initial frame')
        const tree = new LayerTree({ rootLayer: layerTree })
        const frameSize = Size.scale({ width, height }, dpr)
        rasterizer.draw(tree, frameSize)
        console.log('[OffscreenCanvas] Initial frame complete')
      }
    })
  }, [binding, width, height, dpr])

  // Like <Canvas>'s Binding component - returns null (headless)
  return null
}
