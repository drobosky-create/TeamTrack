import tokens from './tokens.json';
import { alpha } from '@mui/material/styles';

// Gradient definitions using tokens
export const gradients = {
  primary: {
    main: `linear-gradient(45deg, ${tokens.color.primaryGradientStart} 30%, ${tokens.color.primaryGradientEnd} 90%)`,
    state: `linear-gradient(45deg, ${tokens.color.primaryDark} 30%, ${tokens.color.primary} 90%)`,
  },
  secondary: {
    main: `linear-gradient(45deg, ${tokens.color.secondary} 30%, ${tokens.color.secondaryDark} 90%)`,
    state: `linear-gradient(45deg, ${tokens.color.secondaryDark} 30%, ${tokens.color.secondary} 90%)`,
  },
  info: {
    main: `linear-gradient(45deg, ${tokens.color.info} 30%, ${alpha(tokens.color.info, 0.8)} 90%)`,
    state: `linear-gradient(45deg, ${alpha(tokens.color.info, 0.8)} 30%, ${tokens.color.info} 90%)`,
  },
  success: {
    main: `linear-gradient(45deg, ${tokens.color.success} 30%, ${alpha(tokens.color.success, 0.8)} 90%)`,
    state: `linear-gradient(45deg, ${alpha(tokens.color.success, 0.8)} 30%, ${tokens.color.success} 90%)`,
  },
  warning: {
    main: `linear-gradient(45deg, ${tokens.color.warning} 30%, ${alpha(tokens.color.warning, 0.8)} 90%)`,
    state: `linear-gradient(45deg, ${alpha(tokens.color.warning, 0.8)} 30%, ${tokens.color.warning} 90%)`,
  },
  error: {
    main: `linear-gradient(45deg, ${tokens.color.error} 30%, ${alpha(tokens.color.error, 0.8)} 90%)`,
    state: `linear-gradient(45deg, ${alpha(tokens.color.error, 0.8)} 30%, ${tokens.color.error} 90%)`,
  },
  light: {
    main: `linear-gradient(135deg, ${tokens.color.backgroundLight} 0%, ${tokens.color.backgroundPaper} 100%)`,
    state: `linear-gradient(135deg, ${tokens.color.backgroundPaper} 0%, ${tokens.color.backgroundLight} 100%)`,
  },
  dark: {
    main: `linear-gradient(135deg, ${tokens.color.backgroundDark} 0%, ${tokens.color.backgroundDarkPaper} 100%)`,
    state: `linear-gradient(135deg, ${tokens.color.backgroundDarkPaper} 0%, ${tokens.color.backgroundDark} 100%)`,
  }
};

// Glass morphism styles using tokens
export const glassStyles = {
  default: {
    background: alpha(tokens.color.backgroundPaper, 0.7),
    backdropFilter: `blur(${tokens.radius.md}px)`,
    borderRadius: `${tokens.radius.md}px`,
    border: `1px solid ${alpha(tokens.color.gray["300"], 0.3)}`,
    boxShadow: tokens.shadow.md,
  },
  primary: {
    background: alpha(tokens.color.primary, 0.1),
    backdropFilter: `blur(${tokens.radius.lg}px)`,
    borderRadius: `${tokens.radius.md}px`,
    border: `1px solid ${alpha(tokens.color.primary, 0.2)}`,
    boxShadow: tokens.shadow.lg,
  },
  dark: {
    background: alpha(tokens.color.backgroundDark, 0.8),
    backdropFilter: `blur(${tokens.radius.md}px)`,
    borderRadius: `${tokens.radius.md}px`,
    border: `1px solid ${alpha(tokens.color.gray["700"], 0.3)}`,
    boxShadow: tokens.shadow.xl,
  }
};

// Export gradient helper functions
export const createGradient = (startColor: string, endColor: string, angle = 45) => {
  return `linear-gradient(${angle}deg, ${startColor} 30%, ${endColor} 90%)`;
};

export const createRadialGradient = (centerColor: string, edgeColor: string) => {
  return `radial-gradient(circle, ${centerColor} 0%, ${edgeColor} 100%)`;
};