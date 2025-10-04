import { Canvas, Flex, Text } from '@canvas-ui/react'
import { createRoot } from 'react-dom/client'
import Play from 'lucide/dist/esm/icons/play.js'
import Pause from 'lucide/dist/esm/icons/pause.js'
import SkipBack from 'lucide/dist/esm/icons/skip-back.js'
import SkipForward from 'lucide/dist/esm/icons/skip-forward.js'
import { LucideIcon } from './components/music/LucideIcon'
import './App.css'

function IconTestApp() {
  const icons = [
    { name: 'Play', icon: Play },
    { name: 'Pause', icon: Pause },
    { name: 'Skip Back', icon: SkipBack },
    { name: 'Skip Forward', icon: SkipForward },
  ]

  return (
    <div style={{ padding: '40px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ marginBottom: '40px' }}>Icon Rendering Comparison</h1>

      {/* HTML SVG Row */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px' }}>HTML SVG (Reference)</h2>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          {icons.map(({ name, icon }) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f3f4f6" strokeWidth="1.5">
                {icon.map(([tag, attrs]: [string, any], idx: number) => {
                  if (tag === 'path') {
                    return <path key={idx} d={attrs.d} />
                  } else if (tag === 'rect') {
                    return <rect key={idx} {...attrs} />
                  } else if (tag === 'polygon') {
                    return <polygon key={idx} {...attrs} />
                  } else if (tag === 'line') {
                    return <line key={idx} {...attrs} />
                  }
                  return null
                })}
              </svg>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>{name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas UI with Path and Rect Support */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px' }}>Canvas UI - Path & Rect Support (Fixed)</h2>
        <div style={{ width: '600px', height: '80px', border: '1px solid #333' }}>
          <Canvas>
            <Flex style={{ width: 600, height: 80, flexDirection: 'row', gap: 40, alignItems: 'center', paddingLeft: 20 }}>
              {icons.map(({ name, icon }) => (
                <Flex key={name} style={{ flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <LucideIcon icon={icon} size={24} />
                  <Text style={{ fontSize: 12 }}>{name}</Text>
                </Flex>
              ))}
            </Flex>
          </Canvas>
        </div>
      </div>
    </div>
  )
}

const container = document.getElementById('root')
if (container) {
  createRoot(container).render(<IconTestApp />)
}
