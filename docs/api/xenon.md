# Xenon

The `Xenon` component renders Canvas UI content to a WebXR quad layer in 3D space.

## Import

```tsx
import { Xenon } from '@react-xenon/core'
```

## Props

### position

- **Type:** `[number, number, number]`
- **Default:** `[0, 0, -2]`

Position of the layer in 3D space as `[x, y, z]` coordinates.

```tsx
<Xenon position={[0, 1.5, -1]}>
  {/* ... */}
</Xenon>
```

### pixelWidth

- **Type:** `number`
- **Default:** `1024`

Width of the canvas in pixels. Higher values provide more detail but impact performance.

### pixelHeight

- **Type:** `number`
- **Default:** `1024`

Height of the canvas in pixels.

### dpr

- **Type:** `number`
- **Default:** `2`

Device pixel ratio for rendering. Use `2` for crisp text in VR, or `1` for better performance.

### scale

- **Type:** `[number, number, number]`
- **Default:** `[1, -1, 1]`

Scale of the layer mesh. The default flips the Y-axis to match Canvas coordinate system.

### enableJoystickScroll

- **Type:** `boolean`
- **Default:** `true`

Enable scrolling via controller joystick.

### scrollSensitivity

- **Type:** `number`
- **Default:** `50`

Scroll speed when using joystick.

### Other Props

Xenon accepts all props from `@react-three/xr`'s `XRLayer` component, including:

- `rotation`
- `quaternion`
- `visible`
- etc.

## Example

```tsx
import { Xenon } from '@react-xenon/core'
import { Flex, Text, ScrollView } from '@canvas-ui/react'

function MyUI() {
  return (
    <Xenon
      position={[0, 1.5, -1]}
      pixelWidth={1024}
      pixelHeight={768}
      dpr={2}
      enableJoystickScroll={true}
    >
      <ScrollView style={{ height: 768 }}>
        <Flex
          style={{
            padding: 20,
            gap: 10,
            flexDirection: 'column',
          }}
        >
          <Text style={{ fontSize: 32 }}>Hello WebXR!</Text>
          <Text style={{ fontSize: 18 }}>
            Use your controller to interact.
          </Text>
        </Flex>
      </ScrollView>
    </Xenon>
  )
}
```

## Notes

- The `Xenon` component must be used inside an `<XR>` context from `@react-three/xr`
- Content is rendered to an `OffscreenCanvas` for optimal performance
- Events (clicks, hovers) are automatically handled via the event bridge
- Uses lazy rendering - only updates when content changes or events occur

## See Also

- [XenonAsImg](/api/xenon-as-img) - For 2D testing without VR
- [Event Handling Guide](/guide/event-handling)
