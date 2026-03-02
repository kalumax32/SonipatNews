import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius } from '../theme';

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
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: 'hidden',
            transform: [{ scale: pressed ? 0.9 : 1 }],
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 14,
            elevation: 10,
          },
        ]}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryLight || colors.accent || '#2563EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { width: size, height: size }]}
        >
          <Ionicons name={icon} size={24} color="#FFFFFF" />
        </LinearGradient>
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
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

