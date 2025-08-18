// Hierarchical NAICS Database with proper parent-child relationships
export interface HierarchicalNAICS {
  code: string;
  title: string;
  level: number; // 2=sector, 3=subsector, 4=industry_group, 5=industry, 6=national_industry
  parentCode?: string;
  description?: string;
  multiplier?: number;
}

export const hierarchicalNAICS: HierarchicalNAICS[] = [
  // Construction Sector Hierarchy
  { code: "23", title: "Construction", level: 2 },
  
  // 3-digit subsectors
  { code: "236", title: "Construction of Buildings", level: 3, parentCode: "23" },
  { code: "237", title: "Heavy and Civil Engineering Construction", level: 3, parentCode: "23" },
  { code: "238", title: "Specialty Trade Contractors", level: 3, parentCode: "23" },
  
  // 4-digit industry groups for Construction of Buildings (236)
  { code: "2361", title: "Residential Building Construction", level: 4, parentCode: "236" },
  { code: "2362", title: "Nonresidential Building Construction", level: 4, parentCode: "236" },
  
  // 5-digit industries for Residential Building Construction (2361)
  { code: "23611", title: "Residential Building Construction", level: 5, parentCode: "2361" },
  
  // 6-digit national industries for Residential Building Construction (23611)
  { code: "236110", title: "Residential Building Construction", level: 6, parentCode: "23611", multiplier: 3.5 },
  
  // 5-digit industries for Nonresidential Building Construction (2362)
  { code: "23621", title: "Industrial Building Construction", level: 5, parentCode: "2362" },
  { code: "23622", title: "Commercial and Institutional Building Construction", level: 5, parentCode: "2362" },
  
  // 6-digit national industries for Industrial Building Construction (23621)
  { code: "236210", title: "Industrial Building Construction", level: 6, parentCode: "23621", multiplier: 3.2 },
  
  // 6-digit national industries for Commercial and Institutional Building Construction (23622)
  { code: "236220", title: "Commercial and Institutional Building Construction", level: 6, parentCode: "23622", multiplier: 3.4 },
  
  // 4-digit industry groups for Heavy and Civil Engineering Construction (237)
  { code: "2371", title: "Utility System Construction", level: 4, parentCode: "237" },
  { code: "2372", title: "Land Subdivision", level: 4, parentCode: "237" },
  { code: "2373", title: "Highway, Street, and Bridge Construction", level: 4, parentCode: "237" },
  { code: "2379", title: "Other Heavy and Civil Engineering Construction", level: 4, parentCode: "237" },
  
  // 5-digit industries for Utility System Construction (2371)
  { code: "23711", title: "Water and Sewer Line and Related Structures Construction", level: 5, parentCode: "2371" },
  { code: "23712", title: "Oil and Gas Pipeline and Related Structures Construction", level: 5, parentCode: "2371" },
  { code: "23713", title: "Power and Communication Line and Related Structures Construction", level: 5, parentCode: "2371" },
  
  // 6-digit national industries for Utility System Construction
  { code: "237110", title: "Water and Sewer Line and Related Structures Construction", level: 6, parentCode: "23711", multiplier: 3.8 },
  { code: "237120", title: "Oil and Gas Pipeline and Related Structures Construction", level: 6, parentCode: "23712", multiplier: 4.2 },
  { code: "237130", title: "Power and Communication Line and Related Structures Construction", level: 6, parentCode: "23713", multiplier: 3.6 },

  // 5-digit industries for Land Subdivision (2372)
  { code: "23721", title: "Land Subdivision", level: 5, parentCode: "2372" },
  
  // 6-digit national industries for Land Subdivision
  { code: "237210", title: "Land Subdivision", level: 6, parentCode: "23721", multiplier: 3.3 },

  // 5-digit industries for Highway, Street, and Bridge Construction (2373)
  { code: "23731", title: "Highway, Street, and Bridge Construction", level: 5, parentCode: "2373" },
  
  // 6-digit national industries for Highway, Street, and Bridge Construction
  { code: "237310", title: "Highway, Street, and Bridge Construction", level: 6, parentCode: "23731", multiplier: 3.7 },

  // 5-digit industries for Other Heavy and Civil Engineering Construction (2379)
  { code: "23799", title: "Other Heavy and Civil Engineering Construction", level: 5, parentCode: "2379" },
  
  // 6-digit national industries for Other Heavy and Civil Engineering Construction
  { code: "237990", title: "Other Heavy and Civil Engineering Construction", level: 6, parentCode: "23799", multiplier: 3.4 },

  // 4-digit industry groups for Specialty Trade Contractors (238)
  { code: "2381", title: "Foundation, Structure, and Building Exterior Contractors", level: 4, parentCode: "238" },
  { code: "2382", title: "Building Equipment Contractors", level: 4, parentCode: "238" },
  { code: "2383", title: "Building Finishing Contractors", level: 4, parentCode: "238" },
  { code: "2389", title: "Other Specialty Trade Contractors", level: 4, parentCode: "238" },

  // 5-digit industries for Foundation, Structure, and Building Exterior Contractors (2381)
  { code: "23811", title: "Poured Concrete Foundation and Structure Contractors", level: 5, parentCode: "2381" },
  { code: "23812", title: "Structural Steel and Precast Concrete Contractors", level: 5, parentCode: "2381" },
  { code: "23813", title: "Framing Contractors", level: 5, parentCode: "2381" },
  { code: "23814", title: "Masonry Contractors", level: 5, parentCode: "2381" },
  { code: "23815", title: "Glass and Glazing Contractors", level: 5, parentCode: "2381" },
  { code: "23816", title: "Roofing Contractors", level: 5, parentCode: "2381" },
  { code: "23817", title: "Siding Contractors", level: 5, parentCode: "2381" },
  { code: "23819", title: "Other Foundation, Structure, and Building Exterior Contractors", level: 5, parentCode: "2381" },

  // 6-digit national industries for Foundation, Structure, and Building Exterior Contractors
  { code: "238110", title: "Poured Concrete Foundation and Structure Contractors", level: 6, parentCode: "23811", multiplier: 2.9 },
  { code: "238120", title: "Structural Steel and Precast Concrete Contractors", level: 6, parentCode: "23812", multiplier: 3.1 },
  { code: "238130", title: "Framing Contractors", level: 6, parentCode: "23813", multiplier: 2.7 },
  { code: "238140", title: "Masonry Contractors", level: 6, parentCode: "23814", multiplier: 2.8 },
  { code: "238150", title: "Glass and Glazing Contractors", level: 6, parentCode: "23815", multiplier: 3.0 },
  { code: "238160", title: "Roofing Contractors", level: 6, parentCode: "23816", multiplier: 2.6 },
  { code: "238170", title: "Siding Contractors", level: 6, parentCode: "23817", multiplier: 2.5 },
  { code: "238190", title: "Other Foundation, Structure, and Building Exterior Contractors", level: 6, parentCode: "23819", multiplier: 2.8 },
  
  // Agriculture Sector Hierarchy
  { code: "11", title: "Agriculture", level: 2 },
  
  // 3-digit subsectors
  { code: "111", title: "Crop Production", level: 3, parentCode: "11" },
  { code: "112", title: "Animal Production and Aquaculture", level: 3, parentCode: "11" },
  { code: "113", title: "Forestry and Logging", level: 3, parentCode: "11" },
  { code: "114", title: "Fishing, Hunting and Trapping", level: 3, parentCode: "11" },
  { code: "115", title: "Support Activities for Agriculture and Forestry", level: 3, parentCode: "11" },
  
  // 4-digit industry groups for Crop Production (111)
  { code: "1111", title: "Oilseed and Grain Farming", level: 4, parentCode: "111" },
  { code: "1112", title: "Vegetable and Melon Farming", level: 4, parentCode: "111" },
  { code: "1113", title: "Fruit and Tree Nut Farming", level: 4, parentCode: "111" },
  { code: "1114", title: "Greenhouse, Nursery, and Floriculture Production", level: 4, parentCode: "111" },
  { code: "1119", title: "Other Crop Farming", level: 4, parentCode: "111" },
  
  // 5-digit industries for Oilseed and Grain Farming (1111)
  { code: "11111", title: "Soybean Farming", level: 5, parentCode: "1111" },
  { code: "11112", title: "Oilseed (except Soybean) Farming", level: 5, parentCode: "1111" },
  { code: "11113", title: "Dry Pea and Bean Farming", level: 5, parentCode: "1111" },
  { code: "11114", title: "Wheat Farming", level: 5, parentCode: "1111" },
  { code: "11115", title: "Corn Farming", level: 5, parentCode: "1111" },
  { code: "11116", title: "Rice Farming", level: 5, parentCode: "1111" },
  { code: "11119", title: "Other Grain Farming", level: 5, parentCode: "1111" },
  
  // 6-digit national industries for Oilseed and Grain Farming
  { code: "111110", title: "Soybean Farming", level: 6, parentCode: "11111", multiplier: 2.8 },
  { code: "111120", title: "Oilseed (except Soybean) Farming", level: 6, parentCode: "11112", multiplier: 2.6 },
  { code: "111130", title: "Dry Pea and Bean Farming", level: 6, parentCode: "11113", multiplier: 2.4 },
  { code: "111140", title: "Wheat Farming", level: 6, parentCode: "11114", multiplier: 2.2 },
  { code: "111150", title: "Corn Farming", level: 6, parentCode: "11115", multiplier: 2.5 },
  { code: "111160", title: "Rice Farming", level: 6, parentCode: "11116", multiplier: 2.3 },
  { code: "111191", title: "Oilseed and Grain Combination Farming", level: 6, parentCode: "11119", multiplier: 2.4 },
  { code: "111199", title: "All Other Grain Farming", level: 6, parentCode: "11119", multiplier: 2.2 },
  
  // Professional Services Sector Hierarchy
  { code: "54", title: "Professional Services", level: 2 },
  
  // 3-digit subsectors
  { code: "541", title: "Professional, Scientific, and Technical Services", level: 3, parentCode: "54" },
  
  // 4-digit industry groups for Professional, Scientific, and Technical Services (541)
  { code: "5411", title: "Legal Services", level: 4, parentCode: "541" },
  { code: "5412", title: "Accounting, Tax Preparation, Bookkeeping, and Payroll Services", level: 4, parentCode: "541" },
  { code: "5413", title: "Architectural, Engineering, and Related Services", level: 4, parentCode: "541" },
  { code: "5414", title: "Specialized Design Services", level: 4, parentCode: "541" },
  { code: "5415", title: "Computer Systems Design and Related Services", level: 4, parentCode: "541" },
  { code: "5416", title: "Management, Scientific, and Technical Consulting Services", level: 4, parentCode: "541" },
  { code: "5417", title: "Scientific Research and Development Services", level: 4, parentCode: "541" },
  { code: "5418", title: "Advertising, Public Relations, and Related Services", level: 4, parentCode: "541" },
  { code: "5419", title: "Other Professional, Scientific, and Technical Services", level: 4, parentCode: "541" },
  
  // 5-digit industries for Computer Systems Design and Related Services (5415)
  { code: "54151", title: "Computer Systems Design and Related Services", level: 5, parentCode: "5415" },
  
  // 6-digit national industries for Computer Systems Design and Related Services
  { code: "541511", title: "Custom Computer Programming Services", level: 6, parentCode: "54151", multiplier: 4.8 },
  { code: "541512", title: "Computer Systems Design Services", level: 6, parentCode: "54151", multiplier: 5.2 },
  { code: "541513", title: "Computer Facilities Management Services", level: 6, parentCode: "54151", multiplier: 4.6 },
  { code: "541519", title: "Other Computer Related Services", level: 6, parentCode: "54151", multiplier: 4.4 },
  
  // Manufacturing Sector Hierarchy
  { code: "31", title: "Manufacturing", level: 2 },
  
  // 3-digit subsectors
  { code: "311", title: "Food Manufacturing", level: 3, parentCode: "31" },
  { code: "312", title: "Beverage and Tobacco Product Manufacturing", level: 3, parentCode: "31" },
  { code: "313", title: "Textile Mills", level: 3, parentCode: "31" },
  { code: "314", title: "Textile Product Mills", level: 3, parentCode: "31" },
  { code: "315", title: "Apparel Manufacturing", level: 3, parentCode: "31" },
  { code: "316", title: "Leather and Allied Product Manufacturing", level: 3, parentCode: "31" },
  { code: "321", title: "Wood Product Manufacturing", level: 3, parentCode: "31" },
  { code: "322", title: "Paper Manufacturing", level: 3, parentCode: "31" },
  { code: "323", title: "Printing and Related Support Activities", level: 3, parentCode: "31" },
  { code: "324", title: "Petroleum and Coal Products Manufacturing", level: 3, parentCode: "31" },
  { code: "325", title: "Chemical Manufacturing", level: 3, parentCode: "31" },
  { code: "326", title: "Plastics and Rubber Products Manufacturing", level: 3, parentCode: "31" },
  { code: "327", title: "Nonmetallic Mineral Product Manufacturing", level: 3, parentCode: "31" },
  { code: "331", title: "Primary Metal Manufacturing", level: 3, parentCode: "31" },
  { code: "332", title: "Fabricated Metal Product Manufacturing", level: 3, parentCode: "31" },
  { code: "333", title: "Machinery Manufacturing", level: 3, parentCode: "31" },
  { code: "334", title: "Computer and Electronic Product Manufacturing", level: 3, parentCode: "31" },
  { code: "335", title: "Electrical Equipment, Appliance, and Component Manufacturing", level: 3, parentCode: "31" },
  { code: "336", title: "Transportation Equipment Manufacturing", level: 3, parentCode: "31" },
  { code: "337", title: "Furniture and Related Product Manufacturing", level: 3, parentCode: "31" },
  { code: "339", title: "Miscellaneous Manufacturing", level: 3, parentCode: "31" },
  
  // 4-digit industry groups for Food Manufacturing (311)
  { code: "3111", title: "Animal Food Manufacturing", level: 4, parentCode: "311" },
  { code: "3112", title: "Grain and Oilseed Milling", level: 4, parentCode: "311" },
  { code: "3113", title: "Sugar and Confectionery Product Manufacturing", level: 4, parentCode: "311" },
  { code: "3114", title: "Fruit and Vegetable Preserving and Specialty Food Manufacturing", level: 4, parentCode: "311" },
  { code: "3115", title: "Dairy Product Manufacturing", level: 4, parentCode: "311" },
  { code: "3116", title: "Animal Slaughtering and Processing", level: 4, parentCode: "311" },
  { code: "3117", title: "Seafood Product Preparation and Packaging", level: 4, parentCode: "311" },
  { code: "3118", title: "Bakeries and Tortilla Manufacturing", level: 4, parentCode: "311" },
  { code: "3119", title: "Other Food Manufacturing", level: 4, parentCode: "311" },
  
  // 5-digit industries for Bakeries and Tortilla Manufacturing (3118)
  { code: "31181", title: "Bread and Bakery Product Manufacturing", level: 5, parentCode: "3118" },
  { code: "31182", title: "Cookie, Cracker, and Pasta Manufacturing", level: 5, parentCode: "3118" },
  { code: "31183", title: "Tortilla Manufacturing", level: 5, parentCode: "3118" },
  
  // 6-digit national industries for Bakeries and Tortilla Manufacturing
  { code: "311811", title: "Retail Bakeries", level: 6, parentCode: "31181", multiplier: 3.2 },
  { code: "311812", title: "Commercial Bakeries", level: 6, parentCode: "31181", multiplier: 3.8 },
  { code: "311813", title: "Frozen Cakes, Pies, and Other Pastries Manufacturing", level: 6, parentCode: "31181", multiplier: 4.1 },
  { code: "311821", title: "Cookie and Cracker Manufacturing", level: 6, parentCode: "31182", multiplier: 3.9 },
  { code: "311822", title: "Flour Mixes and Dough Manufacturing from Purchased Flour", level: 6, parentCode: "31182", multiplier: 3.6 },
  { code: "311823", title: "Dry Pasta, Dough, and Dumpling Manufacturing", level: 6, parentCode: "31182", multiplier: 3.4 },
  { code: "311830", title: "Tortilla Manufacturing", level: 6, parentCode: "31183", multiplier: 3.1 },
];

