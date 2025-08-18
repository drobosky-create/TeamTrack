import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box, Typography, Button, Badge, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import MDBox from "@/components/MD/MDBox";
import MDButton from "@/components/MD/MDButton";
import MDTypography from "@/components/MD/MDTypography";
import { ArrowLeft, Shield, Star, Building2, TrendingUp, DollarSign, FileText, Calculator, Zap, BarChart3 } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import calculateValuation from "@/utils/valuationEngine";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AICoachingTips from '@/components/AICoachingTips';

// Create CardTitle component since it's missing from MUI
const CardTitle = ({ children, ...props }: any) => (
  <Typography variant="h6" component="div" {...props}>
    {children}
  </Typography>
);

// Paid Assessment Stepper Component
const PaidAssessmentStepper = ({ activeStep }: { activeStep: number }) => {
  const steps = [
    { label: 'Industry', icon: TrendingUp, color: '#0b2147' },
    { label: 'Financials', icon: DollarSign, color: '#0b2147' },
    { label: 'Adjustments', icon: Zap, color: '#0b2147' },
    { label: 'Value Drivers', icon: Star, color: '#0b2147' },
    { label: 'Complete', icon: FileText, color: '#0b2147' }
  ];

  return (
    <Box 
      sx={{ 
        width: '95%',
        margin: '0 auto',
        mb: -2, // Negative margin to overlap the white form card
        position: 'relative',
        zIndex: 2 // Ensure it sits above the form card
      }}
    >
      {/* Navy Pillbox Container */}
      <Box
        sx={{
          backgroundColor: '#0A1F44',
          borderRadius: '25px',
          padding: '16px 24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            
            return (
              <Box key={step.label} sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1
              }}>
                <Box sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isActive || isCompleted ? '#ffffff' : '#fff',
                  color: isActive || isCompleted ? '#0A1F44' : '#B0B7C3',
                  border: '2px solid',
                  borderColor: isCompleted ? '#ffffff' : '#E0E0E0',
                  mb: 1,
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  {isCompleted ? '✓' : index + 1}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                  }}
                >
                  {step.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

// Type definitions for NAICS data
interface NAICSIndustry {
  code: string;
  title: string;
  label: string;
  multiplier: {
    min: number;
    avg: number;
    max: number;
  };
  level: number;
  sectorCode: string;
}

interface NAICSSector {
  code: string;
  title: string;
}

interface StripeProduct {
  id: string;
  name: string;
  description: string;
  price: {
    id: string;
    amount: number;
    currency: string;
  } | null;
}

function GrowthExitAssessment() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Fetch products from Stripe for dynamic pricing
  const { data: productsData } = useQuery({
    queryKey: ['/api/stripe/products'],
    retry: false,
  });

  // Helper function to format price
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  // Find Growth product from Stripe data
  const growthProduct = productsData?.products?.find((p: StripeProduct) => 
    p.name?.toLowerCase().includes('growth') || p.id === 'prod_Sddbk2RWzr8kyL'
  );

  const growthPrice = growthProduct?.price ? 
    formatPrice(growthProduct.price.amount, growthProduct.price.currency) : 
    '$795';

  const [formData, setFormData] = useState({
    primarySector: "",
    specificIndustry: "",
    naicsCode: "", // Will store the full 6-digit NAICS code
    sectorCode: "", // Will store the 2-digit sector code
    businessDescription: "",
    yearsInBusiness: "",
    numberOfEmployees: "",
    financials: {
      annualRevenue: "",
      costOfGoodsSold: "",
      operatingExpenses: ""
    },
    adjustments: {
      ownerSalary: "",
      personalExpenses: "",
      oneTimeExpenses: "",
      otherAdjustments: ""
    },
    valueDrivers: {
      "driver-financial-performance-1": "",
      "driver-financial-performance-2": "",
      "driver-recurring-revenue-1": "",
      "driver-recurring-revenue-2": "",
      "driver-growth-potential-1": "",
      "driver-growth-potential-2": "",
      "driver-owner-dependency-1": "",
      "driver-owner-dependency-2": "",
      "driver-revenue-diversity-1": "",
      "driver-revenue-diversity-2": "",
      "driver-customer-satisfaction-1": "",
      "driver-customer-satisfaction-2": "",
      "driver-operational-independence-1": "",
      "driver-operational-independence-2": "",
      "driver-scalability-1": "",
      "driver-scalability-2": "",
      "driver-team-talent-1": "",
      "driver-team-talent-2": "",
      "driver-differentiation-1": "",
      "driver-differentiation-2": ""
    }
  });

  // Load previous assessment data to pre-fill form
  useEffect(() => {
    console.log('PRE-FILL USEEFFECT STARTED - Attempting to load previous data...');
    
    const loadPreviousData = async () => {
      try {
        console.log('Step 1: Checking localStorage...');
        // First, try to load from localStorage (from a previous session)
        const savedData = localStorage.getItem('freeAssessmentData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('Loading saved assessment data:', parsedData);
          
          // Transform the saved data structure to match our form
          if (parsedData.company || parsedData.annualRevenue || parsedData.ebitda) {
            console.log('Pre-filling from localStorage...');
            setFormData(prev => ({
              ...prev,
              financials: {
                annualRevenue: parsedData.annualRevenue || "",
                costOfGoodsSold: "", // We'll need to calculate this
                operatingExpenses: parsedData.operatingExpenses || ""
              },
              // If we have EBITDA but not cost of goods sold, calculate it
              adjustments: {
                ownerSalary: parsedData.ownerSalary || "",
                personalExpenses: "",
                oneTimeExpenses: "",
                otherAdjustments: ""
              }
            }));
            return; // Exit early if we found localStorage data
          }
        }
        
        console.log('Step 2: Fetching from API...');
        // Also try to fetch the latest assessment from the API
        const response = await fetch('/api/assessments');
        console.log('API Response status:', response.status, response.ok);
        
        if (response.ok) {
          const assessments = await response.json();
          console.log('Fetched assessments:', assessments?.length || 0, 'total');
          
          if (assessments && assessments.length > 0) {
            // Get the most recent assessment
            const latestAssessment = assessments
              .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
            
            console.log('Latest assessment for pre-fill:', latestAssessment);
            
            // Pre-fill with data from the latest assessment
            if (latestAssessment && latestAssessment.adjustedEbitda) {
              // Calculate revenue from EBITDA and estimated expenses if available
              const adjustedEbitda = parseFloat(latestAssessment.adjustedEbitda) || 0;
              // Use a more realistic revenue calculation: EBITDA is typically 10-20% of revenue
              const estimatedRevenue = adjustedEbitda > 0 ? Math.round(adjustedEbitda / 0.15) : 0; // Assume 15% EBITDA margin
              const estimatedOperatingExpenses = adjustedEbitda > 0 ? Math.round(adjustedEbitda * 0.3) : 0; // Conservative estimate
              
              console.log('CALCULATING PRE-FILL DATA:', {
                adjustedEbitda,
                estimatedRevenue,
                estimatedOperatingExpenses
              });
              
              console.log('SETTING FORM DATA NOW...');
              setFormData(prev => {
                const newData = {
                  ...prev,
                  financials: {
                    annualRevenue: estimatedRevenue.toString(),
                    costOfGoodsSold: Math.round(estimatedRevenue * 0.4).toString(), // Typical 40% COGS
                    operatingExpenses: estimatedOperatingExpenses.toString()
                  },
                  adjustments: {
                    ownerSalary: "75000", // Reasonable owner salary
                    personalExpenses: "5000",
                    oneTimeExpenses: "0",
                    otherAdjustments: "0"
                  }
                };
                console.log('NEW FORM DATA SET:', newData.financials);
                return newData;
              });
            } else {
              console.log('No usable assessment data found');
            }
          } else {
            console.log('No assessments found in response');
          }
        } else {
          console.log('API request failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error loading previous assessment data:', error);
      }
    };
    
    loadPreviousData();
  }, []);
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedSectorCode, setSelectedSectorCode] = useState("");
  const totalSteps = 5;

  // Comprehensive Value Driver Questions (10 drivers, 2 questions each)
  const valuationQuestions = [
    {
      id: "driver-financial-performance-1",
      question: "How profitable is your business compared to industry benchmarks?",
      options: ["Not profitable", "Below average", "Average", "Above average", "Top-tier"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Financial Performance"
    },
    {
      id: "driver-financial-performance-2",
      question: "What is your adjusted net profit margin?",
      options: ["< 5%", "5–10%", "11–15%", "16–20%", "> 20%"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Financial Performance"
    },
    {
      id: "driver-recurring-revenue-1",
      question: "What percentage of your revenue is recurring (contracts, subscriptions)?",
      options: ["0%", "1–25%", "26–50%", "51–75%", "76–100%"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Recurring Revenue"
    },
    {
      id: "driver-recurring-revenue-2",
      question: "How secure are your recurring revenue contracts?",
      options: ["No contracts", "Month-to-month", "Annual, not auto-renew", "Annual with auto-renew", "Multi-year, auto-renew"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Recurring Revenue"
    },
    {
      id: "driver-growth-potential-1",
      question: "How much do you expect your revenue to grow in the next 12 months?",
      options: ["Decrease", "Flat", "1–10%", "11–30%", "Over 30%"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Growth Potential"
    },
    {
      id: "driver-growth-potential-2",
      question: "How many new customers can you reasonably acquire this year?",
      options: ["None", "1–10", "11–50", "51–100", "Over 100"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Growth Potential"
    },
    {
      id: "driver-owner-dependency-1",
      question: "Could your business run for 90 days without your involvement?",
      options: ["No", "Barely", "Somewhat", "Mostly", "Yes, seamlessly"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Owner Dependency"
    },
    {
      id: "driver-owner-dependency-2",
      question: "How often do customers request to work directly with the owner?",
      options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Owner Dependency"
    },
    {
      id: "driver-revenue-diversity-1",
      question: "What % of your revenue comes from your single largest customer?",
      options: [">50%", "26–50%", "11–25%", "6–10%", "<5%"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Revenue Diversity"
    },
    {
      id: "driver-revenue-diversity-2",
      question: "How many different customer segments do you serve?",
      options: ["1", "2", "3", "4", "5 or more"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Revenue Diversity"
    },
    {
      id: "driver-customer-satisfaction-1",
      question: "What percentage of your customers are 'very satisfied'?",
      options: ["<25%", "25–50%", "51–75%", "76–90%", ">90%"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Customer Satisfaction"
    },
    {
      id: "driver-customer-satisfaction-2",
      question: "How often do customers refer others to your company?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Customer Satisfaction"
    },
    {
      id: "driver-operational-independence-1",
      question: "How standardized are your internal processes and SOPs?",
      options: ["None exist", "Some documentation", "Basic SOPs exist", "Well-documented", "Automated and trained"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Operational Independence"
    },
    {
      id: "driver-operational-independence-2",
      question: "How easily can you delegate critical business functions?",
      options: ["Impossible", "Very difficult", "Somewhat difficult", "Fairly easy", "Very easy"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Operational Independence"
    },
    {
      id: "driver-scalability-1",
      question: "If demand grew 5x, how easily could your company fulfill it?",
      options: ["Impossible", "Very difficult", "Fairly difficult", "Fairly easy", "Very easy"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Scalability"
    },
    {
      id: "driver-scalability-2",
      question: "How easily could your business be replicated in another market?",
      options: ["Impossible", "Very difficult", "Fairly difficult", "Fairly easy", "Very easy"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Scalability"
    },
    {
      id: "driver-team-talent-1",
      question: "How strong is your current leadership team?",
      options: ["None", "1 manager", "A few informal leaders", "Defined department heads", "Full team with long-term incentives"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Team & Talent"
    },
    {
      id: "driver-team-talent-2",
      question: "How difficult would it be to replace your top-performing team member?",
      options: ["Impossible", "Very difficult", "Fairly difficult", "Fairly easy", "Very easy"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Team & Talent"
    },
    {
      id: "driver-differentiation-1",
      question: "How unique is your core product or service?",
      options: ["Commodity", "Some competitors", "Moderately unique", "Very unique", "One-of-a-kind"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Differentiation & Brand Strength"
    },
    {
      id: "driver-differentiation-2",
      question: "How well recognized is your brand in the market?",
      options: ["Not at all", "Somewhat", "Recognized locally", "Known regionally", "Category leader"],
      weights: [0, 1, 2, 3, 5],
      valueDriver: "Differentiation & Brand Strength"
    }
  ];

  // Fetch all 2-digit sectors from comprehensive API
  const { data: sectors = [], isLoading: sectorsLoading } = useQuery<NAICSSector[]>({
    queryKey: ['/api/naics/comprehensive/sectors'],
    queryFn: () => fetch('/api/naics/comprehensive/sectors').then(res => res.json()),
    enabled: true
  });

  // Fetch 6-digit industries for selected 2-digit sector from comprehensive database
  const { data: sectorIndustries = [], isLoading: industriesLoading } = useQuery<NAICSIndustry[]>({
    queryKey: ['/api/naics/comprehensive/by-sector', selectedSectorCode],
    queryFn: () => selectedSectorCode ? fetch(`/api/naics/comprehensive/by-sector/${encodeURIComponent(selectedSectorCode)}`).then(res => res.json()) : Promise.resolve([]),
    enabled: !!selectedSectorCode
  });

  // Debug logging for industries
  useEffect(() => {
    if (sectorIndustries && sectorIndustries.length > 0) {
      console.log('Fetched industries for sector', selectedSectorCode, ':', sectorIndustries.length, 'industries');
    }
  }, [sectorIndustries, selectedSectorCode]);

  const handleSectorChange = (sectorValue: string) => {
    // Parse the sector value to extract both code and title
    const sector = sectors.find(s => s.code === sectorValue);
    if (sector) {
      console.log('Selected sector:', sector.code, sector.title);
      setSelectedSector(sector.title);
      setSelectedSectorCode(sector.code);
      // Reset industry selection when sector changes
      setFormData(prev => ({ 
        ...prev, 
        primarySector: sector.title,
        specificIndustry: ""
      }));
    }
  };

  const handleIndustryChange = (industryCode: string) => {
    // Find the selected industry to get its title
    const industry = sectorIndustries.find((i: NAICSIndustry) => i.code === industryCode);
    if (industry) {
      setFormData(prev => ({ 
        ...prev, 
        specificIndustry: industry.title,
        naicsCode: industryCode, // Store the 4-digit code
        sectorCode: selectedSectorCode // Store the 2-digit sector code
      }));
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    setLocation("/");
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaygateClick = () => {
    // Save assessment data to localStorage for later processing
    localStorage.setItem('growthExitAssessmentData', JSON.stringify(formData));
    
    // Open Apple Bites checkout link for Growth & Exit Assessment
    const checkoutLink = 'https://products.applebites.ai/product-details/product/686c2e0f5f2f1191edb09737';
    
    // Open payment link in new window/tab
    window.open(checkoutLink, '_blank');
  };

  // Helper functions for Value Drivers step
  const handleValueDriverChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      valueDrivers: {
        ...prev.valueDrivers,
        [questionId]: value
      }
    }));
  };

  const calculateBaseMultiplier = () => {
    if (!formData.naicsCode) return "4.0";
    
    // This would typically fetch from the comprehensive NAICS database
    // For now, return a realistic base multiplier
    return "4.5";
  };

  const calculateTotalScore = () => {
    if (!formData.valueDrivers) return 0;
    
    const scores = Object.values(formData.valueDrivers);
    return scores.reduce((sum: number, score: string) => {
      const numericScore = parseInt(score) || 0;
      return sum + numericScore;
    }, 0);
  };

  const calculateMultiplierAdjustment = () => {
    const totalScore = calculateTotalScore();
    const maxScore = 20; // 4 questions × 5 points each
    const scorePercentage = totalScore / maxScore;
    
    // Convert percentage to multiplier adjustment
    // 0% = -1.0x, 50% = 0.0x, 100% = +1.0x
    const adjustment = (scorePercentage - 0.5) * 2;
    return adjustment.toFixed(1);
  };

  const calculateFinalMultiplier = () => {
    const baseMultiplier = parseFloat(calculateBaseMultiplier());
    const adjustment = parseFloat(calculateMultiplierAdjustment());
    const finalMultiplier = baseMultiplier + adjustment;
    return Math.max(finalMultiplier, 1.0).toFixed(1);
  };

  const getValuationResults = () => {
    // Prepare responses array for valuation engine
    const responses = [
      // NAICS code for industry-specific multipliers
      { id: 'naics-code', value: formData.naicsCode, valueDriver: 'Industry', weight: 0 },
      
      // Financial data
      { id: 'financial-1', value: parseFloat(formData.financials.annualRevenue) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'financial-2', value: parseFloat(formData.financials.costOfGoodsSold) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'financial-3', value: parseFloat(formData.financials.operatingExpenses) || 0, valueDriver: 'Financial Performance', weight: 0 },
      
      // Adjustments
      { id: 'adjustments-1', value: parseFloat(formData.adjustments.ownerSalary) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'adjustments-2', value: parseFloat(formData.adjustments.personalExpenses) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'adjustments-3', value: parseFloat(formData.adjustments.oneTimeExpenses) || 0, valueDriver: 'Financial Performance', weight: 0 },
      { id: 'adjustments-4', value: parseFloat(formData.adjustments.otherAdjustments) || 0, valueDriver: 'Financial Performance', weight: 0 }
    ];
    
    // Add all 20 value driver responses
    Object.keys(formData.valueDrivers).forEach(driverId => {
      const value = formData.valueDrivers[driverId];
      if (value) {
        const question = valuationQuestions.find(q => q.id === driverId);
        if (question) {
          responses.push({
            id: driverId,
            valueDriver: question.valueDriver,
            weight: parseInt(value),
            value: parseInt(value)
          });
        }
      }
    });

    return calculateValuation(responses);
  };

  const getIndustryComparisonData = () => {
    const valuationResults = getValuationResults();
    const userMultiple = valuationResults.ebitda > 0 ? 
      (valuationResults.valuation.mean / valuationResults.ebitda) : 0;
    
    // Get industry multiplier from NAICS code
    const getIndustryMultiplier = (naicsCode) => {
      const naicsMultipliers = {
        // Construction (23)
        "236115": { low: 2.5, high: 5.0, avg: 3.8 },
        "236116": { low: 2.5, high: 5.0, avg: 3.8 },
        "236117": { low: 2.5, high: 5.0, avg: 3.8 },
        "236118": { low: 2.5, high: 5.0, avg: 3.8 },
        "236210": { low: 3.0, high: 6.0, avg: 4.5 },
        "236220": { low: 3.0, high: 6.0, avg: 4.5 },
        "237110": { low: 2.0, high: 4.5, avg: 3.3 },
        "237120": { low: 2.0, high: 4.5, avg: 3.3 },
        "237130": { low: 2.0, high: 4.5, avg: 3.3 },
        "237210": { low: 2.0, high: 4.5, avg: 3.3 },
        "237310": { low: 2.0, high: 4.5, avg: 3.3 },
        "237990": { low: 2.0, high: 4.5, avg: 3.3 },
        "238110": { low: 3.0, high: 6.0, avg: 4.5 },
        "238120": { low: 3.0, high: 6.0, avg: 4.5 },
        "238130": { low: 3.0, high: 6.0, avg: 4.5 },
        "238140": { low: 3.0, high: 6.0, avg: 4.5 },
        "238150": { low: 3.0, high: 6.0, avg: 4.5 },
        "238160": { low: 3.0, high: 6.0, avg: 4.5 },
        "238170": { low: 3.0, high: 6.0, avg: 4.5 },
        "238210": { low: 3.5, high: 7.0, avg: 5.3 },
        "238220": { low: 3.5, high: 7.0, avg: 5.3 },
        "238290": { low: 3.0, high: 6.0, avg: 4.5 },
        "238310": { low: 3.0, high: 6.0, avg: 4.5 },
        "238320": { low: 3.0, high: 6.0, avg: 4.5 },
        "238330": { low: 3.0, high: 6.0, avg: 4.5 },
        "238340": { low: 3.0, high: 6.0, avg: 4.5 },
        "238350": { low: 3.0, high: 6.0, avg: 4.5 },
        "238390": { low: 3.0, high: 6.0, avg: 4.5 },
        "238910": { low: 2.5, high: 5.0, avg: 3.8 },
        "238990": { low: 2.5, high: 5.0, avg: 3.8 },
        
        // Professional Services (54)
        "541110": { low: 4.0, high: 8.0, avg: 6.0 },
        "541191": { low: 4.0, high: 8.0, avg: 6.0 },
        "541199": { low: 4.0, high: 8.0, avg: 6.0 },
        "541211": { low: 5.0, high: 10.0, avg: 7.5 },
        "541213": { low: 4.0, high: 8.0, avg: 6.0 },
        "541214": { low: 4.0, high: 8.0, avg: 6.0 },
        "541219": { low: 4.0, high: 8.0, avg: 6.0 },
        "541310": { low: 3.5, high: 7.0, avg: 5.3 },
        "541320": { low: 3.5, high: 7.0, avg: 5.3 },
        "541330": { low: 3.5, high: 7.0, avg: 5.3 },
        "541340": { low: 3.5, high: 7.0, avg: 5.3 },
        "541350": { low: 3.5, high: 7.0, avg: 5.3 },
        "541360": { low: 3.5, high: 7.0, avg: 5.3 },
        "541370": { low: 3.5, high: 7.0, avg: 5.3 },
        "541380": { low: 3.5, high: 7.0, avg: 5.3 },
        "541410": { low: 4.5, high: 9.0, avg: 6.8 },
        "541420": { low: 4.0, high: 8.0, avg: 6.0 },
        "541430": { low: 4.0, high: 8.0, avg: 6.0 },
        "541490": { low: 4.0, high: 8.0, avg: 6.0 },
        "541511": { low: 5.0, high: 12.0, avg: 8.5 },
        "541512": { low: 5.0, high: 12.0, avg: 8.5 },
        "541513": { low: 4.0, high: 9.0, avg: 6.5 },
        "541519": { low: 4.0, high: 9.0, avg: 6.5 },
        "541611": { low: 4.0, high: 8.0, avg: 6.0 },
        "541612": { low: 4.0, high: 8.0, avg: 6.0 },
        "541613": { low: 4.0, high: 8.0, avg: 6.0 },
        "541614": { low: 4.0, high: 8.0, avg: 6.0 },
        "541618": { low: 4.0, high: 8.0, avg: 6.0 },
        "541620": { low: 3.5, high: 7.0, avg: 5.3 },
        "541690": { low: 3.5, high: 7.0, avg: 5.3 },
        "541711": { low: 3.0, high: 6.0, avg: 4.5 },
        "541712": { low: 3.0, high: 6.0, avg: 4.5 },
        "541720": { low: 3.0, high: 6.0, avg: 4.5 },
        "541810": { low: 4.0, high: 8.0, avg: 6.0 },
        "541820": { low: 4.0, high: 8.0, avg: 6.0 },
        "541830": { low: 4.0, high: 8.0, avg: 6.0 },
        "541840": { low: 4.0, high: 8.0, avg: 6.0 },
        "541850": { low: 3.5, high: 7.0, avg: 5.3 },
        "541860": { low: 4.0, high: 8.0, avg: 6.0 },
        "541870": { low: 4.0, high: 8.0, avg: 6.0 },
        "541890": { low: 4.0, high: 8.0, avg: 6.0 },
        "541910": { low: 4.0, high: 8.0, avg: 6.0 },
        "541921": { low: 4.5, high: 9.0, avg: 6.8 },
        "541922": { low: 4.0, high: 8.0, avg: 6.0 },
        "541930": { low: 3.5, high: 7.0, avg: 5.3 },
        "541940": { low: 4.0, high: 8.0, avg: 6.0 },
        "541990": { low: 3.5, high: 7.0, avg: 5.3 }
      };
      
      // Sector defaults if specific NAICS not found
      const sectorDefaults = {
        "11": { low: 3.0, high: 6.0, avg: 4.5 },
        "21": { low: 2.0, high: 4.0, avg: 3.0 },
        "22": { low: 3.0, high: 6.0, avg: 4.5 },
        "23": { low: 2.5, high: 5.5, avg: 4.0 },
        "31": { low: 2.5, high: 5.0, avg: 3.8 },
        "42": { low: 3.0, high: 6.0, avg: 4.5 },
        "44": { low: 2.0, high: 4.0, avg: 3.0 },
        "48": { low: 2.0, high: 4.5, avg: 3.3 },
        "51": { low: 4.0, high: 8.0, avg: 6.0 },
        "52": { low: 3.0, high: 6.0, avg: 4.5 },
        "53": { low: 3.5, high: 7.0, avg: 5.3 },
        "54": { low: 4.0, high: 8.0, avg: 6.0 },
        "55": { low: 4.0, high: 8.0, avg: 6.0 },
        "56": { low: 3.0, high: 6.0, avg: 4.5 },
        "61": { low: 3.0, high: 6.0, avg: 4.5 },
        "62": { low: 3.5, high: 7.0, avg: 5.3 },
        "71": { low: 2.5, high: 5.0, avg: 3.8 },
        "72": { low: 2.0, high: 4.0, avg: 3.0 },
        "81": { low: 2.5, high: 5.0, avg: 3.8 },
        "92": { low: 2.0, high: 4.0, avg: 3.0 }
      };
      
      if (naicsCode && naicsMultipliers[naicsCode]) {
        return naicsMultipliers[naicsCode];
      }
      
      if (naicsCode && naicsCode.length >= 2) {
        const sectorCode = naicsCode.substring(0, 2);
        if (sectorDefaults[sectorCode]) {
          return sectorDefaults[sectorCode];
        }
      }
      
      return { low: 2.0, high: 5.0, avg: 3.5 };
    };
    
    const industryMult = getIndustryMultiplier(formData.naicsCode);
    const selectedIndustry = sectorIndustries?.find(i => i.code === formData.naicsCode);
    
    return [
      {
        name: 'Industry Low',
        value: industryMult.low,
        fill: '#ef4444'
      },
      {
        name: 'Industry Average',
        value: industryMult.avg,
        fill: '#3b82f6'
      },
      {
        name: 'Your Business',
        value: Math.round(userMultiple * 10) / 10,
        fill: '#10b981'
      },
      {
        name: 'Industry High',
        value: industryMult.high,
        fill: '#8b5cf6'
      }
    ];
  };

  const getValueDriversProgress = () => {
    if (!formData.valueDrivers) return 0;
    return Object.values(formData.valueDrivers).filter(val => val && val.length > 0).length;
  };

  const getValueDriversByCategory = () => {
    const categories = {};
    valuationQuestions.forEach(question => {
      if (!categories[question.valueDriver]) {
        categories[question.valueDriver] = [];
      }
      categories[question.valueDriver].push({
        id: question.id,
        question: question.question,
        value: formData.valueDrivers[question.id] || "",
        weight: parseInt(formData.valueDrivers[question.id]) || 0
      });
    });
    return categories;
  };

  const getValueDriversScores = () => {
    const categories = getValueDriversByCategory();
    const scores = {};
    
    Object.keys(categories).forEach(category => {
      const questions = categories[category];
      const totalScore = questions.reduce((sum, q) => sum + q.weight, 0);
      const avgScore = questions.length > 0 ? totalScore / questions.length : 0;
      scores[category] = avgScore;
    });
    
    return scores;
  };

  const calculateEBITDA = () => {
    const revenue = parseFloat(formData.financials.annualRevenue) || 0;
    const cogs = parseFloat(formData.financials.costOfGoodsSold) || 0;
    const opex = parseFloat(formData.financials.operatingExpenses) || 0;
    return revenue - cogs - opex;
  };

  const calculateAdjustedEBITDA = () => {
    const baseEBITDA = calculateEBITDA();
    const ownerSalary = parseFloat(formData.adjustments.ownerSalary) || 0;
    const personalExpenses = parseFloat(formData.adjustments.personalExpenses) || 0;
    const oneTimeExpenses = parseFloat(formData.adjustments.oneTimeExpenses) || 0;
    const otherAdjustments = parseFloat(formData.adjustments.otherAdjustments) || 0;
    
    return baseEBITDA + ownerSalary + personalExpenses + oneTimeExpenses + otherAdjustments;
  };

  const renderProgressBar = () => {
    const progress = (currentStep / totalSteps) * 100;
    return (
      <div >
        <div 
          
          style={{ width: `${progress}%` }}
        ></div>
        <div >
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <MDBox>
            <MDBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <MDBox sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #00718d 0%, #0A1F44 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={24} color="white" />
              </MDBox>
              <MDBox>
                <MDTypography variant="h5" fontWeight="bold" gutterBottom>
                  Industry Classification
                </MDTypography>
                <MDTypography variant="body2" color="text.secondary">
                  Select your business sector and specific industry
                </MDTypography>
              </MDBox>
            </MDBox>
            
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              <FormControl fullWidth>
                <InputLabel>Primary Sector *</InputLabel>
                <Select
                  value={selectedSectorCode}
                  onChange={(e) => handleSectorChange(e.target.value)}
                  disabled={sectorsLoading}
                  label="Primary Sector *"
                >
                  <MenuItem value="">{sectorsLoading ? 'Loading sectors...' : 'Select a sector...'}</MenuItem>
                  {sectors.map((sector) => (
                    <MenuItem key={sector.code} value={sector.code}>
                      {sector.code} – {sector.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth disabled={!selectedSectorCode || industriesLoading}>
                <InputLabel>Specific Industry *</InputLabel>
                <Select
                  value={formData.naicsCode || ""}
                  onChange={(e) => handleIndustryChange(e.target.value)}
                  label="Specific Industry *"
                >
                  {!selectedSectorCode ? (
                    <MenuItem value="">First select a sector above...</MenuItem>
                  ) : industriesLoading ? (
                    <MenuItem value="">Loading industries...</MenuItem>
                  ) : (
                    <>
                      <MenuItem value="">Select your industry...</MenuItem>
                      {sectorIndustries.map((industry: NAICSIndustry) => (
                        <MenuItem key={industry.code} value={industry.code}>
                          {industry.title}
                        </MenuItem>
                      ))}
                    </>
                  )}
                </Select>
              </FormControl>
              
              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <TextField
                  fullWidth
                  label="Business Description *"
                  multiline
                  rows={4}
                  placeholder="Describe your business operations, products/services, and target market..."
                  variant="outlined"
                  value={formData.businessDescription}
                  onChange={(e) => handleFormChange('businessDescription', e.target.value)}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Years in Business"
                type="number"
                placeholder="5"
                variant="outlined"
                value={formData.yearsInBusiness}
                onChange={(e) => handleFormChange('yearsInBusiness', e.target.value)}
              />
              
              <TextField
                fullWidth
                label="Number of Employees"
                type="number"
                placeholder="25"
                variant="outlined"
                value={formData.numberOfEmployees}
                onChange={(e) => handleFormChange('numberOfEmployees', e.target.value)}
              />
            </Box>
          </MDBox>
        );

      case 2:
        return (
          <MDBox>
            <MDBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <MDBox sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #00718d 0%, #0A1F44 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={24} color="white" />
              </MDBox>
              <MDBox>
                <MDTypography variant="h5" fontWeight="bold" gutterBottom>
                  Financial Information
                </MDTypography>
                <MDTypography variant="body2" color="text.secondary">
                  Provide your key financial metrics
                </MDTypography>
              </MDBox>
            </MDBox>
            
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <TextField
                  fullWidth
                  label="Annual Revenue (Last 12 Months) *"
                  type="number"
                  placeholder="1000000"
                  variant="outlined"
                  value={formData.financials.annualRevenue}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    financials: { ...prev.financials, annualRevenue: e.target.value }
                  }))}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Cost of Goods Sold (COGS)"
                type="number"
                placeholder="400000"
                variant="outlined"
                value={formData.financials.costOfGoodsSold}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  financials: { ...prev.financials, costOfGoodsSold: e.target.value }
                }))}
              />
              
              <TextField
                fullWidth
                label="Total Operating Expenses *"
                type="number"
                placeholder="350000"
                variant="outlined"
                value={formData.financials.operatingExpenses}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  financials: { ...prev.financials, operatingExpenses: e.target.value }
                }))}
              />
              
              <Box sx={{ 
                gridColumn: { xs: '1', md: '1 / -1' },
                mt: 2,
                p: 2,
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Calculator size={24} color="#0A1F44" />
                <Box>
                  <MDTypography variant="body2" color="text.secondary">
                    Calculated EBITDA
                  </MDTypography>
                  <MDTypography variant="h6" fontWeight="bold" color="#0A1F44">
                    ${calculateEBITDA().toLocaleString()}
                  </MDTypography>
                  <MDTypography variant="body2" color="text.secondary">
                    This will be refined with your adjustments
                  </MDTypography>
                </Box>
              </Box>
            </Box>
          </MDBox>
        );

      case 3:
        return (
          <Card >
            <CardHeader >
              <div >
                <Zap  />
              </div>
              <Typography variant="h6" component="div">EBITDA Adjustments</Typography>
              <p >Normalize your earnings for valuation</p>
            </CardHeader>
            <CardContent >
              <div>
                <label >Owner's Salary Above Market Rate</label>
                <input 
                  type="number" 
                  value={formData.adjustments.ownerSalary}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adjustments: { ...prev.adjustments, ownerSalary: e.target.value }
                  }))}
                  
                  placeholder="50000"
                />
              </div>
              <div>
                <label >Personal Expenses Run Through Business</label>
                <input 
                  type="number" 
                  value={formData.adjustments.personalExpenses}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adjustments: { ...prev.adjustments, personalExpenses: e.target.value }
                  }))}
                  
                  placeholder="25000"
                />
              </div>
              <div>
                <label >One-Time Expenses</label>
                <input 
                  type="number" 
                  value={formData.adjustments.oneTimeExpenses}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adjustments: { ...prev.adjustments, oneTimeExpenses: e.target.value }
                  }))}
                  
                  placeholder="15000"
                />
              </div>
              <div>
                <label >Other Adjustments</label>
                <input 
                  type="number" 
                  value={formData.adjustments.otherAdjustments}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    adjustments: { ...prev.adjustments, otherAdjustments: e.target.value }
                  }))}
                  
                  placeholder="10000"
                />
              </div>
              <div >
                <div >
                  <TrendingUp  />
                  <span >Adjusted EBITDA</span>
                </div>
                <div >
                  ${calculateAdjustedEBITDA().toLocaleString()}
                </div>
                <p >Ready for value driver analysis</p>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card >
            <CardHeader >
              <div >
                <Star  />
              </div>
              <Typography variant="h6" component="div">Growth & Exit Value Drivers</Typography>
              <p >Answer these questions to assess your business value</p>
            </CardHeader>
            <CardContent >
              {/* Dynamic comprehensive questionnaire */}
              {valuationQuestions.map((question, index) => (
                <div key={question.id} >
                  <div>
                    <label >
                      {question.question}
                    </label>
                  </div>
                  <div >
                    {question.options.map((option, optionIndex) => (
                      <label key={`${question.id}-${optionIndex}`} >
                        <input
                          type="radio"
                          name={question.id}
                          value={question.weights[optionIndex].toString()}
                          checked={formData.valueDrivers[question.id] === question.weights[optionIndex].toString()}
                          onChange={(e) => handleValueDriverChange(question.id, e.target.value)}
                          
                        />
                        <span >{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Progress indicator */}
              <div >
                <div >
                  <Calculator  />
                  <span >
                    Progress: {Object.values(formData.valueDrivers).filter(v => v !== "").length} of {valuationQuestions.length} questions completed
                  </span>
                </div>
                <div >
                  <div 
                    
                    style={{ width: `${(Object.values(formData.valueDrivers).filter(v => v !== "").length / valuationQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Real-time Valuation Preview using Valuation Engine */}
              <div >
                <div >
                  <Calculator  />
                  <span >Live Valuation Analysis</span>
                </div>
                {(() => {
                  const valuationResults = getValuationResults();
                  return (
                    <>
                      <div >
                        <div>
                          <span >Overall Score:</span>
                          <div >{valuationResults.overallScore}/100</div>
                        </div>
                        <div>
                          <span >Adjusted EBITDA:</span>
                          <div >${valuationResults.ebitda?.toLocaleString() || "0"}</div>
                        </div>
                        <div>
                          <span >Value Range:</span>
                          <div >
                            ${valuationResults.valuation?.low?.toLocaleString() || "0"} - ${valuationResults.valuation?.high?.toLocaleString() || "0"}
                          </div>
                        </div>
                      </div>
                      <div >
                        <span >Estimated Business Value:</span>
                        <div >
                          ${valuationResults.valuation?.mean?.toLocaleString() || "0"}
                        </div>
                        <p >
                          Based on comprehensive financial and strategic analysis
                        </p>
                      </div>
                      {valuationResults.recommendations && valuationResults.recommendations.length > 0 && (
                        <div >
                          <span >Improvement Areas:</span>
                          <ul >
                            {valuationResults.recommendations.slice(0, 2).map((rec, idx) => (
                              <li key={idx}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
              
              {/* Progress Indicator */}
              <div >
                <div >
                  <span >Assessment Progress</span>
                  <span >{Object.values(formData.valueDrivers).filter(v => v !== "").length}/{valuationQuestions.length} completed</span>
                </div>
                <div >
                  <div 
                    
                    style={{ width: `${Math.min(100, (Object.values(formData.valueDrivers).filter(v => v !== "").length / valuationQuestions.length) * 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card >
            <CardHeader >
              <div >
                <FileText  />
              </div>
              <Typography variant="h6" component="div">Complete Your Assessment</Typography>
              <p >Review and finalize your strategic valuation</p>
            </CardHeader>
            <CardContent >
              {(() => {
                const valuationResults = getValuationResults();
                const selectedIndustry = sectorIndustries?.find(i => i.code === formData.naicsCode);
                const userMultiple = valuationResults.ebitda > 0 ? 
                  (valuationResults.valuation.mean / valuationResults.ebitda) : 0;
                
                return (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b' }}>
                        Assessment Summary
                      </Typography>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                        gap: 2 
                      }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 'medium' }}>
                              Adjusted EBITDA:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 'bold' }}>
                              ${valuationResults.ebitda?.toLocaleString() || "0"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 'medium' }}>
                              Your Multiple:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 'bold' }}>
                              {userMultiple.toFixed(1)}x
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 'medium' }}>
                              Estimated Value:
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 'bold' }}>
                              ${valuationResults.valuation?.mean?.toLocaleString() || "0"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 'medium' }}>
                              Value Range:
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: '#1e293b', 
                                fontWeight: 'bold',
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                wordBreak: 'break-word'
                              }}
                            >
                              ${valuationResults.valuation?.low?.toLocaleString() || "0"} - ${valuationResults.valuation?.high?.toLocaleString() || "0"}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    {/* Industry Comparison Chart */}
                    <div >
                      <div >
                        <h3 >Estimated Business Value</h3>
                        <div >
                          <p>Low Estimate: <strong >${valuationResults.valuation?.low?.toLocaleString() || "0"}</strong></p>
                          <p>High Estimate: <strong >${valuationResults.valuation?.high?.toLocaleString() || "0"}</strong></p>
                          <p>Mean Estimate: <strong >${valuationResults.valuation?.mean?.toLocaleString() || "0"}</strong></p>
                        </div>
                      </div>
                      
                      <div >
                        <p >
                          Industry: {selectedIndustry?.title || `${formData.naicsCode} – Industry Classification`}
                        </p>
                        <h4 >Industry-Based Valuation Range</h4>
                        
                        {/* Gradient Bar with Indicators */}
                        <div >
                          <div 
                            
                            style={{
                              background: 'linear-gradient(to right, #f44336 0%, #ff9800 25%, #ffc107 50%, #4caf50 75%, #2e7d32 100%)'
                            }}
                          ></div>
                          
                          {/* Indicators */}
                          {(() => {
                            const industryMult = getIndustryComparisonData().find(d => d.name === 'Industry Average')?.value || 4.0;
                            const userPos = Math.min(Math.max(((userMultiple - 2) / (6 - 2)) * 100, 0), 100);
                            const avgPos = Math.min(Math.max(((industryMult - 2) / (6 - 2)) * 100, 0), 100);
                            const strategicPos = 80; // Strategic target at 80% position
                            
                            return (
                              <>
                                {/* You indicator */}
                                <div 
                                  
                                  style={{ left: `${userPos}%` }}
                                >
                                  <div ></div>
                                  <div >
                                    ▲ You
                                  </div>
                                </div>
                                
                                {/* Average indicator */}
                                <div 
                                  
                                  style={{ left: `${avgPos}%` }}
                                >
                                  <div ></div>
                                  <div >
                                    Avg
                                  </div>
                                </div>
                                
                                {/* Strategic indicator */}
                                <div 
                                  
                                  style={{ left: `${strategicPos}%` }}
                                >
                                  <div ></div>
                                  <div >
                                    Target
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                        
                        {/* Range Labels */}
                        <div >
                          <span>Low: 2.0x</span>
                          <span>Avg: {getIndustryComparisonData().find(d => d.name === 'Industry Average')?.value}x</span>
                          <span>High: 6.0x</span>
                        </div>
                      </div>
                      
                      {/* Value Driver Breakdown */}
                      <div >
                        <h4 >Value Driver Breakdown</h4>
                        <div >
                          {(() => {
                            const driverScores = getValueDriversScores();
                            const driverNames = {
                              'Financial Performance': 'Financial Performance',
                              'Growth Potential': 'Growth Potential', 
                              'Market Position': 'Market Position',
                              'Operational Excellence': 'Operational Excellence'
                            };
                            
                            return Object.entries(driverScores).map(([driver, score]) => {
                              const percentage = Math.round((score / 5) * 100);
                              const getBarColor = (pct) => {
                                if (pct >= 75) return 'bg-green-500';
                                if (pct >= 50) return 'bg-blue-500';
                                return 'bg-red-500';
                              };
                              
                              return (
                                <div key={driver} >
                                  <div >
                                    <span >
                                      {driverNames[driver] || driver}
                                    </span>
                                    <span >
                                      {percentage}%
                                    </span>
                                  </div>
                                  <div >
                                    <div 
                                      className={`h-full ${getBarColor(percentage)} transition-all duration-300`}
                                      style={{ width: `${Math.max(percentage, 5)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                      
                      {/* Key Opportunities */}
                      <div >
                        <h4 >Key Opportunities to Improve</h4>
                        <ul >
                          <li>• Enhance your recurring revenue through contracts or subscriptions</li>
                          <li>• Clarify what makes your offering unique or defensible</li>
                          <li>• <Link href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'none' }}>Explore</Link> new geographies or client segments to drive growth</li>
                        </ul>
                      </div>
                    </div>
                    {/* AI Coaching Tips */}
                    <AICoachingTips 
                      financialData={{
                        revenue: parseFloat(formData.financials?.annualRevenue) || 0,
                        ebitda: calculateEBITDA(),
                        adjustedEbitda: calculateAdjustedEBITDA(),
                        naicsCode: formData.naicsCode || '',
                        industryTitle: selectedIndustry?.title || 'Industry Classification',
                        valueDriverScores: getValueDriversScores(),
                        userMultiple: userMultiple,
                        industryAverage: getIndustryComparisonData().find(d => d.name === 'Industry Average')?.value || 4.0,
                        companySize: parseFloat(formData.financials?.annualRevenue || '0') > 10000000 ? 'large' : 
                                   parseFloat(formData.financials?.annualRevenue || '0') > 1000000 ? 'medium' : 'small',
                        businessAge: formData.contact?.foundingYear ? `${new Date().getFullYear() - parseInt(formData.contact.foundingYear)} years` : undefined,
                        employeeCount: parseInt(formData.contact?.employeeCount || '0') || undefined
                      }}
                    />
                  </>
                );
              })()}
              
              <div>
                <label >Additional Comments</label>
                <textarea 
                  
                  placeholder="Any additional information about your business..."
                />
              </div>

              <div >
                <Button 
                  onClick={handlePaygateClick}
                  
                >
                  Get Growth & Exit Assessment - {growthPrice}
                </Button>
                <p >
                  Secure payment processed by Stripe • Includes 60-minute Discovery Call
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      gap: 0,
    }}>
      <Box sx={{
        flexGrow: 1,
        padding: '16px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
      }}>
        {/* Assessment Stepper */}
        <PaidAssessmentStepper activeStep={currentStep - 1} />
        
        <Card sx={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
        }}>
          <CardContent sx={{ p: 3, minHeight: '500px' }}>
            {renderStepContent()}
            
            {/* Navigation buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 4, 
              pt: 3, 
              borderTop: '1px solid #e0e0e0' 
            }}>
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outlined"
                sx={{
                  color: '#0b2147',
                  borderColor: '#0b2147',
                  '&:hover': {
                    backgroundColor: 'rgba(11, 33, 71, 0.04)',
                    borderColor: '#0b2147'
                  },
                  '&:disabled': {
                    opacity: 0.5
                  }
                }}
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #00718d 0%, #0b2147 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00a693 0%, #091d3a 100%)',
                    }
                  }}
                >
                  Continue
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Complete assessment above
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default GrowthExitAssessment;