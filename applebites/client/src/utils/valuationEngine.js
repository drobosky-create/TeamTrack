// Valuation Engine for Apple Bites

// NAICS-based industry multiplier lookup
function getNAICSMultiplier(naicsCode) {
  // Comprehensive NAICS multiplier database based on U.S. private company data
  const naicsMultipliers = {
    // Construction (23)
    "236115": { low: 2.5, high: 5.0 }, // New Single-Family Housing Construction
    "236116": { low: 2.5, high: 5.0 }, // New Multifamily Housing Construction  
    "236117": { low: 2.5, high: 5.0 }, // New Housing For-Sale Builders
    "236118": { low: 2.5, high: 5.0 }, // Residential Remodelers
    "236210": { low: 3.0, high: 6.0 }, // Industrial Building Construction
    "236220": { low: 3.0, high: 6.0 }, // Commercial Building Construction
    "237110": { low: 2.0, high: 4.5 }, // Water and Sewer Line Construction
    "237120": { low: 2.0, high: 4.5 }, // Oil and Gas Pipeline Construction
    "237130": { low: 2.0, high: 4.5 }, // Power and Communication Line Construction
    "237210": { low: 2.0, high: 4.5 }, // Land Subdivision
    "237310": { low: 2.0, high: 4.5 }, // Highway, Street, and Bridge Construction
    "237990": { low: 2.0, high: 4.5 }, // Other Heavy Construction
    "238110": { low: 3.0, high: 6.0 }, // Poured Concrete Foundation Contractors
    "238120": { low: 3.0, high: 6.0 }, // Structural Steel Contractors
    "238130": { low: 3.0, high: 6.0 }, // Framing Contractors
    "238140": { low: 3.0, high: 6.0 }, // Masonry Contractors
    "238150": { low: 3.0, high: 6.0 }, // Glass and Glazing Contractors
    "238160": { low: 3.0, high: 6.0 }, // Roofing Contractors
    "238170": { low: 3.0, high: 6.0 }, // Siding Contractors
    "238210": { low: 3.5, high: 7.0 }, // Electrical Contractors
    "238220": { low: 3.5, high: 7.0 }, // Plumbing, Heating, AC Contractors
    "238290": { low: 3.0, high: 6.0 }, // Other Building Equipment Contractors
    "238310": { low: 3.0, high: 6.0 }, // Drywall and Insulation Contractors
    "238320": { low: 3.0, high: 6.0 }, // Painting and Wall Covering Contractors
    "238330": { low: 3.0, high: 6.0 }, // Flooring Contractors
    "238340": { low: 3.0, high: 6.0 }, // Tile and Terrazzo Contractors
    "238350": { low: 3.0, high: 6.0 }, // Finish Carpentry Contractors
    "238390": { low: 3.0, high: 6.0 }, // Other Building Finishing Contractors
    "238910": { low: 2.5, high: 5.0 }, // Site Preparation Contractors
    "238990": { low: 2.5, high: 5.0 }, // All Other Specialty Trade Contractors
    
    // Professional Services (54)
    "541110": { low: 4.0, high: 8.0 }, // Offices of Lawyers
    "541191": { low: 4.0, high: 8.0 }, // Title Abstract and Settlement Offices
    "541199": { low: 4.0, high: 8.0 }, // All Other Legal Services
    "541211": { low: 5.0, high: 10.0 }, // Offices of Certified Public Accountants
    "541213": { low: 4.0, high: 8.0 }, // Tax Preparation Services
    "541214": { low: 4.0, high: 8.0 }, // Payroll Services
    "541219": { low: 4.0, high: 8.0 }, // Other Accounting Services
    "541310": { low: 3.5, high: 7.0 }, // Architectural Services
    "541320": { low: 3.5, high: 7.0 }, // Landscape Architectural Services
    "541330": { low: 3.5, high: 7.0 }, // Engineering Services
    "541340": { low: 3.5, high: 7.0 }, // Drafting Services
    "541350": { low: 3.5, high: 7.0 }, // Building Inspection Services
    "541360": { low: 3.5, high: 7.0 }, // Geophysical Surveying Services
    "541370": { low: 3.5, high: 7.0 }, // Surveying and Mapping Services
    "541380": { low: 3.5, high: 7.0 }, // Testing Laboratories
    "541410": { low: 4.5, high: 9.0 }, // Interior Design Services
    "541420": { low: 4.0, high: 8.0 }, // Industrial Design Services
    "541430": { low: 4.0, high: 8.0 }, // Graphic Design Services
    "541490": { low: 4.0, high: 8.0 }, // Other Specialized Design Services
    "541511": { low: 5.0, high: 12.0 }, // Custom Computer Programming Services
    "541512": { low: 5.0, high: 12.0 }, // Computer Systems Design Services
    "541513": { low: 4.0, high: 9.0 }, // Computer Facilities Management Services
    "541519": { low: 4.0, high: 9.0 }, // Other Computer Related Services
    "541611": { low: 4.0, high: 8.0 }, // Administrative Management Consulting
    "541612": { low: 4.0, high: 8.0 }, // Human Resources Consulting
    "541613": { low: 4.0, high: 8.0 }, // Marketing Consulting Services
    "541614": { low: 4.0, high: 8.0 }, // Process/Logistics Consulting Services
    "541618": { low: 4.0, high: 8.0 }, // Other Management Consulting Services
    "541620": { low: 3.5, high: 7.0 }, // Environmental Consulting Services
    "541690": { low: 3.5, high: 7.0 }, // Other Scientific and Technical Consulting
    "541711": { low: 3.0, high: 6.0 }, // Research and Development in Biotechnology
    "541712": { low: 3.0, high: 6.0 }, // Research and Development in Physical Sciences
    "541720": { low: 3.0, high: 6.0 }, // Research and Development in Social Sciences
    "541810": { low: 4.0, high: 8.0 }, // Advertising Agencies
    "541820": { low: 4.0, high: 8.0 }, // Public Relations Agencies
    "541830": { low: 4.0, high: 8.0 }, // Media Buying Agencies
    "541840": { low: 4.0, high: 8.0 }, // Media Representatives
    "541850": { low: 3.5, high: 7.0 }, // Outdoor Advertising
    "541860": { low: 4.0, high: 8.0 }, // Direct Mail Advertising
    "541870": { low: 4.0, high: 8.0 }, // Advertising Material Distribution Services
    "541890": { low: 4.0, high: 8.0 }, // Other Services Related to Advertising
    "541910": { low: 4.0, high: 8.0 }, // Marketing Research and Public Opinion Polling
    "541921": { low: 4.5, high: 9.0 }, // Photography Studios, Portrait
    "541922": { low: 4.0, high: 8.0 }, // Commercial Photography
    "541930": { low: 3.5, high: 7.0 }, // Translation and Interpretation Services
    "541940": { low: 4.0, high: 8.0 }, // Veterinary Services
    "541990": { low: 3.5, high: 7.0 }  // All Other Professional Services
  };
  
  // Default fallback multipliers by sector if specific NAICS not found
  const sectorDefaults = {
    "11": { low: 3.0, high: 6.0 }, // Agriculture
    "21": { low: 2.0, high: 4.0 }, // Mining  
    "22": { low: 3.0, high: 6.0 }, // Utilities
    "23": { low: 2.5, high: 5.5 }, // Construction
    "31": { low: 2.5, high: 5.0 }, // Manufacturing
    "42": { low: 3.0, high: 6.0 }, // Wholesale Trade
    "44": { low: 2.0, high: 4.0 }, // Retail Trade
    "48": { low: 2.0, high: 4.5 }, // Transportation
    "51": { low: 4.0, high: 8.0 }, // Information
    "52": { low: 3.0, high: 6.0 }, // Finance
    "53": { low: 3.5, high: 7.0 }, // Real Estate
    "54": { low: 4.0, high: 8.0 }, // Professional Services
    "55": { low: 4.0, high: 8.0 }, // Management
    "56": { low: 3.0, high: 6.0 }, // Administrative Services
    "61": { low: 3.0, high: 6.0 }, // Education
    "62": { low: 3.5, high: 7.0 }, // Healthcare
    "71": { low: 2.5, high: 5.0 }, // Arts/Entertainment
    "72": { low: 2.0, high: 4.0 }, // Accommodation/Food
    "81": { low: 2.5, high: 5.0 }, // Other Services
    "92": { low: 2.0, high: 4.0 }  // Public Administration
  };
  
  // Look up specific NAICS code first
  if (naicsCode && naicsMultipliers[naicsCode]) {
    return naicsMultipliers[naicsCode];
  }
  
  // Fall back to sector-level multiplier
  if (naicsCode && naicsCode.length >= 2) {
    const sectorCode = naicsCode.substring(0, 2);
    if (sectorDefaults[sectorCode]) {
      return sectorDefaults[sectorCode];
    }
  }
  
  // Final fallback
  return { low: 2.0, high: 5.0 };
}

