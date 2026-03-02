import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getBookmarks, removeBookmark } from '../api/bookmarks';
import NewsCard from '../components/NewsCard';
import { FontSize, Spacing, BorderRadius } from '../theme';
import { lightHaptic, successHaptic } from '../utils/haptics';

export default function BookmarksScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [bookmarks, setBookmarks] = useState([]);
  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [])
  );

  async function loadBookmarks() {
    const data = await getBookmarks();
    setBookmarks(data);
  }

  async function handleRemove(articleId) {
    lightHaptic();
    Alert.alert(
      'बुकमार्क हटाएं',
      'क्या आप इस लेख को बुकमार्क से हटाना चाहते हैं?',
      [
        { text: 'रद्द करें', style: 'cancel' },
        {
          text: 'हटाएं',
          style: 'destructive',
          onPress: async () => {
            await removeBookmark(articleId);
            successHaptic();
            loadBookmarks();
          },
        },
      ]
    );
  }

  function navigateToArticle(article) {
    navigation.navigate('Article', { article });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + Spacing.sm }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>बुकमार्क</Text>
          <View style={[styles.countBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.countText, { color: colors.primary }]}>{bookmarks.length}</Text>
          </View>
        </View>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
          आपके द्वारा सहेजे गए सभी महत्वपूर्ण लेख
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={bookmarks}
        keyExtractor={(item) => item.id.toString()}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={10}
        initialNumToRender={6}
        renderItem={({ item, index }) => (
          <View style={styles.bookmarkItem}>
            <NewsCard article={item} onPress={() => navigateToArticle(item)} index={index} />
            <TouchableOpacity
              style={[
                styles.removeBtn,
                { backgroundColor: isDark ? 'rgba(255,100,100,0.15)' : 'rgba(255,0,0,0.08)' },
              ]}
              onPress={() => handleRemove(item.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 14 }}
            style={styles.emptyContainer}
          >
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.card }]}>
              <Ionicons name="bookmark" size={48} color={colors.primary} style={{ opacity: 0.8 }} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              कोई बुकमार्क नहीं
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              लेख पढ़ते समय बुकमार्क आइकन (रिबन) दबाकर अपने पसंदीदा लेखों को यहाँ के लिए सेव करें।
            </Text>
          </MotiView>
        }
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxl + 4,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  countBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  countText: {
    fontSize: FontSize.sm,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
    fontWeight: '500',
  },
  bookmarkItem: {
    position: 'relative',
  },
  removeBtn: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.xl + 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  listContent: {
    paddingTop: Spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.xxxl * 2,
    paddingHorizontal: Spacing.xxl,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 24,
  },
});
