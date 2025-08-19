import React from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Typography,
  Box,
  styled,
} from '@mui/material';

// Custom connector styled for Apple Bites
const AppleBitesConnector = styled(StepConnector)(({ theme }) => ({
  alternativeLabel: {
    top: 22,
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#E0E0E0',
    borderRadius: 1,
  },
}));

// Custom Step Icon with Apple Bites styling
const StepIconRoot = styled('div')<{ ownerState: { active: boolean; completed: boolean } }>(({ theme, ownerState }) => ({
  backgroundColor:
    ownerState.active || ownerState.completed ? '#ffffff' : '#fff',
  zIndex: 1,
  color: ownerState.active || ownerState.completed ? '#0A1F44' : '#B0B7C3',
  width: 32,
  height: 32,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  border: '2px solid',
  borderColor: ownerState.completed ? '#ffffff' : '#E0E0E0',
  fontSize: '14px',
  fontWeight: 600,
}));

interface CustomStepIconProps {
  active?: boolean;
  completed?: boolean;
  className?: string;
  icon: number;
}

function CustomStepIcon(props: CustomStepIconProps) {
  const { active, completed, className, icon } = props;
  const icons: Record<number, string> = {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
  };

  return (
    <StepIconRoot ownerState={{ active, completed }} className={className}>
      {completed ? '✓' : icons[icon]}
    </StepIconRoot>
  );
}

// Labels for each step  
const steps = ['Financials', 'Adjustments', 'Value Drivers', 'Follow-up'];

interface AssessmentStepperProps {
  activeStep: number;
}

export default function AssessmentStepper({ activeStep }: AssessmentStepperProps) {
  return (
    <Box 
      sx={{ 
        width: '95%',
        margin: '0 auto',
        mb: -2, // Negative margin to overlap the white form card
        position: 'relative',
        zIndex: 2 // Ensure it sits above the form card
      }}
    >
      {/* Navy Pillbox Container */}
      <Box
        sx={{
          backgroundColor: '#0A1F44',
          borderRadius: '25px',
          padding: '16px 24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
          
        }}
      >
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<AppleBitesConnector />}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: activeStep === index ? 600 : 400,
                    color: activeStep === index ? '#ffffff' : 'rgba(255,255,255,0.8)',
                    fontSize: '0.875rem',
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  );
}