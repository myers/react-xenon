# Codebase Structure

## Root Directory Layout
```
/
├── src/                    # Source code
├── v/                      # Vendored dependencies (gitignored)
│   ├── canvas-ui/         # Canvas UI library source
│   └── xr/                # React Three XR library source
├── node_modules/          # NPM dependencies
├── .playwright-mcp/       # Playwright screenshots/test artifacts
├── .serena/              # Serena MCP configuration
├── vite.config.ts        # Vite configuration with path aliases
├── tsconfig.json         # TypeScript project references
├── tsconfig.app.json     # App TypeScript config
├── package.json          # NPM package configuration
└── index.html            # Entry HTML file
```

## Source Code Structure (`src/`)
```
src/
├── App.tsx                           # Main demo app
├── main.tsx                          # React entry point
├── components/
│   └── OffscreenCanvas.tsx          # Headless Canvas UI component
├── xr-canvas-ui/
│   ├── XRCanvasUILayer.tsx          # XR layer integration
│   ├── CanvasUIOffscreenRenderer.tsx # Offscreen rendering logic
│   └── index.ts                      # Exports
├── examples/
│   ├── XRCanvasUIExample.tsx        # Complete WebXR example
│   └── README.md                     # XR integration documentation
└── webxr-layers-polyfill.js         # Polyfill for XR layers
```

## Key Files

### Core Components
- **`src/App.tsx`**: Main demo showing side-by-side Regular Canvas and OffscreenCanvas with ScrollView, click tracking, and scroll event playback
- **`src/components/OffscreenCanvas.tsx`**: Core OffscreenCanvas component with frame callbacks and manual rendering
- **`src/xr-canvas-ui/XRCanvasUILayer.tsx`**: WebXR integration - renders Canvas UI to XR layers with pointer events

### Configuration
- **`vite.config.ts`**: Configures path aliases to vendored dependencies, Babel decorators plugin
- **`tsconfig.app.json`**: TypeScript strict mode, ES2020 target, experimental decorators

### Documentation
- **`src/examples/README.md`**: Comprehensive WebXR integration guide
- **`CLAUDE.md`**: Project-specific Claude Code guidelines (Playwright JPEG screenshots)

## Vendored Dependencies (`/v`)
The project uses local source copies of:
- Canvas UI library (modified/development version)
- React Three XR (modified/development version)

These are gitignored and likely symlinked or git submodules.