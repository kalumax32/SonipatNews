import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../theme';
import AnimatedCard from './AnimatedCard';
import CategoryBadge from './CategoryBadge';
import PulsingDot from './PulsingDot';

const { height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.55; // 55% of screen height

// Simple blurhash for placeholder while image loads
const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function HeroCard({ article, onPress, index = 0 }) {
  const { colors } = useTheme();

  if (!article) return null;

  const isToday = new Date(article.date).toDateString() === new Date().toDateString();

  return (
    <AnimatedCard
      onPress={onPress}
      index={index}
      style={[styles.container, { shadowColor: colors.cardShadow }]}
    >
      <Image
        style={styles.image}
        source={article.featuredImage || article.featuredImageMedium}
        placeholder={blurhash}
        contentFit="cover"
        transition={300}
      />
      
      <LinearGradient
        colors={colors.heroGradient}
        style={styles.gradient}
        locations={[0, 0.6, 1]}
      >
        <View style={styles.topRow}>
          {article.categories?.length > 0 && (
            <CategoryBadge
              name={article.categories[0].name}
              slug={article.categories[0].slug}
            />
          )}
          <View style={[styles.readTime, { backgroundColor: colors.glass }]}>
            <Text style={[styles.readTimeText, { color: colors.text }]}>
              {article.readTime} min read
            </Text>
          </View>
        </View>

        <View style={styles.bottomContent}>
          <Text style={styles.title} numberOfLines={3}>
            {article.title}
          </Text>
          
          <View style={styles.metaRow}>
            {isToday && (
              <View style={styles.newRow}>
                <PulsingDot color={colors.primary} size={6} glowSize={16} />
                <Text style={styles.newText}>NEW</Text>
                <Text style={styles.dot}>•</Text>
              </View>
            )}
            <Text style={styles.metaText}>{article.author}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaText}>{article.dateFormatted}</Text>
          </View>
        </View>
      </LinearGradient>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    height: HERO_HEIGHT,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: Spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  readTime: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  readTimeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  bottomContent: {
    marginTop: 'auto',
  },
  title: {
    color: '#FFFFFF',
    fontSize: FontSize.hero,
    fontWeight: '800',
    lineHeight: 34,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  newRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newText: {
    color: '#FFFFFF',
    fontSize: FontSize.xs,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  metaText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  dot: {
    color: 'rgba(255,255,255,0.5)',
    marginHorizontal: Spacing.sm,
    fontSize: FontSize.sm,
  },
});
