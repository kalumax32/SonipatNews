const BASE_URL = 'https://sonipatnews.in/wp-json/wp/v2';

/**
 * Fetch with a timeout to prevent infinite loading
 */
async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('सर्वर से कनेक्ट नहीं हो पाया। कृपया इंटरनेट कनेक्शन जांचें।');
    }
    throw err;
  }
}

// Category ID mapping from the live WordPress API
export const CATEGORIES = [
  { id: 19, name: 'सोनीपत', slug: 'sonipat' },
  { id: 39, name: 'भारत', slug: 'india' },
  { id: 25, name: 'दुनिया', slug: 'world' },
  { id: 20, name: 'राजनीति', slug: 'politics' },
  { id: 21, name: 'मनोरंजन', slug: 'entertainment' },
  { id: 8, name: 'लाइफस्टाइल', slug: 'lifestyle' },
  { id: 23, name: 'तकनीकी', slug: 'technology' },
  { id: 22, name: 'बिजनेस', slug: 'business' },
  { id: 24, name: 'धर्म', slug: 'religion' },
];

/**
 * Transform a raw WordPress post (with _embed) into our app's article format
 */
export function transformPost(post) {
  const author = post._embedded?.author?.[0];
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const terms = post._embedded?.['wp:term']?.[0] || [];

  // Estimate reading time (Hindi text: ~200 words/min)
  const wordCount = post.content?.rendered
    ? post.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length
    : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    id: post.id,
    title: decodeHTMLEntities(post.title?.rendered || ''),
    excerpt: decodeHTMLEntities(
      (post.excerpt?.rendered || '').replace(/<[^>]*>/g, '').trim()
    ),
    content: post.content?.rendered || '',
    date: post.date,
    dateFormatted: formatDate(post.date),
    author: author?.name || 'Sonipat News',
    authorAvatar: author?.avatar_urls?.['96'] || null,
    featuredImage: featuredMedia?.source_url || null,
    featuredImageMedium:
      featuredMedia?.media_details?.sizes?.medium?.source_url ||
      featuredMedia?.source_url ||
      null,
    categories: terms.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
    })),
    categoryIds: post.categories || [],
    slug: post.slug,
    link: post.link,
    readTime,
  };
}

function decodeHTMLEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(num))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Fetch paginated posts
 */
export async function fetchPosts(page = 1, perPage = 10) {
  const url = `${BASE_URL}/posts?_embed&per_page=${perPage}&page=${page}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
  const data = await res.json();
  return {
    posts: data.map(transformPost),
    totalPages,
    currentPage: page,
  };
}

/**
 * Fetch posts filtered by category
 */
export async function fetchPostsByCategory(categoryId, page = 1, perPage = 10) {
  const url = `${BASE_URL}/posts?_embed&categories=${categoryId}&per_page=${perPage}&page=${page}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Failed to fetch category posts: ${res.status}`);
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
  const data = await res.json();
  return {
    posts: data.map(transformPost),
    totalPages,
    currentPage: page,
  };
}

/**
 * Search posts
 */
export async function searchPosts(query, page = 1, perPage = 10) {
  const url = `${BASE_URL}/posts?_embed&search=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  const data = await res.json();
  return data.map(transformPost);
}

/**
 * Fetch a single post by ID
 */
export async function fetchPost(postId) {
  const url = `${BASE_URL}/posts/${postId}?_embed`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
  const data = await res.json();
  return transformPost(data);
}
