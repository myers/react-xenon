import { Environment } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { OrbitHandles } from '@react-three/handle'
import { createXRStore, noEvents, PointerEvents, useXR, XR, XROrigin } from '@react-three/xr'
import { useCallback, useState } from 'react'
import { useFrame } from '@react-three/fiber'
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

function MusicPlayerLayers() {
  const [offsetX, setOffsetX] = useState(0)

  useFrame((state) => {
    const session = state.gl.xr.getSession()
    if (!session) return

    // Get input sources (controllers)
    for (const source of session.inputSources) {
      if (source.handedness === 'right' && source.gamepad) {
        // Thumbstick axes: [0] = left/right, [1] = up/down
        const thumbstickX = source.gamepad.axes[2] || 0

        // Move layers based on thumbstick input
        if (Math.abs(thumbstickX) > 0.1) {
          setOffsetX((prev) => prev + thumbstickX * 0.02)
        }
      }
    }
  })

  return (
    <MusicPlayerLayer position={[0 + offsetX, 0.1, -0.6]} dpr={3} />
  )
}

export function XenonDemoApp() {
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
          <MusicPlayerLayers />
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
