import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface UITokens {
  'color.primary': string;
  'color.primaryLight': string;
  'color.backgroundLight': string;
  'color.backgroundDark': string;
  'color.slate': string;
  'color.success': string;
  'color.warning': string;
  'color.error': string;
  'gradient.brandBlue': string;
  'gradient.glasswhite': string;
  'gradient.growth': string;
  [key: string]: string;
}

export function useUITokens() {
  return useQuery<UITokens>({
    queryKey: ['/api/ui-tokens'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateUIToken() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return apiRequest(`/api/ui-tokens/${key}`, {
        method: 'PUT',
        body: { value },
      });
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