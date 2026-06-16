// src/screens/SplashScreen.js
// Splash screen dengan durasi 2 detik

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import { useAppTheme } from '../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  useAppTheme();
  const styles = createStyles();
  const scaleAnim = new Animated.Value(0.8);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    // Animate on mount
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo and Branding */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* School Icon */}
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons
              name="school"
              size={72}
              color={colors.primary}
            />
          </View>

          {/* App Name */}
          <Text style={[styles.appName, typography.displayLarge]}>
            Scholaris
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, typography.titleLarge]}>
            Panduan Akademik Mahasiswa
          </Text>

          {/* Loading Bar */}
          <View style={styles.loadingBarContainer}>
            <Animated.View
              style={[
                styles.loadingBar,
                {
                  width: opacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </Animated.View>

        {/* Footer Info */}
        <Animated.View
          style={[
            styles.footer,
            {
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.divider} />
          <Text style={[styles.version, typography.caption]}>
            Versi 2.0.4 — Lingkungan Terpadu
          </Text>
        </Animated.View>
      </View>

      {/* Background Decoration */}
      <View style={styles.decoration}>
        <View style={styles.blurCircle} />
      </View>
    </SafeAreaView>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    opacity: 0.15,
  },
  appName: {
    color: colors.onSurface,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    marginBottom: 48,
    textAlign: 'center',
    opacity: 0.7,
  },
  loadingBarContainer: {
    width: 120,
    height: 3,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  decoration: {
    position: 'absolute',
    width: width,
    height: height,
    zIndex: -1,
  },
  blurCircle: {
    position: 'absolute',
    top: height / 2 - 150,
    left: width / 2 - 150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primary,
    opacity: 0.05,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: colors.outlineVariant,
    opacity: 0.5,
    marginBottom: 12,
  },
  version: {
    color: colors.onSurfaceVariant,
    opacity: 0.4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default SplashScreen;
