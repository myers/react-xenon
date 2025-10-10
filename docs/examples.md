# Examples

Explore our interactive examples to see React Xenon in action.

## Music Player

A full-featured music player with album art, playlists, and playback controls. This example demonstrates:
- Complex layouts with Canvas UI components
- Interactive buttons and controls
- State management with Zustand
- Custom fonts and images
- Multiple demo variants (XR, 2D img, Canvas UI)

<a href="./examples/music-player/" target="_blank">View Music Player Example →</a>

**Features:**
- Album art display
- Track list with selection
- Play/pause, skip controls
- Progress bar with seeking
- Volume control
- Responsive layout

## Basic Example

A simple getting started example showing the minimal setup needed for React Xenon.

<a href="./examples/basic/" target="_blank">View Basic Example →</a>

**What you'll learn:**
- Basic Xenon component usage
- Simple Canvas UI layout
- Text rendering
- Entry to VR

## Event Test

Interactive demonstration of event handling in React Xenon.

<a href="./examples/event-test/" target="_blank">View Event Test Example →</a>

**Features:**
- Click event handling
- Hover effects
- Event recording and playback
- Visual feedback

## Running Examples Locally

Clone the repository and run any example:

```bash
git clone https://github.com/your-username/react-xenon.git
cd react-xenon
pnpm install
cd examples/music-player
pnpm dev
```

The dev server runs on HTTPS (required for WebXR) at `https://localhost:5173`.

## Testing in VR

To test in a Meta Quest:

1. Ensure your Quest and dev machine are on the same network
2. Run the dev server with `--host`: `pnpm dev --host`
3. Note your local IP (e.g., `192.168.1.100`)
4. In Quest browser, navigate to `https://192.168.1.100:5173`
5. Accept the self-signed SSL certificate warning
6. Click "Enter VR" to start

## Source Code

All examples are open source. Browse the code on GitHub to learn implementation details:

- [Music Player Source](https://github.com/your-username/react-xenon/tree/main/examples/music-player)
- [Basic Source](https://github.com/your-username/react-xenon/tree/main/examples/basic)
- [Event Test Source](https://github.com/your-username/react-xenon/tree/main/examples/event-test)
