import { StyleSheet } from 'react-native';

export const Fonts = {
  plusJakartaSans: 'PlusJakartaSans',
  inter: 'Inter',
  jetBrainsMono: 'JetBrainsMono',
} as const;

export const Typography = StyleSheet.create({
  displayLg: {
    fontFamily: Fonts.plusJakartaSans,
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 48,
    letterSpacing: -0.8,
  },
  headlineLg: {
    fontFamily: Fonts.plusJakartaSans,
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
  },
  headlineMd: {
    fontFamily: Fonts.plusJakartaSans,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  headlineSm: {
    fontFamily: Fonts.plusJakartaSans,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: Fonts.inter,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
  },
  bodyMd: {
    fontFamily: Fonts.inter,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySm: {
    fontFamily: Fonts.inter,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  labelMd: {
    fontFamily: Fonts.jetBrainsMono,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.7,
  },
  labelSm: {
    fontFamily: Fonts.jetBrainsMono,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.6,
  },
});

export const Spacing = {
  unit: 8,
  gutter: 24,
  marginMobile: 16,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const Radii = {
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
