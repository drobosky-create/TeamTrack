import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Box, Card, CardContent, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import MDButton from '../../../components/MD/MDButton';
import { apiRequest, queryClient } from '../../../lib/queryClient';

export default function CheckoutSuccess() {
  const [location, setLocation] = useLocation();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get session_id from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // Verify the session with backend
      apiRequest('POST', '/api/verify-checkout-session', { sessionId })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setSessionData(data);
            // If a new user was created or tier was updated, refresh auth data
            if (data.updatedTier || data.createdNewUser) {
              queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
              queryClient.invalidateQueries({ queryKey: ['/api/me'] });
              console.log('User account updated after purchase, refreshing user data');
            }
          } else {
            setError('Payment verification failed');
          }
        })
        .catch(err => {
          console.error('Session verification error:', err);
          setError('Failed to verify payment');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError('No session ID found');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Card sx={{ maxWidth: 500, width: '90%', textAlign: 'center' }}>
          <CardContent sx={{ py: 4 }}>
            <CircularProgress size={60} />
            <MDTypography variant="h5" sx={{ mt: 2 }}>
              Verifying Payment...
            </MDTypography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Card sx={{ maxWidth: 500, width: '90%', textAlign: 'center' }}>
          <CardContent sx={{ py: 4 }}>
            <MDTypography variant="h5" color="error" gutterBottom>
              Payment Error
            </MDTypography>
            <MDTypography variant="body1" sx={{ mb: 3 }}>
              {error}
            </MDTypography>
            <MDButton
              variant="gradient"
              color="info"
              onClick={() => setLocation('/')}
            >
              Return Home
            </MDButton>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card sx={{ maxWidth: 600, width: '90%' }}>
        <CardContent sx={{ textAlign: 'center', py: 5 }}>
          <CheckCircleIcon 
            sx={{ 
              fontSize: 80, 
              color: '#4caf50', 
              mb: 2 
            }} 
          />
          
          <MDTypography variant="h3" gutterBottom>
            Payment Successful!
          </MDTypography>
          
          <MDTypography variant="h6" sx={{ mb: 3, color: '#666' }}>
            Thank you for your purchase
          </MDTypography>

          {sessionData && (
            <MDBox sx={{ mb: 4 }}>
              <MDTypography variant="body1" sx={{ mb: 1 }}>
                <strong>Order Details:</strong>
              </MDTypography>
              <MDTypography variant="body2" sx={{ mb: 1 }}>
                Product: {sessionData.productName || 'Growth & Exit Assessment'}
              </MDTypography>
              <MDTypography variant="body2" sx={{ mb: 1 }}>
                Amount: ${sessionData.amount ? (sessionData.amount / 100).toFixed(2) : '795.00'}
              </MDTypography>
              <MDTypography variant="body2">
                Session ID: {sessionData.sessionId}
              </MDTypography>
            </MDBox>
          )}

          <MDBox sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <MDButton
              variant="gradient"
              color="info"
              size="large"
              onClick={() => {
                // If a new user was created, they need to create an account
                if (sessionData?.createdNewUser) {
                  setLocation('/signup?email=' + encodeURIComponent(sessionData.customerEmail));
                } else {
                  setLocation('/dashboard');
                }
              }}
              sx={{
                background: 'linear-gradient(45deg, #0A1F44 30%, #1B2C4F 90%)',
                minWidth: 180,
              }}
            >
              {sessionData?.createdNewUser ? 'Complete Account Setup' : 'Go to Dashboard'}
            </MDButton>
            
            <MDButton
              variant="outlined"
              color="info"
              size="large"
              onClick={() => setLocation('/assessment/paid')}
              sx={{
                minWidth: 180,
              }}
            >
              Start Assessment
            </MDButton>
          </MDBox>

          <MDTypography variant="body2" sx={{ mt: 3, color: '#888' }}>
            You'll receive an email confirmation shortly with your receipt and assessment access details.
          </MDTypography>
        </CardContent>
      </Card>
    </Box>
  );
}