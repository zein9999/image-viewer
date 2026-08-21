# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0](https://github.com/zein9999/image-viewer/compare/image-viewer-v0.1.0...image-viewer-v0.2.0) (2026-08-21)


### Features

* configure release please for automated versioning and releases ([7f226fb](https://github.com/zein9999/image-viewer/commit/7f226fb8431c21c1d07be8d00b881f3ffc9e0d8c))
* configure release please for automated versioning and releases ([ba9da94](https://github.com/zein9999/image-viewer/commit/ba9da942f423c0ff467ff81c134b96bd966a9517))
* initial release MVP v0.1.0 ([0792bfe](https://github.com/zein9999/image-viewer/commit/0792bfe17486d97db25865ab10c6e76ab0aeddbc))


### Bug Fixes

* intercept escape key in capute phase to prevent page conflict ([b6ad53d](https://github.com/zein9999/image-viewer/commit/b6ad53d1290b427247bac6300d7e9a3334320a1b))
* intercept escape key in capute phase to prevent page conflict ([d83ac0f](https://github.com/zein9999/image-viewer/commit/d83ac0fc4715863094ad2016988c460c9107a40b))

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
