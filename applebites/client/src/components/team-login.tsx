import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, Mail, Lock } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { loginSchema, type LoginCredentials } from '@shared/schema';

// Material Dashboard Components
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import MDInput from '@/components/MD/MDInput';
import { Card, CardContent, Box, TextField, Alert, Button } from '@mui/material';

interface TeamLoginProps {
  onLoginSuccess: (user: any) => void;
}

export default function TeamLogin({ onLoginSuccess }: TeamLoginProps) {
  const [error, setError] = useState('');

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginCredentials) => {
      const response = await fetch('/api/team/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid credentials');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setError('');
      onLoginSuccess(data.user);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data);
  };

  return (
    <MDBox
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <CardContent sx={{ p: 4 }}>
          <MDBox textAlign="center" mb={3}>
            <Users size={48} color="#0A1F44" />
            <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#344767', mt: 2, mb: 1 }}>
              Admin Login
            </MDTypography>
            <MDTypography variant="body2" sx={{ color: '#67748e' }}>
              Sign in to access the team dashboard
            </MDTypography>
          </MDBox>

          <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
            <MDBox mb={3}>
              <MDTypography variant="body2" fontWeight="medium" sx={{ color: '#344767', mb: 1 }}>
                Email
              </MDTypography>
              <TextField
                fullWidth
                type="email"
                placeholder="Enter your email"
                {...form.register('email')}
                error={!!form.formState.errors.email}
                helperText={form.formState.errors.email?.message}
                InputProps={{
                  startAdornment: <Mail size={20} color="#67748e" style={{ marginRight: 8 }} />
                }}
              />
            </MDBox>

            <MDBox mb={3}>
              <MDTypography variant="body2" fontWeight="medium" sx={{ color: '#344767', mb: 1 }}>
                Password
              </MDTypography>
              <TextField
                fullWidth
                type="password"
                placeholder="Enter your password"
                {...form.register('password')}
                error={!!form.formState.errors.password}
                helperText={form.formState.errors.password?.message}
                InputProps={{
                  startAdornment: <Lock size={20} color="#67748e" style={{ marginRight: 8 }} />
                }}
              />
            </MDBox>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <MDButton
              variant="contained"
              color="info"
              fullWidth
              type="submit"
              disabled={loginMutation.isPending}
              sx={{ mb: 2 }}
            >
              {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
            </MDButton>
          </Box>
        </CardContent>
      </Card>
    </MDBox>
  );
}