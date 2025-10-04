import { forwardRef, useImperativeHandle, useRef } from 'react'
import { XRLayer, XRLayerProperties } from '@react-three/xr'

export interface XRLayerWithRedrawHandle {
  requestRedraw: () => void
}

/**
 * Wrapper around XRLayer that exposes requestRedraw() method
 * This allows Canvas UI to trigger texture updates when content changes
 *
 * For fallback mode (no XR layers support), updates texture.needsUpdate
 * For XR layers mode, calls layer.requestRedraw()
 */
export const XRLayerWithRedraw = forwardRef<XRLayerWithRedrawHandle, XRLayerProperties>(
  (props, ref) => {
    const layerRef = useRef<{ mesh: any; layerEntry: any }>(null)

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

    return <XRLayer ref={layerRef} {...props} />
  }
)

XRLayerWithRedraw.displayName = 'XRLayerWithRedraw'
