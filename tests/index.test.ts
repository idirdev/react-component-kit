import { describe, it, expect } from 'vitest';
import {
  theme,
  colors,
  spacing,
  typography,
  breakpoints,
  shadows,
  radii,
} from '../src/theme';

// Since this is a React component library that relies on styled-components and
// React DOM rendering, we test the theme/design-system exports which are
// pure JavaScript objects that don't require React rendering.

describe('colors', () => {
  it('should define primary colors', () => {
    expect(colors.primary).toBe('#3B82F6');
    expect(colors.primaryDark).toBe('#2563EB');
    expect(colors.primaryLight).toBe('#93C5FD');
  });

  it('should define secondary colors', () => {
    expect(colors.secondary).toBe('#6B7280');
    expect(colors.secondaryDark).toBe('#4B5563');
    expect(colors.secondaryLight).toBe('#D1D5DB');
  });

  it('should define danger/error colors', () => {
    expect(colors.danger).toBe('#EF4444');
    expect(colors.dangerDark).toBe('#DC2626');
    expect(colors.dangerLight).toBe('#FCA5A5');
  });

  it('should define success colors', () => {
    expect(colors.success).toBe('#10B981');
    expect(colors.successDark).toBe('#059669');
    expect(colors.successLight).toBe('#6EE7B7');
  });

  it('should define warning colors', () => {
    expect(colors.warning).toBe('#F59E0B');
    expect(colors.warningDark).toBe('#D97706');
    expect(colors.warningLight).toBe('#FCD34D');
  });

  it('should define info colors', () => {
    expect(colors.info).toBe('#3B82F6');
    expect(colors.infoDark).toBe('#2563EB');
    expect(colors.infoLight).toBe('#93C5FD');
  });

  it('should define black and white', () => {
    expect(colors.white).toBe('#FFFFFF');
    expect(colors.black).toBe('#000000');
  });

  it('should define a full gray scale', () => {
    expect(colors.gray50).toBe('#F9FAFB');
    expect(colors.gray100).toBe('#F3F4F6');
    expect(colors.gray200).toBe('#E5E7EB');
    expect(colors.gray300).toBe('#D1D5DB');
    expect(colors.gray400).toBe('#9CA3AF');
    expect(colors.gray500).toBe('#6B7280');
    expect(colors.gray600).toBe('#4B5563');
    expect(colors.gray700).toBe('#374151');
    expect(colors.gray800).toBe('#1F2937');
    expect(colors.gray900).toBe('#111827');
  });
});

describe('spacing', () => {
  it('should define all spacing levels', () => {
    expect(spacing.xs).toBe('4px');
    expect(spacing.sm).toBe('8px');
    expect(spacing.md).toBe('16px');
    expect(spacing.lg).toBe('24px');
    expect(spacing.xl).toBe('32px');
    expect(spacing.xxl).toBe('48px');
  });

  it('should have increasing values', () => {
    const values = [spacing.xs, spacing.sm, spacing.md, spacing.lg, spacing.xl, spacing.xxl]
      .map((v) => parseInt(v));
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe('typography', () => {
  it('should define a font family', () => {
    expect(typography.fontFamily).toContain('Segoe UI');
    expect(typography.fontFamily).toContain('Roboto');
  });

  it('should define font sizes from xs to xxl', () => {
    expect(typography.fontSize.xs).toBe('12px');
    expect(typography.fontSize.sm).toBe('14px');
    expect(typography.fontSize.md).toBe('16px');
    expect(typography.fontSize.lg).toBe('18px');
    expect(typography.fontSize.xl).toBe('24px');
    expect(typography.fontSize.xxl).toBe('32px');
  });

  it('should define font weights', () => {
    expect(typography.fontWeight.light).toBe(300);
    expect(typography.fontWeight.regular).toBe(400);
    expect(typography.fontWeight.medium).toBe(500);
    expect(typography.fontWeight.semibold).toBe(600);
    expect(typography.fontWeight.bold).toBe(700);
  });

  it('should define line heights', () => {
    expect(typography.lineHeight.tight).toBe(1.25);
    expect(typography.lineHeight.normal).toBe(1.5);
    expect(typography.lineHeight.relaxed).toBe(1.75);
  });
});

describe('breakpoints', () => {
  it('should define responsive breakpoints', () => {
    expect(breakpoints.xs).toBe('0px');
    expect(breakpoints.sm).toBe('576px');
    expect(breakpoints.md).toBe('768px');
    expect(breakpoints.lg).toBe('992px');
    expect(breakpoints.xl).toBe('1200px');
  });

  it('should have increasing values', () => {
    const values = [breakpoints.xs, breakpoints.sm, breakpoints.md, breakpoints.lg, breakpoints.xl]
      .map((v) => parseInt(v));
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});

describe('shadows', () => {
  it('should define shadow levels', () => {
    expect(shadows.sm).toBeDefined();
    expect(shadows.md).toBeDefined();
    expect(shadows.lg).toBeDefined();
    expect(shadows.xl).toBeDefined();
  });

  it('should be valid CSS box-shadow strings', () => {
    expect(shadows.sm).toContain('rgba');
    expect(shadows.md).toContain('rgba');
    expect(shadows.lg).toContain('rgba');
    expect(shadows.xl).toContain('rgba');
  });
});

describe('radii', () => {
  it('should define border radius values', () => {
    expect(radii.sm).toBe('4px');
    expect(radii.md).toBe('6px');
    expect(radii.lg).toBe('8px');
    expect(radii.xl).toBe('12px');
    expect(radii.full).toBe('9999px');
  });
});

describe('theme', () => {
  it('should compose all design tokens into a single object', () => {
    expect(theme.colors).toBe(colors);
    expect(theme.spacing).toBe(spacing);
    expect(theme.typography).toBe(typography);
    expect(theme.breakpoints).toBe(breakpoints);
    expect(theme.shadows).toBe(shadows);
    expect(theme.radii).toBe(radii);
  });

  it('should have all top-level keys', () => {
    const keys = Object.keys(theme);
    expect(keys).toContain('colors');
    expect(keys).toContain('spacing');
    expect(keys).toContain('typography');
    expect(keys).toContain('breakpoints');
    expect(keys).toContain('shadows');
    expect(keys).toContain('radii');
  });
});
