import React from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  IconButton
} from "@mui/material";
import { 
  Assessment as AssessmentIcon, 
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  Star as StarIcon,
  Analytics as AnalyticsIcon,
  BusinessCenter as BusinessCenterIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon
} from "@mui/icons-material";
import { Link } from "wouter";
import DashboardLayout from "../components/layout/DashboardLayout";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// Statistics Card Component
const StatCard = ({ title, value, percentage, icon: Icon, color }: {
  title: string;
  value: string;
  percentage: string;
  icon: React.ComponentType;
  color: string;
}) => (
  <Card
    sx={{
      background: `linear-gradient(195deg, ${color} 0%, ${color}99 100%)`,
      color: 'white',
      borderRadius: '12px',
      boxShadow: `0 4px 20px 0 ${color}40`,
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
            {percentage} from last month
          </Typography>
        </Box>
        <Icon sx={{ fontSize: '3rem', opacity: 0.8 }} />
      </Box>
    </CardContent>
  </Card>
);

// Chart Card Component
const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card
    sx={{
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      backgroundColor: 'white',
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" color="#344767" mb={3}>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

export default function MaterialDashboardDemo() {
  return (
    <Box display="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Topbar */}
      <Topbar />
      
      {/* Main Content with DashboardLayout */}
      <DashboardLayout>
        <Box sx={{ mt: 8 }}> {/* Margin top to account for fixed topbar */}
          
          {/* Page Header */}
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold" color="#344767" gutterBottom>
              Material Dashboard Demo
            </Typography>
            <Typography variant="body1" color="#67748e">
              This demonstrates the Material Dashboard React integration with Apple Bites styling
            </Typography>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Total Assessments"
                value="2,300"
                percentage="+3%"
                icon={AssessmentIcon}
                color="#4caf50"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Active Users"
                value="921"
                percentage="+5%"
                icon={BusinessCenterIcon}
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Revenue"
                value="$34k"
                percentage="+1%"
                icon={TrendingUpIcon}
                color="#ff9800"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Conversion Rate"
                value="4.6%"
                percentage="+2%"
                icon={AnalyticsIcon}
                color="#9c27b0"
              />
            </Grid>
          </Grid>

          {/* Charts and Tables Section */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} lg={8}>
              <ChartCard title="Sales Overview">
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="#67748e">
                    Chart component would be rendered here using Recharts or similar
                  </Typography>
                </Box>
              </ChartCard>
            </Grid>
            <Grid item xs={12} lg={4}>
              <ChartCard title="Completion Tasks">
                <List>
                  {[
                    { name: "Set up Apple Bites branding", progress: 100, color: "#4caf50" },
                    { name: "Material Dashboard integration", progress: 85, color: "#2196f3" },
                    { name: "Component documentation", progress: 60, color: "#ff9800" },
                    { name: "Testing and optimization", progress: 25, color: "#f44336" },
                  ].map((task, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <Box sx={{ width: '100%' }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" color="#344767">
                            {task.name}
                          </Typography>
                          <Typography variant="body2" color="#67748e">
                            {task.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={task.progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#f0f2f5',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: task.color,
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </ChartCard>
            </Grid>
          </Grid>

          {/* Action Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card
                sx={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'white',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <AssessmentIcon sx={{ fontSize: '2rem', color: '#2196f3' }} />
                    <Typography variant="h6" fontWeight="bold" color="#344767">
                      Start Assessment
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="#67748e" mb={3}>
                    Begin a new business valuation assessment with our streamlined process.
                  </Typography>
                  <Button
                    component={Link}
                    href="/assessment/free"
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(195deg, #42424a, #191919)',
                      color: 'white',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(195deg, #525252, #262626)',
                      },
                    }}
                  >
                    Start Free Assessment
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card
                sx={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'white',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <AnalyticsIcon sx={{ fontSize: '2rem', color: '#4caf50' }} />
                    <Typography variant="h6" fontWeight="bold" color="#344767">
                      Value Calculator
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="#67748e" mb={3}>
                    Use our interactive calculator to explore different valuation scenarios.
                  </Typography>
                  <Button
                    component={Link}
                    href="/value-calculator"
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: '#4caf50',
                      color: '#4caf50',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.04)',
                        borderColor: '#45a049',
                      },
                    }}
                  >
                    Open Calculator
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <Card
                sx={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'white',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <HistoryIcon sx={{ fontSize: '2rem', color: '#ff9800' }} />
                    <Typography variant="h6" fontWeight="bold" color="#344767">
                      Assessment History
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="#67748e" mb={3}>
                    Review your previous assessments and track your business progress.
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: '#ff9800',
                      color: '#ff9800',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.04)',
                        borderColor: '#f57c00',
                      },
                    }}
                  >
                    View History
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

        </Box>
      </DashboardLayout>
    </Box>
  );
}