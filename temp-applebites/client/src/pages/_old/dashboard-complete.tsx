import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Container,
  Card,
  CardContent,
  Avatar,
  Chip,
  Grid,
  Divider,
  LinearProgress,
} from '@mui/material';
import { 
  TrendingUp, 
  Assessment, 
  Lock, 
  Download,
  Schedule,
  Upgrade,
  CheckCircle,
  FileCopy,
  Business,
} from '@mui/icons-material';
// Import Material Dashboard components
import { MDBox, MDTypography, MDButton } from "@/components/MD";

export default function CompleteDashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // User data with tier logic
  const userData = {
    firstName: user?.firstName || "Demo",
    lastName: user?.lastName || "User", 
    email: user?.email || "demo@applebites.ai",
    tier: user?.tier || "free",
  };

  const isPaidTier = userData.tier === 'growth' || userData.tier === 'capital';
  const isFree = userData.tier === 'free';

  // Mock assessment data for demonstration
  const assessmentData = {
    hasCompletedAssessment: true, // Toggle this to show different states
    valuationRange: { min: 2100000, max: 4800000 },
    ebitdaMultiple: { min: 3.2, max: 4.5 },
    overallGrade: 'B+',
    industry: 'Professional Services',
    capitalReadinessScore: 75,
    valueDriverScores: {
      financialPerformance: 'B+',
      customerBase: 'A-',
      managementTeam: 'B',
      marketPosition: 'B+',
      growthProspects: 'A',
      systemsProcesses: 'C+',
      assetQuality: 'B',
      industryOutlook: 'B+',
      riskFactors: 'B-',
      ownerDependency: 'C'
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <MDTypography variant="h6" color="text">Loading your dashboard...</MDTypography>
        </MDBox>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section with User Info Block */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <MDBox>
          <MDTypography variant="h4" fontWeight="bold" color="dark" mb={1}>
            Your {isFree ? 'Free' : userData.tier.charAt(0).toUpperCase() + userData.tier.slice(1)} Assessment Dashboard
          </MDTypography>
          <MDTypography variant="body1" color="text">
            {isFree ? 'Basic business valuation analysis' : 'Professional industry-specific analysis with AI insights'}
          </MDTypography>
        </MDBox>
        
        {/* User Info Block - matches screenshot */}
        <Card sx={{ minWidth: '280px' }}>
          <CardContent>
            <MDBox display="flex" alignItems="center" mb={2}>
              <Avatar 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  mr: 2,
                  bgcolor: isFree ? '#757575' : '#1976d2',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}
              >
                {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
              </Avatar>
              <MDBox>
                <MDTypography variant="h6" fontWeight="medium" color="dark">
                  {userData.firstName} {userData.lastName}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {userData.email}
                </MDTypography>
              </MDBox>
            </MDBox>
            
            <Chip 
              label={isFree ? 'Free' : userData.tier.charAt(0).toUpperCase() + userData.tier.slice(1)}
              color={isFree ? 'default' : 'primary'}
              size="small"
              sx={{ fontWeight: 'medium' }}
            />
          </CardContent>
        </Card>
      </MDBox>

      {/* Assessment Status & Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <MDBox display="flex" alignItems="center" mb={3}>
                <Assessment sx={{ mr: 2, color: '#1976d2' }} />
                <MDTypography variant="h6" fontWeight="medium" color="dark">
                  Assessment Status
                </MDTypography>
              </MDBox>
              
              {!assessmentData.hasCompletedAssessment ? (
                <MDBox>
                  <MDTypography variant="body1" color="text" mb={2}>
                    Complete your business assessment to get your valuation report
                  </MDTypography>
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="large"
                    onClick={() => setLocation('/assessment/free')}
                    startIcon={<Assessment />}
                  >
                    Start Assessment
                  </MDButton>
                </MDBox>
              ) : (
                <MDBox>
                  <MDTypography variant="body1" color="success" mb={2}>
                    ✅ Assessment completed! Your valuation report is ready.
                  </MDTypography>
                  <LinearProgress 
                    variant="determinate" 
                    value={100} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#4CAF50'
                      }
                    }} 
                  />
                </MDBox>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <MDBox display="flex" alignItems="center" mb={3}>
                <Assessment sx={{ mr: 2, color: '#1976d2' }} />
                <MDTypography variant="h6" fontWeight="medium" color="dark">
                  Quick Actions
                </MDTypography>
              </MDBox>
              
              <MDBox display="flex" flexDirection="column" gap={2}>
                <MDButton
                  variant="contained"
                  color="info"
                  onClick={() => setLocation('/assessment/free')}
                  startIcon={<Assessment />}
                  size="small"
                >
                  New Assessment
                </MDButton>
                
                {isFree && (
                  <MDButton
                    variant="gradient"
                    color="warning"
                    onClick={() => setLocation('/upgrade')}
                    startIcon={<Upgrade />}
                    size="small"
                  >
                    Upgrade Plan
                  </MDButton>
                )}
                
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => setLocation('/assessments')}
                  startIcon={<FileCopy />}
                  size="small"
                >
                  View Past Assessments
                </MDButton>
              </MDBox>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Feature Comparison - Free vs Paid */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <MDTypography variant="h5" fontWeight="bold" color="dark">
              What's Included in Your {isFree ? 'Free' : userData.tier.charAt(0).toUpperCase() + userData.tier.slice(1)} Assessment
            </MDTypography>
            
            {isFree && (
              <MDButton
                variant="gradient" 
                color="warning"
                size="large"
                onClick={() => setLocation('/upgrade')}
                startIcon={<Upgrade />}
              >
                Upgrade Now
              </MDButton>
            )}
          </MDBox>

          <Grid container spacing={3}>
            {/* Free Features */}
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
                  <MDTypography variant="h6" fontWeight="medium" color="dark">
                    Basic Valuation Analysis
                  </MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="text" mb={2}>
                  General EBITDA multipliers and financial assessment
                </MDTypography>
              </MDBox>

              <MDBox mb={2}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
                  <MDTypography variant="h6" fontWeight="medium" color="dark">
                    Value Driver Scoring
                  </MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="text" mb={2}>
                  A-F grade assessment across 10 key business factors
                </MDTypography>
              </MDBox>

              <MDBox mb={2}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
                  <MDTypography variant="h6" fontWeight="medium" color="dark">
                    PDF Report Generation
                  </MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="text" mb={2}>
                  Professional report with valuation range and insights
                </MDTypography>
              </MDBox>

              <MDBox mb={2}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
                  <MDTypography variant="h6" fontWeight="medium" color="dark">
                    Email Delivery
                  </MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="text">
                  Automated report delivery to your inbox
                </MDTypography>
              </MDBox>
            </Grid>

            {/* Premium Features */}
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  {isPaidTier ? (
                    <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
                  ) : (
                    <Lock sx={{ color: '#ff9800', mr: 1 }} />
                  )}
                  <MDTypography variant="h6" fontWeight="medium" color={isPaidTier ? "dark" : "text"}>
                    Industry-Specific Analysis
                  </MDTypography>
                  {!isPaidTier && (
                    <Chip 
                      label="Upgrade Required" 
                      size="small" 
                      color="warning" 
                      sx={{ ml: 1 }} 
                    />
                  )}
                </MDBox>
                <MDTypography variant="body2" color="text" mb={2}>
                  NAICS-specific multipliers and benchmarks
                </MDTypography>
              </MDBox>

              <MDBox mb={2}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  {isPaidTier ? (
                    <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
                  ) : (
                    <Lock sx={{ color: '#ff9800', mr: 1 }} />
                  )}
                  <MDTypography variant="h6" fontWeight="medium" color={isPaidTier ? "dark" : "text"}>
                    AI-Powered Business Insights
                  </MDTypography>
                  {!isPaidTier && (
                    <Chip 
                      label="Upgrade Required" 
                      size="small" 
                      color="warning" 
                      sx={{ ml: 1 }} 
                    />
                  )}
                </MDBox>
                <MDTypography variant="body2" color="text" mb={2}>
                  GPT-4 powered recommendations and strategies
                </MDTypography>
              </MDBox>

              <MDBox mb={2}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  {isPaidTier ? (
                    <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
                  ) : (
                    <Lock sx={{ color: '#ff9800', mr: 1 }} />
                  )}
                  <MDTypography variant="h6" fontWeight="medium" color={isPaidTier ? "dark" : "text"}>
                    Advanced Financial Modeling
                  </MDTypography>
                  {!isPaidTier && (
                    <Chip 
                      label="Upgrade Required" 
                      size="small" 
                      color="warning" 
                      sx={{ ml: 1 }} 
                    />
                  )}
                </MDBox>
                <MDTypography variant="body2" color="text" mb={2}>
                  Detailed cash flow and scenario analysis
                </MDTypography>
              </MDBox>

              <MDBox mb={2}>
                <MDBox display="flex" alignItems="center" mb={2}>
                  {isPaidTier ? (
                    <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
                  ) : (
                    <Lock sx={{ color: '#ff9800', mr: 1 }} />
                  )}
                  <MDTypography variant="h6" fontWeight="medium" color={isPaidTier ? "dark" : "text"}>
                    Executive Presentation
                  </MDTypography>
                  {!isPaidTier && (
                    <Chip 
                      label="Upgrade Required" 
                      size="small" 
                      color="warning" 
                      sx={{ ml: 1 }} 
                    />
                  )}
                </MDBox>
                <MDTypography variant="body2" color="text">
                  Investment-grade presentation materials
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>

          {/* Unlock Premium Banner */}
          {isFree && (
            <MDBox 
              variant="gradient" 
              bgColor="warning" 
              p={3} 
              borderRadius="lg" 
              shadow="md" 
              mt={4}
            >
              <MDBox display="flex" alignItems="center" justifyContent="space-between">
                <MDBox>
                  <MDTypography variant="h6" fontWeight="bold" color="white" mb={1}>
                    🔓 Unlock Premium Features
                  </MDTypography>
                  <MDTypography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                    Upgrade to Growth or Capital tier for industry-specific analysis, AI insights, and executive-grade reports.
                  </MDTypography>
                </MDBox>
                <MDButton
                  variant="contained"
                  color="white"
                  onClick={() => setLocation('/upgrade')}
                  sx={{ 
                    color: '#ff9800',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  View Upgrade Options
                </MDButton>
              </MDBox>
            </MDBox>
          )}
        </CardContent>
      </Card>

      {/* Valuation Results - Only show if assessment completed */}
      {assessmentData.hasCompletedAssessment && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <MDBox display="flex" alignItems="center" mb={3}>
              <TrendingUp sx={{ mr: 2, color: '#1A73E8' }} />
              <MDTypography variant="h5" fontWeight="bold" color="dark">
                Your Business Valuation Results
              </MDTypography>
            </MDBox>
            
            {/* Valuation Range Meter */}
            <MDBox display="flex" gap={3} flexWrap="wrap" mb={4}>
              <MDBox flex="1" minWidth="300px">
                <MDBox variant="gradient" bgColor="info" p={3} borderRadius="lg" shadow="md">
                  <MDTypography variant="h3" fontWeight="bold" color="white" textAlign="center">
                    ${(assessmentData.valuationRange.min/1000000).toFixed(1)}M - ${(assessmentData.valuationRange.max/1000000).toFixed(1)}M
                  </MDTypography>
                  <MDTypography variant="body2" color="white" textAlign="center" sx={{ opacity: 0.8 }}>
                    Estimated Business Value
                  </MDTypography>
                </MDBox>
              </MDBox>
              
              <MDBox flex="1" minWidth="300px">
                <MDBox bgColor="white" p={3} borderRadius="lg" shadow="md" border="1px solid #e0e0e0">
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <MDTypography variant="body2" color="text" fontWeight="medium">
                        EBITDA Multiple:
                      </MDTypography>
                      <MDTypography variant="h6" color="dark" fontWeight="bold">
                        {assessmentData.ebitdaMultiple.min}x - {assessmentData.ebitdaMultiple.max}x
                      </MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography variant="body2" color="text" fontWeight="medium">
                        Industry:
                      </MDTypography>
                      <MDTypography variant="h6" color="dark" fontWeight="bold">
                        {assessmentData.industry}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography variant="body2" color="text" fontWeight="medium">
                        Overall Grade:
                      </MDTypography>
                      <MDTypography variant="h6" color="success" fontWeight="bold">
                        {assessmentData.overallGrade}
                      </MDTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <MDTypography variant="body2" color="text" fontWeight="medium">
                        Readiness Score:
                      </MDTypography>
                      <MDTypography variant="h6" color="warning" fontWeight="bold">
                        {assessmentData.capitalReadinessScore}%
                      </MDTypography>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </MDBox>

            {/* A-F Heatmap Value Driver Scores */}
            <MDBox mb={4}>
              <MDTypography variant="h6" fontWeight="medium" color="dark" mb={3}>
                Value Driver Assessment Heatmap
              </MDTypography>
              
              <Grid container spacing={2}>
                {Object.entries(assessmentData.valueDriverScores).map(([key, grade]) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                    <MDBox
                      bgColor="white"
                      p={2}
                      borderRadius="lg"
                      shadow="sm"
                      border="1px solid #e0e0e0"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <MDTypography variant="body2" fontWeight="medium" color="text">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </MDTypography>
                      <MDBox
                        width="32px"
                        height="32px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgColor={
                          grade.startsWith('A') ? 'rgba(66, 165, 245, 0.1)' :
                          grade.startsWith('B') ? 'rgba(139, 195, 74, 0.1)' :
                          grade.startsWith('C') ? 'rgba(255, 152, 0, 0.1)' :
                          'rgba(244, 67, 54, 0.1)'
                        }
                        borderRadius="md"
                        border={`1px solid ${
                          grade.startsWith('A') ? '#42a5f5' :
                          grade.startsWith('B') ? '#8bc34a' :
                          grade.startsWith('C') ? '#ff9800' :
                          '#f44336'
                        }`}
                      >
                        <MDTypography
                          variant="caption"
                          fontWeight="bold"
                          sx={{ color: 
                            grade.startsWith('A') ? '#42a5f5' :
                            grade.startsWith('B') ? '#8bc34a' :
                            grade.startsWith('C') ? '#ff9800' :
                            '#f44336'
                          }}
                        >
                          {grade}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </Grid>
                ))}
              </Grid>
            </MDBox>

            {/* Contextual Button Group */}
            <MDBox display="flex" gap={2} flexWrap="wrap" justifyContent="center">
              <MDButton
                variant="gradient"
                color="success"
                size="large"
                startIcon={<Download />}
                disabled={isFree}
              >
                Download PDF Report
              </MDButton>
              
              <MDButton
                variant="gradient"
                color="info"
                size="large"
                startIcon={<Schedule />}
              >
                Schedule Consultation
              </MDButton>
              
              <MDButton
                variant="gradient"
                color="warning"
                size="large"
                onClick={() => setLocation('/value-calculator')}
                startIcon={<TrendingUp />}
              >
                Explore Value Improvements
              </MDButton>
              
              {isFree && (
                <MDButton
                  variant="gradient"
                  color="error"
                  size="large"
                  onClick={() => setLocation('/upgrade')}
                  startIcon={<Lock />}
                >
                  Unlock Full Report
                </MDButton>
              )}
            </MDBox>
          </CardContent>
        </Card>
      )}

      {/* Previous Assessments Grid */}
      <Card>
        <CardContent>
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <MDBox display="flex" alignItems="center">
              <FileCopy sx={{ mr: 2, color: '#1976d2' }} />
              <MDTypography variant="h5" fontWeight="bold" color="dark">
                Past Assessments
              </MDTypography>
            </MDBox>
            <MDButton
              variant="outlined"
              color="info"
              startIcon={<Assessment />}
              onClick={() => setLocation('/assessment/free')}
            >
              New Assessment
            </MDButton>
          </MDBox>
          
          {/* Mock past assessments or empty state */}
          {assessmentData.hasCompletedAssessment ? (
            <Grid container spacing={3}>
              {[
                {
                  id: 1,
                  company: 'ABC Manufacturing Co.',
                  valuation: 3200000,
                  grade: 'B+',
                  date: new Date('2024-01-15'),
                  status: 'Completed'
                },
                {
                  id: 2, 
                  company: 'XYZ Professional Services',
                  valuation: 1800000,
                  grade: 'B-',
                  date: new Date('2023-11-22'),
                  status: 'Completed'
                },
                {
                  id: 3,
                  company: 'Tech Solutions Inc.',
                  valuation: 5400000,
                  grade: 'A-',
                  date: new Date('2023-08-10'),
                  status: 'Completed'
                }
              ].map((assessment) => (
                <Grid item xs={12} md={6} lg={4} key={assessment.id}>
                  <MDBox
                    bgColor="white"
                    borderRadius="lg"
                    shadow="sm"
                    p={3}
                    border="1px solid #e0e0e0"
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                        borderColor: '#1976d2'
                      }
                    }}
                    onClick={() => setLocation(`/assessment-results/${assessment.id}`)}
                  >
                    <MDBox display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <MDBox>
                        <MDTypography variant="h6" fontWeight="bold" color="dark" mb={1}>
                          {assessment.company}
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {assessment.date.toLocaleDateString()}
                        </MDTypography>
                      </MDBox>
                      <MDBox
                        width="40px"
                        height="40px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgColor={
                          assessment.grade.startsWith('A') ? 'rgba(66, 165, 245, 0.1)' :
                          assessment.grade.startsWith('B') ? 'rgba(139, 195, 74, 0.1)' :
                          'rgba(255, 152, 0, 0.1)'
                        }
                        borderRadius="md"
                        border={`2px solid ${
                          assessment.grade.startsWith('A') ? '#42a5f5' :
                          assessment.grade.startsWith('B') ? '#8bc34a' :
                          '#ff9800'
                        }`}
                      >
                        <MDTypography
                          variant="body2"
                          fontWeight="bold"
                          sx={{ color: 
                            assessment.grade.startsWith('A') ? '#42a5f5' :
                            assessment.grade.startsWith('B') ? '#8bc34a' :
                            '#ff9800'
                          }}
                        >
                          {assessment.grade}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <MDBox display="flex" justifyContent="space-between" alignItems="center">
                      <MDBox>
                        <MDTypography variant="body2" color="text">
                          Estimated Value
                        </MDTypography>
                        <MDTypography variant="h6" fontWeight="bold" color="success">
                          ${(assessment.valuation/1000000).toFixed(1)}M
                        </MDTypography>
                      </MDBox>
                      <Chip 
                        label={assessment.status}
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </MDBox>
                  </MDBox>
                </Grid>
              ))}
            </Grid>
          ) : (
            <MDBox textAlign="center" py={6}>
              <Business sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
              <MDTypography variant="h6" color="text" mb={1}>
                No assessments yet
              </MDTypography>
              <MDTypography variant="body2" color="text" mb={3}>
                Complete your first business valuation assessment to see your results here
              </MDTypography>
              <MDButton
                variant="gradient"
                color="info"
                onClick={() => setLocation('/assessment/free')}
                startIcon={<Assessment />}
              >
                Start Your First Assessment
              </MDButton>
            </MDBox>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}