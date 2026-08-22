import { ExtensionMessage } from '../shared/types';
import { ImageViewer } from './viewer';

if (!(window as any).imageViewerLoaded) {
  (window as any).imageViewerLoaded = true;

  chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
    if (message.action === 'OPEN_VIEWER') {
      const viewer = new ImageViewer(message.imageUrl);
      viewer.show();
    }
  });
}
