// src/styles/typography.js
// Ivory Academic Typography System

export const typography = {
  // Display Styles
  displayLarge: {
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    letterSpacing: -0.02,
    fontFamily: 'System', // Default system font (Inter not needed in RN)
  },

  // Headline Styles
  headlineLarge: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.01,
  },
  headlineMobile: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    letterSpacing: 0,
  },

  // Title Styles
  titleLarge: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    letterSpacing: 0.01,
  },
  titleSmall: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.02,
  },

  // Body Styles
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
    letterSpacing: 0.02,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0.02,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: 0.03,
  },

  // Label Styles
  labelLarge: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.02,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.02,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    letterSpacing: 0.03,
  },

  // Caption
  caption: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 14,
    letterSpacing: 0,
  },

  // Button Text (Special)
  button: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.02,
  },
};

export default typography;