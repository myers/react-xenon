import { ReactNode, useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { HeadlessCanvas, InjectEventFn } from '@canvas-ui/react'
import { RenderCanvas } from '@canvas-ui/core'

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
  const imgRef = useRef<HTMLImageElement>(null)

  // Create OffscreenCanvas
  const canvas = useMemo(
    () => new OffscreenCanvas(width * dpr, height * dpr),
    [width, height, dpr]
  )

  // Store event injection function and renderCanvas
  const [injectEvent, setInjectEvent] = useState<InjectEventFn | null>(null)
  const [renderCanvas, setRenderCanvas] = useState<RenderCanvas | null>(null)
  const [imageUrl, setImageUrl] = useState<string>()

  // Event-driven rendering: render + update image when dirty
  useEffect(() => {
    if (!renderCanvas) return

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
    }
  }, [renderCanvas, canvas])

  // Cleanup image URL on unmount
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  // Handle pointer events on image
  const handlePointerEvent = useCallback((
    type: 'pointerdown' | 'pointerup' | 'pointermove',
    e: React.PointerEvent<HTMLImageElement>
  ) => {
    if (!injectEvent || !imgRef.current) return

    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * width
    const y = ((e.clientY - rect.top) / rect.height) * height

    injectEvent(type, x, y, e.button, e.pointerId)
  }, [injectEvent, width, height])

  return (
    <>
      <HeadlessCanvas
        canvas={canvas}
        width={width}
        height={height}
        dpr={dpr}
        onReady={({ injectEvent, renderCanvas: rc }) => {
          setInjectEvent(() => injectEvent)
          setRenderCanvas(rc)
        }}
      >
        {children}
      </HeadlessCanvas>
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
