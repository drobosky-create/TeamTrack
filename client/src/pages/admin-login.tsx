import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Shield, ExternalLink } from 'lucide-react';

export default function AdminLoginPage() {
  const handleReplitLogin = () => {
    // Redirect to Replit OAuth login
    window.location.href = '/api/login';
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Visual Panel */}
      <Box
        sx={{
          flex: { xs: 0, md: 1 },
          display: { xs: 'none', md: 'flex' },
          background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 100 0 L 0 0 0 100" fill="none" stroke="%23ffffff" stroke-width="0.5" opacity="0.1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grid)" /%3E%3C/svg%3E")',
            opacity: 0.3
          }
        }}
      >
        <Box sx={{ textAlign: 'center', zIndex: 1, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <Shield size={80} color="white" style={{ marginRight: 24 }} />
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              Admin Portal
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', maxWidth: 500, mx: 'auto', textAlign: 'center', mb: 2 }}>
            Performance Hub & Business Intelligence
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
            Secure access to system administration and business management tools
          </Typography>
        </Box>
      </Box>

      {/* Right Authentication Panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFFFFF',
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 0 }
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 500,
            textAlign: 'center'
          }}
        >
          {/* Header */}
          <Box mb={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Shield size={32} color="#1A202C" style={{ marginRight: 12 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ 
                color: '#1A202C', 
              }}>
                Admin Authentication
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ 
              color: '#718096' 
            }}>
              Secure sign-in using your Replit account
            </Typography>
          </Box>

          {/* Authentication Notice */}
          <Box
            sx={{
              backgroundColor: '#F0F8FF',
              border: '1px solid #B8D4F0',
              borderRadius: 2,
              p: 3,
              mb: 4
            }}
          >
            <Typography variant="body2" sx={{ color: '#1A365D', fontWeight: 'medium', mb: 1 }}>
              🔒 Secure Authentication Required
            </Typography>
            <Typography variant="body2" sx={{ color: '#2A4A6B', fontSize: 14, mb: 2 }}>
              This admin portal uses Replit's secure authentication system. You'll be redirected to sign in with your authorized Replit account.
            </Typography>
            <Typography variant="body2" sx={{ color: '#2A4A6B', fontSize: 14, fontWeight: 'medium' }}>
              Current admin user: drobosky@quantifi-partners.com
            </Typography>
          </Box>

          {/* Sign In Button */}
          <Button
            onClick={handleReplitLogin}
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #0A1F44, #1B2C4F)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              '&:hover': {
                background: 'linear-gradient(45deg, #1B2C4F, #2A3F5F)'
              },
              mb: 3
            }}
          >
            Sign in with Replit
            <ExternalLink size={20} />
          </Button>

          {/* Information */}
          <Box>
            <Typography variant="body2" sx={{ color: '#718096', mb: 2 }}>
              Only authorized administrators can access this portal.
            </Typography>
            <Typography variant="body2" sx={{ color: '#718096' }}>
              After authentication, you'll be redirected to the admin dashboard.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}