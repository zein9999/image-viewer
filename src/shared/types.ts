export interface OpenViewerMessage {
  action: 'OPEN_VIEWER';
  imageUrl: string;
}

export type ExtensionMessage = OpenViewerMessage;

export interface ViewerSettings {
  backdropOpacity: number; // 0 to 100
  enableShortcuts: boolean;
  zoomSensitivity: 'slow' | 'normal' | 'fast';
  closeOnBackdropClick: boolean;
  initialFitMode: 'fit' | 'original';
  enableDoubleClickZoom: boolean;
}
