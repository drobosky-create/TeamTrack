import React from 'react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import AdminLogin from '@/components/admin-login';
import AdminDashboard from '@/pages/admin-dashboard';

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminAuth();

  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return <AdminLogin onLoginSuccess={login} />;
}