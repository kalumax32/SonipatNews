import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { lightHaptic } from '../utils/haptics';
import { CARD_PRESS, STAGGER_DELAY } from '../utils/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AnimatedCard({
  children,
  onPress,
  onLongPress,
  index = 0,
  style,
  disabled = false,
  delay,
  ...rest
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(CARD_PRESS.scale, {
      damping: 20,
      stiffness: 400, // Very fast down (~80ms)
      mass: 0.5,
    });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 18,
      stiffness: 300, // Smooth recovery (~120ms)
      mass: 0.6,
    });
  }, []);

  const handlePress = useCallback(() => {
    lightHaptic();
    onPress?.();
  }, [onPress]);

  const handleLongPress = useCallback(() => {
    lightHaptic();
    onLongPress?.();
  }, [onLongPress]);

  const staggerDelay = delay ?? index * STAGGER_DELAY;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 25 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: 'timing',
        duration: 450,
        delay: staggerDelay,
      }}
    >
      <AnimatedPressable
        style={[animatedStyle, style]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={disabled}
        {...rest}
      >
        {children}
      </AnimatedPressable>
    </MotiView>
  );
}
