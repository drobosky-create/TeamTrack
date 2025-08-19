/**
 * NextButton Component - Material UI equivalent of ArgonButton
 * Provides enhanced button styling with gradient support
 */

import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from '../../assets/theme';

interface NextButtonProps extends Omit<ButtonProps, 'color'> {
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'light' | 'dark' | 'white';
  variant?: 'text' | 'contained' | 'outlined' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  circular?: boolean;
  iconOnly?: boolean;
}

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => 
    !['circular', 'iconOnly', 'gradient'].includes(prop as string),
})<NextButtonProps>(({ theme, color, variant, size, circular, iconOnly }) => {
  const getGradientBackground = () => {
    if (variant !== 'gradient' && variant !== 'contained') return undefined;
    
    const gradientColors = colors.gradients as any;
    if (gradientColors[color!]) {
      return `linear-gradient(135deg, ${gradientColors[color!].main} 0%, ${gradientColors[color!].state} 100%)`;
    }
    
    const colorValue = (colors as any)[color!];
    if (colorValue) {
      const mainColor = typeof colorValue === 'object' ? colorValue.main : colorValue;
      return `linear-gradient(135deg, ${mainColor} 0%, ${mainColor}dd 100%)`;
    }
    
    return undefined;
  };

  const getTextColor = () => {
    if (variant === 'contained' || variant === 'gradient') {
      return color === 'light' || color === 'white' ? colors.dark.main : colors.white.main;
    }
    
    const colorValue = (colors as any)[color!];
    if (colorValue) {
      return typeof colorValue === 'object' ? colorValue.main : colorValue;
    }
    
    return colors.primary.main;
  };

  const getPadding = () => {
    if (iconOnly) {
      return size === 'small' ? '8px' : size === 'large' ? '16px' : '12px';
    }
    
    return size === 'small' ? '6px 16px' : size === 'large' ? '12px 24px' : '8px 20px';
  };

  const getMinWidth = () => {
    return iconOnly ? 'auto' : '64px';
  };

  const getBorderRadius = () => {
    return circular ? '50%' : '12px';
  };

  return {
    background: getGradientBackground(),
    color: getTextColor(),
    padding: getPadding(),
    minWidth: getMinWidth(),
    borderRadius: getBorderRadius(),
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: variant === 'contained' || variant === 'gradient' 
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
      : 'none',
    border: variant === 'outlined' 
      ? `1px solid ${(colors as any)[color!]?.main || colors.primary.main}` 
      : 'none',
    '&:hover': {
      background: variant === 'gradient' || variant === 'contained'
        ? getGradientBackground()?.replace('135deg', '315deg')
        : undefined,
      boxShadow: variant === 'contained' || variant === 'gradient'
        ? `0 6px 10px -1px rgba(${color === 'primary' ? '94, 114, 228' : '0, 0, 0'}, 0.3)`
        : 'none',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&.Mui-disabled': {
      background: colors.grey[300],
      color: colors.grey[500],
      boxShadow: 'none',
    },
  };
});

const NextButton = forwardRef<HTMLButtonElement, NextButtonProps>(
  ({ 
    color = 'primary', 
    variant = 'contained', 
    size = 'medium', 
    circular = false, 
    iconOnly = false, 
    children, 
    ...rest 
  }, ref) => {
    return (
      <StyledButton
        ref={ref}
        color={color as any}
        variant={variant === 'gradient' ? 'contained' : variant}
        size={size}
        circular={circular}
        iconOnly={iconOnly}
        {...rest}
      >
        {children}
      </StyledButton>
    );
  }
);

NextButton.displayName = 'NextButton';

export default NextButton;