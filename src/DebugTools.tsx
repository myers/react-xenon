import { useEffect } from 'react'
import { Log } from '@canvas-ui/core'

// Disable all Canvas UI verbose logging
Log.disableAll = true

// Type definitions for Canvas UI internals
interface RenderObject {
  id?: string | number
  firstChild?: RenderObject
  nextSibling?: RenderObject
  parentData?: {
    nextSibling?: RenderObject
  }
  computedBounds?: {
    left: number
    top: number
    width: number
    height: number
  }
  offset?: { x: number, y: number }
  size?: { width: number, height: number }
  constructor: { name: string }
}

interface RenderCanvas {
  child?: RenderObject
  _firstChild?: RenderObject
}

interface CanvasUIGlobal {
  roots: Set<RenderCanvas>
  debug?: DebugAPI
}

interface DebugAPI {
  getElementById: (id: string | number) => RenderObject | null
  getElementPosition: (id: string | number) => { x: number, y: number, width: number, height: number } | null
  printSceneGraph: () => void
  diagnose: () => void
  waitForReady: (timeoutMs?: number) => Promise<boolean>
  getSceneSnapshot: () => any
}

declare global {
  interface Window {
    canvasui?: CanvasUIGlobal
    activeBinding?: {
      binding: RenderCanvas
      rootView: RenderObject
    }
  }
}

// Get the root view from RenderCanvas
function getRootView(): RenderObject | null {
  // Priority 1: Use window.activeBinding if available (most reliable)
  if (window.activeBinding?.rootView) {
    return window.activeBinding.rootView
  }

  // Priority 2: Find active root in roots Set
  if (!window.canvasui) return null

  const roots = Array.from(window.canvasui.roots)
  if (roots.length === 0) return null

  // Find the active root (one that has a child with children)
  // StrictMode creates multiple roots, we want the one that's actually mounted
  const activeRoot = roots.find(r => r.child && r.child.firstChild)
  if (activeRoot?.child) return activeRoot.child

  // Fallback: take the last root (newest) with a child
  const renderCanvas = roots.find(r => r.child) || roots[roots.length - 1]
  return renderCanvas?.child || renderCanvas?._child || null
}

// Traverse scene graph to find element by ID
function findElementById(node: RenderObject | undefined, id: string | number): RenderObject | null {
  if (!node) return null

  // Check current node
  if (node.id === id) return node

  // Check children (firstChild + siblings)
  let child = node.firstChild
  while (child) {
    const found = findElementById(child, id)
    if (found) return found

    // Move to next sibling (use nextSibling, not nextSiblingInChunk)
    child = child.parentData?.nextSibling || child.nextSibling
  }

  return null
}

// Get absolute position of element
function getAbsolutePosition(node: RenderObject): { x: number, y: number, width: number, height: number } {
  let x = 0
  let y = 0
  let current: RenderObject | undefined = node

  // Traverse up the tree accumulating offsets
  while (current) {
    if (current.offset) {
      x += current.offset.x
      y += current.offset.y
    }
    // Move to parent - this is simplified, real implementation would need proper parent tracking
    current = undefined // We'll use computedBounds instead
  }

  // Use computed bounds if available
  if (node.computedBounds) {
    return {
      x: node.computedBounds.left,
      y: node.computedBounds.top,
      width: node.computedBounds.width,
      height: node.computedBounds.height
    }
  }

  return {
    x: node.offset?.x || 0,
    y: node.offset?.y || 0,
    width: node.size?.width || 0,
    height: node.size?.height || 0
  }
}

// Print scene graph for debugging
function printSceneGraph(node: RenderObject | undefined, indent = 0, label = 'root'): void {
  if (!node) {
    console.log('  '.repeat(indent) + label + ': null')
    return
  }

  const prefix = '  '.repeat(indent)
  const id = node.id ? ` id="${node.id}"` : ''
  const type = node.constructor?.name || 'Unknown'
  const pos = node.offset ? ` offset=(${node.offset.x}, ${node.offset.y})` : ''
  const size = node.size ? ` size=${node.size.width}x${node.size.height}` : ''
  const bounds = node.computedBounds
    ? ` bounds=(${node.computedBounds.left}, ${node.computedBounds.top}, ${node.computedBounds.width}x${node.computedBounds.height})`
    : ''

  console.log(`${prefix}${label} [${type}]${id}${pos}${size}${bounds}`)

  let child = node.firstChild
  let childIndex = 0
  while (child) {
    printSceneGraph(child, indent + 1, `child[${childIndex}]`)
    child = child.parentData?.nextSibling || child.nextSibling
    childIndex++
  }
}

