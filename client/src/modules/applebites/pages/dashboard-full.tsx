import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '../../../hooks/useAuth';
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import MDButton from '../../../components/MD/MDButton';
import MDAvatar from '../../../components/MD/MDAvatar';
import MobileDashboard from '../../../components/MobileDashboard';
import { 
  User, 
  FileText, 
  Crown, 
  Clock, 
  BarChart3, 
  Plus,
  ExternalLink,
  Eye,
  Calendar,
  LogOut,
  Check,
  Lock,
  Star,
  TrendingUp
} from 'lucide-react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

interface DashboardUser {
  id?: string;
  email: string;
  tier: 'free' | 'growth' | 'capital';
  firstName?: string;
  lastName?: string;
  name?: string; // For backwards compatibility with mock data
  authProvider?: string;
}

// Mock user data - replace with actual auth data
const mockUser: DashboardUser = {
  name: 'Demo User',
  email: 'demo@applebites.ai',
  tier: 'free',
  firstName: 'Demo',
  lastName: 'User'
};

// Responsive Dashboard with Mobile/Desktop Views
export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  // Temporarily disable mobile detection to test dashboard
  const isMobile = false;
  
  // Debug logging
  console.log('Dashboard - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Please log in to access dashboard</div>
      </div>
    );
  }
  
  // Use actual user data or fallback to mock for testing
  const displayUser = (user as DashboardUser) || mockUser;

  const handleSignOut = async () => {
    try {
      await fetch('/api/logout', { credentials: 'include' });
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
      queryClient.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      queryClient.clear();
      window.location.href = '/';
    }
  };

  // Return mobile version for small screens
  if (isMobile) {
    console.log('Rendering MobileDashboard component');
    return <MobileDashboard user={displayUser} onSignOut={handleSignOut} />;
  }
  
  console.log('Rendering Desktop dashboard');

  // Desktop version with clean layout (no problematic sidebar)
  const colors = {
    primary: "#00718d",
    secondary: "#0A1F44", 
    accent: "#005b8c",
    grayLight: "#F7FAFC"
  };

  const gradients = {
    primary: "linear-gradient(135deg, #00718d 0%, #0A1F44 100%)",
    glow: "linear-gradient(135deg, #00718d 0%, #3B82F6 100%)"
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'free': return 'Free';
      case 'growth': return 'Growth';
      case 'capital': return 'Capital';
      default: return 'Free';
    }
  };

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'free': return 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)';
      case 'growth': return gradients.primary;
      case 'capital': return gradients.glow;
      default: return 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)';
    }
  };

  // Desktop Layout with Sidebar
  return (
    <MDBox sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <MDBox
        sx={{
          width: 280,
          background: 'linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto'
        }}
      >
        {/* Logo Section */}
        <MDBox sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img
            src="/assets/logos/apple-bites-meritage-logo.png"
            alt="Apple Bites Business Assessment"
            style={{
              width: '80%',
              maxWidth: 200,
              height: 'auto',
              marginBottom: 16
            }}
          />
          <MDTypography variant="h6" sx={{ color: '#81e5d8', fontWeight: 300 }}>
            Business Valuation Platform
          </MDTypography>
        </MDBox>

        {/* User Info */}
        <MDBox sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <MDBox display="flex" alignItems="center" mb={2}>
            <MDAvatar
              sx={{
                background: gradients.glow,
                width: 48,
                height: 48,
                mr: 2
              }}
            >
              <User size={20} color="white" />
            </MDAvatar>
            <MDBox>
              <MDTypography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                {displayUser.firstName || displayUser.name?.split(' ')[0] || 'User'}
              </MDTypography>
              <MDTypography variant="caption" sx={{ color: '#81e5d8' }}>
                {getTierLabel(displayUser.tier)} Plan
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Navigation */}
        <MDBox sx={{ flex: 1, p: 2 }}>
          <MDBox display="flex" flexDirection="column" gap={1}>
            <Link href="/assessment/free">
              <MDButton
                sx={{
                  background: gradients.glow,
                  color: 'white',
                  width: '100%',
                  py: 1.5,
                  justifyContent: 'flex-start'
                }}
                startIcon={<FileText size={18} />}
              >
                Free Assessment
              </MDButton>
            </Link>
            
            <Link href="/assessment/paid">
              <MDButton
                sx={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#dbdce1',
                  width: '100%',
                  py: 1.5,
                  justifyContent: 'flex-start',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
                startIcon={<Crown size={18} />}
              >
                Growth Assessment
              </MDButton>
            </Link>
            
            <MDButton
              sx={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#dbdce1',
                width: '100%',
                py: 1.5,
                justifyContent: 'flex-start',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)'
                }
              }}
              startIcon={<BarChart3 size={18} />}
            >
              Past Assessments
            </MDButton>
            
            <MDButton
              sx={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#dbdce1',
                width: '100%',
                py: 1.5,
                justifyContent: 'flex-start',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)'
                }
              }}
              startIcon={<Calendar size={18} />}
            >
              Schedule Consultation
            </MDButton>
          </MDBox>
        </MDBox>

        {/* Sign Out */}
        <MDBox sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <MDButton
            onClick={handleSignOut}
            sx={{
              background: 'transparent',
              border: '1px solid #EF4444',
              color: '#EF4444',
              width: '100%',
              py: 1.5
            }}
            startIcon={<LogOut size={18} />}
          >
            Sign Out
          </MDButton>
        </MDBox>
      </MDBox>

      {/* Main Content */}
      <MDBox sx={{ flexGrow: 1, marginLeft: '280px', p: 3 }}>
        {/* Welcome Header */}
        <MDBox mb={4}>
          <MDTypography variant="h3" fontWeight="medium" color="text" mb={1}>
            Welcome back, {displayUser.firstName || displayUser.name?.split(' ')[0] || 'User'}!
          </MDTypography>
          <MDTypography variant="body1" color="text">
            Ready to unlock your business potential? Start with a comprehensive valuation assessment.
          </MDTypography>
        </MDBox>

        {/* Quick Stats Cards */}
        <MDBox display="flex" gap={3} mb={4}>
          <Card sx={{ flex: 1, p: 3, background: gradients.glow, color: 'white' }}>
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h4" fontWeight="bold" color="white">
                  {getTierLabel(displayUser.tier)}
                </MDTypography>
                <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Current Plan
                </MDTypography>
              </MDBox>
              <Crown size={32} color="white" />
            </MDBox>
          </Card>
          
          <Card sx={{ flex: 1, p: 3 }}>
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h4" fontWeight="bold" color="text">
                  0
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Completed Assessments
                </MDTypography>
              </MDBox>
              <FileText size={32} color={colors.primary} />
            </MDBox>
          </Card>
          
          <Card sx={{ flex: 1, p: 3 }}>
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h4" fontWeight="bold" color="text">
                  $0
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Estimated Value
                </MDTypography>
              </MDBox>
              <TrendingUp size={32} color={colors.accent} />
            </MDBox>
          </Card>
        </MDBox>

        {/* Action Cards */}
        <MDBox display="flex" gap={3}>
          <Card sx={{ flex: 2, p: 4 }}>
            <MDTypography variant="h5" fontWeight="medium" color="text" mb={2}>
              Get Started with Your Valuation
            </MDTypography>
            <MDTypography variant="body1" color="text" mb={3}>
              Our comprehensive assessment analyzes your business across key value drivers to provide accurate valuation estimates and improvement recommendations.
            </MDTypography>
            <MDBox display="flex" gap={2}>
              <Link href="/assessment/free">
                <MDButton
                  sx={{
                    background: gradients.primary,
                    color: 'white',
                    py: 1.5,
                    px: 3
                  }}
                  startIcon={<FileText size={18} />}
                >
                  Start Free Assessment
                </MDButton>
              </Link>
              <Link href="/assessment/paid">
                <MDButton
                  sx={{
                    background: 'transparent',
                    border: `1px solid ${colors.primary}`,
                    color: colors.primary,
                    py: 1.5,
                    px: 3
                  }}
                  startIcon={<Crown size={18} />}
                >
                  Upgrade to Growth
                </MDButton>
              </Link>
            </MDBox>
          </Card>
          
          <Card sx={{ flex: 1, p: 4, textAlign: 'center' }}>
            <Clock size={48} color={colors.accent} style={{ marginBottom: 16 }} />
            <MDTypography variant="h6" fontWeight="medium" color="text" mb={2}>
              Quick Assessment
            </MDTypography>
            <MDTypography variant="body2" color="text" mb={3}>
              Complete in 10-15 minutes
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: colors.accent }}>
              Perfect for getting started
            </MDTypography>
          </Card>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}