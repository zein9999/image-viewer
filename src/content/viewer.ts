import viewerStyles from './viewer.css?inline';
import { calculateZoomIn, calculateZoomOut, resetZoom } from '../core/zoom';
import { calculatePan, resetPan, PanState } from '../core/pan';

export class ImageViewer {
  private container: HTMLDivElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private imageElement: HTMLImageElement | null = null;
  private originalBodyOverflow: string = '';

  // Interactivity state
  private scale: number = 1.0;
  private panState: PanState = { x: 0, y: 0 };
  private isDragging: boolean = false;
  private startMouseX: number = 0;
  private startMouseY: number = 0;
  private initialPanX: number = 0;
  private initialPanY: number = 0;

  constructor(private imageUrl: string) {}

  public show(): void {
    // Prevent duplicate viewer
    if (document.getElementById('image-viewer-root')) {
      return;
    }

    // Lock body scroll
    this.originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

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

    const closeBtn = document.createElement('button');
    closeBtn.className = 'viewer-close-btn';
    closeBtn.innerHTML = '&#x2715;'; // ✕ symbol
    closeBtn.title = 'Close (Esc)';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
    });
    overlay.appendChild(closeBtn);

    const imageContainer = document.createElement('div');
    imageContainer.className = 'viewer-image-container';

    this.imageElement = document.createElement('img');
    this.imageElement.className = 'viewer-image';
    this.imageElement.src = this.imageUrl;
    this.imageElement.alt = 'Image Viewer';
    
    imageContainer.appendChild(this.imageElement);
    overlay.appendChild(imageContainer);

    // Controls container
    const controls = document.createElement('div');
    controls.className = 'viewer-controls';

    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'viewer-btn';
    zoomOutBtn.innerHTML = '&minus;';
    zoomOutBtn.title = 'Zoom Out';
    zoomOutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleZoomOut();
    });

    const resetBtn = document.createElement('button');
    resetBtn.className = 'viewer-btn';
    resetBtn.innerHTML = '&#x27F3;'; // ⟲ symbol
    resetBtn.title = 'Reset';
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleReset();
    });

    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'viewer-btn';
    zoomInBtn.innerHTML = '&plus;';
    zoomInBtn.title = 'Zoom In';
    zoomInBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleZoomIn();
    });

    controls.appendChild(zoomOutBtn);
    controls.appendChild(resetBtn);
    controls.appendChild(zoomInBtn);
    overlay.appendChild(controls);

    this.shadowRoot.appendChild(overlay);
    document.body.appendChild(this.container);

    // Event listeners for zoom and pan
    overlay.addEventListener('wheel', this.handleWheel, { passive: false });
    overlay.addEventListener('mousedown', this.handleMouseDown);
    overlay.addEventListener('mousemove', this.handleMouseMove);
    overlay.addEventListener('mouseup', this.handleMouseUp);
    overlay.addEventListener('mouseleave', this.handleMouseUp);
    overlay.addEventListener('click', this.handleBackdropClick);

    // Global keyboard listener for Esc key (using capture phase to intercept before page scripts)
    window.addEventListener('keydown', this.handleGlobalKeyDown, true);

    // Apply initial transforms
    this.updateImageTransform();
  }

  public hide(): void {
    if (this.container) {
      // Clean up event listeners
      window.removeEventListener('keydown', this.handleGlobalKeyDown, true);
      
      // Restore body scroll
      document.body.style.overflow = this.originalBodyOverflow;
      
      // Remove element
      this.container.remove();
      this.container = null;
      this.shadowRoot = null;
      this.imageElement = null;
    }
  }

  private updateImageTransform(): void {
    if (this.imageElement) {
      const { x, y } = this.panState;
      this.imageElement.style.transform = `translate(${x}px, ${y}px) scale(${this.scale})`;
    }
  }

  private handleWheel = (e: WheelEvent): void => {
    e.stopPropagation();
    e.preventDefault(); // Stop native page scrolling

    if (e.deltaY < 0) {
      this.scale = calculateZoomIn(this.scale);
    } else {
      this.scale = calculateZoomOut(this.scale);
    }
    
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
    }
  };

  private handleBackdropClick = (e: MouseEvent): void => {
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
    }
  };

  private handleZoomIn(): void {
    this.scale = calculateZoomIn(this.scale);
    this.updateImageTransform();
  }

  private handleZoomOut(): void {
    this.scale = calculateZoomOut(this.scale);
    this.updateImageTransform();
  }

  private handleReset(): void {
    this.scale = resetZoom();
    this.panState = resetPan();
    this.updateImageTransform();
  }
}
