import viewerStyles from './viewer.css?inline';
import { calculateZoomIn, calculateZoomOut, resetZoom, calculateZoomTargetPan } from '../core/zoom';
import { calculatePan, resetPan, PanState } from '../core/pan';
import { ViewerSettings } from '../shared/types';

const DEFAULT_SETTINGS: ViewerSettings = {
  backdropOpacity: 85,
  enableShortcuts: true,
  zoomSensitivity: 'normal',
  closeOnBackdropClick: true,
  initialFitMode: 'fit',
};

export class ImageViewer {
  private container: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private imageElement: HTMLImageElement | null = null;
  private fullscreenBtn: HTMLButtonElement | null = null;
  private settings: ViewerSettings = DEFAULT_SETTINGS;

  // Interactivity state
  private scale: number = 1.0;
  private rotation: number = 0;
  private panState: PanState = { x: 0, y: 0 };
  private isDragging: boolean = false;
  private startMouseX: number = 0;
  private startMouseY: number = 0;
  private initialPanX: number = 0;
  private initialPanY: number = 0;
  private ticking: boolean = false;

  constructor(private imageUrl: string) {}

  public show(): void {
    // Prevent duplicate viewer
    if (document.getElementById('image-viewer-root')) {
      return;
    }

    chrome.storage.local.get(DEFAULT_SETTINGS, (items) => {
      this.settings = items as ViewerSettings;
      this.initializeViewer();
    });
  }

