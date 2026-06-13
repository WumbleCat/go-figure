import { useCallback, useMemo, useState } from 'react';
import { CLUES } from './clues';
import { calculateScore } from './scoring';
import type { Figure } from './loadFigures';

export function useGame(figure: Figure | null) {
  const [revealedCount, setRevealedCount] = useState(1);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [solved, setSolved] = useState(false);
  const [givenUp, setGivenUp] = useState(false);

  const extraClues = Math.max(0, revealedCount - 1);
  const score = useMemo(
    () => calculateScore(extraClues, wrongGuesses),
    [extraClues, wrongGuesses]
  );

  const revealNext = useCallback(() => {
    if (solved || givenUp) return;
    setRevealedCount(c => Math.min(CLUES.length, c + 1));
  }, [solved, givenUp]);

  const guess = useCallback(
    (id: string): boolean => {
      if (!figure || solved || givenUp) return false;
      if (id === figure.id) {
        setSolved(true);
        return true;
      }
      setWrongGuesses(w => w + 1);
      return false;
    },
    [figure, solved, givenUp]
  );

  const giveUp = useCallback(() => {
    if (solved) return;
    setGivenUp(true);
    setRevealedCount(CLUES.length);
  }, [solved]);

  const reset = useCallback(() => {
    setRevealedCount(1);
    setWrongGuesses(0);
    setSolved(false);
    setGivenUp(false);
  }, []);

  return {
    revealedCount,
    wrongGuesses,
    solved,
    givenUp,
    score,
    canRevealMore: revealedCount < CLUES.length,
    revealNext,
    guess,
    giveUp,
    reset,
  };
}
