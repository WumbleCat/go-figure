import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFigures } from '../context/FiguresContext';
import { useStats } from '../context/StatsContext';
import { todayString } from '../engine/dailyPuzzle';
import { colors, fonts, spacing } from '../theme';

export default function Today() {
  const router = useRouter();
  const { error } = useFigures();
  const { stats } = useStats();

  const goPlay = useCallback(() => router.push('/play'), [router]);
  const goPractice = useCallback(() => router.push('/play?mode=practice'), [router]);
  const goStats = useCallback(() => router.push('/stats'), [router]);

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.muted}>could not load figures: {error}</Text>
      </SafeAreaView>
    );
  }

  const date = todayString();
  const playedToday = stats.lastPlayedDate === date;
  const todayEntry = stats.history.find(h => h.date === date);

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>{date}</Text>
          <Text style={styles.title}>Today's figure</Text>
          <View style={styles.rule} />
          <Text style={styles.body}>
            A figure waits in the gallery. Reveal as few clues as you can, then name them.
          </Text>
        </View>

        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>STREAK</Text>
            <Text style={styles.statValue}>{stats.streak}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>SOLVED</Text>
            <Text style={styles.statValue}>{stats.history.length}</Text>
          </View>
        </View>

        {playedToday && todayEntry ? (
          <View style={styles.banner}>
            <Text style={styles.bannerLabel}>TODAY'S SCORE</Text>
            <Text style={styles.bannerValue}>{todayEntry.score}</Text>
            <Text style={styles.bannerMeta}>{todayEntry.cluesUsed} clues used</Text>
          </View>
        ) : (
          <Pressable
            onPress={goPlay}
            android_disableSound
            hitSlop={8}
            style={pressablePlayStyle}
            accessibilityRole="button"
          >
            <Text style={styles.playBtnText}>Play</Text>
            <Feather name="arrow-right" size={18} color={colors.paper} />
          </Pressable>
        )}

        <Pressable
          onPress={goPractice}
          android_disableSound
          hitSlop={8}
          style={pressablePracticeStyle}
        >
          <Text style={styles.practiceText}>Practice round</Text>
        </Pressable>

        <Pressable
          onPress={goStats}
          android_disableSound
          hitSlop={8}
          style={styles.statsLink}
        >
          <Text style={styles.statsLinkText}>View stats</Text>
          <Feather name="chevron-right" size={16} color={colors.inkMuted} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

type PressedState = { pressed: boolean };

const pressablePlayStyle = ({ pressed }: PressedState) => [
  styles.playBtn,
  pressed && styles.playBtnPressed,
];
const pressablePracticeStyle = ({ pressed }: PressedState) => [
  styles.practiceBtn,
  pressed && styles.practiceBtnPressed,
];

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingTop: spacing.xl },
  muted: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.inkMuted,
    padding: spacing.lg,
  },
  hero: { marginBottom: spacing.xl },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.inkMuted,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 40,
    color: colors.ink,
    lineHeight: 46,
  },
  rule: {
    height: 1,
    width: 56,
    backgroundColor: colors.gold,
    marginVertical: spacing.md,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.inkMuted,
    lineHeight: 22,
  },
  statRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: StyleSheet.hairlineWidth, backgroundColor: colors.rule },
  statLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.inkMuted,
    marginBottom: 6,
  },
  statValue: {
    fontFamily: fonts.serifBold,
    fontSize: 28,
    color: colors.ink,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ink,
    paddingVertical: spacing.md + 2,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  playBtnPressed: { backgroundColor: colors.goldDeep },
  playBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.paper,
    letterSpacing: 1,
  },
  banner: {
    backgroundColor: colors.paperMuted,
    padding: spacing.lg,
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: colors.gold,
    marginBottom: spacing.md,
  },
  bannerLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.inkMuted,
  },
  bannerValue: {
    fontFamily: fonts.serifBold,
    fontSize: 48,
    color: colors.goldDeep,
    marginVertical: 4,
  },
  bannerMeta: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkMuted,
  },
  practiceBtn: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ink,
    marginBottom: spacing.lg,
  },
  practiceBtnPressed: { backgroundColor: colors.paperMuted },
  practiceText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink,
    letterSpacing: 1,
  },
  statsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: 4,
  },
  statsLinkText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.inkMuted,
    letterSpacing: 1,
  },
});
