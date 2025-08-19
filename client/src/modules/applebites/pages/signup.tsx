import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Box, Typography, Button } from '@mui/material';
import { Eye, EyeOff, Mail, User } from 'lucide-react';
import MDInput from '../../../components/MD/MDInput';

const appleBitesLogo = '/apple-bites-logo.png';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const [, setLocation] = useLocation();

  // Check if email is pre-filled from purchase
  const urlParams = new URLSearchParams(window.location.search);
  const prefilledEmail = urlParams.get('email') || '';

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: prefilledEmail,
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof SignupFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      setIsLoading(false);
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError('Password must contain at least one special character');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Force reload to update authentication state
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          <Box
            component="img"
            src={appleBitesLogo}
            alt="Apple Bites"
            sx={{
              height: 420,
              width: 'auto',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
          />
        </Box>
      </Box>

      {/* Right Form Panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: { xs: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)', md: '#FFFFFF' },
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 0 }
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', md: 600 },
            backgroundColor: { xs: 'white', md: 'transparent' },
            borderRadius: { xs: 3, md: 0 },
            p: { xs: 4, md: 0 },
            boxShadow: { xs: 4, md: 'none' }
          }}
        >
          {/* Logo for mobile */}
          <Box textAlign="center" mb={4} sx={{ display: { md: 'none' } }}>
            <img src={appleBitesLogo} alt="Apple Bites" style={{ height: 240 }} />
          </Box>

          {/* Header */}
          <Box mb={4}>
            <Typography variant="h4" fontWeight="bold" sx={{ 
              color: { xs: '#FFFFFF', md: '#1A202C' }, 
              mb: 1 
            }}>
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ 
              color: { xs: '#E2E8F0', md: '#718096' } 
            }}>
              Get started with your business valuation
            </Typography>
          </Box>

          {/* Error Display */}
          {error && (
            <Box
              sx={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 2,
                p: 2,
                mb: 3
              }}
            >
              <Typography sx={{ color: '#DC2626', fontSize: 14 }}>
                {error}
              </Typography>
            </Box>
          )}

          {/* Name Fields */}
          <Box display="flex" gap={2} mb={3}>
            <Box flex={1}>
              <Typography variant="body2" fontWeight="medium" sx={{ 
                color: { xs: '#E2E8F0', md: '#374151' }, 
                mb: 1 
              }}>
                First Name
              </Typography>
              <MDInput
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                required
                fullWidth
                startAdornment={<User size={18} color="#9CA3AF" />}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#D1D5DB' },
                    '&:hover fieldset': { borderColor: '#00718d' },
                    '&.Mui-focused fieldset': { borderColor: '#00718d' }
                  }
                }}
              />
            </Box>
            <Box flex={1}>
              <Typography variant="body2" fontWeight="medium" sx={{ 
                color: { xs: '#E2E8F0', md: '#374151' }, 
                mb: 1 
              }}>
                Last Name
              </Typography>
              <MDInput
                type="text"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                required
                fullWidth
                startAdornment={<User size={18} color="#9CA3AF" />}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#D1D5DB' },
                    '&:hover fieldset': { borderColor: '#00718d' },
                    '&.Mui-focused fieldset': { borderColor: '#00718d' }
                  }
                }}
              />
            </Box>
          </Box>

          {/* Email Field */}
          <Box mb={3}>
            <Typography variant="body2" fontWeight="medium" sx={{ 
              color: { xs: '#E2E8F0', md: '#374151' }, 
              mb: 1 
            }}>
              Email Address
            </Typography>
            <MDInput
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
              fullWidth
              startAdornment={<Mail size={18} color="#9CA3AF" />}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#D1D5DB' },
                  '&:hover fieldset': { borderColor: '#00718d' },
                  '&.Mui-focused fieldset': { borderColor: '#00718d' }
                }
              }}
            />
          </Box>

          {/* Password Field */}
          <Box mb={3}>
            <Typography variant="body2" fontWeight="medium" sx={{ 
              color: { xs: '#E2E8F0', md: '#374151' }, 
              mb: 1 
            }}>
              Password
            </Typography>
            <Typography variant="caption" sx={{ 
              color: { xs: '#CBD5E1', md: '#9CA3AF' }, 
              mb: 1,
              display: 'block'
            }}>
              Must be 8+ characters with uppercase, lowercase, number, and special character
            </Typography>
            <MDInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange('password')}
              required
              fullWidth
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                </button>
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#D1D5DB' },
                  '&:hover fieldset': { borderColor: '#00718d' },
                  '&.Mui-focused fieldset': { borderColor: '#00718d' }
                }
              }}
            />
          </Box>

          {/* Confirm Password Field */}
          <Box mb={4}>
            <Typography variant="body2" fontWeight="medium" sx={{ 
              color: { xs: '#E2E8F0', md: '#374151' }, 
              mb: 1 
            }}>
              Confirm Password
            </Typography>
            <MDInput
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              required
              fullWidth
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                </button>
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#D1D5DB' },
                  '&:hover fieldset': { borderColor: '#00718d' },
                  '&.Mui-focused fieldset': { borderColor: '#00718d' }
                }
              }}
            />
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            sx={{
              width: '100%',
              py: 1.5,
              fontWeight: 'bold',
              background: { 
                xs: '#00718d', // Solid color on mobile
                md: 'linear-gradient(135deg, #00718d 0%, #0A1F44 100%)' // Gradient on desktop
              },
              color: '#FFFFFF !important',
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                background: { 
                  xs: '#005b8c', // Darker solid color on mobile hover
                  md: 'linear-gradient(135deg, #00718d 0%, #3B82F6 100%)' // Gradient on desktop hover
                }
              },
              '&:disabled': {
                background: '#E5E7EB',
                color: '#9CA3AF'
              }
            }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* Sign In Redirect */}
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" sx={{ color: { xs: '#CBD5E1', md: '#6B7280' } }}>
              Already have an account?{' '}
              <Link href="/login">
                <Typography 
                  component="span" 
                  sx={{ 
                    color: { xs: '#E2E8F0', md: '#00718d' }, 
                    fontWeight: 'medium', 
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Sign in here
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}