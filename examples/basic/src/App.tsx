import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { XR, createXRStore, useXR, PointerEvents } from '@react-three/xr'
import { Xenon } from '@react-xenon/core'
import { Flex, Text } from '@canvas-ui/react'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

const store = createXRStore({
  emulate: { syntheticEnvironment: false, inject: true },
  controller: {
    rayPointer: {
      cursorModel: {
        color: 'white',
        opacity: 0.8,
        size: 0.05,
        cursorOffset: 0.01,
      },
    },
  },
})

// Canvas dimensions (matching music player)
const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 600

// Default eye level for camera and panel positioning (in meters)
const DEFAULT_EYE_LEVEL = 1.5

export function App() {
  return (
    <>
      <button
        onClick={() => store.enterAR()}
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
        Enter AR
      </button>

      <Canvas camera={{ position: [0, DEFAULT_EYE_LEVEL, 0], rotation: [0, 0, 0] }}>
        <ambientLight intensity={0.5} />
        <color attach="background" args={["black"]} />
        <PointerEvents />
        <XR store={store}>
          <EyeLevelGroup defaultEyeLevel={DEFAULT_EYE_LEVEL}>
            <XenonPanel
              position={[0, 0, -2]}
              canvasWidth={CANVAS_WIDTH}
              canvasHeight={CANVAS_HEIGHT}
            />
          </EyeLevelGroup>
        </XR>
      </Canvas>
    </>
  )
}

// Parent component that positions panels at user's eye level
function EyeLevelGroup({ children, defaultEyeLevel }: { children: ReactNode; defaultEyeLevel: number }) {
  const session = useXR((state) => state.session)
  const { camera } = useThree()
  const [eyeLevel, setEyeLevel] = useState(defaultEyeLevel)
  const heightCapturedRef = useRef(false)

  // Capture camera height once when entering XR
  useEffect(() => {
    if (session) {
      heightCapturedRef.current = false
    } else {
      setEyeLevel(defaultEyeLevel)
    }
  }, [session, defaultEyeLevel])

  useFrame(() => {
    if (camera && session && !heightCapturedRef.current) {
      setEyeLevel(camera.position.y)
      heightCapturedRef.current = true
    }
  })

  return <group position-y={eyeLevel}>{children}</group>
}

// Xenon panel with interactive UI
function XenonPanel({
  position,
  canvasWidth,
  canvasHeight,
}: {
  position: [number, number, number]
  canvasWidth: number
  canvasHeight: number
}) {
  const [counter, setCounter] = useState(0)
  const [time, setTime] = useState(new Date())
  const [lastClick, setLastClick] = useState<{ x: number; y: number } | null>(null)

  // Clock update
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const handleCounterClick = useCallback(() => {
    setCounter((c) => c + 1)
  }, [])

  const handlePanelClick = useCallback((event: any) => {
    // Canvas UI pointer events have clientX/clientY in canvas pixel coordinates
    console.log('Canvas UI pointer event:', event)
    setLastClick({
      x: Math.round(event.clientX),
      y: Math.round(event.clientY)
    })
  }, [])

  const timeString = time.toLocaleTimeString()

  return (
    <Xenon
      position={position}
      scale={[1.5, 1, 1]}
      pixelWidth={canvasWidth}
      pixelHeight={canvasHeight}
      blendMode="alphablend"
    >
      <Flex
        onPointerDown={handlePanelClick}
        style={{
          width: canvasWidth,
          height: canvasHeight,
          padding: 30,
          gap: 15,
          borderRadius: 20,
          backgroundColor: '#000000E6',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#FFFFFF' }}>
          Xenon Demo
        </Text>

        <Flex
          style={{
            padding: 15,
            backgroundColor: '#1E88E5',
            borderRadius: 12,
            marginTop: 10,
          }}
        >
          <Text style={{ fontSize: 28, color: '#FFFFFF' }}>
            {timeString}
          </Text>
        </Flex>

        <Flex
          onPointerDown={handleCounterClick}
          style={{
            padding: 20,
            backgroundColor: '#2196F3',
            borderRadius: 12,
            marginTop: 10,
            cursor: 'pointer',
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' }}>
            Click Me!
          </Text>
        </Flex>

        <Text style={{ fontSize: 24, color: '#FFFFFF', marginTop: 5 }}>
          Clicks: {counter}
        </Text>

        <Flex
          style={{
            padding: 15,
            backgroundColor: '#333333',
            borderRadius: 12,
            marginTop: 10,
            minWidth: 300,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 18, color: '#FFFFFF', textAlign: 'center' }}>
            {lastClick ? `Last click: X=${lastClick.x}, Y=${lastClick.y}` : 'Click anywhere on panel'}
          </Text>
        </Flex>
      </Flex>
    </Xenon>
  )
}
