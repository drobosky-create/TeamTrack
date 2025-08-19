import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  AppBar,
  Toolbar,
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Login as LoginIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
  BusinessCenter as BusinessIcon,
} from '@mui/icons-material';
import { Link } from 'wouter';

export default function PerformanceHubLanding() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Navigation Header */}
      <AppBar position="static" sx={{ 
        background: 'linear-gradient(195deg, #42424a, #191919)',
        boxShadow: '0 4px 20px rgba(66, 66, 74, 0.3)'
      }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <DashboardIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              PerformanceHub
            </Typography>
            <Typography variant="body2" sx={{ ml: 2, opacity: 0.9 }}>
              Team Performance Management
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<BusinessIcon />}
              component={Link}
              href="/applebites"
              sx={{ 
                borderRadius: 2,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              AppleBites
            </Button>
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              component={Link}
              href="/api/login"
              sx={{ 
                borderRadius: 2,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Team Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#1f2937', 
              mb: 3,
              background: 'linear-gradient(195deg, #42424a, #191919)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Performance Management Platform
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ color: '#6b7280', mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Comprehensive team performance tracking, reviews, and organizational development 
            tools for modern businesses.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              component={Link}
              href="/api/login"
              sx={{
                background: 'linear-gradient(195deg, #42424a, #191919)',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                boxShadow: '0 4px 20px rgba(66, 66, 74, 0.3)'
              }}
            >
              Access Team Portal
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<BusinessIcon />}
              component={Link}
              href="/applebites"
              sx={{
                borderColor: '#42424a',
                color: '#42424a',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: '#191919',
                  backgroundColor: 'rgba(66, 66, 74, 0.1)'
                }
              }}
            >
              Try AppleBites
            </Button>
          </Box>
        </Box>

        {/* Features Grid */}
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1f2937', mb: 4 }}>
          Platform Features
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 4, mb: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Performance Reviews */}
          <Card sx={{ 
            flex: 1, 
            minWidth: 280, 
            maxWidth: 350,
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(66, 66, 74, 0.15)'
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <AssessmentIcon sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 2 }}>
                Performance Reviews
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                Comprehensive review system with customizable templates, 
                self-assessments, and manager evaluations.
              </Typography>
              <Box sx={{ textAlign: 'left' }}>
                {[
                  'Monthly, quarterly & annual cycles',
                  'Customizable review templates',
                  'Goal tracking & progress monitoring',
                  'File attachments & documentation'
                ].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: '#667eea', fontSize: 16, mr: 1 }} />
                    <Typography variant="caption">{feature}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Team Management */}
          <Card sx={{ 
            flex: 1, 
            minWidth: 280, 
            maxWidth: 350,
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(66, 66, 74, 0.15)'
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 2 }}>
                Team Directory
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                Complete organizational structure with team member profiles, 
                roles, and hierarchical management.
              </Typography>
              <Box sx={{ textAlign: 'left' }}>
                {[
                  'Organizational chart visualization',
                  'Role-based access control',
                  'Team member profiles',
                  'Bulk operations & import/export'
                ].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: '#10b981', fontSize: 16, mr: 1 }} />
                    <Typography variant="caption">{feature}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Analytics & Reporting */}
          <Card sx={{ 
            flex: 1, 
            minWidth: 280, 
            maxWidth: 350,
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(66, 66, 74, 0.15)'
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 2 }}>
                Analytics & Insights
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                Advanced analytics dashboard with performance metrics, 
                trends, and actionable business insights.
              </Typography>
              <Box sx={{ textAlign: 'left' }}>
                {[
                  'Performance heatmaps',
                  'Team insights & trends',
                  'Custom reporting tools',
                  'Business valuation integration'
                ].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: '#f59e0b', fontSize: 16, mr: 1 }} />
                    <Typography variant="caption">{feature}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Role Access Levels */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1f2937', mb: 4 }}>
            Access Levels
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              {
                icon: <StarIcon sx={{ fontSize: 32, color: '#ef4444' }} />,
                title: 'Admin Access',
                description: 'Complete system control, user management, templates, and analytics',
                color: '#ef4444'
              },
              {
                icon: <PeopleIcon sx={{ fontSize: 32, color: '#3b82f6' }} />,
                title: 'Manager Access',
                description: 'Team oversight, review management, and departmental analytics',
                color: '#3b82f6'
              },
              {
                icon: <AssessmentIcon sx={{ fontSize: 32, color: '#10b981' }} />,
                title: 'Team Member',
                description: 'Personal reviews, goal tracking, and profile management',
                color: '#10b981'
              }
            ].map((role, index) => (
              <Card key={index} sx={{ 
                minWidth: 250, 
                textAlign: 'center',
                border: `2px solid ${role.color}`,
                '&:hover': { 
                  boxShadow: `0 8px 30px ${role.color}25`
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>{role.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1 }}>
                    {role.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    {role.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Integrated AppleBites */}
        <Card sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          textAlign: 'center',
          p: 6,
          mb: 6
        }}>
          <BusinessIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Integrated Business Valuation
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            PerformanceHub includes full AppleBites integration for comprehensive business valuation 
            and strategic analysis alongside performance management.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<BusinessIcon />}
              component={Link}
              href="/applebites"
              sx={{
                backgroundColor: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                px: 3,
                '&:hover': {
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              Try AppleBites
            </Button>
            <Button
              variant="outlined"
              startIcon={<LoginIcon />}
              component={Link}
              href="/api/login"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 3,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Access Team Portal
            </Button>
          </Box>
        </Card>

        {/* CTA Section */}
        <Card sx={{ 
          background: 'linear-gradient(195deg, #42424a, #191919)', 
          color: 'white',
          textAlign: 'center',
          p: 6
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Transform Your Team Performance?
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Join organizations using PerformanceHub to drive team excellence and business growth.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            component={Link}
            href="/api/login"
            sx={{
              backgroundColor: 'white',
              color: '#42424a',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: '#f8f9fa'
              }
            }}
          >
            Access Team Portal
          </Button>
        </Card>
      </Container>
    </Box>
  );
}