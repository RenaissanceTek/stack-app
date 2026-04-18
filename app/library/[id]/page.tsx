import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SEED_STACKS } from '../../../content/stacks';
import PageHeader from '../../../components/PageHeader';
import SetActiveButton from './SetActiveButton';

export function generateStaticParams() {
  return SEED_STACKS.map((s) => ({ id: s.id }));
}

export default function StackDetailPage({ params }: { params: { id: string } }) {
  const stack = SEED_STACKS.find((s) => s.id === params.id);
  if (!stack) notFound();

  return (
    <div>
      <Link href="/library" className="mb-4 inline-block text-sm text-ink-muted">
        ← Library
      </Link>
      <PageHeader title={stack.name} subtitle={stack.goal} />

      <p className="text-sm leading-relaxed text-ink-muted">{stack.summary}</p>

      <section className="mt-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Peptides
        </h3>
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-bg-card text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Dose</th>
                <th className="px-3 py-2 text-left">Freq</th>
                <th className="px-3 py-2 text-left">Route</th>
              </tr>
            </thead>
            <tbody>
              {stack.peptides.map((p) => (
                <tr key={p.name} className="border-t border-line">
                  <td className="px-3 py-2 font-medium">{p.name}</td>
                  <td className="px-3 py-2 text-ink-muted">{p.doseRange}</td>
                  <td className="px-3 py-2 text-ink-muted">{p.frequency}</td>
                  <td className="px-3 py-2 text-ink-muted">{p.route}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Weekly timeline
        </h3>
        <ul className="space-y-2">
          {stack.timelineWeeks.map((w) => (
            <li
              key={w.week}
              className="flex gap-3 rounded-xl border border-line bg-bg-card p-3 text-sm"
            >
              <span className="rounded-md bg-bg-elev px-2 py-0.5 text-xs font-semibold text-accent">
                W{w.week}
              </span>
              <span className="text-ink-muted">{w.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-muted">
          Sources
        </h3>
        <ul className="space-y-1 text-sm text-ink-muted">
          {stack.sources.map((s) => (
            <li key={s.label}>{s.url ? <a href={s.url}>{s.label}</a> : s.label}</li>
          ))}
        </ul>
      </section>

      <p className="mt-6 rounded-xl border border-line bg-bg-card p-3 text-xs text-ink-muted">
        Educational only. Not medical advice. Consult a licensed provider before starting.
      </p>

      <div className="mt-6">
        <SetActiveButton stackId={stack.id} />
      </div>
    </div>
  );
}
