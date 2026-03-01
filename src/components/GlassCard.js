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

  if (isDark && Platform.OS !== 'web') {
    return (
      <View style={[styles.container, style]}>
        <BlurView
          intensity={30}
          tint="dark"
          style={[
            styles.blur,
            {
              borderColor: colors.glassBorder,
              borderWidth: 1,
            },
          ]}
        >
          <View
            style={[
              styles.categoryBorder,
              { backgroundColor: borderColor, width: borderWidth },
            ]}
          />
          <View style={styles.content}>{children}</View>
        </BlurView>
      </View>
    );
  }

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
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  blur: {
    flex: 1,
    borderRadius: BorderRadius.lg,
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
