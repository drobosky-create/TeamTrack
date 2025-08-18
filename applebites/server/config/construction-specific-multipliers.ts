// Construction-Specific EBITDA Multipliers
// Updated mid-2025 based on observed deal activity
// Source: Private market transactions and industry analysis

export interface ConstructionMultiplierRange {
  naicsCode: string;
  industry: string;
  baseRange: {
    min: number;
    max: number;
  };
  premiumRange: {
    min: number;
    max: number;
  } | null;
  notes: string;
}

export const constructionMultipliers: ConstructionMultiplierRange[] = [
  {
    naicsCode: "238160",
    industry: "Roofing Contractors",
    baseRange: { min: 5.9, max: 8.4 },
    premiumRange: { min: 8.5, max: 11.0 },
    notes: "Premium applies to firms with strong margins, recurring revenue, and defined systems."
  },
  {
    naicsCode: "238220",
    industry: "Plumbing, Heating, and Air-Conditioning Contractors",
    baseRange: { min: 6.0, max: 8.0 },
    premiumRange: { min: 8.5, max: 11.0 },
    notes: "Premium range reflects firms with strong service agreements or recurring maintenance contracts."
  },
  {
    naicsCode: "238210",
    industry: "Electrical Contractors and Other Wiring Installation Contractors",
    baseRange: { min: 6.1, max: 8.7 },
    premiumRange: { min: 8.8, max: 11.5 },
    notes: "Includes value of government and commercial contracts."
  },
  {
    naicsCode: "238310",
    industry: "Drywall and Insulation Contractors",
    baseRange: { min: 5.5, max: 7.5 },
    premiumRange: { min: 7.6, max: 9.8 },
    notes: "Premium reflects firms with integrated service offerings or strong regional positioning."
  },
  {
    naicsCode: "238320",
    industry: "Painting and Wall Covering Contractors",
    baseRange: { min: 5.0, max: 6.5 },
    premiumRange: { min: 6.6, max: 8.5 },
    notes: "Premium applies to commercial firms with brand presence or recurring contracts."
  },
  {
    naicsCode: "238910",
    industry: "Site Preparation Contractors",
    baseRange: { min: 5.8, max: 7.8 },
    premiumRange: { min: 8.0, max: 10.2 },
    notes: "Includes excavation, grading, and demolition contractors."
  },
  {
    naicsCode: "236220",
    industry: "Commercial and Institutional Building Construction",
    baseRange: { min: 6.5, max: 9.0 },
    premiumRange: { min: 9.1, max: 11.5 },
    notes: "Premium reflects backlog, bonding capacity, and GC relationships."
  },
  {
    naicsCode: "general_construction",
    industry: "General Construction (Aggregated Private Market)",
    baseRange: { min: 4.0, max: 6.5 },
    premiumRange: { min: 7.0, max: 9.5 },
    notes: "Applicable to small and mid-sized construction businesses across multiple sectors."
  },
  {
    naicsCode: "public_comps",
    industry: "Public Comparables - Construction & Engineering",
    baseRange: { min: 11.5, max: 12.5 },
    premiumRange: null,
    notes: "Reference from Equidam TRBC industry classification for public market comps."
  }
];

// Function to get construction-specific multiplier by NAICS code
export function getConstructionMultiplierByNAICS(naicsCode: string): ConstructionMultiplierRange | undefined {
  return constructionMultipliers.find(multiplier => multiplier.naicsCode === naicsCode);
}

// Function to calculate multiplier based on grade and premium qualification
export function calculateConstructionMultiplier(
  naicsCode: string, 
  grade: string, 
  isPremium: boolean = false
): number {
  const multiplierData = getConstructionMultiplierByNAICS(naicsCode);
  if (!multiplierData) return 4.2; // Default fallback
  
  const range = isPremium && multiplierData.premiumRange ? multiplierData.premiumRange : multiplierData.baseRange;
  
  // Map grade to position within range
  const gradeMultiplier = {
    'A': 0.9,  // High end of range
    'B': 0.7,  // Upper middle
    'C': 0.5,  // Middle of range
    'D': 0.3,  // Lower middle
    'F': 0.1   // Low end of range
  };
  
  const position = gradeMultiplier[grade as keyof typeof gradeMultiplier] || 0.5;
  return range.min + (range.max - range.min) * position;
}

// Function to determine if a business qualifies for premium multipliers
export function qualifiesForPremium(valueDriverScores: Record<string, number>): boolean {
  // Premium qualification criteria (example logic)
  const recurringRevenue = valueDriverScores['Recurring Revenue'] || 0;
  const scalability = valueDriverScores['Scalability'] || 0;
  const financialPerformance = valueDriverScores['Financial Performance'] || 0;
  
  // Require high scores in key areas for premium qualification
  return recurringRevenue >= 4 && scalability >= 4 && financialPerformance >= 4;
}