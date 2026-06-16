// src/styles/colors.js
// Ivory Academic Color System

export const lightColors = {
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
  primaryFixed: '#d8e2ff',
  onPrimaryFixed: '#001a41',
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

export const darkColors = {
  surface: '#111318',
  surfaceDim: '#111318',
  surfaceBright: '#37393f',
  surfaceContainerLowest: '#0c0e13',
  surfaceContainerLow: '#191c22',
  surfaceContainer: '#1d2027',
  surfaceContainerHigh: '#282a31',
  surfaceContainerHighest: '#33353d',

  onSurface: '#e2e2eb',
  onSurfaceVariant: '#c3c6d0',
  inverseSurface: '#e2e2eb',
  inverseOnSurface: '#2f3037',

  primary: '#aac7ff',
  primaryDark: '#7dadf7',
  onPrimary: '#00315f',
  primaryContainer: '#00477f',
  onPrimaryContainer: '#d8e2ff',
  primaryFixed: '#d8e2ff',
  onPrimaryFixed: '#001a41',
  inversePrimary: '#004e9f',

  secondary: '#c7c6ce',
  onSecondary: '#303036',
  secondaryContainer: '#46464d',
  onSecondaryContainer: '#e4e2eb',

  tertiary: '#ffb78f',
  onTertiary: '#502400',
  tertiaryContainer: '#733500',
  onTertiaryContainer: '#ffdcc8',

  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',

  outline: '#8c909b',
  outlineVariant: '#424752',

  background: '#111318',
  onBackground: '#e2e2eb',
  surfaceVariant: '#424752',

  success: '#88d18a',
  warning: '#ffb95c',
  info: '#aac7ff',

  transparent: 'transparent',
  black: '#000000',
  white: '#ffffff',

  disabledText: 'rgba(226, 226, 235, 0.38)',
};

export const colors = { ...lightColors };

export const applyThemeColors = (darkMode = false) => {
  Object.assign(colors, darkMode ? darkColors : lightColors);
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
