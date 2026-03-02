import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, CategoryColors } from '../theme';

export default function GlassCard({
  children,
  categorySlug,
  style,
  borderWidth = 3,
}) {
  const { colors, isDark } = useTheme();
  const borderColor = CategoryColors[categorySlug] || CategoryColors.default;

  if (isDark) {
    // In dark mode: use a clearly visible card bg with a subtle glowing border
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card, // #161616 — distinct from #0D0D0D bg
            borderColor: colors.border,   // #2D2D2D — visible border
            borderWidth: 1,
          },
          style,
        ]}
      >
        <View
          style={[
            styles.categoryBorder,
            { backgroundColor: borderColor, width: borderWidth },
          ]}
        />
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  // Light mode: clean white card with subtle border
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: StyleSheet.hairlineWidth,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.categoryBorder,
          { backgroundColor: borderColor, width: borderWidth },
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  blur: {
    flex: 1,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  categoryBorder: {
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
  },
});
