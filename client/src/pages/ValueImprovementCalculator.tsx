import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  AlertTitle,
  Chip,
  Grid,
  Paper,
  LinearProgress,
  Container,
  IconButton,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TrendingUp,
  Trophy,
  Target,
  AlertCircle,
  ChevronRight,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Loader2,
  Calculator,
  ArrowLeft
} from 'lucide-react';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';

// Styled Components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#f0f2f5',
  padding: theme.spacing(3)
}));

const MainCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
  overflow: 'visible'
}));

const HeaderGradient = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(195deg, #42424a 0%, #191919 100%)',
  padding: theme.spacing(4),
  color: 'white',
  borderRadius: '12px 12px 0 0'
}));

const GradeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  border: '2px solid transparent',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
  }
}));

const ValueBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '8px',
  backgroundColor: '#f3f4f6',
  textAlign: 'center'
}));

interface GradeImpact {
  grade: string;
  label: string;
  multiple: number;
  value: number;
  improvement: number;
  color: string;
  bgColor: string;
}

interface Assessment {
  id: number;
  adjustedEbitda: string;
  financialPerformance?: string;
  competitivePosition?: string;
  systemsProcesses?: string;
  growthProspects?: string;
  riskFactors?: string;
  assetQuality?: string;
  valuationMultiple?: string;
  midEstimate?: string;
  company?: string;
  tier?: string;
}

