import { ExtensionMessage } from '../shared/types';
import { ImageViewer } from './viewer';

chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
  if (message.action === 'OPEN_VIEWER') {
    const viewer = new ImageViewer(message.imageUrl);
    viewer.show();
  }
});
