import InteractiveValuationSlider from "@/components/interactive-valuation-slider";
import AICoachingTips from "@/components/AICoachingTips";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import type { ValuationAssessment } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Typography,
  Container,
  Button,
  Avatar,
} from '@mui/material';
import { MDBox, MDTypography, MDButton } from "@/components/MD";
import { Link } from "wouter";
import { Home, FileText, TrendingUp, ExternalLink, User, Plus, BarChart3, Clock, Crown } from "lucide-react";
import { styled } from '@mui/material/styles';

// Material Dashboard Layout (matching dashboard.tsx exactly)
const DashboardBackground = styled(MDBox)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  gap: 0,
}));

const drawerWidth = 280;

const MainContent = styled(MDBox)(({ theme }) => ({
  flex: 1,
  marginLeft: '328px', // Account for sidebar width (280px) + margins (24px * 2)
  backgroundColor: '#f8f9fa',
  padding: 4,
  minHeight: '100vh',
  overflow: 'auto',
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    width: '100%',
    padding: '16px',
  },
}));

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  tier: 'free' | 'growth' | 'capital';
  resultReady: boolean;
}

export default function ValueCalculator() {
  const [, setLocation] = useLocation();
  const { user: authUser, isLoading: authLoading } = useAuth();
  
  // Check if user has completed at least one assessment
  const { data: assessments, isLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/assessments'],
  });

  const hasCompletedAssessment = assessments && assessments.length > 0;

  useEffect(() => {
    // If no assessments and not loading, redirect to assessment form
    if (!isLoading && !hasCompletedAssessment) {
      setLocation('/assessment/free');
    }
  }, [isLoading, hasCompletedAssessment, setLocation]);

  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: !!authUser,
  });

  if (authLoading || isLoading) {
    return (
      <DashboardBackground>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Box sx={{ 
            width: 40, 
            height: 40, 
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #2152ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            }
          }} />
        </Box>
      </DashboardBackground>
    );
  }

  // Show access denied if no assessments found
  if (!hasCompletedAssessment) {
    return (
      <DashboardBackground>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={3}>
          <Box sx={{ 
            maxWidth: 400, 
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            p: 4,
            textAlign: 'center'
          }}>
            <Lock size={64} color="#67748e" style={{ marginBottom: 16 }} />
            <Typography variant="h4" sx={{ color: '#344767', fontWeight: 700, mb: 2 }}>
              Assessment Required
            </Typography>
            <Typography variant="body1" sx={{ color: '#67748e', mb: 3 }}>
              You need to complete a business valuation assessment before accessing the value improvement calculator.
            </Typography>
            <Button 
              onClick={() => setLocation('/assessment/free')}
              variant="contained"
              startIcon={<ArrowLeft />}
              sx={{
                backgroundColor: '#0A1F44',
                '&:hover': {
                  backgroundColor: '#1a365d'
                }
              }}
            >
              Start Valuation Assessment
            </Button>
          </Box>
        </Box>
      </DashboardBackground>
    );
  }

  // Use actual user data or default to free tier
  const displayUser = user || {
    id: "demo-user",
    email: "demo@applebites.ai",
    firstName: "Demo",
    lastName: "User", 
    profileImageUrl: "/default-avatar.png",
    tier: 'free' as const,
    resultReady: false
  };

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'growth':
        return {
          name: 'Growth & Exit Assessment',
          color: 'primary',
          description: 'Professional industry-specific analysis with AI insights',
          price: '$795',
        };
      case 'capital':
        return {
          name: 'Capital Readiness Assessment',
          color: 'secondary',
          description: 'Comprehensive capital readiness analysis and strategic planning',
          price: '$2,500',
        };
      default:
        return {
          name: 'Free Assessment',
          color: 'default',
          description: 'Basic business valuation analysis',
          price: 'Free',
        };
    }
  };

  const tierInfo = getTierInfo(displayUser.tier);

  return (
    <DashboardBackground>
      {/* Responsive Sidebar - Hide on mobile */}
      <MDBox
        sx={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          width: 280,
          height: 'calc(100vh - 48px)',
          display: { xs: 'none', md: 'flex' }, // Hide on mobile, show on desktop
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          padding: 3,
          zIndex: 1000,
          overflow: 'hidden',
        }}
      >
        {/* User Info Section */}
        <MDBox mb={4}>
          <MDBox display="flex" alignItems="center" mb={2}>
            <Avatar
              sx={{
                background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
                width: 48,
                height: 48,
                mr: 2
              }}
            >
              {displayUser.firstName?.charAt(0) || 'D'}{displayUser.lastName?.charAt(0) || 'U'}
            </Avatar>
            <MDBox>
              <MDTypography variant="h6" fontWeight="medium" sx={{ color: 'white' }}>
                {displayUser.firstName} {displayUser.lastName}
              </MDTypography>
              <MDTypography variant="caption" sx={{ color: '#005b8c' }}>
                {displayUser.email}
              </MDTypography>
            </MDBox>
          </MDBox>
          
          <MDBox display="flex" alignItems="center">
            <MDTypography variant="body2" mr={1} sx={{ color: 'white' }}>
              Tier:
            </MDTypography>
            <MDBox
              sx={{
                background: tierInfo.name === 'Free' 
                  ? 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)'
                  : tierInfo.name === 'Growth' 
                  ? 'linear-gradient(135deg, #00718d 0%, #0A1F44 100%)'
                  : 'linear-gradient(135deg, #00718d 0%, #3B82F6 100%)',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {tierInfo.name.toUpperCase()}
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Navigation Buttons */}
        <MDBox display="flex" flexDirection="column" gap={2}>
          <Link href="/assessment/free">
            <MDButton
              sx={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#dbdce1',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
                width: '100%',
                py: 1.5
              }}
              startIcon={<Plus size={18} />}
            >
              New Assessment
            </MDButton>
          </Link>

          {/* Value Calculator - Active */}
          <MDButton
            sx={{
              background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
              color: '#0A1F44',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              },
              transition: 'all 0.3s ease',
              width: '100%',
              py: 1.5
            }}
            startIcon={<BarChart3 size={18} />}
          >
            Value Calculator
          </MDButton>

          {displayUser.tier === 'free' && (
            <MDButton
              sx={{
                background: 'transparent',
                border: '2px solid #005b8c',
                color: '#005b8c',
                '&:hover': {
                  background: '#005b8c',
                  color: '#0A1F44',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
                width: '100%',
                py: 1.5
              }}
              startIcon={<Crown size={18} />}
              onClick={() => window.open('https://products.applebites.ai/', '_blank')}
            >
              Upgrade Plan
            </MDButton>
          )}

          <Link href="/dashboard">
            <MDButton
              sx={{
                background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 500,
                '&:hover': {
                  background: 'linear-gradient(135deg, #1B2C4F 0%, #2A3B5C 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                },
                transition: 'all 0.3s ease',
                width: '100%',
                py: 1.5
              }}
              startIcon={<User size={18} />}
            >
              Dashboard
            </MDButton>
          </Link>

          <Link href="/past-assessments">
            <MDButton
              className="text-[#dbdce1]"
              sx={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#dbdce1',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease',
                width: '100%',
                py: 1.5
              }}
              startIcon={<Clock size={18} />}
            >
              Past Assessments
            </MDButton>
          </Link>
        </MDBox>

        {/* Spacer */}
        <MDBox flexGrow={1} />

        {/* Footer */}
        <MDBox mt={4} pt={2} borderTop="1px solid rgba(255, 255, 255, 0.2)">
          <MDBox display="flex" flexDirection="column" alignItems="center" gap={1}>
            <Box
              component="img"
              src="/assets/logos/apple-bites-meritage-logo.png"
              alt="Apple Bites by Meritage Partners"
              sx={{
                width: 250,
                height: 250,
                objectFit: 'contain',
                maxWidth: '100%'
              }}
            />
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Main Content - Ultra Compact Layout */}
      <MainContent sx={{
        marginLeft: { xs: 0, md: '320px' }, // No margin on mobile, fixed margin on desktop
        padding: { xs: 2, md: 4 },
        minHeight: '100vh',
        backgroundColor: 'rgba(248, 249, 250, 0.7)',
        width: { xs: '100%', md: 'calc(100% - 320px)' }, // Full width on mobile
      }}>
        <Container maxWidth="xl" sx={{ py: 0.5, px: 2 }}>
          {/* Page Header - Ultra Compact */}
          <MDBox 
            sx={{ 
              mb: 1,
              p: 1.5,
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}
          >
            <MDBox>
              <MDTypography variant="h6" sx={{ 
                color: '#344767', 
                fontWeight: 600,
                mb: 0.125,
                fontSize: '1rem'
              }}>
                Value Improvement Calculator
              </MDTypography>
              <MDTypography variant="body2" sx={{ 
                color: '#67748e',
                fontSize: '0.8rem'
              }}>
                Explore how improving your operational grades affects your business valuation
              </MDTypography>
            </MDBox>
            <Button
              variant="outlined"
              startIcon={<ArrowLeft size={14} />}
              onClick={() => setLocation('/dashboard')}
              sx={{
                borderColor: '#0A1F44',
                color: '#0A1F44',
                px: 1.25,
                py: 0.5,
                fontSize: '0.7rem',
                borderRadius: '6px',
                minHeight: 'auto',
                '&:hover': {
                  borderColor: '#0A1F44',
                  backgroundColor: 'rgba(10, 31, 68, 0.05)'
                }
              }}
            >
              BACK TO DASHBOARD
            </Button>
          </MDBox>

          {/* Main Content Container - Flex layout to eliminate phantom space */}
          <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Main Calculator Container - Ultra Scaled Down */}
            <MDBox sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              p: 1.5
            }}>
              <MDBox sx={{ 
                transform: 'scale(0.7)', 
                transformOrigin: 'top left',
                width: '142.86%', // Compensate for scale to fill container
                height: 'auto',
                mb: -25
              }}>
                <InteractiveValuationSlider />
              </MDBox>

              {/* AI Coaching Tips Section - Moved inside the same container */}
              {hasCompletedAssessment && assessments && assessments.length > 0 && (
                <MDBox sx={{ mt: 2, p: 2 }}>
                  <AICoachingTips 
                    financialData={{
                      revenue: parseFloat(assessments[0].grossRevenue || '0') || 1000000,
                      ebitda: parseFloat(assessments[0].ebitda || '0') || 200000,
                      adjustedEbitda: parseFloat(assessments[0].adjustedEbitda || '0') || 200000,
                      naicsCode: assessments[0].naicsCode || '541511',
                      industryTitle: assessments[0].industryTitle || 'Business Services',
                      valueDriverScores: {
                        'Financial Performance': assessments[0].financialPerformance ? ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].financialPerformance) !== -1 ? 5 - ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].financialPerformance) : 3 : 3,
                        'Customer Concentration': assessments[0].customerConcentration ? ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].customerConcentration) !== -1 ? 5 - ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].customerConcentration) : 3 : 3,
                        'Management Team': assessments[0].managementTeam ? ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].managementTeam) !== -1 ? 5 - ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].managementTeam) : 3 : 3,
                        'Competitive Position': assessments[0].competitivePosition ? ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].competitivePosition) !== -1 ? 5 - ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].competitivePosition) : 3 : 3,
                        'Growth Prospects': assessments[0].growthProspects ? ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].growthProspects) !== -1 ? 5 - ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].growthProspects) : 3 : 3,
                        'Systems & Processes': assessments[0].systemsProcesses ? ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].systemsProcesses) !== -1 ? 5 - ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].systemsProcesses) : 3 : 3,
                        'Asset Quality': assessments[0].assetQuality ? ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].assetQuality) !== -1 ? 5 - ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].assetQuality) : 3 : 3,
                        'Industry Outlook': assessments[0].industryOutlook ? ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].industryOutlook) !== -1 ? 5 - ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].industryOutlook) : 3 : 3,
                        'Risk Factors': assessments[0].riskFactors ? ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].riskFactors) !== -1 ? 5 - ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].riskFactors) : 3 : 3,
                        'Owner Dependency': assessments[0].ownerDependency ? ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].ownerDependency) !== -1 ? 5 - ['A', 'B', 'C', 'D', 'F'].indexOf(assessments[0].ownerDependency) : 3 : 3,
                      },
                      userMultiple: parseFloat(assessments[0].valuationMultiple || '4.2') || 4.2,
                      industryAverage: 4.5,
                      companySize: parseFloat(assessments[0].adjustedEbitda || '0') > 2000000 ? 'large' : 
                                  parseFloat(assessments[0].adjustedEbitda || '0') > 500000 ? 'medium' : 'small',
                      businessAge: assessments[0].businessAge || '5',
                      employeeCount: parseInt(assessments[0].employeeCount || '0') || undefined
                    }}
                  />
                </MDBox>
              )}
            </MDBox>
          </MDBox>
        </Container>
      </MainContent>
    </DashboardBackground>
  );
}