# Apple Bites Logo Assets

## Universal Logo Implementation

**Primary Logo**: `/public/apple-bites-logo.png` - Universal Apple Bites logo (variant 3 with full branding)

### Available Assets
- **apple-bites-logo-3.png** - Source for primary logo: Metallic apple + cyan glow + Meritage Partners + Business Assessment branding
- **apple-bites-logo-premium.png** - High-detail metallic apple with sophisticated money design (logo only)
- **apple-bites-business-context.png** - Logo shown in professional business context  
- **apple-bites-meritage-logo.png** - Combined Apple Bites + Meritage Partners branding

## Usage

Use the `AppleBitesLogo` component for consistent logo implementation:

```tsx
import { AppleBitesLogo } from '@/components/AppleBitesLogo';

// Basic usage
<AppleBitesLogo size="medium" />

// Custom size
<AppleBitesLogo width={100} height={100} />

// With click handler
<AppleBitesLogo size="large" onClick={() => navigate('/')} />
```

## Brand Integration

The universal logo features:
- Dark metallic apple with cyan glow effects (#00BFA6 teal brand color)
- Complete Meritage Partners and Apple Bites Business Assessment branding
- Professional money design symbolizing business valuation
- Optimal for both light and dark backgrounds
- Matches Apple Bites teal/navy theme system
- Full brand identity with company names and service description

## Component Sizes
- **All sizes**: 100x100px - Unified size for optimal logo visibility and brand recognition
- Use size variants for semantic meaning while maintaining consistent visual size

Last Updated: July 28, 2025