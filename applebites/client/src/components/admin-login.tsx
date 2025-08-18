import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDInput from '@/components/MD/MDInput';
import MDButton from '@/components/MD/MDButton';

import { Card } from '@mui/material';
import { Lock, User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginData = z.infer<typeof loginSchema>;

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      return response.json();
    },
    onSuccess: () => {
      setError('');
      onLoginSuccess();
    },
    onError: (error: Error) => {
      setError(error.message || 'Invalid credentials');
    },
  });

  const onSubmit = (data: LoginData) => {
    setError('');
    loginMutation.mutate(data);
  };

  return (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 4 }}>
        <MDBox textAlign="center" mb={3}>
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={60}
            height={60}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              mx: 'auto',
              mb: 2,
              borderRadius: '50%',
            }}
          >
            <Lock size={24} />
          </MDBox>
          <MDTypography variant="h4" fontWeight="bold" color="dark">
            Admin Login
          </MDTypography>
          <MDTypography variant="body2" color="text" mt={1}>
            Access leads and analytics dashboard
          </MDTypography>
        </MDBox>

        <MDBox component="form" onSubmit={handleSubmit(onSubmit)}>
          <MDBox mb={2}>
            <MDTypography variant="button" fontWeight="bold" color="dark" mb={1}>
              Username
            </MDTypography>
            <MDBox position="relative">
              <MDBox
                position="absolute"
                left={12}
                top="50%"
                sx={{ transform: 'translateY(-50%)', color: 'text.secondary', zIndex: 1 }}
              >
                <User size={18} />
              </MDBox>
              <MDInput
                {...register('username')}
                type="text"
                placeholder="Enter your username"
                fullWidth
                disabled={loginMutation.isPending}
                sx={{ pl: 5 }}
                error={!!errors.username}
              />
            </MDBox>
            {errors.username && (
              <MDTypography variant="caption" color="error" mt={0.5}>
                {errors.username.message}
              </MDTypography>
            )}
          </MDBox>

          <MDBox mb={3}>
            <MDTypography variant="button" fontWeight="bold" color="dark" mb={1}>
              Password
            </MDTypography>
            <MDBox position="relative">
              <MDBox
                position="absolute"
                left={12}
                top="50%"
                sx={{ transform: 'translateY(-50%)', color: 'text.secondary', zIndex: 1 }}
              >
                <Lock size={18} />
              </MDBox>
              <MDInput
                {...register('password')}
                type="password"
                placeholder="Enter your password"
                fullWidth
                disabled={loginMutation.isPending}
                sx={{ pl: 5 }}
                error={!!errors.password}
              />
            </MDBox>
            {errors.password && (
              <MDTypography variant="caption" color="error" mt={0.5}>
                {errors.password.message}
              </MDTypography>
            )}
          </MDBox>

          {error && (
            <MDBox mb={2} p={2} sx={{ 
              backgroundColor: 'error.light', 
              borderRadius: 1, 
              border: '1px solid',
              borderColor: 'error.main'
            }}>
              <MDTypography variant="body2" color="error">
                {error}
              </MDTypography>
            </MDBox>
          )}

          <MDButton
            type="submit"
            variant="gradient"
            color="info"
            fullWidth
            size="large"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </MDButton>
        </MDBox>

        <MDBox textAlign="center" mt={3}>
          <MDTypography variant="caption" color="text">
            Contact your administrator if you need access credentials
          </MDTypography>
        </MDBox>
      </Card>
    </MDBox>
  );
}