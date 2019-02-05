export const colors = {
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#93C5FD',
  secondary: '#6B7280',
  secondaryDark: '#4B5563',
  secondaryLight: '#D1D5DB',
  danger: '#EF4444',
  dangerDark: '#DC2626',
  dangerLight: '#FCA5A5',
  success: '#10B981',
  successDark: '#059669',
  successLight: '#6EE7B7',
  warning: '#F59E0B',
  warningDark: '#D97706',
  warningLight: '#FCD34D',
  info: '#3B82F6',
  infoDark: '#2563EB',
  infoLight: '#93C5FD',
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const typography = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
  fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '18px', xl: '24px', xxl: '32px' },
  fontWeight: { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.75 },
};

export const breakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const radii = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
};

export const theme = { colors, spacing, typography, breakpoints, shadows, radii };
export type Theme = typeof theme;
export default theme;
