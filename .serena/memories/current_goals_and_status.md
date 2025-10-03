# Current Goals and Status

## Project Overview
Building a Canvas UI + OffscreenCanvas demo that will eventually integrate with WebXR for Meta Quest VR headsets.

## Current Status (as of 2025-10-03)

### ✅ Completed

1. **OffscreenCanvas Component** (`src/components/OffscreenCanvas.tsx`)
   - Headless Canvas UI rendering without DOM mounting
   - Frame callback system via `onFrameRendered` prop
   - Now uses PlatformAdapter for continuous rendering
   - Supports Canvas UI internal animations (scrollbar fade-out, etc.)

2. **Side-by-Side Demo** (`src/App.tsx`)
   - Regular Canvas (right) and OffscreenCanvas (left) comparison
   - ScrollView with 100 numbered squares (single column, vertical scroll)
   - Button with click counter
   - Scroll event recording and playback system (1606 recorded events)
   - Playback at 0.5x speed, first 10 events only

3. **Continuous Rendering Solution**
   - OffscreenCanvas now registers with `PlatformAdapter.onFrame()`
   - Enables `flushEnterFrame()` to run every frame
   - ScrollView animations (scrollbar fade-out) now work correctly
   - Frame counter shows continuous rendering

4. **WebXR Integration Strategy** (documented in `WEBXR_PLANS.md`)
   - Designed XRPlatformAdapter approach
   - Will use XRSession.requestAnimationFrame for VR render loop
   - No code changes needed to RenderCanvas
   - Demo uses WebPlatformAdapter, XR will use XRPlatformAdapter

### 🔧 Current Implementation Details

**Scroll Event Playback:**
- Playing first 10 recorded events at half speed (0.5x)
- Both canvases receive same playback events
- Events stop after 10 iterations (no loop)
- Recorded from user manually scrolling Regular Canvas

**Frame Callback System:**
- `onFrameRendered` callback fires when Canvas UI actually renders
- Uses `frameEnd` event from RenderCanvas
- Provides: canvas reference, frame number, timestamp
- Ready for WebXR texture update integration

### 🎯 Next Goals

#### Short Term
1. **Verify Scrollbar Fade Animation**
   - Test that scrollbar fades out on OffscreenCanvas like it does on Regular Canvas
   - Currently in progress - need to observe scrollbar behavior after scroll stops

2. **Improve Scroll Playback Demo**
   - Consider looping the playback animation
   - Maybe show different playback speeds
   - Or play different portions of the recorded events

#### Medium Term (WebXR Integration)
1. **Implement XRPlatformAdapter**
   - Create `src/xr-canvas-ui/XRPlatformAdapter.ts`
   - Implement `IPlatformAdapter` interface
   - Use `XRSession.requestAnimationFrame` instead of browser RAF

2. **Update OffscreenCanvas Component**
   - Add optional `platformAdapter` prop
   - Default to WebPlatformAdapter for demo
   - Allow XRPlatformAdapter injection for XR mode

3. **Update XRCanvasUILayer**
   - Create XRPlatformAdapter instance
   - Start XR loop when session begins
   - Stop loop when session ends
   - Pass adapter to OffscreenCanvas

4. **Test in WebXR**
   - Build and deploy to HTTPS server
   - Test on Meta Quest browser
   - Verify pointer events (controller ray)
   - Verify scrolling with thumbstick
   - Verify scrollbar animations in VR

#### Long Term
1. **Performance Optimization**
   - Profile frame times in VR
   - Optimize texture updates
   - Consider repaint boundaries for frequently updating components

2. **Additional Features**
   - More interactive UI elements
   - Text input in VR
   - Complex layouts
   - State management examples

## Technical Patterns Established

### Canvas UI Specific
- Use template literals for dynamic text: `` `Text: ${variable}` ``
- ScrollView API: `scrollTop` and `scrollLeft` (not scrollY/scrollX)
- `useRef` for values that shouldn't trigger re-renders (frame counters)
- `useState` for values that should trigger re-renders

### OffscreenCanvas Pattern
- Create RenderCanvas with `createElement('Canvas')`
- Call `prepareInitialFrame()` first
- Create Surface and Rasterizer manually
- Register with PlatformAdapter for continuous rendering
- Listen to `frameEnd` event for render completion

### WebXR Pattern (Designed)
- Custom PlatformAdapter per XR session
- XRSession.requestAnimationFrame drives rendering
- No manual RAF needed
- frameDirty flag provides lazy updates automatically

## Files Modified in This Session

- `src/components/OffscreenCanvas.tsx` - Added PlatformAdapter integration
- `src/App.tsx` - Scroll event playback with first 10 events at 0.5x speed
- `WEBXR_PLANS.md` - Created comprehensive WebXR integration strategy

## Known Issues

- Frame counter sometimes doesn't increment (FIXED - changed to useRef)
- Regular Canvas not showing scroll playback (different scroll positions expected)
- Need to verify scrollbar fade-out actually works on OffscreenCanvas

## Questions to Explore

1. Does scrollbar fade-out now work correctly on OffscreenCanvas?
2. Should we implement the full XRPlatformAdapter now or wait?
3. Should we improve the scroll playback demo?
4. What other Canvas UI animations should we test?