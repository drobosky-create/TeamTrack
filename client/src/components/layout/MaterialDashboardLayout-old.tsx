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
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const drawer = (
    <Box>
      <Box sx={{ 
        p: 3, 
        background: 'var(--gradient-primary, linear-gradient(195deg, #42424a, #191919))',
        color: 'hsl(var(--primary-foreground))',
        textAlign: 'center'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          PerformanceHub
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
          Performance Management
        </Typography>
      </Box>
      
      <List sx={{ pt: 0 }}>
        {getNavigationItems(user?.id || '', user?.role || 'team_member').filter(item => 
          item.roles.includes(user?.role || 'team_member')
        ).map((item) => {
          const isActive = location === item.path;
          
          return (
            <Link key={item.text} href={item.path}>
              <ListItem 
                component="div"
                sx={{
                  mx: 2,
                  my: 0.5,
                  borderRadius: 2,
                  backgroundColor: isActive ? 'hsl(var(--primary) / 0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'hsl(var(--primary) / 0.1)',
                  },
                  cursor: 'pointer',
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
                }}
                data-testid={`nav-item-${item.text.toLowerCase().replace(' ', '-')}`}
              >
                <ListItemIcon sx={{ 
                  color: 'inherit',
                  minWidth: 40 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400
                  }}
                />
              </ListItem>
            </Link>
          );
        })}
        
        {/* Logout */}
        <ListItem 
          onClick={() => window.location.href = '/api/logout'}
          sx={{
            mx: 2,
            my: 0.5,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.8)',
            mt: 'auto'
          }}
          data-testid="nav-item-logout"
        >
          <ListItemIcon sx={{ 
            color: 'inherit',
            minWidth: 40 
          }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Sign Out"
            primaryTypographyProps={{
              fontSize: '0.875rem',
            }}
          />
        </ListItem>
      </List>
    </Box>
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