import { useValuationForm, type FormStep } from "@/hooks/use-valuation-form";
import { useEffect } from "react";
import ProgressIndicator from "@/components/progress-indicator";

import EbitdaForm from "@/components/ebitda-form";
import AdjustmentsForm from "@/components/adjustments-form";
import ValueDriversForm from "@/components/value-drivers-form";
import FollowUpForm from "@/components/followup-form";
import ValuationResults from "@/components/valuation-results";
import LoadingPopup from "@/components/LoadingPopup";
import AssessmentStepper from "@/components/AssessmentStepper";
import AssessmentHeader from "@/components/AssessmentHeader";
import { 
  ArrowLeft, 
  Home, 
  User, 
  FileText, 
  BarChart3, 
  CheckCircle, 
  Calculator,
  TrendingUp,
  MessageCircle,
  DollarSign
} from "lucide-react";


import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
const appleBitesLogo = '/assets/logos/apple-bites-logo-variant-4.png';
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { ValuationAssessment } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

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



export default function FreeAssessment() {
  const [location] = useLocation();
  
  // Check if we're on the results route and fetch latest assessment
  const { data: assessments, isLoading: assessmentsLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/analytics/assessments'],
    enabled: location === '/results'
  });

  const {
    currentStep,
    setCurrentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    calculateEbitda,
    calculateAdjustedEbitda,
    submitAssessment,
    results,
    isSubmitting,
    isGeneratingReport,
    forms,
  } = useValuationForm();
  
  const { user, isAuthenticated } = useAuth();



  // Helper function to convert step name to index
  const getStepIndex = (step: FormStep): number => {
    const stepMap: Record<FormStep, number> = {
      ebitda: 0, 
      adjustments: 1,
      valueDrivers: 2,
      followUp: 3,
      results: 3
    };
    return stepMap[step] || 0;
  };

  // If we're on /results route, show loading or latest assessment
  if (location === '/results') {
    if (assessmentsLoading) {
      return (
        <div >
          <div >
            <div ></div>
            <p >Loading your assessment results...</p>
          </div>
        </div>
      );
    }

    const latestAssessment = assessments?.[0];
    if (!latestAssessment) {
      return (
        <div >
          <div >
            <p >No assessment found. Please complete an assessment first.</p>
            <Button 
              onClick={() => window.location.href = '/'}
              
            >
              Start New Assessment
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div >
        <div >
          <ValuationResults results={latestAssessment} />
        </div>
      </div>
    );
  }



  // Show results in full screen layout
  if (currentStep === "results" && results) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', p: 2 }}>
        <ValuationResults results={results} />
      </Box>
    );
  }

  return (
    <AssessmentBackground>
      {/* Main Content Area */}
      <MainContent>
        {/* Assessment Header - only show for form steps */}
        {currentStep !== "results" && (
          <AssessmentHeader
            title="Free Assessment"
            subtitle="Get your comprehensive business valuation with AI-powered insights and actionable recommendations"
            tier="free"
            features={[
              { icon: Calculator, label: "EBITDA Analysis" },
              { icon: TrendingUp, label: "Value Driver Assessment" },
              { icon: FileText, label: "Professional Report" },
              { icon: CheckCircle, label: "Instant Results" }
            ]}
          />
        )}
        
        {/* Assessment Stepper - only show for form steps */}
        {currentStep !== "results" && (
          <AssessmentStepper activeStep={getStepIndex(currentStep)} />
        )}
        
        <FormCard>
          <CardContent sx={{ p: 3, minHeight: '500px' }}>
            {/* Form Content */}
            <Box>
              {currentStep === "ebitda" && (
                <EbitdaForm
                  form={forms.ebitda}
                  onNext={nextStep}
                  onPrev={prevStep}
                  onDataChange={(data) => updateFormData("ebitda", data)}
                  calculateEbitda={calculateEbitda}
                  isLocked={false}
                />
              )}

              {currentStep === "adjustments" && (
                <AdjustmentsForm
                  form={forms.adjustments}
                  onNext={nextStep}
                  onPrev={prevStep}
                  onDataChange={(data) => updateFormData("adjustments", data)}
                  calculateAdjustedEbitda={calculateAdjustedEbitda}
                  baseEbitda={calculateEbitda()}
                />
              )}

              {currentStep === "valueDrivers" && (
                <ValueDriversForm
                  form={forms.valueDrivers}
                  onNext={nextStep}
                  onPrev={prevStep}
                  onDataChange={(data) => updateFormData("valueDrivers", data)}
                />
              )}

              {currentStep === "followUp" && (
                <FollowUpForm
                  form={forms.followUp}
                  onSubmit={() => {
                    // Submit assessment with free tier
                    submitAssessment();
                  }}
                  onPrev={prevStep}
                  onDataChange={(data) => updateFormData("followUp", data)}
                  isSubmitting={isSubmitting}
                />
              )}
            </Box>
          </CardContent>
        </FormCard>
      </MainContent>

      <LoadingPopup 
        open={isGeneratingReport} 
      />
    </AssessmentBackground>
  );
}