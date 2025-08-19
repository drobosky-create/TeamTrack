import { useValuationForm, type FormStep } from "../../../hooks/use-valuation-form";
import { useEffect, useState } from "react";
import ProgressIndicator from "../../../components/progress-indicator";

import EbitdaForm from "../../../components/ebitda-form";
import AdjustmentsForm from "../../../components/adjustments-form";
import ValueDriversForm from "../../../components/value-drivers-form";
import FollowUpForm from "../../../components/followup-form";
import ValuationResults from "../../../components/valuation-results";
import LoadingPopup from "../../../components/LoadingPopup";
import AssessmentStepper from "../../../components/AssessmentStepper";
import AssessmentHeader from "../../../components/AssessmentHeader";
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
  DollarSign,
  LogOut,
  Crown,
  Lock,
  Sparkles,
  LayoutDashboard,
  CheckSquare,
  Bell,
  Calendar
} from "lucide-react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button as MuiButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Button } from '@/components/ui/button';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ValuationAssessment } from "@shared/schema";

interface ConsumerUser {
  id: string;
  email: string;
  plan?: 'free' | 'growth' | 'capital';
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

const appleBitesLogo = '/assets/logos/apple-bites-logo-variant-4.png';

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
  marginLeft: drawerWidth,
  [theme.breakpoints.down('md')]: {
    padding: '12px',
    marginLeft: 0,
  },
}));

const FormCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
}));

export default function FreeAssessment() {
  const [location, setLocation] = useLocation();
  const [consumerUser, setConsumerUser] = useState<ConsumerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiRequest('GET', '/api/auth/consumer-user');
      const data = await response.json();
      
      if (data.user) {
        setConsumerUser(data.user);
      } else {
        setLocation('/consumer-login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setLocation('/consumer-login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/consumer-logout');
      queryClient.clear();
      setLocation('/applebites');
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };



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

  const getTierLabel = (tier?: string) => {
    switch (tier) {
      case 'free': return 'Free';
      case 'growth': return 'Growth & Exit';
      case 'capital': return 'Capital';
      default: return 'Free';
    }
  };

  const getTierIcon = (tier?: string) => {
    switch (tier) {
      case 'growth': return <Crown className="h-5 w-5" />;
      case 'capital': return <Sparkles className="h-5 w-5" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!consumerUser) {
    return null;
  }

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-[280px] bg-gradient-to-b from-[#0A1F44] to-[#1C2D5A] text-white flex-col fixed h-screen">
        {/* Logo Section */}
        <div className="p-6 text-center border-b border-white/10">
          <img
            src="/apple-bites-logo.png"
            alt="AppleBites"
            className="w-32 mx-auto mb-3"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <p className="text-sm text-cyan-200 font-light">Business Valuation Platform</p>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-medium">{consumerUser.firstName || 'User'}</p>
              <p className="text-xs text-cyan-200">{getTierLabel(consumerUser.plan)} Plan</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col gap-3">
            {/* My Dashboard */}
            <Link href="/consumer-dashboard">
              <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                <LayoutDashboard className="h-4 w-4 mr-3" />
                My Dashboard
              </Button>
            </Link>
            
            {/* My Assessments */}
            <Link href="/past-assessments">
              <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                <BarChart3 className="h-4 w-4 mr-3" />
                My Assessments
              </Button>
            </Link>
            
            {/* Free Assessment - Active State */}
            <Link href="/assessment/free">
              <Button className="w-full justify-start bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3">
                <FileText className="h-4 w-4 mr-3" />
                Free Assessment
              </Button>
            </Link>
            
            {/* Growth Assessment */}
            {consumerUser.plan === 'free' ? (
              <Link href="/applebites-checkout">
                <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                  <Crown className="h-4 w-4 mr-3" />
                  Growth Assessment
                  <Lock className="h-3 w-3 ml-auto" />
                </Button>
              </Link>
            ) : (
              <Link href="/assessment/paid">
                <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                  <Crown className="h-4 w-4 mr-3" />
                  Growth Assessment
                </Button>
              </Link>
            )}
            
            {/* Tasks & Feedback */}
            <Link href="/tasks-feedback">
              <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                <CheckSquare className="h-4 w-4 mr-3" />
                Tasks & Feedback
              </Button>
            </Link>
            
            {/* Notifications */}
            <Link href="/notifications">
              <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                <Bell className="h-4 w-4 mr-3" />
                Notifications
              </Button>
            </Link>
            
            {/* Profile Management */}
            <Link href="/profile">
              <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                <User className="h-4 w-4 mr-3" />
                Profile Management
              </Button>
            </Link>
            
            {/* Schedule Consultation */}
            <Button 
              className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3"
              asChild
            >
              <a href="https://api.leadconnectorhq.com/widget/bookings/applebites" target="_blank" rel="noopener noreferrer">
                <Calendar className="h-4 w-4 mr-3" />
                Schedule Consultation
              </a>
            </Button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="p-6 border-t border-white/10">
          <Button 
            onClick={handleLogout} 
            className="w-full bg-transparent border border-red-400 text-red-400 hover:bg-red-400/10 py-3"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-[280px]">
        <AssessmentBackground>
          <MainContent sx={{ marginLeft: 0 }}>
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
      </div>
    </div>
  );
}