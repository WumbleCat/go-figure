import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFigures } from '../context/FiguresContext';
import { useStats } from '../context/StatsContext';
import { colors, fonts, spacing } from '../theme';

export default function StatsScreen() {
  const { byId } = useFigures();
  const { stats } = useStats();

  const totalSolves = stats.history.length;
  const avgClues =
    totalSolves > 0
      ? (stats.history.reduce((sum, h) => sum + h.cluesUsed, 0) / totalSolves).toFixed(1)
      : '—';
  const avgScore =
    totalSolves > 0
      ? Math.round(stats.history.reduce((sum, h) => sum + h.score, 0) / totalSolves)
      : '—';

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>STREAK</Text>
            <Text style={styles.statValue}>{stats.streak}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>AVG CLUES</Text>
            <Text style={styles.statValue}>{avgClues}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>AVG SCORE</Text>
            <Text style={styles.statValue}>{avgScore}</Text>
          </View>
        </View>

        <Text style={styles.section}>HISTORY</Text>

        {totalSolves === 0 ? (
          <Text style={styles.empty}>No rounds played yet.</Text>
        ) : (
          stats.history.map((h, i) => {
            const fig = byId[h.figureId];
            return (
              <View key={`${h.date}-${i}`} style={styles.entry}>
                <View style={styles.entryLeft}>
                  <Text style={styles.entryName}>{fig?.name ?? h.figureId}</Text>
                  <Text style={styles.entryMeta}>
                    {h.date} · {h.cluesUsed} clues
                  </Text>
                </View>
                <Text style={styles.entryScore}>{h.score}</Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg },
  headRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
  stat: { flex: 1, alignItems: 'center' },
  divider: { width: StyleSheet.hairlineWidth, backgroundColor: colors.rule },
  statLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.inkMuted,
    marginBottom: 6,
  },
  statValue: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    color: colors.ink,
  },
  section: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1.8,
    color: colors.inkMuted,
    marginBottom: spacing.md,
  },
  empty: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.inkMuted,
    fontStyle: 'italic',
    paddingVertical: spacing.md,
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  entryLeft: { flex: 1 },
  entryName: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.ink,
  },
  entryMeta: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.inkMuted,
    marginTop: 2,
  },
  entryScore: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.goldDeep,
  },
});
