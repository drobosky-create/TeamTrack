import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  LinearProgress,
  Avatar,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import { 
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  MoreVert as MoreVertIcon,
  PendingActions as PendingActionsIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

interface MetricsData {
  totalTeamMembers: number;
  pendingReviews: number;
  overdueReviews: number;
  completedThisMonth: number;
  averageScore: number;
}

interface Review {
  id: number;
  revieweeId: string;
  reviewerName?: string;
  revieweeName?: string;
  status: 'pending' | 'in_progress' | 'completed';
  type: 'monthly' | 'quarterly' | 'annual' | 'probationary';
  dueDate: string;
  overallScore?: number;
}

const MaterialDashboardCard: React.FC<{
  title: string;
  count: string | number;
  icon: React.ReactNode;
  color: string;
  percentage?: {
    amount: string;
    color: 'success' | 'error' | 'warning';
    label: string;
  };
}> = ({ title, count, icon, color, percentage }) => {
  const getGradientByColor = (colorName: string) => {
    switch (colorName) {
      case 'primary': return 'linear-gradient(195deg, #42424a, #191919)';
      case 'success': return 'linear-gradient(195deg, #66bb6a, #43a047)';
      case 'info': return 'linear-gradient(195deg, #49a3f1, #1a73e8)';
      case 'warning': return 'linear-gradient(195deg, #ffa726, #fb8c00)';
      case 'error': return 'linear-gradient(195deg, #ef5350, #e53935)';
      case 'dark': return 'linear-gradient(195deg, #42424a, #191919)';
      default: return 'linear-gradient(195deg, #66bb6a, #43a047)';
    }
  };

  const getShadowByColor = (colorName: string) => {
    switch (colorName) {
      case 'primary': return '0 4px 20px 0 rgba(66, 66, 74, 0.14), 0 7px 10px -5px rgba(66, 66, 74, 0.4)';
      case 'success': return '0 4px 20px 0 rgba(102, 187, 106, 0.14), 0 7px 10px -5px rgba(76, 175, 80, 0.4)';
      case 'info': return '0 4px 20px 0 rgba(73, 163, 241, 0.14), 0 7px 10px -5px rgba(26, 115, 232, 0.4)';
      case 'warning': return '0 4px 20px 0 rgba(255, 167, 38, 0.14), 0 7px 10px -5px rgba(251, 140, 0, 0.4)';
      case 'error': return '0 4px 20px 0 rgba(239, 83, 80, 0.14), 0 7px 10px -5px rgba(229, 57, 53, 0.4)';
      case 'dark': return '0 4px 20px 0 rgba(66, 66, 74, 0.14), 0 7px 10px -5px rgba(66, 66, 74, 0.4)';
      default: return '0 4px 20px 0 rgba(102, 187, 106, 0.14), 0 7px 10px -5px rgba(76, 175, 80, 0.4)';
    }
  };

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, px: 2 }}>
        <Box
          sx={{
            background: getGradientByColor(color),
            color: 'white',
            borderRadius: '0.75rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '4rem',
            height: '4rem',
            mt: -3,
            boxShadow: getShadowByColor(color),
            '& svg': {
              fontSize: '1.5rem'
            }
          }}
        >
          {icon}
        </Box>
        <Box sx={{ textAlign: 'right', lineHeight: 1.25 }}>
          <Typography 
            variant="button" 
            sx={{ 
              fontWeight: 300, 
              color: '#7b809a',
              fontSize: '0.875rem',
              textTransform: 'capitalize'
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              color: '#344767',
              fontSize: '1.625rem',
              lineHeight: 1.25
            }}
          >
            {count}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ pb: 2, px: 2 }}>
        <Typography 
          component="p" 
          variant="button" 
          sx={{ 
            color: '#7b809a',
            display: 'flex',
            fontSize: '0.875rem',
            lineHeight: 1.625
          }}
        >
          {percentage && (
            <Typography
              component="span"
              variant="button"
              sx={{
                fontWeight: 700,
                color: percentage.color === 'success' ? '#4caf50' : 
                       percentage.color === 'error' ? '#f44336' : 
                       percentage.color === 'warning' ? '#ffa726' : '#4caf50'
              }}
            >
              {percentage.amount}
            </Typography>
          )}
          {percentage && `\u00A0${percentage.label}`}
        </Typography>
      </Box>
    </Card>
  );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  return (
    <ListItem 
      sx={{ 
        bgcolor: 'background.paper',
        borderRadius: 2,
        mb: 2,
        border: '1px solid #e9ecef',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transform: 'translateY(-1px)',
          transition: 'all 0.2s ease'
        }
      }}
    >
      <ListItemAvatar>
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main',
            background: 'linear-gradient(195deg, #66bb6a, #43a047)',
            width: 45,
            height: 45
          }}
        >
          <AssignmentIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 700,
              color: '#344767',
              fontSize: '1rem'
            }}
          >
            {review.revieweeName || `Review #${review.id}`}
          </Typography>
        }
        secondary={
          <Box sx={{ mt: 1 }}>
            <Chip 
              label={getStatusLabel(review.status)}
              color={getStatusColor(review.status) as any}
              size="small"
              sx={{ 
                mr: 1,
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              component="span"
              sx={{ fontSize: '0.875rem' }}
            >
              Due: {new Date(review.dueDate).toLocaleDateString()}
            </Typography>
          </Box>
        }
      />
      {review.overallScore && (
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
          <StarIcon sx={{ color: '#ffa726', mr: 0.5, fontSize: '1.2rem' }} />
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#344767' }}>
            {review.overallScore}/5
          </Typography>
        </Box>
      )}
      <IconButton 
        size="small"
        sx={{ 
          color: '#344767',
          '&:hover': {
            backgroundColor: 'rgba(102, 187, 106, 0.1)'
          }
        }}
      >
        <MoreVertIcon />
      </IconButton>
    </ListItem>
  );
};

