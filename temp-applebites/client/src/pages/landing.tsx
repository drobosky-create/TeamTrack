import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  Container,
  CardContent,
  Modal
} from '@mui/material';
import { CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#ffffff',
      position: 'relative'
    }}>
      {/* Header */}
      <Box sx={{ 
        py: { xs: 2, md: 3 }, 
        px: { xs: 2, md: 4 }, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        position: 'relative'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
          <img src="/apple-bites-logo.png" alt="Apple Bites" style={{ height: 100 }} />
          <Typography variant="h6" sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            fontSize: { xs: '1rem', md: '1.25rem' },
            display: { xs: 'none', sm: 'block' }
          }}>
            Apple Bites
          </Typography>
        </Box>
        
        {/* Desktop Navigation */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          gap: 3, 
          alignItems: 'center' 
        }}>
          <Button 
            variant="outlined"
            component={Link}
            href="/admin"
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.5)',
              opacity: 0.9,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { 
                opacity: 1, 
                borderColor: 'white',
                color: '#17a2b8',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Admin
          </Button>
          <Button 
            variant="outlined"
            component={Link}
            href="/login"
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.5)',
              opacity: 0.9,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { 
                opacity: 1, 
                borderColor: 'white',
                color: '#17a2b8',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Sign In
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/demo-login', { method: 'POST' });
                  if (response.ok) {
                    window.location.reload();
                  }
                } catch (error) {
                  console.error('Demo login failed:', error);
                }
              }}
              variant="outlined" 
              sx={{ 
                color: '#ff6b6b', 
                borderColor: '#ff6b6b',
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                '&:hover': { 
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  borderColor: '#ff6b6b'
                }
              }} 
              size="small"
            >
              Demo Login
            </Button>
          )}
          <Button 
            variant="outlined"
            component="a"
            href="#pricing"
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.5)',
              opacity: 0.9,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { 
                opacity: 1, 
                borderColor: 'white',
                color: '#17a2b8',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Pricing
          </Button>
          <Button 
            variant="outlined"
            component="a"
            href="#about"
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.5)',
              opacity: 0.9,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { 
                opacity: 1, 
                borderColor: 'white',
                color: '#17a2b8',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            About
          </Button>
          <Button 
            component="a"
            href="https://meritage-partners.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained" 
            sx={{ 
              background: 'linear-gradient(45deg, #17a2b8, #007bff)',
              '&:hover': {
                background: 'linear-gradient(45deg, #138496, #0056b3)'
              }
            }} 
            size="small"
          >
            Meritage Partners
          </Button>
        </Box>

        {/* Mobile Navigation */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' }, 
          gap: 1, 
          alignItems: 'center' 
        }}>
          <Link href="/admin">
            <Button variant="outlined" sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.5)',
              fontSize: '0.75rem',
              px: 2,
              py: 0.5,
              minWidth: 'auto',
              '&:hover': { 
                borderColor: 'white',
                background: 'rgba(255,255,255,0.1)'
              }
            }}>
              Admin
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="contained" sx={{ 
              background: 'linear-gradient(45deg, #17a2b8, #007bff)',
              fontSize: '0.75rem',
              px: 2,
              py: 0.5,
              minWidth: 'auto',
              '&:hover': {
                background: 'linear-gradient(45deg, #138496, #0056b3)'
              }
            }}>
              Sign In
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h1" sx={{ 
          color: '#333', 
          fontWeight: 'bold', 
          mb: 2, 
          fontSize: { xs: '2.5rem', md: '3.5rem' } 
        }}>
          Valuation & Exit Readiness, Simplified.
        </Typography>
        <Typography variant="h5" sx={{ 
          color: '#666', 
          mb: 3, 
          fontWeight: 400,
          maxWidth: 800,
          mx: 'auto'
        }}>
          Discover your business's value and unlock capital readiness with Apple Bites.
        </Typography>
        <Typography variant="body1" sx={{ 
          color: '#666', 
          mb: 4, 
          fontSize: '1.1rem',
          maxWidth: 600,
          mx: 'auto'
        }}>
          Choose the assessment that's right for your goals and take the first step today.
        </Typography>
      </Container>

      {/* Pricing Section */}
      <Box id="pricing" sx={{ py: 6, background: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ 
            color: '#333', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            mb: 2,
            fontSize: '2rem'
          }}>
            PRICING
          </Typography>
          <Typography variant="h3" sx={{ 
            color: '#333', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            mb: 6,
            fontSize: '2.5rem'
          }}>
            Choose Your Plan
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {/* Free Plan */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{
                p: 4,
                height: '100%',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                textAlign: 'center',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                      Free Plan
                    </Typography>
                    <Typography variant="h2" sx={{ color: '#333', fontWeight: 'bold', mb: 3 }}>
                      $0
                    </Typography>
                    
                    <Box sx={{ mb: 4, textAlign: 'left', minHeight: '140px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          General EBITDA Multipliers
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          Value Driver Assessment
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          Basic PDF Report
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          Email Delivery
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    <Button
                      component={Link}
                      href="/signup"
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{ 
                        py: 2,
                        background: '#28a745',
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        '&:hover': {
                          background: '#218838'
                        }
                      }}
                    >
                      ACCESS NOW
                    </Button>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <img 
                        src="https://assets.cdn.filesafe.space/75x6oVRlEkU7gyLcePUE/media/05907988-b0bc-4b02-b3b0-19648154fd2d.png" 
                        alt="Badge" 
                        style={{ height: 40 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Growth & Exit */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{
                p: 4,
                height: '100%',
                background: '#ffffff',
                border: '2px solid #007bff',
                borderRadius: 2,
                textAlign: 'center',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                      Growth & Exit
                    </Typography>
                    <Typography variant="h2" sx={{ color: '#333', fontWeight: 'bold', mb: 3 }}>
                      $795
                    </Typography>
                    
                    <Box sx={{ mb: 4, textAlign: 'left', minHeight: '140px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          Everything in Free
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          60-Min Deep Dive Call
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          Private Equity Scorecard
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          Opinion of Valuation
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          Enterprise Value Simulator
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    <Button
                      component={Link}
                      href="/checkout?product=prod_Sddbk2RWzr8kyL"
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{ 
                        py: 2,
                        background: '#007bff',
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        '&:hover': {
                          background: '#0056b3'
                        }
                      }}
                    >
                      ACCESS NOW
                    </Button>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <img 
                        src="https://assets.cdn.filesafe.space/75x6oVRlEkU7gyLcePUE/media/05907988-b0bc-4b02-b3b0-19648154fd2d.png" 
                        alt="Badge" 
                        style={{ height: 40 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Capital Market Plan */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{
                p: 4,
                height: '100%',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                textAlign: 'center',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                      Capital Market Plan
                    </Typography>
                    <Typography variant="h2" sx={{ color: '#333', fontWeight: 'bold', mb: 3 }}>
                      $3495/yr
                    </Typography>
                    
                    <Box sx={{ mb: 4, textAlign: 'left', minHeight: '140px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          Everything in Growth & Exit
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          Custom Valuation Stock Ticker
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          Access to Capital Providers
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          Exclusive Virtual Workshops
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                          Members-Only Live Events
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={() => setIsComingSoonOpen(true)}
                      sx={{ 
                        py: 2,
                        background: '#6c757d',
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: '#5a6268'
                        }
                      }}
                    >
                      ACCESS NOW
                    </Button>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <img 
                        src="https://assets.cdn.filesafe.space/75x6oVRlEkU7gyLcePUE/media/05907988-b0bc-4b02-b3b0-19648154fd2d.png" 
                        alt="Badge" 
                        style={{ height: 40 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* What is Apple Bites Section */}
      <Container id="about" maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" sx={{ 
          color: '#333', 
          textAlign: 'center', 
          fontWeight: 'bold', 
          mb: 2,
          fontSize: '3rem'
        }}>
          What is Apple Bites?
        </Typography>
        <Typography variant="h4" sx={{ 
          color: '#666', 
          textAlign: 'center', 
          mb: 6,
          fontStyle: 'italic',
          fontWeight: 400
        }}>
          Not every exit is all or nothing — take your bite, then come back for more.
        </Typography>

        <Grid container spacing={6} sx={{ mt: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                Built for Founders, by M&A Experts
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                Apple Bites gives business owners a quick, credible snapshot of their company's potential market value.
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                Data-Driven & Easy to Use
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                Answer a few questions, get a valuation range, and see exactly where you stand — no spreadsheets, no guesswork.
              </Typography>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                The First Bite Toward a Bigger Exit
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                Apple Bites helps you identify growth opportunities and get capital-ready with confidence.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <img 
            src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/QNFFrENaRuI2JhldFd0Z/media/679421f2c21e372cd0b390b0.svg" 
            alt="Meritage Partners" 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <Typography variant="body1" sx={{ 
            color: '#666', 
            mt: 4, 
            fontSize: '1.1rem',
            maxWidth: 800,
            mx: 'auto'
          }}>
            Whether you're scaling, preparing to sell, or exploring strategic partnerships—Meritage Partners is here to guide your next move.
          </Typography>
        </Box>
      </Container>

      {/* Features Section */}
      <Box id="features" sx={{ py: 8, background: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ 
            color: '#333', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            mb: 6,
            fontSize: '2.5rem'
          }}>
            Platform Features
          </Typography>
          
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #17a2b8, #007bff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    AI
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                  AI-Powered Analysis
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Advanced artificial intelligence analyzes your business data and provides accurate valuation insights based on industry-specific factors.
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #28a745, #20c997)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    10
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                  Value Drivers
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Comprehensive assessment of 10 key business value drivers that directly impact your company's market valuation.
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #ffc107, #fd7e14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    5min
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                  Quick Assessment
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Get professional business valuation results in just 5 minutes with our streamlined assessment process.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, background: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link href="/privacy-policy">
                  <Typography variant="body2" sx={{ 
                    color: '#007bff', 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}>
                    Privacy Policy
                  </Typography>
                </Link>
                <Link href="/terms-of-use">
                  <Typography variant="body2" sx={{ 
                    color: '#007bff', 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}>
                    Terms of Use
                  </Typography>
                </Link>
                <Typography variant="body2" sx={{ 
                  color: '#007bff', 
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}>
                  Cookie Policy
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                Address:
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                2901 West Coast Highway Suite 200, Newport Beach California 92663
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                (949) 522-9121
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                info@meritage-partners.com
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                © 2025. Meritage Partners. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Coming Soon Modal */}
      <Modal
        open={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: 'center'
        }}>
          <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
            Coming Soon!
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
            The Capital Market Plan is currently in development. 
            We're working hard to bring you this premium tier with exclusive features.
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
            Want to be notified when it launches? Contact us at{' '}
            <a href="mailto:info@applebites.ai" style={{ color: '#007bff' }}>
              info@applebites.ai
            </a>
          </Typography>
          <Button
            variant="contained"
            onClick={() => setIsComingSoonOpen(false)}
            sx={{
              background: 'linear-gradient(45deg, #17a2b8, #007bff)',
              '&:hover': {
                background: 'linear-gradient(45deg, #138496, #0056b3)'
              }
            }}
          >
            Got It
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}