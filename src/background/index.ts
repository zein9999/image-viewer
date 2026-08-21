import { OpenViewerMessage } from '../shared/types';

const MENU_ITEM_ID = 'open-image-viewer';

// Register context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ITEM_ID,
    title: 'Open with Image Viewer',
    contexts: ['image'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === MENU_ITEM_ID && tab?.id) {
    const imageUrl = info.srcUrl;
    if (imageUrl) {
      const message: OpenViewerMessage = {
        action: 'OPEN_VIEWER',
        imageUrl,
      };
      
      chrome.tabs.sendMessage(tab.id, message).catch((err) => {
        console.error('Failed to send message to content script:', err);
      });
    }
  }
});
