import { useRef } from 'react'
import { useXenonFrame } from '@react-xenon/core'

/**
 * A setInterval replacement that uses Xenon's XR-aware frame loop
 * This ensures the callback runs even when the browser tab loses focus in XR
 */
export function useAnimationInterval(callback: () => void, intervalMs: number | null) {
  const callbackRef = useRef(callback)
  const accumulatedTimeRef = useRef(0)

  // Keep callback ref up to date
  callbackRef.current = callback

  useXenonFrame((delta) => {
    if (intervalMs === null) {
      accumulatedTimeRef.current = 0
      return
    }

    // Accumulate delta time (convert to ms)
    accumulatedTimeRef.current += delta * 1000

    // Fire callback when interval reached
    if (accumulatedTimeRef.current >= intervalMs) {
      callbackRef.current()
      accumulatedTimeRef.current = 0
    }
  })
}
