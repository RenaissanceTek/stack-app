'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import {
  exportAll,
  getSettings,
  resetAll,
  setSettings as persistSettings,
  type Settings,
} from '../../lib/storage';

export default function SettingsPage() {
  const [settings, setS] = useState<Settings>({ defaultUnit: 'mcg', theme: 'dark' });
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setS(getSettings());
  }, []);

  function update(next: Settings) {
    setS(next);
    persistSettings(next);
    if (typeof document !== 'undefined') {
      if (next.theme === 'light') document.documentElement.classList.add('light');
      else document.documentElement.classList.remove('light');
    }
  }

  function download() {
    const data = exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stack-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function doReset() {
    resetAll();
    setConfirmReset(false);
    window.location.href = '/onboarding';
  }

  return (
    <div>
      <PageHeader title="Settings" />

      <section className="space-y-3">
        <Row label="Default unit">
          <select
            value={settings.defaultUnit}
            onChange={(e) =>
              update({ ...settings, defaultUnit: e.target.value as 'mg' | 'mcg' })
            }
            className="rounded-lg border border-line bg-bg-card px-3 py-2 text-sm"
          >
            <option value="mcg">mcg</option>
            <option value="mg">mg</option>
          </select>
        </Row>
        <Row label="Theme">
          <select
            value={settings.theme}
            onChange={(e) =>
              update({ ...settings, theme: e.target.value as 'dark' | 'light' })
            }
            className="rounded-lg border border-line bg-bg-card px-3 py-2 text-sm"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </Row>
      </section>

      <section className="mt-6 space-y-2">
        <Link
          href="/tools/reconstitution"
          className="block rounded-xl border border-line bg-bg-card px-4 py-3 text-sm"
        >
          Reconstitution calculator
        </Link>
        <Link
          href="/sites"
          className="block rounded-xl border border-line bg-bg-card px-4 py-3 text-sm"
        >
          Injection site map
        </Link>
      </section>

      <section className="mt-6 space-y-2">
        <button
          onClick={download}
          className="w-full rounded-xl border border-line bg-bg-card py-3 text-sm font-medium"
        >
          Export data (JSON)
        </button>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="w-full rounded-xl border border-line py-3 text-sm font-medium text-ink-muted"
          >
            Reset all data
          </button>
        ) : (
          <div className="rounded-xl border border-line bg-bg-card p-4 text-sm">
            <p className="mb-3">Wipe all local data? This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={doReset}
                className="flex-1 rounded-lg bg-accent py-2 font-semibold text-black"
              >
                Confirm reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 rounded-lg border border-line py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <p className="mt-8 text-xs text-ink-muted">
        Stack v1 stores data locally on this device only. No account, no tracking.
      </p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-bg-card px-4 py-3">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}
