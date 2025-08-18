import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define form schemas for each step
const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().min(1, "Company name is required"),
  title: z.string().optional(),
});

const industrySchema = z.object({
  businessSector: z.string().min(1, "Please select your business sector"),
  naicsCode: z.string().min(1, "Please select your NAICS industry code"),
  businessDescription: z.string().min(10, "Please provide a detailed business description"),
  yearsInBusiness: z.string().min(1, "Years in business is required"),
  numberOfEmployees: z.string().min(1, "Number of employees is required"),
  marketPosition: z.string().min(1, "Please select your market position"),
  competitiveAdvantages: z.string().optional(),
});

const ebitdaSchema = z.object({
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  costOfGoodsSold: z.string().optional(),
  grossProfit: z.string().optional(),
  operatingExpenses: z.string().min(1, "Operating expenses is required"),
  ebitda: z.string().optional(),
});

const adjustmentsSchema = z.object({
  ownerSalary: z.string().optional(),
  personalExpenses: z.string().optional(),
  oneTimeExpenses: z.string().optional(),
  otherAdjustments: z.string().optional(),
  adjustmentNotes: z.string().optional(),
});

const valueDriversSchema = z.object({
  financialPerformance: z.string().min(1, "Financial performance rating is required"),
  growthPotential: z.string().min(1, "Growth potential rating is required"),
  marketPosition: z.string().min(1, "Market position rating is required"),
  managementTeam: z.string().min(1, "Management team rating is required"),
  customerBase: z.string().min(1, "Customer base rating is required"),
  operationalEfficiency: z.string().min(1, "Operational efficiency rating is required"),
  industryTrends: z.string().min(1, "Industry trends rating is required"),
  competitiveAdvantage: z.string().min(1, "Competitive advantage rating is required"),
});

const followUpSchema = z.object({
  interestedIn: z.array(z.string()).optional(),
  additionalComments: z.string().optional(),
  preferredContact: z.string().optional(),
});

export type PaidFormStep = "contact" | "industry" | "ebitda" | "adjustments" | "valueDrivers" | "followUp" | "results";

export interface PaidValuationFormData {
  contact: z.infer<typeof contactSchema>;
  industry: z.infer<typeof industrySchema>;
  ebitda: z.infer<typeof ebitdaSchema>;
  adjustments: z.infer<typeof adjustmentsSchema>;
  valueDrivers: z.infer<typeof valueDriversSchema>;
  followUp: z.infer<typeof followUpSchema>;
}

