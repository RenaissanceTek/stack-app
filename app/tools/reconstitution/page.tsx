'use client';

import { useMemo, useState } from 'react';
import PageHeader from '../../../components/PageHeader';
import { reconstitute, roundTo } from '../../../lib/reconstitution';

export default function ReconstitutionPage() {
  const [vialMg, setVialMg] = useState<string>('5');
  const [waterMl, setWaterMl] = useState<string>('2');
  const [doseMcg, setDoseMcg] = useState<string>('250');

  const parsed = {
    vialMg: parseFloat(vialMg),
    waterMl: parseFloat(waterMl),
    doseMcg: parseFloat(doseMcg),
  };

  const valid =
    isFinite(parsed.vialMg) &&
    parsed.vialMg > 0 &&
    isFinite(parsed.waterMl) &&
    parsed.waterMl > 0 &&
    isFinite(parsed.doseMcg) &&
    parsed.doseMcg > 0;

  const result = useMemo(() => {
    if (!valid) return null;
    return reconstitute(parsed);
  }, [valid, parsed.vialMg, parsed.waterMl, parsed.doseMcg]);

  return (
    <div>
      <PageHeader
        title="Reconstitution"
        subtitle="Compute draw volume and U-100 syringe units"
      />

      <div className="space-y-4">
        <Field label="Vial peptide amount (mg)">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={vialMg}
            onChange={(e) => setVialMg(e.target.value)}
            className="w-full rounded-xl border border-line bg-bg-card px-3 py-3"
          />
        </Field>
        <Field label="Bacteriostatic water added (ml)">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={waterMl}
            onChange={(e) => setWaterMl(e.target.value)}
            className="w-full rounded-xl border border-line bg-bg-card px-3 py-3"
          />
        </Field>
        <Field label="Desired dose (mcg)">
          <input
            type="number"
            inputMode="decimal"
            step="1"
            value={doseMcg}
            onChange={(e) => setDoseMcg(e.target.value)}
            className="w-full rounded-xl border border-line bg-bg-card px-3 py-3"
          />
        </Field>
      </div>

      {result ? (
        <section className="mt-6 rounded-2xl border border-line bg-bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-ink-muted">Result</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Stat label="Concentration" value={`${roundTo(result.concentrationMgPerMl, 4)} mg/ml`} />
            <Stat label="Per unit" value={`${roundTo(result.dosePerUnitMcg, 2)} mcg`} />
            <Stat label="Draw" value={`${roundTo(result.volumeMl, 4)} ml`} />
            <Stat label="On U-100 syringe" value={`${roundTo(result.units, 2)} units`} />
          </div>
          {result.exceedsVial ? (
            <p className="mt-4 rounded-lg border border-line bg-bg-elev p-3 text-xs text-ink">
              Warning: desired dose exceeds total peptide in the vial. Check your inputs.
            </p>
          ) : null}
        </section>
      ) : (
        <p className="mt-6 text-sm text-ink-muted">Enter positive values in all fields.</p>
      )}

      <section className="mt-6 rounded-2xl border border-line bg-bg-card p-5 text-sm">
        <p className="text-xs uppercase tracking-wider text-ink-muted">Formula</p>
        <p className="mt-2">concentration = vial mg / water ml</p>
        <p>draw volume (ml) = (dose mcg / 1000) / concentration</p>
        <p>U-100 units = draw volume (ml) × 100</p>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-bg-card p-5 text-sm">
        <p className="text-xs uppercase tracking-wider text-ink-muted">Worked example</p>
        <p className="mt-2 text-ink-muted">
          5 mg vial + 2 ml water = 2.5 mg/ml. For a 250 mcg dose, draw (0.25 / 2.5) = 0.1 ml.
          On a U-100 insulin syringe that is 10 units.
        </p>
      </section>

      <p className="mt-6 text-xs text-ink-muted">
        Educational only. Not medical advice. Confirm all math with a licensed provider.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-ink-muted">{label}</span>
      {children}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-bg-elev p-3">
      <p className="text-[11px] uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
