import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme';

const THEME_KEY = '@sn_theme_mode';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      const mode = await AsyncStorage.getItem(THEME_KEY);
      if (mode === 'dark') setIsDark(true);
    } catch {}
  }

  async function toggleTheme() {
    const newMode = !isDark;
    setIsDark(newMode);
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode ? 'dark' : 'light');
    } catch {}
  }

  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
