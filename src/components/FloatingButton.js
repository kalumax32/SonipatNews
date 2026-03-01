import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Shadows, BorderRadius } from '../theme';

export default function FloatingButton({
  icon = 'share-outline',
  onPress,
  size = 54,
  style,
}) {
  const { colors } = useTheme();

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.3, translateY: 30 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{
        type: 'spring',
        damping: 12,
        stiffness: 180,
        delay: 500,
      }}
      style={[styles.container, style]}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="ऊपर जाएँ"
        accessibilityHint="फ़ीड के शीर्ष पर वापस जाने के लिए दो बार टैप करें"
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: colors.primary,
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: pressed ? 0.9 : 1 }],
          },
          Shadows.float,
        ]}
      >
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    zIndex: 100,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
