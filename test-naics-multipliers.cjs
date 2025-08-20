// Test script to verify NAICS multiplier calculations
const { getNAICSMultiplier } = require('./server/data/naics-multipliers');

console.log('Testing NAICS Multiplier Calculations');
console.log('========================================\n');

// Test Roofing Contractors (238160)
console.log('Roofing Contractors (238160):');
console.log('------------------------------');
console.log('Score 2.0 (below average):', getNAICSMultiplier('238160', 2.0).toFixed(1) + 'x');
console.log('Score 3.0 (average):', getNAICSMultiplier('238160', 3.0).toFixed(1) + 'x');
console.log('Score 3.9 (good):', getNAICSMultiplier('238160', 3.9).toFixed(1) + 'x');
console.log('Score 4.0 (premium threshold):', getNAICSMultiplier('238160', 4.0).toFixed(1) + 'x');
console.log('Score 4.5 (very good):', getNAICSMultiplier('238160', 4.5).toFixed(1) + 'x');
console.log('Score 5.0 (excellent):', getNAICSMultiplier('238160', 5.0).toFixed(1) + 'x');
console.log('\nBase range: 5.9x - 8.4x');
console.log('Premium range: 8.5x - 11.0x\n');

// Test Software Publishers (511210) for comparison
console.log('Software Publishers (511210):');
console.log('------------------------------');
console.log('Score 3.0 (average):', getNAICSMultiplier('511210', 3.0).toFixed(1) + 'x');
console.log('Score 5.0 (excellent):', getNAICSMultiplier('511210', 5.0).toFixed(1) + 'x');

// Test a non-existent NAICS code (should use sector defaults)
console.log('\nUnknown NAICS (999999):');
console.log('------------------------------');
console.log('Score 3.0 (average):', getNAICSMultiplier('999999', 3.0).toFixed(1) + 'x');
console.log('Score 5.0 (excellent):', getNAICSMultiplier('999999', 5.0).toFixed(1) + 'x');