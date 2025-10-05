import { ReactNode, useEffect, useState, useCallback, useRef } from 'react'
import { useCanvasUISetup } from './useCanvasUISetup'

console.log('[XenonAsImg MODULE] File loaded!')
console.log('[XenonAsImg MODULE] useCanvasUISetup:', useCanvasUISetup)

export interface XenonAsImgProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> {
  width: number
  height: number
  dpr?: number
  children: ReactNode
}

/**
 * Xenon component for DOM rendering
 *
 * Renders Canvas UI to an OffscreenCanvas and displays it as an <img>
 * Event-driven rendering: only updates when interactions occur
 */
export function XenonAsImg({
  width,
  height,
  dpr = 2,
  children,
  ...imgProps
}: XenonAsImgProps) {
  console.log('[XenonAsImg] Component called!', { width, height, dpr })
  const { HeadlessCanvasElement, canvas, renderCanvas, binding } = useCanvasUISetup({
    width,
    height,
    dpr,
    children
  })
  console.log('[XenonAsImg] useCanvasUISetup returned:', { canvas, renderCanvas, binding })

  const [imageUrl, setImageUrl] = useState<string>()
  const imgRef = useRef<HTMLImageElement>(null)

  // Event-driven rendering: render + update image when dirty
  useEffect(() => {
    if (!renderCanvas || !binding || !canvas) return

    const updateImage = async () => {
      try {
        console.log('[XenonAsImg] Rendering frame and updating image')
        console.log('[XenonAsImg] Canvas dimensions:', canvas.width, 'x', canvas.height)
        console.log('[XenonAsImg] RenderCanvas instance:', renderCanvas)
        console.log('[XenonAsImg] Has _offscreenCanvas?', (renderCanvas as any)._offscreenCanvas)
        renderCanvas.frameDirty = true
        renderCanvas.drawFrame()

        // Wait a frame for rendering to complete
        await new Promise(resolve => requestAnimationFrame(resolve))

        console.log('[XenonAsImg] Converting canvas to blob...')
        const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.95 })
        console.log('[XenonAsImg] Blob created:', blob.size, 'bytes')
        const url = URL.createObjectURL(blob)
        console.log('[XenonAsImg] URL created:', url)

        setImageUrl(prev => {
          if (prev) URL.revokeObjectURL(prev)
          console.log('[XenonAsImg] Image URL set')
          return url
        })
      } catch (error) {
        console.error('[XenonAsImg] Error updating image:', error)
      }
    }

    // Override onEvents to trigger render + image update
    binding.onEvents = () => {
      renderCanvas.frameDirty = true
      updateImage()
    }

    // Initial render - wait for React reconciliation to complete
    // Need to wait longer than one frame for children to be reconciled
    setTimeout(() => {
      updateImage()
    }, 100)

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [renderCanvas, binding, canvas])

  // Handle pointer events on image
  const handlePointerEvent = useCallback((
    type: 'pointerdown' | 'pointerup' | 'pointermove',
    e: React.PointerEvent<HTMLImageElement>
  ) => {
    console.log(`[XenonAsImg] ${type} event received, binding:`, binding, 'imgRef:', imgRef.current)
    if (!binding || !imgRef.current) {
      console.log(`[XenonAsImg] ${type} - early return (binding: ${!!binding}, imgRef: ${!!imgRef.current})`)
      return
    }

    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * width
    const y = ((e.clientY - rect.top) / rect.height) * height

    console.log(`[XenonAsImg] ${type} at canvas coords:`, { x, y })
    binding.injectPointerEvent(type, x, y, e.button, e.pointerId)
  }, [binding, width, height])

  return (
    <>
      {HeadlessCanvasElement}
      {imageUrl ? (
        <img
          ref={imgRef}
          src={imageUrl}
          alt=""
          width={width}
          height={height}
          onPointerDown={e => handlePointerEvent('pointerdown', e)}
          onPointerUp={e => handlePointerEvent('pointerup', e)}
          onPointerMove={e => handlePointerEvent('pointermove', e)}
          {...imgProps}
        />
      ) : (
        <div style={{ width, height, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Rendering...
        </div>
      )}
    </>
  )
}
