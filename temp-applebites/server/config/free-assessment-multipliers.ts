// EBITDA Multipliers by Industry Sector (U.S. Private Deals)
// Data compiled from IBBA Market Pulse, DealStats, PitchBook, and ValueBuilder
// Based on private equity and M&A transactions in the last 12 months

export interface EBITDAMultiplierRange {
  naicsCode: string;
  sector: string;
  lowMultiple: number;
  averageMultiple: number;
  highMultiple: number;
  notes?: string;
}

export const ebitdaMultipliers: EBITDAMultiplierRange[] = [
  {
    naicsCode: "11",
    sector: "Agriculture, Forestry, Fishing & Hunting",
    lowMultiple: 3,
    averageMultiple: 6,
    highMultiple: 8,
    notes: "Varies with land/assets"
  },
  {
    naicsCode: "21",
    sector: "Mining, Quarrying, & Oil/Gas Extraction",
    lowMultiple: 4,
    averageMultiple: 8,
    highMultiple: 10,
    notes: "Often higher for energy resources"
  },
  {
    naicsCode: "22",
    sector: "Utilities",
    lowMultiple: 7,
    averageMultiple: 9,
    highMultiple: 10,
    notes: "High stable cash flows"
  },
  {
    naicsCode: "23",
    sector: "Construction",
    lowMultiple: 3,
    averageMultiple: 4,
    highMultiple: 6,
    notes: "Infrastructure & contracting"
  },
  {
    naicsCode: "31-33",
    sector: "Manufacturing",
    lowMultiple: 3.2,
    averageMultiple: 5.4,
    highMultiple: 10.4,
    notes: "Diverse products"
  },
  {
    naicsCode: "42",
    sector: "Wholesale Trade",
    lowMultiple: 3,
    averageMultiple: 5,
    highMultiple: 10,
    notes: "Distribution businesses"
  },
  {
    naicsCode: "44-45",
    sector: "Retail Trade",
    lowMultiple: 2,
    averageMultiple: 4,
    highMultiple: 7,
    notes: "Mainly consumer products"
  },
  {
    naicsCode: "48-49",
    sector: "Transportation & Warehousing",
    lowMultiple: 3,
    averageMultiple: 4,
    highMultiple: 7,
    notes: "Trucking, logistics"
  },
  {
    naicsCode: "51",
    sector: "Information (Media/Tech)",
    lowMultiple: 6,
    averageMultiple: 9,
    highMultiple: 15,
    notes: "Software & media have highest multiples"
  },
  {
    naicsCode: "52",
    sector: "Finance & Insurance",
    lowMultiple: 4,
    averageMultiple: 8,
    highMultiple: 12,
    notes: "Financial services businesses"
  },
  {
    naicsCode: "53",
    sector: "Real Estate & Rental/Leasing",
    lowMultiple: 3,
    averageMultiple: 5,
    highMultiple: 7,
    notes: "Property management ~3x median"
  },
  {
    naicsCode: "54",
    sector: "Professional, Scientific & Technical",
    lowMultiple: 4,
    averageMultiple: 6,
    highMultiple: 9,
    notes: "Accounting/engineering ~6x avg"
  },
  {
    naicsCode: "56",
    sector: "Administrative & Support; Waste Mgmt",
    lowMultiple: 3,
    averageMultiple: 5,
    highMultiple: 8,
    notes: "B2B services, facilities, staffing"
  },
  {
    naicsCode: "61",
    sector: "Educational Services",
    lowMultiple: 2,
    averageMultiple: 4,
    highMultiple: 6,
    notes: "Training, schools - often low"
  },
  {
    naicsCode: "62",
    sector: "Health Care & Social Assistance",
    lowMultiple: 3,
    averageMultiple: 6,
    highMultiple: 10,
    notes: "Healthcare services"
  },
  {
    naicsCode: "71",
    sector: "Arts, Entertainment & Recreation",
    lowMultiple: 2,
    averageMultiple: 4,
    highMultiple: 6,
    notes: "Gyms, venues, etc."
  },
  {
    naicsCode: "72",
    sector: "Accommodation & Food Services",
    lowMultiple: 2,
    averageMultiple: 3,
    highMultiple: 5,
    notes: "Restaurants & hospitality"
  },
  {
    naicsCode: "81",
    sector: "Other Services (except Public Admin)",
    lowMultiple: 2,
    averageMultiple: 3,
    highMultiple: 5,
    notes: "Misc. personal & repair services"
  }
];

export function getEBITDAMultiplierByNAICS(naicsCode: string): EBITDAMultiplierRange | undefined {
  return ebitdaMultipliers.find(multiplier => multiplier.naicsCode === naicsCode);
}

export function getEBITDAMultiplierBySector(sector: string): EBITDAMultiplierRange | undefined {
  return ebitdaMultipliers.find(multiplier => 
    multiplier.sector.toLowerCase().includes(sector.toLowerCase()) ||
    sector.toLowerCase().includes(multiplier.sector.toLowerCase())
  );
}

// Overall market median EBITDA multiple is around 4x across all industries
export const MARKET_MEDIAN_EBITDA_MULTIPLE = 4;

// Notes from the research:
// - Technology/Information businesses often average high single to low double-digit EBITDA multiples
// - Small consumer-facing businesses like restaurants tend to trade at much lower multiples (2-3x)
// - Financial services companies can fetch above-average multiples (high single digits, up to ~12x)
// - Actual deal multiples depend on company-specific factors: growth prospects, profitability, size, deal structure