// Curated NAICS 6-digit codes by sector with multiplier ranges
export const curatedNAICSDatabase = {
  "11": [
    {
      "code": "111110",
      "label": "Soybean Farming",
      "multiplier": {
        "min": 2.0,
        "avg": 2.5,
        "max": 3.0
      }
    },
    {
      "code": "111120",
      "label": "Oilseed (except Soybean) Farming",
      "multiplier": {
        "min": 2.0,
        "avg": 2.5,
        "max": 3.0
      }
    }
  ],
  "21": [
    {
      "code": "211120",
      "label": "Crude Petroleum Extraction",
      "multiplier": {
        "min": 3.5,
        "avg": 4.2,
        "max": 5.0
      }
    },
    {
      "code": "212110",
      "label": "Coal Mining",
      "multiplier": {
        "min": 2.5,
        "avg": 3.1,
        "max": 3.8
      }
    }
  ],
  "23": [
    {
      "code": "236110",
      "label": "Residential Building Construction",
      "multiplier": {
        "min": 2.0,
        "avg": 2.5,
        "max": 3.0
      }
    },
    {
      "code": "237210",
      "label": "Land Subdivision",
      "multiplier": {
        "min": 2.0,
        "avg": 2.5,
        "max": 3.0
      }
    }
  ],
  "31": [
    {
      "code": "311810",
      "label": "Bread and Bakery Product Manufacturing",
      "multiplier": {
        "min": 2.7,
        "avg": 3.2,
        "max": 3.8
      }
    }
  ],
  "42": [
    {
      "code": "423610",
      "label": "Electrical Apparatus and Equipment Merchant Wholesalers",
      "multiplier": {
        "min": 2.3,
        "avg": 2.8,
        "max": 3.3
      }
    }
  ],
  "44": [
    {
      "code": "441110",
      "label": "New Car Dealers",
      "multiplier": {
        "min": 1.8,
        "avg": 2.3,
        "max": 2.8
      }
    }
  ],
  "54": [
    {
      "code": "541611",
      "label": "Administrative Management and General Management Consulting Services",
      "multiplier": {
        "min": 3.2,
        "avg": 3.8,
        "max": 4.5
      }
    }
  ],
  "61": [
    {
      "code": "611310",
      "label": "Colleges, Universities, and Professional Schools",
      "multiplier": {
        "min": 2.0,
        "avg": 2.5,
        "max": 3.0
      }
    }
  ],
  "72": [
    {
      "code": "722511",
      "label": "Full-Service Restaurants",
      "multiplier": {
        "min": 1.7,
        "avg": 2.1,
        "max": 2.5
      }
    }
  ]
};

// Get curated 6-digit NAICS codes for a specific 2-digit sector
export function getCuratedNAICsBySector(sectorCode: string): Array<{code: string, label: string, multiplier: {min: number, avg: number, max: number}}> {
  return curatedNAICSDatabase[sectorCode as keyof typeof curatedNAICSDatabase] || [];
}

// Get all available sectors from curated database
export function getCuratedSectors(): Array<{code: string, title: string}> {
  const sectorTitles = {
    "11": "Agriculture, Forestry, Fishing and Hunting",
    "21": "Mining, Quarrying, and Oil and Gas Extraction",
    "23": "Construction",
    "31": "Manufacturing",
    "42": "Wholesale Trade",
    "44": "Retail Trade",
    "54": "Professional, Scientific and Technical Services",
    "61": "Educational Services",
    "72": "Accommodation and Food Services"
  };
  
  return Object.keys(curatedNAICSDatabase).map(code => ({
    code,
    title: sectorTitles[code as keyof typeof sectorTitles]
  }));
}

// Get NAICS details by code
export function getCuratedNAICSByCode(code: string): {code: string, label: string, multiplier: {min: number, avg: number, max: number}, sectorCode: string} | null {
  for (const [sectorCode, industries] of Object.entries(curatedNAICSDatabase)) {
    const industry = industries.find(ind => ind.code === code);
    if (industry) {
      return {
        ...industry,
        sectorCode
      };
    }
  }
  return null;
}

// Calculate multiplier based on grade and industry range
export function calculateMultiplierFromGrade(
  multiplierRange: {min: number, avg: number, max: number},
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
    return multiplierRange.max;
  } else if (score >= 80) {
    // B grades get high-end multiplier
    return multiplierRange.avg + (multiplierRange.max - multiplierRange.avg) * 0.7;
  } else if (score >= 70) {
    // C grades get average multiplier
    return multiplierRange.avg;
  } else if (score >= 60) {
    // D grades get below average
    return multiplierRange.avg - (multiplierRange.avg - multiplierRange.min) * 0.5;
  } else {
    // F grades get minimum multiplier
    return multiplierRange.min;
  }
}