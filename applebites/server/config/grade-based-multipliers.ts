// Grade-based multipliers for free assessments
// Provides 3-8x EBITDA multiplier range based on operational grades

interface GradeMultiplier {
  grade: string;
  multiplier: number;
  label: string;
  description: string;
}

// Free assessment multiplier scale (3x - 8x range)
const gradeMultipliers: GradeMultiplier[] = [
  {
    grade: 'A',
    multiplier: 7.5,
    label: 'Excellent',
    description: 'Strong operational performance across all areas'
  },
  {
    grade: 'B', 
    multiplier: 6.0,
    label: 'Good',
    description: 'Above average performance with minor improvement areas'
  },
  {
    grade: 'C',
    multiplier: 4.5,
    label: 'Average', 
    description: 'Typical business performance with room for enhancement'
  },
  {
    grade: 'D',
    multiplier: 3.5,
    label: 'Below Average',
    description: 'Performance challenges requiring attention'
  },
  {
    grade: 'E',
    multiplier: 3.0,
    label: 'Poor',
    description: 'Significant operational improvements needed'
  }
];

// Convert numeric score to letter grade
export function scoreToGrade(score: number): string {
  if (score >= 4.5) return 'A';
  if (score >= 3.5) return 'B'; 
  if (score >= 2.5) return 'C';
  if (score >= 1.5) return 'D';
  return 'E';
}

// Get multiplier for a given grade
export function getMultiplierForGrade(grade: string): number {
  const baseGrade = grade.charAt(0); // Remove any +/- modifiers
  const gradeData = gradeMultipliers.find(g => g.grade === baseGrade);
  return gradeData ? gradeData.multiplier : 4.5; // Default to C grade
}

// Get label for a given grade
export function getLabelForGrade(grade: string): string {
  const baseGrade = grade.charAt(0); // Remove any +/- modifiers
  const gradeData = gradeMultipliers.find(g => g.grade === baseGrade);
  return gradeData ? gradeData.label : 'Average';
}

// Get description for a given grade
export function getDescriptionForGrade(grade: string): string {
  const baseGrade = grade.charAt(0); // Remove any +/- modifiers
  const gradeData = gradeMultipliers.find(g => g.grade === baseGrade);
  return gradeData ? gradeData.description : 'Typical business performance with room for enhancement';
}

// Get all grade multipliers for display
export function getAllGradeMultipliers(): GradeMultiplier[] {
  return gradeMultipliers;
}

// Calculate valuation using grade-based multiplier
export function calculateGradeBasedValuation(adjustedEbitda: number, grade: string): {
  lowEstimate: number;
  midEstimate: number; 
  highEstimate: number;
  multiplier: number;
} {
  const multiplier = getMultiplierForGrade(grade);
  const midEstimate = adjustedEbitda * multiplier;
  
  return {
    lowEstimate: Math.round(midEstimate * 0.8),
    midEstimate: Math.round(midEstimate),
    highEstimate: Math.round(midEstimate * 1.2),
    multiplier: parseFloat(multiplier.toFixed(1))
  };
}