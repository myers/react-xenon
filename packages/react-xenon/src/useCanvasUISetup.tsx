import { RenderCanvas, SyntheticEventManager, PlatformAdapter } from '@canvas-ui/core'
import { HeadlessCanvas } from '@canvas-ui/react'
import { ReactNode, useRef, useState } from 'react'
import { BridgeEventBinding } from './BridgeEventBinding'

/**
 * Hook that sets up headless Canvas UI rendering with event bridge
 *
 * Returns:
 * - HeadlessCanvasElement: React element to render
 * - canvas: OffscreenCanvas instance
 * - renderCanvas: RenderCanvas instance
 * - binding: BridgeEventBinding for event injection
 */
export function useCanvasUISetup({
  width,
  height,
  dpr = 2,
  children
}: {
  width: number
  height: number
  dpr?: number
  children: ReactNode
}) {
  const canvasRef = useRef<OffscreenCanvas>()
  const renderCanvasRef = useRef<RenderCanvas>()
  const [binding, setBinding] = useState<BridgeEventBinding>()
  const [canvas, setCanvas] = useState<OffscreenCanvas>()
  const [renderCanvas, setRenderCanvas] = useState<RenderCanvas>()

  const handleReady = (canvas: OffscreenCanvas, renderCanvas: RenderCanvas) => {
    // Update state to trigger re-render
    setCanvas(canvas)
    setRenderCanvas(renderCanvas)

    // Create and wire BridgeEventBinding
    const bridgeBinding = new BridgeEventBinding()
    setBinding(bridgeBinding)

    // Wire to SyntheticEventManager
    const eventManager = SyntheticEventManager.findInstance(renderCanvas as any)
    if (eventManager) {
      eventManager.binding = bridgeBinding

      // Set onEvents callback to schedule frame (same as DOMEventBinding)
      bridgeBinding.onEvents = () => {
        PlatformAdapter.scheduleFrame()
      }
    } else {
      console.error('[useCanvasUISetup] No SyntheticEventManager found!')
    }
  }

  return {
    HeadlessCanvasElement: (
      <HeadlessCanvas
        width={width}
        height={height}
        dpr={dpr}
        canvasRef={canvasRef}
        renderCanvasRef={renderCanvasRef}
        onReady={handleReady}
      >
        {children}
      </HeadlessCanvas>
    ),
    canvas,
    renderCanvas,
    binding
  }
}