export function DebugTools() {
  useEffect(() => {
    if (!window.canvasui) {
      console.warn('[DebugTools] window.canvasui not found')
      return
    }

    // Create debug API that lazily accesses scene graph
    const debugAPI: DebugAPI = {
      getElementById: (id: string | number) => {
        const rootView = getRootView()
        if (!rootView) {
          console.warn('[DebugTools] RootView not found - Canvas may not be mounted yet')
          return null
        }
        const found = findElementById(rootView, id)
        if (!found) {
          console.warn(`[DebugTools] Element with id="${id}" not found`)
        }
        return found
      },

      getElementPosition: (id: string | number) => {
        const element = debugAPI.getElementById(id)
        if (!element) {
          return null
        }
        return getAbsolutePosition(element)
      },

      printSceneGraph: () => {
        console.log('[DebugTools] Scene Graph:')
        const rootView = getRootView()
        if (!rootView) {
          console.log('  RootView not found - Canvas may not be mounted yet')
          return
        }
        printSceneGraph(rootView, 0, 'rootView')
      },

      diagnose: () => {
        console.log('[DebugTools] === DIAGNOSTICS ===')

        if (!window.canvasui) {
          console.log('❌ window.canvasui does not exist')
          return
        }

        const roots = Array.from(window.canvasui.roots)
        console.log(`✓ Found ${roots.length} root(s)`)

        roots.forEach((root, i) => {
          console.log(`\n Root ${i} (${root.constructor.name}):`)
          console.log(`   - Has el: ${root.el !== undefined} ${root.el ? `(${root.el.constructor.name})` : ''}`)
          console.log(`   - Has child: ${root.child !== undefined}`)
          console.log(`   - Has _child: ${root._child !== undefined}`)
          console.log(`   - Child count: ${root._childCount}`)
          console.log(`   - Size: ${root.size ? `${root.size.width}x${root.size.height}` : 'not set'}`)
          console.log(`   - DPR: ${root.dpr}`)

          const rootView = root.child || root._child
          if (rootView) {
            console.log(`   - RootView type: ${rootView.constructor.name}`)
            console.log(`   - RootView has children: ${rootView._childCount || 0}`)
          } else {
            console.log(`   ⚠️  RootView not set - Binding may not have rendered yet`)
          }
        })

        console.log('\n=== END DIAGNOSTICS ===')
      },

      waitForReady: (timeoutMs = 2000) => {
        return new Promise((resolve) => {
          const startTime = Date.now()
          const checkInterval = 100

          const check = () => {
            // Check activeBinding first (most reliable)
            if (window.activeBinding?.rootView?.firstChild) {
              console.log('[DebugTools] ✓ Scene graph ready! (via activeBinding)')
              resolve(true)
              return
            }

            // Fallback to roots
            const rootView = getRootView()
            if (rootView?.firstChild) {
              console.log('[DebugTools] ✓ Scene graph ready!')
              resolve(true)
              return
            }

            if (Date.now() - startTime > timeoutMs) {
              console.warn('[DebugTools] ⚠️  Timeout waiting for scene graph')
              resolve(false)
              return
            }

            setTimeout(check, checkInterval)
          }

          check()
        })
      },

      getSceneSnapshot: () => {
        const rootView = getRootView()
        if (!rootView) {
          console.warn('[DebugTools] Cannot get snapshot - rootView not found')
          return null
        }

        function serialize(node: RenderObject): any {
          const result: any = {
            type: node.constructor.name,
            offset: node.offset,
            size: node.size
          }

          if (node.id) {
            result.id = node.id
          }

          // Serialize all children
          const children: any[] = []
          let child = node.firstChild
          while (child) {
            children.push(serialize(child))
            child = child.parentData?.nextSibling || child.nextSibling
          }

          if (children.length > 0) {
            result.children = children
          }

          return result
        }

        return serialize(rootView)
      }
    }

    window.canvasui.debug = debugAPI
    console.log('[DebugTools] Debug API ready! Use window.canvasui.debug')
    console.log('  - window.canvasui.debug.getElementById(id)')
    console.log('  - window.canvasui.debug.getElementPosition(id)')
    console.log('  - window.canvasui.debug.printSceneGraph()')
    console.log('  - window.canvasui.debug.diagnose()')
    console.log('  - window.canvasui.debug.getSceneSnapshot()')
    console.log('  - await window.canvasui.debug.waitForReady()')
  }, [])

  return null
}