export default function Dashboard() {
  const { user } = useAuth();

  const { data: metrics } = useQuery<MetricsData>({
    queryKey: ['/api/dashboard/metrics'],
  });

  const { data: upcomingReviews = [] } = useQuery<Review[]>({
    queryKey: ['/api/dashboard/upcoming-reviews'],
  });

  const { data: recentReviews = [] } = useQuery<Review[]>({
    queryKey: ['/api/dashboard/recent-reviews'],
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: '#344767', fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 240px', minWidth: '200px' }}>
          <MaterialDashboardCard
            title="Team Members"
            count={metrics?.totalTeamMembers || 1}
            icon={<PeopleIcon />}
            color="success"
            percentage={{
              amount: "+12%",
              color: "success",
              label: "than last month"
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 240px', minWidth: '200px' }}>
          <MaterialDashboardCard
            title="Pending Reviews"
            count={metrics?.pendingReviews || 0}
            icon={<PendingActionsIcon />}
            color="warning"
            percentage={{
              amount: "-2%",
              color: "error",
              label: "than last month"
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 240px', minWidth: '200px' }}>
          <MaterialDashboardCard
            title="Overdue Reviews"
            count={metrics?.overdueReviews || 0}
            icon={<ScheduleIcon />}
            color="error"
            percentage={{
              amount: "+3",
              color: "error",
              label: "than last month"
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 240px', minWidth: '200px' }}>
          <MaterialDashboardCard
            title="Completed Reviews"
            count={metrics?.completedThisMonth || 0}
            icon={<CheckCircleIcon />}
            color="info"
            percentage={{
              amount: "+5%",
              color: "success",
              label: "than last month"
            }}
          />
        </Box>
        <Box sx={{ flex: '1 1 240px', minWidth: '200px' }}>
          <MaterialDashboardCard
            title="Average Score"
            count={metrics?.averageScore ? `${metrics.averageScore}/5` : '4.2/5'}
            icon={<TrendingUpIcon />}
            color="dark"
            percentage={{
              amount: "+0.2",
              color: "success",
              label: "than last month"
            }}
          />
        </Box>
      </Box>

      {/* Performance Overview and Recent Activity */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '2 1 600px', minWidth: '400px' }}>
          <Card 
            sx={{ 
              height: 400,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
              border: 'none'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 700,
                  color: '#344767',
                  fontSize: '1.25rem'
                }}
              >
                Performance Overview
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: 300,
                color: 'text.secondary',
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                border: '2px dashed #e9ecef'
              }}>
                <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                  Performance charts will be displayed here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card 
            sx={{ 
              height: 400,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
              border: 'none'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 700,
                  color: '#344767',
                  fontSize: '1.25rem'
                }}
              >
                Recent Activity
              </Typography>
              <Box sx={{ height: 300, overflow: 'auto' }}>
                {recentReviews.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {recentReviews.slice(0, 5).map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </List>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%',
                    color: 'text.secondary',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2,
                    border: '2px dashed #e9ecef'
                  }}>
                    <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                      No recent activity
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Upcoming Reviews */}
      <Box sx={{ width: '100%' }}>
          <Card 
            sx={{ 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: 3,
              border: 'none'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 700,
                  color: '#344767',
                  fontSize: '1.25rem'
                }}
              >
                Upcoming Reviews
              </Typography>
              {upcomingReviews.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {upcomingReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </List>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  py: 6,
                  color: 'text.secondary',
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '2px dashed #e9ecef'
                }}>
                  <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                    No upcoming reviews scheduled
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
      </Box>
    </Box>
  );
}