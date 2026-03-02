import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Spacing, Typography } from '../../theme';

const HomeHeader = React.memo(({ avatarInitials = "MK", onNotificationPress }) => {
  const { colors } = useTheme();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date());

  return (
    <View style={styles.header}>
      <View style={styles.headerTitleRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.skeleton, borderColor: colors.border }]}>
            <Text style={[styles.avatarInitials, { color: colors.textSecondary }]}>{avatarInitials}</Text>
          </View>
          <View>
            <Text style={[styles.dateText, { color: colors.textMuted }]}>{formattedDate.toUpperCase()}</Text>
            <Text style={[Typography.titleXL, { color: colors.textPrimary }]}>
              {getGreeting()}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.themeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={onNotificationPress}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  themeButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    borderWidth: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
});

export default HomeHeader;
