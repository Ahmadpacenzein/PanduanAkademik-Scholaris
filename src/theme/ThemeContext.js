import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { applyThemeColors, colors } from '../styles/colors';
import storageManager from '../utils/storageManager';

const ThemeContext = createContext({
  colors,
  darkMode: false,
  setDarkMode: async () => {},
});

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkModeState] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const settings = await storageManager.getSettings();
      applyThemeColors(settings.darkMode);
      setDarkModeState(settings.darkMode);
    };

    loadTheme();
  }, []);

  const setDarkMode = async (value) => {
    applyThemeColors(value);
    setDarkModeState(value);
    await storageManager.saveSettings({ darkMode: value });
  };

  const value = useMemo(
    () => ({
      colors,
      darkMode,
      setDarkMode,
    }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
