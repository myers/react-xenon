import { Canvas, Flex, Text } from '@canvas-ui/react'
import './App.css'
import { OffscreenCanvasTest } from './OffscreenCanvasTest'

function App() {
  return (
    <div className="app-container">
      {/* Original Hello World Example */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: 'white', marginBottom: '10px' }}>Canvas UI Hello World</h2>
        <Canvas>
          <Flex style={{
            width: 400,
            height: 300,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            borderRadius: 10,
          }}>
            <Text style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#333',
              marginBottom: 20,
            }}>
              Hello World!
            </Text>
            <Text style={{
              fontSize: 24,
              color: '#666',
            }}>
              Welcome to Canvas UI
            </Text>
          </Flex>
        </Canvas>
      </div>

      {/* OffscreenCanvas Test */}
      <div>
        <h2 style={{ color: 'white', marginBottom: '10px' }}>OffscreenCanvas Test</h2>
        <OffscreenCanvasTest />
      </div>
    </div>
  )
}

export default App
