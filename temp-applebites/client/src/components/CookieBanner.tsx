import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const CookieBannerContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 9999,
  background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
  color: '#FFFFFF',
  padding: theme.spacing(2, 3),
  borderRadius: 0,
  boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
}));

const AcceptButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4B91C2 0%, #005b8c 100%)',
  color: '#FFFFFF',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 3),
  minWidth: 120,
  '&:hover': {
    background: 'linear-gradient(135deg, #005b8c 0%, #003d5c 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(75, 145, 194, 0.3)',
  },
}));

const DeclineButton = styled(Button)(({ theme }) => ({
  color: '#E2E8F0',
  fontWeight: 500,
  textTransform: 'none',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 3),
  minWidth: 120,
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
}));

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('apple-bites-cookie-consent');
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('apple-bites-cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('apple-bites-cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <CookieBannerContainer elevation={8}>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
        gap={2}
      >
        <Box flex={1}>
          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
            <img 
              src="/apple-bites-icon.png" 
              alt="Apple Bites" 
              style={{ 
                width: 24, 
                height: 24, 
                marginRight: 8,
                filter: 'brightness(1.2)'
              }} 
            />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              We use cookies to enhance your experience
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#CBD5E0', lineHeight: 1.5 }}>
            Apple Bites uses essential cookies to provide secure authentication and save your assessment progress. 
            We also use analytics cookies to improve our business valuation tools. By continuing, you agree to our{' '}
            <Link 
              href="/privacy-policy" 
              sx={{ 
                color: '#4B91C2', 
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Privacy Policy
            </Link>
            {' '}and{' '}
            <Link 
              href="/terms-of-use" 
              sx={{ 
                color: '#4B91C2', 
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Terms of Use
            </Link>
            .
          </Typography>
        </Box>
        
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
          sx={{ minWidth: { xs: '100%', md: 'auto' } }}
        >
          <DeclineButton 
            variant="outlined" 
            onClick={handleDecline}
            size="large"
          >
            Decline
          </DeclineButton>
          <AcceptButton 
            variant="contained" 
            onClick={handleAccept}
            size="large"
          >
            Accept All
          </AcceptButton>
        </Box>
      </Box>
    </CookieBannerContainer>
  );
}