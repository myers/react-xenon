import { createElement, RenderCanvas, Point } from '@canvas-ui/core'
import { useEffect, useLayoutEffect, useState, useRef, ReactNode } from 'react'
import { useBinding } from '@canvas-ui/react'

export interface CanvasUIOffscreenRendererProps {
  width: number
  height: number
  dpr?: number
  children: ReactNode
  onReady?: (canvas: OffscreenCanvas, renderCanvas: RenderCanvas) => void
}

/**
 * Renders Canvas UI to an OffscreenCanvas without DOM mounting.
 * Returns the OffscreenCanvas that can be used as XRLayer src.
 */
export function CanvasUIOffscreenRenderer({
  width,
  height,
  dpr = 1,
  children,
  onReady,
}: CanvasUIOffscreenRendererProps) {
  const onReadyCalledRef = useRef(false)

  // Initialize OffscreenCanvas and RenderCanvas once using useState
  const [instances] = useState(() => {
    console.log('Setting up OffscreenCanvas with Canvas UI:', { width, height, dpr })

    // Create OffscreenCanvas
    const offscreenCanvas = new OffscreenCanvas(width * dpr, height * dpr)
    console.log('Created OffscreenCanvas:', offscreenCanvas)

    // Create RenderCanvas with the OffscreenCanvas (IMPORTANT: pass canvas as 2nd arg)
    const renderCanvas = createElement('Canvas', offscreenCanvas)
    renderCanvas.prepareInitialFrame()
    renderCanvas.dpr = dpr
    renderCanvas.size = { width, height }

    console.log('Created RenderCanvas (without el binding)')

    return { offscreenCanvas, renderCanvas }
  })

  const { offscreenCanvas, renderCanvas } = instances

  // Update size and dpr when props change
  useLayoutEffect(() => {
    offscreenCanvas.width = width * dpr
    offscreenCanvas.height = height * dpr
    renderCanvas.size = { width, height }
    renderCanvas.dpr = dpr
  }, [renderCanvas, offscreenCanvas, width, height, dpr])

  // Call onReady when ready
  useLayoutEffect(() => {
    if (onReady && !onReadyCalledRef.current) {
      onReady(offscreenCanvas, renderCanvas)
      onReadyCalledRef.current = true
    }
  }, [onReady, offscreenCanvas, renderCanvas])

  // Use Canvas UI's binding hook for React reconciliation
  useBinding({
    binding: renderCanvas,
    left: 0,
    top: 0,
    width,
    height,
    children
  })

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      renderCanvas.dispose()
    }
  }, [renderCanvas])

  return null // This component doesn't render to DOM
}

/**
 * Hook to use Canvas UI with OffscreenCanvas.
 * Returns the OffscreenCanvas and methods to dispatch events.
 */
export function useCanvasUIOffscreen(width: number, height: number, dpr = 1) {
  const offscreenCanvasRef = useRef<OffscreenCanvas>()
  const renderCanvasRef = useRef<RenderCanvas>()

  const handleReady = (canvas: OffscreenCanvas, renderCanvas: RenderCanvas) => {
    offscreenCanvasRef.current = canvas
    renderCanvasRef.current = renderCanvas
  }

  const dispatchPointerEvent = (
    type: 'pointerdown' | 'pointerup' | 'pointermove' | 'pointerover' | 'pointerleave',
    x: number,
    y: number,
    button?: number
  ) => {
    if (!renderCanvasRef.current) return

    const position = Point.fromXY(x, y)
    const hitResult = renderCanvasRef.current.hitTestFromRoot(position)

    if (!hitResult.path.length) return

    const syntheticEvent = {
      type,
      nativeEvent: {
        timeStamp: performance.now(),
        button: button ?? 0
      },
      bubbles: true,
      cancelable: true,
      path: hitResult.path.map(entry => entry.target),
      target: hitResult.path[0].target,
    }

    renderCanvasRef.current.dispatchEvent(syntheticEvent as any)
  }

  const dispatchWheelEvent = (x: number, y: number, deltaX: number, deltaY: number) => {
    if (!renderCanvasRef.current) return

    const position = Point.fromXY(x, y)
    const hitResult = renderCanvasRef.current.hitTestFromRoot(position)

    if (!hitResult.path.length) return

    const syntheticEvent = {
      type: 'wheel',
      nativeEvent: {
        timeStamp: performance.now(),
        deltaMode: 0,
        deltaX,
        deltaY,
      },
      bubbles: true,
      cancelable: true,
      path: hitResult.path.map(entry => entry.target),
      target: hitResult.path[0].target,
    }

    renderCanvasRef.current.dispatchEvent(syntheticEvent as any)
  }

  return {
    offscreenCanvas: offscreenCanvasRef.current,
    renderCanvas: renderCanvasRef.current,
    handleReady,
    dispatchPointerEvent,
    dispatchWheelEvent,
  }
}
