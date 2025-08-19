import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import tokens from '../../../src/theme/tokens.json';

export interface UITokens {
  'color.primary': string;
  'color.primaryLight': string;
  'color.backgroundLight': string;
  'color.backgroundDark': string;
  'color.slate': string;
  'color.success': string;
  'color.warning': string;
  'color.error': string;
  'color.textOnBrand': string;
  'gradient.brandBlue': string;
  'gradient.glasswhite': string;
  'gradient.growth': string;
  'radius.md': string;
  'radius.lg': string;
  'blur.glass': string;
  [key: string]: string;
}

// Default tokens from static file as fallback
const defaultTokens: UITokens = {
  'color.primary': tokens.color.primary,
  'color.primaryLight': tokens.color.primaryLight,
  'color.backgroundLight': tokens.color.backgroundLight,
  'color.backgroundDark': tokens.color.backgroundDark,
  'color.slate': tokens.color.slate,
  'color.success': tokens.color.success,
  'color.warning': tokens.color.warning,
  'color.error': tokens.color.error,
  'color.textOnBrand': tokens.color.textOnBrand,
  'gradient.brandBlue': tokens.gradient.brandBlue,
  'gradient.glasswhite': tokens.gradient.glasswhite,
  'gradient.growth': tokens.gradient.growth,
  'radius.md': tokens.radius.md,
  'radius.lg': tokens.radius.lg,
  'blur.glass': tokens.blur.glass,
};

export function useUITokens() {
  const query = useQuery<UITokens>({
    queryKey: ['/api/ui-tokens'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: defaultTokens,
  });

  // Apply CSS variables when tokens change
  useEffect(() => {
    if (query.data) {
      updateCSSVariables(query.data);
    }
  }, [query.data]);

  return query;
}

// Helper function to update CSS variables dynamically
function updateCSSVariables(tokens: UITokens) {
  const root = document.documentElement;
  
  Object.entries(tokens).forEach(([key, value]) => {
    // Convert key format: 'color.primary' becomes '--ab-color-primary'
    const cssVar = `--ab-${key.replace(/\./g, '-')}`;
    root.style.setProperty(cssVar, value);
    
    // Also map to standard CSS variables for universal theming
    const mappings: Record<string, string> = {
      'color.primary': '--primary',
      'color.primaryLight': '--primary-light',
      'color.secondary': '--secondary',
      'color.accent': '--accent',
      'color.background': '--background',
      'color.surface': '--card',
      'color.text': '--foreground',
      'color.textSecondary': '--muted-foreground',
      'color.border': '--border',
      'color.error': '--destructive',
      'color.success': '--success',
      'color.warning': '--warning',
      'gradient.primary': '--gradient-primary',
      'gradient.secondary': '--gradient-secondary',
      'typography.primaryFont': '--font-primary',
      'typography.secondaryFont': '--font-secondary',
      'spacing.unit': '--spacing-unit',
      'effects.borderRadius': '--radius',
      'effects.boxShadow': '--shadow'
    };
    
    if (mappings[key]) {
      // Convert HSL format if needed
      if (key.startsWith('color.') && value.startsWith('#')) {
        const hslValue = hexToHsl(value);
        root.style.setProperty(mappings[key], hslValue);
      } else {
        root.style.setProperty(mappings[key], value);
      }
    }
  });
}

// Helper function to convert hex to HSL format for CSS variables
function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function useUpdateUIToken() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await fetch(`/api/ui-tokens/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update UI token');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ui-tokens'] });
    },
  });
}

// Helper hook to get specific token values with fallbacks
export function useUIToken(key: keyof UITokens, fallback: string = '') {
  const { data: tokens } = useUITokens();
  return tokens?.[key] || fallback;
}

// Helper hook to generate CSS custom properties from UI tokens
export function useUITokensAsCSS() {
  const { data: tokens } = useUITokens();
  
  if (!tokens) return {};
  
  return Object.entries(tokens).reduce((acc, [key, value]) => {
    // Convert key format: 'color.primary' becomes '--color-primary'
    const cssVar = `--${key.replace(/\./g, '-')}`;
    acc[cssVar] = value;
    return acc;
  }, {} as Record<string, string>);
}