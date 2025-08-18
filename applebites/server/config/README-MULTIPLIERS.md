# Multiplier Files Organization

This directory contains various EBITDA multiplier datasets organized by their usage context:

## File Structure

### Grade-Based Multipliers (Free Assessment)
- **`grade-based-multipliers.ts`** (formerly `multiplierScale.ts`)
  - Used by: Free assessment value calculator, Interactive valuation slider
  - Contains: Simple A-F grade multipliers (A=7.5x, B=5.7x, C=4.2x, D=3.0x, F=2.0x)
  - Function: `getMultiplierForGrade(grade)`

### Free Assessment Industry Multipliers
- **`free-assessment-multipliers.ts`** (formerly `ebitda-multipliers.ts`)
  - Used by: Free tier basic industry categorization
  - Contains: Basic 2-digit NAICS sector multipliers
  - Function: `getEBITDAMultiplierByNAICS(naicsCode)`

### Paid Assessment NAICS Multipliers
- **`paid-assessment-naics-multipliers.ts`** (formerly `comprehensive-naics-multipliers.ts`)
  - Used by: Paid/Growth tier with detailed industry analysis
  - Contains: Comprehensive 6-digit NAICS code multipliers with min/avg/max ranges
  - Function: `calculateComprehensiveMultiplierFromGrade(multiplierData, grade)`

### Construction-Specific Premium Multipliers
- **`construction-specific-multipliers.ts`** (NEW)
  - Used by: Paid tier construction businesses with premium qualifications
  - Contains: Updated construction EBITDA multipliers with base/premium ranges
  - Function: `calculateConstructionMultiplier(naicsCode, grade, isPremium)`

### Other Multiplier Files
- **`naicsMultipliers.ts`** - Paid tier specific NAICS mappings
- **`curated-naics-database.ts`** - Curated industry subset with ranges
- **`complete-naics-database.ts`** - Full NAICS hierarchy

## Usage Locations

### Frontend (Client)
- `client/src/components/interactive-valuation-slider.tsx` - **Hardcoded multipliers** for free assessment slider
- Grade-based calculations in various components

### Backend (Server)
- `server/routes.ts` - Main valuation calculation endpoints
- Imports grade-based and comprehensive NAICS multipliers

## Data Flow
1. **Free Assessment**: Uses grade-based multipliers (7.5x for A grade, etc.)
2. **Paid Assessment**: Uses comprehensive NAICS-specific multipliers with grade adjustments
3. **Interactive Slider**: Uses hardcoded grade multipliers for real-time calculations

## Recent Updates
- Renamed files to clarify usage context (free vs paid assessment)
- Updated imports in server/routes.ts
- Added construction-specific premium multipliers with base/premium ranges
- Updated 7 construction NAICS codes with latest market data (Roofing: 5.9-11.0x, Electrical: 6.1-11.5x, etc.)
- Hardcoded multipliers in interactive-valuation-slider.tsx identified for future cleanup

## Future Improvements
- Centralize hardcoded multipliers in interactive-valuation-slider.tsx
- Implement premium qualification logic based on value driver scores
- Implement dynamic multiplier loading for consistent data across all components