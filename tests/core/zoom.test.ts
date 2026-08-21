import { describe, it, expect } from 'vitest';
import {
  calculateZoomIn,
  calculateZoomOut,
  resetZoom,
  calculateZoomTargetPan,
  MIN_SCALE,
  MAX_SCALE,
} from '../../src/core/zoom';

describe('Zoom Core Mathematics', () => {
  it('should zoom in by factor', () => {
    const scale = 1.0;
    const next = calculateZoomIn(scale);
    expect(next).toBeGreaterThan(1.0);
    expect(next).toBeCloseTo(1.15);
  });

  it('should zoom out by factor', () => {
    const scale = 1.0;
    const next = calculateZoomOut(scale);
    expect(next).toBeLessThan(1.0);
    expect(next).toBeCloseTo(1 / 1.15);
  });

  it('should respect MAX_SCALE boundary when zooming in', () => {
    const scale = MAX_SCALE;
    const next = calculateZoomIn(scale);
    expect(next).toBe(MAX_SCALE);
  });

  it('should respect MIN_SCALE boundary when zooming out', () => {
    const scale = MIN_SCALE;
    const next = calculateZoomOut(scale);
    expect(next).toBe(MIN_SCALE);
  });

  it('should reset scale to 1.0', () => {
    expect(resetZoom()).toBe(1.0);
  });

  describe('calculateZoomTargetPan', () => {
    it('should translate image correctly when zooming relative to pointer', () => {
      const oldScale = 1.0;
      const newScale = 2.0;
      const currentPan = { x: 0, y: 0 };
      const mouseX = 100;
      const mouseY = 100;

      const newPan = calculateZoomTargetPan(oldScale, newScale, currentPan, mouseX, mouseY);

      // Math: 100 - (100 - 0) * (2 / 1) = 100 - 200 = -100
      expect(newPan).toEqual({ x: -100, y: -100 });
    });

    it('should keep translation stable if scales are identical', () => {
      const oldScale = 1.5;
      const newScale = 1.5;
      const currentPan = { x: 20, y: -30 };
      const mouseX = 50;
      const mouseY = 50;

      const newPan = calculateZoomTargetPan(oldScale, newScale, currentPan, mouseX, mouseY);
      expect(newPan).toEqual(currentPan);
    });
  });
});
