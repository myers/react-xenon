import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Xenon } from '@react-xenon/core'
import { Flex, Text } from '@canvas-ui/react'

const store = createXRStore()

export function App() {
  return (
    <>
      <button
        onClick={() => store.enterVR()}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          fontSize: '16px',
          background: '#4a9eff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        Enter VR
      </button>

      <Canvas>
        <XR store={store}>
          <ambientLight intensity={0.5} />
          <Xenon position={[0, 1.6, -1]} pixelWidth={512} pixelHeight={512}>
            <Flex
              style={{
                width: 512,
                height: 512,
                padding: 40,
                backgroundColor: '#1a1a1a',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#ffffff' }}>
                Hello Xenon!
              </Text>
              <Text style={{ fontSize: 18, color: '#a0a0a0' }}>
                This is a basic example of rendering Canvas UI in WebXR using Xenon.
              </Text>
            </Flex>
          </Xenon>
        </XR>
      </Canvas>
    </>
  )
}
