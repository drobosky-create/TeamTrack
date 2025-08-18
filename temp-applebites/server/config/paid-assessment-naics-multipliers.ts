// Comprehensive NAICS 6-digit multiplier database based on U.S. private company valuation data
// Source: EBITDA Multiples by 6-Digit NAICS Code (U.S. Private Companies)

export interface ComprehensiveNAICSMultiplier {
  code: string;
  label: string;
  sectorCode: string;
  minMultiplier: number;
  maxMultiplier: number;
  avgMultiplier: number;
}

export const comprehensiveNAICSMultipliers: ComprehensiveNAICSMultiplier[] = [
  // NAICS 11: Agriculture, Forestry, Fishing and Hunting
  { code: "111110", label: "Soybean Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111120", label: "Oilseed (except Soybean) Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111130", label: "Dry Pea and Bean Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111140", label: "Wheat Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111150", label: "Corn Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111160", label: "Rice Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111191", label: "Oilseed and Grain Combination Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111199", label: "All Other Grain Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111211", label: "Potato Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111219", label: "Other Vegetable & Melon Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111310", label: "Orange Groves", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111320", label: "Citrus (except Orange) Groves", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111331", label: "Apple Orchards", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111332", label: "Grape Vineyards", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111333", label: "Strawberry Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111334", label: "Berry (except Strawberry) Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111335", label: "Tree Nut Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111336", label: "Fruit & Tree Nut Combination Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111339", label: "Other Noncitrus Fruit Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111411", label: "Mushroom Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111419", label: "Other Food Crops Grown Under Cover", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111421", label: "Nursery and Tree Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111422", label: "Floriculture Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111910", label: "Tobacco Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111920", label: "Cotton Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111930", label: "Sugarcane Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111940", label: "Hay Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111991", label: "Sugar Beet Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111992", label: "Peanut Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "111998", label: "All Other Misc. Crop Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112111", label: "Beef Cattle Ranching & Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112112", label: "Cattle Feedlots", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112120", label: "Dairy Cattle and Milk Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112130", label: "Dual-Purpose Cattle Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112210", label: "Hog and Pig Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112310", label: "Chicken Egg Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112320", label: "Broilers and Other Meat Chicken Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112330", label: "Turkey Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112340", label: "Poultry Hatcheries", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112390", label: "Other Poultry Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112410", label: "Sheep Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112420", label: "Goat Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112511", label: "Finfish Farming and Fish Hatcheries", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112512", label: "Shellfish Farming", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112519", label: "Other Aquaculture", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112910", label: "Apiculture (Beekeeping)", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112920", label: "Horses and Other Equine Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112930", label: "Fur-Bearing Animal and Rabbit Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "112990", label: "All Other Animal Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "113110", label: "Timber Tract Operations", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "113210", label: "Forest Nurseries and Gathering Forest Products", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "113310", label: "Logging", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "114111", label: "Finfish Fishing", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "114112", label: "Shellfish Fishing", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "114119", label: "Other Marine Fishing", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "114210", label: "Hunting and Trapping", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115111", label: "Cotton Ginning", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115112", label: "Soil Preparation, Planting, Cultivating", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115113", label: "Crop Harvesting, Primarily by Machine", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115114", label: "Postharvest Crop Activities (exc. Cotton Ginning)", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115115", label: "Farm Labor Contractors and Crew Leaders", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115116", label: "Farm Management Services", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115210", label: "Support Activities for Animal Production", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "115310", label: "Support Activities for Forestry", sectorCode: "11", minMultiplier: 3.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },

  // NAICS 21: Mining, Quarrying, and Oil & Gas Extraction
  { code: "211120", label: "Crude Petroleum Extraction", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "211130", label: "Natural Gas Extraction", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212114", label: "Surface Coal Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212115", label: "Underground Coal Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212210", label: "Iron Ore Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212220", label: "Gold & Silver Ore Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212230", label: "Copper, Nickel, Lead & Zinc Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212290", label: "Other Metal Ore Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212311", label: "Dimension Stone Mining & Quarrying", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212312", label: "Crushed & Broken Limestone Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212313", label: "Crushed & Broken Granite Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212319", label: "Other Crushed & Broken Stone Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212321", label: "Construction Sand & Gravel Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212322", label: "Industrial Sand Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212323", label: "Kaolin, Clay, Refractory Minerals Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "212390", label: "Other Nonmetallic Mineral Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "213111", label: "Drilling Oil and Gas Wells (Support)", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "213112", label: "Support Activities for Oil & Gas Operations", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "213113", label: "Support Activities for Coal Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "213114", label: "Support Activities for Metal Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },
  { code: "213115", label: "Support Activities for Nonmetallic Mining", sectorCode: "21", minMultiplier: 4.0, avgMultiplier: 8.0, maxMultiplier: 10.0 },

  // NAICS 22: Utilities
  { code: "221111", label: "Hydroelectric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221112", label: "Fossil Fuel Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221113", label: "Nuclear Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221114", label: "Solar Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221115", label: "Wind Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221116", label: "Geothermal Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221117", label: "Biomass Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221118", label: "Other Electric Power Generation", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221121", label: "Electric Bulk Power Transmission & Control", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221122", label: "Electric Power Distribution", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221210", label: "Natural Gas Distribution", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221310", label: "Water Supply and Irrigation Systems", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221320", label: "Sewage Treatment Facilities", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },
  { code: "221330", label: "Steam and Air-Conditioning Supply", sectorCode: "22", minMultiplier: 7.0, avgMultiplier: 9.0, maxMultiplier: 10.0 },

  // NAICS 23: Construction  
  { code: "236115", label: "New Single-Family Housing Construction (non-Builder)", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "236116", label: "New Multifamily Housing Construction (non-Builder)", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "236117", label: "New Housing For-Sale Builders", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "236118", label: "Residential Remodelers", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "236210", label: "Industrial Building Construction", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "236220", label: "Commercial and Institutional Building Construction", sectorCode: "23", minMultiplier: 6.5, avgMultiplier: 9.0, maxMultiplier: 11.5 },
  { code: "237110", label: "Water and Sewer Line Construction", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "237120", label: "Oil and Gas Pipeline Construction", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "237130", label: "Power and Communication Line Construction", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "237210", label: "Land Subdivision", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "237310", label: "Highway, Street, and Bridge Construction", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "237990", label: "Other Heavy and Civil Engineering Construction", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238110", label: "Poured Concrete Foundation Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238120", label: "Structural Steel & Precast Concrete Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238130", label: "Framing Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238140", label: "Masonry Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238150", label: "Glass and Glazing Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238160", label: "Roofing Contractors", sectorCode: "23", minMultiplier: 5.9, avgMultiplier: 7.15, maxMultiplier: 11.0 },
  { code: "238170", label: "Siding Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238190", label: "Other Foundation/Exterior Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238210", label: "Electrical Contractors and Other Wiring Installation Contractors", sectorCode: "23", minMultiplier: 6.1, avgMultiplier: 7.4, maxMultiplier: 11.5 },
  { code: "238220", label: "Plumbing, Heating, and Air-Conditioning Contractors", sectorCode: "23", minMultiplier: 6.0, avgMultiplier: 7.25, maxMultiplier: 11.0 },
  { code: "238290", label: "Other Building Equipment Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238310", label: "Drywall and Insulation Contractors", sectorCode: "23", minMultiplier: 5.5, avgMultiplier: 6.5, maxMultiplier: 9.8 },
  { code: "238320", label: "Painting and Wall Covering Contractors", sectorCode: "23", minMultiplier: 5.0, avgMultiplier: 5.75, maxMultiplier: 8.5 },
  { code: "238330", label: "Flooring Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238340", label: "Tile and Terrazzo Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238350", label: "Finish Carpentry Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238390", label: "Other Building Finishing Contractors", sectorCode: "23", minMultiplier: 3.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "238910", label: "Site Preparation Contractors", sectorCode: "23", minMultiplier: 5.8, avgMultiplier: 6.9, maxMultiplier: 10.2 },

  // NAICS 31-33: Manufacturing (Representative Industries)
  { code: "311111", label: "Dog and Cat Food Manufacturing", sectorCode: "31", minMultiplier: 4.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "311211", label: "Flour Milling", sectorCode: "31", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "311411", label: "Frozen Fruit, Juice, and Vegetable Manufacturing", sectorCode: "31", minMultiplier: 4.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "311811", label: "Retail Bakeries", sectorCode: "31", minMultiplier: 4.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "312111", label: "Soft Drink Manufacturing", sectorCode: "31", minMultiplier: 5.0, avgMultiplier: 7.0, maxMultiplier: 9.0 },

  // NAICS 42: Wholesale Trade
  { code: "421110", label: "Automobile and Light Duty Motor Vehicle Merchant Wholesalers", sectorCode: "42", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },
  { code: "421120", label: "Motor Vehicle Supplies and New Parts Merchant Wholesalers", sectorCode: "42", minMultiplier: 2.5, avgMultiplier: 4.0, maxMultiplier: 5.5 },
  { code: "421210", label: "Furniture Merchant Wholesalers", sectorCode: "42", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },
  { code: "421610", label: "Electrical Apparatus and Equipment, Wiring Supplies, and Related Equipment Merchant Wholesalers", sectorCode: "42", minMultiplier: 2.5, avgMultiplier: 4.0, maxMultiplier: 5.5 },
  { code: "421910", label: "Sporting and Recreational Goods and Supplies Merchant Wholesalers", sectorCode: "42", minMultiplier: 2.5, avgMultiplier: 4.0, maxMultiplier: 5.5 },

  // NAICS 44-45: Retail Trade
  { code: "441110", label: "New Car Dealers", sectorCode: "44", minMultiplier: 1.5, avgMultiplier: 2.5, maxMultiplier: 3.5 },
  { code: "441310", label: "Automotive Parts and Accessories Stores", sectorCode: "44", minMultiplier: 2.0, avgMultiplier: 3.0, maxMultiplier: 4.0 },
  { code: "442110", label: "Furniture Stores", sectorCode: "44", minMultiplier: 2.0, avgMultiplier: 3.0, maxMultiplier: 4.0 },
  { code: "444110", label: "Home Centers", sectorCode: "44", minMultiplier: 2.0, avgMultiplier: 3.0, maxMultiplier: 4.0 },
  { code: "445110", label: "Supermarkets and Other Grocery (except Convenience) Stores", sectorCode: "44", minMultiplier: 1.5, avgMultiplier: 2.5, maxMultiplier: 3.5 },

  // NAICS 48-49: Transportation and Warehousing
  { code: "481111", label: "Scheduled Passenger Air Transportation", sectorCode: "48", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "484110", label: "General Freight Trucking, Local", sectorCode: "48", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },
  { code: "484121", label: "General Freight Trucking, Long-Distance, Truckload", sectorCode: "48", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },
  { code: "492110", label: "Couriers and Express Delivery Services", sectorCode: "48", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "493110", label: "General Warehousing and Storage", sectorCode: "48", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },

  // NAICS 51: Information
  { code: "511110", label: "Newspaper Publishers", sectorCode: "51", minMultiplier: 2.0, avgMultiplier: 4.0, maxMultiplier: 6.0 },
  { code: "511210", label: "Software Publishers", sectorCode: "51", minMultiplier: 5.0, avgMultiplier: 8.0, maxMultiplier: 12.0 },
  { code: "512110", label: "Motion Picture and Video Production", sectorCode: "51", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "517110", label: "Wired Telecommunications Carriers", sectorCode: "51", minMultiplier: 4.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "518210", label: "Data Processing, Hosting, and Related Services", sectorCode: "51", minMultiplier: 4.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },

  // NAICS 52: Finance and Insurance
  { code: "522110", label: "Commercial Banking", sectorCode: "52", minMultiplier: 4.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "523110", label: "Investment Banking and Securities Dealing", sectorCode: "52", minMultiplier: 5.0, avgMultiplier: 8.0, maxMultiplier: 12.0 },
  { code: "523120", label: "Securities Brokerage", sectorCode: "52", minMultiplier: 4.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "524113", label: "Direct Life Insurance Carriers", sectorCode: "52", minMultiplier: 4.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "525110", label: "Pension Funds", sectorCode: "52", minMultiplier: 4.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },

  // NAICS 53: Real Estate and Rental and Leasing
  { code: "531110", label: "Lessors of Residential Buildings and Dwellings", sectorCode: "53", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "531210", label: "Offices of Real Estate Agents and Brokers", sectorCode: "53", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },
  { code: "532111", label: "Passenger Car Rental", sectorCode: "53", minMultiplier: 2.5, avgMultiplier: 4.0, maxMultiplier: 5.5 },
  { code: "532310", label: "General Rental Centers", sectorCode: "53", minMultiplier: 2.5, avgMultiplier: 4.0, maxMultiplier: 5.5 },
  { code: "533110", label: "Lessors of Nonfinancial Intangible Assets (except Copyrighted Works)", sectorCode: "53", minMultiplier: 4.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },

  // NAICS 54: Professional, Scientific, and Technical Services
  { code: "541110", label: "Offices of Lawyers", sectorCode: "54", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "541211", label: "Offices of Certified Public Accountants", sectorCode: "54", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "541330", label: "Engineering Services", sectorCode: "54", minMultiplier: 3.5, avgMultiplier: 5.5, maxMultiplier: 7.5 },
  { code: "541511", label: "Custom Computer Programming Services", sectorCode: "54", minMultiplier: 4.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "541611", label: "Administrative Management and General Management Consulting Services", sectorCode: "54", minMultiplier: 3.5, avgMultiplier: 5.5, maxMultiplier: 7.5 },

  // NAICS 55: Management of Companies and Enterprises
  { code: "551111", label: "Offices of Bank Holding Companies", sectorCode: "55", minMultiplier: 4.0, avgMultiplier: 6.0, maxMultiplier: 8.0 },
  { code: "551114", label: "Corporate, Subsidiary, and Regional Managing Offices", sectorCode: "55", minMultiplier: 3.5, avgMultiplier: 5.5, maxMultiplier: 7.5 },

  // NAICS 56: Administrative and Support and Waste Management and Remediation Services
  { code: "561110", label: "Office Administrative Services", sectorCode: "56", minMultiplier: 2.5, avgMultiplier: 4.0, maxMultiplier: 5.5 },
  { code: "561311", label: "Employment Placement Agencies", sectorCode: "56", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "561720", label: "Janitorial Services", sectorCode: "56", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },
  { code: "561730", label: "Landscaping Services", sectorCode: "56", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },
  { code: "562111", label: "Solid Waste Collection", sectorCode: "56", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },

  // NAICS 61: Educational Services
  { code: "611110", label: "Elementary and Secondary Schools", sectorCode: "61", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },
  { code: "611310", label: "Colleges, Universities, and Professional Schools", sectorCode: "61", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "611420", label: "Computer Training", sectorCode: "61", minMultiplier: 2.5, avgMultiplier: 4.0, maxMultiplier: 5.5 },
  { code: "611691", label: "Exam Preparation and Tutoring", sectorCode: "61", minMultiplier: 2.5, avgMultiplier: 4.0, maxMultiplier: 5.5 },
  { code: "611710", label: "Educational Support Services", sectorCode: "61", minMultiplier: 2.5, avgMultiplier: 4.0, maxMultiplier: 5.5 },

  // NAICS 62: Health Care and Social Assistance
  { code: "621111", label: "Offices of Physicians (except Mental Health Specialists)", sectorCode: "62", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "621210", label: "Offices of Dentists", sectorCode: "62", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "621511", label: "Medical Laboratories", sectorCode: "62", minMultiplier: 3.5, avgMultiplier: 5.5, maxMultiplier: 7.5 },
  { code: "622110", label: "General Medical and Surgical Hospitals", sectorCode: "62", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "623110", label: "Nursing Care Facilities (Skilled Nursing Facilities)", sectorCode: "62", minMultiplier: 2.5, avgMultiplier: 4.0, maxMultiplier: 5.5 },

  // NAICS 71: Arts, Entertainment, and Recreation
  { code: "711110", label: "Theater Companies and Dinner Theaters", sectorCode: "71", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },
  { code: "711211", label: "Sports Teams and Clubs", sectorCode: "71", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "713110", label: "Amusement and Theme Parks", sectorCode: "71", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "713210", label: "Casinos (except Casino Hotels)", sectorCode: "71", minMultiplier: 3.0, avgMultiplier: 5.0, maxMultiplier: 7.0 },
  { code: "713910", label: "Golf Courses and Country Clubs", sectorCode: "71", minMultiplier: 2.5, avgMultiplier: 4.0, maxMultiplier: 5.5 },

  // NAICS 72: Accommodation and Food Services
  { code: "721110", label: "Hotels (except Casino Hotels) and Motels", sectorCode: "72", minMultiplier: 2.5, avgMultiplier: 4.0, maxMultiplier: 5.5 },
  { code: "722110", label: "Full-Service Restaurants", sectorCode: "72", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },
  { code: "722211", label: "Limited-Service Restaurants", sectorCode: "72", minMultiplier: 2.5, avgMultiplier: 4.0, maxMultiplier: 5.5 },
  { code: "722320", label: "Caterers", sectorCode: "72", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },
  { code: "722410", label: "Drinking Places (Alcoholic Beverages)", sectorCode: "72", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },

  // NAICS 81: Other Services (except Public Administration)
  { code: "811111", label: "General Automotive Repair", sectorCode: "81", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },
  { code: "812111", label: "Barber Shops", sectorCode: "81", minMultiplier: 1.5, avgMultiplier: 2.5, maxMultiplier: 3.5 },
  { code: "812112", label: "Beauty Salons", sectorCode: "81", minMultiplier: 1.5, avgMultiplier: 2.5, maxMultiplier: 3.5 },
  { code: "812210", label: "Funeral Homes and Funeral Services", sectorCode: "81", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },
  { code: "812910", label: "Pet Care (except Veterinary) Services", sectorCode: "81", minMultiplier: 2.0, avgMultiplier: 3.5, maxMultiplier: 5.0 },

  // NAICS 92: Public Administration
  { code: "921110", label: "Executive Offices", sectorCode: "92", minMultiplier: 1.0, avgMultiplier: 2.0, maxMultiplier: 3.0 },
  { code: "922110", label: "Courts", sectorCode: "92", minMultiplier: 1.0, avgMultiplier: 2.0, maxMultiplier: 3.0 },
  { code: "923110", label: "Administration of Education Programs", sectorCode: "92", minMultiplier: 1.0, avgMultiplier: 2.0, maxMultiplier: 3.0 },
  { code: "924110", label: "Administration of Air and Water Resource and Solid Waste Management Programs", sectorCode: "92", minMultiplier: 1.0, avgMultiplier: 2.0, maxMultiplier: 3.0 }
];

// Helper functions for the comprehensive database
export function getComprehensiveNAICSByCode(code: string): ComprehensiveNAICSMultiplier | null {
  return comprehensiveNAICSMultipliers.find(item => item.code === code) || null;
}

export function getComprehensiveNAICsBySector(sectorCode: string): ComprehensiveNAICSMultiplier[] {
  return comprehensiveNAICSMultipliers.filter(item => item.sectorCode === sectorCode);
}

// Get all unique sectors with titles from comprehensive database
export function getComprehensiveSectors() {
  const sectorMap = new Map<string, string>();
  
  // NAICS 2-digit sector titles
  const sectorTitles: { [key: string]: string } = {
    "11": "Agriculture, Forestry, Fishing and Hunting",
    "21": "Mining, Quarrying, and Oil and Gas Extraction", 
    "22": "Utilities",
    "23": "Construction",
    "31": "Manufacturing",
    "32": "Manufacturing", // Combined with 31
    "33": "Manufacturing", // Combined with 31
    "42": "Wholesale Trade",
    "44": "Retail Trade",
    "45": "Retail Trade", // Combined with 44
    "48": "Transportation and Warehousing",
    "49": "Transportation and Warehousing", // Combined with 48
    "51": "Information",
    "52": "Finance and Insurance",
    "53": "Real Estate and Rental and Leasing",
    "54": "Professional, Scientific, and Technical Services",
    "55": "Management of Companies and Enterprises",
    "56": "Administrative and Support and Waste Management and Remediation Services",
    "61": "Educational Services",
    "62": "Health Care and Social Assistance",
    "71": "Arts, Entertainment, and Recreation",
    "72": "Accommodation and Food Services",
    "81": "Other Services (except Public Administration)",
    "92": "Public Administration"
  };

  // Get unique sector codes from comprehensive data
  const sectorCodes = comprehensiveNAICSMultipliers.map(item => item.sectorCode);
  const uniqueSectorCodes: string[] = [];
  
  sectorCodes.forEach(code => {
    if (!uniqueSectorCodes.includes(code)) {
      uniqueSectorCodes.push(code);
    }
  });
  
  return uniqueSectorCodes.map(code => ({
    code,
    title: sectorTitles[code] || `Sector ${code}`
  })).sort((a, b) => a.code.localeCompare(b.code));
}

export function getAllComprehensiveSectors(): Array<{code: string, title: string}> {
  const sectorTitles: {[key: string]: string} = {
    "11": "Agriculture, Forestry, Fishing and Hunting",
    "21": "Mining, Quarrying, and Oil and Gas Extraction", 
    "22": "Utilities",
    "23": "Construction"
  };
  
  const sectors = comprehensiveNAICSMultipliers.map(item => item.sectorCode);
  const uniqueSectors = sectors.filter((code, index) => sectors.indexOf(code) === index);
  return uniqueSectors.map(code => ({
    code,
    title: sectorTitles[code] || `Sector ${code}`
  }));
}

// Calculate multiplier based on grade using comprehensive data
export function calculateComprehensiveMultiplierFromGrade(
  multiplierData: ComprehensiveNAICSMultiplier,
  grade: string | number
): number {
  // Convert grade to numeric score if it's a letter grade
  let score: number;
  if (typeof grade === 'string') {
    const gradeMap: {[key: string]: number} = {
      'A': 95, 'A+': 100, 'A-': 90,
      'B': 85, 'B+': 88, 'B-': 82,
      'C': 75, 'C+': 78, 'C-': 72,
      'D': 65, 'D+': 68, 'D-': 62,
      'F': 50
    };
    score = gradeMap[grade.toUpperCase()] || 75;
  } else {
    score = grade;
  }

  // Map score to multiplier range
  if (score >= 90) {
    // A grades get max multiplier
    return multiplierData.maxMultiplier;
  } else if (score >= 80) {
    // B grades get high-end multiplier
    return multiplierData.avgMultiplier + (multiplierData.maxMultiplier - multiplierData.avgMultiplier) * 0.7;
  } else if (score >= 70) {
    // C grades get average multiplier
    return multiplierData.avgMultiplier;
  } else if (score >= 60) {
    // D grades get below average
    return multiplierData.avgMultiplier - (multiplierData.avgMultiplier - multiplierData.minMultiplier) * 0.5;
  } else {
    // F grades get minimum multiplier
    return multiplierData.minMultiplier;
  }
}