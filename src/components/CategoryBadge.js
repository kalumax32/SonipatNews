import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, FontSize, Spacing, CategoryColors } from '../theme';

export default function CategoryBadge({ name, slug, small = false, isBreaking = false }) {
  const { colors } = useTheme();
  const shimmerTranslate = useSharedValue(-1);

  React.useEffect(() => {
    if (isBreaking) {
      shimmerTranslate.value = withRepeat(
        withTiming(2, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        -1,
        false
      );
    }
  }, [isBreaking]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value * 100 }],
  }));

  const badgeColor = CategoryColors[slug] || colors.primary;

  return (
    <View
      style={[
        styles.badge,
        small && styles.badgeSmall,
        { backgroundColor: isBreaking ? colors.accent : badgeColor },
      ]}
    >
      <Text
        style={[
          styles.text,
          small && styles.textSmall,
          { color: isBreaking ? '#000' : '#FFFFFF' },
        ]}
        numberOfLines={1}
      >
        {isBreaking ? 'BREAKING' : name}
      </Text>
      
      {isBreaking && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(255,255,255,0.4)', width: '50%' },
            shimmerStyle,
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    position: 'relative',
  },
  badgeSmall: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 2,
    borderRadius: BorderRadius.xs,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  textSmall: {
    fontSize: 9,
  },
});
