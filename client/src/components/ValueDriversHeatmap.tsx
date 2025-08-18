import { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ValueDriversHeatmapProps {
  assessment: {
    financialPerformance?: string;
    customerConcentration?: string;
    managementTeam?: string;
    competitivePosition?: string;
    growthProspects?: string;
    systemsProcesses?: string;
    assetQuality?: string;
    industryOutlook?: string;
    riskFactors?: string;
    ownerDependency?: string;
  };
}

type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

interface DriverData {
  key: string;
  label: string;
  grade: Grade;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'financial' | 'operational' | 'strategic' | 'risk';
}

export default function ValueDriversHeatmap({ assessment }: ValueDriversHeatmapProps) {
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);

  const getGradeScore = (grade: string): number => {
    const gradeMap: Record<string, number> = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
    return gradeMap[grade] || 3;
  };

  const getGradeColor = (grade: Grade): string => {
    const colorMap: Record<Grade, string> = {
      'A': '#10B981', // Green
      'B': '#59C96F', // Light Green
      'C': '#F59E0B', // Orange
      'D': '#EF4444', // Red
      'F': '#DC2626'  // Dark Red
    };
    return colorMap[grade];
  };

  const getTrendIcon = (grade: Grade) => {
    const score = getGradeScore(grade);
    if (score >= 4) return <TrendingUp size={16} />;
    if (score <= 2) return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  const getImpactBadge = (impact: string) => {
    const impactConfig: Record<string, { color: string; label: string }> = {
      'high': { color: '#DC2626', label: 'High Impact' },
      'medium': { color: '#2563EB', label: 'Medium Impact' },
      'low': { color: '#059669', label: 'Low Impact' }
    };
    const config = impactConfig[impact];
    return (
      <Chip 
        label={config.label} 
        size="small" 
        sx={{ 
          backgroundColor: impact === 'high' ? '#FEE2E2' : impact === 'medium' ? '#DBEAFE' : '#D1FAE5',
          color: config.color,
          fontWeight: 'bold',
          fontSize: '11px'
        }} 
      />
    );
  };

  const drivers: DriverData[] = [
    {
      key: 'financialPerformance',
      label: 'Financial Performance',
      grade: (assessment.financialPerformance || 'C') as Grade,
      description: 'Revenue growth, profitability margins, and financial stability',
      impact: 'high',
      category: 'financial'
    },
    {
      key: 'customerConcentration',
      label: 'Customer Relations',
      grade: (assessment.customerConcentration || 'C') as Grade,
      description: 'Customer satisfaction, retention, and relationship management',
      impact: 'high',
      category: 'strategic'
    },
    {
      key: 'managementTeam',
      label: 'Leadership & Management',
      grade: (assessment.managementTeam || 'C') as Grade,
      description: 'Leadership effectiveness, team management, and organizational development',
      impact: 'high',
      category: 'operational'
    },
    {
      key: 'competitivePosition',
      label: 'Innovation & Growth',
      grade: (assessment.competitivePosition || 'C') as Grade,
      description: 'Innovation capabilities, market adaptation, and competitive advantage',
      impact: 'high',
      category: 'strategic'
    },
    {
      key: 'growthProspects',
      label: 'Goal Achievement',
      grade: (assessment.growthProspects || 'C') as Grade,
      description: 'Goal setting, progress tracking, and achievement consistency',
      impact: 'high',
      category: 'strategic'
    },
    {
      key: 'systemsProcesses',
      label: 'Systems & Processes',
      grade: (assessment.systemsProcesses || 'C') as Grade,
      description: 'Process efficiency, system optimization, and workflow management',
      impact: 'medium',
      category: 'operational'
    },
    {
      key: 'assetQuality',
      label: 'Quality & Standards',
      grade: (assessment.assetQuality || 'C') as Grade,
      description: 'Work quality, standards adherence, and continuous improvement',
      impact: 'medium',
      category: 'operational'
    },
    {
      key: 'industryOutlook',
      label: 'Industry Knowledge',
      grade: (assessment.industryOutlook || 'C') as Grade,
      description: 'Industry expertise, market awareness, and professional development',
      impact: 'medium',
      category: 'strategic'
    },
    {
      key: 'riskFactors',
      label: 'Risk Management',
      grade: (assessment.riskFactors || 'C') as Grade,
      description: 'Risk identification, mitigation strategies, and compliance',
      impact: 'medium',
      category: 'risk'
    },
    {
      key: 'ownerDependency',
      label: 'Independence & Initiative',
      grade: (assessment.ownerDependency || 'C') as Grade,
      description: 'Self-direction, initiative, and independent decision-making',
      impact: 'high',
      category: 'operational'
    }
  ];

  const groupedDrivers = drivers.reduce((acc, driver) => {
    if (!acc[driver.category]) acc[driver.category] = [];
    acc[driver.category].push(driver);
    return acc;
  }, {} as Record<string, DriverData[]>);

  const categoryLabels: Record<string, string> = {
    'financial': 'Financial Performance',
    'operational': 'Operational Excellence', 
    'strategic': 'Strategic Impact',
    'risk': 'Risk & Compliance'
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0A1F44', mb: 1 }}>
          Performance Drivers Analysis
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
          Comprehensive view of performance across key areas
        </Typography>
      </Box>

      {/* Categories Grid */}
      <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
        {Object.entries(groupedDrivers).map(([category, categoryDrivers]) => (
          <Card 
            key={category} 
            sx={{ 
              background: category === 'financial' ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' :
                         category === 'operational' ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)' :
                         category === 'strategic' ? 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)' :
                         'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
              border: category === 'financial' ? '1px solid #BFDBFE' :
                     category === 'operational' ? '1px solid #BBF7D0' :
                     category === 'strategic' ? '1px solid #E9D5FF' :
                     '1px solid #FECACA',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#1F2937',
                  mb: 2,
                  textAlign: 'center'
                }}
              >
                {categoryLabels[category]}
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: 1.5 
              }}>
                {categoryDrivers.map((driver) => (
                  <Card
                    key={driver.key}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: 'white',
                      border: `2px solid ${getGradeColor(driver.grade)}`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={() => setSelectedDriver(driver)}
                  >
                    <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 1,
                        mb: 1
                      }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: getGradeColor(driver.grade)
                          }}
                        >
                          {driver.grade}
                        </Typography>
                        {getTrendIcon(driver.grade)}
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'medium',
                          color: '#374151',
                          mb: 1
                        }}
                      >
                        {driver.label}
                      </Typography>
                      {getImpactBadge(driver.impact)}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Selected Driver Details */}
      {selectedDriver && (
        <Card sx={{ mt: 3, border: `2px solid ${getGradeColor(selectedDriver.grade)}` }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h2" sx={{ color: getGradeColor(selectedDriver.grade), fontWeight: 'bold' }}>
                {selectedDriver.grade}
              </Typography>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                  {selectedDriver.label}
                </Typography>
                {getImpactBadge(selectedDriver.impact)}
              </Box>
            </Box>
            <Typography variant="body1" sx={{ color: '#6B7280', lineHeight: 1.6 }}>
              {selectedDriver.description}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}