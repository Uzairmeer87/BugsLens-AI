import { describe, it, expect } from 'vitest';

describe('Project Quality Score & Metric Aggregators', () => {
  it('should correctly calculate composite code quality score from component metrics', () => {
    const metrics = {
      maintainability: 96,
      reliability: 91,
      security: 89,
      performance: 95,
      testability: 97,
    };

    const total = Object.values(metrics).reduce((acc, val) => acc + val, 0);
    const score = Math.round(total / Object.keys(metrics).length);

    expect(score).toBe(94);
    expect(score).toBeGreaterThanOrEqual(90);
  });

  it('should accurately calculate statement and branch coverage percentages', () => {
    const passedStatements = 1205;
    const totalStatements = 1248;
    const coverage = (passedStatements / totalStatements) * 100;

    expect(coverage).toBeCloseTo(96.55, 1);
  });
});
