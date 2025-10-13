import { useEffect, useRef } from 'react'
import { useXenonContext } from '../XenonContext'

/**
 * Subscribe to Xenon's XR-aware frame loop
 *
 * This hook provides access to the WebXR-compatible animation frame loop.
 * Unlike requestAnimationFrame (which is throttled in XR sessions), this
 * hook uses XRSession.requestAnimationFrame when in VR/AR mode.
 *
 * @param callback - Called every frame with (deltaSeconds, timestampMs)
 *
 * @example
 * ```tsx
 * useXenonFrame((delta, time) => {
 *   // Update animation or game logic
 *   setRotation(prev => prev + delta * 0.5)
 * })
 * ```
 */
export function useXenonFrame(callback: (delta: number, time: number) => void) {
  const { xrAdapter } = useXenonContext()
  const callbackRef = useRef(callback)
  const lastTimeRef = useRef(0)

  // Keep callback ref fresh to avoid stale closures
  callbackRef.current = callback

  useEffect(() => {
    const frameCallback = (timestamp: number) => {
      // Calculate delta time in seconds
      const delta = lastTimeRef.current === 0
        ? 0
        : (timestamp - lastTimeRef.current) / 1000

      lastTimeRef.current = timestamp

      // Call user's callback with delta and timestamp
      callbackRef.current(delta, timestamp)
    }

    // Register with XRPlatformAdapter
    const unsubscribe = xrAdapter.onFrame(frameCallback)

    // Reset time on unmount
    return () => {
      unsubscribe()
      lastTimeRef.current = 0
    }
  }, [xrAdapter])
}
