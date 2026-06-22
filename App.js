import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from './src/theme/ThemeContext';
import { registerBackgroundTask } from './src/background/backgroundTask';
import * as Notifications from 'expo-notifications';
import { registerNotification } from './src/services/notificationService';
import { mergeServerAndLocal } from './src/services/apiService';
import { NetworkProvider } from './src/context/NetworkContext';

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
  useEffect(() => {
    const initApp = async () => {
      try {
        const pushRegistration = await registerNotification();
        console.log('[Notifications] Registration status:', pushRegistration);
        await registerBackgroundTask();
        console.log('[App Open] Starting Auto Sync...');
        await mergeServerAndLocal();
        console.log('[App Open] Auto Sync completed successfully');
      } catch (error) {
        console.error('[App Open] Initialization/Sync failed:', error);
      }
    };
    initApp();

    const receivedSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('[Notifications] Received:', notification.request.content);
      });
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          '[Notifications] Opened:',
          response.notification.request.content.data
        );
      });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NetworkProvider>
          <ThemeProvider>
            <ThemedNavigation />
          </ThemeProvider>
        </NetworkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
