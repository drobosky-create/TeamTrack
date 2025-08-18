import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Box, Card, CardContent, Typography, Button, Chip, Grid } from '@mui/material';
import { TrendingUp, ArrowRight, Phone } from "lucide-react";
import ModernGradeChart from './modern-grade-chart';
import OperationalGradeGauge from './OperationalGradeGauge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ValuationAssessment } from "@shared/schema";

type OperationalGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export default function InteractiveValuationSlider() {
  const [location] = useLocation();
  
  // Get assessment ID from URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const assessmentId = urlParams.get('assessmentId');
  
  // Fetch the assessment data
  const { data: assessments, isLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/analytics/assessments']
  });

  // Grade mapping functions
  const gradeToNumber = (grade: OperationalGrade): number => {
    switch (grade) {
      case 'A': return 4;
      case 'B': return 3;
      case 'C': return 2;
      case 'D': return 1;
      case 'F': return 0;
    }
  };

  const numberToGrade = (num: number): OperationalGrade => {
    switch (num) {
      case 4: return 'A';
      case 3: return 'B';
      case 2: return 'C';
      case 1: return 'D';
      default: return 'F';
    }
  };

  // Use specific assessment if ID provided, otherwise use most recent
  const targetAssessment = assessmentId 
    ? assessments?.find(a => a.id.toString() === assessmentId)
    : assessments?.[assessments.length - 1];
  
  // Ensure EBITDA is properly parsed from string to number
  const getEbitdaValue = (assessment: ValuationAssessment | undefined): number => {
    if (!assessment) return 1379841; // Default fallback
    
    const adjustedEbitda = assessment.adjustedEbitda;
    if (!adjustedEbitda) return 1379841;
    
    const parsed = typeof adjustedEbitda === 'string' ? parseFloat(adjustedEbitda) : adjustedEbitda;
    return !isNaN(parsed) && parsed > 0 ? parsed : 1379841;
  };
  
  const currentEbitda = getEbitdaValue(targetAssessment);
  const baseGrade: OperationalGrade = targetAssessment ? 
    (targetAssessment.overallScore?.charAt(0) as OperationalGrade || 'C') : 'C';

  const [sliderGrade, setSliderGrade] = useState<OperationalGrade>(baseGrade);
  const [showBooking, setShowBooking] = useState(false);

  // Handle slider change without auto-scrolling
  const handleSliderChange = (value: number[]) => {
    const newGrade = numberToGrade(value[0]);
    setSliderGrade(newGrade);
  };

  // Update slider when new data loads
  useEffect(() => {
    setSliderGrade(baseGrade);
  }, [baseGrade]);

  // EBITDA multiples based on operational grades
  const getMultipleForGrade = (grade: OperationalGrade): number => {
    // Using centralized multiplier scale for consistency
    const multipliers = {
      'A': 7.5, // Excellent Operations
      'B': 5.7, // Good Operations
      'C': 4.2, // Average Operations
      'D': 3.0, // Needs Improvement
      'F': 2.0  // At Risk
    };
    return multipliers[grade] || 4.2;
  };

  const calculateValuation = (grade: OperationalGrade): number => {
    const multiple = getMultipleForGrade(grade);
    return currentEbitda * multiple;
  };

  const getGradeInfo = (grade: 'A' | 'B' | 'C' | 'D' | 'F') => {
    const multiplier = getMultipleForGrade(grade);
    const colorMap = {
      'A': { 
        primary: '#10B981', 
        light: '#D1FAE5', 
        bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
        border: '#10B981'
      },
      'B': { 
        primary: '#3B82F6', 
        light: '#DBEAFE', 
        bg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        border: '#3B82F6'
      },
      'C': { 
        primary: '#F59E0B', 
        light: '#FEF3C7', 
        bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
        border: '#F59E0B'
      },
      'D': { 
        primary: '#F97316', 
        light: '#FFEDD5', 
        bg: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
        border: '#F97316'
      },
      'F': { 
        primary: '#EF4444', 
        light: '#FEE2E2', 
        bg: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
        border: '#EF4444'
      }
    };
    return { 
      multiplier, 
      ...colorMap[grade],
      label: `Grade ${grade}: ${multiplier.toFixed(1)}x`
    };
  };

  const currentValuation = calculateValuation(baseGrade);
  const sliderValuation = calculateValuation(sliderGrade);
  const potentialIncrease = sliderValuation - currentValuation;
  const percentageIncrease = currentValuation > 0 ? ((potentialIncrease / currentValuation) * 100) : 0;

  // Get multiples for display
  const currentMultiple = getMultipleForGrade(baseGrade);
  const sliderMultiple = getMultipleForGrade(sliderGrade);

  const getGradeCategory = (grade: OperationalGrade): { label: string; color: string; bgColor: string } => {
    switch (grade) {
      case 'A': return { label: "Excellent Operations", color: "#065F46", bgColor: "#10B981" };
      case 'B': return { label: "Good Operations", color: "#1E40AF", bgColor: "#3B82F6" };
      case 'C': return { label: "Average Operations", color: "#0c4a6e", bgColor: "#0891B2" };
      case 'D': return { label: "Below Average", color: "#92400E", bgColor: "#F59E0B" };
      case 'F': return { label: "Poor Operations", color: "#991B1B", bgColor: "#EF4444" };
    }
  };

  const currentCategory = getGradeCategory(baseGrade);
  const sliderCategory = getGradeCategory(sliderGrade);

  useEffect(() => {
    if (gradeToNumber(sliderGrade) > gradeToNumber(baseGrade)) {
      const timer = setTimeout(() => setShowBooking(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowBooking(false);
    }
  }, [sliderGrade, baseGrade, gradeToNumber]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ 
          width: 40, 
          height: 40, 
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #0A1F44',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          }
        }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      

      {/* Operational Grade Gauge */}
      <Card sx={{ mb: 3, textAlign: 'center' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0A1F44', mb: 2 }}>
            Your Current Operational Grade
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <OperationalGradeGauge 
              grade={baseGrade}
              title="Overall Business Grade"
              animated={true}
              onGradeClick={(grade) => setSliderGrade(grade)}
            />
          </Box>
          <Typography variant="body1" sx={{ color: '#67748e' }}>
            This gauge shows your overall operational performance based on your assessment
          </Typography>
        </CardContent>
      </Card>

      {/* Current vs Potential Value Cards with reduced spacing */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Current Value Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
            color: 'white !important',
            position: 'relative',
            overflow: 'hidden',
            '& *': {
              color: 'white !important'
            }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', flex: 1, color: 'white !important' }}>
                  Current Value
                </Typography>
                <Chip 
                  label="You are here"
                  size="small"
                  sx={{ 
                    backgroundColor: '#F59E0B',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.8, color: 'white !important' }}>
                Based on your Operational Grade of {baseGrade}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'white !important' }}>
                ${currentValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9, color: 'white !important' }}>
                ${currentMultiple}x EBITDA Multiple
              </Typography>
              <Chip 
                label={currentCategory.label}
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Potential Value Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ 
            background: sliderGrade !== baseGrade ? 
              (potentialIncrease > 0 ? 
                'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)' : 
                'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)'
              ) :
              'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
            color: sliderGrade !== baseGrade ? '#111827' : '#374151',
            border: sliderGrade !== baseGrade ? 
              (potentialIncrease > 0 ? '2px solid #10B981' : '2px solid #EF4444') :
              '1px solid #E2E8F0',
            transform: sliderGrade !== baseGrade ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease',
            boxShadow: sliderGrade !== baseGrade ? 
              (potentialIncrease > 0 ? 
                '0 10px 25px rgba(16, 185, 129, 0.2)' : 
                '0 10px 25px rgba(239, 68, 68, 0.2)'
              ) : '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                Potential Value
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
                Based on selected grade ({sliderGrade})
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                ${sliderValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                ${sliderMultiple}x EBITDA Multiple
              </Typography>
              <Chip 
                label={sliderCategory.label}
                sx={{ 
                  backgroundColor: sliderCategory.bgColor,
                  color: 'white'
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Compact Potential Gain Summary - Only show when different grade selected */}
      {sliderGrade !== baseGrade && (
        <Card sx={{ 
          mb: 2,
          background: potentialIncrease > 0 
            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
            : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {potentialIncrease > 0 ? '💰 POTENTIAL GAIN' : '⚠️ POTENTIAL LOSS'}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {potentialIncrease > 0 ? '+' : '-'}${Math.abs(potentialIncrease).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
              ({potentialIncrease > 0 ? '+' : '-'}{Math.abs(percentageIncrease).toFixed(1)}%)
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Grade Selection Section with reduced spacing */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0A1F44', textAlign: 'center', mb: 3, lineHeight: 1.6 }}>
            Click any grade to see how operational improvements impact your business value
          </Typography>
          
          <Grid container spacing={2} justifyContent="center" sx={{
            '& > *': {
              minWidth: { xs: '100%', sm: 'auto' }
            }
          }}>
            {(['F', 'D', 'C', 'B', 'A'] as const).map((grade) => {
              const gradeInfo = getGradeInfo(grade);
              const isSelected = grade === sliderGrade;
              const isCurrent = grade === baseGrade;
              const valuation = calculateValuation(grade);
              
              return (
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={grade}>
                  <Card
                    onClick={() => setSliderGrade(grade)}
                    sx={{
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'visible',
                      background: isSelected ? gradeInfo.bg : '#FFFFFF',
                      border: isSelected ? `2px solid ${gradeInfo.border}` : '1px solid #E2E8F0',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      borderRadius: '12px',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    {isCurrent && (
                      <Box sx={{ 
                        position: 'absolute', 
                        top: -8, 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        zIndex: 10
                      }}>
                        <Chip 
                          label="Current"
                          size="small"
                          sx={{ 
                            backgroundColor: '#F59E0B',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    )}
                    {isSelected && !isCurrent && (
                      <Box sx={{ 
                        position: 'absolute', 
                        top: -8, 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        zIndex: 10
                      }}>
                        <Chip 
                          label="Selected"
                          size="small"
                          sx={{ 
                            backgroundColor: '#3B82F6',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    )}
                    
                    {/* Corner-Attached Grade Badge */}
                    <Box sx={{ 
                      position: 'absolute',
                      top: -20,
                      left: -20,
                      width: 44,
                      height: 44,
                      backgroundColor: gradeInfo.primary,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      zIndex: 10
                    }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>
                        {grade}
                      </Typography>
                    </Box>

                    <CardContent sx={{ pt: 4, px: 2, pb: 2, textAlign: 'center' }}>
                      
                      {/* Content */}
                      <Box sx={{ mt: -3 }}>
                        <Typography variant="body1" sx={{ fontSize: '1.2rem', fontWeight: 500 }}>
                          {getGradeCategory(grade).label}
                        </Typography>
                        <Typography variant="h4" sx={{ color: gradeInfo.primary, mt: 1 }}>
                          ${gradeInfo.multiplier}x
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          EBITDA Multiple
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#111827', mt: 2, fontWeight: 'bold' }}>
                          ${valuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          
          {/* Legend */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <Typography variant="body2" sx={{ color: '#6B7280' }}>Current Grade</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#3B82F6' }} />
              <Typography variant="body2" sx={{ color: '#6B7280' }}>Selected Target</Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ textAlign: 'center', color: '#6B7280', mt: 1.5 }}>
            Valuations based on $EBITDA multiple × Click to select target grade
          </Typography>
        </CardContent>
      </Card>

      {/* Call to Action */}
      {showBooking && (
        <Card sx={{ 
          background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Ready to Unlock Your Business Value?
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              By improving your operational grade from {baseGrade} to {sliderGrade}, 
              you could add <strong style={{ color: '#005b8c' }}>${Math.round(potentialIncrease).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> to your business value.
            </Typography>
            <Button 
              variant="contained"
              size="large"
              startIcon={<Phone />}
              onClick={() => window.open('https://api.leadconnectorhq.com/widget/bookings/applebites', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')}
              sx={{
                background: 'linear-gradient(135deg, #005b8c 0%, #4DD0C7 100%)',
                color: '#0A1F44',
                fontWeight: 'bold',
                py: 2,
                px: 4,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4DD0C7 0%, #0891B2 100%)',
                }
              }}
            >
              Get Your Customized Value Roadmap
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}