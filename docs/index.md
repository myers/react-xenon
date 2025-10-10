---
layout: home

hero:
  name: React Xenon
  text: WebXR UI for React
  tagline: Build interactive user interfaces in virtual reality using React and Canvas UI
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View Examples
      link: /examples
  image:
    src: /logo.svg
    alt: React Xenon

features:
  - icon: 🥽
    title: WebXR Native
    details: Built specifically for WebXR, targeting Meta Quest and other VR headsets with optimized rendering.
  - icon: ⚛️
    title: React-Powered
    details: Write your VR UIs using familiar React patterns and components with full Canvas UI integration.
  - icon: 🎯
    title: Event-Driven
    details: Clean event handling system that translates XR controller inputs to Canvas UI events seamlessly.
  - icon: 🚀
    title: High Performance
    details: Efficient rendering with OffscreenCanvas and lazy frame updates for smooth VR experiences.
---

## Quick Example

```tsx
import { Xenon } from '@react-xenon/core'
import { Flex, Text } from '@canvas-ui/react'

function MyVRUI() {
  return (
    <Xenon
      position={[0, 1.5, -1]}
      pixelWidth={1024}
      pixelHeight={1024}
      dpr={2}
    >
      <Flex
        style={{
          padding: 20,
          backgroundColor: '#1a1a1a',
          borderRadius: 8,
        }}
      >
        <Text style={{ fontSize: 24, color: 'white' }}>
          Hello WebXR!
        </Text>
      </Flex>
    </Xenon>
  )
}
```

## Why React Xenon?

React Xenon bridges Canvas UI (a React reconciler that renders to canvas) with WebXR, enabling React-based UIs to run in VR headsets. It provides:

- **Clean API**: Simple components that integrate naturally with React Three Fiber and @react-three/xr
- **Modern Architecture**: Built on the latest Canvas UI patterns with HeadlessCanvas and BridgeEventBinding
- **Developer Experience**: Full TypeScript support with detailed type definitions
- **Production Ready**: Used in real WebXR applications targeting Meta Quest devices

## Examples

Check out our live examples:

- [Music Player](/examples/music-player/) - Full-featured music player with album art, playlists, and controls
- [Basic Example](/examples/basic/) - Simple getting started example
- [Event Test](/examples/event-test/) - Interactive event handling demonstration

## Get Started

Install React Xenon in your project:

```bash
pnpm add @react-xenon/core @canvas-ui/react @canvas-ui/core
```

Follow our [Getting Started guide](/guide/getting-started) to build your first WebXR UI.
