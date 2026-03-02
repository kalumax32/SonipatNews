import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Image } from 'expo-image';
import RenderHtml from 'react-native-render-html';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { isBookmarked, addBookmark, removeBookmark } from '../api/bookmarks';
import { fetchPostsByCategory } from '../api/wordpress';
import CategoryBadge from '../components/CategoryBadge';
import TrendingCard from '../components/cards/TrendingCard';
import FloatingButton from '../components/FloatingButton';
import AnimatedCard from '../components/AnimatedCard';
import { BorderRadius, FontSize, Spacing, CategoryColors } from '../theme';
import { lightHaptic, successHaptic } from '../utils/haptics';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.4; // 40% of screen height

export default function ArticleScreen({ route, navigation }) {
  const { article } = route.params;
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [bookmarked, setBookmarked] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);

  const scrollY = useSharedValue(0);

  // Hide the bottom tab bar on article screen so the share FAB is accessible
  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => {
      // Restore the tab bar when leaving the article screen
      parent?.setOptions({ tabBarStyle: undefined });
    };
  }, [navigation]);

  useEffect(() => {
    checkBookmark();
    loadRelated();
  }, [article.id]);

  async function checkBookmark() {
    const status = await isBookmarked(article.id);
    setBookmarked(status);
  }

  async function toggleBookmark() {
    lightHaptic();
    if (bookmarked) {
      await removeBookmark(article.id);
      setBookmarked(false);
    } else {
      await addBookmark(article);
      setBookmarked(true);
      successHaptic();
    }
  }

  async function loadRelated() {
    try {
      if (article.categoryIds?.length > 0) {
        const result = await fetchPostsByCategory(article.categoryIds[0], 1, 4);
        setRelatedArticles(result.posts.filter((p) => p.id !== article.id).slice(0, 3));
      }
    } catch {}
  }

  async function shareArticle() {
    lightHaptic();
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.link}`,
        url: article.link,
      });
    } catch {}
  }

  const primaryCategory = article.categories?.[0];
  const headerColor = primaryCategory 
    ? (CategoryColors[primaryCategory.slug] || colors.primary)
    : colors.primary;

  const contentHeight = useSharedValue(1);
  const layoutHeight = useSharedValue(1);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      contentHeight.value = event.contentSize.height;
      layoutHeight.value = event.layoutMeasurement.height;
    },
  });

  // Collapsing header styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HERO_HEIGHT - 100, HERO_HEIGHT],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [HERO_HEIGHT - 100, HERO_HEIGHT],
      [20, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const heroAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-100, 0, HERO_HEIGHT],
      [-50, 0, HERO_HEIGHT * 0.5],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.5, 1],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateY }, { scale }] };
  });

  const progressStyle = useAnimatedStyle(() => {
    const totalScroll = Math.max(contentHeight.value - layoutHeight.value, 1);
    const progress = Math.min(Math.max(scrollY.value / totalScroll, 0), 1);
    return {
      width: `${progress * 100}%`,
    };
  });

  const tagsStyles = {
    body: { color: colors.text, fontSize: FontSize.lg, lineHeight: 30, fontFamily: 'System' },
    p: { marginBottom: Spacing.lg, color: colors.textSecondary },
    h1: { color: colors.text, fontSize: FontSize.xxl, fontWeight: '800', marginVertical: Spacing.md },
    h2: { color: colors.text, fontSize: FontSize.xl, fontWeight: '700', marginVertical: Spacing.md },
    h3: { color: colors.text, fontSize: FontSize.lg, fontWeight: '700', marginVertical: Spacing.sm },
    a: { color: colors.primary, textDecorationLine: 'underline' },
    img: { borderRadius: BorderRadius.md, marginTop: Spacing.sm, marginBottom: Spacing.sm },
    li: { color: colors.textSecondary, fontSize: FontSize.lg, lineHeight: 28, marginBottom: Spacing.xs },
    strong: { fontWeight: '800', color: colors.text },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
      paddingLeft: 24,
      marginVertical: 32,
      fontStyle: 'italic',
      color: colors.textSecondary,
      fontSize: 22,
      lineHeight: 34,
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Floating Header */}
      <Animated.View style={[styles.floatingHeader, headerAnimatedStyle]}>
        <BlurView 
          intensity={90} 
          tint={isDark ? "dark" : "light"}
          style={[styles.headerBlurContent, { paddingTop: Math.max(insets.top, 20) + Spacing.sm }]}
        >
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
            accessibilityRole="button"
            accessibilityLabel="वापस जाएँ"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {article.title}
          </Text>
          <View style={styles.topBarActions}>
            <TouchableOpacity 
              onPress={toggleBookmark} 
              style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
              accessibilityRole="button"
              accessibilityLabel={bookmarked ? "बुकमार्क हटाएँ" : "बुकमार्क करें"}
              accessibilityState={{ checked: bookmarked }}
            >
              <Feather
                name="bookmark"
                size={22}
                color={bookmarked ? colors.primaryLight : colors.text}
              />
            </TouchableOpacity>
          </View>
        </BlurView>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, progressStyle, { backgroundColor: colors.accent }]} />
        </View>
      </Animated.View>

      {/* Transparent Fixed Back Button (before scroll) */}
      <View style={styles.transparentHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.iconBtn, styles.glassIconBg]}
          accessibilityRole="button"
          accessibilityLabel="वापस जाएँ"
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.topBarActions}>
          <TouchableOpacity 
            onPress={toggleBookmark} 
            style={[styles.iconBtn, styles.glassIconBg]}
            accessibilityRole="button"
            accessibilityLabel={bookmarked ? "बुकमार्क हटाएँ" : "बुकमार्क करें"}
            accessibilityState={{ checked: bookmarked }}
          >
            <Feather
              name="bookmark"
              size={22}
              color={bookmarked ? headerColor : '#FFF'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <Animated.View style={[styles.heroContainer, heroAnimatedStyle]}>
          {article.featuredImage ? (
            <MotiView
              from={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'timing', duration: 600 }}
              style={styles.featuredImage}
            >
              <Image
                source={{ uri: article.featuredImage }}
                style={styles.featuredImage}
                contentFit="cover"
              />
            </MotiView>
          ) : (
            <View style={[styles.featuredImage, { backgroundColor: colors.skeleton }]} />
          )}
        </Animated.View>

        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          style={[styles.articleContent, { backgroundColor: colors.background }]}
        >
          {/* Category Tag */}
          <View style={styles.categoryRow}>
            {primaryCategory && (
              <View style={[styles.categoryBadge, { backgroundColor: colors.accent + '20' }]}>
                <Text style={[styles.categoryText, { color: colors.accent }]}>
                  {primaryCategory.name.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={[styles.articleTitle, { color: colors.text }]}>
            {article.title}
          </Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            <View style={styles.authorInfo}>
              <View style={[styles.avatar, { backgroundColor: colors.accent + '20' }]}>
                <Text style={{ color: colors.accent, fontWeight: 'bold' }}>
                  {article.author.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={[styles.metaText, { color: colors.text, fontWeight: '700' }]}>
                  {article.author}
                </Text>
                <Text style={[styles.metaTextSmall, { color: colors.textMuted }]}>
                  {article.dateFormatted} • {article.readTime} min read
                </Text>
              </View>
            </View>
          </View>
          
          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 20 }} />

          {/* Article HTML Content */}
          <View style={styles.htmlWrapper}>
            <RenderHtml
              contentWidth={width - Spacing.xl * 2}
              source={{ html: article.content }}
              tagsStyles={tagsStyles}
              enableExperimentalMarginCollapsing
            />
          </View>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 600 }}
              style={styles.relatedSection}
            >
              <Text style={[styles.relatedTitle, { color: colors.text }]}>
                संबंधित लेख
              </Text>
              {relatedArticles.map((related, index) => (
                <AnimatedCard key={related.id} index={index + 1} onPress={() => navigation.push('Article', { article: related })}>
                  <TrendingCard article={related} onPress={() => navigation.push('Article', { article: related })} />
                </AnimatedCard>
              ))}
            </MotiView>
          )}
        </MotiView>
      </Animated.ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity style={styles.circleBtn} onPress={toggleBookmark}>
          <Feather name="bookmark" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleBtn} onPress={shareArticle}>
          <Feather name="share-2" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerBlurContent: {
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    flex: 1,
    marginHorizontal: Spacing.lg,
    textAlign: 'center',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(150,150,150,0.1)',
    width: '100%',
  },
  progressBarFill: {
    height: 4,
    width: '0%', // Animated
  },
  transparentHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    zIndex: 50,
  },
  glassIconBg: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topBarActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl * 4, // Extra padding for floating button
  },
  heroContainer: {
    width: '100%',
    height: HERO_HEIGHT,
    position: 'relative',
    backgroundColor: '#000',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  articleContent: {
    padding: 24,
    paddingTop: 32,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  articleTitle: {
    fontSize: 28, // Master-level Typography
    fontWeight: '900',
    lineHeight: 38,
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaText: {
    fontSize: 16,
    marginBottom: 2,
  },
  metaTextSmall: {
    fontSize: 13,
    fontWeight: '500',
  },
  htmlWrapper: {
    marginTop: 0,
  },
  relatedSection: {
    marginTop: 48,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150,150,150,0.2)',
  },
  relatedTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  floatingButtons: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    gap: 16,
  },
  circleBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
