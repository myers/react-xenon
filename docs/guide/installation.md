# Installation

::: warning EXPERIMENTAL
React Xenon is currently experimental. It's built on a fork of Canvas UI with OffscreenCanvas support for WebXR rendering. APIs may change as the project evolves.
:::

## Prerequisites

- Node.js 18+ and pnpm
- A WebXR-compatible browser (Chrome, Edge, or Meta Quest Browser)

## Install Dependencies

React Xenon requires installing the Canvas UI fork and React Xenon package from GitHub Pages-hosted tarballs:

```bash
npm create vite@latest my-xr-app -- --template react-ts
cd my-xr-app
pnpm install
```

Add the following dependencies:

```bash
# Install React Three Fiber and React Three XR
pnpm add three @react-three/fiber @react-three/xr

# Install Canvas UI fork and React Xenon from tarballs
pnpm add \
  https://icepick.info/react-xenon/deps/canvas-ui/canvas-ui-assert-2.0.0.tgz \
  https://icepick.info/react-xenon/deps/canvas-ui/canvas-ui-core-2.0.0.tgz \
  https://icepick.info/react-xenon/deps/canvas-ui/canvas-ui-react-2.0.0.tgz \
  https://icepick.info/react-xenon/deps/react-xenon/react-xenon-core-0.1.0.tgz

# Install dev dependencies
pnpm add -D @types/three @vitejs/plugin-basic-ssl
```

## Configure Vite for WebXR

WebXR requires HTTPS. Update your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
})
```

## Basic Example

Create a simple XR app in `src/App.tsx`:

```tsx
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Xenon } from '@react-xenon/core'
import { Flex, Text } from '@canvas-ui/react'

const store = createXRStore()

function XRApp() {
  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <Canvas>
        <XR store={store}>
          <Xenon pixelWidth={512} pixelHeight={512} position={[0, 1.6, -1]}>
            <Flex
              style={{
                flexDirection: 'column',
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 20,
                paddingBottom: 20,
                backgroundColor: '#1a1a2e',
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 32, color: '#eee', marginBottom: 10 }}>
                Hello WebXR!
              </Text>
              <Text style={{ fontSize: 18, color: '#aaa' }}>
                This UI is rendered with Canvas UI in VR
              </Text>
            </Flex>
          </Xenon>
        </XR>
      </Canvas>
    </>
  )
}

export default XRApp
```

## Run the Dev Server

```bash
pnpm dev
```

Visit `https://localhost:5173` (accept the self-signed certificate) and click "Enter VR" to view in your headset.

## Next Steps

- Learn about the [Xenon Component](/guide/xenon-component)
- Explore [Canvas UI components](https://github.com/kakera-org/canvas-ui)
- Check out our [examples](/examples)

## About Canvas UI Fork

React Xenon uses a fork of Canvas UI with the following modifications:

- **OffscreenCanvas support** - Enables rendering in WebXR worker contexts
- **HeadlessCanvas component** - For custom frame scheduling
- **BridgeEventBinding** - For programmatic event injection from XR controllers

The fork is maintained at [myers/canvas-ui](https://github.com/myers/canvas-ui) on the `feat/headless-canvas` branch.
