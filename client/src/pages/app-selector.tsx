import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
} from '@mui/material';
import { 
  Assessment as AssessmentIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { Link } from 'wouter';

export default function AppSelector() {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 6
    }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', color: 'white', mb: 6 }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Welcome to Our Platform
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Choose your application to get started
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* AppleBites Card */}
          <Card sx={{ 
            minWidth: 350,
            maxWidth: 400,
            '&:hover': { 
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <AssessmentIcon sx={{ fontSize: 64, color: '#667eea', mb: 3 }} />
              
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 2 }}>
                AppleBites
              </Typography>
              
              <Typography variant="body1" sx={{ color: '#6b7280', mb: 3 }}>
                Professional business valuation platform for discovering and improving your company's worth
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ color: '#667eea', fontSize: 20, mr: 2 }} />
                  <Typography variant="body2">Business Valuation Tools</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssessmentIcon sx={{ color: '#667eea', fontSize: 20, mr: 2 }} />
                  <Typography variant="body2">Value Driver Analysis</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ color: '#667eea', fontSize: 20, mr: 2 }} />
                  <Typography variant="body2">Strategic Recommendations</Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                component={Link}
                href="/applebites"
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Enter AppleBites
              </Button>
            </CardContent>
          </Card>

          {/* PerformanceHub Card */}
          <Card sx={{ 
            minWidth: 350,
            maxWidth: 400,
            '&:hover': { 
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <DashboardIcon sx={{ fontSize: 64, color: '#42424a', mb: 3 }} />
              
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 2 }}>
                PerformanceHub
              </Typography>
              
              <Typography variant="body1" sx={{ color: '#6b7280', mb: 3 }}>
                Comprehensive team performance management and organizational development platform
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People sx={{ color: '#42424a', fontSize: 20, mr: 2 }} />
                  <Typography variant="body2">Team Management</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssessmentIcon sx={{ color: '#42424a', fontSize: 20, mr: 2 }} />
                  <Typography variant="body2">Performance Reviews</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ color: '#42424a', fontSize: 20, mr: 2 }} />
                  <Typography variant="body2">Analytics & Insights</Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                component={Link}
                href="/performance-hub"
                sx={{
                  background: 'linear-gradient(195deg, #42424a, #191919)',
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Enter PerformanceHub
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 6, color: 'white' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Both applications are integrated and share user management capabilities
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}