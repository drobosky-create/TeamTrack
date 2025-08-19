import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Chip,

  Divider,
  Paper,
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

interface ValueDriver {
  name: string;
  score: number;
  grade: string;
  description: string;
  recommendations: string[];
}

interface AssessmentResult {
  id: string;
  companyName: string;
  assessmentType: 'free' | 'growth' | 'capital';
  completedDate: string;
  valuation: number;
  revenue: number;
  ebitda: number;
  overallGrade: string;
  overallScore: number;
  multiplier: number;
  valueDrivers: ValueDriver[];
  followUpPreferences: {
    interestedInConsultation: boolean;
    preferredContact: 'email' | 'phone';
    preferredTime: string;
    specificInterests: string[];
  };
  nextSteps: string[];
}

// Sample assessment result for consumer view
const sampleResult: AssessmentResult = {
  id: '1',
  companyName: 'Sample Business Corp',
  assessmentType: 'free',
  completedDate: '2025-01-19',
  valuation: 2100000,
  revenue: 1200000,
  ebitda: 240000,
  overallGrade: 'B',
  overallScore: 7.2,
  multiplier: 5.7,
  valueDrivers: [
    {
      name: 'Financial Performance',
      score: 8.5,
      grade: 'A',
      description: 'Strong revenue growth and profitability metrics',
      recommendations: ['Maintain current growth trajectory', 'Consider expanding financial reporting']
    },
    {
      name: 'Customer Relations',
      score: 7.8,
      grade: 'B',
      description: 'Good customer retention with room for improvement',
      recommendations: ['Implement customer feedback system', 'Develop loyalty programs']
    },
    {
      name: 'Leadership & Management',
      score: 6.9,
      grade: 'B',
      description: 'Solid leadership structure with growth potential',
      recommendations: ['Consider management training programs', 'Implement succession planning']
    },
    {
      name: 'Innovation & Technology',
      score: 5.2,
      grade: 'C',
      description: 'Basic technology adoption, needs modernization',
      recommendations: ['Invest in digital transformation', 'Upgrade core systems']
    },
    {
      name: 'Systems & Processes',
      score: 6.1,
      grade: 'B',
      description: 'Standard processes in place, room for optimization',
      recommendations: ['Document all procedures', 'Implement process automation']
    }
  ],
  followUpPreferences: {
    interestedInConsultation: true,
    preferredContact: 'email',
    preferredTime: 'Weekday mornings',
    specificInterests: ['Growth strategies', 'Exit planning', 'Valuation improvement']
  },
  nextSteps: [
    'Download your comprehensive assessment report',
    'Schedule a consultation to discuss growth opportunities',
    'Consider upgrading to Growth Assessment for industry-specific insights',
    'Implement top 3 value driver recommendations'
  ]
};

export default function AssessmentResultsPage() {
  const [result] = useState<AssessmentResult>(sampleResult);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return '#10B981';
      case 'B': return '#3B82F6';
      case 'C': return '#F59E0B';
      case 'D': return '#EF4444';
      case 'F': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getScorePercentage = (score: number) => (score / 10) * 100;

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
        Your Assessment Results
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: '#6B7280' }}>
        Completed on {result.completedDate} • {result.assessmentType.toUpperCase()} Assessment
      </Typography>

      {/* Overall Valuation Summary */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                ${(result.valuation / 1000000).toFixed(1)}M
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                Estimated Business Valuation
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                Based on EBITDA of ${(result.ebitda / 1000).toFixed(0)}K × {result.multiplier}x multiplier
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                borderRadius: '50%', 
                width: 120, 
                height: 120, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto'
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                    {result.overallGrade}
                  </Typography>
                  <Typography variant="body2">
                    Overall Grade
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TrendingUpIcon sx={{ color: '#10B981', fontSize: 32 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ${(result.revenue / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Annual Revenue
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BusinessIcon sx={{ color: '#3B82F6', fontSize: 32 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ${(result.ebitda / 1000).toFixed(0)}K
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  EBITDA
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <StarIcon sx={{ color: '#F59E0B', fontSize: 32 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {result.overallScore}/10
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overall Score
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Value Drivers Breakdown */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Value Drivers Analysis
          </Typography>
          
          {result.valueDrivers.map((driver, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                  <Typography sx={{ fontWeight: 'bold', flex: 1 }}>
                    {driver.name}
                  </Typography>
                  <Chip 
                    label={driver.grade} 
                    sx={{ 
                      backgroundColor: getGradeColor(driver.grade),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  <Box sx={{ width: 100 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={getScorePercentage(driver.score)} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: '#E5E7EB',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getGradeColor(driver.grade)
                        }
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontWeight: 'bold', minWidth: 40 }}>
                    {driver.score}/10
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ mb: 2 }}>
                  {driver.description}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Recommendations:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {driver.recommendations.map((rec, recIndex) => (
                    <Typography component="li" key={recIndex} sx={{ mb: 0.5 }}>
                      {rec}
                    </Typography>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      {/* Next Steps & Follow-Up */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Recommended Next Steps
          </Typography>
          
          <Box component="ol" sx={{ pl: 2 }}>
            {result.nextSteps.map((step, index) => (
              <Typography component="li" key={index} sx={{ mb: 1 }}>
                {step}
              </Typography>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Your Follow-Up Preferences
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Typography sx={{ mb: 1 }}>
                <strong>Consultation Interest:</strong> {result.followUpPreferences.interestedInConsultation ? 'Yes' : 'No'}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                <strong>Preferred Contact:</strong> {result.followUpPreferences.preferredContact}
              </Typography>
              <Typography>
                <strong>Best Time:</strong> {result.followUpPreferences.preferredTime}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                Areas of Interest:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {result.followUpPreferences.specificInterests.map((interest, index) => (
                  <Chip key={index} label={interest} color="primary" size="small" />
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          size="large"
          sx={{
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            px: 4
          }}
        >
          Download PDF Report
        </Button>
        
        <Button
          variant="contained"
          startIcon={<PhoneIcon />}
          size="large"
          sx={{
            background: 'linear-gradient(45deg, #10B981 30%, #059669 90%)',
            px: 4
          }}
        >
          Schedule Consultation
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          size="large"
          sx={{ px: 4 }}
        >
          Share Results
        </Button>
      </Box>

      {/* Upgrade Prompt for Free Assessments */}
      {result.assessmentType === 'free' && (
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
            Want More Detailed Analysis?
          </Typography>
          <Typography>
            Upgrade to our Growth Assessment ($795) for industry-specific multipliers, 
            professional reporting, and strategic recommendations tailored to your business sector.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2, background: 'linear-gradient(45deg, #F59E0B 30%, #D97706 90%)' }}
          >
            Upgrade Assessment
          </Button>
        </Alert>
      )}
    </Box>
  );
}