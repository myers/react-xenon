import { useContext, useEffect, useRef } from 'react'
import { XenonContext } from '../XenonContext'

/**
 * Subscribe to Xenon's XR-aware frame loop
 *
 * This hook provides access to the WebXR-compatible animation frame loop.
 * When used inside a Xenon component, it uses XRSession.requestAnimationFrame
 * (which works properly in XR sessions). When used outside Xenon, it falls back
 * to requestAnimationFrame for standalone Canvas UI usage.
 *
 * @param callback - Called every frame with (deltaSeconds, timestampMs)
 *
 * @example
 * ```tsx
 * // Inside <Xenon> - uses XR-aware frame loop
 * useXenonFrame((delta, time) => {
 *   setRotation(prev => prev + delta * 0.5)
 * })
 *
 * // Outside <Xenon> - uses requestAnimationFrame
 * useXenonFrame((delta, time) => {
 *   setRotation(prev => prev + delta * 0.5)
 * })
 * ```
 */
export function useXenonFrame(callback: (delta: number, time: number) => void) {
  const xenonContext = useContext(XenonContext)
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

    // If inside Xenon context, use XR-aware frame loop
    if (xenonContext) {
      const unsubscribe = xenonContext.xrAdapter.onFrame(frameCallback)

      return () => {
        unsubscribe()
        lastTimeRef.current = 0
      }
    }

    // Otherwise, fall back to requestAnimationFrame
    let rafId: number
    const tick = (timestamp: DOMHighResTimeStamp) => {
      frameCallback(timestamp)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      lastTimeRef.current = 0
    }
  }, [xenonContext])
}
