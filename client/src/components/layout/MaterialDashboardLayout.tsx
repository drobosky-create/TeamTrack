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
  Help as HelpIcon,
  BusinessCenter as BusinessCenterIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

interface MaterialDashboardLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

const getNavigationItems = (userId: string, userRole: string) => {
  // Consumer/Client Navigation (mapped to team_member for assessment access)
  const consumerItems = [
    {
      text: 'Assessment Dashboard',
      icon: <DashboardIcon />,
      path: '/',
      roles: ['team_member']
    },
    {
      text: 'Free Assessment',
      icon: <BusinessCenterIcon />,
      path: '/free-assessment',
      roles: ['team_member']
    },
    {
      text: 'Growth Assessment',
      icon: <CalculateIcon />,
      path: '/growth-assessment',
      roles: ['team_member']
    },
    {
      text: 'My Results',
      icon: <ReportCardIcon />,
      path: `/results/${userId}`,
      roles: ['team_member']
    },
    {
      text: 'Follow-Up Options',
      icon: <NotificationsIcon />,
      path: '/follow-up',
      roles: ['team_member']
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/profile',
      roles: ['team_member']
    },
    {
      text: 'Help',
      icon: <HelpIcon />,
      path: '/help',
      roles: ['team_member']
    }
  ];

  // Team Member/Analyst Navigation (mapped to manager role)
  const teamMemberItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
      roles: ['manager']
    },
    {
      text: 'Client Management',
      icon: <PeopleIcon />,
      path: '/clients',
      roles: ['manager']
    },
    {
      text: 'Assessments',
      icon: <AssessmentIcon />,
      path: '/assessments',
      roles: ['manager']
    },
    {
      text: 'Tasks & Workflow',
      icon: <AssignmentIcon />,
      path: '/tasks',
      roles: ['manager']
    },
    {
      text: 'My Analytics',
      icon: <ReportsIcon />,
      path: '/my-analytics',
      roles: ['manager']
    },
    {
      text: 'Free Assessment',
      icon: <BusinessCenterIcon />,
      path: '/free-assessment',
      roles: ['manager']
    },
    {
      text: 'Growth Assessment',
      icon: <CalculateIcon />,
      path: '/growth-assessment',
      roles: ['manager']
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/profile',
      roles: ['manager']
    },
    {
      text: 'Notifications',
      icon: <NotificationsIcon />,
      path: '/notifications',
      roles: ['manager']
    },
    {
      text: 'Help',
      icon: <HelpIcon />,
      path: '/help',
      roles: ['manager']
    }
  ];

  // Admin/Leadership Navigation
  const adminItems = [
    {
      text: 'Admin Dashboard',
      icon: <DashboardIcon />,
      path: '/',
      roles: ['admin']
    },
    {
      text: 'Client Records',
      icon: <PeopleIcon />,
      path: '/admin/clients',
      roles: ['admin']
    },
    {
      text: 'User & Role Management',
      icon: <SettingsIcon />,
      path: '/admin/users',
      roles: ['admin']
    },
    {
      text: 'Assessment Management',
      icon: <AssessmentIcon />,
      path: '/admin/assessments',
      roles: ['admin']
    },
    {
      text: 'Advanced Analytics',
      icon: <ReportsIcon />,
      path: '/admin/analytics',
      roles: ['admin']
    },
    {
      text: 'Content & Data Control',
      icon: <DocumentsIcon />,
      path: '/admin/content',
      roles: ['admin']
    },
    {
      text: 'NAICS Management',
      icon: <BusinessCenterIcon />,
      path: '/admin/naics',
      roles: ['admin']
    },
    {
      text: 'Billing & Integrations',
      icon: <CreditCardIcon />,
      path: '/admin/billing',
      roles: ['admin']
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
      text: 'Free Assessment',
      icon: <BusinessCenterIcon />,
      path: '/free-assessment',
      roles: ['admin']
    },
    {
      text: 'Growth Assessment',
      icon: <CalculateIcon />,
      path: '/growth-assessment',
      roles: ['admin']
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/profile',
      roles: ['admin']
    },
    {
      text: 'Help',
      icon: <HelpIcon />,
      path: '/help',
      roles: ['admin']
    }
  ];

  // Return appropriate navigation based on role
  if (userRole === 'admin') return adminItems;
  if (userRole === 'manager') return teamMemberItems;
  return consumerItems; // Default to consumer for team_member
};

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