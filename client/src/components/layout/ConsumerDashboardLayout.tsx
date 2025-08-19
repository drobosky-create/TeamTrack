import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Divider,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Assessment,
  TrendingUp,
  History,
  Dashboard,
  Person,
  ExitToApp,
  Business
} from '@mui/icons-material';

interface ConsumerDashboardLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

export const ConsumerDashboardLayout: React.FC<ConsumerDashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('consumerUser') || '{}');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('consumerUser');
    setLocation('/applebites');
  };

  const navigationItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/consumer-dashboard',
      active: true
    },
    {
      text: 'Free Assessment',
      icon: <Assessment />,
      path: '/assessments/free',
      active: true
    },
    {
      text: 'Growth Assessment',
      icon: <TrendingUp />,
      path: '/assessments/growth',
      active: false,
      disabled: true
    },
    {
      text: 'Assessment History',
      icon: <History />,
      path: '/assessment-history',
      active: false
    }
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand Section */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Business sx={{ fontSize: 40, color: 'white', mb: 1 }} />
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
          AppleBites
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          Business Valuation
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 2, py: 1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => item.active && !item.disabled && setLocation(item.path)}
              disabled={item.disabled}
              sx={{
                borderRadius: 2,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
                '&.Mui-disabled': {
                  color: 'rgba(255,255,255,0.4)',
                },
                py: 1.5,
                px: 2
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: item.path === window.location.pathname ? 600 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

      {/* User Info Section */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
            <Person />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
              {userData.firstName} {userData.lastName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {userData.companyName}
            </Typography>
          </Box>
        </Box>
        
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ExitToApp />}
          onClick={handleLogout}
          sx={{
            borderColor: 'rgba(255,255,255,0.3)',
            color: 'white',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.5)',
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          Sign Out
        </Button>
      </Box>
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
            color: 'white',
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
            color: 'white',
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
            <Typography 
              variant="h6" 
              noWrap 
              component="div"
              sx={{ 
                color: 'hsl(var(--foreground))',
                fontWeight: 600
              }}
            >
              Business Valuation Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};