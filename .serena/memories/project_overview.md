# Canvas UI + WebXR Experiment Project

## Purpose
This is an experimental project demonstrating **Canvas UI** (a React-based UI rendering system for HTML Canvas) integrated with **WebXR** for Meta Quest VR headsets. The project focuses on:

1. **OffscreenCanvas Integration**: Headless Canvas UI rendering without DOM mounting
2. **WebXR XRLayer Support**: Rendering Canvas UI to XR layers for VR interfaces
3. **Interactive VR UI**: Full pointer events, clicks, scrolling, and hover effects in VR
4. **Frame Callback System**: Efficient texture updates for WebXR rendering loop

## Key Features
- Side-by-side demo comparing Regular Canvas and OffscreenCanvas rendering
- ScrollView with programmatic scrolling and event recording/playback
- XR controller interaction mapping (pointer, clicks, thumbstick scrolling)
- React state management working seamlessly with Canvas UI in VR

## Tech Stack
- **Frontend Framework**: React 19.2.0
- **UI Rendering**: Canvas UI (@canvas-ui/core, @canvas-ui/react)
- **3D/VR**: Three.js + @react-three/fiber + @react-three/xr
- **Build Tool**: Vite 7.1.8
- **Language**: TypeScript (strict mode)
- **State Management**: Zustand, RxJS, Immer

## Development Environment
- Platform: macOS (Darwin)
- Node Package Manager: npm
- Local development uses Vite dev server