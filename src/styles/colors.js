// src/styles/colors.js
// Ivory Academic Color System

export const colors = {
  // Surface Colors
  surface: '#f9f9ff',
  surfaceDim: '#d8d9e2',
  surfaceBright: '#f9f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f2f3fc',
  surfaceContainer: '#ecedf6',
  surfaceContainerHigh: '#e6e8f1',
  surfaceContainerHighest: '#e1e2eb',

  // Text Colors
  onSurface: '#191c22',
  onSurfaceVariant: '#414753',
  inverseSurface: '#2e3037',
  inverseOnSurface: '#eff0f9',

  // Primary Colors
  primary: '#004e9f',
  primaryDark: '#003d7a',
  onPrimary: '#ffffff',
  primaryContainer: '#0066cc',
  onPrimaryContainer: '#dfe8ff',
  inversePrimary: '#aac7ff',

  // Secondary Colors
  secondary: '#5e5e63',
  onSecondary: '#ffffff',
  secondaryContainer: '#e0dfe4',
  onSecondaryContainer: '#626267',

  // Tertiary Colors
  tertiary: '#883700',
  onTertiary: '#ffffff',
  tertiaryContainer: '#af4900',
  onTertiaryContainer: '#ffe3d6',

  // Error Colors
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // Outline & Dividers
  outline: '#727784',
  outlineVariant: '#c1c6d5',

  // Background
  background: '#f9f9ff',
  onBackground: '#191c22',
  surfaceVariant: '#e1e2eb',

  // Status Colors
  success: '#2e7d32',
  warning: '#f57c00',
  info: '#0066cc',

  // Transparent
  transparent: 'transparent',
  black: '#000000',
  white: '#ffffff',

  // Additional
  disabledText: 'rgba(25, 28, 34, 0.38)',
};

// Preset combinations for different states
export const colorPresets = {
  // Button states
  primaryButton: {
    background: colors.primary,
    text: colors.onPrimary,
    pressed: colors.primaryDark,
  },
  secondaryButton: {
    background: colors.secondaryContainer,
    text: colors.onSecondaryContainer,
    border: colors.outline,
  },
  tertiaryButton: {
    background: colors.tertiaryContainer,
    text: colors.onTertiary,
  },

  // Card states
  card: {
    background: colors.surfaceContainerLowest,
    border: colors.outlineVariant,
    shadow: colors.onSurface,
  },

  // Text hierarchy
  text: {
    primary: colors.onSurface,
    secondary: colors.onSurfaceVariant,
    tertiary: colors.secondary,
    disabled: colors.disabledText,
  },
};