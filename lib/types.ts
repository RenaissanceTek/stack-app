export type Unit = 'mg' | 'mcg';

export type InjectionSite =
  | 'Abdomen L'
  | 'Abdomen R'
  | 'Thigh L'
  | 'Thigh R'
  | 'Delt L'
  | 'Delt R'
  | 'Glute L'
  | 'Glute R';

export const INJECTION_SITES: InjectionSite[] = [
  'Abdomen L',
  'Abdomen R',
  'Thigh L',
  'Thigh R',
  'Delt L',
  'Delt R',
  'Glute L',
  'Glute R',
];

export type LogEntry = {
  id: string;
  timestamp: string;
  peptideName: string;
  doseAmount: number;
  unit: Unit;
  site: InjectionSite;
  notes?: string;
};

export type Vial = {
  id: string;
  peptideName: string;
  totalMg: number;
  bacWaterMl: number;
  reconstitutedAt?: string;
  expiresAt?: string;
};

export type Settings = {
  defaultUnit: Unit;
  theme: 'dark' | 'light';
};

export const DEFAULT_SETTINGS: Settings = {
  defaultUnit: 'mcg',
  theme: 'dark',
};
