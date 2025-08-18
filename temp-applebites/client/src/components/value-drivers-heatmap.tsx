import { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ValuationAssessment } from '@shared/schema';

interface ValueDriversHeatmapProps {
  assessment: ValuationAssessment;
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
      label: 'Customer Concentration',
      grade: (assessment.customerConcentration || 'C') as Grade,
      description: 'Diversification of customer base and revenue sources',
      impact: 'high',
      category: 'risk'
    },
    {
      key: 'managementTeam',
      label: 'Management Team',
      grade: (assessment.managementTeam || 'C') as Grade,
      description: 'Leadership strength, experience, and organizational depth',
      impact: 'high',
      category: 'operational'
    },
    {
      key: 'competitivePosition',
      label: 'Competitive Position',
      grade: (assessment.competitivePosition || 'C') as Grade,
      description: 'Market position, competitive advantages, and differentiation',
      impact: 'high',
      category: 'strategic'
    },
    {
      key: 'growthProspects',
      label: 'Growth Prospects',
      grade: (assessment.growthProspects || 'C') as Grade,
      description: 'Future growth opportunities and market expansion potential',
      impact: 'high',
      category: 'strategic'
    },
    {
      key: 'systemsProcesses',
      label: 'Systems & Processes',
      grade: (assessment.systemsProcesses || 'C') as Grade,
      description: 'Operational efficiency, technology, and process documentation',
      impact: 'medium',
      category: 'operational'
    },
    {
      key: 'assetQuality',
      label: 'Asset Quality',
      grade: (assessment.assetQuality || 'C') as Grade,
      description: 'Condition and value of physical and intangible assets',
      impact: 'medium',
      category: 'financial'
    },
    {
      key: 'industryOutlook',
      label: 'Industry Outlook',
      grade: (assessment.industryOutlook || 'C') as Grade,
      description: 'Industry growth trends, regulatory environment, and market dynamics',
      impact: 'medium',
      category: 'strategic'
    },
    {
      key: 'riskFactors',
      label: 'Risk Factors',
      grade: (assessment.riskFactors || 'C') as Grade,
      description: 'Business risks, regulatory compliance, and risk mitigation',
      impact: 'medium',
      category: 'risk'
    },
    {
      key: 'ownerDependency',
      label: 'Owner Dependency',
      grade: (assessment.ownerDependency || 'C') as Grade,
      description: 'Business reliance on owner involvement and key personnel',
      impact: 'high',
      category: 'risk'
    }
  ];

  const groupedDrivers = drivers.reduce((acc, driver) => {
    if (!acc[driver.category]) acc[driver.category] = [];
    acc[driver.category].push(driver);
    return acc;
  }, {} as Record<string, DriverData[]>);

  const categoryLabels: Record<string, string> = {
    'financial': 'Financial Drivers',
    'operational': 'Operational Drivers', 
    'strategic': 'Strategic Drivers',
    'risk': 'Risk Factors'
  };

  return (
    <Box sx={{ mt: 4, p: 3 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0A1F44', mb: 1 }}>
          Business Value Drivers Analysis
        </Typography>
        <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
          Interactive visualization of your business performance across key value drivers
        </Typography>
        <Box sx={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 1.5, 
          backgroundColor: '#F0F9FF', 
          border: '1px solid #BAE6FD',
          borderRadius: '12px',
          px: 4,
          py: 2,
          mb: 4,
          minWidth: { xs: '300px', sm: '400px' },
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <Box sx={{ 
            fontSize: '18px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            💡
          </Box>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            backgroundColor: '#0EA5E9',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.5 }
            }
          }} />
          <Typography variant="h6" sx={{ 
            color: '#0C4A6E', 
            fontWeight: 'bold', 
            fontSize: { xs: '14px', sm: '16px' },
            lineHeight: 1.2,
            textAlign: 'center',
            flex: 1
          }}>
            Click on any grade card below to see detailed insights
          </Typography>
        </Box>
      </Box>

      {/* Categories Grid */}
      <Box sx={{ display: 'grid', gap: 3, mb: 4 }}>
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
              borderRadius: '16px',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Category Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  backgroundColor: category === 'financial' ? '#3B82F6' :
                                  category === 'operational' ? '#10B981' :
                                  category === 'strategic' ? '#8B5CF6' :
                                  '#EF4444',
                  mr: 2 
                }} />
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: category === 'financial' ? '#1E40AF' :
                         category === 'operational' ? '#065F46' :
                         category === 'strategic' ? '#5B21B6' :
                         '#991B1B'
                }}>
                  {categoryLabels[category]}
                </Typography>
              </Box>

              {/* Driver Cards Grid */}
              <Box sx={{ display: 'grid', gap: 2 }}>
                {categoryDrivers.map((driver) => (
                  <Card 
                    key={driver.key} 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: selectedDriver?.key === driver.key ? 
                        'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)' :
                        '#FFFFFF',
                      border: selectedDriver?.key === driver.key ? 
                        '2px solid #005b8c' : 
                        '1px solid #E5E7EB',
                      transform: selectedDriver?.key === driver.key ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: selectedDriver?.key === driver.key ? 
                        '0 2px 8px rgba(0,0,0,0.1)' : 
                        '0 2px 8px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => setSelectedDriver(selectedDriver?.key === driver.key ? null : driver)}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 'bold', 
                              color: selectedDriver?.key === driver.key ? '#FFFFFF' : '#374151',
                              mb: 0.5 
                            }}
                          >
                            {driver.label}
                          </Typography>
                          {selectedDriver?.key === driver.key && (
                            <Typography 
                              variant="body2" 
                              sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}
                            >
                              {driver.description}
                            </Typography>
                          )}
                        </Box>

                        {/* Grade Badge and Trend */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={`Grade ${driver.grade}`}
                            size="small"
                            sx={{
                              backgroundColor: driver.grade === 'A' ? '#10B981' :
                                              driver.grade === 'B' ? '#3B82F6' :
                                              driver.grade === 'C' ? '#6B7280' :
                                              driver.grade === 'D' ? '#F59E0B' :
                                              '#EF4444',
                              color: '#FFFFFF',
                              fontWeight: 'bold',
                              fontSize: '12px'
                            }}
                          />
                          <Box sx={{ color: selectedDriver?.key === driver.key ? '#005b8c' : '#9CA3AF' }}>
                            {getTrendIcon(driver.grade)}
                          </Box>
                        </Box>
                      </Box>

                      {/* Expanded Details */}
                      {selectedDriver?.key === driver.key && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                          <Box sx={{ display: 'grid', gap: 2 }}>
                            {/* Impact Badge */}
                            <Box>
                              {getImpactBadge(selectedDriver.impact)}
                            </Box>

                            {/* Performance Meter */}
                            <Box>
                              <Typography 
                                variant="body2" 
                                sx={{ color: '#FFFFFF', fontWeight: 'bold', mb: 1 }}
                              >
                                Performance Level
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ 
                                  flex: 1, 
                                  height: 8, 
                                  backgroundColor: 'rgba(255,255,255,0.2)', 
                                  borderRadius: '4px',
                                  overflow: 'hidden'
                                }}>
                                  <Box sx={{ 
                                    height: '100%', 
                                    backgroundColor: '#005b8c',
                                    width: `${(getGradeScore(selectedDriver.grade) / 5) * 100}%`,
                                    transition: 'width 0.3s ease'
                                  }} />
                                </Box>
                                <Typography 
                                  variant="body2" 
                                  sx={{ color: '#FFFFFF', fontWeight: 'bold', minWidth: '40px' }}
                                >
                                  {getGradeScore(selectedDriver.grade)}/5
                                </Typography>
                              </Box>
                            </Box>

                            {/* Impact Description */}
                            <Box>
                              <Typography 
                                variant="body2" 
                                sx={{ color: '#FFFFFF', fontWeight: 'bold', mb: 0.5 }}
                              >
                                Impact on Valuation
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                              >
                                <strong style={{ color: '#005b8c' }}>{selectedDriver.impact}</strong> impact on overall business valuation
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Grade Legend */}
      <Card sx={{ 
        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', 
        border: '1px solid #E2E8F0',
        borderRadius: '16px' 
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0A1F44', mb: 3 }}>
            Grade Legend
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
            {(['A', 'B', 'C', 'D', 'F'] as Grade[]).map((grade) => (
              <Box key={grade} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  width: 16, 
                  height: 16, 
                  borderRadius: '4px',
                  backgroundColor: grade === 'A' ? '#10B981' :
                                  grade === 'B' ? '#3B82F6' :
                                  grade === 'C' ? '#6B7280' :
                                  grade === 'D' ? '#F59E0B' :
                                  '#EF4444'
                }} />
                <Typography variant="body2" sx={{ color: '#374151', fontWeight: 'medium' }}>
                  <strong>{grade}</strong> - {grade === 'A' ? 'Excellent' : grade === 'B' ? 'Good' : grade === 'C' ? 'Average' : grade === 'D' ? 'Needs Improvement' : 'At Risk'}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}