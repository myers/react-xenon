# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled
- **Target**: ES2020
- **Module System**: ESNext with bundler resolution
- **JSX**: react-jsx (React 17+ transform)
- **Decorators**: Experimental decorators enabled (legacy mode)

## Linting Rules
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedSideEffectImports: true`

## Code Patterns

### Canvas UI Specific
1. **Dynamic Text**: Use template literals in JSX, not expressions
   - ✅ Correct: `` `Clicks: ${count}` ``
   - ❌ Wrong: `Clicks: {count}`

2. **ScrollView API**: 
   - Use `scrollTop` and `scrollLeft` (numbers)
   - Or `scrollOffset` (Point object)
   - NOT `scrollY` or `scrollX`

3. **React Hooks**:
   - Use `useRef` for values that shouldn't trigger re-renders (like frame counters)
   - Use `useState` for values that should trigger re-renders

### File Organization
- Main app: `src/App.tsx`
- Components: `src/components/`
- Examples: `src/examples/`
- XR-specific code: `src/xr-canvas-ui/`

## Naming Conventions
- Components: PascalCase (e.g., `OffscreenCanvas`, `XRCanvasUILayer`)
- Files: Match component names
- Interfaces: PascalCase with descriptive suffixes (e.g., `OffscreenCanvasProps`, `FrameInfo`)

## Import Aliases
Configured in `vite.config.ts`:
- `@canvas-ui/core` → `./v/canvas-ui/packages/core/src`
- `@canvas-ui/react` → `./v/canvas-ui/packages/react/src`
- `@canvas-ui/assert` → `./v/canvas-ui/packages/assert/src`
- `@react-three/xr` → `./v/xr/packages/react/xr/src`