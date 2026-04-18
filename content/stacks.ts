export type SeedStack = {
  id: string;
  name: string;
  goal: 'Recovery' | 'Fat loss' | 'Skin' | 'GH';
  summary: string;
  peptides: { name: string; doseRange: string; frequency: string; route: string }[];
  timelineWeeks: { week: number; note: string }[];
  sources: { label: string; url?: string }[];
};

export const SEED_STACKS: SeedStack[] = [
  {
    id: 'bpc-157-tb-500-recovery',
    name: 'BPC-157 + TB-500',
    goal: 'Recovery',
    summary: 'Two-peptide stack targeting soft-tissue repair and inflammation.',
    peptides: [
      { name: 'BPC-157', doseRange: '250-500 mcg', frequency: 'Daily', route: 'Subcutaneous' },
      { name: 'TB-500', doseRange: '2-5 mg', frequency: '2x/week', route: 'Subcutaneous' },
    ],
    timelineWeeks: [
      { week: 2, note: 'Most users report reduced joint stiffness.' },
      { week: 4, note: 'Measurable gains in pain-free range of motion.' },
      { week: 8, note: 'Peak reported recovery benefit; many cycle off.' },
    ],
    sources: [{ label: 'Research citations coming in v2' }],
  },
  {
    id: 'semaglutide-weight-loss',
    name: 'Semaglutide',
    goal: 'Fat loss',
    summary: 'GLP-1 receptor agonist. Prescription only — telehealth path required.',
    peptides: [
      { name: 'Semaglutide', doseRange: '0.25-2.4 mg', frequency: 'Weekly', route: 'Subcutaneous' },
    ],
    timelineWeeks: [
      { week: 4, note: 'Appetite suppression stabilizes.' },
      { week: 12, note: 'Most users report 5-8% body weight loss.' },
      { week: 24, note: '10-15% body weight loss at therapeutic dose.' },
    ],
    sources: [{ label: 'Research citations coming in v2' }],
  },
  {
    id: 'ghk-cu-skin',
    name: 'GHK-Cu',
    goal: 'Skin',
    summary: 'Copper peptide for skin firmness and collagen synthesis.',
    peptides: [
      { name: 'GHK-Cu', doseRange: '1-2 mg', frequency: 'Daily (topical or SC)', route: 'Topical / Subcutaneous' },
    ],
    timelineWeeks: [
      { week: 4, note: 'Skin texture improvements reported.' },
      { week: 8, note: 'Fine line reduction in most users.' },
      { week: 12, note: 'Peak cosmetic benefit.' },
    ],
    sources: [{ label: 'Research citations coming in v2' }],
  },
  {
    id: 'cjc-1295-ipamorelin-gh',
    name: 'CJC-1295 + Ipamorelin',
    goal: 'GH',
    summary: 'GHRH + GHRP combination targeting natural growth hormone release.',
    peptides: [
      { name: 'CJC-1295 (no DAC)', doseRange: '100 mcg', frequency: '1-3x/day', route: 'Subcutaneous' },
      { name: 'Ipamorelin', doseRange: '100-200 mcg', frequency: '1-3x/day', route: 'Subcutaneous' },
    ],
    timelineWeeks: [
      { week: 2, note: 'Improved sleep depth commonly reported.' },
      { week: 6, note: 'Recovery and body composition shifts begin.' },
      { week: 12, note: 'Peak reported benefit; most cycle off.' },
    ],
    sources: [{ label: 'Research citations coming in v2' }],
  },
];
