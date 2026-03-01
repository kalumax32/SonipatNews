// Premium color palette for Sonipat News
export const Colors = {
  light: {
    primary: '#C62828',
    primaryDark: '#8E0000',
    primaryLight: '#FF5F52',
    accent: '#FFB300',
    accentLight: '#FFE54C',
    background: '#F8F5F0',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.75)',
    glassBorder: 'rgba(255, 255, 255, 0.3)',
    text: '#1A1A1A',
    textSecondary: '#5C5C5C',
    textMuted: '#9E9E9E',
    border: '#E8E4DF',
    divider: '#F0ECE7',
    tabBar: '#FFFFFF',
    tabBarActive: '#C62828',
    tabBarInactive: '#9E9E9E',
    statusBar: 'dark',
    overlay: 'rgba(0,0,0,0.55)',
    searchBg: '#F0ECE7',
    badge: '#C62828',
    badgeText: '#FFFFFF',
    skeleton: '#E8E4DF',
    skeletonHighlight: '#F0ECE7',
    error: '#D32F2F',
    success: '#2E7D32',
    heroGradient: ['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)'],
    cardShadow: '#000',
  },
  dark: {
    primary: '#EF5350',
    primaryDark: '#C62828',
    primaryLight: '#FF867C',
    accent: '#FFB300',
    accentLight: '#FFE54C',
    background: '#0D0D0D',
    surface: '#1A1A2E',
    card: '#1E1E32',
    glass: 'rgba(26, 26, 46, 0.65)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    text: '#F5F5F5',
    textSecondary: '#B0B0B0',
    textMuted: '#717171',
    border: '#2D2D44',
    divider: '#1E1E32',
    tabBar: 'rgba(13, 13, 13, 0.85)',
    tabBarActive: '#EF5350',
    tabBarInactive: '#717171',
    statusBar: 'light',
    overlay: 'rgba(0,0,0,0.8)',
    searchBg: '#1E1E32',
    badge: '#EF5350',
    badgeText: '#FFFFFF',
    skeleton: '#2D2D44',
    skeletonHighlight: '#3D3D54',
    error: '#EF5350',
    success: '#66BB6A',
    heroGradient: ['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)'],
    cardShadow: '#000',
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
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  hero: 28,
  display: 32,
};

export const FontFamily = {
  heading: undefined, // Will use system serif
  body: undefined,    // Will use system default
};

export const Shadows = {
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
