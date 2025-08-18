import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

import { ArrowLeft, Home, FileText, TrendingUp, ExternalLink, LogOut, User, Plus, Crown, Clock, BarChart3 } from "lucide-react";
import ValuationResults from "@/components/valuation-results";
import StrategicReport from "@/components/strategic-report";
import type { ValuationAssessment } from "@shared/schema";
import { Link } from "wouter";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import MDButton from "@/components/MD/MDButton";
import MDAvatar from "@/components/MD/MDAvatar";
import {
  Box,
  Typography,
  Container,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Material Dashboard Styled Components (matching dashboard.tsx exactly)
const DashboardBackground = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  gap: 0,
}));

const drawerWidth = 280;

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: '16px 24px 24px 8px',
  marginLeft: 0,
  minHeight: '100vh',
  width: `calc(100vw - ${drawerWidth}px)`,
  backgroundColor: '#f8f9fa',
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

export default function AssessmentResults() {
  const [, params] = useRoute("/assessment-results/:id");
  const [, setLocation] = useLocation();
  const { user: authUser, isLoading: authLoading } = useAuth();
  
  const assessmentId = params?.id;

  // Check if admin is authenticated
  const { data: adminStatus } = useQuery({
    queryKey: ['/api/admin/status'],
    retry: false,
  });

  // Fetch all assessments to find the specific one
  const { data: assessments, isLoading: assessmentsLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/analytics/assessments'],
    enabled: !!assessmentId,
  });

  // Find the specific assessment
  const assessment = assessments?.find(a => a.id.toString() === assessmentId);

  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: !!authUser,
  });

  // Allow access if user is authenticated OR admin is authenticated
  const hasAccess = authUser || (adminStatus?.authenticated === true);

  if (authLoading || assessmentsLoading) {
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

  // Redirect to login if no access
  if (!hasAccess && !authLoading) {
    setLocation('/admin-login');
    return null;
  }

  if (!assessment) {
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
            <FileText size={64} color="#67748e" style={{ marginBottom: 16 }} />
            <Typography variant="h4" sx={{ color: '#344767', fontWeight: 700, mb: 2 }}>
              Assessment Not Found
            </Typography>
            <Typography variant="body1" sx={{ color: '#67748e', mb: 3 }}>
              The requested assessment could not be found or you don't have access to it.
            </Typography>
            <Button 
              onClick={() => setLocation('/value-calculator')}
              
            >
              <ArrowLeft  />
              Back to Value Calculator
            </Button>
          </Box>
        </Box>
      </DashboardBackground>
    );
  }

  // Use actual user data or default to free tier
  const displayUser: User = (user as User) || {
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
      {/* Apple Bites Unified Sidebar - Hide on mobile */}
      <DashboardSidebar user={{
        name: `${assessment.firstName} ${assessment.lastName}`,
        email: assessment.email || 'user@applebites.ai',
        tier: assessment.tier as 'free' | 'growth' | 'capital',
        firstName: assessment.firstName,
        lastName: assessment.lastName
      }} />

      {/* Main Content */}
      <MainContent sx={{ 
        marginLeft: { xs: 0, md: '328px' }, 
        width: { xs: '100%', md: 'calc(100vw - 328px)' } 
      }}>
        <Container maxWidth="xl" sx={{ py: 0 }}>
          {/* Page Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ 
                color: '#344767', 
                fontWeight: 700,
                mb: 1
              }}>
                Assessment Results
              </Typography>
              <Typography variant="h6" sx={{ 
                color: '#67748e', 
                fontWeight: 400
              }}>
                {assessment.firstName} {assessment.lastName} - {new Date(assessment.createdAt || Date.now()).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
            <Button
              onClick={() => setLocation(adminStatus?.authenticated ? '/admin-dashboard' : '/dashboard')}
              variant="outlined"
              startIcon={<ArrowLeft size={18} />}
            >
              Back to {adminStatus?.authenticated ? 'Admin Dashboard' : 'Dashboard'}
            </Button>
          </Box>

          {/* Show Strategic Report for paid tiers, basic ValuationResults for free tier */}
          {(assessment.tier === 'growth' || assessment.tier === 'capital' || assessment.tier === 'paid') ? (
            <StrategicReport results={assessment} />
          ) : (
            <ValuationResults results={assessment} />
          )}
        </Container>
      </MainContent>
    </DashboardBackground>
  );
}

