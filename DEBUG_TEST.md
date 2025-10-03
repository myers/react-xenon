# Canvas UI Debug Tools - Test Instructions

## How to Test the Improved Debug Tools

1. **Open the music player page**: http://localhost:5173/music-player.html

2. **Wait 200ms for scene graph to populate**, then open browser console and run:

### Test 1: Check if tools are ready
```javascript
window.canvasui.debug
// Should show the debug API object with all methods
```

### Test 2: Wait for scene graph
```javascript
await window.canvasui.debug.waitForReady()
// Should log: "✓ Scene graph ready! (via activeBinding)"
// Returns: true
```

### Test 3: Get element by ID (now works!)
```javascript
const yourContent = window.canvasui.debug.getElementById('your-content')
console.log(yourContent)
// Should find the element (previously failed)
```

### Test 4: Get element position
```javascript
const pos = window.canvasui.debug.getElementPosition('your-content')
console.log(pos)
// Should return: { x: 16, y: 16, width: 121, height: 25 }
```

### Test 5: Print scene graph (now shows all siblings!)
```javascript
window.canvasui.debug.printSceneGraph()
// Should show complete tree including:
// - your-content
// - playlists
// - favorites
// - history
```

### Test 6: Get scene snapshot (NEW!)
```javascript
const snapshot = window.canvasui.debug.getSceneSnapshot()
console.log(JSON.stringify(snapshot, null, 2))
// Returns serializable JSON of entire scene graph
```

### Test 7: Verify measurements
```javascript
const yourContent = window.canvasui.debug.getElementPosition('your-content')
const playlists = window.canvasui.debug.getElementPosition('playlists')
const gap = playlists.y - (yourContent.y + yourContent.height)
console.log({ yourContent, playlists, gap })
// Should show: gap = 24
```

## What Was Fixed

### 1. Sibling Traversal Bug ✓
- Changed from `parentData?.nextSiblingInChunk` to `parentData?.nextSibling`
- Now correctly traverses all siblings in scene graph

### 2. StrictMode Handling ✓
- `getRootView()` now checks `window.activeBinding` first
- Falls back to finding active root with children
- No more "RootView not found" errors

### 3. Active Binding Storage ✓
- `useBinding()` stores active binding on `window.activeBinding` after 100ms
- Only in development mode (`process.env.NODE_ENV === 'development'`)
- Provides most reliable access to scene graph

### 4. New getSceneSnapshot() Method ✓
- Serializes entire scene graph to JSON
- Useful for debugging and testing
- Includes type, id, offset, size, and children

### 5. Improved waitForReady() ✓
- Checks `window.activeBinding` first
- Falls back to checking roots
- More reliable detection of when scene is ready

### 6. Cleaner Console Output ✓
- Removed temporary console.log statements from binding.tsx
- Only shows actual debug API messages
- `Log.disableAll = true` suppresses verbose Canvas UI logs
