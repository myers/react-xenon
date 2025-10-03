# Suggested Development Commands

## Running the Project
- `npm run dev` - Start Vite development server (typically at http://localhost:5173)
- `npm run build` - Build for production (runs TypeScript compiler + Vite build)
- `npm run preview` - Preview production build locally

## Development Workflow
1. Start dev server: `npm run dev`
2. Make code changes (auto-reload enabled)
3. Verify with Playwright MCP screenshots (JPEG format preferred)

## Testing/Verification
- **Playwright MCP Integration**: Use Playwright MCP tools to take screenshots and verify UI
  - Always use JPEG format for screenshots (PNG files are too large)
  - When done with web demo, verify visually with Playwright MCP

## TypeScript
- TypeScript compiler: `tsc -b` (build mode)
- Strict mode enabled with additional linting rules
- Experimental decorators enabled

## Git
- Standard git commands available
- Note from project guidelines: Don't use `git add .`, add explicit filenames

## System Utilities (macOS/Darwin)
- `ls` - List directory contents
- `find` - Find files
- `grep` - Search file contents
- Standard POSIX utilities available