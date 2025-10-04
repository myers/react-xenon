import { Canvas, Flex, Path, Text } from '@canvas-ui/react'
import { createRoot } from 'react-dom/client'
import './App.css'

const pauseStrokePath = 'M14 3 L14 21 M14 3 Q19 3 19 3 L19 21 Q19 21 14 21 M14 21 L14 3 Z M5 3 L5 21 M5 3 Q10 3 10 3 L10 21 Q10 21 5 21 M5 21 L5 3 Z'

const pauseFillPath = 'M5.477 2.073 C 4.806 2.249,4.238 2.823,4.060 3.508 C 4.008 3.707,4.000 4.805,4.000 12.000 C 4.000 21.017,3.986 20.458,4.225 20.930 C 4.361 21.199,4.801 21.639,5.070 21.775 C 5.497 21.991,5.589 22.000,7.500 22.000 C 9.411 22.000,9.503 21.991,9.930 21.775 C 10.196 21.640,10.638 21.200,10.771 20.937 C 11.015 20.457,11.000 21.028,10.999 12.014 C 10.999 3.065,11.010 3.534,10.781 3.083 C 10.646 2.816,10.297 2.449,10.017 2.281 C 9.578 2.016,9.470 2.005,7.500 2.005 C 5.965 2.005,5.706 2.013,5.477 2.073 M14.477 2.073 C 13.806 2.249,13.238 2.823,13.060 3.508 C 13.008 3.707,13.000 4.805,13.000 12.000 C 13.000 21.017,12.986 20.458,13.225 20.930 C 13.361 21.199,13.801 21.639,14.070 21.775 C 14.497 21.991,14.589 22.000,16.500 22.000 C 18.411 22.000,18.503 21.991,18.930 21.775 C 19.196 21.640,19.638 21.200,19.771 20.937 C 20.015 20.457,20.000 21.028,19.999 12.014 C 19.999 3.065,20.010 3.534,19.781 3.083 C 19.646 2.816,19.297 2.449,19.017 2.281 C 18.578 2.016,18.470 2.005,16.500 2.005 C 14.965 2.005,14.706 2.013,14.477 2.073 M9.000 12.000 L 9.000 20.000 7.500 20.000 L 6.000 20.000 6.000 12.000 L 6.000 4.000 7.500 4.000 L 9.000 4.000 9.000 12.000 M18.000 12.000 L 18.000 20.000 16.500 20.000 L 15.000 20.000 15.000 12.000 L 15.000 4.000 16.500 4.000 L 18.000 4.000 18.000 12.000'

function IconCompareApp() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <h1 style={{ marginBottom: '40px' }}>Pause Icon - Stroke vs Fill Comparison</h1>

      {/* HTML SVG - Original Stroke */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px' }}>HTML SVG - Original (Stroke)</h2>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f3f4f6" strokeWidth="1.5">
              <rect x="14" y="3" width="5" height="18" rx="1"/>
              <rect x="5" y="3" width="5" height="18" rx="1"/>
            </svg>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>Stroke (rect)</div>
          </div>
        </div>
      </div>

      {/* HTML SVG - svg-fixer Fill */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px' }}>HTML SVG - svg-fixer (Fill)</h2>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d={pauseFillPath} fill="#f3f4f6" />
            </svg>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>Fill (path)</div>
          </div>
        </div>
      </div>

      {/* Canvas UI - Original Stroke (Our Current Implementation) */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px' }}>Canvas UI - Current (Stroke)</h2>
        <div style={{ width: '600px', height: '80px', border: '1px solid #333' }}>
          <Canvas>
            <Flex style={{ width: 600, height: 80, flexDirection: 'row', gap: 40, alignItems: 'center', paddingLeft: 20 }}>
              <Flex style={{ flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Path
                  path={pauseStrokePath}
                  pathBounds={{ x: 0, y: 0, width: 24, height: 24 }}
                  style={{
                    width: 24,
                    height: 24,
                    stroke: '#f3f4f6',
                    strokeWidth: 1.5,
                    fill: 'none',
                  }}
                />
                <Text style={{ fontSize: 12 }}>Stroke (converted rect)</Text>
              </Flex>
            </Flex>
          </Canvas>
        </div>
      </div>

      {/* Canvas UI - svg-fixer Fill */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px' }}>Canvas UI - svg-fixer (Fill)</h2>
        <div style={{ width: '600px', height: '80px', border: '1px solid #333' }}>
          <Canvas>
            <Flex style={{ width: 600, height: 80, flexDirection: 'row', gap: 40, alignItems: 'center', paddingLeft: 20 }}>
              <Flex style={{ flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Path
                  path={pauseFillPath}
                  pathBounds={{ x: 0, y: 0, width: 24, height: 24 }}
                  style={{
                    width: 24,
                    height: 24,
                    fill: '#f3f4f6',
                  }}
                />
                <Text style={{ fontSize: 12 }}>Fill (svg-fixer)</Text>
              </Flex>
            </Flex>
          </Canvas>
        </div>
      </div>
    </div>
  )
}

const container = document.getElementById('root')
if (container) {
  createRoot(container).render(<IconCompareApp />)
}
