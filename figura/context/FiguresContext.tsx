import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadFigures, type Figure } from '../engine/loadFigures';

type FiguresState = {
  figures: Figure[];
  byId: Record<string, Figure>;
  ready: boolean;
  error: string | null;
};

const FiguresContext = createContext<FiguresState>({
  figures: [],
  byId: {},
  ready: false,
  error: null,
});

export function FiguresProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FiguresState>({
    figures: [],
    byId: {},
    ready: false,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    loadFigures()
      .then(figures => {
        if (cancelled) return;
        const byId: Record<string, Figure> = {};
        for (const f of figures) byId[f.id] = f;
        setState({ figures, byId, ready: true, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        setState({ figures: [], byId: {}, ready: true, error: message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <FiguresContext.Provider value={state}>{children}</FiguresContext.Provider>;
}

export function useFigures() {
  return useContext(FiguresContext);
}