// DashboardSidebar Component (matching dashboard.tsx exactly)
function DashboardSidebar({ user }: { user: { name: string; email: string; tier: 'free' | 'growth' | 'capital'; firstName?: string; lastName?: string; } }) {
  // Apple Bites Brand Colors
  const colors = {
    primary: "#00718d",
    secondary: "#0A1F44", 
    accent: "#005b8c",
    grayLight: "#F7FAFC"
  };

  const gradients = {
    primary: "linear-gradient(135deg, #00718d 0%, #0A1F44 100%)",
    light: "linear-gradient(135deg, #00718d 0%, #005b8c 100%)",
    dark: "linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)",
    glow: "linear-gradient(135deg, #00718d 0%, #3B82F6 100%)"
  };

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'free': return '#94A3B8';
      case 'growth': return '#00718d';
      case 'capital': return '#3B82F6';
      default: return '#94A3B8';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'free': return 'Free';
      case 'growth': return 'Growth';
      case 'capital': return 'Capital';
      default: return 'Free';
    }
  };

  return (
    <MDBox
      sx={{
        position: 'fixed',
        top: '24px',
        left: '24px',
        width: 280,
        height: 'calc(100vh - 48px)',
        background: gradients.dark,
        borderRadius: '20px',
        border: `1px solid rgba(255, 255, 255, 0.15)`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        padding: 3,
        display: { xs: 'none', md: 'flex' }, // Hide on mobile, show on desktop
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden' // Prevent internal scrolling
      }}
    >
      {/* User Info Section */}
      <MDBox mb={4}>
        <MDBox display="flex" alignItems="center" mb={2}>
          <MDAvatar
            sx={{
              background: gradients.glow,
              width: 48,
              height: 48,
              mr: 2
            }}
          >
            <User size={24} color="white" />
          </MDAvatar>
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" sx={{ color: 'white' }}>
              {user.name}
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: colors.accent }}>
              {user.email}
            </MDTypography>
          </MDBox>
        </MDBox>
        
        <MDBox display="flex" alignItems="center">
          <MDTypography variant="body2" mr={1} sx={{ color: 'white' }}>
            Tier:
          </MDTypography>
          <MDBox
            sx={{
              background: getTierGradient(user.tier),
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
            {getTierLabel(user.tier)}
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Navigation Buttons */}
      <MDBox display="flex" flexDirection="column" gap={2}>
        <Link href="/assessment/free">
          <MDButton
            sx={{
              background: gradients.glow,
              color: 'white',
              '&:hover': {
                background: gradients.light,
                transform: 'translateY(-2px)',

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

        {user.tier === 'free' && (
          <MDButton
            sx={{
              background: 'transparent',
              border: `2px solid ${colors.accent}`,
              color: colors.accent,
              '&:hover': {
                background: colors.accent,
                color: colors.secondary,
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

        <Link href="/profile">
          <MDButton
            className="text-[#dbdce1]"
            sx={{
              background: 'transparent',
              border: `1px solid rgba(255, 255, 255, 0.3)`,
              color: '#dbdce1',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease',
              width: '100%',
              py: 1.5
            }}
            startIcon={<User size={18} />}
          >
            My Profile
          </MDButton>
        </Link>

        <Link href="/past-assessments">
          <MDButton
            className="text-[#dbdce1]"
            sx={{
              background: 'transparent',
              border: `1px solid rgba(255, 255, 255, 0.3)`,
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
      <MDBox mt={4} pt={2} borderTop={`1px solid rgba(255, 255, 255, 0.2)`}>
        <MDBox display="flex" flexDirection="column" alignItems="center" gap={1}>
          <img
            src="/assets/logos/apple-bites-meritage-logo.png"
            alt="Apple Bites by Meritage Partners"
            width={250}
            height={250}
            style={{
              objectFit: 'contain',
              maxWidth: '100%'
            }}
          />
        </MDBox>
      </MDBox>
    </MDBox>
  );
}
