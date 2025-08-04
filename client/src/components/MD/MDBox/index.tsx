import React, { forwardRef, ReactNode } from 'react';
import { BoxProps } from '@mui/material/Box';

// Custom styles for MDBox
import MDBoxRoot from './MDBoxRoot';

export interface MDBoxProps extends Omit<BoxProps, 'component'> {
  variant?: 'contained' | 'gradient';
  bgColor?: string;
  color?: string;
  opacity?: number;
  borderRadius?: string;
  shadow?: string;
  coloredShadow?: string;
  children?: ReactNode;
  component?: React.ElementType;
}

const MDBox = forwardRef<any, MDBoxProps>(
  ({ variant = 'contained', bgColor = 'transparent', color = 'dark', opacity = 1, borderRadius = 'none', shadow = 'none', coloredShadow = 'none', ...rest }, ref) => (
    <MDBoxRoot
      {...rest}
      ref={ref}
      ownerState={{ variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow }}
    />
  )
);

MDBox.displayName = 'MDBox';

export default MDBox;