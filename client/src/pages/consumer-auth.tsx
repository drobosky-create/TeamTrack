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
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setErrors({});
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const loginMutation = useMutation({
    mutationFn: async (loginData: { email: string; password: string }) => {
      const response = await fetch('/api/consumer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.firstName}!`,
      });
      // Store user session and redirect to assessment dashboard
      localStorage.setItem('consumerUser', JSON.stringify(data.user));
      setLocation('/free-assessment');
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (signupData: { 
      email: string; 
      password: string; 
      firstName: string; 
      lastName: string; 
      companyName: string; 
      phone?: string; 
    }) => {
      const response = await fetch('/api/consumer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Account Created",
        description: `Welcome ${data.user.firstName}! Your account has been created successfully.`,
      });
      // Store user session and redirect to assessment dashboard
      localStorage.setItem('consumerUser', JSON.stringify(data.user));
      setLocation('/free-assessment');
    },
    onError: (error: Error) => {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (tabValue === 1) { // Signup validation
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.companyName) newErrors.companyName = 'Company name is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'hsl(var(--background))', py: 6 }}>
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
                    startAdornment: <EmailIcon sx={{ color: '#667eea', mr: 1 }} />
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
                    startAdornment: <LockIcon sx={{ color: '#667eea', mr: 1 }} />
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
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    py: 1.5,
                    mb: 2
                  }}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Sign In to Dashboard'}
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
                      startAdornment: <PersonIcon sx={{ color: '#667eea', mr: 1 }} />
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
                      startAdornment: <PersonIcon sx={{ color: '#667eea', mr: 1 }} />
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
                    startAdornment: <BusinessIcon sx={{ color: '#667eea', mr: 1 }} />
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
                    startAdornment: <EmailIcon sx={{ color: '#667eea', mr: 1 }} />
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
                    startAdornment: <LockIcon sx={{ color: '#667eea', mr: 1 }} />
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
                    startAdornment: <LockIcon sx={{ color: '#667eea', mr: 1 }} />
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
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    py: 1.5,
                    mb: 2
                  }}
                  data-testid="button-signup"
                >
                  {signupMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Create Account & Start Assessment'}
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