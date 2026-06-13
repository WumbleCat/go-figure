import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  AccessibilityInfo,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFigures } from '../context/FiguresContext';
import { useStats } from '../context/StatsContext';
import { useGame } from '../engine/useGame';
import { CLUES, TOTAL_CLUES } from '../engine/clues';
import { pickDailyFigure, pickRandomFigure, todayString } from '../engine/dailyPuzzle';
import { ClueCard } from '../components/ClueCard';
import { GuessInput } from '../components/GuessInput';
import { Placard } from '../components/Placard';
import { ScoreReveal } from '../components/ScoreReveal';
import { colors, fonts, spacing } from '../theme';

export default function Play() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const isPractice = params.mode === 'practice';
  const { figures, ready } = useFigures();
  const { record } = useStats();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [practiceSeed, setPracticeSeed] = useState(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  const date = todayString();
  const figure = useMemo(() => {
    if (!ready || figures.length === 0) return null;
    return isPractice ? pickRandomFigure(figures) : pickDailyFigure(figures, date);
  }, [ready, figures, isPractice, date, practiceSeed]);

  const game = useGame(figure);
  const [banked, setBanked] = useState(false);

  useEffect(() => {
    if (!figure || !game.solved || banked || isPractice) return;
    setBanked(true);
    record({
      figureId: figure.id,
      date,
      score: game.score,
      cluesUsed: game.revealedCount,
    });
  }, [game.solved, figure, banked, isPractice, date, game.score, game.revealedCount, record]);

  const goHome = useCallback(() => router.replace('/'), [router]);
  const playAgain = useCallback(() => {
    game.reset();
    setBanked(false);
    setPracticeSeed(s => s + 1);
  }, [game]);

  if (!ready || !figure) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.muted}>loading…</Text>
      </SafeAreaView>
    );
  }

  const idx = figures.findIndex(f => f.id === figure.id);
  const figureNumber = (idx + 1).toString().padStart(3, '0');
  const ended = game.solved || game.givenUp;

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Placard
          figureNumber={figureNumber}
          cluesSpent={game.revealedCount}
          totalClues={TOTAL_CLUES}
          score={game.score}
        />
        {isPractice && (
          <View style={styles.practiceBar}>
            <Text style={styles.practiceLabel}>PRACTICE</Text>
          </View>
        )}
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {game.solved && (
            <ScoreReveal
              name={figure.name}
              score={game.score}
              visible
              reduceMotion={reduceMotion}
            />
          )}
          {game.givenUp && !game.solved && (
            <View style={styles.gaveUp}>
              <Text style={styles.eyebrow}>THE FIGURE WAS</Text>
              <Text style={styles.gaveUpName}>{figure.name}</Text>
              <View style={styles.gaveUpRule} />
            </View>
          )}

          {CLUES.map((clue, i) => {
            const revealed = i < game.revealedCount || ended;
            const isNext = i === game.revealedCount && !ended;
            return (
              <ClueCard
                key={clue.key}
                label={clue.label}
                value={clue.get(figure)}
                revealed={revealed}
                locked={isNext}
                onReveal={game.revealNext}
                reduceMotion={reduceMotion}
              />
            );
          })}

          {ended ? (
            <View style={styles.endActions}>
              <Pressable
                onPress={goHome}
                android_disableSound
                hitSlop={8}
                style={pressableBtnStyle}
              >
                <Text style={styles.btnText}>Done</Text>
              </Pressable>
              {isPractice && (
                <Pressable
                  onPress={playAgain}
                  android_disableSound
                  hitSlop={8}
                  style={pressableBtnGhostStyle}
                >
                  <Text style={[styles.btnText, styles.btnGhostText]}>Another</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <Pressable
              onPress={game.giveUp}
              android_disableSound
              hitSlop={8}
              style={pressableGiveUpStyle}
            >
              <Text style={styles.giveUpText}>Give up</Text>
            </Pressable>
          )}
        </ScrollView>
        {!ended && <GuessInput onGuess={game.guess} disabled={ended} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type PressedState = { pressed: boolean };

const pressableBtnStyle = ({ pressed }: PressedState) => [
  styles.btn,
  pressed && styles.btnPressed,
];
const pressableBtnGhostStyle = ({ pressed }: PressedState) => [
  styles.btn,
  styles.btnGhost,
  pressed && styles.btnGhostPressed,
];
const pressableGiveUpStyle = ({ pressed }: PressedState) => [
  styles.giveUp,
  pressed && styles.giveUpPressed,
];

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingBottom: spacing.xl },
  muted: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.inkMuted,
    padding: spacing.lg,
  },
  practiceBar: {
    backgroundColor: colors.paperMuted,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  practiceLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.goldDeep,
  },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 2.4,
    color: colors.inkMuted,
    marginBottom: spacing.sm,
  },
  gaveUp: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  gaveUpName: {
    fontFamily: fonts.serifBold,
    fontSize: 32,
    color: colors.ink,
    textAlign: 'center',
  },
  gaveUpRule: {
    height: 1,
    width: 56,
    backgroundColor: colors.rule,
    marginTop: spacing.md,
  },
  endActions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  btn: {
    flex: 1,
    backgroundColor: colors.ink,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  btnPressed: { backgroundColor: colors.goldDeep },
  btnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    letterSpacing: 1,
    color: colors.paper,
  },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.ink,
  },
  btnGhostPressed: { backgroundColor: colors.paperMuted },
  btnGhostText: { color: colors.ink },
  giveUp: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  giveUpPressed: { opacity: 0.5 },
  giveUpText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1.4,
    color: colors.inkMuted,
  },
});
