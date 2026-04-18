import Link from 'next/link';
import { SEED_STACKS } from '../../content/stacks';
import PageHeader from '../../components/PageHeader';

export default function LibraryPage() {
  return (
    <div>
      <PageHeader title="Library" subtitle="Curated peptide protocols" />
      <ul className="space-y-3">
        {SEED_STACKS.map((s) => (
          <li key={s.id}>
            <Link
              href={`/library/${s.id}`}
              className="block rounded-2xl border border-line bg-bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-ink-muted">
                    {s.goal}
                  </p>
                </div>
                <span className="text-ink-muted">›</span>
              </div>
              <p className="mt-2 text-sm text-ink-muted">{s.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