export function getSectorCodes(): string[] {
  return hierarchicalNAICS
    .filter(item => item.level === 2)
    .map(item => item.code)
    .sort();
}

export function getSubsectorsBySector(sectorCode: string): HierarchicalNAICS[] {
  return hierarchicalNAICS
    .filter(item => item.level === 3 && item.parentCode === sectorCode)
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function getIndustryGroupsBySubsector(subsectorCode: string): HierarchicalNAICS[] {
  return hierarchicalNAICS
    .filter(item => item.level === 4 && item.parentCode === subsectorCode)
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function getIndustriesByIndustryGroup(industryGroupCode: string): HierarchicalNAICS[] {
  return hierarchicalNAICS
    .filter(item => item.level === 5 && item.parentCode === industryGroupCode)
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function getNationalIndustriesByIndustry(industryCode: string): HierarchicalNAICS[] {
  return hierarchicalNAICS
    .filter(item => item.level === 6 && item.parentCode === industryCode)
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function findNAICSByCode(code: string): HierarchicalNAICS | undefined {
  return hierarchicalNAICS.find(item => item.code === code);
}

export function getChildrenByParentCode(parentCode: string): HierarchicalNAICS[] {
  return hierarchicalNAICS
    .filter(item => item.parentCode === parentCode)
    .sort((a, b) => a.code.localeCompare(b.code));
}