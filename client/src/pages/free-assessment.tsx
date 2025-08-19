import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Alert,
} from '@mui/material';
import { 
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'wouter';

interface ConsumerUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export default function FreeAssessment() {
  const [user, setUser] = useState<ConsumerUser | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('consumerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to auth if no user found
      setLocation('/consumer-auth');
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('consumerUser');
    setLocation('/consumer-auth');
  };

  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: 'hsl(var(--background))', py: 6 }}>
        <Container maxWidth="sm">
          <Alert severity="info">
            Redirecting to login...
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'hsl(var(--background))', py: 6 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <AssessmentIcon sx={{ fontSize: 64, color: '#667eea', mb: 2 }} />
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
            Welcome to Your Assessment Dashboard
          </Typography>
          <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
            Hello {user.firstName}! 
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280' }}>
            Company: {user.companyName}
          </Typography>
        </Box>

        {/* Success Message */}
        <Alert severity="success" sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon />
            <Typography>
              Authentication successful! Your account is ready for business valuations.
            </Typography>
          </Box>
        </Alert>

        {/* Assessment Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Free Business Valuation Assessment
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#6b7280' }}>
              Get started with our comprehensive business valuation tool. This assessment
              will evaluate your company across 10 key value drivers and provide insights
              into your business worth.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AssessmentIcon />}
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  py: 1.5,
                  px: 3,
                }}
                data-testid="button-start-assessment"
              >
                Start Free Assessment
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                color="primary"
                data-testid="button-view-saved"
              >
                View Saved Assessments
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Account Settings
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="text"
                color="primary"
                data-testid="button-edit-profile"
              >
                Edit Profile
              </Button>
              <Button
                variant="text"
                color="primary"
                data-testid="button-view-history"
              >
                Assessment History
              </Button>
              <Button
                variant="text"
                color="error"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                Logout
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Back to Landing */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Link href="/applebites">
            <Button variant="text" color="primary" data-testid="link-back-to-landing">
              Back to AppleBites Home
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}