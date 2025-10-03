import { Environment } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { OrbitHandles } from '@react-three/handle'
import { createXRStore, noEvents, PointerEvents, useXR, XR, XRLayer, XROrigin } from '@react-three/xr'
import { useCallback, useMemo } from 'react'
import { XRButtons } from './XRButtons'

const store = createXRStore({
  controller: {
    normal: noEvents,
  },
  hand: {
    normal: noEvents,
  },
  emulate: {
    headset: { position: [0, 1.6, 3] },
  },
  frameRate: 120,
  frameBufferScaling: 1.5,
  referenceSpace: 'local-floor',
  foveation: 1,
})

export function XRCanvasUIApp() {
  return (
    <>
      <XRButtons store={store} position="bottom" />
      <Canvas
        shadows
        gl={{
          localClippingEnabled: true,
          alpha: true,
        }}
        camera={{ position: [0, 0, 0.65] }}
      >
        <PointerEvents batchEvents={false} />
        <OrbitHandles />
        <XR store={store}>
          <NonAREnvironment />
          <XROrigin position-y={-1.5} position-z={0.5} />
          <DynamicTextLayer />
        </XR>
      </Canvas>
    </>
  )
}

function DynamicTextLayer() {
  const canvas = useMemo(() => {
    // Try OffscreenCanvas first, fallback to regular canvas
    const canvas = typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(1024, 1024)
      : (() => {
          const el = document.createElement('canvas')
          el.width = 1024
          el.height = 1024
          return el
        })()

    const ctx = canvas.getContext('2d')
    if (ctx) {
      // White background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, 1024, 1024)

      // Black text
      ctx.fillStyle = 'black'
      ctx.font = 'bold 72px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Hello WebXR!', 512, 512)

      // Border for visibility
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 4
      ctx.strokeRect(0, 0, 1024, 1024)
    }

    return canvas
  }, [])

  return (
    <XRLayer
      src={canvas}
      shape="quad"
      position={[0, 0, -2]}
      scale={[2, 2, 1]}
    />
  )
}

function NonAREnvironment() {
  const selector = useCallback((s: any) => s.mode === 'immersive-ar', [])
  const inAR = useXR(selector)
  return <Environment blur={0.2} background={!inAR} environmentIntensity={2} preset="city" />
}
