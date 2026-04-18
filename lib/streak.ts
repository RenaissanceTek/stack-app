import { LogEntry } from './types';

function dayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function addDays(d: Date, delta: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + delta);
  return copy;
}

export function computeStreak(logs: LogEntry[], now: Date = new Date()): number {
  if (logs.length === 0) return 0;
  const days = new Set(logs.map((l) => dayKey(l.timestamp)));
  let count = 0;
  let cursor = new Date(now);
  // If today has no log, streak anchors at most recent day with log.
  // For simplicity: streak counts consecutive days ending today or yesterday.
  if (!days.has(dayKey(cursor.toISOString()))) {
    cursor = addDays(cursor, -1);
    if (!days.has(dayKey(cursor.toISOString()))) return 0;
  }
  while (days.has(dayKey(cursor.toISOString()))) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}
