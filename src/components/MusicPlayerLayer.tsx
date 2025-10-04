import { useRef, useCallback, useState } from 'react'
import { OffscreenCanvas } from './OffscreenCanvas'
import { XRLayerWithRedraw, XRLayerWithRedrawHandle } from './XRLayerWithRedraw'
import { MusicPlayerUI } from './MusicPlayerUI'

interface MusicPlayerLayerProps {
  position?: [number, number, number]
  dpr?: number
}

export function MusicPlayerLayer({ position = [0, 0, -2], dpr = 2 }: MusicPlayerLayerProps) {
  const canvasRef = useRef<OffscreenCanvas>()
  const layerRef = useRef<XRLayerWithRedrawHandle>(null)
  const [canvasReady, setCanvasReady] = useState(false)

  const handleReady = useCallback(() => {
    if (canvasRef.current) {
      setCanvasReady(true)
    }
  }, [])

  const handleFrameRendered = useCallback(() => {
    // Tell XRLayer to update texture when Canvas UI renders a frame
    layerRef.current?.requestRedraw()
  }, [])

  return (
    <>
      {/* Headless Canvas UI rendering */}
      <OffscreenCanvas
        width={900}
        height={600}
        dpr={dpr}
        canvasRef={canvasRef}
        onReady={handleReady}
        onFrameRendered={handleFrameRendered}
      >
        <MusicPlayerUI />
      </OffscreenCanvas>

      {/* XRLayer displaying the canvas */}
      {canvasReady && canvasRef.current && (
        <XRLayerWithRedraw
          ref={layerRef}
          src={canvasRef.current}
          shape="quad"
          position={position}
          scale={[1.5, 1, 1]}
          pixelWidth={900 * dpr}
          pixelHeight={600 * dpr}
        />
      )}
    </>
  )
}
