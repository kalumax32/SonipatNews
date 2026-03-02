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
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScrollToTop } from '@react-navigation/native';
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
import HeroCard from '../components/HeroCard';
import SkeletonLoader from '../components/SkeletonLoader';
import FloatingButton from '../components/FloatingButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { BorderRadius, FontSize, Spacing, Typography } from '../theme';

// Memoized Category Tab for Performance
const CategoryTabs = React.memo(({ categories, selectedId, onSelect }) => {
  const { colors } = useTheme();
  
  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryScroll}
      contentContainerStyle={styles.categoryContent}
    >
      {(categories || []).map((cat) => {
        const isActive = selectedId === cat.id;
        return (
          <TouchableOpacity
            key={cat.slug}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.7}
            accessibilityRole="tab"
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
      })}
    </Animated.ScrollView>
  );
});

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
    onScroll: (event) => { scrollY.value = event.contentOffset.y; },
  });

  const allCategories = [{ id: null, name: 'सभी', slug: 'all' }, ...CATEGORIES];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date());

  useEffect(() => { loadArticles(true); }, [selectedCategory]);

  async function loadArticles(initial = false) {
    try {
      if (initial) {
        setLoading(true); setPage(1); setError(null);
      }
      const cacheKey = selectedCategory ? `cat_${selectedCategory}_1` : 'home_1';
      if (initial) {
        const cached = await getCachedData(cacheKey);
        if (cached) {
          setArticles(cached.posts); setTotalPages(cached.totalPages); setLoading(false);
          fetchFreshData(1, cacheKey);
          return;
        }
      }
      await fetchFreshData(initial ? 1 : page, initial ? cacheKey : null);
    } catch (err) {
      setError(err.message); setLoading(false);
    }
  }

  async function fetchFreshData(pageNum, cacheKey) {
    try {
      let result = selectedCategory 
        ? await fetchPostsByCategory(selectedCategory, pageNum) 
        : await fetchPosts(pageNum);
        
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
      setLoading(false); setRefreshing(false); setLoadingMore(false);
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true); setPage(1);
    const cacheKey = selectedCategory ? `cat_${selectedCategory}_1` : 'home_1';
    fetchFreshData(1, cacheKey);
  }, [selectedCategory]);

  function loadMore() {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true); fetchFreshData(page + 1, null);
  }

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 150], [0, -50], Extrapolation.CLAMP);
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0.9], Extrapolation.CLAMP);
    return { transform: [{ translateY }], opacity };
  });

  const fabStyle = useAnimatedStyle(() => ({
    opacity: withSpring(scrollY.value > 800 ? 1 : 0),
    transform: [
      { translateY: withSpring(scrollY.value > 800 ? 0 : 50) },
      { scale: withSpring(scrollY.value > 800 ? 1 : 0.8) }
    ],
  }));

  if (loading && articles.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={{ paddingTop: 160 }}>
          <SkeletonLoader count={3} />
        </View>
      </View>
    );
  }

  if (error && articles.length === 0) return <ErrorState message={error} onRetry={() => loadArticles(true)} />;

  const heroArticle = articles[0];
  const feedArticles = articles.slice(1);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <Animated.View style={[styles.headerContainer, headerAnimatedStyle, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
        <BlurView 
          intensity={80} 
          tint={isDark ? 'dark' : 'light'} 
          style={{ paddingTop: Math.max(insets.top, 20) + Spacing.sm, paddingBottom: 0 }}
        >
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={[styles.avatarContainer, { backgroundColor: colors.skeleton, borderColor: colors.border }]}>
                  <Text style={[styles.avatarInitials, { color: colors.textSecondary }]}>MK</Text>
                </View>
                <View>
                  <Text style={[styles.dateText, { color: colors.textMuted }]}>{formattedDate.toUpperCase()}</Text>
                  <Text style={[Typography.titleXL, { color: colors.textPrimary }]}>
                    {getGreeting()}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.themeButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={{ paddingBottom: Spacing.md }}>
            <CategoryTabs categories={allCategories} selectedId={selectedCategory} onSelect={setSelectedCategory} />
          </View>
        </BlurView>
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
            <NewsCard article={item} onPress={() => navigation.navigate('Article', { article: item })} index={index + 1} />
          </View>
        )}
        ListHeaderComponent={
          <View>
            {heroArticle && (
              <HeroCard article={heroArticle} onPress={() => navigation.navigate('Article', { article: heroArticle })} index={0} />
            )}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {selectedCategory ? 'Latest News' : 'Trending'}
              </Text>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 }}>See All</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        }
        ListFooterComponent={loadingMore ? <View style={styles.loadingMore}><LoadingSpinner message="" fullScreen={false} /></View> : <View style={{height: 120}} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} progressViewOffset={140} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
      />
      <Animated.View style={[styles.fabContainer, fabStyle]} pointerEvents="box-none">
        <FloatingButton icon="arrow-up" onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, elevation: 4 },
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
  categoryScroll: { maxHeight: 45 },
  categoryContent: { paddingHorizontal: Spacing.lg, paddingVertical: 4, gap: Spacing.sm },
  categoryTab: { paddingHorizontal: 20, height: 36, borderRadius: BorderRadius.full, justifyContent: 'center' },
  categoryText: { fontSize: 12 },
  listContent: { paddingTop: 180 },
  loadingMore: { height: 80, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  fabContainer: { position: 'absolute', bottom: Spacing.xl + 70, right: Spacing.xl, zIndex: 999 }, // Adjust for tabbar overscroll
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, 
    paddingBottom: Spacing.md, 
    paddingTop: Spacing.lg 
  },
  sectionTitle: { fontSize: 20, fontFamily: Typography.titleXL.fontFamily, fontWeight: '700' },
});