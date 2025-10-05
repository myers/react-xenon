# react-xenon - React based WebXR UI Framework

## TODO

- rename this, figure out how to include our needed changes to the libraries we use
- use the system keyboard to handle text input
  - System Keyboard in WebXR | Meta Horizon OS Developers <https://developers.meta.com/horizon/documentation/web/webxr-keyboard/>
- investigate <https://meta-quest.github.io/immersive-web-emulation-runtime/xplat.html>

## XRCanvasUIExample

A complete example of Canvas UI running on an XRLayer in WebXR.

### Features Demonstrated

1. **OffscreenCanvas Rendering**: Canvas UI renders to an OffscreenCanvas, which is displayed on an XRLayer
2. **Pointer Events**: XR controller ray interactions are converted to Canvas UI pointer events
3. **Click Detection**: Pointer down/up events enable full click interaction
4. **Scroll with Joystick**: XR controller thumbstick mapped to scroll events
5. **Hover Effects**: Pointer move events enable cursor changes and hover states
6. **React Integration**: Full React state management and updates work seamlessly

### How It Works

```
XR Controller → XRLayer (UV coords) → Event Bridge (pixel coords) → Canvas UI Events → React Components
```

1. XR controller fires pointer events on the XRLayer mesh
2. The event contains UV coordinates (0-1 range)
3. XRCanvasUILayer converts UV to pixel coordinates
4. Synthetic Canvas UI events are created and dispatched
5. Canvas UI handles hit testing and event propagation
6. React components receive events and can update state

### Usage

```tsx
import { XRCanvasUILayer } from './xr-canvas-ui'
import { Text, Flex } from '@canvas-ui/react'

<XRCanvasUILayer position={[0, 0, -1]} pixelWidth={1024} pixelHeight={1024}>
  <Flex>
    <Text>Hello WebXR!</Text>
  </Flex>
</XRCanvasUILayer>
```

### Props

- `pixelWidth`: Canvas width in pixels (default: 1024)
- `pixelHeight`: Canvas height in pixels (default: 1024)
- `dpr`: Device pixel ratio for crisp rendering (default: 1)
- `enableJoystickScroll`: Enable thumbstick scrolling (default: true)
- `scrollSensitivity`: Scroll speed multiplier (default: 50)
- All other props from `XRLayerProperties` (position, rotation, shape, etc.)

### Testing

1. Build and deploy to a web server with HTTPS
2. Access from Meta Quest browser
3. Click "Enter VR" button
4. Point controller at the UI panel
5. Press trigger to click
6. Use thumbstick to scroll

### Performance Tips

- Use `dpr: 2` for crisp text on Quest
- Keep pixel dimensions power-of-2 when possible (512, 1024, 2048)
- Use `repaintBoundary` on Canvas UI components that update frequently
- Consider using XRLayer's `quality: "text-optimized"` for text-heavy UIs
