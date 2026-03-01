import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../theme';

export default function LoadingSpinner({ message = 'लोड हो रहा है...', fullScreen = true }) {
  const { colors } = useTheme();
  
  const scale = useSharedValue(0.8);
  const rotation = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  const containerStyle = fullScreen ? styles.fullScreen : styles.inline;

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          styles.spinner,
          { borderColor: colors.primary, borderTopColor: colors.accent },
          animatedStyle,
        ]}
      />
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
  },
  inline: {
    padding: Spacing.xl,
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
  },
  message: {
    marginTop: Spacing.lg,
    fontSize: FontSize.md,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
