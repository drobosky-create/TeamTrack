import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Assessment areas based on AppleBites value drivers
const assessmentAreas = [
  { key: 'financialPerformance', label: 'Financial Performance', description: 'Revenue growth, profitability, and budget management' },
  { key: 'customerRelations', label: 'Customer Relations', description: 'Customer satisfaction, retention, and relationship building' },
  { key: 'leadership', label: 'Leadership', description: 'Team leadership, decision-making, and influence' },
  { key: 'innovation', label: 'Innovation', description: 'Creative thinking, process improvement, and adaptability' },
  { key: 'goalAchievement', label: 'Goal Achievement', description: 'Meeting targets, deliverables, and commitments' },
  { key: 'systemsProcesses', label: 'Systems & Processes', description: 'Process optimization, efficiency, and standardization' },
  { key: 'qualityStandards', label: 'Quality Standards', description: 'Work quality, attention to detail, and standards compliance' },
  { key: 'industryKnowledge', label: 'Industry Knowledge', description: 'Market awareness, trends, and competitive understanding' },
  { key: 'riskManagement', label: 'Risk Management', description: 'Risk identification, mitigation, and compliance' },
  { key: 'independence', label: 'Independence', description: 'Self-direction, initiative, and autonomous work' },
];

const gradeOptions = [
  { value: 'A', label: 'A - Excellent', description: 'Consistently exceeds expectations' },
  { value: 'B', label: 'B - Good', description: 'Frequently meets and sometimes exceeds expectations' },
  { value: 'C', label: 'C - Satisfactory', description: 'Meets basic expectations' },
  { value: 'D', label: 'D - Needs Improvement', description: 'Below expectations, requires development' },
  { value: 'F', label: 'F - Unsatisfactory', description: 'Well below expectations, significant improvement needed' },
];

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<Record<string, string>>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const createAssessmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create assessment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assessments'] });
      // Reset form
      setCurrentStep(0);
      setAssessmentData({});
      setTitle('');
      setDescription('');
    },
  });

  const handleGradeChange = (area: string, grade: string) => {
    setAssessmentData(prev => ({ ...prev, [area]: grade }));
  };

  const calculateOverallGrade = () => {
    const grades = Object.values(assessmentData);
    if (grades.length === 0) return 'F';
    
    const gradePoints = { A: 4, B: 3, C: 2, D: 1, F: 0 };
    const totalPoints = grades.reduce((sum, grade) => sum + (gradePoints[grade as keyof typeof gradePoints] || 0), 0);
    const average = totalPoints / grades.length;
    
    if (average >= 3.5) return 'A';
    if (average >= 2.5) return 'B';
    if (average >= 1.5) return 'C';
    if (average >= 0.5) return 'D';
    return 'F';
  };

  const handleSubmit = () => {
    const overallGrade = calculateOverallGrade();
    const totalScore = Object.values(assessmentData).reduce((sum, grade) => {
      const points = { A: 4, B: 3, C: 2, D: 1, F: 0 };
      return sum + (points[grade as keyof typeof points] || 0);
    }, 0);

    createAssessmentMutation.mutate({
      title: title || 'Performance Assessment',
      description: description || 'Comprehensive performance evaluation',
      assessmentType: 'performance',
      ...assessmentData,
      overallGrade,
      totalScore,
      maxScore: assessmentAreas.length * 4,
    });
  };

  const progress = ((currentStep + 1) / (assessmentAreas.length + 2)) * 100;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 3 }}>
        Performance Assessment
      </Typography>

      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ mb: 3, height: 8, borderRadius: 4 }}
      />

      {currentStep === 0 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              Assessment Overview
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#6B7280' }}>
              This comprehensive assessment evaluates performance across 10 key areas. Each area will be rated on an A-F scale to provide insights into strengths and development opportunities.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="contained"
                onClick={() => setCurrentStep(1)}
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                }}
              >
                Start Assessment
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {currentStep > 0 && currentStep <= assessmentAreas.length && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 1, color: '#667eea' }}>
              Step {currentStep} of {assessmentAreas.length}
            </Typography>
            
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              {assessmentAreas[currentStep - 1].label}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4, color: '#6B7280' }}>
              {assessmentAreas[currentStep - 1].description}
            </Typography>

            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
                Rate this area:
              </FormLabel>
              <RadioGroup
                value={assessmentData[assessmentAreas[currentStep - 1].key] || ''}
                onChange={(e) => handleGradeChange(assessmentAreas[currentStep - 1].key, e.target.value)}
              >
                {gradeOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {option.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                          {option.description}
                        </Typography>
                      </Box>
                    }
                    sx={{ mb: 1, alignItems: 'flex-start', '& .MuiFormControlLabel-label': { mt: -0.5 } }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!assessmentData[assessmentAreas[currentStep - 1].key]}
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  color: 'white',
                }}
              >
                {currentStep === assessmentAreas.length ? 'Review' : 'Next'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {currentStep === assessmentAreas.length + 1 && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              Assessment Summary
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Overall Grade: <strong>{calculateOverallGrade()}</strong>
            </Alert>

            <Grid container spacing={2}>
              {assessmentAreas.map((area) => (
                <Grid item xs={12} sm={6} key={area.key}>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid #E5E7EB', 
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {area.label}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: assessmentData[area.key] === 'A' ? '#10B981' : 
                               assessmentData[area.key] === 'B' ? '#3B82F6' :
                               assessmentData[area.key] === 'C' ? '#F59E0B' : '#EF4444'
                      }}
                    >
                      {assessmentData[area.key]}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back to Edit
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={createAssessmentMutation.isPending}
                sx={{
                  background: 'linear-gradient(45deg, #10B981 30%, #059669 90%)',
                  color: 'white',
                  px: 4,
                }}
              >
                {createAssessmentMutation.isPending ? 'Saving...' : 'Save Assessment'}
              </Button>
            </Box>

            {createAssessmentMutation.isSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Assessment saved successfully!
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}