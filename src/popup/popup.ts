import { ViewerSettings } from '../shared/types';

const DEFAULT_SETTINGS: ViewerSettings = {
  backdropOpacity: 85,
  enableShortcuts: true,
  zoomSensitivity: 'normal',
  closeOnBackdropClick: true,
  initialFitMode: 'fit',
};

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const opacityInput = document.getElementById('opacity') as HTMLInputElement;
  const opacityVal = document.getElementById('opacity-val') as HTMLSpanElement;
  const shortcutsInput = document.getElementById('shortcuts') as HTMLInputElement;
  const backdropClickInput = document.getElementById('backdrop-click') as HTMLInputElement;
  const zoomSensitivityInput = document.getElementById('zoom-sensitivity') as HTMLSelectElement;
  const fitModeInput = document.getElementById('fit-mode') as HTMLSelectElement;

  // Load current settings
  chrome.storage.local.get(DEFAULT_SETTINGS, (items) => {
    const settings = items as ViewerSettings;

    // Apply values to UI
    opacityInput.value = settings.backdropOpacity.toString();
    opacityVal.textContent = `${settings.backdropOpacity}%`;
    shortcutsInput.checked = settings.enableShortcuts;
    backdropClickInput.checked = settings.closeOnBackdropClick;
    zoomSensitivityInput.value = settings.zoomSensitivity;
    fitModeInput.value = settings.initialFitMode;
  });

  // Helper to save settings
  const saveSettings = () => {
    const settings: ViewerSettings = {
      backdropOpacity: parseInt(opacityInput.value, 10),
      enableShortcuts: shortcutsInput.checked,
      zoomSensitivity: zoomSensitivityInput.value as ViewerSettings['zoomSensitivity'],
      closeOnBackdropClick: backdropClickInput.checked,
      initialFitMode: fitModeInput.value as ViewerSettings['initialFitMode'],
    };

    chrome.storage.local.set(settings);
  };

  // Event Listeners
  opacityInput.addEventListener('input', () => {
    opacityVal.textContent = `${opacityInput.value}%`;
  });

  opacityInput.addEventListener('change', saveSettings);
  shortcutsInput.addEventListener('change', saveSettings);
  backdropClickInput.addEventListener('change', saveSettings);
  zoomSensitivityInput.addEventListener('change', saveSettings);
  fitModeInput.addEventListener('change', saveSettings);
});
