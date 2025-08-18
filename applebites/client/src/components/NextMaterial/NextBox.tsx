/**
 * NextBox Component - Material UI equivalent of ArgonBox
 * Provides flexible container with gradient backgrounds and styling options
 */

import React, { forwardRef } from 'react';
import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from '../../assets/theme';

interface NextBoxProps extends Omit<BoxProps, 'color'> {
  variant?: 'contained' | 'gradient';
  bgColor?: keyof typeof colors | string;
  color?: keyof typeof colors | string;
  opacity?: number;
  borderRadius?: string | number;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => 
    !['variant', 'bgColor', 'opacity', 'shadow'].includes(prop as string),
})<NextBoxProps>(({ theme, variant, bgColor, color, opacity, borderRadius, shadow }) => {
  const getBackgroundColor = () => {
    if (!bgColor || bgColor === 'transparent') return 'transparent';
    
    if (variant === 'gradient') {
      const gradientColors = colors.gradients as any;
      if (gradientColors[bgColor]) {
        return `linear-gradient(135deg, ${gradientColors[bgColor].main} 0%, ${gradientColors[bgColor].state} 100%)`;
      }
    }
    
    const colorValue = (colors as any)[bgColor];
    if (colorValue) {
      return typeof colorValue === 'object' ? colorValue.main : colorValue;
    }
    
    return bgColor;
  };

  const getTextColor = () => {
    if (!color) return 'inherit';
    
    const colorValue = (colors as any)[color];
    if (colorValue) {
      return typeof colorValue === 'object' ? colorValue.main : colorValue;
    }
    
    return color;
  };

  const getShadow = () => {
    const shadows = {
      none: 'none',
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    };
    
    return shadow ? shadows[shadow] : shadows.none;
  };

  return {
    background: variant === 'gradient' ? getBackgroundColor() : undefined,
    backgroundColor: variant !== 'gradient' ? getBackgroundColor() : undefined,
    color: getTextColor(),
    opacity,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    boxShadow: getShadow(),
  };
});

const NextBox = forwardRef<HTMLDivElement, NextBoxProps>(
  ({ variant = 'contained', bgColor = 'transparent', color = 'dark', opacity = 1, borderRadius = 'none', shadow = 'none', children, ...rest }, ref) => {
    return (
      <StyledBox
        ref={ref}
        variant={variant}
        bgColor={bgColor}
        color={color}
        opacity={opacity}
        borderRadius={borderRadius}
        shadow={shadow}
        {...rest}
      >
        {children}
      </StyledBox>
    );
  }
);

NextBox.displayName = 'NextBox';

export default NextBox;