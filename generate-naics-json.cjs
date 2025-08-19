const fs = require('fs');

// Read the TypeScript file
const tsContent = fs.readFileSync('applebites/server/config/hierarchical-naics.ts', 'utf8');

// Extract the array data between the brackets
const startMarker = 'export const hierarchicalNAICS: HierarchicalNAICS[] = [';
const endMarker = '];';
const startIndex = tsContent.indexOf(startMarker) + startMarker.length - 1;
const endIndex = tsContent.lastIndexOf(endMarker) + 1;
const arrayContent = tsContent.substring(startIndex, endIndex);

// Clean up the TypeScript syntax to make it valid JSON
let jsonString = arrayContent
  // Remove comments
  .replace(/\/\/[^\n]*/g, '')
  // Remove trailing commas
  .replace(/,(\s*[}\]])/g, '$1')
  // Fix property names (add quotes)
  .replace(/(\s+)(\w+):/g, '$1"$2":')
  // Remove empty lines
  .replace(/^\s*[\r\n]/gm, '');

// Parse and validate
try {
  const data = eval(jsonString); // Using eval since it's generated content
  
  // Write to JSON file
  fs.writeFileSync('client/src/modules/applebites/data/hierarchical-naics.json', 
    JSON.stringify(data, null, 2));
  
  // Count statistics
  const stats = {
    total: data.length,
    level2: data.filter(d => d.level === 2).length,
    level3: data.filter(d => d.level === 3).length,
    level4: data.filter(d => d.level === 4).length,
    level5: data.filter(d => d.level === 5).length,
    level6: data.filter(d => d.level === 6).length
  };
  
  console.log('Successfully generated hierarchical-naics.json');
  console.log('Statistics:');
  console.log(`- Total entries: ${stats.total}`);
  console.log(`- Sectors (level 2): ${stats.level2}`);
  console.log(`- Subsectors (level 3): ${stats.level3}`);
  console.log(`- Industry Groups (level 4): ${stats.level4}`);
  console.log(`- Industries (level 5): ${stats.level5}`);
  console.log(`- National Industries (level 6): ${stats.level6}`);
  
  // Also update the naics-codes.json with just the 6-digit codes
  const sixDigitCodes = data.filter(d => d.level === 6).map(item => ({
    code: item.code,
    title: item.title,
    parentCode: item.parentCode
  }));
  
  fs.writeFileSync('client/src/modules/applebites/data/naics-codes.json',
    JSON.stringify(sixDigitCodes, null, 2));
  
  console.log(`\\nAlso updated naics-codes.json with ${sixDigitCodes.length} six-digit codes`);
  
} catch (error) {
  console.error('Error parsing data:', error.message);
}