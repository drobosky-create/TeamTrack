import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Drawer, Typography, IconButton, useTheme } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedSidebar, getNavigationItemsByRole } from './UnifiedSidebar';

interface MaterialDashboardLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

export const MaterialDashboardLayout: React.FC<MaterialDashboardLayoutProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Get navigation items based on user role
  const navigationItems = getNavigationItemsByRole(user?.role || 'team_member', user?.id);

  const drawer = (
    <UnifiedSidebar
      title="PerformanceHub"
      subtitle="Performance Management"
      navigationItems={navigationItems}
      userRole={user?.role}
    />
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'var(--gradient-primary, linear-gradient(195deg, #66bb6a, #43a047))',
            border: 'none',
            color: 'hsl(var(--primary-foreground))',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            background: 'var(--gradient-primary, linear-gradient(195deg, #66bb6a, #43a047))',
            color: 'hsl(var(--primary-foreground))',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'hsl(var(--background))',
          minHeight: '100vh',
        }}
      >
        {/* Top Navigation */}
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: 'transparent',
            boxShadow: 'var(--shadow, none)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid hsl(var(--border))',
            background: 'linear-gradient(135deg, transparent, rgba(var(--primary-light), 0.1))',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'hsl(var(--foreground))' }}>
              Welcome back, {user?.firstName || user?.email?.split('@')[0]}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ p: 4, ml: 2 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};