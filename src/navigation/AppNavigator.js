import React from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, Spacing } from '../theme';
import { lightHaptic } from '../utils/haptics';

import HomeScreen from '../screens/HomeScreen';
import ArticleScreen from '../screens/ArticleScreen';
import CategoryScreen from '../screens/CategoryScreen';
import SearchScreen from '../screens/SearchScreen';
import BookmarksScreen from '../screens/BookmarksScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  animation: 'none', // Disable default to use custom Reanimated transition
  customAnimationOnGesture: true,
  contentStyle: { backgroundColor: 'transparent' },
  animationTypeForReplace: 'push',
  presentation: 'transparentModal',
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        opacity: current.progress,
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0], // Slide up by 20px
            }),
          },
        ],
      },
    };
  },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Article" component={ArticleScreen} options={{ tabBarStyle: { display: 'none' } }} />
    </Stack.Navigator>
  );
}

function CategoryStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="CategoryMain" component={CategoryScreen} />
      <Stack.Screen name="Article" component={ArticleScreen} options={{ tabBarStyle: { display: 'none' } }} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="Article" component={ArticleScreen} options={{ tabBarStyle: { display: 'none' } }} />
    </Stack.Navigator>
  );
}

function BookmarksStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="BookmarksMain" component={BookmarksScreen} />
      <Stack.Screen name="Article" component={ArticleScreen} options={{ tabBarStyle: { display: 'none' } }} />
    </Stack.Navigator>
  );
}

// Custom animated tab button
function TabBarButton(props) {
  const { children, onPress, accessibilityState, ...rest } = props;
  const focused = accessibilityState?.selected;
  
  return (
    <Pressable
      {...rest}
      onPress={(e) => {
        lightHaptic();
        if (onPress) onPress(e);
      }}
      style={[styles.tabButton, rest.style]}
    >
      <MotiView
        animate={{
          scale: focused ? 1.2 : 1,
          translateY: focused ? -4 : 0,
        }}
        transition={{
          type: 'spring',
          damping: 12,
          stiffness: 250,
          mass: 0.8,
        }}
        style={styles.iconContainer}
      >
        {children}
      </MotiView>
    </Pressable>
  );
}

export default function AppNavigator() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Categories') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Bookmarks') {
              iconName = focused ? 'bookmark' : 'bookmark-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: isDark ? '#94a3b8' : '#94a3b8',
          tabBarShowLabel: true,
          tabBarStyle: {
            position: 'absolute',
            bottom: Spacing.md,
            left: Spacing.md,
            right: Spacing.md,
            maxWidth: 430,
            alignSelf: 'center',
            marginHorizontal: 'auto',
            elevation: 8,
            backgroundColor: isDark ? 'rgba(22, 17, 33, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderRadius: BorderRadius.full,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            borderTopWidth: 1,
            borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            height: 64,
            paddingBottom: 0,
            paddingTop: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
          },
          tabBarBackground: () => (
            <BlurView
              tint={isDark ? 'dark' : 'light'}
              intensity={90}
              style={StyleSheet.absoluteFill}
            />
          ),
          tabBarButton: (props) => <TabBarButton {...props} />,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            marginTop: 4,
            fontFamily: 'Inter_700Bold',
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
        <Tab.Screen name="Categories" component={CategoryStack} options={{ tabBarLabel: 'Explore' }} />
        <Tab.Screen name="Search" component={SearchStack} options={{ tabBarLabel: 'Search' }} />
        <Tab.Screen name="Bookmarks" component={BookmarksStack} options={{ tabBarLabel: 'Saved' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent', // color is set via tabBarActiveTintColor passthrough, use primary
    marginTop: 2,
  },
});
