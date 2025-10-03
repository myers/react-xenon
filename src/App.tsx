import { Canvas, Flex, Text } from '@canvas-ui/react'
import './App.css'
import { OffscreenCanvas } from './components/OffscreenCanvas'
import { useEffect, useRef, useState } from 'react'
import type { Flex as FlexType } from '@canvas-ui/react'

function App() {
  console.log('[App] Rendering')
  const canvasRef = useRef<OffscreenCanvas>()
  const buttonRef = useRef<FlexType>()
  const [imageUrl, setImageUrl] = useState<string>()
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    // Wait a bit for rendering to complete, then convert to image
    const timer = setTimeout(async () => {
      if (canvasRef.current) {
        console.log('[App] Converting OffscreenCanvas to image')
        const blob = await canvasRef.current.convertToBlob()
        const url = URL.createObjectURL(blob)
        setImageUrl(url)
        return () => URL.revokeObjectURL(url)
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [clickCount]) // Re-render image when click count changes

  // Simulate clicking the button once per second
  useEffect(() => {
    const interval = setInterval(() => {
      if (buttonRef.current) {
        console.log('[Auto-Click] Simulating Canvas UI button click')
        const event = {
          bubbles: true,
          cancelable: true,
          clientX: 256,
          clientY: 400,
          button: 0,
        }
        buttonRef.current.onPointerUp?.(event as any)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app-container">
      {/* Regular Canvas Test */}
      <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>Regular Canvas (for comparison)</h3>
        <div style={{ width: '400px', height: '200px' }}>
          <Canvas>
            <Flex style={{ width: 400, height: 200, backgroundColor: '#3498db', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#ffffff' }}>
                {`Clicks: ${clickCount}`}
              </Text>
            </Flex>
          </Canvas>
        </div>
      </div>

      {/* OffscreenCanvas Test */}
      <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px' }}>
        <h3>Canvas UI + OffscreenCanvas Component</h3>

        {/* Headless rendering - no DOM elements */}
        <OffscreenCanvas width={512} height={512} canvasRef={canvasRef}>
          <Flex
            style={{
              width: 512,
              height: 512,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#16a085',
            }}
          >
            <Text
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: '#ecf0f1',
                marginBottom: 20,
              }}
            >
              Success!
            </Text>
            <Text
              style={{
                fontSize: 36,
                color: '#f39c12',
              }}
            >
              Canvas UI
            </Text>
            <Text
              style={{
                fontSize: 32,
                color: '#3498db',
                marginTop: 10,
              }}
            >
              + OffscreenCanvas
            </Text>
            <Text
              style={{
                fontSize: 24,
                color: '#e74c3c',
                marginTop: 20,
              }}
            >
              ✓ Clean Component
            </Text>

            {/* Button rendered in Canvas UI */}
            <Flex
              ref={buttonRef}
              onPointerUp={() => {
                console.log('[Canvas UI Button] Clicked!')
                setClickCount(c => c + 1)
              }}
              style={{
                width: 300,
                height: 80,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#e74c3c',
                borderRadius: 10,
                marginTop: 30,
                cursor: 'pointer',
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}
              >
                {`Clicks: ${clickCount}`}
              </Text>
            </Flex>
          </Flex>
        </OffscreenCanvas>

        {imageUrl ? (
          <>
            <p style={{ color: 'green' }}>✓ Rendered to OffscreenCanvas!</p>
            <img src={imageUrl} alt="Canvas UI OffscreenCanvas" style={{ border: '2px solid black' }} />
          </>
        ) : (
          <p>Rendering...</p>
        )}
      </div>
    </div>
  )
}

export default App
