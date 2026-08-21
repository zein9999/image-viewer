export const MIN_SCALE = 0.25;
export const MAX_SCALE = 10.0;
export const ZOOM_FACTOR = 1.15;

export function calculateZoomIn(currentScale: number, min = MIN_SCALE, max = MAX_SCALE, factor = ZOOM_FACTOR): number {
  const nextScale = currentScale * factor;
  return Math.min(max, Math.max(min, nextScale));
}

export function calculateZoomOut(currentScale: number, min = MIN_SCALE, max = MAX_SCALE, factor = ZOOM_FACTOR): number {
  const nextScale = currentScale / factor;
  return Math.min(max, Math.max(min, nextScale));
}

export function resetZoom(): number {
  return 1.0;
}
