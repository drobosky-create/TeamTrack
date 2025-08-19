import React, { createContext, useContext, ReactNode } from 'react';
import { useUITokens, type UITokens } from '@/hooks/useUITokens';

interface ThemeTokenContextType {
  tokens: UITokens | undefined;
  isLoading: boolean;
}

const ThemeTokenContext = createContext<ThemeTokenContextType | undefined>(undefined);

export function ThemeTokenProvider({ children }: { children: ReactNode }) {
  const { data: tokens, isLoading } = useUITokens();

  return (
    <ThemeTokenContext.Provider value={{ tokens, isLoading }}>
      {children}
    </ThemeTokenContext.Provider>
  );
}

export function useThemeTokens() {
  const context = useContext(ThemeTokenContext);
  if (context === undefined) {
    throw new Error('useThemeTokens must be used within a ThemeTokenProvider');
  }
  return context;
}

// Helper hook to get a specific token with fallback
export function useThemeToken(key: keyof UITokens, fallback?: string) {
  const { tokens } = useThemeTokens();
  return tokens?.[key] || fallback || '';
}