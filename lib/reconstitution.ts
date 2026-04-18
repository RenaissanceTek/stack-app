// Pure math for the reconstitution calculator.
// Given a vial of <vialMg> mg reconstituted with <bacWaterMl> ml of bac water,
// compute the volume (ml) and U-100 syringe units needed to deliver <doseMcg>.

export type ReconInput = {
  vialMg: number;
  bacWaterMl: number;
  doseMcg: number;
};

export type ReconResult = {
  concentrationMgPerMl: number;
  volumeMl: number;
  unitsU100: number;
  doseExceedsVial: boolean;
};

export function computeReconstitution(input: ReconInput): ReconResult {
  const { vialMg, bacWaterMl, doseMcg } = input;

  if (!Number.isFinite(vialMg) || !Number.isFinite(bacWaterMl) || !Number.isFinite(doseMcg)) {
    throw new Error('Inputs must be finite numbers');
  }
  if (vialMg <= 0) throw new Error('vialMg must be > 0');
  if (bacWaterMl <= 0) throw new Error('bacWaterMl must be > 0');
  if (doseMcg < 0) throw new Error('doseMcg must be >= 0');

  const concentrationMgPerMl = vialMg / bacWaterMl;
  const doseMg = doseMcg / 1000;
  const volumeMl = doseMg / concentrationMgPerMl;
  const unitsU100 = volumeMl * 100;
  const doseExceedsVial = doseMg > vialMg;

  return {
    concentrationMgPerMl,
    volumeMl,
    unitsU100,
    doseExceedsVial,
  };
}

export function roundTo(n: number, places = 3): number {
  const p = Math.pow(10, places);
  return Math.round(n * p) / p;
}
