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
  IconButton,
} from '@mui/material';
import { 
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  BusinessCenter as BusinessIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Calculate as CalculateIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { Link } from 'wouter';

export default function AppleBitesLanding() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'hsl(var(--background))' }}>
      {/* Navigation Header */}
      <AppBar position="static" sx={{ 
        background: 'var(--gradient-primary, linear-gradient(135deg, #667eea 0%, #764ba2 100%))',
        boxShadow: 'var(--shadow, 0 4px 20px rgba(102, 126, 234, 0.3))'
      }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <AssessmentIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              AppleBites
            </Typography>
            <Typography variant="body2" sx={{ ml: 2, opacity: 0.9 }}>
              Business Valuation Platform
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              component={Link}
              href="/consumer-login"
              sx={{ 
                borderRadius: 2,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Client Login
            </Button>
            <Button
              color="inherit"
              startIcon={<PersonAddIcon />}
              component={Link}
              href="/performance-hub"
              sx={{ 
                borderRadius: 2,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Team Portal
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Discover Your Business Value
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ color: '#6b7280', mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Professional business valuation and strategic analysis to help you understand, 
            improve, and maximize your company's worth.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AssessmentIcon />}
              component={Link}
              href="/consumer-signup"
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
              }}
            >
              Start Free Assessment
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<LoginIcon />}
              component={Link}
              href="/consumer-login"
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: '#764ba2',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)'
                }
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        {/* Assessment Tiers */}
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1f2937', mb: 4 }}>
          Choose Your Assessment Level
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 4, mb: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Free Assessment */}
          <Card sx={{ 
            flex: 1, 
            minWidth: 300, 
            maxWidth: 350,
            position: 'relative',
            border: '2px solid #e5e7eb',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)'
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <AssessmentIcon sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                  Free Assessment
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#10b981', my: 2 }}>
                  $0
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                {[
                  'EBITDA × NAICS multipliers',
                  'Basic business valuation',
                  'Value drivers evaluation',
                  'PDF summary report',
                  'Next steps recommendations'
                ].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: '#10b981', fontSize: 20, mr: 2 }} />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
              </Box>
              
              <Button
                fullWidth
                variant="contained"
                component={Link}
                href="/consumer-signup"
                sx={{
                  background: 'linear-gradient(45deg, #10b981 30%, #059669 90%)',
                  py: 1.5
                }}
              >
                Start Free Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Growth Assessment */}
          <Card sx={{ 
            flex: 1, 
            minWidth: 300, 
            maxWidth: 350,
            position: 'relative',
            border: '2px solid #667eea',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.25)'
            },
            transition: 'all 0.3s ease'
          }}>
            <Box sx={{
              position: 'absolute',
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              color: 'white',
              px: 3,
              py: 0.5,
              borderRadius: 2,
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}>
              MOST POPULAR
            </Box>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                  Growth Assessment
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#667eea', my: 2 }}>
                  $795
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                {[
                  'Industry-specific multipliers',
                  'Detailed value driver analysis',
                  'Growth strategy recommendations',
                  'Professional PDF report',
                  'Strategic improvement plan',
                  '30-minute consultation call'
                ].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: '#667eea', fontSize: 20, mr: 2 }} />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
              </Box>
              
              <Button
                fullWidth
                variant="contained"
                component={Link}
                href="/consumer-signup"
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  py: 1.5
                }}
              >
                Get Growth Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Capital Assessment */}
          <Card sx={{ 
            flex: 1, 
            minWidth: 300, 
            maxWidth: 350,
            position: 'relative',
            border: '2px solid #f59e0b',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(245, 158, 11, 0.15)'
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <BusinessIcon sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                  Capital Assessment
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#f59e0b', my: 2 }}>
                  $2,500
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                {[
                  'Complete capital readiness analysis',
                  'Investment opportunity assessment',
                  'Exit strategy planning',
                  'Comprehensive strategic report',
                  'Capital readiness roadmap',
                  '2-hour strategy session'
                ].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: '#f59e0b', fontSize: 20, mr: 2 }} />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                ))}
              </Box>
              
              <Button
                fullWidth
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #f59e0b 30%, #d97706 90%)',
                  py: 1.5
                }}
              >
                Contact for Capital Assessment
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* How It Works */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 4 }}>
            How It Works
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              {
                icon: <PersonAddIcon sx={{ fontSize: 40, color: '#667eea' }} />,
                title: 'Create Account',
                description: 'Sign up for free and provide basic company information'
              },
              {
                icon: <CalculateIcon sx={{ fontSize: 40, color: '#10b981' }} />,
                title: 'Complete Assessment',
                description: 'Answer questions about your business and upload financial data'
              },
              {
                icon: <StarIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
                title: 'Get Results',
                description: 'Receive your valuation report with actionable recommendations'
              }
            ].map((step, index) => (
              <Box key={index} sx={{ maxWidth: 250, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{step.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CTA Section */}
        <Card sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          textAlign: 'center',
          p: 6
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Discover Your Business Value?
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Join over 100 businesses who have used AppleBites to understand and improve their company value.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AssessmentIcon />}
            component={Link}
            href="/consumer-signup"
            sx={{
              backgroundColor: 'white',
              color: '#667eea',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: '#f8f9fa'
              }
            }}
          >
            Start Your Free Assessment Now
          </Button>
        </Card>
      </Container>
    </Box>
  );
}