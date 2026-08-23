# Contributing to Image Viewer

Thank you for your interest in contributing to Image Viewer! This guide covers everything you need to know about setting up your local environment, building the extension, running tests, and submitting changes.

---

## Local Development & Setup

### Prerequisites

- **Node.js**: `v24+`
- **npm**: `v10+`

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/zein9999/image-viewer.git
cd image-viewer

# Install dependencies
npm install
```

### 2. Build the Extension

```bash
# Compile production bundle
npm run build

# Or start Vite in watch mode for live development
npm run dev
```

### 3. Load Extension into Chrome / Brave

1. Open your browser and navigate to `chrome://extensions/` (or `brave://extensions/`).
2. Enable **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked** in the top-left corner.
4. Select the `dist/` directory inside this project folder.
5. Whenever you make changes, click the reload icon on the extension card in `chrome://extensions/`.

---

## Testing & Quality Control

Before submitting any code, ensure all automated checks pass:

### Unit Tests (Vitest)

Core math calculations (zoom, pan, coordinates, limits) are tested with **Vitest**:

```bash
npm run test:run
```

### Code Formatting (Prettier)

```bash
npm run format
```

### Linting (ESLint)

```bash
npm run lint
```

### TypeScript Type Checking

```bash
npm run typecheck
```

---

## Submitting Changes

1. **Create a branch**:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Commit your changes using Conventional Commits**:
   - `feat(scope): add new feature`
   - `fix(scope): fix a bug`
   - `refactor(scope): refactor code`
   - `style(scope): format code`
   - `docs(scope): update documentation`

3. **Push to your branch**:

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request**:
   - Target the `develop` branch.
   - Describe what changed and include screenshots or GIFs if relevant.
