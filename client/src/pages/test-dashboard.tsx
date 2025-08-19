import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  useTheme
} from '@mui/material';
import { MaterialDashboardLayout } from '@/components/layout/MaterialDashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useAdminAuth } from '@/hooks/use-admin-auth';

export default function TestDashboard() {
  const { user } = useAuth();
  const { adminUser } = useAdminAuth();
  
  // Use admin user if available, fallback to regular user
  const currentUser = adminUser || user;
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'manager' | 'team_member'>(
    (currentUser?.role as 'admin' | 'manager' | 'team_member') || 'team_member'
  );
  
  // Mock switching between roles for testing
  const handleRoleChange = (event: React.MouseEvent<HTMLElement>, newRole: string | null) => {
    if (newRole !== null) {
      setSelectedRole(newRole as 'admin' | 'manager' | 'team_member');
      // In a real app, this would require re-authentication
      // For testing, we're just changing the display
    }
  };

  const roleDescriptions = {
    admin: {
      title: 'Admin Dashboard',
      description: 'Full system control with audit logs and export center',
      color: theme.palette.error.main,
      features: [
        'Client Records Management',
        'User & Role Management',
        'Audit Logs & Activity Tracking',
        'Assessment Management',
        'Advanced Analytics',
        'Export Center (Lead/Assessment)',
        'NAICS Management',
        'Integrations (Stripe, SendGrid, GHL)'
      ]
    },
    manager: {
      title: 'Manager Dashboard',
      description: 'Deal pipeline, team oversight, and approval workflows',
      color: theme.palette.warning.main,
      features: [
        'Deal Pipeline',
        'Client Management',
        'Assessments in Progress',
        'Team Analytics',
        'Approval Queue',
        'Export Tools',
        'Notifications'
      ]
    },
    team_member: {
      title: 'User Dashboard',
      description: 'Consumer assessments with collaboration features',
      color: theme.palette.success.main,
      features: [
        'My Dashboard',
        'My Assessments',
        'Client View (Limited)',
        'Free & Growth Assessments',
        'Tasks & Feedback',
        'Notifications',
        'Profile Management'
      ]
    }
  };

  const currentRoleInfo = roleDescriptions[selectedRole as keyof typeof roleDescriptions];

  return (
    <MaterialDashboardLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          {adminUser ? 'Admin Control Panel' : 'Unified Sidebar Testing Dashboard'}
        </Typography>
        
        {adminUser && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              Welcome back, {adminUser.email}. You have administrative access to all system features.
            </Typography>
            <Button 
              variant="outlined" 
              color="error"
              onClick={async () => {
                await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
                window.location.href = '/admin-login';
              }}
              sx={{ ml: 2 }}
            >
              Admin Logout
            </Button>
          </Box>
        )}
        
        {/* Role Selector */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {adminUser ? 'Admin Role Testing' : 'Test Different User Roles'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
              {adminUser 
                ? 'As an admin, you can preview how the system appears to different user roles. This helps understand user experiences and manage permissions effectively.'
                : 'Switch between roles to see how the sidebar adapts. The sidebar style remains consistent, only the menu items change.'
              }
            </Typography>
            <ToggleButtonGroup
              value={selectedRole}
              exclusive
              onChange={handleRoleChange}
              aria-label="user role"
              sx={{ mb: 2 }}
            >
              <ToggleButton value="admin" aria-label="admin role">
                Admin
              </ToggleButton>
              <ToggleButton value="manager" aria-label="manager role">
                Manager
              </ToggleButton>
              <ToggleButton value="team_member" aria-label="user role">
                User
              </ToggleButton>
            </ToggleButtonGroup>
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Current Role:</strong> {selectedRole === 'team_member' ? 'USER' : selectedRole.toUpperCase()}
            </Typography>
          </CardContent>
        </Card>

        {/* Role Information */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <Paper 
              sx={{ 
                p: 3, 
                borderLeft: `4px solid ${currentRoleInfo.color}`,
                height: '100%'
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, color: currentRoleInfo.color }}>
                {currentRoleInfo.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {currentRoleInfo.description}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Available Features:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {currentRoleInfo.features.map((feature, index) => (
                  <Typography component="li" variant="body2" key={index} sx={{ mb: 1 }}>
                    {feature}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Box>
          
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Sidebar Consistency
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  ✓ Unified Design
                </Typography>
                <Typography variant="body2" sx={{ pl: 2, color: theme.palette.text.secondary }}>
                  Same Material-UI gradient style across all dashboards
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  ✓ Single Source of Truth
                </Typography>
                <Typography variant="body2" sx={{ pl: 2, color: theme.palette.text.secondary }}>
                  UnifiedSidebar component manages all sidebar instances
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  ✓ Role-Based Navigation
                </Typography>
                <Typography variant="body2" sx={{ pl: 2, color: theme.palette.text.secondary }}>
                  Menu items dynamically adjust based on user role
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  ✓ Token-Based Theming
                </Typography>
                <Typography variant="body2" sx={{ pl: 2, color: theme.palette.text.secondary }}>
                  All colors and gradients reference universal design tokens
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Instructions */}
        <Card sx={{ mt: 4, backgroundColor: theme.palette.info.main + '10' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {adminUser ? 'Admin Dashboard Features' : 'How to Test'}
            </Typography>
            {adminUser ? (
              <>
                <Typography variant="body2" paragraph>
                  1. Use the role toggle above to preview user experiences across different permission levels
                </Typography>
                <Typography variant="body2" paragraph>
                  2. Navigate using the sidebar to access admin-specific features like client management and analytics
                </Typography>
                <Typography variant="body2" paragraph>
                  3. All admin actions are logged and can be reviewed through the audit logs system
                </Typography>
                <Typography variant="body2">
                  4. Access the Theme Manager and Branding tools to customize the platform appearance
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" paragraph>
                  1. Click on the role toggle buttons above to simulate different user roles
                </Typography>
                <Typography variant="body2" paragraph>
                  2. Observe how the sidebar menu items change based on the selected role
                </Typography>
                <Typography variant="body2" paragraph>
                  3. Notice that the sidebar styling (gradient, colors, layout) remains consistent
                </Typography>
                <Typography variant="body2">
                  4. Click on sidebar menu items to navigate between different pages
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </MaterialDashboardLayout>
  );
}