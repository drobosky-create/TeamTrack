// NAICS Industry Code Database with Multipliers
export interface NAICSIndustry {
  code: string;
  title: string;
  sector: string;
  multiplier: number;
  description: string;
  riskFactors: string[];
  keyMetrics: string[];
  parentCode?: string; // For hierarchical structure
  level?: number; // 2-digit, 3-digit, 4-digit, 5-digit, or 6-digit
}

export const naicsDatabase: NAICSIndustry[] = [
  // Agriculture, Forestry, Fishing and Hunting (11)
  // 3-digit level
  {
    code: "111",
    title: "Crop Production",
    sector: "Agriculture",
    multiplier: 2.1,
    description: "Establishments primarily engaged in growing crops, plants, vines, and trees",
    riskFactors: ["Weather dependency", "Commodity price volatility", "Seasonal operations"],
    keyMetrics: ["Acres under cultivation", "Crop yield per acre", "Equipment utilization"],
    level: 3
  },
  // 4-digit level
  {
    code: "1111",
    title: "Oilseed and Grain Farming",
    sector: "Agriculture",
    multiplier: 2.0,
    description: "Establishments primarily engaged in growing oilseed and/or grain crops",
    riskFactors: ["Weather dependency", "Commodity price volatility", "International trade policies"],
    keyMetrics: ["Yield per acre", "Storage capacity", "Forward contract percentages"],
    parentCode: "111",
    level: 4
  },
  {
    code: "1112",
    title: "Vegetable and Melon Farming",
    sector: "Agriculture",
    multiplier: 2.2,
    description: "Establishments primarily engaged in growing vegetables and melons",
    riskFactors: ["Perishability", "Labor availability", "Weather conditions"],
    keyMetrics: ["Production volume", "Quality grades", "Distribution channels"],
    parentCode: "111",
    level: 4
  },
  // 5-digit level
  {
    code: "11111",
    title: "Soybean Farming",
    sector: "Agriculture",
    multiplier: 1.9,
    description: "Establishments primarily engaged in growing soybeans",
    riskFactors: ["Export demand", "Weather patterns", "GMO regulations"],
    keyMetrics: ["Bushels per acre", "Protein content", "Export contracts"],
    parentCode: "1111",
    level: 5
  },
  {
    code: "11112",
    title: "Oilseed (except Soybean) Farming",
    sector: "Agriculture",
    multiplier: 2.1,
    description: "Establishments primarily engaged in growing oilseeds except soybeans",
    riskFactors: ["Market demand", "Processing capacity", "Storage requirements"],
    keyMetrics: ["Oil content", "Processing contracts", "Quality premiums"],
    parentCode: "1111",
    level: 5
  },
  // 6-digit level
  {
    code: "111110",
    title: "Soybean Farming",
    sector: "Agriculture",
    multiplier: 1.9,
    description: "Establishments primarily engaged in growing soybeans",
    riskFactors: ["Export demand", "Weather patterns", "GMO regulations"],
    keyMetrics: ["Bushels per acre", "Protein content", "Export contracts"],
    parentCode: "11111",
    level: 6
  },
  {
    code: "111120",
    title: "Oilseed (except Soybean) Farming",
    sector: "Agriculture",
    multiplier: 2.1,
    description: "Establishments primarily engaged in growing oilseeds except soybeans",
    riskFactors: ["Market demand", "Processing capacity", "Storage requirements"],
    keyMetrics: ["Oil content", "Processing contracts", "Quality premiums"],
    parentCode: "11112",
    level: 6
  },
  {
    code: "111130",
    title: "Dry Pea and Bean Farming",
    sector: "Agriculture",
    multiplier: 2.0,
    description: "Establishments primarily engaged in growing dry peas, beans, and lentils",
    riskFactors: ["Market volatility", "Disease pressure", "International competition"],
    keyMetrics: ["Protein levels", "Test weight", "Export quality"],
    parentCode: "11113",
    level: 6
  },

  // 3-digit level
  {
    code: "112",
    title: "Animal Production and Aquaculture",
    sector: "Agriculture",
    multiplier: 2.3,
    description: "Establishments primarily engaged in raising/breeding animals and aquatic animals",
    riskFactors: ["Disease outbreaks", "Feed cost volatility", "Regulatory compliance"],
    keyMetrics: ["Livestock headcount", "Feed conversion ratios", "Mortality rates"],
    level: 3
  },
  // 4-digit level
  {
    code: "1121",
    title: "Cattle Ranching and Farming",
    sector: "Agriculture",
    multiplier: 2.4,
    description: "Establishments primarily engaged in raising cattle",
    riskFactors: ["Feed costs", "Disease management", "Market price volatility"],
    keyMetrics: ["Head count", "Weight gain", "Calving rates"],
    parentCode: "112",
    level: 4
  },
  {
    code: "1122",
    title: "Hog and Pig Farming",
    sector: "Agriculture",
    multiplier: 2.2,
    description: "Establishments primarily engaged in raising hogs and pigs",
    riskFactors: ["Disease outbreaks", "Feed costs", "Environmental regulations"],
    keyMetrics: ["Litters per sow", "Feed conversion", "Mortality rates"],
    parentCode: "112",
    level: 4
  },
  // 6-digit level examples
  {
    code: "112111",
    title: "Beef Cattle Ranching and Farming",
    sector: "Agriculture",
    multiplier: 2.5,
    description: "Establishments primarily engaged in raising cattle for beef production",
    riskFactors: ["Feed costs", "Weather conditions", "Market price volatility"],
    keyMetrics: ["Average daily gain", "Feed efficiency", "Breeding success"],
    parentCode: "1121",
    level: 6
  },
  {
    code: "112112",
    title: "Cattle Feedlots",
    sector: "Agriculture",
    multiplier: 2.3,
    description: "Establishments primarily engaged in feeding cattle for fattening",
    riskFactors: ["Feed cost volatility", "Disease management", "Environmental compliance"],
    keyMetrics: ["Feed conversion ratios", "Daily weight gain", "Health management"],
    parentCode: "1121",
    level: 6
  },
  
  // Mining, Quarrying, and Oil and Gas Extraction (21)
  {
    code: "211",
    title: "Oil and Gas Extraction",
    sector: "Mining",
    multiplier: 3.8,
    description: "Establishments primarily engaged in operating oil and gas field properties",
    riskFactors: ["Commodity price volatility", "Environmental regulations", "Capital intensity"],
    keyMetrics: ["Production volumes", "Reserves", "Finding and development costs"]
  },
  {
    code: "212",
    title: "Mining (except Oil and Gas)",
    sector: "Mining",  
    multiplier: 3.2,
    description: "Establishments primarily engaged in mining, quarrying, and beneficiating minerals",
    riskFactors: ["Commodity cycles", "Environmental compliance", "Safety regulations"],
    keyMetrics: ["Production tonnage", "Resource reserves", "Recovery rates"]
  },

  // Construction (23)
  {
    code: "236",
    title: "Construction of Buildings",
    sector: "Construction",
    multiplier: 2.8,
    description: "Establishments primarily responsible for the construction of buildings",
    riskFactors: ["Economic cycles", "Material cost fluctuations", "Labor availability"],
    keyMetrics: ["Backlog duration", "Gross margin per project", "Safety incidents"]
  },
  {
    code: "237",
    title: "Heavy and Civil Engineering Construction",
    sector: "Construction",
    multiplier: 3.1,
    description: "Establishments primarily engaged in the construction of engineering projects",
    riskFactors: ["Government funding cycles", "Environmental permits", "Weather delays"],
    keyMetrics: ["Contract backlog", "Equipment utilization", "Project completion rate"]
  },
  {
    code: "238",
    title: "Specialty Trade Contractors",
    sector: "Construction",
    multiplier: 2.5,
    description: "Establishments primarily engaged in specialty trade contractor activities",
    riskFactors: ["General contractor dependency", "Labor shortages", "Seasonal demand"],
    keyMetrics: ["Recurring customer percentage", "Average project size", "Labor productivity"]
  },

  // Manufacturing (31-33)
  {
    code: "311",
    title: "Food Manufacturing",
    sector: "Manufacturing",
    multiplier: 4.2,
    description: "Establishments primarily engaged in transforming livestock and agricultural products into food",
    riskFactors: ["Food safety regulations", "Raw material price volatility", "Consumer preference shifts"],
    keyMetrics: ["Inventory turnover", "Production efficiency", "Quality control metrics"]
  },
  {
    code: "321",
    title: "Wood Product Manufacturing",
    sector: "Manufacturing",
    multiplier: 3.4,
    description: "Establishments primarily engaged in manufacturing wood products",
    riskFactors: ["Housing market cycles", "Raw material availability", "Environmental regulations"],
    keyMetrics: ["Capacity utilization", "Waste reduction", "Product mix optimization"]
  },
  {
    code: "332",
    title: "Fabricated Metal Product Manufacturing",
    sector: "Manufacturing",
    multiplier: 3.7,
    description: "Establishments primarily engaged in transforming metal into intermediate or end products",
    riskFactors: ["Metal price volatility", "Manufacturing capacity", "Trade policy impacts"],
    keyMetrics: ["Order backlog", "Equipment efficiency", "Scrap rates"]
  },
  {
    code: "333",
    title: "Machinery Manufacturing",
    sector: "Manufacturing",
    multiplier: 4.1,
    description: "Establishments primarily engaged in creating end products whose function is to apply mechanical force",
    riskFactors: ["Capital equipment cycles", "Technology obsolescence", "Global competition"],
    keyMetrics: ["R&D investment ratio", "Market share", "Service revenue percentage"]
  },
  {
    code: "334",
    title: "Computer and Electronic Product Manufacturing",
    sector: "Manufacturing",
    multiplier: 5.2,
    description: "Establishments primarily engaged in manufacturing computers, communications equipment, and electronic components",
    riskFactors: ["Rapid technology changes", "Component supply chains", "Market volatility"],
    keyMetrics: ["Product lifecycle management", "Innovation pipeline", "Time to market"]
  },

  // Wholesale Trade (42)
  {
    code: "423",
    title: "Merchant Wholesalers, Durable Goods",
    sector: "Wholesale Trade",
    multiplier: 3.3,
    description: "Establishments primarily engaged in wholesale distribution of durable goods",
    riskFactors: ["Inventory management", "Customer concentration", "Economic cycles"],
    keyMetrics: ["Inventory turns", "Gross margin trends", "Customer retention rate"]
  },
  {
    code: "424",
    title: "Merchant Wholesalers, Nondurable Goods",
    sector: "Wholesale Trade",
    multiplier: 3.1,
    description: "Establishments primarily engaged in wholesale distribution of nondurable goods",
    riskFactors: ["Product perishability", "Price competition", "Supplier relationships"],
    keyMetrics: ["Inventory freshness", "Fill rates", "Supplier diversity"]
  },

  // Retail Trade (44-45)
  {
    code: "441",
    title: "Motor Vehicle and Parts Dealers",
    sector: "Retail Trade",
    multiplier: 2.9,
    description: "Establishments primarily engaged in retailing new and used motor vehicles",
    riskFactors: ["Consumer financing availability", "Manufacturer relationships", "Economic sensitivity"],
    keyMetrics: ["Inventory days supply", "Service department profitability", "Customer satisfaction scores"]
  },
  {
    code: "445",
    title: "Food and Beverage Stores",
    sector: "Retail Trade",
    multiplier: 2.4,
    description: "Establishments primarily engaged in retailing food and beverages from fixed point-of-sale locations",
    riskFactors: ["Perishable inventory", "Competition intensity", "Location dependency"],
    keyMetrics: ["Same-store sales growth", "Gross margin per category", "Inventory shrinkage"]
  },
  {
    code: "448",
    title: "Clothing and Clothing Accessories Stores",
    sector: "Retail Trade",
    multiplier: 2.6,
    description: "Establishments primarily engaged in retailing new clothing and clothing accessories",
    riskFactors: ["Fashion trends", "Seasonal demand", "Online competition"],
    keyMetrics: ["Inventory turn rates", "Markdown percentage", "Customer acquisition cost"]
  },

  // Transportation and Warehousing (48-49)
  {
    code: "484",
    title: "Truck Transportation",
    sector: "Transportation",
    multiplier: 2.7,
    description: "Establishments primarily engaged in providing over-the-road transportation of cargo",
    riskFactors: ["Fuel price volatility", "Driver shortage", "Regulatory compliance"],
    keyMetrics: ["Fleet utilization", "Miles per gallon", "On-time delivery rate"]
  },
  {
    code: "493",
    title: "Warehousing and Storage",
    sector: "Transportation",
    multiplier: 4.1,
    description: "Establishments primarily engaged in operating warehousing and storage facilities",
    riskFactors: ["Real estate values", "Technology obsolescence", "Contract renewals"],
    keyMetrics: ["Occupancy rates", "Revenue per square foot", "Operating cost ratios"]
  },

  // Information (51)
  {
    code: "511",
    title: "Publishing Industries",
    sector: "Information",
    multiplier: 4.3,
    description: "Establishments primarily engaged in publishing newspapers, magazines, books, and software",
    riskFactors: ["Digital transformation", "Content creation costs", "Distribution changes"],
    keyMetrics: ["Subscription retention", "Digital revenue percentage", "Content engagement"]
  },
  {
    code: "518",
    title: "Data Processing, Hosting, and Related Services",
    sector: "Information",
    multiplier: 6.1,
    description: "Establishments primarily engaged in providing infrastructure for hosting or data processing services",
    riskFactors: ["Technology obsolescence", "Security breaches", "Competition intensity"],
    keyMetrics: ["Uptime percentage", "Customer churn rate", "Revenue per user"]
  },

  // Finance and Insurance (52)
  {
    code: "522",
    title: "Credit Intermediation and Related Activities",
    sector: "Finance and Insurance",
    multiplier: 4.8,
    description: "Establishments primarily engaged in lending funds raised from depositors",
    riskFactors: ["Interest rate changes", "Credit losses", "Regulatory compliance"],
    keyMetrics: ["Net interest margin", "Loan loss provisions", "Capital adequacy ratios"]
  },
  {
    code: "524",
    title: "Insurance Carriers and Related Activities",
    sector: "Finance and Insurance",
    multiplier: 5.2,
    description: "Establishments primarily engaged in underwriting insurance and annuities",
    riskFactors: ["Catastrophic events", "Investment performance", "Regulatory changes"],
    keyMetrics: ["Loss ratios", "Combined ratios", "Premium growth rates"]
  },

  // Real Estate and Rental and Leasing (53)
  {
    code: "531",
    title: "Real Estate",
    sector: "Real Estate",
    multiplier: 3.6,
    description: "Establishments primarily engaged in renting or leasing real estate to others",
    riskFactors: ["Interest rate sensitivity", "Market cycles", "Property maintenance"],
    keyMetrics: ["Occupancy rates", "Rent growth", "Net operating income"]
  },

  // Professional, Scientific, and Technical Services (54)
  {
    code: "541",
    title: "Professional, Scientific, and Technical Services",
    sector: "Professional Services",
    multiplier: 4.7,
    description: "Establishments primarily engaged in performing professional, scientific, and technical activities",
    riskFactors: ["Talent retention", "Client concentration", "Economic sensitivity"],
    keyMetrics: ["Utilization rates", "Average billing rates", "Client retention"]
  },

  // Management of Companies and Enterprises (55)
  {
    code: "551",
    title: "Management of Companies and Enterprises",
    sector: "Management",
    multiplier: 5.8,
    description: "Establishments primarily engaged in holding securities of other companies",
    riskFactors: ["Portfolio performance", "Market conditions", "Regulatory oversight"],
    keyMetrics: ["Return on investments", "Portfolio diversification", "Management fees"]
  },

  // Administrative and Support Services (56)
  {
    code: "561",
    title: "Administrative and Support Services",
    sector: "Administrative Services",
    multiplier: 3.2,
    description: "Establishments primarily engaged in providing administrative and support services",
    riskFactors: ["Labor cost inflation", "Client relationships", "Service quality"],
    keyMetrics: ["Employee turnover", "Client satisfaction", "Operating margins"]
  },

  // Educational Services (61)
  {
    code: "611",
    title: "Educational Services",
    sector: "Education",
    multiplier: 2.8,
    description: "Establishments primarily engaged in providing instruction and training",
    riskFactors: ["Enrollment trends", "Funding changes", "Regulatory compliance"],
    keyMetrics: ["Student retention rates", "Graduate placement rates", "Cost per student"]
  },

  // Health Care and Social Assistance (62)
  {
    code: "621",
    title: "Ambulatory Health Care Services",
    sector: "Healthcare",
    multiplier: 4.4,
    description: "Establishments primarily engaged in providing health care services directly to outpatients",
    riskFactors: ["Reimbursement changes", "Regulatory compliance", "Staff shortages"],
    keyMetrics: ["Patient volume", "Payer mix", "Operating margins"]
  },
  {
    code: "622",
    title: "Hospitals",
    sector: "Healthcare",
    multiplier: 3.9,
    description: "Establishments primarily engaged in providing medical, diagnostic, and treatment services",
    riskFactors: ["Medicare/Medicaid reimbursement", "Staffing costs", "Capital requirements"],
    keyMetrics: ["Occupancy rates", "Average length of stay", "Case mix index"]
  },
  {
    code: "623",
    title: "Nursing and Residential Care Facilities",
    sector: "Healthcare",
    multiplier: 3.1,
    description: "Establishments primarily engaged in providing residential care combined with nursing services",
    riskFactors: ["Regulatory oversight", "Labor shortages", "Reimbursement rates"],
    keyMetrics: ["Occupancy rates", "Staff-to-resident ratios", "Quality metrics"]
  },

  // Arts, Entertainment, and Recreation (71)
  {
    code: "711",
    title: "Performing Arts, Spectator Sports, and Related Industries",
    sector: "Entertainment",
    multiplier: 3.3,
    description: "Establishments primarily engaged in producing, promoting, or participating in live performances",
    riskFactors: ["Attendance variability", "Talent costs", "Venue availability"],
    keyMetrics: ["Attendance rates", "Revenue per event", "Season ticket sales"]
  },
  {
    code: "713",
    title: "Amusement, Gambling, and Recreation Industries",
    sector: "Entertainment",
    multiplier: 2.9,
    description: "Establishments primarily engaged in operating amusement and recreation facilities",
    riskFactors: ["Weather dependency", "Seasonal operations", "Safety regulations"],
    keyMetrics: ["Visitor counts", "Revenue per visitor", "Capacity utilization"]
  },

  // Accommodation and Food Services (72)
  {
    code: "721",
    title: "Accommodation",
    sector: "Hospitality",
    multiplier: 2.6,
    description: "Establishments primarily engaged in providing lodging or short-term accommodations",
    riskFactors: ["Travel patterns", "Economic cycles", "Online competition"],
    keyMetrics: ["Occupancy rates", "Average daily rate", "Revenue per available room"]
  },
  {
    code: "722",
    title: "Food Services and Drinking Places",
    sector: "Hospitality",
    multiplier: 2.2,
    description: "Establishments primarily engaged in preparing meals, snacks, and beverages for immediate consumption",
    riskFactors: ["Labor costs", "Food cost volatility", "Consumer preferences"],
    keyMetrics: ["Same-store sales", "Food cost percentage", "Labor cost percentage"]
  },

  // Other Services (81)
  {
    code: "811",
    title: "Repair and Maintenance",
    sector: "Services",
    multiplier: 2.8,
    description: "Establishments primarily engaged in repairing and maintaining goods",
    riskFactors: ["Technology changes", "Parts availability", "Skill requirements"],
    keyMetrics: ["First-time fix rate", "Technician productivity", "Customer satisfaction"]
  },
  {
    code: "812",
    title: "Personal and Laundry Services",
    sector: "Services",
    multiplier: 2.4,
    description: "Establishments primarily engaged in providing personal and laundry services to individuals",
    riskFactors: ["Consumer spending", "Labor availability", "Location dependency"],
    keyMetrics: ["Customer frequency", "Service utilization", "Operating efficiency"]
  }
];

export function findNAICSByCode(code: string): NAICSIndustry | undefined {
  return naicsDatabase.find(industry => industry.code === code);
}

export function searchNAICSByTitle(searchTerm: string): NAICSIndustry[] {
  const term = searchTerm.toLowerCase();
  return naicsDatabase.filter(industry => 
    industry.title.toLowerCase().includes(term) ||
    industry.description.toLowerCase().includes(term) ||
    industry.sector.toLowerCase().includes(term)
  );
}

export function getNAICSBySector(sector: string): NAICSIndustry[] {
  return naicsDatabase.filter(industry => industry.sector === sector);
}

export function getAllSectors(): string[] {
  const sectors = naicsDatabase.map(industry => industry.sector);
  return Array.from(new Set(sectors)).sort();
}

export function getNAICSByParentCode(parentCode: string): NAICSIndustry[] {
  return naicsDatabase.filter(industry => industry.parentCode === parentCode);
}

export function getNAICSByLevel(level: number): NAICSIndustry[] {
  return naicsDatabase.filter(industry => industry.level === level);
}