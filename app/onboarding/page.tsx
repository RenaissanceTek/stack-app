'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setActiveStackId, setOnboarded } from '../../lib/storage';
import { SEED_STACKS } from '../../content/stacks';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<'disclaimer' | 'pick'>('disclaimer');

  function finishWithStack(id?: string) {
    if (id) setActiveStackId(id);
    setOnboarded();
    router.replace('/');
  }

  if (step === 'disclaimer') {
    return (
      <div className="flex min-h-[80vh] flex-col justify-between py-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Stack</h1>
          <p className="mt-2 text-ink-muted">Peptide protocol tracker.</p>

          <div className="mt-8 space-y-4 rounded-2xl border border-line bg-bg-card p-5 text-sm leading-relaxed">
            <p className="font-semibold">Before you continue</p>
            <p className="text-ink-muted">
              For educational and tracking use only. Not medical advice. Consult a licensed
              provider before starting any protocol.
            </p>
            <p className="text-ink-muted">
              Stack does not prescribe doses. Reported dose ranges shown in the library are
              summaries of publicly available information, not recommendations.
            </p>
          </div>
        </div>
        <button
          onClick={() => setStep('pick')}
          className="mt-8 w-full rounded-xl bg-accent py-4 font-semibold text-black"
        >
          I understand — continue
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Pick a stack</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Choose a protocol from the library, or start blank.
      </p>

      <ul className="mt-6 space-y-3">
        {SEED_STACKS.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => finishWithStack(s.id)}
              className="w-full rounded-2xl border border-line bg-bg-card p-5 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-ink-muted">
                    {s.goal}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-ink-muted">{s.summary}</p>
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => finishWithStack()}
        className="mt-6 w-full rounded-xl border border-line py-4 font-medium"
      >
        Start blank
      </button>
    </div>
  );
}
