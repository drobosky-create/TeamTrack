// NAICS-specific valuation multipliers for paid tier
export interface NAICSMultiplier {
  code: string;
  label: string;
  category: string;
  baseMultiple: number;
  lowMultiple: number;
  highMultiple: number;
  strategicCap: number;
  description: string;
}

export const naicsMultipliers: Record<string, NAICSMultiplier> = {
  // Professional Services
  "541": {
    code: "541",
    label: "Professional, Scientific, and Technical Services",
    category: "Professional Services",
    baseMultiple: 4.2,
    lowMultiple: 2.8,
    highMultiple: 6.5,
    strategicCap: 9.2,
    description: "Consulting, legal, accounting, engineering, and other professional services"
  },
  "5413": {
    code: "5413",
    label: "Architectural, Engineering, and Related Services",
    category: "Professional Services",
    baseMultiple: 3.8,
    lowMultiple: 2.5,
    highMultiple: 5.9,
    strategicCap: 8.1,
    description: "Architecture, engineering, and specialized design services"
  },
  
  // Technology
  "518": {
    code: "518",
    label: "Data Processing, Hosting, and Related Services",
    category: "Technology",
    baseMultiple: 6.8,
    lowMultiple: 4.2,
    highMultiple: 9.8,
    strategicCap: 15.2,
    description: "Cloud computing, data centers, and web hosting services"
  },
  "5415": {
    code: "5415",
    label: "Computer Systems Design and Related Services",
    category: "Technology",
    baseMultiple: 5.4,
    lowMultiple: 3.8,
    highMultiple: 7.9,
    strategicCap: 12.3,
    description: "Software development, IT consulting, and systems integration"
  },
  
  // Healthcare
  "621": {
    code: "621",
    label: "Ambulatory Health Care Services",
    category: "Healthcare",
    baseMultiple: 4.9,
    lowMultiple: 3.2,
    highMultiple: 7.1,
    strategicCap: 10.8,
    description: "Medical practices, diagnostic labs, and outpatient care"
  },
  "6213": {
    code: "6213",
    label: "Offices of Other Health Practitioners",
    category: "Healthcare",
    baseMultiple: 3.6,
    lowMultiple: 2.4,
    highMultiple: 5.2,
    strategicCap: 7.8,
    description: "Dental, chiropractic, and other specialized medical practices"
  },
  
  // Manufacturing
  "311": {
    code: "311",
    label: "Food Manufacturing",
    category: "Manufacturing",
    baseMultiple: 3.9,
    lowMultiple: 2.8,
    highMultiple: 5.4,
    strategicCap: 8.1,
    description: "Food processing, beverage manufacturing, and related products"
  },
  "332": {
    code: "332",
    label: "Fabricated Metal Product Manufacturing",
    category: "Manufacturing",
    baseMultiple: 3.2,
    lowMultiple: 2.1,
    highMultiple: 4.8,
    strategicCap: 6.9,
    description: "Metal fabrication, machinery, and industrial equipment"
  },
  
  // Retail
  "445": {
    code: "445",
    label: "Food and Beverage Stores",
    category: "Retail",
    baseMultiple: 2.8,
    lowMultiple: 1.9,
    highMultiple: 4.1,
    strategicCap: 5.8,
    description: "Grocery stores, specialty food retailers, and beverage shops"
  },
  "448": {
    code: "448",
    label: "Clothing and Clothing Accessories Stores",
    category: "Retail",
    baseMultiple: 2.4,
    lowMultiple: 1.6,
    highMultiple: 3.5,
    strategicCap: 5.1,
    description: "Apparel, footwear, and accessory retail stores"
  },
  
  // Construction
  "236": {
    code: "236",
    label: "Construction of Buildings",
    category: "Construction",
    baseMultiple: 2.9,
    lowMultiple: 2.0,
    highMultiple: 4.2,
    strategicCap: 6.1,
    description: "Residential and commercial building construction"
  },
  "238": {
    code: "238",
    label: "Specialty Trade Contractors",
    category: "Construction",
    baseMultiple: 2.6,
    lowMultiple: 1.8,
    highMultiple: 3.8,
    strategicCap: 5.4,
    description: "Electrical, plumbing, HVAC, and other specialized contractors"
  },
  
  // Transportation
  "484": {
    code: "484",
    label: "Truck Transportation",
    category: "Transportation",
    baseMultiple: 3.1,
    lowMultiple: 2.2,
    highMultiple: 4.5,
    strategicCap: 6.3,
    description: "Freight trucking and logistics services"
  },
  
  // Financial Services
  "523": {
    code: "523",
    label: "Securities, Commodity Contracts, and Other Financial Investments",
    category: "Financial Services",
    baseMultiple: 5.8,
    lowMultiple: 3.9,
    highMultiple: 8.4,
    strategicCap: 12.1,
    description: "Investment services, brokerage, and financial planning"
  }
};

// Default multiplier for free tier or unknown NAICS codes
export const defaultMultiplier: NAICSMultiplier = {
  code: "000",
  label: "General Business",
  category: "General",
  baseMultiple: 4.0,
  lowMultiple: 3.0,
  highMultiple: 8.0,
  strategicCap: 10.0,
  description: "General business valuation using industry-standard metrics"
};

export function getMultiplierByNAICS(naicsCode: string): NAICSMultiplier {
  // Try exact match first
  if (naicsMultipliers[naicsCode]) {
    return naicsMultipliers[naicsCode];
  }
  
  // Try partial matches for broader categories
  const threeDigit = naicsCode.substring(0, 3);
  if (naicsMultipliers[threeDigit]) {
    return naicsMultipliers[threeDigit];
  }
  
  // Try two-digit for sector-level match
  const twoDigit = naicsCode.substring(0, 2);
  const sectorMatch = Object.values(naicsMultipliers).find(m => m.code.startsWith(twoDigit));
  if (sectorMatch) {
    return sectorMatch;
  }
  
  return defaultMultiplier;
}

// Calculate score-weighted multiplier based on value driver grades
export function calculateWeightedMultiplier(
  multiplierData: NAICSMultiplier,
  overallGradeScore: number, // 0-100 score from grades
  reportTier: 'free' | 'paid' = 'free'
): number {
  if (reportTier === 'free') {
    // Free tier uses fixed range
    return defaultMultiplier.baseMultiple;
  }
  
  // Paid tier uses dynamic calculation
  const { lowMultiple, baseMultiple, highMultiple, strategicCap } = multiplierData;
  
  // Convert 0-100 score to multiplier
  if (overallGradeScore >= 90) {
    // Exceptional companies can reach strategic cap
    return Math.min(strategicCap, highMultiple + (strategicCap - highMultiple) * ((overallGradeScore - 90) / 10));
  } else if (overallGradeScore >= 70) {
    // Good companies get above base multiple
    return baseMultiple + (highMultiple - baseMultiple) * ((overallGradeScore - 70) / 20);
  } else if (overallGradeScore >= 50) {
    // Average companies get base multiple
    return baseMultiple + (baseMultiple - lowMultiple) * ((overallGradeScore - 50) / 20);
  } else {
    // Below average companies get reduced multiple
    return Math.max(lowMultiple, baseMultiple - (baseMultiple - lowMultiple) * ((50 - overallGradeScore) / 50));
  }
}