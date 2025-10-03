import { createElement, RenderCanvas, Point } from '@canvas-ui/core'
import { useEffect, useLayoutEffect, useMemo, useRef, ReactNode } from 'react'
import { render } from '@canvas-ui/react'

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
  const renderCanvasRef = useRef<RenderCanvas>()
  const offscreenCanvasRef = useRef<OffscreenCanvas>()
  const rootViewRef = useRef(createElement('View'))

  // Create the OffscreenCanvas and RenderCanvas
  const setup = useMemo(() => {
    console.log('Setting up OffscreenCanvas with Canvas UI:', { width, height, dpr })

    // Create OffscreenCanvas
    const offscreenCanvas = new OffscreenCanvas(width * dpr, height * dpr)
    offscreenCanvasRef.current = offscreenCanvas
    console.log('Created OffscreenCanvas:', offscreenCanvas)

    // Create RenderCanvas (the root of Canvas UI's render tree)
    const renderCanvas = createElement('Canvas')

    // IMPORTANT: Do NOT set renderCanvas.el with OffscreenCanvas!
    // This would trigger DOMEventBinding which expects HTMLElement
    // Instead, we'll manually dispatch events later

    renderCanvas.dpr = dpr
    renderCanvas.size = { width, height }
    renderCanvas.prepareInitialFrame()
    console.log('Created RenderCanvas (without el binding)')

    renderCanvasRef.current = renderCanvas

    return { offscreenCanvas, renderCanvas }
  }, []) // Only create once

  // Update size and dpr when props change
  useLayoutEffect(() => {
    if (!renderCanvasRef.current || !offscreenCanvasRef.current) return

    offscreenCanvasRef.current.width = width * dpr
    offscreenCanvasRef.current.height = height * dpr
    renderCanvasRef.current.size = { width, height }
    renderCanvasRef.current.dpr = dpr
  }, [width, height, dpr])

  // Mount the root view to the render canvas
  useLayoutEffect(() => {
    if (!renderCanvasRef.current) return

    renderCanvasRef.current.child = rootViewRef.current
    return () => {
      if (renderCanvasRef.current) {
        renderCanvasRef.current.child = undefined
      }
    }
  }, [])

  // Render React children to the root view
  useLayoutEffect(() => {
    render(children, rootViewRef.current)
  }, [children])

  // Call onReady when setup is complete
  useEffect(() => {
    if (setup.offscreenCanvas && setup.renderCanvas) {
      onReady?.(setup.offscreenCanvas, setup.renderCanvas)
    }
  }, [setup, onReady])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      renderCanvasRef.current?.dispose()
    }
  }, [])

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
