# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-08-21

### Added

- Context menu option "Open with Image Viewer" registered for image elements.
- Isolated Closed Shadow DOM overlay container preventing host page CSS bleed.
- Drag-to-pan image movement mechanics.
- Mouse wheel and toolbar control buttons for Zoom In and Zoom Out.
- Reset control button to restore scale and pan coordinates.
- Dismissal of the viewer via `Escape` key or clicking the backdrop.
- Scroll lock on target page body while viewer is open.
- Multi-entry point Vite configuration for Chrome Extension Manifest V3 packaging.
- Vitest configuration with unit tests for pure zoom and pan math engines.
- Prettier, ESLint, and TypeScript strict compiler controls.
- GitHub Actions CI workflow targetting `develop` and `main` branches.
- GitHub Actions CD Release packaging and auto-release workflow.
- Custom security check script `scripts/check-permissions.js` to fail CI if permissions creep occurs.
