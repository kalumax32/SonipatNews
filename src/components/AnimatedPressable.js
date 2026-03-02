import React, { useRef, useCallback } from 'react';
import { Animated, Pressable } from 'react-native';
import { lightHaptic } from '../utils/haptics';

const AnimatedPressable = ({ children, style, onPress, onLongPress, disabled = false, ...rest }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePress = useCallback((e) => {
    if (disabled) return;
    lightHaptic();
    onPress?.(e);
  }, [onPress, disabled]);
  
  const handleLongPress = useCallback((e) => {
    if (disabled) return;
    lightHaptic();
    onLongPress?.(e);
  }, [onLongPress, disabled]);

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      {...rest}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedPressable;
