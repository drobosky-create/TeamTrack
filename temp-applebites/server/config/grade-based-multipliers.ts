export const gradeMultipliers = {
  "A": { label: "Excellent Operations", multiple: 7.5 },
  "B": { label: "Good Operations", multiple: 5.7 },
  "C": { label: "Average Operations", multiple: 4.2 },
  "D": { label: "Needs Improvement", multiple: 3.0 },
  "F": { label: "At Risk", multiple: 2.0 }
} as const;

export type OperationalGrade = keyof typeof gradeMultipliers;

export function getMultiplierForGrade(grade: string): number {
  const normalizedGrade = grade.charAt(0).toUpperCase() as OperationalGrade;
  return gradeMultipliers[normalizedGrade]?.multiple || gradeMultipliers.C.multiple;
}

export function getLabelForGrade(grade: string): string {
  const normalizedGrade = grade.charAt(0).toUpperCase() as OperationalGrade;
  return gradeMultipliers[normalizedGrade]?.label || gradeMultipliers.C.label;
}

export function scoreToGrade(averageScore: number): OperationalGrade {
  if (averageScore >= 4.5) return 'A';
  if (averageScore >= 3.5) return 'B';
  if (averageScore >= 2.5) return 'C';
  if (averageScore >= 1.5) return 'D';
  return 'F';
}

// Future-proofing for industry-specific multipliers
export const industryMultipliers = {
  default: gradeMultipliers,
  // NAICS-specific overrides can be added here
  // "238160": { A: {...}, B: {...}, ... } // Roofing Contractors
} as const;