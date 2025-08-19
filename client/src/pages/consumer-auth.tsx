import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Tabs,
  Tab,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { 
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { Link } from 'wouter';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ConsumerAuth() {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleLogin = () => {
    // In real app, this would authenticate and redirect to dashboard
    alert('Login functionality would authenticate and redirect to assessment dashboard');
  };

  const handleSignup = () => {
    // In real app, this would create account with team_member role
    alert('Signup functionality would create consumer account and redirect to assessment dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', py: 6 }}>
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Link href="/applebites">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <AssessmentIcon sx={{ fontSize: 40, color: '#667eea', mr: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                AppleBites
              </Typography>
            </Box>
          </Link>
          <Typography variant="h6" sx={{ color: '#6b7280' }}>
            Access your business valuation dashboard
          </Typography>
        </Box>

        {/* Auth Card */}
        <Card sx={{ 
          maxWidth: 500, 
          mx: 'auto',
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.1)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              centered
              sx={{ mb: 3 }}
            >
              <Tab 
                label="Sign In" 
                icon={<PersonIcon />} 
                iconPosition="start"
                sx={{ minHeight: 60 }}
              />
              <Tab 
                label="Create Account" 
                icon={<BusinessIcon />} 
                iconPosition="start"
                sx={{ minHeight: 60 }}
              />
            </Tabs>

            {/* Login Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ color: '#667eea', mr: 1 }} />
                  }}
                  sx={{ mb: 3 }}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ color: '#667eea', mr: 1 }} />
                  }}
                  sx={{ mb: 3 }}
                  required
                />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="large"
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    py: 1.5,
                    mb: 2
                  }}
                >
                  Sign In to Dashboard
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <MuiLink 
                    component="button" 
                    variant="body2" 
                    sx={{ color: '#667eea' }}
                    onClick={() => alert('Password reset functionality')}
                  >
                    Forgot your password?
                  </MuiLink>
                </Box>
              </Box>
            </TabPanel>

            {/* Signup Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    required
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Company Name"
                  value={formData.companyName}
                  onChange={handleInputChange('companyName')}
                  InputProps={{
                    startAdornment: <BusinessIcon sx={{ color: '#667eea', mr: 1 }} />
                  }}
                  sx={{ mb: 3 }}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ color: '#667eea', mr: 1 }} />
                  }}
                  sx={{ mb: 3 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  sx={{ mb: 3 }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ color: '#667eea', mr: 1 }} />
                  }}
                  sx={{ mb: 3 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ color: '#667eea', mr: 1 }} />
                  }}
                  sx={{ mb: 3 }}
                  required
                />

                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Creating an account gives you access to save assessment results, 
                    track progress, and schedule consultations.
                  </Typography>
                </Alert>

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="large"
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    py: 1.5,
                    mb: 2
                  }}
                >
                  Create Account & Start Assessment
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    By creating an account, you agree to our{' '}
                    <MuiLink sx={{ color: '#667eea' }}>Terms of Service</MuiLink>
                    {' '}and{' '}
                    <MuiLink sx={{ color: '#667eea' }}>Privacy Policy</MuiLink>
                  </Typography>
                </Box>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
            Want to try before creating an account?
          </Typography>
          <Button
            variant="outlined"
            component={Link}
            href="/free-assessment"
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              mr: 2,
              '&:hover': {
                borderColor: '#764ba2',
                backgroundColor: 'rgba(102, 126, 234, 0.1)'
              }
            }}
          >
            Start Free Assessment
          </Button>
          <Button
            variant="text"
            component={Link}
            href="/applebites"
            sx={{ color: '#6b7280' }}
          >
            Back to AppleBites
          </Button>
        </Box>

        {/* Team Portal Link */}
        <Box sx={{ textAlign: 'center', mt: 6, pt: 4, borderTop: '1px solid #e5e7eb' }}>
          <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
            AppleBites team member?
          </Typography>
          <Button
            variant="text"
            component={Link}
            href="/performance-hub"
            sx={{ 
              color: '#42424a',
              '&:hover': { backgroundColor: 'rgba(66, 66, 74, 0.1)' }
            }}
          >
            Access Team Portal
          </Button>
        </Box>
      </Container>
    </Box>
  );
}