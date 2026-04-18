'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Home' },
  { href: '/library', label: 'Library' },
  { href: '/log', label: 'Log' },
  { href: '/inventory', label: 'Vials' },
  { href: '/settings', label: 'More' },
];

export default function Nav() {
  const pathname = usePathname();
  if (pathname === '/onboarding') return null;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-line bg-bg/95 backdrop-blur safe-bottom">
      <ul className="grid grid-cols-5">
        {tabs.map((t) => {
          const active =
            t.href === '/'
              ? pathname === '/'
              : pathname === t.href || pathname.startsWith(t.href + '/');
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={
                  'flex h-14 flex-col items-center justify-center text-xs ' +
                  (active ? 'text-accent' : 'text-ink-muted')
                }
              >
                <span className="font-medium">{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
