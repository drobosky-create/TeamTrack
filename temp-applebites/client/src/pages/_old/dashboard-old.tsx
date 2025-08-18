import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
// Import Material Dashboard components
import { MDBox, MDTypography, MDButton } from "@/components/MD";
import { styled } from '@mui/material/styles';
import { 
  FileText, 
  LogOut,
  TrendingUp,
  Crown,
  CheckCircle,
  Clock,
  ExternalLink,
  Home,
  Settings,
  BarChart3,
  Calendar,
  Download,
  Lock,
  X
} from "lucide-react";

const getGradeStyles = (grade: string) => {
  switch (grade) {
    case 'A+':
    case 'A':
      return {
        borderColor: '#42a5f5', // Blue
        textColor: '#42a5f5',
        bgColor: 'rgba(66, 165, 245, 0.1)', // Light blue tint
      };
    case 'B+':
    case 'B':
    case 'B-':
      return {
        borderColor: '#8bc34a', // Green
        textColor: '#8bc34a',
        bgColor: 'rgba(139, 195, 74, 0.1)', // Light green tint
      };
    case 'C+':
    case 'C':
    case 'C-':
      return {
        borderColor: '#ff9800', // Orange
        textColor: '#ff9800',
        bgColor: 'rgba(255, 152, 0, 0.1)', // Light orange tint
      };
    case 'D+':
    case 'D':
    case 'D-':
    default:
      return {
        borderColor: '#f44336', // Red
        textColor: '#f44336',
        bgColor: 'rgba(244, 67, 54, 0.1)', // Light red tint
      };
  }
};

const GradeBox = ({ grade }: { grade: string }) => {
  const { borderColor, textColor, bgColor } = getGradeStyles(grade);

  return (
    <MDBox
      width="64px"
      height="64px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgColor={bgColor}
      borderRadius="12px"
      shadow="lg"
      sx={{
        backdropFilter: 'blur(12px)',
        border: '2px solid',
        borderColor,
        ml: 2,
      }}
    >
      <MDTypography
        variant="h5"
        fontWeight="bold"
        sx={{ color: textColor }}
      >
        {grade}
      </MDTypography>
    </MDBox>
  );
};

// Material Dashboard Styled Components
const DashboardBackground = styled(MDBox)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  gap: 0, // Remove any gap between sidebar and content
}));

const drawerWidth = 280;

const MainContent = styled(MDBox)(({ theme }) => ({
  flexGrow: 1,
  padding: '16px 24px 24px 8px', // Top, Right, Bottom, Left - minimal left padding
  marginLeft: 0, // Remove margin since drawer is permanent
  minHeight: '100vh',
  width: `calc(100vw - ${drawerWidth}px)`,
  backgroundColor: '#f8f9fa',
  [theme.breakpoints.down('md')]: {
    width: '100vw',
    padding: '16px',
  },
}));

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: '#747b8a !important',
  backgroundColor: '#747b8a !important',
  boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.12)',
  '& .MuiAppBar-root': {
    backgroundColor: '#747b8a !important',
  },
  '&.MuiAppBar-root': {
    backgroundColor: '#747b8a !important',
  },
}));

const WelcomeCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(3),
}));

const StatCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
  },
}));

const ActionButton = styled(MDButton)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
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

interface Assessment {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  reportTier: string;
  adjustedEbitda: number;
  midEstimate: number;
  overallScore: string;
  createdAt: Date | null;
  pdfUrl?: string;
}

