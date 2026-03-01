import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../theme';
import { lightHaptic } from '../utils/haptics';

export default function ErrorState({ message = 'कुछ गलत हो गया', onRetry }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.iconContainer}>
        <Ionicons name="cloud-offline" size={72} color={colors.textMuted} />
      </View>
      
      <View>
        <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      </View>

      {onRetry && (
        <View>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.8, transform: [{ scale: 0.96 }] },
            ]}
            onPress={() => {
              lightHaptic();
              onRetry();
            }}
          >
            <Ionicons name="refresh" size={20} color="#FFF" style={styles.btnIcon} />
            <Text style={styles.buttonText}>पुनः प्रयास करें</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
    opacity: 0.8,
  },
  message: {
    fontSize: FontSize.lg,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 26,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnIcon: {
    marginRight: Spacing.sm,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
