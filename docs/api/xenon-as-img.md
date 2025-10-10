# XenonAsImg

The `XenonAsImg` component renders Canvas UI content to an HTML `<img>` element for 2D testing without requiring VR.

## Import

```tsx
import { XenonAsImg } from '@react-xenon/core'
```

## Use Case

Use `XenonAsImg` when you want to:
- Test your Canvas UI layouts without VR hardware
- Create 2D previews of your VR UIs
- Build hybrid apps with both 2D and VR modes

## Props

### width

- **Type:** `number`
- **Required:** Yes

Width of the image in pixels.

### height

- **Type:** `number`
- **Required:** Yes

Height of the image in pixels.

### dpr

- **Type:** `number`
- **Default:** `2`

Device pixel ratio for rendering.

### Other Props

Accepts all standard HTML `<img>` props:
- `style`
- `className`
- `alt`
- etc.

## Example

```tsx
import { XenonAsImg } from '@react-xenon/core'
import { Flex, Text, Image } from '@canvas-ui/react'

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Music Player Preview</h1>
      <XenonAsImg
        width={900}
        height={600}
        dpr={2}
        style={{
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <Flex
          style={{
            width: 900,
            height: 600,
            padding: 40,
            backgroundColor: '#1a1a1a',
          }}
        >
          <Text style={{ fontSize: 48, color: 'white' }}>
            Music Player
          </Text>
        </Flex>
      </XenonAsImg>
    </div>
  )
}
```

## How It Works

1. Renders Canvas UI to an `OffscreenCanvas`
2. Converts the canvas to a PNG blob on each frame
3. Updates the `<img>` element's src with the blob URL
4. Forwards mouse events to Canvas UI's event system

## Event Handling

`XenonAsImg` supports full event handling including:
- Click events (`onClick`)
- Hover events (`onPointerEnter`, `onPointerLeave`)
- Move events (`onPointerMove`)

Events are automatically converted from mouse coordinates to canvas coordinates.

## Performance

Note that `XenonAsImg` is less performant than `Xenon` in VR because:
- Converts canvas to image blob on every frame
- Runs in the main thread (not OffscreenCanvas worker)
- Creates new object URLs

Use it for development/testing, not production 2D apps. For production 2D, use Canvas UI's `<Canvas>` component directly.

## Comparison

| Feature | Xenon | XenonAsImg |
|---------|-------|------------|
| **Target** | WebXR/VR | 2D DOM |
| **Output** | XR Quad Layer | HTML `<img>` |
| **Performance** | High (GPU) | Medium (blob conversion) |
| **Use Case** | Production VR | Testing/Preview |

## See Also

- [Xenon](/api/xenon) - For WebXR/VR rendering
- [Canvas UI Canvas](https://github.com/pmndrs/canvas-ui) - For production 2D apps
