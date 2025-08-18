/**
 * Material Dashboard 2 Wrapper
 * Provides Material Dashboard theme integration with MUI
 */

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { materialDashboardTheme } from '@/theme/materialDashboard';

interface MaterialWrapperProps {
  children: React.ReactNode;
  [key: string]: any;
}

// Create Apple Bites Material Dashboard enhanced MUI theme
const mdTheme = createTheme({
  palette: {
    primary: {
      main: '#00718d',      // Apple Bites Teal
      dark: '#008e7e',      // Apple Bites Teal Dark
    },
    secondary: {
      main: '#0A1F44',      // Apple Bites Navy
      dark: '#07152E',      // Apple Bites Deeper Navy
    },
    info: {
      main: '#00718d',      // Apple Bites Teal
      dark: '#008e7e',      // Apple Bites Teal Dark
    },
    success: {
      main: '#16A34A',      // Apple Bites Green
      dark: '#15803D',      // Green Dark
    },
    warning: {
      main: '#F59E0B',      // Apple Bites Amber
      dark: '#D97706',      // Amber Dark
    },
    error: {
      main: '#DC2626',      // Apple Bites Red
      dark: '#B91C1C',      // Red Dark
    },
    grey: {
      50: '#F7FAFC',        // Apple Bites Gray Light
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',       // Apple Bites Gray
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',       // Apple Bites Gray Dark
      700: '#334155',
      800: '#1E293B',       // Apple Bites Gray Darker
      900: '#0F172A',
    },
    text: {
      primary: '#0A1F44',   // Apple Bites Navy
      secondary: '#475569', // Apple Bites Gray Dark
    },
    background: {
      default: '#F7FAFC',   // Apple Bites Gray Light
      paper: '#ffffff',     // Apple Bites White
    },
    // Material Dashboard specific palette extensions
    white: {
      main: '#ffffff',      // Apple Bites White
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { color: '#0A1F44' },    // Apple Bites Navy
    h2: { color: '#0A1F44' },    // Apple Bites Navy
    h3: { color: '#0A1F44' },    // Apple Bites Navy
    h4: { color: '#0A1F44' },    // Apple Bites Navy
    h5: { color: '#0A1F44' },    // Apple Bites Navy
    h6: { color: '#0A1F44' },    // Apple Bites Navy
  },
  shape: {
    borderRadius: 12,
  },
  // Inject Material Dashboard custom properties
  gradients: materialDashboardTheme.gradients,
  boxShadows: materialDashboardTheme.boxShadows,
  borders: materialDashboardTheme.borders,
  functions: materialDashboardTheme.functions,
} as any);

export default function MaterialWrapper({ children }: MaterialWrapperProps) {
  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}