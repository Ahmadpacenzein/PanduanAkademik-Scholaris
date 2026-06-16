import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from './src/theme/ThemeContext';

const ThemedNavigation = () => {
  const { colors, darkMode } = useAppTheme();
  const baseTheme = darkMode ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      theme={{
        ...baseTheme,
        colors: {
          ...baseTheme.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.surfaceContainerLowest,
          text: colors.onSurface,
          border: colors.outlineVariant,
          notification: colors.error,
        },
      }}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedNavigation />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
