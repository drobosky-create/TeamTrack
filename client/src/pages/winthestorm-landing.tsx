import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Box, Typography, Button, TextField, Card, CardContent, Container } from '@mui/material';
import { CheckCircle, TrendingUp, BarChart3, Award, Users, Calendar, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface EventSignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  phone: string;
}

export default function WinTheStormLanding() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<EventSignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch dynamic pricing from Stripe
  const { data: priceData } = useQuery({
    queryKey: ['/api/stripe/price/growth'],
    queryFn: async () => {
      const response = await fetch('/api/stripe/price/growth');
      if (!response.ok) return { price: 795 }; // fallback
      return response.json();
    }
  });

  const handleInputChange = (field: keyof EventSignupFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/consumer/event-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          eventCode: 'WIN_THE_STORM_2025',
          plan: 'growth' // Grant Growth plan for free
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        // Redirect to consumer dashboard after a short delay
        setTimeout(() => {
          setLocation('/consumer-dashboard');
        }, 2000);
      } else {
        console.error('Registration failed:', data.message);
      }
    } catch (error) {
      console.error('Event signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ maxWidth: 500, textAlign: 'center', p: 4 }}>
          <CardContent>
            <CheckCircle size={64} color="#28a745" style={{ marginBottom: 16 }} />
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: '#1A202C' }}>
              Welcome to AppleBites Growth!
            </Typography>
            <Typography variant="body1" sx={{ color: '#718096', mb: 3 }}>
              Your account has been created with complimentary Growth plan access. Redirecting to your dashboard...
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)' }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          {/* Event Image with Dark Background */}
          <Box sx={{ 
            mb: 4, 
            display: 'flex', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            borderRadius: 3,
            p: 4,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <img 
              src="/WTS  M&A Lounge Speakers_1755705427114.png" 
              alt="M&A Lounge Speakers" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                borderRadius: 12
              }} 
            />
          </Box>

          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 800, mx: 'auto', mb: 6 }}>
            Join industry leaders and gain exclusive access to AppleBites Growth platform - 
            normally ${priceData?.price || 1995}, completely free for event attendees.
          </Typography>
        </Box>

        {/* Two Column Layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6, alignItems: 'start' }}>
          {/* Left Column - Benefits */}
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', mb: 4 }}>
              Exclusive Growth Platform Access
            </Typography>
            
            <Box sx={{ space: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'start', mb: 3 }}>
                <TrendingUp size={24} color="#4ADE80" style={{ marginRight: 16, marginTop: 4, flexShrink: 0 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                    Professional Business Valuation
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Get a comprehensive valuation report with industry-specific multipliers and AI-powered insights.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'start', mb: 3 }}>
                <BarChart3 size={24} color="#4ADE80" style={{ marginRight: 16, marginTop: 4, flexShrink: 0 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                    Advanced Analytics & Reporting
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Track your business performance with detailed metrics and growth recommendations.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'start', mb: 3 }}>
                <Users size={24} color="#4ADE80" style={{ marginRight: 16, marginTop: 4, flexShrink: 0 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                    M&A Community Access
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Connect with other business owners and potential buyers in our exclusive network.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'start' }}>
                <Award size={24} color="#4ADE80" style={{ marginRight: 16, marginTop: 4, flexShrink: 0 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                    Value Improvement Calculator
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Discover how operational improvements can increase your business value.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Value Proposition */}
            <Card sx={{ mt: 4, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: 'white', mb: 2 }}>
                  Exclusive Event Value
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h3" sx={{ color: '#EF4444', textDecoration: 'line-through' }}>
                    ${priceData?.price || 795}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: '#4ADE80' }}>
                    FREE
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Complete Growth plan access for M&A Lounge attendees
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Right Column - Registration Form */}
          <Card sx={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#1A202C', mb: 1, textAlign: 'center' }}>
                Claim Your Free Access
              </Typography>
              <Typography variant="body1" sx={{ color: '#718096', mb: 4, textAlign: 'center' }}>
                Register now to unlock your complimentary Growth plan
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ space: 3 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                  <TextField
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    required
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    required
                    fullWidth
                    variant="outlined"
                  />
                </Box>

                <TextField
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Company Name"
                  value={formData.companyName}
                  onChange={handleInputChange('companyName')}
                  required
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                <TextField
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 4 }}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    py: 2,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #4ADE80, #22C55E)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #22C55E, #16A34A)'
                    },
                    '&:disabled': {
                      background: '#E5E7EB',
                      color: '#9CA3AF'
                    }
                  }}
                >
                  {isLoading ? 'Creating Your Account...' : 'Claim Free Growth Access'}
                </Button>

                <Typography variant="body2" sx={{ color: '#718096', textAlign: 'center', mt: 3 }}>
                  By registering, you agree to receive updates about the M&A Lounge event and AppleBites platform.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Footer Section */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 8, py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
            © 2025 AppleBites Business Valuation Platform. Exclusive offer for M&A Lounge attendees.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}