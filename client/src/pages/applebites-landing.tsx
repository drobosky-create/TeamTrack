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
import { Link } from 'wouter';
import { CreditCard } from 'lucide-react';

export default function AppleBitesLanding() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Navigation Header */}
      <AppBar position="static" sx={{ 
        background: '#1a2332',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/apple-bites-logo.png"
              alt="AppleBites"
              sx={{ 
                height: 50,
                width: 'auto',
                mr: 2,
                objectFit: 'contain'
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="text"
              size="small"
              component={Link}
              href="/admin-login"
              sx={{ 
                color: 'white',
                fontSize: '0.875rem',
                px: 2,
                textTransform: 'none',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Admin
            </Button>
            <Button
              variant="text"
              size="small"
              component={Link}
              href="/consumer-login"
              sx={{ 
                color: 'white',
                fontSize: '0.875rem',
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
              variant="text"
              size="small"
              sx={{ 
                color: 'white',
                fontSize: '0.875rem',
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
              variant="text"
              size="small"
              sx={{ 
                color: 'white',
                fontSize: '0.875rem',
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
              href="/"
              sx={{ 
                backgroundColor: '#4CAF50',
                color: 'white',
                fontSize: '0.875rem',
                px: 2,
                textTransform: 'uppercase',
                fontWeight: 600,
                '&:hover': { 
                  backgroundColor: '#45a049'
                }
              }}
            >
              PerformanceHub
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
              color: '#1a2332', 
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
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: '#666666', 
              mb: 1,
              textTransform: 'uppercase',
              letterSpacing: 2,
              fontSize: '0.875rem'
            }}
          >
            PRICING
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#1a2332', 
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '&:hover': { 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a2332', mb: 3 }}>
                Free Plan
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#1a2332', mb: 1 }}>
                $0
              </Typography>
              <Box sx={{ textAlign: 'left', mb: 4, minHeight: 120 }}>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem' }}>
                  General EBITDA Multipliers
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem' }}>
                  Value Driver Assessment
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem' }}>
                  Basic PDF Report
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem' }}>
                  Email Delivery
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                component={Link}
                href="/consumer-signup"
                sx={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  py: 1.5,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#218838'
                  }
                }}
              >
                Access Now
              </Button>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
                <CreditCard size={20} color="#999" />
                <CreditCard size={20} color="#999" />
                <CreditCard size={20} color="#999" />
                <CreditCard size={20} color="#999" />
              </Box>
            </CardContent>
          </Card>

          {/* Growth & Exit Plan */}
          <Card sx={{ 
            minWidth: 280, 
            maxWidth: 320,
            textAlign: 'center',
            border: '2px solid #007bff',
            borderRadius: 2,
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0,123,255,0.1)',
            '&:hover': { 
              boxShadow: '0 4px 20px rgba(0,123,255,0.2)'
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a2332', mb: 3 }}>
                Growth & Exit
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#1a2332', mb: 1 }}>
                $795
              </Typography>
              <Box sx={{ textAlign: 'left', mb: 4, minHeight: 120 }}>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem', fontStyle: 'italic' }}>
                  Everything in Free
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem' }}>
                  60-Min Deep Dive Call
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem' }}>
                  Private Equity Scorecard
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem' }}>
                  Opinion of Valuation
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem' }}>
                  Enterprise Value Estimator
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                component={Link}
                href="/consumer-signup"
                sx={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  py: 1.5,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#0056b3'
                  }
                }}
              >
                Access Now
              </Button>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
                <CreditCard size={20} color="#999" />
                <CreditCard size={20} color="#999" />
                <CreditCard size={20} color="#999" />
                <CreditCard size={20} color="#999" />
              </Box>
            </CardContent>
          </Card>

          {/* Capital Plan */}
          <Card sx={{ 
            minWidth: 280, 
            maxWidth: 320,
            textAlign: 'center',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '&:hover': { 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            },
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a2332', mb: 3 }}>
                Capital
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#1a2332', mb: 1 }}>
                $2,500
              </Typography>
              <Box sx={{ textAlign: 'left', mb: 4, minHeight: 120 }}>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem', fontStyle: 'italic' }}>
                  Everything in Growth & Exit
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem' }}>
                  Capital Readiness Assessment
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem' }}>
                  Investment Banking Referral
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1, fontSize: '0.875rem' }}>
                  Valuation Report
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  py: 1.5,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#138496'
                  }
                }}
              >
                Coming Soon
              </Button>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
                <CreditCard size={20} color="#999" />
                <CreditCard size={20} color="#999" />
                <CreditCard size={20} color="#999" />
                <CreditCard size={20} color="#999" />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Compact Footer */}
        <Box sx={{ 
          textAlign: 'center', 
          pt: 4, 
          pb: 2,
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#666666', fontWeight: 600 }}>
              Links:
            </Typography>
            <Button
              component={Link}
              href="https://privacypolicy.com"
              sx={{ 
                color: '#007bff', 
                textTransform: 'none', 
                fontSize: '0.75rem',
                minWidth: 'auto',
                p: 0.5
              }}
            >
              Privacy Policy
            </Button>
          </Box>
          <Typography variant="caption" sx={{ color: '#888888', fontSize: '0.75rem' }}>
            2801 West Coast Highway Suite 200, Newport Beach, California 92663
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}