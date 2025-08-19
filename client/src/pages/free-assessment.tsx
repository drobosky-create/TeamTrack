import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';

const steps = ['Financial Info', 'Adjustments', 'Value Drivers', 'Results'];

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

export default function FreeAssessmentPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Financial data
  const [financialData, setFinancialData] = useState({
    netIncome: '',
    interest: '',
    taxes: '',
    depreciation: '',
    amortization: '',
  });

  // Adjustments data
  const [adjustmentData, setAdjustmentData] = useState({
    ownerSalary: '',
    personalExpenses: '',
    oneTimeExpenses: '',
    otherAdjustments: '',
  });

  // Value drivers data
  const [valueDrivers, setValueDrivers] = useState<Record<string, string>>({});
  
  // Results
  const [results, setResults] = useState<{
    baseEbitda: number;
    adjustedEbitda: number;
    overallGrade: string;
    estimatedValue: number;
  } | null>(null);

  const handleFinancialChange = (field: string, value: string) => {
    setFinancialData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdjustmentChange = (field: string, value: string) => {
    setAdjustmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleValueDriverChange = (area: string, grade: string) => {
    setValueDrivers(prev => ({ ...prev, [area]: grade }));
  };

  const calculateResults = () => {
    const netIncome = parseFloat(financialData.netIncome) || 0;
    const interest = parseFloat(financialData.interest) || 0;
    const taxes = parseFloat(financialData.taxes) || 0;
    const depreciation = parseFloat(financialData.depreciation) || 0;
    const amortization = parseFloat(financialData.amortization) || 0;
    
    const ownerSalary = parseFloat(adjustmentData.ownerSalary) || 0;
    const personalExpenses = parseFloat(adjustmentData.personalExpenses) || 0;
    const oneTimeExpenses = parseFloat(adjustmentData.oneTimeExpenses) || 0;
    const otherAdjustments = parseFloat(adjustmentData.otherAdjustments) || 0;

    // Calculate EBITDA
    const baseEbitda = netIncome + interest + taxes + depreciation + amortization;
    const adjustedEbitda = baseEbitda + ownerSalary + personalExpenses + oneTimeExpenses + otherAdjustments;

    // Calculate overall grade
    const grades = Object.values(valueDrivers);
    const gradePoints = { A: 4, B: 3, C: 2, D: 1, F: 0 };
    const totalPoints = grades.reduce((sum, grade) => sum + (gradePoints[grade as keyof typeof gradePoints] || 0), 0);
    const average = totalPoints / grades.length;
    
    let overallGrade = 'C';
    let multiplier = 4.2; // Default C grade multiplier
    
    if (average >= 3.5) {
      overallGrade = 'A';
      multiplier = 7.5;
    } else if (average >= 2.5) {
      overallGrade = 'B';
      multiplier = 5.7;
    } else if (average >= 1.5) {
      overallGrade = 'C';
      multiplier = 4.2;
    } else if (average >= 0.5) {
      overallGrade = 'D';
      multiplier = 3.0;
    } else {
      overallGrade = 'F';
      multiplier = 2.0;
    }

    const estimatedValue = adjustedEbitda * multiplier;

    setResults({
      baseEbitda,
      adjustedEbitda,
      overallGrade,
      estimatedValue,
    });
  };

  const handleNext = () => {
    setCompletedSteps(prev => [...prev, activeStep]);
    if (activeStep === steps.length - 2) {
      calculateResults();
    }
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return financialData.netIncome && financialData.interest && financialData.taxes;
      case 1:
        return true; // Adjustments are optional
      case 2:
        return Object.keys(valueDrivers).length === assessmentAreas.length;
      default:
        return false;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderFinancialStep = () => (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#667eea' }}>
          Financial Information
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#6B7280' }}>
          Enter your basic financial data to calculate EBITDA.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Net Income"
              type="number"
              value={financialData.netIncome}
              onChange={(e) => handleFinancialChange('netIncome', e.target.value)}
              InputProps={{ startAdornment: '$' }}
              required
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              label="Interest Expense"
              type="number"
              value={financialData.interest}
              onChange={(e) => handleFinancialChange('interest', e.target.value)}
              InputProps={{ startAdornment: '$' }}
              required
              sx={{ flex: 1, minWidth: 200 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Taxes"
              type="number"
              value={financialData.taxes}
              onChange={(e) => handleFinancialChange('taxes', e.target.value)}
              InputProps={{ startAdornment: '$' }}
              required
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              label="Depreciation"
              type="number"
              value={financialData.depreciation}
              onChange={(e) => handleFinancialChange('depreciation', e.target.value)}
              InputProps={{ startAdornment: '$' }}
              sx={{ flex: 1, minWidth: 200 }}
            />
          </Box>
          <TextField
            label="Amortization"
            type="number"
            value={financialData.amortization}
            onChange={(e) => handleFinancialChange('amortization', e.target.value)}
            InputProps={{ startAdornment: '$' }}
            sx={{ maxWidth: 300 }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  const renderAdjustmentsStep = () => (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#667eea' }}>
          Owner Adjustments
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#6B7280' }}>
          Add back owner-specific expenses to normalize EBITDA.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Owner Salary Add-Back"
              type="number"
              value={adjustmentData.ownerSalary}
              onChange={(e) => handleAdjustmentChange('ownerSalary', e.target.value)}
              InputProps={{ startAdornment: '$' }}
              helperText="Excess compensation above market rate"
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              label="Personal Expenses"
              type="number"
              value={adjustmentData.personalExpenses}
              onChange={(e) => handleAdjustmentChange('personalExpenses', e.target.value)}
              InputProps={{ startAdornment: '$' }}
              helperText="Personal expenses run through business"
              sx={{ flex: 1, minWidth: 200 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="One-Time Expenses"
              type="number"
              value={adjustmentData.oneTimeExpenses}
              onChange={(e) => handleAdjustmentChange('oneTimeExpenses', e.target.value)}
              InputProps={{ startAdornment: '$' }}
              helperText="Non-recurring expenses"
              sx={{ flex: 1, minWidth: 200 }}
            />
            <TextField
              label="Other Adjustments"
              type="number"
              value={adjustmentData.otherAdjustments}
              onChange={(e) => handleAdjustmentChange('otherAdjustments', e.target.value)}
              InputProps={{ startAdornment: '$' }}
              helperText="Other normalizing adjustments"
              sx={{ flex: 1, minWidth: 200 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderValueDriversStep = () => (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#667eea' }}>
          Value Drivers Assessment
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: '#6B7280' }}>
          Rate each area to determine your business quality multiplier.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {assessmentAreas.map((area) => (
            <Box key={area.key} sx={{ p: 3, border: '1px solid #E5E7EB', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                {area.label}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: '#6B7280' }}>
                {area.description}
              </Typography>
              
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={valueDrivers[area.key] || ''}
                  onChange={(e) => handleValueDriverChange(area.key, e.target.value)}
                >
                  {gradeOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.value}
                      sx={{ mr: 2 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const renderResultsStep = () => {
    if (!results) return null;

    return (
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#10B981' }}>
            Free Assessment Results
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 300, p: 3, border: '1px solid #E5E7EB', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Financial Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Base EBITDA:</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(results.baseEbitda)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Adjusted EBITDA:</Typography>
                <Typography sx={{ fontWeight: 'bold', color: '#10B981' }}>
                  {formatCurrency(results.adjustedEbitda)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Overall Grade:</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#667eea' }}>
                  {results.overallGrade}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Estimated Value:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#10B981' }}>
                  {formatCurrency(results.estimatedValue)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1, minWidth: 300, p: 3, border: '1px solid #E5E7EB', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Value Drivers Summary
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {assessmentAreas.map((area) => (
                  <Box key={area.key} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    p: 1,
                    backgroundColor: '#F9FAFB',
                    borderRadius: 1,
                  }}>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                      {area.label}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: valueDrivers[area.key] === 'A' ? '#10B981' : 
                               valueDrivers[area.key] === 'B' ? '#3B82F6' :
                               valueDrivers[area.key] === 'C' ? '#F59E0B' : '#EF4444'
                      }}
                    >
                      {valueDrivers[area.key] || 'N/A'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              This is a basic valuation estimate. For industry-specific analysis and detailed reporting, 
              consider upgrading to our Growth Assessment.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderFinancialStep();
      case 1:
        return renderAdjustmentsStep();
      case 2:
        return renderValueDriversStep();
      case 3:
        return renderResultsStep();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 3 }}>
        Free Business Assessment
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={label} completed={completedSteps.includes(index)}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent()}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        
        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepComplete(activeStep)}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
            }}
          >
            {activeStep === steps.length - 2 ? 'Calculate Results' : 'Next'}
          </Button>
        )}
      </Box>
    </Box>
  );
}