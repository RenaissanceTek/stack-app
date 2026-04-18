import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_SETTINGS, LogEntry, Settings, Vial } from './types';

export const KEYS = {
  onboarded: 'stack:v1:onboarded',
  activeStackId: 'stack:v1:active-stack-id',
  logs: 'stack:v1:logs',
  vials: 'stack:v1:vials',
  settings: 'stack:v1:settings',
} as const;

export const ALL_KEYS = Object.values(KEYS);

export async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // swallow — nothing useful to do from UI path
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // swallow
  }
}

export async function getOnboarded(): Promise<boolean> {
  return getItem<boolean>(KEYS.onboarded, false);
}

export async function setOnboarded(value: boolean): Promise<void> {
  return setItem(KEYS.onboarded, value);
}

export async function getActiveStackId(): Promise<string | null> {
  return getItem<string | null>(KEYS.activeStackId, null);
}

export async function setActiveStackId(id: string): Promise<void> {
  return setItem(KEYS.activeStackId, id);
}

export async function getLogs(): Promise<LogEntry[]> {
  const logs = await getItem<LogEntry[]>(KEYS.logs, []);
  if (!Array.isArray(logs)) return [];
  return logs;
}

export async function appendLog(entry: LogEntry): Promise<void> {
  const logs = await getLogs();
  logs.push(entry);
  await setItem(KEYS.logs, logs);
}

export async function getVials(): Promise<Vial[]> {
  const vials = await getItem<Vial[]>(KEYS.vials, []);
  if (!Array.isArray(vials)) return [];
  return vials;
}

export async function appendVial(vial: Vial): Promise<void> {
  const vials = await getVials();
  vials.push(vial);
  await setItem(KEYS.vials, vials);
}

export async function getSettings(): Promise<Settings> {
  const s = await getItem<Partial<Settings>>(KEYS.settings, {});
  return { ...DEFAULT_SETTINGS, ...s };
}

export async function setSettings(s: Settings): Promise<void> {
  return setItem(KEYS.settings, s);
}

export async function exportAll(): Promise<string> {
  const [onboarded, activeStackId, logs, vials, settings] = await Promise.all([
    getOnboarded(),
    getActiveStackId(),
    getLogs(),
    getVials(),
    getSettings(),
  ]);
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      [KEYS.onboarded]: onboarded,
      [KEYS.activeStackId]: activeStackId,
      [KEYS.logs]: logs,
      [KEYS.vials]: vials,
      [KEYS.settings]: settings,
    },
    null,
    2,
  );
}

export async function resetAll(): Promise<void> {
  await Promise.all(ALL_KEYS.map((k) => removeItem(k)));
}
