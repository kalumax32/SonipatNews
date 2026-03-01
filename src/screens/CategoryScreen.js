import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScrollToTop } from '@react-navigation/native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { fetchPostsByCategory, CATEGORIES } from '../api/wordpress';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { BorderRadius, FontSize, Shadows, Spacing, CategoryColors } from '../theme';

const CATEGORY_ICONS = {
  sonipat: 'location',
  india: 'flag',
  world: 'globe',
  politics: 'people',
  entertainment: 'film',
  lifestyle: 'heart',
  technology: 'hardware-chip',
  business: 'trending-up',
  religion: 'flower',
};

export default function CategoryScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

  useEffect(() => {
    if (selectedCategory) loadArticles();
  }, [selectedCategory]);

  async function loadArticles() {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchPostsByCategory(selectedCategory.id);
      setArticles(result.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function navigateToArticle(article) {
    navigation.navigate('Article', { article });
  }

  // Category grid view
  if (!selectedCategory) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>श्रेणियाँ</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            अपनी पसंद की खबरें चुनें
          </Text>
        </View>

        <FlatList
          key="category-grid"
          data={CATEGORIES}
          keyExtractor={(item) => item.slug}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const catColor = CategoryColors[item.slug] || colors.primary;
            return (
              <MotiView
                from={{ opacity: 0, scale: 0.9, translateY: 20 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                transition={{ type: 'spring', delay: index * 50, damping: 15 }}
                style={{ flex: 1, margin: Spacing.sm }}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryCard,
                    { backgroundColor: colors.card, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                    Shadows.card,
                  ]}
                  onPress={() => setSelectedCategory(item)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconCircle, { backgroundColor: catColor + '15' }]}>
                    <Ionicons name={CATEGORY_ICONS[item.slug] || 'newspaper'} size={28} color={catColor} />
                  </View>
                  <Text style={[styles.categoryName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </MotiView>
            );
          }}
        />
      </View>
    );
  }

  // Category articles list
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      <View style={[styles.listHeader, { borderBottomColor: colors.border, paddingTop: Math.max(insets.top, 20) + Spacing.sm }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setSelectedCategory(null)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {selectedCategory.name}
          </Text>
        </View>
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} onRetry={loadArticles} />
      ) : (
        <FlatList
          ref={flatListRef}
          key={isTablet ? 'tablet-2' : 'phone-1'}
          numColumns={isTablet ? 2 : 1}
          keyExtractor={(item) => item.id.toString()}
          data={articles}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          windowSize={10}
          initialNumToRender={6}
          renderItem={({ item, index }) => (
            <View style={isTablet ? { flex: 1, maxWidth: '50%' } : null}>
              <NewsCard article={item} onPress={() => navigateToArticle(item)} index={index} />
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadArticles();
              }}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              style={styles.empty}
            >
              <Ionicons name="newspaper-outline" size={64} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                इस श्रेणी में कोई लेख नहीं
              </Text>
            </MotiView>
          }
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl + 40,
    paddingBottom: Spacing.lg,
  },
  listHeader: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backBtn: {
    padding: Spacing.xs,
    borderRadius: 20,
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: FontSize.md,
    marginTop: 4,
    fontWeight: '500',
  },
  gridContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxxl * 2,
  },
  categoryCard: {
    flex: 1,
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  categoryName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingTop: Spacing.lg,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.xxxl * 3,
  },
  emptyText: {
    fontSize: FontSize.lg,
    marginTop: Spacing.md,
    fontWeight: '500',
  },
});
