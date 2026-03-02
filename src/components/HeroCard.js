import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, Typography, Spacing } from '../theme';
import AnimatedPressable from './AnimatedPressable';
import CategoryBadge from './CategoryBadge';
import PulsingDot from './PulsingDot';

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const HERO_HEIGHT = 400;

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function HeroCard({ article, onPress, index = 0 }) {
  const { colors } = useTheme();

  if (!article) return null;

  const isToday = new Date(article.date).toDateString() === new Date().toDateString();

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.container,
        {
          shadowColor: colors.cardShadow,
          backgroundColor: colors.card,
        },
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image
          style={styles.image}
          source={article.featuredImage || article.featuredImageMedium}
          placeholder={blurhash}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        />
        
        <View style={styles.contentContainer}>
          <View style={styles.topRow}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>FEATURED</Text>
            </View>
            <Text style={styles.readTimeText}>{article.readTime} min read</Text>
          </View>

          <Text style={styles.title} numberOfLines={3}>
            {article.title}
          </Text>
          
          {/* Add a short description since Stitch uses it */}
          {article.excerpt && (
            <Text style={styles.description} numberOfLines={2}>
              {article.excerpt.replace(/<[^>]*>?/gm, '')}
            </Text>
          )}

          <View style={styles.metaRow}>
            <View style={styles.authorSection}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarInitials}>{article.author.charAt(0)}</Text>
              </View>
              <Text style={styles.metaAuthorText}>{article.author}</Text>
            </View>
            
            <BlurView intensity={30} tint="light" style={styles.actionBtn}>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </BlurView>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.xl, // robust squircle corners
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  imageWrapper: {
    width: '100%',
    height: HERO_HEIGHT,
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: Spacing.lg, // 24px
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  featuredBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featuredText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  readTimeText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  title: {
    fontFamily: Typography.titleXL.fontFamily,
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    marginTop: 4,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarInitials: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  metaAuthorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
