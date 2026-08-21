# Extension Architecture

This document outlines the architectural structure and interaction flow of the Image Viewer Chrome Extension.

## Component Overview

The extension is designed around the separation of powers between the Extension Background Context and the Active Tab DOM space, using a custom isolated Shadow DOM.

```
┌───────────────────────────────────────────────┐
│              Background Context               │
│  - Service Worker (background.js)             │
│  - Registers Context Menus                    │
│  - Emits events when context menu is clicked  │
└──────────────────────┬────────────────────────┘
                       │
             chrome.tabs.sendMessage
                       │
                       ▼
┌───────────────────────────────────────────────┐
│               Active Tab DOM                  │
│  - Content Script (content.js)                │
│  - Receives click notification & image URL    │
│  - Instantiates closed Shadow DOM container   │
│  - Renders UI Overlay isolated from host styles│
└───────────────────────────────────────────────┘
```

## Shadow DOM Isolation

To prevent host website stylesheet leakage (such as custom styles targetting `img`, generic divs, or buttons), the Image Viewer UI is entirely loaded inside a closed shadow root:

```typescript
const container = document.createElement('div');
const shadowRoot = container.attachShadow({ mode: 'closed' });
```

This isolates the extension's rendering environment, ensuring consistent look-and-feel across all web platforms.

## Core Interaction Engines

Calculations for zoom boundaries, scaling factors, and pan translations are completely separated from the DOM. This logic resides in pure, framework-free modules under `src/core/` (e.g. `zoom.ts`, `pan.ts`), facilitating unit testing without virtual DOM dependencies.