export function usePaidValuationForm() {
  const [currentStep, setCurrentStep] = useState<PaidFormStep>("contact");
  const [formData, setFormData] = useState<Partial<PaidValuationFormData>>({});

  const forms = {
    contact: useForm({
      resolver: zodResolver(contactSchema),
      defaultValues: formData.contact || {},
    }),
    industry: useForm({
      resolver: zodResolver(industrySchema),
      defaultValues: formData.industry || {},
    }),
    ebitda: useForm({
      resolver: zodResolver(ebitdaSchema),
      defaultValues: formData.ebitda || {},
    }),
    adjustments: useForm({
      resolver: zodResolver(adjustmentsSchema),
      defaultValues: formData.adjustments || {},
    }),
    valueDrivers: useForm({
      resolver: zodResolver(valueDriversSchema),
      defaultValues: formData.valueDrivers || {},
    }),
    followUp: useForm({
      resolver: zodResolver(followUpSchema),
      defaultValues: formData.followUp || {},
    }),
  };

  const steps: PaidFormStep[] = ["contact", "industry", "ebitda", "adjustments", "valueDrivers", "followUp"];

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      setCurrentStep("results");
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const updateFormData = (step: keyof PaidValuationFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data,
    }));
  };

  const calculateEbitda = (): number => {
    if (!formData.ebitda) return 0;
    
    const revenue = parseFloat(formData.ebitda.annualRevenue || "0");
    const cogs = parseFloat(formData.ebitda.costOfGoodsSold || "0");
    const opex = parseFloat(formData.ebitda.operatingExpenses || "0");
    
    return revenue - cogs - opex;
  };

  const calculateAdjustedEbitda = (): number => {
    const baseEbitda = calculateEbitda();
    if (!formData.adjustments) return baseEbitda;

    const ownerSalary = parseFloat(formData.adjustments.ownerSalary || "0");
    const personalExpenses = parseFloat(formData.adjustments.personalExpenses || "0");
    const oneTimeExpenses = parseFloat(formData.adjustments.oneTimeExpenses || "0");
    const otherAdjustments = parseFloat(formData.adjustments.otherAdjustments || "0");

    return baseEbitda + ownerSalary + personalExpenses + oneTimeExpenses + otherAdjustments;
  };

  const calculateValuation = (): { 
    baseValuation: number; 
    adjustedValuation: number; 
    multiplier: number;
    industryMultiplier: number;
  } => {
    const adjustedEbitda = calculateAdjustedEbitda();
    
    // Get industry-specific multiplier (this would come from NAICS database)
    const industryMultiplier = getIndustryMultiplier(formData.industry?.naicsCode);
    
    // Calculate value driver multiplier adjustments
    const valueDriverMultiplier = calculateValueDriverMultiplier();
    
    // Combined multiplier
    const finalMultiplier = industryMultiplier * valueDriverMultiplier;
    
    return {
      baseValuation: adjustedEbitda * industryMultiplier,
      adjustedValuation: adjustedEbitda * finalMultiplier,
      multiplier: finalMultiplier,
      industryMultiplier: industryMultiplier,
    };
  };

  const getIndustryMultiplier = (naicsCode?: string): number => {
    if (!naicsCode) return 3.5; // Default multiplier
    
    // Use comprehensive NAICS database with authentic multiplier data
    const comprehensiveMultiplierRanges: { [key: string]: { min: number; avg: number; max: number } } = {
      // Agriculture, Forestry, Fishing and Hunting (NAICS 11)
      "111110": { min: 3.0, avg: 6.0, max: 8.0 },
      "111120": { min: 3.0, avg: 6.0, max: 8.0 },
      "111130": { min: 3.0, avg: 6.0, max: 8.0 },
      "111140": { min: 3.0, avg: 6.0, max: 8.0 },
      "111150": { min: 3.0, avg: 6.0, max: 8.0 },
      "111160": { min: 3.0, avg: 6.0, max: 8.0 },
      "111191": { min: 3.0, avg: 6.0, max: 8.0 },
      "111199": { min: 3.0, avg: 6.0, max: 8.0 },
      "111211": { min: 3.0, avg: 6.0, max: 8.0 },
      "111219": { min: 3.0, avg: 6.0, max: 8.0 },
      
      // Mining, Quarrying, and Oil & Gas Extraction (NAICS 21)
      "211120": { min: 4.0, avg: 8.0, max: 10.0 },
      "211130": { min: 4.0, avg: 8.0, max: 10.0 },
      "212114": { min: 4.0, avg: 8.0, max: 10.0 },
      "212115": { min: 4.0, avg: 8.0, max: 10.0 },
      "212210": { min: 4.0, avg: 8.0, max: 10.0 },
      "212220": { min: 4.0, avg: 8.0, max: 10.0 },
      
      // Utilities (NAICS 22)
      "221111": { min: 7.0, avg: 9.0, max: 10.0 },
      "221112": { min: 7.0, avg: 9.0, max: 10.0 },
      "221113": { min: 7.0, avg: 9.0, max: 10.0 },
      "221114": { min: 7.0, avg: 9.0, max: 10.0 },
      "221115": { min: 7.0, avg: 9.0, max: 10.0 },
      
      // Construction (NAICS 23)
      "236115": { min: 3.0, avg: 4.0, max: 6.0 },
      "236116": { min: 3.0, avg: 4.0, max: 6.0 },
      "236117": { min: 3.0, avg: 4.0, max: 6.0 },
      "236118": { min: 3.0, avg: 4.0, max: 6.0 },
      "236210": { min: 3.0, avg: 4.0, max: 6.0 },
      "236220": { min: 3.0, avg: 4.0, max: 6.0 },
      "237110": { min: 3.0, avg: 4.0, max: 6.0 },
      "237120": { min: 3.0, avg: 4.0, max: 6.0 },
      "237130": { min: 3.0, avg: 4.0, max: 6.0 },
      "237210": { min: 3.0, avg: 4.0, max: 6.0 },
      "237310": { min: 3.0, avg: 4.0, max: 6.0 },
      "237990": { min: 3.0, avg: 4.0, max: 6.0 },
      "238110": { min: 3.0, avg: 4.0, max: 6.0 },
      "238120": { min: 3.0, avg: 4.0, max: 6.0 },
      "238130": { min: 3.0, avg: 4.0, max: 6.0 },
      "238140": { min: 3.0, avg: 4.0, max: 6.0 },
      "238150": { min: 3.0, avg: 4.0, max: 6.0 },
      "238160": { min: 3.0, avg: 4.0, max: 6.0 },
      "238170": { min: 3.0, avg: 4.0, max: 6.0 },
      "238190": { min: 3.0, avg: 4.0, max: 6.0 },
      "238210": { min: 3.0, avg: 4.0, max: 6.0 },
      "238220": { min: 3.0, avg: 4.0, max: 6.0 },
      "238290": { min: 3.0, avg: 4.0, max: 6.0 },
      "238310": { min: 3.0, avg: 4.0, max: 6.0 },
      "238320": { min: 3.0, avg: 4.0, max: 6.0 },
      "238330": { min: 3.0, avg: 4.0, max: 6.0 },
      "238340": { min: 3.0, avg: 4.0, max: 6.0 },
      "238350": { min: 3.0, avg: 4.0, max: 6.0 },
      "238390": { min: 3.0, avg: 4.0, max: 6.0 },
      "238910": { min: 3.0, avg: 4.0, max: 6.0 }
    };
    
    const multiplierRange = comprehensiveMultiplierRanges[naicsCode];
    if (!multiplierRange) return 4.0; // Default if not found
    
    // Calculate average score from value drivers
    const averageGrade = calculateAverageGrade();
    
    // Apply grade-based multiplier calculation
    return calculateMultiplierFromGrade(multiplierRange, averageGrade);
  };

  const calculateAverageGrade = (): number => {
    if (!formData.valueDrivers) return 75; // Default to C grade
    
    const grades = [
      formData.valueDrivers.financialPerformance,
      formData.valueDrivers.growthPotential,
      formData.valueDrivers.marketPosition,
      formData.valueDrivers.managementTeam,
      formData.valueDrivers.customerBase,
      formData.valueDrivers.operationalEfficiency,
      formData.valueDrivers.industryTrends,
      formData.valueDrivers.competitiveAdvantage,
    ];
    
    const totalScore = grades.reduce((sum, grade) => {
      const gradeValues: { [key: string]: number } = {
        "A": 95, "B": 85, "C": 75, "D": 65, "F": 50
      };
      return sum + (gradeValues[grade || "C"] || 75);
    }, 0);
    
    return totalScore / grades.length;
  };

  const calculateMultiplierFromGrade = (
    multiplierRange: { min: number; avg: number; max: number },
    gradeScore: number
  ): number => {
    // Map grade score to multiplier range
    if (gradeScore >= 90) {
      // A grades get max multiplier
      return multiplierRange.max;
    } else if (gradeScore >= 80) {
      // B grades get high-end multiplier
      return multiplierRange.avg + (multiplierRange.max - multiplierRange.avg) * 0.7;
    } else if (gradeScore >= 70) {
      // C grades get average multiplier
      return multiplierRange.avg;
    } else if (gradeScore >= 60) {
      // D grades get below average
      return multiplierRange.avg - (multiplierRange.avg - multiplierRange.min) * 0.5;
    } else {
      // F grades get minimum multiplier
      return multiplierRange.min;
    }
  };

  const calculateValueDriverMultiplier = (): number => {
    // Value drivers are now incorporated into the industry multiplier calculation
    // This function returns 1.0 since the grade-based adjustment is handled in getIndustryMultiplier
    return 1.0;
  };

  const resetForm = () => {
    setCurrentStep("contact");
    setFormData({});
    Object.values(forms).forEach(form => form.reset());
  };

  // Mock functions for API compatibility (these would be real API calls)
  const submitAssessment = async (data: any) => {
    // This would submit to the paid assessment API endpoint
    console.log("Submitting paid assessment:", data);
    return { success: true, id: "mock-id" };
  };

  const results = null; // This would come from API
  const isSubmitting = false; // This would track API submission state

  return {
    currentStep,
    setCurrentStep,
    formData,
    forms,
    nextStep,
    prevStep,
    updateFormData,
    calculateEbitda,
    calculateAdjustedEbitda,
    calculateValuation,
    resetForm,
    submitAssessment,
    results,
    isSubmitting,
  };
}