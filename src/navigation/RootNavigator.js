// src/navigation/RootNavigator.js
// Navigation structure utama dengan SplashScreen

import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import CourseListScreen from '../screens/CourseListScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { colors } from '../styles/colors';
import { ROUTES } from '../constants/routes';
import storageManager from '../utils/storageManager';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          paddingBottom: 12,
          paddingTop: 8,
          height: 95,
          borderTopColor: colors.outlineVariant,
          borderTopWidth: 1,
          backgroundColor: colors.surfaceContainerLowest,
        },
      }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Courses Tab */}
      <Tab.Screen
        name={ROUTES.COURSES}
        component={CourseListScreen}
        options={{
          title: 'Mata Kuliah',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-page-variant" size={size} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator dengan Splash
const RootNavigator = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      await storageManager.initializeStorage();
      const splashTimer = setTimeout(() => {
        setIsSplashVisible(false);
      }, 2000);

      return () => clearTimeout(splashTimer);
    };

    initApp();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      {isSplashVisible ? (
        // Splash Stack (akan otomatis diganti setelah 2 detik)
        <Stack.Screen
          name={ROUTES.SPLASH}
          component={SplashScreen}
          options={{
            animationEnabled: false,
          }}
        />
      ) : (
        // Main App Stack (setelah splash selesai)
        <>
          <Stack.Screen
            name={ROUTES.MAIN_TABS}
            component={BottomTabNavigator}
            options={{
              animationEnabled: false,
            }}
          />

          {/* Course Detail Screen (nested stack di atas tabs) */}
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen
              name={ROUTES.COURSE_DETAIL}
              component={CourseDetailScreen}
              options={{
                headerShown: true,
                headerTitle: 'Detail Mata Kuliah',
                headerStyle: {
                  backgroundColor: colors.surfaceContainerLowest,
                  borderBottomColor: colors.outlineVariant,
                  borderBottomWidth: 1,
                },
                headerTitleStyle: {
                  color: colors.onSurface,
                  fontSize: 18,
                  fontWeight: '600',
                },
                headerTintColor: colors.primary,
              }}
            />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;