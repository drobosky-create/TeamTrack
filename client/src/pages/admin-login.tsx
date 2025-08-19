import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Box, Typography, Button, Container } from '@mui/material';
import { Eye, EyeOff, Mail, Shield } from 'lucide-react';
import MDInput from '../components/MD/MDInput';

const appleBitesLogo = '/apple-bites-logo.png';

interface AdminLoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState<AdminLoginFormData>({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof AdminLoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to combined Apple Bites and Performance Hub dashboard
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Admin login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
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
          <Link href="/">
            <Box
              component="img"
              src={appleBitesLogo}
              alt="Apple Bites"
              sx={{
                height: 320,
                width: 'auto',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                mb: 4,
                cursor: 'pointer'
              }}
            />
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <Shield size={48} color="white" style={{ marginRight: 16 }} />
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              Admin Portal
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
            Secure access to system administration and business management tools
          </Typography>
        </Box>
      </Box>

      {/* Right Form Panel */}
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
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 500,
          }}
        >
          {/* Header */}
          <Box mb={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Shield size={32} color="#1A202C" style={{ marginRight: 12 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ 
                color: '#1A202C', 
              }}>
                Admin Sign In
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ 
              color: '#718096' 
            }}>
              Access your administrative dashboard with secure credentials
            </Typography>
          </Box>

          {/* Security Notice */}
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
              🔒 Secure Admin Access
            </Typography>
            <Typography variant="body2" sx={{ color: '#2A4A6B', fontSize: 14 }}>
              This portal is restricted to authorized administrators only. All login attempts are monitored and logged.
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

          {/* Email Field */}
          <Box mb={3}>
            <Typography variant="body2" fontWeight="medium" sx={{ 
              color: '#374151', 
              mb: 1 
            }}>
              Admin Email Address
            </Typography>
            <MDInput
              type="email"
              placeholder="Enter your admin email"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
              fullWidth
              startAdornment={<Mail size={18} color="#9CA3AF" />}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#D1D5DB' },
                  '&:hover fieldset': { borderColor: '#007bff' },
                  '&.Mui-focused fieldset': { borderColor: '#007bff' }
                }
              }}
            />
          </Box>

          {/* Password Field */}
          <Box mb={4}>
            <Typography variant="body2" fontWeight="medium" sx={{ 
              color: '#374151', 
              mb: 1 
            }}>
              Admin Password
            </Typography>
            <MDInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your admin password"
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
                  '&:hover fieldset': { borderColor: '#007bff' },
                  '&.Mui-focused fieldset': { borderColor: '#007bff' }
                }
              }}
            />
          </Box>

          {/* Contact Support Link */}
          <Box mb={4} textAlign="right">
            <Typography variant="body2" sx={{ 
              color: '#007bff', 
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}>
              Need access? Contact IT Support
            </Typography>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              textTransform: 'none',
              background: 'linear-gradient(45deg, #DC2626, #991B1B)',
              '&:hover': {
                background: 'linear-gradient(45deg, #B91C1C, #7F1D1D)'
              },
              '&:disabled': {
                background: '#E5E7EB',
                color: '#9CA3AF'
              },
              mb: 3
            }}
          >
            {isLoading ? 'Verifying Access...' : 'Access Admin Portal'}
          </Button>

          {/* Back to Main Site Link */}
          <Box textAlign="center">
            <Typography variant="body2" sx={{ color: '#718096' }}>
              Not an administrator?{' '}
              <Link href="/login">
                <Typography component="span" sx={{ 
                  color: '#007bff', 
                  fontWeight: 'medium',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}>
                  Return to User Login
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}