function calculateValuation(responses) {
  const driverTotals = {};
  const driverCounts = {};

  // Step 1: Score aggregation per value driver
  for (const response of responses) {
    const { valueDriver, weight } = response;
    if (!driverTotals[valueDriver]) {
      driverTotals[valueDriver] = 0;
      driverCounts[valueDriver] = 0;
    }
    driverTotals[valueDriver] += weight;
    driverCounts[valueDriver] += 1;
  }

  // Step 2: Normalize driver scores to 0–100
  const driverScores = {};
  let overallTotal = 0;
  for (const driver in driverTotals) {
    const avgScore = driverTotals[driver] / driverCounts[driver]; // out of 5
    const normalized = Math.round((avgScore / 5) * 100);
    driverScores[driver] = normalized;
    overallTotal += normalized;
  }

  const overallScore = Math.round(overallTotal / Object.keys(driverScores).length);

  // Step 3: Get NAICS-based multiplier range
  const naicsCode = responses.find(r => r.id === 'naics-code')?.value;
  const baseMult = getNAICSMultiplier(naicsCode);
  
  // Step 4: Adjust industry multiplier range based on Value Driver Score
  let lowMult = baseMult.low;
  let highMult = baseMult.high;
  
  if (overallScore >= 80) {
    // Top performers stay at full industry range
  } else if (overallScore >= 60) {
    // Good performers: slight reduction
    highMult -= 1.5;
  } else if (overallScore >= 40) {
    // Average performers: moderate reduction
    highMult -= 2.5;
    lowMult = Math.max(0.5, lowMult - 1.0);
  } else {
    // Below-average performers: significant reduction
    highMult -= 3.5;
    lowMult = Math.max(0.1, lowMult - 2.0);
  }
  
  // Ensure minimum viable ranges
  lowMult = Math.max(0.1, lowMult);
  highMult = Math.max(lowMult + 0.5, highMult);

  // Step 4: Calculate Adjusted EBITDA
  const financials = responses.find(r => r.id === 'financial-1');
  const cogs = responses.find(r => r.id === 'financial-2');
  const opex = responses.find(r => r.id === 'financial-3');
  const adjustments = ['adjustments-1', 'adjustments-2', 'adjustments-3', 'adjustments-4']
    .map(id => responses.find(r => r.id === id)?.value || 0)
    .reduce((a, b) => a + b, 0);

  const revenue = financials?.value || 0;
  const grossProfit = revenue - (cogs?.value || 0);
  const ebitda = grossProfit - (opex?.value || 0) + adjustments;

  // Step 5: Calculate value range
  const estimatedLow = Math.round(ebitda * lowMult);
  const estimatedHigh = Math.round(ebitda * highMult);
  const estimatedMean = Math.round((estimatedLow + estimatedHigh) / 2);

  // Step 6: Build recommendations for drivers under 60
  const recommendations = [];
  for (const driver in driverScores) {
    if (driverScores[driver] < 60) {
      recommendations.push("Improve your " + driver + " to increase attractiveness to buyers.");
    }
  }

  return {
    overallScore,
    driverScores,
    ebitda,
    valuation: {
      low: estimatedLow,
      mean: estimatedMean,
      high: estimatedHigh
    },
    recommendations
  };
}

export default calculateValuation;