// Past Assessments Component
const PastAssessmentsSection = ({ userEmail, setLocation }: { userEmail: string, setLocation: (path: string) => void }) => {
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['/api/analytics/assessments'],
    retry: false,
  });

  const userAssessments = Array.isArray(assessments) ? assessments.filter((assessment: Assessment) => 
    assessment.email === userEmail
  ) : [];

  if (isLoading) {
    return (
      <MDBox display="flex" justifyContent="center" py={4}>
        <MDTypography color="text">Loading assessments...</MDTypography>
      </MDBox>
    );
  }

  if (userAssessments.length === 0) {
    return (
      <MDBox textAlign="center" py={4}>
        <FileText size={48} color="#67748e" style={{ marginBottom: 16 }} />
        <MDTypography variant="h6" color="dark" fontWeight="medium" mb={1}>
          No assessments yet
        </MDTypography>
        <MDTypography variant="body2" color="text" mb={3}>
          Complete your first business valuation assessment to see your results here
        </MDTypography>
      </MDBox>
    );
  }

  return (
    <MDBox>
      {userAssessments.slice(0, 3).map((assessment: Assessment) => (
        <MDBox
          key={assessment.id}
          onClick={() => {
            console.log('Assessment clicked, ID:', assessment.id);
            setLocation(`/assessment-results/${assessment.id}`);
          }}
          bgColor="white"
          borderRadius="lg"
          shadow="sm"
          sx={{
            p: 3,
            mb: 2,
            border: '1px solid #e3e6ea',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#f8f9fa',
              borderColor: '#2152ff',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(33, 82, 255, 0.15)'
            }
          }}
        >
          <MDBox display="flex" justifyContent="space-between" alignItems="start">
            <MDBox flex={1}>
              <MDBox display="flex" alignItems="center" gap={2} mb={1}>
                <BarChart3 size={20} color="#2152ff" />
                <MDTypography variant="h6" fontWeight="bold" color="dark">
                  {assessment.company || 'Business Assessment'}
                </MDTypography>
              </MDBox>
              
              <MDBox display="flex" gap={4} mb={2}>
                <MDBox>
                  <MDTypography variant="body2" color="text">Valuation</MDTypography>
                  <MDTypography variant="h6" color="dark" fontWeight="bold">
                    ${typeof assessment.midEstimate === 'string' ? 
                      parseFloat(assessment.midEstimate).toLocaleString() : 
                      assessment.midEstimate?.toLocaleString() || 'N/A'}
                  </MDTypography>
                </MDBox>
                <MDBox>
                  <MDTypography variant="body2" color="text">EBITDA</MDTypography>
                  <MDTypography variant="h6" color="dark" fontWeight="bold">
                    ${typeof assessment.adjustedEbitda === 'string' ? 
                      parseFloat(assessment.adjustedEbitda).toLocaleString() : 
                      assessment.adjustedEbitda?.toLocaleString() || 'N/A'}
                  </MDTypography>
                </MDBox>
                <MDBox>
                  <MDTypography variant="body2" color="text">Date</MDTypography>
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <Calendar size={16} color="#67748e" />
                    <MDTypography variant="body2" color="text">
                      {assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString() : 'Invalid Date'}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </MDBox>
            </MDBox>
            
            <GradeBox grade={assessment.overallScore || 'C'} />

          </MDBox>
        </MDBox>
      ))}
      
      {userAssessments.length > 3 && (
        <MDBox textAlign="center" mt={2}>
          <MDButton
            variant="text"
            color="info"
          >
            View All {userAssessments.length} Assessments
          </MDButton>
        </MDBox>
      )}
    </MDBox>
  );
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  // Commenting out useToast temporarily as it's not available in this component
  // const { toast } = useToast();
  const { user: authUser, isLoading: authLoading } = useAuth();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    enabled: !!authUser,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      window.location.href = '/api/logout';
    },
    onSuccess: () => {
      // Temporarily commenting out toast notification
      console.log("Logging out...");
    },
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

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'growth':
        return {
          name: 'Growth & Exit Assessment',
          icon: TrendingUp,
          color: 'primary',
          description: 'Professional industry-specific analysis with AI insights',
          price: '$795',
        };
      case 'capital':
        return {
          name: 'Capital Readiness Assessment',
          icon: Crown,
          color: 'secondary',
          description: 'Comprehensive capital readiness analysis and strategic planning',
          price: '$2,500',
        };
      default:
        return {
          name: 'Free Assessment',
          icon: FileText,
          color: 'default',
          description: 'Basic business valuation analysis',
          price: 'Free',
        };
    }
  };

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

  const tierInfo = getTierInfo(displayUser.tier);
  const TierIcon = tierInfo.icon;

  return (
    <DashboardBackground>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' }, // Hide on mobile, show on desktop
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundImage: 'url(/assets/twilight-city-skyline.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            color: 'white',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(11, 20, 38, 0.45)', // Even lighter overlay for better visibility
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)', // Safari support
              border: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 1,
            },
            '& > *': {
              position: 'relative',
              zIndex: 2,
            },
          },
        }}
      >
        <MDBox sx={{ p: 2, textAlign: 'center' }}>
          <Box component="img"
            src="/assets/logos/apple-bites-logo-variant-3.png"
            alt="Apple Bites Business Assessment"
            sx={{
              width: '80%',        // Responsive width inside sidebar
              maxWidth: 200,       // Cap the max width for consistency
              mt: 1,               // Move logo up (margin top)
              mb: 1,               // Space below logo
              mx: 'auto',          // Center horizontally
              display: 'block',
            }}
          />
          <MDTypography variant="h6" fontWeight="bold" color="white" gutterBottom>
            {displayUser.firstName} {displayUser.lastName}
          </MDTypography>
          <MDTypography variant="body2" color="white" sx={{ opacity: 0.7 }} gutterBottom>
            {displayUser.email}
          </MDTypography>
          <Chip 
            label={tierInfo.name}
            size="small"
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          />
        </MDBox>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

        <List sx={{ px: 2, py: 2 }}>
          <ListItem disablePadding>
            <ListItemButton 
              sx={{ 
                borderRadius: '12px',
                mb: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <Home size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="Dashboard" 
                primaryTypographyProps={{ color: 'white', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => setLocation('/assessment/free')}
              sx={{ 
                borderRadius: '12px',
                mb: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <FileText size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="New Assessment" 
                primaryTypographyProps={{ color: 'white', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => window.open('https://products.applebites.ai/', '_blank')}
              sx={{ 
                borderRadius: '12px',
                mb: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <ExternalLink size={20} />
              </ListItemIcon>
              <ListItemText 
                primary="Upgrade Plan" 
                primaryTypographyProps={{ color: 'white', fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Box sx={{ mt: 'auto', p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            sx={{
              backgroundColor: '#747b8a',
                color: '#ffffff',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#495361',
              }
            }}
            startIcon={<LogOut size={18} />}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <MainContent>
        {/* Welcome Section */}
        <WelcomeCard>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={3} mb={3}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                background: 'linear-gradient(135deg, #252160 0%, #00d7fe 100%)',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {displayUser.firstName?.[0]}{displayUser.lastName?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="#344767" gutterBottom>
                  Your {tierInfo.name} Dashboard
                </Typography>
                <Typography variant="body1" color="#67748e" mb={2}>
                  {tierInfo.description}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <TierIcon size={20} color="#2152ff" />
                  <Typography variant="h6" color="#344767" fontWeight="bold">
                    {tierInfo.price}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </WelcomeCard>

        {/* Dashboard Content */}
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Two Column Layout */}
          <Box display="flex" gap={3} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Assessment Status */}
            <Box sx={{ flex: 1 }}>
              <StatCard sx={{ minHeight: 200 }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <CheckCircle size={24} color={displayUser.resultReady ? "#4caf50" : "#ff9800"} />
                    <Typography variant="h6" fontWeight="bold" color="#344767">
                      Assessment Status
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="#67748e" sx={{ flexGrow: 1, mb: 3 }}>
                    {displayUser.resultReady 
                      ? "Your assessment is complete and ready for download"
                      : "Complete your business assessment to get your valuation report"
                    }
                  </Typography>
                  <ActionButton
                    variant="contained"
                    fullWidth
                    onClick={() => setLocation('/assessment/free')}
                    sx={{
                      backgroundColor: '#747b8a',
                      color: '#ffffff',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 500,
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#495361',
                      },
                    }}
                  >
                    {displayUser.resultReady ? "View Results" : "Start Assessment"}
                  </ActionButton>
                </CardContent>
              </StatCard>
            </Box>

            {/* Quick Actions */}
            <Box sx={{ flex: 1 }}>
              <StatCard sx={{ minHeight: 200 }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <TierIcon size={24} color="#2152ff" />
                    <Typography variant="h6" fontWeight="bold" color="#344767">
                      Quick Actions
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" gap={2} sx={{ flexGrow: 1, justifyContent: 'flex-start' }}>
                    <ActionButton
                      variant="outlined"
                      startIcon={<FileText size={18} />}
                      onClick={() => setLocation('/assessment/free')}
                      sx={{
                        borderColor: '#2152ff',
                        color: '#2152ff',
                        '&:hover': {
                          backgroundColor: 'rgba(33, 82, 255, 0.04)',
                          borderColor: '#1e4bff',
                        }
                      }}
                    >
                      New Assessment
                    </ActionButton>
                    <ActionButton
                      variant="outlined"
                      startIcon={<ExternalLink size={18} />}
                      onClick={() => window.open('https://products.applebites.ai/', '_blank')}
                      sx={{
                        borderColor: '#67748e',
                        color: '#67748e',
                        '&:hover': {
                          backgroundColor: 'rgba(103, 116, 142, 0.04)',
                          borderColor: '#344767',
                        }
                      }}
                    >
                      Upgrade Plan
                    </ActionButton>
                  </Box>
                </CardContent>
              </StatCard>
            </Box>
          </Box>

          {/* Past Assessments */}
          <StatCard>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold" color="#344767">
                  Past Assessments
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<FileText size={18} />}
                  onClick={() => setLocation('/assessment/free')}
                  sx={{
                    borderColor: '#2152ff',
                    color: '#2152ff',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(33, 82, 255, 0.04)',
                      borderColor: '#1e4bff',
                    }
                  }}
                >
                  New Assessment
                </Button>
              </Box>
              
              <PastAssessmentsSection userEmail={displayUser.email} setLocation={setLocation} />
            </CardContent>
          </StatCard>

          {/* Features Overview - Full Width */}
          <StatCard>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold" color="#344767">
                  What's Included in Your {tierInfo.name}
                </Typography>
                {displayUser.tier === 'free' && (
                  <Button
                    variant="contained"
                    startIcon={<Crown size={18} />}
                    onClick={() => window.open('https://products.applebites.ai/', '_blank')}
                    sx={{
                      backgroundColor: '#ff9800',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#f57c00',
                      }
                    }}
                  >
                    Upgrade Now
                  </Button>
                )}
              </Box>
              
              <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={3}>
                {/* Current Tier Features */}
                <Box display="flex" alignItems="start" gap={2}>
                  <CheckCircle size={20} color="#4caf50" style={{ marginTop: 2 }} />
                  <Box>
                    <Typography variant="body1" fontWeight="600" color="#344767">
                      Basic Valuation Analysis
                    </Typography>
                    <Typography variant="body2" color="#67748e">
                      General EBITDA multipliers and financial assessment
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="start" gap={2}>
                  <CheckCircle size={20} color="#4caf50" style={{ marginTop: 2 }} />
                  <Box>
                    <Typography variant="body1" fontWeight="600" color="#344767">
                      Value Driver Scoring
                    </Typography>
                    <Typography variant="body2" color="#67748e">
                      A-F grade assessment across 10 key business factors
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="start" gap={2}>
                  <CheckCircle size={20} color="#4caf50" style={{ marginTop: 2 }} />
                  <Box>
                    <Typography variant="body1" fontWeight="600" color="#344767">
                      PDF Report Generation
                    </Typography>
                    <Typography variant="body2" color="#67748e">
                      Professional report with valuation range and insights
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="start" gap={2}>
                  <CheckCircle size={20} color="#4caf50" style={{ marginTop: 2 }} />
                  <Box>
                    <Typography variant="body1" fontWeight="600" color="#344767">
                      Email Delivery
                    </Typography>
                    <Typography variant="body2" color="#67748e">
                      Automated report delivery to your inbox
                    </Typography>
                  </Box>
                </Box>

                {/* Growth Tier Features */}
                {displayUser.tier === 'free' ? (
                  <>
                    <Box display="flex" alignItems="start" gap={2} sx={{ opacity: 0.6 }}>
                      <Lock size={20} color="#ff9800" style={{ marginTop: 2 }} />
                      <Box>
                        <Typography variant="body1" fontWeight="600" color="#67748e" sx={{ textDecoration: 'line-through' }}>
                          Industry-Specific Analysis
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label="Upgrade Required" 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#ff9800', 
                              color: 'white', 
                              fontSize: '10px',
                              height: '20px'
                            }} 
                          />
                          <Typography variant="body2" color="#67748e">
                            NAICS-specific multipliers and benchmarks
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="start" gap={2} sx={{ opacity: 0.6 }}>
                      <Lock size={20} color="#ff9800" style={{ marginTop: 2 }} />
                      <Box>
                        <Typography variant="body1" fontWeight="600" color="#67748e" sx={{ textDecoration: 'line-through' }}>
                          AI-Powered Business Insights
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label="Upgrade Required" 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#ff9800', 
                              color: 'white', 
                              fontSize: '10px',
                              height: '20px'
                            }} 
                          />
                          <Typography variant="body2" color="#67748e">
                            GPT-4 powered recommendations and strategies
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="start" gap={2} sx={{ opacity: 0.6 }}>
                      <Lock size={20} color="#ff9800" style={{ marginTop: 2 }} />
                      <Box>
                        <Typography variant="body1" fontWeight="600" color="#67748e" sx={{ textDecoration: 'line-through' }}>
                          Advanced Financial Modeling
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label="Upgrade Required" 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#ff9800', 
                              color: 'white', 
                              fontSize: '10px',
                              height: '20px'
                            }} 
                          />
                          <Typography variant="body2" color="#67748e">
                            Detailed cash flow and scenario analysis
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="start" gap={2} sx={{ opacity: 0.6 }}>
                      <Lock size={20} color="#ff9800" style={{ marginTop: 2 }} />
                      <Box>
                        <Typography variant="body1" fontWeight="600" color="#67748e" sx={{ textDecoration: 'line-through' }}>
                          Executive Presentation
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label="Upgrade Required" 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#ff9800', 
                              color: 'white', 
                              fontSize: '10px',
                              height: '20px'
                            }} 
                          />
                          <Typography variant="body2" color="#67748e">
                            Investment-grade presentation materials
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box display="flex" alignItems="start" gap={2}>
                      <CheckCircle size={20} color="#4caf50" style={{ marginTop: 2 }} />
                      <Box>
                        <Typography variant="body1" fontWeight="600" color="#344767">
                          Industry-Specific Analysis
                        </Typography>
                        <Typography variant="body2" color="#67748e">
                          NAICS-specific multipliers and benchmarks
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="start" gap={2}>
                      <CheckCircle size={20} color="#4caf50" style={{ marginTop: 2 }} />
                      <Box>
                        <Typography variant="body1" fontWeight="600" color="#344767">
                          AI-Powered Business Insights
                        </Typography>
                        <Typography variant="body2" color="#67748e">
                          GPT-4 powered recommendations and strategies
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="start" gap={2}>
                      <CheckCircle size={20} color="#4caf50" style={{ marginTop: 2 }} />
                      <Box>
                        <Typography variant="body1" fontWeight="600" color="#344767">
                          Advanced Financial Modeling
                        </Typography>
                        <Typography variant="body2" color="#67748e">
                          Detailed cash flow and scenario analysis
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="start" gap={2}>
                      <CheckCircle size={20} color="#4caf50" style={{ marginTop: 2 }} />
                      <Box>
                        <Typography variant="body1" fontWeight="600" color="#344767">
                          Executive Presentation
                        </Typography>
                        <Typography variant="body2" color="#67748e">
                          Investment-grade presentation materials
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>

              {displayUser.tier === 'free' && (
                <Box 
                  mt={4} 
                  p={3} 
                  sx={{ 
                    backgroundColor: '#fff3e0', 
                    borderRadius: '12px',
                    border: '1px solid #ffcc02'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Crown size={20} color="#ff9800" />
                    <Typography variant="h6" fontWeight="bold" color="#e65100">
                      Unlock Premium Features
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="#bf360c" mb={2}>
                    Upgrade to Growth or Capital tier for industry-specific analysis, AI insights, and executive-grade reports.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<ExternalLink size={16} />}
                    onClick={() => window.open('https://products.applebites.ai/', '_blank')}
                    sx={{
                      backgroundColor: '#ff9800',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#f57c00',
                      }
                    }}
                  >
                    View Upgrade Options
                  </Button>
                </Box>
              )}
            </CardContent>
          </StatCard>
        </Box>
      </MainContent>
    </DashboardBackground>
  );
}