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
  });
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