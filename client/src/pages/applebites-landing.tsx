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
  Divider,
} from '@mui/material';
import { Link } from 'wouter';

export default function AppleBitesLanding() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Navigation Header */}
      <AppBar position="static" sx={{ 
        background: '#1e3a5f',
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/apple-bites-logo.png"
              alt="AppleBites Logo"
              sx={{ 
                width: 40, 
                height: 40, 
                mr: 2,
                borderRadius: 1
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
              APPLE BITES
            </Typography>
            <Typography variant="caption" sx={{ ml: 1, color: '#b0c4de', fontSize: '0.75rem' }}>
              ASSESSMENTS
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              component={Link}
              href="/admin-login"
              sx={{ 
                borderColor: '#4CAF50',
                color: '#4CAF50',
                fontSize: '0.75rem',
                px: 2,
                textTransform: 'none',
                '&:hover': { 
                  borderColor: '#45a049',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)'
                }
              }}
            >
              Admin
            </Button>
            <Button
              variant="outlined"
              size="small"
              component={Link}
              href="/consumer-login"
              sx={{ 
                borderColor: 'white',
                color: 'white',
                fontSize: '0.75rem',
                px: 2,
                textTransform: 'none',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ 
                borderColor: 'white',
                color: 'white',
                fontSize: '0.75rem',
                px: 2,
                textTransform: 'none',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Pricing
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ 
                borderColor: 'white',
                color: 'white',
                fontSize: '0.75rem',
                px: 2,
                textTransform: 'none',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              About
            </Button>
            <Button
              variant="contained"
              size="small"
              component={Link}
              href="/performance-hub"
              sx={{ 
                backgroundColor: '#4CAF50',
                color: 'white',
                fontSize: '0.75rem',
                px: 2,
                textTransform: 'none',
                '&:hover': { 
                  backgroundColor: '#45a049'
                }
              }}
            >
              MERITAGE PARTNERS
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#333333', 
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Valuation & Exit Readiness, Simplified.
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#666666', 
              mb: 3,
              fontWeight: 400,
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            Discover your business's value and unlock capital readiness with Apple Bites.
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#888888', 
              maxWidth: 600,
              mx: 'auto',
              mb: 6
            }}
          >
            Choose the assessment that's right for your goals and take the first step today.
          </Typography>
        </Box>

        {/* Pricing Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#333333', 
              mb: 1,
              textTransform: 'uppercase',
              letterSpacing: 2
            }}
          >
            PRICING
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#333333', 
              mb: 6
            }}
          >
            Choose Your Plan
          </Typography>
        </Box>

        {/* Pricing Cards */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          mb: 8
        }}>
          {/* Free Plan */}
          <Card sx={{ 
            minWidth: 280, 
            maxWidth: 320,
            textAlign: 'center',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            '&:hover': { 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333333', mb: 3 }}>
                Free Plan
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#333333', mb: 4 }}>
                $0
              </Typography>
              <Box sx={{ textAlign: 'left', mb: 4 }}>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                  General EBITDA Multipliers
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                  Value Driver Assessment
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                href="/consumer-signup"
                sx={{
                  borderColor: '#1e3a5f',
                  color: '#1e3a5f',
                  py: 1.5,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1e3a5f',
                    color: 'white'
                  }
                }}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Growth & Exit Plan */}
          <Card sx={{ 
            minWidth: 280, 
            maxWidth: 320,
            textAlign: 'center',
            border: '2px solid #1e3a5f',
            borderRadius: 2,
            position: 'relative',
            '&:hover': { 
              boxShadow: '0 4px 20px rgba(30,58,95,0.2)'
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333333', mb: 3 }}>
                Growth & Exit
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#333333', mb: 4 }}>
                $795
              </Typography>
              <Box sx={{ textAlign: 'left', mb: 4 }}>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                  Everything in Free
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                  60-Min Prep Dive Call
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                component={Link}
                href="/consumer-signup"
                sx={{
                  backgroundColor: '#1e3a5f',
                  color: 'white',
                  py: 1.5,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#163048'
                  }
                }}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Capital Plan */}
          <Card sx={{ 
            minWidth: 280, 
            maxWidth: 320,
            textAlign: 'center',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            '&:hover': { 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333333', mb: 3 }}>
                Capital
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#333333', mb: 4 }}>
                $2,500
              </Typography>
              <Box sx={{ textAlign: 'left', mb: 4 }}>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                  Everything in Growth & Exit
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                  Capital Readiness Assessment
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: '#1e3a5f',
                  color: '#1e3a5f',
                  py: 1.5,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1e3a5f',
                    color: 'white'
                  }
                }}
              >
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}