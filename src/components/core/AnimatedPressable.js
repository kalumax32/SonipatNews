import React from 'react';
import { Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  FadeInDown 
} from 'react-native-reanimated';

const AnimatedPressableComponent = Animated.createAnimatedComponent(Pressable);

export default function AnimatedPressable({ 
  children, 
  onPress, 
  style, 
  index = 0, 
  entering = FadeInDown.delay(index * 50).springify().damping(12).stiffness(200),
  ...rest 
}) {
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300, mass: 0.5 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300, mass: 0.5 });
  };

  return (
    <Animated.View entering={entering} style={style}>
      <AnimatedPressableComponent
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={pressStyle}
        {...rest}
      >
        {children}
      </AnimatedPressableComponent>
    </Animated.View>
  );
}
