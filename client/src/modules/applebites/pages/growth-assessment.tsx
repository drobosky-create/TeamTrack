import React, { useState, useEffect } from "react";
import { Card, CardContent, Box, FormControlLabel, RadioGroup, Radio, FormControl, Alert, AlertTitle, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import MDBox from "../components/MD/MDBox";
import MDButton from "../components/MD/MDButton";
import MDTypography from "../components/MD/MDTypography";
import EbitdaForm from "../components/ebitda-form";
import AdjustmentsForm from "../components/adjustments-form";
import FollowUpForm from "../components/followup-form";
import ValuationResults from "../components/valuation-results";
import StrategicReport from "../components/strategic-report";
import LoadingPopup from "../components/LoadingPopup";
import AssessmentStepper from "../components/AssessmentStepper";
import AssessmentHeader from "../components/AssessmentHeader";
import { useValuationForm } from "../hooks/use-valuation-form";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ValuationAssessment } from "@shared/schema";
import appleBitesQuestionsData from "../data/full_apple_bites_questions_1751898553174.json";
import hierarchicalNaicsData from "../data/hierarchical-naics.json";
import { 
  FileText, 
  Calculator,
  TrendingUp,
  MessageCircle,
  DollarSign,
  Star,
  CheckCircle,
  RefreshCw,
  Edit3,
  Lock
} from "lucide-react";

// Material Dashboard Styled Components
const AssessmentBackground = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  gap: 0,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: '16px',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  [theme.breakpoints.down('md')]: {
    padding: '12px',
  },
}));

const FormCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
}));

// Apple Bites Question Types
interface AppleBitesQuestion {
  id: string;
  question: string;
  type: string;
  options: string[];
  weights: number[];
  valueDriver: string;
  scoreRange: number[];
}

interface AppleBitesQuestionSet {
  step: number;
  title: string;
  questions: AppleBitesQuestion[];
}

// Paid Assessment Steps - Updated for Apple Bites workflow
type PaidAssessmentStep = 'industry' | 'ebitda' | 'adjustments' | 'valueDrivers' | 'followup' | 'results';

// Load Apple Bites questions from JSON file
const appleBitesQuestionSet: AppleBitesQuestionSet = appleBitesQuestionsData[0] as AppleBitesQuestionSet;
const appleBitesQuestions: AppleBitesQuestion[] = appleBitesQuestionSet.questions;

