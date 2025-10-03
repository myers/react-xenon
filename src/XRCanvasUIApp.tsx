import { Environment } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitHandles } from '@react-three/handle'
import { createXRStore, noEvents, PointerEvents, useXR, XR, XRLayer, XROrigin } from '@react-three/xr'
import { useCallback, useMemo } from 'react'
import { TextureLoader } from 'three'
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
          <LayerWithImage />
        </XR>
      </Canvas>
    </>
  )
}

function LayerWithImage() {
  const texture = useLoader(TextureLoader, 'picture.jpg')
  const imageElement = useMemo(() => texture.image as HTMLImageElement, [texture])

  return (
    <XRLayer
      src={imageElement}
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
