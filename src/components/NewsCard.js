import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, Typography, Spacing, FontSize } from '../theme';
import AnimatedPressable from './AnimatedPressable';
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
        {(parts || []).map((part, i) =>
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
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          shadowColor: colors.cardShadow,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`लेख पढ़ें: ${article.title}`}
      accessibilityHint="इस लेख के विवरण देखने के लिए दो बार टैप करें"
    >
      <View style={[styles.cardInner, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <View style={styles.content}>
          {category && (
            <View style={styles.categoryBadgeWrapper}>
              <Text style={[styles.categoryText, { color: colors.primary }]}>
                {category.name.toUpperCase()}
              </Text>
            </View>
          )}
          
          {renderHighlightedTitle()}
          
          <View style={styles.metaRow}>
            <Text style={[styles.metaAuthor, { color: colors.textPrimary }]} numberOfLines={1}>
              {article.author}
            </Text>
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <Text style={[styles.metaDate, { color: colors.textSecondary }]}>
              {article.dateFormatted}
            </Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={article.featuredImageMedium || article.featuredImage}
            placeholder={blurhash}
            contentFit="cover"
            transition={200}
          />
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg, // 20px
    // Utilizing Shadows config if available, otherwise manual
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  cardInner: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    paddingRight: Spacing.xs,
  },
  imageContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.md, // 16px
    overflow: 'hidden',
    backgroundColor: '#F1F5F9', // light gray fallback
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800', // tracking-widest
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 17,
    fontFamily: Typography.titleXL.fontFamily, // 'Newsreader_700Bold'
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaAuthor: {
    fontSize: 11,
    flexShrink: 1,
    fontWeight: '500',
  },
  metaDate: {
    fontSize: 11,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
});
