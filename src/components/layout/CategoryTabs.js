import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { BorderRadius, Spacing } from '../../theme';
import { FlashList } from '@shopify/flash-list';

const CategoryTabs = React.memo(({ categories, selectedId, onSelect }) => {
  const { colors } = useTheme();

  const renderItem = ({ item: cat }) => {
    const isActive = selectedId === cat.id;
    return (
      <TouchableOpacity
        onPress={() => onSelect(cat.id)}
        activeOpacity={0.7}
        accessibilityRole="tab"
        style={{ marginRight: Spacing.sm }}
      >
        {isActive ? (
          <View style={[styles.categoryTab, { backgroundColor: colors.primary, borderWidth: 0, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 }]}>
            <Text style={[styles.categoryText, { color: '#FFFFFF', fontWeight: '600' }]}>
              {cat.name}
            </Text>
          </View>
        ) : (
          <View style={[styles.categoryTab, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
            <Text style={[styles.categoryText, { color: colors.textSecondary, fontWeight: '600' }]}>
              {cat.name}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.categoryScroll}>
      <FlashList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.slug}
        estimatedItemSize={80}
        contentContainerStyle={styles.categoryContent}
        extraData={selectedId}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  categoryScroll: { height: 45 },
  categoryContent: { paddingHorizontal: Spacing.lg, paddingVertical: 4 },
  categoryTab: { paddingHorizontal: 20, height: 36, borderRadius: BorderRadius.full, justifyContent: 'center' },
  categoryText: { fontSize: 12 },
});

export default CategoryTabs;
