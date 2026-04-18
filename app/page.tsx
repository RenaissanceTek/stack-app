'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  computeStreakDays,
  getActiveStackId,
  getLogs,
  isOnboarded,
  type LogEntry,
} from '../lib/storage';
import { SEED_STACKS } from '../content/stacks';
import PageHeader from '../components/PageHeader';

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [activeStackId, setActiveStackId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (!isOnboarded()) {
      router.replace('/onboarding');
      return;
    }
    setActiveStackId(getActiveStackId());
    setLogs(getLogs());
    setReady(true);
  }, [router]);

  if (!ready) return null;

  const stack = SEED_STACKS.find((s) => s.id === activeStackId) || null;
  const streak = computeStreakDays(logs);
  const recent = logs.slice(0, 5);

  return (
    <div>
      <PageHeader title="Stack" subtitle="Your peptide tracker" />

      {!stack ? (
        <div className="rounded-2xl border border-line bg-bg-card p-6 text-center">
          <p className="text-ink-muted">No active stack yet.</p>
          <Link
            href="/library"
            className="mt-4 inline-block rounded-xl bg-accent px-5 py-3 font-medium text-black"
          >
            Browse library
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-muted">Active stack</p>
                <h2 className="mt-1 text-lg font-semibold">{stack.name}</h2>
                <p className="mt-1 text-sm text-ink-muted">{stack.goal}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-ink-muted">Streak</p>
                <p className="mt-1 text-2xl font-semibold text-accent">{streak}d</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-muted">
              Today
            </h3>
            <ul className="space-y-2">
              {stack.peptides.map((p) => (
                <li
                  key={p.name}
                  className="rounded-xl border border-line bg-bg-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-ink-muted">
                        {p.doseRange} · {p.frequency}
                      </p>
                    </div>
                    <Link
                      href={`/log?peptide=${encodeURIComponent(p.name)}`}
                      className="rounded-lg border border-line px-3 py-1.5 text-sm"
                    >
                      Log
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <Link
            href="/log"
            className="block w-full rounded-xl bg-accent py-4 text-center font-semibold text-black"
          >
            Log dose
          </Link>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-muted">
              Recent
            </h3>
            {recent.length === 0 ? (
              <p className="rounded-xl border border-line bg-bg-card p-4 text-sm text-ink-muted">
                No doses logged yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {recent.map((l) => (
                  <li
                    key={l.id}
                    className="rounded-xl border border-line bg-bg-card p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{l.peptideName}</p>
                        <p className="text-xs text-ink-muted">
                          {l.doseAmount} {l.unit} · {l.site}
                        </p>
                      </div>
                      <p className="text-xs text-ink-muted">
                        {new Date(l.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
