import { Canvas } from '@canvas-ui/react'
import { MusicPlayerUI } from './components/MusicPlayerUI'

export function CanvasApp() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
      }}
    >
      <Canvas
        width={900}
        height={600}
        dpr={2}
        style={{
          borderRadius: '8px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        <MusicPlayerUI />
      </Canvas>
    </div>
  )
}
