import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  TextField, 
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Search, Filter, BarChart3, TrendingUp, Users, Target } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  reviews: any[];
  users: any[];
  goals: any[];
}

interface AdvancedAnalyticsProps {
  data: AnalyticsData;
}

export default function AdvancedAnalytics({ data }: AdvancedAnalyticsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  // Performance metrics calculation
  const completedReviews = data.reviews?.filter(r => r.status === 'complete').length || 0;
  const totalReviews = data.reviews?.length || 0;
  const completionRate = totalReviews > 0 ? Math.round((completedReviews / totalReviews) * 100) : 0;

  const activeUsers = data.users?.filter(u => u.role !== 'admin').length || 0;
  const completedGoals = data.goals?.filter(g => g.status === 'completed').length || 0;
  const totalGoals = data.goals?.length || 0;
  const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Chart data
  const performanceTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Review Completion Rate',
        data: [85, 87, 82, 91, 88, completionRate],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Goal Achievement Rate',
        data: [78, 82, 85, 79, 83, goalCompletionRate],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      }
    ],
  };

  const departmentData = {
    labels: ['Engineering', 'Sales', 'Marketing', 'Operations', 'HR'],
    datasets: [
      {
        data: [12, 8, 6, 10, 4],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6'
        ],
      }
    ],
  };

  const scoreDistributionData = {
    labels: ['A (90-100)', 'B (80-89)', 'C (70-79)', 'D (60-69)', 'F (0-59)'],
    datasets: [
      {
        label: 'Performance Distribution',
        data: [15, 25, 35, 20, 5],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(156, 163, 175, 0.8)'
        ],
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with filters */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
          Advanced Analytics Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search analytics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={selectedPeriod}
              label="Time Period"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="1month">Last Month</MenuItem>
              <MenuItem value="3months">Last 3 Months</MenuItem>
              <MenuItem value="6months">Last 6 Months</MenuItem>
              <MenuItem value="1year">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Key Metrics Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 3, 
        mb: 4 
      }}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <BarChart3 size={40} style={{ marginBottom: 8 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {completionRate}%
            </Typography>
            <Typography variant="body2">
              Review Completion Rate
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <TrendingUp size={40} style={{ marginBottom: 8 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {goalCompletionRate}%
            </Typography>
            <Typography variant="body2">
              Goal Achievement Rate
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Users size={40} style={{ marginBottom: 8 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {activeUsers}
            </Typography>
            <Typography variant="body2">
              Active Team Members
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Target size={40} style={{ marginBottom: 8 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {totalGoals}
            </Typography>
            <Typography variant="body2">
              Total Active Goals
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Charts Section */}
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, 
          gap: 3 
        }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Performance Trends
              </Typography>
              <Line data={performanceTrendData} options={chartOptions} />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Team Distribution
              </Typography>
              <Doughnut data={departmentData} options={doughnutOptions} />
            </CardContent>
          </Card>
        </Box>
        
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Performance Score Distribution
            </Typography>
            <Bar data={scoreDistributionData} options={chartOptions} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}