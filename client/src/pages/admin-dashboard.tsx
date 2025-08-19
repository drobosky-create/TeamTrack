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
  useTheme,
  Grid
} from '@mui/material';
import { useAdminAuth } from '@/hooks/use-admin-auth';

export default function AdminDashboard() {
  const { adminUser } = useAdminAuth();
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'manager' | 'team_member'>(
    (adminUser?.role as 'admin' | 'manager' | 'team_member') || 'admin'
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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Admin Control Panel
        </Typography>
        <Button 
          variant="outlined" 
          color="error"
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
            window.location.href = '/admin-login';
          }}
        >
          Admin Logout
        </Button>
      </Box>

      {adminUser && (
        <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
          Welcome back, {adminUser.email}. You have administrative access to all system features.
        </Typography>
      )}
      
      {/* Role Testing Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Admin Role Testing
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: theme.palette.text.secondary }}>
            As an admin, you can preview how the system appears to different user roles. This helps understand user experiences and manage permissions effectively.
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
            <strong>Current Role Preview:</strong> {selectedRole === 'team_member' ? 'USER' : selectedRole.toUpperCase()}
          </Typography>
        </CardContent>
      </Card>

      {/* Role Information */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
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
        </Grid>
        
        <Grid item xs={12} md={6}>
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
        </Grid>
      </Grid>

      {/* Admin Dashboard Features */}
      <Card sx={{ mt: 4, backgroundColor: theme.palette.info.main + '10' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Admin Dashboard Features
          </Typography>
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
        </CardContent>
      </Card>
    </Box>
  );
}