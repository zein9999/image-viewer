export interface PanState {
  x: number;
  y: number;
}

export function calculatePan(startX: number, startY: number, deltaX: number, deltaY: number): PanState {
  return {
    x: startX + deltaX,
    y: startY + deltaY,
  };
}

export function resetPan(): PanState {
  return { x: 0, y: 0 };
}
