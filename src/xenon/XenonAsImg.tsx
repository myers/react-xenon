import { ReactNode, useEffect, useState, useCallback, useRef } from 'react'
import { useCanvasUISetup } from './useCanvasUISetup'

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
  const { HeadlessCanvasElement, canvas, renderCanvas, binding } = useCanvasUISetup({
    width,
    height,
    dpr,
    children
  })

  const [imageUrl, setImageUrl] = useState<string>()
  const imgRef = useRef<HTMLImageElement>(null)

  // Event-driven rendering: render + update image when dirty
  useEffect(() => {
    if (!renderCanvas || !binding || !canvas) return

    // Convert canvas to image blob and update img src
    const convertToImage = async () => {
      try {
        const blob = await canvas.convertToBlob({ type: 'image/png' })
        const url = URL.createObjectURL(blob)

        setImageUrl(prev => {
          if (prev) URL.revokeObjectURL(prev)
          return url
        })
      } catch (error) {
        console.error('[XenonAsImg] Error updating image:', error)
      }
    }

    // Listen for frameEnd to update display after Canvas UI renders
    const handleFrameEnd = () => {
      convertToImage()
    }
    renderCanvas.addEventListener('frameEnd', handleFrameEnd)

    // Canvas UI automatically marks dirty and schedules frames when children are added
    // via appendChild → adoptChild → markLayoutDirty → requestVisualUpdate
    // So we just rely on the frameEnd event firing automatically

    return () => {
      renderCanvas.removeEventListener('frameEnd', handleFrameEnd)
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [renderCanvas, binding, canvas])

  // Handle pointer events on image
  const handlePointerEvent = useCallback((
    type: 'pointerdown' | 'pointerup' | 'pointermove',
    e: React.PointerEvent<HTMLImageElement>
  ) => {
    if (!binding || !imgRef.current) return

    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * width
    const y = ((e.clientY - rect.top) / rect.height) * height

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
