export const BASE = 100;
export const CLUE_COST = 12;
export const MISS_COST = 15;
export const MIN_SCORE = 10;

export function calculateScore(extraCluesRevealed: number, wrongGuesses: number): number {
  const raw = BASE - extraCluesRevealed * CLUE_COST - wrongGuesses * MISS_COST;
  return Math.max(raw, MIN_SCORE);
}
