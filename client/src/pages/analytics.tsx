import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import ValueDriversHeatmap from '@/components/ValueDriversHeatmap';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `analytics-tab-${index}`,
    'aria-controls': `analytics-tabpanel-${index}`,
  };
}

export default function AnalyticsPage() {
  const [currentTab, setCurrentTab] = useState(0);

  // Fetch data for analytics
  const { data: reviews = [] } = useQuery({
    queryKey: ['/api/reviews'],
  });

  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['/api/goals'],
  });

  const analyticsData = {
    reviews: (reviews || []) as any[],
    users: (users || []) as any[],
    goals: (goals || []) as any[]
  };

  // Sample assessment data for value drivers heatmap
  const sampleAssessment = {
    financialPerformance: 'B',
    customerConcentration: 'A',
    managementTeam: 'B',
    competitivePosition: 'C',
    growthProspects: 'B',
    systemsProcesses: 'C',
    assetQuality: 'B',
    industryOutlook: 'A',
    riskFactors: 'C',
    ownerDependency: 'B'
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 3 }}>
        Performance Analytics
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange} 
              aria-label="analytics tabs"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '16px',
                  minHeight: 48,
                },
                '& .Mui-selected': {
                  color: '#667eea !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#667eea',
                }
              }}
            >
              <Tab label="Overview Dashboard" {...a11yProps(0)} />
              <Tab label="Performance Heatmap" {...a11yProps(1)} />
              <Tab label="Team Insights" {...a11yProps(2)} />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <AdvancedAnalytics data={analyticsData} />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
                Team Performance Heat Map
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280', mb: 3 }}>
                Visual analysis of team performance across key competency areas
              </Typography>
              <ValueDriversHeatmap assessment={sampleAssessment} />
            </Box>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
                Team Performance Insights
              </Typography>
              <Typography variant="body1" sx={{ color: '#6B7280', mb: 3 }}>
                Deep insights and recommendations for team development
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: 3 
              }}>
                <Card sx={{ border: '1px solid #E5E7EB' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#10B981' }}>
                      Top Performers
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      Identify team members consistently exceeding expectations across multiple review cycles.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ border: '1px solid #E5E7EB' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#F59E0B' }}>
                      Development Opportunities
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      Areas where team members can grow and improve based on assessment data.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ border: '1px solid #E5E7EB' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#3B82F6' }}>
                      Team Strengths
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      Collective strengths and competitive advantages of your team.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ border: '1px solid #E5E7EB' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#EF4444' }}>
                      Risk Areas
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      Potential risks and areas requiring immediate attention or support.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}