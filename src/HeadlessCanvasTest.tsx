import { useRef, useEffect, useState } from 'react'
import { HeadlessCanvas } from '@canvas-ui/react'
import { RenderCanvas } from '@canvas-ui/core'
import { Flex, Text } from '@canvas-ui/react'

/**
 * Minimal test to verify HeadlessCanvas creates a working OffscreenCanvas
 * and renders content correctly
 */
export function HeadlessCanvasTest() {
  const canvasRef = useRef<OffscreenCanvas>()
  const renderCanvasRef = useRef<RenderCanvas>()
  const [testResults, setTestResults] = useState<string[]>([])

  const handleReady = async (canvas: OffscreenCanvas, renderCanvas: RenderCanvas) => {
    const results: string[] = []

    results.push(`✓ HeadlessCanvas created`)
    results.push(`✓ OffscreenCanvas: ${canvas.width}x${canvas.height}`)
    results.push(`✓ RenderCanvas created`)

    // Wait for React reconciliation
    await new Promise(resolve => setTimeout(resolve, 100))

    // Trigger render
    renderCanvas.frameDirty = true
    renderCanvas.drawFrame()

    results.push(`✓ drawFrame() executed`)

    // Wait for rendering to complete
    await new Promise(resolve => requestAnimationFrame(resolve))

    // Check if canvas has content
    try {
      const blob = await canvas.convertToBlob({ type: 'image/png' })
      results.push(`✓ Blob created: ${blob.size} bytes`)

      // Create ImageBitmap to read pixels
      const imageBitmap = await createImageBitmap(blob)

      // Create a temporary 2D canvas to read pixel data
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = imageBitmap.width
      tempCanvas.height = imageBitmap.height
      const ctx = tempCanvas.getContext('2d')!
      ctx.drawImage(imageBitmap, 0, 0)

      // Read center pixel
      const centerX = Math.floor(canvas.width / 2)
      const centerY = Math.floor(canvas.height / 2)
      const imageData = ctx.getImageData(centerX, centerY, 1, 1)
      const [r, g, b, a] = imageData.data

      results.push(`✓ Center pixel: rgba(${r}, ${g}, ${b}, ${a})`)

      // Check if it's not pure black (which would indicate no rendering)
      if (r === 0 && g === 0 && b === 0) {
        results.push(`⚠️  WARNING: Canvas appears to be black - no content rendered?`)
      } else {
        results.push(`✓ SUCCESS: Canvas has non-black content!`)
      }
    } catch (error) {
      results.push(`✗ Error: ${error}`)
    }

    setTestResults(results)
  }

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h2>HeadlessCanvas Test</h2>

      <div style={{ marginTop: 20 }}>
        <h3>Test Results:</h3>
        {testResults.map((result, i) => (
          <div key={i} style={{
            padding: '2px 0',
            color: result.startsWith('✗') ? 'red' : result.startsWith('⚠') ? 'orange' : 'green'
          }}>
            {result}
          </div>
        ))}
      </div>

      <HeadlessCanvas
        width={200}
        height={200}
        dpr={1}
        canvasRef={canvasRef}
        renderCanvasRef={renderCanvasRef}
        onReady={handleReady}
      >
        <Flex style={{
          width: 200,
          height: 200,
          backgroundColor: '#ff0000',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{ color: '#ffffff', fontSize: 20 }}>Test</Text>
        </Flex>
      </HeadlessCanvas>
    </div>
  )
}
