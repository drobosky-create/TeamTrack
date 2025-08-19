import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  useTheme 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  People as PeopleIcon, 
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  CreditCard as CreditCardIcon,
  Palette as PaletteIcon,
  BarChart as ReportsIcon,
  Folder as DocumentsIcon,
  CardMembership as ReportCardIcon,
  Help as HelpIcon,
  BusinessCenter as BusinessCenterIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'wouter';

export interface NavigationItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
}

interface UnifiedSidebarProps {
  title?: string;
  subtitle?: string;
  navigationItems: NavigationItem[];
  userRole?: string;
  onLogout?: () => void;
}

export const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({ 
  title = 'PerformanceHub',
  subtitle = 'Performance Management',
  navigationItems,
  userRole = 'team_member',
  onLogout = () => window.location.href = '/api/logout'
}) => {
  const [location] = useLocation();
  const theme = useTheme();
  
  // Filter items based on user role if roles are specified
  const filteredItems = navigationItems.filter(item => 
    !item.roles || item.roles.length === 0 || item.roles.includes(userRole)
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with gradient */}
      <Box sx={(theme: any) => ({ 
        p: 3, 
        background: theme.gradients?.primary?.main || theme.tokens?.gradient?.brandBlue || 'linear-gradient(195deg, #42424a, #191919)',
        color: 'white',
        textAlign: 'center'
      })}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
          {subtitle}
        </Typography>
      </Box>
      
      {/* Navigation Items */}
      <List sx={{ pt: 0, flex: 1, overflowY: 'auto' }}>
        {filteredItems.map((item) => {
          const isActive = location === item.path;
          
          return (
            <Link key={item.text} href={item.path}>
              <ListItem 
                component="div"
                sx={{
                  mx: 2,
                  my: 0.5,
                  borderRadius: 2,
                  backgroundColor: isActive 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  cursor: 'pointer',
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                }}
                data-testid={`nav-item-${item.text.toLowerCase().replace(/\s+/g, '-')}`}
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
      </List>
      
      {/* Logout Button */}
      <Box sx={{ mt: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <ListItem 
          onClick={onLogout}
          sx={{
            mx: 2,
            my: 2,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.8)',
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
            primary="Logout"
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: 400
            }}
          />
        </ListItem>
      </Box>
    </Box>
  );
};

// Export commonly used navigation configurations
export const navigationConfigs = {
  // Consumer/Client Navigation (team_member role)
  consumer: [
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
      path: '/results',
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
  ],

  // Team Member/Analyst Navigation (manager role)
  teamMember: [
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
  ],

  // Admin/Leadership Navigation
  admin: [
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
  ]
};

// Helper function to get navigation items based on user role
export const getNavigationItemsByRole = (userRole: string, userId?: string): NavigationItem[] => {
  switch (userRole) {
    case 'admin':
      return navigationConfigs.admin;
    case 'manager':
      return navigationConfigs.teamMember;
    case 'team_member':
    default:
      // For team_member, update the results path with the user ID
      return navigationConfigs.consumer.map(item => 
        item.text === 'My Results' && userId 
          ? { ...item, path: `/results/${userId}` }
          : item
      );
  }
};