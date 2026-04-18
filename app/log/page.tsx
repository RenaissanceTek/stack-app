'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  INJECTION_SITES,
  addLog,
  getActiveStackId,
  getSettings,
  makeId,
  type LogEntry,
} from '../../lib/storage';
import { SEED_STACKS } from '../../content/stacks';
import PageHeader from '../../components/PageHeader';

function toLocalInputValue(d: Date): string {
  const tzOffsetMs = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - tzOffsetMs);
  return local.toISOString().slice(0, 16);
}

function LogForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [peptideOptions, setPeptideOptions] = useState<string[]>([]);
  const [peptide, setPeptide] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [unit, setUnit] = useState<'mg' | 'mcg'>('mcg');
  const [site, setSite] = useState<string>(INJECTION_SITES[0]);
  const [when, setWhen] = useState<string>(toLocalInputValue(new Date()));
  const [notes, setNotes] = useState<string>('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = getSettings();
    setUnit(settings.defaultUnit);

    const activeId = getActiveStackId();
    const active = SEED_STACKS.find((s) => s.id === activeId);
    const activeNames = active ? active.peptides.map((p) => p.name) : [];
    const all = Array.from(
      new Set<string>([
        ...activeNames,
        ...SEED_STACKS.flatMap((s) => s.peptides.map((p) => p.name)),
      ])
    );
    setPeptideOptions(all);

    const prefill = params.get('peptide');
    setPeptide(prefill || activeNames[0] || all[0] || '');
  }, [params]);

  const canSave = useMemo(
    () => peptide.length > 0 && parseFloat(amount) > 0 && site.length > 0 && when.length > 0,
    [peptide, amount, site, when]
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    const entry: LogEntry = {
      id: makeId(),
      timestamp: new Date(when).getTime(),
      peptideName: peptide,
      doseAmount: parseFloat(amount),
      unit,
      site,
      notes: notes.trim() ? notes.trim() : undefined,
    };
    addLog(entry);
    setSaved(true);
    setTimeout(() => router.push('/'), 700);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Peptide">
        <select
          value={peptide}
          onChange={(e) => setPeptide(e.target.value)}
          className="w-full rounded-xl border border-line bg-bg-card px-3 py-3"
        >
          {peptideOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <Field label="Dose">
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg-card px-3 py-3"
              placeholder="0"
            />
          </Field>
        </div>
        <Field label="Unit">
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'mg' | 'mcg')}
            className="w-full rounded-xl border border-line bg-bg-card px-3 py-3"
          >
            <option value="mcg">mcg</option>
            <option value="mg">mg</option>
          </select>
        </Field>
      </div>

      <Field label="Injection site">
        <select
          value={site}
          onChange={(e) => setSite(e.target.value)}
          className="w-full rounded-xl border border-line bg-bg-card px-3 py-3"
        >
          {INJECTION_SITES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="When">
        <input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          className="w-full rounded-xl border border-line bg-bg-card px-3 py-3"
        />
      </Field>

      <Field label="Notes (optional)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-line bg-bg-card px-3 py-3"
          placeholder="Anything worth remembering"
        />
      </Field>

      <button
        type="submit"
        disabled={!canSave || saved}
        className="w-full rounded-xl bg-accent py-4 font-semibold text-black disabled:opacity-50"
      >
        {saved ? 'Saved' : 'Save log'}
      </button>
    </form>
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

export default function LogPage() {
  return (
    <div>
      <PageHeader title="Log dose" subtitle="Records locally on this device only" />
      <Suspense fallback={null}>
        <LogForm />
      </Suspense>
    </div>
  );
}
