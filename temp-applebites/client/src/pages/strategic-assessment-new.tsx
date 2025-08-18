import { useState, useEffect } from "react";
import { Card, CardContent, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography, Button } from '@mui/material';
import { Link } from 'wouter';
import { styled } from '@mui/material/styles';
import MDBox from "@/components/MD/MDBox";
import MDButton from "@/components/MD/MDButton";
import MDTypography from "@/components/MD/MDTypography";
import EbitdaForm from "@/components/ebitda-form";
import AdjustmentsForm from "@/components/adjustments-form";
import FollowUpForm from "@/components/followup-form";
import ValuationResults from "@/components/valuation-results";
import LoadingPopup from "@/components/LoadingPopup";
import { useValuationForm } from "@/hooks/use-valuation-form";
import { useQuery } from "@tanstack/react-query";
// Apple Bites Questions will be imported directly
import { 
  Home, 
  FileText, 
  BarChart3, 
  CheckCircle, 
  Calculator,
  TrendingUp,
  MessageCircle,
  DollarSign,
  Building2,
  ArrowLeft,
  Star,
  Zap,
  User,
  Clock,
  LogOut
} from "lucide-react";



// Material Dashboard Styled Components
const AssessmentBackground = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  gap: 0,
}));

const drawerWidth = 280;

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
type PaidAssessmentStep = 'ebitda' | 'adjustments' | 'valueDrivers' | 'followup' | 'results';

interface PaidFormData {
  ebitda: any;
  adjustments: any;
  valueDrivers: any;
  followup: any;
}

// Paid Assessment Stepper Component - Updated for Apple Bites workflow
const PaidAssessmentStepper = ({ activeStep }: { activeStep: number }) => {
  const steps = [
    { label: 'Financials', icon: DollarSign, color: '#0b2147' },
    { label: 'Adjustments', icon: Calculator, color: '#0b2147' },
    { label: 'Value Drivers', icon: Star, color: '#0b2147' },
    { label: 'Follow-up', icon: MessageCircle, color: '#0b2147' },
    { label: 'Complete', icon: FileText, color: '#0b2147' }
  ];

  return (
    <Box 
      sx={{ 
        width: '95%',
        margin: '0 auto',
        mb: -2,
        position: 'relative',
        zIndex: 2
      }}
    >
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
                  transition: 'all 0.3s ease'
                }}>
                  <Icon size={16} />
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isActive ? '#ffffff' : '#B0B7C3',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '11px'
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

