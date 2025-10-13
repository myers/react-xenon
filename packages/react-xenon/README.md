# @react-xenon/core

Canvas UI components for WebXR - render React UIs in virtual reality.

## Installation

```bash
pnpm add @react-xenon/core @canvas-ui/react @react-three/fiber @react-three/xr three
```

## Usage

```tsx
import { Xenon, useXenonFrame } from '@react-xenon/core'
import { Flex, Text } from '@canvas-ui/react'
import { Canvas } from '@react-three/fiber'
import { XR } from '@react-three/xr'

function AnimatedUI() {
  const [rotation, setRotation] = useState(0)

  // XR-aware animation loop
  useXenonFrame((delta) => {
    setRotation(prev => prev + delta * 0.5)
  })

  return (
    <Flex style={{ padding: 20, transform: `rotate(${rotation}rad)` }}>
      <Text>Hello VR!</Text>
    </Flex>
  )
}

function App() {
  return (
    <Canvas>
      <XR>
        <Xenon position={[0, 1.6, -1]} pixelWidth={1024} pixelHeight={768}>
          <AnimatedUI />
        </Xenon>
      </XR>
    </Canvas>
  )
}
```

## API

### `<Xenon>`

Renders Canvas UI to an OffscreenCanvas and displays it on a WebXR layer.

**Props:**
- `pixelWidth` - Canvas width in pixels
- `pixelHeight` - Canvas height in pixels
- `dpr` - Device pixel ratio
- `enableJoystickScroll` - Enable XR controller joystick scrolling
- `scrollSensitivity` - Scroll speed multiplier
- All `XRLayerProperties` (position, rotation, scale, etc.)

### `useXenonFrame(callback)`

XR-aware animation frame hook. Works in both 2D and WebXR modes.

**Parameters:**
- `callback: (delta: number, time: number) => void` - Called every frame with delta time in seconds

**Example:**
```tsx
useXenonFrame((delta, time) => {
  // Update animation state
  setPosition(prev => prev + delta * speed)
})
```

## Architecture

Xenon uses a clean event bridge pattern (`BridgeEventBinding`) that translates external input sources (DOM events, XR controllers) to Canvas UI's internal event system, enabling:

- Automatic hover state management
- Proper event propagation
- Hit testing
- Scroll support via wheel events or XR joysticks

## License

MIT
