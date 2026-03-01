import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../theme';
import AnimatedCard from './AnimatedCard';
import GlassCard from './GlassCard';
import CategoryBadge from './CategoryBadge';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function NewsCard({ article, onPress, index = 0, highlightQuery = '' }) {
  const { colors } = useTheme();

  const category = article.categories?.[0];

  const renderHighlightedTitle = () => {
    if (!highlightQuery || !highlightQuery.trim()) {
      return (
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={3}>
          {article.title}
        </Text>
      );
    }
    
    const parts = article.title.split(new RegExp(`(${highlightQuery})`, 'gi'));
    return (
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={3}>
        {parts.map((part, i) =>
          part.toLowerCase() === highlightQuery.toLowerCase() ? (
            <Text key={i} style={{ color: colors.primary, fontWeight: '900', backgroundColor: colors.primary + '20' }}>
              {part}
            </Text>
          ) : (
            <Text key={i}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <AnimatedCard
      onPress={onPress}
      index={index}
      style={{ marginHorizontal: Spacing.lg, marginBottom: Spacing.md }}
      accessibilityRole="button"
      accessibilityLabel={`लेख पढ़ें: ${article.title}`}
      accessibilityHint="इस लेख के विवरण देखने के लिए दो बार टैप करें"
    >
      <GlassCard categorySlug={category?.slug}>
        <View style={styles.cardInner}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={article.featuredImageMedium || article.featuredImage}
              placeholder={blurhash}
              contentFit="cover"
              transition={200}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={styles.imageGradient}
            >
              <Text style={styles.imageReadTime}>{article.readTime} min</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.content}>
            {category && (
              <Text
                style={[
                  styles.categoryText,
                  { color: colors.primary },
                ]}
              >
                {category.name.toUpperCase()}
              </Text>
            )}
            
            {renderHighlightedTitle()}
            
            <View style={styles.metaRow}>
              <Text style={[styles.metaText, { color: colors.textMuted }]} numberOfLines={1}>
                {article.author}
              </Text>
              <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
              <Text style={[styles.metaText, { color: colors.textMuted }]}>
                {article.dateFormatted}
              </Text>
            </View>
          </View>
        </View>
      </GlassCard>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  cardInner: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: 110,
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    justifyContent: 'flex-end',
    padding: Spacing.xs,
  },
  imageReadTime: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '700',
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  metaText: {
    fontSize: FontSize.xs,
    flexShrink: 1,
  },
  dot: {
    fontSize: FontSize.xs,
    marginHorizontal: Spacing.xs,
  },
});
