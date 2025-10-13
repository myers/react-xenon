import { createContext, useContext } from 'react'
import { XRPlatformAdapter } from './XRPlatformAdapter'

interface XenonContextValue {
  xrAdapter: XRPlatformAdapter
}

export const XenonContext = createContext<XenonContextValue | null>(null)

export function useXenonContext() {
  const context = useContext(XenonContext)
  if (!context) {
    throw new Error('useXenonContext must be used within a Xenon component')
  }
  return context
}
