import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts, spacing } from '../theme';

type Props = {
  name: string;
  score: number;
  visible: boolean;
  reduceMotion?: boolean;
};

export function ScoreReveal({ name, score, visible, reduceMotion }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);
  const underline = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      opacity.value = 0;
      translateY.value = 8;
      underline.value = 0;
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (reduceMotion) {
      opacity.value = 1;
      translateY.value = 0;
      underline.value = 1;
    } else {
      opacity.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.cubic) });
      translateY.value = withTiming(0, { duration: 480, easing: Easing.out(Easing.cubic) });
      underline.value = withDelay(
        180,
        withTiming(1, { duration: 620, easing: Easing.out(Easing.cubic) })
      );
    }
  }, [visible, reduceMotion, opacity, translateY, underline]);

  const nameStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  const underlineStyle = useAnimatedStyle(() => ({
    width: `${underline.value * 100}%`,
  }));

  if (!visible) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>SOLVED</Text>
      <Animated.Text style={[styles.name, nameStyle]}>{name}</Animated.Text>
      <View style={styles.underlineTrack}>
        <Animated.View style={[styles.underlineFill, underlineStyle]} />
      </View>
      <Text style={styles.score}>+{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 2.4,
    color: colors.goldDeep,
    marginBottom: spacing.md,
  },
  name: {
    fontFamily: fonts.serifBold,
    fontSize: 36,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 42,
  },
  underlineTrack: {
    height: 2,
    width: '60%',
    marginTop: spacing.md,
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  underlineFill: {
    height: 2,
    backgroundColor: colors.gold,
  },
  score: {
    fontFamily: fonts.serifBold,
    fontSize: 22,
    color: colors.goldDeep,
    marginTop: spacing.lg,
  },
});
