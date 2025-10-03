# Task Completion Checklist

## When a Task is Completed

### 1. Verify Code Compiles
- Ensure no TypeScript errors
- Check console for warnings (Vite dev server auto-compiles)

### 2. Visual Verification
- **REQUIRED**: Take Playwright MCP screenshot to verify UI
  - Use JPEG format (not PNG - files are too large)
  - Navigate to the page and capture the current state
  - Verify both Regular Canvas and OffscreenCanvas if applicable

### 3. Test Functionality
- If implementing interactive features:
  - Test pointer events (clicks, hover)
  - Test scrolling (both manual and programmatic)
  - Verify frame callbacks fire correctly
  
### 4. Git Commits
- Add files explicitly by name (not `git add .`)
- Write descriptive commit messages
- Don't push unless explicitly requested

## No Automated Testing
This project currently has no automated test suite, linting, or formatting commands configured. Verification is manual via:
- TypeScript compilation
- Visual inspection with Playwright screenshots
- Manual testing in browser/VR headset

## WebXR Testing
For WebXR features:
1. Build for production
2. Deploy to HTTPS server
3. Access from Meta Quest browser
4. Test in VR with controllers