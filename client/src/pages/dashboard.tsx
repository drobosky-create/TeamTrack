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
  IconButton
} from '@mui/material';
import { 
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

interface MetricsData {
  totalTeamMembers: number;
  pendingReviews: number;
  completedReviews: number;
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

const StatisticsCard: React.FC<{
  title: string;
  count: string | number;
  icon: React.ReactNode;
  color: string;
  percentage?: string;
  percentageColor?: string;
}> = ({ title, count, icon, color, percentage, percentageColor = 'success' }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        position: 'relative', 
        overflow: 'visible',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        borderRadius: 3,
        border: 'none',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease'
        }
      }}
    >
      <CardContent sx={{ p: 3, pt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, pr: 1 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 1, 
                textTransform: 'uppercase', 
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: 0.5
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 700, 
                color: '#344767',
                fontSize: '2rem',
                lineHeight: 1.2
              }}
            >
              {count}
            </Typography>
            {percentage && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: percentageColor === 'success' ? '#4caf50' : '#f44336',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  {percentage}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    ml: 0.5,
                    fontSize: '0.875rem'
                  }}
                >
                  than last month
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: -25,
              right: 20,
              width: 70,
              height: 70,
              borderRadius: 3,
              background: `linear-gradient(195deg, ${color}, ${color}dd)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: `0 8px 26px -4px ${color}66`,
              '& svg': {
                fontSize: '2rem'
              }
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <StatisticsCard
            title="Team Members"
            count={metrics?.totalTeamMembers || 0}
            icon={<PeopleIcon />}
            color="#66bb6a"
            percentage="+12%"
            percentageColor="success"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatisticsCard
            title="Pending Reviews"
            count={metrics?.pendingReviews || 0}
            icon={<ScheduleIcon />}
            color="#ff9800"
            percentage="-2%"
            percentageColor="error"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatisticsCard
            title="Completed Reviews"
            count={metrics?.completedReviews || 0}
            icon={<CheckCircleIcon />}
            color="#2196f3"
            percentage="+5%"
            percentageColor="success"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatisticsCard
            title="Average Score"
            count={metrics?.averageScore ? `${metrics.averageScore}/5` : 'N/A'}
            icon={<TrendingUpIcon />}
            color="#9c27b0"
            percentage="+0.2"
            percentageColor="success"
          />
        </Grid>
      </Grid>

      {/* Charts and Lists */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
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
        </Grid>

        <Grid item xs={12} lg={4}>
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
        </Grid>
      </Grid>

      {/* Upcoming Reviews */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </Box>
  );
}