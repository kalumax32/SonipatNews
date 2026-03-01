import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useTheme } from '../context/ThemeContext';
import { fetchPosts, fetchPostsByCategory, CATEGORIES } from '../api/wordpress';
import { getCachedData, setCachedData } from '../api/cache';
import NewsCard from '../components/NewsCard';
import SkeletonLoader from '../components/SkeletonLoader';
import FloatingButton from '../components/FloatingButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { BorderRadius, FontSize, Spacing } from '../theme';

const { width } = Dimensions.get('window');

// Custom animated Category Tab component
function CategoryTabs({ categories, selectedId, onSelect }) {
  const { colors } = useTheme();
  
  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryScroll}
      contentContainerStyle={styles.categoryContent}
    >
      {categories.map((cat) => {
        const isActive = selectedId === cat.id;
        return (
          <TouchableOpacity
            key={cat.slug}
            style={[
              styles.categoryTab,
              {
                backgroundColor: isActive ? colors.primary : 'transparent',
                borderColor: isActive ? colors.primary : colors.glassBorder,
              },
            ]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`श्रेणी: ${cat.name}`}
          >
            <Text
              style={[
                styles.categoryText,
                { color: isActive ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Animated.ScrollView>
  );
}

export default function HomeScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const scrollY = useSharedValue(0);
  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const allCategories = [{ id: null, name: 'सभी', slug: 'all' }, ...CATEGORIES];

  useEffect(() => {
    loadArticles(true);
  }, [selectedCategory]);

  async function loadArticles(initial = false) {
    try {
      if (initial) {
        setLoading(true);
        setPage(1);
        setError(null);
      }
      const cacheKey = selectedCategory ? `cat_${selectedCategory}_1` : 'home_1';
      if (initial) {
        const cached = await getCachedData(cacheKey);
        if (cached) {
          setArticles(cached.posts);
          setTotalPages(cached.totalPages);
          setLoading(false);
          fetchFreshData(1, cacheKey);
          return;
        }
      }
      await fetchFreshData(initial ? 1 : page, initial ? cacheKey : null);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function fetchFreshData(pageNum, cacheKey) {
    try {
      let result;
      if (selectedCategory) {
        result = await fetchPostsByCategory(selectedCategory, pageNum);
      } else {
        result = await fetchPosts(pageNum);
      }
      if (pageNum === 1) {
        setArticles(result.posts);
        if (cacheKey) setCachedData(cacheKey, result);
      } else {
        setArticles((prev) => [...prev, ...result.posts]);
      }
      setTotalPages(result.totalPages);
      setPage(pageNum);
    } catch (err) {
      if (pageNum === 1) setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    const cacheKey = selectedCategory ? `cat_${selectedCategory}_1` : 'home_1';
    fetchFreshData(1, cacheKey);
  }, [selectedCategory]);

  function loadMore() {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    fetchFreshData(page + 1, null);
  }

  function navigateToArticle(article) {
    navigation.navigate('Article', { article });
  }

  // Parallax styles for header wrapper
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 150],
      [0, -50],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.9],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateY }], opacity };
  });

  const fabStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(scrollY.value > 800 ? 1 : 0),
      transform: [
        { translateY: withSpring(scrollY.value > 800 ? 0 : 50) },
        { scale: withSpring(scrollY.value > 800 ? 1 : 0.8) }
      ],
    };
  });

  if (loading && articles.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <View style={[styles.headerContainer, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 20) + Spacing.sm }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.primary }]}>
                Sonipat News
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
                सोनीपत की ताज़ा खबरें
              </Text>
            </View>
          </View>
        </View>
        
        <View style={{ paddingTop: 160 }}>
          <SkeletonLoader count={3} />
        </View>
      </View>
    );
  }

  if (error && articles.length === 0) {
    return <ErrorState message={error} onRetry={() => loadArticles(true)} />;
  }

  const heroArticle = articles[0];
  const feedArticles = articles.slice(1);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <Animated.View style={[styles.headerContainer, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 20) + Spacing.sm }, headerAnimatedStyle]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.primary }]}>
              Sonipat News
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              सोनीपत की ताज़ा खबरें
            </Text>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={[styles.themeButton, { backgroundColor: colors.card }]}>
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <CategoryTabs
          categories={allCategories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </Animated.View>

      <Animated.FlatList
        ref={flatListRef}
        key={isTablet ? 'tablet-2' : 'phone-1'}
        numColumns={isTablet ? 2 : 1}
        data={feedArticles}
        keyExtractor={(item) => item.id.toString()}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={10}
        initialNumToRender={6}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <View style={isTablet ? { flex: 1, maxWidth: '50%' } : null}>
            <NewsCard
              article={item}
              onPress={() => navigateToArticle(item)}
              index={index + 1} // +1 because hero is index 0
            />
          </View>
        )}
        ListHeaderComponent={
          heroArticle ? (
            <HeroCard
              article={heroArticle}
              onPress={() => navigateToArticle(heroArticle)}
              index={0}
            />
          ) : null
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <LoadingSpinner message="" fullScreen={false} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400 }}
            style={styles.empty}
          >
            <Ionicons name="newspaper-outline" size={80} color={colors.border} style={{ marginBottom: Spacing.md }} />
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontWeight: 'bold' }]}>
              कोई लेख नहीं मिला
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted, fontSize: FontSize.sm, marginTop: Spacing.xs }]}>
              कृपया बाद में फिर से जाँच करें
            </Text>
          </MotiView>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressViewOffset={140} // Offset for custom header
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
      />
      {/* Back to Top FAB */}
      <Animated.View style={[styles.fabContainer, fabStyle]} pointerEvents="box-none">
        <FloatingButton icon="arrow-up" onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })} />
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxl + 2,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    marginTop: 2,
    fontWeight: '500',
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryScroll: {
    maxHeight: 45,
  },
  categoryContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 2,
    gap: Spacing.sm,
  },
  categoryTab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingTop: 160, // Padding for absolute header
  },
  loadingMore: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    padding: Spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: '500',
  },
  fabContainer: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    zIndex: 999,
  },
});
