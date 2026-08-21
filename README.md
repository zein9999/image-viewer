# Image Viewer Chrome Extension (MVP v0.1)

A lightweight, local-first, highly secure Chrome and Brave extension to inspect images comfortably in a isolated overlay without page distractions.

## Features

- **Contextual Inspection**: Right-click any image and select "Open with Image Viewer".
- **Advanced Navigation**: Smooth zooming (mouse wheel or controls) and panning (drag mechanics).
- **DOM Isolation**: Powered by a Closed Shadow DOM, preventing host website style bleeding.
- **Privacy & Security**: Zero trackers, zero analytics, zero external API requests. Local-first implementation requesting minimal permissions.

---

## Installation & Local Development

### Prerequisites

- Node.js (v20+)
- npm

### 1. Build the Extension

In your project directory, install dependencies and compile the assets:

```bash
npm install
npm run build
```

Alternatively, to start Vite's watch mode for active development:

```bash
npm run dev
```

### 2. Load into Chrome / Brave

1. Open your browser and navigate to `chrome://extensions/` or `brave://extensions/`.
2. Enable **Developer mode** using the toggle switch in the top-right corner.
3. Click **Load unpacked** in the top-left corner.
4. Select the `dist/` directory inside this project's folder.

---

## Testing & Quality Control

### Unit Tests

Core math calculations (zoom, pan, coordinates, limits) are tested with **Vitest**:

```bash
npm run test:run
```

### Linting & Formatting

Verify code quality and style guides:

```bash
npm run lint
npm run format
```

---

## Architecture & Workflows

Details regarding codebase designs, security practices, and Gitflow workflows can be found in the `docs/` directory:

- [Architecture Overview](docs/architecture.md)
- [Development Guide](docs/development.md)
- [Security and Permissions Analysis](docs/security.md)
