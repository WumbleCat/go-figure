import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../theme';

type Props = {
  figureNumber: string;
  cluesSpent: number;
  totalClues: number;
  score: number;
};

export const Placard = React.memo(PlacardImpl);

function PlacardImpl({ figureNumber, cluesSpent, totalClues, score }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.cell}>
        <Text style={styles.label}>FIGURE NO.</Text>
        <Text style={styles.value}>{figureNumber}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.cell}>
        <Text style={styles.label}>CLUES</Text>
        <Text style={styles.value}>
          {cluesSpent} / {totalClues}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.cell}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={[styles.value, styles.score]}>{score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.paper,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.rule,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.inkMuted,
    marginBottom: 4,
  },
  value: {
    fontFamily: fonts.serifBold,
    fontSize: 20,
    color: colors.ink,
  },
  score: {
    color: colors.goldDeep,
  },
});