  private initializeViewer(): void {
    // Create wrapper div in the main DOM
    this.container = document.createElement('div');
    this.container.id = 'image-viewer-root';

    // Attach closed Shadow DOM to completely isolate CSS
    this.shadowRoot = this.container.attachShadow({ mode: 'closed' });

    // Inject styles
    const styleTag = document.createElement('style');
    styleTag.textContent = viewerStyles;
    this.shadowRoot.appendChild(styleTag);

    // Build the markup
    const overlay = document.createElement('div');
    overlay.className = 'viewer-overlay';

    // Apply dynamic backdrop opacity setting
    overlay.style.backgroundColor = `rgba(0, 0, 0, ${this.settings.backdropOpacity / 100})`;

    // Top-right Window controls (Fullscreen + Close)
    const topControls = document.createElement('div');
    topControls.className = 'viewer-top-controls';

    this.fullscreenBtn = document.createElement('button');
    this.fullscreenBtn.className = 'viewer-top-btn';
    this.fullscreenBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`;
    this.fullscreenBtn.title = 'Toggle Fullscreen (F)';
    this.fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFullscreen();
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'viewer-top-btn';
    closeBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    closeBtn.title = 'Close (Esc)';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
    });

    topControls.appendChild(this.fullscreenBtn);
    topControls.appendChild(closeBtn);
    overlay.appendChild(topControls);

    const imageContainer = document.createElement('div');
    imageContainer.className = 'viewer-image-container';

    this.imageElement = document.createElement('img');
    this.imageElement.className = 'viewer-image';
    this.imageElement.src = this.imageUrl;
    this.imageElement.alt = 'Image Viewer';

    // Apply dynamic layout fit mode setting
    if (this.settings.initialFitMode === 'original') {
      this.imageElement.style.maxWidth = 'none';
      this.imageElement.style.maxHeight = 'none';
    }

    imageContainer.appendChild(this.imageElement);
    overlay.appendChild(imageContainer);

    // Controls container
    // Controls container
    const controls = document.createElement('div');
    controls.className = 'viewer-controls';

    const rotateLeftBtn = document.createElement('button');
    rotateLeftBtn.className = 'viewer-btn';
    rotateLeftBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>`;
    rotateLeftBtn.title = 'Rotate 90° Counter-Clockwise (Q)';
    rotateLeftBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleRotateLeft();
    });

    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'viewer-btn';
    zoomOutBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
    zoomOutBtn.title = 'Zoom Out';
    zoomOutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleZoomOut();
    });

    const resetBtn = document.createElement('button');
    resetBtn.className = 'viewer-btn';
    resetBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`;
    resetBtn.title = 'Reset (R)';
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleReset();
    });

    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'viewer-btn';
    zoomInBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
    zoomInBtn.title = 'Zoom In';
    zoomInBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleZoomIn();
    });

    const rotateRightBtn = document.createElement('button');
    rotateRightBtn.className = 'viewer-btn';
    rotateRightBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><polyline points="21 3 21 8 16 8"></polyline></svg>`;
    rotateRightBtn.title = 'Rotate 90° Clockwise (E)';
    rotateRightBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleRotateRight();
    });

    controls.appendChild(rotateLeftBtn);
    controls.appendChild(zoomOutBtn);
    controls.appendChild(resetBtn);
    controls.appendChild(zoomInBtn);
    controls.appendChild(rotateRightBtn);
    overlay.appendChild(controls);

    this.shadowRoot.appendChild(overlay);
    document.body.appendChild(this.container);

    // Event listeners for zoom and pan
    overlay.addEventListener('wheel', this.handleWheel, { passive: false });
    overlay.addEventListener('mousedown', this.handleMouseDown);
    overlay.addEventListener('click', this.handleBackdropClick);

    // Global keyboard listener for Esc key (using capture phase to intercept before page scripts)
    window.addEventListener('keydown', this.handleGlobalKeyDown, true);

    // Listen to native fullscreen changes (to sync icon state)
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);

    // Apply initial transforms
    this.updateImageTransform();
  }

  public hide(): void {
    if (this.container) {
      // Clean up event listeners
      window.removeEventListener('keydown', this.handleGlobalKeyDown, true);
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
      document.removeEventListener('fullscreenchange', this.handleFullscreenChange);

      // Exit fullscreen if active when closing
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      // Remove element
      this.container.remove();
      this.container = null;
      this.shadowRoot = null;
      this.imageElement = null;
      this.fullscreenBtn = null;
    }
  }

  private updateImageTransform(): void {
    if (this.ticking) return;

    this.ticking = true;
    requestAnimationFrame(() => {
      if (this.imageElement) {
        const { x, y } = this.panState;
        this.imageElement.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${this.scale}) rotate(${this.rotation}deg)`;
      }
      this.ticking = false;
    });
  }

  private handleWheel = (e: WheelEvent): void => {
    e.stopPropagation();
    e.preventDefault(); // Stop native page scrolling

    const mouseX = e.clientX - window.innerWidth / 2;
    const mouseY = e.clientY - window.innerHeight / 2;

    const oldScale = this.scale;
    const factor = this.getZoomFactor();
    const newScale =
      e.deltaY < 0
        ? calculateZoomIn(oldScale, undefined, undefined, factor)
        : calculateZoomOut(oldScale, undefined, undefined, factor);

    // Recalculate translation coordinates to keep the mouse pointer focused
    this.panState = calculateZoomTargetPan(oldScale, newScale, this.panState, mouseX, mouseY);
    this.scale = newScale;

    this.updateImageTransform();
  };

  private handleMouseDown = (e: MouseEvent): void => {
    e.stopPropagation();

    // Only drag on left click
    if (e.button !== 0) return;

    // Prevent drag-and-drop ghost image trigger from browser defaults
    e.preventDefault();

    this.isDragging = true;
    this.startMouseX = e.clientX;
    this.startMouseY = e.clientY;
    this.initialPanX = this.panState.x;
    this.initialPanY = this.panState.y;

    if (this.imageElement) {
      this.imageElement.classList.add('is-dragging');
    }

    // Attach drag listeners to window for fluid off-screen movement
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  };

  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.isDragging) return;

    e.stopPropagation();

    const deltaX = e.clientX - this.startMouseX;
    const deltaY = e.clientY - this.startMouseY;

    this.panState = calculatePan(this.initialPanX, this.initialPanY, deltaX, deltaY);
    this.updateImageTransform();
  };

  private handleMouseUp = (e: MouseEvent): void => {
    if (this.isDragging) {
      e.stopPropagation();
      this.isDragging = false;

      if (this.imageElement) {
        this.imageElement.classList.remove('is-dragging');
      }

      // Detach listeners from window when drag completes
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
    }
  };

  private handleBackdropClick = (e: MouseEvent): void => {
    if (!this.settings.closeOnBackdropClick) return;
    e.stopPropagation();
    // Close only when clicking directly on overlay background
    if (e.target === e.currentTarget) {
      this.hide();
    }
  };

  private handleGlobalKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.hide();
      return;
    }

    if (!this.settings.enableShortcuts) {
      return;
    }

    // Keyboard Zooming (+ / -)
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      e.stopPropagation();
      this.handleZoomIn();
      return;
    }
    if (e.key === '-') {
      e.preventDefault();
      e.stopPropagation();
      this.handleZoomOut();
      return;
    }

    // Keyboard Reset (R)
    if (e.key.toLowerCase() === 'r') {
      e.preventDefault();
      e.stopPropagation();
      this.handleReset();
      return;
    }

    // Keyboard Fullscreen (F)
    if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      e.stopPropagation();
      this.toggleFullscreen();
      return;
    }

    // Keyboard Rotation Right (E)
    if (e.key.toLowerCase() === 'e') {
      e.preventDefault();
      e.stopPropagation();
      this.handleRotateRight();
      return;
    }

    // Keyboard Rotation Left (Q)
    if (e.key.toLowerCase() === 'q') {
      e.preventDefault();
      e.stopPropagation();
      this.handleRotateLeft();
      return;
    }

    // Keyboard Panning (Arrow keys)
    const PAN_STEP = 40; // Pixels to move per keypress
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      this.panState = calculatePan(this.panState.x, this.panState.y, -PAN_STEP, 0);
      this.updateImageTransform();
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      this.panState = calculatePan(this.panState.x, this.panState.y, PAN_STEP, 0);
      this.updateImageTransform();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      this.panState = calculatePan(this.panState.x, this.panState.y, 0, -PAN_STEP);
      this.updateImageTransform();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      this.panState = calculatePan(this.panState.x, this.panState.y, 0, PAN_STEP);
      this.updateImageTransform();
      return;
    }

    // Block other standard scrolling keys (Space, PageUp/Down, Home, End)
    const otherKeysToBlock = [' ', 'PageUp', 'PageDown', 'Home', 'End'];
    if (otherKeysToBlock.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  private getZoomFactor(): number {
    switch (this.settings.zoomSensitivity) {
      case 'slow':
        return 1.05;
      case 'fast':
        return 1.3;
      case 'normal':
      default:
        return 1.15;
    }
  }

  private handleZoomIn(): void {
    this.scale = calculateZoomIn(this.scale, undefined, undefined, this.getZoomFactor());
    this.updateImageTransform();
  }

  private handleZoomOut(): void {
    this.scale = calculateZoomOut(this.scale, undefined, undefined, this.getZoomFactor());
    this.updateImageTransform();
  }

  private handleReset(): void {
    this.scale = resetZoom();
    this.rotation = 0;
    this.panState = resetPan();
    this.updateImageTransform();
  }

  private handleRotateRight(): void {
    this.rotation += 90;
    this.updateImageTransform();
  }

  private handleRotateLeft(): void {
    this.rotation -= 90;
    this.updateImageTransform();
  }

  private toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      if (this.container) {
        this.container.requestFullscreen().catch((err) => {
          console.error('Failed to enter fullscreen:', err);
        });
      }
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Failed to exit fullscreen:', err);
      });
    }
  }

  private handleFullscreenChange = (): void => {
    if (!this.fullscreenBtn) return;

    if (document.fullscreenElement) {
      // Show exit fullscreen icon (shrink corners SVG)
      this.fullscreenBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4"></path></svg>`;
      this.fullscreenBtn.title = 'Exit Fullscreen (F)';
    } else {
      // Show enter fullscreen icon (expand corners SVG)
      this.fullscreenBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`;
      this.fullscreenBtn.title = 'Toggle Fullscreen (F)';
    }
  };
}
