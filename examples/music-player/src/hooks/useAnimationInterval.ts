import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

/**
 * A setInterval replacement that uses the render loop (useFrame)
 * This ensures the callback runs even when the browser tab loses focus in XR
 */
export function useAnimationInterval(callback: () => void, intervalMs: number | null) {
  const callbackRef = useRef(callback)
  const lastCallRef = useRef(0)

  // Keep callback ref up to date
  callbackRef.current = callback

  useFrame(() => {
    if (intervalMs === null) return

    const now = Date.now()
    if (now - lastCallRef.current >= intervalMs) {
      callbackRef.current()
      lastCallRef.current = now
    }
  })
}
