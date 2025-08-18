import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface CompleteNAICS {
  level: number;
  code: string;
  title: string;
  parentCode?: string;
  multiplier?: number;
  description?: string;
}

// Industry-specific multiplier mappings based on business risk and valuation patterns
const SECTOR_MULTIPLIERS: { [key: string]: number } = {
  '11': 2.5, // Agriculture, Forestry, Fishing and Hunting - Lower due to commodity dependence
  '21': 4.2, // Mining, Quarrying, and Oil and Gas Extraction - Higher due to asset intensity
  '22': 3.8, // Utilities - Stable regulated utilities
  '23': 3.0, // Construction - Cyclical industry
  '31': 3.5, // Manufacturing - Varies by subsector
  '32': 3.5, // Manufacturing continuation
  '33': 3.5, // Manufacturing continuation
  '42': 2.8, // Wholesale Trade - Distribution margins
  '44': 2.2, // Retail Trade - Lower margins, high competition
  '45': 2.2, // Retail Trade continuation
  '48': 2.6, // Transportation and Warehousing - Asset-heavy, regulated
  '49': 2.6, // Transportation and Warehousing continuation
  '51': 4.8, // Information - High growth, technology-driven
  '52': 4.5, // Finance and Insurance - Regulated, stable cash flows
  '53': 3.2, // Real Estate and Rental and Leasing - Asset-based
  '54': 5.0, // Professional, Scientific, and Technical Services - High margin services
  '55': 4.0, // Management of Companies and Enterprises - Holding companies
  '56': 2.8, // Administrative and Support Services - Service-based
  '61': 3.0, // Educational Services - Stable but lower growth
  '62': 3.5, // Health Care and Social Assistance - Essential services
  '71': 2.4, // Arts, Entertainment, and Recreation - Discretionary spending
  '72': 2.0, // Accommodation and Food Services - Low margins, high turnover
  '81': 2.6, // Other Services - Varied service categories
  '92': 1.0, // Public Administration - Government entities
};

// Subsector adjustments for more specific multipliers
const SUBSECTOR_ADJUSTMENTS: { [key: string]: number } = {
  // Technology and software get premium multipliers
  '5112': 6.0, // Software Publishers
  '5415': 5.5, // Computer Systems Design and Related Services
  '5179': 5.0, // Other Telecommunications
  '5182': 4.8, // Data Processing, Hosting, and Related Services
  
  // Healthcare premiums
  '6211': 4.5, // Offices of Physicians
  '6212': 4.0, // Offices of Dentists
  '6213': 3.8, // Offices of Other Health Practitioners
  
  // Financial services variations
  '5221': 5.2, // Depository Credit Intermediation
  '5231': 4.8, // Securities and Commodity Contracts Intermediation
  '5241': 4.2, // Insurance Carriers
  
  // Manufacturing specialties
  '3254': 4.8, // Pharmaceutical and Medicine Manufacturing
  '3341': 4.5, // Computer and Peripheral Equipment Manufacturing
  '3342': 4.2, // Communications Equipment Manufacturing
  
  // Energy sector
  '2111': 5.0, // Oil and Gas Extraction
  '2211': 4.0, // Electric Power Generation
  
  // Construction specialties
  '2362': 3.4, // Nonresidential Building Construction
  '2373': 3.6, // Highway, Street, and Bridge Construction
  
  // Food and beverage
  '3121': 2.8, // Beverage Manufacturing
  '7225': 1.8, // Restaurants and Other Eating Places
};

