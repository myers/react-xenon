import { ReactNode, useRef, useState, useEffect } from 'react'
import { XRLayer, XRLayerProperties } from '@react-three/xr'
import { RenderCanvas } from '@canvas-ui/core'
import { Mesh, Vector2 } from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { CanvasUIOffscreenRenderer, useCanvasUIOffscreen } from './CanvasUIOffscreenRenderer'

export interface XRCanvasUILayerProps extends Omit<XRLayerProperties, 'src' | 'children'> {
  /** Width of the canvas in pixels */
  pixelWidth?: number
  /** Height of the canvas in pixels */
  pixelHeight?: number
  /** Device pixel ratio for the canvas */
  dpr?: number
  /** Canvas UI content to render */
  children: ReactNode
  /** Whether to enable scroll from XR controller joystick */
  enableJoystickScroll?: boolean
  /** Scroll sensitivity multiplier */
  scrollSensitivity?: number
}

/**
 * XR Layer that renders Canvas UI content and forwards pointer/controller events.
 *
 * Example:
 * ```tsx
 * <XRCanvasUILayer position={[0, 0, -1]} pixelWidth={1024} pixelHeight={1024}>
 *   <Flex style={{ padding: 20 }}>
 *     <Text>Hello WebXR!</Text>
 *   </Flex>
 * </XRCanvasUILayer>
 * ```
 */
export function XRCanvasUILayer({
  pixelWidth = 1024,
  pixelHeight = 1024,
  dpr = 1,
  children,
  enableJoystickScroll = true,
  scrollSensitivity = 50,
  ...xrLayerProps
}: XRCanvasUILayerProps) {
  const meshRef = useRef<Mesh>(null)
  const [isReady, setIsReady] = useState(false)

  const {
    offscreenCanvas,
    renderCanvas,
    handleReady,
    dispatchPointerEvent,
    dispatchWheelEvent,
  } = useCanvasUIOffscreen(pixelWidth, pixelHeight, dpr)

  // Track pointer state for click detection
  const pointerDownRef = useRef(false)
  const lastPointerPosRef = useRef(new Vector2())

  // Handle pointer events from XR
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!renderCanvas) return

    const uv = e.uv
    if (!uv) return

    // Convert UV (0-1) to pixel coordinates
    const x = uv.x * pixelWidth
    const y = (1 - uv.y) * pixelHeight // Flip Y because UV origin is bottom-left

    pointerDownRef.current = true
    lastPointerPosRef.current.set(x, y)

    dispatchPointerEvent('pointerdown', x, y, e.nativeEvent.button)
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!renderCanvas) return

    const uv = e.uv
    if (!uv) return

    const x = uv.x * pixelWidth
    const y = (1 - uv.y) * pixelHeight

    dispatchPointerEvent('pointerup', x, y, e.nativeEvent.button)

    // If pointer didn't move much, it's a click
    if (pointerDownRef.current) {
      const dist = lastPointerPosRef.current.distanceTo(new Vector2(x, y))
      if (dist < 5) { // 5px threshold
        // Canvas UI will handle click through pointerdown+pointerup
      }
    }

    pointerDownRef.current = false
  }

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!renderCanvas) return

    const uv = e.uv
    if (!uv) return

    const x = uv.x * pixelWidth
    const y = (1 - uv.y) * pixelHeight

    lastPointerPosRef.current.set(x, y)
    dispatchPointerEvent('pointermove', x, y)
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (!renderCanvas) return

    const uv = e.uv
    if (!uv) return

    const x = uv.x * pixelWidth
    const y = (1 - uv.y) * pixelHeight

    dispatchPointerEvent('pointerover', x, y)
  }

  const handlePointerLeave = () => {
    if (!renderCanvas) return

    const x = lastPointerPosRef.current.x
    const y = lastPointerPosRef.current.y

    dispatchPointerEvent('pointerleave', x, y)
    pointerDownRef.current = false
  }

  // Handle XR controller joystick for scrolling
  useEffect(() => {
    if (!enableJoystickScroll || !renderCanvas) return

    let animationFrameId: number

    const checkJoystick = () => {
      // Access XR controller gamepad
      const session = (meshRef.current as any)?.xr?.getSession?.()
      if (session?.inputSources) {
        for (const inputSource of session.inputSources) {
          if (inputSource.gamepad?.axes) {
            // axes[2] and axes[3] are typically the thumbstick
            const deltaX = inputSource.gamepad.axes[2] || 0
            const deltaY = inputSource.gamepad.axes[3] || 0

            // Apply deadzone
            const deadzone = 0.1
            if (Math.abs(deltaX) > deadzone || Math.abs(deltaY) > deadzone) {
              const x = lastPointerPosRef.current.x
              const y = lastPointerPosRef.current.y

              dispatchWheelEvent(
                x,
                y,
                deltaX * scrollSensitivity,
                -deltaY * scrollSensitivity // Invert Y for natural scrolling
              )
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(checkJoystick)
    }

    checkJoystick()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [enableJoystickScroll, renderCanvas, dispatchWheelEvent, scrollSensitivity])

  return (
    <>
      {/* Render Canvas UI to OffscreenCanvas */}
      <CanvasUIOffscreenRenderer
        width={pixelWidth}
        height={pixelHeight}
        dpr={dpr}
        onReady={(canvas, rc) => {
          handleReady(canvas, rc)
          setIsReady(true)
        }}
      >
        {children}
      </CanvasUIOffscreenRenderer>

      {/* Render XRLayer with the OffscreenCanvas */}
      {isReady && offscreenCanvas && (
        <XRLayer
          ref={meshRef}
          src={offscreenCanvas}
          pixelWidth={pixelWidth}
          pixelHeight={pixelHeight}
          dpr={dpr}
          {...xrLayerProps}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerOver={handlePointerOver}
          onPointerLeave={handlePointerLeave}
        />
      )}
    </>
  )
}
