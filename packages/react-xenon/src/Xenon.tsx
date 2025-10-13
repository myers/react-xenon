import { ReactNode, useRef, useState, useMemo, useCallback } from 'react'
import { XRLayer, XRLayerProperties } from '@react-three/xr'
import { Mesh, Vector2, CanvasTexture, SRGBColorSpace, WebGLRenderTarget, LinearFilter } from 'three'
import { ThreeEvent, RootState, useFrame } from '@react-three/fiber'
import { HeadlessCanvas, InjectEventFn, InjectWheelEventFn } from '@canvas-ui/react'
import { XRPlatformAdapter } from './XRPlatformAdapter'
import { XenonContext } from './XenonContext'

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

  // Create XRPlatformAdapter for XR-aware rendering
  const [xrAdapter] = useState(() => new XRPlatformAdapter())

  // Create OffscreenCanvas
  const canvas = useMemo(
    () => new OffscreenCanvas(pixelWidth * dpr, pixelHeight * dpr),
    [pixelWidth, pixelHeight, dpr]
  )

  // Store event injection functions
  const [injectEvent, setInjectEvent] = useState<InjectEventFn | null>(null)
  const [injectWheelEvent, setInjectWheelEvent] = useState<InjectWheelEventFn | null>(null)

  // Track when Canvas UI has rendered and texture needs copying
  const shouldCopyTextureRef = useRef(false)

  // Handle frameEnd callback from Canvas UI
  const handleFrameEnd = useCallback(() => {
    shouldCopyTextureRef.current = true
  }, [])

  // Handle pointer events from XR - convert UV to pixel coords and inject
  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!injectEvent) return

    const uv = e.uv
    if (!uv) return

    // Convert UV (0-1) to pixel coordinates
    // Mesh has negative Y scale which flips UV, so map directly to canvas pixels
    const x = uv.x * pixelWidth
    const y = uv.y * pixelHeight

    lastPointerPosRef.current.set(x, y)

    injectEvent('pointerdown', x, y, e.nativeEvent.button, e.nativeEvent.pointerId ?? 0)
  }, [injectEvent, pixelWidth, pixelHeight])

  const handlePointerUp = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!injectEvent) return

    const uv = e.uv
    if (!uv) return

    const x = uv.x * pixelWidth
    const y = uv.y * pixelHeight

    injectEvent('pointerup', x, y, e.nativeEvent.button, e.nativeEvent.pointerId ?? 0)
  }, [injectEvent, pixelWidth, pixelHeight])

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!injectEvent) return

    const uv = e.uv
    if (!uv) return

    const x = uv.x * pixelWidth
    const y = uv.y * pixelHeight

    lastPointerPosRef.current.set(x, y)

    injectEvent('pointermove', x, y, e.nativeEvent.button, e.nativeEvent.pointerId ?? 0)
  }, [injectEvent, pixelWidth, pixelHeight])

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!injectEvent) return

    const uv = e.uv
    if (!uv) return

    const x = uv.x * pixelWidth
    const y = uv.y * pixelHeight

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

  // Handle XR controller joystick for scrolling using useFrame for proper XR loop integration
  useFrame((state) => {
    if (!enableJoystickScroll || !injectWheelEvent) return

    // Access XR session from renderer
    const session = state.gl.xr.getSession()
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
  })

  // Ref to store canvas texture (created in customRender closure)
  const canvasTextureRef = useRef<CanvasTexture | null>(null)

  // Custom render function to copy OffscreenCanvas to XRLayer render target
  const customRender = useMemo(() => {
    return (renderTarget: WebGLRenderTarget, state: RootState) => {
      // Create CanvasTexture on first render
      if (!canvasTextureRef.current) {
        canvasTextureRef.current = new CanvasTexture(canvas)
        canvasTextureRef.current.colorSpace = SRGBColorSpace
        canvasTextureRef.current.flipY = false
      }

      const canvasTexture = canvasTextureRef.current
      const timestamp = state.clock.elapsedTime * 1000

      // Execute Canvas UI frame - this runs the render pipeline if frameDirty is true
      xrAdapter.executeFrame(timestamp)

      // Only copy texture if Canvas UI has rendered (frameEnd event fired)
      if (shouldCopyTextureRef.current) {
        state.gl.copyTextureToTexture(
          canvasTexture,
          renderTarget.texture,
          null,
          new Vector2(0, 0),
          0
        )
        shouldCopyTextureRef.current = false
      }
    }
  }, [canvas, xrAdapter])

  // Apply Y-flip via mesh scale since copyTextureToTexture doesn't respect texture.flipY
  const finalScale = useMemo(() => {
    if (xrLayerProps.scale) {
      // If user provided scale, apply Y-flip to it
      if (Array.isArray(xrLayerProps.scale)) {
        return [xrLayerProps.scale[0], -Math.abs(xrLayerProps.scale[1]), xrLayerProps.scale[2]]
      }
      // If scale is a number, apply to all axes but flip Y
      return [xrLayerProps.scale, -xrLayerProps.scale, xrLayerProps.scale]
    }
    // Default: flip Y to correct canvas orientation
    return [1, -1, 1]
  }, [xrLayerProps.scale])

  return (
    <>
      <HeadlessCanvas
        canvas={canvas}
        width={pixelWidth}
        height={pixelHeight}
        dpr={dpr}
        platformAdapter={xrAdapter}
        onReady={({ injectEvent, injectWheelEvent }) => {
          setInjectEvent(() => injectEvent)
          setInjectWheelEvent(() => injectWheelEvent)
        }}
        onFrameEnd={handleFrameEnd}
      >
        <XenonContext.Provider value={{ xrAdapter }}>
          {children}
        </XenonContext.Provider>
      </HeadlessCanvas>
      <XRLayer
        ref={meshRef}
        customRender={customRender}
        pixelWidth={pixelWidth}
        pixelHeight={pixelHeight}
        dpr={dpr}
        {...xrLayerProps}
        scale={finalScale}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerOver={handlePointerOver}
        onPointerLeave={handlePointerLeave}
      />
    </>
  )
}
