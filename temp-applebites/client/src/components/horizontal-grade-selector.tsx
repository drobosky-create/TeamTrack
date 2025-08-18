import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, Typography, Box, Chip, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
type OperationalGrade = 'A' | 'B' | 'C' | 'D' | 'F';

interface HorizontalGradeSelectorProps {
  baseGrade: OperationalGrade;
  sliderGrade: OperationalGrade;
  setSliderGrade: (grade: OperationalGrade) => void;
  baseEstimate: number;
  sliderEstimate: number;
}

const gradeData = [
  { grade: 'F' as OperationalGrade, multiple: '2.0x', label: 'Poor', description: 'Poor operations with significant challenges' },
  { grade: 'D' as OperationalGrade, multiple: '3.0x', label: 'Below Average', description: 'Below average operational performance' },
  { grade: 'C' as OperationalGrade, multiple: '4.2x', label: 'Average', description: 'Average operations meeting basic standards' },
  { grade: 'B' as OperationalGrade, multiple: '5.7x', label: 'Good', description: 'Good operations with strong performance' },
  { grade: 'A' as OperationalGrade, multiple: '7.5x', label: 'Excellent', description: 'Excellent operations with superior performance' },
];

// Argon gradient color mapping based on authentic Argon Dashboard colors
const getGradientStyle = (grade: string, isSelected: boolean, isCurrent: boolean) => {
  if (isCurrent) {
    // Argon warning/primary gradient for current grade
    return {
      background: 'linear-gradient(310deg, #fb6340, #fbb140)',
      color: '#ffffff',
      transform: 'scale(1.05)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    };
  }
  
  if (isSelected) {
    // Argon primary gradient for selected grade
    return {
      background: 'linear-gradient(310deg, #5e72e4, #825ee4)',
      color: '#ffffff',
      transform: 'scale(1.02)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    };
  }
  
  // Default Argon light gradient
  return {
    background: 'linear-gradient(310deg, #ced4da, #ebeff4)',
    color: '#344767',
    transform: 'scale(1)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.12)',
  };
};

const HorizontalGradeSelector: React.FC<HorizontalGradeSelectorProps> = ({
  baseGrade,
  sliderGrade,
  setSliderGrade,
  baseEstimate,
  sliderEstimate,
}) => {
  const [hoveredGrade, setHoveredGrade] = useState<OperationalGrade | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const StyledCard = styled(Card)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(16px)',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: theme.spacing(6, 8),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 6),
    },
  }));

  const GradeCard = styled(Card, {
    shouldForwardProp: (prop) => !['isSelected', 'isCurrent'].includes(prop as string),
  })<{ isSelected: boolean; isCurrent: boolean }>(({ theme, isSelected, isCurrent }) => ({
    padding: theme.spacing(3),
    borderRadius: '12px',
    textAlign: 'center',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: theme.shadows[8],
    },
    ...(isSelected && {
      background: 'linear-gradient(135deg, #5e72e4 0%, #825ee4 100%)',
      color: '#ffffff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }),
    ...(isCurrent && !isSelected && {
      background: 'linear-gradient(135deg, #fb6340 0%, #fbb140 100%)',
      color: '#ffffff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }),
    ...(!isSelected && !isCurrent && {
      background: 'rgba(248, 249, 250, 0.8)',
      color: '#344767',
      '&:hover': {
        background: 'rgba(244, 245, 247, 0.9)',
      },
    }),
  }));

  return (
    <StyledCard>
      {/* Header Section */}
      <Box textAlign="center" mb={4}>
        <Typography 
          variant="h3" 
          component="h3" 
          sx={{ 
            fontWeight: 700, 
            color: '#344767', 
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <TrendingUp style={{ fontSize: '2rem', color: '#5e72e4' }} />
          Interactive Grade Assessment
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#67748e', 
            fontWeight: 500,
            lineHeight: 1.6
          }}
        >
          Click any grade below to explore how operational improvements impact your business valuation
        </Typography>
      </Box>



      

      {/* Grade Cards - Material UI Grid */}
      <Box 
        display="grid" 
        gridTemplateColumns={{ xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }}
        gap={{ xs: 2, md: 3 }}
        mb={4}
      >
        {gradeData.map((item) => {
          const isCurrent = item.grade === baseGrade;
          const isSelected = item.grade === sliderGrade;
          
          return (
            <Tooltip
              key={item.grade}
              title={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Grade {item.grade}: {item.multiple}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {item.description}
                  </Typography>
                </Box>
              }
              placement="top"
              arrow
            >
              <GradeCard
                isSelected={isSelected}
                isCurrent={isCurrent}
                onClick={() => setSliderGrade(item.grade)}
                onMouseEnter={() => setHoveredGrade(item.grade)}
                onMouseLeave={() => setHoveredGrade(null)}
              >
                {/* Current Badge */}
                {isCurrent && (
                  <Chip
                    label="Current"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: '#fb6340',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.7 },
                      },
                    }}
                  />
                )}
                
                {/* Grade Letter */}
                <Typography 
                  variant="h2" 
                  component="div" 
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  {item.grade}
                </Typography>
                
                {/* Multiple */}
                <Typography 
                  variant="body2" 
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  {item.multiple}
                </Typography>
                
                {/* Label */}
                <Typography 
                  variant="caption" 
                  sx={{ fontWeight: 500, opacity: 0.9 }}
                >
                  {item.label}
                </Typography>
              </GradeCard>
            </Tooltip>
          );
        })}
      </Box>

      {/* Additional Info */}
      <Box textAlign="center" mt={4}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#67748e', 
            lineHeight: 1.6,
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Each grade represents operational excellence levels that directly impact business valuation multiples. 
          Click any grade to see the potential impact on your business value.
        </Typography>
      </Box>
    </StyledCard>
  );
};

export default HorizontalGradeSelector;