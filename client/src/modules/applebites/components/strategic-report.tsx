import React from 'react';
import { Card, CardContent, Grid, Typography, Box, Chip } from '@mui/material';
import { TrendingUp, Target, BarChart3, Building2 } from "lucide-react";
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
}

interface StrategicReportProps {
  results: ValuationAssessment;
}

export default function StrategicReport({ results }: StrategicReportProps) {
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

  return (
    <MDBox>
      {/* Strategic Report Header */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #0b2147 0%, #1e293b 100%)', color: 'white', borderRadius: 1.5 }}>
        <CardContent sx={{ p: 3 }}>
          <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <MDBox>
              <MDTypography variant="h4" fontWeight="light" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                Strategic Business Valuation
              </MDTypography>
              <MDTypography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Comprehensive industry-specific analysis for {results.company}
              </MDTypography>
            </MDBox>
            <Chip 
              label="STRATEGIC ANALYSIS" 
              sx={{ 
                background: 'rgba(255,255,255,0.12)', 
                color: 'rgba(255,255,255,0.8)', 
                border: '1px solid rgba(255,255,255,0.15)'
              }} 
            />
          </MDBox>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <MDBox textAlign="center" p={2} sx={{ 
                background: 'rgba(255,255,255,0.08)', 
                borderRadius: 2, 
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <MDTypography variant="h4" fontWeight="light" sx={{ color: 'rgba(255,255,255,0.95)', mb: 0.5 }}>
                  {formatCurrency(results.midEstimate)}
                </MDTypography>
                <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                  Business Valuation
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDBox textAlign="center" p={2} sx={{ 
                background: 'rgba(255,255,255,0.08)', 
                borderRadius: 2, 
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <MDTypography variant="h4" fontWeight="light" sx={{ color: 'rgba(255,255,255,0.95)', mb: 0.5 }}>
                  {results.valuationMultiple ? parseFloat(results.valuationMultiple).toFixed(1) + 'x' : 'N/A'}
                </MDTypography>
                <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                  EBITDA Multiple
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDBox textAlign="center" p={2} sx={{ 
                background: 'rgba(255,255,255,0.08)', 
                borderRadius: 2, 
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <MDTypography variant="h4" fontWeight="light" sx={{ color: 'rgba(255,255,255,0.95)', mb: 0.5 }}>
                  {results.overallScore || 'B'}
                </MDTypography>
                <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                  Overall Grade
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* AI-Powered Executive Summary */}
      <Card sx={{ mb: 4, borderRadius: 1.5 }}>
        <CardContent sx={{ p: 3 }}>
          <MDBox display="flex" alignItems="center" mb={3}>
            <Target size={24} style={{ marginRight: 12, color: '#3b82f6' }} />
            <MDTypography variant="h5" fontWeight="medium">
              Executive Summary
            </MDTypography>
          </MDBox>
          
          <MDTypography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
            {results.executiveSummary || results.narrativeSummary || 
            `Based on our comprehensive analysis, ${results.company} demonstrates ${
              results.overallScore === 'A' || results.overallScore === 'B' ? 'strong' : 
              results.overallScore === 'C' ? 'moderate' : 'developing'
            } performance across key business value drivers. With an adjusted EBITDA of ${formatCurrency(results.adjustedEbitda)}, 
            the business is valued at ${formatCurrency(results.midEstimate)} using industry-specific multipliers.`}
          </MDTypography>

          <MDBox display="flex" gap={2} flexWrap="wrap">
            <Chip 
              icon={<Building2 size={16} />} 
              label={results.industryDescription || 'Industry Analysis'} 
              sx={{ backgroundColor: '#e0f2fe', color: '#0277bd' }} 
            />
            {results.naicsCode && (
              <Chip 
                label={`NAICS: ${results.naicsCode}`} 
                sx={{ backgroundColor: '#f3e5f5', color: '#7b1fa2' }} 
              />
            )}
          </MDBox>
        </CardContent>
      </Card>

      {/* Valuation Details */}
      <Card sx={{ mb: 4, borderRadius: 1.5 }}>
        <CardContent sx={{ p: 3 }}>
          <MDBox display="flex" alignItems="center" mb={3}>
            <BarChart3 size={24} style={{ marginRight: 12, color: '#059669' }} />
            <MDTypography variant="h5" fontWeight="medium">
              Valuation Analysis
            </MDTypography>
          </MDBox>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MDBox>
                <MDTypography variant="h6" sx={{ mb: 2, color: '#374151' }}>
                  Financial Metrics
                </MDTypography>
                <Box sx={{ '& > div': { display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e5e7eb' } }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Base EBITDA</Typography>
                    <Typography variant="body1" fontWeight="medium">{formatCurrency(results.baseEbitda)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Adjusted EBITDA</Typography>
                    <Typography variant="body1" fontWeight="medium">{formatCurrency(results.adjustedEbitda)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Valuation Multiple</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {results.valuationMultiple ? parseFloat(results.valuationMultiple).toFixed(1) + 'x' : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </MDBox>
            </Grid>

            <Grid item xs={12} md={6}>
              <MDBox>
                <MDTypography variant="h6" sx={{ mb: 2, color: '#374151' }}>
                  Valuation Range
                </MDTypography>
                <Box sx={{ '& > div': { display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e5e7eb' } }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Low Estimate</Typography>
                    <Typography variant="body1" fontWeight="medium">{formatCurrency(results.lowEstimate)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Mid Estimate</Typography>
                    <Typography variant="body1" fontWeight="medium" sx={{ color: '#059669' }}>
                      {formatCurrency(results.midEstimate)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">High Estimate</Typography>
                    <Typography variant="body1" fontWeight="medium">{formatCurrency(results.highEstimate)}</Typography>
                  </Box>
                </Box>
              </MDBox>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Value Drivers Analysis */}
      <Card sx={{ mb: 4, borderRadius: 1.5 }}>
        <CardContent sx={{ p: 3 }}>
          <MDBox display="flex" alignItems="center" mb={3}>
            <TrendingUp size={24} style={{ marginRight: 12, color: '#7c3aed' }} />
            <MDTypography variant="h5" fontWeight="medium">
              Value Driver Analysis
            </MDTypography>
          </MDBox>

          <Grid container spacing={2}>
            {[
              { key: 'financialPerformance', label: 'Financial Performance' },
              { key: 'customerConcentration', label: 'Customer Concentration' },
              { key: 'managementTeam', label: 'Management Team' },
              { key: 'competitivePosition', label: 'Competitive Position' },
              { key: 'growthProspects', label: 'Growth Prospects' },
              { key: 'systemsProcesses', label: 'Systems & Processes' },
              { key: 'assetQuality', label: 'Asset Quality' },
              { key: 'industryOutlook', label: 'Industry Outlook' },
              { key: 'riskFactors', label: 'Risk Factors' },
              { key: 'ownerDependency', label: 'Owner Dependency' }
            ].map(({ key, label }) => {
              const grade = (results as any)[key] || 'C';
              const score = gradeToScore(grade);
              return (
                <Grid item xs={12} sm={6} key={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{label}</Typography>
                    <Chip 
                      label={grade} 
                      sx={{ 
                        backgroundColor: getGradeColor(grade), 
                        color: 'white', 
                        fontWeight: 'bold',
                        minWidth: 40
                      }} 
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card sx={{ borderRadius: 1.5 }}>
        <CardContent sx={{ p: 3 }}>
          <MDBox display="flex" gap={2} flexWrap="wrap" justifyContent="center">
            <MDButton 
              variant="gradient" 
              color="primary" 
              onClick={handleScheduleConsultation}
              size="large"
            >
              Schedule Consultation
            </MDButton>
            <MDButton 
              variant="outlined" 
              color="secondary" 
              onClick={handleExploreImprovements}
              size="large"
            >
              Explore Value Improvements
            </MDButton>
          </MDBox>
        </CardContent>
      </Card>
    </MDBox>
  );
}