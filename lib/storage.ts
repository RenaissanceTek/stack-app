export type Peptide = {
  id: string;
  name: string;
  category: string;
  halfLifeHours?: number;
};

export type LogEntry = {
  id: string;
  timestamp: number;
  peptideName: string;
  doseAmount: number;
  unit: 'mg' | 'mcg';
  site: string;
  notes?: string;
};

export type Vial = {
  id: string;
  peptideName: string;
  totalMg: number;
  remainingMg: number;
  bacWaterMl: number;
  reconstitutedAt?: number;
  expiresAt?: number;
};

export type Settings = {
  defaultUnit: 'mg' | 'mcg';
  theme: 'dark' | 'light';
};

export const KEYS = {
  ONBOARDED: 'stack:v1:onboarded',
  ACTIVE_STACK: 'stack:v1:activeStack',
  LOGS: 'stack:v1:logs',
  VIALS: 'stack:v1:vials',
  SETTINGS: 'stack:v1:settings',
} as const;

export const INJECTION_SITES = [
  'Abdomen L',
  'Abdomen R',
  'Thigh L',
  'Thigh R',
  'Delt L',
  'Delt R',
  'Glute L',
  'Glute R',
];

const isBrowser = () => typeof window !== 'undefined';

export function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or disabled; silently drop
  }
}

export function removeItem(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function updateList<T>(key: string, mutate: (prev: T[]) => T[]): T[] {
  const prev = getItem<T[]>(key, []);
  const next = mutate(prev);
  setItem(key, next);
  return next;
}

export function getLogs(): LogEntry[] {
  return getItem<LogEntry[]>(KEYS.LOGS, []);
}

export function addLog(entry: LogEntry): LogEntry[] {
  return updateList<LogEntry>(KEYS.LOGS, (prev) => [entry, ...prev]);
}

export function getVials(): Vial[] {
  return getItem<Vial[]>(KEYS.VIALS, []);
}

export function addVial(vial: Vial): Vial[] {
  return updateList<Vial>(KEYS.VIALS, (prev) => [vial, ...prev]);
}

export function getSettings(): Settings {
  return getItem<Settings>(KEYS.SETTINGS, { defaultUnit: 'mcg', theme: 'dark' });
}

export function setSettings(s: Settings): void {
  setItem(KEYS.SETTINGS, s);
}

export function getActiveStackId(): string | null {
  return getItem<string | null>(KEYS.ACTIVE_STACK, null);
}

export function setActiveStackId(id: string): void {
  setItem(KEYS.ACTIVE_STACK, id);
}

export function isOnboarded(): boolean {
  return getItem<boolean>(KEYS.ONBOARDED, false);
}

export function setOnboarded(): void {
  setItem(KEYS.ONBOARDED, true);
}

export function exportAll(): Record<string, unknown> {
  return {
    onboarded: getItem(KEYS.ONBOARDED, false),
    activeStack: getItem(KEYS.ACTIVE_STACK, null),
    logs: getLogs(),
    vials: getVials(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
  };
}

export function resetAll(): void {
  if (!isBrowser()) return;
  Object.values(KEYS).forEach((k) => removeItem(k));
}

export function computeStreakDays(logs: LogEntry[]): number {
  if (logs.length === 0) return 0;
  const dayKeys = new Set<string>();
  for (const l of logs) {
    const d = new Date(l.timestamp);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    dayKeys.add(key);
  }
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (true) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (dayKeys.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
