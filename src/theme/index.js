// Premium color palette for Sonipat News
const CommonColors = {
  primary: '#2563EB',
  primaryLight: '#60A5FA',
  accent: '#2563EB',
  accentLight: '#93C5FD',
  white: '#FFFFFF',
  black: '#000000',
  success: '#10B981',
  error: '#EF4444',
  danger: '#EF4444',
};

export const Colors = {
  light: {
    primary: '#2563EB', // primary mapped to Tailwind 2563EB
    slateCustom: '#0f172a',
    primaryDark: '#000000',
    primaryLight: '#374151',
    accent: '#2563EB', // Blue Accent
    accentLight: '#60A5FA',
    background: '#F8FAFC', // Premium Off-White Card back
    surface: '#FFFFFF',
    card: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.85)',
    glassBorder: 'rgba(255, 255, 255, 0.4)',
    text: '#111827',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E2E8F0',
    divider: '#F1F5F9',
    tabBar: 'rgba(255, 255, 255, 0.95)',
    tabBarActive: '#2563EB',
    tabBarInactive: '#9CA3AF',
    statusBar: 'dark',
    overlay: 'rgba(0,0,0,0.4)',
    searchBg: '#F1F5F9',
    badge: '#2563EB',
    badgeText: '#FFFFFF',
    skeleton: '#E2E8F0',
    skeletonHighlight: '#F8FAFC',
    danger: '#EF4444',
    error: '#EF4444',
    heroGradient: ['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)'],
    cardShadow: '#000000',
  },
  dark: {
    ...CommonColors,
    background: '#161121', // background-dark
    card: '#221b33', // Slightly lighter than background-dark
    text: '#f1f5f9', // text-slate-100
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    border: '#334155',
    searchBg: '#1e293b',
    badgeText: '#FFFFFF',
    skeleton: '#332a4a',
    skeletonHighlight: '#403859',
    heroGradient: ['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,1)'],
    cardShadow: '#000000',
  },
};

// Category-specific colors for left borders
export const CategoryColors = {
  sonipat: '#C62828',
  india: '#E65100',
  world: '#1565C0',
  politics: '#6A1B9A',
  entertainment: '#AD1457',
  lifestyle: '#00838F',
  technology: '#1B5E20',
  business: '#E65100',
  religion: '#FF8F00',
  default: '#C62828',
};

export const Spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  xxxxl: 64,
};

export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 20,
  xl: 28,
  full: 999,
};

export const Typography = {
  titleXL: {
    fontSize: 28,
    fontWeight: '700', // font-bold
    fontFamily: 'Newsreader_700Bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  body: {
    fontSize: 17,
    lineHeight: 28,
    fontFamily: 'Inter_400Regular',
  },
  caption: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  hero: 28,
  display: 34,
};

export const FontFamily = {
  display: 'Newsreader_700Bold',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardDark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  hero: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  tab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  float: {
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};
