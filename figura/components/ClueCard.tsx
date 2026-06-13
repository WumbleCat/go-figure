import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts, spacing } from '../theme';

type Props = {
  label: string;
  value: string;
  revealed: boolean;
  locked: boolean;
  onReveal?: () => void;
  reduceMotion?: boolean;
};

export const ClueCard = React.memo(ClueCardImpl);

function ClueCardImpl({ label, value, revealed, locked, onReveal, reduceMotion }: Props) {
  const sweep = useSharedValue(revealed ? 1 : 0);
  const valueOpacity = useSharedValue(revealed ? 1 : 0);

  useEffect(() => {
    if (revealed) {
      if (reduceMotion) {
        sweep.value = 1;
        valueOpacity.value = 1;
      } else {
        sweep.value = withTiming(1, { duration: 540, easing: Easing.out(Easing.cubic) });
        valueOpacity.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.cubic) });
      }
    } else {
      sweep.value = 0;
      valueOpacity.value = 0;
    }
  }, [revealed, reduceMotion, sweep, valueOpacity]);

  const sweepStyle = useAnimatedStyle(() => ({
    width: `${sweep.value * 100}%`,
  }));
  const valueStyle = useAnimatedStyle(() => ({
    opacity: valueOpacity.value,
    transform: [{ translateY: (1 - valueOpacity.value) * 4 }],
  }));

  const interactive = locked && !revealed;

  return (
    <Pressable
      onPress={interactive ? onReveal : undefined}
      disabled={!interactive}
      style={({ pressed }) => [styles.card, pressed && interactive && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={revealed ? `${label}: ${value}` : `Reveal clue: ${label}`}
    >
      <View style={styles.row}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        {!revealed && <Feather name="lock" size={13} color={colors.inkMuted} />}
      </View>
      <View style={styles.ruleTrack}>
        <Animated.View style={[styles.ruleFill, sweepStyle]} />
      </View>
      {revealed ? (
        <Animated.Text style={[styles.value, valueStyle]}>{value || '—'}</Animated.Text>
      ) : (
        <Text style={styles.placeholder}>{interactive ? 'Tap to reveal' : '—'}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.paper,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.rule,
  },
  pressed: {
    backgroundColor: colors.paperMuted,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1.6,
    color: colors.inkMuted,
  },
  ruleTrack: {
    height: 1,
    backgroundColor: colors.rule,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  ruleFill: {
    height: 1,
    backgroundColor: colors.gold,
  },
  value: {
    fontFamily: fonts.sans,
    fontSize: 17,
    color: colors.ink,
    lineHeight: 23,
  },
  placeholder: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.inkMuted,
    fontStyle: 'italic',
  },
});
