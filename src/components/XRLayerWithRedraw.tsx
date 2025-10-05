import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { XRLayer, XRLayerProperties } from '@react-three/xr'
import { RenderCanvas } from '@canvas-ui/core'
import { dispatchPointerEvent, dispatchWheelEvent } from '../utils/canvasUIEvents'
import type { ThreeEvent } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'

export interface XRLayerWithRedrawHandle {
  requestRedraw: () => void
}

export interface XRLayerWithRedrawProps extends XRLayerProperties {
  renderCanvasRef?: React.RefObject<RenderCanvas | undefined>
  pixelWidth?: number
  pixelHeight?: number
}

/**
 * Wrapper around XRLayer that exposes requestRedraw() method
 * This allows Canvas UI to trigger texture updates when content changes
 *
 * For fallback mode (no XR layers support), updates texture.needsUpdate
 * For XR layers mode, calls layer.requestRedraw()
 *
 * Also handles XR/mouse pointer events and forwards them to Canvas UI
 */
export const XRLayerWithRedraw = forwardRef<XRLayerWithRedrawHandle, XRLayerWithRedrawProps>(
  ({ renderCanvasRef, pixelWidth = 900, pixelHeight = 600, ...props }, ref) => {
    const layerRef = useRef<{ mesh: any; layerEntry: any }>(null)
    const [lastPointerPos, setLastPointerPos] = useState<{ x: number; y: number } | null>(null)

    useImperativeHandle(ref, () => ({
      requestRedraw: () => {
        const layer = layerRef.current
        if (!layer) return

        // For XR layers mode: call layer.requestRedraw()
        if (layer.layerEntry?.layer) {
          layer.layerEntry.layer.requestRedraw()
        }

        // For fallback mode: update the texture
        const mesh = layer.mesh
        if (mesh) {
          const material = mesh.material as any
          if (material && material.map) {
            material.map.needsUpdate = true
          }
        }
      }
    }))

    // Convert UV coordinates (0-1) to canvas pixel coordinates
    const uvToPixels = (uv: { x: number; y: number }) => ({
      x: uv.x * pixelWidth,
      y: (1 - uv.y) * pixelHeight, // Flip Y axis
    })

    // Handle pointer move - track position and dispatch to Canvas UI
    const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
      if (!renderCanvasRef?.current || !event.uv) return

      const { x, y } = uvToPixels(event.uv)
      setLastPointerPos({ x, y })

      dispatchPointerEvent(renderCanvasRef.current, 'pointermove', x, y, event.button, event.pointerId)
    }

    // Handle pointer down
    const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
      if (!renderCanvasRef?.current || !event.uv) return

      const { x, y } = uvToPixels(event.uv)
      dispatchPointerEvent(renderCanvasRef.current, 'pointerdown', x, y, event.button, event.pointerId)
    }

    // Handle pointer up
    const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
      if (!renderCanvasRef?.current || !event.uv) return

      const { x, y } = uvToPixels(event.uv)
      dispatchPointerEvent(renderCanvasRef.current, 'pointerup', x, y, event.button, event.pointerId)
    }

    // Handle pointer enter
    const handlePointerEnter = (event: ThreeEvent<PointerEvent>) => {
      if (!renderCanvasRef?.current || !event.uv) return

      const { x, y } = uvToPixels(event.uv)
      setLastPointerPos({ x, y })
      dispatchPointerEvent(renderCanvasRef.current, 'pointerenter', x, y, event.button, event.pointerId)
    }

    // Handle pointer leave
    const handlePointerLeave = (event: ThreeEvent<PointerEvent>) => {
      if (!renderCanvasRef?.current) return

      // Use last known position for leave event
      if (lastPointerPos) {
        dispatchPointerEvent(
          renderCanvasRef.current,
          'pointerleave',
          lastPointerPos.x,
          lastPointerPos.y,
          event.button,
          event.pointerId
        )
      }
      setLastPointerPos(null)
    }

    // XR controller input handling
    useFrame((state) => {
      if (!renderCanvasRef?.current || !lastPointerPos) return

      const session = state.gl.xr.getSession()
      if (!session) return

      // Check right controller for thumbstick scroll
      for (const source of session.inputSources) {
        if (source.handedness === 'right' && source.gamepad) {
          // Right thumbstick Y-axis (axes[3]) for scrolling
          const thumbstickY = source.gamepad.axes[3] || 0

          // Apply deadzone and scroll
          if (Math.abs(thumbstickY) > 0.1) {
            const scrollSensitivity = 20 // Adjust as needed
            dispatchWheelEvent(
              renderCanvasRef.current,
              lastPointerPos.x,
              lastPointerPos.y,
              0, // deltaX
              thumbstickY * scrollSensitivity // deltaY
            )
          }
        }
      }
    })

    const handleClick = (event: ThreeEvent<MouseEvent>) => {
      if (!renderCanvasRef?.current || !event.uv) return

      const { x, y } = uvToPixels(event.uv)

      // Simulate full click sequence
      dispatchPointerEvent(renderCanvasRef.current, 'pointerdown', x, y, 0, 0)
      dispatchPointerEvent(renderCanvasRef.current, 'pointerup', x, y, 0, 0)
    }

    return (
      <XRLayer
        ref={layerRef}
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        {...props}
      />
    )
  }
)

XRLayerWithRedraw.displayName = 'XRLayerWithRedraw'
