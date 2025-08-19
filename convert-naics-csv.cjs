const fs = require('fs');

// Read and parse CSV
const csv = fs.readFileSync('applebites/server/config/official-naics-2022.csv', 'utf8');
const lines = csv.split('\n').filter(line => line.trim());
const data = [];

// Parse CSV lines (skip header) - handle all formats
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Split by comma but handle quoted fields properly
  const parts = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    const nextChar = line[j + 1];
    
    if (char === '"') {
      // Check if it's an escaped quote (doubled)
      if (nextChar === '"' && inQuotes) {
        current += '"';
        j++; // Skip the next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim()); // Add last part
  
  // Parse the parts - ensure we have at least 3 fields
  if (parts.length >= 3) {
    const level = parseInt(parts[0]);
    const code = parts[1];
    let name = parts[2];
    const notes = parts[3] || '';
    
    // Remove surrounding quotes if present
    if (name.startsWith('"') && name.endsWith('"')) {
      name = name.slice(1, -1);
    }
    
    // Replace doubled quotes with single quotes
    name = name.replace(/""/g, '"');
    
    if (!isNaN(level) && code && name) {
      data.push({
        level: level,
        code: code,
        title: name,
        notes: notes
      });
    }
  }
}

// Build hierarchical structure
const hierarchicalData = [];

// First, identify all unique sector codes that exist in the data
const allSectorCodes = new Set();
data.forEach(item => {
  if (item.code && item.code.length >= 2) {
    allSectorCodes.add(item.code.substring(0, 2));
  }
});

// Create virtual sectors for any missing level-2 entries
const missingSectorNames = {
  '31': 'Manufacturing (31)',
  '32': 'Manufacturing (32)',
  '33': 'Manufacturing (33)',
  '44': 'Retail Trade (44)',
  '45': 'Retail Trade (45)',
  '48': 'Transportation and Warehousing (48)',
  '49': 'Transportation and Warehousing (49)',
  '53': 'Real Estate and Rental and Leasing',
  '54': 'Professional, Scientific, and Technical Services',
  '71': 'Arts, Entertainment, and Recreation'
};

// Add missing sectors
allSectorCodes.forEach(sectorCode => {
  const existingSector = data.find(d => d.level === 2 && d.code === sectorCode);
  if (!existingSector && missingSectorNames[sectorCode]) {
    data.push({
      level: 2,
      code: sectorCode,
      title: missingSectorNames[sectorCode],
      notes: 'Virtual sector'
    });
  }
});

// Re-sort data by code and level
data.sort((a, b) => {
  if (a.code !== b.code) return a.code.localeCompare(b.code);
  return a.level - b.level;
});

// Add all codes with proper parent relationships
data.forEach(item => {
  const entry = {
    code: item.code,
    title: item.title,
    level: item.level
  };
  
  // Determine parent code based on NAICS structure
  if (item.level > 2) {
    if (item.level === 3) {
      entry.parentCode = item.code.substring(0, 2); // 2-digit parent
    } else if (item.level === 4) {
      entry.parentCode = item.code.substring(0, 3); // 3-digit parent
    } else if (item.level === 5) {
      entry.parentCode = item.code.substring(0, 4); // 4-digit parent
    } else if (item.level === 6) {
      entry.parentCode = item.code.substring(0, 5); // 5-digit parent
    }
  }
  
  hierarchicalData.push(entry);
});

// Generate TypeScript code
let tsContent = `// Hierarchical NAICS Database - Complete 2022 Edition
// Generated from official-naics-2022.csv
// Total codes: ${data.length}
// 6-digit codes: ${data.filter(d => d.level === 6).length}

export interface HierarchicalNAICS {
  code: string;
  title: string;
  level: number; // 2=sector, 3=subsector, 4=industry_group, 5=industry, 6=national_industry
  parentCode?: string;
  description?: string;
  multiplier?: number;
}

export const hierarchicalNAICS: HierarchicalNAICS[] = [
`;

// Add entries grouped by sector
const sectors = data.filter(d => d.level === 2);
sectors.forEach(sector => {
  tsContent += `  // ${sector.title} (${sector.code})\n`;
  tsContent += `  { code: "${sector.code}", title: "${sector.title}", level: 2 },\n`;
  
  // Add all children of this sector
  const sectorChildren = data.filter(d => d.level > 2 && d.code.startsWith(sector.code));
  sectorChildren.forEach(child => {
    const parentCode = child.level === 3 ? sector.code :
                      child.level === 4 ? child.code.substring(0, 3) :
                      child.level === 5 ? child.code.substring(0, 4) :
                      child.level === 6 ? child.code.substring(0, 5) : '';
    
    tsContent += `  { code: "${child.code}", title: "${child.title.replace(/"/g, '\\"')}", level: ${child.level}`;
    if (parentCode) {
      tsContent += `, parentCode: "${parentCode}"`;
    }
    tsContent += ` },\n`;
  });
  tsContent += '\n';
});

tsContent += `];

// Export helper functions
export function getNAICSByLevel(level: number): HierarchicalNAICS[] {
  return hierarchicalNAICS.filter(item => item.level === level);
}

export function getNAICSByCode(code: string): HierarchicalNAICS | undefined {
  return hierarchicalNAICS.find(item => item.code === code);
}

export function getChildrenOfCode(parentCode: string): HierarchicalNAICS[] {
  return hierarchicalNAICS.filter(item => item.parentCode === parentCode);
}

export function getSixDigitCodes(): HierarchicalNAICS[] {
  return hierarchicalNAICS.filter(item => item.level === 6);
}

// Statistics
export const naicsStats = {
  totalCodes: ${data.length},
  sectors: ${data.filter(d => d.level === 2).length},
  subsectors: ${data.filter(d => d.level === 3).length},
  industryGroups: ${data.filter(d => d.level === 4).length},
  industries: ${data.filter(d => d.level === 5).length},
  nationalIndustries: ${data.filter(d => d.level === 6).length}
};
`;

// Write the TypeScript file
fs.writeFileSync('applebites/server/config/hierarchical-naics.ts', tsContent);

console.log('Successfully generated hierarchical-naics.ts with:');
console.log(`- Total codes: ${data.length}`);
console.log(`- Sectors (2-digit): ${data.filter(d => d.level === 2).length}`);
console.log(`- Subsectors (3-digit): ${data.filter(d => d.level === 3).length}`);
console.log(`- Industry Groups (4-digit): ${data.filter(d => d.level === 4).length}`);
console.log(`- Industries (5-digit): ${data.filter(d => d.level === 5).length}`);
console.log(`- National Industries (6-digit): ${data.filter(d => d.level === 6).length}`);