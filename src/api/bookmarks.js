import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARKS_KEY = '@sn_bookmarks';

export async function getBookmarks() {
  try {
    const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addBookmark(article) {
  try {
    const bookmarks = await getBookmarks();
    // Don't add duplicates
    if (bookmarks.some((b) => b.id === article.id)) return bookmarks;
    const updated = [article, ...bookmarks];
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export async function removeBookmark(articleId) {
  try {
    const bookmarks = await getBookmarks();
    const updated = bookmarks.filter((b) => b.id !== articleId);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export async function isBookmarked(articleId) {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.some((b) => b.id === articleId);
  } catch {
    return false;
  }
}
