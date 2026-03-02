import React from 'react';
import { Image } from 'expo-image';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../theme';
import { useTheme } from '../../context/ThemeContext';

export default function ShimmerImage({ source, style, contentFit = 'cover' }) {
  const { isDark } = useTheme();
  const themeColors = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[style, { backgroundColor: themeColors.skeleton, overflow: 'hidden' }]}>
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        contentFit={contentFit}
        transition={300} // Native fade-in once loaded
        cachePolicy="memory-disk"
      />
    </View>
  );
}
