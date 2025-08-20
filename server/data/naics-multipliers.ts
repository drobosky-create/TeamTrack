// NAICS-based EBITDA multipliers from the official data file
// This data comes from: attached_assets/updated_ebitda_multiples_by_naics_full_1755644266414.json

export interface NAICSMultiplier {
  industry: string;
  base_range: {
    min: number;
    max: number;
  };
  premium_range: {
    min: number;
    max: number;
  };
  notes: string;
}

// Import the full dataset using require for JSON compatibility
const multipliersData = require('../../attached_assets/updated_ebitda_multiples_by_naics_full_1755644266414.json');

export const naicsMultipliers: Record<string, NAICSMultiplier> = multipliersData;

// Helper function to get multiplier for a specific NAICS code
export function getNAICSMultiplier(naicsCode: string, performanceScore: number): number {
  const multiplierData = naicsMultipliers[naicsCode];
  
  if (!multiplierData) {
    // If no specific NAICS data, use sector-based defaults
    return getSectorDefaultMultiplier(naicsCode, performanceScore);
  }
  
  // Determine if company qualifies for premium range based on performance
  // Score of 4.0+ (out of 5.0) qualifies for premium range
  const isPremium = performanceScore >= 4.0;
  
  if (isPremium) {
    // Use premium range, interpolate based on score (4.0-5.0 maps to min-max of premium range)
    const normalizedScore = (performanceScore - 4.0) / 1.0; // 0 to 1
    return multiplierData.premium_range.min + 
           (multiplierData.premium_range.max - multiplierData.premium_range.min) * normalizedScore;
  } else {
    // Use base range, interpolate based on score (0-3.9 maps to min-max of base range)
    const normalizedScore = performanceScore / 3.9; // 0 to 1
    return multiplierData.base_range.min + 
           (multiplierData.base_range.max - multiplierData.base_range.min) * normalizedScore;
  }
}

// Fallback sector-based multipliers if specific NAICS not found
function getSectorDefaultMultiplier(naicsCode: string, performanceScore: number): number {
  const sector = naicsCode.substring(0, 2);
  
  // Default sector multipliers (conservative estimates)
  const sectorMultipliers: Record<string, { base: number; premium: number }> = {
    '11': { base: 3.0, premium: 5.0 }, // Agriculture
    '21': { base: 4.0, premium: 7.0 }, // Mining
    '22': { base: 5.0, premium: 8.0 }, // Utilities
    '23': { base: 4.0, premium: 7.0 }, // Construction
    '31': { base: 4.5, premium: 7.5 }, // Manufacturing
    '32': { base: 4.5, premium: 7.5 }, // Manufacturing
    '33': { base: 4.5, premium: 7.5 }, // Manufacturing
    '42': { base: 3.5, premium: 6.0 }, // Wholesale Trade
    '44': { base: 3.0, premium: 5.5 }, // Retail Trade
    '45': { base: 3.0, premium: 5.5 }, // Retail Trade
    '48': { base: 3.5, premium: 6.0 }, // Transportation
    '49': { base: 3.5, premium: 6.0 }, // Transportation
    '51': { base: 7.0, premium: 12.0 }, // Information/Tech
    '52': { base: 6.0, premium: 10.0 }, // Finance
    '53': { base: 5.0, premium: 8.0 }, // Real Estate
    '54': { base: 6.5, premium: 11.0 }, // Professional Services
    '55': { base: 5.5, premium: 9.0 }, // Management
    '56': { base: 4.0, premium: 7.0 }, // Administrative
    '61': { base: 4.5, premium: 7.5 }, // Educational
    '62': { base: 5.5, premium: 9.0 }, // Healthcare
    '71': { base: 3.5, premium: 6.0 }, // Arts/Entertainment
    '72': { base: 3.0, premium: 5.0 }, // Accommodation/Food
    '81': { base: 3.5, premium: 6.0 }, // Other Services
    '92': { base: 4.0, premium: 7.0 }, // Public Administration
  };
  
  const sectorData = sectorMultipliers[sector] || { base: 4.0, premium: 7.0 };
  
  // Premium if score >= 4.0
  if (performanceScore >= 4.0) {
    const normalizedScore = (performanceScore - 4.0) / 1.0;
    return sectorData.base + (sectorData.premium - sectorData.base) * (0.5 + normalizedScore * 0.5);
  } else {
    const normalizedScore = performanceScore / 4.0;
    return sectorData.base * (0.7 + normalizedScore * 0.3);
  }
}