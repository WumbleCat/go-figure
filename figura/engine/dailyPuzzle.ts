import type { Figure } from './loadFigures';

export function hashDateToInt(date: string): number {
  let hash = 5381;
  for (let i = 0; i < date.length; i++) {
    hash = ((hash << 5) + hash + date.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function todayString(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function pickDailyFigure(figures: Figure[], date: string = todayString()): Figure {
  if (figures.length === 0) throw new Error('No figures loaded');
  return figures[hashDateToInt(date) % figures.length];
}

export function pickRandomFigure(figures: Figure[]): Figure {
  return figures[Math.floor(Math.random() * figures.length)];
}
