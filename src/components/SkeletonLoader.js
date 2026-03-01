import React, { useEffect, useState } from 'react';
import { View, StyleSheet, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  LinearTransition,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius } from '../theme';

function ShimmerBar({ width, height = 14, style, reduceMotion }) {
  const { colors } = useTheme();
  const translateX = useSharedValue(-1);

  useEffect(() => {
    if (!reduceMotion) {
      translateX.value = withRepeat(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      );
    } else {
      translateX.value = 0; // Static state for reduced motion
    }
  }, [reduceMotion]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 120 }],
  }));

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: BorderRadius.sm,
          backgroundColor: colors.skeleton,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            width: 80,
            height: '100%',
            backgroundColor: colors.skeletonHighlight,
            borderRadius: BorderRadius.sm,
          },
          shimmerStyle,
        ]}
      />
    </View>
  );
}

export function CardSkeleton({ reduceMotion }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <ShimmerBar width={120} height={120} style={styles.imageSkeleton} reduceMotion={reduceMotion} />
      <View style={styles.textArea}>
        <ShimmerBar width="90%" height={16} reduceMotion={reduceMotion} />
        <ShimmerBar width="70%" height={14} style={{ marginTop: 8 }} reduceMotion={reduceMotion} />
        <ShimmerBar width="50%" height={12} style={{ marginTop: 12 }} reduceMotion={reduceMotion} />
      </View>
    </View>
  );
}

export function HeroSkeleton({ reduceMotion }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      <ShimmerBar width="100%" height={260} style={{ borderRadius: BorderRadius.xl }} reduceMotion={reduceMotion} />
    </View>
  );
}

export default function SkeletonLoader({ count = 4 }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  return (
    <Animated.View style={styles.container} layout={LinearTransition.springify()}>
      <HeroSkeleton reduceMotion={reduceMotion} />
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} reduceMotion={reduceMotion} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    marginBottom: 12,
    overflow: 'hidden',
  },
  imageSkeleton: {
    borderRadius: 0,
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  textArea: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  hero: {
    marginBottom: 16,
  },
});
