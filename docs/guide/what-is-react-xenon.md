# What is React Xenon?

React Xenon is a WebXR UI library that enables you to build interactive user interfaces in virtual reality using React and Canvas UI. It specifically targets Meta Quest devices and other WebXR-compatible VR headsets.

## The Problem

Building UI in WebXR is challenging:
- Traditional DOM elements don't work in VR
- Three.js text rendering is limited
- Event handling for VR controllers is complex
- Performance optimization requires careful architecture

## The Solution

React Xenon solves these problems by:

1. **Canvas UI Integration**: Renders React components to canvas using Canvas UI
2. **WebXR Layer Rendering**: Displays the canvas as a quad layer in VR space
3. **Event Bridge**: Translates XR controller events to Canvas UI's event system
4. **Performance**: Uses OffscreenCanvas and lazy rendering for smooth VR

## Architecture

```
React Components (Canvas UI)
    ↓
HeadlessCanvas (renders to OffscreenCanvas)
    ↓
Xenon Component (XRLayer in 3D space)
    ↓
WebXR Display
```

## Key Features

### React-First
Write your UIs using familiar React patterns with full Canvas UI component support.

### Event-Driven
Clean event handling system automatically manages:
- Pointer events (click, hover, etc.)
- Scroll events (via joystick)
- Hit testing
- Event propagation

### TypeScript
Full type safety with detailed TypeScript definitions.

### Production-Ready
Used in real WebXR applications with proven performance on Meta Quest devices.

## When to Use React Xenon

React Xenon is ideal for:
- Building interactive menus and HUDs in VR
- Creating complex UI layouts (lists, grids, forms)
- Displaying rich text and images
- Applications that need React's component model in VR

React Xenon is **not** ideal for:
- 3D spatial UI (use Three.js directly)
- Simple text labels (use @react-three/drei `<Text>`)
- Performance-critical 3D rendering

## Next Steps

Ready to get started? Check out the [Getting Started guide](/guide/getting-started).
