import type { Figure } from './loadFigures';

export type ClueKey =
  | 'century'
  | 'gender'
  | 'continent'
  | 'fact1'
  | 'field'
  | 'fact2'
  | 'era'
  | 'country'
  | 'fact3';

export type ClueDef = {
  key: ClueKey;
  label: string;
  get: (f: Figure) => string;
};

export const CLUES: ClueDef[] = [
  { key: 'century', label: 'Century', get: f => f.century },
  { key: 'gender', label: 'Gender', get: f => f.gender },
  { key: 'continent', label: 'Continent', get: f => f.continent },
  { key: 'fact1', label: 'Fact I', get: f => f.fact1 },
  { key: 'field', label: 'Field', get: f => f.field },
  { key: 'fact2', label: 'Fact II', get: f => f.fact2 },
  { key: 'era', label: 'Era', get: f => f.era },
  { key: 'country', label: 'Country', get: f => f.country },
  { key: 'fact3', label: 'Fact III', get: f => f.fact3 },
];

export const TOTAL_CLUES = CLUES.length;
