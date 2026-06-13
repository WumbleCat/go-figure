import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@figura/stats/v1';

export type HistoryEntry = {
  figureId: string;
  date: string;
  score: number;
  cluesUsed: number;
};

export type Stats = {
  streak: number;
  lastPlayedDate: string | null;
  history: HistoryEntry[];
};

const EMPTY: Stats = { streak: 0, lastPlayedDate: null, history: [] };

export async function loadStats(): Promise<Stats> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Stats>;
    return {
      streak: parsed.streak ?? 0,
      lastPlayedDate: parsed.lastPlayedDate ?? null,
      history: parsed.history ?? [],
    };
  } catch {
    return EMPTY;
  }
}

export async function saveStats(stats: Stats): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(stats));
}

export async function clearStats(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

export function applyResult(prev: Stats, entry: HistoryEntry): Stats {
  const yesterday = previousDate(entry.date);
  let streak: number;
  if (prev.lastPlayedDate === entry.date) {
    streak = prev.streak || 1;
  } else if (prev.lastPlayedDate === yesterday) {
    streak = (prev.streak || 0) + 1;
  } else {
    streak = 1;
  }
  const dedupedHistory =
    prev.lastPlayedDate === entry.date
      ? [entry, ...prev.history.filter(h => h.date !== entry.date)]
      : [entry, ...prev.history];
  return {
    streak,
    lastPlayedDate: entry.date,
    history: dedupedHistory.slice(0, 200),
  };
}

function previousDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}
