---
layout: home

hero:
  name: React Xenon
  text: A UI library for react-xr
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
    details: Built specifically for WebXR to use XRLayers, targeting Meta Quest with optimized rendering.
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

## CAUTION

This is an early release, not quite ready for prime time.

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

React Xenon bridges [Canvas UI](https://alibaba.github.io/canvas-ui/) with WebXR, enabling React-based UIs to run in VR headsets. It provides:

- **Clean API**: Simple components that integrate naturally with [React Three Fiber](https://r3f.docs.pmnd.rs) and [@react-three/xr](https://pmndrs.github.io/xr/docs/)
- **Developer Experience**: Full TypeScript support with detailed type definitions
- **XRLayer Support**: XRLayers allow for crisp text

## Examples

Check out our live examples:

- [Basic Example](/examples/basic/) - Simple getting started example
- [Music Player](/examples/music-player/) - Full-featured music player with album art, playlists, and controls

## Get Started

Follow our [Getting Started guide](/guide/getting-started) to build your first WebXR UI.
