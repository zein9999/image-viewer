import { describe, it, expect } from 'vitest';
import {
  calculateZoomIn,
  calculateZoomOut,
  resetZoom,
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
});
