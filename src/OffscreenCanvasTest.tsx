import { useEffect, useState } from 'react'

/**
 * Step 1: Validate that OffscreenCanvas works in the browser
 * - No Canvas UI involved
 * - Just draw a red rectangle
 * - Convert to image and display
 */
export function OffscreenCanvasTest() {
  const [imageUrl, setImageUrl] = useState<string>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    async function testOffscreenCanvas() {
      try {
        console.log('Testing OffscreenCanvas support...')

        // Check if OffscreenCanvas is available
        if (typeof OffscreenCanvas === 'undefined') {
          throw new Error('OffscreenCanvas is not supported in this browser')
        }

        console.log('OffscreenCanvas is available!')

        // Create OffscreenCanvas
        const canvas = new OffscreenCanvas(512, 512)
        console.log('Created OffscreenCanvas:', canvas)

        // Get 2D context
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          throw new Error('Failed to get 2D context')
        }

        console.log('Got 2D context')

        // Draw a red rectangle
        ctx.fillStyle = 'red'
        ctx.fillRect(50, 50, 200, 200)

        // Draw some text
        ctx.fillStyle = 'white'
        ctx.font = '48px Arial'
        ctx.fillText('OffscreenCanvas', 80, 150)

        console.log('Drew to canvas')

        // Convert to blob
        const blob = await canvas.convertToBlob()
        console.log('Converted to blob:', blob)

        // Create object URL
        const url = URL.createObjectURL(blob)
        console.log('Created object URL:', url)

        setImageUrl(url)

        // Cleanup
        return () => URL.revokeObjectURL(url)
      } catch (err) {
        console.error('OffscreenCanvas test failed:', err)
        setError(err instanceof Error ? err.message : String(err))
      }
    }

    testOffscreenCanvas()
  }, [])

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '10px' }}>
      <h3>OffscreenCanvas Test (No Canvas UI)</h3>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {imageUrl && (
        <>
          <p style={{ color: 'green' }}>✓ OffscreenCanvas works!</p>
          <img src={imageUrl} alt="OffscreenCanvas test" style={{ border: '2px solid black' }} />
        </>
      )}
      {!imageUrl && !error && <p>Testing...</p>}
    </div>
  )
}
