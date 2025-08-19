import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MDButton from "../../../components/MD/MDButton";
import MDBox from "../../../components/MD/MDBox";
import MDTypography from "../../../components/MD/MDTypography";
import { 
  Card, 
  CardContent, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Tabs,
  Tab,
  Grid,
  Box,
  Chip
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, DollarSign, FileText, Download, Eye, LogOut, ArrowLeft } from "lucide-react";
import { ValuationAssessment } from "@shared/schema";
import AdminLogin from "../../../components/admin-login";
import { useAdminAuth } from "../../../hooks/use-admin-auth";
import { useLocation } from "wouter";

export default function AnalyticsDashboard() {
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAdminAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  const { data: assessments = [], isLoading } = useQuery<ValuationAssessment[]>({
    queryKey: ['/api/analytics/assessments'],
    enabled: isAuthenticated
  });

  // Show authentication loading state
  if (authLoading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <MDBox textAlign="center">
          <MDBox 
            width={40} 
            height={40} 
            mx="auto" 
            mb={2}
            sx={{ 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          />
          <MDTypography variant="body2" color="text">
            Checking authentication...
          </MDTypography>
        </MDBox>
      </MDBox>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={login} />;
  }

  if (isLoading) {
    return (
      <MDBox p={3}>
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <MDBox textAlign="center">
            <MDBox 
              width={40} 
              height={40} 
              mx="auto" 
              mb={2}
              sx={{ 
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }}
            />
            <MDTypography variant="body2" color="text">
              Loading analytics data...
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    );
  }

  // Calculate metrics
  const totalAssessments = assessments.length;
  const avgValuation = totalAssessments > 0 ? 
    assessments.reduce((sum, a) => sum + parseFloat(a.midEstimate || "0"), 0) / totalAssessments : 0;
  const totalEBITDA = assessments.reduce((sum, a) => sum + parseFloat(a.adjustedEbitda || "0"), 0);
  const completedAssessments = assessments.filter(a => a.isProcessed).length;

  const followUpData = assessments.reduce((acc, a) => {
    const intent = a.followUpIntent || 'unknown';
    acc[intent] = (acc[intent] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const scoreDistribution = assessments.reduce((acc, a) => {
    const score = a.overallScore?.charAt(0) || 'C';
    acc[score] = (acc[score] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const valuationByMonth = assessments.reduce((acc, a) => {
    const month = new Date(a.createdAt || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieColors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <MDBox p={3}>
      {/* Header */}
      <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <MDBox display="flex" alignItems="center" gap={2}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/admin')}
            startIcon={<ArrowLeft size={16} />}
          >
            Back to Dashboard
          </Button>
          <MDBox>
            <MDTypography variant="h4" fontWeight="bold" color="dark">
              Analytics Dashboard
            </MDTypography>
            <MDTypography variant="body2" color="text">
              Comprehensive insights into business valuations and lead performance
            </MDTypography>
          </MDBox>
        </MDBox>
        <Button variant="outlined" onClick={logout} startIcon={<LogOut size={16} />}>
          Logout
        </Button>
      </MDBox>

      {/* Metrics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDBox>
                  <MDTypography variant="h6" color="text">
                    Total Assessments
                  </MDTypography>
                  <MDTypography variant="h3" fontWeight="bold" color="dark">
                    {totalAssessments}
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    {completedAssessments} completed
                  </MDTypography>
                </MDBox>
                <Users size={24} color="#1976d2" />
              </MDBox>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDBox>
                  <MDTypography variant="h6" color="text">
                    Avg Valuation
                  </MDTypography>
                  <MDTypography variant="h3" fontWeight="bold" color="dark">
                    ${Math.round(avgValuation).toLocaleString()}
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    Mid-point estimate
                  </MDTypography>
                </MDBox>
                <TrendingUp size={24} color="#2e7d32" />
              </MDBox>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDBox>
                  <MDTypography variant="h6" color="text">
                    Total EBITDA
                  </MDTypography>
                  <MDTypography variant="h3" fontWeight="bold" color="dark">
                    ${Math.round(totalEBITDA).toLocaleString()}
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    Combined adjusted EBITDA
                  </MDTypography>
                </MDBox>
                <DollarSign size={24} color="#ed6c02" />
              </MDBox>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <MDBox display="flex" justifyContent="space-between" alignItems="center">
                <MDBox>
                  <MDTypography variant="h6" color="text">
                    Completion Rate
                  </MDTypography>
                  <MDTypography variant="h3" fontWeight="bold" color="dark">
                    {totalAssessments > 0 ? Math.round((completedAssessments / totalAssessments) * 100) : 0}%
                  </MDTypography>
                  <MDTypography variant="caption" color="text">
                    Successfully processed
                  </MDTypography>
                </MDBox>
                <FileText size={24} color="#9c27b0" />
              </MDBox>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Overview" />
            <Tab label="All Assessments" />
            <Tab label="Trends" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MDBox mb={3}>
                  <MDTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                    Follow-up Intent Distribution
                  </MDTypography>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={Object.entries(followUpData).map(([key, value]) => ({ 
                          name: key.charAt(0).toUpperCase() + key.slice(1), 
                          value 
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={110}
                        innerRadius={45}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="#ffffff"
                        strokeWidth={3}
                      >
                        {Object.entries(followUpData).map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </MDBox>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDBox mb={3}>
                  <MDTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                    Overall Score Distribution
                  </MDTypography>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart 
                      data={Object.entries(scoreDistribution).map(([key, value]) => ({ 
                        grade: key, 
                        count: value 
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </MDBox>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* All Assessments Tab */}
        {activeTab === 1 && (
          <CardContent>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                All Valuations ({totalAssessments} total)
              </MDTypography>
            </MDBox>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Company</strong></TableCell>
                    <TableCell><strong>Contact</strong></TableCell>
                    <TableCell><strong>Valuation</strong></TableCell>
                    <TableCell><strong>EBITDA</strong></TableCell>
                    <TableCell><strong>Score</strong></TableCell>
                    <TableCell><strong>Follow-up</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>{assessment.company || 'N/A'}</TableCell>
                      <TableCell>
                        <MDBox>
                          <MDTypography variant="body2" fontWeight="medium">
                            {assessment.firstName} {assessment.lastName}
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            {assessment.email}
                          </MDTypography>
                        </MDBox>
                      </TableCell>
                      <TableCell>
                        <MDTypography variant="body2" fontWeight="medium">
                          ${Math.round(parseFloat(assessment.midEstimate || "0")).toLocaleString()}
                        </MDTypography>
                      </TableCell>
                      <TableCell>
                        <MDTypography variant="body2">
                          ${Math.round(parseFloat(assessment.adjustedEbitda || "0")).toLocaleString()}
                        </MDTypography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={assessment.overallScore || 'N/A'} 
                          size="small"
                          color={assessment.overallScore?.includes('A') ? 'success' : 
                                assessment.overallScore?.includes('B') ? 'info' :
                                assessment.overallScore?.includes('C') ? 'warning' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={assessment.followUpIntent || 'unknown'} 
                          size="small"
                          variant={assessment.followUpIntent === 'yes' ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell>
                        <MDTypography variant="body2">
                          {new Date(assessment.createdAt || '').toLocaleDateString()}
                        </MDTypography>
                      </TableCell>
                      <TableCell>
                        <MDBox display="flex" gap={1}>
                          <Button size="small" variant="outlined">
                            <Eye size={16} />
                          </Button>
                          {assessment.pdfUrl && (
                            <Button size="small" variant="outlined">
                              <Download size={16} />
                            </Button>
                          )}
                        </MDBox>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}

        {/* Trends Tab */}
        {activeTab === 2 && (
          <CardContent>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                Assessment Trends Over Time
              </MDTypography>
            </MDBox>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart 
                data={Object.entries(valuationByMonth).map(([month, count]) => ({ month, count }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        )}
      </Card>
    </MDBox>
  );
}