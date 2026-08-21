import { PanState } from './pan';

export const MIN_SCALE = 0.25;
export const MAX_SCALE = 10.0;
export const ZOOM_FACTOR = 1.15;

export function calculateZoomIn(
  currentScale: number,
  min = MIN_SCALE,
  max = MAX_SCALE,
  factor = ZOOM_FACTOR
): number {
  const nextScale = currentScale * factor;
  return Math.min(max, Math.max(min, nextScale));
}

export function calculateZoomOut(
  currentScale: number,
  min = MIN_SCALE,
  max = MAX_SCALE,
  factor = ZOOM_FACTOR
): number {
  const nextScale = currentScale / factor;
  return Math.min(max, Math.max(min, nextScale));
}

export function resetZoom(): number {
  return 1.0;
}

export function calculateZoomTargetPan(
  oldScale: number,
  newScale: number,
  currentPan: PanState,
  mouseX: number,
  mouseY: number
): PanState {
  if (oldScale === 0) return currentPan;
  const ratio = newScale / oldScale;
  return {
    x: mouseX - (mouseX - currentPan.x) * ratio,
    y: mouseY - (mouseY - currentPan.y) * ratio,
  };
}
