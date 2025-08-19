import React from 'react';
import { Box, Card, CardContent, Button, Typography, Container, Grid, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle } from '@mui/icons-material';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';

const PricingContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
  padding: theme.spacing(8, 2),
}));

const PricingCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
  },
}));

const FeatureList = ({ features }: { features: string[] }) => (
  <Box sx={{ mt: 3 }}>
    {features.map((feature, index) => (
      <Box key={index} display="flex" alignItems="center" sx={{ mb: 2 }}>
        <CheckCircle sx={{ color: '#4B91C2', mr: 2, fontSize: 20 }} />
        <Typography variant="body2" color="text.secondary">
          {feature}
        </Typography>
      </Box>
    ))}
  </Box>
);

interface StripeProduct {
  id: string;
  name: string;
  description: string;
  price: {
    id: string;
    amount: number;
    currency: string;
  } | null;
}

export default function PricingPage() {
  const [, setLocation] = useLocation();

  // Fetch products from Stripe
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['/api/stripe/products'],
    retry: false,
  });

  const handleUpgrade = (tier: string, priceId?: string) => {
    setLocation(`/checkout?tier=${tier}${priceId ? `&priceId=${priceId}` : ''}`);
  };

  // Helper function to format price
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  // Find specific products from Stripe data
  const growthProduct = productsData?.products?.find((p: StripeProduct) => 
    p.name?.toLowerCase().includes('growth') || p.id === 'prod_Sddbk2RWzr8kyL'
  );
  
  const capitalProduct = productsData?.products?.find((p: StripeProduct) => 
    p.name?.toLowerCase().includes('capital') || p.id === 'prod_Sdvq23217qaGhp'
  );

  const plans = [
    {
      name: 'Free Tier',
      price: '$0',
      description: 'Get started with basic business valuation',
      features: [
        'Basic business valuation calculator',
        'General industry multipliers',
        'Simple PDF report',
        'Email delivery',
        'Basic value driver assessment'
      ],
      buttonText: 'Current Plan',
      buttonColor: 'secondary' as const,
      disabled: true,
    },
    {
      name: 'Growth & Exit Assessment',
      price: growthProduct?.price ? formatPrice(growthProduct.price.amount, growthProduct.price.currency) : '$795',
      description: 'Comprehensive analysis for business growth and exit planning',
      features: [
        'Industry-specific NAICS valuation analysis',
        'AI-powered business insights and recommendations',
        'Professional branded PDF reports',
        'Comprehensive value driver analysis',
        'Market positioning assessment',
        'Strategic improvement recommendations',
        'Email support and guidance'
      ],
      buttonText: 'Upgrade to Growth',
      buttonColor: 'primary' as const,
      tier: 'growth',
      popular: true,
      priceId: growthProduct?.price?.id,
    },
    {
      name: 'Capital Readiness Assessment',
      price: capitalProduct?.price ? formatPrice(capitalProduct.price.amount, capitalProduct.price.currency) : '$1,995',
      description: 'Premium solution for investment readiness and capital raising',
      features: [
        'Everything in Growth & Exit Assessment',
        'Investment readiness scoring',
        'Capital structure optimization',
        'Due diligence preparation checklist',
        'Investor presentation templates',
        'Access to capital readiness community',
        'Priority support with business advisors',
        'Quarterly strategy review sessions'
      ],
      buttonText: 'Upgrade to Capital',
      buttonColor: 'primary' as const,
      tier: 'capital',
      priceId: capitalProduct?.price?.id,
    },
  ];

  if (isLoading) {
    return (
      <PricingContainer>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <CircularProgress size={60} sx={{ color: 'white' }} />
            <Typography variant="h6" sx={{ color: 'white', mt: 2 }}>
              Loading current pricing...
            </Typography>
          </Box>
        </Container>
      </PricingContainer>
    );
  }

  if (error) {
    console.error('Error loading pricing:', error);
  }

  return (
    <PricingContainer>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <img 
            src="/apple-bites-logo.png" 
            alt="Apple Bites" 
            style={{ height: 80, marginBottom: 24 }}
          />
          <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
            Choose Your Valuation Plan
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 600, mx: 'auto' }}>
            Unlock deeper insights into your business value with our comprehensive assessment tools
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <PricingCard>
                <CardContent sx={{ 
                  p: 4, 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative'
                }}>
                  {plan.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#4B91C2',
                        color: 'white',
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                      }}
                    >
                      Most Popular
                    </Box>
                  )}
                  
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                    {plan.name}
                  </Typography>
                  
                  <Typography variant="h3" component="div" gutterBottom fontWeight="bold" color="primary">
                    {plan.price}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {plan.description}
                  </Typography>
                  
                  <FeatureList features={plan.features} />
                  
                  <Box sx={{ mt: 'auto', pt: 3 }}>
                    <Button
                      variant="contained"
                      color={plan.buttonColor}
                      size="large"
                      fullWidth
                      disabled={plan.disabled}
                      onClick={() => plan.tier && handleUpgrade(plan.tier, plan.priceId)}
                      sx={{ 
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        ...(plan.buttonColor === 'primary' && {
                          background: 'linear-gradient(45deg, #4B91C2 30%, #005b8c 90%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #005b8c 30%, #4B91C2 90%)',
                          },
                        }),
                      }}
                    >
                      {plan.buttonText}
                    </Button>
                  </Box>
                </CardContent>
              </PricingCard>
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={8}>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Need help choosing? <Button color="primary" href="mailto:support@applebites.ai">Contact our team</Button>
          </Typography>
        </Box>
      </Container>
    </PricingContainer>
  );
}