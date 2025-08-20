import React, { useMemo } from 'react';
import { Card, CardContent, Grid, Typography, Box, Chip, LinearProgress, Divider, Paper } from '@mui/material';
import { 
  TrendingUp, Target, BarChart3, Building2, DollarSign, Users, 
  Shield, Zap, Award, ChartLine, AlertCircle, CheckCircle,
  ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";
import { useLocation } from "wouter";
import MDBox from "../../../components/MD/MDBox";
import MDTypography from "../../../components/MD/MDTypography";
import MDButton from "../../../components/MD/MDButton";

interface ValuationAssessment {
  id: number;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  tier: string;
  naicsCode?: string;
  industryDescription?: string;
  midEstimate?: string;
  lowEstimate?: string;
  highEstimate?: string;
  adjustedEbitda?: string;
  baseEbitda?: string;
  valuationMultiple?: string;
  overallScore?: string;
  narrativeSummary?: string;
  executiveSummary?: string;
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
  createdAt?: string;
  netIncome?: string;
  interest?: string;
  taxes?: string;
  depreciation?: string;
  amortization?: string;
  ownerSalary?: string;
  personalExpenses?: string;
  oneTimeExpenses?: string;
  otherAdjustments?: string;
}

interface StrategicReportProps {
  results: ValuationAssessment;
}

export default function StrategicReportEnhanced({ results }: StrategicReportProps) {
  const [, setLocation] = useLocation();
  
  const formatCurrency = (value: string | null | number | undefined) => {
    if (!value) return '$0';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  const handleScheduleConsultation = () => {
    window.open('https://api.leadconnectorhq.com/widget/bookings/applebites', '_blank');
  };

  const handleExploreImprovements = () => {
    setLocation(`/value-improvement/${results.id}`);
  };

  const gradeToScore = (grade: string | null | undefined): number => {
    if (!grade) return 2.5;
    const gradeMap: { [key: string]: number } = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 };
    return gradeMap[grade.charAt(0)] || 2.5;
  };

  const getGradeColor = (grade: string | null | undefined) => {
    if (!grade) return '#64748b';
    switch (grade.charAt(0)) {
      case 'A': return '#10b981';
      case 'B': return '#3b82f6';
      case 'C': return '#f59e0b';
      case 'D': return '#ef4444';
      case 'F': return '#dc2626';
      default: return '#64748b';
    }
  };

  const getGradeIcon = (grade: string | null | undefined) => {
    const score = gradeToScore(grade);
    if (score >= 4) return <ArrowUpRight size={16} style={{ color: '#10b981' }} />;
    if (score >= 3) return <Minus size={16} style={{ color: '#f59e0b' }} />;
    return <ArrowDownRight size={16} style={{ color: '#ef4444' }} />;
  };

  // Calculate key metrics
  const metrics = useMemo(() => {
    const midValue = parseFloat(results.midEstimate || '0');
    const lowValue = parseFloat(results.lowEstimate || '0');
    const highValue = parseFloat(results.highEstimate || '0');
    const adjustedEbitda = parseFloat(results.adjustedEbitda || '0');
    const baseEbitda = parseFloat(results.baseEbitda || '0');
    const multiple = parseFloat(results.valuationMultiple || '0');
    
    const valuationSpread = highValue - lowValue;
    const adjustmentImpact = adjustedEbitda - baseEbitda;
    const adjustmentPercent = baseEbitda > 0 ? (adjustmentImpact / baseEbitda) * 100 : 0;
    
    return {
      midValue,
      lowValue,
      highValue,
      adjustedEbitda,
      baseEbitda,
      multiple,
      valuationSpread,
      adjustmentImpact,
      adjustmentPercent
    };
  }, [results]);

  // Determine industry context based on NAICS
  const industryContext = useMemo(() => {
    const naicsPrefix = results.naicsCode?.substring(0, 2) || '';
    const industryMap: { [key: string]: { sector: string; trend: string; benchmark: string } } = {
      '23': { sector: 'Construction', trend: 'Growing with infrastructure spending', benchmark: '6-10x EBITDA typical' },
      '31': { sector: 'Manufacturing', trend: 'Automation driving consolidation', benchmark: '5-8x EBITDA typical' },
      '44': { sector: 'Retail Trade', trend: 'Digital transformation critical', benchmark: '4-7x EBITDA typical' },
      '54': { sector: 'Professional Services', trend: 'High demand for specialized expertise', benchmark: '7-12x EBITDA typical' },
      '62': { sector: 'Healthcare', trend: 'Regulatory changes affecting valuations', benchmark: '8-14x EBITDA typical' },
    };
    return industryMap[naicsPrefix] || { sector: 'General Business', trend: 'Market conditions vary', benchmark: '5-10x EBITDA typical' };
  }, [results.naicsCode]);

  // Generate strategic insights
  const strategicInsights = useMemo(() => {
    const insights = [];
    const overallScore = gradeToScore(results.overallScore);
    
    if (overallScore >= 4) {
      insights.push({
        type: 'strength',
        title: 'Premium Valuation Position',
        description: 'Strong operational performance supports above-market multiples'
      });
    }
    
    if (gradeToScore(results.growthProspects) >= 4) {
      insights.push({
        type: 'opportunity',
        title: 'Growth Acceleration Potential',
        description: 'Market expansion opportunities could increase valuation by 15-25%'
      });
    }
    
    if (gradeToScore(results.ownerDependency) <= 2) {
      insights.push({
        type: 'risk',
        title: 'Key Person Risk',
        description: 'Owner dependency may reduce buyer interest and valuation'
      });
    }
    
    if (metrics.adjustmentPercent > 20) {
      insights.push({
        type: 'opportunity',
        title: 'Significant Add-backs',
        description: `${formatPercent(metrics.adjustmentPercent)} EBITDA increase from normalizations`
      });
    }
    
    return insights;
  }, [results, metrics]);

  return (
    <MDBox>
      {/* Enhanced Strategic Report Header */}
      <Card sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, #0b2147 0%, #1e293b 100%)', 
        color: 'white', 
        borderRadius: 2,
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <MDBox>
              <MDTypography variant="h3" fontWeight="medium" sx={{ color: 'white', mb: 1 }}>
                Strategic Business Valuation Report
              </MDTypography>
              <MDTypography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {results.company} • {industryContext.sector} • NAICS {results.naicsCode}
              </MDTypography>
            </MDBox>
            <Chip 
              label={results.tier?.toUpperCase() + ' ASSESSMENT'} 
              sx={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 'bold',
                px: 2,
                py: 0.5
              }} 
            />
          </MDBox>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ 
                p: 3,
                background: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: 'center'
              }}>
                <DollarSign size={24} style={{ color: '#10b981', marginBottom: 8 }} />
                <MDTypography variant="h3" fontWeight="bold" sx={{ color: 'white', mb: 0.5 }}>
                  {formatCurrency(results.midEstimate)}
                </MDTypography>
                <MDTypography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  ENTERPRISE VALUE
                </MDTypography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Paper sx={{ 
                p: 3,
                background: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: 'center'
              }}>
                <ChartLine size={24} style={{ color: '#8b5cf6', marginBottom: 8 }} />
                <MDTypography variant="h3" fontWeight="bold" sx={{ color: 'white', mb: 0.5 }}>
                  {metrics.multiple.toFixed(1)}x
                </MDTypography>
                <MDTypography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  EBITDA MULTIPLE
                </MDTypography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Paper sx={{ 
                p: 3,
                background: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: 'center'
              }}>
                <Award size={24} style={{ color: '#f59e0b', marginBottom: 8 }} />
                <MDTypography variant="h3" fontWeight="bold" sx={{ color: 'white', mb: 0.5 }}>
                  {results.overallScore || 'B'}
                </MDTypography>
                <MDTypography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  OVERALL GRADE
                </MDTypography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Paper sx={{ 
                p: 3,
                background: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: 'center'
              }}>
                <TrendingUp size={24} style={{ color: '#3b82f6', marginBottom: 8 }} />
                <MDTypography variant="h3" fontWeight="bold" sx={{ color: 'white', mb: 0.5 }}>
                  {formatCurrency(metrics.adjustedEbitda)}
                </MDTypography>
                <MDTypography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  ADJUSTED EBITDA
                </MDTypography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* AI Executive Summary with Enhanced Formatting */}
      <Card sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={3}>
            <Target size={28} style={{ marginRight: 12, color: '#3b82f6' }} />
            <MDBox>
              <MDTypography variant="h5" fontWeight="bold">
                Executive Summary
              </MDTypography>
              <MDTypography variant="caption" sx={{ color: 'text.secondary' }}>
                AI-Powered Strategic Analysis
              </MDTypography>
            </MDBox>
          </MDBox>
          
          <Paper sx={{ p: 3, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <MDTypography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
              {results.executiveSummary || results.narrativeSummary || 
              `Based on comprehensive industry analysis, ${results.company} operates in the ${industryContext.sector} sector with an enterprise value of ${formatCurrency(results.midEstimate)}. The business demonstrates ${
                results.overallScore === 'A' || results.overallScore === 'B' ? 'strong competitive positioning' : 
                results.overallScore === 'C' ? 'solid market presence' : 'developing operational capabilities'
              } with an adjusted EBITDA of ${formatCurrency(results.adjustedEbitda)} and industry-appropriate multiple of ${metrics.multiple.toFixed(1)}x.`}
            </MDTypography>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <MDBox display="flex" alignItems="center">
                  <Building2 size={20} style={{ marginRight: 8, color: '#0277bd' }} />
                  <MDTypography variant="body2">
                    <strong>Industry:</strong> {results.industryDescription}
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={4}>
                <MDBox display="flex" alignItems="center">
                  <BarChart3 size={20} style={{ marginRight: 8, color: '#7b1fa2' }} />
                  <MDTypography variant="body2">
                    <strong>Benchmark:</strong> {industryContext.benchmark}
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={4}>
                <MDBox display="flex" alignItems="center">
                  <TrendingUp size={20} style={{ marginRight: 8, color: '#059669' }} />
                  <MDTypography variant="body2">
                    <strong>Trend:</strong> {industryContext.trend}
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>
          </Paper>
        </CardContent>
      </Card>

      {/* Strategic Insights Section */}
      <Card sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox display="flex" alignItems="center" mb={3}>
            <Zap size={28} style={{ marginRight: 12, color: '#8b5cf6' }} />
            <MDTypography variant="h5" fontWeight="bold">
              Strategic Insights & Opportunities
            </MDTypography>
          </MDBox>

          <Grid container spacing={2}>
            {strategicInsights.map((insight, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper sx={{ 
                  p: 2.5,
                  border: `1px solid ${
                    insight.type === 'strength' ? '#10b981' :
                    insight.type === 'opportunity' ? '#3b82f6' :
                    '#ef4444'
                  }`,
                  backgroundColor: insight.type === 'strength' ? '#f0fdf4' :
                    insight.type === 'opportunity' ? '#eff6ff' : '#fef2f2'
                }}>
                  <MDBox display="flex" alignItems="center" mb={1}>
                    {insight.type === 'strength' && <CheckCircle size={20} style={{ color: '#10b981', marginRight: 8 }} />}
                    {insight.type === 'opportunity' && <TrendingUp size={20} style={{ color: '#3b82f6', marginRight: 8 }} />}
                    {insight.type === 'risk' && <AlertCircle size={20} style={{ color: '#ef4444', marginRight: 8 }} />}
                    <MDTypography variant="h6" fontWeight="medium">
                      {insight.title}
                    </MDTypography>
                  </MDBox>
                  <MDTypography variant="body2" sx={{ color: 'text.secondary' }}>
                    {insight.description}
                  </MDTypography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Detailed Financial Analysis */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <MDBox display="flex" alignItems="center" mb={3}>
                <DollarSign size={24} style={{ marginRight: 12, color: '#059669' }} />
                <MDTypography variant="h6" fontWeight="bold">
                  Valuation Analysis
                </MDTypography>
              </MDBox>
              
              <Box sx={{ '& > div': { py: 2, borderBottom: '1px solid #e5e7eb' } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Valuation Range</Typography>
                  <Box sx={{ width: '60%' }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="caption">{formatCurrency(metrics.lowValue)}</Typography>
                      <Typography variant="caption">{formatCurrency(metrics.highValue)}</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={((metrics.midValue - metrics.lowValue) / metrics.valuationSpread) * 100}
                      sx={{ height: 8, borderRadius: 4, backgroundColor: '#e5e7eb' }}
                    />
                  </Box>
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Base EBITDA</Typography>
                  <Typography variant="body1" fontWeight="medium">{formatCurrency(metrics.baseEbitda)}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Normalizations</Typography>
                  <Typography variant="body1" fontWeight="medium" sx={{ color: metrics.adjustmentImpact > 0 ? '#10b981' : '#ef4444' }}>
                    {metrics.adjustmentImpact > 0 ? '+' : ''}{formatCurrency(metrics.adjustmentImpact)}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Adjusted EBITDA</Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#059669' }}>
                    {formatCurrency(metrics.adjustedEbitda)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <MDBox display="flex" alignItems="center" mb={3}>
                <Shield size={24} style={{ marginRight: 12, color: '#7c3aed' }} />
                <MDTypography variant="h6" fontWeight="bold">
                  Value Driver Performance
                </MDTypography>
              </MDBox>
              
              <Grid container spacing={1.5}>
                {[
                  { key: 'financialPerformance', label: 'Financial', icon: <DollarSign size={16} /> },
                  { key: 'customerConcentration', label: 'Customers', icon: <Users size={16} /> },
                  { key: 'managementTeam', label: 'Management', icon: <Award size={16} /> },
                  { key: 'competitivePosition', label: 'Competition', icon: <Target size={16} /> },
                  { key: 'growthProspects', label: 'Growth', icon: <TrendingUp size={16} /> },
                  { key: 'systemsProcesses', label: 'Systems', icon: <Zap size={16} /> }
                ].map(({ key, label, icon }) => {
                  const grade = (results as any)[key] || 'C';
                  return (
                    <Grid item xs={6} key={key}>
                      <Paper sx={{ 
                        p: 1.5, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb'
                      }}>
                        <MDBox display="flex" alignItems="center">
                          {React.cloneElement(icon, { style: { marginRight: 6, color: '#64748b' } })}
                          <Typography variant="body2">{label}</Typography>
                        </MDBox>
                        <MDBox display="flex" alignItems="center" gap={0.5}>
                          {getGradeIcon(grade)}
                          <Chip 
                            label={grade} 
                            size="small"
                            sx={{ 
                              backgroundColor: getGradeColor(grade), 
                              color: 'white', 
                              fontWeight: 'bold',
                              minWidth: 32,
                              height: 24
                            }} 
                          />
                        </MDBox>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Call-to-Action Section */}
      <Card sx={{ 
        borderRadius: 2, 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
        border: '2px solid #3b82f6'
      }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox textAlign="center">
            <MDTypography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Ready to Maximize Your Business Value?
            </MDTypography>
            <MDTypography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Our experts can help you implement strategic improvements to increase your valuation
            </MDTypography>
            <MDBox display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <MDButton 
                variant="gradient" 
                color="primary" 
                onClick={handleScheduleConsultation}
                size="large"
                sx={{ px: 4 }}
              >
                Schedule Expert Consultation
              </MDButton>
              <MDButton 
                variant="outlined" 
                color="secondary" 
                onClick={handleExploreImprovements}
                size="large"
                sx={{ px: 4 }}
              >
                Explore Value Improvements
              </MDButton>
            </MDBox>
          </MDBox>
        </CardContent>
      </Card>
    </MDBox>
  );
}