/**
 * NextJS Material Theme Provider
 * Provides Material UI theme context to the entire application
 */

import React, { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from '../../assets/theme';

interface NextThemeProviderProps {
  children: ReactNode;
}

const NextThemeProvider: React.FC<NextThemeProviderProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default NextThemeProvider;