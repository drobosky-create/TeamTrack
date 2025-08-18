/**
 * NextTypography Component - Material UI equivalent of ArgonTypography  
 * Provides enhanced typography with Argon theme styling
 */

import React, { forwardRef } from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from '../../assets/theme';

interface NextTypographyProps extends Omit<TypographyProps, 'color'> {
  color?: keyof typeof colors | string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  verticalAlign?: 'baseline' | 'sub' | 'super' | 'text-top' | 'text-bottom' | 'middle' | 'top' | 'bottom';
  textGradient?: boolean;
  opacity?: number;
}

const StyledTypography = styled(Typography, {
  shouldForwardProp: (prop) => 
    !['textTransform', 'verticalAlign', 'textGradient', 'opacity'].includes(prop as string),
})<NextTypographyProps>(({ theme, color, textTransform, verticalAlign, textGradient, opacity }) => {
  const getTextColor = () => {
    if (!color) return 'inherit';
    
    if (textGradient) {
      const gradientColors = colors.gradients as any;
      if (gradientColors[color]) {
        return `linear-gradient(135deg, ${gradientColors[color].main} 0%, ${gradientColors[color].state} 100%)`;
      }
    }
    
    const colorValue = (colors as any)[color];
    if (colorValue) {
      return typeof colorValue === 'object' ? colorValue.main : colorValue;
    }
    
    return color;
  };

  const textColor = getTextColor();
  
  return {
    color: textGradient ? 'transparent' : textColor,
    background: textGradient ? textColor : 'transparent',
    WebkitBackgroundClip: textGradient ? 'text' : 'initial',
    backgroundClip: textGradient ? 'text' : 'initial',
    textTransform,
    verticalAlign,
    opacity,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  };
});

const NextTypography = forwardRef<HTMLElement, NextTypographyProps>(
  ({ 
    color = 'text', 
    textTransform = 'none', 
    verticalAlign = 'baseline', 
    textGradient = false, 
    opacity = 1,
    children,
    ...rest 
  }, ref) => {
    return (
      <StyledTypography
        ref={ref}
        color={color as any}
        textTransform={textTransform}
        verticalAlign={verticalAlign}
        textGradient={textGradient}
        opacity={opacity}
        {...rest}
      >
        {children}
      </StyledTypography>
    );
  }
);

NextTypography.displayName = 'NextTypography';

export default NextTypography;