export default function GrowthExitAssessment() {
  const [currentStep, setCurrentStep] = useState<PaidAssessmentStep>('ebitda');
  const [formData, setFormData] = useState<PaidFormData>({
    ebitda: {},
    adjustments: {},
    valueDrivers: {},
    followup: {}
  });

  // Get regular valuation form for EBITDA, adjustments, and value drivers steps
  const {
    formData: valuationFormData,
    updateFormData: updateValuationFormData,
    forms,
    submitAssessment,
    results,
    isSubmitting,
    isGeneratingReport
  } = useValuationForm();

  // Apple Bites Questions Data
  const appleBitesQuestions: AppleBitesQuestionSet[] = [
    {
      step: 5,
      title: "Strategic Value Drivers",
      questions: [
        {
          id: "driver-financial-performance-1",
          question: "How profitable is your business compared to industry benchmarks?",
          type: "single-choice",
          options: ["Not profitable", "Below average", "Average", "Above average", "Top-tier"],
          weights: [0, 1, 2, 3, 5],
          valueDriver: "Financial Performance",
          scoreRange: [0, 5]
        },
        {
          id: "driver-financial-performance-2",
          question: "What is your adjusted net profit margin?",
          type: "single-choice",
          options: ["< 5%", "5–10%", "11–15%", "16–20%", "> 20%"],
          weights: [0, 1, 2, 3, 5],
          valueDriver: "Financial Performance",
          scoreRange: [0, 5]
        }
        // Additional questions would be loaded here
      ]
    }
  ];

  const getStepIndex = (step: PaidAssessmentStep): number => {
    const stepMap = { 'ebitda': 0, 'adjustments': 1, 'valueDrivers': 2, 'followup': 3, 'results': 4 };
    return stepMap[step] || 0;
  };

  const nextStep = () => {
    if (currentStep === 'ebitda') setCurrentStep('adjustments');
    else if (currentStep === 'adjustments') setCurrentStep('valueDrivers');
    else if (currentStep === 'valueDrivers') setCurrentStep('followup');
    else if (currentStep === 'followup') setCurrentStep('results');
  };

  const prevStep = () => {
    if (currentStep === 'adjustments') setCurrentStep('ebitda');
    else if (currentStep === 'valueDrivers') setCurrentStep('adjustments');
    else if (currentStep === 'followup') setCurrentStep('valueDrivers');
    else if (currentStep === 'results') setCurrentStep('followup');
  };

  const handleSectorChange = (sectorCode: string) => {
    const selectedSector = sectors?.find(s => s.code === sectorCode);
    setFormData(prev => ({
      ...prev,
      industry: {
        ...prev.industry,
        sectorCode,
        primarySector: selectedSector?.title || '',
        specificIndustry: '',
        naicsCode: ''
      }
    }));
  };

  const handleIndustryChange = (naicsCode: string) => {
    const selectedIndustry = sectorIndustries?.find(i => i.code === naicsCode);
    setFormData(prev => ({
      ...prev,
      industry: {
        ...prev.industry,
        naicsCode,
        specificIndustry: selectedIndustry?.title || ''
      }
    }));
  };

  const handleIndustryInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      industry: {
        ...prev.industry,
        [field]: value
      }
    }));
  };

  const renderIndustryForm = () => (
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
          <Building2 size={24} color="white" />
        </MDBox>
        <MDBox>
          <MDTypography variant="h5" fontWeight="medium" sx={{ color: '#344767', mb: 0.5 }}>
            Industry Classification
          </MDTypography>
          <MDTypography variant="body2" sx={{ color: '#67748e' }}>
            Select your industry for accurate valuation benchmarks
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Industry Selection */}
      <MDBox sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <MDBox sx={{ flex: 1 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#67748e' }}>Primary Industry Sector</InputLabel>
            <Select
              value={formData.industry.sectorCode || ''}
              onChange={(e) => handleSectorChange(e.target.value)}
              label="Primary Industry Sector"
              disabled={sectorsLoading}
              sx={{
                '& .MuiSelect-select': {
                  color: '#344767'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d2d6da'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#005b8c'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#005b8c'
                }
              }}
            >
              {sectors?.map((sector) => (
                <MenuItem key={sector.code} value={sector.code}>
                  {sector.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MDBox>

        <MDBox sx={{ flex: 1 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#67748e' }}>Specific Industry</InputLabel>
            <Select
              value={formData.industry.naicsCode || ''}
              onChange={(e) => handleIndustryChange(e.target.value)}
              label="Specific Industry"
              disabled={!formData.industry.sectorCode || industriesLoading}
              sx={{
                '& .MuiSelect-select': {
                  color: '#344767'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d2d6da'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#005b8c'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#005b8c'
                }
              }}
            >
              {sectorIndustries?.map((industry) => (
                <MenuItem key={industry.code} value={industry.code}>
                  {industry.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MDBox>
      </MDBox>

      {/* Business Details */}
      <MDBox mt={4}>
        <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#344767', mb: 2 }}>
          Business Details
        </MDTypography>
        
        <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Business Description"
            multiline
            rows={3}
            value={formData.industry.businessDescription}
            onChange={(e) => handleIndustryInputChange('businessDescription', e.target.value)}
            placeholder="Briefly describe your business operations..."
            sx={{
              '& .MuiInputBase-input': {
                color: '#344767'
              },
              '& .MuiInputLabel-root': {
                color: '#67748e'
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#d2d6da'
                },
                '&:hover fieldset': {
                  borderColor: '#005b8c'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#005b8c'
                }
              }
            }}
          />

          <MDBox sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            <TextField
              fullWidth
              label="Years in Business"
              type="number"
              value={formData.industry.yearsInBusiness}
              onChange={(e) => handleIndustryInputChange('yearsInBusiness', e.target.value)}
              placeholder="e.g., 5"
              sx={{
                '& .MuiInputBase-input': {
                  color: '#344767'
                },
                '& .MuiInputLabel-root': {
                  color: '#67748e'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#d2d6da'
                  },
                  '&:hover fieldset': {
                    borderColor: '#005b8c'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#005b8c'
                  }
                }
              }}
            />

            <TextField
              fullWidth
              label="Number of Employees"
              type="number"
              value={formData.industry.numberOfEmployees}
              onChange={(e) => handleIndustryInputChange('numberOfEmployees', e.target.value)}
              placeholder="e.g., 25"
              sx={{
                '& .MuiInputBase-input': {
                  color: '#344767'
                },
                '& .MuiInputLabel-root': {
                  color: '#67748e'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#d2d6da'
                  },
                  '&:hover fieldset': {
                    borderColor: '#005b8c'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#005b8c'
                  }
                }
              }}
            />
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Selected Industry Info */}
      {formData.industry.naicsCode && (
        <MDBox mt={4}>
          <Card sx={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <CardContent>
              <MDBox display="flex" alignItems="center" mb={2}>
                <TrendingUp size={20} color="#00718d" />
                <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#344767', ml: 1 }}>
                  Industry Valuation Benchmarks
                </MDTypography>
              </MDBox>
              
              <MDTypography variant="body2" sx={{ color: '#67748e', mb: 2 }}>
                Selected: {formData.industry.specificIndustry}
              </MDTypography>
              
              <MDBox display="flex" gap={3}>
                <MDBox textAlign="center">
                  <MDTypography variant="caption" sx={{ color: '#67748e' }}>
                    NAICS Code
                  </MDTypography>
                  <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#344767' }}>
                    {formData.industry.naicsCode}
                  </MDTypography>
                </MDBox>
                
                {sectorIndustries?.find(i => i.code === formData.industry.naicsCode) && (
                  <>
                    <MDBox textAlign="center">
                      <MDTypography variant="caption" sx={{ color: '#67748e' }}>
                        Avg Multiple
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#00718d' }}>
                        {sectorIndustries.find(i => i.code === formData.industry.naicsCode)?.multiplier.avg.toFixed(1)}x
                      </MDTypography>
                    </MDBox>
                    
                    <MDBox textAlign="center">
                      <MDTypography variant="caption" sx={{ color: '#67748e' }}>
                        Range
                      </MDTypography>
                      <MDTypography variant="h6" fontWeight="medium" sx={{ color: '#344767' }}>
                        {sectorIndustries.find(i => i.code === formData.industry.naicsCode)?.multiplier.min.toFixed(1)}x - {sectorIndustries.find(i => i.code === formData.industry.naicsCode)?.multiplier.max.toFixed(1)}x
                      </MDTypography>
                    </MDBox>
                  </>
                )}
              </MDBox>
            </CardContent>
          </Card>
        </MDBox>
      )}

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
          onClick={() => window.history.back()}
        >
          Back to Dashboard
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
          disabled={!formData.industry.naicsCode || !formData.industry.businessDescription}
          onClick={nextStep}
        >
          Continue to Financials
        </MDButton>
      </MDBox>
    </MDBox>
  );

  const renderStepComponent = () => {
    switch (currentStep) {
      case 'industry':
        return renderIndustryForm();
      case 'ebitda':
        return (
          <EbitdaForm
            form={forms.ebitda}
            onNext={nextStep}
            onPrev={prevStep}
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
          />
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
          />
        );
      case 'valueDrivers':
        return (
          <ValueDriversForm
            form={forms.valueDrivers}
            onNext={() => {
              // Submit assessment with industry data included
              const combinedData = {
                ...valuationFormData,
                industry: formData.industry,
                tier: 'paid'
              };
              submitAssessment();
              setCurrentStep('results');
            }}
            onPrev={prevStep}
            onDataChange={(data) => updateValuationFormData("valueDrivers", data)}
          />
        );
      case 'results':
        return <ValuationResults results={results} />;
      default:
        return renderIndustryForm();
    }
  };

  return (
    <AssessmentBackground>
      {/* Loading Popup */}
      {isGeneratingReport && <LoadingPopup open={true} onClose={() => {}} />}
      
      {/* Main Content - Full Width */}
      <MainContent sx={{ marginLeft: '0px', width: '100%', maxWidth: 'none' }}>
        {/* Growth & Exit Assessment Header */}
        <MDBox
          sx={{
            background: 'linear-gradient(135deg, #F2F2F2 0%, #EAEAEA 100%)',
            borderRadius: '12px',
            padding: 3,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}
        >
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#333333', mb: 0.5 }}>
              Growth & Exit Assessment
            </MDTypography>
            <MDTypography variant="body1" sx={{ color: '#666666', opacity: 0.9 }}>
              Industry-specific strategic valuation with AI insights
            </MDTypography>
          </MDBox>
          
          <MDBox
            sx={{
              background: '#4682B4',
              color: 'white',
              px: 3,
              py: 1.5,
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 2px 8px rgba(70, 130, 180, 0.3)'
            }}
          >
            $795 Premium Tier
          </MDBox>
        </MDBox>

        {/* Paid Assessment Stepper */}
        <PaidAssessmentStepper activeStep={getStepIndex(currentStep)} />

        {/* Form Content */}
        <FormCard>
          <CardContent sx={{ p: 4, minHeight: '500px' }}>
            {renderStepComponent()}
          </CardContent>
        </FormCard>
      </MainContent>
    </AssessmentBackground>
  );
}