import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Calendar, TrendingUp, FileText, Eye, Plus, BarChart3, Crown, User, Clock } from "lucide-react";
import { useLocation, Link } from "wouter";
// Assessment interface for Past Assessments
interface Assessment {
  id: number;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  adjustedEbitda: string;
  midEstimate: string;
  lowEstimate: string;
  highEstimate: string;
  valuationMultiple: string;
  overallScore: string;
  tier: string;
  reportTier: string;
  createdAt: string;
  pdfUrl?: string;
  isProcessed: boolean;
  executiveSummary?: string;
}
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import MDButton from "@/components/MD/MDButton";

export default function PastAssessments() {
  const [, setLocation] = useLocation();

  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });

  const formatCurrency = (value: string | null) => {
    if (!value) return "$0";
    const numValue = parseFloat(value);
    
    if (numValue >= 1000000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        notation: 'compact',
        compactDisplay: 'short'
      }).format(numValue);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numValue);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "#4CAF50";
      case "B": return "#8BC34A";
      case "C": return "#FF9800";
      case "D": return "#FF5722";
      case "F": return "#F44336";
      default: return "#9E9E9E";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free": return "default";
      case "growth": return "primary";
      case "capital": return "success";
      default: return "default";
    }
  };

  const viewAssessment = (assessment: Assessment) => {
    console.log('viewAssessment called with:', assessment);
    // Navigate to assessment results page to view the specific assessment
    setLocation(`/assessment-results/${assessment.id}`);
  };

  if (isLoading) {
    return (
      <MDBox sx={{ maxWidth: '1200px', margin: '0 auto', p: 3 }}>
        <MDTypography variant="h4" fontWeight="bold" color="dark" mb={4}>
          Loading Past Assessments...
        </MDTypography>
      </MDBox>
    );
  }

  return (
    <MDBox display="flex" minHeight="100vh" sx={{ backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <MDBox
        sx={{
          position: 'fixed',
          top: 24,
          left: 24,
          bottom: 24,
          width: 280,
          background: 'linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* User Profile Section */}
        <MDBox sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <MDBox display="flex" alignItems="center" gap={2} mb={2}>
            <MDBox
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',  
                background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              SJ
            </MDBox>
            <MDBox>
              <MDTypography variant="h6" sx={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>
                Sarah Johnson
              </MDTypography>
              <MDTypography variant="body2" sx={{ color: '#dbdce1', fontSize: '12px' }}>
                sarah.johnson@democorp.com
              </MDTypography>
            </MDBox>
          </MDBox>
          
          <MDBox
            sx={{
              background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
              borderRadius: '20px',
              px: 2,
              py: 1,
              display: 'inline-block'
            }}
          >
            <MDTypography variant="caption" sx={{ color: 'white', fontWeight: 600, fontSize: '11px' }}>
              FREE ASSESSMENT
            </MDTypography>
          </MDBox>
        </MDBox>

        {/* Navigation Buttons */}
        <MDBox display="flex" flexDirection="column" gap={2} sx={{ p: 3, flex: 1 }}>
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

          <Link href="/value-calculator">
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
              startIcon={<BarChart3 size={18} />}
            >
              Value Calculator
            </MDButton>
          </Link>

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
            startIcon={<Crown size={18} />}
          >
            Upgrade Plan  
          </MDButton>

          <Link href="/dashboard">
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
              startIcon={<User size={18} />}
            >
              Dashboard
            </MDButton>
          </Link>

          <Link href="/past-assessments">
            <MDButton
              sx={{
                background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
                  transform: 'translateY(-2px)',

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

        {/* Apple Bites Branding Footer */}
        <MDBox sx={{ p: 3, textAlign: 'center' }}>
          <MDBox sx={{ mb: 2 }}>
            <MDTypography variant="h6" sx={{ color: '#005b8c', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>
              MERITAGE
            </MDTypography>
            <MDTypography variant="h6" sx={{ color: '#005b8c', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>
              PARTNERS
            </MDTypography>
          </MDBox>
          
          <MDBox sx={{ width: 60, height: 60, mx: 'auto', mb: 2 }}>
            <img 
              src="/assets/logos/apple-bites-logo-3.png" 
              alt="Apple Bites"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </MDBox>
          
          <MDTypography variant="h6" sx={{ color: '#005b8c', fontSize: '14px', fontWeight: 600, letterSpacing: '1px' }}>
            APPLE BITES
          </MDTypography>
          <MDTypography variant="body2" sx={{ color: '#005b8c', fontSize: '10px', fontWeight: 400, letterSpacing: '1px' }}>
            BUSINESS ASSESSMENT
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Main Content */}
      <MDBox sx={{ marginLeft: '328px', flex: 1, p: 3 }}>
        {/* Header */}
        <MDBox mb={4}>
          <MDTypography variant="h4" fontWeight="bold" color="dark" mb={2}>
            Past Business Valuations
          </MDTypography>
          <MDTypography variant="h6" color="text">
            Review your completed business valuation assessments and track your progress over time.
          </MDTypography>
        </MDBox>

        {/* Assessments Grid */}
        {assessments && assessments.length > 0 ? (
        <MDBox display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={3}>
          {assessments.map((assessment) => (
            <Card key={assessment.id} sx={{ height: 'fit-content' }}>
              <CardContent sx={{ p: 3 }}>
                {/* Header with Company and Date */}
                <MDBox display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <MDBox>
                    <MDTypography variant="h6" fontWeight="medium" color="dark" mb={1}>
                      {assessment.company || 'Your Business'}
                    </MDTypography>
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <Calendar size={14} color="#666" />
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(assessment.createdAt || '')}
                      </Typography>
                    </MDBox>
                  </MDBox>
                  
                  <Chip 
                    label={assessment.tier?.toUpperCase() || 'FREE'} 
                    size="small" 
                    color={getTierColor(assessment.tier || 'free') as any}
                    sx={{ fontWeight: 'medium' }}
                  />
                </MDBox>

                {/* Valuation Summary */}
                <MDBox 
                  sx={{ 
                    background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)', 
                    borderRadius: '12px',
                    p: 2,
                    mb: 2,
                    color: 'white'
                  }}
                >
                  <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                    Estimated Value
                  </MDTypography>
                  <MDTypography variant="h5" fontWeight="bold" sx={{ color: '#005b8c' }}>
                    {formatCurrency(assessment.midEstimate)}
                  </MDTypography>
                  <MDBox display="flex" justifyContent="space-between" mt={1}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {formatCurrency(assessment.lowEstimate)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {formatCurrency(assessment.highEstimate)}
                    </Typography>
                  </MDBox>
                </MDBox>

                {/* Key Metrics */}
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <MDBox>
                    <Typography variant="body2" color="textSecondary">EBITDA</Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {formatCurrency(assessment.adjustedEbitda)}
                    </Typography>
                  </MDBox>
                  
                  <MDBox textAlign="center">
                    <Typography variant="body2" color="textSecondary">Multiple</Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {assessment.valuationMultiple}x
                    </Typography>
                  </MDBox>
                  
                  <MDBox textAlign="center">
                    <Typography variant="body2" color="textSecondary">Grade</Typography>
                    <MDBox
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 30% 30%, ${getGradeColor(assessment.overallScore || 'C')}, #0A1F44)`,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        margin: '0 auto',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                    >
                      {assessment.overallScore}
                    </MDBox>
                  </MDBox>
                </MDBox>

                {/* Action Button */}
                <MDButton 
                  variant="outlined"
                  fullWidth
                  startIcon={<Eye size={16} color="white" />}
                  onClick={(e) => {
                    console.log('Eye button clicked for assessment:', assessment.id);
                    e.stopPropagation();
                    e.preventDefault();
                    viewAssessment(assessment);
                  }}
                  sx={{
                    borderColor: '#005b8c',
                    color: 'white',
                    backgroundColor: '#005b8c',
                    '&:hover': {
                      borderColor: '#00718d',
                      backgroundColor: '#00718d',
                      color: 'white'
                    }
                  }}
                >
                  View Full Report
                </MDButton>
              </CardContent>
            </Card>
          ))}
        </MDBox>
      ) : (
        <Card sx={{ textAlign: 'center', p: 6 }}>
          <CardContent>
            <FileText size={64} color="#9E9E9E" style={{ margin: '0 auto 16px' }} />
            <MDTypography variant="h6" color="text" mb={2}>
              No Past Assessments Found
            </MDTypography>
            <MDTypography variant="body1" color="text" mb={3}>
              You haven't completed any business valuation assessments yet. Start your first assessment to track your business value over time.
            </MDTypography>
            <MDButton 
              variant="gradient"
              color="primary"
              startIcon={<TrendingUp size={16} />}
              onClick={() => setLocation('/assessment/free')}
            >
              Start New Assessment
            </MDButton>
          </CardContent>
        </Card>
      )}
      </MDBox>
    </MDBox>
  );
}