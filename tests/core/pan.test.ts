import { describe, it, expect } from 'vitest';
import { calculatePan, resetPan } from '../../src/core/pan';

describe('Pan Core Mathematics', () => {
  it('should calculate new translation values from delta', () => {
    const start = { x: 10, y: -20 };
    const delta = { x: 50, y: 150 };
    const result = calculatePan(start.x, start.y, delta.x, delta.y);

    expect(result.x).toBe(60);
    expect(result.y).toBe(130);
  });

  it('should reset translation to 0,0', () => {
    const result = resetPan();
    expect(result).toEqual({ x: 0, y: 0 });
  });
});
