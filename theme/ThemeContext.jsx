import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { colors, spacing, radius, typography } from './tokens';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';

export const ThemeContext = createContext({
  themeMode: 'system',
  isDark: false,
  colors: colors.light,
  spacing,
  radius,
  typography,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState('system');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      const saved = await getStorageItem(STORAGE_KEYS.THEME, 'system');
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
        setThemeModeState(saved);
      }
      setInitialized(true);
    }
    loadTheme();
  }, []);

  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  const currentColors = isDark ? colors.dark : colors.light;

  const setThemeMode = async (mode) => {
    setThemeModeState(mode);
    await setStorageItem(STORAGE_KEYS.THEME, mode);
  };

  const toggleTheme = async () => {
    const nextMode = isDark ? 'light' : 'dark';
    await setThemeMode(nextMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark,
        colors: currentColors,
        spacing,
        radius,
        typography,
        toggleTheme,
        setThemeMode,
        initialized,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