export default function ValueImprovementCalculator() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [selectedGrade, setSelectedGrade] = useState<string>('C');

  // Fetch assessment data
  const { data: response, isLoading } = useQuery<{ success: boolean; assessment: Assessment }>({
    queryKey: id === 'latest' ? ['/api/consumer/assessments/latest'] : [`/api/assessments/${id}`]
  });

  const assessment = response?.assessment;

  // Calculate average grade from value drivers
  const calculateAverageGrade = (assessment: Assessment) => {
    if (!assessment) return 'C';

    const grades = [
      assessment.financialPerformance,
      assessment.competitivePosition,
      assessment.systemsProcesses,
      assessment.growthProspects,
      assessment.riskFactors,
      assessment.assetQuality
    ].filter(Boolean);

    if (grades.length === 0) return 'C';

    const gradeValues: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, F: 1 };
    const valueToGrade: Record<number, string> = { 5: 'A', 4: 'B', 3: 'C', 2: 'D', 1: 'F' };

    const avgValue = grades.reduce((sum, grade) => sum + (gradeValues[grade] || 3), 0) / grades.length;
    return valueToGrade[Math.round(avgValue)] || 'C';
  };

  const assessmentData = assessment
    ? {
        adjustedEbitda: parseFloat(assessment.adjustedEbitda || '0'),
        currentGrade: calculateAverageGrade(assessment),
        currentMultiple: parseFloat(assessment.valuationMultiple || '4.2'),
        currentValue: parseFloat(assessment.midEstimate || '0'),
        company: assessment.company || 'Your Business'
      }
    : null;

  const gradeImpacts: GradeImpact[] = [
    {
      grade: 'F',
      label: 'Poor Operations',
      multiple: 2.0,
      value: (assessmentData?.adjustedEbitda || 0) * 2,
      improvement: -52,
      color: '#f44335',
      bgColor: '#ffebee'
    },
    {
      grade: 'D',
      label: 'Below Average',
      multiple: 3.0,
      value: (assessmentData?.adjustedEbitda || 0) * 3,
      improvement: -29,
      color: '#ff9800',
      bgColor: '#fff3e0'
    },
    {
      grade: 'C',
      label: 'Average Operations',
      multiple: 4.2,
      value: (assessmentData?.adjustedEbitda || 0) * 4.2,
      improvement: 0,
      color: '#fb8c00',
      bgColor: '#ffe0b2'
    },
    {
      grade: 'B',
      label: 'Good Operations',
      multiple: 5.7,
      value: (assessmentData?.adjustedEbitda || 0) * 5.7,
      improvement: 36,
      color: '#49a3f1',
      bgColor: '#e3f2fd'
    },
    {
      grade: 'A',
      label: 'Excellent Operations',
      multiple: 7.5,
      value: (assessmentData?.adjustedEbitda || 0) * 7.5,
      improvement: 79,
      color: '#4CAF50',
      bgColor: '#e8f5e9'
    }
  ];

  const currentGradeData = gradeImpacts.find(g => g.grade === assessmentData?.currentGrade);
  const selectedGradeData = gradeImpacts.find(g => g.grade === selectedGrade);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Container maxWidth="lg">
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
            <Loader2 className="animate-spin" size={48} color="#667eea" />
            <Typography variant="h6" sx={{ mt: 2, color: '#6B7280' }}>
              Loading assessment data...
            </Typography>
          </Box>
        </Container>
      </PageContainer>
    );
  }

  if (!assessmentData) {
    return (
      <PageContainer>
        <Container maxWidth="md">
          <MainCard>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                No Assessment Found
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#6B7280' }}>
                You need to complete an assessment first to explore value improvements.
              </Typography>
              <MDButton
                variant="gradient"
                color="primary"
                onClick={() => setLocation('/assessment/free')}
                startIcon={<Calculator size={20} />}
              >
                Start Free Assessment
              </MDButton>
            </CardContent>
          </MainCard>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="lg">
        {/* Navigation Buttons */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => window.history.back()}
            sx={{ color: '#6B7280' }}
          >
            Back to Results
          </Button>
          <MDButton
            variant="outlined"
            color="dark"
            onClick={() => setLocation('/consumer-dashboard')}
          >
            Return to Dashboard
          </MDButton>
        </Box>

        <MainCard>
          {/* Header */}
          <HeaderGradient>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Value Improvement Calculator
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  {assessmentData.company}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  Explore how operational improvements could impact your business value
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <ValueBox sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Typography variant="body2" sx={{ color: 'white', opacity: 0.9, mb: 1 }}>
                    Current EBITDA
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {formatCurrency(assessmentData.adjustedEbitda)}
                  </Typography>
                </ValueBox>
              </Grid>
            </Grid>
          </HeaderGradient>

          <CardContent sx={{ p: 4 }}>
            {/* Current Status */}
            <Alert 
              severity="info" 
              sx={{ 
                mb: 4,
                backgroundColor: '#e3f2fd',
                '& .MuiAlert-icon': {
                  color: '#49a3f1'
                }
              }}
            >
              <AlertTitle sx={{ fontWeight: 'bold', color: '#344767' }}>Your Current Position</AlertTitle>
              <Typography sx={{ color: '#344767' }}>
                Your business currently has a <strong>Grade {assessmentData.currentGrade}</strong> operational rating with an estimated value of{' '}
                <strong>{formatCurrency(assessmentData.currentValue)}</strong> based on a {assessmentData.currentMultiple}x multiple.
              </Typography>
            </Alert>

            {/* Grade Selection */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Select Target Performance Level
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              {gradeImpacts.map(impact => (
                <GradeCard
                  key={impact.grade}
                  elevation={selectedGrade === impact.grade ? 8 : 2}
                  onClick={() => setSelectedGrade(impact.grade)}
                  sx={{
                    flex: 1,
                    minWidth: '150px',
                    border: selectedGrade === impact.grade ? `2px solid ${impact.color}` : '2px solid transparent',
                    backgroundColor: selectedGrade === impact.grade ? impact.bgColor : 'white'
                  }}
                >
                  <Box textAlign="center">
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 'bold',
                        color: impact.color,
                        mb: 1
                      }}
                    >
                      {impact.grade}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', mb: 1 }}>
                      {impact.label}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                      {impact.multiple}x
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      Multiple
                    </Typography>
                  </Box>
                </GradeCard>
              ))}
            </Box>

            {/* Value Comparison */}
            {selectedGradeData && (
              <>
                <Divider sx={{ my: 4 }} />
                
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Value Impact Analysis
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                  <Paper sx={{ 
                    flex: 1, 
                    p: 3, 
                    textAlign: 'center', 
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef'
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#6B7280', mb: 1 }}>
                      Current Value
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#344767', mb: 1 }}>
                      {formatCurrency(currentGradeData?.value || 0)}
                    </Typography>
                    <Chip
                      label={`Grade ${currentGradeData?.grade}`}
                      sx={{
                        backgroundColor: currentGradeData?.bgColor,
                        color: currentGradeData?.color,
                        fontWeight: 'bold'
                      }}
                    />
                  </Paper>

                  <Paper sx={{ 
                    flex: 1, 
                    p: 3, 
                    textAlign: 'center',
                    border: '1px solid #e9ecef' 
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#6B7280', mb: 1 }}>
                      Potential Change
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      {selectedGradeData.improvement > 0 ? (
                        <ArrowUp size={24} color="#4CAF50" />
                      ) : selectedGradeData.improvement < 0 ? (
                        <ArrowDown size={24} color="#f44335" />
                      ) : (
                        <ChevronRight size={24} color="#6B7280" />
                      )}
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 'bold',
                          color: selectedGradeData.improvement > 0 ? '#4CAF50' : selectedGradeData.improvement < 0 ? '#f44335' : '#6B7280'
                        }}
                      >
                        {selectedGradeData.improvement > 0 ? '+' : ''}
                        {selectedGradeData.improvement}%
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#6B7280', mt: 1 }}>
                      {formatCurrency(Math.abs(selectedGradeData.value - (currentGradeData?.value || 0)))} difference
                    </Typography>
                  </Paper>

                  <Paper
                    sx={{
                      flex: 1,
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: selectedGradeData.bgColor,
                      border: `2px solid ${selectedGradeData.color}`
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: '#6B7280', mb: 1 }}>
                      Target Value
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: selectedGradeData.color, mb: 1 }}>
                      {formatCurrency(selectedGradeData.value)}
                    </Typography>
                    <Chip
                      label={`Grade ${selectedGradeData.grade}`}
                      sx={{
                        backgroundColor: 'white',
                        color: selectedGradeData.color,
                        fontWeight: 'bold'
                      }}
                    />
                  </Paper>
                </Box>

                {/* Improvement Path */}
                {selectedGradeData.improvement > 0 && (
                  <Alert severity="success" sx={{ mt: 4 }}>
                    <AlertTitle>Path to Grade {selectedGradeData.grade}</AlertTitle>
                    Achieving {selectedGradeData.label.toLowerCase()} could increase your business value by{' '}
                    <strong>{selectedGradeData.improvement}%</strong> to <strong>{formatCurrency(selectedGradeData.value)}</strong>.
                    Focus on improving operational efficiency, customer satisfaction, and strategic positioning.
                  </Alert>
                )}

                {/* Action Buttons */}
                <Box display="flex" gap={2} justifyContent="center" mt={4}>
                  <MDButton
                    variant="gradient"
                    color="dark"
                    size="large"
                    onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/applebites', '_blank')}
                  >
                    <Target size={20} style={{ marginRight: 8 }} />
                    Schedule Strategy Call
                  </MDButton>
                  <MDButton
                    variant="gradient"
                    color="info"
                    size="large"
                    onClick={() => setLocation('/assessment/growth')}
                  >
                    <TrendingUp size={20} style={{ marginRight: 8 }} />
                    Get Detailed Analysis
                  </MDButton>
                </Box>
              </>
            )}
          </CardContent>
        </MainCard>
      </Container>
    </PageContainer>
  );
}