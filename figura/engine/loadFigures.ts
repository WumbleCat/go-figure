import { Asset } from 'expo-asset';
import Papa from 'papaparse';

export type Figure = {
  id: string;
  name: string;
  aliases: string[];
  century: string;
  gender: string;
  continent: string;
  fact1: string;
  field: string;
  fact2: string;
  era: string;
  country: string;
  fact3: string;
  difficulty: number;
};

type RawRow = Record<keyof Omit<Figure, 'aliases' | 'difficulty'>, string> & {
  aliases: string;
  difficulty: string;
};

export async function loadFigures(): Promise<Figure[]> {
  const asset = Asset.fromModule(require('../assets/data/figures_2.csv'));
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  const response = await fetch(uri);
  const csv = await response.text();

  const parsed = Papa.parse<RawRow>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data
    .filter(row => row && row.id)
    .map(row => ({
      id: row.id,
      name: row.name,
      aliases: row.aliases
        ? row.aliases.split(';').map(s => s.trim()).filter(Boolean)
        : [],
      century: row.century,
      gender: row.gender,
      continent: row.continent,
      fact1: row.fact1,
      field: row.field,
      fact2: row.fact2,
      era: row.era,
      country: row.country,
      fact3: row.fact3,
      difficulty: Number(row.difficulty) || 1,
    }));
}
