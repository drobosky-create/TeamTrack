/**
 * Apple Bites Logo Utilities
 * Centralized logo path management
 */

// Universal Apple Bites logo path
export const APPLE_BITES_LOGO = '/apple-bites-logo.png';

// Legacy logo paths (for migration reference)
export const LEGACY_LOGOS = {
  premium: '/assets/logos/apple-bites-logo-premium.png',
  meritage: '/assets/logos/apple-bites-meritage-logo.png',
  context: '/assets/logos/apple-bites-business-context.png'
} as const;

// Logo sizing utilities
export const LOGO_SIZES = {
  small: 100,
  medium: 100,
  large: 100,
  xl: 100
} as const;

export type LogoSize = keyof typeof LOGO_SIZES;