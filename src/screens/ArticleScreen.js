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
import { MotiView } from 'moti';
import { Image } from 'expo-image';
import RenderHtml from 'react-native-render-html';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { isBookmarked, addBookmark, removeBookmark } from '../api/bookmarks';
import { fetchPostsByCategory } from '../api/wordpress';
import CategoryBadge from '../components/CategoryBadge';
import NewsCard from '../components/NewsCard';
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
      backgroundColor: headerColor,
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
      borderLeftColor: headerColor,
      paddingLeft: Spacing.xl,
      marginVertical: Spacing.xl,
      fontStyle: 'italic',
      color: colors.text,
      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      padding: Spacing.md,
      borderRadius: BorderRadius.sm,
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Floating Header */}
      <Animated.View style={[styles.floatingHeader, { paddingTop: Math.max(insets.top, 20) + Spacing.sm }, headerAnimatedStyle]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="वापस जाएँ"
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {article.title}
          </Text>
          <View style={styles.topBarActions}>
            <TouchableOpacity 
              onPress={toggleBookmark} 
              style={styles.iconBtn}
              accessibilityRole="button"
              accessibilityLabel={bookmarked ? "बुकमार्क हटाएँ" : "बुकमार्क करें"}
              accessibilityState={{ checked: bookmarked }}
            >
              <Ionicons
                name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color="#FFF"
              />
            </TouchableOpacity>
          </View>
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
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
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
          <View style={styles.heroGradient} />
        </Animated.View>

        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          style={[styles.articleContent, { backgroundColor: colors.background }]}
        >
          {/* Category */}
          <View style={styles.categoryRow}>
            {primaryCategory && article.categories.map((cat) => (
              <CategoryBadge key={cat.id} name={cat.name} slug={cat.slug} />
            ))}
            {article.readTime && (
              <View style={[styles.readTime, { backgroundColor: headerColor + '15' }]}>
                <Ionicons name="time-outline" size={14} color={headerColor} />
                <Text style={[styles.readTimeText, { color: headerColor }]}>
                  {article.readTime} min read
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            {article.title}
          </Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            <View style={styles.authorInfo}>
              <View style={[styles.avatar, { backgroundColor: headerColor + '30' }]}>
                <Text style={{ color: headerColor, fontWeight: 'bold' }}>
                  {article.author.charAt(0)}
                </Text>
              </View>
              <Text style={[styles.metaText, { color: colors.text, fontWeight: '600' }]}>
                {article.author}
              </Text>
            </View>
            <View style={styles.metaRight}>
              <Text style={[styles.metaTextSmall, { color: colors.textMuted }]}>
                {article.dateFormatted}
              </Text>
              <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
              <Text style={[styles.metaTextSmall, { color: colors.textMuted }]}>
                {article.readTime} min read
              </Text>
            </View>
          </View>

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
                  <NewsCard article={related} onPress={() => navigation.push('Article', { article: related })} />
                </AnimatedCard>
              ))}
            </MotiView>
          )}
        </MotiView>
      </Animated.ScrollView>

      {/* Floating Share Button */}
      <FloatingButton icon="share-social" onPress={shareArticle} />
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
    paddingTop: Spacing.xl + 35,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: FontSize.lg,
    fontWeight: '700',
    flex: 1,
    marginHorizontal: Spacing.lg,
    textAlign: 'center',
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
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)', // subtle blending into bg
  },
  articleContent: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxl,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  readTimeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  title: {
    fontSize: FontSize.hero + 4,
    fontWeight: '900',
    lineHeight: 42,
    marginBottom: Spacing.lg,
    letterSpacing: -0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150,150,150,0.2)',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: FontSize.md,
  },
  metaTextSmall: {
    fontSize: FontSize.xs + 1,
    fontWeight: '500',
  },
  dot: {
    marginHorizontal: Spacing.xs,
    fontSize: FontSize.xs,
  },
  htmlWrapper: {
    marginTop: Spacing.sm,
  },
  relatedSection: {
    marginTop: Spacing.xxxxl,
    paddingTop: Spacing.xl,
    borderTopWidth: 4,
    borderTopColor: 'rgba(150,150,150,0.1)',
  },
  relatedTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    marginBottom: Spacing.xl,
    letterSpacing: -0.5,
  },
});
