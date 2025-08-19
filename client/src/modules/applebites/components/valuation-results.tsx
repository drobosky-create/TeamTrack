import { ValuationAssessment } from "@shared/schema";
import { CheckCircle, Calendar, Calculator, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent, Typography, Box } from '@mui/material';
import ValueDriversHeatmap from "./value-drivers-heatmap";
import MDBox from "../../../components/MD/MDBox";
import MDTypography from "../../../components/MD/MDTypography";
import MDButton from "../../../components/MD/MDButton";

interface ValuationResultsProps {
  results: ValuationAssessment;
}

export default function ValuationResults({ results }: ValuationResultsProps) {
  const [, setLocation] = useLocation();

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

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "#4CAF50"; // Green
      case "B": return "#8BC34A"; // Light Green  
      case "C": return "#FF9800"; // Orange
      case "D": return "#FF5722"; // Red Orange
      case "F": return "#F44336"; // Red
      default: return "#9E9E9E"; // Gray
    }
  };

  const handleScheduleConsultation = () => {
    window.open('https://api.leadconnectorhq.com/widget/bookings/applebites', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  };

  const handleExploreImprovements = () => {
    setLocation(`/value-calculator?assessmentId=${results.id}`);
  };

  return (
    <MDBox sx={{ maxWidth: '1200px', margin: '0 auto', p: 2 }}>
      {/* Header Section */}
      <MDBox textAlign="center" mb={1}>
        <CheckCircle size={32} color="#4CAF50" style={{ marginBottom: '16px' }} />
        <MDTypography variant="h4" fontWeight="bold" color="dark" mb={2}>
          Your Business Valuation Results
        </MDTypography>
        <MDTypography variant="h6" color="text" mb={3}>
          Professional analysis complete - here's what your business is worth
        </MDTypography>
      </MDBox>

      {/* Main Valuation Card */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox textAlign="center">
            <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#005b8c', mb: 2 }}>
              Estimated Business Value
            </MDTypography>
            
            <MDBox 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-around', 
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}
            >
              <MDBox textAlign="center">
                <MDTypography 
                  variant="h5" 
                  fontWeight="bold" 
                  sx={{ 
                    color: '#ffffff', 
                    mb: 1,
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    wordBreak: 'break-word'
                  }}
                >
                  {formatCurrency(results.lowEstimate)}
                </MDTypography>
                <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Conservative
                </MDTypography>
              </MDBox>
              
              <MDBox textAlign="center">
                <MDTypography 
                  variant="h3" 
                  fontWeight="bold" 
                  sx={{ 
                    color: '#005b8c', 
                    mb: 1,
                    fontSize: { xs: '1.8rem', sm: '2.5rem' },
                    wordBreak: 'break-word'
                  }}
                >
                  {formatCurrency(results.midEstimate)}
                </MDTypography>
                <MDTypography variant="body1" sx={{ color: '#ffffff', fontWeight: 'medium' }}>
                  Most Likely Value
                </MDTypography>
              </MDBox>
              
              <MDBox textAlign="center">
                <MDTypography 
                  variant="h5" 
                  fontWeight="bold" 
                  sx={{ 
                    color: '#ffffff', 
                    mb: 1,
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    wordBreak: 'break-word'
                  }}
                >
                  {formatCurrency(results.highEstimate)}
                </MDTypography>
                <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Optimistic
                </MDTypography>
              </MDBox>
            </MDBox>

            <MDBox 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center'
              }}
            >
              <MDButton 
                onClick={handleExploreImprovements}
                variant="contained"
                sx={{ 
                  background: 'linear-gradient(135deg, #00D4AA 0%, #005b8c 100%)',
                  color: 'white',
                  fontSize: { xs: '14px', sm: '16px' },
                  fontWeight: 'bold',
                  px: { xs: 3, sm: 4 },
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(0, 212, 170, 0.4)',
                  animation: 'glow 2s ease-in-out infinite alternate',
                  '@keyframes glow': {
                    '0%': { 
                      boxShadow: '0 4px 15px rgba(0, 212, 170, 0.4), 0 0 10px rgba(0, 212, 170, 0.3)',
                      transform: 'translateY(0px)'
                    },
                    '100%': { 
                      boxShadow: '0 6px 20px rgba(0, 212, 170, 0.6), 0 0 20px rgba(0, 212, 170, 0.5)',
                      transform: 'translateY(-2px)'
                    }
                  },
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #00F5C4 0%, #007BA7 100%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 25px rgba(0, 212, 170, 0.7)'
                  },
                  '&:active': {
                    transform: 'translateY(-1px)'
                  }
                }}
                startIcon={<Calculator size={18} />}
              >
                Explore Improvements
              </MDButton>

              <MDButton 
                onClick={handleScheduleConsultation}
                variant="contained"
                sx={{ 
                  background: '#005b8c',
                  color: '#0A1F44',
                  '&:hover': { background: '#4DD0C7' }
                }}
                startIcon={<Calendar size={16} />}
              >
                Schedule Consultation
              </MDButton>
            </MDBox>
          </MDBox>
        </CardContent>
      </Card>

      {/* Key Metrics Row */}
      <MDBox display="flex" gap={3} mb={4} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Financial Summary */}
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <MDTypography variant="h6" fontWeight="medium" color="dark" mb={2}>
              Financial Summary
            </MDTypography>
            
            <MDBox mb={2}>
              <MDBox display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="textSecondary">Adjusted EBITDA:</Typography>
                <Typography variant="h6" fontWeight="medium">{formatCurrency(results.adjustedEbitda)}</Typography>
              </MDBox>
              <MDBox display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="textSecondary">Valuation Multiple:</Typography>
                <Typography variant="h6" fontWeight="medium">{results.valuationMultiple}x</Typography>
              </MDBox>
            </MDBox>
          </CardContent>
        </Card>

        {/* Overall Grade */}
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <MDTypography variant="h6" fontWeight="medium" color="dark" mb={2}>
              Overall Business Grade
            </MDTypography>
            
            <MDBox
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: getGradeColor(results.overallScore || 'C'),
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                margin: '0 auto 16px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            >
              {results.overallScore}
            </MDBox>
            
            <Typography variant="body2" color="textSecondary">
              {results.overallScore === 'A' && 'Excellent Performance'}
              {results.overallScore === 'B' && 'Good Performance'}
              {results.overallScore === 'C' && 'Average Performance'}
              {results.overallScore === 'D' && 'Below Average'}
              {results.overallScore === 'F' && 'Needs Improvement'}
            </Typography>
          </CardContent>
        </Card>
      </MDBox>

      {/* AI Executive Summary */}
      {results.executiveSummary && (
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <MDTypography variant="h5" fontWeight="bold" color="dark" mb={3}>
              AI Executive Summary
            </MDTypography>
            <MDTypography variant="body1" color="text" sx={{ lineHeight: 1.7, mb: 3 }}>
              {results.executiveSummary}
            </MDTypography>
          </CardContent>
        </Card>
      )}

      {/* Value Drivers Heatmap */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <MDTypography variant="h6" fontWeight="medium" color="dark" mb={3}>
            Business Value Drivers Analysis
          </MDTypography>
          <ValueDriversHeatmap assessment={results} />
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card sx={{ background: '#F8F9FA' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <MDTypography variant="h5" fontWeight="bold" color="dark" mb={2}>
            Ready to Maximize Your Business Value?
          </MDTypography>
          
          <MDTypography variant="body1" color="text" mb={3}>
            Schedule a complimentary 30-minute strategy session with our M&A experts to discuss your results and explore value enhancement opportunities.
          </MDTypography>

          <MDButton 
            onClick={handleScheduleConsultation}
            variant="gradient"
            color="success"
            size="large"
            startIcon={<Calendar size={20} />}
            sx={{ px: 4, py: 1.5 }}
          >
            Schedule Your Strategy Session
          </MDButton>
          
          <MDTypography variant="body2" color="textSecondary" mt={2}>
            No obligation • Expert M&A guidance • Personalized recommendations
          </MDTypography>
        </CardContent>
      </Card>
    </MDBox>
  );
}