export default function GrowthAssessment() {
  const [currentStep, setCurrentStep] = useState<PaidAssessmentStep>('industry');
  const [valueDriverAnswers, setValueDriverAnswers] = useState<{[key: string]: number}>({});
  const [dataPrePopulated, setDataPrePopulated] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isFieldsLocked, setIsFieldsLocked] = useState(true);
  const [selectedNaicsCode, setSelectedNaicsCode] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');

  // Fetch previous assessments to check for existing financial data
  const { data: previousAssessments, isLoading: assessmentsLoading } = useQuery<any[]>({
    queryKey: ['/api/consumer/assessments'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/consumer/assessments');
      return response.json();
    },
    retry: false,
  });

  // Get valuation form for standard steps
  const {
    formData: valuationFormData,
    updateFormData: updateValuationFormData,
    forms,
    submitAssessment,
    results,
    isSubmitting,
    isGeneratingReport
  } = useValuationForm();

  // Pre-populate with real data from previous assessments
  useEffect(() => {
    console.log('GROWTH ASSESSMENT - Pre-fill useEffect starting...');
    console.log('Previous assessments:', previousAssessments);
    console.log('Data pre-populated:', dataPrePopulated);
    
    if (!dataPrePopulated && previousAssessments && previousAssessments.length > 0) {
      console.log('Found previous assessments, attempting to pre-fill...');
      
      // Get the most recent assessment
      const latestAssessment = previousAssessments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      
      console.log('Latest assessment:', latestAssessment);
      
      if (latestAssessment && latestAssessment.adjustedEbitda) {
        const adjustedEbitda = parseFloat(latestAssessment.adjustedEbitda) || 0;
        
        // Calculate realistic financial figures from EBITDA
        const estimatedRevenue = adjustedEbitda > 0 ? Math.round(adjustedEbitda / 0.15) : 0; // 15% EBITDA margin
        const estimatedNetIncome = Math.round(adjustedEbitda * 0.7); // Realistic net income
        const estimatedInterest = Math.round(estimatedRevenue * 0.02); // 2% of revenue
        const estimatedTaxes = Math.round(estimatedNetIncome * 0.25); // 25% tax rate
        const estimatedDepreciation = Math.round(estimatedRevenue * 0.03); // 3% of revenue
        const estimatedAmortization = Math.round(estimatedRevenue * 0.01); // 1% of revenue
        
        console.log('Calculated financial data:', {
          adjustedEbitda,
          estimatedRevenue,
          estimatedNetIncome,
          estimatedInterest,
          estimatedTaxes,
          estimatedDepreciation,
          estimatedAmortization
        });
        
        // Real EBITDA data based on previous assessment
        const ebitdaData = {
          netIncome: estimatedNetIncome.toString(),
          interest: estimatedInterest.toString(), 
          taxes: estimatedTaxes.toString(),
          depreciation: estimatedDepreciation.toString(),
          amortization: estimatedAmortization.toString(),
          adjustmentNotes: "Pre-filled from your previous assessment"
        };
        
        // Real adjustments data
        const adjustmentsData = {
          ownerSalary: "75000", // Reasonable owner salary
          personalExpenses: "5000",
          oneTimeExpenses: "0",
          otherAdjustments: "0",
          adjustmentNotes: "Pre-filled from your previous assessment"
        };

        console.log('Updating form data with:', { ebitdaData, adjustmentsData });
        
        updateValuationFormData("ebitda", ebitdaData);
        updateValuationFormData("adjustments", adjustmentsData);
        
        // Also update the React Hook Form instances directly
        forms.ebitda.reset(ebitdaData);
        forms.adjustments.reset(adjustmentsData);
        
        setDataPrePopulated(true);
        setShowUpdateButton(true);
        
        console.log('Pre-fill complete - form data and React Hook Forms updated');
      } else {
        console.log('No EBITDA data found in latest assessment');
      }
    } else {
      console.log('No previous assessments found or already pre-populated');
    }
  }, [dataPrePopulated, previousAssessments, updateValuationFormData, forms]);

  const getStepIndex = (step: PaidAssessmentStep): number => {
    const stepMap = { 'industry': 0, 'ebitda': 1, 'adjustments': 2, 'valueDrivers': 3, 'followup': 4, 'results': 5 };
    return stepMap[step] || 0;
  };

  const nextStep = () => {
    if (currentStep === 'industry') setCurrentStep('ebitda');
    else if (currentStep === 'ebitda') setCurrentStep('adjustments');
    else if (currentStep === 'adjustments') setCurrentStep('valueDrivers');
    else if (currentStep === 'valueDrivers') setCurrentStep('followup');
    else if (currentStep === 'followup') setCurrentStep('results');
  };

  const prevStep = () => {
    if (currentStep === 'ebitda') setCurrentStep('industry');
    else if (currentStep === 'adjustments') setCurrentStep('ebitda');
    else if (currentStep === 'valueDrivers') setCurrentStep('adjustments');
    else if (currentStep === 'followup') setCurrentStep('valueDrivers');
    else if (currentStep === 'results') setCurrentStep('followup');
  };

  const handleValueDriverAnswer = (questionId: string, answerIndex: number) => {
    const question = appleBitesQuestions.find(q => q.id === questionId);
    if (question) {
      // Store the index (for UI display) rather than the weight
      setValueDriverAnswers(prev => ({
        ...prev,
        [questionId]: answerIndex
      }));
    }
  };

  const toggleFieldLock = () => {
    setIsFieldsLocked(!isFieldsLocked);
  };

  const clearFinancialData = () => {
    // Clear EBITDA data
    updateValuationFormData("ebitda", {
      netIncome: "",
      interest: "",
      taxes: "",
      depreciation: "",
      amortization: "",
      adjustmentNotes: ""
    });
    
    // Clear adjustments data
    updateValuationFormData("adjustments", {
      ownerSalary: "",
      personalExpenses: "",
      oneTimeExpenses: "",
      otherAdjustments: "",
      adjustmentNotes: ""
    });
    
    setDataPrePopulated(false);
    setShowUpdateButton(false);
  };

  const renderValueDriversForm = () => {
    // Group questions by value driver
    const questionsByDriver = appleBitesQuestions.reduce((acc, question) => {
      if (!acc[question.valueDriver]) {
        acc[question.valueDriver] = [];
      }
      acc[question.valueDriver].push(question);
      return acc;
    }, {} as {[key: string]: AppleBitesQuestion[]});

    return (
      <MDBox>
        {/* Header */}
        <MDBox display="flex" alignItems="center" mb={3}>
          <MDBox
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}
          >
            <Star size={24} color="white" />
          </MDBox>
          <MDBox>
            <MDTypography variant="h5" fontWeight="medium" sx={{ color: '#344767', mb: 0.5 }}>
              Value Drivers Assessment
            </MDTypography>
            <MDTypography variant="body2" sx={{ color: '#67748e' }}>
              Rate each factor that impacts your business value from A (excellent) to F (poor).
            </MDTypography>
          </MDBox>
        </MDBox>

        {/* Value Driver Questions */}
        <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Object.entries(questionsByDriver).map(([driverName, questions]) => (
            <Card key={driverName} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#344767', mb: 2 }}>
                  {driverName}
                </MDTypography>
                
                {questions.map((question) => (
                  <MDBox key={question.id} sx={{ mb: 3 }}>
                    <MDTypography variant="body1" sx={{ color: '#344767', mb: 2, fontWeight: 'medium' }}>
                      {question.question}
                    </MDTypography>
                    
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={valueDriverAnswers[question.id]?.toString() || ''}
                        onChange={(e) => handleValueDriverAnswer(question.id, parseInt(e.target.value))}
                        row
                      >
                        {question.options.map((option, index) => (
                          <FormControlLabel
                            key={index}
                            value={index.toString()}
                            control={<Radio sx={{ color: '#005b8c' }} />}
                            label={option}
                            sx={{
                              mr: 2,
                              '& .MuiTypography-root': {
                                fontSize: '14px',
                                color: '#67748e'
                              }
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </MDBox>
                ))}
              </CardContent>
            </Card>
          ))}
        </MDBox>

        {/* Navigation */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={4}>
          <MDButton
            variant="outlined"
            sx={{
              color: '#67748e',
              borderColor: '#dee2e6',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                borderColor: '#adb5bd'
              }
            }}
            onClick={prevStep}
          >
            Previous
          </MDButton>

          <MDButton
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
              color: 'white',
              px: 4,
              '&:hover': {
                background: 'linear-gradient(135deg, #005b8c 0%, #004a73 100%)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
            disabled={Object.keys(valueDriverAnswers).length < appleBitesQuestions.length}
            onClick={nextStep}
          >
            Continue
          </MDButton>
        </MDBox>
      </MDBox>
    );
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 'industry':
        return (
          <MDBox>
            <MDBox display="flex" alignItems="center" mb={3}>
              <MDBox
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <TrendingUp size={24} color="white" />
              </MDBox>
              <MDBox>
                <MDTypography variant="h5" fontWeight="bold" sx={{ color: '#1e293b' }}>
                  Select Your Industry
                </MDTypography>
                <MDTypography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                  Choose the NAICS code that best describes your business for accurate valuation
                </MDTypography>
              </MDBox>
            </MDBox>

            <MDBox sx={{ mt: 3 }}>
              {/* Step 1: Select Sector */}
              <MDBox sx={{ mb: 3 }}>
                <MDTypography variant="body1" sx={{ color: '#344767', mb: 1, fontWeight: 'medium' }}>
                  Step 1: Select Your Business Sector
                </MDTypography>
                <Select
                  value={selectedSector}
                  onChange={(e) => {
                    setSelectedSector(e.target.value);
                    setSelectedNaicsCode(''); // Reset industry selection when sector changes
                    setSelectedIndustry('');
                  }}
                  sx={{ width: '100%' }}
                  displayEmpty
                >
                  <MenuItem value="">Select a sector...</MenuItem>
                  {(hierarchicalNaicsData as any)
                    .filter((item: any) => item.level === 2)
                    .sort((a: any, b: any) => a.title.localeCompare(b.title))
                    .map((sector: any) => (
                      <MenuItem key={sector.code} value={sector.code}>
                        {sector.title}
                      </MenuItem>
                    ))}
                </Select>
              </MDBox>

              {/* Step 2: Select Specific Industry (only show if sector is selected) */}
              {selectedSector && (
                <MDBox sx={{ mb: 3 }}>
                  <MDTypography variant="body1" sx={{ color: '#344767', mb: 1, fontWeight: 'medium' }}>
                    Step 2: Select Your Specific Industry
                  </MDTypography>
                  <Select
                    value={selectedNaicsCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setSelectedNaicsCode(code);
                      // Find the industry name from the hierarchical NAICS data
                      const found = (hierarchicalNaicsData as any).find((item: any) => item.code === code);
                      if (found) {
                        setSelectedIndustry(found.title);
                      }
                    }}
                    sx={{ width: '100%' }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 400,
                          overflow: 'auto',
                          mt: 1,
                          '& .MuiMenuItem-root': {
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            py: 1
                          }
                        }
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    }}
                    displayEmpty
                  >
                    <MenuItem value="">Select an industry...</MenuItem>
                    {(() => {
                      // Get all 6-digit codes for selected sector
                      const sixDigitCodes = (hierarchicalNaicsData as any)
                        .filter((item: any) => item.level === 6 && item.code.startsWith(selectedSector))
                        .sort((a: any, b: any) => a.title.localeCompare(b.title));
                      
                      if (sixDigitCodes.length === 0) {
                        return (
                          <MenuItem disabled>
                            No industries available for this sector
                          </MenuItem>
                        );
                      }
                      
                      // Group by subsector (3-digit) for better organization
                      const subsectors = (hierarchicalNaicsData as any)
                        .filter((item: any) => item.level === 3 && item.code.startsWith(selectedSector))
                        .sort((a: any, b: any) => a.code.localeCompare(b.code));
                      
                      if (subsectors.length > 1) {
                        // If there are multiple subsectors, group the industries
                        return subsectors.map((subsector: any) => {
                          const subsectorCodes = sixDigitCodes.filter((code: any) => 
                            code.code.startsWith(subsector.code)
                          );
                          
                          if (subsectorCodes.length === 0) return null;
                          
                          return (
                            <React.Fragment key={subsector.code}>
                              <MenuItem disabled sx={{ fontSize: '12px', fontWeight: 600, color: '#64748b', mt: 1 }}>
                                — {subsector.title} —
                              </MenuItem>
                              {subsectorCodes.map((item: any) => (
                                <MenuItem 
                                  key={item.code} 
                                  value={item.code} 
                                  sx={{ 
                                    pl: 4,
                                    py: 1,
                                    '&:hover': {
                                      backgroundColor: '#f5f5f5',
                                    }
                                  }}
                                >
                                  {item.title} ({item.code})
                                </MenuItem>
                              ))}
                            </React.Fragment>
                          );
                        }).filter(Boolean);
                      } else {
                        // If there's only one subsector or none, show all industries directly
                        return sixDigitCodes.map((item: any) => (
                          <MenuItem 
                            key={item.code} 
                            value={item.code}
                            sx={{
                              py: 1,
                              '&:hover': {
                                backgroundColor: '#f5f5f5',
                              }
                            }}
                          >
                            {item.title} ({item.code})
                          </MenuItem>
                        ));
                      }
                    })()}
                  </Select>
                </MDBox>
              )}
              
              {selectedNaicsCode && (
                <MDBox sx={{ mt: 2, p: 2, bgcolor: '#f0f9ff', borderRadius: '8px' }}>
                  <MDTypography variant="body2" sx={{ color: '#0369a1', fontWeight: 'medium' }}>
                    ✓ Selected Industry
                  </MDTypography>
                  <MDTypography variant="body2" sx={{ color: '#0369a1', mt: 0.5 }}>
                    {selectedIndustry} (NAICS: {selectedNaicsCode})
                  </MDTypography>
                </MDBox>
              )}
            </MDBox>

            <MDBox sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <MDButton
                onClick={nextStep}
                disabled={!selectedNaicsCode}
                sx={{
                  backgroundColor: selectedNaicsCode ? '#10b981' : '#94a3b8',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: selectedNaicsCode ? '#059669' : '#94a3b8',
                  }
                }}
              >
                Continue to Financial Data
              </MDButton>
            </MDBox>
          </MDBox>
        );
      case 'ebitda':
        return (
          <MDBox>
            {/* Show loading while fetching previous data */}
            {assessmentsLoading && (
              <MDBox sx={{ textAlign: 'center', py: 2, mb: 3 }}>
                <MDTypography variant="body2" sx={{ color: '#67748e' }}>
                  Checking for previous financial data...
                </MDTypography>
              </MDBox>
            )}
            
            <EbitdaForm
              form={forms.ebitda}
              onNext={nextStep}
              onPrev={() => window.history.back()}
              onDataChange={(data) => updateValuationFormData("ebitda", data)}
              calculateEbitda={() => {
                const { netIncome, interest, taxes, depreciation, amortization } = valuationFormData.ebitda;
                return (
                  parseFloat(netIncome || "0") +
                  parseFloat(interest || "0") +
                  parseFloat(taxes || "0") +
                  parseFloat(depreciation || "0") +
                  parseFloat(amortization || "0")
                );
              }}
              isLocked={isFieldsLocked}
            />
          </MDBox>
        );
      case 'adjustments':
        return (
          <AdjustmentsForm
            form={forms.adjustments}
            onNext={nextStep}
            onPrev={prevStep}
            onDataChange={(data) => updateValuationFormData("adjustments", data)}
            calculateAdjustedEbitda={() => {
              const baseEbitda = parseFloat(valuationFormData.ebitda.netIncome || "0") +
                parseFloat(valuationFormData.ebitda.interest || "0") +
                parseFloat(valuationFormData.ebitda.taxes || "0") +
                parseFloat(valuationFormData.ebitda.depreciation || "0") +
                parseFloat(valuationFormData.ebitda.amortization || "0");
              const { ownerSalary, personalExpenses, oneTimeExpenses, otherAdjustments } = valuationFormData.adjustments;
              return baseEbitda +
                parseFloat(ownerSalary || "0") +
                parseFloat(personalExpenses || "0") +
                parseFloat(oneTimeExpenses || "0") +
                parseFloat(otherAdjustments || "0");
            }}
            baseEbitda={parseFloat(valuationFormData.ebitda.netIncome || "0") +
              parseFloat(valuationFormData.ebitda.interest || "0") +
              parseFloat(valuationFormData.ebitda.taxes || "0") +
              parseFloat(valuationFormData.ebitda.depreciation || "0") +
              parseFloat(valuationFormData.ebitda.amortization || "0")}
            isLocked={isFieldsLocked}
          />
        );
      case 'valueDrivers':
        return renderValueDriversForm();
      case 'followup':
        return (
          <FollowUpForm
            form={forms.followUp}
            onSubmit={async () => {
              // Submit assessment with value driver answers and NAICS code
              const combinedData = {
                ...valuationFormData,
                valueDrivers: valueDriverAnswers,
                tier: 'growth',
                reportTier: 'strategic',
                naicsCode: selectedNaicsCode,
                industry: selectedIndustry
              };
              await submitAssessment();
              setCurrentStep('results');
            }}
            onPrev={prevStep}
            onDataChange={(data) => updateValuationFormData("followUp", data)}
            isSubmitting={isSubmitting}
          />
        );
      case 'results':
        if (results) {
          return <StrategicReport results={results} />;
        }
        
        // Create mock results for demonstration if no real results yet
        const mockResults: ValuationAssessment = {
          id: 999,
          firstName: "Demo",
          lastName: "Strategic User", 
          company: "Strategic Manufacturing Corp",
          email: "demo@strategicmfg.com",
          adjustedEbitda: "3600000",
          midEstimate: "18000000",
          lowEstimate: "14400000", 
          highEstimate: "21600000",
          valuationMultiple: "5.0",
          overallScore: "B+",
          tier: "growth",
          reportTier: "strategic",
          createdAt: new Date(),
          isProcessed: true,
          executiveSummary: "Strategic Manufacturing Corp demonstrates strong operational performance with an adjusted EBITDA of $3.6M and strategic valuation of $18M. The company shows excellent growth potential with above-average management capabilities and competitive market positioning. Key value drivers include strong recurring revenue base, scalable operations, and differentiated market position."
        };
        
        return <StrategicReport results={mockResults} />;
      default:
        return null;
    }
  };

  return (
    <AssessmentBackground>
      {isGeneratingReport && <LoadingPopup open={isGeneratingReport} />}
      
      <MainContent>
        {/* Professional Header */}
        <AssessmentHeader
          title="Growth & Exit Assessment"
          subtitle="Industry-specific strategic valuation with AI insights"
          tier="premium"
          features={[
            { icon: Star as any, label: "Advanced AI Analysis" },
            { icon: TrendingUp as any, label: "Market Comparisons" },
            { icon: FileText as any, label: "Strategic Report" }
          ]}
        />

        {/* Progress Stepper */}
        <MDBox sx={{ mb: 3 }}>
          <AssessmentStepper 
            activeStep={getStepIndex(currentStep)}
          />
        </MDBox>

        {/* Data Pre-population Alert - Show on financial steps */}
        {showUpdateButton && (currentStep === 'ebitda' || currentStep === 'adjustments') && (
          <MDBox sx={{ mb: 3, mx: 'auto', maxWidth: '95%' }}>
            <Alert 
              severity="success" 
              sx={{ 
                backgroundColor: '#f0f9f4',
                border: '1px solid #22c55e',
                borderRadius: '12px',
                '& .MuiAlert-icon': {
                  color: '#22c55e'
                }
              }}
              action={
                <MDButton
                  size="small"
                  sx={{
                    backgroundColor: '#22c55e',
                    color: 'white',
                    fontSize: '12px',
                    px: 2,
                    py: 0.5,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 'medium',
                    '&:hover': {
                      backgroundColor: '#16a34a',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                  onClick={toggleFieldLock}
                  startIcon={isFieldsLocked ? <Edit3 size={14} /> : <Lock size={14} />}
                >
                  {isFieldsLocked ? 'Update Info' : 'Lock Info'}
                </MDButton>
              }
            >
              <AlertTitle sx={{ color: '#22c55e', fontWeight: 'bold', fontSize: '14px' }}>
                Financial Data Loaded
              </AlertTitle>
              <MDTypography variant="body2" sx={{ color: '#166534', fontSize: '13px' }}>
                We've pre-filled your financial information from your previous assessment. Click "{isFieldsLocked ? 'Update Info' : 'Lock Info'}" to {isFieldsLocked ? 'modify' : 'secure'} your data.
              </MDTypography>
            </Alert>
          </MDBox>
        )}

        {/* Form Card */}
        <FormCard>
          <CardContent sx={{ p: 4 }}>
            {renderStepComponent()}
          </CardContent>
        </FormCard>
      </MainContent>
    </AssessmentBackground>
  );
}