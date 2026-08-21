export interface OpenViewerMessage {
  action: 'OPEN_VIEWER';
  imageUrl: string;
}

export type ExtensionMessage = OpenViewerMessage;