// Load and parse the official NAICS CSV data
function loadOfficialNAICSData(): CompleteNAICS[] {
  // Try multiple possible paths for the CSV file
  const possiblePaths = [
    path.join(__dirname, 'official-naics-2022.csv'), // Development path
    path.join(process.cwd(), 'server/config/official-naics-2022.csv'), // Production path
    path.join(process.cwd(), 'official-naics-2022.csv'), // Alternative path
  ];
  
  let csvPath: string | null = null;
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      csvPath = testPath;
      break;
    }
  }
  
  if (!csvPath) {
    console.error('NAICS CSV file not found in any of the expected locations:', possiblePaths);
    return [];
  }
  
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');
    const data: CompleteNAICS[] = [];
    
    console.log(`Loading NAICS data from ${csvPath}, found ${lines.length} lines`);
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        // Parse CSV line - handle quoted fields
        const parts = parseCsvLine(line);
        if (parts.length < 3) continue;
        
        const level = parseInt(parts[0]);
        const code = parts[1].toString().trim();
        const title = parts[2].replace(/"/g, '').trim(); // Remove quotes
        
        // Skip invalid entries
        if (isNaN(level) || !code || !title) continue;
        
        // Determine parent code based on level and code structure
        let parentCode: string | undefined;
        if (level > 2) {
          if (level === 3) {
            parentCode = code.substring(0, 2);
          } else if (level === 4) {
            parentCode = code.substring(0, 3);
          } else if (level === 5) {
            parentCode = code.substring(0, 4);
          } else if (level === 6) {
            parentCode = code.substring(0, 5);
          }
        }
        
        // Assign multiplier based on industry sector and subsector
        let multiplier: number | undefined;
        if (level === 6) {
          // Check for specific subsector adjustments first
          const subsectorCode = code.substring(0, 4);
          if (SUBSECTOR_ADJUSTMENTS[subsectorCode]) {
            multiplier = SUBSECTOR_ADJUSTMENTS[subsectorCode];
          } else {
            // Use sector-based multiplier
            const sectorCode = code.substring(0, 2);
            multiplier = SECTOR_MULTIPLIERS[sectorCode] || 3.0;
            
            // Add some variation within sectors
            const codeNum = parseInt(code.substring(2));
            if (!isNaN(codeNum)) {
              const variation = (codeNum % 10) * 0.1 - 0.5;
              multiplier = Math.round((multiplier + variation) * 10) / 10;
              multiplier = Math.max(1.5, Math.min(6.0, multiplier)); // Keep within reasonable bounds
            }
          }
        }
        
        data.push({
          level,
          code,
          title,
          parentCode,
          multiplier,
          description: title // Use title as description for now
        });
      } catch (lineError) {
        console.warn(`Error parsing line ${i}: ${line}`, lineError);
        continue;
      }
    }
    
    console.log(`Successfully loaded ${data.length} NAICS entries`);
    return data;
  } catch (error) {
    console.error('Error loading NAICS data:', error);
    return [];
  }
}

// Simple CSV parser that handles quoted fields
function parseCsvLine(line: string): string[] {
  const parts: string[] = [];
  let currentPart = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(currentPart);
      currentPart = '';
    } else {
      currentPart += char;
    }
  }
  
  parts.push(currentPart);
  return parts;
}

// Export the complete NAICS database
export const completeNAICSDatabase: CompleteNAICS[] = loadOfficialNAICSData();

// Helper functions for querying the database
export function getSectorCodes(): string[] {
  return completeNAICSDatabase
    .filter(item => item.level === 2)
    .map(item => item.code)
    .sort();
}

export function getSectorByCode(code: string): CompleteNAICS | undefined {
  return completeNAICSDatabase.find(item => item.code === code && item.level === 2);
}

export function getChildrenByParentCode(parentCode: string): CompleteNAICS[] {
  return completeNAICSDatabase
    .filter(item => item.parentCode === parentCode)
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function getNAICSByCode(code: string): CompleteNAICS | undefined {
  return completeNAICSDatabase.find(item => item.code === code);
}

export function getNAICSByLevel(level: number): CompleteNAICS[] {
  return completeNAICSDatabase
    .filter(item => item.level === level)
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function searchNAICS(query: string): CompleteNAICS[] {
  const lowerQuery = query.toLowerCase();
  return completeNAICSDatabase
    .filter(item => 
      item.code.includes(query) || 
      item.title.toLowerCase().includes(lowerQuery)
    )
    .sort((a, b) => a.code.localeCompare(b.code));
}

// Get all sectors with their titles
export function getAllSectors(): { code: string; title: string }[] {
  return completeNAICSDatabase
    .filter(item => item.level === 2)
    .map(item => ({ code: item.code, title: item.title }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

// Enhanced function to get children with better display titles
export function getChildrenWithEnhancedTitles(parentCode: string): CompleteNAICS[] {
  const children = getChildrenByParentCode(parentCode);
  
  return children.map(child => ({
    ...child,
    title: `${child.code} - ${child.title}`
  }));
}

// Get subsectors for a given sector
export function getSubsectorsBySector(sectorCode: string): CompleteNAICS[] {
  return completeNAICSDatabase
    .filter(item => item.level === 3 && item.parentCode === sectorCode)
    .sort((a, b) => a.code.localeCompare(b.code));
}

// Get the full hierarchy path for a given NAICS code
export function getNAICSHierarchy(code: string): CompleteNAICS[] {
  const hierarchy: CompleteNAICS[] = [];
  let current = getNAICSByCode(code);
  
  while (current) {
    hierarchy.unshift(current);
    if (current.parentCode) {
      current = getNAICSByCode(current.parentCode);
    } else {
      break;
    }
  }
  
  return hierarchy;
}