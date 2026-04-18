'use client';

import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import {
  addVial,
  getLogs,
  getVials,
  makeId,
  type LogEntry,
  type Vial,
} from '../../lib/storage';
import { SEED_STACKS } from '../../content/stacks';

function consumedMg(vial: Vial, logs: LogEntry[]): number {
  let used = 0;
  for (const l of logs) {
    if (l.peptideName !== vial.peptideName) continue;
    if (vial.reconstitutedAt && l.timestamp < vial.reconstitutedAt) continue;
    const mg = l.unit === 'mg' ? l.doseAmount : l.doseAmount / 1000;
    used += mg;
  }
  return used;
}

export default function InventoryPage() {
  const [vials, setVials] = useState<Vial[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setVials(getVials());
    setLogs(getLogs());
  }, []);

  const peptideNames = useMemo(
    () =>
      Array.from(
        new Set<string>(SEED_STACKS.flatMap((s) => s.peptides.map((p) => p.name)))
      ),
    []
  );

  const [peptideName, setPeptideName] = useState(peptideNames[0] || '');
  const [totalMg, setTotalMg] = useState('5');
  const [waterMl, setWaterMl] = useState('2');
  const [expires, setExpires] = useState('');

  function saveVial(e: React.FormEvent) {
    e.preventDefault();
    const mg = parseFloat(totalMg);
    const ml = parseFloat(waterMl);
    if (!(mg > 0) || !(ml > 0) || !peptideName) return;
    const v: Vial = {
      id: makeId(),
      peptideName,
      totalMg: mg,
      remainingMg: mg,
      bacWaterMl: ml,
      reconstitutedAt: Date.now(),
      expiresAt: expires ? new Date(expires).getTime() : undefined,
    };
    addVial(v);
    setVials(getVials());
    setShowForm(false);
    setTotalMg('5');
    setWaterMl('2');
    setExpires('');
  }

  return (
    <div>
      <PageHeader title="Vials" subtitle="Track inventory and remaining amount" />

      <button
        onClick={() => setShowForm((s) => !s)}
        className="mb-4 w-full rounded-xl border border-line bg-bg-card py-3 text-sm font-medium"
      >
        {showForm ? 'Cancel' : 'Add vial'}
      </button>

      {showForm ? (
        <form onSubmit={saveVial} className="mb-6 space-y-3 rounded-2xl border border-line bg-bg-card p-4">
          <Field label="Peptide">
            <select
              value={peptideName}
              onChange={(e) => setPeptideName(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg-elev px-3 py-3"
            >
              {peptideNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Total (mg)">
              <input
                type="number"
                step="0.1"
                value={totalMg}
                onChange={(e) => setTotalMg(e.target.value)}
                className="w-full rounded-xl border border-line bg-bg-elev px-3 py-3"
              />
            </Field>
            <Field label="Bac water (ml)">
              <input
                type="number"
                step="0.1"
                value={waterMl}
                onChange={(e) => setWaterMl(e.target.value)}
                className="w-full rounded-xl border border-line bg-bg-elev px-3 py-3"
              />
            </Field>
          </div>
          <Field label="Expires (optional)">
            <input
              type="date"
              value={expires}
              onChange={(e) => setExpires(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg-elev px-3 py-3"
            />
          </Field>
          <button type="submit" className="w-full rounded-xl bg-accent py-3 font-semibold text-black">
            Save vial
          </button>
        </form>
      ) : null}

      {vials.length === 0 ? (
        <p className="rounded-xl border border-line bg-bg-card p-6 text-center text-sm text-ink-muted">
          No vials logged yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {vials.map((v) => {
            const used = consumedMg(v, logs);
            const remaining = Math.max(0, v.totalMg - used);
            const pct = Math.min(100, Math.max(0, (remaining / v.totalMg) * 100));
            return (
              <li key={v.id} className="rounded-2xl border border-line bg-bg-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{v.peptideName}</p>
                    <p className="text-xs text-ink-muted">
                      {v.totalMg} mg · {v.bacWaterMl} ml water
                    </p>
                    {v.expiresAt ? (
                      <p className="text-xs text-ink-muted">
                        Expires {new Date(v.expiresAt).toLocaleDateString()}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{remaining.toFixed(2)} mg</p>
                    <p className="text-xs text-ink-muted">remaining</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-bg-elev">
                  <div
                    className="h-1.5 rounded-full bg-accent"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
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
