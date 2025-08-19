import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Drawer, Typography, IconButton, useTheme } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar for mobile */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[1],
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {user?.role === 'admin' ? 'Admin Dashboard' : 
             user?.role === 'manager' ? 'Team Dashboard' : 
             'Assessment Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: theme.palette.background.default,
            },
          }}
        >
          <UnifiedSidebar
            title="PerformanceHub"
            subtitle="Performance Management"
            navigationItems={navigationItems}
            userRole={user?.role}
          />
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: theme.palette.background.default,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          <UnifiedSidebar
            title="PerformanceHub"
            subtitle="Performance Management"
            navigationItems={navigationItems}
            userRole={user?.role}
          />
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />
        {children}
      </Box>
    </Box>
  );
};