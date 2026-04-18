import { describe, it, expect } from 'vitest';
import { reconstitute, roundTo } from './reconstitution';

describe('reconstitute', () => {
  it('standard case: 5 mg vial + 2 ml water, 250 mcg dose -> 0.1 ml / 10 units', () => {
    const r = reconstitute({ vialMg: 5, waterMl: 2, doseMcg: 250 });
    expect(r.concentrationMgPerMl).toBeCloseTo(2.5, 10);
    expect(r.volumeMl).toBeCloseTo(0.1, 10);
    expect(r.units).toBeCloseTo(10, 10);
    expect(r.exceedsVial).toBe(false);
  });

  it('sub-mcg precision: 10 mg vial + 3 ml water, 500 mcg -> 0.15 ml / 15 units', () => {
    const r = reconstitute({ vialMg: 10, waterMl: 3, doseMcg: 500 });
    expect(r.concentrationMgPerMl).toBeCloseTo(10 / 3, 10);
    expect(r.volumeMl).toBeCloseTo(0.15, 10);
    expect(r.units).toBeCloseTo(15, 10);
  });

  it('mg target (2 mg = 2000 mcg): 5 mg vial + 2 ml water, 2000 mcg -> 0.8 ml / 80 units', () => {
    const r = reconstitute({ vialMg: 5, waterMl: 2, doseMcg: 2000 });
    expect(r.volumeMl).toBeCloseTo(0.8, 10);
    expect(r.units).toBeCloseTo(80, 10);
    expect(r.exceedsVial).toBe(false);
  });

  it('0.5 ml water: 2 mg vial + 0.5 ml water, 200 mcg -> 0.05 ml / 5 units', () => {
    const r = reconstitute({ vialMg: 2, waterMl: 0.5, doseMcg: 200 });
    expect(r.concentrationMgPerMl).toBeCloseTo(4, 10);
    expect(r.volumeMl).toBeCloseTo(0.05, 10);
    expect(r.units).toBeCloseTo(5, 10);
  });

  it('3 ml water: 15 mg vial + 3 ml water, 750 mcg -> 0.15 ml / 15 units', () => {
    const r = reconstitute({ vialMg: 15, waterMl: 3, doseMcg: 750 });
    expect(r.concentrationMgPerMl).toBeCloseTo(5, 10);
    expect(r.volumeMl).toBeCloseTo(0.15, 10);
    expect(r.units).toBeCloseTo(15, 10);
  });

  it('edge case: dose exceeds vial total flags exceedsVial', () => {
    const r = reconstitute({ vialMg: 2, waterMl: 1, doseMcg: 3000 });
    expect(r.exceedsVial).toBe(true);
    expect(r.volumeMl).toBeCloseTo(1.5, 10);
  });

  it('rejects non-positive inputs', () => {
    expect(() => reconstitute({ vialMg: 0, waterMl: 1, doseMcg: 250 })).toThrow();
    expect(() => reconstitute({ vialMg: 5, waterMl: 0, doseMcg: 250 })).toThrow();
    expect(() => reconstitute({ vialMg: 5, waterMl: 2, doseMcg: 0 })).toThrow();
    expect(() => reconstitute({ vialMg: -1, waterMl: 2, doseMcg: 250 })).toThrow();
  });

  it('roundTo rounds to given decimals', () => {
    expect(roundTo(0.12345, 2)).toBe(0.12);
    expect(roundTo(0.12545, 2)).toBe(0.13);
    expect(roundTo(10.4999, 0)).toBe(10);
  });
});
