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
  CircularProgress,
  useTheme,
} from '@mui/material';
import { 
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

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
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      firstName: '',
      lastName: '',
      phone: '',
    });
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Additional validation for signup
    if (tabValue === 1) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.companyName) {
        newErrors.companyName = 'Company name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch('/api/consumer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('consumerToken', data.token);
      localStorage.setItem('consumerUser', JSON.stringify(data.user));
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      setLocation('/free-assessment');
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/consumer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('consumerToken', data.token);
      localStorage.setItem('consumerUser', JSON.stringify(data.user));
      toast({
        title: "Account created!",
        description: "Welcome to AppleBites. Let's start your assessment.",
      });
      setLocation('/free-assessment');
    },
    onError: (error: Error) => {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    signupMutation.mutate({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      companyName: formData.companyName,
      phone: formData.phone,
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default, py: 6 }}>
      <Container maxWidth="sm">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Link href="/applebites">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <AssessmentIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                AppleBites
              </Typography>
            </Box>
          </Link>
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
            Access your business valuation dashboard
          </Typography>
        </Box>

        {/* Auth Card */}
        <Card sx={(theme) => ({ 
          maxWidth: 500, 
          mx: 'auto',
          boxShadow: theme.shadows[4]
        })}>
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
              <Box component="form" onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  }}
                  sx={{ mb: 3 }}
                  required
                  data-testid="input-login-email"
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  }}
                  sx={{ mb: 3 }}
                  required
                  data-testid="input-login-password"
                />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={loginMutation.isPending}
                  sx={(theme) => ({
                    background: theme.gradients?.primary.main || theme.tokens?.gradient.brandBlue,
                    py: 1.5,
                    mb: 2,
                    '&:hover': {
                      background: theme.gradients?.primary.state || theme.tokens?.gradient.brandBlue,
                    }
                  })}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Sign In to Dashboard'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <MuiLink 
                    component="button" 
                    variant="body2" 
                    sx={{ color: theme.palette.primary.main }}
                    onClick={() => alert('Password reset functionality')}
                  >
                    Forgot your password?
                  </MuiLink>
                </Box>
              </Box>
            </TabPanel>

            {/* Signup Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={handleSignup}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    }}
                    required
                    data-testid="input-signup-firstname"
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    }}
                    required
                    data-testid="input-signup-lastname"
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Company Name"
                  value={formData.companyName}
                  onChange={handleInputChange('companyName')}
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                  InputProps={{
                    startAdornment: <BusinessIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  }}
                  sx={{ mb: 3 }}
                  required
                  data-testid="input-signup-company"
                />
                
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  }}
                  sx={{ mb: 3 }}
                  required
                  data-testid="input-signup-email"
                />

                <TextField
                  fullWidth
                  label="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  sx={{ mb: 3 }}
                  data-testid="input-signup-phone"
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  }}
                  sx={{ mb: 3 }}
                  required
                  data-testid="input-signup-password"
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  }}
                  sx={{ mb: 3 }}
                  required
                  data-testid="input-signup-confirm-password"
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
                  disabled={signupMutation.isPending}
                  sx={(theme) => ({
                    background: theme.gradients?.primary.main || theme.tokens?.gradient.brandBlue,
                    py: 1.5,
                    mb: 2,
                    '&:hover': {
                      background: theme.gradients?.primary.state || theme.tokens?.gradient.brandBlue,
                    }
                  })}
                  data-testid="button-signup"
                >
                  {signupMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Create Account & Start Assessment'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    By creating an account, you agree to our{' '}
                    <MuiLink sx={{ color: theme.palette.primary.main }}>Terms of Service</MuiLink>
                    {' '}and{' '}
                    <MuiLink sx={{ color: theme.palette.primary.main }}>Privacy Policy</MuiLink>
                  </Typography>
                </Box>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
            Just exploring? Try our free assessment without signing up
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => setLocation('/free-assessment')}
          >
            Start Free Assessment
          </Button>
        </Box>
      </Container>
    </Box>
  );
}