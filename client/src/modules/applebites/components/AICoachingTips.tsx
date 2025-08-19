import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Button, Typography, Chip } from '@mui/material';
import { Lightbulb, TrendingUp, DollarSign, Clock, Target, Loader2, Brain } from 'lucide-react';
import { apiRequest } from '../../../lib/queryClient';
import { MDBox, MDTypography } from './MD';

interface CoachingTip {
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  potentialImpact: string;
  timeline: string;
}

interface AICoachingTipsProps {
  financialData: {
    revenue: number;
    ebitda: number;
    adjustedEbitda: number;
    naicsCode: string;
    industryTitle: string;
    valueDriverScores: Record<string, number>;
    userMultiple: number;
    industryAverage: number;
    companySize: 'small' | 'medium' | 'large';
    businessAge?: string;
    employeeCount?: number;
  };
}

const AICoachingTips: React.FC<AICoachingTipsProps> = ({ financialData }) => {
  const [tips, setTips] = useState<CoachingTip[]>([]);
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoachingData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both coaching tips and insights simultaneously
      const [tipsResponse, insightsResponse] = await Promise.all([
        apiRequest('POST', '/api/ai-coaching/tips', financialData),
        apiRequest('POST', '/api/ai-coaching/insights', financialData)
      ]);

      const tipsData = await tipsResponse.json();
      const insightsData = await insightsResponse.json();
      
      setTips(tipsData.tips || []);
      setInsights(insightsData.insights || '');
    } catch (err) {
      setError('Failed to generate AI coaching recommendations. Please try again.');
      console.error('Error fetching coaching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Revenue Growth': return <TrendingUp  />;
      case 'Cost Management': return <DollarSign  />;
      case 'Strategic Planning': return <Target  />;
      default: return <Lightbulb  />;
    }
  };

  return (
    <div>
      {/* Header */}
      <Card sx={{ mb: 2 }}>
        <CardHeader title={
          <MDBox display="flex" alignItems="center" gap={1}>
            <Brain size={20} />
            <MDTypography variant="h6" fontWeight="bold">
              AI-Powered Financial Coaching
            </MDTypography>
          </MDBox>
        } 
        subheader="Get personalized recommendations to improve your business valuation based on your financial data and industry benchmarks."
        />
        <CardContent>
          <Button 
            onClick={fetchCoachingData}
            disabled={loading}
            variant="contained"
            color="primary"
            startIcon={loading ? <Loader2 size={16} /> : <Brain size={16} />}
            sx={{ textTransform: 'none' }}
          >
            {loading ? 'Analyzing Your Business...' : 'Get AI Coaching Recommendations'}
          </Button>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card sx={{ mb: 2, backgroundColor: '#fee2e2' }}>
          <CardContent>
            <MDTypography variant="body2" color="error">{error}</MDTypography>
          </CardContent>
        </Card>
      )}

      {/* Contextual Insights */}
      {insights && (
        <Card sx={{ mb: 2 }}>
          <CardHeader title={
            <MDBox display="flex" alignItems="center" gap={1}>
              <Lightbulb size={20} />
              <MDTypography variant="h6" fontWeight="bold">
                Business Analysis Insights
              </MDTypography>
            </MDBox>
          } />
          <CardContent>
            <MDTypography variant="body2">{insights}</MDTypography>
          </CardContent>
        </Card>
      )}

      {/* Coaching Tips */}
      {tips.length > 0 && (
        <MDBox>
          <MDTypography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Personalized Recommendations
          </MDTypography>
          <MDBox>
            {tips.map((tip, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardHeader 
                  title={
                    <MDBox display="flex" alignItems="center" justifyContent="space-between">
                      <MDBox display="flex" alignItems="center" gap={1}>
                        {getCategoryIcon(tip.category)}
                        <MDTypography variant="h6" fontWeight="bold">{tip.title}</MDTypography>
                      </MDBox>
                      <Chip 
                        label={tip.priority.toUpperCase()}
                        color={tip.priority === 'high' ? 'error' : tip.priority === 'medium' ? 'warning' : 'success'}
                        size="small"
                      />
                    </MDBox>
                  }
                  subheader={tip.category}
                />
                <CardContent>
                  <MDTypography variant="body2" sx={{ mb: 2 }}>{tip.description}</MDTypography>
                  
                  <MDBox sx={{ mb: 2 }}>
                    <MDTypography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Action Items:</MDTypography>
                    <MDBox component="ul" sx={{ pl: 2, m: 0 }}>
                      {tip.actionItems.map((action, actionIndex) => (
                        <MDBox component="li" key={actionIndex} sx={{ mb: 0.5 }}>
                          <MDTypography variant="body2">{action}</MDTypography>
                        </MDBox>
                      ))}
                    </MDBox>
                  </MDBox>

                  <MDBox display="flex" gap={3}>
                    <MDBox>
                      <MDBox display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                        <Target size={16} />
                        <MDTypography variant="subtitle2" fontWeight="bold">Potential Impact</MDTypography>
                      </MDBox>
                      <MDTypography variant="body2">{tip.potentialImpact}</MDTypography>
                    </MDBox>
                    <MDBox>
                      <MDBox display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                        <Clock size={16} />
                        <MDTypography variant="subtitle2" fontWeight="bold">Timeline</MDTypography>
                      </MDBox>
                      <MDTypography variant="body2">{tip.timeline}</MDTypography>
                    </MDBox>
                  </MDBox>
                </CardContent>
              </Card>
            ))}
          </MDBox>
        </MDBox>
      )}
    </div>
  );
};

export default AICoachingTips;