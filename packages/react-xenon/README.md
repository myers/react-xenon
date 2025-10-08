# @react-xenon/core

Canvas UI components for WebXR - render React UIs in virtual reality.

## Installation

```bash
pnpm add @react-xenon/core @canvas-ui/react @react-three/fiber @react-three/xr three
```

## Usage

### WebXR (VR/AR)

```tsx
import { Xenon } from '@react-xenon/core'
import { Flex, Text } from '@canvas-ui/react'
import { Canvas } from '@react-three/fiber'
import { XR } from '@react-three/xr'

function App() {
  return (
    <Canvas>
      <XR>
        <Xenon position={[0, 1.6, -1]} pixelWidth={1024} pixelHeight={768}>
          <Flex style={{ padding: 20 }}>
            <Text>Hello VR!</Text>
          </Flex>
        </Xenon>
      </XR>
    </Canvas>
  )
}
```

### DOM (2D Testing)

```tsx
import { XenonAsImg } from '@react-xenon/core'
import { Flex, Text } from '@canvas-ui/react'

function App() {
  return (
    <XenonAsImg width={400} height={300} dpr={2}>
      <Flex style={{ padding: 20 }}>
        <Text>Hello Canvas UI!</Text>
      </Flex>
    </XenonAsImg>
  )
}
```

## Components

### `<Xenon>`

Renders Canvas UI to an OffscreenCanvas and displays it on a WebXR layer.

**Props:**
- `pixelWidth` - Canvas width in pixels
- `pixelHeight` - Canvas height in pixels
- `dpr` - Device pixel ratio
- `enableJoystickScroll` - Enable XR controller joystick scrolling
- `scrollSensitivity` - Scroll speed multiplier
- All `XRLayerProperties` (position, rotation, scale, etc.)

### `<XenonAsImg>`

Renders Canvas UI to an `<img>` element for 2D testing.

**Props:**
- `width` - Image width
- `height` - Image height
- `dpr` - Device pixel ratio
- All `ImgHTMLAttributes`

## Architecture

Xenon uses a clean event bridge pattern (`BridgeEventBinding`) that translates external input sources (DOM events, XR controllers) to Canvas UI's internal event system, enabling:

- Automatic hover state management
- Proper event propagation
- Hit testing
- Scroll support via wheel events or XR joysticks

## License

MIT
