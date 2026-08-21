# Security & Privacy Policy

Privacy and security are core principles of the Image Viewer extension. We follow a strict "local-first" philosophy.

## Minimal Permissions Policy

We request only the absolute minimum API privileges required to run the extension:

* **`contextMenus`**: Allows the background service worker to register the "Open with Image Viewer" action on right-clicked images.
* **`activeTab`**: Grants temporary, on-demand permission to access only the active tab when the context menu is explicitly clicked.
  - *Why not `<all_urls>` host permission?* By using `activeTab`, we avoid permanent read/write access to every webpage the user visits. This increases privacy, reduces target surface area, and removes browser security warnings upon installation.

---

## Zero Analytics & Tracking

- **No Remote Connections**: The extension does not initiate any remote fetch requests, telemetry, tracking, or network callbacks.
- **No Third-Party Scripts**: No tracking pixels, Google Analytics, or external CDNs are used.
- **No Cookies/Storage**: The extension does not access user cookies, browser history, or local session data.
- **Local Isolation**: The image processing and coordinate transformations are calculated locally within the user's browser runtime.

---

## Security Automation Gate

We have implemented a validation script under `scripts/check-permissions.js` that checks `manifest.json` during the GitHub Actions CI pipeline. If any unauthorized permissions are added to `manifest.json` in a Pull Request, the build immediately fails, preventing unauthorized permission creep.
