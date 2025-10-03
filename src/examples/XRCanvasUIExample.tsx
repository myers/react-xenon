import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Flex, Text, View, ScrollView } from '@canvas-ui/react'
import { XRCanvasUILayer } from '../xr-canvas-ui'
import { useState } from 'react'

// Create XR store for the session
const store = createXRStore()

export function XRCanvasUIExample() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Button to enter VR */}
      <button onClick={() => store.enterVR()}>Enter VR</button>

      {/* Three.js Canvas with XR */}
      <Canvas>
        <XR store={store}>
          {/* XR Layer with Canvas UI */}
          <XRCanvasUILayer
            position={[0, 1.5, -1.5]}
            pixelWidth={1024}
            pixelHeight={1024}
            dpr={2}
            enableJoystickScroll={true}
            scrollSensitivity={30}
          >
            {/* Canvas UI content - fully interactive! */}
            <ScrollView
              style={{
                width: 1024,
                height: 1024,
                backgroundColor: '#1a1a2e',
                padding: 40,
              }}
              scrollSize={{ width: 1024, height: 2000 }}
            >
              <Flex
                style={{
                  width: 944, // 1024 - padding*2
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                {/* Header */}
                <View
                  style={{
                    backgroundColor: '#0f3460',
                    borderRadius: 10,
                    padding: 30,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 48,
                      fontWeight: 'bold',
                      color: '#e94560',
                    }}
                  >
                    Canvas UI in WebXR
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      color: '#f1f1f1',
                      marginTop: 10,
                    }}
                  >
                    Fully interactive UI on Meta Quest!
                  </Text>
                </View>

                {/* Interactive button */}
                <View
                  style={{
                    backgroundColor: '#e94560',
                    borderRadius: 10,
                    padding: 30,
                    cursor: 'pointer',
                  }}
                  onPointerDown={() => setCount(c => c + 1)}
                >
                  <Text
                    style={{
                      fontSize: 32,
                      fontWeight: 'bold',
                      color: '#ffffff',
                      textAlign: 'center',
                    }}
                  >
                    Click me! Count: {count}
                  </Text>
                </View>

                {/* Features list */}
                <View
                  style={{
                    backgroundColor: '#16213e',
                    borderRadius: 10,
                    padding: 30,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 36,
                      fontWeight: 'bold',
                      color: '#f1f1f1',
                      marginBottom: 20,
                    }}
                  >
                    Features:
                  </Text>

                  {[
                    '✓ Click with XR controllers',
                    '✓ Scroll with joystick',
                    '✓ Hover effects',
                    '✓ Flex layout',
                    '✓ Text rendering',
                    '✓ React state updates',
                  ].map((feature, i) => (
                    <View
                      key={i}
                      style={{
                        backgroundColor: '#0f3460',
                        borderRadius: 8,
                        padding: 20,
                        marginBottom: 15,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 28,
                          color: '#f1f1f1',
                        }}
                      >
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Instructions */}
                <View
                  style={{
                    backgroundColor: '#533483',
                    borderRadius: 10,
                    padding: 30,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      color: '#f1f1f1',
                      lineHeight: 1.5,
                    }}
                  >
                    💡 Point your controller at this panel and press the
                    trigger to click. Use the thumbstick to scroll up and down!
                  </Text>
                </View>

                {/* Extra content for scrolling */}
                <View
                  style={{
                    backgroundColor: '#16213e',
                    borderRadius: 10,
                    padding: 30,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      color: '#888',
                    }}
                  >
                    Keep scrolling to see more content...
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: '#0f3460',
                    borderRadius: 10,
                    padding: 30,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 32,
                      color: '#e94560',
                      textAlign: 'center',
                    }}
                  >
                    🎉 You made it to the bottom!
                  </Text>
                </View>
              </Flex>
            </ScrollView>
          </XRCanvasUILayer>

          {/* Add some 3D content for context */}
          <mesh position={[0, 1.5, -3]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>

          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} />
        </XR>
      </Canvas>
    </>
  )
}
