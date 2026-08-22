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

      // 1. Try sending the message directly (in case content.js is already loaded)
      chrome.tabs.sendMessage(tab.id, message).catch(() => {
        // 2. If it fails, content.js is not loaded yet, so inject it dynamically
        chrome.scripting
          .executeScript({
            target: { tabId: tab.id! },
            files: ['content.js'],
          })
          .then(() => {
            // 3. Send message once the content script has finished loading
            chrome.tabs.sendMessage(tab.id!, message).catch((err) => {
              console.error('Failed to send message after injection:', err);
            });
          })
          .catch((err) => {
            console.error('Failed to dynamically inject content script:', err);
          });
      });
    }
  }
});
