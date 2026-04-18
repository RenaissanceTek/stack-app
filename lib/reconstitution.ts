// Pure reconstitution math. No side effects. No DOM. Unit tested.
//
// Model:
//   - vial contains `vialMg` milligrams of peptide powder
//   - user adds `waterMl` milliliters of bacteriostatic water
//   - concentration = vialMg / waterMl (mg per ml)
//   - to deliver a dose of `doseMcg` micrograms, draw volumeMl = (doseMcg / 1000) / concentration
//   - on a U-100 insulin syringe, 1 ml = 100 units, so units = volumeMl * 100

export type ReconInput = {
  vialMg: number;
  waterMl: number;
  doseMcg: number;
};

export type ReconResult = {
  concentrationMgPerMl: number;
  volumeMl: number;
  units: number;
  dosePerUnitMcg: number;
  exceedsVial: boolean;
};

export function reconstitute(input: ReconInput): ReconResult {
  const { vialMg, waterMl, doseMcg } = input;
  if (!(vialMg > 0) || !(waterMl > 0) || !(doseMcg > 0)) {
    throw new Error('vialMg, waterMl, and doseMcg must all be positive numbers.');
  }
  const concentrationMgPerMl = vialMg / waterMl;
  const doseMg = doseMcg / 1000;
  const volumeMl = doseMg / concentrationMgPerMl;
  const units = volumeMl * 100;
  const dosePerUnitMcg = (concentrationMgPerMl * 1000) / 100;
  const exceedsVial = doseMg > vialMg;
  return {
    concentrationMgPerMl,
    volumeMl,
    units,
    dosePerUnitMcg,
    exceedsVial,
  };
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
