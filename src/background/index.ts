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
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === MENU_ITEM_ID && tab?.id && info.srcUrl) {
    const message: OpenViewerMessage = {
      action: 'OPEN_VIEWER',
      imageUrl: info.srcUrl,
    };

    try {
      // 1. Try sending directly (in case content.js is already loaded)
      await chrome.tabs.sendMessage(tab.id, message);
    } catch {
      try {
        // 2. If it fails, dynamically inject content script
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js'],
        });
        // 3. Send message once injected
        await chrome.tabs.sendMessage(tab.id, message);
      } catch (err) {
        console.error('Failed to inject or message content script:', err);
      }
    }
  }
});
