// Feature flags configuration
export const IS_UNIFIED_SHELL = true;
export const ENABLE_VDR = true;
export const ENABLE_SEARCH_FEATURES = true;
export const ENABLE_TIER_MANAGEMENT = true;

// Feature flag helper function
export function isFeatureEnabled(flag: string): boolean {
  switch (flag) {
    case 'UNIFIED_SHELL':
      return IS_UNIFIED_SHELL;
    case 'VDR':
      return ENABLE_VDR;
    case 'SEARCH_FEATURES':
      return ENABLE_SEARCH_FEATURES;
    case 'TIER_MANAGEMENT':
      return ENABLE_TIER_MANAGEMENT;
    default:
      return false;
  }
}