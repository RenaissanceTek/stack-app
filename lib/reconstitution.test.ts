import { describe, it, expect } from 'vitest';
import { computeReconstitution, roundTo } from './reconstitution';

describe('computeReconstitution', () => {
  it('standard: 5mg + 2ml water, 250mcg dose', () => {
    const r = computeReconstitution({ vialMg: 5, bacWaterMl: 2, doseMcg: 250 });
    expect(r.concentrationMgPerMl).toBe(2.5);
    expect(roundTo(r.volumeMl, 3)).toBe(0.1);
    expect(roundTo(r.unitsU100, 3)).toBe(10);
    expect(r.doseExceedsVial).toBe(false);
  });

  it('sub-mcg precision: 10mg + 3ml water, 100mcg dose', () => {
    const r = computeReconstitution({ vialMg: 10, bacWaterMl: 3, doseMcg: 100 });
    // concentration = 10/3 ≈ 3.3333 mg/ml
    // volume = 0.1 / 3.3333 = 0.03 ml
    // units = 3
    expect(roundTo(r.concentrationMgPerMl, 4)).toBe(3.3333);
    expect(roundTo(r.volumeMl, 4)).toBe(0.03);
    expect(roundTo(r.unitsU100, 3)).toBe(3);
  });

  it('mg target: 5mg vial + 2ml water, 1mg (1000 mcg) dose', () => {
    const r = computeReconstitution({ vialMg: 5, bacWaterMl: 2, doseMcg: 1000 });
    expect(r.concentrationMgPerMl).toBe(2.5);
    expect(roundTo(r.volumeMl, 3)).toBe(0.4);
    expect(roundTo(r.unitsU100, 3)).toBe(40);
    expect(r.doseExceedsVial).toBe(false);
  });

  it('0.5ml water: 2mg + 0.5ml water, 200mcg dose', () => {
    const r = computeReconstitution({ vialMg: 2, bacWaterMl: 0.5, doseMcg: 200 });
    expect(r.concentrationMgPerMl).toBe(4);
    expect(roundTo(r.volumeMl, 3)).toBe(0.05);
    expect(roundTo(r.unitsU100, 3)).toBe(5);
  });

  it('edge: dose > total vial flags doseExceedsVial', () => {
    const r = computeReconstitution({ vialMg: 1, bacWaterMl: 1, doseMcg: 2000 });
    expect(r.doseExceedsVial).toBe(true);
    // Math still computes: 1 mg/ml, 2mg = 2ml. The flag surfaces the user error.
    expect(r.concentrationMgPerMl).toBe(1);
    expect(roundTo(r.volumeMl, 3)).toBe(2);
  });

  it('rejects zero/negative inputs', () => {
    expect(() => computeReconstitution({ vialMg: 0, bacWaterMl: 1, doseMcg: 100 })).toThrow();
    expect(() => computeReconstitution({ vialMg: 5, bacWaterMl: 0, doseMcg: 100 })).toThrow();
    expect(() => computeReconstitution({ vialMg: 5, bacWaterMl: 1, doseMcg: -1 })).toThrow();
  });
});

describe('roundTo', () => {
  it('rounds to given places', () => {
    expect(roundTo(1.23456, 2)).toBe(1.23);
    expect(roundTo(1.23456, 4)).toBe(1.2346);
  });
});
