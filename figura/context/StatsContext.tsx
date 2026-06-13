import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  applyResult,
  loadStats,
  saveStats,
  type HistoryEntry,
  type Stats,
} from '../lib/storage';

const FALLBACK: Stats = { streak: 0, lastPlayedDate: null, history: [] };

type StatsState = {
  stats: Stats;
  ready: boolean;
  record: (entry: HistoryEntry) => void;
};

const StatsContext = createContext<StatsState>({
  stats: FALLBACK,
  ready: false,
  record: () => {},
});

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Stats>(FALLBACK);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadStats()
      .then(s => {
        if (cancelled) return;
        setStats(s);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const record = useCallback((entry: HistoryEntry) => {
    setStats(prev => {
      const next = applyResult(prev, entry);
      saveStats(next).catch(() => {});
      return next;
    });
  }, []);

  return (
    <StatsContext.Provider value={{ stats, ready, record }}>{children}</StatsContext.Provider>
  );
}

export function useStats() {
  return useContext(StatsContext);
}
