<div align="center">

  <img src="src/icons/icon-128.png" alt="Image Viewer Logo" width="96" />

  <h1>Image Viewer</h1>

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Add_to_Chrome-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-24%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Testing: Vitest](https://img.shields.io/badge/Testing-Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Linting: ESLint](https://img.shields.io/badge/Linting-ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Code Style: Prettier](https://img.shields.io/badge/Code%20Style-Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)](https://prettier.io/)

[Installation](#installation) · [Features](#features) · [How to Use](#how-to-use) · [Contributing](CONTRIBUTING.md) · [License](#license)

</div>

<p align="center">
  <em>A lightweight, local-first Chrome & Brave extension to inspect images comfortably in an isolated overlay without page distractions.</em>
</p>

## Installation

Install the extension directly from the **[Chrome Web Store](https://chromewebstore.google.com/)**.

Compatible with **Google Chrome**, **Brave**, **Microsoft Edge**, and other Chromium-based browsers.

## Features

- **Contextual Inspection**: Right-click any image and select *"Open with Image Viewer"*.
- **Advanced Navigation**: Smooth zooming (mouse wheel or buttons) and fluid click-and-drag panning.
- **Visual Isolation**: Fully isolated styling (Shadow DOM) so the host website's CSS never conflicts with or breaks the viewer.
- **Rotation & Reset**: Rotate images 90° clockwise/counter-clockwise and reset zoom/pan with a single keypress.
- **Real-Time Settings**: Adjust backdrop opacity, zoom sensitivity, double-click zoom, and keyboard shortcuts in real-time.
- **Fullscreen & Focus Mode**: Immersive fullscreen support and toggleable HUD for a distraction-free experience.
- **Privacy & Security First**: Zero trackers, zero analytics, zero external network requests. 100% local and safe.

## How to Use

![Demo of the extension in action](assets/demo.gif)

1. **Activate**: Right-click on any image and select **"Open with Image Viewer"** from the context menu.
2. **Navigate & Controls**:
   - **Zoom**: Use mouse wheel, zoom buttons, or `+` / `-` keys
   - **Pan**: Click and drag the image, or use arrow keys
   - **Rotate**: Use rotation buttons or `Q` (counter-clockwise) / `E` (clockwise) keys
   - **Reset**: Press `R` or click the reset button to return to original zoom and position
   - **Fullscreen**: Press `F` or click the fullscreen button
   - **Hide HUD**: Press `H` or click the hide HUD button to hide controls
   - **Close**: Press `Esc` or click the close button

## Contributing & Local Setup

Interested in developing, building from source, or running tests? Check out the [Contributing Guide](CONTRIBUTING.md) for full step-by-step instructions.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.