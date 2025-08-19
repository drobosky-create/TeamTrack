/**
 * Universal Apple Bites Logo Component
 * Centralized logo component for consistent usage across the application
 */

import React from 'react';

interface AppleBitesLogoProps {
  /** Logo size variant */
  size?: 'small' | 'medium' | 'large' | 'xl';
  /** Custom width (overrides size) */
  width?: number;
  /** Custom height (overrides size) */
  height?: number;
  /** Additional CSS classes */
  className?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Click handler */
  onClick?: () => void;
}

const sizeMap = {
  small: { width: 100, height: 100 },
  medium: { width: 100, height: 100 },
  large: { width: 100, height: 100 },
  xl: { width: 100, height: 100 }
};

export function AppleBitesLogo({
  size = 'medium',
  width,
  height,
  className = '',
  alt = 'Apple Bites Business Assessment',
  onClick
}: AppleBitesLogoProps) {
  const dimensions = {
    width: width || sizeMap[size].width,
    height: height || sizeMap[size].height
  };

  return (
    <img
      src="/apple-bites-logo.png"
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      className={`apple-bites-logo ${className}`}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        objectFit: 'contain'
      }}
    />
  );
}

export default AppleBitesLogo;