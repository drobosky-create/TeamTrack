import React from 'react';
import { Box, AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, IconButton } from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  People as PeopleIcon, 
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  TrackChanges as TargetIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  CreditCard as CreditCardIcon,
  Star as StarIcon,
  Palette as PaletteIcon,
  BarChart as ReportsIcon,
  Folder as DocumentsIcon,
  CardMembership as ReportCardIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

interface MaterialDashboardLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

const getNavigationItems = (userId: string) => [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Team Directory',
    icon: <PeopleIcon />,
    path: '/team',
    roles: ['admin', 'manager']
  },
  {
    text: 'Reviews',
    icon: <AssignmentIcon />,
    path: '/reviews',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Goals',
    icon: <TargetIcon />,
    path: '/goals',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Reports',
    icon: <ReportsIcon />,
    path: '/reports',
    roles: ['admin', 'manager']
  },
  {
    text: 'Advanced Analytics',
    icon: <AssessmentIcon />,
    path: '/analytics',
    roles: ['admin', 'manager']
  },
  {
    text: 'Documents',
    icon: <DocumentsIcon />,
    path: '/documents',
    roles: ['admin', 'manager']
  },
  {
    text: 'My Report Card',
    icon: <ReportCardIcon />,
    path: `/report-card/${userId}`,
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Templates',
    icon: <AssessmentIcon />,
    path: '/templates',
    roles: ['admin']
  },
  {
    text: 'Branding',
    icon: <PaletteIcon />,
    path: '/branding',
    roles: ['admin']
  },
  {
    text: 'Profile',
    icon: <PersonIcon />,
    path: '/profile',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Notifications',
    icon: <NotificationsIcon />,
    path: '/notifications',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Help',
    icon: <HelpIcon />,
    path: '/help',
    roles: ['admin', 'manager', 'team_member']
  },
  {
    text: 'Billing',
    icon: <CreditCardIcon />,
    path: '/billing',
    roles: ['admin']
  },
  {
    text: 'Setup Wizard',
    icon: <StarIcon />,
    path: '/setup',
    roles: ['admin']
  },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
    roles: ['admin']
  }
];

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
        background: 'linear-gradient(195deg, #42424a, #191919)',
        color: 'white',
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
        {getNavigationItems(user?.id || '').filter(item => 
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
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
            background: 'linear-gradient(195deg, #66bb6a, #43a047)',
            border: 'none',
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
            background: 'linear-gradient(195deg, #66bb6a, #43a047)',
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
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
        }}
      >
        {/* Top Navigation */}
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
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
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#344767' }}>
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