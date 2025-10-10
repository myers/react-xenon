# Getting Started

## Installation

Install React Xenon and its peer dependencies:

```bash
pnpm add @react-xenon/core @canvas-ui/react @canvas-ui/core
pnpm add @react-three/fiber @react-three/xr three
```

## Your First WebXR UI

Create a simple VR UI component:

```tsx
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Xenon } from '@react-xenon/core'
import { Flex, Text } from '@canvas-ui/react'

const store = createXRStore()

function App() {
  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <Canvas>
        <XR store={store}>
          <Xenon
            position={[0, 1.5, -1]}
            pixelWidth={512}
            pixelHeight={512}
            dpr={2}
          >
            <Flex
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1a1a1a',
              }}
            >
              <Text style={{ fontSize: 32, color: 'white' }}>
                Hello WebXR!
              </Text>
            </Flex>
          </Xenon>
        </XR>
      </Canvas>
    </>
  )
}
```

## Understanding the Components

### Xenon Component

The `Xenon` component is the main entry point for rendering Canvas UI to WebXR:

- **position**: 3D position in the scene `[x, y, z]`
- **pixelWidth/pixelHeight**: Resolution of the UI canvas
- **dpr**: Device pixel ratio for crisp rendering (2 recommended for VR)

### Canvas UI Components

Inside `Xenon`, you can use any Canvas UI components:

- `<Flex>` - Flexbox layout container
- `<Text>` - Rendered text
- `<Image>` - Images
- `<ScrollView>` - Scrollable containers
- And more...

## Next Steps

- Learn about [Event Handling](/guide/event-handling)
- Explore the [Xenon API](/api/xenon)
- Check out the [Music Player Example](/examples/music-player/)
