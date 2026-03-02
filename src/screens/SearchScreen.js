import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useScrollToTop } from '@react-navigation/native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { searchPosts } from '../api/wordpress';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { BorderRadius, FontSize, Spacing } from '../theme';

let searchTimeout = null;

export default function SearchScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const stored = await AsyncStorage.getItem('@recent_searches');
        if (stored) setRecentSearches(JSON.parse(stored));
      } catch {}
    };
    loadRecentSearches();
  }, []);

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const updated = [term.trim(), ...prev.filter((s) => s !== term.trim())].slice(0, 5);
      AsyncStorage.setItem('@recent_searches', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  };

  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem('@recent_searches');
    } catch {}
  };

  const handleSearch = useCallback((text) => {
    setQuery(text);
    if (searchTimeout) clearTimeout(searchTimeout);

    if (text.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    searchTimeout = setTimeout(async () => {
      try {
        setLoading(true);
        setSearched(true);
        saveRecentSearch(text);
        const data = await searchPosts(text.trim());
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  function navigateToArticle(article) {
    navigation.navigate('Article', { article });
  }

  function clearSearch() {
    setQuery('');
    setResults([]);
    setSearched(false);
    inputRef.current?.focus();
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + Spacing.sm }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>खोजें</Text>
      </View>

      <MotiView
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ type: 'spring', damping: 15 }}
        style={styles.searchContainer}
      >
        <View
          style={[
            styles.searchBar,
            { 
              backgroundColor: isFocused ? colors.card : colors.searchBg,
              borderColor: isFocused ? colors.primary : colors.border,
              shadowColor: colors.primary,
              shadowOpacity: isFocused ? 0.1 : 0,
              elevation: isFocused ? 4 : 0,
            }
          ]}
        >
          <Ionicons name="search" size={20} color={isFocused ? colors.primary : colors.textMuted} />
          <TextInput
            ref={inputRef}
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="समाचार खोजें..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityRole="search"
            accessibilityLabel="समाचार खोजें"
            accessibilityHint="खोजने के लिए शब्द टाइप करें"
          />
          {query.length > 0 && (
            <TouchableOpacity 
              onPress={clearSearch} 
              style={styles.clearBtn}
              accessibilityRole="button"
              accessibilityLabel="खोज साफ करें"
            >
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </MotiView>

      {loading ? (
        <View style={styles.centerContainer}>
          <LoadingSpinner message="खोज रहा है..." fullScreen={false} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          key={isTablet ? 'tablet-2' : 'phone-1'}
          numColumns={isTablet ? 2 : 1}
          data={results}
          keyExtractor={(item) => item.id.toString()}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          windowSize={10}
          initialNumToRender={6}
          renderItem={({ item, index }) => (
            <View style={isTablet ? { flex: 1, maxWidth: '50%' } : null}>
              <NewsCard article={item} onPress={() => navigateToArticle(item)} index={index} highlightQuery={query} />
            </View>
          )}
          ListEmptyComponent={
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 400 }}
              style={styles.emptyContainer}
            >
              {searched ? (
                <>
                  <Ionicons name="search-outline" size={80} color={colors.border} style={{ marginBottom: Spacing.md }} />
                  <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
                    कोई परिणाम नहीं मिला
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                    कृपया अलग शब्दों से खोजें
                  </Text>
                </>
              ) : recentSearches.length > 0 ? (
                <View style={{ width: '100%', paddingHorizontal: Spacing.lg, marginTop: Spacing.xl }}>
                  <Text style={{ fontSize: FontSize.md, fontWeight: 'bold', color: colors.textSecondary, marginBottom: Spacing.md }}>
                    हाल की खोजें (Recent Searches)
                  </Text>
                  {recentSearches.map((term, idx) => (
                    <TouchableOpacity key={idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm }} onPress={() => handleSearch(term)}>
                      <Ionicons name="time-outline" size={20} color={colors.textMuted} style={{ marginRight: Spacing.md }} />
                      <Text style={{ fontSize: FontSize.md, color: colors.text }}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={clearRecentSearches} style={{ marginTop: Spacing.lg, alignSelf: 'flex-start' }}>
                    <Text style={{ color: colors.primary, fontSize: FontSize.sm, fontWeight: '700' }}>सभी साफ करें</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Ionicons name="newspaper-outline" size={80} color={colors.border} style={{ marginBottom: Spacing.md }} />
                  <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
                    ताज़ा खबरें खोजें
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                    हिंदी या अंग्रेज़ी में टाइप करें
                  </Text>
                </>
              )}
            </MotiView>
          }
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
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
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxl + 4,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    height: 52,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '500',
    height: '100%',
  },
  clearBtn: {
    padding: Spacing.xs,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    fontWeight: '500',
  },
});
