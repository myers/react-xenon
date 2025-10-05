import { Canvas, Flex, Text } from '@canvas-ui/react'
import { XenonAsImg } from './xenon'
import { useRef, useState } from 'react'
import { BridgeEventBinding } from './utils/BridgeEventBinding'

function CounterButton() {
  const [count, setCount] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Flex
      style={{
        width: 400,
        height: 300,
        flexDirection: 'column',
        backgroundColor: '#2c3e50',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Flex
        onPointerDown={() => {
          console.log('[CounterButton] Button clicked! Incrementing count from', count, 'to', count + 1)
          setCount(c => c + 1)
        }}
        onPointerEnter={() => {
          console.log('[CounterButton] Pointer entered!')
          setIsHovered(true)
        }}
        onPointerLeave={() => {
          console.log('[CounterButton] Pointer left!')
          setIsHovered(false)
        }}
        style={{
          width: 200,
          height: 80,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isHovered ? '#5dade2' : '#3498db',
          borderRadius: 10,
          cursor: 'pointer',
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#ffffff',
          }}
        >
          {`Count: ${count}`}
        </Text>
      </Flex>
    </Flex>
  )
}

function EventTestApp() {
  // TODO: Re-implement recording/playback features with Xenon
  const [isRecording, setIsRecording] = useState(false)
  const [recordedEvents, setRecordedEvents] = useState<Array<{ type: string, x: number, y: number, timestamp: number }>>([])
  const recordingStartTime = useRef<number>(0)

  // TODO: Re-implement dispatch functionality
  const handleDispatchToOffscreen = () => {
    console.log('[Test] Dispatch not yet implemented with Xenon')
  }

  // TODO: Re-implement recording
  const handleToggleRecording = () => {
    console.log('[Recording] Not yet implemented with Xenon')
  }

  // TODO: Re-implement playback
  const handlePlayback = async () => {
    console.log('[Playback] Not yet implemented with Xenon')
  }

  const handleSaveEvents = () => {
    console.log('[Save] Not yet implemented')
  }

  const handleLoadEvents = () => {
    console.log('[Load] Not yet implemented')
  }

  const handleLoadTestEvents = () => {
    console.log('[Load Test] Not yet implemented')
  }

  // Test function to dispatch event to regular canvas button
  const handleDispatchToRegular = () => {
    console.log('[Test] Dispatching event to Regular Canvas button')

    // Regular Canvas doesn't expose renderCanvas ref, so we get it from the global debug variable
    const activeBinding = (window as any).activeBinding
    if (!activeBinding?.binding) {
      console.error('[Test] No regular renderCanvas! (window.activeBinding not set)')
      return
    }

    const renderCanvas = activeBinding.binding
    console.log('[Test] Got renderCanvas from window.activeBinding:', renderCanvas)

    // Dispatch at center of button (200, 190)
    dispatchPointerEvent(renderCanvas, 'pointerdown', 200, 190, 0, 0)
    dispatchPointerEvent(renderCanvas, 'pointerup', 200, 190, 0, 0)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Canvas UI Event Dispatch Test</h1>
      <p>This tests whether events can be dispatched to Canvas UI buttons programmatically.</p>

      <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
        {/* OffscreenCanvas Test */}
        <div style={{ flex: 1 }}>
          <h2>OffscreenCanvas</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleDispatchToOffscreen}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                📤 Dispatch Click Event
              </button>

              <button
                onClick={handleToggleRecording}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: isRecording ? '#e74c3c' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                {isRecording ? '⏹️ Stop Recording' : '⏺️ Record Events'}
              </button>

              <button
                onClick={handlePlayback}
                disabled={recordedEvents.length === 0}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: recordedEvents.length === 0 ? '#95a5a6' : '#9b59b6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: recordedEvents.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                ▶️ Playback ({recordedEvents.length})
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSaveEvents}
                disabled={recordedEvents.length === 0}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: recordedEvents.length === 0 ? '#95a5a6' : '#f39c12',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: recordedEvents.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                💾 Save to File
              </button>

              <label
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#16a085',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
              >
                📂 Load from File
                <input
                  type="file"
                  accept=".json"
                  onChange={handleLoadEvents}
                  style={{ display: 'none' }}
                />
              </label>

              <button
                onClick={handleLoadTestEvents}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: '#8e44ad',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                🧪 Load Test Events
              </button>
            </div>
          </div>

          {/* Headless rendering with Xenon */}
          <XenonAsImg
            width={400}
            height={300}
            dpr={2}
            style={{ border: '2px solid #34495e', display: 'block', cursor: 'pointer' }}
          >
            <CounterButton />
          </XenonAsImg>
        </div>

        {/* Regular Canvas Test */}
        <div style={{ flex: 1 }}>
          <h2>Regular Canvas</h2>

          <button
            onClick={handleDispatchToRegular}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              marginBottom: '10px',
              backgroundColor: '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            📤 Dispatch Click Event
          </button>

          <Canvas width={400} height={300}>
            <CounterButton />
          </Canvas>
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '5px' }}>
        <h3>Testing Instructions:</h3>
        <ol>
          <li>✅ Click the button in the <strong>Regular Canvas</strong> (right side) - should work normally</li>
          <li>🔍 Click the button in the <strong>OffscreenCanvas</strong> image (left side) - testing if events work</li>
          <li>📤 Click the <strong>"Dispatch Click Event"</strong> button - tests programmatic event dispatch</li>
        </ol>
        <p><strong>Check the browser console</strong> for event logs showing which handlers fire.</p>
      </div>
    </div>
  )
}

export default EventTestApp
