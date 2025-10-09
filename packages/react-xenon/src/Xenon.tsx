import { ReactNode, useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { XRLayer, XRLayerProperties } from '@react-three/xr'
import { Mesh, Vector2, CanvasTexture, SRGBColorSpace, WebGLRenderTarget } from 'three'
import { ThreeEvent, RootState } from '@react-three/fiber'
import { HeadlessCanvas, InjectEventFn, InjectWheelEventFn } from '@canvas-ui/react'
import { RenderCanvas } from '@canvas-ui/core'

export interface XenonProps extends Omit<XRLayerProperties, 'src' | 'children'> {
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
 * Xenon component for WebXR rendering
 *
 * Renders Canvas UI to an OffscreenCanvas and displays it on an XRLayer
 * Uses BridgeEventBinding for clean event handling with automatic hover generation
 *
 * Example:
 * ```tsx
 * <Xenon position={[0, 0, -1]} pixelWidth={1024} pixelHeight={1024}>
 *   <Flex style={{ padding: 20 }}>
 *     <Text>Hello WebXR!</Text>
 *   </Flex>
 * </Xenon>
 * ```
 */
export function Xenon({
  pixelWidth = 1024,
  pixelHeight = 1024,
  dpr = 2,
  children,
  enableJoystickScroll = true,
  scrollSensitivity = 50,
  ...xrLayerProps
}: XenonProps) {
  const meshRef = useRef<Mesh>(null)
  const lastPointerPosRef = useRef(new Vector2())

  // Create OffscreenCanvas
  const canvas = useMemo(
    () => new OffscreenCanvas(pixelWidth * dpr, pixelHeight * dpr),
    [pixelWidth, pixelHeight, dpr]
  )

  // Store event injection functions and renderCanvas
  const [injectEvent, setInjectEvent] = useState<InjectEventFn | null>(null)
  const [injectWheelEvent, setInjectWheelEvent] = useState<InjectWheelEventFn | null>(null)
  const [renderCanvas, setRenderCanvas] = useState<RenderCanvas | null>(null)

  // Create CanvasTexture
  const canvasTexture = useMemo(() => {
    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    // flipY defaults to true, which correctly flips canvas (top-left origin) to WebGL UV space (bottom-left origin)
    return texture
  }, [canvas])

  // Listen to frameEnd event to mark texture as needing update
  // Canvas UI automatically fires frameEnd after rendering (including initial render)
  useEffect(() => {
    if (!renderCanvas || !canvasTexture) return

    const handleFrameEnd = () => {
      // Mark texture for update when Canvas UI renders
      canvasTexture.needsUpdate = true
    }

    renderCanvas.addEventListener('frameEnd', handleFrameEnd)

    return () => {
      renderCanvas.removeEventListener('frameEnd', handleFrameEnd)
    }
  }, [renderCanvas, canvasTexture])

  // Handle pointer events from XR - convert UV to pixel coords and inject
  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!injectEvent) return

    const uv = e.uv
    if (!uv) return

    // Convert UV (0-1) to pixel coordinates
    const x = uv.x * pixelWidth
    const y = (1 - uv.y) * pixelHeight // Flip Y because UV origin is bottom-left

    lastPointerPosRef.current.set(x, y)

    injectEvent('pointerdown', x, y, e.nativeEvent.button, e.nativeEvent.pointerId ?? 0)
  }, [injectEvent, pixelWidth, pixelHeight])

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!injectEvent) return

    const uv = e.uv
    if (!uv) return

    const x = uv.x * pixelWidth
    const y = (1 - uv.y) * pixelHeight

    injectEvent('pointerup', x, y, e.nativeEvent.button, e.nativeEvent.pointerId ?? 0)
  }, [injectEvent, pixelWidth, pixelHeight])

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!injectEvent) return

    const uv = e.uv
    if (!uv) return

    const x = uv.x * pixelWidth
    const y = (1 - uv.y) * pixelHeight

    lastPointerPosRef.current.set(x, y)

    injectEvent('pointermove', x, y, e.nativeEvent.button, e.nativeEvent.pointerId ?? 0)
  }, [injectEvent, pixelWidth, pixelHeight])

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!injectEvent) return

    const uv = e.uv
    if (!uv) return

    const x = uv.x * pixelWidth
    const y = (1 - uv.y) * pixelHeight

    lastPointerPosRef.current.set(x, y)

    // Note: We don't inject 'pointerover' - Canvas UI's SyntheticEventManager
    // automatically generates pointerenter/pointerleave from pointermove
    // But we do need to inject an initial move to establish hover state
    injectEvent('pointermove', x, y, 0, e.nativeEvent.pointerId ?? 0)
  }, [injectEvent, pixelWidth, pixelHeight])

  const handlePointerLeave = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!injectEvent) return

    const x = lastPointerPosRef.current.x
    const y = lastPointerPosRef.current.y

    // Inject pointerleave to clear hover state
    injectEvent('pointerleave', x, y, 0, e.nativeEvent.pointerId ?? 0)
  }, [injectEvent])

  // Handle XR controller joystick for scrolling
  useEffect(() => {
    if (!enableJoystickScroll || !injectWheelEvent || !meshRef.current) return

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

              // Inject wheel event for scrolling
              injectWheelEvent(
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
  }, [enableJoystickScroll, injectWheelEvent, scrollSensitivity])

  // Custom render function to copy OffscreenCanvas to XRLayer render target
  const customRender = useCallback((renderTarget: WebGLRenderTarget, state: RootState) => {
    // Copy canvas texture to XRLayer render target
    state.gl.copyTextureToTexture(
      canvasTexture,
      renderTarget.texture,
      null,
      new Vector2(0, 0),
      0
    )
  }, [canvasTexture])

  return (
    <>
      <HeadlessCanvas
        canvas={canvas}
        width={pixelWidth}
        height={pixelHeight}
        dpr={dpr}
        onReady={({ injectEvent, injectWheelEvent, renderCanvas: rc }) => {
          setInjectEvent(() => injectEvent)
          setInjectWheelEvent(() => injectWheelEvent)
          setRenderCanvas(rc)
        }}
      >
        {children}
      </HeadlessCanvas>
      <XRLayer
        ref={meshRef}
        customRender={customRender}
        pixelWidth={pixelWidth}
        pixelHeight={pixelHeight}
        dpr={dpr}
        {...xrLayerProps}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerOver={handlePointerOver}
        onPointerLeave={handlePointerLeave}
      >
        {/* Empty fragment needed to trigger customRender path */}
        <></>
      </XRLayer>
    </>
  )
}
