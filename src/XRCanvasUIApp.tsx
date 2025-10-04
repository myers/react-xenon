import { Environment } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { OrbitHandles } from '@react-three/handle'
import { createXRStore, noEvents, PointerEvents, useXR, XR, XROrigin } from '@react-three/xr'
import { useCallback } from 'react'
import { XRButtons } from './XRButtons'
import { MusicPlayerLayer } from './components/MusicPlayerLayer'

const store = createXRStore({
  controller: {
    normal: noEvents,
  },
  hand: {
    normal: noEvents,
  },
  emulate: {
    syntheticEnvironment: false,
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
          <MusicPlayerLayer position={[0, 0.1, -0.6]} />
        </XR>
      </Canvas>
    </>
  )
}

function NonAREnvironment() {
  const selector = useCallback((s: any) => s.mode === 'immersive-ar', [])
  const inAR = useXR(selector)
  return <Environment blur={0.2} background={!inAR} environmentIntensity={2} preset="city" />
}
